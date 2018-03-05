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
    super.componentWillMount();
    const props = this.props;

    if (!this.node || !(this.node instanceof BiquadFilterNode)) {
      this.node = this.context.audio.createBiquadFilter();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}