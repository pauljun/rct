import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import Config from 'src/service/config';
const DateRangePicker = Loader.loadBaseComponent('RangePicker');
const { api } = Config;
const timeSearchBtns = [{
	label: '7日',
	value: 7
}, {
	label: '15日',
	value: 15
}, {
	label: '30日',
	value: 30
}, ]

const typeSearchBtns = [{
	label: '模块到达率',
	value: 1
}, {
	label: '模块使用率',
	value: 2
}, {
	label: '人脸、人体图库分析',
	value: 3
}, { 
	label: '搜图方式分析',
	value: 4
}, ]
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

@withRouter
@Decorator.businessProvider('logStatistic')
@observer
class SearchForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render(){
    const { logStatistic,doSearch,className,setTimeRange,timeChange,timeActive,setSearchType} = this.props
    const { searchData } = logStatistic
    let downloadUrl = `${api}statistics/exportStatisticsLog?type=${searchData.type}&begin=${moment(searchData.begin) * 1}&end=${moment(searchData.end)*1}`
    const type = searchData.type || 1;
		return (
			<div className={className}>
				<div className="time-view search-part">
					<div className="search-title">时间：</div>
					<div className="search-box time-search-box">
            <div className='time-btns'>
              { timeSearchBtns.map(v => (
                  <Button
                    key={v.value}
                    className={timeActive === v.value ? 'active' : ''}
                    onClick={() => setTimeRange(v.value)}
                  >
                    {v.label}
                  </Button>
                ))
              }
            </div>
            <DateRangePicker
              allowClear={false}
              className='date-range'
              startTime={searchData.begin}
              endTime={searchData.end}
              maxDate={true}
              onChange={(type,value) => timeChange(type,value)}
            />
					</div>
				</div>
				<div className="type-view search-part">
					<div className="search-title">类型：</div>
          <div className="search-box type-search-box">
						<ul>
            { typeSearchBtns.map(v => (
                <li 
                  key={v.value} 
                  className={type ===v.value ? 'active' : ''}
                  onClick={() => setSearchType(v.value)}
                >
                  {v.label}
                </li>
              )) 
            }
						</ul>
					</div>
				</div>
        <div className="btn-box">
          <Button 
            type="primary" 
            className='search' 
            icon="search" 
            onClick={doSearch}
          >查询</Button>
          <Button 
            type="primary" 
            className='download' 
            icon="download"
            href={downloadUrl}
          >
            下载表格
          </Button>
      </div>
			</div>
		)
	}
}


export default SearchForm;
