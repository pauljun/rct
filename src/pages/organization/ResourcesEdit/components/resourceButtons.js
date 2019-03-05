import React from 'react';
import DeviceResource from './deviceResource/'
import PlaceResource from './placeResource/'
import AreaResource from './areResource/'
import {Button}from 'antd'

class ResourceButtons extends React.Component {
  componentDidMount = () => {
    this.goResourceList('devices')
  }
  state={
    resourceContent:null
  }
  goResourceList = (type) => {
    const {data}=this.props
    let resourceContent=null
    this.defaultClass=''
    switch(type){
      case 'devices':
      this.defaultClass='devices-active'
        resourceContent = <DeviceResource data={data}/>
				break
      case 'places':
        resourceContent = <PlaceResource data={data}/>
				break
      case 'areas':
        resourceContent = <AreaResource data={data}/>
				break
			default:
				break
    }
    this.setState({
      resourceContent
    })
  }
  render() {
    const { resourceContent } = this.state
    return (
     <div>
       <div className='org-resource-buttons'>
        <Button onClick={() => this.goResourceList('devices')} icon={'plus'} className={this.defaultClass}> 分配设备</Button>
        <Button onClick={() => this.goResourceList('places')} icon={'plus'}>分配场所</Button>
        <Button onClick={() => this.goResourceList('areas')} icon={'plus'}>分配小区</Button>
       </div>
       <div >
          { resourceContent }
       </div>
     </div>
    );
  }
}

export default ResourceButtons;