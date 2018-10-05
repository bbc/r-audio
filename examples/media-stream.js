import React from 'react';
import { render } from 'react-dom';

import {
  RAudioContext,
  RCycle,
  RDelay,
  RGain,
  RMediaStreamSource,
  RPanner,
  RPipeline
} from '../index.js';

export default class MediaStreamSourceExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { stream: null };

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => this.setState({ stream }));
  }

  render() {
    return this.state.stream ? (
      <RAudioContext debug={true}>
        <article>
          <h1>Media Stream</h1>
          <p>This example demonstrates plugging a<code>MediaStream</code> object (from either a WebRTC peer or the native audio input device)
          into the <em>r-audio</em> graph using <code>RMediaStreamSource</code>.</p>
        </article>
        <RPipeline>
          <RMediaStreamSource stream={this.state.stream} />
          <RCycle>
            <RPipeline>
              <RDelay delayTime={0.3} />
              <RGain gain={0.2} />
            </RPipeline>
          </RCycle>
          <RPanner positionY={0} positionX={0} panningModel="HRTF"/>
        </RPipeline>
      </RAudioContext>
    ) : null;
  }
}
