import React, { Component } from 'react';
import { Col, Row, message, Popconfirm, Form, Input, Radio } from 'antd';
import './index.less';
const IconFont = Loader.loadBaseComponent('IconFont');
const ImageView = Loader.loadBusinessComponent('ImageView');
const CustomUpload = Loader.loadBusinessComponent('UploadComponents', 'UploadSingleFile');
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const InputItemCol1 = [
  {
    name: "name",
    label: "姓名",
    rules: [{
      required: true,
      message: '请输入姓名'
    }]
  },
  {
    name: "mobile",
    label: "手机号码",
    rules: [{
      pattern: /^1\d{10}$/,
      message: '请输入正确手机号码'
    }]
  },
  {
    name: "birthday",
    label: "出生年月",
  }
]
const InputItemCol2 = [
  {
    name: "nationality",
    label: "民族",
  }, {
    name: "identityCardNumber",
    label: "身份证号",
    rules: [{
      pattern: /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/,
      message: '请输入正确的身份证号'
    }]
  }
]

/* 
  本地添加布控人员
  this.isEdit 表明是添加或是编辑
*/
@Form.create()
class FormPeopleInfo extends Component {

  // 预览图片
  viewImg = imageUrl => {
    window.open(imageUrl, '_blank')
  }
  
  beforeUpload = () => {
    const { beforeUpload } = this.props;
    beforeUpload && beforeUpload();
  }

  uploadDone = file => {
    if (!file) {
      message.error('上传失败')
    }
    // 对file处理，修改字段
    file.isNeedToUpload = true
    const { uploadDone } = this.props;
    uploadDone && uploadDone(file);
  }

  componentDidMount() {
    const { formRef, form } = this.props;
    formRef && formRef(form);
  }

  render() {
    const { className='', selfAttr={}, infoList, deleteImg, uploadType='local', showStatus=false } = this.props;
    const imgCount = infoList ? infoList.length : 0;
    const { getFieldDecorator } = this.props.form
    return (
      <Form 
        className={'monitee-form-people-info-wrapper '+className} 
        layout='horizontal'
      >
        <Row>
          <Col className='img-list-wrapper clearfix'>
            <div className='img-list clearfix fl'>
              {infoList && infoList.map((v,index) => {
                let imgUrl = v.imageUrl || v.image || v.url;
                return (
                  <div key={index} className="img-wrapper fl">
                    <div className='img-wrapper-img'>
                      <ImageView src={imgUrl} />
                    </div>
                    {showStatus && v.saveStatus && (v.saveStatus !== '0') && <span className='img-err'>图片解析失败</span>}
                    <div className='img-btn-wrapper'>
                      <Popconfirm title='确认删除吗' onConfirm={() => deleteImg(v)} okText="确定" cancelText="取消">
                        <IconFont title='删除' type="icon-Delete_Light" />
                      </Popconfirm>
                      {/* <Icon type="eye" title='预览' onClick={() => this.viewImg(imgUrl)} /> */}
                    </div>
                  </div>
                )
              })}
              <div className='upload-div-wrapper fl'>
                { imgCount < 5 
                  ? <CustomUpload
                      expiretype={0}
                      uploadType={uploadType}
                      beforeUpload={this.beforeUpload}
                      uploadDone={this.uploadDone}
                    /> 
                  : <div></div>
                } 
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          {InputItemCol1.map(v => (
            <Col span={24} key={v.name}>
              <Form.Item label={v.label}>
                {getFieldDecorator(v.name, {
                  rules: v.rules,
                  initialValue: selfAttr[v.name]
                })(
                  <Input
                    placeholder={`请填写${v.label}`}
                  />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Row gutter={16}>
          {InputItemCol2.map(v => (
            <Col span={24} key={v.name}>
            <Form.Item label={v.label}>
              {getFieldDecorator(v.name, {
                rules: v.rules,
                initialValue: selfAttr[v.name]
              })(
                <Input
                  placeholder={`请填写${v.label}`}
                />
              )}
            </Form.Item>
            </Col>
          ))}
          <Col span={24}>
            <Form.Item label='性别'>
              {getFieldDecorator('gender',{
                initialValue: selfAttr.gender || '男'
              })(
                <RadioGroup
                  options={[
                    { label: '男', value: '男' },
                    { label: '女', value: '女' }
                  ]}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* <Row> */}
          <Form.Item label='描述'>
            {getFieldDecorator('description', {
              rules:[
                {max: 200, message: `描述信息不超过${200}个字`}
              ],
              initialValue: selfAttr.description
            })(
              <TextArea
                className='description'
                placeholder="请输入布控人员描述文字"
              />
            )}
          </Form.Item>
        {/* </Row> */}
      </Form>
    )
  }
}

export default FormPeopleInfo