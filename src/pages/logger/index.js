import React from 'react';
import { observer} from 'mobx-react';
import { withRouter } from 'react-router-dom';
import LoggerTableView from './components/logTab';
import SearchForm from './components/searchForm';
// import { getLogInfoList } from 'src/service/url';
import _ from 'lodash';
import './index.less';

const logInfoDict = Service.url.getLogInfoList()
const WrapperView = Loader.loadBusinessComponent('SystemWrapper');
const appList = Dict.getDict('logAppOrWeb')
let actionModelType=[], actionFeaturnType=[]
let actionPlatType=[
	{
		text:"全部操作端",
		code:null
	},
	{
		text:"Web端",
		code: 'userAgentWeb'
	},
	{
		text:"App端",
		code:'userAgentMobile'  
	}
]
const logAllInfo=_.unionBy(logInfoDict,appList,'code');//合并去重
logAllInfo.map(v => {
	if(v.parent) {
		actionFeaturnType.push(v);
	} else {
		actionModelType.push(v);
	}
})
@withRouter
@Decorator.businessProvider('logManagement','tab','user')
@observer
class PlatFormLogger extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			total: 0,
			loading:false
		};
	}
	componentWillMount() {
		const { user } = this.props
		const centerIds = [_.cloneDeep(user.userInfo.operationCenterId)]
		let { logManagement } = this.props;
		logManagement.initData({centerIds})
	  this.setEndTime()
		this.getLogList();
	}

	setEndTime = () => {
		let currentDayLastTime = new Date();
		currentDayLastTime.setHours(23);
		currentDayLastTime.setMinutes(59);
		currentDayLastTime.setSeconds(59);
		// const endTime = moment(currentDayLastTime).format('YYYY-MM-DD HH:mm:ss');
		const endTime =(new Date(currentDayLastTime)).valueOf()
		let { logManagement } = this.props;
		logManagement.editSearchData({endTime});
	}

	// 获取数据
	getLogList = (options={}) => {
		this.setState({
			loading:true
		})
		let { logManagement } = this.props;
		logManagement.editSearchData(options).then(() => {
			const params = _.cloneDeep(logManagement.searchData);
			Service.logger.queryLogs(params).then((result) => {
				this.setState({
					total: result.data.total,
					list: result.data.list,
					loading:false
				});
			})
		});
	}

	onChange = (page, pageSize) => {
		this.getLogList({ offset:(page-1)*pageSize, limit: pageSize });
	};
	render() {
		const { logManagement ,menuInfo} = this.props;
		const { searchData } = logManagement;
		const { list, total, loading } = this.state;
		return (
			<WrapperView 
				name=' '
				width='1300px'
			>
				<div className="logger-platform-view">
			  	<div className='title-l'>日志管理</div>
					<div className='logger-container'>
						<div className="platform-header">
							<SearchForm 
								search={this.getLogList}
								menuInfo={menuInfo}
								logInfoDict={logInfoDict}
								appList={appList}
								logAllInfo={logAllInfo}
								actionModelType={actionModelType}
								actionFeaturnType={actionFeaturnType}
								actionPlatType={actionPlatType}
							  setEndTime={this.setEndTime}
							/>
						</div>
						<div className="platform-content">
							<LoggerTableView
								logInfoDict={logInfoDict}
								logAllInfo={logAllInfo}
								key="soldier"
								sourceList={actionPlatType}
								total={total}
								searchData={searchData}
								dataSource={list}
								loading={loading}
								onChange={this.onChange}
								scroll={{y:'100%'}}
							/>
						</div>
					</div>
				</div>
			</WrapperView>
		);
	}
}

export default PlatFormLogger;
