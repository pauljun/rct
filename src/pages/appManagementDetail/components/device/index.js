import React from 'react'
import { observer } from 'mobx-react'
import Table from './components/table'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import './styles/index.less'
import _ from 'lodash'

const { MapComponent } = LMap
const IconFont = Loader.loadBaseComponent('IconFont')
const SearchInput = Loader.loadBusinessComponent('SearchInput')
const SystemWrapper = Loader.loadBusinessComponent('SystemWrapper')

const deviceTypes = _.flattenDeep(
  Dict.map.communityDeviceType.filter(v => v.value && v.value !== '-1').map(v =>
    v.value.split(',')
  )
)

@withRouter
@Decorator.businessProvider('operationDetail', 'tab', 'device', 'operation')
@observer
class operationDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      list: [],
      points:[],//所有已分配设备
      total: 10,
      loading: false,
      deviceGroup: [], // 设备分组(全部分组)
      type: 1
    }
    this.communityRef = React.createRef()
    this.queryDeviceList()
  }

  /**
   * @desc 获取所有已分配设备展示在地图模式上
   */
  queryDeviceList() {
    const { ocId } = this.props
    Service.device.queryCameraListByOcId({
      operationCenterIds: [ocId],
      deviceTypes,
      pageSize: 100000,
      page: 1
    }).then(res => {
      this.setState({
        points: res.result.resultList,
      })
    })
  }
  
  componentWillMount() {
    const { location } = this.props
    let params = Utils.queryFormat(location.search)
    this.ocId = params.id
    this.search()

    /**获取羚羊云设备分组 */
    Service.device.queryLingyangOrgs().then(res => {
      this.setState({
        deviceGroup: res.result.groups
      })
    })
  }

  /**
   * @desc 搜索 
   */
  search = () => {
    const { ocId, operationDetail } = this.props
    this.setState({
      loading: true
    })
    Service.device.queryCameraListByOcId({
      operationCenterIds: [ocId],
      ...operationDetail.searchData
    }).then(res => {
      this.setState({
        total: res.result.resultSize,
        loading: false,
        list: res.result.resultList
      })
    })
  }

  /**
   * @desc 修改查询条件
   * @param {Object} options
   */
  editSearchData = options => {
    const { operationDetail } = this.props
    operationDetail.mergeSearchData(options)
    this.search()
  }

  /**
   * @desc 分页查询
   * @param {Number} page
   * @param {Number} pageSize
   */
  onChange = (page, pageSize) => {
    this.editSearchData({ page, pageSize })
  }

  /**
   * @desc 切换模式
   */
  changeType = type => {
    if (this.state.type !== type) {
      this.setState({ type })
    }
  }

  render() {
    const { operationDetail, changeModel } = this.props
    const { searchData } = operationDetail
    const { list, total, loading, deviceGroup, type, points} = this.state
    return (
      <React.Fragment>
        <SystemWrapper className='operation-device-wrapper'>
          <div className='operation-device-model'>
            <Button
              onClick={this.changeType.bind(this, 1)}
              type={type === 1? 'primary' : 'default'}
            >
            <IconFont type="icon-List_Tree_Main" />
              列表模式
            </Button>
            <Button
              type={type === 2? 'primary' : 'default'}
              onClick={this.changeType.bind(this, 2)}
            >
            <IconFont type="icon-List_Map_Main" />
              地图模式
            </Button>
            <Button
              onClick={changeModel}
              className='edit-icon'
            >
              <IconFont type='icon-Edit_Main'/>
            </Button>
          </div>
          {
            type === 1?(
              <div className='tb-container'>
                <div className='search'>
                  <SearchInput 
                      placeholder="请输入您想搜索的设备名称"
                      onChange={value =>
                        this.editSearchData({
                          deviceName: value,
                          page: 1
                        })
                      }
                    />
                </div>
                <Table
                  key="has-device-list"
                  total={total}
                  searchData={searchData}
                  dataSource={list}
                  loading={loading}
                  onChange={this.onChange}
                  deviceGroup={deviceGroup}
                  scroll={{ y: 400 }}
                />
              </div>
            ):(
              <MapComponent 
                points={points} 
                showVideoView={false} 
                ref={this.communityRef} 
                changeZoom={true} 
              />
            )
          }
        </SystemWrapper>
      </React.Fragment>
    )
  }
}

export default operationDetail