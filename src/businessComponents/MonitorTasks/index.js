/**
 * @author tlzj
 * @Date 2019-1-12
 */
/**
 * @desc 布控任务查看和添加编辑相关组件
 * @param {ReactElement} BasicInfo 基本信息编辑组件
 * @param {ReactElement} BasicInfoView 基本信息查看组件
 * @param {ReactElement} LibsList 布控库编辑组件
 * @param {ReactElement} LibsListView 布控库查看组件
 * @param {ReactElement} TasksReceive 布控任务接收编辑组件
 * @param {ReactElement} TasksReceiveView 布控任务接收查看组件
 * @param {ReactElement} TasksScope 布控范围编辑组件
 * @param {ReactElement} TasksScopeView 布控范围查看组件
 * @param {ReactElement} FormBtn form表单提交按钮
 * @param {ReactElement} TaskItem 布控任务列表单个组件
 * @param {ReactElement} TasksList 布控任务列表组件
 */

import BasicInfo from './basicInfo/index.js'
import BasicInfoView from './basicInfoView/index.js'
import LibsList from './libsList/index.js'
import LibsListView from './libsListView/index.js'
import TasksReceive from './tasksReceive/index.js'
import TasksReceiveView from './tasksReceiveView/index.js'
import TasksScope from './tasksScope/index.js'
import TasksScopeView from './tasksScopeView/index.js'
import FormBtn from './formBtn/index.js'
import TaskItem from './taskItem/index.js'
import TasksList from './tasksList/index.js'

 export default {
  BasicInfo,
  BasicInfoView,
  LibsList,
  LibsListView,
  TasksReceive,
  TasksReceiveView,
  TasksScope,
  TasksScopeView,
  FormBtn,
  TaskItem,
  TasksList
 }