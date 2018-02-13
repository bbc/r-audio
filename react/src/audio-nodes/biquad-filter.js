import React from 'react';
import RAudioNode from './../base/audio-node';

export default class RBiquadFilter extends RAudioNode {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!this.context.audio) return;
    const props = this.props;

    this._node = this.context.audio.createGain();
    this.context.nodes.set(this.props.identifier, this._node);

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  updateParams(props) {
    const attrs = {
      gain: props.gain
    };

    for (let a in attrs) {
      if (this._node[a] instanceof AudioParam) {
        if (props.transitionDuration) {
          this._node[a].linearRampToValueAtTime(attrs[a], this.context.audio.currentTime + props.transitionDuration);
        } else {
          this._node[a].setValueAtTime(attrs[a], this.context.audio.currentTime);
        }
      }
      else {
        if (this._node[a] !== attrs[a]) this._node[a] = attrs[a];
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateParams(nextProps);
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
