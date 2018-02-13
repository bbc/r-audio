import React from 'react';
import RAudioNode from './../base/audio-node';

export default class RGain extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      gain: props.gain
    };
  }

  componentWillMount() {
    if (!this.context.audio) return;
    const props = this.props;

    this.node = this.context.audio.createGain();
    this.context.nodes.set(this.props.identifier, this.node);

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  render() {
    if (this.context.debug) {
      return (
        <li>
          <strong>Gain</strong><br/>
          <ul>
            <li>Gain: <code>{this.props.gain}</code></li>
          </ul>
        </li>
      );
    }

    return null;
  }
}
