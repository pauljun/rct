import React, { Component } from 'react';
import { observer } from 'mobx-react';

const ItemComponent = Loader.loadBusinessComponent('Statistics','ItemComponent')

@Decorator.errorBoundary
@observer
class Library extends Component {
	state = {
		resourcesStatis: {}
	};

	componentDidMount() {
		Service.statistics.countMonitorInfos().then((res) => {
			this.setState({ resourcesStatis: res.data || {}});
		});
	}
	render() {
		let { resourcesStatis } = this.state;
		return (
			<div className="chart table">
				<div className="resource-item-wrapper">
					<ItemComponent label="布控总人数" icon="icon-People_Light" value={Utils.splitNum(resourcesStatis.personCount)} />
					<ItemComponent label="布控任务" icon="icon-Data___Dark3" value={Utils.splitNum(resourcesStatis.taskCount)} />
					<ItemComponent label="布控库总数" icon="icon-Layer_Main" value={Utils.splitNum(resourcesStatis.libCount)} />
				</div>
			</div>
		);
	}
}
export default Library;