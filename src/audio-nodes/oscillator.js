import React from 'react';
import RScheduledSource from './../base/scheduled-source.js';

export default class ROscillator extends RScheduledSource {
  constructor(props) {
    super(props);

    this.params = {
      frequency: props.frequency,
      detune: props.detune,
      type: props.type,
      periodicWave: props.periodicWave
    };

    this.instantiateNode = this.instantiateNode.bind(this);
    this.readyToPlay = true;
    this.onEnded = this.onEnded.bind(this);
  }

  onEnded(e) {
    super.onEnded(e);
    if (this.props.onEnded) this.props.onEnded(e);
  }

  instantiateNode() {
    if (!this.node || this.playbackScheduled === false) {
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

  componentWillMount() {
    super.componentWillMount();
    this.instantiateNode();
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);

    if (this.props.periodicWave !== nextProps.periodicWave) {
      this.node.setPeriodicWave(nextProps.periodicWave);
    }
  }
}
