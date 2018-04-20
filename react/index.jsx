import React from 'react';
import { render } from 'react-dom';

import RAudioContext from './src/base/audio-context.jsx';
import RPipeline from './src/graph/pipeline.jsx';
import RSplit from './src/graph/split.jsx';
import RCycle from './src/graph/cycle.jsx';
import RSplitChannels from './src/graph/split-channels.jsx';

import {
  RAnalyser,
  RAudioWorklet,
  RBiquadFilter,
  RBufferSource,
  RChannelMerger,
  RChannelSplitter,
  RConvolver,
  RConstantSource,
  RDelay,
  RDynamicsCompressor,
  RGain,
  RMediaElementSource,
  RMediaStreamSource,
  ROscillator,
  RPanner,
  RStereoPanner,
  RWaveShaper
} from './src/audio-nodes/index.jsx';

export {
  RAnalyser,
  RAudioContext,
  RAudioWorklet,
  RBiquadFilter,
  RBufferSource,
  RChannelMerger,
  RChannelSplitter,
  RConvolver,
  RConstantSource,
  RCycle,
  RDelay,
  RDynamicsCompressor,
  RGain,
  RMediaElementSource,
  RMediaStreamSource,
  ROscillator,
  RPanner,
  RPipeline,
  RSplit,
  RSplitChannels,
  RStereoPanner,
  RWaveShaper
}


/**
=====
DEMO CODE
=====
**/
import examples from './examples/index.jsx';
const example = location.hash.slice(1);

const onExampleChange = e => {
  location.hash = e.target.value;
  location.reload();
};

render(
  (
    <main>
      <header>
      <label htmlFor="example-select">Select an example: </label>
      <select id="example-select" onChange={onExampleChange} value={example}>
      {
        Object.keys(examples).map((ex, ei) => <option key={ei} value={ex}>{ex}</option>)
      }
      </select>
      </header>
      <hr/>
      { examples[example] || null }
    </main>
  ),
  document.getElementById('app')
);
