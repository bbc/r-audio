/**
This example demonstrates how one can create feedback delay lines using the `RCycle` component.
Make sure to always include a `RGain` with `gain` < 1 to avoid infinite feedback.
**/
import React from 'react';
import { render } from 'react-dom';

import RAudioContext from '../src/base/audio-context.jsx';
import RPipeline from '../src/graph/pipeline.jsx';
import RSplit from '../src/graph/split.jsx';
import RCycle from '../src/graph/cycle.jsx';

import {
  ROscillator,
  RGain,
  RBiquadFilter,
  RStereoPanner,
  RDelay
} from '../src/audio-nodes/index.jsx';

const delays = (
  <RAudioContext debug={true}>
    <RPipeline>
      <ROscillator frequency={220} type="triangle" detune={0} />
      <ROscillator frequency={1} type="square" detune={0} connectToParam="gain" />
      <RGain gain={1} />
      <RSplit>
        <RGain gain={.5} />
        <RCycle>
          <RPipeline>
            <RDelay delayTime={.1} />
            <RGain gain={.4} />
            <RStereoPanner pan={-1}/>
          </RPipeline>
        </RCycle>
        <RCycle>
          <RPipeline>
            <RDelay delayTime={.3} />
            <RGain gain={.4} />
            <RStereoPanner pan={1}/>
          </RPipeline>
        </RCycle>
      </RSplit>
    </RPipeline>
  </RAudioContext>
);

export default delays;
