import React from 'react';
import { Button, Select, Modal } from 'antd';

import '../style/infoFilter.less';

const IconFont = Loader.loadBaseComponent("IconFont");
const ZipUpload = Loader.loadBusinessComponent('UploadComponents',"ZipUpload");
const Option = Select.Option;

class InfoFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.disTime = null;
	}
	handleChange = (value) => {
		this.props.search && this.props.search({importStatus: value, page: 1, pageSize: 10});
	};
	uploadZip = (fileUrl, fileName) => {
		let { villageId, modalInfoDestroy } = this.props;
		if(fileUrl && fileUrl.indexOf('http') === -1) {
			fileUrl = BaseStore.user.systemConfig.domainAddress + fileUrl;
		}
		Service.person.importPersons({
			villageId,
			fileName,
			fileUrl
		}).then((res) => {
			const modalInfo = Modal.info({
				title: res.message,
			});
			modalInfoDestroy && modalInfoDestroy(modalInfo);
		})
	}
	
	deletePeople = () => {
		this.props.deletePeople && this.props.deletePeople();
		this.setState({
			disabled: true
		})
		this.disTime = setTimeout(() => {
			this.setState({
				disabled: false
			})
		}, 500);
	}

	componentWillUnmount() {
		clearTimeout(this.disTime);
	}
	render() {
		let { searchData, deletePeople, choseList = [] } = this.props;
		return (
			<div className="info-filter">
				<div className="filter-left">
          <ZipUpload uploadZip={this.uploadZip} />
					<a href="/resource/file/templete.zip" download='常住人口信息采集模板.zip' className="tm-download">
						<IconFont type={'icon-Download_Main'} theme="outlined" /> 文件模板下载
					</a>
				</div>
				<div className="filter-right">
					<Button disabled={ choseList.length === 0 || this.state.disabled } onClick={this.deletePeople} >
						<IconFont type={'icon-Delete_Main'} theme="outlined" />批量删除
					</Button>
					<Select dropdownClassName='info-filter-drop' defaultValue={-1} value={searchData.importStatus} style={{ width: 160 }} onChange={this.handleChange}>
						<Option value={-1}><IconFont type={'icon-List_Main2'} theme="outlined" />全部</Option>
						<Option value={0}><i className="bold green"/>上传成功</Option>
						<Option value={1}><i className="bold yellow"/>暂无照片</Option>
						<Option value={2}><i className="bold blue"/>照片无特征值</Option>
						<Option value={3}><i className="bold red"/>信息输入错误</Option>
						<Option value={4}><i className="bold yard"/>其他</Option>
					</Select>
				</div>
			</div>
		);
	}
}
export default InfoFilter