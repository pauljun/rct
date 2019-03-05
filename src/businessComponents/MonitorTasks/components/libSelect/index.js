import React, { Component } from 'react'
import './index.less'
import _ from 'lodash'
const ListComponent = Loader.loadComponent('ListComponent');
const IconFont = Loader.loadBaseComponent('IconFont')

class LibSelect extends Component {
  state = {
    listData: [] // 全部布控库列表
  }
  componentDidMount(){
    let { libType } = this.props
    Service.monitorLib.queryMonitorLibs({ libType }).then(result => {
      const items = result.data.list || []
      this.setState({
        listData: items
      })
    })
  }
  selectLibs = ({ item, flag, changeAll, list }) => {
    if (flag) {
      !changeAll
        ? this.selectList.push(item)
        : (this.selectList = [].concat(this.selectList, list));
    } else {
      if (changeAll) {
        this.selectList = _.differenceBy(this.selectList, list, 'id');
      } else {
        _.remove(this.selectList, v => v.id === item.id);
      }
    }
    let ids = []
    this.selectList.forEach(item => ids.push(item.id))
    this.props.onSelected && this.props.onSelected(ids);
  }
  getSelectList = (libIds) => {
    let { listData } = this.state
    this.selectList = listData.filter(item => ~libIds.indexOf(item.id)) || []
    return this.selectList
  }
  render(){
    const { listData } = this.state
    let selectList = this.getSelectList(this.props.libIds)
    return (
      <div className='libs-select-tl'>
        <ListComponent 
          hasTitle={true}
          checkable={true}
          hasSearch={true}
          listData={listData}
          selectList={selectList}
          onChange={this.selectLibs}
          className='libs-list-all'
          icon={<IconFont type='icon-Layer_Main'/>}
          title={this.props.titleLibs ? this.props.titleLibs : '黑名单库'}
          inputPlaceholder='请输入你要搜索的库'
        />
        <ListComponent 
          hasTitle={true}
          hasClear={true}
          listData={selectList}
          onChange={this.selectLibs}
          className='libs-list-select'
          icon={<IconFont type='icon-Layer_Main'/>}
          title={`已添加${this.props.titleLibs ? this.props.titleLibs : '黑名单库'}(${selectList.length || 0}个)`}
        />
      </div>
    )
  }
}

export default LibSelect