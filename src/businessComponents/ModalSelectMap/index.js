import React from 'react';

const ModalComponent = Loader.loadBaseComponent('ModalComponent');
const SelectMap = Loader.loadBusinessComponent('MapComponent', 'SelectMap');

class ModalSelectMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectList: props.selectList || []
    };
  }
  onChange = ({ list }) => {
    this.setState({ selectList: list });
  };
  submitSelect = () => {
    const { selectList } = this.state;
    this.props.onOk && this.props.onOk(selectList);
    return Promise.resolve();
  };
  render() {
    const { selectList, points, title = '设备选择', ...props} = this.props;
    return (
      <ModalComponent
        {...props}
        title={title}
        onOk={this.submitSelect}
        disabled={this.state.selectList.length === 0}
      >
        <SelectMap
          selectList={this.state.selectList}
          onChange={this.onChange}
          points={points && points}
        />
      </ModalComponent>
    );
  }
}

export default ModalSelectMap;
