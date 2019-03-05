import React from 'react';
import ReactDOM from 'react-dom';

export function createIcon(image, w = 20, h = 20) {
  return new AMap.Icon({
    size: new AMap.Size(w, h),
    image
  });
}
/**
 * Marker模拟infoWindow
 * @param {*} Content
 * @param {*} position
 */

export function createContentMarker(
  Content,
  position,
  offset = [0, 0],
  id,
  className = ''
) {
  let Div = document.createElement('div');
  Div.className = className;
  Div.id = id;
  ReactDOM.render(Content, Div);
  let marker = new AMap.Marker({
    content: Div,
    position: position,
    offset: new AMap.Pixel(...offset),
    animation: 'AMAP_ANIMATION_NONE',
    zIndex: 102,
    bubble: false
  });
  return marker;
}

/**
 * 创建marker对象
 */
export function createMarker(point, options = {}, icon, active = false, color,isCenter=false) {
  const defaultOffset = options.offset
                        ? new AMap.Pixel(...options.offset)
                        : new AMap.Pixel(-15, -15);
  const defaultContent = Shared.getAMapCameraIcon(point, active, color, isCenter);
  let item = {
    position: point.position || [point.longitude, point.latitude],
    offset: defaultOffset,
    animation: options.animation ? options.animation : 'AMAP_ANIMATION_NONE',
    draggable: options.draggable || false,
    raiseOnDrag: true,
    bubble: false,
    topWhenClick: true
  };
  if (icon) {
    item.icon = createIcon(icon, options.w, options.h);
  } else {
    item.content = defaultContent;
  }
  let marker = new AMap.Marker(item);
  
  marker.setExtData({
    id: point.id,
    position: [point.longitude, point.latitude],
    name: point.deviceName,
    type: point.deviceType,
    _deviceInfo: point,
    status: point.deviceStatus
  });

  marker.on('mouseover', event => {
    marker.setLabel({ content: point.deviceName || point.cameraName });
    marker.setzIndex(101);
    options.mouseover && options.mouseover(point, event);
  });

  marker.on('mouseout', event => {
    marker.setLabel({ content: '' });
    marker.setzIndex(100);
    options.mouseout && options.mouseout(point, event);
  });

  if (options.click) {
    marker.on('click', event => {
      options.click(point, event);
    });
  }
  if (options.dblclick) {
    marker.on('dblclick', event => {
      options.dblclick(point, event);
    });
  }
  if (options.dragend) {
    marker.on('dragend', event => {
      options.dragend(point, event, [event.lnglat.lng, event.lnglat.lat]);
    });
  }
  return marker;
}

/**
 * 创建marker对象
 */
