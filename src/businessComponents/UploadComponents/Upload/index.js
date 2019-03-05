import React, { Component } from 'react'
import { Upload, message, Icon } from 'antd'
import { observer, inject } from 'mobx-react'
import './index.less'
const Dragger = Upload.Dragger

@inject('user')
@observer
class UploadComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      imageUrl: '',
      initImage: props.imageUrl || null,
      fileList: [],
      key: ''
    }
  }

  uploadButton = () => {
    return this.props.childView ? (
      <this.props.childView />
    ) : (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    )
  }
  render() {
    const { support, cssname = '' } = this.props
    let accept = ''
    if (support === 'svg') {
      accept = 'image/png, image/svg+xml'
    } else {
      accept = 'image/png, image/jpeg, image/jpg'
    }
    const config = {
      name: 'file',
      listType: 'picture-card',
      multiple: false,
      showUploadList: false,
      action: '',
      accept: accept,
      beforeUpload: file => {
        let self = this
        if (support === 'svg') {
          if (file.type !== 'image/svg+xml' && file.type !== 'image/png') {
            message.error('图片格式必须为SVG或者PNG!')
            return false
          }
        } else {
          if (
            file.type !== 'image/jpeg' &&
            file.type !== 'image/jpg' &&
            file.type !== 'image/png'
          ) {
            message.error('图片格式必须为JPG或者PNG!')
            return false
          }
        }

        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          message.error('图片大小不能超过2M!')
          return false
        }
        this.setState({ loading: true })
        const formData = new FormData()
        formData.append('file', file)
        Service.user.uploadImg(formData)
          .then(result => {
            message.success('上传成功')
            this.setState({
              loading: false,
              imageUrl: result.data.url,
              imgKey: Math.random(),
              value: result.data.url
            })
            self.props.changeheadImg && self.props.changeheadImg(result.data.url)
          })
        return false
      }
    }
    const imageUrl = this.state.imageUrl || this.props.imageUrl
    const image = (
      <div>
        <img src={imageUrl} alt="" />
      </div>
    )
    const initImageDom = (
      <div>
        <img src={this.state.initImage} alt="" />
      </div>
    )
    return (
      <div className={'upload-container' + cssname}>
        <Dragger
          {...config}
          key={this.state.key}
          {...this.props}
          disabled={this.props.disabled}
          className='upload-content'
        >
          {imageUrl && !imageUrl.file
            ? image
            : this.state.initImage
            ? initImageDom
            : this.uploadButton()}
        </Dragger>
      </div>
    )
  }
}

export default UploadComponent
