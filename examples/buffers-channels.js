import React from 'react';
import { render } from 'react-dom';

import {
  RAudioContext,
  RBufferSource,
  RConstantSource,
  RConvolver,
  RDynamicsCompressor,
  RGain,
  ROscillator,
  RPipeline,
  RSplitChannels,
  RWaveShaper
} from '../index.js';

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
    for (; i < n_samples; ++i) {
      x = i * 2 / n_samples - 1;
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  render() {
    return (
      <RAudioContext debug={true} onInit={ctx => this.audioContext = ctx}>
        <article>
          <h1>Buffers and Channels</h1>
          <p>This example demonstrates initialising a <code>RBufferSource</code> with a decoded <code>AudioBuffer</code>.</p>
          <p>It also shows how to process channels separately.</p>
        </article>
        <RPipeline>
          <RBufferSource buffer={this.state.buffer} loop start={0}/>
          <RSplitChannels channelCount={2}>
            <RPipeline>
              <RWaveShaper curve={this.makeDistortionCurve(200)} />
              <RConvolver buffer={this.state.buffer} />
              <RDynamicsCompressor threshold={-50} knee={40}/>
              <RConstantSource offset={0} connectToParam="gain" start={0}/>
              <RGain gain={0.5} />
            </RPipeline>
            <RPipeline>
              <ROscillator frequency={1} type="sine" detune={0} connectToParam="gain" start={0}/>
              <RGain gain={1} />
            </RPipeline>
          </RSplitChannels>
        </RPipeline>
      </RAudioContext>
    );
  }
}
