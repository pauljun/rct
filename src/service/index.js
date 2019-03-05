import user from './user';
import device from './device';
import statistics from './statistics';
import logStatistics from './logStatistics';
import role from './role';
import logger from './loggerService';
import community from './community';
import operation from './operation';
import organization from './organization';
import face from './baselib/face';
import body from './baselib/body';
import vehicle from './baselib/vehicle';
import * as url from './url';
import soldier from './soldierService';
import village from './village';
import wifi from './baselib/wifi';
import person from './person';
import privilege from './privilege';
import tags from './tags';
import video from './video';
import place from './place';
import kvStore from './kvStore';
import { httpRequest } from './http';
// ------------v3.0最新service-------------
import monitorTask from './monitor/monitorTask.js';
import monitorLib from './monitor/monitorLib.js';
import machineInfo from './monitor/machineInfo.js';
import alarmResult from './monitor/alarmResult.js';
import dictionary from './dictionary';
const Service = {
  httpRequest,
  user,
  device,
  logger,
  community,
  operation,
  role,
  organization,
  face,
  body,
  vehicle,
  statistics,
  logStatistics,
  url,
  soldier,
  village,
  wifi,
  person,
  tags,
  privilege,
  video,
  place,
  kvStore,
  // ------------v3.0最新service-------------
  monitorTask,
  monitorLib,
  machineInfo,
  alarmResult,
  dictionary
};

export default Service;
