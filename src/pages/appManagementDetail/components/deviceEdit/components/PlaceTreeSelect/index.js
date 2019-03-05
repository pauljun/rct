import React from 'react'
import './index.less'
import { Button } from 'antd'

const Tree = Loader.loadBaseComponent('PlaceComponents', 'PlaceTree')

class PlaceTree extends React.Component {
  render(){
    const {
      checkedKeys = [],
      onCheck,
      submit,
      currentList = [],
      disableKeys
    } = this.props
    return (
      <div className='place-tree-select select-container'>
        <div className='th'>场所列表</div>
        <Tree 
          checkable={true}
          checkedKeys={checkedKeys.concat(currentList.map(v => v.id))}
          disableKeys={disableKeys}
          onCheck={onCheck}
        />
        <div className='footer-sure'>
          <Button 
            type='primary'
            onClick={submit}
            disabled={!checkedKeys.length}
          >
            确认分配
          </Button>
        </div>
      </div>
    )
  }
}

export default PlaceTree