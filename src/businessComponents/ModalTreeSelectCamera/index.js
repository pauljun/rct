import React from 'react'
import './index.less'
const ModalComponent = Loader.loadBaseComponent('ModalComponent')
const TreeSelectCamera = Loader.loadBusinessComponent('TreeSelectCamera')

class ModalSelectMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectList: props.selectList || []
    }
  }
  onChange = list => {
    this.setState({ selectList: list })
  }
  submitSelect = () => {
    const { selectList } = this.state
    this.props.onOk && this.props.onOk(selectList)
    return Promise.resolve()
  }
  render() {
    const { title = '设备选择', width = 1000,...props } = this.props
    return (
      <ModalComponent
        {...props}
        title={title}
        width={width}
        className='modal-org-tree-select'
        onOk={this.submitSelect}
        disabled={this.state.selectList.length === 0}
      >
        <TreeSelectCamera
          selectList={this.state.selectList}
          onChange={this.onChange}
        />
      </ModalComponent>
    )
  }
}

export default ModalSelectMap
