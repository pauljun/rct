import { httpRequest } from './http';
import video from './url/video';
import moment from 'moment';
import { message} from 'antd';
import md5 from 'js-md5';

@httpRequest
class VideoService {
  /**
   * @desc 获取历史视频
   * @params data = { cid, deviceName, startTime, endTime }
   *   cid 设备id
   *   deviceName 设备名称（非必传）
   *   startTime 秒级时间戳
   *   endTime 秒级时间戳
   */
  queryHistoryAddress({cid, deviceName, startTime, endTime}, errorLoading=true) {
    BaseStore.actionPanel.setAction(video.historyAddress.actionName);
    // 记录日志
    const beginStringDate = moment.unix(startTime).format(Shared.format.dataTime);
    const endStringDate = moment.unix(endTime).format(Shared.format.dataTime);
    if (!deviceName) {
      deviceName = BaseStore.device.queryCameraById(cid);
    }
    const logInfo = video.historyAddress.logInfo[0];
    Service.logger.save({
      description: `查看点位【${deviceName}】 ${beginStringDate}到${endStringDate}的录像`,
      ...logInfo
    });
    const systemTime = BaseStore.user.systemTime;
    const expire = systemTime + BSConfig.videoExpire;
    const signature = this.getSignature({
      cid,
      endTime,
      beginTime: startTime,
      expire
    })
    const url = (video.historyAddress.value
                  .replace('<signature>', signature)
                  .replace('<expire>', expire));
    return this.$httpRequest({
      method: 'post',
      url,
      data: {
        // cid: '753373363',
        cid,
        endTime,
        beginTime: startTime,
        mediaType: 'hls'
      }
    }).then(res => {
      BaseStore.actionPanel.removeAction(video.historyAddress.actionName);
      let fragment = {};
      fragment.beginDate = moment(startTime * 1000).format('YYYY-MM-DD HH:mm:ss');
      fragment.duration = endTime - startTime;
      fragment.fragments = [];
      const playlist = res.data;
      if (playlist.length === 0) {
        if(errorLoading) {
          fragment.fragments = [{
            begin: startTime,
            end: endTime,
            file: 'error'
          }];
        } else {
          message.warn('未获取到视频！')
        }
        return fragment;
      }
      if (playlist.length === 1) {
        let item = playlist[0];
        if (item.beginTime !== startTime) {
          fragment.fragments.push({
            begin: 0,
            end: item.beginTime - startTime
          });
        }
        fragment.fragments.push({
          begin: item.beginTime - startTime,
          end: item.endTime - startTime,
          file: item.url
        });
      } else {
        playlist.reduce((item, nextItem, index) => {
          //TODO 开始时间有缺失
          if (index === 0 && item.beginTime !== startTime) {
            fragment.fragments.push({
              begin: 0,
              end: item.beginTime - startTime
            });
          }
          fragment.fragments.push({
            begin: item.beginTime - startTime,
            end: item.endTime - startTime,
            file: item.url
          });
          //TODO 中间时间有缺失
          if (nextItem.beginTime !== item.endTime) {
            fragment.fragments.push({
              begin: item.endTime - startTime,
              end: nextItem.beginTime - startTime
            });
          }
          if (index === playlist.length - 1) {
            fragment.fragments.push({
              begin: nextItem.beginTime - startTime,
              end: nextItem.endTime - startTime,
              file: nextItem.url
            });
          }
          return nextItem;
        });
      }
      return fragment;
    }).catch(e => {
      BaseStore.actionPanel.removeAction(video.historyAddress.actionName);
      let fragment;
      if(errorLoading) {
        fragment = {};
        fragment.beginDate = moment(startTime * 1000).format('YYYY-MM-DD HH:mm:ss');
        fragment.duration = endTime - startTime;
        fragment.fragments = [{
          begin: startTime,
          end: endTime,
          file: 'error'
        }];
      }
      return Promise.resolve(fragment);
    });
  }

