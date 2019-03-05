import React from 'react'
import List from './List'
import './index.less'
import { Button } from 'antd';
import Map from './Map'
const IconFont = Loader.loadBaseComponent('IconFont')

export default 
class OperationCenterDevice extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isMap: false
    }
  }
  render(){
    const { isMap } = this.state
    return (
      <div className='device-sollot-container'>
        <div className='change-model-group'>
          <Button 
            type='primary'
            onClick={() => this.setState({isMap: !isMap})}
          >
            <IconFont type={`icon-${!isMap ? 'List_Tree_Main' : 'List_Map_Main'}`} />
            {!isMap ? '地图分配' : '列表模式'}
          </Button>
        </div>
        {!isMap ? <List /> : <Map />}
      </div>
    )
  }
}