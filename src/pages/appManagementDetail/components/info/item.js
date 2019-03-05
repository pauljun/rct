import React from 'react'
export default props => {
  return (
    <div className="item-view">
      <span className="label">{props.label}：</span>
      <span className="content">{props.children}</span>
    </div>
  );
}
