/**
 * @title 应用系统列表
 * @author wwj
 */

/**
  * @desc state
  * @param {Array} list 列表数据
  * @param {Number} total 总数
  * @param {Boolean} loading 加载状态
  * @param {Boolean} visible 确认删除
  * @param {Object} delData 点击删除的应用系统数据
 */

import React from 'react'
import Table from './components/Table'
import { Spin, message } from 'antd'
import Search from './components/Search'
import './index.less'
const SystemWrapper = Loader.loadBusinessComponent('SystemWrapper')
const ConfirmComponent = Loader.loadBaseComponent('ConfirmComponent')

@Decorator.businessProvider('operation', 'tab')
class OperationCenterView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      list: [],
      total: 10,
      loading: false,
      visible: false,
      delData: {}
    }
  }

  componentWillMount(){
    this.updateSearchData({ keywords: '' })
    SocketEmitter.on(SocketEmitter.eventName.addAppManagement, () => {
      this.search()
    })
  }

  /**
   * @desc 搜索
   */
  search = () => {
    const { searchData } = this.props.operation
    this.setState({
      loading: true
    });
    Service.operation.queryOperationCenters({
      ...searchData,
      offset: (searchData.offset - 1)*searchData.limit
    }).then(res => {
      this.setState({
        total: res.data.total,
        loading: false,
        list: res.data.list
      })
    })
  }

  /**
   * @desc 编辑查询条件
   * @param {Object} options
   */
  updateSearchData = options => {
    this.props.operation.mergeSearchData(options)
      .then(() => this.search())
  }

  /**
   * @desc 修改页码查询
   * @param {Number} offset
   * @param {Number} limit
   */
  onChange = (offset, limit) => {
    this.updateSearchData({ offset, limit })
  }

  /**
   * @desc 跳转
   * @param {String} moduleName 
   * @param {Object} data
   */
  goPage = (moduleName, data = {}) => {
    const { tab, location } = this.props
    tab.goPage({
      moduleName,
      location,
      state: data,
      data
    })
  }

  /**
   * @desc 删除
   */
  del = data => {
    this.setState({
      visible: true,
      delData: data
    })
  }

  /**
   * @desc 关闭弹窗
   */
  closeConfirm = () => {
    this.setState({visible: false})
  }

  /**
   * @desc 确认删除
   */
  sure = () => {
    Service.operation.deleteOperationCenter({
      id: this.state.delData.id
    }).then(() => {
      message.success('删除成功')
      this.setState({
        visible: false,
        delData: {}
      })
      this.search()
    })
  }

  /**
   * @desc 查看联系人方式
   */
  getContactPhone = id => {
    const { list } = this.state
    Service.operation.getContactPhone([id])
      .then(res => {
        list.map(v => {
          if(res.data[0].id === v.id){
            v.contactPhone = res.data[0].mobile || '-'
          }
          return v
        })
        this.setState({list})
      })
  }

  render() {
    const { list, total, loading, visible, delData } = this.state
    const { searchData } = this.props.operation
    return (
      <SystemWrapper className='operation-view-wrapper' name='应用系统管理'>
        <Spin spinning={loading}>
          <Search 
            searchData={searchData}
            goPage={this.goPage}
            onSearch={this.updateSearchData}
          />
          <Table 
            dataSource={list} 
            total={total} 
            goPage={this.goPage}
            getContactPhone={this.getContactPhone}
            scroll={{ y: '100%' }}
            del={this.del}
            searchData={searchData}
            onChange={this.onChange}
          />
        </Spin>
        <ConfirmComponent
          title="删除确认"
          visible={visible}
          width={320}
          onCancel={() => this.setState({visible: false})}
          onOk={this.sure}
          className='operation-del-container'
          img='delete'
        >
          <div className='model-content'>
            <div className="title-name">
               您确定要删除<span>{delData.operationCenterName}</span>?
            </div>
          </div>
        </ConfirmComponent>
      </SystemWrapper>
    );
  }
}

export default OperationCenterView