import React from 'react'
import './index.less'
import {Checkbox} from 'antd'
import { observer } from 'mobx-react';
const TreeComponent = Loader.loadBusinessComponent('OrgTree')

@Decorator.businessProvider('organization')
@observer
class SystemOrgTreeContainer extends React.Component{
  constructor(props) {
    super(props);
    this.treeRef = React.createRef();
  }

  componentDidMount(){
    const {organization,leafClk,viewRef} = this.props;
    viewRef && viewRef(this);
    if (organization.orgTreeData.length) {
      leafClk([organization.orgTreeData[0].id])
    }
  }
  onChange = (flag) => {
    const {organization} = this.props;
    const ids = ( flag 
        ? organization.orgArray.map(v => v.id) 
        : [organization.orgTreeData[0].id]
    );
    this.onExpand(ids)
  }

  /**
   * 递归次数
   */
  recursionTimes = 0;
  /**
   * TODO 去掉递归 
   */
  onExpand = (expandKeys) => {
    let recursionTimes = this.recursionTimes;
    if(this.treeRef.current || recursionTimes >= 10){
      this.treeRef.current.wrappedInstance.onExpand(expandKeys);
    } else {
      setTimeout(() => {
        this.recursionTimes = recursionTimes+1;
        this.onExpand(expandKeys);
      },5)
    }
  }
  renderHeader = () => {
    return (
      <div className='tree-top-content'>
        <Checkbox 
            onChange={(e) => this.onChange(e.target.checked)} 
            className="tree-checkall" >
            展开全部
        </Checkbox>
        {this.props.children}
      </div>
    )
  }
  render(){
    const {
      leafClk,//点击节点时候触发的事件
      treeActiveKey,//设置选中的节点
      allowClear,
      organization,
      className
    }=this.props
    return(
        <div className={className}>
          <TreeComponent 
            ref={this.treeRef}
            renderHeader={this.renderHeader}
            allowClear = {allowClear}
            activeKey={treeActiveKey}
            onSelect={leafClk}
            defaultSelectedKeys={[organization.orgTreeData[0].id]}
          />
        </div>
    )
  }

}
export default SystemOrgTreeContainer