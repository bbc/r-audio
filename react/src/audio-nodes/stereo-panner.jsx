import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class RStereoPanner extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      pan: props.pan
    };
  }

  componentWillMount() {
    if (!this.context.audio) return;
    const props = this.props;

    this.node = this.context.audio.createStereoPanner();
    this.context.nodes.set(this.props.identifier, this.node);

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  render() {
    if (this.context.debug) {
      return (
        <li>
          <strong>StereoPanner</strong><br/>
          <ul>
            <li>StereoPanner: <code>{this.props.pan}</code></li>
          </ul>
        </li>
      );
    }

    return null;
  }
}
