import React from 'react';
import { Button, message, Modal } from 'antd';
import './index.less';
const UploadSingleFile = Loader.loadBusinessComponent('UploadComponents', 'UploadSingleFile');

@Decorator.businessProvider('monitorLib')
class UploadComponent extends React.Component {
  state = {
    loading: false,
    status: null,
    visable: false,
    btnLoading: false,
  }

  setLoading = (loading=true) => {
    this.setState({
      loading
    })
  }

  /**上传文件格式验证 */
  beforeUpload = () => {
    this.setLoading();
  }

  /**关闭弹窗 */
  cancel = () => {
    this.setState({
      visable: false
    })
  }
  /**确定 */
  ok() {
    let { addList, delList, updateList, status, fileName, filePath } =this.state;
    this.cancel();
    if(status !== 200000){
      return
    }
    this.setState({ btnLoading: true })
    if(addList.length === 0 && delList.length === 0 && updateList.length === 0){
      return this.setState({ btnLoading: false })
    }
    this.Modal = Modal.info({
      title: '导入布控库',
      content: (
        <div>
          <p>正在处理中,请稍后...</p>
        </div>
      ),
      onOk() {},
    });
    Service.monitorLib.importMachineMonitorLibs({
      fileName,
      filePath
    }).then(() => {
      // TODO 全局响应导入事件
      BaseStore.user.updateFilePath(this.state.filePath);
      SocketEmitter.once(SocketEmitter.eventName.importLib, this.Modal.destroy)
      this.setState({
        btnLoading: false,
        visable: false,
      })
    })       
  }
  // 自定义上传
  uploadDone = (data, file) => {
    const filePath = BaseStore.user.systemConfig.domainAddress + data.url;
    if(!filePath){
      this.setLoading(false);
      return message.error('文件导入失败，请重试！')
    }
    const fileName = file.name;
    Service.monitorLib.getMachineMonitorLibsChanges({
      fileName, 
      filePath
    }).then(res => {
      this.setState({
        loading: false,
        message: res.message,
        status: res.code,
        visable: true,
        filePath,
        fileName,
        addList: res.data.addList || [],
        delList: res.data.delList || [],
        updateList: res.data.updateList || [],
        machineName: res.data.machineName || undefined
      })
    }).catch(err => {
      message.error('一体机布控库导入失败！')
      this.setLoading(false)
    })
  }

  //使用自定义上传图片到后台
  uploadFile = file => {
    return Service.monitorLib.uploadMachnieMonitorLibFile(file)
  }

  render() {
    const {
      loading,
      visable,
      status,
      messager,
      addList,
      delList,
      updateList,
      btnLoading,
      machineName
    } = this.state
    let messagers = !!messager ? messager.split(',') : ''
    const fileType = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    return (
      <div className='upload-machine-lib'>
        <UploadSingleFile
          uploadBtn={false}
          uploadTip={false}
          maxSize={false}
          loading={false}
          expiretype={2}
          accept={fileType}
          typeErrorMessage={'请输入excel格式的文件！'}
          beforeUpload={this.beforeUpload}
          uploadDone={this.uploadDone}
          uploadService={this.uploadFile}
        >
          <Button
            icon='16-photo-upload'
            type='primary'
            loading={loading}
          >
            导入布控库
          </Button>
        </UploadSingleFile>
        <Modal
          title={status === 200000 ? '导入专网布控库成功' : '导入布控库失败'}
          visible={visable}
          width={720}
          wrapClassName='library-modal-wrapper'
          footer={null}
          onCancel={this.cancel}
        >
          <div className='notice'>
            <div className={status === 200000 ? 'success' : 'failure'}></div>
          </div>
          {status !== 200000 ?
            <div className='error-mes'>
              {messagers && messagers.map((v,i) => <div key={i} >{v}</div>)}
            </div> :
            <div className='success-list'>
              <div className='ul'>
                <div className="ul-tlt">新增布控库：</div>
                <ul>
                  {addList && addList.length ? addList.map((v, k) =>
                    <li key={k}>{v.name}</li>
                  ) : '无'}
                </ul>
              </div>
              <div className='ul'>
                <div className="ul-tlt">删除布控库：</div>
                <ul>
                  {delList && delList.length ? delList.map((v, k) =>
                    <li key={k}>{v.name}</li>
                  ) : '无'}
                </ul>
              </div>
              <div className='ul'>
                <div className="ul-tlt">更新布控库： </div>
                <ul>
                  {updateList && updateList.length ? updateList.map((v, k) =>
                    <li key={k}>{v.name}</li>
                  ) : '无'}
                </ul>
              </div>
              <div className='ul'>
                <div className="ul-tlt">修改一体机名称： </div>
                <ul>
                  <li>{machineName || '无'}</li>
                </ul>
              </div>
            </div>
          }
          <div className='ok-btn'>
            <Button
              style={{marginLeft:'16px'}}
              onClick={this.cancel}
            >
              取消
            </Button>
            <Button
              type='primary'
              onClick={this.ok.bind(this)}
              loading={btnLoading}
            >
              确定
            </Button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default UploadComponent