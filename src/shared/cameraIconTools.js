import { getCameraTypeIcon } from './mapIcon';


const {cameraOrientation} = Dict.map;

export function getAMapCameraIcon(point, active, bgIconColor, isCenter) {
  let { url, color, bgColor,icon } = getCameraTypeIcon(
    point.deviceType,
    point.deviceStatus
  );
  let score = 0;
  if (
    point.extJson &&
    point.extJson.extMap &&
    point.extJson.extMap.cameraOrientation
  ) {
    let result = cameraOrientation&&cameraOrientation.filter(
      v => v.value === point.extJson.extMap.cameraOrientation.toString()
      );
    if (result&&result.length) {
      score = result[0].score;
    }
  } else {
    color = 'transparent';
  }
  let Content = `<div class='map-icon-content'>
  <div class='bd' style='background-image: url(${url});background-color:${
    active ? '#ffaa00' : bgIconColor || bgColor};background-size:16px'></div>
    <div class='circle' style='border-color: ${color} transparent transparent transparent; transform: rotate(${score}deg)'></div>
    </div>`;
  if (isCenter){
    const status = point.deviceStatus * 1 === 1 ? 'onLine':'outLine';
    Content=`<div class='map-icon-content isCenter'>
      <div class = 'bd ${status}'><img src='${url}'></div>
      <div class='circle' style='border-color: ${color} transparent transparent transparent; transform: rotate(${score}deg)'></div>
      </div>`
  }
  return Content;
}

export function getMapIndexContent({
  index,
  color = '#17bc84',
  active,
  activeColor = '#ffaa00'
}) {
  let Content = `<div class='map-icon-content map-text-content'>
    <div class='bd' style='background-color:${
      active ? activeColor : color
    };background-size:16px'>${index}</div>
  </div>`;
  return Content;
}
