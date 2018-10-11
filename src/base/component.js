import React from 'react';
import PropTypes from 'prop-types';

/**
 * Anything that requires an AudioContext is a RComponent
 *
 * @class      RComponent (name)
 */
export default class RComponent extends React.Component {
  componentWillMount() {
    if (!this.context.audio) throw new ReferenceError('RComponent needs to be a child of a RAudioContext');
  }

  render() { return null; }
}

RComponent.contextTypes = {
  audio: PropTypes.instanceOf(window.AudioContext || window.webkitAudioContext),
  nodes: PropTypes.instanceOf(Map),
  debug: PropTypes.bool
};
