import React from 'react';
import './index.less'
const IconFont = Loader.loadBaseComponent("IconFont");
class InfoIconItemView extends React.Component {
  render() {
    let {icon,title,num} = this.props
    return(
      <div className="info-icon-item-view">
        <div className="info-item-title">
          {title}
        </div>
        <div className="info-item-icon">
          <IconFont type={icon} />
        </div>
        <div className="info-item-num primary-color">
          {Utils.thousand(num)}
        </div>
      </div>
    ) 
  }
}

export default InfoIconItemView