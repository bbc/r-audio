import React from 'react';
import PropTypes from 'prop-types';

export default class RAAudioContext extends React.Component {
  componentWillMount() {
    this._context = new AudioContext();
  }

  getChildContext() {
    return { audio: this._context, debug: this.props.debug };
  }

  render() {
    const children = React.Children.toArray(this.props.children);
    if (children.length) {
      const lastChild = children.pop();
      children.push(React.cloneElement(lastChild, { destination: this._context.destination }));
    }

    if (this.props.debug) {
      return (
        <div style={ {fontFamily: 'sans-serif'} }>
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

RAAudioContext.childContextTypes = {
  audio: PropTypes.instanceOf(AudioContext),
  debug: PropTypes.bool
};
