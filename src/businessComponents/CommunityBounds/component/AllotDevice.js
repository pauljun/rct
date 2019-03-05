import React from 'react';

const {ViilageCluster,mapContext}=LMap

@Decorator.errorBoundary
class AllotDevice extends React.Component {
  render() {
    const { points, selectPoints, options, filterResource } = this.props;
    return (
      <ViilageCluster
        filterResource={filterResource}
        points={points}
        selectPoints={selectPoints}
        options={options}
      />
    );
  }
}
export default AllotDevice
