/*
 * @Author: welson 
 * @Date: 2019-01-09 14:55:45 
 * @Last Modified by: Joey
 * @Last Modified time: 2019-01-26 17:23:13
 */

/** 
 *  @desc 单个文件上传（自由控制文件类型） 原 upload.sw.jsx
 *  @params {string}    className   组件外层类名
 *  @params {number|boolean}    maxSize     文件大小限制，默认2, 即2M, 为false是不限制大小
 *  @params {string}    accept      文件类型，默认 "image/png, image/jpeg, image/jpg"
 *  @params {function}  beforeUpload  准备上传之前的回调
 *  @params {function}  uploadDone  上传后的回调
 *  @params {string}    icon      默认上传按钮的图标
 *  @params {string}    loading   默认上传按钮的loading
 *  @params {any}       uploadBtn    渲染上传按钮: 支持自定义React组件 或 自定义按钮文本， false: 不渲染
 *  @params {boolean}   uploadTip   上传提示
 *  @params {function}  setLoading  上传过程中的loading回调
 *  @params {number}    expiretype  存储周期  0表示永久，1表示7天，2表示30天，3表示90天，默认为0
 *  @params {string}    uploadType  上传类型 默认remote,  local返回base64, remote返回羚羊地址
 *  @params {string}    typeErrorMessage  上传类型不对的错误提示
 *  @params {string}    sizeErrorMessage  文件大小超出限制时的错误提示
 *  @params {object}    extraProps  antd的Upload可接受的额外参数
 *  @params {ReactElement}   children  接受子组件
 *  @params {function} uploadService 服务器上传
 */

// 存永久： logo、头像、布控照片、视图库图片、视频截图
// 临时：以图搜图、

import React, { Component } from 'react';
import { Upload, message } from 'antd';

import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');


/* 
  配置参数
  {
    disabled,
    expiretype : 周期类型，0表示永久，1表示7天，2表示30天，3表示90天，默认为0
    name:  发到后台的文件参数名,默认file
  }
*/
// 删除时走羚羊接口，删除对象存储中的图片
// 上传添加key值：
// key: userid/cid/20180101/uuid
// key: userid/tmp/20180101/uuid


// 默认上传的格式
const ACCEPT_FILE = "image/png,image/jpeg,image/jpg";
const MAX_SIZE = 2;

class UploadComponent extends Component {
  state = {
    loading: false,
  }

  setLoading = (isLoading=true) => {
    const { loading = true, setLoading } = this.props;
    if(loading){
      this.setState({
        loading: isLoading
      })
    }
    setLoading && setLoading(isLoading);
  }

  // file转化为本地base64
  uploadLocal = (file) => {
    const { uploadDone } = this.props;
    Utils.fileToBase64(file, (base64) => {
      file.url = base64;
      file.uploadType = 'local';
      uploadDone && uploadDone(file);
    })
  }

  // 图片上传到远程服务器
  uploadRemote = (file) => {
    const { uploadDone, uploadService} = this.props;
    this.setLoading();
    const formData = new FormData()
    formData.append('file', file)
    uploadService && uploadService(formData).then(
      (res) => {
        this.setLoading(false);
        uploadDone && uploadDone(res.data, file);
      }
    ).catch(() => {
      message.error('上传失败')
    })
  }

  /** 自定义上传方法
   *  
   */
  customUpload = ({ file }) => {
    const { uploadType = 'remote' } = this.props;
    if (uploadType !== 'remote') {
      this.uploadLocal(file)
    } else {
      this.uploadRemote(file)
    }
  }

  /** 上传之前的钩子函数,做一些上传校验
   * @return 返回false时停止上传，返回true则执行上传（customUpload）
   */
  beforeUpload = (file) => {
    const { maxSize = MAX_SIZE, beforeUpload, accept=ACCEPT_FILE, typeErrorMessage, sizeErrorMessage, } = this.props;
    const acceptTypes = accept.split(",");
    const acceptable = acceptTypes.indexOf(file.type) !== -1;
    if (!acceptable) {
      message.error(typeErrorMessage || '图片格式必须为JPG或者PNG!')
    }
    const limitSize = maxSize ? file.size / 1024 / 1024 < maxSize : true;
    if (!limitSize) {
      message.error(sizeErrorMessage || `图片大小不能超过${maxSize}M!`)
    }
    if(acceptable && limitSize){
      beforeUpload && beforeUpload();
    }
    return acceptable && limitSize
  }
  
  /** 渲染上传按钮
   *  支持自定义React组件 或 自定义按钮文本
   */
  renderUploadBtn = () => {
    const { uploadBtn, loading=true, icon='icon-AddImg_Light' } = this.props;
    let uploadText = '选择图片'
    if (React.isValidElement(uploadBtn)) {
      return uploadBtn
    } else if (uploadBtn === false) {
      return null
    } else if(Utils.judgeType(uploadBtn, 'String')) {
      uploadText = uploadBtn
    } 
    return (
      <div className='upload-btn-wrapper'>
        <IconFont className="ant-upload-icon" type={ loading && this.state.loading ? 'loading' : icon} />
        {uploadText && <span className="ant-upload-text">{uploadText}</span>}
      </div>
    );
  }

  render() {
    const {
      className = '',
      uploadTip = true,
      maxSize = MAX_SIZE,
      children = null,
      accept= ACCEPT_FILE,
      extraProps={},
    } = this.props;
    const uploadProps = {
      accept,
      name: 'file',
      multiple: false,
      showUploadList: false,
      beforeUpload: this.beforeUpload,
      customRequest: this.customUpload,
      ...extraProps
    };
    return (
      <div className={`sw-upload-wrapper ${className}`}>
        <Upload {...uploadProps} className='upload-content-wrapper'>
          {this.renderUploadBtn()}
          { children }
        </Upload>
        {uploadTip && (
          <div className="uploader-tip">
            <span>支持jpg/png格式</span>
            <br />
            <span>不超过{maxSize}M</span>
          </div>
        )}
      </div>
    )
  }
}

export default UploadComponent;
