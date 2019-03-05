import React from 'react';
import moment from 'moment';

import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');
const ImageView = Loader.loadBusinessComponent('ImageView');

class KeyPonitRollingCard extends React.Component {
	checkBoxChange = (data, e) => {
		Utils.stopPropagation(e);
		let type = e.target.checked;
		if (type) {
			data = Object.assign({}, data, { checked: 1 });
		} else {
			data = Object.assign({}, data, { checked: 0 });
		}
		this.props.checkBoxChange(data);
	};
	render() {
		let { data = {}, handleChangeList, isActive, libType } = this.props;
		return (
			<div className={`key-ponit-rolling-card ${isActive ? 'active-card' : ''}`} onClick={() => handleChangeList(data.id)}>
				<div className="lis-card-img-box">
					<ImageView src={data.faceUrl} className='img'/>
				</div>
				<div className="card-content">
									{libType === 1 && (
						<div className="card-text">
							{data.isHandle === 0 ? <i className="content-cir" /> : <IconFont className={ data.isEffective === 1 ? 'iconYellow' : 'iconRed' } type={data.isEffective === 1 ? 'icon-YesNo_Yes_Main' : 'icon-YesNo_No_Main'} theme="outlined" /> }
							<p className="content-p">{data.isHandle == 0 ? '未处理' : data.isEffective == 1 ? '有效' : '无效'}</p>
						</div>
					)}
				<div className="card-text">
							<IconFont type={'icon-Like_Main2'} theme="outlined" />
							<p className="content-p">
								相似度 <span className="content-span">{data && Math.floor(data.score)}%</span>
							</p>
						</div>
					{libType == 4 && (
						<div className="card-text">
							<IconFont type={'icon-TreeIcon_People_Main2'} theme="outlined" />
							<p className="content-p">{}</p>
						</div>
					)}
					<div className="card-text">
						<IconFont type={'icon-Add_Light'} theme="outlined" />
						<p className="content-p" title={data.deviceName}>{data.deviceName && Utils.getSubStr(data.deviceName)}</p>
					</div>
					<div className="card-text">
						<IconFont type={'icon-Clock_Light'} theme="outlined" />
						<p className="content-p">{moment(+data.captureTime).format('YYYY.MM.DD HH:mm:ss')}</p>
					</div>
				</div>
			</div>
		);
	}
}

export default KeyPonitRollingCard;
