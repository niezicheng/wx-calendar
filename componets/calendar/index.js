// componets/calendar/index.js
import {
  getCurrentDays,
  getPreDays,
  getNextDays,
  formateDateJoinStr,
  formateStrToDate,
  compareDate,
} from './helper';
import { moment } from '../../utils/index';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current: {
      type: Object | String,
      value: null,
      observer: 'currentTypeChange'
    },
    /**
     * 是否为范围日期
     */
    multiSelect: {
      type: Boolean,
      value: false
    },
    /**
     * 最小日期
     */
    minDate: {
      type: String,
      value: '',
    },
    /**
     * 最大日期
     */
    maxDate: {
      type: String,
      value: '',
    },
    dateFormat: {
      type: String,
      value: 'YYYY/MM/DD'
    },
    /**
       * 周标题类型
       */
      weeksType: {
        type: String,
        value: 'cn',
        observer: 'weeksTypeChange'
      },
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekTitle: ['日', '一', '二', '三', '四', '五', '六'],
    monthType: 'M',
    yearType: 'y',
    add: 1,
    reduce: -1,
    changeTap: false, // 是否在选择结束日期
  },

  // 在组件在视图层布局完成后执行
  ready: function() {
    this.initDate();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化日期及其样式信息
    initDate() {
      const { multiSelect, dateFormat } = this.properties;
      const { currentDate } = this.data;
      const today = formateDateJoinStr(today, dateFormat);
      if(multiSelect) {
        const {start = today, end = today} = currentDate;
        const current = compareDate(start, end);
        this.getAllDays(formateStrToDate(current.start));
        this.multiSelectDate = {
          start: formateStrToDate(current.start),
          end: formateStrToDate(current.end),
        };
        this.setMultiSelectedDayClass( this.multiSelectDate);
      } else {
        const current = currentDate || today;
        this.getAllDays(formateStrToDate(current));
        this.selectDate = formateStrToDate(current);
        this.setSelectedDayClass(this.selectDate);
      }
    },

    // 将传递的 current 日期交由内部 data 管理, 便于内部改变数据及方法暴露
    currentTypeChange: function(newVal, oldVal) {
      const { dateFormat, multiSelect }  = this.properties;
      let currentDate = newVal;
      if(multiSelect) {
        currentDate = {
          start: newVal.start && formateDateJoinStr(newVal.start, dateFormat),
          end: newVal.end && formateDateJoinStr(newVal.end, dateFormat),
        }
      } else {
        currentDate = currentDate && formateDateJoinStr(newVal, dateFormat);
      }
      this.setData({
        currentDate,
      })
    },

    // 周标题类型
    weeksTypeChange: function(newVal, oldVal) {
      switch (newVal) {
        case 'en':
          this.setData({
              weeksType: 'en',
              weekTitle: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
          });
          break;
        case 'cn':
          this.setData({
              weeksType: 'cn',
              weekTitle: ['日', '一', '二', '三', '四', '五', '六']
          });
          break;
        case 'full-en':
          this.setData({
              weeksType: 'full-en',
              weekTitle: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          });
          break;
        default:
          this.setData({
              weeksType: 'en',
              weekTitle: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
          });
          break;
      }
    },

    //当月显示数据 包括上月 下月残余数据
    getAllDays(date) {
      let preDays = getPreDays(date);
      let currentDays = getCurrentDays(date);
      let nextDays = getNextDays(date);
      let allDays = [...preDays, ...currentDays, ...nextDays];
      this.setData({
        days: allDays
      });
    },

    // 年月份增减
    getMonthDays(e) {
      const { dateFormat, multiSelect } = this.properties;
      const { type, count } = e.currentTarget.dataset;
      if(multiSelect) {
        if(this.data.changeTap) {
          return;
        }
        const { currentDate: { start, end } } = this.data;
        const startMoment = moment(start).add(count, type);
        const endMoment = moment(end).add(count, type);
        const startDate = formateStrToDate(startMoment);
        this.getAllDays(startDate);
        this.setMultiSelectedDayClass(this.multiSelectDate);
        this.setData({
          currentDate: {
            start: startMoment.format(dateFormat),
            end: endMoment.format(dateFormat)
          }
        });
      } else {
        const { currentDate } = this.data;
        const date = moment(currentDate).add(count, type);
        const newDate = formateStrToDate(date);
        this.getAllDays(newDate);
        this.setSelectedDayClass(this.selectDate);
        this.setData({
          currentDate: date.format(dateFormat)
        });
      }
    },

    // 跳至今日
    jumpToToday() {
      const { multiSelect, dateFormat } = this.properties;
      const todayDateObj = formateStrToDate(new Date());
      const todayDateStr = formateDateJoinStr(new Date(), dateFormat);
      let currentDate = null;
      if(multiSelect) {
        currentDate = { start: todayDateStr, end: todayDateStr }
        this.getAllDays(formateStrToDate(currentDate.start));
        this.multiSelectDate = {start: todayDateObj, end: todayDateObj};
        this.setMultiSelectedDayClass(this.multiSelectDate)
      } else {
        currentDate =  todayDateStr;
        this.getAllDays(formateStrToDate(currentDate));
        this.selectDate = todayDateObj;
        this.setSelectedDayClass(this.selectDate);
      }
      this.setData({
        currentDate,
      })
      const detail = {
        value: currentDate,
      };
      this.triggerEvent('today', detail);
    },

    // 单选日期
    selectDay(e) {
      const { dateFormat } = this.properties;
      let { date } = e.currentTarget.dataset;
      this.selectDate = date;
      this.setSelectedDayClass(this.selectDate);
      let detail = {
        value: formateDateJoinStr(date, dateFormat),
      }
      // 将选中日期字符串传递给自定义事件
      this.triggerEvent('select', detail);
    },

    // 日期范围选择
    multiSelectDay(e) {
      const { dateFormat } = this.properties;
      const { changeTap } = this.data;
      const { date } = e.currentTarget.dataset;
      const strDate = formateDateJoinStr(date, dateFormat);
      let currentDate = {};
      // 结束日期
      if(changeTap && date) {
        const { start } = this.data.currentDate;
        currentDate = compareDate(start, strDate);
        this.multiSelectDate = compareDate(this.multiSelectDate.start, date);
      } else {
        // 开始日期
        currentDate = { start: strDate, end: '' };
        this.multiSelectDate = { start: date, end: null };
      }
      this.setMultiSelectedDayClass(this.multiSelectDate);
      this.setData({
        currentDate,
        changeTap: !this.data.changeTap,
      })
      let detail = { value: currentDate };
       // 将选中日期字符串传递给自定义事件
      this.triggerEvent('select', detail);
    },

    // 设置选中日期的样式 默认选中当前日期
    setSelectedDayClass(selectDate) {
      const { year, month, day } = selectDate;
      const { days } = this.data;
      days.map(date => {
        if (date.year === year && date.month === month && date.day === day) {
          date.class = 'thisDayIsSelect'
        } else {
          // 其他月份当前日期 day 样式
          if (date.day === day) {
            date.class = 'thisDayNoSelect'
          } else {
            date.class = ''
          }
        }
      });
      this.setData({
        days: this.data.days
      });
    },

    // 日期范围选择样式
    setMultiSelectedDayClass(selectDate) {
      const { start, end } = selectDate;
      // 将 date 日期对象转化为 str 在进行比较，避免在12月份无法比较
      if(moment(formateDateJoinStr(start)).isSame(formateDateJoinStr(end))) {
        this.setSelectedDayClass(start);
        return;
      }
      const { days } = this.data;
      days.map(day => {
        if(day.year === start.year && day.month === start.month) {
          day.class = '';
          if(day.day === start.day) {
            day.class = 'startSelectDay'
          }
          if(end) {
            if(day.day === end.day) {
              day.class = 'endSelectDay'
            }
            if(start.day < day.day && day.day < end.day) {
              day.class = 'middleSelectDays'
            }
          }
        } else {
          day.class = '';
          if(day.day === start.day) {
            day.class = 'startNoSelectDay'
          }
          if(end) {
            if(day.day === end.day) {
              day.class = 'endNoSelectDay'
            }
            if(start.day < day.day && day.day < end.day) {
              day.class = 'middleNoSelectDays'
            }
          }
        }
      });
      this.setData({
        days: this.data.days
      });
    },
  }
})
