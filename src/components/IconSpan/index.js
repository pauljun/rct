/*
 * @Author: welson 
 * @Date: 2019-01-09 15:12:33 
 * @Last Modified by: welson
 * @Last Modified time: 2019-01-09 15:22:47
 */

/** 
 *  @desc 图标 + 文本组合布局
 *  @params {string}    className   组件外层类名
 *  @params {string}    icon    显示的图标
 *  @params {string}    title   图标对应的title
 *  @params {string}    label   显示文本
 *  @params {string}    type  区分antd图标或自定义图标，默认自定义图标
 *  @params {string}    mode    horizontal左右布局 或 vertical上下布局， 默认 vertical
 *  @params {boolean}   disabled  是否禁用
 *  @params {boolean}   detail  是否使用antd显示Tooltip，默认false
 *  @params {string}    placement  Tooltip显示位置，默认 bottom
 *  @params {function}    onClick  点击事件
 *  @params {ReactElement}    children  接受子组件
 */

import React from 'react';
import { Tooltip, Icon } from 'antd';
// import IconFont from '../IconFont';
import 'src/assets/style/components/iconSpan.less';

const IconFont = Loader.loadBaseComponent('IconFont');

/**
 * mode: horizontal(水平) vertical(默认上下)
 */
const IconSpan = ({
  className = '',
  onClick = null,
  icon = '',
  title = '', // Icon的title
  label = '', // 显示文本
  mode = 'vertical',
  children = null,
  disabled = false,
  detail,
  placement = 'bottom',
  type,
  ...rest
}) => {
  const CurrentIcon = type === 'antd' ? Icon : IconFont;
  const modeClass =
    mode === 'vertical' ? 'icon-span-vertical' : 'icon-span-horizontal';
  const disabledClass = disabled ? 'disabled' : '';
  const content = (
    <span
      className={`icon-span ${disabledClass} ${modeClass} ${className}`}
      onClick={!disabled ? onClick : null}
      {...rest}
    >
      {icon && <CurrentIcon title={title} type={icon} />}
      {label && <span>{label}</span>}
      {children}
    </span>
  );
  if (!detail) {
    return content;
  }
  return (
    <Tooltip placement={placement} title={detail}>
      {content}
    </Tooltip>
  );
};

export default IconSpan;
