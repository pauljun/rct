import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, message } from 'antd'
import './index.less'
import CaptureViewPlus from './ImageView/captureViewPlus.js'
const IconFont = Loader.loadBusinessComponent('IconFont')
const UploadSingleFile = Loader.loadBusinessComponent('UploadComponents', 'UploadSingleFile')
const IconSpan = Loader.loadBaseComponent('IconSpan')
@withRouter
@Decorator.businessProvider('tab')
class SearchButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgCutVisible: false
    }
  }

  /**
   * @desc 上传
   */
  onUpload = url => {
    // url.url = 'http://192.168.101.14:8082/image/v1/753373359/objects/5c6e77b72ce790af1010f742/1550743956501.jpg?client_token=753373359_3356491776_1582279526_e8d4041b23bcdf8c8525edf9397eb8cc&crop=x_603,y_678,w_226,h_275&watermark=m_E8BF90E890A5E4B8ADE5BF83E7AEA1E79086E59198,c_FFFFFF,s_150,t_150,r_45'
    const { tab, type = 'face' } = this.props
    if (!url) {
      return message.error('图片上传失败')
    }
    const id = Utils.uuid()
    LM_DB.add('parameter', {
      id,
      url: url.url
    }).then(() => {
      tab.goPage({
        moduleName: `${type}Library`,
        data: {
          id,
          searchType: 1,
          isSearch: true
        }
      })
    })
  }

  /**
   * @desc 默认显示组件
   */
  getUploadView = url => {
    return !!!url ? (
      <Button className="search-btn">
        <IconFont type="icon-ImageSearch_Light" />
        <span>以图搜图</span>
      </Button>
    ) : (
      <div className="img-view-box">
        <img src={url} />
      </div>
    )
  }

  /**
   * @desc 显示隐藏截取图片
   */
  setImgCutVisible = () => {
    this.setState({
      imgCutVisible: !this.state.imgCutVisible
    })
  }

  /**
   * @desc 图片截图
   */
  captureCb = url => {
    const { changeUrl } = this.props
    changeUrl && changeUrl(url)
    if (url && url.indexOf('data:image/png;base64') >= 0) {
      url = url.split(',')[1]
    }
    this.setState({
      imgCutVisible: false
    })
  }

  /**
   * @desc 删除图片
   */
  delPic = () => {
    this.setState(
      {
        imgCutVisible: false
      },
      () => {
        this.props.changeUrl && this.props.changeUrl('')
      }
    )
  }

  /**
   * @desc 上传图片
   */
  uploadService = data => {
    return Service.face.uploadImg(data)
  }

  render() {
    const { imgCutVisible } = this.state
    const { url } = this.props
    let uploadBtn = this.getUploadView(url)
    return (
      <div className="baselib-upload-contaier">
        <UploadSingleFile expiretype={2} uploadBtn={uploadBtn} uploadTip={false} uploadService={this.uploadService} uploadDone={this.onUpload} />
        {url && (
          <div className="img-opare">
            <span>
              <IconSpan className="delete-img" icon="icon-Delete_Main" mode="inline" label="删除图片" onClick={this.delPic} />
              <IconSpan mode="inline" icon={imgCutVisible ? 'icon-Close_Main' : 'icon-Choose__Main1'} label={imgCutVisible ? '取消框选' : '手动框选'} onClick={this.setImgCutVisible} />
            </span>
          </div>
        )}
        {imgCutVisible && (
          <div className="img-cut-wrapper">
            <div className="img-cut-header">
              <span>手动框选</span>
              <IconSpan icon="icon-Close_Main" mode="inline" onClick={this.setImgCutVisible} />
            </div>
            <CaptureViewPlus
              isDownload={true}
              isStorage={true}
              isRotate={true}
              isScan={true}
              isScale={true}
              styles={{ width: '280px' }}
              options={{
                capture: true,
                init: true,
                urlSrc: url,
                width: '400px',
                height: '400px',
                captureCb: this.captureCb
              }}
            />
            <div className="img-cut-footer" />
          </div>
        )}
      </div>
    )
  }
}

export default SearchButton
