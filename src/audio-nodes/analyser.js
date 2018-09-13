import React from 'react';
import RConnectableNode from './../base/connectable-node.js';
import PropTypes from 'prop-types';

export default class RAnalyser extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = {
      fftSize: this.props.fftSize,
      minDecibels: this.props.minDecibels,
      maxDecibels: this.props.maxDecibels,
      smoothingTimeConstant: this.props.smoothingTimeConstant
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.node = this.context.audio.createAnalyser();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  render() {
    const analyserProxy = Object.freeze({
      getFloatFrequencyData: array => {
        return this.node.getFloatFrequencyData(array);
      },
      getByteFrequencyData: array => {
        return this.node.getByteFrequencyData(array);
      },
      getFloatTimeDomainData: array => {
        return this.node.getFloatTimeDomainData(array);
      },
      getByteTimeDomainData: array => {
        return this.node.getByteTimeDomainData(array);
      },
      frequencyBinCount: this.node.frequencyBinCount
    });

    this.props.children(analyserProxy);

    return super.render();
  }
}

RAnalyser.propTypes = {
  children: PropTypes.func.isRequired
};
