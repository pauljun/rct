import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Promise } from 'q';

const ItemComponent = Loader.loadBusinessComponent('Statistics','ItemComponent')

@Decorator.errorBoundary
@observer
class Resource extends Component {
	state = {
		resourcesStatis: {}
	};

	componentDidMount() {
		Promise.all([
			Service.statistics.countPerson({days:-1}),
			Service.statistics.countPassRecords({})
		])
		.then((res) => {
			this.setState({ resourcesStatis: {...res[0].data,...res[1].data} || {}});
		});
	}
	render() {
		let { resourcesStatis } = this.state;
		return (
			<div className="chart table">
				<div className="alarms-item-wrapper">
					<ItemComponent label="资源总数" icon="icon-List_Main" value={Utils.splitNum(resourcesStatis.count && resourcesStatis.total?Number(resourcesStatis.total) + Number(resourcesStatis.count):resourcesStatis.total)} />
					<ItemComponent label="人脸图库" icon="icon-StructuredFace_Main" value={Utils.splitNum(resourcesStatis.faceCount)} />
					<ItemComponent label="人体图库" icon="icon-StructuredBody_Main" value={Utils.splitNum(resourcesStatis.bodyCount)} />
					<ItemComponent label="机动车图库" icon="icon-Data___Dark5" value={Utils.splitNum(resourcesStatis.count)} />
				</div>
			</div>
		);
	}
}
export default Resource;
