import RComponent from './component';

export default class RAudioNode extends RComponent {
  constructor(props) {
    super(props);
    this.node = null;
    this.params = {};
  }

  componentWillReceiveProps(nextProps) {
    this.updateParams(nextProps);
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
      this.node.connect(this.props.destination());
    }
  }
}
