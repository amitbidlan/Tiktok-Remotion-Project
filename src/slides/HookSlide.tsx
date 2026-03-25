import React from 'react';
import { AbsoluteFill, Video, useCurrentFrame } from 'remotion';
import { COLORS, VIDEO_WIDTH, VIDEO_HEIGHT, slideUpFade, SlideBadge, Divider } from './shared';

export const HookSlide: React.FC<{ lesson: any }> = ({ lesson }) => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ background: COLORS.cream }}>
      {/* Background video - top 40% */}
      <div style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT * 0.4, overflow: 'hidden', background: '#111', position: 'relative' }}>
        <Video
          src="./public/videos/slide1_hook.mp4"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
          loop
          startFrom={0}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, rgba(245,239,230,0.8) 100%)'
        }} />
        <SlideBadge text="Japanese Lesson" />
      </div>

      {/* Text content - bottom 60% */}
      <div style={{
        position: 'absolute',
        top: VIDEO_HEIGHT * 0.4,
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT * 0.6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 80px',
        textAlign: 'center',
      }}>
        <div style={{ ...slideUpFade(frame, 0, 20), fontSize: 32, fontWeight: 500, letterSpacing: 4, textTransform: 'uppercase', color: COLORS.amber, marginBottom: 30 }}>
          Japanese Lesson
        </div>
        
        <div style={{ ...slideUpFade(frame, 10, 20), fontSize: 72, fontWeight: 500, color: COLORS.brown, lineHeight: 1.25, marginBottom: 10 }}>
          Can you say this
        </div>
        <div style={{ ...slideUpFade(frame, 15, 20), fontSize: 72, fontWeight: 500, lineHeight: 1.25, marginBottom: 10 }}>
          in{' '}
          <span style={{ color: COLORS.amber }}>Japanese?</span>
        </div>
        
        <div style={{ ...slideUpFade(frame, 10, 20) }}>
          <Divider />
        </div>
        
        <div style={{ ...slideUpFade(frame, 20, 20), fontSize: 40, color: COLORS.brownLight, marginTop: 10 }}>
          Give it a try before the answer!
        </div>
      </div>
    </AbsoluteFill>
  );
};
