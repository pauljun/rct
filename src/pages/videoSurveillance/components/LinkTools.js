import React, { Component } from 'react';
import { Tooltip, message } from 'antd';
import '../style/link-tools.less';

const IconFont = Loader.loadBaseComponent('IconFont');

const defaultLinks = [
  {
    icon: 'icon-Camera_Dark',
    title: '视频监控',
    type: 'video',
    moduleName: 'videoSurveillance',
  },
  {
    icon: 'icon-Imge_Main',
    title: '视频摘要',
    type: 'abstract',
    moduleName: 'videoAbstract',
  },
  {
    icon: 'icon-Face_Dark',
    title: '人脸',
    type: 'face',
    moduleName: 'faceLibrary',
  },
  {
    icon: 'icon-Body_Dark',
    title: '人体',
    type: 'body',
    moduleName: 'bodyLibrary',
  },
  {
    icon: 'icon-Car_Dark',
    title: '机动车',
    type: 'car',
    moduleName: '',
  },
  // {
  //   icon: 'icon-NonMotor_Dark',
  //   title: '非机动车',
  //   type: 'nonMotor',
  //   moduleName: '',
  // }
]
class LinkTools extends Component {

  prefix=Math.random()

  constructor(props){
    super(props);
    const { excludeLink, links=defaultLinks } = props;
    this.links = links;
    if(excludeLink) {
      let newLinks = [...defaultLinks];
      excludeLink.map(v => {
        newLinks = newLinks.filter(x => x.type !== v);
      })
      this.links = newLinks;
    }
  }

  goPage = (e, type, moduleName) => {
    Utils.stopPropagation(e);
    Utils.exitFullscreen();
    const id = Utils.uuid();
    let pageData = { id };
    const { getSelectList, goPage } = this.props;
    const selectList = getSelectList();
    let shouldGo = true, linkData; 
    switch(type) {
      case 'video':
      const selectIds = selectList.map(v => v.id);
      if (selectIds.length > 16) {
        message.warn('最多同时查看16个设备视频！');
        shouldGo = false;
      } else {
        linkData = {data: { selectIds }}
        pageData = { pid: id, mapMode: false }
      }
      break;
      case 'abstract': 
        linkData = {data: { devices: selectList }}
        pageData = { pid: id}
      break;
      case 'face': 
        linkData = {searchData: { cameraIds: selectList }}
      break;
      case 'body': 
        linkData = {searchData: { cameraIds: selectList }}
      break;
      default: 
        shouldGo = false;
        message.warn('待完善');
      break;
    }
    
    if(shouldGo) {
      LM_DB.add('parameter', {
        id,
        ...linkData
      }).then(() => {
        goPage({
          moduleName,
          data: pageData
        })
      })
    }
  }

  render() {
    // theme: outlined, filled, default
    const { 
      className='', size='', placement='top', theme='outlined', iconOptions={} 
    } = this.props;
    return (
      <div className={`s-link-tools ${className} link-tools-${this.prefix}`}>
        { this.links.map(v => (
          <Tooltip
            key={v.icon}
            title={v.title}
            placement={v.placement || placement}
            getPopupContainer={() => 
              document.getElementsByClassName(`link-tools-${this.prefix}`)[0]
            }
          >
            <IconFont 
              className={`
                link-btn
                ${theme}
                ${size === 'small' ? 'link-btn-small' : ''} 
                ${size === 'large' ? 'link-btn-large' : ''} 
                ${v.className||''}
              `}
              type={v.icon}
              onClick={(e) => this.goPage(e, v.type, v.moduleName)}
              {...iconOptions}
            />
          </Tooltip>
        ))}
      </div>
    )
  }
}
export default LinkTools;