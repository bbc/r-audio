import React from 'react';
import PropTypes from 'prop-types';

/**
 * Contains and manages the Web Audio graph.
 * All immediate children connect directly to its Destination.
 *
 * @class      RAudioContext (name)
 */
export default class RAudioContext extends React.Component {
  constructor(props) {
    super(props);
    // repository of all nodes in the graph
    // keyed by Symbols
    this.nodes = new Map();
  }

  componentWillMount() {
    this._context = new AudioContext();
  }

  getChildContext() {
    return {
      audio: this._context,
      debug: this.props.debug,
      nodes: this.nodes
    };
  }

  render() {
    const children = React.Children
      .toArray(this.props.children)
      .map(child => {
        const audioContextProps = {
          destination: () => this._context.destination,
          identifier: Symbol()
        };

        return React.cloneElement(child, audioContextProps);
      });

    if (this.props.debug) {
      return (
        <div>
          <strong>AudioContext</strong>
          <ul>
          {children}
          </ul>
        </div>
      );
    }

    return this.props.children;
  }
};

RAudioContext.childContextTypes = {
  audio: PropTypes.instanceOf(AudioContext),
  nodes: PropTypes.instanceOf(Map),
  debug: PropTypes.bool
};
