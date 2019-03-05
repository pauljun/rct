import React from 'react';
import { message } from 'antd';
import '../style/set-point-map.scss';

const { MakerPoints, MapSearch, providerMap,mapContext } = LMap;
const IconFont = Loader.loadBaseComponent('IconFont');
const SelectPoi = Loader.loadBusinessComponent('SelectPoi')

@providerMap('set-point-map')
@mapContext.map
class SetPointMap extends React.Component {
  constructor(props) {
    super(props);
    this.init = false;
    this.markerPoint = null;
    this.mapSearch = null;
    this.canClickSet = false;
  }

  componentDidUpdate() {
    if (!this.init) {
      this.init = true;
      const { mapMethods } = this.props;
      mapMethods.on('click', this.clickMap);
    }
  }
  componentWillUnmount() {
    this.init = null;
    this.markerPoint = null;
    this.mapSearch = null;
    this.canClickSet = null;
  }

  clickMap = event => {
    const {dragenable=true}=this.props
    if (this.canClickSet) {
      dragenable&&this.markerDrage(null, event, [event.lnglat.lng, event.lnglat.lat]);
    }
  };

  setClickPopint = () => {
    this.canClickSet = !this.canClickSet;
    this.forceUpdate();
  };

  /**点位拖拽 */
  markerDrage = (data, event, position) => {
    this.onSelectPoi(position);
    // this.mapSearch
    //   .searchAddressForPosition(position)
    //   .then(address => {
    //     this.mapSearch.searchPois(address.name).then(() => {
    //       this.props.onChangePoint &&
    //         this.props.onChangePoint({ position, point, ...address });
    //     });
    //   })
    //   .catch(this.catchSearch);
  }
  catchSearch = error => {
    console.log(error);
    message.warn('未知的位置！');
  };
  changeSearch = address => {
    this.searchPois(address, false);
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.point !== this.props.point) {
      this.setState({
        address: null,
        resultList: [],
        selectPoi: null,
        position: []
      });
      this.markerPoint.removeAllMarker();
      this.createMarker(nextProps.point);
    }
  }
  createMarker = point => {
    if (!point || !point.latitude || !point.longitude) {
      return false;
    }
    setTimeout(() => {
      this.markerPoint.createMarker(point, {
        draggable: true,
        dragend: this.markerDrage
      });
      this.props.mapMethods.setFitView();
    }, 10);
  };
  initMarkerPoint = markerPoint => {
    const { point } = this.props;
    this.markerPoint = markerPoint;
    this.createMarker(point);
  };
  initMapSearch = mapSearch => {
    this.mapSearch = mapSearch;
  };

  // searchInfo: 搜索列表点击时的信息
  onSelectPoi = (position, searchInfo) => {
    let { point, onChangePoint } = this.props;
    let newPoint = {...point};
    if(searchInfo) {
      newPoint.name = searchInfo.name;
      newPoint.address = searchInfo.address;
    }
    const [ longitude, latitude ] = position;
    newPoint.longitude = longitude;
    newPoint.latitude = latitude;
    this.createMarker(newPoint);
    onChangePoint && onChangePoint({ point: newPoint, position });
  };
  render() {
    const { showSearch, showPoistList, children=null }=this.props;
    return (
      <React.Fragment>
        <MakerPoints init={this.initMarkerPoint} />
        { showSearch && ( 
          <SelectPoi 
            map={this.props.mapMethods} 
            getCenter={this.onSelectPoi} 
          />
        )}
        {/* <MapSearch 
          init={this.initMapSearch} 
          onSelectPoi={this.onSelectPoi} 
          showSearch={showSearch} 
          showPoistList={showPoistList}
        /> */}
        <span
          className={`set-point ${this.canClickSet ? 'open' : 'close'}`}
          title={`${this.canClickSet ? '关闭' : '开启'}点击获取点位`}
          onClick={this.setClickPopint}
        >
          <IconFont type="icon-Add_Light" />
        </span>
        { children }
      </React.Fragment>
    );
  }
}

export default SetPointMap;
