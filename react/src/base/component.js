import React from 'react';

export default class RAComponent extends React.Component {
  render() { return null; }
};

RAComponent.contextTypes = {
  audio: React.PropTypes.instanceOf(AudioContext)
};
