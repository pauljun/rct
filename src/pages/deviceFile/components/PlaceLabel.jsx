import React from 'react';
const { bigDatePlaceType, placeFeature} = Dict.map;
const IconFont = Loader.loadBaseComponent("IconFont");
const FrameCard = Loader.loadBusinessComponent("FrameCard");
const PlaceLabelModal = Loader.loadBusinessComponent("PlaceLabelModal");

class PlaceLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { labelVisible: false, }; // 标签弹窗
  }
  componentDidMount() {

  }
  changeLabelModal = () => {
    this.setState({
      labelVisible: true
    });
  };
  handleLabelCancel = () => {
    this.setState({
      labelVisible: false
    });
    this.props.handleLabelCancel()
  };
  handleLabelOK = () => {
    this.props.handleLabelOK()
    this.handleLabelCancel();
  };

  render() {
    let { labelVisible } = this.state;
    let { placeTags, itemClick, initPlaceTags } = this.props;

    let placeType = bigDatePlaceType.concat(placeFeature);
    return <FrameCard
        title="场所标签："
        // headerOperator={
        //   <div className="place-label-edit" onClick={this.changeLabelModal}>
        //     <IconFont type={"icon-Edit_Main"} theme="outlined" /> 编辑
        //   </div>
        // }
      >
        <div className="place-label-view">
          {initPlaceTags&&initPlaceTags.map(v => {
              return (
                <div className="place-label-item">
                  {
                    placeType.find(i => {
                      return i.value === v;
                    }).label
                  }
                </div>
              );
            })}
        </div>

        {/* <PlaceLabelModal
          bigDatePlaceType={bigDatePlaceType}
          placeFeature={placeFeature}
          visible={labelVisible}
          onOk={this.handleLabelOK}
          onCancel={this.handleLabelCancel}
          itemClick={itemClick}
          placeTags={placeTags}
        /> */}
      </FrameCard>; 
  }
}

export default PlaceLabel