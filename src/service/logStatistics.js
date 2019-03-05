import { httpRequest } from "./http";
import logStatistics from "./url/logStatistics";
import * as _ from "lodash";

@httpRequest
class logStatisticsService {
 
  queryList(data) {
    return this.$httpRequest({
      url: logStatistics.queryLogStatisticsList.value,
      method: "post",
      data
    }).then(res => {
      return res;
    });
  }

  //导出
  exportStatisticsLog(data) {
    return this.$httpRequest({
      url: logStatistics.exportStatisticsLog.value,
      method: 'get',
      data: data
    })
  }
}

export default new logStatisticsService();
