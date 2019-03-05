/**
 * 组件Props中checkable和hasClear有互斥影响
 *
 */
import React from 'react';
import * as _ from 'lodash';
import { Checkbox } from 'antd';
import './index.less';

const List = Loader.loadBaseComponent('List');
const IconFont = Loader.loadBaseComponent('IconFont');
const HightLevel = Loader.loadBaseComponent('HightLevel');
const DeviceIcon = Loader.loadBaseComponent('DeviceIcon');
const SearchInput = Loader.loadBaseComponent('SearchInput');

export default class ListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.selectList = props.selectList
      ? JSON.parse(JSON.stringify(props.selectList))
      : undefined;
    this.state = {
      keyword: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.selectList &&
      !Utils.isEqual(this.selectList, nextProps.selectList)
    ) {
      this.selectList = JSON.parse(JSON.stringify(nextProps.selectList));
      this.listRef.current && this.listRef.current.forceUpdateGrid();
    }
  }
  componentWillUnmount() {
    this.selectList = null;
    this.listRef = null;
  }

  // 计算全选半选状态
  computedCheckStatus = (listData, selectDeviceList) => {
    const temp = _.intersectionBy(listData, selectDeviceList, 'id');
    const isIndeterminate = temp.length && temp.length < listData.length;
    const isCheckAll = listData.length && temp.length === listData.length;
    return {
      isIndeterminate,
      isCheckAll
    };
  };

  onSearchChange = keyword => {
    this.setState({ keyword }, () => {
      this.forceUpdateGrid();
    });
  };

  forceUpdateGrid(){
    this.listRef.current && this.listRef.current.forceUpdateGrid();
  }

  /**
   * @desc 修改已选的设备
   * @param {} flag 标记是取消还是增加 true add
   * @param {} item 设备信息
   * @param {} isClear 是否通过 x 操作的
   */
  modifySelectItem = (flag, item, isClear) => {
    const { selectList, listData, onChange, checkable } = this.props;
    if (flag) {
      onChange &&
        onChange({
          list: [].concat(item, selectList),
          item,
          isClear,
          flag
        });
    } else {
      let list = checkable ? selectList : listData;
      let index = list.findIndex(v => v.id === item.id);
      list.splice(index, 1);
      onChange && onChange({ list, item, isClear, flag });
    }
  };
  renderTitle = (list) => {
    const {
      hasSearch = false,
      hasClear = false,
      onChange,
      inputPlaceholder = '请输入设备名称',
      title = '设备列表'
    } = this.props;
    return (
      <div className="title-part">
        <span>{title}</span>
        {hasSearch && (
          <SearchInput
            className="input-keword"
            placeholder={inputPlaceholder}
            onChange={this.onSearchChange}
          />
        )}
        {hasClear && (
          <IconFont
            onClick={() => onChange({ list, changeAll: true, flag: false })}
            style={{ fontSize: 16, cursor: 'pointer' }}
            type="icon-Delete_Main"
            title="清空"
          />
        )}
      </div>
    );
  };

  renderCheckTop(list, selectList) {
    const { onChange } = this.props;
    const { isCheckAll, isIndeterminate } = this.computedCheckStatus(
      list,
      selectList
    );
    return (
      <div className="check-all-part">
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isCheckAll}
          onChange={e =>
            onChange({
              list: list,
              flag: e.target.checked,
              changeAll: true
            })
          }
          disabled={!list.length}
        >
          全选
        </Checkbox>
      </div>
    );
  }

  renderItem = (item, selectIds) => {
    const {
      checkable = false,
      hasClear = false,
      icon,
      renderSuffix,
      keyword,
      hasSearch,
      onClick,
      selectItemClass = ''
    } = this.props;
    const keyStr = hasSearch ? this.state.keyword : keyword;
    const isSeleted = selectIds.indexOf(item.id) > -1;

    return (
      <div className={`item-part ${isSeleted ? selectItemClass : ''}`}>
        {checkable && (
          <Checkbox
            checked={isSeleted}
            onChange={e => this.modifySelectItem(e.target.checked, item)}
          />
        )}
        {icon ? (
          icon
        ) : (
          <DeviceIcon type={item.deviceType} status={item.deviceStatus} />
        )}
        <span
          className="item-name"
          onClick={() => onClick && onClick(item)}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
          <HightLevel
            keyword={keyStr}
            name={item.name || item.deviceName || item.realName}
          />
        </span>
        {renderSuffix && renderSuffix(item)}
        {hasClear && (
          <span
            className="clear-item"
            onClick={() => this.modifySelectItem(false, item, true)}
          >
            <IconFont type="icon-YesorNo_No_Dark" title="删除" />
          </span>
        )}
      </div>
    );
  };
  render() {
    const {
      className = '',
      checkable = false,
      hasCheckAll = false,
      hasTitle = false,
      listData = [], // 列表数据
      selectList = [],
      ...props
    } = this.props;
    const { keyword } = this.state;
    let list = [];
    if (keyword) {
      list = listData.filter(v => {
        let name = v.name || v.deviceName || v.realName;
        return !!name ? name.indexOf(keyword) > -1 : false;
      });
    } else {
      list = listData;
    }
    const selectIds = selectList.map(v => v.id);
    return (
      <div className={`list-component-layout ${className}`}>
        {hasTitle && this.renderTitle(list)}
        {checkable && hasCheckAll && this.renderCheckTop(list, selectList)}
        <div className="list-part">
          <List
            {...props}
            data={list}
            renderItem={item => this.renderItem(item, selectIds)}
            ref={this.listRef}
          />
        </div>
      </div>
    );
  }
}
