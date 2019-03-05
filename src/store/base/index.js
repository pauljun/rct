import { configure } from 'mobx';
import user from './user';
import menu from './menu';
import tab from './tab';
import device from './device';
import actionPanel from './actionPanel'
import organization from './organization'
import place from './place'
import mediaLib from './mediaLib'

configure({ enforceActions: 'observed' });
const BaseStore = {
  user,
  menu,
  tab,
  organization,
  device,
  actionPanel,
  place,
  mediaLib
};

export default BaseStore;
