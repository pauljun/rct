import flowPerson from './flowPerson'
import residentPerson from './residentPerson'
import MonitorTask from './monitor/monitorTask'
import monitorLib from './monitor/monitorLib'
import logManagement from './logManagement'
import logStatistic from './logStatistic'
import deviceGroup from './deviceGroup'
import videoModule from './videoModule'
import deviceManagement from './deviceManagement'
import resourceManagement from './resourceManagement'
import soldier from './soldier'
import roleManagement from './roleManagement';
import communityDetail from './communityDetail'
import operation from './operation'
import operationDetail from './operation/detail'
import orgManagement from './orgManagement'
import village from './village'
import face from './baselib/face'
import body from './baselib/body'
import userManagement from './userManagement'
import vehicle from './baselib/vehicle'
import wifi from './baselib/wifi'
import baselibSearch from './baselib/search'

const BusinessStore = {
  MonitorTask,
  flowPerson,
  residentPerson,
  logManagement,
  logStatistic,
  deviceGroup,
  videoModule,
  monitorLib,
  deviceManagement,
  resourceManagement,
  soldier,
  operation,
  operationDetail,
  orgManagement,
  roleManagement,
  communityDetail,
  village,
  face,
  body,
  userManagement,
  vehicle,
  wifi,
  baselibSearch
}

export default BusinessStore
