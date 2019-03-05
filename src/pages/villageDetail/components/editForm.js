import React, { Component } from "react";
import { observer } from "mobx-react";
import { Form, Input, message, Select } from "antd";
import Submit from "./submit";
import { withRouter } from "react-router-dom";
import * as _ from "lodash";

import "../style/baseInfo.less";

const IconFont = Loader.loadBaseComponent("IconFont");
const Option = Select.Option;
const FormItem = Form.Item;
const FormUpload = Loader.loadBusinessComponent(
  "UploadComponents",
  "UploadSingleFile"
);

@withRouter
@Decorator.businessProvider("place")
@observer
class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      btnLoad: false,
      villageImgUrl: null,
      initPlace: ""
    };
  }
  // 保存操作
  handleSave = () => {
    let { villageImgUrl } = this.state;
    let {
      form,
      mapData,
      initData,
      deviceOption,
      isAdd,
      polylineData
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        btnLoad: true
      });
      let Info = {};
      if (!isAdd) {
        Info = {
          id: initData.id,
          ...values,
          pictureUrl: villageImgUrl ? villageImgUrl.url : initData.pictureUrl,
          polyline:
            mapData.length > 0 ? JSON.stringify(mapData) : initData.polyline
        };
      } else {
        Info = {
          ...values,
          pictureUrl: villageImgUrl ? villageImgUrl.url : undefined,
          polyline:
            mapData.length > 0 ? JSON.stringify(mapData) : polylineData.polyline
        };
      }
      Service.community[isAdd ? "addVillage" : "updateVillage"](Info)
        .then(res => {
          let { isAdd, handleCancel } = this.props;
          if (res.code === 200 || res.code === 200000) {
            message.success(`${isAdd ? "新建" : "编辑"}小区成功`);
            handleCancel();
          } else {
            message.error(`${isAdd ? "新建" : "编辑"}小区失败`);
          }
          this.setState({
            btnLoad: false
          });
        })
        .catch(() => {
          this.setState({
            btnLoad: false
          });
        });
    });
    if (
      !isAdd &&
      deviceOption.assignDeviceIds &&
      (deviceOption.assignDeviceIds.length > 0 ||
        deviceOption.unAssignDeviceIds.length > 0)
    ) {
      Service.community.assignDevice(deviceOption);
    }
  };
  /**记录当前页面对应的上传图片的url */
  uploadDone = file => {
    this.setState({ villageImgUrl: file });
  };
  uploadService = data => {
    return Service.community.uploadVillageImg(data);
  };
  render() {
    let { key, villageImgUrl } = this.state;
    let {
      form,
      initData,
      handleCancel,
      isAdd,
      placeArr,
      placeSelect,
      btnLoad
    } = this.props;
    let { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 9 },
      colon: true
    };
    return (
      <React.Fragment>
        <div className="village-Edit-Form">
          <Form
            onSubmit={this.handleSave.bind(this)}
            autoComplete="off"
            className="roleForm"
            key={key}
          >
            <FormItem
              className="villageName"
              label="小区名称："
              {...formItemLayout}
              autoComplete="off"
            >
              {getFieldDecorator("villageName", {
                rules: [
                  { required: true, message: "小区名称必须填写" },
                  {
                    max: 20,
                    message: "最大长度为20"
                  }
                ],
                initialValue: isAdd ? "" : initData.villageName
              })(<Input placeholder="请填写小区名称" />)}
            </FormItem>
            <Form.Item className="place-select">
              {getFieldDecorator("placeId", {
                rules: [{ required: true, message: "请选择一个场所" }],
                initialValue: isAdd ? undefined : initData.placeId
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={placeSelect}
                  placeholder="请选择一个场所"
                  disabled={!isAdd}
                >
                  {placeArr.map(v => (
                    <Option value={v.id}>{v.areaName}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <FormItem
              label="小区地址："
              className="address"
              {...formItemLayout}
            >
              {getFieldDecorator("address", {
                rules: [
                  {
                    required: true,
                    message: "小区地址必须填写"
                  },
                  {
                    max: 150,
                    message: "最大长度是150"
                  }
                ],
                initialValue: isAdd ? "" : initData.address
              })(<Input placeholder="请填写小区地址" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="uploadForm"
              label="小区形象图:"
              // ref={view => formUpload = view}
            >
              {getFieldDecorator("pictureUrl", {
                initialValue: isAdd ? undefined : initData.pictureUrl
              })(
                <FormUpload
                  name="vatar"
                  uploadBtn={
                    villageImgUrl || initData.pictureUrl ? (
                      <React.Fragment>
                        <img
                          className="village-img"
                          src={
                            isAdd && !villageImgUrl
                              ? ""
                              : villageImgUrl
                              ? villageImgUrl.url
                              : initData.pictureUrl
                          }
                        />
                        <IconFont
                          className="img-icon"
                          type="icon-AddImg_Light"
                        />
                      </React.Fragment>
                    ) : (
                      <IconFont
                        className="ant-upload-icon"
                        type="icon-AddImg_Light"
                      />
                    )
                  }
                  uploadService={this.uploadService}
                  uploadDone={this.uploadDone}
                  uploadTip={false}
                />
              )}
            </FormItem>
            <style jsx="true">{`
              .village-img {
                width: 100%;
                height: 100%;
                border: 0;
              }
              .img-icon {
                position: absolute;
                opacity: 0;
                background: rgba(0, 0, 0, 0.4);
              }
              .img-icon:hover {
                opacity: 1;
              }
            `}</style>
          </Form>
        </div>
        <Submit
          handleSave={this.handleSave}
          handleCancel={handleCancel}
          btnLoad={btnLoad}
        />
      </React.Fragment>
    );
  }
}

export default Form.create()(EditForm);
