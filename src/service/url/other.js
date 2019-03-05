import config from '../config';
export default {
  otherModule: {
    code: 107400,
    text: '资源下载'
  },
  downloadImg: {
    code: 107401,
    parent:107400 ,
    text: '下载图片'
  },
  downloadVideo: {
    code: 107402,
    parent:107400 ,
    text: '下载视频'
  },
  upload: {
    value: `${config.api}upload`,
    label: '上传图片'
  },
  deleteMediaLibImg: {
    text: '删除图片',
    code: 107303,
    parent: 107300
  },
  deleteMediaLibVideo: {
    text: '删除视频',
    code: 107304,
    parent: 107300
  },
  addMediaLibImg: {
    text: '添加图片',
    code: 107301,
    parent: 107300
  },
  addMediaLibVideo: {
    text: '添加视频',
    code: 107302,
    parent: 107300
  },
};
