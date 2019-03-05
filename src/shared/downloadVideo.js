import { message } from 'antd';

export async function downloadVideo({ startTime, endTime, fileData }) {
  startTime = startTime * 1;
  endTime = endTime * 1;
  const { cid, deviceName } = fileData;

  const timeList = videoTimeCut({ startTime, endTime });
  
  // const snapshots = await Service.lingyang.getDeviceSnapshots({
  //   cameraId: cid,
  //   begin: startTime,
  //   end: endTime
  // });
  // const snapshotsList = Service.lingyang.handleSnapshots(snapshots, timeList);

  // TODO 获取设备截图
  const snapshot = 'http://192.168.101.14:8082/image/v1/753373363/objects/5c6ba93e2ce790b31010b0b0/1550565425994.jpg?client_token=753373363_3356491776_1581996538_3a0141fb8e63cad9f7fddcd9ad860332&crop=x_1068,y_654,w_200,h_252&watermark=m_E8BF90E890A5E4B8ADE5BF83E7AEA1E79086E59198,c_FFFFFF,s_150,t_150,r_45';
  fileData.snapshot = snapshot;
  const videoList = timeList.map(v => handleMediaLibObj(v, fileData));

  if (videoList.length === 1) {
    Service.video.queryTSDownLoadAddress({
      cid,
      fileName: deviceName,
      beginTime: startTime,
      endTime
    });
  }

  window.BaseStore.mediaLib.addVideos(videoList).then(() => {
    let downloadTip =
      videoList.length > 1
        ? '视频文件较长，已分段加入我的视图，可前往下载'
        : '视频文件已加入我的视图';
    message.success(downloadTip);
  });
}

// 处理视图库参数 startTime： 毫秒
function handleMediaLibObj(snapItem, fileData) {
  const localVideoObj = {
    cameraId: fileData.cid,
    cameraName: fileData.deviceName,
    cameraType: fileData.deviceType,
    ptzType: fileData.ptzType,
    imgUrl: fileData.snapshot || '',
    startTime: snapItem.startTime * 1000,
    endTime: snapItem.endTime * 1000,
    type: 'video'
  };
  return localVideoObj;
}

function videoTimeCut({ startTime, endTime, cutStep = 1800 }){
  let timeList = [];
  // 以30分钟(1800s)切一个片段处理
  let begin = startTime;
  while (endTime - begin >= cutStep) {
    let end = begin + cutStep;
    timeList.push({
      startTime: begin,
      endTime: end
    });
    begin = end;
  }
  if (endTime > begin) {
    timeList.push({
      startTime: begin,
      endTime: endTime
    });
  }
  return timeList;
}
