import React from 'react';
import { render } from 'react-dom';

import {
  RAudioContext,
  RCycle,
  RDelay,
  RExtensible,
  RGain,
  RMediaElementSource,
  RPipeline,
  RSplit
} from '../index.js';

class DelayLine extends RExtensible {
  renderGraph() {
    return (
      <RCycle>
        <RPipeline>
          <RGain gain={this.props.gain}/>
          <RDelay delayTime={this.props.delayTime}/>
        </RPipeline>
      </RCycle>
    );
  }
}

export default class CustomNodeExample extends React.Component {
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
          <h1>Creating custom nodes</h1>
          <p>This example demonstrates how to create custom <em>r-audio</em> nodes.
          This can be done by extending <code>RExtensible</code>,
          which is itself an extension of <em>RPipeline</em>.
          We define the contents of our custom node by overriding the <code>renderGraph</code> method,
          which simply returns a bit of JSX, just like React components&apos;
          <code>render</code> method.</p>
        </article>
        <RPipeline>
          <RMediaElementSource element={this.audio} />
          <DelayLine gain={0.7} delayTime={0.3} />
          <RGain gain={2} />
        </RPipeline>
      </RAudioContext>
    );
  }
}
