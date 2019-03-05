import React from 'react';
import { Form, Input,Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { geoAddress } = Dict.map

export default class OSDInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { form, info = {} } = this.props;
    // form.setFieldsValue({
    //   osd: info.lyCameraInfo.osd
    // });
  }
  render() {
    const { form, isView ,info={}} = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="edit-info-layout base-info-layout osd-info-layout">
        <h3 className="part-title">OSD设置</h3>
        <Form layout="inline" className="base-info-content">
          <FormItem label="OSD名称">
            {getFieldDecorator('osd',{
              initialValue: info.extJson&&info.extJson.cameraInfo.osd
            })(
              <Input placeholder="请输入OSD名称" disabled={isView} />
            )}
          </FormItem>
          {/* <FormItem label="实时视频播放设置">
            {getFieldDecorator('video')(
              <Select placeholder="请选择视频播放类型" disabled={isView}>
                {geoAddress.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem> */}
        </Form>
      </div>
    );
  }
}
