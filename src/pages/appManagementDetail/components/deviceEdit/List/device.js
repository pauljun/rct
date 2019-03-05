/**
 * @desc 分配资源设备分配
 * @author wwj
 */

/**
 * @desc state
 * @param {Array} list 未分配设备列表
 * @param {Array} currentList 已分配设备列表
 * @param {Array} checkedIds 未分配设备选中id
 * @param {Array} cancelCheckedIds 已分配设备选中id
 * @param {Boolean} loading 加载状态
 * @param {Object} searchData 未分配查询条件
 * @param {Object} currentSearchData 已分配查询条件
 * @param {Array} lyGroup 羚羊设备分组
 */

import React from 'react'
import { Button, Spin, message } from 'antd'
import Table from '../components/Table'
import PlaceTree from '../components/PlaceTree'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'

const IconFont = Loader.loadBaseComponent('IconFont')
/**
 * @desc 过滤全部类型 -1情况
 */
const deviceTypesAll = _.flattenDeep(
  Dict.map.communityDeviceType.filter(v => 
    v.value && v.value !== '-1'
  ).map(v => 
    v.value.split(',')
  )
)

@withRouter
class OperationCenterDevice extends React.Component {
  constructor(props){
    super(props)
    this.ocId = Utils.queryFormat(props.location.search).id
    this.state = {
      list: [],
      currentList: [],
      checkedIds: [],
      cancelCheckedIds: [],
      loading: true,
      searchData: {
        offset: 0,
        limit: 100000,
        deviceTypes: ['-1'],
        distributionState: 2
      },
      currentSearchData: {
        offset: 0,
        limit: 100000,
        deviceTypes: ['-1'],
        distributionState: 1
      },
      lyGroup: [],
    }
  }

  componentWillMount(){
    this.updateAllData()
    this.queryDeviceGroup()
  }

    /**
   * @desc 获取羚羊设备分组
   */
  queryDeviceGroup = () => {
    Service.device.queryDeviceGroup()
      .then(res => {
        this.setState({
          lyGroup: res.data.groups
        })
      })
  }

  /**
   * @desc 修改查询条件 searchData:未分配设备 currentSearchData：已分配设备
   */
  updateSearchData = (type = 'searchData', options) => {
    let searchData = Object.assign({}, this.state[type], options)
    this.setState({
      loading: true,
      [type]: searchData
    }, () => {
      this.queryDevices(type)
      .then(res => {
        this.setState({
          [type === 'searchData' ? 'list' : 'currentList']: res.data.list,
          loading: false
        })
      }).catch(() => {
        message.error('查询失败')
        this.setState({
          loading: false
        })
      })
    })
  }

  /**
   * @desc 综合同步更新两侧数据
   */
  updateAllData = () => {
    const { setPlaceIds } = this.props
    this.setState({
      loading: true
    })
    Promise.all([
      this.queryDevices(),
      this.queryDevices('currentSearchData')
    ]).then(result => {
      this.setState({
        list: result[0].data.list,
        currentList: result[1].data.list,
        loading: false
      })
      if(setPlaceIds){
        /**场所id */
        let placeIds = []
        result[1].data.list.map(v => placeIds.push(v.placeIds))
        setPlaceIds([...new Set(_.flatten(placeIds))])
      }
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

  /**
   * @desc 查询设备 searchData: 未分配 currentSearchData:已分配
   */
  queryDevices = (type = 'searchData') => {
    let searcData = this.state[type]
    if(searcData.deviceTypes[0] === '-1'){
      searcData.deviceTypes = deviceTypesAll
      //车辆归属抓拍机
      searcData.deviceTypes.push('100607')
    }else{
      searcData.deviceTypes = _.flatten(searcData.deviceTypes.map(v => v.split(',')))
      if(searcData.deviceTypes[0] === '100603'){
        searcData.deviceTypes.push('100607')
      }
    }
    return Service.device.queryDevicesByOperationCenter({
      operationCenterId: this.ocId,
      ...this.state[type]
    })
  }

  /**
   * @desc 分配设备到应用系统/从应用系统解除分配 type update: 分配 cancel : 取消分配
   */
  updateOperationCenterDevices = (type = 'update') => {
    this.setState({
      loading: true
    })
    Service.device.updateOperationCenterDevices({
      [type === 'update' ? 'inDeviceIds' : 'outDeviceIds']: type === 'update' ? this.state.checkedIds : this.state.cancelCheckedIds,
      operationCenterId: this.ocId
    }).then(() => {
      message.success('操作成功')
      this.updateAllData()
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
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
   * @desc 选择场所查询
   */
  onSelect = placeIds => {
    this.updateSearchData('searchData', {
      placeIds
    })
  }

  render(){
    const { list, currentList, checkedIds, cancelCheckedIds, loading, lyGroup, searchData } = this.state
    return (
      <div className='list-tb-container'>
        <Spin spinning={loading}>
          <div className='device-tlt'>
            <span className='fl'>未分配设备：</span>
            <span className='fr'>已分配设备（{currentList.length}个）</span>
          </div>
          <div className='device-edit-container'>
            <PlaceTree 
              onSelect={this.onSelect}
              activeKey={searchData.placeIds}
            />
            <div className='tb'>
              <Table
                list={list}
                checkedIds={checkedIds}
                onChecked={this.onChecked}
                lyGroup={lyGroup}
                onChange={this.updateSearchData}
                type='searchData'
              />
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
            <div className='tb'>
              <Table 
                list={currentList}
                checkedIds={cancelCheckedIds}
                onChecked={this.onCancelChecked}
                onChange={this.updateSearchData}
                lyGroup={lyGroup}
                type='currentSearchData'
              />
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}

export default OperationCenterDevice