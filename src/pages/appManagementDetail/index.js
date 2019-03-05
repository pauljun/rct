/**
 * @desc 应用系统详情页
 * @author wwj
 * @param {String} type 1:基本信息, 2:分配设备 3:分配小区 
 */
import React from 'react'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { Tabs, Spin } from 'antd'
import childConfigs from './child_config'
import './styles/index.less'

const NoData = Loader.loadBaseComponent('NoData')
const TabPane = Tabs.TabPane
@Decorator.errorBoundary
@withRouter
@observer
class operationCenterDetail extends React.Component {
  constructor(props) {
    super(props);
    let params = Utils.queryFormat(props.location.search)
    this.state = {
      loading: true,
      params: params ? params : {},
      data: {}
    }
  }
  
  componentWillMount(){
    /**获取应用系统信息 */
    Service.operation.operationCenterInfo(this.state.params.id)
      .then(res => {
        this.setState({
          data: res.data,
          loading: false
        })
      }).catch(() => this.setState({loading: false}))
  }
  
  render() {
    let {
      loading,
      params = {},
      data
    } = this.state
    if(!data.id){
      return null
    }
    return (
      <React.Fragment>
        <div className='operation-detail-wrapper operation-container'>
          <Spin spinning={loading}>
            <div className='title'>{data.centerName}</div>
            {params.id ? 
              <Tabs 
                defaultActiveKey={params.type.toString()}
              >
                {
                  childConfigs.map((v, i) => (
                    <TabPane
                      date-key={v.id}
                      key={v.id}
                      tab={v.title}
                    >
                      <v.editComponent
                        ocId={params.id}
                        data={data}
                      />
                    </TabPane>
                  ))
                }
              </Tabs>
          : <NoData />}
          </Spin>
        </div>
      </React.Fragment>
    )
  }
}

export default operationCenterDetail