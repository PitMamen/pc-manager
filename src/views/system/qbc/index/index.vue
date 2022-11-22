<template>
  <a-card :bordered="false">
    <div class="wrap">
      <div class="search">
        <div class="time time1">近7天</div>
        <div class="time time2">近1月</div>
        <div class="time time3">
          <a-range-picker
            v-model="times"
            :format="format"
            :show-time="{ format: 'HH:mm:ss' }"
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
                <span class="num">124
                  <span class="unit">人</span>
                </span>
                <span class="desc">随访人次</span>
              </div>
              <div class="item item2">
                <span class="num">25
                  <span class="unit">人</span>
                </span>
                <span class="desc">电话随访</span>
              </div>
              <div class="item item3">
                <span class="num">98
                  <span class="unit">人</span>
                </span>
                <span class="desc">微信随访</span>
              </div>
              <div class="item item4">
                <span class="num">124
                  <span class="unit">人</span>
                </span>
                <span class="desc">短信随访</span>
              </div>
              <div class="item item5">
                <span class="num">124
                  <span class="unit">人</span>
                </span>
                <span class="desc">问卷推送</span>
              </div>
              <div class="item item6">
                <span class="num">98
                  <span class="unit">人</span>
                </span>
                <span class="desc">健康文章推送</span>
              </div>
              <div class="item item7">
                <span class="num">25
                  <span class="unit">人</span>
                </span>
                <span class="desc">消息提醒</span>
              </div>
              <div class="item item8">
                <span class="num">124
                  <span class="unit">人</span>
                </span>
                <span class="desc">手机绑定</span>
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
              <span class="num">99
                <span class="unit">人</span>
              </span>
            </div>
            <div class="item item2">
              <span class="name">合格数</span>
              <span class="num">99
                <span class="unit">人</span>
              </span>
            </div>
            <div class="item item3">
              <span class="name">不合格数</span>
              <span class="num">99
                <span class="unit">人</span>
              </span>
            </div>
          </div>
        </div>
        <div class="part part2">
          <div class="title">方案制定</div>
          <div class="bottom">
            <div class="item">
              <span class="name">随访方案</span>
              <span class="num">100
                <span class="unit">套</span>
              </span>
            </div>
            <div class="item">
              <span class="name">宣教文章</span>
              <span class="num">100
                <span class="unit">套</span>
              </span>
            </div>
            <div class="item">
              <span class="name">问卷设计</span>
              <span class="num">100
                <span class="unit">套</span>
              </span>
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
      format: 'YYYY-MM-DD HH:mm:ss'
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
  .search {
    .time {
      &.time3 {}
    }
  }
  .content {
    .part {
      .title {}
      .bottom {
        .item {
          .unit {}
        }
      }
    }
  }
  .content1 {
    .part1 {
      .bottom {
        .list {
          .item {
            .num {
              .unit {}
            }
            .desc {}
            &.item1 {}
            &.item2 {}
            &.item3 {}
            &.item4 {}
            &.item5 {}
            &.item6 {}
            &.item7 {}
            &.item8 {}
          }
        }
      }
    }
    .part2 {
      .title {
        .more {}
      }
      .bottom {
        .list {
          .item {
            .name {}
            .num {}
            &.item1 {
              .num {}
            }
            &.item2 {
              .num {}
            }
            &.item3 {
              .num {}
            }
            &.item4 {
              .num {}
            }
          }
        }
      }
    }
  }
  .content2 {
    .part1 {
      .bottom {
      }
    }
    .part2 {
      .bottom {
      }
    }
    .part3 {
      .bottom {
      }
    }
  }
  .content3 {
    .part1 {
      .bottom {
        .item {
          .name {}
          .num {
            .unit {}
          }
          &.item1 {
            .num {}
          }
          &.item2 {
            .num {}
          }
          &.item3 {
            .num {}
          }
        }
      }
    }
    .part2 {
      .bottom {
        .item {
          .name {}
          .num {
            .unit {}
          }
        }
      }
    }
  }
}
</style>
