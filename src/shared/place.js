/**
 * 获取制定级别的场所数量
 * @param {*} areaCode
 * @param {*} level
 * @param {*} placeList
 * @param {*} list
 */
function queryChildPlaceForLevel(areaCode, level = 5, placeList, list = []) {
  placeList.forEach(item => {
    if (item.areaCode == areaCode && item.level >= level) {
      list.push(item);
    } else {
      if (item.parentCode == areaCode) {
        queryChildPlaceForLevel(item.areaCode, level, placeList, list);
      }
    }
  });
  return list;
}

export function queryPlaceDeviceAndPerson() {
  const { qj, znxj, zpj, db } = Dict.map;
  return Promise.all([
    Service.place.getPlacesByHasDevice(), // 获取所有有设备的场所
    Service.place.countPersonGroupByPid(), //
    Service.device.countPlaceDeviceStatus({ deviceTypes: [+qj.value, +znxj.value, +zpj.value, +db.value] }), //3
    Service.device.countPlaceDeviceStatus({ deviceTypes: [+qj.value, +znxj.value, +zpj.value] }) //4
  ]).then(res => {
    let placeList = res[0].data || [];
    let placePerson = res[1].data || [];
    let placeDevice = res[2].data || [];
    let placeCamera = res[3].data || [];

    //TODO 场所设备，摄像机，人员数量
    for (let ii = 0, ll = placeList.length; ii < ll; ii++) {
      let item = placeList[ii];
      let placeCountDevice = placeDevice.find(v => v.placeId == item.id);
      let placeCountCamera = placeCamera.find(v => v.placeId == item.id);
      let placeCountPerson = placePerson.find(v => v.pid == item.id);
      item.deviceCount = {
        count: placeCountDevice ? placeCountDevice.totalCount : 0,
        onlineCount: placeCountDevice ? placeCountDevice.onlineCount : 0
      };

      item.cameraCount = {
        count: placeCountCamera ? placeCountCamera.totalCount : 0,
        onlineCount: placeCountCamera ? placeCountCamera.onlineCount : 0
      };
      placeCountPerson && (item.personCount = placeCountPerson.count);
      let childs = queryChildPlaceForLevel(item.areaCode, 5, placeList, []);
      item.childrenPlaceCount = childs.length;
    }
    BaseStore.place.setPlaceList(placeList);
  });
}
