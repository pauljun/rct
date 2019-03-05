import React from 'react';
import { Input, Spin, Icon, message, Popover } from 'antd';
import { observer } from 'mobx-react';

import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');
const HightLevel = Loader.loadBaseComponent('HightLevel');
const antIcon = <Icon type="loading" spin />;

@Decorator.businessProvider('user')
@observer
class SearchImageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropLoading: false,
      popVisible: false,
      popoverType: 1,
      keywords: [],
      pictureUrl: '',
      searchList: [],
      recommends: []
    };
    this.uploadRef = React.createRef();
    this.headerRef = React.createRef();
    this.iconRef = React.createRef();
    this.timer = null;
  }

  componentDidMount() {
    document.body.addEventListener('click', this.hideProperLayout, false);
  }

  hideProperLayout = (event) => {
    const {popVisible} = this.state;
    let flag = event.path.findIndex(v => v === this.headerRef.current) > -1;
    let icon = event.path.findIndex(v => v === this.iconRef.current) > -1;
    if(flag && !popVisible){
      this.setState({
        popVisible:true,
        popoverType: icon ? 0 : 1 
      })
    }
    if(!flag){
      this.setState({popVisible:false})
    }
  };


  componentWillReceiveProps(nextProps) {
    const searchData = nextProps.searchData;
    if (nextProps.searchData !== this.props.searchData) {
      this.setState({
        keywords: searchData.keywords,
        pictureUrl: searchData.pictureUrl,
        recommends: searchData.recommends
      });
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.hideProperLayout, false);
    clearTimeout(this.timer);
    this.timer = null;
    this.uploadRef = null;
    this.headerRef = null;
    this.iconRef = null;
  }

  onDrop = e => {
    e.preventDefault();
    Utils.stopPropagation(e);
    let df = e.dataTransfer.items[0];
    var file = df.getAsFile();
    this.upDataImg(file);
  };
  onDragOver = e => {
    e.preventDefault();
  };
  
  upDataImg = file => {
    this.setState({ dropLoading: true });
    let formData = new FormData();
    formData.append('file', file);
    Service.person
      .uploadPersonPicture(formData)
      .then(res => {
        this.setState({
          dropLoading: false,
          pictureUrl: res.data.url
        });
      })
      .catch(e => {
        message.warn('图片结构化失败，请刷新或等待一段时间后再上传');
        this.setState({
          dropLoading: false
        });
      });
  };

  deleteImgUrl = () => {
    this.setState({
      pictureUrl: ''
    });
  };

  fileInputChange = e => {
    let file = e.target.files[0];
    this.upDataImg(file);
  };


  search = () => {
    let { pictureUrl, keywords, recommends } = this.state;
    if(pictureUrl && pictureUrl.indexOf('http') === -1) {
			pictureUrl = BaseStore.user.systemConfig.domainAddress + pictureUrl;
		}
    this.setState({popVisible:false});
    this.props.search &&
      this.props.search({ pictureUrl, keywords, recommends });
  };

  /**
   * @des 搜索内容改变
   */
  handleInputChange = e => {
    let keywords = e.target.value;
    this.setState({
      keywords: e.target.value ? [keywords] : []
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      Service.person
        .searchPersonByKeywords({
          keywords,
          limit: 3,
          offset: 0
        })
        .then(res => {
          this.setState({
            searchList: res.data.list
          });
        });
    }, 500);
  };

  labelClick = parms => {
    const { recommends } = this.state;
    let chose = recommends.findIndex(v => v.id === parms.value);
    if (chose === -1) {
      recommends.push({ id: parms.value, type: 0, description: parms.label });
    } else {
      recommends.splice(chose, 1);
    }
    this.setState({
      recommends
    });
  };

  deleteLabel = parms => {
    let { recommends } = this.state;
    let index = recommends.findIndex(v => v.id === parms.id);
    recommends.splice(index, 1);
    this.setState({
      recommends
    });
  };

  lenveClick = data => {
    let { recommends } = this.state;
    const index = recommends.findIndex(v => v.id === data.id);
    if (index === -1) {
      recommends.push({
        id: data.id,
        type: data.type,
        description: data.description
      });
      this.setState({
        recommends,
        searchList: [],
        keywords: []
      });
    }
  };

  render() {
    let {
      dropLoading,
      pictureUrl,
      popVisible,
      popoverType,
      recommends,
      keywords,
      searchList
    } = this.state;
    let bigDatePlaceType = JSON.parse(JSON.stringify(Dict.map.bigDatePlaceType));
    let bigDatePlace = bigDatePlaceType.filter(v => v.value !== '119115').map(v => {
        if(v.label.indexOf('经常出现') === -1) {
          v.label = '经常出现' + v.label;
        }
        return v
    });
    const list = [...Dict.map.personnelAttr, ...Dict.map.gait, ...Dict.map.height, ...Dict.map.fatAndThin,...Dict.map.identity,...Dict.map.aidBehavior, ...bigDatePlace];
    return (
      <div className="search-image-input">
        <div className="search-header" ref={this.headerRef}>
          <div className="img-label">
            {pictureUrl && (
              <div className="img-box">
                <img src={pictureUrl} className="header-img" alt="" />
                <IconFont
                  type={'icon-YesorNo_No_Main'}
                  className="header-img-close"
                  theme="outlined"
                  onClick={this.deleteImgUrl}
                />
              </div>
            )}
            {recommends.map(v => {
              return (
                <div
                  className={`label-box ${
                    v.type === '1' ? 'label-box-person' : ''
                  }`}>
                  {v.description}
                  <IconFont
                    type={'icon-YesorNo_No_Main'}
                    className="header-label-close"
                    theme="outlined"
                    onClick={() => this.deleteLabel(v)}
                  />
                </div>
              );
            })}
          </div>
          <Input
            className="upload-header"
            value={keywords}
            style={{
              paddingLeft: `${recommends.length * 70 +
                (pictureUrl ? 40 : 12)}px`
            }}
            placeholder={
              recommends.length > 0
                ? ''
                : '请输入人员相关属性进行查询，如姓名、地址、虚拟身份号、身份证号、各类标签'
            }
            onChange={this.handleInputChange}
            onPressEnter={this.search}
          />
          {popVisible && (
            <div className="search-image-input-pop">
              {popoverType === 0 ? (
                <div className="content">
                  {dropLoading ? (
                    <div className="loading-content">
                      <Spin indicator={antIcon} />
                      <div className="spin-text">正在加载图片</div>
                    </div>
                  ) : (
                    <React.Fragment>
                      <div
                        className="content-image-box"
                        onDrop={this.onDrop}
                        onDragOver={this.onDragOver}>
                        <IconFont type={'icon-Img_Dark'} theme="outlined" />
                        <div className="box-text">拖拽图片到这里搜图</div>
                      </div>
                      <label
                        className="image-upload"
                        htmlFor={this.uploadRef.current}>
                        <IconFont
                          type={'icon-UpDown_Up_Dark'}
                          theme="outlined"
                        />
                        <Input
                          type="file"
                          ref={this.uploadRef}
                          accept="image/*"
                          onChange={this.fileInputChange}
                          style={{ visibility: 'hidden', position: 'fixed' }}
                        />
                        本地上传图片
                      </label>
                    </React.Fragment>
                  )}
                </div>
              ) : (
                <div className="search-content" ref={this.tipsContentRef}>
                  <div className="search-list">
                    {searchList.map(v => {
                      return (
                        <div
                          className="list"
                          onClick={() => this.lenveClick(v)}>
                          <IconFont
                            type={'icon-Search_Light'}
                            theme="outlined"
                          />
                          <HightLevel keyword={keywords} name={v.description} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="search-label">
                    <div className="label-header">试试标签快速查：</div>
                    <div className="label-content">
                      {list.map(v => {
                        return (
                          <span
                            className={`label ${
                              recommends.find(item => item.id === v.value)
                                ? 'chose-label'
                                : ''
                            } `}
                            onClick={() => this.labelClick(v)}>
                            {v.label}
                          </span>
                        );
                      })}
                    </div>
                    <div className="label-header">年龄段：</div>
                    <div className="label-content">
                      {[
                        { value: '100801', label: '小孩' },
                        { value: '100802', label: '青年' },
                        { value: '100803', label: '中年' },
                        { value: '100804', label: '老人' }
                      ].map(v => {
                        return (
                          <span
                            className={`label ${
                              recommends.find(item => item.id === v.value)
                                ? 'chose-label'
                                : ''
                            } `}
                            onClick={() => this.labelClick(v)}>
                            {v.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {!popVisible && (
            <span ref={this.iconRef}>
              <IconFont
                type={'icon-ImageSearch_Light'}
                theme="outlined"
                className="header-icon"
              />
            </span>
          )}
          <div className="search-button" onClick={this.search}>
            <IconFont
              type={popoverType === 0 ? 'icon-ImageSearch_Light' : 'icon-Search_Light'}
              theme="outlined"
            />
            搜 索
          </div>
        </div>
      </div>
    );
  }
}

export default SearchImageInput;
