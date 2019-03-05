import React from 'react';
import { differenceBy, orderBy } from 'lodash';

import '../style/trajectory-map.scss';

const { providerMap, mapContext, Trajectory } = LMap;

const Card = Loader.loadBusinessComponent('BaseLibDetails', 'DetailList');
const HorizontalScrollLayout = Loader.loadBaseComponent('HorizontalScrollLayout');

@providerMap({
  className: 'trajectory-map-layout'
})
@mapContext.map
class TrajectoryMap extends React.Component {
  constructor(props) {
    super(props);
    this.data = props.data ? orderBy(props.data, ['data', 'desc'], ['id', 'asc']) : [];
    this.trajectory = null;
    this.state = {
      currentIndex: 0
    };
  }
  componentWillReceiveProps(nextProps) {
    const list = differenceBy(nextProps.data, this.data, 'dataId');
    if (list.length > 0) {
      this.data = orderBy(nextProps.data, ['data', 'desc'], ['id', 'asc']);
      this.trajectory.setData(this.data);
    }
  }
  componentWillUnmount() {
    this.data = null;
  }
  init = path => {
    this.trajectory = path;
    this.trajectory.setData(this.data);
    const { init } = this.props;
    init && init(path);
  };
  changeIndex = index => {
    this.setState({ currentIndex: index });
    this.trajectory.changeIndex(index);
  };
  changeIndexCallback = index => {
    this.setState({ currentIndex: index });
  };
  render() {
    const { currentIndex } = this.state;
    const { onClickCard } = this.props;
    const currentData = this.data[currentIndex];
    return (
      <Trajectory 
        init={this.init}
        changeIndexCallback={this.changeIndexCallback}
        content={
          <Card
            onClick={() => onClickCard && onClickCard(currentData)} 
            {...currentData} 
          />
        }
      >
        <TrajectoryContent 
          data={this.data} 
          currentIndex={currentIndex} 
          changeIndex={this.changeIndex} 
        />
      </Trajectory>
    );
  }
}

class TrajectoryContent extends React.Component {
  renderItem = (item, index) => {
    const { currentIndex, changeIndex } = this.props;
    return ( <Card {...item} active={index === currentIndex} onClick={() => changeIndex(index)} />);
  };

  render() {
    const { data, currentIndex } = this.props;
    return (
      <div className="map-content-part">
        <HorizontalScrollLayout currentIndex={currentIndex} className="content-view" itemWidth={146} data={data} renderItem={this.renderItem} />
      </div>
    );
  }
}

export default TrajectoryMap;
