import React from 'react'
import { Button,Checkbox} from 'antd'
import SearchGroup from '../Search'
import './index.less'

const CheckboxGroup = Checkbox.Group
const IconFont = Loader.loadBaseComponent('IconFont')
  class PlaceSelectList extends React.Component{
  state = {
    indeterminate:false,
    checkAll:false,
    checkedList:[]
  }
  onChange = (checkedValues) => {
    const {list}=this.props
    this.setState({
      checkedList:checkedValues,
      checkAll:checkedValues.length==list.length,
      indeterminate:checkedValues.length&&checkedValues.length!=list.length
    })
  }
  onCheckAllChange = (e) => {
    console.log(e,90)
    const {list}=this.props
    let checkedList=[]
    if(e.target.checked){
      list.map(v => {
        checkedList.push(v.id)
      })
    }
    this.setState({
      checkAll:e.target.checked,
      indeterminate: false,
      checkedList
    })
  }
    render(){
      const {indeterminate,checkedList}=this.state
      const {list,del,searchChange}=this.props
      return (
        <div className='place-select-right'>
          <div className='th'>
            <Checkbox 
              indeterminate={indeterminate}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
            />
            场所列表
          </div>
          <div className='place-select-list'>
            <SearchGroup onChange={searchChange}/>
            <div className='place-list'>
            <CheckboxGroup
              onChange={this.onChange}
              value={checkedList}
            >
              {list.map(v => {
                return (
                  <Checkbox value={v.id}>
                    <div className='p-item'>
                        <IconFont
                          type='icon-Place_Dark'
                        />
                        {v.areaName}
                        {/* <IconFont 
                          className='close'
                          // onClick={del && del}
                          onClick={(e) => del && del(v.id)}
                          type='icon-YesorNo_No_Dark'
                        /> */}
                    </div>
                  </Checkbox>
                )
                })}
                </CheckboxGroup>
              </div>
              <div className='place-footer-cancle'>
                <Button 
                  type='primary'
                  onClick={() => {del&&del(checkedList)}}
                >
                  取消分配
                </Button>
              </div>
            </div>
          </div>
      )

    }
  }

  export default PlaceSelectList