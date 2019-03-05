export default function getResourceTotalList(){
    return [
        {
            id: 7,
            title: '接入设备统计',
            component: Loader.loadBusinessComponent('Statistics','DeviceStatus')
        },
        {
            id: 8,
            title: '摄像机类型',
            component: Loader.loadBusinessComponent('Statistics','CameraType')
        },
        // {
        //     id: 5,
        //     title: '存储',
        //     component: require('./view/Panel/components/Storage').default
        // },
        {
            id: 9,
            title: '场所有效报警数(Top5)',
            component: Loader.loadBusinessComponent('Statistics','SiteAlarmTop5')
        },
        {
            id: 3,
            title: '资源趋势统计',
            component: Loader.loadBusinessComponent('Statistics','ResourceTend')
        },
        {
            id: 10,
            title: '资源统计',
            component:Loader.loadBusinessComponent('Statistics','Resource')
        },
        {
            id: 1,
            title: '布控统计',
            component:Loader.loadBusinessComponent('Statistics','Library')
        },
        {
            id: 2,
            title: '设备统计',
            component:Loader.loadBusinessComponent('Statistics','Devices')
        },
        {
            id: 4,
            title: '警情统计',
            component: Loader.loadBusinessComponent('Statistics','Alarms')
        },
        {
            id: 6,
            title: '报警统计',
            component:Loader.loadBusinessComponent('Statistics','AlarmNum')
        },
        // {
        //     id: 11,
        //     title: '流量',
        //     component: require('./view/Panel/components/Flow').default
        // },
        // {
        //     id: 12,
        //     title: '近24小时资源统计',
        //     component: require('./view/Panel/middle/ResourceStatic').default
        // }
    ];
}
