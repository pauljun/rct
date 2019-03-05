import React from "react";
import "./index.less";

const ConfirmComponent = Loader.loadBaseComponent("ConfirmComponent");
const InfiniteScrollLayout = Loader.loadBaseComponent("InfiniteScrollLayout");

const cards = [
  {
    type: "KeyPointCard",
    component: Loader.loadBusinessComponent("Card", "KeyPointCard")
  },
  {
    type: "ForeignCard",
    component: Loader.loadBusinessComponent("Card", "ForeignCard")
  }
];

class view extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      handleVisible: false,
      type: 1,
      modalItem: {}
    };
    this.infinitRef = React.createRef();
  }

  handleChangeYN = (item, type, e) => {
    Utils.stopPropagation(e);
    this.setState({
      modalItem: item,
      handleVisible: true,
      type
    });
  };

  handleCancel = () => {
    this.setState({
      modalItem: {},
      handleVisible: false,
      type: 1
    });
  };

  handleOk = () => {
    let { type, modalItem } = this.state;
    this.props.handle(modalItem, type).then(() => {
      this.setState({
        modalItem: {},
        handleVisible: false,
        type: 1
      });
    });
  };

  handlePageJump = (id, libType) => {
    this.props.handlePageJump && this.props.handlePageJump(id, libType);
  };

  loadMore = () => {
    let { searchData, onTypeChange, total } = this.props;
    if (searchData.offset > total - searchData.limit) {
      return;
    }
    searchData.offset += searchData.limit;
    onTypeChange && onTypeChange(searchData, true);
  };

  render() {
    let {
      list,
      libType,
      total,
      infinitKey,
      loading,
      cardType,
      pdWidth,
      itemWidth,
      itemHeight
    } = this.props;
    let { handleVisible, type } = this.state;
    let Card = cards.filter(v => v.type === cardType)[0].component;
    return (
      <div className="no-padding-card alarm-card">
        <InfiniteScrollLayout
          count={total}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          key={infinitKey}
          pdWidth={pdWidth}
          data={list}
          ref={this.infinitRef}
          hasBackTop={true}
          loadMore={this.loadMore}
          hasLoadMore={!loading}
          renderItem={(item, index) => (
            <div key={item.id}>
              <Card
                data={item}
                libType={libType}
                type={1}
                score={libType === 4 ? item.score : null}
                handleChangeYN={this.handleChangeYN}
                handleJumPage={this.handlePageJump}
              />
            </div>
          )}
        />
        <ConfirmComponent
          title={type == 1 ? "有效告警确认" : "无效告警确认"}
          visible={handleVisible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          width={320}
          icon={type == 1 ? "icon-YesNo_Yes_Main" : "icon-YesNo_No_Main"}
          children={
            <div>点击“确定”把本告警标注为{type == 1 ? "有" : "无"}效告警？</div>
          }
        />
      </div>
    );
  }
}

export default view;
