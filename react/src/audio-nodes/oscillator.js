import React from 'react';
import RAAudioNode from './../base/audio-node';

export default class RAOscillator extends RAAudioNode {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!this.context.audio) return;
    const props = this.props;

    this._node = this.context.audio.createOscillator();
    this.props.returnNode(this._node);

    const attrs = {
      frequency: props.frequency,
      detune: props.detune,
      type: props.type
    };

    for (let a in attrs) {
      if (this._node[a] instanceof AudioParam) {
        this._node[a].setValueAtTime(attrs[a], this.context.audio.currentTime);
      }
      else {
        this._node[a] = attrs[a];
      }
    }
  }

  componentDidMount() {
    if (this.props.destination) {
      console.log(this.props.destination);
      if (this.props.destination instanceof AudioDestinationNode) this._node.connect(this.props.destination);
    }
    this._node.start();
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
