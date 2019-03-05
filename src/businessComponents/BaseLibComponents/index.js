/**
 * @author wwj
 * @createTime 2019-1-7
 * @update wwj
 * @updateTime 2019-1-9
 */

/**
 * @desc 资源库公共组件模块
 * @param {ReactElement} List 列表
 * @param {ReactElement} Wrapper 顶层架构
 * @param {ReactElement} PointSelect 点位选择
 * @param {ReactElement} SearchButton 以图搜图按钮
 * @param {ReactElement} CheckGroup 多选
 * @param {ReactElement} RadioGroup 单选
 * @param {ReactElement} ClothesColor 衣服颜色
 * @param {ReactElement} DropTargetView 拖拽放置组件
 * @param {ReactElement} DragSourceView 被拖拽组件
 * @param {ReactElement} AlarmTimeTypeSelect 历史告警列表排序方式
 * @param {ReactElement} AlarmStateSelect 历史告警状态筛选
 * @param {ReactElement} AlarmSiteScreening 历史告警场所筛选（多选）
 * @param {ReactElement} LittlePagtion 简单分页加刷新
 * @param {ReactElement} AlarmTimeRadio 时间段选择
 * @param {ReactElement} VehicleColor 机动车颜色
 * @param {ReactElement} PlateColor 车牌颜色
 * @param {ReactElement} Select 下拉框
 * @param {ReactElement} ScoreSlider 相识度进度条
 * @param {ReactElement} CustomPagination 简单分页
 * @param {ReactElement} UploadSearch 图片搜索
 * @param {ReactElement} TitleOptions 右上配置项
 * @param {ReactElement} RightHeader 以图搜图轨迹
 */

import List from './List'
import Timer from './Timer'
import Wrapper from './Wrapper'
import PointSelect from './PointSelect'
import SearchButton from './SearchButton'
import AlarmTimeTypeSelect from './AlarmTimeTypeSelect'
import AlarmStateSelect from './AlarmStateSelect'
import AlarmSiteScreening from './AlarmSiteScreening'
import LittlePagtion from './LittlePagtion'
import CheckGroup from './CheckGroup'
import RadioGroup from './RadioGroup'
import ClothesColor from './ClothesColor'
import AlarmTimeRadio from './AlarmTimeRadio'
import DropTargetView from './DropTargetView'
import DragSourceView from './DragSourceView'
import VehicleColor from './VehicleColor'
import PlateColor from './PlateColor'
import Select from './Select'
import ScoreSlider from './ScoreSlider'
import CustomPagination from './CustomPagination'
import UploadSearch from './UploadSearch'
import TitleOptions from './TitleOptions'
import RightHeader from './RightHeader'

export default {
  List,
  Timer,
  Wrapper,
  PointSelect,
  SearchButton,
  AlarmTimeTypeSelect,
  AlarmStateSelect,
  AlarmSiteScreening,
  LittlePagtion,
  CheckGroup,
  RadioGroup,
  ClothesColor,
  AlarmTimeRadio,
  DropTargetView,
  DragSourceView,
  VehicleColor,
  PlateColor,
  Select,
  ScoreSlider,
  CustomPagination,
  UploadSearch,
  TitleOptions,
  RightHeader
}