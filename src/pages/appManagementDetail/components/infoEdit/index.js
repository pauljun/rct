/**
 * @desc 修改应用系统信息
 * @author wwj
 */
import React from 'react'
import { message } from 'antd'
import { Promise } from 'q';

const NoData = Loader.loadBaseComponent('NoData')
const OperationCenterForm = Loader.loadBusinessComponent('OperationCenterForm')

class InfoEdit extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: {}
    }
  }

  componentWillMount(){
    const { data, ocId } = this.props
    Promise.all([
      Service.user.getMobile([data.userInfo.id]),
      Service.operation.getContactPhone([ocId])
    ]).then(result => {
      this.setState({
        data: {
          ...data,
          contactPhone: result[1].data[0].mobile,
          mobile: result[0].data[0].mobile
        }
      })
    })
  }

  /**
   * @desc 提交
   */
  submit = values => {
    const { ocId, data } = this.props
    values.userInfo.id = data.userInfo.id
    return Service.operation.updateOperationCenter({
      id: ocId,
      ...values
    }).then(res => {
      message.success('修改成功')
      return res
    })
  }

  /**
   * @desc 重置密码
   */
  resetPassword = () => {
    return Service.user.resetPassword(this.props.data.userInfo.id)
      .then(res => {
        message.success('重置成功')
        return res
      })
  }

  render(){
    const { data } = this.state
    return (
      <React.Fragment>
        {data.id ? 
          <div
            style={{padding: '20px 0 50px 0'}}
          >
            <OperationCenterForm 
              type='edit'
              submit={this.submit}
              resetPassword={this.resetPassword}
              data={data}
            />
          </div> :
          <NoData />
        }
      </React.Fragment>
    )
  }
}

export default InfoEdit