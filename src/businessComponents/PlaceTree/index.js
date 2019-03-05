import React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import { Set } from 'immutable';

const Tree = Loader.loadBaseComponent('Tree');
const IconFont = Loader.loadBaseComponent('IconFont');
const SearchInput = Loader.loadBaseComponent('SearchInput');

@Decorator.businessProvider('place')
@observer
class PlaceTree extends React.Component {
  constructor(props) {
    super(props);
    const { expandedKeys, place } = this.props;
    this.state = {
      keyword: null,
      expandedKeys: expandedKeys || [place.placeTreeData[0].id],
      treeData: place.placeTreeData
    };
  }
  onChange = value => {
    const { place } = this.props;
    let expandedKeys = [];
    if (!value) {
      expandedKeys = [place.placeTreeData[0].id];
    } else {
      let keys = [];
      const orgs = place.placeArray.filter(v => v.name.indexOf(value) > -1);
      orgs.forEach(v => {
        let ids = place.queryPlaceIdsForParentId(v.id).map(v => v.id);
        keys = [].concat(keys, ids);
      });
      expandedKeys = [...new Set([...keys])];
    }
    this.setState({
      expandedKeys,
      keyword: value
    });
  };
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys
    });
  };
  renderSuffix = node => {
    const { showCount, renderSuffix } = this.props;
    return (
      <span className="tree-node-suffix">
        {showCount && (
          <>
            <i className="online-count">{node.deviceCount.onlineCount}/</i>
            <i className="count">{node.deviceCount.count}</i>
          </>
        )}
        {renderSuffix && renderSuffix(node)}
      </span>
    );
  };
  render() {
    const { place, className = '', title = '行政区划', inputPlaceholder = '请输入组织名称', disableCheckbox=false,hasTitle = false, hasSearch = false, renderHeader, treeNodeClass, activeKey, selfTreeData = false, ...props } = this.props;
    const { expandedKeys, treeData } = this.state;
    let treeDatas = selfTreeData ? this.props.treeData : treeData;
    return (
      <div className={`place-tree resource-select-tree ${className}`}>
        {hasTitle && (
          <div className="title-part">
            <span>{title}</span>
            {hasSearch && <SearchInput className="input-keword" placeholder={inputPlaceholder} onChange={this.onChange} />}
          </div>
        )}
        {renderHeader && renderHeader()}
        <Tree
          {...props}
          treeData={treeDatas}
          onExpand={this.onExpand}
          selectedKeys={activeKey}
          expandedKeys={expandedKeys}
          treeNodeProps={{
            treeNodeIcon: node => <IconFont type={`${node.id === treeData[0].id ? 'icon-TreeIcon_index_Main2' : 'icon-TreeIcon_Group_Main2'}`} />,
            keyword: this.state.keyword,
            suffix: this.renderSuffix,
            treeNodeClass: treeNodeClass,
            disableCheckbox:disableCheckbox
          }}
        />
      </div>
    );
  }
}

export default PlaceTree;
