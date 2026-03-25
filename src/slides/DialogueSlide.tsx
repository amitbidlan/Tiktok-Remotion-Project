import React from 'react';
import { AbsoluteFill, Audio, Video, useCurrentFrame, Sequence } from 'remotion';
import { COLORS, VIDEO_WIDTH, VIDEO_HEIGHT, slideUpFade, wordPopIn, SlideBadge } from './shared';

interface DialogueProps {
  lesson: any;
  audio: any;
  fps: number;
}

export const DialogueSlide: React.FC<DialogueProps> = ({ lesson, audio, fps }) => {
  const frame = useCurrentFrame();
  const exchanges = lesson.slides.dialogue.exchanges;
  const recapWords = lesson.slides.dialogue.recap_words;
  
  const msToFrames = (ms: number) => Math.round((ms / 1000) * fps);
  
  // Build exchange timeline
  let exchangeOffset = 0;
  const timeline = exchanges.map((ex: any, i: number) => {
    const start = exchangeOffset;
    const duration = msToFrames(ex.duration_ms);
    exchangeOffset += duration;
    return { ...ex, startFrame: start, durationFrames: duration, index: i };
  });
  
  const recapStart = exchangeOffset;
  const recapDuration = msToFrames(3500);
  
  // Which exchange is active?
  const activeIdx = timeline.findIndex((ex: any) =>
    frame >= ex.startFrame && frame < ex.startFrame + ex.durationFrames
  );
  const showRecap = frame >= recapStart;
  
  const activeExchange = activeIdx >= 0 ? timeline[activeIdx] : null;
  
  return (
    <AbsoluteFill style={{ background: '#EAE0D0' }}>
      {/* Background video */}
      <div style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT * 0.4, overflow: 'hidden', background: '#111', position: 'relative' }}>
        <Video src="./public/videos/slide4_dialogue.mp4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop startFrom={0} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(234,224,208,0.8) 100%)' }} />
        <SlideBadge text="Model Answer" />
      </div>

      {/* Dialogue area */}
      <div style={{ position: 'absolute', top: VIDEO_HEIGHT * 0.4, width: VIDEO_WIDTH, height: VIDEO_HEIGHT * 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 80px' }}>
        
        {/* Exchange card */}
        {!showRecap && activeExchange && (
          <Sequence from={activeExchange.startFrame} durationInFrames={activeExchange.durationFrames}>
            <ExchangeCard exchange={activeExchange} fps={fps} />
            {audio[`dialogue_${activeExchange.index + 1}`] && (
              <Audio src={audio[`dialogue_${activeExchange.index + 1}`]} />
            )}
          </Sequence>
        )}
        
        {/* Recap card */}
        {showRecap && (
          <Sequence from={recapStart} durationInFrames={recapDuration}>
            <RecapCard recapWords={recapWords} />
          </Sequence>
        )}
        
        {/* Progress pips */}
        <div style={{ display: 'flex', gap: 20, marginTop: 40, position: 'absolute', bottom: 80 }}>
          {exchanges.map((_: any, i: number) => (
            <div key={i} style={{
              width: 60, height: 6, borderRadius: 3,
              background: i < activeIdx ? COLORS.amber
                : i === activeIdx ? '#E89060'
                : 'rgba(139,94,60,0.2)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ExchangeCard: React.FC<{ exchange: any; fps: number }> = ({ exchange, fps }) => {
  const frame = useCurrentFrame();
  const isYou = exchange.speaker === 'you';
  const words = exchange.jp.split(/\s+/);
  const wordsPerSecond = 6;
  
  return (
    <div style={{
      ...slideUpFade(frame, 0, 12),
      width: '100%',
      background: 'rgba(255,255,255,0.7)',
      border: `1px solid rgba(196,122,74,0.25)`,
      borderRadius: 32,
      padding: '44px 54px',
    }}>
      {/* Speaker label */}
      <div style={{
        display: 'inline-block',
        background: isYou ? COLORS.amber : COLORS.brownLight,
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 500,
        padding: '6px 20px',
        borderRadius: 40,
        marginBottom: 20,
        letterSpacing: 2,
      }}>
        {isYou ? 'YOU' : 'STAFF'}
      </div>
      
      {/* Japanese with word-by-word animation */}
      <div style={{ fontSize: 38, fontWeight: 500, color: COLORS.brown, lineHeight: 1.6, marginBottom: 16 }}>
        {words.map((word: string, i: number) => (
          <span key={i} style={{
            ...wordPopIn(frame, i, wordsPerSecond, fps),
            color: exchange.highlight_words?.includes(word) ? COLORS.amber : COLORS.brown,
            marginRight: 4,
          }}>
            {word}
          </span>
        ))}
      </div>
      
      {/* Romaji - fades in after words */}
      <div style={{
        ...slideUpFade(frame, Math.ceil(words.length / wordsPerSecond * fps) + 5, 12),
        fontSize: 26,
        color: COLORS.brownFaint,
        fontStyle: 'italic',
        lineHeight: 1.5,
        marginBottom: 14,
      }}>
        {exchange.romaji}
      </div>
      
      {/* English translation */}
      <div style={{
        ...slideUpFade(frame, Math.ceil(words.length / wordsPerSecond * fps) + 10, 12),
        fontSize: 28,
        color: COLORS.brownMid,
        lineHeight: 1.5,
        paddingTop: 14,
        borderTop: `1px solid rgba(139,94,60,0.12)`,
      }}>
        {exchange.english}
      </div>
    </div>
  );
};

const RecapCard: React.FC<{ recapWords: any[] }> = ({ recapWords }) => {
  const frame = useCurrentFrame();
  
  return (
    <div style={{
      ...slideUpFade(frame, 0, 15),
      width: '100%',
      background: 'rgba(255,255,255,0.85)',
      border: `3px solid ${COLORS.amber}`,
      borderRadius: 32,
      padding: '44px 54px',
    }}>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.amber, marginBottom: 30 }}>
        Next time you're in this situation, use:
      </div>
      
      {recapWords.map((word: any, i: number) => (
        <div key={i} style={{
          ...slideUpFade(frame, 8 + i * 6, 12),
          display: 'flex',
          alignItems: 'baseline',
          gap: 24,
          marginBottom: i < recapWords.length - 1 ? 24 : 0,
          paddingBottom: i < recapWords.length - 1 ? 24 : 0,
          borderBottom: i < recapWords.length - 1 ? `1px solid rgba(196,122,74,0.15)` : 'none',
        }}>
          <div>
            <span style={{ fontSize: 38, fontWeight: 500, color: COLORS.brown }}>{word.jp}</span>
            <span style={{ fontSize: 22, background: COLORS.amber, color: COLORS.white, borderRadius: 20, padding: '3px 12px', marginLeft: 12, verticalAlign: 'middle' }}>{word.romaji}</span>
          </div>
          <div style={{ fontSize: 26, color: COLORS.amber, flexShrink: 0 }}>→</div>
          <div style={{ fontSize: 28, color: COLORS.brownMid, lineHeight: 1.4, flex: 1 }}>{word.instruction}</div>
        </div>
      ))}
    </div>
  );
};
