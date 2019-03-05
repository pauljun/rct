import React from 'react';
import { Modal } from 'antd';
import moment from 'moment';

import './index.less';

const ImageMovieMap = Loader.loadBusinessComponent('ImageMovieMap');
const TrajectoryMap = Loader.loadBusinessComponent(
  'MapComponent',
  'TrajectoryMap'
);
function trajectoryMapDetail() {
  class TrajectoryMapDetail extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalVisible: false,
        stateData: {},
        tags: {
          goodsw: '',
          headw: '',
          upperTexturew: '',
          lowerTexturew: '',
          upperColorw: '',
          lowerColorw: ''
        }
      };
    }

    handleCancel = () => {
      // this.props.forwardRef.current.pathSimplifier.pathNavigator.start();
      this.setState({
        modalVisible: false
      });
    };

    handleOk = stateData => {
      this.setState(
        {
          stateData
        },
        () => {
          this.init(stateData);
        }
      );
    };

    // imgIdType 1 人脸 2 人体
    init = imgData => {
      const { imgType = 1 } = this.props;
      if (!imgData.dataId) {
        return;
      }
      let option = {
        imgId: imgData.dataId,
        imgIdType: imgType
      };
      Service.monitor.queryCaptureDetailInfoById(option).then(res => {
        let data = {};
        if (imgType === 1) {
          try {
            data.id = res.faceStruts.id;
            data.address = res.faceStruts.address;
            data.cameraName = res.faceStruts.cameraName;
            data.cameraId = res.faceStruts.cameraId;
            data.faceTags = res.faceStruts.faceTags; // 人脸特征
            data.faceRect = res.faceStruts.faceRect;
            data.isFemale = res.faceStruts.isFemale;
            data.scenePath = res.faceStruts.scenePath;
            data.isMale = res.faceStruts.isMale;
            data.captureTime = res.faceStruts.captureTime;
            data.bodyTags = res.bodyStruts.bodyTags; // 人体特征
          } catch (e) {}
        } else {
          try {
            data.id = res.bodyStruts.id;
            data.address = res.bodyStruts.address;
            data.cameraId = res.bodyStruts.cameraId;
            data.cameraName = res.bodyStruts.cameraName;
            data.bodyTags = res.bodyStruts.bodyTags; // 人体特征
            data.faceRect = res.bodyStruts.bodyRect;
            data.isFemale = res.bodyStruts.isFemale;
            data.scenePath = res.bodyStruts.scenePath;
            data.isMale = res.bodyStruts.isMale;
            data.captureTime = res.bodyStruts.captureTime;
            data.faceTags = res.faceStruts.faceTags; // 人脸特征
          } catch (e) {}
        }
        this.setState(
          {
            stateData: data,
            modalVisible: true
          },
          () => {
            this.manyType();
          }
        );
      });
    };

    manyType = () => {
      let { stateData } = this.state;
      if (!stateData) {
        return;
      }
      // imgType 1 人脸 2 人体
      try {
        let faceTags = [],
          bodyTags = [];
        if (stateData.faceTags) {
          faceTags = stateData.faceTags;
        }
        if (stateData.bodyTags) {
          bodyTags = stateData.bodyTags;
        }
        let tags = faceTags.concat(bodyTags);
        let goodsw = this.typefilter(Dict.getDict('goods'), tags);
        let headw = this.typefilter(Dict.getDict('head'), tags);
        let upperTexturew = this.typefilter(Dict.getDict('upperTexture'), tags);
        let lowerTexturew = this.typefilter(Dict.getDict('lowerTexture'), tags);
        let upperColorw = this.typefilter(Dict.getDict('upperColor'), tags);
        let lowerColorw = this.typefilter(Dict.getDict('lowerColor'), tags);
        this.setState({
          tags: {
            goodsw,
            headw,
            upperTexturew,
            lowerTexturew,
            upperColorw,
            lowerColorw
          }
        });
      } catch (e) {}
    };

    typefilter = (value, tags) => {
      return value.find(v => tags.find(item => item == v.value));
    };

    changData = options => {
      let arr = [];
      options.map(v => {
        if (v.longitude && v.latitude) {
          arr.push({
            facePath: v.facePath,
            captureTime: v.captureTime,
            cameraId: v.cameraId,
            dataId: v.captureId,
            cameraName: v.cameraName,
            position: [v.longitude, v.latitude],
            imagePath: v.facePath,
            title: v.cameraName
          });
        }
      });
      return arr;
    };
    render() {
      let { modalVisible, stateData = {}, tags = {} } = this.state;
      let { imgType, forwardRef, ...props } = this.props;
      let sex = '';
      if (Number(stateData.isMale) === 1) {
        sex = '男';
      } else if (Number(stateData.isFemale) === 1) {
        sex = '女';
      }
      let options = this.changData(this.props.data);
      return (
        <div className="trajectory-map-detail">
          <TrajectoryMap
            data={options}
            onClickCard={this.handleOk}
            ref={forwardRef}
          />
          {modalVisible && (
            <Modal
              visible={modalVisible}
              onCancel={this.handleCancel}
              title="抓拍详情"
              footer={null}
              wrapClassName={`rajectory-map-detail-modal`}
              centered
              width={1016}>
              <div className="map_detail_modal_header">
                <p className="header_p" title={stateData.address || '-'}>
                  <span className="header_span">抓拍地址：</span>
                  {stateData.address || '-'}
                </p>
                <p
                  className="header_p"
                  title={tags.headw ? tags.headw.label : '-'}>
                  <span className="header_span">头部特征：</span>
                  {tags.headw ? tags.headw.label : '-'}
                </p>
                <p
                  className="header_p"
                  title={tags.upperColorw ? tags.upperColorw.text : '-'}>
                  <span className="header_span">上衣颜色：</span>
                  {tags.upperColorw ? tags.upperColorw.text : '-'}
                </p>
                <p
                  className="header_p"
                  title={tags.lowerColorw ? tags.lowerColorw.text : '-'}>
                  <span className="header_span">下衣颜色：</span>
                  {tags.lowerColorw ? tags.lowerColorw.text : '-'}
                </p>
                <p className="header_p" title={1}>
                  <span className="header_span">抓拍时间：</span>
                  {stateData.captureTime
                    ? moment(+stateData.captureTime).format(
                        'YYYY.MM.DD HH:mm:ss'
                      )
                    : '-'}
                </p>
                <p className="header_p">
                  <span className="header_span">随身物品：</span>
                  {tags.goodsw ? tags.goodsw.label : '-'}
                </p>
                <p className="header_p">
                  <span className="header_span">上衣纹理：</span>
                  {tags.upperTexturew ? tags.upperTexturew.label : '-'}
                </p>
                <p className="header_p">
                  <span className="header_span">下衣纹理：</span>
                  {tags.lowerTexturew ? tags.lowerTexturew.label : '-'}
                </p>
                <p className="header_p">
                  <span className="header_span">性别：</span>
                  {sex || '-'}
                </p>
              </div>
              <div className="map_detail_modal_content">
                <ImageMovieMap
                  data={stateData}
                  type={imgType === 2 ? 'body' : 'face'}
                  maptype={true}
                  key={stateData.id}
                />
              </div>
            </Modal>
          )}
        </div>
      );
    }
  }
  return React.forwardRef((props, ref) => {
    return <TrajectoryMapDetail {...props} forwardRef={ref} />;
  });
}

export default trajectoryMapDetail();
