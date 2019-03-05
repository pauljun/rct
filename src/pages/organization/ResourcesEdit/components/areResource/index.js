/**
 * @desc 分配资源小区分配
 * @author wwj
 */

/**
 * @desc state
 * @param {Array} list 未分配小区列表
 * @param {Array} currentList 已分配小区列表
 * @param {Array} checkedIds 未分配小区选中id
 * @param {Array} cancelCheckedIds 已分配小区选中id
 * @param {Boolean} loading 加载状态
 * @param {Object} searchData 未分配查询条件
 * @param {Object} currentSearchData 已分配查询条件
 * @param {Array} lyGroup 羚羊小区分组
 * @param {String} placeIds 选中场所id
 */

import React from 'react'
import { Button, Spin, message } from 'antd'
import Table from './components/Table'
import './index.less'
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
@Decorator.businessProvider('place')
class AreResource extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      list: [],
      currentList: [],
      checkedIds: [],
      cancelCheckedIds: [],
      loading: true,
      lyGroup: [],
    }
  }

  componentWillMount(){
    this.updateAllData()
    this.queryDeviceGroup()
  }

    /**
   * @desc 获取羚羊小区分组
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
   * @desc 修改查询条件 searchData:未分配小区 currentSearchData：已分配小区
   */
  updateSearchData = (type = 'searchData', options) => {
    this.setState({
      loading: true,
    }, () => {
      this.queryAreas(type,options)
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
    this.setState({
      loading: true
    })
    Promise.all([
      this.queryAreas(),
      this.queryAreas('currentSearchData')
    ]).then(result => {
      this.setState({
        list: result[0].data.list,
        currentList: result[1].data.list,
        loading: false
      })
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

  /**
   * @desc 查询小区 searchData: 未分配 currentSearchData:已分配
   */
  queryAreas = (type = 'searchData',options) => {
    let incomingOrganizationId = ' '
    const {data}=this.props
    if(type=='searchData'){
      incomingOrganizationId=data.parentId
    }else{
      incomingOrganizationId=data.id
    }
    let searchData={
      offset: 0,
      limit: 100000,
      incomingOrganizationId,
      containSuborganization:false
    }
    searchData=Object.assign({} , searchData,options)
    return Service.community.queryVillages(searchData)
  }

  /**
   * @desc 分配小区到应用系统/从应用系统解除分配 type update: 分配 cancel : 取消分配
   */
  updateOrgAreas = (type = 'update') => {
    const {data} = this.props
    const {checkedIds ,cancelCheckedIds} = this.state
    let options={}
    if(type =='update'){
      options={
        targetOrganizationId:data.id,
        villageIds:checkedIds
      }
    }else{
      options={
        targetOrganizationId:data.parentId,
        villageIds:cancelCheckedIds
      }
    }

    this.setState({
      loading: true
    })
    Service.community.assignViillage(options).then(() => {
      message.success('操作成功')
      this.updateAllData()
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

  /**
   * @desc 未分配小区选择
   */
  onChecked = checkedIds => {
    return new Promise(resolve => this.setState({checkedIds}, () => resolve()))
  }

  /**
   * @desc 已分配小区选择
   */
  onCancelChecked = cancelCheckedIds => {
    return new Promise(resolve => this.setState({cancelCheckedIds}, () => resolve()))
  }

  /**
   * @desc 选择场所查询
   */
  onSelect = placeIds => {
    const {place}=this.props
    let provinceIds=[]
    place.placeTreeData.map(v => {
      if(v.id==placeIds){
        provinceIds.push(v.provinceId)
      }
    })
    this.updateSearchData('searchData', {
      placeIds:provinceIds
    })
  }

  render(){
    const { list, currentList, checkedIds, cancelCheckedIds, loading, lyGroup, placeIds } = this.state;
    return (
      <div className='org-area-resource-container'>
        <Spin spinning={loading}>
          <div className='area-edit-container'>
           <div className='org-area-table-left'>
            <span className='device-tlt'>全部场所：</span>
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
           </div>
            <div className='btn-group'>
              <div>
                <Button 
                  type='primary' 
                  disabled={!!!checkedIds.length}
                  onClick={() => this.updateOrgAreas()}
                >
                  <IconFont type='icon-Arrow_Big_Right_Main' />
                  <div>分配</div>
                </Button>
                <Button 
                  disabled={!!!cancelCheckedIds.length}
                  onClick={() => this.updateOrgAreas('cancel')}
                >
                  <IconFont type='icon-Arrow_Big_Left_Main' />
                  <div>取消</div>
                </Button>
              </div>
            </div>
            <div className='org-area-table-right'>
              <span className='device-tlt'>已分配小区（{currentList.length}个）</span>
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

          </div>
        </Spin>
      </div>
    )
  }
}




export default AreResource;
