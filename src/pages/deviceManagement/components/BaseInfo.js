import React from 'react';
import { Form, Select, Input } from 'antd';
import { observer } from 'mobx-react';

import {cloneDeep}from 'lodash'

// import MapPointLabel from '../../../BusinessComponent/MapPointLabel/MapPointLabelView';

const Option = Select.Option;
const FormItem = Form.Item;
const AI = [{ value: 1, label: '是' }, { value: 0, label: '否' }];
const {cameraOrientation,bigDatePlaceType,installMethod,InOutDirection,industry} = Dict.map

const SelectMap = Loader.loadBusinessComponent('MapComponent', 'MapPointLableView');
const { MakerPoints, MapSearch, providerMap,mapContext } = LMap;

@Decorator.businessProvider('deviceManagement','device','tab')
@observer
class BaseInfo extends React.Component {
  constructor(props) {
    super(props);
    const { info = {} } = this.props;
  }
 
  render() {
    // const { otherInfo } = this.state;
    const { form, info = {}, isView } = this.props;
    const { getFieldDecorator } = form;
    if(this.props.deviceManagement.formData.cameraOrientation){
      info.extJson.extMap.cameraOrientation=this.props.deviceManagement.formData.cameraOrientation
    }
    const mapPointInfo =info
    return (
      <div className="edit-info-layout base-info-layout">
        <h3 className="part-title">基本信息</h3>
        <Form layout="inline" className="base-info-content">
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id')(<Input type="hidden" />)}
          </FormItem>
          <FormItem label="设备名称">
            {getFieldDecorator('deviceName', {
              rules: [
                {
                  required: true,
                  message: '请输入设备名称!'
                }
              ],
              initialValue: info.deviceName&&info.deviceName
            })(<Input placeholder="请输入设备名称" disabled={isView} />)}
          </FormItem>
          <FormItem label="联系电话">
            {getFieldDecorator('maintenancePhone', {
              rules: [
                {
                  pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
                  message: '请输入正确的联系电话'
                }
              ],
              initialValue: info.maintenancePhone && info.maintenancePhone
            })(<Input placeholder="请输入电话" disabled={isView} />)}
          </FormItem>
          <FormItem label="安装区域">
            {getFieldDecorator('pathId',{
               rules: [
                {
                  required: true,
                  message: '请选择安全区域!'
                }
              ],
              initialValue: (info.path_id&&info.path_id)|| (info.placeTags&&info.placeTags)
            })(
              <Select placeholder="请选择安装区域" disabled={isView} mode='multiple'>
                {bigDatePlaceType.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="所属行业">
            {getFieldDecorator('industry1',
            {
              initialValue: info.extJson.extMap.industry1&&info.extJson.extMap.industry1.toString()
            })(
              <Select placeholder="请选择所属行业" disabled={isView}>
                {industry.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="建设单位行业">
          {
            getFieldDecorator(
              'industry2',{
                initialValue: info.extJson.extMap.industry2&&info.extJson.extMap.industry2.toString()
              }
            )(
              <Select
              placeholder="请选择建设单位行业"
              disabled={isView}
            >
              {industry.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
          </FormItem>
          <FormItem label="进出方向">
            {getFieldDecorator('inOutDirection',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择进出方向!'
                  }
                ],
                initialValue: info.extJson.extMap.inOutDirection&&info.extJson.extMap.inOutDirection.toString()
              }
            )(
              <Select placeholder="请设置在场所内代表的方向" disabled={isView}>
                {InOutDirection.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="AI闲时授权">
            {getFieldDecorator('isIdleDeal',
              {
                initialValue: info.isIdleDeal&&info.isIdleDeal.toString()
              }
            )(
              <Select placeholder="请选择AI闲时授权" disabled={isView}>
                {AI.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="安装方式">
            {getFieldDecorator('installationMethod',{
              initialValue: info.installationMethod && info.installationMethod
            })(
              <Select placeholder="请选择安装方式" disabled={isView}>
                {installMethod.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="设置朝向">
          {
            getFieldDecorator('cameraOrientation',{
              initialValue: info.extJson.extMap.cameraOrientation&&info.extJson.extMap.cameraOrientation.toString()
            })(
              <Select
                placeholder="请设置朝向"
                onChange={this.orientationerChange}
                disabled={isView}
            >
              {cameraOrientation.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
            )
          }
          </FormItem>
          <FormItem style={{ height: 0, overflow: 'hidden' }}>
            {getFieldDecorator('cameraOrientation',{
              initialValue: info.extJson.cameraInfo&&info.extJson.cameraInfo.cameraOrientation
            })(
              <Input disabled={isView} type="hidden" />
            )}
          </FormItem>
          {!isView && (
            <div className="other-layout-info">
              <SelectMap point={mapPointInfo} showSearch={false}/>
            </div>
          )}
        </Form>
      </div>
    );
  }
}
export default BaseInfo;