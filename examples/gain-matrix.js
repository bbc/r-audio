import React from 'react';
import { render } from 'react-dom';

import RAudioContext from '../src/base/audio-context.js';
import RPipeline from '../src/graph/pipeline.js';
import RSplit from '../src/graph/split.js';
import RSplitChannels from '../src/graph/split-channels.js';

import {
  RGain,
  RBufferSource
} from '../src/audio-nodes/index.js';

export default class GainMatrix extends React.Component {
  constructor() {
    super();
    this.state = {
      buffer: null,
      gains: [[1, 1],
        [1, 1]]
    };
  }

  componentDidMount() {
    fetch('/assets/audio/clarinet.mp3')
      .then(res => res.arrayBuffer())
      .then(ab => this.audioContext.decodeAudioData(ab))
      .then(buffer => this.setState({ buffer }));
  }

  onGainInput(e) {
    const [x, y] = e.target.name.split('').map(v => parseInt(v));

    const gains = this.state.gains.slice().map(arr => arr.slice());
    gains[x][y] = e.target.value;

    this.setState({ gains });
  }

  render() {
    return (
      <RAudioContext debug={true} onInit={ctx => this.audioContext = ctx}>
        <article>
          <h1>Gain Matrix</h1>
          <p>
            This example (courtesy of <a href="http://github.com/tomjnixon">Tom Nixon</a> from
            BBC R&amp;D) shows how we can create complex multichannel graphs
            using <code>RSplitChannels</code> and explicit <code>connectToChannel</code> props.
          </p>
          <p>
            Each channel of the stereo input signal is routed to both channels of the output signal
            and each branch is processed by a separate <code>RGain</code>.
            This kind of graph is particularly useful when binauralising audio.
          </p>
          <p>
            Stereo audio recording by Freesound user <a href="https://freesound.org/people/debudding/">debudding</a> (Public Domain).
          </p>
        </article>
        <RPipeline>
          <RBufferSource buffer={this.state.buffer} loop start={0}/>
          <RSplitChannels channelCount={2}>
            <RSplit>
              <RGain name="gain00" gain={this.state.gains[0][0]} connectToChannel={0}/>
              <input type="range" min="0" max="1" step="any"
                onChange={this.onGainInput.bind(this)} name="00" />

              <RGain name="gain01" gain={this.state.gains[0][1]} connectToChannel={1}/>
              <input type="range" min="0" max="1" step="any"
                onChange={this.onGainInput.bind(this)} name="01" />
            </RSplit>
            <RSplit>
              <RGain name="gain10" gain={this.state.gains[1][0]} connectToChannel={0}/>
              <input type="range" min="0" max="1" step="any"
                onChange={this.onGainInput.bind(this)} name="10" />

              <RGain name="gain11" gain={this.state.gains[1][1]} connectToChannel={1}/>
              <input type="range" min="0" max="1" step="any"
                onChange={this.onGainInput.bind(this)} name="11" />
            </RSplit>
          </RSplitChannels>
        </RPipeline>
      </RAudioContext>
    );
  }
}
