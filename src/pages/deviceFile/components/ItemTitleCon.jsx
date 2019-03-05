import React from 'react';
class ItemTitleCon extends React.Component {
  render() {
    const {title,con} =this.props
    return<div className="device-info-content-item">
      <div className="device-info-content-title">{title}</div>
      <div className="device-info-content-con">{con}</div>
    </div>
  }
}

export default ItemTitleCon