import React from 'react';

import './index.less';

const IconSpan = Loader.loadBaseComponent('IconSpan');
const LibHeader = Loader.loadBusinessComponent('MonitorLibrary','LibHeader');
const AuthComponent = Loader.loadBusinessComponent('AuthComponent');

// 黑名单库、白名单库详情查看
const LibDetailView = ({ className='', libTypeInfo, libDetail={}, userId, onEdit }) => {
  const managerList = libDetail.managers || [];
  const { libLabel, authAction } = libTypeInfo;
  let label = `${libLabel}库`;
  return (
    <div className={`monitee-lib-info-wrapper ${className}`}>
      <LibHeader title={`${label}详情`}>
        <div className='lib-info-edit'>
          { userId === libDetail.creatorId && (
            <AuthComponent actionName={authAction}>
              <IconSpan 
                className='span-btn'  
                mode='inline'
                icon="icon-Edit_Main" 
                onClick={onEdit} 
                label='编辑' 
              />
            </AuthComponent>
          )}
        </div>
      </LibHeader>
      <div className='lib-info-container'>
        <div className='lib-info lib-name'>
          <span className='info-label'>{`${label}名称 :`}</span>
          <span className='info-value'>{libDetail.name}</span>
        </div>
        <div className='lib-info lib-desc'>
          <span className='info-label'>{`${label}描述 :`}</span>
          <span className='info-value info-desc'>{libDetail.description || '-- 暂无描述 --'}</span>
        </div>
        <div className='lib-info lib-manager'>
          <span className='info-label'>
            查看权限 (  <span className='highlight'> {managerList.length} </span> 人 ) :
          </span>
          <div className='lib-manager-list clearfix'>
          { !!managerList.length && managerList.map(v => (
              <span className='list-item fl' key={v.id}>
                {v.name}
              </span>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibDetailView;

