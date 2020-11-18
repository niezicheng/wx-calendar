import { moment, lodash } from '../../utils/index';
const { cloneDeep, isObject } = lodash;

/**
 * 获取某年某月总共多少天
 * @param {Object: { year, month, day }} date 日期对象
 */
export function getDaysCount(date) {
  const { year, month } = date;
  return new Date(year, month, 0).getDate();
};

/**
 * 星期格式化
 * @param {Int} days 月份天数
 * @param {Int} week 月份最后一天星期
 */
export function formatWeek(days, week) {
  let result = week - (days % 7 - 1);
  let currentWeek = result < 0 ? 7 + result : result;
  return currentWeek;
};

/**
 * 获取当月 1 号为星期几
 * @param {Date} date 当前月最后一天
 */
export function getFirstDayWeek(date) {
  let days = date.getDate(); // 月份天数
  let week = date.getDay(); // 日期星期
  return formatWeek(days, week);
};

/**
 * 获取当月天数数据数组
 * @param {*} date 日期对象
 */
export function getCurrentDays(date) {
  const { year, month } = date;
  let currentDays = []
  const currentDaysCount = getDaysCount(date);
  if (currentDays.length <= 0) {
    for (let i = 1; i <= currentDaysCount; i++) {
      currentDays.push({
          type: 'current',
          year,
          month,
          day: i,
          class: ''
      });
    }
  }
  return currentDays
};

/**
 * 获取上月残余天数数据
 * @param {Object: { year, month, day }} date 日期对象
 */
export function getPreDays(date) {
  const { year, month } = date;
  //上月残余天数
  const firstDayWeek = getFirstDayWeek(new Date(year, month, 0));
  let preMonth = month - 1;
  //上月天数
  let preMonthDaysCount = getDaysCount({ year, month: preMonth });
  let preMonthDays = [];
  for (let i = 1; i <= firstDayWeek; i++) {
    //是否显示上月残余天数
    preMonthDays.unshift({
        type: 'pre',
        year,
        preMonth,
        day: preMonthDaysCount,
        class: ''
    })
    preMonthDaysCount--;
  }
  return preMonthDays;
};

/**
 * 获取下月残余天数数据
 * @param {Object: { year, month, day }} date 日期对象
 */
export function getNextDays(date) {
  const { year, month } = date;
  let nextMonth = month + 1;
  const firstDayWeek = getFirstDayWeek(new Date(year, month, 0));
  const currentDaysCount = getDaysCount(date);
  // 下月多余天数
  let nextMonthDaysCount = (35 - firstDayWeek - currentDaysCount) >= 0 ?
      (35 - firstDayWeek - currentDaysCount) :
      (42 - firstDayWeek - currentDaysCount);
  let nextMonthDays = []
  if (nextMonthDaysCount > 0) {
      for (let i = 1; i <= nextMonthDaysCount; i++) {
        nextMonthDays.push({
            type: 'next',
            year,
            nextMonth,
            day: i,
            class: ''
        });
      }
  }
  return nextMonthDays
};

/**
  * 将日期对象转化为对应格式的
  * @param {Object: {year, month, day} | String | Date} date
  * @param {String} formatType
  */
export function formateDateJoinStr(date, formatType) {
  let dateObj = date;
  // date 为{ year, month, day } 对象时
  if(isObject(date) && date.month) {
    dateObj = cloneDeep(date);
    dateObj.month -= 1;
  }
  return moment(dateObj).format(formatType);
};

/**
 * 将字符串日期转化为对应的 date 对象
 * @param {String | {start, end}} dateStr 可以为字符串也可以为 moment 对象
 */
export function formateStrToDate(dateStr, multiSelect = false) {
  let date = null;
  if(multiSelect) {
    const { start, end } = dateStr;
    date = {
      start: { year: moment(start).year(), month: moment(start).month() + 1, day: moment(start).date() },
      end: { year: moment(end).year(), month: moment(end).month() + 1, day: moment(end).date() }
    }
  } else {
    date = {
      year: moment(dateStr).year(),
      month: moment(dateStr).month() + 1,
      day: moment(dateStr).date(),
    }
  }
  return date;
};

/**
 * 比较返回正常顺序对象 startTime < endTime
 * @param {String} start 开始时间
 * @param {String} end 结束时间
 */
export function compareDate(startDate, endDate) {
  let date = { start: startDate, end: endDate }
  // 处理传入 { year, month, day } 对象 month 为12的情况
  if(startDate.month && endDate.month) {
    let cloneStart = cloneDeep(startDate);
    let cloneEnd = cloneDeep(endDate);
    cloneStart.month -= 1;
    cloneEnd.month -= 1;
    if(moment(cloneStart).isAfter(cloneEnd)) {
      date = { start: endDate, end: startDate }
    }
  } else {
    if(moment(startDate).isAfter(endDate)) {
      date = { start: endDate, end: startDate }
    }
  }
  return date;
}
