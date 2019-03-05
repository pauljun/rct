import React from 'react';
import './index.less';
import { Set } from 'immutable';
const IconFont = Loader.loadBaseComponent('IconFont');

class DetailLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dictLabel: []
    };
  }

  componentDidMount() {
    this.getLabel(this.props.labelList);
  }
  
  componentWillReceiveProps(nextProps) {
    this.getLabel(nextProps.labelList);
  }
  getLabel = labelList => {
    labelList = [
      ...new Set(
        labelList.map(v => {
          if(v) {
            return parseInt(v / 10) * 10;
         }
        })
      )
    ];
    labelList = labelList.map(v => v + '');
    let dictLabel = Dict.typeCode.filter(v => labelList.indexOf(v.code) > -1);
    let arr = [];
    dictLabel.map(v => {
      if(v.code === '119100') {
        let arrLabel = JSON.parse(JSON.stringify(Dict.getDict(v.name)));
        arrLabel.map(v => {
          v.label = v.label.indexOf('经常出现') === -1 ? '经常出现' + v.label : v.label
        });
        arr = arr.concat(arrLabel);
      } else {
        arr = arr.concat(Dict.getDict(v.name));
      }
    });
    this.setState({
      dictLabel: arr
    });
  };
  render() {
    let { labelList = [], title = '人员标签', onClick } = this.props;
    const { dictLabel } = this.state;
    return (
      <div className="detail-label">
        <div className="header-title">
          <p className="title">{title}：</p>
          <div className="edit" onClick={() => onClick && onClick()}>
            <IconFont type={'icon-Edit_Main'} theme="outlined" /> 编辑
          </div>
        </div>
        <div className="label-center">
          {labelList.map(item => {
            return (
              <div className="label-info">
                {dictLabel.length > 0 &&
                  dictLabel.find(v => v.value == item) && dictLabel.find(v => v.value == item).label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DetailLabel;
