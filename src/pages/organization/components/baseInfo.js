import React from 'react';
import { Row, Col, Divider } from 'antd';
import moment from 'moment';
import './baseInfo.less';

const { departmentType } = Dict.map
export default class HeadTitle extends React.Component {
  render() {
    const { info } = this.props;
    let type = departmentType.find(v => v.value === info.organizationType);
    let label = null;
    type ? (label = type.label) : (label = departmentType[0].label);
    return (
      <div className="org-head-title">
        <div className="head-title-row">
          <div className="orgInfo">
            <Row>
              <Col span={8}>
                  <div>组织名称：</div>
                  <b>{info.name}</b>
              </Col>
              <Col span={8}>
                  <div>创建时间：</div>
                  <b>
                    {info.createTime &&
                      moment(parseInt(info.createTime, 10)).format(
                        'YYYY.MM.DD HH:mm:ss'
                      )}
                  </b>
              </Col>
              <Col span={8}>
                  <div>组织类型：</div>
                  <b>{label}</b>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                  <div>描述：</div>
                  <b>{info.desc || ''}</b>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
