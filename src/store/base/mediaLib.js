import { observable, action, computed, toJS } from 'mobx';
import Other from '../../service/url/other.js'
import moment from 'moment';
import { message } from 'antd';
// 视图库数据格式
const mediaList = [
  {
    id: '5604342b-6a62-4f98-8716-372718801f9b',
    cameraId: '538378251',
    cameraName: '吧台区-15楼',
    cameraType: 100602,
    ptzType: 'gb',
    checkedList: [],
    video: [
      {
        id: '3a6ccc43-680e-439d-86d0-27f95936565c',
        cameraId: '538378251',
        cameraName: '吧台区-15楼',
        type: 'video',
        // "captureTime": "2018-07-30 14:37:24",
        startTime: '2018-07-31 13:47:57',
        endTime: '2018-07-31 14:47:57',
        imgUrl:
          'https://jxsr-oss1.antelopecloud.cn/files?obj_id=5b600730800040000420a6e2&access_token=2147500032_3356491776_1564554698_1449dc35e34ad1652fc7fe51a2bbc3ad'
      }
    ],
    image: []
  }
];

/**
 * @desc 我的视图库（通行记录）
 */
class MediaLib {
  kvStoreKey = 'PASS_RECORD';
  @observable
  mediaList = []; // 视图库数据源
  @observable
  activeTab = 'all'; // 选中状态 all、video、 image
  @observable userId = ''; // 当前用户id

  /**
   * @desc 全部资源列表
   */
  @computed
  get listAll() {
    let data = [];
    this.mediaList.map(v => {
      data.push({
        id: v.id,
        cameraId: v.cameraId,
        cameraName: v.cameraName,
        cameraType: v.cameraType,
        ptzType: v.ptzType,
        checkedList: v.checkedList,
        listData: [].concat(toJS(v.video) || [], toJS(v.image) || [])
      });
    });
    return data;
  }

  /**
   * @desc 视频资源列表
   */
  @computed
  get listVideo() {
    let data = [];
    this.mediaList.map(v => {
      if (v.video && v.video.length) {
        data.push({
          id: v.id,
          cameraId: v.cameraId,
          cameraName: v.cameraName,
          cameraType: v.cameraType,
          ptzType: v.ptzType,
          checkedList: v.checkedList,
          listData: v.video
        });
      }
    });
    return data;
  }

  /**
   * @desc 图片资源列表
   */
  @computed
  get listImage() {
    let data = [];
    this.mediaList.map(v => {
      if (v.image && v.image.length) {
        data.push({
          id: v.id,
          cameraId: v.cameraId,
          cameraName: v.cameraName,
          cameraType: v.cameraType,
          ptzType: v.ptzType,
          checkedList: v.checkedList,
          listData: v.image
        });
      }
    });
    return data;
  }

  hasCollectedKey = id => {
    return this.listAll.find(item => {
      return item.listData.find(item => item.id === id)
    })
  }

  /**
   * @desc 获取远程视图库列表
   */
  getMediaList() {
    return Service.kvStore.getKvStore({
      storeKey: this.kvStoreKey,
      userId: this.userId
    }).then(result => {
      if (result.code === 200000 && result.data.storeValue) {
        const mediaList = this.formatUrl(JSON.parse(result.data.storeValue), false);
        this.setData({
          mediaList
        });
      } else {
        this.setData({
          mediaList: []
        });
      }
    });
  }

  /**
   * @desc 更新远程kvStore视图库
   * @param {array} mediaList 要保存的视图数据
   */
  setRemoteMediaList(mediaList) {
    mediaList = this.filterMediaList(mediaList);
    mediaList = this.formatUrl(mediaList, true);
    return Service.kvStore.setUserKvStore({
      userId: this.userId,
      storeKey: this.kvStoreKey,
      storeValue: mediaList
    }).then(
      result => {
        if (result.code !== 200000) {
          message.error('');
          return false;
        }
        mediaList = this.formatUrl(mediaList, false)
        mediaList.forEach(item => {
          item.checkedList = []
        })
        this.setData({ mediaList });
        return mediaList;
      }
    );
  }

