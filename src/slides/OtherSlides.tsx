import React from 'react';
import { AbsoluteFill, Video, useCurrentFrame } from 'remotion';
import { COLORS, VIDEO_WIDTH, VIDEO_HEIGHT, slideUpFade, wordPopIn, SlideBadge, Divider } from './shared';

// ── SCENE SLIDE ────────────────────────────────────────────────────
export const SceneSlide: React.FC<{ lesson: any }> = ({ lesson }) => {
  const frame = useCurrentFrame();
  const scene = lesson.slides.scene;
  
  return (
    <AbsoluteFill style={{ background: COLORS.creamDark }}>
      <div style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT * 0.4, overflow: 'hidden', background: '#111', position: 'relative' }}>
        <Video src="./public/videos/slide2_scene.mp4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop startFrom={0} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(237,224,207,0.8) 100%)' }} />
        <SlideBadge text="The Situation" />
      </div>

      <div style={{ position: 'absolute', top: VIDEO_HEIGHT * 0.4, width: VIDEO_WIDTH, padding: '50px 80px' }}>
        <div style={{ ...slideUpFade(frame, 0, 18), fontSize: 64, textAlign: 'center', marginBottom: 20 }}>
          {scene.icon}
        </div>
        <div style={{ ...slideUpFade(frame, 5, 18), fontSize: 52, fontWeight: 500, color: COLORS.brown, textAlign: 'center', marginBottom: 40 }}>
          {scene.title}
        </div>
        <div style={{
          ...slideUpFade(frame, 10, 20),
          background: 'rgba(255,255,255,0.6)',
          borderRadius: 24,
          padding: '40px 50px',
          border: `1px solid rgba(139,94,60,0.2)`,
          fontSize: 36,
          color: COLORS.brownMid,
          lineHeight: 1.7,
        }}
          dangerouslySetInnerHTML={{ __html: scene.body_html.replace(/<strong>/g, `<strong style="color:${COLORS.brown}">`).replace(/<em>/g, `<em style="color:${COLORS.brownLight}; font-style:italic">`) }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── CHALLENGE SLIDE ────────────────────────────────────────────────
export const ChallengeSlide: React.FC<{ lesson: any }> = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ background: '#F0E8D8' }}>
      <div style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT * 0.4, overflow: 'hidden', background: '#111', position: 'relative' }}>
        <Video src="./public/videos/slide3_challenge.mp4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop startFrom={0} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(240,232,216,0.8) 100%)' }} />
        <SlideBadge text="Your Turn" />
      </div>

      <div style={{ position: 'absolute', top: VIDEO_HEIGHT * 0.4, width: VIDEO_WIDTH, height: VIDEO_HEIGHT * 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 80px', textAlign: 'center' }}>
        <div style={{ ...slideUpFade(frame, 0, 15), fontSize: 120, marginBottom: 30 }}>⏸️</div>
        <div style={{ ...slideUpFade(frame, 8, 18), fontSize: 72, fontWeight: 500, color: COLORS.brown, lineHeight: 1.2, marginBottom: 20 }}>
          Pause here.<br />Give it a try!
        </div>
        <div style={{ ...slideUpFade(frame, 15, 18), fontSize: 36, color: COLORS.brownLight, lineHeight: 1.6, marginBottom: 40 }}>
          How would you respond in Japanese?<br />Politely but firmly push back.
        </div>
        <div style={{ ...slideUpFade(frame, 20, 18), background: COLORS.amber, color: COLORS.white, borderRadius: 20, padding: '24px 50px', fontSize: 36, fontWeight: 500 }}>
          N2-N1 · Polite but persistent
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── VOCAB SLIDE ────────────────────────────────────────────────────
export const VocabSlide: React.FC<{ lesson: any }> = ({ lesson }) => {
  const frame = useCurrentFrame();
  const words = lesson.slides.vocab.words;
  
  return (
    <AbsoluteFill style={{ background: '#F2E9DA' }}>
      <div style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT * 0.4, overflow: 'hidden', background: '#111', position: 'relative' }}>
        <Video src="./public/videos/slide5_vocab.mp4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop startFrom={0} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(242,233,218,0.8) 100%)' }} />
        <SlideBadge text="Key Vocabulary · N2-N1" />
      </div>

      <div style={{ position: 'absolute', top: VIDEO_HEIGHT * 0.4, width: VIDEO_WIDTH, padding: '40px 80px 40px' }}>
        {words.map((word: any, i: number) => (
          <div key={i} style={{
            ...slideUpFade(frame, i * 8, 15),
            display: 'flex',
            alignItems: 'flex-start',
            gap: 30,
            marginBottom: 28,
            paddingBottom: 28,
            borderBottom: i < words.length - 1 ? `1px solid rgba(139,94,60,0.12)` : 'none',
          }}>
            <div style={{ minWidth: 220 }}>
              <div style={{ fontSize: 38, fontWeight: 500, color: COLORS.brown }}>{word.jp}</div>
              <div style={{ fontSize: 26, color: COLORS.brownFaint, fontStyle: 'italic' }}>{word.romaji}</div>
            </div>
            <div style={{ fontSize: 28, color: COLORS.brownMid, lineHeight: 1.5, flex: 1, paddingTop: 4 }}>
              {word.meaning}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── OUTRO SLIDE ────────────────────────────────────────────────────
export const OutroSlide: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ background: COLORS.dark, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
      {/* Amber top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${COLORS.amber}, transparent)` }} />
      
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(196,122,74,0.12) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      
      {/* Logo mark */}
      <div style={{ ...slideUpFade(frame, 0, 20), width: 160, height: 160, borderRadius: 40, border: `2px solid rgba(196,122,74,0.35)`, background: 'rgba(196,122,74,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, zIndex: 1 }}>
        <div style={{ fontSize: 36, fontWeight: 500, color: COLORS.amber, letterSpacing: 2, textAlign: 'center', lineHeight: 1.3 }}>Mojii<br/>Q</div>
      </div>
      
      {/* Brand name */}
      <div style={{ ...slideUpFade(frame, 8, 20), fontSize: 96, fontWeight: 500, color: COLORS.white, letterSpacing: 3, marginBottom: 12, zIndex: 1 }}>
        Mojii<span style={{ color: COLORS.amber }}>Q</span>
      </div>
      
      {/* By Zistica */}
      <div style={{ ...slideUpFade(frame, 12, 20), fontSize: 28, letterSpacing: 8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 60, zIndex: 1 }}>
        by Zistica
      </div>
      
      {/* Divider */}
      <div style={{ ...slideUpFade(frame, 15, 20), display: 'flex', alignItems: 'center', gap: 24, width: '100%', marginBottom: 60, zIndex: 1 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(196,122,74,0.45)' }} />
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      </div>
      
      {/* Tagline */}
      <div style={{ ...slideUpFade(frame, 18, 20), textAlign: 'center', zIndex: 1, marginBottom: 60 }}>
        <div style={{ fontSize: 42, fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginBottom: 12 }}>Real Japanese. Real situations.</div>
        <div style={{ fontSize: 34, color: 'rgba(255,255,255,0.45)' }}>Master N2–N1 one scene at a time.</div>
      </div>
      
      {/* Links */}
      <div style={{ ...slideUpFade(frame, 22, 20), display: 'flex', flexDirection: 'column', gap: 20, width: '100%', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, padding: '28px 40px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(196,122,74,0.12)', border: '1px solid rgba(196,122,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🌐</div>
          <div>
            <div style={{ fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 6 }}>Website</div>
            <div style={{ fontSize: 34, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>mojiiq<span style={{ color: COLORS.amber }}>.zistica.com</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, padding: '28px 40px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>♪</div>
          <div>
            <div style={{ fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 6 }}>TikTok</div>
            <div style={{ fontSize: 34, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}><span style={{ color: COLORS.amber }}>@</span>zisticamojiiq</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
