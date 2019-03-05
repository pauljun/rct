import React from 'react';
import { Breadcrumb } from 'antd';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont')
export default ({ list, ...props }) => {
  return (
    <div className="setting-breadcrumb-container">
      <Breadcrumb separator={'>'}>
        {list.map((v, i) => (
          <Breadcrumb.Item key={v.id}>
            {i === 0 && <IconFont type="icon-TreeIcon_index_Main" />}
            {v.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      {props.children}
    </div>
  );
};
