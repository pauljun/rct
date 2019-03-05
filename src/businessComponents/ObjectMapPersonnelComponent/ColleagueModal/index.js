import React from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import './index.less';

const ModalComponent = Loader.loadBaseComponent('ModalComponent');
const IconFont = Loader.loadBaseComponent('IconFont');
const BaseLibDetails = Loader.loadBusinessComponent('BaseLibDetails', 'DetailList');
const ObjectMapDouble = Loader.loadBaseComponent( 'Card', 'ObjectMapDouble');

@withRouter
@Decorator.businessProvider('tab')
class ColleagueModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collList: []
    }
  }

  componentWillReceiveProps(nextProps) {
    let Accompany = nextProps.Accompany || {};
    if(Accompany !== this.props.Accompany) {
      if(Accompany.list && Accompany.list.length > 0) {
        this.getList(Accompany);
      }
    }
  }

  getList = (option) => {
    const { type } = this.props;
    let arr = {}, cids = [];
    let list = option.list;
      list.map(v => {
        cids.push(v.cid);
        let time = null;
        if(type === 1) {
          time = moment(+v.captureTime).format('YYYY.MM.DD');
        } else {
          time = moment(+v.aid1CaptureTime).format('YYYY.MM.DD');
        }
        if(arr[time]) {
          arr[time].count += 1;
          arr[time].list.push(v);
        } else {
          arr[time] = {
            count: 1,
            list: [v]
          }
        }
      });
    this.setState({
      collList: arr,
      title: option.title,
      total: option.count
    })
  }

  onClick = () => {
    const { type, tab, location, onCancel, data, Accompany } = this.props;
    if(Object.keys(Accompany).length === 0) {
      return
    }
    let id = Utils.uuid();
    let moduleName = null;
    if(type === 1) {
      moduleName = 'objectMapPersonnelSnapshot';
    } else {
      moduleName = 'objectMapPersonnelDetailAid';
      id = Accompany.list[0].aid2;
    }
    window.LM_DB.add('parameter', {
      id,
      data
    }).then(() => {
      tab.goPage({
        moduleName,
        location,
        data:{id}
      });
    });
    onCancel && onCancel(type);
  }
  render() {
    const { type = 2, visible, onCancel, onOk } = this.props;
    const { collList, title } = this.state;
    return (
      <ModalComponent
        className="personnel-collegue-modal"
        visible={visible}
        onOk={() => onOk && onOk(type)}
        onCancel={() => onCancel && onCancel(type)}
        otherModalFooter={true}
        width={type === 1 ? '850px' : '970px'}
        title={type === 1 ? '常去地点' : '同行详情'}>
        <div className="collegue-modal">
          <div className="header">
            <div className="address">
              <p className="address-label">{type === 1 ? '地点名称：' : '虚拟身份：'} {title}</p>
              <p className="address-label">
                出现天数：30天内出现 <span className="value">{Object.keys(collList).length}</span> 天
              </p>
            </div>
            <div className="header-go" onClick={this.onClick}>
              <IconFont type={'icon-Often_Dark1'} theme="outlined" />进入档案查看更多
            </div>
          </div>
          <div className='collague-content'>
            {Object.keys(collList).map(v => {
              return (
                <div className='time-case'>
                <div className="case-header">
                  {v}（共出现 {collList[v].count} 次）
                </div>
                <div className="case-content">
                  {collList[v].list.map(item => {
                    return (
                      type === 1 ? <BaseLibDetails captureTime={item.captureTime || v.openTime} deviceName={item.deviceName || v.address} url={item.faceUrl || item.videoUrl} cameraName='11' /> : 
                      <ObjectMapDouble
                        leftUrl={v.aid1FaceUrl}
                        rightUrl={v.aid2FaceUrl}
                        captureTime={v.aid2CaptureTime}
                        deviceName={v.deviceName}
                      /> 
                    )
                  })}
                  {[1,2,3,4].map(v => {
                    return type === 1 ? <div className="single-box-null"></div> : <div className="doruble-box-null"></div>
                  })}
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </ModalComponent>
    );
  }
}

export default ColleagueModal;
