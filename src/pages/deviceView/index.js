import React from 'react';
import { observer } from 'mobx-react';
import TableComponent from './components/Table';
import { withRouter } from 'react-router-dom'
import { Form, Select, Radio, Button, message } from 'antd';
import { cloneDeep } from 'lodash';
import _ from 'lodash';


import './style/list.less';

const Container = Loader.loadBusinessComponent("SystemWrapper");
const BreadCrumb = Loader.loadBaseComponent("BreadCrumb");
const IconFont = Loader.loadBaseComponent('IconFont');

const ModalOrgSelect = Loader.loadBaseComponent('ModalComponent')
const OrgTree = Loader.loadBusinessComponent('OrgTree');


const ModalSetPointMap = Loader.loadBusinessComponent('ModalSetPointMap')
const Search=Loader.loadBaseComponent('SearchInput');
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");

const {deviceStatus, deviceAndMjType, deviceLocation, placeType,bigDatePlaceType, industry} =Dict.map
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

@withRouter
@Decorator.businessProvider('deviceManagement','user','organization','device')
@Decorator.withEntryLog()
@observer
class DeviceListView extends React.Component {
  state = {
    list: [],
    loading: false,
    deviceGroup: [],
    selectedRowKeys: [],
    showOrgModal: false,
    showMapModal: false,
    changeDevices: [],
    autoExpandParent:true,
    expandedKeys:[],
    ifInclude:0,
    selectKeys:[]
  };

  allIndustry = [];
  allbigDatePlaceType = [];
  onSelect = selectKeys => {
    this.setState({ selectKeys });
  };


  componentWillMount() {
    const {deviceManagement}=this.props
    deviceManagement.initData()
    SocketEmitter.on('deviceEdit', this.subDeviceEdit);
    this.allbigDatePlaceType=[].concat([{ value: '-1', label: '全部' }], bigDatePlaceType);
    this.allIndustry=[].concat([{ value: '-1', label: '全部' }], industry);
    /**获取羚羊云设备分组 */
    Service.device.queryDeviceGroup().then(res => {
      const result = res.data.groups || [];
      const deviceGroup = [].concat([{ id: '-1', name: '全部分组' }], result);
      this.setState({
        deviceGroup
      });
    })
    this.expandKeys()
  }
  componentWillUnmount() {
    SocketEmitter.off('deviceEdit', this.subDeviceEdit);
  }

  subDeviceEdit = () => {
    this.getDeviceList();
  };

  /**
   * 选中树操作
   */
  leafClk(key) {
    const { deviceManagement } = this.props;
    deviceManagement.setData({
      activeKey: key,
    });
    this.getDeviceList({offset:0});
  }


  /**
   * 打开分配modal 设置分配的设备id
   */
  showOrgAction = async (item,type='single') => {
    const {device,organization,deviceManagement}=this.props
    let ids=[]
    let selectKeys=[]
    let expandedKeys=null
    selectKeys=deviceManagement.activeKey
    await Service.organization.organizationInfo(deviceManagement.activeKey[0]).then(res => {
      if(res.data.parentId){
        expandedKeys=[res.data.parentId]
      }
    })
   if(type=="single"){
     ids=[item.id]
   }else{
     ids=item
   }
    this.setState({
      expandedKeys,
      changeDevices: ids,
      selectKeys,
      showOrgModal: true,
      selectedRowKeys: []
    });
  };

  /**
   * 关闭分配modal 清空分配的设备id
   */
  closeOrgAction = () => {
    this.setState({
      changeDevices: [],
      showOrgModal: false
    });
  };

  /**
   * 打开点位设置
   */
  showMapAction = points => {
    this.setState({
      changeDevices: cloneDeep(points),
      showMapModal: true,
    });
  };

  /**
   * 关闭分配modal 清空分配的设备id
   */
  closeMapAction = () => {
    this.setState({
      changeDevices: [],
      showMapModal: false,
    });
  };

