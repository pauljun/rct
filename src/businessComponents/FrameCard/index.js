import React from 'react';
import "./index.less";
class FrameCard extends React.Component {
  render() {
    let { children, title, headerOperator} = this.props
    return <div className="framecard-view">
        <div className="framecard-header">
          <div className="framecard-title primary-color">
            {title}
          </div>
          <div className="framecard-extra-header">
            {headerOperator}
          </div>
        </div>
        <div className="framecard-content">
          {children}
        </div>
      </div>;
  }
}

export default FrameCard