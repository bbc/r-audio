import RAPlay from './src/play';
import RAAudioContext from './src/audio-context';
import React from 'react';
import { render } from 'react-dom';

import RAPipeline from './src/pipeline';
import RAOscillator from './src/audio-nodes/oscillator';

const plays = (
  <RAAudioContext debug={true}>
      <RAPlay src="/assets/audio/a.wav" loop={true} />
      <RAPlay src="/assets/audio/b.wav" loop={false} />
  </RAAudioContext>
);

const pipeline = (
  <RAAudioContext debug={true}>
    <RAPipeline>
      <RAOscillator frequency={220} type="square" detune={0} />
      <RAOscillator frequency={220} type="square" detune={22} />
    </RAPipeline>
  </RAAudioContext>
);

render(pipeline,
document.getElementById('app')
);
