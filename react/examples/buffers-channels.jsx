/**
This example demonstrates initialising a RBufferSource with a decoded AudioBuffer.
It also shows how to process channels separately.
**/
import React from 'react';
import { render } from 'react-dom';

import RAudioContext from '../src/base/audio-context.jsx';
import RPipeline from '../src/graph/pipeline.jsx';
import RSplitChannels from '../src/graph/split-channels.jsx';

import {
  ROscillator,
  RGain,
  RBufferSource,
  RConvolver,
  RWaveShaper,
  RDynamicsCompressor
} from '../src/audio-nodes/index.jsx';

export default class BuffersAndChannels extends React.Component {
  constructor() {
    super();

    this.state = { buffer: null };
  }

  componentDidMount() {
    fetch('/assets/audio/b.wav')
    .then(res => res.arrayBuffer())
    .then(ab => this.audioContext.decodeAudioData(ab))
    .then(buffer => this.setState({ buffer }));
  }

  makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };

  render() {
    return (
      <RAudioContext debug={true} onInit={ctx => this.audioContext = ctx}>
        <RPipeline>
          <RBufferSource buffer={this.state.buffer} loop/>
          <RSplitChannels channelCount={2}>
            <RPipeline>
              <RWaveShaper curve={this.makeDistortionCurve(200)} />
              <RConvolver buffer={this.state.buffer} />
              <RDynamicsCompressor threshold={-50} knee={40}/>
              <RGain gain={.5} />
            </RPipeline>
            <RPipeline>
              <ROscillator frequency={1} type="sine" detune={0} connectToParam="gain" />
              <RGain gain={1} />
            </RPipeline>
          </RSplitChannels>
        </RPipeline>
      </RAudioContext>
    )
  }
};
