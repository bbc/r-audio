/**

**/
import React from 'react';
import { render } from 'react-dom';

import RAudioContext from '../src/base/audio-context.jsx';
import RPipeline from '../src/graph/pipeline.jsx';
import RCycle from '../src/graph/cycle.jsx';

import {
  RGain,
  RDelay,
  RPanner,
  RMediaStreamSource
} from '../src/audio-nodes/index.jsx';

export default class MediaStreamSourceExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { stream: null };

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => this.setState({ stream }))
      .catch(err => console.log('The following gUM error occured: ' + err));
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
              <RDelay delayTime={.3} />
              <RGain gain={.2} />
            </RPipeline>
          </RCycle>
          <RPanner positionY={0} positionX={0} panningModel="HRTF"/>
        </RPipeline>
      </RAudioContext>
    ) : null;
  }
};
