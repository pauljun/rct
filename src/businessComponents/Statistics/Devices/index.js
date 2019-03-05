import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './index.less';

const ItemComponent = Loader.loadBusinessComponent('Statistics','ItemComponent')

@Decorator.errorBoundary
@observer
class Devices extends Component {
	state = {
		cameraList: []
	};

	componentDidMount() { 
		Service.device.countDeviceType({ deviceTypes: [] })
			.then((res) => {
				this.setState({ cameraList: res.data || []});
			});
	}
	getValue = (data) => {
		let count = 0;
		data.map((v) => {
			count += v.count;
		});
		return count;
	};
	render() {
		let {cameraList} = this.state;
		let total = this.getValue(cameraList);
		let znqj = {
			value:this.getValue( cameraList.filter((v) => v.deviceType === '100604')),
			name: '智能枪机'
		};
		let qj = {
			value:this.getValue( cameraList.filter((v) => v.deviceType === '100602')),
			name: '球机'
		};
		let zpj = {
			value:this.getValue( cameraList.filter((v) => v.deviceType === '100603')),
			name: '抓拍机'
		};
		let qita = {
			value: total - znqj.value - qj.value - zpj.value,
			name: '其他'
		};
		return (
			<div className="chart table">
				<div className="cameras-item-wrapper">
					<ItemComponent label="设备总数" icon="icon-_Camera__Main2" value={Utils.splitNum(total)} />
					<ItemComponent label="智能枪机" icon="icon-_Camera__Main1" value={Utils.splitNum(znqj.value)} />
					<ItemComponent label="抓拍机" icon="icon-_Camera__Main3" value={Utils.splitNum(zpj.value)} />
					<ItemComponent label="球机" icon="icon-_Camera__Main" value={Utils.splitNum(qj.value)} />
					<ItemComponent label="其他" icon="icon-Data___Dark4" value={Utils.splitNum(qita.value)} />
				</div>
			</div>
		);
	}
}
export default Devices;
