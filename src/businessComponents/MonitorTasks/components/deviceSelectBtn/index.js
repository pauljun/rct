import React from 'react'
import { Button } from 'antd'
import './index.less'
const IconFont = Loader.loadBaseComponent('IconFont')
const DeviceSelectBtn = ({type, changeType}) => {
  return (
    <div className="device-select-btn">
      <Button className={`btn ${type === 1 && 'active'}`} onClick={() => changeType(1)}><IconFont type="icon-List_Map_Main"/>地图模式</Button>
      <Button className={`btn ${type === 2 && 'active'}`} onClick={() => changeType(2)}><IconFont type="icon-List_Tree_Main"/>列表模式</Button>
    </div>
  )
}
export default DeviceSelectBtn