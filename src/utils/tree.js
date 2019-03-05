
/**
 * 转换tree
 * @param {Array} treeData
 * @param {string} id
 * @param {string} pid
 */
export function computPlaceTree(list, id = 'id', pid = 'parentId', isNoDeep) {
  let treeData;
  if (!isNoDeep) {
    treeData = window._.cloneDeep(list);
  } else {
    treeData = list;
  }
  let arr = [];
  treeData.forEach((item, index) => {
    let isParent = false;
    if (item.level === 5&&!treeData.find(v => {
      return v[id] == item[pid]
    })){
      for (let i = item.pcodes.length; i > 0; i--) {
        let out = false
        treeData.forEach(item2 => {
          if (item2[id] == item.pcodes[i]) {
            !Array.isArray(item2.children) && (item2.children = []);
            item2.children.push(item);
            out = true
          }
        })
        if (out) {
          return
        }
      }
    }else{
      treeData.forEach(item2 => {
        if (item[pid] && item[pid] == item2[id]) {
          isParent = true;
          !Array.isArray(item2.children) && (item2.children = []);
          item2.children.push(item);
        }
      });
    }
    !isParent && arr.push(index);
  });
  return treeData.filter((item, index) => arr.indexOf(index) > -1);
}

export function computTreeList(list, id = 'id', pid = 'parentId', isNoDeep) {
  let treeData;
  if (!isNoDeep) {
    treeData = window._.cloneDeep(list);
  } else {
    treeData = list;
  }
  let arr = [];
  treeData.forEach((item, index) => {
    let isParent = false;
    treeData.forEach(item2 => {
      if (item[pid] && item[pid] == item2[id]) {
        isParent = true;
        !Array.isArray(item2.children) && (item2.children = []);
        item2.children.push(item);
      }
    });
    !isParent && arr.push(index);
  });
  return treeData.filter((item, index) => arr.indexOf(index) > -1);
}


export function computPlaceTreeList(list, id = 'id', pid = 'parentId', isNoDeep) {
  let treeData;
  if (!isNoDeep) {
    treeData = window._.cloneDeep(list);
  } else {
    treeData = list;
  }
  let arr = [];
  treeData.forEach((item, index) => {
    let isParent = false;
    treeData.forEach(item2 => {
      if (item[pid] && item[pid] == item2[id]) {
        isParent = true;
        !Array.isArray(item2.children) && (item2.children = []);
        item.parentLevel = item2.level
        item2.children.push(item);
      } 
    });
    !isParent && arr.push(index);
  });
  return treeData.filter((item, index) => arr.indexOf(index) > -1);
}