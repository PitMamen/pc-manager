<template>
  <a-card :bordered="false">
    <div class="wrap">
      <div class="search">
        <div class="time time1 active">近7天</div>
        <div class="time time2">近1月</div>
        <div class="time time3">
          <a-range-picker
            v-model="times"
            :format="format"
            @change="timesChange"
          />
        </div>
      </div>
      <div class="content content1">
        <div class="part part1">
          <div class="title">工作量统计</div>
          <div class="bottom">
            <div class="list">
              <div class="item item1">
                <div class="row">
                  <span class="num">124<span class="unit">人</span></span>
                </div>
                <div class="row">
                  <span class="desc">随访人次</span>
                </div>
              </div>
              <div class="item item2">
                <div class="row">
                  <span class="num">124<span class="unit">人</span></span>
                </div>
                <div class="row">
                  <span class="desc">电话随访</span>
                </div>
              </div>
              <div class="item item3">
                <div class="row">
                  <span class="num">124<span class="unit">人</span></span>
                </div>
                <div class="row">
                  <span class="desc">微信随访</span>
                </div>
              </div>
              <div class="item item4">
                <div class="row">
                  <span class="num">124<span class="unit">人</span></span>
                </div>
                <div class="row">
                  <span class="desc">短信随访</span>
                </div>
              </div>
            </div>
            <div class="list">
              <div class="item item5">
                <div class="row">
                  <span class="num">124<span class="unit">人</span></span>
                </div>
                <div class="row">
                  <span class="desc">问卷推送</span>
                </div>
              </div>
              <div class="item item6">
                <div class="row">
                  <span class="num">124<span class="unit">人</span></span>
                </div>
                <div class="row">
                  <span class="desc">健康文章推送</span>
                </div>
              </div>
              <div class="item item7">
                <div class="row">
                  <span class="num">124<span class="unit">人</span></span>
                </div>
                <div class="row">
                  <span class="desc">消息提醒</span>
                </div>
              </div>
              <div class="item item8">
                <div class="row">
                  <span class="num">124<span class="unit">人</span></span>
                </div>
                <div class="row">
                  <span class="desc">手机绑定</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="part part2">
          <div class="title">我的待办
            <a class="more">查看更多>></a>
          </div>
          <div class="bottom">
            <div class="list">
              <div class="item item1">
                <span class="name">待我执行随访</span>
                <span class="num">90人</span>
              </div>
              <div class="item item2">
                <span class="name">我完成的随访</span>
                <span class="num">90人</span>
              </div>
              <div class="item item3">
                <span class="name">随访逾期任务</span>
                <span class="num">90人</span>
              </div>
              <div class="item item4">
                <span class="name">抽查不合格任务</span>
                <span class="num">90人</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content content2">
        <div class="part part1">
          <div class="title">Top10问卷回收分析</div>
          <div class="bottom">
            <table1></table1>
          </div>
        </div>
        <div class="part part2">
          <div class="title">Top10名单随访率</div>
          <div class="bottom">
            <table2></table2>
          </div>
        </div>
        <div class="part part3">
          <div class="title">Top10宣教文章阅读量</div>
          <div class="bottom">
            <table3></table3>
          </div>
        </div>
      </div>
      <div class="content content3">
        <div class="part part1">
          <div class="title">质控情况</div>
          <div class="bottom">
            <div class="item item1">
              <span class="name">抽查任务数</span>
              <span class="num">99<span class="unit">人</span></span>
            </div>
            <div class="item item2">
              <span class="name">合格数</span>
              <span class="num">99<span class="unit">人</span></span>
            </div>
            <div class="item item3">
              <span class="name">不合格数</span>
              <span class="num">99<span class="unit">人</span></span>
            </div>
          </div>
        </div>
        <div class="part part2">
          <div class="title">方案制定</div>
          <div class="bottom">
            <div class="item">
              <span class="name">随访方案</span>
              <span class="num">99<span class="unit">套</span></span>
            </div>
            <div class="item">
              <span class="name">宣教文章</span>
              <span class="num">99<span class="unit">篇</span></span>
            </div>
            <div class="item">
              <span class="name">问卷设计</span>
              <span class="num">99<span class="unit">篇</span></span>
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
export default {
  components: {
    table1,
    table2,
    table3
  },
  data() {
    return {
      times: [],
      format: 'YYYY-MM-DD'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getPart1()
      this.getPart2()
      this.getPart3()
      this.getPart4()
      this.getPart5()
      this.getPart67()
    },
    getPart1() {},
    getPart2() {},
    getPart3() {},
    getPart4() {},
    getPart5() {},
    getPart67() {},
    timesChange(value) {
      if (!value || value.length === 0) {
        this.$message.warning('请选择时间！')
        return
      }
      this.init()
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
      width: 640px;
      .bottom {
        .list {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          .item {
            width: 145px;
            height: 68px;
            padding: 15px 20px;
            border-radius: 2px;
            background-size: cover;
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
              background: url('~@/assets/qbc/index/bg1.png');
              box-shadow: 0px 2px 4px 0px rgba(230,132,156,0.35);
            }
            &.item2 {
              background: url('~@/assets/qbc/index/bg2.png');
              box-shadow: 0px 2px 4px 0px rgba(242,140,115,0.35);
            }
            &.item3 {
              background: url('~@/assets/qbc/index/bg3.png');
              box-shadow: 0px 2px 4px 0px rgba(244,186,98,0.35);
            }
            &.item4 {
              background: url('~@/assets/qbc/index/bg4.png');
              box-shadow: 0px 2px 4px 0px rgba(143,203,74,0.35);
            }
            &.item5 {
              background: url('~@/assets/qbc/index/bg5.png');
              box-shadow: 0px 2px 4px 0px rgba(147,121,237,0.35);
            }
            &.item6 {
              background: url('~@/assets/qbc/index/bg6.png');
              box-shadow: 0px 2px 4px 0px rgba(108,141,241,0.35);
            }
            &.item7 {
              background: url('~@/assets/qbc/index/bg7.png');
              box-shadow: 0px 2px 4px 0px rgba(87,148,233,0.35);
            }
            &.item8 {
              background: url('~@/assets/qbc/index/bg8.png');
              box-shadow: 0px 2px 4px 0px rgba(88,205,174,0.35);
            }
          }
        }
      }
    }
    .part2 {
      width: calc(100% - 640px - 30px);
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
          padding: 3.52px 15px !important;
          font-weight: 500 !important;
          color: #1A1A1A;
          background: #F2F4F7;
          border-bottom: 1px solid #E4E4E4;
        }
        /deep/ .ant-table-tbody > tr > td {
          padding: 2.34px 15px !important;
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
        justify-content: space-between;
        height: 81px;
        padding: 0 15px;
        background: #F2F4F7;
        .item {
          font-family: PingFang SC;
          line-height: 20px;
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
