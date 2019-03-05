import React from 'react';

const MapSelect = Loader.loadBusinessComponent('MapComponent', 'SelectMap');
class Test extends React.Component {
  state = {
    selectList: []
  };
  onChange = ({ list }) => {
    this.setState({ selectList: list });
  };
  render() {
    const { selectList } = this.state;
    return <MapSelect selectList={selectList} onChange={this.onChange} />;
  }
}

export default Test;
