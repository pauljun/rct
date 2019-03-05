import React from 'react';
import { Upload, message, Button } from 'antd';
import { observer, inject } from 'mobx-react';

const IconFont = Loader.loadBaseComponent('IconFont')

@inject('user')
@observer
class ZipUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      lyyUrl:'',
      fileName: '',
      fileList:[]
    }
  }
  
	render() {
    const props = {
			name: 'file',
			multiple: false,
      showUploadList:false,
      beforeUpload: file => {
        let self = this;
        const isZip = file.name.substr(-3) === 'zip';
				const isLt2M = file.size / 1024 / 1024 < 100;
        if (!isLt2M) {
          message.error('压缩包大小不能超过100M!')
          return false
        }
        if (!isZip) {
          message.error('文件格式应为zip，请重新上传!')
          return false
        }
				Service.person.uploadPersonsFile(file).then((res) => {
          let lyyUrl = res.data.url;
          message.success('上传成功')
          self.props.uploadZip && self.props.uploadZip(lyyUrl, file.name);
          this.setState({
            loading: false
          })
				})
				return false
			}			
    };
		return (
			<div className="info-upload">
				<Upload {...props} accept="application/zip">
					<Button loading={this.state.loading}>
					<IconFont type={'icon-Zoom__Light'} theme="outlined" />批量导入
					</Button>
				</Upload>
			</div>
		);
	}
}
export default ZipUpload
