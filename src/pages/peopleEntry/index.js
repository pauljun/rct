import React from 'react';
import InfoList from './components/InfoList';
import { message } from 'antd';
import InfoFilter from './components/InfoFilter';
import ModalView from './components/ModalView';

import './style/infoEntry.less';

const Pagination = Loader.loadBaseComponent("Pagination");
const WrapperView = Loader.loadBusinessComponent("SystemWrapper");

class PeopleEntry extends React.Component {
	constructor(props) {
		super(props);
    const { location } = props;
    let ids = location.search.split("id=")[1];
		this.state = {
			choseList: [],
			total: 0,
			handleVisible: false,
			modalType: 0,
			modalValue: {}, // 导入信息
			villageId: ids, //选中的社区Id
			loading: false,
			modalInfo: undefined,
			searchData: {
				villageId: ids,
				importStatus: -1,
				page: 1,
				pageSize: 10
			}
		};
		SocketEmitter.on('importVillage', this.search);
	}
	componentDidMount(){
		this.getVillagePeopleList()
	}
	componentWillUnmount() {
		SocketEmitter.off('importVillage', this.search);
	}
	search = (res = {}) => {
		let { modalInfo } = this.state;
		if (res.code === 200) {
			this.setState({
				modalType: 1,
				handleVisible: true,
				modalValue: res.message
			});
			this.getVillagePeopleList();
			if(modalInfo) {
				modalInfo.destroy();
				this.setState({
					modalInfo: undefined
				})
			}
		} else {
			message.error(res.message);
		}
	};

	getVillagePeopleList = (ops) => {
		let { searchData, villageId } = this.state;
		let searchDatas = {...searchData,...ops}
		let options = {
			importStatus: searchDatas.importStatus,
			villageId: villageId,
			offset: (searchDatas.page-1)*searchDatas.pageSize,
			limit: searchDatas.pageSize,
		}
		Service.person.listCommunityPersons(options).then((res) => {
			this.setState({
				searchData: searchDatas,
				total: res.data.total,
				pepleList: res.data.list
			});
		});
	}

	onChange = (currentPage, pageSize) => {
		let { searchData } = this.state;
		searchData.page = currentPage;
		searchData.pageSize = pageSize;
		this.getVillagePeopleList(searchData);
	};

	ModalShow = () => {
		let { choseList, modalType } = this.state;
		if (choseList.length === 0 && modalType === 0) {
			message.info('请选择您要删除的人员信息');
			return;
		}
		this.setState({
			modalType: 0,
			handleVisible: !this.state.handleVisible,
		});
	};

	deleteCommunityPeople = () => {
		let { choseList, villageId, modalType } = this.state;
		if (choseList.length === 0 && modalType === 0) {
			message.info('请选择您要删除的人员信息');
			return;
		}
		if( modalType === 0 ) {
			this.setState({
				loading: true
			})
			let option = {
				villageId,
				failSavedPeopleIds: [],
				successSavedPeopleIds: []
			};
			choseList.map((item) => {
				if (item.importStatus === 1) {
					option.successSavedPeopleIds.push(item.id);
				} else {
					option.failSavedPeopleIds.push(item.id);
				}
			});
			Service.person.deletePersons(option).then((res) => {
				this.setState({
					handleVisible: false,
					loading: false,
					choseList: []
				},() => {
					this.getVillagePeopleList();
				});
			});
		} else {
			this.setState({
				handleVisible: false
			},() => {
				this.getVillagePeopleList();
			});
		}
	};

	crossValue = (selectedRowKeys) => {
		this.setState({
			choseList: selectedRowKeys
		});
	};

	modalInfoDestroy = (modalInfo) => {
		this.setState({
			modalInfo
		})
	}
	render() {
		let {
			villageList,
			total,
			searchData,
			villageId,
			pepleList,
			handleVisible,
			choseList,
			modalType,
			loading,
			modalValue = {}
		} = this.state;
		return (
			<div className="info-entry">
				<div className="info-entry-right">
					<div className="right-header">常住人口信息</div>
					<div className="right-content">
						<InfoFilter
							choseList={choseList}
							villageId={villageId}
							search={this.getVillagePeopleList}
							searchData={searchData}
							deletePeople={this.ModalShow}
							modalInfoDestroy={this.modalInfoDestroy}
						/>
						<div className="content-list">
							<InfoList list={pepleList} crossValue={this.crossValue} />
							<Pagination
								total={total}
								onChange={this.onChange}
								onShowSizeChange={this.onChange}
								current={searchData.page}
								pageSize={searchData.pageSize}
								pageSizeOptions={[ '10', '20', '30', '40', '50' ]}
							/>
						</div>
					</div>
				</div>
				<ModalView
					title={modalType === 0 ? '删除确认' : '导入统计'}
					visible={handleVisible}
					onCancel={this.ModalShow}
					loading={loading}
					onOk={this.deleteCommunityPeople}
					width={modalType === 0 ? 320 : 380}
					iconType={modalType === 0 ? 'icon-Delete_Main' : ''}
					view={
						modalType === 0 ? (
							<div>确定将当前选中常住人口从系统中移除？</div>
						) : (
							<div className="community-upload-modal">
								<div className="title">
									<span className="value">导入成功：</span>
									<div className="info">{modalValue.successCount || 0}人</div>
								</div>
								<div className="title">
									<span className="value">导入失败：</span>
									<div className="info">{modalValue.failCount || 0}人</div>
								</div>
								<div className="title">
									<span className="value">失败原因：</span>
									<div className="value-box">
										<p className="box-title">
											<span className="box-span">照片无特征值 </span> {modalValue.picWithoutFeatureCount || 0}人
										</p>
										<p className="box-title">
											<span className="box-span">暂无照片 </span> {modalValue.noPicCount || 0}人
										</p>
										<p className="box-title">
											<span className="box-span">信息填写错误 </span> {modalValue.wrongInfoCount || 0}人
										</p>
										<p className="box-title">
											<span className="box-span">其他 </span> {modalValue.otherCount || 0}人
										</p>
									</div>
								</div>
							</div>
						)
					}
				/>
			</div>
		);
	}
}

export default PeopleEntry;
