import React from "react";
import { observer } from "mobx-react";
import { Input, message, Spin } from "antd";
import "./index.less";

const IconFont = Loader.loadBaseComponent("IconFont");
@Decorator.businessProvider("flowPerson", "residentPerson", "user")
@observer
class UploadInput extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }
  state = {
    imgUrl: "",
    capShow: false,
    val: "",
    feature: "",
    file: "",
    loading: false
  };

  onDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    let df = e.dataTransfer.items[0];
    var file = df.getAsFile();
    this.upDataImg(file);
  };

  upDataImg = file => {
    this.props.changeImg && this.props.changeImg(true);
    const formData = new FormData();
    formData.append("file", file);
    Service.face
      .uploadImg(formData)
      .then(result => {
        this.setState({
          // loading: false,
          // imgUrl: result.data.url
        });
        this.getImgFeature(result.data.url, 1);
      })
      .catch(e => {
        message.error("图片上传失败");
        this.setState({
          loading:false
        })
      });
  };
  //提取图片特征
  getImgFeature = (imgUrl, type) => {
    //type为1是url上传为2是base64上传
    let options = {
      score: 0.6
    };
    if (type === 2) {
      options.base64 = BaseStore.user.systemConfig.domainAddress + imgUrl;
    } else {
      options.url = BaseStore.user.systemConfig.domainAddress + imgUrl;
    }
    Service.face
      .getFeature(options)
      .then(res => {
        if (res.data.list.length > 0 && res.data.list[0].feature) {
          let feature = res.data.list[0].feature;
          if (this.props.isCover) {
            this.props.residentPerson.editImgUrl(imgUrl, this.props.Loadtype);
          } else {
            this.props.flowPerson.editImgUrl(imgUrl, this.props.Loadtype);
          }
          this.setState({
            feature: feature,
            loading: false
          });
          let { val } = this.state.val;
          this.props.getFeature && this.props.getFeature(feature);
        } else {
          this.fileInput.current.input.value = "";
          message.warn("提取图片特征失败,请重新上传");
          if (this.props.isCover) {
            this.props.residentPerson.deleteImgAndVal(this.props.Loadtype, 2);
          } else {
            this.props.flowPerson.deleteImgAndVal(this.props.Loadtype, 2);
          }
          this.setState({
            capShow: false,
            loading: false
          });
          this.props.deleteImg && this.props.deleteImg(true);
        }
      })
      .catch(e => {
        message.error("提取图片特征失败,请重新上传");
        this.setState({
          loading: false
        });
      });
    this.props.changeImg && this.props.changeImg(false);
  };

  fileInputChange = e => {
    this.setState({
      loading: true
    });
    let file = e.target.files[0];
    this.upDataImg(file);
  };
  onDragOver = e => {
    e.preventDefault();
  };

  onDragEnter = () => {};

  onDragLeave = () => {};

  onChange = e => {
    if (this.props.isCover) {
      this.props.residentPerson.editVal(e.target.value, this.props.Loadtype);
    } else {
      this.props.flowPerson.editVal(e.target.value, this.props.Loadtype);
    }
  };
  deleteImg = () => {
    if (this.props.isCover) {
      this.props.residentPerson.deleteImgAndVal(this.props.Loadtype, 1);
    } else {
      this.props.flowPerson.deleteImgAndVal(this.props.Loadtype, 1);
    }
    this.setState({
      feature: "",
      capShow: false
    });
    this.fileInput.current.input.value = "";
    this.props.deleteImg && this.props.deleteImg();
  };
  edit = () => {
    this.setState({
      capShow: true
    });
  };
  captureCb = src => {
    if (this.props.isCover) {
      this.props.residentPerson.editImgUrl(src, this.props.Loadtype);
    } else {
      this.props.flowPerson.editImgUrl(src, this.props.Loadtype);
    }
    this.setState({
      capShow: false
    });
    this.getImgFeature(src, 2);
  };
  search = () => {
    let { feature, val } = this.state;
    this.props.search && this.props.search(val, feature);
    this.setState({
      capShow: false
    });
  };
  close = () => {
    this.setState({
      capShow: false
    });
  };
  render() {
    let { Loadtype } = this.props;
    let { loading } = this.state;
    let { imgurl, val, extraImgurl, extraVal, allImgurl, allVal } = this.props
      .isCover
      ? this.props.residentPerson
      : this.props.flowPerson;
    let RealImgurl =
      Loadtype == 1 ? imgurl : Loadtype == 2 ? extraImgurl : allImgurl;
    let RealVal = Loadtype == 1 ? val : Loadtype == 2 ? extraVal : allVal;
    return (
      <div className="upload-input-view">
        <div className="upload-input-box">
          <Input
            onDrop={this.onDrop}
            onPressEnter={this.search}
            onDragLeave={this.onDragLeave}
            onDragOver={this.onDragOver}
            onChange={this.onChange}
            value={RealVal}
            style={RealImgurl || loading ? { paddingLeft: "33px" } : {}}
            className="upload-input"
            placeholder="请输入人员相关属性搜索"
          />
          <div className="delete-pic-input">
            {(RealVal || RealImgurl) && (
              <IconFont
                onClick={this.deleteImg}
                type={"icon-Close_Main1"}
                theme="outlined"
                style={{ fontSize: "16px" }}
              />
            )}
          </div>
          <div className="camera-btn">
            <label
              htmlFor={
                Loadtype == 1
                  ? "upDate"
                  : Loadtype == 2
                  ? "diffupDate"
                  : "allupDate"
              }
            >
              <Input
                type="file"
                ref={this.fileInput}
                accept="image/*"
                id={
                  Loadtype == 1
                    ? "upDate"
                    : Loadtype == 2
                    ? "diffupDate"
                    : "allupDate"
                }
                onChange={this.fileInputChange}
                style={{ visibility: "hidden", position: "fixed" }}
              />
              {!this.state.loading && !RealImgurl && !RealVal && (
                <IconFont
                  type={"icon-ImgSearch_Main"}
                  theme="outlined"
                  style={{
                    fontSize: "18px",
                    color: "#8899BB",
                    marginTop: "0px",
                    marginLeft: "3px"
                  }}
                />
              )}
            </label>
          </div>
          <div className="search-btn" onClick={this.search}>
            <IconFont type={"icon-Search_Main"} theme="outlined" />
          </div>
          {RealImgurl ? (
            <div className="img-view">
              <div className="img-box">
                <img src={RealImgurl} alt="" />
              </div>
            </div>
          ) : (
            <React.Fragment>
              {this.state.loading && (
                <div
                  className="img-view"
                  style={{ marginLeft: 3, marginTop: 2 }}
                >
                  <div className="img-box">
                    <Spin size="small" spinning={this.state.loading} />
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default UploadInput;
