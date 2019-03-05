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
 * @param {String} placeIds 选中场所id
 */

import React from 'react'
import { Button, Spin, message } from 'antd'
import Table from './components/Table'
import PlaceTree from './components/PlaceTree'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { intersection, remove, differenceBy, uniqBy, orderBy,union } from 'lodash';
import { async } from 'q';
import '../../index.less'

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
@Decorator.businessProvider('place')
class DeviceResource extends React.Component {
  constructor(props){
    super(props)
    this.refTable = React.createRef();
    this.state = {
      list: [],
      currentList: [],
      deviceList:[],
      checkedIds: [],
      cancelCheckedIds: [],
      loading: true,
      lyGroup: [],
      NewTreeData:[],
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
    this.setState({
      loading: true,
    }, () => {
      this.queryDevices(type,options)
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
  updateAllData = async () => {
    const { place }=this.props
    let placeIds=[]
    let ids=[]
    this.setState({
      loading: true
    })
    await Promise.all([
      this.queryDevices(),
      this.queryDevices('currentSearchData')
    ]).then(result => {
      const deviceList = result[0].data.list
      const currentList = result[1].data.list;
      deviceList.map(v => {
        if(v.placeId){
          placeIds = [].concat(placeIds, v.placeId);
        }
      })
      placeIds = union(placeIds);
      let placeInfos=place.getPlaceInfoByIds(placeIds)
      placeInfos.map(v => {
        ids.push(v.areaCode)
      })
      let allPlaceInfos=place.getParentPlaceListByIds(ids)
      let allPlaceIds = []
      allPlaceInfos.map(v => {
        allPlaceIds.push(v.placeId)
      })

      let NewTreeData = Utils.computTreeList(place.getPlaceInfoByIds(allPlaceIds))
      NewTreeData=this.changeTreeDataId(NewTreeData)
      this.setState({
        NewTreeData,
        list: deviceList,
        deviceList,
        currentList,
        loading: false
      })
    }).catch((err) => {
      this.setState({
        loading: false
      })
    })
}

changeTreeDataId = (treeData) => {
  treeData.map(v => {
    v.id=v.placeId
    if(v.children){
      this.changeTreeDataId(v.children)
    }
  })
  return treeData
}

  /**
   * @desc 查询设备 searchData: 未分配 currentSearchData:已分配
   */
  queryDevices = (type = 'searchData',options) => {
    let orgIds = []
    const {data}=this.props
    if(type=='searchData'){
      orgIds=[data.parentId]
    }else{
      orgIds=[data.id]
    }
    let searchData={
      offset: 0,
      limit: 100000,
      orgIds
    }
    searchData=Object.assign({} , searchData,options)
    return Service.device.deviceListByOrganization(searchData)
  }

  /**
   * @desc 分配设备到应用系统/从应用系统解除分配 type update: 分配 cancel : 取消分配
   */
  updateOperationCenterDevices = (type = 'update') => {
    const {data} = this.props
    const {checkedIds ,cancelCheckedIds} = this.state
    let options={}
    let checkedOrCanceledIds=[]
    let fromOrganizations=[];
    let toOrganizationId=[]
    if(type =='update'){
      checkedOrCanceledIds=checkedIds
      !!checkedOrCanceledIds.length&&checkedOrCanceledIds.map(v => {
        options={
          'deviceId':v,
          'fromOrganizationId':data.parentId
        }
        fromOrganizations.push(options)
      } )
      toOrganizationId=data.id
    }else{
      checkedOrCanceledIds=cancelCheckedIds
      !!checkedOrCanceledIds.length&&checkedOrCanceledIds.map(v => {
        options={
          'deviceId':v,
          'fromOrganizationId':data.id
        }
        fromOrganizations.push(options)
      })
      toOrganizationId=data.parentId
    }

    this.setState({
      loading: true
    })
    Service.device.updateOrganizationDevicesBatch({
     fromOrganizations,
     toOrganizationId
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

  computedList(list, placeId) {
    const { noSoldier = false } = this.props;
    let newList = [];
    if (noSoldier) {
      list = list.filter(v => v.deviceType !== Dict.map.db.value);
    }
    if (!placeId) {
      newList = list;
    } else {
      newList = list.filter(item => {
        return placeId.indexOf(item.placeId) > -1;
      });
    }
    return newList;
  }

  /**
   * @desc 选择场所查询
   */
  onSelect = placeIds => {
    const { deviceList } = this.state;
    const list = this.computedList(deviceList, placeIds[0]);
    this.setState({
      placeIds,
      list,
    }, this.refTable.current.forceUpdateGrid); 
  }

  render(){
    const { 
      list, currentList, checkedIds, cancelCheckedIds, loading, 
      lyGroup, placeIds ,NewTreeData
    } = this.state;
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
              activeKey={placeIds}
              treeData={NewTreeData}
            />
            <div className='tb'>
              <Table
                ref={this.refTable}
                list={list}
                checkedIds={checkedIds}
                onChecked={this.onChecked}
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
                type='currentSearchData'
              />
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}


export default DeviceResource;
