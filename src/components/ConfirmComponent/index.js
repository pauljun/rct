import React from 'react';
import { Modal } from 'antd';
import svgDelete from './Delete.svg';
import svgWarning from './Warning.svg';
import unbind from './unbind.svg'
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');

const svgMap = {
  warning: svgWarning,
  delete: svgDelete,
  unbind:unbind
}

export default ({
  className='', 
  centered=true, 
  visible, 
  onOk, 
  onCancel, 
  title, 
  img='', // 图片展示，默认包含删除和警告图片，可自行添加其他图片
  children=null,
  icon='',
  ...rest
}) => (
  <Modal 
    className={`c-modal-wrapper ${className}`} 
    title={title} 
    centered={centered}
    visible={visible} 
    onOk={() => onOk&&onOk()}
    onCancel={() => onCancel&&onCancel()} 
    {...rest}
  >
    {img && (
      <img className='default-img' src={svgMap[img] || img} alt=""/>
    )}
    {icon && (
			<IconFont className='c-modal-icon' type={icon} theme="outlined" />
    )}
    { children }
  </Modal>
)

