import React from 'react'
import { Spin, message,Radio,Checkbox,Button } from 'antd'
import Search from './components/Search.js'
import Table from './components/Table.js'
import './index.less'
const { deviceType}=Dict.map
const SystemWrapper = Loader.loadBusinessComponent('SystemWrapper')
const ModalComponent = Loader.loadBaseComponent('ModalComponent');
const PlaceManagementTree = Loader.loadBusinessComponent("PlaceManagementTree");
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
@Decorator.businessProvider('place', 'resourceManagement')
class resourceManagement extends React.Component {
  state={
    placeArray:[],
    deviceGroup:[],
    loading:false,
    selectedKeys:[],
    list:[],
    total:0,
    visible:false,
    title:'',
    content:'',
    popId:'',
    superId:'',
    checkedList:[],
    modalLoading:false,
    type:1,//1为选择居委会,2位选择场所
  }
  componentWillMount(){
    let placeArray = this.props.place.placeArray
    let treeData = Utils.computPlaceTreeList(placeArray).filter(v => v.deviceCount.count !== 0)
    /**获取羚羊云设备分组 */
    Service.device.queryDeviceGroup().then(res => {
      const result = [].concat([{
        id: undefined,
        name: '全部分组'
      }], res.data.groups ? res.data.groups:[]);
      this.setState({
        deviceGroup: result
      });
    })
    this.setState({
      placeArray,
      selectedKeys:[ treeData[0].placeId]
    })
    this.getDeviceList({
      placeIds: [treeData[0].placeId]
    })
  }
  /**
   * 查询设备列表
   */
  getDeviceList = (options = {}) => {
    const {resourceManagement} = this.props;
    this.setState({loading: true});
    resourceManagement.mergeSearchData(options);
    let searchData = resourceManagement.searchData;
    Service.device.queryDevices(searchData).then(res => {
      let list = res.data.list
      let total = res.data.total
      if (list.length>0){
        let placeIds =list.map(v => {
          return v.placeId
        })
        Service.place.getPlacesByConditions({placeIds}).then(result => {
          list.map((v,k) => {
            v.placeName = result.data.find(v => {
              return v.id === placeIds[k]
            }).areaName
            return list
          })
          this.setState({
            loading: false,
            list,
          });
        })
      }else{
        this.setState({
          loading: false,
          list,
        });
      }
      this.setState({
        total,
      });
    })
  };
  onSelect = (keys, info) => {
    let {selectedKeys} = this.state
    if (info.node.props.eventKey === selectedKeys[0]){
      return
    }
    this.setState({
      selectedKeys: [info.node.props.eventKey]
    },() => {
      this.getDeviceList({
        placeIds: [info.node.props.eventKey]
      })
    })
  }
  distributionPlace = (superId, lowerIds,cb) => {
    Service.place.activeAssociatedPlaces({
      superId,
      lowerIds,
    }).then(res => {
      message.success('分配场所成功')
      Shared.queryPlaceDeviceAndPerson().then(res => {
        let placeArray = this.props.place.placeArray
        this.setState({
          placeArray
        })
        cb()
      })
    })
  }
  typeChange = (value) => {
    this.getDeviceList({
      deviceType: value === '-1'?undefined : value,
      offset:0,
    })
  }
  keyWordChange = (value) => {
    value.offset=0
    this.getDeviceList(value)
  }
  groupChange = (value) => {
    this.getDeviceList({
      lygroupId: value === '-1' ? undefined : value,
      offset: 0,
    })
  }
  onChange = (page, pageSize) => {
    this.getDeviceList({
      limit: pageSize,
      offset: (page - 1) * pageSize
    });
  }
  onRadioGroupChange = (e) => {
    this.setState({
      superId: e.target.value
    })
  }
  onCheckboxGroupChange = checkedList => {
    this.setState({
      checkedList
    })
  }
  popClick = node => {
    this.setState({
      popId: node.placeId,
    })
    let {place} = this.props
    let pnode= place.placeArray.find( v => {
      return v.areaCode === node.parentCode
    })
    let parentId //如果该场所已经在居委会下,记录居委会的placeId
    console.log(pnode)
    if (pnode.level === 2) {
      
    }
    if(pnode.level===4){
      parentId = pnode.placeId
      pnode=place.placeArray.find( v => {
        return v.areaCode === pnode.parentCode
      })
    }
    if (pnode.level===3){
      this.setState({
        content: '',
        modalLoading:true,
        visible: true,
        title: '选择所属上级居委会',
        pnode,
        type:1
      })
      Service.place.queryPlacesByParentId({
        parentId: pnode.placeId
      }).then(res => {
        let dataList=[]
        this.setState({
          checkBoxDataList: res.data
        })
        res.data && res.data.filter(v => {return v.level===4}).map(v => {
          let item = {
            value: v.id,
            label: v.areaName,
          }
          if (v.id === parentId){
            item.disabled=true
          }
          dataList.push(item)
        })
        this.setState({
          modalLoading: false,
          content: dataList.length ?< div>
            <RadioGroup
              onChange={this.onRadioGroupChange }
              className='radio-box-view'
              options = {dataList}
            />  
          </div>:'暂无数据',
        })
      })
    }
  }
  onOk = () => {
    let {popId,type,pnode,superId } = this.state
    let {place} = this.props
    if(type===1){
      if (!superId) {
        this.setState({
          modalLoading:true
        })
        message.warn('请选择一个居委会!')
        return
      }
      this.distributionPlace(superId, [popId],() => {
        let otherPlaceList = place.queryChildPlaceForLevel(pnode.id, 5).filter(v => {
          return v.placeId !== popId
        })
        if (otherPlaceList.length>0){
          let dataList=[]
          otherPlaceList.map(v => {
            return dataList.push({
              value: v.placeId,
              label: v.areaName,
            })
          })
          this.setState({
              title: '是否添加其他场所到该居委会下',
              type:2,
              modalLoading:false,
              content: < div >
                <CheckboxGroup
                  onChange={this.onCheckboxGroupChange }
                  className='check-box-view'
                  options = {dataList}
                />  
              </div>
            })      
        }else{
          this.setState({
            visible: false
          })
        }
      })  
    } else if(type === 2){
      let {checkedList,superId} = this.state
      if (checkedList.length===0){
        this.setState({
          modalLoading: true
        })
        message.warn('请选择需要绑定的场所!')
        return
      }
      this.distributionPlace(superId, checkedList, () => {
        this.setState({
          modalLoading: false,
          visible: false,
        })
      })
    }
  }
  onCancel = () => {
    this.setState({
      visible: false,
    })
  }

