<template>
  <a-card :bordered="false">
    <div class="wrap">
      <div class="search">
        <div class="time time1" :class="{active: num === 7}" @click="timeClick(7)">近7天</div>
        <div class="time time2" :class="{active: num === 31}" @click="timeClick(31)">近1月</div>
        <div class="time time3">
          <a-range-picker
            v-model="times"
            :format="format"
            :disabledDate="disabledDate"
            @change="change"
            @openChange="openChange"
            @calendarChange="calendarChange"
          />
        </div>
      </div>
      <div class="content content1">
        <div class="part part1">
          <a-spin :spinning="confirmLoading1">
            <div class="title">工作量统计</div>
            <div class="bottom">
              <div class="list">
                <div class="item item1">
                  <img src="@/assets/qbc/index/1.png" />
                  <div class="row">
                    <span class="num">{{ model1.followNums || 0 }}<span class="unit">人</span></span>
                  </div>
                  <div class="row">
                    <span class="desc">随访人次</span>
                  </div>
                </div>
                <div class="item item2">
                  <img src="@/assets/qbc/index/2.png" />
                  <div class="row">
                    <span class="num">{{ model1.telFollowNums || 0 }}<span class="unit">人</span></span>
                  </div>
                  <div class="row">
                    <span class="desc">电话随访</span>
                  </div>
                </div>
                <div class="item item3">
                  <img src="@/assets/qbc/index/3.png" />
                  <div class="row">
                    <span class="num">{{ model1.wxFollowNums || 0 }}<span class="unit">人</span></span>
                  </div>
                  <div class="row">
                    <span class="desc">微信随访</span>
                  </div>
                </div>
                <div class="item item4">
                  <img src="@/assets/qbc/index/4.png" />
                  <div class="row">
                    <span class="num">{{ model1.smsFollowNums || 0 }}<span class="unit">人</span></span>
                  </div>
                  <div class="row">
                    <span class="desc">短信随访</span>
                  </div>
                </div>
              </div>
              <div class="list">
                <div class="item item5">
                  <img src="@/assets/qbc/index/5.png" />
                  <div class="row">
                    <span class="num">{{ model1.questNums || 0 }}<span class="unit">人</span></span>
                  </div>
                  <div class="row">
                    <span class="desc">问卷推送</span>
                  </div>
                </div>
                <div class="item item6">
                  <img src="@/assets/qbc/index/6.png" />
                  <div class="row">
                    <span class="num">{{ model1.articleNums || 0 }}<span class="unit">人</span></span>
                  </div>
                  <div class="row">
                    <span class="desc">健康文章推送</span>
                  </div>
                </div>
                <div class="item item7">
                  <img src="@/assets/qbc/index/7.png" />
                  <div class="row">
                    <span class="num">{{ model1.remindNums || 0 }}<span class="unit">人</span></span>
                  </div>
                  <div class="row">
                    <span class="desc">消息提醒</span>
                  </div>
                </div>
                <div class="item item8">
                  <img src="@/assets/qbc/index/8.png" />
                  <div class="row">
                    <span class="num">{{ model1.bindNums || 0 }}<span class="unit">人</span></span>
                  </div>
                  <div class="row">
                    <span class="desc">手机绑定</span>
                  </div>
                </div>
              </div>
            </div>
          </a-spin>
        </div>
        <div class="part part2">
          <div class="title">我的待办
            <a class="more" @click="gotoUrl()">查看更多>></a>
          </div>
          <div class="bottom">
            <div class="list">
              <div class="item item1">
                <span class="name">待我执行随访</span>
                <span class="num">{{ model2.taskNums || 0 }}人</span>
              </div>
              <div class="item item2">
                <span class="name">我完成的随访</span>
                <span class="num">{{ model2.finishedTaskNums || 0 }}人</span>
              </div>
              <div class="item item3">
                <span class="name">随访逾期任务</span>
                <span class="num">{{ model2.overdueNums || 0 }}人</span>
              </div>
              <div class="item item4">
                <span class="name">抽查不合格任务</span>
                <span class="num">{{ model2.checkFailedNums || 0 }}人</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content content2">
        <div class="part part1">
          <div class="title">Top10问卷回收分析</div>
          <div class="bottom">
            <table1 ref="table1"></table1>
          </div>
        </div>
        <div class="part part2">
          <div class="title">Top10名单随访率</div>
          <div class="bottom">
            <table2 ref="table2"></table2>
          </div>
        </div>
        <div class="part part3">
          <div class="title">Top10宣教文章阅读量</div>
          <div class="bottom">
            <table3 ref="table3"></table3>
          </div>
        </div>
      </div>
      <div class="content content3">
        <div class="part part1">
          <div class="title">质控情况</div>
          <div class="bottom">
            <div class="item item1">
              <span class="name">抽查任务数</span>
              <span class="num">{{ model67.total || 0 }}<span class="unit">人</span></span>
            </div>
            <div class="item item2">
              <span class="name">合格数</span>
              <span class="num">{{ model67.successNum || 0 }}<span class="unit">人</span></span>
            </div>
            <div class="item item3">
              <span class="name">不合格数</span>
              <span class="num">{{ model67.failNum || 0 }}<span class="unit">人</span></span>
            </div>
          </div>
        </div>
        <div class="part part2">
          <div class="title">方案制定</div>
          <div class="bottom">
            <div class="item">
              <span class="name">随访方案</span>
              <span class="num">{{ model67.planNum || 0 }}<span class="unit">套</span></span>
            </div>
            <div class="item">
              <span class="name">宣教文章</span>
              <span class="num">{{ model67.articleNum || 0 }}<span class="unit">篇</span></span>
            </div>
            <div class="item">
              <span class="name">问卷设计</span>
              <span class="num">{{ model67.questNum || 0 }}<span class="unit">篇</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { part1, part2, part67 } from '@/api/modular/system/qbc/index'
