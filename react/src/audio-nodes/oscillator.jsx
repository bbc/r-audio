import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class ROscillator extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      frequency: props.frequency,
      detune: props.detune,
      type: props.type
    };
  }

  componentWillMount() {
    if (!this.context.audio) return;

    this.node = this.context.audio.createOscillator();
    this.context.nodes.set(this.props.identifier, this.node);

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  componentDidMount() {
    super.componentDidMount();
    this.node.start();
  }

  render() {
    if (this.context.debug) {
      return (
        <li>
          <strong>Oscillator</strong><br/>
          <ul>
            <li>Type: <code>{this.props.type}</code></li>
            <li>Frequency: <code>{this.props.frequency}</code></li>
            <li>Detune: <code>{this.props.detune}</code></li>
          </ul>
        </li>
      );
    }

    return null;
  }
}
