import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class RWaveShaper extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      curve: props.curve || null,
      oversample: props.oversample || 'none'
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node || !(this.node instanceof WaveShaperNode)) {
      this.node = this.context.audio.createWaveShaper();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
