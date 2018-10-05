import React from 'react';
import { render } from 'react-dom';

import {
  RAudioContext,
  RCycle,
  RDelay,
  RGain,
  RMediaElementSource,
  RPipeline
} from '../index.js';

export default class MediaElementSourceExample extends React.Component {
  constructor(props) {
    super(props);
    this.audio = new Audio('/assets/audio/clarinet.mp3');
    this.audio.autoplay = true;
    this.audio.loop = true;
  }

  render() {
    return (
      <RAudioContext debug={true}>
        <article>
          <h1>Media Element</h1>
          <p>This example demonstrates plugging a HTML5 Audio element to the <em>r-audio</em> graph using <code>RMediaElementSource</code>. A reference to the audio element could also be obtained via React refs.</p>
        </article>
        <RPipeline>
          <RMediaElementSource element={this.audio} />
          <RCycle>
            <RPipeline>
              <RDelay delayTime={0.3} />
              <RGain gain={0.8} />
            </RPipeline>
          </RCycle>
          <RGain gain={2} />
        </RPipeline>
      </RAudioContext>
    );
  }
}
