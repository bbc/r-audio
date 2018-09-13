import React from 'react';
import RConnectableNode from './../base/connectable-node.js';

export default class RPanner extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = {
      panningModel: this.props.panningModel,
      distanceModel: this.props.distanceModel,
      refDistance: this.props.refDistance,
      maxDistance: this.props.maxDistance,
      rolloffFactor: this.props.rolloffFactor,
      coneInnerAngle: this.props.coneInnerAngle,
      coneOuterAngle: this.props.coneOuterAngle,
      coneOuterGain: this.props.coneOuterGain,
      positionX: this.props.positionX,
      positionY: this.props.positionY,
      positionZ: this.props.positionZ,
      orientationX: this.props.orientationX,
      orientationY: this.props.orientationY,
      orientationZ: this.props.orientationZ
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.node = this.context.audio.createPanner();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
