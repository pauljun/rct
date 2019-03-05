import { observable, action } from 'mobx';

let Floatsearch = {
  villageIds: [],
  tagCodes: [],
  isFocus:-1,
  keywords: '',
  faceFeature: '',
  peroidType:0,
  unregisteredPeopleType:2,
  startTime:undefined,
  endTime:undefined,
  limit:36,
  offset:0,
  sort:["count|desc"]
};
let FloatsearchAppear = {
  villageIds: [],
  tagCodes: [],
  isFocus:-1,
  keywords: '',
  faceFeature: '',
  peroidType:0,
  unregisteredPeopleType:1,
  startTime:undefined,
  endTime:undefined,
  limit:36,
  offset:0,
  sort:["count|desc"]
};
let allFloatSearchOptions = {
  villageIds: [],
  tagCodes: [],
  isFocus:-1,
  keywords: '',
  faceFeature: '',
  peroidType:0,
  unregisteredPeopleType:-1,
  startTime:undefined,
  endTime:undefined,
  sort:["count|desc"],
  limit:36,
  offset:0
}
class FloatPerson {
  /**搜索条件 */
  @observable
  FloatsearchOption = Floatsearch;
  @observable
  FloatsearchOptionUnappear = FloatsearchAppear;
  @observable
  allFloatSearchOption = allFloatSearchOptions;
  @observable imgurl = '';
  @observable extraImgurl = '';
  @observable allImgurl = '';
  @observable val = '';
  @observable extraVal = '';
  @observable allVal = '';
  @action
  editSearchData(options, key) {
    return new Promise(resolve => {
      if (key == 1) {
        let params = Object.assign({}, this.FloatsearchOption, options);
        this.FloatsearchOption = params;
      } 
      if(key==2) {
        let params = Object.assign({}, this.FloatsearchOptionUnappear, options);
        this.FloatsearchOptionUnappear = params;
      }
      if(key==3) {
        let params = Object.assign({}, this.allFloatSearchOption, options);
        this.allFloatSearchOption = params;
      }
      resolve();
    });
  }
  /**初始化查询条件 */
  @action
  initSearchData(key) {
    if (key == 1) {
      this.FloatsearchOption = Floatsearch;
    } 
    if(key==2) {
      this.FloatsearchOptionUnappear = FloatsearchAppear;
    }
    if(key==3) {
      this.allFloatSearchOption = allFloatSearchOptions;
    }
  }
  @action
  editImgUrl(url, activeKey) {
    if (activeKey == 1) {
      this.imgurl = url;
    } 
    if(activeKey==2) {
      this.extraImgurl = url;
    }
    if(activeKey==3){
      this.allImgurl=url;
    }
  }
  @action
  editVal(val, activeKey) {
    if (activeKey == 1) {
      this.val = val;
      this.FloatsearchOption.keywords = val;
    } 
    if(activeKey==2) {
      this.extraVal = val;
      this.FloatsearchOptionUnappear.keywords = val;
    }
    if(activeKey==2) {
      this.allVal = val;
      this.allFloatSearchOption.keywords = val;
    }
  }
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
}

export default new FloatPerson();
