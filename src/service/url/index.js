import user from './user';
import device from './device';
import statistics from './statistics';
import logger from './logger';
import commnity from './community';
import alarm from './alarm'
import operation from './operation';
import role from './role';
import person from './person';
import village from './village';
import place from './place';
import video from './video';
import favorite from './favorite';
import organization from './organization';
import soldier from './soldier';
import _ from 'lodash';

// 布控任务
import monitorTask from './monitorTask'
import monitorLib from './monitorLib'
import machineInfo from './machineInfo'

export const request = {
  ...soldier,
  ...organization,
  ...user,
  ...logger,
  ...device,
  ...commnity,
  ...alarm,
  ...operation,
  ...statistics,
  ...monitorTask,
  ...monitorLib,
  ...machineInfo,
  ...role,
  ...person,
  ...village,
  ...place,
  ...video,
  ...favorite,
};

export function getRequestInfoList() {
  let list = [];
  for (let k in request) {
    list.push(request[k]);
  }
  return list;
}

export function getLogInfoList() {
  let ServiceDict = [];
  getRequestInfoList().map(v => {
    if (v.code) {
      ServiceDict.push(v);
    } else if (v.logInfo) {
      ServiceDict = ServiceDict.concat([], v.logInfo);
    }
  });
  ServiceDict = _.uniqBy(ServiceDict, 'code');
  return ServiceDict;
}

/**
 * 获取或有actionPanel的actionNames
 */
export function getActionNames() {
  return getRequestInfoList()
    .filter(v => !!v.actionName)
    .map(v => v.actionName);
}
