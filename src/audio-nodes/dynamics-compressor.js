import React from 'react';
import RConnectableNode from './../base/connectable-node.js';

export default class RDynamicsCompressor extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = {
      threshold: props.threshold || -24,
      knee: props.knee || 30,
      ratio: props.ratio || 12,
      attack: props.attack || 0.003,
      release: props.release || 0.25
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.node = this.context.audio.createDynamicsCompressor();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
