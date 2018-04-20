import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class ROscillator extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      frequency: props.frequency,
      detune: props.detune,
      type: props.type,
      periodicWave: props.periodicWave
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node || !(this.node instanceof OscillatorNode)) {
      this.node = this.context.audio.createOscillator();
      this.node.addEventListener('ended', this.onEnded);

      if (this.props.periodicWave) {
        this.node.setPeriodicWave(this.props.periodicWave);
      }

      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  componentDidMount() {
    super.componentDidMount();
    this.node.start();
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);

    if (this.props.periodicWave !== nextProps.periodicWave) {
      this.node.setPeriodicWave(nextProps.periodicWave);
    }
  }
}
