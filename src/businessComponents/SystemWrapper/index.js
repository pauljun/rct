import React from "react";
import "./index.less";
import { observer } from 'mobx-react';

const TreeView=Loader.loadBusinessComponent('SystemOrgTree')
const Title = (titleDom,width) => {
  return (
    <div className='table-setting-title'>
      {titleDom}
      <style jsx>{`
        .table-setting-title{
          width: ${width}px;
          height:60px;
          display:flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 700;
          margin:0 auto;
          color: #333333;
        }
      `}</style>
    </div>
  );
};
@Decorator.businessProvider('organization')
@observer
class WrapperView extends React.Component {
  render() {
    let {
      children,
      name,
      className,
      title, 
      Treetitle,
      width = 1000,
      leftOrgTree=false,
      operateChild=null,
      leafClk,//点击节点时候触发的事件
      treeActiveKey,//设置选中的节点
      organization,
      viewRef,
      TreeChildren,
      breadCrumb=null,
      ...props
    } = this.props
    return (
      <div className='wrapper'>
        {leftOrgTree && (
          <div className={`s-left ${className}`}>
            <div className='title'>
              {Treetitle}
            </div>
            { operateChild }
            <div className='tree'>
              <TreeView
                treeActiveKey={treeActiveKey}
                leafClk={leafClk}
                viewRef={viewRef}
              >
               {TreeChildren}
              </TreeView>
            </div>
          </div>
        )}
        <div className={` ${className} setting-wrapper`}>
          {breadCrumb && breadCrumb}
          {name && !leftOrgTree && <div className="title"><span>{name}</span></div>}
          {title && Title(title,width)}
          <div className='setting-container' style={{width: width}}>
            {children}
          </div>
      </div>
      </div>
    );
  }
}
export default WrapperView;
