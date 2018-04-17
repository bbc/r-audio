/**
This example demonstrates plugging a HTML5 Audio element to the r-audio graph using `RMediaElementSource`.
A reference to the audio element could also be obtained via React refs.
**/
import React from 'react';
import { render } from 'react-dom';

import RAudioContext from '../src/base/audio-context.jsx';
import RPipeline from '../src/graph/pipeline.jsx';
import RCycle from '../src/graph/cycle.jsx';

import {
  RGain,
  RDelay,
  RMediaElementSource
} from '../src/audio-nodes/index.jsx';

export default class MediaElementSourceExample extends React.Component {
  constructor(props) {
    super(props);
    this.audio = new Audio('/assets/audio/a.wav');
    this.audio.autoplay = true;
    this.audio.loop = true;
  }

  render() {
    return (
      <RAudioContext debug={true}>
        <RPipeline>
          <RMediaElementSource element={this.audio} />
          <RCycle>
            <RPipeline>
              <RDelay delayTime={.3} />
              <RGain gain={.8} />
            </RPipeline>
          </RCycle>
          <RGain gain={2} />
        </RPipeline>
      </RAudioContext>
    )
  }
};