export function createHoverMarker(point, options = {}, icon, active = false, color,isCenter=false) {
  const defaultOffset = options.offset
                        ? new AMap.Pixel(...options.offset)
                        : new AMap.Pixel(-15, -15);
  const defaultContent = Shared.getAMapCameraIcon(point, active, color, isCenter);
  let item = {
    position: point.position || [point.longitude, point.latitude],
    offset: defaultOffset,
    animation: options.animation ? options.animation : 'AMAP_ANIMATION_NONE',
    draggable: options.draggable || false,
    raiseOnDrag: true,
    bubble: false,
    topWhenClick: true
  };

  item.content = defaultContent;
  let marker = new AMap.Marker(item);
  
  marker.setExtData({
    id: point.id,
    position: [point.longitude, point.latitude],
    name: point.deviceName,
    type: point.deviceType,
    _deviceInfo: point,
    status: point.deviceStatus
  });

  marker.on('mouseover', event => {
    const currentPoints = options.getCurrentPoints
                          ? options.getCurrentPoints()
                          : null
    const devices = getClusterPoint(point, 10, currentPoints);
    let Content, offset, wrapperStyle={};
    if(devices.length > 1) {
      wrapperStyle = {
        width: 250, 
        height: 24*devices.length + 8 + 12 + 30
      }
      offset = new AMap.Pixel(-wrapperStyle.width/2, -wrapperStyle.height + 15);
      Content = (
        <div className='map-cluster-list-wrapper' style={wrapperStyle}>
          <div className='cluster-list-tooltip ant-tooltip ant-tooltip-placement-top'>
            <div className='ant-tooltip-content'>
              <div className='ant-tooltip-arrow'></div>
              <div className="ant-tooltip-inner">
                <ul className='cluster-list-container'>
                  {devices.map(v => {
                    return (
                      <li className='list-item'>
                        <div className='item-name-content'
                          onClick={e => options.click && options.click(v, e)}
                        >
                          <div 
                            className='item-icon' 
                            dangerouslySetInnerHTML={{__html: Shared.getAMapCameraIcon(v, active, color, isCenter)}} 
                          />
                          <div className='item-name' title={v.deviceName}>{v.deviceName}</div>
                        </div>
                        { React.cloneElement(options.hoverContent, {
                          placement: 'top',
                          size: 'small',
                          theme: 'default'
                        })}
                      </li>
                  )})}
                </ul>
              </div>
            </div>
          </div>
          <div 
            className='map-icon-content-container' 
            dangerouslySetInnerHTML={{__html: defaultContent}} 
          />
        </div>
      )
    } else {
      wrapperStyle = {
        width: 200, 
        height: 70
      }
      offset = new AMap.Pixel(-wrapperStyle.width/2, -15);
      Content = (
        <div 
          className='map-link-content-wrapper'
          style={wrapperStyle}
        >
          <div className='title-tooltip ant-tooltip ant-tooltip-placement-top'>
            <div className='ant-tooltip-content'>
              <div className='ant-tooltip-arrow'></div>
              <div className="ant-tooltip-inner">{point.deviceName || point.cameraName}</div>
            </div>
          </div>
          <div 
            className='map-icon-content-container' 
            onClick={e => options.click && options.click(point, e)} 
            dangerouslySetInnerHTML={{__html: defaultContent}} 
          />
          {options.hoverContent}
        </div>
      )
    }
    const contentWrapper = document.createElement('div');
    ReactDOM.render(Content, contentWrapper);

    marker.setContent(contentWrapper);
    marker.setOffset(offset);
    marker.setzIndex(101);
    options.mouseover && options.mouseover(point, event);
  });

  marker.on('mouseout', event => {
    marker.setContent(defaultContent);
    marker.setOffset(defaultOffset);
    marker.setzIndex(100);
    options.mouseout && options.mouseout(point, event);
  });
  
  return marker;
}


export function createIndexMaker({
  point,
  index,
  options = {},
  active = false,
  color,
  activeColor
}) {
  let item = {
    position: point.position || [point.longitude, point.latitude],
    offset: options.offset
      ? new AMap.Pixel(...options.offset)
      : new AMap.Pixel(-12, -32),
    animation: options.animation ? options.animation : 'AMAP_ANIMATION_NONE',
    draggable: options.draggable || false,
    raiseOnDrag: true,
    bubble: false,
    topWhenClick: true,
    content: `<div class="map-marker-index">${index}</div>`
  };
  let marker = new AMap.Marker(item);
  marker.setExtData({
    id: point.id,
    position: [point.longitude, point.latitude],
    name: point.deviceName,
    pointInfo: point
  });
  marker.on('mouseover', event => {
    marker.setzIndex(101);
    marker.setLabel({ content: point.deviceName || point.cameraName });
    options.mouseover && options.mouseover(point, event);
  });

  marker.on('mouseout', event => {
    marker.setLabel({ content: '' });
    marker.setzIndex(100);
    options.mouseout && options.mouseout(point, event);
  });

  if (options.click) {
    marker.on('click', event => {
      options.click(point, event);
    });
  }
  if (options.dblclick) {
    marker.on('dblclick', event => {
      options.dblclick(point, event);
    });
  }
  if (options.dragend) {
    marker.on('dragend', event => {
      options.dragend(point, event, [event.lnglat.lng, event.lnglat.lat]);
    });
  }
  return marker;
}

// 获取某一点位附近半径为 radius 的圆形区域内的点位
function getClusterPoint(point, radius=10, allPoints) {
  allPoints = allPoints || BaseStore.device.cameraArray;
  const circle = new AMap.Circle({ 
    center: [point.longitude, point.latitude], 
    radius,
  });
  const cluserPoints = allPoints.filter(v => {
    return v.longitude && v.latitude && circle.contains([v.longitude, v.latitude]);
  });
  return cluserPoints;
}
