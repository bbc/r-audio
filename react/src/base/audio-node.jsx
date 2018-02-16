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
  }

  componentWillReceiveProps(nextProps) {
    this.updateParams(nextProps);
  }

  componentWillUnmount() {
    this.node.disconnect();
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
    if (this.props.destination) {
      const destination = this.props.destination();
      this.node.connect(destination);
    }
  }
}