  /**
   * @desc 获取视频封面
   */
  queryLatestCoverMap(cid) {
    BaseStore.actionPanel.setAction(video.videoCover.actionName);
    const systemTime = BaseStore.user.systemTime;
    const expire = systemTime + BSConfig.videoExpire;
    const signature = this.getSignature({
      cid, expire
    });
    const coverUrl = video.videoCover.value.replace('<cid>', cid).replace('<signature>', signature).replace('<expire>', expire)
    return Promise.resolve(coverUrl);
  }

  /**
   * @desc 获取多个实时视频(同步代码)
   * @params deviceInfos [{
   *  cid, deviceName, deviceType, flvStream=undefined 
   * }]
   */ 
  queryRealTimeAddressMulti(deviceInfos) {
    const { qj, db } = Dict.map
    return Promise.all(deviceInfos.map(device => {
      let funcName = 'queryLiveHlsAddress';
      // 球机、单兵、fiv优先 播放fiv;
      if(device.deviceType == qj.value || device.deviceType == db.value || device.flvStream){
        funcName = 'queryLiveFlvAddress'
      }
      return this[funcName](device.cid, device.deviceName);
    })).then(results => {
      const fileDatas = deviceInfos.map((v,k) => {
        const ptzControl = v.deviceType === qj.value ? true : false;
        const file = results[k];
        // const file = '/api/staticResource/v1/video/live.m3u8/753373363';
        const data = {
          file,
          cid: v.cid,
          deviceName: v.deviceName,
          isLiving: true,
          ptzControl
        };
        return data;
      })
      return fileDatas;
    })
  }
  
  /**
   * @desc 获取实时视频 HLS
   */
  queryLiveHlsAddress(cid, deviceName) {
    // 记录日志
    const logInfo = video.liveHlsAddress.logInfo[0];
    Service.logger.save({
      description: `查看点位【${deviceName}】的实时视频`,
      ...logInfo
    });
    const systemTime = BaseStore.user.systemTime;
    const expire = systemTime + BSConfig.videoExpire;
    const signature = this.getSignature({
      cid, type: 'm3u8', expire
    })
    return video.liveHlsAddress.value.replace('<cid>', cid).replace('<signature>', signature).replace('<expire>', expire);
  }

  /**
   * @desc 获取实时视频 FLV
   */
  queryLiveFlvAddress(cid, deviceName) {
    // 记录日志
    const logInfo = video.liveFlvAddress.logInfo[0];
    Service.logger.save({
      description: `查看点位【${deviceName}】的实时视频`,
      ...logInfo
    });
    const systemTime = BaseStore.user.systemTime;
    const expire = systemTime + BSConfig.videoExpire;
    const signature = this.getSignature({
      cid, type: 'flv', expire
    })
    return video.liveFlvAddress.value.replace('<cid>', cid).replace('<signature>', signature).replace('<expire>', expire);
  }

  /**
   * @desc 下载历史视频
   */
  queryTSDownLoadAddress({cid, fileName, beginTime, endTime}) {
    const systemTime = BaseStore.user.systemTime;
    const expire = systemTime + BSConfig.videoExpire;
    const signature = this.getSignature({
      cid, fileName, beginTime, endTime, expire
    })
    const url = video.downloadAddress.value
                .replace('<cid>',cid)
                .replace('<fileName>', fileName)
                .replace('<beginTime>', beginTime)
                .replace('<endTime>', endTime)
                .replace('<signature>', signature)
                .replace('<expire>', expire)
    Utils.tagAToDownload({ url });
    return url;
  }

  /**
   * @desc 视频摘要
   * @param {object} data
   */
  queryVideoAbstract(data = {}){
    BaseStore.actionPanel.setAction(video.videoAbstract.actionName);
    return this.$httpRequest({
      url: video.videoAbstract.value,
      method: 'POST',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(video.videoAbstract.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(video.videoAbstract.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * 生成签名用作接口校验
   */
  getSignature(data, signKey='lingmou') {
    let arr = [];
    for(var k in data) {
      arr.push(`${k}${data[k]}`)
    }
    let str = arr.sort().join('');
    str+=signKey;
    return md5(str)
  }
}
export default new VideoService();
