import React from "react";
import { Spin} from "antd";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import {toJS} from 'mobx'

const stopPropagation = Utils.stopPropagation;
const InfiniteScrollLayout = Loader.loadBaseComponent("InfiniteScrollLayout");
const SimilarModal = Loader.loadBusinessComponent('ObjectMapPersonnelComponent','SimilarModal');
const NoData = Loader.loadBaseComponent("NoData");
const SearchBoxCollection = Loader.loadBusinessComponent("SearchBoxCollection");
const CommunityImageInput = Loader.loadBusinessComponent("CommunityImageInput");
const CommunityCard = Loader.loadBusinessComponent(
  "Card",
  "ObjectMapPersonnelCard"
);

@Decorator.businessProvider("flowPerson", "tab")
@withRouter
@observer
class FloatPersonTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: Math.random(),
      similarVisible:false,
      relationData:{}
    };
  }
  /**条件筛选 */
  onTypeChange = (type) => {
    let { activeKey } = this.props;
    this.props.recoverInitPage()
    if(!type){
    this.mergeSearchData()}
    if (activeKey == 1) {
      this.props.requestData(true);
    }
    if (activeKey == 2) {
      this.props.requestDataExist(true);
    }
    if (activeKey == 3) {
      this.props.requestAllPerson(true);
    }
  };
  getFeature = feature => {
    const { activeKey } = this.props;
    const { flowPerson } = this.props;
    flowPerson.editSearchData({ faceFeature: feature }, activeKey);
  };
  /**详情跳转 */
  handlePageJump = datas => {
    const { tab, location } = this.props;
    const moduleName = "objectMapPersonnelDetailAid";
    const data = { id: datas.aid };
    tab.goPage({ moduleName, location, data });
    this.props.handleTableKey();
  };
  deleteImg = type => {
    const { activeKey } = this.props;
    const { flowPerson } = this.props;
    flowPerson.editSearchData(
      { faceFeature: null, keywords: null, offset: 0 },
      activeKey
    );
    if (!type) {
      this.onTypeChange(true);
    }
  };
  onTypeChangeAnother = () => {
    const { activeKey } = this.props;
    const { flowPerson } = this.props;
    flowPerson.editSearchData({ offset: 0 }, activeKey);
    this.onTypeChange(true);
  };
  onFollow = (data, e) => {
    stopPropagation(e);
    Service.community.updatePeopleFocus({
      aid: data.aid,
      isDeleted: data.isFocus ? true : false
    });
  };
  onRelation = (data, e) => {
    stopPropagation(e);
    this.setState({
      relationData: data,
      similarVisible: true
    });
  };
  handleSimilarOK = aids => {
    let { relationData } = this.state;
    let option = {
      aids,
      personId: relationData.personId
    };
    Service.person.addRelationVids(option).then(res => {
      this.setState({
        similarVisible: false
      });
    });
  };
  handleSimilarCancel = () => {
    this.setState({
      similarVisible: false
    });
  };
  mergeSearchData = () => {
    let {activeKey}=this.props;
     const id = Utils.uuid()
    LM_DB.add('parameter', {
      id,
      activeKey:activeKey,
      communitySearchdata: toJS(activeKey==1?this.props.flowPerson.FloatsearchOption:
        (activeKey==2?this.props.flowPerson.FloatsearchOptionUnappear:this.props.flowPerson.allFloatSearchOption))
    }).then(() => {
      this.props.tab.goPage({
        moduleName: 'communityUnRegistered',
        location: this.props.location,
        isUpdate: true,
        data: {id},
        action:'replace'
      })
    })
  }
  render() {
    let {
      realLoading,
      floatLoading,
      allLoading,
      activeKey,
      UnLongExistList,
      id,
      total,
      NewFaceList,
      allList,
      type,
      popOne,
      popTwo,
      popThree,
      handlePopShow
    } = this.props;
    let {similarVisible,relationData}=this.state;
    return (
      <React.Fragment>
        {type == "freoccur" && (
          <React.Fragment>
            <div className="float-community-unregistered">
              <SearchBoxCollection
                popTwo={popTwo}
                handlePopShow={handlePopShow}
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                id={id}
                type={1}
              />
              <CommunityImageInput
                getFeature={this.getFeature}
                deleteImg={this.deleteImg}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                isCover={false}
                Loadtype={2}
              />
            </div>
            <div className="float-communty-tab-scroll-unregister" ref="backtwo">
              {UnLongExistList && UnLongExistList.length > 0 ? (
                <Spin spinning={realLoading}>
                  {activeKey==2&&<div className="query-backTop">
                    <InfiniteScrollLayout
                      count={total}
                      rowSize={4}
                      hasBackTop={true}
                      key={this.props.alwId}
                      itemWidth={344}
                      itemHeight={262}
                      height={820}
                      pdWidth={16}
                      rowClass="row-center"
                      itemClass="item-flex"
                      data={UnLongExistList}
                      loadMore={() => this.props.requestDataExist(true, true)}
                      renderItem={(item, index) => (
                        <CommunityCard
                          data={item}
                          key={index}
                          onClick={this.handlePageJump}
                          onRelation={this.onRelation}
                          onFollow={this.onFollow}
                          aid={item.aid}
                          countDay={item.appearDaysInMonth}
                          lastAddress={item.recentAddress}
                          lastTime={item.recentTime}
                          tags={item.tagCodes||[]}
                          isFocus={item.isFocus}
                          imgUrl={item.url}
                        />
                      )}
                    />
                  </div>}
                </Spin>
              ) : (
                <React.Fragment>
                  {realLoading ? (
                    <div
                      style={{ position: "absolute", left: "48%", top: "23%" }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <NoData />
                  )}
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
        {type == "occasion" && (
          <React.Fragment>
            <div className="float-community-unregistered">
              <SearchBoxCollection
                popOne={popOne}
                handlePopShow={handlePopShow}
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                type={1}
                id={id}
              />
              <CommunityImageInput
                getFeature={this.getFeature}
                deleteImg={this.deleteImg}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                isCover={false}
                Loadtype={1}
              />
            </div>
            <div className="float-communty-tab-scroll-unregister" ref="backone">
              {NewFaceList && NewFaceList.length > 0 ? (
                <Spin spinning={floatLoading}>
                  {activeKey==1&&<div className="query-backTop">
                    <InfiniteScrollLayout
                      count={total}
                      rowSize={4}
                      itemWidth={344}
                      itemHeight={262}
                      key={this.props.onceId}
                      height={820}
                      pdWidth={16}
                      hasBackTop={true}
                      rowClass="row-center"
                      itemClass="item-flex"
                      data={NewFaceList}
                      loadMore={() => this.props.requestData(true, true)}
                      renderItem={(item, index) => (
                        <CommunityCard
                          data={item}
                          key={index}
                          onClick={this.handlePageJump}
                          onRelation={this.onRelation}
                          onFollow={this.onFollow}
                          aid={item.aid}
                          countDay={item.appearDaysInMonth}
                          lastAddress={item.recentAddress}
                          lastTime={item.recentTime}
                          tags={item.tagCodes||[]}
                          isFocus={item.isFocus}
                          imgUrl={item.url}
                        />
                      )}
                    />
                  </div>}
                </Spin>
              ) : (
                <React.Fragment>
                  {floatLoading ? (
                    <div
                      style={{ position: "absolute", left: "48%", top: "23%" }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <NoData />
                  )}
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
        {type == "all" && (
          <React.Fragment>
            <div className="float-community-unregistered">
              <SearchBoxCollection
                popThree={popThree}
                handlePopShow={handlePopShow}
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                type={1}
                id={id}
              />
              <CommunityImageInput
                getFeature={this.getFeature}
                deleteImg={this.deleteImg}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                isCover={false}
                Loadtype={3}
              />
            </div>
            <div className="float-communty-tab-scroll-unregister" ref="backone">
              {allList && allList.length > 0 ? (
                <Spin spinning={allLoading}>
                 {activeKey==3&&<div className="query-backTop">
                    <InfiniteScrollLayout
                      count={total}
                      rowSize={4}
                      key={this.props.allId}
                      itemWidth={344}
                      itemHeight={262}
                      height={820}
                      hasBackTop={true}
                      pdWidth={16}
                      rowClass="row-center"
                      itemClass="item-flex"
                      data={allList}
                      loadMore={() => this.props.requestAllPerson(true, true)}
                      renderItem={(item, index) => (
                        <CommunityCard
                          data={item}
                          key={index}
                          onClick={this.handlePageJump}
                          onRelation={this.onRelation}
                          onFollow={this.onFollow}
                          aid={item.aid}
                          countDay={item.appearDaysInMonth}
                          lastAddress={item.recentAddress}
                          lastTime={item.recentTime}
                          tags={item.tagCodes||[]}
                          isFocus={item.isFocus}
                          imgUrl={item.url}
                        />
                      )}
                    />
                  </div>}
                </Spin>
              ) : (
                <React.Fragment>
                  {allLoading ? (
                    <div
                      style={{ position: "absolute", left: "48%", top: "23%" }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <NoData />
                  )}
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
       {/*  <SimilarModal
          visible={similarVisible}
          onOk={this.handleSimilarOK}
          onCancel={this.handleSimilarCancel}
          data={relationData}
        /> */}
      </React.Fragment>
    );
  }
}
export default FloatPersonTab;
