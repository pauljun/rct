export function getPosition(obj) {
  //获取某元素以浏览器左上角为原点的坐标
  var t = obj.offsetTop; //获取该元素对应父容器的上边距
  var l = obj.offsetLeft; //对应父容器的上边距
  //判断是否有父容器，如果存在则累加其边距
  while ((obj = obj.offsetParent)) {
    //等效 obj = obj.offsetParent;while (obj != undefined)
    t += obj.offsetTop; //叠加父容器的上边距
    l += obj.offsetLeft; //叠加父容器的左边距
  }
  return { left: l, top: t };
}

/**
 * 阻止冒泡的兼容
 * @param {*} e
 */
export function stopPropagation(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
}

/**
 * 飞入动画
 * @param {*} start:{clientX, clientY} 鼠标点击的位置
 * @param {*} url 图片src
 * @param {*} speed 动画速度
 * @param {*} target 目标dom
 * @param {*} posFix:{top:0, left:0 } 目标dom位置修正
 */
export function animateFly({
  start,
  url,
  speed = 1000,
  target,
  posFix = { top: 0, left: 0 }
}) {
  target = target ? target : document.querySelector('.media-library-btn');
  const targetPosition = getPosition(target);
  const oImg = document.createElement('img');
  oImg.src = url;
  oImg.style.position = 'fixed';
  oImg.style.transition = `all ${speed / 1000}s ease`;
  oImg.style.zIndex = 999999;
  document.body.appendChild(oImg);
  // 滚动大小
  const scrollLeft =
    document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop || 0;
  const left = start.clientX + scrollLeft + 'px';
  const top = start.clientY + scrollTop + 'px';
  oImg.style.top = top;
  oImg.style.left = left;
  oImg.style.width = '160px';
  oImg.style.height = '90px';
  setTimeout(() => {
    oImg.style.top = targetPosition.top + posFix.top + 'px';
    oImg.style.left = targetPosition.left + posFix.left + 'px';
    oImg.style.opacity = 0.2;
    oImg.style.width = '16px';
    oImg.style.height = '16px';
  }, 100);
  setTimeout(() => {
    document.body.removeChild(oImg);
  }, speed + 500);
}
