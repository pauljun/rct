import React from 'react';
const IconFont = Loader.loadBaseComponent("IconFont");
class ItemTitleCon extends React.Component {
  render() {
    const {title,con,icon} =this.props
    return <div className="resources-item">
        <div className="left-icon-view">
          <IconFont type={icon} />
        </div>
        <div className="right-content-view">
          <div className="item-title">{title}</div>
          <div className="item-num primary-color">{con||0}</div>
        </div>
      </div>;
  }
}

export default ItemTitleCon