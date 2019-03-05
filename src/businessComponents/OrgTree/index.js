import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import './index.less';
import { Set } from 'immutable';

const Tree = Loader.loadBaseComponent('Tree');
const IconFont = Loader.loadBaseComponent('IconFont');
const SearchInput = Loader.loadBaseComponent('SearchInput');

@Decorator.businessProvider('organization')
@observer
class OrgTree extends React.Component {
  constructor(props) {
    super(props);
    const { expandedKeys, organization } = this.props;
    this.state = {
      keyword: null,
      expandedKeys: expandedKeys || [organization.orgTreeData[0].id]
    };
  }

  onChange = value => {
    const { organization } = this.props;
    let expandedKeys = [];
    if (!value) {
      expandedKeys = [organization.orgTreeData[0].id];
    } else {
      let keys = [];
      const orgs = organization.orgArray.filter(
        v => v.name.indexOf(value) > -1
      );
      orgs.forEach(v => {
        let ids = organization.getParentOrgListByOrgId(v.id).map(v => v.id);
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
    const {
      organization,
      className = '',
      title = '组织机构',
      inputPlaceholder = '请输入组织名称',
      hasTitle = false,
      hasSearch = false,
      renderHeader,
      treeNodeClass,
      activeKey,
      ...props
    } = this.props;
    const { expandedKeys } = this.state;
    const treeData = organization.orgTreeData;
    return (
      <div className={`organization-tree resource-select-tree ${className}`}>
        {hasTitle && (
          <div className="title-part">
            <span>{title}</span>
            {hasSearch && (
              <SearchInput
                className="input-keword"
                placeholder={inputPlaceholder}
                onChange={this.onChange}
              />
            )}
          </div>
        )}
        {renderHeader && renderHeader()}
        <Tree
          {...props}
          treeData={treeData}
          onExpand={this.onExpand}
          selectedKeys={toJS(activeKey)}
          expandedKeys={expandedKeys}
          treeNodeProps={{
            treeNodeIcon: node => (
              <IconFont
                type={`${
                  node.id === treeData[0].id
                    ? 'icon-TreeIcon_index_Main2'
                    : 'icon-TreeIcon_Group_Main2'
                }`}
              />
            ),
            keyword: this.state.keyword,
            suffix: this.renderSuffix,
            treeNodeClass:treeNodeClass
          }}
        />
      </div>
    );
  }
}

export default OrgTree;
