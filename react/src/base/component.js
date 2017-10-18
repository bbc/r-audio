import React from 'react';
import PropTypes from 'prop-types';

export default class RAComponent extends React.Component {
  render() { return null; }
};

RAComponent.contextTypes = {
  audio: PropTypes.instanceOf(AudioContext),
  debug: PropTypes.bool
};
