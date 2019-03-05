import React from 'react';
import AccessCard from './accessCard';
import moment from 'moment';

import './accessRecord.less';

const IconFont = Loader.loadBaseComponent('IconFont')
const ModalComponent=Loader.loadBusinessComponent('ModalComponent')
const PlayComponent=Loader.loadBusinessComponent('PlayComponent')
const NoDataComp = Loader.NoData

class AccessRecord extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			accessList: [],
			visible: false,
			modalValue: {},
			total: 0,
			option: {
				page: 1,
				pageSize: 5,
				peopleId: []
			}
		};
		this.getAccessList(this.state.option);
	}
	handleChange = (type) => {
		let { option } = this.state;
		if (type) {
			option.page += 1;
		} else {
			option.page -= 1;
		}
		this.setState(
			{
				option
			},
			() => {
				this.getAccessList(option);
			}
		);
	};

	getAccessList = (option) => {
		let {data} = this.props;
		option.peopleId = [ data.id ];
		 Service.community.getAccessList(option).then((res) => {
			this.setState({
				accessList: res.list,
				option,
				total: res.total
			});
		});
	};

	handleCard = (data) => {
		if(data.videoUrl) {
			this.setState({
				visible: true,
				modalValue: data
			})
		} else {
			return;
		}
	}

	handleCancel = (e) => {
		this.setState({
			visible: false
		})
	}

	render() {
		let { accessList = [], option, total, visible, modalValue } = this.state;
		return (
			<div className="access_record">
				{accessList.length > 0 && (
					<React.Fragment>
						<div className="record_header">
							<div className="header_l">
							门禁记录：
							</div>
							<div className="header_r">
							共 <span className="r_span">{total}</span> 条门禁记录
							</div>
					</div>
						<div className="record_content">
							{option.page > 1 ? (
								<div className="record_btn" onClick={this.handleChange.bind(this, 0)}>
									<IconFont
										type={'icon-Arrow_Big_Left_Main'}
										theme="outlined"
									/>
								</div>
							) : (
								<div className="record_btn_null" />
							)}
							<div className="record_center">
								{accessList.length > 0 ? (
									accessList.map((item, index) => {
										return <AccessCard key={index} data={item} onClick={this.handleCard} />;
									})
								) : (
									<NoDataComp title="相关数据" />
								)}
							</div>
							{total / 5 > option.page ? (
								<div className="record_btn" onClick={this.handleChange.bind(this, 1)}>
									<IconFont
										type={'icon-Arrow_Big_Right_Main'}
										theme="outlined"
									/>
								</div>
							) : (
								<div className="record_btn_null" />
							)}
						</div>
						<ModalComponent
            className='media_lib_modal'
            visible={visible} 
            title={modalValue.address}
            footer={null}
            onCancel={this.handleCancel} 
            >	
							<div className="mdeia_lib_modal_header">
							<p className="header_p" title={1}><span className="header_span">抓拍地址：</span>{modalValue.address}</p>
							<p className="header_p" title={1}><span className="header_span">门禁卡类型：</span>{modalValue.accessType && Dict.getLabel('openType', modalValue.accessType)}</p>
							<p className="header_p" title={1}><span className="header_span">抓拍时间：</span>{modalValue.captureTime && moment(+modalValue.captureTime).format('YYYY.MM.DD HH:mm:ss')}</p>
							<p className="header_p" title={1}><span className="header_span">门禁卡号：</span>{modalValue.cardNo}</p>
							</div>
							<div className="mdeia_lib_modal_content">
								<PlayComponent
									isNativeVideo={true}
									fileData={{ file: modalValue.videoUrl }}
								/>
							</div>
          </ModalComponent> 
					</React.Fragment>
				)}
			</div>
		);
	}
}

export default AccessRecord;
