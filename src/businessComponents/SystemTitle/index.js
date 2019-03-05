import React from 'react';
import './index.less'

export default ({className='', name, children}) => {
  return (
    <div className={`setting-head-title ${className}`}>
      <div className='titleName'>{name}</div>
      {children}
    </div>
  );
};
