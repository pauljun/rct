import React from 'react';
import imagePath from './Card_TimeOver.svg';

export default class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: null
    };
  }
  onError = (err) => {
    this.setState({ isError: true });
    this.props.onError && this.props.onError();
  };
  render() {
    const { isError } = this.state;
    const { src, defaultSrc = imagePath, ...props } = this.props;
    return <img data-src={src} src={isError ? defaultSrc : src} {...props} onError={this.onError} />;
  }
}
