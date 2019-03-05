# Service服务

## Service服务介绍

​	Service 所在文件全部存放在 `src/service` 下，包括 url（RequestUrl文件夹下）请求路径，以及每个模块service 请求方法。新增模块时，要在` src/service` 下新建一个对应的模块js，模块js返回一个继承自httpRequest（提供请求方法）的 class，将所有的 service 方法挂载到实例化对象的原型上，最后导出，导出的实例化对象需要在 index.js 中进行注入。

​	使用：由于Service挂载在全局作用域内，所以可以使用`Service[moduleName].fn`去调用service的函数。

## userService

> 详见userService.md
>
> 参考实例  

```
import { httpRequest } from './http';
import { USER } from './RequestUrl';

@httpRequest
class UserService {
  login(options) {
    return this.$httpRequest({
      url: USER.USER_LOGIN.value,
      method: 'post',
      data: options
    });
  }
}
export default new UserService();
```

## demoService

> 详见demoService.md

## 扩展一个Service

​	配置目录： `public/custom/service.config.js ` 

​	对 Service 层方法的覆盖和新增主要在 `public/custom/service.config.js ` 下，具体是利用 Service 模块的唯一 name，对实例化的对象增加属性，达到新增或覆盖的效果。

例如：

```
/**
 * 用于扩展 Service[moduleName] 方法 
 */
 
 // 重写 user.login
 Service.user.login = function(){
	consoel.log(' 重写 Service.user.login' )
 }
 // 扩展 user
 Service.user.newFunc = function(){
	consoel.log(' 扩展 Service.user ' )
 }

 注：由于方法挂载在对象上，所以在属性访问原则中会优先访问实例上的方法和属性，就达到了覆盖的目的，新增同理。
```

## 添加一个Service

例如：新增 newModuleService，在 `src/service` 下新建 `newModuleService.js` 文件

```
import { httpRequest } from './http';

@httpRequest
class NewModuleService {
  getData(options) {}
  setData(options) {}
}

Service.newModule = new NewModuleService()；
```

### userService方法

login(optiion){}

- ***方法说明***

  用户登录接口

- ***参数说明***

| 参数名       | 参数类型 | 是否必填 | 说明                              |
| ------------ | -------- | -------- | --------------------------------- |
| loginName    | string   | 是       | 用户名                            |
| userPwd      | string   | 是       | 密码，使用 Base64.encode加密      |
| identifyCode | string   | 是       | 验证码                            |
| loginStep    | number   | 是       | 登录方式，目前定为2（验证码登录） |

- 返回值

  ...
### statistics方法

getCard(id){}

- ***方法说明***

  获取面板卡片展示的位置

- ***参数说明***

| 参数名       | 参数类型 | 是否必填 | 说明                              |
| ------------ | -------- | -------- | --------------------------------- |
| id    | string   | 是       | 用户名id                            |
| storeKey    | string   | 是       | 用户键名                            |

- 返回值

  ...

setCard(id,item){}

- ***方法说明***

  设置面板编辑卡片的位置

- ***参数说明***

| 参数名       | 参数类型 | 是否必填 | 说明                              |
| ------------ | -------- | -------- | --------------------------------- |
| id    | string   | 是       | 用户名id                            |
| storeKey    | string   | 是       | 用户键名 |
| storeValue | string   | 是       | 用户键名对应键值                            |

- 返回值

   ...
queryResources({}){}

- ***方法说明***

  资源统计

queryResourcesTrend(data){}

- ***方法说明***

  资源趋势统计

- ***参数说明***

| 参数名    | 参数类型 | 是否必填 | 说明   |
| --------- | -------- | -------- | ------ |
| timestamp | string   | 是       | 时间戳 |
| days      | Number   | 是       | 时间段 |

- 返回值

  ...

queryResources24H(data){}

- ***方法说明***

  近24小时资源统计

- ***参数说明***

| 参数名    | 参数类型 | 是否必填 | 说明   |
| --------- | -------- | -------- | ------ |
| timestamp | string   | 是       | 时间戳 |

- 返回值

  ...

queryLibrary(){}

- ***方法说明***

  布控库统计

- 返回值

- ...

queryAlarmSummaryStatistics(){}

- ***方法说明***

  警情统计

- 返回值

- ...

queryAlarmStatisticsByDay(data){}

- ***方法说明***

  报警数

- ***参数说明***

| 参数名   | 参数类型 | 是否必填 | 说明     |
| -------- | -------- | -------- | -------- |
| beginDay | string   | 是       | 开始时间 |
| endDay   | string   | 是       | 结束时间 |

- 返回值

  ...

querySiteAlarmTop5(){}

- ***方法说明***

  场所有效报警书Top5

- 返回值

- ...

queryCountOrgDevice(data){}

- ***方法说明***

  查询当前用户所有设备在线离线设备数量

- ***参数说明***

| 参数名      | 参数类型 | 是否必填 | 说明     |
| ----------- | -------- | -------- | -------- |
| deviceTypes | Array    | 否       | 设备类型 |

- 返回值

  ...

queryCountDeviceByType(id,item){}

- ***方法说明***

  设备类型统计

- ***参数说明***

| 参数名      | 参数类型 | 是否必填 | 说明     |
| ----------- | -------- | -------- | -------- |
| deviceTypes | Array    | 否       | 设备类型 |

- 返回值

  ...

