import React from 'react'
import { Spin, message } from 'antd'
import PlaceTreeSelect from '../components/PlaceTreeSelect'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
const SelectList = Loader.loadBusinessComponent('PlaceComponents', 'SelectList')
const ConfirmComponent = Loader.loadBaseComponent('ConfirmComponent')

@withRouter
class OperationCenterDevice extends React.Component {
  constructor(props){
    super(props)
    this.ocId = Utils.queryFormat(props.location.search).id
    this.state = {
      list: [],
      currentList: [],
      checkedKeys: [],
      loading: true,
      handleVisible: false,
      cancelIds: []
    }
  }

  componentWillMount(){
    this.queryList()
  }

  /**查询已分配场所 */
  queryList = () => {
    Service.operation.queryPlacesByOperationCenterId(this.ocId)
      .then(res => {
        this.setState({
          currentList: res.data,
          loading: false
        })
      })
  }

  /**
   * @desc 未分配设备选择
   */
  onCheck = checkedKeys => {
    return new Promise(resolve => this.setState({checkedKeys}, () => resolve()))
  }

  /**
   * @desc 确认分配/ 取消分配
   * @param {Boolean} isCancel true: 取消分配, false：确认分配
   */
  submit = (isCancel = false) => {
    const { checkedKeys, currentList } = this.state
    const { cancelSelect, placeIds = [] } = this.props
    this.setState({
      loading: true
    })
    Service.operation.updateOperationCenterPlaces({
      operationCenterId: this.ocId,
      [!isCancel ? 'addPlaceIds' : 'deletePlaceIds'] :!isCancel ? _.difference([...new Set(checkedKeys.concat(placeIds))], currentList.map(v => v.id)) : [this.state.delId]
    }).then(() => {
      message.success('操作成功')
      this.queryList()
      if(!isCancel){
        cancelSelect && cancelSelect()
      }
      this.setState({
        handleVisible: false
      })
    }).catch(() => {
      this.setState({
        loading: false,
        handleVisible: false
      })
      message.error('分配失败!')
    })
  }

  del = delId => {
    this.setState({
      handleVisible: true,
      delId
    })
  }

  onModalCancel = () => {
    this.setState({
      handleVisible: false
    })
  }

  /**取消分配选中id */
  cancelChecked = ids => {
    this.setState({
      cancelIds: ids
    })
  }

  render(){
    const { checkedKeys, loading, currentList = [], handleVisible, cancelIds } = this.state
    const { placeIds = [] } = this.props
    const disableKeys = currentList.map(v => v.id)
    let keys = [...new Set(checkedKeys.concat(placeIds))]
    keys = _.difference(keys, disableKeys)
    return (
      <div className='place-tb-container'>
        <Spin spinning={loading}>
          <div className='device-tlt'>
            <span className='fl'>全部场所：</span>
            <span className='fr'>已分配场所（{currentList.length}个）</span>
          </div>
          <div className='device-edit-container'>
            <PlaceTreeSelect 
              onCheck={this.onCheck}
              currentList={currentList}
              checkedKeys={keys}
              disableKeys={disableKeys}
              submit={() => this.submit()}
            />
            {/* <PlaceTreeSelect 
              onCheck={this.onCheck}
              currentList={[]}
              checkedKeys={keys}
              submit={() => this.submit()}
            /> */}
              <SelectList 
                list={currentList}
                del={this.del}
                cancelIds={cancelIds}
                cancelChecked={this.cancelChecked}
              />
            
          </div>
        </Spin>
        <ConfirmComponent
          title='是否确认移除该场所?'
          visible={handleVisible}
          onCancel={this.onModalCancel}
          onOk={() => this.submit(true)}
          width={320}
          img='delete'
          children={
            <div></div>
          }
        />
      </div>
    )
  }
}

export default OperationCenterDevice