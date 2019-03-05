import React,{ Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject } from 'mobx-react';

import { Button, List } from 'antd';

import './index.less'

const AuthComponent = Loader.loadBusinessComponent('AuthComponent');
const IconFont = Loader.loadBaseComponent('IconFont');
const SearchInput = Loader.loadBaseComponent('SearchInput');
const NoData = Loader.NoData;

// 黑名单库、白名单库列表组件
@withRouter
@inject('tab')
class LibList extends Component {
 
  // 添加布控库
  addLib = (libType) => {
    const { tab, location } = this.props;
    let moduleName = ['keyPersonnelLibraryManage', 'outsiderLibraryManage']
    tab.goPage({
      location,
      moduleName: moduleName[libType - 1],
      isUpdate: true
    })
  }

  render(){
    const { className='', libTypeInfo, onSearch, listData,getUploadMachineLib, ...rest} = this.props;
    const { libType, libLabel, authAction } = libTypeInfo;
    return (
      <div className={`monitee-lib-list-wrapper ${className}`}>
        <div className='lib-list-container'>
          <div className='lib-list-search'>
            <AuthComponent actionName={authAction}>
              {libType !== 4 
                ? <Button 
                    type='primary' 
                    icon="plus" 
                    onClick={() => this.addLib(libType)}
                  >{`新建${libLabel}库`}</Button>
                : getUploadMachineLib()
              }
            </AuthComponent>
            <SearchInput
              placeholder={`请输入${libLabel}名称`}
              onChange={onSearch}
              isEnterKey={true}
            />
          </div>
          <div className='lib-list-content'>
             { !!listData.length 
                ? <InfiniteList 
                    listData={listData}
                    actionName={authAction}
                    libType={libType}
                    {...rest}
                  />
                : <NoData title='暂无布控库'/>
            } 
          </div>
        </div>
      </div>
    )
  }
}

class InfiniteList extends Component {

  renderItem = (item) => {
    const { currLibId, userId, deleteLib, getLibDetail, actionName, libType } = this.props;
    return (
      <List.Item key={item.id}>
        <div className={`item clearfix ${item.id === currLibId ? 'active' : ''}`}>
          <span 
            className="item-title fl"
            title={item.name} 
            onClick={() => getLibDetail(item.id)}
          >
            {item.name}
          </span>
          { item.creatorId === userId && libType !== 4 && (
              <AuthComponent actionName={actionName}>
                <IconFont 
                  className='item-del fr' 
                  type='icon-Delete_Main'
                  onClick={() => deleteLib(item.id, item.name, item.personCount)} 
                  title='删除布控库'
                />
              </AuthComponent>
            )
          }
        </div>
      </List.Item>
    )
  }

  render(){
    const { listData } = this.props;
    return (
        <List
          dataSource={listData}
          renderItem={this.renderItem}
        />
    )
  }
}

export default LibList;

