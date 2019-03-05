import React, { Component } from 'react';
import { Avatar } from 'antd';
import { inject } from 'mobx-react';
import UserDefault from 'src/assets/img/base/user-default.svg';
import ModifyUserAvatar from './ModifyUserAvatar';
import * as _ from 'lodash';
import '../style/user-popup.less';

const IconSpan = Loader.loadBaseComponent('IconSpan');
const ModifyPassword = Loader.loadBusinessComponent('ModifyPassword');

@inject('user')
class UserAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAvatarVisible: false,
      changePwdVisible: false
    };
  }

  // 上传图片弹窗显示与否
  changeAvatarVisible() {
    this.setState({ changeAvatarVisible: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    let { user } = this.props;
    let newData = Object.assign(_.cloneDeep(user.userInfo), {
      userAvatar: this.state.imgUrl
    });
    user.updateUser(newData).then(() => {
      user.setUserInfo(newData);
      this.handleCancel();
    });
  }

  handleCancel() {
    this.setState({ changeAvatarVisible: false });
  }

  // 修改密码弹窗显示与否
  changePwdVisible() {
    this.setState({ changePwdVisible: true });
  }
  changePassword = () => {
    this.setState({ changePwdVisible: true });
  };

  changeAvatar = () => {};

  signOut = () => {
    const { user } = this.props;
    user.logout(true);
  };

  render() {
    const { userInfo } = this.props;
    const { changePwdVisible, changeAvatarVisible } = this.state;
    const { signOut } = this;
    const { userAvatarUrl, realName } = userInfo;
    return (
      <div className="user-popover-content">
        <div className="user-info">
          <div className="user-info-left fl">
            <Avatar icon="user" src={userAvatarUrl ? userAvatarUrl : UserDefault} />
          </div>
          <div className="user-info-right fl">
            <span className="current-user fl" title={realName}>
              {realName}
            </span>
            <div>
              <IconSpan type="antd" mode="inline" className="fl" onClick={() => this.setState({ changeAvatarVisible: true })} icon="user" label="修改头像" />
              <IconSpan type="antd" mode="inline" className="fl" onClick={() => this.setState({ changePwdVisible: true })} icon="key" label="修改密码" />
            </div>
          </div>
        </div>
        <IconSpan type="antd" mode="inline" className="login-out" onClick={signOut} icon="poweroff" label="退出登录" />
        <ModifyPassword className="user-password-popup" getContainer={() => document.getElementById('insert-container')} visible={changePwdVisible} closable={true} onCancel={() => this.setState({ changePwdVisible: false })} />
        <ModifyUserAvatar className="user-avatar-popup" getContainer={() => document.getElementById('insert-container')} visible={changeAvatarVisible} onCancel={() => this.setState({ changeAvatarVisible: false })} />
      </div>
    );
  }
}
export default UserAction;
