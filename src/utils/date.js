import moment from 'moment'

export const splitNum = (data = 0) => {
  return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getDay = day => {
  var today = new Date();
  var targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetdayMilliseconds); //注意，这行是关键代码
  // var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  // return tYear + "-" + tMonth + "-" + tDate;
  return tMonth + "-" + tDate;
};
export const getDayYMD = day => {
  var today = new Date();
  var targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetdayMilliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear + "-" + tMonth + "-" + tDate;
};
export const get24H = hours => {
  var today = new Date();
  var targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * hours;
  today.setTime(targetdayMilliseconds); //注意，这行是关键代码
  // var tYear = today.getFullYear();
  // var tMonth = today.getMonth();
  // var tDate = today.getDate();
  var tHours = today.getHours();
  tHours = doHandleMonth(tHours);
  // tMonth = doHandleMonth(tMonth + 1);
  // tDate = doHandleMonth(tDate);
  // return tYear + "-" + tMonth + "-" + tDate;
  return tHours + ":00";
};

export const doHandleMonth = month => {
  var m = month;
  if (month.toString().length === 1) {
    m = "0" + month;
  }
  return m;
};

/**
 * @desc 根据值获取开始时间和结束时间
 * @param {Number} value 
 */
export const getTimerArea = value => {
  let endTime = new Date()*1;
  let startTime = endTime;
  if(value === 2){ // 自定义时间
    startTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
  }else if(value === 3){ // 3天
    startTime = new Date(moment().subtract(3,'d')).getTime()
  }else {
    startTime = endTime - value * 24 * 60 * 1000 * 60
  }
  return { startTime, endTime }
}

/**
 * @desc 时间戳格式化
 */
export const formatTimeStamp = (value, format = Shared.format.dataTime) => {
  return value ? moment(parseInt(value, 10)).format(format) : null
}