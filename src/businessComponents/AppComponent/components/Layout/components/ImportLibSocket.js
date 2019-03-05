// 一体机布控库导入 socket处理
import React from 'react';
import { notification } from 'antd';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

@withRouter
@Decorator.businessProvider('tab', 'user')
@observer
class ImportLibSocket extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    // 监听一体机导入布控库
    SocketEmitter.on(SocketEmitter.eventName.importLib, this.handelImportLib)
  }
  componentWillUnmount(){
    SocketEmitter.off(SocketEmitter.eventName.importLib, this.handelImportLib);
  }
  // 处理监听到布控导入后的事件
  handelImportLib = uploadLibsOver => {
    let filePath = this.props.user.filePath;
    if (filePath !== uploadLibsOver.filePath) {
      return;
    }
    //判断是否插入数据库成功
    let isSuccess = uploadLibsOver.tips.includes('成功');
    notification.config({
      getContainer: () => document.querySelector('#root'),
      duration: 5
    });
    const content = uploadLibsOver && <div>{uploadLibsOver.tips}</div>;
    const btn = (
      <div>
        <span
          style={{ cursor: 'pointer' }}
          className="ok"
          onClick={() => this.goLibPage()}
        >
          进入一体机布控库管理界面
        </span>
      </div>
    );
    notification[isSuccess ? 'success' : 'error']({
      className: 'behavitor-item',
      placement: 'buttomRight',
      message: '布控库导入',
      description: content,
      btn,
      key: 'uploadLibs'
    });
  };
  // 跳转页面
  goLibPage = () => {
    const { tab, location } = this.props;
    notification.destroy()
    tab.goPage({
      location,
      moduleName: 'privateNetLibraryView'
    });
  };

  render() {
    return null
  }
}

export default ImportLibSocket
