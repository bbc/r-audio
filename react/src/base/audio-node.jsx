import React from 'react';
import RComponent from './component.jsx';

/**
 * Any RComponent that corresponds to an AudioNode is a RAudioNode
 *
 * @class      RAudioNode (name)
 */
export default class RAudioNode extends RComponent {
  constructor(props) {
    super(props);
    // internal AudioNode instance
    this.node = null;
    // dictionary of AudioNode parameters (either AudioParams or object properties)
    this.params = {};
    this.connectToDestinations = this.connectToDestinations.bind(this);
  }

  /**
   * Connects the given AudioNode to this RAudioNode's destinations.
   * Abstracts away this operation as it's used in multiple lifecycle stages.
   *
   * @param      {AudioNode}  webAudioNode  The web audio node
   */
  connectToDestinations(webAudioNode) {
    if (this.props.destination && !this.props.disconnected) {
      let destinations = this.props.destination();

      if (!(destinations instanceof Array)) {
        destinations = [ destinations ];
      }

      destinations.forEach(destination => {
        webAudioNode.connect(this.props.connectToParam ? destination[this.props.connectToParam] : destination);
      });
    }
  }

  componentWillMount() {
    super.componentWillMount();
  }

  componentWillReceiveProps(nextProps) {
    this.updateParams(nextProps);
  }

  componentWillUnmount() {
    this.node.disconnect();
    this.context.nodes.delete(this.props.identifier);

    if (this.props.parent) {
      const parents = this.props.parent();

      parents.forEach(parentIdentifier => {
        const parent = this.context.nodes.get(parentIdentifier);
        if (!parent) return;

        try {
          console.log(parent);
          parent.disconnect(this.node);
        } catch(e) {
          console.warn(e);
        }

        this.connectToDestinations(parent);
      })
    }
  }

  updateParams(props) {
    if (!this.params) return;

    for (let p in this.params) {
      if (!(p in props)) continue;

      if (this.node[p] instanceof AudioParam) {
        if (props.transitionDuration) {
          this.node[p].linearRampToValueAtTime(props[p], this.context.audio.currentTime + props.transitionDuration);
        } else {
          this.node[p].setValueAtTime(props[p], this.context.audio.currentTime);
        }
      }
      else {
        if (this.node[p] !== props[p]) this.node[p] = props[p];
      }
    }
  }

  componentDidMount() {
    this.connectToDestinations(this.node);
  }

  render() {
    if (this.context.debug) {
      return (
        <li>
          <div>
            <strong>
              {this.constructor.name} <em>{this.props.name || ''}</em>
              <sup><mark>{this.props.disconnected && 'disconnected' || ''}</mark></sup>
            </strong>
            <div>{ this.props.connectToParam ? <span> connects to <em>{this.props.connectToParam}</em></span> : null }</div>
          </div>
          <ul>
            {
              Object.keys(this.params).map((p, pi) => {
                if (!this.props[p] && this.props[p] !== 0) return null;

                return <li key={pi}>{p}: <code>{this.props[p]}</code></li>;
              })
            }
          </ul>
        </li>
      );
    }

    return null;
  }
}
