import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class RGain extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      gain: this.props.gain
    }
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node || !(this.node instanceof GainNode)) {
      this.node = this.context.audio.createGain();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
