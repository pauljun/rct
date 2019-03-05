import React from 'react';
import { observer, inject } from 'mobx-react';
import '../style/user-avatar.less';

const UploadComponents = Loader.loadBusinessComponent('UploadComponents', 'UploadSingleFile');
const ImageView = Loader.loadBaseComponent('ImageView');
const ModalComponent = Loader.loadBaseComponent('ModalComponent');

@inject('user')
@observer
class ModifyUserAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ''
    };
  }
  uploadAction = info => {
    this.setState({ url: info.url });
  };
  uploadService = formData => {
    return Service.user.uploadImg(formData);
  };
  handleSubmit = () => {
    const { userInfo } = this.props.user;
    return Service.user
      .changeUserAvatar({
        id: userInfo.id,
        userAvatarUrl: this.state.url
      })
      .then(() => {
        this.props.user.updateUserAvatar(this.state.url);
        this.props.onCancel();
        setTimeout(() => {
          this.setState({ url: '' });
        }, 200);
      });
  };
  render() {
    const { url } = this.state;
    const { user, visible, onCancel,...props } = this.props;
    return (
      <ModalComponent {...props} disabled={!url} title="修改头像" visible={visible} onOk={this.handleSubmit} onCancel={onCancel}>
        <div className="edit-user-avatar">
          <UploadComponents uploadService={this.uploadService} uploadDone={this.uploadAction} uploadBtn={false}>
            <ImageView className="user-image" src={url || user.userInfo.userAvatarUrl} />
          </UploadComponents>
        </div>
      </ModalComponent>
    );
  }
}

export default ModifyUserAvatar;
