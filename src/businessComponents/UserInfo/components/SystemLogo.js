import React from 'react'
import { Modal, message } from 'antd'
import { observer } from 'mobx-react'
import { Form, Input } from 'antd'
import { toJS } from 'mobx'
const FormUpload = Loader.loadBusinessComponent("UploadComponents",'UploadSingleFile');

@Form.create()
@Decorator.businessProvider('userManagement')
@observer
class view extends React.Component{
  state = {
    systemLogo: ''
  }

  /**设置系统logo与名称 */
  setSystemMes=(item,userId) => {
    const { userManagement }=this.props
   if(item && item.systemName){
     item.systemName = item.systemName.replace(/#/,escape('#'))
     item.systemLogo = Utils.escapeUrl(item.systemLogo, true);
   }
   let systemMes = toJS(userManagement.systemMes)
   systemMes.push({
     systemId: Utils.uuid(),
     systemName: item.systemName,
     systemLogo: item.systemLogo,
     userList: []
   })
   return Service.kvStore.setUserKvStore({
     userId, 
     storeKey: 'SYSTEM_MES',
     storeValue: systemMes
   }).then(() => {
     userManagement.setData({
       systemMes
     })
   })
 }
  onOk = () => {
    let {form,cancel,userId} =this.props
    form.validateFields((err, values) => {
      if(err){
        return
      }
      this.setSystemMes(values,userId).then(res => {
          cancel()
      })
    })
  }

  onUploadChange = (value) => {
    this.props.form.setFieldsValue({
      systemLogo: value.url
    })
    this.setState({
      systemLogo:value.url
    })
  }
  render(){
    let {
      cancel,
      uploadTip,
      form
    } = this.props
    const image = (
      <div className='user-system-loge'>
        <img src={this.state.systemLogo} alt="" />
      </div>
    );
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={true}
        title='添加'
        onOk={this.onOk.bind(this)}
        onCancel={cancel}
      >
        <div className='user-system-modal'>
          <Form
            layout="horizontal"
          >
            <Form.Item 
              label='系统名称:'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              {getFieldDecorator('systemName', {
                rules: [{
                  required: true,
                  message: '请输入系统名称'
                },{
                  max: 11, message: `系统名称不超过${11}个字`
                }]
              })(
                <Input placeholder='请输入系统名称' />
              )}
            </Form.Item>
            <FormUpload
              title="上传图片"
              icon="inbox"
              disabled={false}
              uploadDone={this.onUploadChange}
              uploadService={Service.user.uploadImg}
              uploadTip={uploadTip}
              children={
                image ? image:''
              }
              className="systemLogoUpload"
            />        
            <Form.Item>
              {getFieldDecorator('systemLogo', {
                rules: [{
                  required: true,
                  message: ''
                }]
              })(
                <Input type='hidden' />
              )}
            </Form.Item>    
          </Form>
        </div>
      </Modal>
    )
  }
}

export default view