import React from 'react'
import './index.less'
import { observer, inject } from 'mobx-react'

const Tree = Loader.loadBaseComponent('Tree')
const IconFont = Loader.loadBaseComponent('IconFont')

@inject('place')
@observer
class PlaceTree extends React.Component {
  render(){
    const {
      place,
      disableKeys = []
    } = this.props
    const treeData = Utils.computTreeList(place.placeArray)
    return (
      <div className='place-tree-container'>
        <Tree 
          treeData={treeData}
          defaultCheckedKeys={disableKeys}
          treeNodeProps={{
            treeNodeIcon: node => (
              <IconFont 
                data-level={node.level}
                type={node.level >= 5 ? 'icon-Place_Dark' : 'icon-Add_Light'}
              />
            ),
            key: 'placeId',
            disableCheckbox: node => disableKeys.indexOf(node.placeId) > -1 ? true : false
            
          }}
          {...this.props}
        />
      </div>
    )
  }
}

export default PlaceTree