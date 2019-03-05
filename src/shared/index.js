import getResourceTotalList from './resourceTotalList';
import { getAMapCameraIcon, getMapIndexContent } from './cameraIconTools';
import { downloadVideo } from './downloadVideo';
import { getCameraTypeIcon } from './mapIcon';
import { queryOrganizationDevice } from './organization';
import { queryPlaceDeviceAndPerson } from './place';
import geo from './geo';
import format from './format';
import searchList from './searchList';
import tabContext from './tabContext'
const Shared = {
  getAMapCameraIcon,
  getMapIndexContent,
  downloadVideo,
  getCameraTypeIcon,
  getResourceTotalList,
  queryOrganizationDevice,
  queryPlaceDeviceAndPerson,
  format,
  geo,
  searchList,
  tabContext
};

export default Shared;
