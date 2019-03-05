import React from 'react';
import { Popover, message } from 'antd';
import { observer } from 'mobx-react';
import './index.less';
const SearchImageInput = Loader.loadBusinessComponent('SearchImageInput');
const ObjectMapSex = Loader.loadBusinessComponent('Statistics', 'ObjectMapSex');
const ObjectMapAge = Loader.loadBusinessComponent('Statistics', 'ObjectMapAge');
const ObjectMapLabel = Loader.loadBusinessComponent(
  'Statistics',
  'ObjectMapLabel'
);
const ObjectMapPlace = Loader.loadBusinessComponent(
  'Statistics',
  'ObjectMapPlace'
);

const IconFont = Loader.loadBaseComponent('IconFont');

@Decorator.businessProvider('tab')
@observer
class ObjectMapPersonnel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      sexStatistics: undefined,
      ageStatistics: undefined,
      timeStatistics: undefined,
      placeTypeStatistics: undefined
    };
    this.sexRef = React.createRef();
    this.ageRef = React.createRef();
    this.labelRef = React.createRef();
    this.placeRef = React.createRef();
    this.getPersonCount();
    this.countPerson();
  }

  // 获取人员档案总数
  getPersonCount = () => {
    Service.person.getPersonCount().then(res => {
      this.setState({
        count: res.data
      });
    });
  };

  // 获取场所统计
  countPerson = () => {
    let option = {
      placeIds: [],
      tagTypes: [100000, 100800, 119100, 119050]
    };
    BaseStore.place.placeArray.map(v => option.placeIds.push(v.placeId));
    Service.place.countPerson(option).then(res => {
      let data = res.data,
        sexStatistics = undefined,
        ageStatistics = undefined,
        timeStatistics = undefined,
        placeTypeStatistics = undefined;
      data.map(v => {
        if (v) {
          if (v.tagType === '100000') {
            // 性别统计
            sexStatistics = v.tagCounts;
          }
          if (v.tagType === '100800') {
            // 年龄段
            ageStatistics = v.tagCounts;
          }
          if (v.tagType === '119100') {
            // 场所类型人员统计
            placeTypeStatistics = v.tagCounts;
          }
          if (v.tagType === '119050') {
            // 时空标签
            timeStatistics = v.tagCounts;
          }
        }
      });
      this.setState({
        sexStatistics,
        ageStatistics,
        timeStatistics,
        placeTypeStatistics
      });
    });
  };
  search = item => {
    const { tab, location } = this.props;
    if(!item.pictureUrl && item.keywords.length === 0 && item.recommends.length === 0 ) {
      message.info('请输入关键字进行搜索');
      return;
    }
    const id = Utils.uuid();
    window.LM_DB.add('parameter', {
      id,
      searchData: item
    }).then(() => {
      tab.goPage({
        moduleName: 'objectMapPersonnelList',
        location,
        isUpdate: true,
        data: { id }
      });
    });
  };

  render() {
    let {
      count,
      sexStatistics,
      ageStatistics,
      timeStatistics,
      placeTypeStatistics
    } = this.state;
    return (
      <div className="object-map-personnel">
        <header className="personnel-header">
          <div className="header-total">
            人员档案总数：
            <span className="number">{Utils.thousand(+count)}</span>
          </div>
          <p className="header-title">人员档案</p>
        </header>
        <SearchImageInput search={this.search} />
        <div className="perosnnel-footer">
          {sexStatistics && (
            <div className="footer-box" ref={this.sexRef}>
              <Popover
                placement="top"
                content={<ObjectMapSex data={sexStatistics} />}
                getPopupContainer={() => this.sexRef.current}
                className="pop-sex"
                overlayClassName="pop-sex-content">
                <div className="box-content">
                  <div className="btn">
                    <IconFont type={'icon-Sex_Main'} theme="outlined" />
                  </div>
                  <div className="info">性别统计</div>
                </div>
              </Popover>
            </div>
          )}
          {ageStatistics && (
            <div className="footer-box" ref={this.ageRef}>
              <Popover
                placement="top"
                content={<ObjectMapAge data={ageStatistics} />}
                getPopupContainer={() => this.ageRef.current}
                overlayClassName="pop-age-content">
                <div className="box-content">
                  <div className="btn">
                    <IconFont type={'icon-Age_Main'} theme="outlined" />
                  </div>
                  <div className="info">年龄段分布情况</div>
                </div>
              </Popover>
            </div>
          )}
          {timeStatistics && (
            <div className="footer-box" ref={this.labelRef}>
              <Popover
                placement="top"
                content={<ObjectMapLabel data={timeStatistics} total={count} />}
                getPopupContainer={() => this.labelRef.current}
                className="pop"
                overlayClassName="pop-label-content">
                <div className="box-content">
                  <div className="btn">
                    <IconFont type={'icon-_ThingsAnalysis'} theme="outlined" />
                  </div>
                  <div className="info">时空标签数量占比统计</div>
                </div>
              </Popover>
            </div>
          )}
          {placeTypeStatistics && (
            <div className="footer-box" ref={this.placeRef}>
              <Popover
                placement="top"
                content={<ObjectMapPlace data={placeTypeStatistics} />}
                getPopupContainer={() => this.placeRef.current}
                overlayClassName="pop-place-content">
                <div className="box-content">
                  <div className="btn">
                    <IconFont type={'icon-Place_Dark'} theme="outlined" />
                  </div>
                  <div className="info">场所类型人员统计</div>
                </div>
              </Popover>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ObjectMapPersonnel;
