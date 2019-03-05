import React from 'react'
import { Checkbox } from 'antd'
import './index.less'

const CheckboxGroup = Checkbox.Group
const IconFont = Loader.loadBaseComponent('IconFont')

export default
class SelectList extends React.Component {
  onChange = values => {
    this.props.cancelChecked(values)
  }
  onCheckAllChange = e => {
    const { list, cancelChecked } = this.props
    cancelChecked && cancelChecked(e.target.checked ? list.map(v => v.id) : [])
  }
  gitIndeterminate = () => {
    const { list, cancelIds } = this.props
    return cancelIds.length && list.length !== cancelIds.length
  }
  render(){
    const { list, del, cancelIds } = this.props
    const indeterminate = this.gitIndeterminate()
    return (
      <div className='place-tree-select'>
        <div className='th'>
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
          />
          场所列表
        </div>
        <div className='select-wrapper'>
          <div className='place-select-list'>
            <CheckboxGroup
              onChange={this.onChange}
              value={cancelIds}
            >
              {list.map(v => (
                <div className='p-item'>
                  <Checkbox
                    value={v.id}
                  >
                  </Checkbox>
                  <IconFont
                    type='icon-Place_Dark'
                  />
                  {v.areaName}
                  <IconFont 
                    className='close'
                    // onClick={del && del}
                    onClick={(e) => del && del(v.id)}
                    type='icon-YesorNo_No_Dark'
                  />
                </div>
              ))}
            </CheckboxGroup>
          </div>
        </div>
      </div>
    )
  }
}