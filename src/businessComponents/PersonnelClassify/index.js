import React from 'react';
import './index.less';

export default ({LongLiveTotal,ReUnAppearTotal,type}) => {
      let total=LongLiveTotal+ReUnAppearTotal;
      let reLength=Math.floor((LongLiveTotal/total)*280);
      let anLength=280-reLength;
    return (
      <div className="community-click">
        <div className="community-handle">
          <div style={{width:`${reLength}px`}}/>
          <div style={{width:`${anLength}px`}} />
        </div>
        <div className="community-masword">
          <div className="community-one">
            <span>{type == "unregistered" ? '频繁出现' : '常住居民'}</span>
            <span>{LongLiveTotal||0}</span>
          </div>
          <div className="community-two">
            <span>{type == "unregistered" ? '偶尔出现' : '长期未出现'}</span>
            <span>{ReUnAppearTotal||0}</span>
          </div>
        </div>
      </div>
    );
}
