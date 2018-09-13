import React from 'react';
import RAudioNode from './../base/audio-node.js';

export default class RMediaElementSource extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {};

    this.createNode = this.createNode.bind(this);
  }

  createNode() {
    this.node = this.context.audio.createMediaElementSource(this.props.element);
    this.context.nodes.set(this.props.identifier, this.node);
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.createNode();
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.element !== this.props.element) this.createNode();
  }
}