import table1 from './part1'
import table2 from './part2'
import table3 from './part3'
import moment from 'moment'

export default {
  components: {
    table1,
    table2,
    table3
  },
  data() {
    return {
      num: 7,
      times: [],
      model1: {},
      model2: {},
      model67: {},
      startDate: null,
      format: 'YYYY-MM-DD',
      confirmLoading1: false
    }
  },
  created() {},
  mounted() {
    this.timeClick(7)
  },
  methods: {
    search() {
      const params = {
        beginDate: this.times[0].format(this.format),
        endDate: this.times[1].format(this.format)
      }
      this.getPart1(params)
      this.getPart2(params)
      this.getPart3(params)
      this.getPart4(params)
      this.getPart5(params)
      this.getPart67(params)
    },
    getPart1(params) {
      this.confirmLoading1 = true
      part1(params).then(res => {
        if (res.code === 0){
          this.model1 = res.data || {}
        }else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.confirmLoading1 = false
      })
    },
    getPart2(params) {
      part2(params).then(res => {
        if (res.code === 0){
          this.model2 = res.data || {}
        }else {
          this.$message.error(res.message)
        }
      })
    },
    getPart3(params) {
      this.$refs.table1.search(params)
    },
    getPart4(params) {
      this.$refs.table2.search(params)
    },
    getPart5(params) {
      this.$refs.table3.search(params)
    },
    getPart67(params) {
      part67(params).then(res => {
        if (res.code === 0){
          this.model67 = res.data || {}
        }else {
          this.$message.error(res.message)
        }
      })
    },
    gotoUrl() {
      this.$router.push({ path: '/servicewise/phoneList' })
    },
    timeClick(num) {
      this.num = num
      this.times = [
        moment().subtract(num, 'days'),
        moment().subtract(1, 'days')
      ]
      this.search()
    },
    change(dates) {
      this.num = 'self'
      if (!dates || dates.length === 0) {
        this.$message.warning('请选择查询时间！')
        return
      }
      this.search()
    },
    openChange(status) {
      this.startDate = null
    },
    calendarChange(dates) {
      if (dates && dates.length>0){
        this.startDate = dates[0]
      }
    },
    disabledDate(current) {
      if (this.startDate){
        if (moment(this.startDate.format(this.format)).add(31, 'days') < current){
          return true
        }
        if (moment(this.startDate.format(this.format)).subtract(30, 'days') > current){
          return true
        }
      }
      return current && current>moment().subtract(1, 'days').endOf('day')
    }
  }
}
</script>

