import React from 'react';
import { Select } from 'antd';
import './index.less';

const Option = Select.Option;
const IconFont = Loader.loadBaseComponent('IconFont');
const ModalComponent = Loader.loadBaseComponent('ModalComponent');

class LabelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagCodes: this.props.labelList,
      choseCodes: []
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.labelList !== this.props.labelList) {
      if (nextProps.labelList) {
      }
      this.setState({
        tagCodes: nextProps.labelList
      });
    }
  }
  changeLabel = item => {
    let { tagCodes } = this.state;
    const index = tagCodes.findIndex(v => v === item.value);
    if (index === -1) {
      tagCodes.push(item.value);
      this.setState({
        tagCodes
      });
    } else {
      tagCodes.splice(index, 1);
      this.setState({
        tagCodes
      });
    }
  };

  selectLabel = parms => {
    let { tagCodes } = this.state;
    let index = 0;
    let value = parms.toString();
    if (value === '120110' || value === '120111' || value === '120112') {
      index = tagCodes.findIndex(
        v => v === '120110' || v === '120111' || v === '120112'
      );
    }
    if (value === '120130' || value === '120131' || value === '120132') {
      index = tagCodes.findIndex(
        v => v === '120130' || v === '120131' || v === '120132'
      );
    }
    if (value === '120120' || value === '120121' || value === '120122') {
      index = tagCodes.findIndex(
        v => v === '120120' || v === '120121' || v === '120122'
      );
    }
    if (index === -1) {
      tagCodes.push(value);
    } else {
      tagCodes.splice(index, 1);
      tagCodes.push(value);
    }
    this.setState({
      tagCodes
    });
  };

  onOk = () => {
    let { tagCodes } = this.state;
    tagCodes = tagCodes.filter(v => v !== '120120' && v !== '120130' && v !== '120110' );
    this.props.onOk && this.props.onOk(tagCodes);
  };

  render() {
    let { tagCodes } = this.state;
    let { visible, onCancel } = this.props;
    return (
      <ModalComponent
        className="personnel-label-modal"
        visible={visible}
        onOk={this.onOk}
        onCancel={() => onCancel && onCancel()}
        width="630px"
        title="编辑人员标签">
        <div className="label-content">
          <div className="type">
            <div className="name">属性：</div>
            <div className="value">
              {Dict.map.personnelAttr.map(v => {
                return (
                  <div
                    className={`label ${
                      tagCodes.find(item => item == v.value)
                        ? 'label-chose'
                        : ''
                    }`}
                    onClick={() => this.changeLabel(v)}>
                    {v.label}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="type">
            <div className="name">外观：</div>
            <div className="value">
              <Select
                defaultValue="步态"
                className={`${tagCodes.find(
                  item =>
                    item == '120112' || item == '120111'
                ) ? 'select-active' : ''}`}
                value={
                  tagCodes.find(
                    item =>
                      item == '120112' || item == '120111' || item == '120110'
                  ) || '120110'
                }
                style={{ width: 90 }}
                dropdownClassName='label-select-drop'
                onChange={this.selectLabel}>
                <Option value="120110">步态</Option>
                {Dict.map.gait.map(v => {
                  return <Option value={v.value}>{v.label}</Option>;
                })}
              </Select>
              <Select
                defaultValue="120130"
                style={{ width: 90 }}
                className={`${tagCodes.find(
                  item =>
                    item == '120131' || item == '120132'
                ) ? 'select-active' : ''}`}
                value={
                  tagCodes.find(
                    item =>
                      item == '120130' || item == '120131' || item == '120132'
                  ) || '120130'
                }
                dropdownClassName="label-select-drop"
                onChange={this.selectLabel}>
                <Option value="120130">高矮</Option>
                {Dict.map.height.map(v => {
                  return <Option value={v.value}>{v.label}</Option>;
                })}
              </Select>
              <Select
                defaultValue="120120"
                style={{ width: 90 }}
                className={`${tagCodes.find(
                  item =>
                    item == '120121' || item == '120122'
                ) ? 'select-active' : ''}`}
                value={
                  tagCodes.find(
                    item =>
                      item == '120120' || item == '120121' || item == '120122'
                  ) || '120120'
                }
                dropdownClassName="label-select-drop"
                onChange={this.selectLabel}>
                <Option value="120120">胖瘦</Option>
                {Dict.map.fatAndThin.map(v => {
                  return <Option value={v.value}>{v.label}</Option>;
                })}
              </Select>
            </div>
          </div>
          <div className="type">
            <div className="name">身份：</div>
            <div className="value">
              {Dict.map.identity.map(v => {
                return (
                  <div
                    className={`label ${
                      tagCodes.find(item => item == v.value)
                        ? 'label-chose'
                        : ''
                    }`}
                    onClick={() => this.changeLabel(v)}>
                    {v.label}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="type">
            <div className="name">行为：</div>
            <div className="value">
              {Dict.map.aidBehavior.map(v => {
                return (
                  <div
                    className={`label ${
                      tagCodes.find(item => item == v.value)
                        ? 'label-chose'
                        : ''
                    }`}
                    onClick={() => this.changeLabel(v)}>
                    {v.label}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="type">
            <div className="name">时空：</div>
            <div className="value value-palce">
              {tagCodes
                .filter(v => v === '119051')
                .map(v => {
                  return (
                    <div
                      className="label label-palce label-chose"
                      title="系统正在监控中，暂不支持编辑">
                      <div className="label-palce-icon">
                        <IconFont type={'icon-Eye_Main2'} theme="outlined" />{' '}
                      </div>
                      经常出现{Dict.getLabel('aidBehaviorCode', v)}
                    </div>
                  );
                })}
              {tagCodes
                .filter(v => v === '118703' || v === '118702')
                .map(v => {
                  return (
                    <div
                      className="label label-palce label-chose"
                      title="系统正在监控中，暂不支持编辑">
                      <div className="label-palce-icon">
                        <IconFont type={'icon-Eye_Main2'} theme="outlined" />{' '}
                      </div>
                      经常出现{Dict.getLabel('behaviorAttr', v)}
                    </div>
                  );
                })}
              {tagCodes
                .filter(
                  v => v - 119100 > 0 && v - 119100 < 22 && v !== '119115'
                )
                .map(v => {
                  return (
                    <div
                      className="label label-palce label-chose"
                      title="系统正在监控中，暂不支持编辑">
                      <div className="label-palce-icon">
                        <IconFont type={'icon-Eye_Main2'} theme="outlined" />{' '}
                      </div>
                      经常出现{Dict.getLabel('bigDatePlaceType', v)}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </ModalComponent>
    );
  }
}

export default LabelModal;
