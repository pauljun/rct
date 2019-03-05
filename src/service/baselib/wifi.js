import { httpRequest } from "../http"
import wifi from "../url/baselib/wifi"
import * as _ from "lodash"

@httpRequest
class wifiService {
  /**
   * @desc wifi设备列表查询
   * @param {Object} data
   */
  queryList( data) {
    return this.$httpRequest({
      url: wifi.list.value,
      method: "post",
      data
    }).then(res => {
      return res
    })
  }
}

export default new wifiService()
