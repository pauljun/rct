import React, {Component} from 'react'
import moment from 'moment'
import { Popover, Icon, Button } from 'antd'
import './index.less'

const IconFont = Loader.loadBaseComponent('IconFont')

// 以图搜图选中列表组件

const SelectListPopoverContent = ({ 
  selectList, 
  onDelete, 
  setPopoverVisible, 
  openDiaDetail,
  type = 'face'
}) => {
  let listContent
  if (!selectList.length){
    listContent = (
      <p className='select-popover-nodata'>暂未选择图片</p>
    )
  } else {
    listContent = (
      <ul className='select-popover-list'>
        {selectList.map((v,k) => (
            <li className='list-item' key={v.id}>
              <div className="img-box" data-img={`${v[type + 'Url']}`} style={{
                backgroundImage: `url(${v[type + 'Url']})`
              }}>
              </div>
              <div className="info-list" onClick={() => openDiaDetail(v, k)}>
               <p className='item-name' title={v.cameraName}>{v.cameraName}</p>
               <p className='time'>{v.captureTime && moment(parseInt(v.captureTime,10)).format('YYYY.MM.DD HH:mm:ss')}</p>
              </div>
              <span className='item-btns'>
                <IconFont 
                  className='item-delete' 
                  type='icon-Delete_Main' 
                  title={'取消选中'} 
                  onClick={() => onDelete(k)} 
                /> 
              </span>     
            </li>
          )
        )}
      </ul>
    )
  }
  return (
    <div className='select-popover'>
      <p className='select-popover-title clearfix'>
        <span className='fl'>已选人员</span>
        <Icon type="close" className="fr close_btn" onClick={() => setPopoverVisible(false)}/>
      </p>
      {listContent}
    </div>
  )
}

class SelectListPopover extends Component {
  state = {
    visible: false
  }
  // 设置popover显示状态
  setPopoverVisible = (visible) => {
    this.setState({ visible })
  }
  render() {
    const { selectList = [], del, type } = this.props
    return (
      <Popover
        overlayClassName="popover_content_list"
        trigger="click"
        placement='bottom'
        visible={this.state.visible}
        onVisibleChange={this.setPopoverVisible}
        content={
          <SelectListPopoverContent 
            selectList={selectList}         
            onDelete={id => del(id)}
            type={type}
            setPopoverVisible={this.setPopoverVisible}
          />
        }
      >
        <Button className='baselib-select-list-toggle'>
          <IconFont type='icon-Select_Choosed_Main'/>
          已选 {selectList.length} 个
        </Button>
      </Popover>
    )
  }
} 

export default SelectListPopover