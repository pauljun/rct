import React from 'react'
import { Divider, message } from 'antd'
import { observer, inject } from 'mobx-react';


@inject( 'user')
@observer
class view extends React.Component{
  constructor(){
    super()
    this.loading = false
  }

  state = {
    timer: 60
  }

  /**发送验证码 */
  sendCode = () => {
    let { getLoginCode, user } = this.props;
    if(this.loading){
      return
    }
    this.loading = true
    getLoginCode().then(option => {
      Service.user.sendVerifyCode(option).then((res) => {
        message.info(res.message);
        let intTimer = setInterval(() => {
          let { timer } = this.state
          timer--
          if(timer === 0){
            clearInterval(intTimer)
            this.setState({ timer: 60 })
            this.loading = false
            return
          }
          this.setState({timer})
        }, 1000)
      }).catch(err => {
        message.warn(err.message?err.message:'发送')
        this.loading = false
      });
    })
  }

  render(){
    const {
      timer
     } = this.state
    return(
      <div className="login-send-code">
        <Divider type="vertical" />
        {timer === 60 ? <span onClick={this.sendCode}>获取验证码</span> : `${timer}s`}
      </div>
    )
  }
}

export default view