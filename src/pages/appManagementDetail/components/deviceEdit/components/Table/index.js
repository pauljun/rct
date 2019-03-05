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
    onChecked && onChecked(e.target.checked ? list.map(v => v.id) : [])
      .then(() => {
        this.forceUpdateGrid()
      })
  }

  /**
   * @desc 勾选
   */
  onChecked = ids => {
    const { onChecked, list } = this.props
    this.setState({indeterminate: !!list.length && ids.length < list.length })
    onChecked && onChecked(ids).then(() => this.forceUpdateGrid())
  }

  /**
   * @desc 修改查询条件
   */
  onChange = options => {
    const { onChange, type } = this.props
    onChange(type, options)
  }

  /**
   * @desc 根据分组id获取分组名称
   */
  getNameByGroupId = id => {
    const { lyGroup = [] } = this.props
    const data = lyGroup.filter(v => v.id === id)
    if(data[0]){
      return data[0].name
    }else{
      return '-'
    }
  }

  render(){
    const { list, checkedIds = [], lyGroup = [], isSimple = false} = this.props
    return (
      <div className='d-sollot-tb-container'>
          <div className='list-container'>
            <div className='item th'>
              <div className='name'>
                <Checkbox 
                  indeterminate={this.state.indeterminate}
                  onClick={this.checkAll}
                />
                {isSimple ? '设备列表' : '设备名称'}
              </div>
              {!isSimple && 
                <React.Fragment>
                  
                  <div className='sn'>SN</div>
                  <div className='group'>分组</div>
                </React.Fragment>
              }
            </div>
            {!isSimple && 
              <SearchGroup 
                lyGroup={lyGroup}
                onChange={this.onChange}
              />
            }
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
                    {!isSimple && 
                      <React.Fragment>
                        <div className='sn' title={item.sn}>{item.sn}</div>
                        <div className='group' title={item.id}>
                          {item.lygroupId && this.getNameByGroupId(item.lygroupId)}
                        </div>
                      </React.Fragment>
                    }
                  </div>
                )}
              />}
            </CheckboxGroup>
          </div>
      </div>
    )
  }
}