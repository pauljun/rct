import React, { Component } from 'react';
import EntryCard from './entryCard';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Popover, Checkbox} from 'antd';
// import InputAfter from 'src/components/InputAfter';
import './communityList.less';

const { stopPropagation } = Utils;
const SearchInput=Loader.loadBaseComponent('SearchInput')
@withRouter
@inject('tab')
@observer
class CommunityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedAll: true,
      currentId: ''
    }
  }

  inputHandleChange = (value) => {
    this.props.getVillageList(value);
  }

  handleSearch = () => {
    let { inputValue } = this.state;
    this.props.getVillageList(inputValue);
  }
  //常住跳转
  residenceHandle = ( type, id, e) => {
    stopPropagation(e);
    if(id) {
      let { tab, location } = this.props;
      let moduleName = type == 0 ? 'communityRegistered': 'communityUnRegistered';
      tab.goPage({ moduleName,location,data: {id} })
    }
  }
      
  handleSelect = () => {
    let { checkedAll } = this.state;
    if(!checkedAll) {
      this.setState({
        currentId: '',
        checkedAll: true
      }, () => {
        //this.props.restMap();
        this.props.refreshAllMes();
      })
    }
  }

  clickCommunity = (data) => {
    let { currentId } = this.state;
    
    if(currentId == data.id) {
      this.setState({
        currentId: '',
        checkedAll: true
      })
      this.props.refreshAllMes();
    //this.props.restMap();
    } else {
      this.setState({
        currentId: data.id,
        checkedAll: false
      })
      this.props.clickCommunity(data);
    }
  }
  render() {
    let { data = [] } = this.props;
    let { inputValue, checkedAll, currentId } = this.state;
    return (
      <div className="community_list">
      <div className="community_list_header">
      <p className="list_title">
          我的小区
       </p>
      <div className="community_list_checkbox">
            全部显示
            <span style={{ paddingLeft: '6px' }}>
              <Popover
                overlayClassName={'overview-checkbox-span-pop-community'}
                placement="bottom"
                content={
                  checkedAll ? (
                    <span>请选择下面列表查看单个小区常住人口</span>
                  ) : (
                    <span>全部显示小区常住人口</span>
                  )
                }
              >
                <Checkbox
                  onChange={this.handleSelect}
                  checked={checkedAll}
                />
              </Popover>
            </span>
          </div>
      </div>

       <div className="list_search">
         <SearchInput style={{ color: 'rgba(0,0,0,.25)' }} value={inputValue} placeholder="请输入小区名称搜索" onChange={this.inputHandleChange}/>
       </div>
       <div className="list_content">
          {data && data.map((item, index) => {
            return (
              <EntryCard currentId={currentId} key={index} data={item} clickCommunity={this.clickCommunity} residenceHandle={this.residenceHandle} />
            )
          })}
       </div>
      </div>
    )
  }
}

export default CommunityList;
