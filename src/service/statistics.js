import { httpRequest } from "./http";
import statistics from "./url/statistics";
import {message} from 'antd';
import * as _ from "lodash";

@httpRequest
class ChartsService {
  KEY = "HOME_CARD";
  handleResult(result){
    if(!result || result.code !== 200){
      message.error(result.message)
      return Promise.reject(result)
    }else{
      return result
    }
  } 
  //关联home页 卡片位置及顺序
  getCard(id) {
    return this.$httpRequest({
      url: statistics.getCard.value,
      method: "post",
      data: {
        userId: id,
        storeKey: this.KEY
      }
    }).then(res => {
      return res;
    });
  }
  setCard(id, item) {
    let options = {
      userId: id,
      storeKey: this.KEY,
      storeValue: item
    };
    let bodyStr = "";
    for (var k in options) {
      bodyStr += `&${k}=${
        _.isObject(options[k]) ? JSON.stringify(options[k]) : options[k]
      }`;
    }
    bodyStr = bodyStr.substring(1);
    return this.$httpRequest({
      url: statistics.setCard.value,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      method: "post",
      data: bodyStr
    });
  }

  countPerson(data) {
    return this.$httpRequest({
      url: statistics.countPerson.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }
  countPassRecords(data) {
    return this.$httpRequest({
      url: statistics.countPassRecords.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }
  countPersonDayTrend(data) {
    return this.$httpRequest({
      url: statistics.countPersonDayTrend.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }
  countByDays(data) {
    return this.$httpRequest({
      url: statistics.countByDays.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }
  countPersonHourTrend(data) {
    return this.$httpRequest({
      url: statistics.countPersonHourTrend.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }
  countByHours(data) {
      return this.$httpRequest({
        url: statistics.countByHours.value,
        method: "post",
        data
      }).then(res => {
        return res;
      });
    }
    countMonitorInfos() {
    return this.$httpRequest({
      url: statistics.countMonitorInfos.value,
      method: "post"
    }).then(res => {
      return res;
    });
  }

   // 布控报警数据统计
  countAlarmResultsByHandleType(data) {
    return this.$httpRequest({
      url: statistics.countAlarmResultsByHandleType.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }

  // 统计不同布控类型的警情数
  countAlarmResultsByMonitorType(data) {
    return this.$httpRequest({
      url: statistics.countAlarmResultsByMonitorType.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }
  // 警情总数趋势统计
  countAlarmResultsTrend(data) {
    return this.$httpRequest({
      url: statistics.countAlarmResultsTrend.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }

  // 各布控类型警情总数趋势统计
  countAlarmResultsTrendByAlarmType(data) {
    return this.$httpRequest({
      url: statistics.countAlarmResultsTrendByAlarmType.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }

    
  // 各布控类型警情总数趋势统计
  countAlarmResultsTrendByHandleType(data) {
    return this.$httpRequest({
      url: statistics.countAlarmResultsTrendByHandleType.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }

  countEffectiveAlarmResultsInPlaces(data) {
    return this.$httpRequest({
      url: statistics.countEffectiveAlarmResultsInPlaces.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }

    /**
   * @desc 查询aid轨迹聚合统计接口
   * @param {Object} data
   */
  queryTrackCount(data) {
    BaseStore.actionPanel.setAction(statistics.queryTrackCount.actionName);
    return this.$httpRequest({
      url: statistics.queryTrackCount.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(statistics.queryTrackCount.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(statistics.queryTrackCount.actionName);
        return Promise.reject(e);
      });
  }
}

export default new ChartsService();
