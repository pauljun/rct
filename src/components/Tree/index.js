 /**
  * tree 基础组件支持各种自定义其他tree可用过它来拓展
  */
 import React from 'react';
 import { Tree } from 'antd';
 import PropTypes from 'prop-types';
 import './index.less'
 
 const TreeNode = Tree.TreeNode;
 const HightLevel = Loader.loadBaseComponent('HightLevel');
 
 class TreeView extends React.Component {
   static propTypes = {
     treeNodeProps: PropTypes.shape({
       treeNodeClass: PropTypes.func,
       prefix: PropTypes.func,
       suffix: PropTypes.func,
       treeNodeIcon: PropTypes.func,
       disableCheckbox: PropTypes.func
     })
     
   };
   renderTreeNodes = list => {
     const { treeNodeProps = {} } = this.props;
     const {
       treeNodeClass,
       prefix,
       suffix,
       treeNodeIcon,
       keyword,
       disableCheckbox,
       key = 'id'
     } = treeNodeProps;
     const whatClass = treeNodeClass ? treeNodeClass : () => '';
     const whatIcon = treeNodeIcon ? treeNodeIcon : () => null;
     const disable = disableCheckbox ? disableCheckbox : () => false;
     return (
       list &&
       list.map(node => {
         const className = whatClass(node);
         return (
           <TreeNode
             className={className}
             title={
               <span title={node.name}>
                 {prefix && prefix(node)}
                 <HightLevel keyword={keyword} name={node.name} />
                 {suffix && suffix(node)}
               </span>
             }
             key={node[key]}
             dataRef={node}
             isLeaf={node.isLeaf}
             icon={whatIcon(node)}
             disableCheckbox={disable(node)}
           >
             {node.children && this.renderTreeNodes(node.children)}
           </TreeNode>
         );
       })
     );
   };
 
   render() {
     const {
       className = '',
       treeData = [],
       showIcon = true,
       treeNodeProps,
       ...props
     } = this.props;
     return (
       <Tree
         className={`base-tree-component ${className}`}
         showIcon={showIcon}
         defaultExpandedKeys={[treeData[0] ? treeData[0].id : '']}
         {...props}
       >
         {this.renderTreeNodes(treeData)}
       </Tree>
     );
   }
 }
 
 export default TreeView;