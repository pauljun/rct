import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

const Table = Loader.loadBaseComponent('Table');
const Pagination = Loader.loadBaseComponent('Pagination');
const IconFont = Loader.loadBaseComponent('IconFont');
const getKeyValue = Dict.getLabel
const DeviceIcon = Loader.loadBaseComponent('DeviceIcon');
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");

@withRouter
@Decorator.businessProvider('organization', 'tab','place')
@observer
class view extends React.Component {
  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      organization,
      ...props
    } = this.props;
   
    const columns = [
      {
        title: '名称',
        dataIndex: 'deviceName',
        width: '20%',
        align: 'left',
        render: (name, record) => {
          return (
            <div className="device-table-name">
              <span>
                <DeviceIcon
                  type={record.deviceType}
                  status={record.deviceStatus}
                />
                {name}
              </span>
            </div>
          );
        }
      },
      {
        title: 'SN码',
        dataIndex: 'sn',
        width: '12%',
        key: '3'
      },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        key: '6',
        width: '8%',
        render: (text, item, index) => {
          return (
            <span>
              {getKeyValue(
                'deviceType',
                `${
                  item.manufacturerDeviceType === 103401||103408
                    ? item.deviceType
                    : item.manufacturerDeviceType
                }`
              )}
            </span>
          );
        }
      },
      {
        title: '所属上级场所',
        dataIndex: 'placeId',
        key: '6',
        width: '10%',
        render: (text, item, index) => {
          const { place }=this.props
         let parentPlace= place.placeArray.find( p => {
             if(p.placeId==text){
               return p
             }
          })
          return (
            <span>
              {parentPlace&&parentPlace.name}
            </span>
          );
        }
      },
      {
        title: '场所类型',
        dataIndex: 'pathId',
        key: '6',
        width: '13%',
        render: (text,item) => {
          let placeName=[]
          item.pathId&&item.pathId.length>0 && item.pathId.map(p => {
            this.props.bigDatePlaceType.find(v => {
              if (p==v.value){
                placeName.push(v.label)
              }
            })
          })
          placeName=placeName.length>0?placeName.join('/'):''
          return (
            <span >
              {placeName}
            </span>
          );
        }
      },
      {
        title: '所属组织',
        dataIndex: 'organizationIds',
        key: '4',
        width: '8%',
        render: item => {
          let orgItem = organization.orgList.filter(
            v => item.indexOf(v.id) > -1
          )[0];
          if (!orgItem) {
            return null;
          }
          return (
            <span title={this.props.organization.getOrgTreeText(orgItem.id)}>
              {orgItem.name}
            </span>
          );
        }
      },
      {
        title: '所属行业',
        dataIndex: 'industry1',
        key: '4',
        width: '8%',
        render: (text,item) => {
          let industryName=''
          this.props.industry.map(item => {
            if(item.value == text){
              industryName=item.label
            }
          })
          return (
            <span >
              {industryName}
            </span>
          );
        }
      },
    
      {
        title: '经纬度',
        dataIndex: 'address',
        key: '10',
        width: '8%',
        render: (text, item, index) => {
          return (
            <span>{item.latitude && item.longitude ? '已设置' : '未设置'}</span>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: '13',
        width: '20%',
        render: (text, item, index) => {
          return (
            <div className="table-tools">
              <AuthComponent actionName="deviceManagement">
                <IconFont
                  type="icon-_LocusAnalysis"
                  onClick={() => this.props.changePoint([item])}
                  title="地图标注"
                />
              </AuthComponent>
              {item.manufacturerDeviceType == '103401' && (
                <AuthComponent actionName="deviceManagement">
                  <IconFont
                    onClick={() => {
                      const { tab, location } = this.props;
                      tab.goPage({
                        moduleName: 'deviceManagement',
                        data: { id: item.id },
                        location
                      });
                    }}
                    type="icon-Edit_Main"
                    title="编辑"
                  />
                </AuthComponent>
              )}
               <AuthComponent actionName="deviceManagement">
                <IconFont
                  type="icon-Export_Main"
                  onClick={() => this.props.changeOrg(item)}
                  title="分配"
                />
              </AuthComponent>
            </div>
          );
        }
      }
    ];
    
    return (
      <div className="device-container" key="device">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          {...props}
        />
        {total==0?'':(<Pagination
          total={total}
          pageSize={searchData.limit}
          // current={searchData.page}
          current={(searchData.offset/searchData.limit)+1}
          onChange={onChange}
        />)}
      </div>
    );
  }
}

export default view;
