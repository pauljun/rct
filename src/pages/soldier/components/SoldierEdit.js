import React from 'react';
import { Input, Divider } from 'antd';

import './SoldierEdit.less';

const IconSpan=Loader.loadBaseComponent('IconSpan')
const TreeList=Loader.loadBusinessComponent('SystemOrgTree')

export default class SoldierEdit extends React.Component {
  render () {
    const { isEdit, editItem, activeOrgIds, userList, radioValue, leafClk, treeRef, clickUserName, onSearchChange } = this.props;
    return (
      <div className='soldier-modal-content-wrapper'>
        <label className='soldier-name-wrapper'>
          <div className='name-label required'>
            单兵名称:
          </div>
          <div className='name-value'>
            <Input
              autoComplete='off'
              onChange={onSearchChange}
              defaultValue={
                isEdit && editItem ? editItem.deviceName : ''
              }
            />
          </div> 
        </label>
        <div className='org-user-wrapper'>
          <div className="name-label"> 绑定用户: </div>
          <div className="solider-choice-user">
            <TreeList
              className={`setting-org-tree`}
              treeActiveKey={activeOrgIds}
              leafClk={(clickKey) => leafClk(clickKey, isEdit)}
              viewRef={treeRef}
            >
              <Divider/>
            </TreeList>
            <div className="choice-user-list">
              {userList.map(v => {
                const activeStatus = radioValue === v.id;
                return (
                  <div key={v.id} className={`user-item ${activeStatus ? 'active' : ''}`} onClick={() => clickUserName(v)}>
                    <IconSpan
                      icon="icon-_PeopleAnalysis"
                      mode='inline'
                      label={`${v.loginName}/${v.realName}`}
                    />
                    {activeStatus && <IconSpan className='user-select-icon' mode='inline' icon='icon-YesorNo_Yes_Light' />}
                  </div>
                )
              })} 
            </div>
          </div>  
        </div>
      </div>   
    )
  }
}
