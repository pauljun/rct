export function queryOrganizationDevice() {
  const { qj, znxj, zpj, db } = Dict.map;
  return Promise.all([
    Service.organization.queryChildOrganizationsById(), //0
    Service.device.countOrganizationDeviceStatus({ deviceTypes: [+qj.value, +znxj.value, +zpj.value, +db.value] }), //1
    Service.device.countOrganizationDeviceStatus({ deviceTypes: [+qj.value, +znxj.value, +zpj.value] }) //2
  ]).then(res => {
    let orgList = res[0].data || [];
    let orgDevice = res[1].data || [];
    let orgCamera = res[2].data || [];

    //TODO 计算组织设备和摄像机数量
    for (let ii = 0, ll = orgList.length; ii < ll; ii++) {
      let item = orgList[ii];
      let orgsCountDevice = orgDevice.find(v => v.organizationId == item.id);
      let orgsCountCamera = orgCamera.find(v => v.organizationId == item.id);
      item.deviceCount = {
        count: orgsCountDevice ? orgsCountDevice.totalCount : 0,
        onlineCount: orgsCountDevice ? orgsCountDevice.onlineCount : 0
      };
      item.cameraCount = {
        count: orgsCountCamera ? orgsCountCamera.totalCount : 0,
        onlineCount: orgsCountCamera ? orgsCountCamera.onlineCount : 0
      };
    }
    BaseStore.organization.setOrgList(orgList);
  });
}
