import config from '../config';
const { api, version } = config;

export default {
  addFavorite:{
    value:`${api}user/favorite/${version}/addFavorite`,
    label:'新增收藏',
    actionName:'addFavorite'
  },
  batchDeleteFavorite:{
    value:`${api}user/favorite/${version}/batchDeleteFavorite`,
    label:'批量删除收藏',
    actionName:'batchDeleteFavorite'
  },
  deleteFavorite:{
    value:`${api}user/favorite/${version}/deleteFavorite`,
    label:'删除收藏',
    actionName:'deleteFavorite'
  },
  queryAlarmFavorites:{
    value:`${api}user/favorite/${version}/queryAlarmFavorites`,
    label:'获取收藏警情列表',
    actionName:'queryAlarmFavorites'
  },
  queryDeviceFavorites:{
    value:`${api}user/favorite/${version}/queryDeviceFavorites`,
    label:'获取收藏设备列表',
    actionName:'queryDeviceFavorites'
  }
}