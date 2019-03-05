import React from 'react'
import { Button, message, Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import TableView from '../../components/Table'
const IconFont = Loader.loadBaseComponent('IconFont')

@withRouter
class DeviceView extends React.Component {
  constructor(props){
    super(props)
    this.ocId = Utils.queryFormat(props.location.search).id
  }
  /**
   * @state
   * @param {Array} currentList 已分配设备
   * @param {Array} cancelCheckedIds 取消选中id
   * @param {Array} checkedIds 分配选中id
   */
  state = {
    currentList: [],
    cancelCheckedIds: [],
    checkedIds: [],
    loading: true,
    key: Math.random(),
    selectKey: Math.random()
  }

  componentWillMount(){
    this.queryDevices()
  }

  /**
   * @desc 未分配设备选择
   */
  onChecked = checkedIds => {
    return new Promise(resolve => this.setState({checkedIds}, () => resolve()))
  }

  /**
   * @desc 已分配设备选择
   */
  onCancelChecked = cancelCheckedIds => {
    return new Promise(resolve => this.setState({cancelCheckedIds}, () => resolve()))
  }

  /**
   * @desc 分配设备到应用系统/从应用系统解除分配 type update: 分配 cancel : 取消分配
   */
  updateOperationCenterDevices = (type = 'update') => {
    const { onChange, currentList } = this.props
    this.setState({
      loading: true
    })
    Service.device.updateOperationCenterDevices({
      [type === 'update' ? 'inDeviceIds' : 'outDeviceIds']: type === 'update' ? this.state.checkedIds : this.state.cancelCheckedIds,
      operationCenterId: this.ocId
    }).then(() => {
      message.success('操作成功')
      this.queryDevices()
      if(type === 'cancel'){
        this.setState({
          cancelCheckedIds: [],
          selectKey: Math.random()
        })
      }else{
        this.setState({
          checkedIds: [],
          key: Math.random()
        })
      }
      onChange && onChange({list: type === 'cancel' ? currentList : []}, true)
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

    /**
   * 查询已分配设备
   */
  queryDevices = () => {
    Service.device.queryDevicesByOperationCenter({
      operationCenterId: this.ocId,
      offset: 0,
      limit: 100000,
      distributionState: 1
    }).then(res => {
      this.setState({
        currentList: res.data.list,
        loading: false
      })
    })
  }

  render(){
    const { currentList, cancelCheckedIds, checkedIds, loading, selectKey, key} = this.state
    const { selectList = [] } = this.props
    return (
      <div className='container'>
        <Spin spinning={loading}>
          <div className='c-t'>
            <div className='place-tree-select'>
              <div className='place-tree-container'>
                <TableView 
                  key={key}
                  list={selectList}
                  checkedIds={checkedIds}
                  onChecked={this.onChecked}
                  isSimple={true}
                />
              </div>
            </div>
          </div>
          <div className='btn-group'>
            <div>
              <Button 
                type='primary' 
                disabled={!!!checkedIds.length}
                onClick={() => this.updateOperationCenterDevices()}
              >
                <IconFont type='icon-Arrow_Big_Right_Main' />
                <div>分配</div>
              </Button>
              <Button 
                disabled={!!!cancelCheckedIds.length}
                onClick={() => this.updateOperationCenterDevices('cancel')}
              >
                <IconFont type='icon-Arrow_Big_Left_Main' />
                <div>取消</div>
              </Button>
            </div>
          </div>
          <div className='c-t'>
            <div className='place-tree-select'>
              <div className='place-tree-container'>
                <TableView 
                  key={selectKey}
                  list={currentList}
                  checkedIds={cancelCheckedIds}
                  onChecked={this.onCancelChecked}
                  isSimple={true}
                />
              </div>
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}

export default DeviceView