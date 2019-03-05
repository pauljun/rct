import { observable, action } from 'mobx';

let LongSearchOption = {
  villageIds: [],
  tagCodes: [],
  isFocus:-1,
  keywords: '',
  faceFeature: '',
  peroidType:0,
  registeredPeopleType:1,
  startTime:undefined,
  endTime:undefined,
  sort:["name|desc"],
  limit:36,
  offset:0
};
let LongSearchOptionUppear = {
  villageIds: [],
  tagCodes: [],
  isFocus:-1,
  keywords: '',
  faceFeature: '',
  peroidType:0,
  registeredPeopleType:2,
  startTime:undefined,
  endTime:undefined,
  sort:["name|desc"],
  limit:36,
  offset:0
};
let allSearchOptions = {
  villageIds: [],
  tagCodes: [],
  isFocus:-1,
  keywords: '',
  faceFeature: '',
  peroidType:0,
  registeredPeopleType:-1,
  startTime:undefined,
  endTime:undefined,
  sort:["name|desc"],
  limit:36,
  offset:0
}
class LongLived {
  /**搜索条件 */
  @observable
  searchOption = LongSearchOption;
  @observable
  searchOptionUnappear = LongSearchOptionUppear;
  @observable
  allSearchOption = allSearchOptions;
  @observable imgurl = '';
  @observable extraImgurl = '';
  @observable allImgurl = '';
  @observable val = '';
  @observable extraVal = '';
  @observable allVal = '';


  /**处理和改变查询条件 */
  @action
  editSearchData(options, key) {
    return new Promise(resolve => {
      if (key == 1) {
        let params = Object.assign({}, this.searchOption, options);
        this.searchOption = params;
      } 
      if(key ==2) {
        let params = Object.assign({}, this.searchOptionUnappear, options);
        this.searchOptionUnappear = params;
      }
      if(key ==3) {
        let params = Object.assign({}, this.allSearchOption, options);
        this.allSearchOption = params;
      }
      resolve();
    });
  }
  @action
  editImgUrl(url, activeKey) {
    if (activeKey == 1) {
      this.imgurl = url;
    } 
    if(activeKey == 2) {
      this.extraImgurl = url;
    }
    if(activeKey == 3) {
      this.allImgurl = url;
    }
  }
  /**获取输入内容 */
  @action
  editVal(val, activeKey) {
    if (activeKey == 1) {
      this.val = val;
      this.searchOption.keywords = val;
    } 
    if (activeKey==2) {
      this.extraVal = val;
      this.searchOptionUnappear.keywords = val;
    }
    if (activeKey==3) {
      this.allVal = val;
      this.allSearchOption.keywords = val;
    }
  }
  /**删除对应的图片和输入内容 */
  @action
  deleteImgAndVal(activeKey, type) {
    if (activeKey == 1) {
      if (type == 1) {
        this.imgurl = '';
        this.val = '';
      } else {
        this.imgurl = '';
      }
    } 
    if(activeKey==2) {
      if (type == 1) {
        this.extraImgurl = '';
        this.extraVal = '';
      } else {
        this.extraImgurl = '';
      }
    }
    if(activeKey==3) {
      if (type == 1) {
        this.allImgurl = '';
        this.allVal = '';
      } else {
        this.allImgurl = '';
      }
    }
  }
  /**初始化数据 */
  @action
  initImgandVal() {
    this.imgurl = '';
    this.val = '';
    this.extraImgurl = '';
    this.extraVal = '';
    this.allImgurl='';
    this.allVal='';
  }
  /**初始化查询条件 */
  @action
  initSearchData(key) {
    if (key == 1) {
      this.searchOption = LongSearchOption;
    } 
    if(key==2) {
      this.searchOptionUnappear = LongSearchOptionUppear;
    }
    if(key==3) {
      this.allSearchOption = allSearchOptions;
    }
  }
}

export default new LongLived();
