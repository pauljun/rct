import React from 'react';

const MapSelect = Loader.loadBusinessComponent('ModalSelectMap');
class Test extends React.Component {
  state = {
    selectList: []
  };
  onChange = ({ list }) => {
    this.setState({ selectList: list });
  };
  render() {
    const { selectList } = this.state;
    return <MapSelect width={700} style={{height:500}} selectList={selectList} visible={true} onOk={this.onChange} />;
  }
}

export default Test;
