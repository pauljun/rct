import React from 'react';

const { MapComponent } = window.LMap;

const OrgTree = Loader.loadBusinessComponent('OrgTree');
const ListComponent = Loader.loadBusinessComponent('ListComponent');
const TreeSelectCamera = Loader.loadBusinessComponent('TreeSelectCamera');
console.log(TreeSelectCamera)
class Test extends React.Component {
  state = {
    selectList: []
  };
  onChange = selectList => {
    this.setState({ selectList });
  };
  render() {
    const { selectList } = this.state;
    return (
      <TreeSelectCamera selectList={selectList}></TreeSelectCamera>
      // <>
      //   <div className="test-part" style={{ height: '33.33%' }}>
      //     <ListComponent
      //       hasTitle={true}
      //       checkable={true}
      //       hasSearch={true}
      //       selectList={selectList}
      //       deviceList={BaseStore.device.deviceArray}
      //       onChange={this.onChange}
      //     />
      //   </div>
      //   <div className="test-part" style={{ height: '33.33%' }}>
      //     <ListComponent
      //       hasTitle={true}
      //       hasClear={true}
      //       deviceList={selectList}
      //       onChange={this.onChange}
      //     />
      //   </div>
      //   <div className="test-part" style={{ height: '33.33%' }}>
      //     <ListComponent deviceList={BaseStore.device.deviceArray} />
      //   </div>
      // </>
    );
  }
}

export default Test;
