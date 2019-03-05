import React from 'react';

import 'echarts-amap';

import '../style/person-map-flow.scss';

const HorizontalScrollLayout = Loader.loadBaseComponent('HorizontalScrollLayout');

function getLineWidth(count) {
  if (count <= 5) {
    return 2;
  }
  if (count <= 10) {
    return 4;
  }
  if (count <= 50) {
    return 6;
  }
  if (count <= 100) {
    return 8;
  }
  if (count > 100) {
    return 10;
  }
}

class PathSimplifier extends React.Component {
  constructor() {
    super();
    this.domRef = React.createRef();
    this.echart = null;
    this.markerIndex = Utils.getMakerIndex();
    this.data = [];
    this.graphData = [];
    this.links = [];
    this.linesData = [];
    this.markers = [];
  }
  setData(data) {
    this.data = data;
    this.computerdData();
    this.createMarker();
    this.updateGraph();
    this.forceUpdate();
  }
  computerdData() {
    this.graphData = [];
    this.links = [];
    this.linesData = [];
    this.data.forEach(v => {
      let index = this.getFreeIndex();
      v.index = index;
      this.graphData.push({
        value: v.position,
        index: index,
        ...v
      });
    });
    this.data.forEach(v => {
      v.list &&
        v.list.forEach(v2 => {
          if (this.graphData.findIndex(v3 => v3.name === v2.name) === -1) {
            this.graphData.push({
              value: v2.position,
              index: this.getFreeIndex(),
              ...v2
            });
          }
          let lw = getLineWidth(v2.count);
          this.linesData.push({
            coords: [v.position, v2.position],
            lineStyle: {
              normal: {
                width: lw,
                color: 'orange',
                curveness: 0.2
              }
            }
          });
          this.links.push({
            source: v.name,
            target: v2.name,
            count: v2.count,
            symbol: ['none', 'arrow'],
            symbolSize: Math.round(lw * 1.2) + 8,
            lineStyle: {
              normal: {
                width: lw,
                color: 'red',
                curveness: 0.2
              }
            }
          });
        });
    });
  }
  getOptions() {
    return {
      // use amap component
      amap: {
        center: this.data[0] ? this.data[0].position : [114.305215, 30.592935],
        zoom: 5
      },
      // demo serie showing the capital BEIJING of our PRC :cn:
      series: [
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'amap',
          symbol: 'circle',
          symbolSize: 10,
          z: 3,
          edgeLabel: {
            normal: {
              show: true,
              fontSize: 14,
              position: 'middle',
              formatter: function(params) {
                return '';
              }
            }
          },
          label: {
            normal: {
              show: true,
              position: 'bottom',
              color: '#5e5e5e'
            }
          },
          itemStyle: {
            normal: {
              shadowColor: 'none'
            },
            emphasis: {}
          },
          lineStyle: {
            normal: {
              width: 2,
              shadowColor: 'none'
            }
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: 8,
          data: this.graphData,
          links: this.links
          // categories
        } //,
        // {
        //   name: 'A',
        //   type: 'lines',
        //   coordinateSystem: 'amap',
        //   z: 4,
        //   effect: {
        //     show: true,
        //     trailLength: 0,
        //     constantSpeed:0,
        //     symbol: 'arrow',
        //     color: 'red',
        //     symbolSize: 14
        //   },
        //   lineStyle: {
        //     normal: {
        //       curveness: 0.2
        //     }
        //   },
        //   data: this.linesData
        // }
      ]
    };
  }
  get mapObj() {
    const model = this.echart.getModel();
    return model ? model._componentsMap._ec_amap[0].getAMap() : model;
  }
  componentDidMount() {
    this.echart = echarts.init(this.domRef.current);
    this.props.init && this.props.init(this);
  }
  createMarker() {
    this.removeMarker();
    this.markers = this.graphData.map(item => {
      const marker = new AMap.Marker({
        map: this.mapObj,
        position: item.position,
        offset: new AMap.Pixel(-12, -32),
        content: `<div class="map-marker-index">${item.index}</div>`
      });
      return marker;
    });
    try {
      setTimeout(() => {
        this.mapObj.setFitView(this.markers);
      }, 500);
    } catch (e) {
      console.log(e);
    }
  }

  removeMarker() {
    this.mapObj && this.mapObj.remove(this.markers);
    this.markers = [];
  }
  updateGraph() {
    this.echart.setOption(this.getOptions());
  }
  getFreeIndex(index = 'A') {
    if (this.graphData.findIndex(v => v.index === index) > -1) {
      const nextIndex = this.markerIndex[this.markerIndex.indexOf(index) + 1];
      if (nextIndex) {
        return this.getFreeIndex(nextIndex);
      } else {
        return Math.random();
      }
    } else {
      return index;
    }
  }
  render() {
    const { hasInfo } = this.props;
    return (
      <div className="person-flow-map-layout">
        <div className="person-flow-map" ref={this.domRef} />
        {hasInfo && <PersonPathInfo data={this.data} />}
      </div>
    );
  }
}

class PersonPathInfo extends React.Component {
  renderItem = (item, index) => {
    return (
      <div className="path-item">
        <span className="item-index">{item.index}</span>
        <span className="item-count">
          出现<i>{item.count}</i>次
        </span>
        <span className="item-name">{item.name}</span>
      </div>
    );
  };
  render() {
    const { data } = this.props;
    return <HorizontalScrollLayout className="person-path-info" size={5} data={data} renderItem={this.renderItem} />;
  }
}
export default PathSimplifier;
