import React from 'react'
import { Button, Checkbox, message } from 'antd'
import _ from 'lodash'
import SelectListPopover from '../SelectList'
import { withRouter } from 'react-router-dom'
import './index.less'


const IconFont = Loader.loadBaseComponent('IconFont')
/**判断数据是否包含某个数组 */
function isContains(largeList ,list){
  let arr = _.difference(list, largeList)
  return !!!arr.length
}

function getSelectList(list, ids){
  let data = []
  ids.map(v => {
    return data.push(list.find(v1 => v1.id === v))
  })
  return data
}

@withRouter
@Decorator.businessProvider('tab')
class RightHeader extends React.Component {
  constructor(props){
    super(props)
  }

  /**
   * @desc 全选
   */
  checkAll = () => {
    const { listDataIds, checkedIds, onChecked } = this.props
    let ids = []
    //全选
    if(isContains(checkedIds, listDataIds)){
      ids = _.difference(checkedIds, listDataIds)
    }else{
      ids = _.uniq(listDataIds.concat(checkedIds))
    }
    onChecked(ids)
  }

  /**
   * @desc 删除指定id
   */
  del = i => {
    const { checkedIds, onChecked } = this.props
    checkedIds.splice(i, 1)
    onChecked(checkedIds)
  }

  /**
   * @desc 反选
   */
  checkInverse = () => {
    const { listDataIds, checkedIds, onChecked } = this.props
    let ids = []
    ids = _.difference(listDataIds, checkedIds).concat(_.difference(checkedIds, listDataIds))
    onChecked(ids)
  }

  /**
   * @desc 生成轨迹
   */
  setTraject = () => {
    const { tab, location, list, checkedIds, type } = this.props
    if(!checkedIds.length){
      return message.warning('请选择需要生成轨迹的图片！')
    }
    const selectList = getSelectList(list, checkedIds)
    tab.goPage({
      moduleName: 'resourceTrajectory',
      location,
      state: {
        list: selectList,
        type
      }
    })
  }

  render(){
    const { 
      list = [], 
      suffix = '',
      checkedIds 
    } = this.props
    const selectList = getSelectList(list, checkedIds)
    return (
      <div className='module-header-container'>
      <div className='title-right'>
        <span>
          共显示  
          <span className='highlight'>{ list.length }</span>   
          条资源
        </span>
        <span>
          <Checkbox onChange={this.checkAll}>
            <IconFont type='icon-Select_All_Main'/>
            全选
          </Checkbox>
        </span>
        <span>
          <Checkbox onChange={this.checkInverse}>
            <IconFont type='icon-Select_Other_Main'/>
            反选
          </Checkbox>
        </span>
        <span className={`select-list-toggle1-${suffix}`}>
          <SelectListPopover 
            selectList={selectList}
            del={this.del}
          />
        </span>
        <span className='set-trajectory'>
          <Button onClick={this.setTraject}>
            <IconFont type="icon-Trajectory_Main2" />生成轨迹 
          </Button>
        </span>
      </div>
    </div>
    )
  }
}

export default RightHeader