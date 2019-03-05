import React from "react";
import "./index.less";
import { Icon, Table, Row, Col } from "antd";
const IconFont = Loader.loadBaseComponent("IconFont");
const HightLevel = Loader.loadBaseComponent('HightLevel');
class PlaceTree extends React.Component {
  onExpand = (expanded, record) => {
    this.props.onExpand && this.props.onExpand(expanded, record)
  };
  selectPlace = value => {
    this.props.onSelect && this.props.onSelect(value)
  };
  expandIcon = props => {
    if (props.record.children && props.record.children.length > 0) {
      let text;
      if (props.expanded === true) {
        text = <Icon type="caret-down" />;
      } else if (props.expanded === false) {
        text = <Icon type="caret-right" />;
      }
      return (
        <span
          className='expand-icon'
          onClick={e => {
            props.onExpand(props.record, e);
          }}
        >
          {text}
        </span>
      );
    } else {
      return <span className='expand-icon' />;
    }
  };


  render() {
    let { data ,placeId ,expandedRowKeys,keyword} = this.props;
    const rowSelection = {
      type: "radio",
      selectedRowKeys: [placeId]
    };
    const columns = [
      {
        title: "场所",
        dataIndex: "name",
        render: (_, { name, deviceCount, personCount, childrenPlaceCount }) => {
          return (
            <div className="place-item">
              <div className="place-name" title={name}>
                 <HightLevel keyword={keyword} name={name} />
              </div>
              <Row type="flex" className="place-info">
                <Col className="place-info-item"><IconFont type={'icon-_Camera__Main2'}/>{deviceCount.count||0}设备</Col>
                <Col className="place-info-item"><IconFont type={'icon-UserName_Light'}/>{personCount||0}人</Col>
                <Col className="place-info-item"><IconFont type={'icon-Place_Dark'}/>{childrenPlaceCount||0}场所</Col>
              </Row>
            </div>
          );
        }
      }
    ];
    return (
      <div className="place-tree-view">
        <Table
          rowKey='placeId'
          rowSelection={rowSelection}
          indentSize={8}
          columns={columns}
          onRow={record => {
            return { onClick: this.selectPlace.bind(this,record) }; // 点击行
          }}
          onExpand={this.onExpand}
          expandIcon={this.expandIcon}
          dataSource={data}
          expandedRowKeys={expandedRowKeys}
          pagination={false}
        />
      </div>
    );
  }
}

export default PlaceTree;
