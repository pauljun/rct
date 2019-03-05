import React, { Component } from 'react';
import { Button } from 'antd';

import './entryCard.less';

const IconFont = Loader.loadBaseComponent('IconFont');
function sumArr(arr) {
	let a = 0;
	for (let i = 0; i < arr.length; i++) {
	  a += parseInt(arr[i]);
	}
	return a;
  }
class EntryCard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
	let {residenceHandle, data = {},clickCommunity, currentId} = this.props;
	let deviceCount=data.deviceTypeCount&&data.deviceTypeCount.length>0?sumArr(data.deviceTypeCount.map(v => v.count)):0;
	let peopleCount=data? (data.permanentCount*1+data.disappearCount*1): 0;
		return (
			<div className={`community_entry_card ${currentId == data.id ? 'community_entry_card_active': ''}`} onClick={() => clickCommunity(data)}>
				<div className="card_header">
					<div className="card_img_box">
						{data.pictureUrl ? <img className="card_img" src={data.pictureUrl} alt="" /> : <IconFont style={{fontSize: '80px', color:'#D8DCE3'}} type={'icon-Dataicon__Dark4'} theme="outlined" /> }
					</div>
					<div className="card_title_box">
						<p className="card_title">{data.villageName}</p>
						<span className="card_adress">{(data.provinceName ? data.provinceName : '') + (data.cityName ? data.cityName : '') + (data.districtName ? data.districtName : '') + (data.villageName ? data.villageName : '')}</span>
					</div>
				</div>
				<div className="card_content">
					<div className="content_people">
						<div className="content_people_left">
							<IconFont type={'icon-Often_Dark'} theme="outlined" />
							<span className="left_title">小区登记人口</span>
						</div>
						<div className="content_people_right font-resource-normal">
							{peopleCount?peopleCount:0} <span className="right_span">人</span>
						</div>
					</div>
					<div className="content_people">
						<div className="content_people_left">
							<IconFont type={'icon-_Camera__Main2'} theme="outlined" />
							<span className="left_title">小区实有设备</span>
						</div>
						<div className="content_people_right font-resource-normal">
							{deviceCount? deviceCount : 0} <span className="right_span">台</span>
						</div>
					</div>
					{/* <div className="content_people">
						<div className="content_people_left">
							<IconFont type={'icon-Control_White_Main'} theme="outlined" />
							<span className="left_title">24小时人脸采集数</span>
						</div>
						<div className="content_people_right">
							2754 <span className="right_span">张</span>
						</div>
					</div> */}
				</div>
				<div className="card_footer">
					<Button onClick={(event) => residenceHandle(0, data.id,event)}>
						<IconFont type={'icon-People_Light'} theme="outlined" />
						已登记人员
					</Button>
					<Button onClick={(event) => residenceHandle(1, data.id,event)}>
						<IconFont type={'icon-People_Other_Main'} theme="outlined" />
						未登记人员
					</Button>
				</div>
			</div>
		);
	}
}

export default EntryCard;
