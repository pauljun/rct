import React from 'react'
import { Spin, message ,Button, Checkbox} from 'antd'
import PlaceTreeSelect from './components/PlaceTreeSelect'
import { withRouter } from 'react-router-dom'
import SelectList from './components/PlaceSelectList'
import './index.less'

@withRouter
@Decorator.businessProvider('place','deviceManagement')
class OperationCenterDevice extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      list: [],
      currentList: [],
      checkedKeys: [],
      loading: false,
      treeData:[],
      selectListKey:Math.random()
    }
  }

  componentWillMount(){
    this.getCurrentList()
  }
  upDateSelectList = (searchData) => {
    this.getCurrentList(searchData.keywords)

  }
 getCurrentList = (searchData='') => {
  const {data} = this.props
  const options = {
    organizationId :data.id,
    keywords:searchData
  }
  Service.organization.queryPlacesByOrganizationId(options)
    .then(res => {
      this.setState({
        selectListKey:Math.random(),
        loading: false,
        currentList: res.data,
        checkedKeys: res.data.length>0?res.data.map(v => v.areaCode):[]
      })
    })
 }

  /**
   * @desc 未分配设备选择
   */
  onCheck = checkedKeys => {
    return new Promise(resolve => this.setState({checkedKeys}, () => resolve()))
  }
//取消分配
cancelOrgPlaces = (cancelInfo) => {
  this.submit('cancle',cancelInfo&&cancelInfo)
}
  /**
   * @desc 确认分配 type=confirm 分配  cancle 取消分配
   */
  submit = ( type='confirm' ,PlaceIds=[] ) => {
    const { checkedKeys } = this.state
    const {data}=this.props
    const {place}=this.props
    let deleteProvinceIds = []
    let addProvinceIds=[]
    if(type=='cancle'){
      deleteProvinceIds=PlaceIds
    }else{
      checkedKeys.map(v => {
        place.placeArray.find( p => {
          if(p.id==v){
            addProvinceIds.push(p.placeId)
          }
        })
      })
    }
    this.setState({
      loading: true
    })
    Service.organization.updateOrganizationPlaces({
      organizationId: data.id,
      addPlaceIds: addProvinceIds,
      deletePlaceIds:deleteProvinceIds
    }).then(() => {
      message.success('分配成功')
      this.getCurrentList()
    }).catch(() => {
      this.setState({
        loading: false
      })
      message.error('分配失败!')
    })
  }

  render(){
    const { selectListKey,checkedKeys, loading, currentList = [],treeData} = this.state
    return (
      <div className='org-place-tb-container'>
        <Spin spinning={loading}>
          <div className='device-edit-container'>
            <PlaceTreeSelect 
              title={<span className='device-tlt'>全部场所：</span>}
              onCheck={this.onCheck}
              checkedKeys={checkedKeys}
              disableKeys={!!currentList.length&&currentList.map(v => v.id)}
              submit={this.submit}
              treeData={treeData}
            />
            <div>
            <span className='device-tlt'>已分配场所（{currentList.length}个）</span> 
            <div className='place-tree-list'>
              <div className='org-place-list'>
                <SelectList 
                  searchChange={ (keyWords) => this.upDateSelectList(keyWords)}
                  key={selectListKey}
                  list={currentList}
                  del={this.cancelOrgPlaces}
                />
              </div>
            </div>
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}
export default OperationCenterDevice;