  /**
   * 添加文件到视图库part-1
   * @param {*} options 
      String cameraId,
      String cameraType 预留摄像机类型
      String ptzType 云台类型
      String type 媒体类型video、image
      Number startTime 抓拍时间，type='image'时 毫秒级
      Number endTime 抓拍时间，type='image'时   毫秒级
      Number captureTime 抓拍时间，type='image'时 毫秒级
      tring imgUrl 图片地址或视频封面
      @param {object} cameraObj 传递的设备信息
  */
  add(options, cameraObj) {
    let {
      cameraId,
      cameraName,
      cameraType,
      ptzType,
      id, // 用来标识图片是否已经收藏
      type = 'image',
      startTime,
      endTime,
      captureTime,
      imgUrl
    } = options;
    // 单个媒体信息对象
    if(this.hasCollectedKey(id)){
      message.info('资源已收藏')
      return Promise.resolve()
    }
    if(!!cameraObj){
      cameraId = cameraObj.cid
    }else{
      const cameraInfo = window.BaseStore.device.queryCameraById(cameraId) || {};
      if(!cameraInfo.cid) {
        message.error('收藏失败')
        console.error('设备查询失败' + cameraId)
        return Promise.reject(false)
      }
      cameraId = cameraInfo.cid;// 视频播放需要cid
    }
    options.cameraId = cameraId;
    const item = {
      id: id || Utils.uuid(),
      cameraId,
      cameraName,
      type,
      imgUrl
    };
    if (type === 'image') {
      item.captureTime = this.formatDate(captureTime);
    } else {
      item.startTime = this.formatDate(startTime);
      item.endTime = this.formatDate(endTime);
    }
    if (item.imgUrl.indexOf('data:image') >= 0) {
      // 图片地址为base64则先上传至羚羊再添加到mediaList
      const oldFile = this.base64ToBlob(item.imgUrl);
      const formData = new FormData();
      formData.append('file', oldFile);
      return Service.user.uploadImg(formData)
        .then(res => {
          if (res.code !== 200000) {
            return false;
          }
          item.imgUrl = res.data.url;
          return item;
        })
        .then(item => {
          const mediaList = this.stageMediaList(options, item);
          this.saveAddLog(item);
          return this.setRemoteMediaList(mediaList);
        });
    } else {
      // 直接添加到mediaList
      const mediaList = this.stageMediaList(options, item);
      this.saveAddLog(item);
      return this.setRemoteMediaList(mediaList);
    }
  }

  /**
   * @desc 批量添加视频分段
   * @param {array} videoList
   */
  addVideos(videoList) {
    let mediaList = Object.assign([], toJS(this.mediaList));
    videoList.map(v => {
      let item = {
        id: v.id || Utils.uuid(),
        cameraId: v.cameraId,
        cameraName: v.cameraName,
        type: 'video',
        imgUrl: v.imgUrl,
        startTime: this.formatDate(v.startTime),
        endTime: this.formatDate(v.endTime)
      };
      this.saveAddLog(item)
      let options = Object.assign({}, v, { mediaList });
      mediaList = this.stageMediaList(options, item);
    });
    return this.setRemoteMediaList(mediaList);
  }

  /**
   * @desc 暂存文件到视图库part-2
   */
  stageMediaList({ cameraId, cameraName, cameraType, ptzType, type, mediaList }, item) {
    mediaList = mediaList ? mediaList : Object.assign([], toJS(this.mediaList));
    let { cameraItem, idx } = this.getCameraInfo(cameraId, mediaList);
    if (cameraItem) {
      mediaList[idx][type].unshift(item);
    } else {
      cameraItem = {
        id: Utils.uuid(),
        cameraId,
        cameraName,
        cameraType, // 预留摄像机类型
        ptzType, // 云台类型
        checkedList: [],
        video: [],
        image: []
      };
      cameraItem[type].unshift(item);
      mediaList.unshift(cameraItem);
    }
    return mediaList;
  }

  /**
   * @desc 批量删除
   * @param {array} selectList 要删除的视图数据集合
   */
  deleteBatch(selectList) {
    // 从羚羊删除图片或视频
    // 截图需删除、收藏图片不能删除
    if(selectList.length === 0){
      return Promise.resolve(true)
    }
    const mediaList = Object.assign([], toJS(this.mediaList));
    selectList.map(v => {
      const mediaInfo = mediaList.find(x => x.cameraId === v.cameraId);
      this.saveDeleteLog(v);
      const type = v.type;
      mediaInfo[type] = mediaInfo[type].filter(x => x.id !== v.id);
    });
    return this.setRemoteMediaList(mediaList).then(res => {
      if(res){
        SocketEmitter.emit(SocketEmitter.eventName.updataCollectedState, selectList)
      }
    })
  }

  /**
   * @desc 批量下载
   * @param {array} selectList 要下载的视图数据集合
   */
  downloadBatch(selectList) {
    selectList.map(v => {
      if (v.type === 'image') {
        // 下载图片
        Utils.downloadLocalImage(v.imgUrl, `${v.cameraName}_${moment(v.captureTime).format('YYYYMMDDTHHmmss')}`);
        Service.logger.save({
          ...Other.downloadImg,
          description: `下载点位【${v.cameraName}】 ${moment(v.captureTime).format('YYYY.MM.DD HH:mm:ss')}的图片`
        });
      } else {
        // 下载视频
        Service.video.queryTSDownLoadAddress({
          cid: v.cameraId,
          fileName: v.cameraName,
          beginTime: Math.floor(new Date(v.startTime) / 1000),
          endTime: Math.floor(new Date(v.endTime) / 1000)
        });
      }
    });
  }

