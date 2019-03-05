import React from "react";
import "./index.less";
import { Icon } from 'antd';
const IconFont = Loader.loadBaseComponent('IconFont');
const Tree = Loader.loadBaseComponent('Tree');
const SearchInput = Loader.loadBaseComponent('SearchInput');
@Decorator.businessProvider('place')
class PlaceManagementTree extends React.Component {
  state = {
    keyword: null,
    expandedKeys:[],
  };
  
  onChange = value => {
    const {
      place, selectedKeys
    } = this.props;
    let placeId = selectedKeys[0]
    let expandedKeys = [];
    if (!value) {
      if (placeId) {
        const id = place.placeArray.find(
          v => v.placeId === placeId
        ).id;
        let placeIds = []
        place.getParentPlaceListById(id).map(v => {
          if (v.placeId !== placeId) {
            placeIds.push(v.placeId)
            return placeIds
          }
        })
        expandedKeys = placeIds;
      }
    } else {
      const orgs = place.placeArray.filter(
        v => v.name.indexOf(value) > -1
      );
      let placeIds = place.getParentPlaceListByIds(orgs.map(v => v.id)).map(v => v.placeId)
      expandedKeys = placeIds
    }
    this.setState({
      expandedKeys,
      keyword: value
    });
  };

  popClick = (node,e) => {
    Utils.stopPropagation(e)
    this.props.popClick && this.props.popClick(node)
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys
    });
  };
  renderSuffix = node => {
    let {popId} = this.props
    return (
      <span className="tree-node-suffix">
        {
          node.level === 5 && node.parentLevel!==2&&
            <Icon type="plus-square" className={popId===node.placeId&&'active'} onClick={this.popClick.bind(this,node)} title='点击添加所属社区居委会/乡村居委会'/>
        }
      </span>
    );
  };

  render() {
    let {keyword,expandedKeys} = this.state
    const {
      inputPlaceholder = '请输入场所名称',
      ...props
    } = this.props;
    return (
      < div className = "place-management-tree-view" >
        < div className = "place-management-tree-search" >
          <SearchInput
            placeholder={inputPlaceholder}
            onChange={this.onChange}
          />
        </div>
        <Tree
          { ...props}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          treeNodeProps={{
            key:'placeId',
            treeNodeIcon: node => (node.level>=5?<IconFont type={`icon-Place_Dark`}/>: <IconFont type={`icon-Add_Main`}/>),
            keyword,
            suffix: this.renderSuffix,
          }}
        />

      </div>
    );
  }
}

export default PlaceManagementTree;
