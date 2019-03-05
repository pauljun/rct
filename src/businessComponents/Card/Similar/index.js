import React from 'react';
import { Checkbox, Progress } from 'antd';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');
const WaterMarkView = Loader.loadBusinessComponent('WaterMarkView');

class Similar extends React.Component {
  constructor(props) {
    super(props);
    
  }
  onChange = (e) => {
    const checked = e.target.checked;
    this.props.onClick && this.props.onClick(checked, this.props.data);
  }
  render() {
    const { data = {} ,imgUrl} = this.props;
    return (
      <div className='similar-card'>
        <Checkbox
            checked={data.checked}
            onChange={this.onChange}
          />
          <div className='similar-image'>
          <WaterMarkView
              className={'info-img'}
              background={true}
              type={'multiple'}
              src={imgUrl}
            />
          </div>
          <div className='similar-process'>
          <IconFont type={'icon-Like_Main2'} theme="outlined" />
          <div className='process'>
            <span className='info'>相似度</span>
            <Progress percent={data.score} size="small" status="active" showInfo={false} />
            <span className='number'>{parseInt(data.score)}%</span>
          </div>
          </div>
      </div>
    );
  }
}

export default Similar;
