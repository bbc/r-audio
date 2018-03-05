import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class ROscillator extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      frequency: props.frequency,
      detune: props.detune,
      type: props.type
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node || !(this.node instanceof OscillatorNode)) {
      this.node = this.context.audio.createOscillator();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  componentDidMount() {
    super.componentDidMount();
    this.node.start();
  }
}
