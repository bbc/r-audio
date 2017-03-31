import RAPlay from './src/play';
import RAAudioContext from './src/audio-context';
import React from 'react';
import { render } from 'react-dom';

render((
  <RAAudioContext>
      <RAPlay src="/assets/audio/a.wav" loop={false} />
      <RAPlay src="/assets/audio/b.wav" loop={false} />
  </RAAudioContext>
),
document.getElementById('app')
);
