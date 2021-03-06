const app = getApp()
const multiSelect = true;

Page({
  data: {
    multiSelect,
    current: multiSelect ? {start: '2020/11/10', end: '2020/11/10'} : '2020/11/10',
    weeksType: 'cn',
    minDate: "",
    maxDate: "",
    dateFormat: "YYYY/MM/DD",
  },

  // 日期选择函数
  select(e) {
    console.log('select', e);
    const { value } = e.detail;
    this.setData({
      current: value,
    });
  },

  // 今天
  today(e) {
    console.log('today', e);
  },

  onLoad: function () {
    console.log('代码片段是一种迷你、可分享的小程序或小游戏项目，可用于分享小程序和小游戏的开发经验、展示组件和 API 的使用、复现开发问题和 Bug 等。可点击以下链接查看代码片段的详细文档：')
    console.log('https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html')
  },
})
