import React from 'react';
import { Spin } from 'antd';
import 'src/assets/style/components/loading.less';

export default ({ size = 'narmal' }) => {
  return (
    <Spin size={size}>
      <div style={{ width: '100%', height: '100%', minHeight: 400 }} />
    </Spin>
  );
};