  /**
   * 确认提交设备修改组织
   */
  submitChangeOrg = info => {
    const {
      user,
      organization,
      device
    } = this.props;
    let { changeDevices } = this.state;
    let options = {
      toOrganizationId: info[0],
    };
    console.log(changeDevices,9)
    let deviceItem = cloneDeep(device.queryCameraById(changeDevices[0]));
    console.log(deviceItem,49)

    let orgItem = organization.orgList.filter(
      v => deviceItem&&deviceItem.organizationIds.indexOf(v.id) > -1
    )[0];
    let fromOrganizations=[]
    changeDevices.map((v,k) => {
      fromOrganizations.push(
        {
          deviceId:changeDevices[k],
          fromOrganizationId:orgItem&&orgItem.id
        }
      )
    })
    if (orgItem.id === info[0]) {
      return message.warn('设备已经在当前组织下！');
    }
    options.fromOrganizations = fromOrganizations
    return Service.device.updateOrganizationDevicesBatch(options).then(() => {
      message.success('操作成功！');
      this.closeOrgAction()
      this.setState({ selectedRowKeys: [] });
      this.getDeviceList();
      Shared.queryOrganizationDevice()
    });
  };
  submitDevicePoint = () => {
    this.getDeviceList();
    this.closeMapAction()
  };


   /**列表查询 */
   getList = (orgIds) => {
     const { deviceManagement }=this.props
    let searchData = cloneDeep(deviceManagement.searchData);
    _.forIn(searchData, (value, key) => {
      if (value===""||value===null||value===undefined||value === '-1') {
        searchData = _.omit(searchData, [key]);
      }
    });
    if (orgIds.length) {
      searchData.orgIds = orgIds;
    } else {
      searchData.orgIds = deviceManagement.activeKey;
    }
    if(searchData.deviceTypes){
      searchData.deviceTypes = searchData.deviceTypes.split(',')
      if(searchData.deviceTypes[0]==='100603'){
        searchData.deviceTypes.push('100607')
      }
    }else{
      let deviceTypes = []
      deviceAndMjType.filter(v => v.value !== '-1').map(v => {
        deviceTypes = deviceTypes.concat(v.value.split(','))
        return v
      })
      searchData.deviceTypes = deviceTypes
    }
    return Service.device.deviceListByOrganization(searchData);
  }

  /**
   * 查询设备列表
   * 
   */
   getDeviceList = async (options = { }) => {
    this.setState({ loading: true });
    const { deviceManagement } = this.props;
    deviceManagement.mergeSearchData(options);
    let searchData = deviceManagement.searchData;
    let orgIds = [];
     if (searchData.includeSubOrganizations) {
      await Service.organization.queryChildOrganizationsById({
        selectChildOrganization:true,
       id:deviceManagement.activeKey[0]
      }).then(res => {
        res.data&&res.data.map(v => {
          orgIds.push(v.id)
        })
      });
    }
    this.getList(orgIds).then(res => {
      this.setState({
        list: res.data.list,
        total: res.data.total,
        loading: false
      });
    });
  };
  /**
   * 导出设备列表
   */
  exportDeviceList = () => {
    const { deviceManagement,organization } = this.props;
    this.setState({
      loading:true
    })
    const activedOrgId=deviceManagement.activeKey[0]
    Service.device.exportDevice(parseInt(activedOrgId)).then(res => {
      this.setState({
        loading:false
      })
    })
  }


  /**分页切换查询 */
  onChange = (page, pageSize) => {
    this.getDeviceList({ 
      limit:pageSize,
      offset:(page-1)*pageSize
    });
  };

   // 包含子组织
   handleIfInclude = ({ value }) => {
    this.setState({
      ifInclude: value
    });
    this.getDeviceList({ includeSubOrganizations: value });
  };

  /**
   * 重置表单
   */

  reset = () => {
    const { form, deviceManagement } = this.props;
    deviceManagement.initSearchForm();
    form.setFieldsValue({ ...deviceManagement.searchData });
    this.getDeviceList();
  };

