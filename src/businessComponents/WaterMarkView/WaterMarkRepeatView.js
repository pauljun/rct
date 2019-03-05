import React from 'react';
import WaterMakerCorsView from './index.js';

@Decorator.businessProvider('user')
class WaterMakerView extends React.Component {
  state = { src: null };
  componentDidMount() {
    this.setImagePath(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.setImagePath(nextProps);
    }
  }
  setImagePath(props) {
    const { src, options, user } = props;
    const { realName } = user.userInfo;
    let content = [];
    if (realName) {
      content.push(realName);
    }
    Utils.createImageWaterMark(src, { content, ...options })
      .then(path => {
        this.setState({ src: path });
      })
      .catch(e => {
        console.error(e);
      });
  }
  componentWillUnmount() {
    URL.revokeObjectURL(this.state.src);
  }
  imageLoad(e) {
    const { width, height } = e.target;
    this.setState({ width, height });
  }
  render() {
    const { src, options, ...props } = this.props;
    return <img {...props} src={this.state.src} />;
  }
}

WaterMakerView.WaterMakerCorsView = WaterMakerCorsView;

export default WaterMakerView;
