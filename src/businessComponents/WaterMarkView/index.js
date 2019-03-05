import React from 'react';
import ImageView from '../../components/ImageView';
import './index.less';

@Decorator.businessProvider('user')
class WaterMakerCorsView extends React.Component {
  state = {
    isError: false
  };
  onError = () => {
    this.setState({ isError: true });
  };
  render() {
    const { isError } = this.state;
    let {
      className = '',
      src,
      background = true,
      type = 'normal', // 水印类型  ‘normal‘ 一个水印   ‘multiple2个水印
      user,
      ...rest
    } = this.props;
    return (
      <span
        className={`bg-sence-path ${className} ${isError ? 'error-img' : ''}`}
      >
        {background && !isError && (
          <span
            className="img-span"
            style={{
              backgroundImage: `url(${src})`
            }}
          />
        )}
        <ImageView
          style={{ display: background && !isError ? 'none' : 'block' }}
          src={src}
          onError={this.onError}
          {...rest}
        />
        {/* {!isError && (
          <React.Fragment>
            <span
              className={`water-mark-span ${type === 'multiple' ? 'rt' : 'ct'}`}
            >
              {user.userInfo.realName}
            </span>
            {type === 'multiple' && (
              <span className="water-mark-span lb">
                {user.userInfo.realName
                  .split('')
                  .reverse()
                  .join('')}
              </span>
            )}
          </React.Fragment>
        )} */}
      </span>
    );
  }
}

export default WaterMakerCorsView;
