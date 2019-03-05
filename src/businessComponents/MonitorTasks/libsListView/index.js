import React from 'react'
import _ from 'lodash'
const IconFont = Loader.loadBaseComponent('IconFont')
const LibsListView = (props) => {
  const { item } = props
  let libNameArr=[]
  if(props.libType !== 4){
    item.libs && item.libs.map(v => {
      libNameArr.push(v.name)
    })
  }else{
    libNameArr = _.groupBy(item.libs,'machineName')
  }
  let titleLibs = ['重点人员库', '合规人员库','','布控库']
  return (
    <div className="libs-list-view info-view">
      <div className="ant-row">
        <div className="ant-col-24">
          <div className='label threshold'>告警阈值：</div>
          <div className='content alarm'>{`${item.alarmThreshold}%`}</div>
        </div>
      </div>
      <div className="ant-row">
        <div className="ant-col-24">
          <div className='label'>{titleLibs[props.libType - 1]}：</div>
          <div className='content'>
            {libNameArr && (props.libType !== 4 ? libNameArr.map((v,k) => <span key={k} title={v}><IconFont type='icon-Layer_Main2'/>{v}</span>) :
              _.map(libNameArr,(v,k) => <div className="libs-item" key={k}>{v[0].machineName}：<br style={{lineHeight: '21px'}}/>{v.map((x,i) => <span key={i} title={x.name}><IconFont type='icon-Layer_Main2'/>{x.name}</span>)}</div>)
            )} 
          </div>
        </div>
      </div>
    </div>
  )
}
export default LibsListView