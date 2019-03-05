import React from 'react';

import './index.less';

/**
 * pageType pre 上一页  next 下一页
 * imgUrl 图片路径
 * imgType 水印类型  ‘normal‘ 一个水印   ‘multiple2个水印
 * onChange 调用方法
 */

const IconFont = Loader.loadBaseComponent('IconFont');
const ImageView = Loader.loadBusinessComponent('ImageView');

export default ({
  onChange,
  imgUrl,
  id,
  className = '',
  pageType = 'next'
}) => {
  return (
    <React.Fragment>
      {imgUrl ? (
        <div
          className={`page-details ${className}`}
          onClick={() => onChange(id, pageType)}>
          <div className="page-image">
            <ImageView src={imgUrl} />
          </div>
          {pageType === 'next' ? (
            <p className="pre">
              下一个
              <IconFont type={'icon-Arrow_Big_Right_Main'} theme="outlined" />
            </p>
          ) : (
            <p className="pre">
              <IconFont
                type={'icon-Arrow_Big_Left_Main'}
                theme="outlined"
              />
              上一个
            </p>
          )}
        </div>
      ) : (
        <div className="null-pre" />
      )}
    </React.Fragment>
  );
};
