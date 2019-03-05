declare namespace Service {
  declare namespace user {
    function login(options: { [key: string]: any }): Promise<any>;
    function loginOut(): Promise<any>;
    function changePassword(options: { [key: string]: any }): Promise<any>;
    function sendVerifyCode(options: { [key: string]: any }): Promise<any>;
    function queryUserInfo(options: { [key: string]: any }): Promise<any>;
    function queryUsers(options: { [key: string]: any }): Promise<any>;
    function querySystemInfo(options: { [key: string]: any }): Promise<any>;
    function queryPrivilegeUsers(options: { [key: string]: any }): Promise<any>;
    function addUser(options: { [key: string]: any }): Promise<any>;
    function changeUser(options: { [key: string]: any }): Promise<any>;
    function deleteUser(options: { [key: string]: any }): Promise<any>;
    function resetPassword(id:string): Promise<any>;
    function changeUserStatus(id:string, status:string, loginName:string) : Promise<any>;
    function changeMobile(options: { [key: string]: any }): Promise<any>;
    function changeUserAvatar(options: { [key: string]: any }): Promise<any>;
    function changeZoomLevelCenter(options: { [key: string]: any }): Promise<any>;
    function getIdentityCard(id:string): Promise<any>;
    function uploadImg(options: { [key: string]: any }): Promise<any>;
  }

  declare namespace device {
    function queryUserDevices(options: { [key: string]: any }): Promise<any>;
    function queryDevices(options: { [key: string]: any }): Promise<any>;
    function countDeviceType(options: { [key: string]: any }): Promise<any>;
    function countOperationCenterDevices(options: { [key: string]: any }): Promise<any>;
    function countOrganizationDeviceStatus(options: { [key: string]: any }): Promise<any>;
    function countPlaceDeviceStatus(options: { [key: string]: any }): Promise<any>;
    function queryDeviceInfo(id:string): Promise<any>;
    function queryDeviceInfoByCid(cid:string): Promise<any>;
    function deviceListByOrganization(organizationId:string):Promise<any>
    function queryDeviceGroup():Promise<any>
    function updateDevice(options: { [key: string]: any }): Promise<any>;
    function updateDeviceGeo(options: { [key: string]: any }): Promise<any>;
    function updateStateByDeviceId(deviceId:string, deviceData:string): Promise<any>;
    function updateOperationCenterDevices(options: { [key: string]: any }): Promise<any>;
    function updateOrganizationDevicesBatch(options: { [key: string]: any }): Promise<any>;
    function exportDevice(organizationId:string): Promise<any>;
  }

  declare namespace kvStore {
    function getKvStore(options: { [key: string]: any }): Promise<any>;
    function setUserKvStore(options: { [key: string]: any }): Promise<any>;
    function listUserKey(options: { [key: string]: any }): Promise<any>;
  }

  declare namespace operation {
    function getOperationCenterLogo(options: { [key: string]: any }): Promise<any>;
    function queryOperationCenterMenuAndPrivileges(id: string): Promise<any>;
    function operationCenterInfo(id: string): Promise<any>;
    function queryOperationCenters(options: { [key: string]: any }): Promise<any>;
    function addOperationCenter(options: { [key: string]: any }): Promise<any>;

  }

  declare namespace organization {
    function queryChildOrganizationsById(options?: { [key: string]: any }): Promise<any>;
    function queryOrganizations(options?: { [key: string]: any }): Promise<any>;
    function organizationInfo(id: string): Promise<any>;
    function sortOrganization(options:{ [key: string]: any }):Promise<any>;
    function deleteOrganization(data:{ [key: string]: any }, organizationName:string):Promise<any>;
    function updateOrganization(options:{ [key: string]: any }):Promise<any>;
    function addOrganization(options:{ [key: string]: any }):Promise<any>;
    function queryPlacesByOrganizationId(id:string):Promise<any>;
    function updateOrganizationPlaces(options:{ [key: string]: any }):Promise<any>;
  }

  declare namespace video {
    function queryHistoryAddress(options:{ [key: string]: any }):Promise<any>;
    function queryLatestCoverMap(cid:string):Promise<any>;
    function queryRealTimeAddress(cid:string, streamType:'flv'|'hls'):Promise<any>;
    function queryTSDownLoadAddress(options:{ [key: string]: any }):Promise<any>;
  }

  declare namespace privilege{
    function queryUserPrivileges(id:string):Promise<any>;
    function queryRolePrivileges(id:string):Promise<any>;
  }
  declare namespace community {}
  declare namespace monitor {}

  declare namespace url {
    declare var request: { [key: string]: UrlConfig };

    function getRequestInfoList(): Array<{
      value: string;
      label: string;
      actionName: string;
      logInfo: Array<{
        code: number;
        parent: number;
        text: string;
      }>;
    }>;
    function getLogInfoList(): [any];
    function getActionNames(): [string];
  }
}
