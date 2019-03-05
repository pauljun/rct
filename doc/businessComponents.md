# 业务组件

使用方法

```
const IconFont = Loader.loadBusinessComponent('IconFont')

...
	render(){
        return(
        	...
        	<IconFont type='icon-xxx' />
        	...
        )
	}
...
```



### 资源统计类组件Statistics

统计图表集合



- ***接口***

  Object.defineProperty(exports, "__esModule", { value: true });

  const Alarms = require('./Alarms').default

  exports.Alarms = Alarms

- ***用法***

  const Alarms= Loader.loadBusinessComponent(‘Statistics‘，'Alarms')

- ***组件***

| 组件                        | 接口                                             | 说明                                 |
| --------------------------- | ------------------------------------------------ | ------------------------------------ |
| Alarms                      | /alarmStatistics/countTotalAlarmsByHandleType    | 警情统计                             |
| CameraType                  | /device/countDeviceByType                        | 设备类型统计(图表)                   |
| Devices                     | /device/countDeviceByType                        | 设备类型统计(卡片)                   |
| DevicesStatus               | /device/countOrgDevice                           | 查询当前用户所有设备在线离线设备数量 |
| Library                     | /statistics/getControlStatistics                 | 布控库统计                           |
| Resource                    | /statistics/getResourcesStatis                   | 资源统计                             |
| Resource24H                 | /statistics/getDayResouecesStatis                | 近24小时资源统计                     |
| ResourceTend                | /statistics/getResourcesTrendStatis              | 资源趋势统计                         |
| SiteAlarmTop5               | /statistics/countEffectiveAlarmsPlaceByCondition | 场所有效报警书Top5                   |
| AlarmNum                    | /statistics/getAlarmStatisticsByDay              | 报警数                               |
| ChartCard                   | -                                                | 面板小卡片                           |
| BottomCharts                | -                                                | 面板底部长卡片                       |
| AlarmNumEchart              | /statistics/AlarmNumEchart                       | 历史报警数量统计                     |
| AlarmStateEchart            | /statistics/AlarmStateEchart                     | 历史报警七日内占比                   |
| AlarmTypeEchart             | /statistics/AlarmTypeEchart                      | 历史报警类型占比                     |
| EventMonitorEffectiveChart  | /statistics/EventMonitorEffectiveChart           | 魅影告警数量统计                     |
| EventMonitorSeventChart     | /statistics/EventMonitorSeventChart              | 魅影告警七日内占比                   |
| EventMonitorStatisticsChart | /statistics/EventMonitorStatisticsChart          | 魅影告警类型占比                     |

- 返回值

  ...

### 样式组件SystemWrapper

包裹系统设置组件，统一标题，搜索样式

- ***方法说明***

  用户登录接口

- ***参数说明***

| 参数名    | 参数类型  | 是否必填 | 说明               |
| --------- | --------- | -------- | ------------------ |
| name      | string    | 是       | 页面标题           |
| className | string    | 否       | 额外的样式类名     |
| title     | component | 否       | 搜索，按钮         |
| width     | number    | 否       | 内容宽度(默认1200) |
| children  | component | 是       | 页面组件           |

- 返回值

  ...