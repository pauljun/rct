import React from 'react';
import './index.less';

const IconFont = Loader.loadBusinessComponent('IconFont');
const Tags = Loader.loadBusinessComponent('Card', 'Tags');

class DetailFeatures extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dictLabel: [],
      simpleData: [],
      detailedData: []
    };
  }

  componentDidMount() {
    this.format(this.props.appearance);
  }

  getIcon = code => {
    const list = [
      { value: '112100', icon: 'icon-ClothesStripe_Dark' },
      { value: '112800', icon: 'icon-Glasses_Dark' },
      { value: '119010', icon: 'icon-Control_Black_Main2' },
      { value: '112400', icon: 'icon-Clothes_Main' },
      { value: '112500', icon: 'icon-PantsTrousers_Dark' },
      { value: '112200', icon: 'icon-PantsShorts_Dark' },
      { value: '119000', icon: 'icon-Hat_Main' },
      { value: '100250', icon: 'icon-MouseMask_Dark' },
      { value: '112300', icon: 'icon-Backpack_Dark' }
    ];
    return list.find(v => v.value === code).icon || 'icon-People_All_Main2';
  };

  format = data => {
    let tagTypeCodeArr = data.map(v => v.tagTypeCode);
    let dictLabel = Dict.typeCode.filter(
      v => tagTypeCodeArr.indexOf(v.code) > -1
    );
    let arr = [];
    dictLabel.map(v => {
      arr = arr.concat(Dict.getDict(v.name));
    });
    let simpleData = [],
      detailedData = [];
    detailedData = data.map((v, index) => {
      if (v.list.length > 4) {
        let arr = v.list;
        let arrNew = arr.splice(4);
        v.list = arr;
        arr[3].tagCode = 0;
        arrNew.forEach(v => (arr[3].count += v.count));
      }
      return {
        title: dictLabel.find(item => item.code === v.tagTypeCode).label,

        tags: v.list.map(item => {
          return {
            name: arr.find(v2 => v2.value == item.tagCode)
              ? arr.find(v2 => v2.value == item.tagCode).label
              : '其他',
            value: item.count
          };
        }),
        icon: this.getIcon(v.tagTypeCode)
      };
    });
    simpleData = detailedData.slice(0, 5);
    this.setState({
      simpleData,
      detailedData
    });
  };
  more = visible => {
    this.setState({
      visible
    });
  };

  render() {
    let { visible, simpleData, detailedData } = this.state;
    const dataFirst = detailedData.slice(0, 4);
    const dataSecend = detailedData.slice(4, 9);
    return (
      <div className="detail-features">
        <div className="features-header">体貌特征：</div>
        <div className={`features-content ${visible ? 'features-more' : ''}`}>
          <div className="content">
            <div className="content-label">
              {simpleData.map(v => (
                <Tags
                  key={v.title}
                  singleTag={true}
                  data={v.tags}
                  icon={v.icon}
                />
              ))}
            </div>
            <div className="label-footer" onClick={() => this.more(true)}>
              <IconFont type={'icon-Arrow_Big_Down_Main'} theme="outlined" />
              看更多
            </div>
            <div className="detail-info">
              <div className="info-top">
                {dataFirst.map(v => (
                  <Tags
                    key={v.title}
                    title={v.title}
                    data={v.tags}
                    icon={v.icon}
                  />
                ))}
              </div>
              <div className="info-top">
                {dataSecend.map(v => (
                  <Tags
                    key={v.title}
                    title={v.title}
                    data={v.tags}
                    icon={v.icon}
                  />
                ))}
              </div>
            </div>
            <div className="label-footer" onClick={() => this.more(false)}>
              <IconFont type={'icon-Arrow_Big_Up_Main'} theme="outlined" />
              收起
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailFeatures;
