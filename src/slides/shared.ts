// Shared brand colors and styles for MojiIQ slides

export const COLORS = {
  cream:      '#F5EFE6',
  creamDark:  '#EDE0CF',
  amber:      '#C47A4A',
  amberDark:  '#A85E33',
  brown:      '#3D2B1F',
  brownMid:   '#5C3D2B',
  brownLight: '#8B5E3C',
  brownFaint: '#A07860',
  dark:       '#0A0A0A',
  white:      '#FFFFFF',
};

export const VIDEO_WIDTH  = 1080;
export const VIDEO_HEIGHT = 1920;

// Fade in from bottom animation
export const slideUpFade = (frame: number, startFrame = 0, durationFrames = 15) => {
  const progress = Math.min(1, Math.max(0, (frame - startFrame) / durationFrames));
  const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
  return {
    opacity: eased,
    transform: `translateY(${(1 - eased) * 40}px)`,
  };
};

// Word pop-in animation
export const wordPopIn = (frame: number, wordIndex: number, wordsPerSecond = 4, fps = 30) => {
  const framesPerWord = fps / wordsPerSecond;
  const wordFrame = wordIndex * framesPerWord;
  const progress = Math.min(1, Math.max(0, (frame - wordFrame) / 8));
  const eased = 1 - Math.pow(1 - progress, 2);
  return {
    opacity: eased,
    transform: `scale(${0.8 + 0.2 * eased})`,
    display: 'inline-block',
  };
};

// Slide badge component
export const SlideBadge: React.FC<{ text: string }> = ({ text }) => (
  <div style={{
    position: 'absolute',
    top: 40,
    left: 50,
    background: COLORS.amber,
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 500,
    padding: '8px 24px',
    borderRadius: 40,
    letterSpacing: 1,
    zIndex: 10,
  }}>{text}</div>
);

// Video background wrapper
export const VideoBackground: React.FC<{ src: string; children?: React.ReactNode }> = ({ src, children }) => (
  <div style={{ position: 'relative', width: VIDEO_WIDTH, height: VIDEO_HEIGHT * 0.4, overflow: 'hidden', background: '#111' }}>
    <video
      src={src}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      muted
      loop
    />
    {children}
  </div>
);

// Divider line
export const Divider: React.FC = () => (
  <div style={{ width: 100, height: 4, background: COLORS.amber, borderRadius: 2, margin: '24px auto' }} />
);
