import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class RBiquadFilter extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      frequency: props.frequency,
      detune: props.detune,
      Q: props.Q,
      gain: props.gain,
      type: props.type
    };
  }

  componentWillMount() {
    if (!this.context.audio) return;
    const props = this.props;

    this.node = this.context.audio.createBiquadFilter();
    this.context.nodes.set(this.props.identifier, this.node);

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  render() {
    if (this.context.debug) {
      return (
        <li>
          <strong>BiquadFilter</strong><br/>
          <ul>
            {
              Object.keys(this.params).map((p, pi) => (
                <li key={pi}>{p}: <code>{this.props[p]}</code></li>
              ))
            }
          </ul>
        </li>
      );
    }

    return null;
  }
}