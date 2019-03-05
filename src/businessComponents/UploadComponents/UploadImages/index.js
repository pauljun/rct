/*
 * @Author: welson 
 * @Date: 2019-01-09 15:04:03 
 * @Last Modified by: welson
 * @Last Modified time: 2019-01-09 15:10:53
 */

/** 
 *  @desc 原生input图片上传（支持多张上传）
 *  @params {string}    className   组件外层类名
 *  @params {boolean}   disabled  是否禁用
 *  @params {string}    multiple  多张上传开关, 默认false
 *  @params {number}    maxLength   单次最大上传数量, 默认100
 *  @params {number}    currentLength   已上传数量
 *  @params {number}    maxSize     单张图片大小限制，默认2, 即2M
 *  @params {function}  beforeUpload  准备上传之前的回调
 *  @params {function}  uploadDone  上传后的回调
 *  @params {function}  hasErrorCallback  上传失败回调
 *  @params {number}    expiretype  存储周期  0表示永久，1表示7天，2表示30天，3表示90天，默认为0
 *  @params {string}    uploadType  上传类型 默认remote,  local返回base64, remote返回羚羊地址
 *  @params {ReactElement}   children  接受子组件
 */

import React, { Component } from 'react';
import { message } from 'antd';

class MultiUpload extends Component {
  fileList = []

  // 本地上传
  localUpload = (fileList) => {
    fileList.map(v => {
      Utils.fileToBase64(v, (base64) => {
        v.url = base64;
        v.uploadType = 'local';
      })
    })
    this.uploadDone(fileList);
  }

  // 远程上传（到羚羊）
  remoteUpload = (fileList) => {
    const { expiretype = 0, hasErrorCallback } = this.props;
    Service.lingyang.uploadImgListToLy({fileList, expiretype}).then((results) => {
      fileList.map((v,k) => {
        if(results[k].file){
          v = results[k].file;
          v.uploadType = 'remote';
        }
      })
      this.uploadDone(fileList);
    }).catch(() => {
      hasErrorCallback && hasErrorCallback()
    }) 
  }

  // 上传完成后的回调
  uploadDone = (fileList) => {
    const { uploadDone } = this.props;
    uploadDone && uploadDone(fileList)
  }

  //上传之前
  beforeUpload = (e) => {
    this.fileList = [];
    const { maxSize = 2, maxLength = 100, currentLength=0, beforeUpload } = this.props;
    let fileList = e.target.files;
    fileList = Array.prototype.slice.apply(fileList);
    if(currentLength + fileList.length > maxLength){
      message.error(`最多选择${maxLength}张图片, 已选${currentLength}张`)
      return false
    }
    fileList.map(file => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJPG) {
        message.error(`${file.name}:图片格式必须为JPG或者PNG!`)
      }
      const limitSize = file.size / 1024 / 1024 < maxSize;
      if (!limitSize) {
        message.error(`${file.name}:图片大小不能超过${maxSize}M!`)
      }
      if(isJPG && limitSize) {
        file.uid = Utils.uuid();
        this.fileList.push(file);
      } 
    })
    e.target.value = null; // 清空input
    beforeUpload && beforeUpload()
    this.customRequest(this.fileList);
  }

  //上传方法
  customRequest = (fileList) => {
    this.props.uploadType === 'remote' 
      ? this.remoteUpload(fileList) 
      : this.localUpload(fileList);
  }

  onClick = () => {
    this.refs.input.click()
  }

  render() {
    const { className='', multiple, disabled, children } = this.props;

    return (
      <span 
        className={`origin-input-upload-wrapper ${className} ${disabled?'disabled':''}`} 
        onClick={this.onClick} 
      >
        <input 
          ref='input'
          accept="image/png, image/jpeg, image/jpg"
          style={{display: 'none'}}
          type='file' 
          disabled={disabled}
          multiple={multiple} 
          onChange={this.beforeUpload} 
        />
        { children }
      </span>
    )
  }
}

export default MultiUpload;