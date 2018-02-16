import React from 'react';
import PropTypes from 'prop-types';

/**
 * Anything that requires an AudioContext is a RComponent
 *
 * @class      RComponent (name)
 */
export default class RComponent extends React.Component {
  render() { return null; }
};

RComponent.contextTypes = {
  audio: PropTypes.instanceOf(AudioContext),
  nodes: PropTypes.instanceOf(Map),
  debug: PropTypes.bool
};
