import React from 'react'
import './index.less'

const Upload = Loader.loadBusinessComponent('Upload')
const IconFont = Loader.loadBaseComponent('IconFont')

const UploadChildView = () => {
  return (
    <div className='box-upload'>
      <IconFont type='icon-AddImg_Light' />
      <p>请上传jpg、jpeg、png格式的照片搜索</p>
    </div>
  )
}

class UploadView extends React.Component {
  uploadComplete = url => {
    const { type = 'face', uploadChange } = this.props
    Service[type].queryFeatureByUrl({
      url,
      score: 0.6
    }).then(res => {
      uploadChange(res.result.imgsList)
    }).catch(err => {
      uploadChange()
    })
  }
  render(){
    const { url } = this.props
    return (
      <div className='resource-search-upload'>
        <Upload 
          imageUrl={url}
          childView={UploadChildView}
          changeheadImg={this.uploadComplete}
        />
      </div>
    )
  }
}

export default UploadView