<style lang="less" scoped>
.wrap {
  margin-top: -10px;
  .search {
    overflow: hidden;
    .time {
      float: left;
      margin-right: 20px;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #4D4D4D;
      line-height: 28px;
      cursor: pointer;
      &.time3 {
        width: 208px;
        height: 28px;
        margin-right: 0px;
      }
      &.active {
        color: #1890ff;
        font-weight: 500;
      }
    }
  }
  .content {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .part {
      .title {
        height: 28px;
        padding-left: 10px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #4D4D4D;
        line-height: 28px;
        background: #FAFAFA;
        border-left: 4px solid #409EFF;
      }
      .bottom {
        margin-top: 10px;
        .item {
          .unit {
            font-size: 12px;
            font-family: PingFangSC-Medium;
            font-weight: 400;
          }
        }
      }
    }
  }
  .content1 {
    .part1 {
      width: 55.32%;
      .bottom {
        .list {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          .item {
            position: relative;
            flex-grow: 1;
            width: 145px;
            height: 68px;
            margin-right: 20px;
            padding: 15px 20px;
            border-radius: 2px;
            &:last-child {
              margin-right: 0px;
            }
            > img {
              position: absolute;
              top: 50%;
              left: 12px;
              width: 35px;
              height: 35px;
              transform: translateY(-50%);
            }
            .row {
              font-family: PingFang SC;
              color: #FFFFFF;
              text-align: right;
              .num {
                padding-left: 10px;
                font-size: 18px;
                font-weight: 500;
                line-height: 19px;
                border-bottom: 1px solid #FFFFFF;
                .unit {
                  line-height: 19px;
                }
              }
              .desc {
                font-size: 12px;
                font-weight: 400;
                line-height: 16px;
              }
            }
            &.item1 {
              background: #E6849C;
              box-shadow: 0px 2px 4px 0px rgba(230,132,156,0.35);
            }
            &.item2 {
              background: #F28C73;
              box-shadow: 0px 2px 4px 0px rgba(242,140,115,0.35);
            }
            &.item3 {
              background: #F4BA62;
              box-shadow: 0px 2px 4px 0px rgba(244,186,98,0.35);
            }
            &.item4 {
              background: #8FCB4A;
              box-shadow: 0px 2px 4px 0px rgba(143,203,74,0.35);
            }
            &.item5 {
              background: #9379ED;
              box-shadow: 0px 2px 4px 0px rgba(147,121,237,0.35);
            }
            &.item6 {
              background: #6C8DF1;
              box-shadow: 0px 2px 4px 0px rgba(108,141,241,0.35);
            }
            &.item7 {
              background: #5794E9;
              box-shadow: 0px 2px 4px 0px rgba(87,148,233,0.35);
            }
            &.item8 {
              background: #58CDAE;
              box-shadow: 0px 2px 4px 0px rgba(88,205,174,0.35);
            }
          }
        }
      }
    }
    .part2 {
      width: calc(100% - 55.32% - 30px);
      .title {
        .more {
          float: right;
          margin-right: 10px;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #1990EC;
          line-height: 28px;
        }
      }
      .bottom {
        margin-top: 8px !important;
        .list {
          .item {
            margin-bottom: 6px;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #4D4D4D;
            line-height: 16px;
            overflow: hidden;
            .name {
              float: left;
            }
            .num {
              float: right;
            }
            &:last-child {
              margin-bottom: 0px;
            }
            &.item1 {
              .num {
                color: #1990EC;
              }
            }
            &.item2 {
              .num {
                color: #4D4D4D;
              }
            }
            &.item3 {
              .num {
                color: #F21010;
              }
            }
            &.item4 {
              .num {
                color: #F21010;
              }
            }
          }
        }
      }
    }
  }
  .content2 {
    .part {
      .bottom {
        height: 277.22px;
        border: 1px solid #E4E4E4;
        /deep/ .ant-pagination {
          display: none;
        }
        /deep/ .ant-empty-normal {
          margin: 70px 0;
        }
        /deep/ .ant-table-placeholder {
          height: 250.6px;
          border-bottom: none;
          border-top: 1px solid #E4E4E4;
        }
        /deep/ .ant-table-tbody > tr {
          &:last-child {
            font-weight: 500;
            color: #1A1A1A;
          }
        }
        /deep/ .ant-table-thead > tr > th {
          padding: 3.52px 10px !important;
          font-weight: 500 !important;
          color: #1A1A1A;
          background: #F2F4F7;
          border-bottom: 1px solid #E4E4E4;
        }
        /deep/ .ant-table-tbody > tr > td {
          padding: 2.34px 10px !important;
          border-bottom: none;
        }
      }
    }
    .part1 {
      width: 33.3333%;
      margin-right: 13.33px;
    }
    .part2 {
      width: 33.3333%;
      margin: 0 6.67px;
    }
    .part3 {
      width: 33.3333%;
      margin-left: 13.33px;
    }
  }
  .content3 {
    .part {
      width: 50%;
      .bottom {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 81px;
        padding: 0 15px;
        background: #F2F4F7;
        .item {
          margin-right: 25px;
          font-family: PingFang SC;
          line-height: 20px;
          &:last-child {
            margin-right: 0px;
          }
          .name {
            margin-right: 10px;
            font-size: 12px;
            font-weight: 400;
            color: #4D4D4D;
          }
          .num {
            font-size: 16px;
            font-weight: 500;
            color: #5794E9;
          }
        }
      }
    }
    .part1 {
      margin-right: 15px;
      .bottom {
        .item {
          &.item1 {
            .num {
              color: #5794E9;
            }
          }
          &.item2 {
            .num {
              color: #8FCB4A;
            }
          }
          &.item3 {
            .num {
              color: #D32E20;
            }
          }
        }
      }
    }
    .part2 {
      margin-left: 15px;
    }
  }
}
</style>
