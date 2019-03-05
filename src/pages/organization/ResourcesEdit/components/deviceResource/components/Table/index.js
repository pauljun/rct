import React from 'react'
import { Checkbox } from 'antd'
import './index.less'
import SearchGroup from '../Search'

const CheckboxGroup = Checkbox.Group
const List = Loader.loadBaseComponent('List')
const DeviceIcon = Loader.loadBaseComponent('DeviceIcon')

export default class TableView extends React.Component {
  constructor(props){
    super(props)
    this.refTb = React.createRef()
  }

  state = {
    indeterminate: false,
  }

  /**
   * @desc 更新List
   */
  forceUpdateGrid = () => {
    this.refTb.current && this.refTb.current.forceUpdateGrid()
  }

  /**
   * @desc 全选
   */
  checkAll = e => {
    const { onChecked, list } = this.props
    this.setState({indeterminate: false})
    onChecked(e.target.checked ? list.map(v => v.id) : [])
      .then(() => this.forceUpdateGrid())
  }

  /**
   * @desc 勾选
   */
  onChecked = ids => {
    const { onChecked, list } = this.props
    this.setState({indeterminate: !!list.length && ids.length < list.length })
    onChecked(ids).then(() => this.forceUpdateGrid())
  }

  /**
   * @desc 修改查询条件
   */
  onChange = options => {
    const { onChange, type } = this.props
    onChange(type, options)
  }

  render(){
    const { list, checkedIds = []} = this.props;
    return (
      <div className='d-sollot-tb-container'>
        <div className='list-container'>
          <div className='item th'>
            <div className='name'>
              <Checkbox 
                indeterminate={this.state.indeterminate}
                onClick={this.checkAll}
              />
              设备列表
            </div>
          </div>
          <SearchGroup 
            onChange={this.onChange}
          />
          <CheckboxGroup
            onChange={this.onChecked} 
            value={checkedIds}
          >
          {!!list.length && 
            <List 
              data={list}
              ref={this.refTb}
              rowHeight={24}
              renderItem={item => (
                <div className='item'>
                  <div className='name' title={item.deviceName}>
                    <Checkbox value={item.id} />
                    <DeviceIcon 
                      type={item.deviceType}
                      status={item.deviceStatus}
                    />
                    {item.deviceName}
                  </div>
                  <div className='sn' title={item.sn}>{item.sn}</div>
                  <div className='group' title={item.id}>
                    {item.id}
                  </div>
                </div>
              )}
            />}
          </CheckboxGroup>
        </div>
      </div>
    )
  }
}