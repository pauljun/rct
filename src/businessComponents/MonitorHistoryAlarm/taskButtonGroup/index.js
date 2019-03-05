import React from 'react';
import { Button } from 'antd';
import './index.less';

export default ({ disabled, listType, onClick }) => {
  return (
    <div className="task-button-group">
      <Button
        disabled={disabled}
        type="default"
        className={listType === 1 ? 'active' : ''}
        onClick={() => onClick(1)}>
        全部任务
      </Button>
      <Button
        disabled={disabled}
        type="default"
        className={listType === 4 ? 'active' : ''}
        onClick={() => onClick(4)}>
        本地任务
      </Button>
      <Button
        disabled={disabled}
        type="default"
        className={listType === 3 ? 'active' : ''}
        onClick={() => onClick(3)}>
        指派任务
      </Button>
    </div>
  )
}