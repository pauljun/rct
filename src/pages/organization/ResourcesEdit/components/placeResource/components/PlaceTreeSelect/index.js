import React from 'react'
import './index.less'
import { Button } from 'antd'

const Tree = Loader.loadBusinessComponent('PlaceTree')

class PlaceTree extends React.Component {

  disableCheckbox = (node) => {
    const {disableKeys}=this.props
      let value=false
      disableKeys&&disableKeys.filter(v => {
        if(v==node.placeId){
          value=true
        }
      })
      return value
  }
  render(){
    const {
      checkedKeys = [],
      onCheck,
      submit,
      treeData,
      title='',
      disableKeys
    } = this.props

    

    return (
      <div>
        {title}
        <div className='place-tree-select select-container'>
          <div className='th'>场所列表</div>
          <Tree 
            checkable={true}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            disableKeys={disableKeys}
            disableCheckbox={this.disableCheckbox}
            // treeData={treeData}
            // selfTreeData={true}
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
      </div>
    )
  }
}

export default PlaceTree