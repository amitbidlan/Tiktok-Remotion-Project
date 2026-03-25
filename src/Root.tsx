import { Composition } from 'remotion';
import { MojiiqLesson } from './MojiiqLesson';
import lessonData from '../content/lesson.json';
import audioManifest from '../content/audio-manifest.json';

// TikTok dimensions: 1080x1920, 30fps
const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

// Calculate total duration from lesson data
const dialogue = lessonData.slides.dialogue;
const dialogueDuration = dialogue.exchanges.reduce((sum: number, e: any) => sum + e.duration_ms, 0) + 3000;

const SLIDE_DURATIONS_MS = {
  hook:      4000,
  scene:     6000,
  challenge: 5000,
  dialogue:  dialogueDuration,
  vocab:     8000,
  outro:     5000,
};

const totalMs = Object.values(SLIDE_DURATIONS_MS).reduce((a, b) => a + b, 0);
const totalFrames = Math.ceil((totalMs / 1000) * FPS);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MojiiqLesson"
      component={MojiiqLesson}
      durationInFrames={totalFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{
        lesson: lessonData,
        audio: audioManifest,
        slideDurationsMs: SLIDE_DURATIONS_MS,
      }}
    />
  );
};