  /**
   * table 多选
   */
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  expandKeys = () => {
    const {organization}=this.props
    const orgAll=organization.orgTreeData
    var expandkeys=[]
    orgAll.map(v => {
      if(v.children){
        expandkeys.push(v.id)
      }
    })
    this.setState({
      expandedKeys:expandkeys,
      autoExpandParent: false,
    })
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  render() {
    const { organization, deviceManagement, form } = this.props;
    let {
      list,
      total,
      loading,
      deviceGroup,
      selectedRowKeys,
      showOrgModal,
      showMapModal,
      changeDevices,
      ifInclude,
      expandedKeys
    } = this.state
    const { searchData } = deviceManagement
    const rowSelection = {
      columnWidth: 24,
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <Container
        width='1300px'
        Treetitle='设备管理'
        treeActiveKey={deviceManagement.activeKey}
        leafClk={this.leafClk.bind(this)}
        className='device-setting-wrapper'
        leftOrgTree={true}
        TreeChildren={
          <div className='childrenOrg'>
            <div>包含子组织:</div>
            <RadioGroup value={ifInclude} onChange={e => this.handleIfInclude({value:e.target.value , containSuborganization:0})} >
              <Radio value={1}>包含</Radio>
              <Radio value={0}>不包含</Radio>
            </RadioGroup>
          </div>
        }
        breadCrumb={cloneDeep(deviceManagement.activeKey) && 
          <BreadCrumb
            list={this.props.organization.getParentOrgListByOrgId(
              cloneDeep(deviceManagement.activeKey)[0]
            ).reverse()}
          />
        }
      >
        <div className="device-table-content">
          <div className="serach-form">
          <AuthComponent actionName="deviceManagement">
              <Button type="primary" onClick={() => this.exportDeviceList({page:1})}>
                <IconFont type="icon-Allocation_One_Main" />导出
              </Button>
            </AuthComponent>
            <AuthComponent actionName="deviceManagement">
              <Button 
                type="primary" 
                onClick={() => this.showOrgAction(selectedRowKeys,'multiple')}
                disabled={selectedRowKeys.length === 0}
              >
                <IconFont type="icon-Export_Main" />批量分配
              </Button>
            </AuthComponent>
            <FormGroupLayout
              // form={form}
              getDeviceList={this.getDeviceList}
              deviceGroup={deviceGroup}
              searchData={searchData}
              allIndustry={this.allIndustry}
              allbigDatePlaceType={this.allbigDatePlaceType}
            />
          </div>
          <TableComponent
            rowSelection={rowSelection}
            key="device"
            total={total}
            industry={industry}
            bigDatePlaceType={bigDatePlaceType}
            searchData={searchData}
            dataSource={list}
            loading={loading}
            onChange={this.onChange}
            changeOrg={this.showOrgAction}
            changePoint={this.showMapAction}
            rowKey={'id'}
            scroll={{ y: '100%' }}
          />
        </div>
        <ModalOrgSelect
          title="设备分配"
          visible={showOrgModal}
          onCancel={this.closeOrgAction}
          destroyOnClose={true}
          onOk={() => this.submitChangeOrg(this.state.selectKeys)}
          className='modal-org-select-tl'
        >
          <OrgTree onSelect={this.onSelect} activeKey={this.state.selectKeys} expandedKeys={expandedKeys}/>
        </ModalOrgSelect>
        <ModalSetPointMap
          title="点位设置"
          visible={showMapModal}
          destroyOnClose={true}
          showSearch={true}
          point={changeDevices[0]}
          onCancel={this.closeMapAction}
          onOk={this.submitDevicePoint}
          showPlaceModal={true}
        /> 
      </Container>
    );
  }
}

@withRouter
@Decorator.businessProvider('deviceManagement')
@observer
@Form.create({
  onFieldsChange: (props, files) => {
    const { deviceManagement } = props;
    let data = {};
    let searchData = deviceManagement.searchData;
    Object.keys(files).map(key => {
      data[key] = files[key].value;
    });
    data.placeIds=data.placeIds?data.placeIds.split(','):''
    data.hadLocation=data.hadLocation==='1' ? true :data.hadLocation==="-1"? null : data.hadLocation==="0"?false:searchData.hadLocation
    data.pathId=data.pathId ?( data.pathId==='-1'? undefined:data.pathId.split(',') ): searchData.pathId
    deviceManagement.mergeSearchData(data);
    props.getDeviceList({offset:0})
  }
})
class FormGroupLayout extends React.Component {
  render() {
    const { form, deviceGroup, allbigDatePlaceType, allIndustry } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <FormItem>
          {getFieldDecorator('lygroupId')(
            <Select placeholder="全部分组"
            >
              {deviceGroup.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('deviceStatus')(
            <Select placeholder="全部状态"
            > 
              {deviceStatus.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('deviceTypes')(
            <Select placeholder="全部类型">
              {deviceAndMjType.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('pathId')(
            <Select placeholder="场所类型">
              {allbigDatePlaceType.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('industry1')(
            <Select placeholder="所属行业">
              {allIndustry.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('hadLocation')(
            <Select placeholder="经纬度">
              {deviceLocation.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem >
          {getFieldDecorator('deviceName')(
            <Search 
              placeholder="请输入名称、SN、CID查询" 
              className='device-search'
            />
          )}
        </FormItem>
      </Form>
    );
  }
}
export default DeviceListView;