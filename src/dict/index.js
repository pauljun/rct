import alarmOperationType from './alarmOperationType';
import cameraOrientation from './cameraOrientation';
import platform from './platform';
import * as time from './time';
import theme from './theme';
import userGrade from './userGrade';
import * as vehicle from './vehicle';
import videoScreen from './videoScreen';
import * as device from './device';
import location from './location';
import common from './common';
import baselibOptions from './baselibOptions';
import systemModule from './systemModule';
import typeCode from './typeCode';
import bodyColor from './bodyColor';

const map = {
  platform,
  alarmOperationType,
  cameraOrientation,
  ...time,
  theme,
  userGrade,
  ...vehicle,
  videoScreen,
  ...device,
  location,
  common,
  baselibOptions,
  systemModule,
  bodyColor
};

function getLabel(name, code, emptyLabel = null) {
  let lable;
  try {
    let temp = getDict(name).find(v => v.value == code);
    lable = temp ? temp.label : emptyLabel;
  } catch (e) {
    console.error(e);
    lable = emptyLabel;
  }
  return lable;
}

function getDict(name) {
  return map[name];
}

function append(arr = []) {
  for (let i in typeCode) {
    if (!map[typeCode[i].name]) {
      let list = arr
        .filter(v => v.typeCode == typeCode[i].code)
        .map(v => {
          return {
            value: v.code,
            label: v.name
          };
        });
      map[typeCode[i].name] = list;
    }
  }
}

const Dict = {
  typeCode,
  getLabel,
  getDict,
  append,
  map
};

export default Dict;
