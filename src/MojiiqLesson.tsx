import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { HookSlide } from './slides/HookSlide';
import { SceneSlide } from './slides/SceneSlide';
import { ChallengeSlide } from './slides/ChallengeSlide';
import { DialogueSlide } from './slides/DialogueSlide';
import { VocabSlide } from './slides/VocabSlide';
import { OutroSlide } from './slides/OutroSlide';

interface Props {
  lesson: any;
  audio: any;
  slideDurationsMs: Record<string, number>;
}

export const MojiiqLesson: React.FC<Props> = ({ lesson, audio, slideDurationsMs }) => {
  const { fps } = useVideoConfig();
  
  const msToFrames = (ms: number) => Math.round((ms / 1000) * fps);
  
  const durations = {
    hook:      msToFrames(slideDurationsMs.hook),
    scene:     msToFrames(slideDurationsMs.scene),
    challenge: msToFrames(slideDurationsMs.challenge),
    dialogue:  msToFrames(slideDurationsMs.dialogue),
    vocab:     msToFrames(slideDurationsMs.vocab),
    outro:     msToFrames(slideDurationsMs.outro),
  };
  
  let offset = 0;
  const offsets = {
    hook:      0,
    scene:     (offset += durations.hook, offset),
    challenge: (offset += durations.scene, offset),
    dialogue:  (offset += durations.challenge, offset),
    vocab:     (offset += durations.dialogue, offset),
    outro:     (offset += durations.vocab, offset),
  };
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#F5EFE6', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HOOK */}
      <Sequence from={offsets.hook} durationInFrames={durations.hook}>
        <HookSlide lesson={lesson} />
        {audio.hook && <Audio src={audio.hook} />}
      </Sequence>
      
      {/* SCENE */}
      <Sequence from={offsets.scene} durationInFrames={durations.scene}>
        <SceneSlide lesson={lesson} />
        {audio.scene && <Audio src={audio.scene} />}
      </Sequence>
      
      {/* CHALLENGE */}
      <Sequence from={offsets.challenge} durationInFrames={durations.challenge}>
        <ChallengeSlide lesson={lesson} />
        {audio.challenge && <Audio src={audio.challenge} />}
      </Sequence>
      
      {/* DIALOGUE */}
      <Sequence from={offsets.dialogue} durationInFrames={durations.dialogue}>
        <DialogueSlide lesson={lesson} audio={audio} fps={fps} />
      </Sequence>
      
      {/* VOCAB */}
      <Sequence from={offsets.vocab} durationInFrames={durations.vocab}>
        <VocabSlide lesson={lesson} />
        {audio.vocab && <Audio src={audio.vocab} />}
      </Sequence>
      
      {/* OUTRO */}
      <Sequence from={offsets.outro} durationInFrames={durations.outro}>
        <OutroSlide />
        {audio.outro && <Audio src={audio.outro} />}
      </Sequence>
      
    </AbsoluteFill>
  );
};
