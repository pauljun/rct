/*
 * @Author: welson 
 * @Date: 2019-01-12 15:00:59 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-15 10:44:33
 */
/** 
 *  @desc 布控库组件
 * @param {ReactElement} LibList 布控库列表 
 * @param {ReactElement} LibDetail 布控库基本信息 
 * @param {ReactElement} LibPeople 布控库人员
 */
import LibList from './LibList'
import LibDetail from './LibDetail'
import LibPeople from './LibPeople'
import FormLibInfo from './FormLibInfo'
import FormPeopleInfo from './FormPeopleInfo'
import LibHeader from './LibHeader'
import AddLibPeople from './AddLibPeople'
import LocalPeopleView from './LocalPeople'

const MonitorLibrary = {
  LibList,
  LibDetail,
  LibPeople,
  FormLibInfo,
  FormPeopleInfo,
  LibHeader,
  AddLibPeople,
  LocalPeopleView
}

export default MonitorLibrary