  render(){
    let {deviceGroup,loading,selectedKeys,list,total,placeArray,visible,title,content,modalLoading,popId} = this.state;

    let treeData = Utils.computPlaceTreeList(placeArray)
    let {resourceManagement} = this.props
    return (
      < SystemWrapper className = 'resource-management-wrapper'
      name = '场所管理' >
        < div className = 'resource-management-view' >
          < div className = 'left-tree-view' >
            < PlaceManagementTree 
              treeData={treeData} 
              distributionPlace={this.distributionPlace}
              onSelect={this.onSelect}
              selectedKeys={selectedKeys}
              popClick={this.popClick}
              popId={popId}
            />
          </div>
          < div className = 'resource-management-right-view'>
            < div className = 'right-content-view'>
              <Spin spinning={loading}>
                <Search 
                  deviceGroup={deviceGroup}
                  DeviceType={deviceType}
                  typeChange ={this.typeChange} 
                  groupChange={this.groupChange} 
                  onSearch={this.keyWordChange}
                />
                <Table 
                  dataSource={list} 
                  deviceGroup={deviceGroup}
                  total={total} 
                  searchData={resourceManagement.searchData}
                  scroll={{ y: '100%' }}
                  onChange={this.onChange}
                />
              </Spin>
            </div>
          </div>
          <ModalComponent
            className="place-management-modal"
            width="640px"
            destroyOnClose={true}
            visible={visible}
            onCancel={this.onCancel}
            title={title}
            otherModalFooter={
              <div className={`modal-footer`}>
                <Button onClick={this.onCancel}>取消</Button>
                <Button
                  onClick={this.onOk}
                  type="primary"
                  loading={modalLoading}
                >
                  确定
                </Button>
              </div>
            }
          >
            <Spin spinning={modalLoading}>
              {content}
            </Spin>
          </ModalComponent>
        </div>
      </SystemWrapper>
    )
  }
}

export default resourceManagement