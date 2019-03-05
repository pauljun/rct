import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tooltip } from 'antd';
import moment from 'moment';


const Pagination = Loader.loadBaseComponent('Pagination');
const Table=Loader.loadBaseComponent('Table');

@withRouter
@Decorator.businessProvider('tab')
class LoggerTableView extends React.Component {
	goPage(moduleName, childModuleName, data) {
		this.props.tab.goPage({
			moduleName,
			childModuleName,
			location: this.props.history,
			data,
			isUpdate: true
		});
  }
  
  getLogLabel = (code) => {
		const { logInfoDict,logAllInfo } = this.props;
    const logItem = logAllInfo.find(x => x.code+'' === code+'') || {}
    return logItem.text
  }

	render() {
    let { dataSource, loading, total, searchData, onChange, sourceList, ...props } = this.props;
		let data = dataSource
		const columns = [
			{
				title: '序号',
				dataIndex: 'id',
				width: 60,
				className:'log-column-index',
				render(text, item, index) {
					return index + 1;
				}
			},
			{
				title: '操作人',
				dataIndex: 'username',
				width: 140,
			},
			{
				title: '所属组织',
				dataIndex: 'organizationName',
				width: 95,
			},
			{
				title: '操作端',
				dataIndex: 'userAgent',
				width: 80,
				render(text){
					let code = sourceList.filter(v => v.code&&v.code === text)
					return code.length ? code[0].text : sourceList[1].text
				}
			},
			{
				title: '记录时间',
				width: 180,
				dataIndex: 'time',
				render(text, item, index) {
					return moment(+text).format('YYYY.MM.DD HH:mm:ss');
				}
			},
			{
				title: 'IP地址',
				width: 120,
				dataIndex: 'ip'
			},
			{
				title: '操作模块',
				width: 150,
				dataIndex: 'moduleName',
				// render:(text, item, index) => {
				// 	return this.getLogLabel(text)
				// }
			},
			{
				title: '操作功能',
				width: 160,
				dataIndex: 'functionName',
				// render : (text, item, index) => {
				// 	return this.getLogLabel(text)
				// }
			},
			{
				title: '描述',
				dataIndex: 'description',
				render: (text) => (
          <Tooltip overlayClassName='log-description-tooltip' title={text||''}>
            <div className='log-description'>{text || ''}</div>  
          </Tooltip> 
        )
			}
		];
		return (
			<div className="logger-table-container">
        <Table 
          className="logger-table" 
          pagination={false} 
          columns={columns} 
          dataSource={data} 
          loading={loading} 
          {...props}
        />
				<Pagination total={total} pageSize={searchData.limit} current={(searchData.offset/searchData.limit)+1} onChange={onChange} simpleMode={false}/>
			</div>
		);
	}
}

export default LoggerTableView;
