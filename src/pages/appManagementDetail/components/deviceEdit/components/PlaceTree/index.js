import React from 'react'
import './index.less'

const Tree = Loader.loadBaseComponent('PlaceComponents', 'PlaceTree')

class PlaceTree extends React.Component {
  render(){
    const {
      onSelect,
      activeKey
    } = this.props
    return (
      <div className='place-tree'>
        <div className='th'>场所列表</div>
        <Tree 
          onSelect={onSelect}
          selectedKeys={activeKey}
        />
      </div>
    )
  }
}

export default PlaceTree