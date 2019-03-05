import React from 'react';
import { Form, Input, Select,Button} from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'
import './modalView.less'

const ModalShow = Loader.loadBaseComponent('ModalComponent')
const {departmentType} = Dict.map
const FormItem = Form.Item;
const Option = Select.Option;
const IconSpan = Loader.loadBaseComponent('IconSpan');

@withRouter
@Decorator.businessProvider("organization")
@observer
class ModalView extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let { form, data } = this.props;
    data = data || {};
    let type = departmentType.find(v => v.value === data.type);
    form.setFieldsValue({
      organizationName: data.organizationName || '',
      organizationType: type ? type.value : 1008000,
      organizationDesc: data.organizationDescription || ''
    });
  }
  onSubmit(type) {
    const { form, data ,organization} = this.props;
    form.validateFields((err, values) => {
      if (err) {
        console.error('表单错误', err);
        return;
      }
      this.props.onSubmit(data, values, type).then(() => {
        this.handleCancel();
        Service.organization.queryOrganizations()
      });
    });
  }
  handleCancel = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.CancelModal();
  };
  render() {
    const { type, visible ,showOrgType=false,operateOrg,data} = this.props;
    let { getFieldDecorator } = this.props.form;
    const showEdit = <Button type="primary" className='orgDetailEdit' onClick={() => operateOrg(data,'edit')}><IconSpan icon="icon-Edit_Main" />编辑</Button>
    const btnShow = type == 'view' ? showEdit:''
    return (
      <ModalShow
        title={
          type == 'edit' ? '编辑组织基本信息' : '新建直属组织' 
        }
        visible={visible}
        onOk={() => this.onSubmit(this.props.type)}
        onCancel={this.handleCancel}
        className="add-edit-modal-org" 
        otherModalFooter={btnShow}
      >
        <Form layout="inline">
          <FormItem label="组织名称">
            {getFieldDecorator('organizationName', {
              rules: [
                {
                  required: true,
                  message: '组织名称必须填写且长度不能超过50个字符',
                  max: 50
                }
              ]
            })(<Input placeholder="请填写组织名称" />)}
          </FormItem>
          {showOrgType ? (
            <FormItem label="组织类型">
              {getFieldDecorator('organizationType', {
                rules: [{ required: true, message: '组织类型必须填写' }]
              })(
                <Select
                  className="ant-col-14"
                  placeholder="请选择组织类型"
                  disabled
                >
                  {departmentType.map((item, index) => {
                    return (
                      <Option key={index} value={item.value}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          ) : ''
          }
          <FormItem label="组织描述" className="org-desc-item">
            {getFieldDecorator('organizationDesc', {
              rules: [{ max: 150, message: '描述请控制在150个字符内' }]
            })(
              <Input.TextArea
                className='org-desc-area'
                name="organizationDesc"
              />
            )}
          </FormItem>
        </Form>
      </ModalShow>
    );
  }
}

export default Form.create()(ModalView);
