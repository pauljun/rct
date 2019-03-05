import React from "react";
import {Spin, message } from "antd";
import { observer } from "mobx-react";
import {toJS} from 'mobx'
import { withRouter } from "react-router-dom";

const stopPropagation = Utils.stopPropagation;
const SimilarModal = Loader.loadBusinessComponent('ObjectMapPersonnelComponent','SimilarModal');
const SearchBoxCollection = Loader.loadBusinessComponent("SearchBoxCollection");
const CommunityImageInput = Loader.loadBusinessComponent("CommunityImageInput");
const CommunityCard = Loader.loadBusinessComponent("Card", "ObjectMapPersonnelCard");
const NoData = Loader.loadBaseComponent("NoData");
const InfiniteScrollLayout = Loader.loadBaseComponent("InfiniteScrollLayout");

@withRouter
@Decorator.businessProvider("residentPerson", "tab")
@observer
class RightTabPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: Math.random(),
      similarVisible:false,
      relationData:{}
    };
    this.infiniteRef = React.createRef()
  }
  /**条件查询列表 */
  onTypeChange = (type) => {
    if(!type)
    {this.mergeSearchData();}
    let { activeKey } = this.props;
     // this.props.recoverInitPage();
    if (activeKey == 1) {
    this.props.requestData(true,false,true)
    }
    if (activeKey == 2) {
     this.props.requestUnappear(true,false,true)
    }
    if (activeKey == 3) {
   this.props.requestAllPerson(true,false,true)
    }
  };
  handlePageJump = datas => {
     const { tab, location} = this.props;
     let moduleName='';
     if(datas.hasAid){
       moduleName = 'objectMapPersonnelDetailPloy';
     } else {
       moduleName = 'objectMapPersonnelDetailEntry';}
    this.props.handleTableKey();
    const data = { id:datas.id};
    tab.goPage({ moduleName, location, data })
  };
  /**获取图片结构化信息 */
  getFeature = feature => {
    const { activeKey } = this.props;
    const { residentPerson } = this.props;
    residentPerson.editSearchData({ faceFeature: feature }, activeKey);
  };
  deleteImg = type => {
    const { activeKey } = this.props;
    const { residentPerson } = this.props;
    residentPerson.editSearchData(
      { faceFeature: null, keywords: null, offset: 0 },
      activeKey
    );
    if (!type) {
      this.onTypeChange(true);
    }
  };
  /**以图搜图搜索 */
  onTypeChangeAnother = () => {
    const { activeKey } = this.props;
    const { residentPerson } = this.props;
    residentPerson.editSearchData({ offset: 0 }, activeKey);
    this.onTypeChange(true);
  };
  onFollow = (data,e) => {
    stopPropagation(e)
    Service.community.updatePeopleFocus({
      peopleId: data.id,
      isDeleted: data.isFocus ? true : false
    });
  };
  onRelation = (data,e) => {
    stopPropagation(e)
    this.setState({
      relationData:data,
      similarVisible:true
    })
  };
  handleSimilarOK = data => {
    if(data.length==0){
    message.warn("关联数据不能为空，请重新选择")
    return
    }
    let option = {
      aidBindParams:data}
    Service.person.addRelationVids(option).then(res => {
      this.setState({
        similarVisible: false
      });
      message.info("关联成功")
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
      communitySearchdata: toJS(activeKey==1?this.props.residentPerson.searchOption:
        (activeKey==2?this.props.residentPerson.searchOptionUnappear:this.props.residentPerson.allSearchOption))
     /*  communitySearchdata: toJS(this.props.residentPerson.searchOption),
      unexistSearchData:toJS(this.props.residentPerson.searchOptionUnappear),
      allSearchData:toJS(this.props.residentPerson.allSearchOption) */
    }).then(() => {
      this.props.tab.goPage({
        moduleName: 'communityRegistered',
        location: this.props.location,
        isUpdate: true,
        data: {id},
        action:'replace'
      })
    })
  }
  render() {
    let {activeKey,total,LongLiveList,RegisUnappList,id,longLoading,allLoading,specLoading,type,handlePopShow,
      popOne,popTwo,allList} = this.props;
    let {similarVisible,relationData}=this.state;
    return (
      <React.Fragment>
        {type == "resident" && (
          <React.Fragment>
            <div className="float-community">
              <SearchBoxCollection
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                id={id}
                popOne={popOne}
                handlePopShow={handlePopShow}
              />
              <CommunityImageInput
                getFeature={this.getFeature.bind(this)}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                deleteImg={this.deleteImg}
                isCover={true}
                Loadtype={1}
              />
            </div>
            <div className="float-communty-tab-scroll" ref="backonereal">
              {LongLiveList && LongLiveList.length > 0 ? (
                <Spin spinning={longLoading}>
                 {activeKey==1&& <div className="back-top-register">
                    <InfiniteScrollLayout
                      count={total}
                      rowSize={4}
                      itemWidth={344}
                      itemHeight={262}
                      ref={this.infiniteRef}
                      key={this.props.longId}
                      pdWidth={16}
                      hasBackTop={true}
                      data={LongLiveList}
                      loadMore={() => this.props.requestData(true, true)}
                      renderItem={(item, index) => (
                        <CommunityCard
                          data={item}
                          key={index}
                          onRelation={this.onRelation}
                          onFollow={this.onFollow}
                          onClick={this.handlePageJump}
                          imgUrl={item.portraitPicUrl}
                          personId={item.id}
                          address={item.presentAddress}
                          lastTime={item.recentTime}
                          lastAddress={item.recentAddress}
                          isFocus={item.isFocus}
                          tags={item.tagCodes||[]}
                          personName={item.name}
                          hasAid={item.hasAid}
                        />
                      )}
                    />
                  </div>}
                </Spin>
              ) : (
                <React.Fragment>
                  {longLoading ? (
                    <div
                      style={{ position: "absolute", left: "48%", top: "13%" }}
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

        {type == "float" && (
          <React.Fragment>
            <div className="float-community">
              <SearchBoxCollection
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                id={id}
                popTwo={popTwo}
                handlePopShow={handlePopShow}
                showSelsect={true}
              />
              <CommunityImageInput
                getFeature={this.getFeature.bind(this)}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                deleteImg={this.deleteImg}
                isCover={true}
                Loadtype={2}
              />
            </div>
            <div className="float-communty-tab-scroll" ref="backtworeal">
              {RegisUnappList && RegisUnappList.length > 0 ? (
                <Spin spinning={specLoading}>
                  {activeKey==2&&<div className="back-top-register">
                    <InfiniteScrollLayout
                      count={total}
                      rowSize={4}
                      itemWidth={344}
                      itemHeight={262}
                      pdWidth={16}
                      hasBackTop={true}
                      key={this.props.outId}
                      data={RegisUnappList}
                      loadMore={() => this.props.requestUnappear(true, true)}
                      renderItem={(item, index) => (
                        <CommunityCard
                          data={item}
                          onRelation={this.onRelation}
                          key={index}
                          onFollow={this.onFollow}
                          onClick={this.handlePageJump}
                          imgUrl={item.portraitPicUrl}
                          personId={item.id}
                          address={item.presentAddress}
                          lastTime={item.recentTime}
                          lastAddress={item.recentAddress}
                          isFocus={item.isFocus}
                          tags={item.tagCodes||[]}
                          personName={item.name}
                          hasAid={item.hasAid}
                          countTitle="距离上次出现"
                          countDay={item.continuousUncapturedDays}
                        />
                      )}
                    />
                  </div>}
                </Spin>
              ) : (
                <React.Fragment>
                  {specLoading ? (
                    <div
                      style={{ position: "absolute", left: "48%", top: "13%" }}
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
            <div className="float-community">
              <SearchBoxCollection
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                id={id}
                popTwo={popTwo}
                handlePopShow={handlePopShow}
                showSelsect={true}
              />
              <CommunityImageInput
                getFeature={this.getFeature.bind(this)}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                deleteImg={this.deleteImg}
                isCover={true}
                Loadtype={3}
              />
            </div>
            <div className="float-communty-tab-scroll" ref="backtworeal">
              {allList && allList.length > 0 ? (
                <Spin spinning={allLoading}>
                  {activeKey==3&&<div className="back-top-register">
                    <InfiniteScrollLayout
                      count={total}
                      rowSize={4}
                      itemWidth={344}
                      itemHeight={262}
                      pdWidth={16}
                      key={this.props.allId}
                      hasBackTop={true}
                      data={allList}
                      loadMore={() => this.props.requestAllPerson(true, true)}
                      renderItem={(item, index) => (
                        <CommunityCard
                          data={item}
                          key={index}
                          onRelation={this.onRelation}
                          onFollow={this.onFollow}
                          onClick={this.handlePageJump}
                          imgUrl={item.portraitPicUrl}
                          personId={item.id}
                          address={item.presentAddress}
                          lastTime={item.recentTime}
                          lastAddress={item.recentAddress}
                          isFocus={item.isFocus}
                          tags={item.tagCodes||[]}
                          personName={item.name}
                          hasAid={item.hasAid}
                          countTitle="距离上次出现"
                          countDay={item.continuousUncapturedDays}
                        />
                      )}
                    />
                  </div>}
                </Spin>
              ) : (
                <React.Fragment>
                  {allLoading ? (
                    <div
                      style={{ position: "absolute", left: "48%", top: "13%" }}
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
        {similarVisible&&<SimilarModal
          visible={similarVisible}
          onOk={this.handleSimilarOK}
          onCancel={this.handleSimilarCancel}
          data={relationData}
        />}
      </React.Fragment>
    );
  }
}
export default RightTabPart;
