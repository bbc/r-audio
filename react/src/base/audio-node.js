import RAComponent from './component';

export default class RAAudioNode extends RAComponent {
  constructor(props) {
    super(props);
    this._node = null;

    // this._node.connect(props.connectTo);
  }

  get node() {
    return this._node;
  }
}
