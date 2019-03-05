import { observable } from 'mobx';
import storeUtil from '../../storeUtil';

class MonitorLib extends storeUtil {

  initSearch = {
    name: undefined,
    creatorName: undefined,
    startTime: undefined,
    endTime: undefined,
    offset: 0,
    limit: 500,
    libType: 1,
  } 
  
  @observable searchData = this.initSearch
	
}

export default new MonitorLib();