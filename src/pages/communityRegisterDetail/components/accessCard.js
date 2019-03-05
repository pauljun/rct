import React from 'react';
import moment from 'moment';
import './accessCard.less';
import Dict from 'src/dict';

const IconFont = Loader.loadBaseComponent('IconFont')
const WaterMark=Loader.loadBusinessComponent('WaterMarkView')
class AccessCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data = {}, onClick } = this.props;
    return (
      <div className="access_card" onClick={() => onClick(data)}>
        <div className="img_box">
          <WaterMark
            key={data.id}
            className={'card_img'}
            background={true}
            type="multiple"
            src={data.picUrl}
          />
          {data.videoUrl && <IconFont type={'icon-Video_Main'} theme="outlined" /> }
        </div>
        <div className="card_content">
          <div className="content_info">
            <IconFont type={'icon-TreeIcon_People_Main2'} theme="outlined" />
            <span className="info_value info_name">{data.cardOwner}</span>
          </div>
          <div className="content_info">
            <IconFont type={'icon-Door_Type_Dark'} theme="outlined" />
            <span className="info_value">
              {data.accessType &&Dict.getLabel('openType', +data.accessType)}
            </span>
          </div>
          <div className="content_info">
            <IconFont type={'icon-Door_Num_Dark'} theme="outlined" />
            <span className="info_value" title={data.cardNo}>
              {data.cardNo}
            </span>
          </div>
          <div className="content_info">
            <IconFont type={'icon-Add_Light'} theme="outlined" />
            <span className="info_value" title={data.address}>
              {data.address}
            </span>
          </div>
          <div className="content_info">
            <IconFont type={'icon-Clock_Light'} theme="outlined" />
            <span className="info_value">
              {data.captureTime &&
                moment(moment(+data.captureTime)).format('YYYY.MM.DD HH:mm:ss')}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default AccessCard;
