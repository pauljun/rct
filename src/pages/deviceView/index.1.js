import React from 'react';
import { observer } from 'mobx-react';
import Table from './components/Table';
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Radio, Button, message } from 'antd';
// import ModalMapPointLabel from '../../../BusinessComponent/MapPointLabel/ModalMapPointLabel';

// import LogsComponent from 'src/components/LogsComponent';
// import AuthComponent from '../../../BusinessComponent/AuthComponent';
import { cloneDeep , difference } from 'lodash';
import './style/list.less';

const Container = Loader.loadBusinessComponent('SystemWrapper');
const BreadCrumb = Loader.loadBaseComponent('BreadCrumb');
const IconFont = Loader.loadBaseComponent('IconFont');
const ModalOrgSelect = Loader.loadBaseComponent('ModalTreeSelectCamera')
const ModalMapPointLabel = Loader.loadBusinessComponent('ModalSetPointMap')
const { deviceStatus, deviceAndMjType, deviceLocation }=Dict.map
const DeviceType = deviceAndMjType;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

// @LogsComponent()


@withRouter
@Decorator.businessProvider('deviceManagement','user','organization','device')
@observer

@Form.create({
  onFieldsChange: (props, files) => {
    const { deviceManagement } = props;
    let data = {};
    Object.keys(files).map(key => {
      data[key] = files[key].value;
    });
    deviceManagement.mergeSearchData(data);
  }
})
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
    ifInclude:0
  };

  componentWillMount() {
    SocketEmitter.on('deviceEdit', this.subDeviceEdit);
    /**获取羚羊云设备分组 */
    Service.device.queryLingyangOrgs().then(res => {
      const result=[].concat([{ id: '-1', name: '全部分组' }], res.result.groups);
      this.setState({
        deviceGroup: result
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
      activeKey: key
    });
    this.getDeviceList();
  }

  /**
   * 打开分配modal 设置分配的设备id
   */
  showOrgAction = ids => {
    this.setState({
      changeDevices: ids,
      showOrgModal: true
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
      showMapModal: true
    });
  };

  /**
   * 关闭分配modal 清空分配的设备id
   */
  closeMapAction = () => {
    this.setState({
      changeDevices: [],
      showMapModal: false
    });
  };

  /**
   * 确认提交设备修改组织
   */
  submitChangeOrg = orgId => {
    const {
      user,
      organization,
      device
    } = this.props;
    let { changeDevices } = this.state;
    let options = {
      deviceIds: changeDevices,
      toOrgId: orgId,
      ocId: user.userInfo.optCenterId
    };
    if (changeDevices.length === 1) {
      let deviceItem = device.queryCameraById(changeDevices[0]);
      let orgItem = organization.orgList.filter(
        v => deviceItem.organizationIds.indexOf(v.id) > -1
      )[0];
      options.fromOrgId = orgItem.id;
      if (orgItem.id === orgId) {
        return message.warn('设备已经在当前组织下！');
      }
    }
    return Service.device.updateDeviceOrg(options).then(() => {
      message.success('操作成功！');
      this.closeOrgAction()
      this.setState({ selectedRowKeys: [] });
      this.getDeviceList();
      Shared.queryOrganizationDevice()
    });
  };

  submitDevicePoint = info => {
    Service.device.updateDeviceGeo({
      address: info.address,
      name: info.name,
      deviceId: info.point.id,
      latitude: info.position[1],
      longitude: info.position[0]
    }).then(() => {
      this.getDeviceList();
      message.success('操作成功！');
    });
  };

   /**
   * 获取组织下的所有组织id
   * @param {string} orgId
   * @param {Array} ids = []
   */
  queryOrgIdsForParentOrgId(orgId, ids = []) {
    const {organization}=this.props
    for (let i = 0, len = organization.orgResource.length; i < len; i++) {
      let item = organization.orgResource[i];
      if (item.id == orgId) {
        ids.push(item.id);
      }
      if (item.parentId == orgId) {
        this.queryOrgIdsForParentOrgId(item.id, ids);
      }
    }
    return ids;
  }

  /**
   * 查询设备列表
   */
  getDeviceList = (options = { }) => {
    this.setState({ loading: true });
    const { deviceManagement, organization } = this.props;
    deviceManagement.mergeSearchData(options);
    let searchData = deviceManagement.searchData;
    let orgIds = [deviceManagement.activeKey[0]];
    if (searchData.isHadChild) {
      orgIds = this.queryOrgIdsForParentOrgId(
        deviceManagement.activeKey[0]
      );
    }
    deviceManagement.getList(orgIds).then(res => {
      this.setState({
        list: res.result.resultList,
        total: res.result.resultSize,
        loading: false
      });
    });
  };
  /**
   * 导出设备列表
   */
  exportDeviceList = () => {
    // this.setState({ loading: true });
    const { deviceManagement } = this.props;
    const { selectedRowKeys } = this.state
    let page = deviceManagement.searchData.page;
  }


  /**分页切换查询 */
  onChange = (page, pageSize) => {
    this.getDeviceList({ page: page ? page : 1, pageSize });
  };

   // 包含子组织
   changeSearchData = ({ value }) => {
    this.setState({
      ifInclude: value
    });
    this.getDeviceList({ isHadChild: value });
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
    const { menuInfo, organization, deviceManagement, form } = this.props;
    let {
      list,
      total,
      loading,
      deviceGroup,
      selectedRowKeys,
      showOrgModal,
      showMapModal,
      changeDevices,
      ifInclude
    } = this.state;
    const { searchData } = deviceManagement;
    const rowSelection = {
      columnWidth: 24,
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <Container
        Treetitle='设备管理'
        treeActiveKey={deviceManagement.activeKey}
        leafClk={this.leafClk.bind(this)}
        className='org-setting-wrapper'
        leftOrgTree={true}
        TreeChildren={
          <div className='childrenOrg'>
            <div>包含子组织:</div>
            <RadioGroup value={ifInclude} onChange={e => this.changeSearchData({value:e.target.value , containSuborganization:0})} >
              <Radio value={1}>包含</Radio>
              <Radio value={0}>不包含</Radio>
            </RadioGroup>
          </div>
        
        }
        name={deviceManagement.activeKey && 
          <BreadCrumb
            list={organization.getParentOrgListByOrgId(
              deviceManagement.activeKey[0]
            ).reverse()}
          />
        }
            
      >
        <div className="device-table-content">
          <div className="serach-form">
            <FormGroupLayout
              form={form}
              deviceGroup={deviceGroup}
              searchData={searchData}
            />
            <div className="form-btn-group">
              <Button onClick={this.reset}>重置</Button>
              <Button type="primary" onClick={() => this.getDeviceList({page:1})}>
                <IconFont type="icon-Search_Main" />
                查询
              </Button>
              <Button type="primary" onClick={() => this.exportDeviceList({page:1})}>
                <IconFont type="icon-Search_Main" />
                导出
              </Button>
            </div>
          </div>
          <Table
            rowSelection={rowSelection}
            key="device"
            total={total}
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
          treeProps={{ treeData: organization.orgTreeData, onExpand:this.onExpand ,defaultExpandedKeys:this.state.expandedKeys,autoExpandParent:this.state.autoExpandParent}}
          expandKeys={this.expandKeys}
          onCancel={this.closeOrgAction}
          onOk={this.submitChangeOrg}
          className='modal-org-select-tl'
        />
        <ModalMapPointLabel
          title="点位设置"
          visible={showMapModal}
          point={changeDevices[0]}
          onCancel={this.closeMapAction}
          onOk={this.submitDevicePoint}
          className='device-map-point'
        />
      </Container>
    );
  }
}

class FormGroupLayout extends React.Component {
  componentDidMount() {
    const { form, searchData } = this.props;
    form.setFieldsValue({ ...searchData });
  }
  render() {
    const { form, deviceGroup } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <FormItem label="分组">
          {getFieldDecorator('lygroupId')(
            <Select placeholder="请选择分组">
              {deviceGroup.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="经纬度">
          {getFieldDecorator('hadLocation')(
            <Select placeholder="请选择是否设置经纬度">
              {deviceLocation.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="状态">
          {getFieldDecorator('deviceStatus')(
            <Select placeholder="请选择状态">
              {deviceStatus.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="类型">
          {getFieldDecorator('deviceTypes')(
            <Select placeholder="请选择类型">
              {DeviceType.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="名称">
          {getFieldDecorator('deviceName')(
            <Input placeholder="请输入设备名称" />
          )}
        </FormItem>
        <FormItem label="SN">
          {getFieldDecorator('sn')(<Input placeholder="请输入SN码" />)}
        </FormItem>
        <FormItem label="CID">
          {getFieldDecorator('cid')(
            <Input placeholder="请输入CID" />
          )}
        </FormItem>
      </Form>
    );
  }
}
export default DeviceListView;