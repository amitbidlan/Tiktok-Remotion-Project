/**
 * fetch-videos.js
 * Downloads Pexels background videos for each slide into public/videos/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error('ERROR: PEXELS_API_KEY environment variable not set');
  process.exit(1);
}

const lesson = JSON.parse(fs.readFileSync(path.join(__dirname, '../content/lesson.json'), 'utf8'));

const VIDEOS_DIR = path.join(__dirname, '../public/videos');
fs.mkdirSync(VIDEOS_DIR, { recursive: true });

const SLIDE_QUERIES = {
  slide1_hook:      'japan city street night',
  slide2_scene:     lesson.meta.pexels_query_slide2 || 'apartment interior japan',
  slide3_challenge: 'person thinking serious closeup',
  slide4_dialogue:  'phone call office complaint',
  slide5_vocab:     'japanese writing study notebook',
};

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(httpsGet(res.headers.location, headers));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data, headers: res.headers }));
    });
    req.on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = (u) => {
      https.get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return request(res.headers.location);
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
        file.on('error', reject);
      }).on('error', reject);
    };
    request(url);
  });
}

async function fetchBestVideo(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://api.pexels.com/videos/search?query=${encoded}&per_page=10&orientation=portrait&size=medium`;
  const res = await httpsGet(url, { Authorization: API_KEY });
  
  if (res.statusCode !== 200) {
    throw new Error(`Pexels API error ${res.statusCode}: ${res.body}`);
  }
  
  const data = JSON.parse(res.body);
  const videos = data.videos || [];
  
  for (const v of videos) {
    const files = v.video_files
      .filter(f => f.file_type === 'video/mp4')
      .sort((a, b) => a.width - b.width);
    const best = files.find(f => f.width >= 360 && f.width <= 720);
    if (best) {
      return { url: best.link, id: v.id, width: best.width, height: best.height };
    }
  }
  throw new Error(`No suitable video found for query: ${query}`);
}

async function main() {
  console.log('Fetching Pexels videos...\n');
  
  for (const [slideKey, query] of Object.entries(SLIDE_QUERIES)) {
    const destPath = path.join(VIDEOS_DIR, `${slideKey}.mp4`);
    
    if (fs.existsSync(destPath)) {
      console.log(`✓ ${slideKey} already exists, skipping`);
      continue;
    }
    
    console.log(`Searching: "${query}" → ${slideKey}`);
    try {
      const video = await fetchBestVideo(query);
      console.log(`  Found video ID ${video.id} (${video.width}x${video.height})`);
      console.log(`  Downloading...`);
      await downloadFile(video.url, destPath);
      const size = (fs.statSync(destPath).size / 1024 / 1024).toFixed(1);
      console.log(`  ✓ Saved ${destPath} (${size}MB)\n`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}\n`);
      // Create empty placeholder so Remotion doesn't crash
      fs.writeFileSync(destPath + '.error', err.message);
    }
    
    // Rate limit: 1 request per second
    await new Promise(r => setTimeout(r, 1100));
  }
  
  console.log('Done fetching videos.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
