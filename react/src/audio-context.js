import React from 'react';
import PropTypes from 'prop-types';

export default class RAudioContext extends React.Component {
  constructor(props) {
    super(props);

    this._nodes = new Map();
  }

  componentWillMount() {
    this._context = new AudioContext();
  }

  getChildContext() {
    return { audio: this._context, debug: this.props.debug, nodes: this._nodes };
  }

  render() {
    const children = React.Children
      .toArray(this.props.children)
      .map(child => React.cloneElement(child, { destination: () => this._context.destination }));

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
