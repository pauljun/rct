import React from 'react';
import { Spin } from 'antd';

import HeaderView from './components/header.js';
const NoData = Loader.loadBaseComponent('NoData');
const Wrapper = Loader.loadBusinessComponent('BaseLibDetails', 'Wrapper');
const ImageMovieMap = Loader.loadBusinessComponent('ImageMovieMap');
const List = Loader.loadBusinessComponent('BaseLibDetails', 'DetailList');
const PageDetails = Loader.loadBusinessComponent('PageDetails');
const IconFont = Loader.loadBaseComponent('IconFont');

export default class vehicleLibraryDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      /**默认选中id */
      activeId: '',
      offset: 0, // 页码
      list: [], //所有数据
      limit: 6, // 每页多少条
      type: 'vehicle'
    };
  }
  componentDidMount() {
    const { location } = this.props;
    const { activeId, limit } = this.state;
    const { id } = Utils.queryFormat(location.search);
    LM_DB.get('parameter', id)
      .then(result => {
        this.queryPassRecords(result.searchData).then(list => {
          let index = list.findIndex(v => v.id === activeId);
          const offset = index > -1 ? parseInt(index / limit) : 0;
          this.setState({
            offset,
            list,
            activeId: id,
            loading: false
          });
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  /**
   * 请求数据
   */
  queryPassRecords = (options = {}) => {
    return Service.vehicle.queryPassRecords(options).then(result => {
      return result.data.list || [];
    });
  };

  /**
   * @desc 上一页
   */
  getPreData = activeId => {
    const { offset, list } = this.state;
    const data = this.getListData(list, offset - 1);
    this.setState({
      offset: offset - 1,
      activeId: activeId || data[data.length - 1].id
    });
  };

  /**
   * @desc 下一页
   * @param {String} type pre: 上一页 next: 下一页
   */
  getNextData = () => {
    const { offset, list } = this.state;
    const data = this.getListData(list, offset + 1);
    this.setState({
      offset: offset + 1,
      activeId: data[0].id
    });
  };

  /**
   * @desc 点击切换
   */
  changeActiveId = (activeId, type) => {
    const { list, offset } = this.state;
    let data = this.getListData(list, offset);
    if (!data.find(v => v.id === activeId)) {
      if (type === 'pre') {
        this.getPreData(activeId);
      }
      if (type === 'next') {
        this.getNextData();
      }
    } else {
      this.setState({ activeId });
    }
  };

  // 获取展示列表数据
  getListData = (list, offset) => {
    const { limit } = this.state;
    const startIdx = limit * offset;
    const endIdx = limit * (offset + 1);
    const listData = list.slice(startIdx, endIdx);
    return listData;
  };
  renderContent() {
    const { list, offset, activeId, type, loading } = this.state;

    if (loading) {
      return null;
    }

    const activeIndex = list.findIndex(v => v.id === activeId);
    if (activeIndex === -1) {
      return <NoData />;
    }
    //TODO 当前数据
    const data = list[activeIndex];

    //TODO 上一条数据
    const preData = list[activeIndex - 1];

    //TODO下一条第一条数据
    const nextData = list[activeIndex + 1];
    const preList = this.getListData(list, offset - 1);
    const nextList = this.getListData(list, offset + 1);
    const nowList = this.getListData(list, offset);
    return (
      <>
        <HeaderView item={data} />
        <div className="picture-container">
          {preData && (
            <div className="nav-l">
              <PageDetails imgUrl={preData.vehicleUrl} onChange={this.changeActiveId} id={preData.id} pageType="pre" />
            </div>
          )}
          {nextData && (
            <div className="nav-r">
              <PageDetails imgUrl={nextData.vehicleUrl} id={nextData.id} onChange={this.changeActiveId} />
            </div>
          )}
          <ImageMovieMap type={type} data={data} key={data.id} />
        </div>
        <div className="footer-list-container">
          {!!preList.length && (
            <div className="cg l" onClick={() => this.getPreData()}>
              <IconFont type="icon-Arrow_Big_Left_Main" />
            </div>
          )}
          {!!nextList.length && (
            <div className="cg r" onClick={() => this.getNextData()}>
              <IconFont type="icon-Arrow_Big_Right_Main" />
            </div>
          )}
          <div className={`detail-list-item ${nowList.length !== 6 ? 'less' : ''}`}>
            {nowList.map(v => (
              <List
                deviceName={v.deviceName}
                score={v.score}
                active={v.id === activeId ? true : false}
                captureTime={v.captureTime}
                onClick={() => this.changeActiveId(v.id)}
                url={v.vehicleUrl || v.sceneUrl}
                type={type}
                plateNo={v.plateNo === '无车牌' ? '-' : v.plateNo}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
  render() {
    const { loading } = this.state;
    return (
      <Wrapper>
        <Spin spinning={loading}>
          <div style={{ width: '100%', height: '100%', minHeight: 400 }}>{this.renderContent()}</div>
        </Spin>
      </Wrapper>
    );
  }
}
