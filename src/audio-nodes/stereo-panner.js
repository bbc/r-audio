import React from 'react';
import RConnectableNode from './../base/connectable-node.js';

export default class RStereoPanner extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = {
      pan: props.pan
    };
  }

  componentWillMount() {
    super.componentWillMount();

    const props = this.props;

    if (!this.node) {
      this.node = this.context.audio.createStereoPanner();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
