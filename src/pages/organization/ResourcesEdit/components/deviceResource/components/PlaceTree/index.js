import React from 'react'
import './index.less'

const PlaceTree = Loader.loadBusinessComponent('PlaceTree')
class PlaceList extends React.Component {
  render(){
    const {
      onSelect,
      activeKey,
      treeData=[]
    } = this.props
    return (
      <div className='organization-place-tree'>
        <div className='th'>场所列表</div>
          <PlaceTree 
            selfTreeData={true}
            treeData={treeData}
            onSelect={onSelect}
            activeKey={activeKey}
            type='orgTree'
          />
      </div>
    )
  }
}

export default PlaceList