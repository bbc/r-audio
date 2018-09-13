import React from 'react';
import RConnectableNode from './../base/connectable-node.js';

export default class RWaveShaper extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = {
      curve: props.curve || null,
      oversample: props.oversample || 'none'
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.node = this.context.audio.createWaveShaper();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
