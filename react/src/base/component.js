import React from 'react';
import PropTypes from 'prop-types';

export default class RComponent extends React.Component {
  render() { return null; }
};

RComponent.contextTypes = {
  audio: PropTypes.instanceOf(AudioContext),
  nodes: PropTypes.instanceOf(Map),
  debug: PropTypes.bool
};
