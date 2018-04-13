import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class RAudioWorklet extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = Object.assign({}, this.props);
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node || !(this.node instanceof AudioWorkletNode)) {
      this.node = new AudioWorkletNode(this.context.audio, this.props.worklet);
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
