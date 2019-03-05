import { tagAToDownload } from './download';
import { isCrosUrl } from './query';
/**
 * 下载网络图片
 *  @param imgUrl: 下载地址
 *  @param title: 下载标题
 */
export function downloadLocalImage(imgUrl, title) {
  urlToBase64({ imgUrl, imgQuality: 0.8 }, base64Url => {
    let path = URL.createObjectURL(base64ToBlob(base64Url))
    tagAToDownload({
      url: path,
      title
    });
    setTimeout(() => {
      URL.revokeObjectURL(path)
    },10000)
  });
}

/**
 * 图片地址转base64
 */
export function urlToBase64({ imgUrl, imgQuality = 1, width, height }, callback) {
  let img = document.createElement('img');
  // crossOrigin属性必须在src之前，否则会报错！！
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = imgUrl;
  img.onload = () => {
    width = width ? width : img.width;
    height = height ? height : img.height;
    const base64Url = drawImage({
      target: img,
      width,
      height,
      imgQuality
    });
    return callback && callback(base64Url);
  };
}

/**
 * dom绘图获取base64Url
 * @param {element} target: 绘图目标： video、img、canvas
 * @param {Number} width: 图片宽度
 * @param {Number} height: 图片高度
 * @param {string} imgType: 图片类型
 * @param {Number} imgQuality: 图片质量 0-1
 */
export function drawImage({ target, width, height, imgType = 'image/png', imgQuality = 1 }) {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(target, 0, 0);
  const base64Url = canvas.toDataURL(imgType, imgQuality);
  return base64Url;
}

export function addWaterMark(canvas, waterMark) {
  const { text, font, color, shadowColor, shadowX, shadowY, shadowBlur, degree, width, height } = waterMark;
  //水印画布
  let repeatCanvas = document.createElement('canvas');
  let rcw = (repeatCanvas.width = width);
  let rch = (repeatCanvas.height = height);
  let rctx = repeatCanvas.getContext('2d');
  //设置文本大小和字体
  rctx.font = font;
  //设置文本的颜色和透明度
  rctx.fillStyle = color;
  //设置文本阴影的颜色和透明度
  rctx.shadowColor = shadowColor;
  //设置文本阴影位置（相对文本）
  rctx.shadowOffsetX = shadowX;
  rctx.shadowOffsetY = shadowY;
  //设置文本阴影模糊度
  rctx.shadowBlur = shadowBlur;
  //将文本设为居中对齐
  rctx.textAlign = 'center';
  rctx.textBaseline = 'middle';
  //以文本的中心为旋转点
  rctx.translate(rcw / 2, rch / 2);
  rctx.rotate((degree * Math.PI) / 180);
  rctx.translate(-rcw / 2, -rch / 2);
  //讲文本绘制在画布中心
  text.map((item, index) => {
    rctx.fillText(item, rcw / 2, rch / 2 + parseFloat(font) * index);
  });

  let ctx = canvas.getContext('2d');
  //平铺水印画布
  ctx.fillStyle = ctx.createPattern(repeatCanvas, 'repeat');
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * file文件转base64
 * @param {file} input-file
 * @param {function} callback
 */
export function fileToBase64(file, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
}
/**
 * 图片base64转换为blob
 * @param {string} base64Url
 */
export function base64ToBlob(base64Url) {
  var bytes = window.atob(base64Url.split(',')[1]); // 去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}

export function loadImage(imgUrl, noAjax) {
  return new Promise((resolve, reject) => {
    if (noAjax) {
      let img = document.createElement('img');
      !isCrosUrl(imgUrl) && img.setAttribute('crossOrigin', 'Anonymous');
      img.setAttribute('src', imgUrl);
      img.addEventListener(
        'load',
        () => {
          resolve(img);
        },
        false
      );
      img.addEventListener(
        'error',
        e => {
          reject(e);
        },
        false
      );
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('get', imgUrl, true);
      xhr.responseType = 'blob';
      xhr.addEventListener('load', () => {
        if (this.status == 200) {
          let blob = this.response;
          let oFileReader = new FileReader();
          oFileReader.onloadend = e => {
            let image = new Image();
            image.src = e.target.result;
            resolve(image);
          };
          oFileReader.readAsDataURL(blob);
        }
      });
      xhr.addEventListener('error', function(err) {
        reject(err);
      });
      xhr.send();
    }
  });
}
