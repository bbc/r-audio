import React from 'react';

export default class RAAudioContext extends React.Component {
  componentWillMount() {
    this._context = new AudioContext();
  }

  getChildContext() {
    return { audio: this._context };
  }

  render() {
    // #2127 we're still waiting
    return <div>{this.props.children}</div>;
  }
};

RAAudioContext.childContextTypes = {
  audio: React.PropTypes.instanceOf(AudioContext)
};