   /**
   * @desc 记录添加日志
   */
  saveAddLog(item) {
    const description = (
      item.type === 'image' 
        ? `添加点位【${item.cameraName}】 ${item.captureTime}的图片`
        : `添加点位【${item.cameraName}】 ${item.startTime}到${item.endTime}的录像`
    )
    Service.logger.save({
      description,
      ...Other[item.type === 'image' ? 'addMediaLibImg' : 'addMediaLibVideo']
    });
  }

  /**
   * @desc 记录删除日志
   */
  saveDeleteLog(item) {
    const description = (
      item.type === 'image' 
        ? `移除点位【${item.cameraName}】 ${item.captureTime}的图片`
        : `移除点位【${item.cameraName}】 ${item.startTime}到${item.endTime}的录像`
    )
    Service.logger.save({
      description,
      ...Other[item.type === 'image' ? 'deleteMediaLibImg' : 'deleteMediaLibVideo']
    });
  }

  /**
   * @param {string} dataType 数据类型
   * @param {boolean} checked 全选or反选
   * @desc 所有摄像机的全选或全不选
   */
  @action
  handleCheckAll(dataType, checked = false) {
    if (!checked) {
      this.mediaList.map(v => {
        v.checkedList = [];
      });
      return;
    }
    this.mediaList.map((v, k) => {
      let currentListData = this.getTabMediaList(dataType)[k].listData;
      v.checkedList = currentListData.map(v => v.id);
    });
  }

  /**
   * @param {string} cameraId
   * @param {boolean} checked 全选or反选
   * @desc 单个摄像机全选或全不选
   */
  @action
  handleCheckCamera(cameraId, checked, idx) {
    const { cameraItem } = this.getCameraInfo(cameraId);
    if (!checked) {
      return (cameraItem.checkedList = []);
    }
    const currentListData = this.getTabMediaList(this.activeTab)[idx].listData;
    cameraItem.checkedList = currentListData.map(v => v.id);
  }

  /**
   * @param {string} cameraId
   * @param {object} checkList
   * @desc 单个视频或图片的选中
   */
  @action
  handleCheckItem(checkList, cameraId) {
    const { cameraItem } = this.getCameraInfo(cameraId);
    cameraItem.checkedList = checkList;
  }

  /**
   * @desc 获取选中列表
   */
  getSelectList() {
    const mediaList = this.getTabMediaList(this.activeTab);
    let selectList = [];
    mediaList.map(v => {
      if (v.checkedList.length) {
        v.listData.map(item => {
          if (v.checkedList.indexOf(item.id) !== -1) {
            selectList.push(item);
          }
        });
      }
    });
    return selectList;
  }

  /**
   * @param {*} date 
   * @desc 字符串时间和时间戳互相转换
   */
  formatDate(date) {
    return moment(date).format(Shared.format.dataTime);
  }

  /**
   * @desc 获取单个camera详情和索引-2
   */
  getCameraInfo(cameraId, mediaList) {
    let idx, cameraItem;
    mediaList = mediaList ? mediaList : this.mediaList;
    mediaList.find((v, k) => {
      if (v.cameraId == cameraId) {
        idx = k;
        cameraItem = v;
        return v;
      }
    });
    return {
      idx,
      cameraItem
    };
  }

  /**
   * @desc 获取指定tab的列表数据
   */
  getTabMediaList(dataType) {
    let mediaList;
    switch (dataType) {
      case 'image':
        mediaList = this.listImage;
        break;
      case 'video':
        mediaList = this.listVideo;
        break;
      default:
        mediaList = this.listAll;
        break;
    }
    return mediaList;
  }

  /**
   * @param {obj} mediaList 
   * @desc 编码解码图片路径
   */
  formatUrl(mediaList, isEscape) {
    mediaList.map(v => {
      v.image.map(x => (x.imgUrl = Utils.escapeUrl(x.imgUrl, isEscape)));
      v.video.map(x => (x.imgUrl = Utils.escapeUrl(x.imgUrl, isEscape)));
    });
    return mediaList;
  }

  /**
   * @param {*} base64Url base64字段
   * @desc 图片base64转换为blob
   */
  base64ToBlob(base64Url) {
    var bytes = window.atob(base64Url.split(',')[1]); // 去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }

  // 保存视图库到缓存(预留)
  setLocal() {
    const mediaList = toJS(this.mediaList);
    const cacheKey = `mediaList`;
    localStorage.setItem(cacheKey, JSON.stringify(mediaList));
  }

  // 对mediaList进行过滤，只保留有图片或视频的数据(预留)
  filterMediaList(mediaList) {
    mediaList = mediaList ? mediaList : this.mediaList;
    const data = mediaList.filter(
      v => v.image.length > 0 || v.video.length > 0
    );
    return data;
  }

  /**
   * @desc 数据修改
   * @param {*} data 
   */
  @action
  setData(data) {
    for (var k in data) {
      this[k] = data[k];
    }
    return Promise.resolve();
  }
}

export default new MediaLib()