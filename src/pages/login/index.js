import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Form, Button, Input, message } from 'antd';
import Base64 from 'js-base64';
import CodeView from './components/code';

import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');
const ModifyPassword = Loader.loadBusinessComponent('ModifyPassword');

const LoginGonGan = '/resource/image/Logo_gongan.svg';
const Logo_CloudEye = '/resource/image/Logo_CloudEye.svg';
const FormItem = Form.Item;

@Form.create({})
@withRouter
@inject('user')
@observer
class LoginView extends React.Component {
  state = {
    changePwdVisible: false,
    //登录方式,: 默认账号密码登录, false:手机验证码登录
    activeTab: '1',
    loginLoading: false,
    videoKey: Math.random(),
    systemInfo: {},
    loginColor: Utils.getCache('themeColor', 'local') === 'undefined' ? '#f80' : Utils.getCache('themeColor', 'local')
  };
  componentWillMount() {
    let { user, history, match } = this.props;
    const isLogin = user.isLogin;
    if (isLogin) {
      history.replace('/');
      return;
    } else {
      sessionStorage.removeItem('token');
    }
    if (match.params.id) {
      Service.operation
        .getOptByLoginKeyUrl({
          loginKeyUrl: match.params.id,
          loginKey: Base64.encode(match.params.id)
        })
        .then(res => {
          if (res.code === 200) {
            this.setState({
              systemInfo: res.result
            });
          }
        });
    }
  }

  /**获取验证码 */
  getLoginCode = () => {
    const { form } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFields(['loginName', 'userPassword'], (err, value) => {
        if (err) {
          console.error('表单错误', err);
          reject(err);
        }
        let option = {
          loginName: value.loginName,
          userPassword: Base64.encode(value.userPassword)
        };
        resolve(option);
      });
    });
  };

  // 登录
  submitEvent = e => {
    e.preventDefault();
    const { user, history, form, location } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        console.error('表单错误', err);
        return;
      }
      this.setState({
        loginLoading: true
      });
      let params = {
        loginName: values.loginName,
        userPassword: Base64.encode(values.userPassword),
        identifyCode: values.identifyCode
      };
      const name = params.loginName;
      Service.user
        .login(params)
        .then(res => {
          Utils.setCache('token', res.data.token, 'session');
          Utils.setCache('userId', res.data.userId, 'session');
          if (!res.data.isModifyPassWord) {
            this.setState({
              changePwdVisible: true,
              loginLoading: false
            });
            return;
          }
          user.setLoginState(true);
          let params = Utils.queryFormat(location.search);
          console.log(location.search, params, decodeURIComponent(params.redirect));
          history.replace(params.redirect ? decodeURIComponent(params.redirect) : '/');
        })
        .catch(err => {
          let msg = '登录错误！';
          try {
            msg = err.data.message ? err.data.message : '登录错误！';
          } catch (e) {
            console.error(e);
          }
          message.warning(msg);
          this.setState({
            loginLoading: false
          });
        });
    });
  };

  closeChangePwdMark = () => {
    this.setState({
      changePwdVisible: false
    });
  };

  tabChange = value => {
    this.setState({
      activeTab: value
    });
  };
  render() {
    let { activeTab, loginLoading, systemInfo, loginColor } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="user_login_view">
        <div className="top-part">
          <div className="line-top" />
          <video muted width="100%" height="auto" src="/resource/video.mp4" autoPlay loop />
        </div>
        <div className="user_login_content">
          <div className="login_content_title">
            <i className="title_icon">
              <img src={systemInfo.systemLogo || LoginGonGan} />
            </i>
            <span className="title_text">{systemInfo.systemName || '智慧云眼'}</span>
          </div>
          <div className="login_content_info">
            <Form size="large" onSubmit={this.submitEvent}>
              <FormItem label="用户名">
                {getFieldDecorator('loginName', {
                  rules: [
                    {
                      required: true,
                      message: `请输入用户名`
                    }
                  ]
                })(
                  <div>
                    <Input prefix={<IconFont type={'icon-TreeIcon_People_Main2'} style={{ fontSize: '24px', color: '#8899bb' }} theme="outlined" />} autoComplete="off" name="user" placeholder={'请输入用户名'} />
                  </div>
                )}
              </FormItem>
              <FormItem label="密码">
                {getFieldDecorator('userPassword', {
                  rules: [
                    {
                      required: true,
                      message: `密码是必填项`
                    }
                  ]
                })(
                  <div>
                    <Input prefix={<IconFont type={'icon-PassWord_Light'} style={{ fontSize: '24px', color: '#8899bb' }} theme="outlined" />} autoComplete="new-password" name="password" type="password" placeholder={'请输入密码'} />
                  </div>
                )}
              </FormItem>
              <FormItem label="验证码">
                {getFieldDecorator('identifyCode', {
                  rules: [
                    {
                      required: true,
                      message: `请输入验证码`
                    },
                    {
                      max: 6,
                      message: '请输入正确的验证码'
                    }
                  ]
                })(
                  <div className="login_info_message">
                    <Input prefix={<IconFont style={{ fontSize: '24px', color: '#8899bb' }} type={'icon-PhoneNum_Light'} theme="outlined" />} autoComplete="new-password" name="identifyCode" type="text" placeholder={'请输入验证码'} />
                    <CodeView user={this.props.user} getLoginCode={this.getLoginCode} />
                  </div>
                )}
              </FormItem>
              <Form.Item className="login-btn-con">
                <Button loading={loginLoading} size="large" type="primary" htmlType="submit" className="login-btn mt10" style={{ background: loginColor, borderColor: loginColor }}>
                  {'登录'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="user_login_footer">
          <div className="login_footer_box">
            <div className="img_box">
              <span className="footer_img" />
              <span
                className="footer_img"
                style={{
                  backgroundImage: `url(${systemInfo.coLogo || Logo_CloudEye})`
                }}
              />
            </div>
            <p className="footer_text">
              为获得最佳使用体验，建议使用谷歌浏览器最新版，并在分辨率为1920×1080的显示器上显示
              <a className="footer-logo-google-link" target="_blank" href="https://www.google.cn/chrome/" rel="noopener noreferrer">
                下载Chrome浏览器
              </a>
              <br />
              Copyright 2016-2018 深圳羚羊极速科技有限公司 版权所有 粤ICP备16124741号-1
            </p>
          </div>
        </div>
        <ModifyPassword visible={this.state.changePwdVisible} maskClosable={false} closable={false} onCancel={this.closeChangePwdMark} />
      </div>
    );
  }
}

export default LoginView;
