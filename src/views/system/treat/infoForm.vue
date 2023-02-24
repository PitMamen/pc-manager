<template>
  <a-modal
    class="hide-sure-modal"
    title="问诊记录"
    cancelText="关 闭"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="wrap">
        <div class="tabs">
          <div class="tab tab1" :class="{ active: tab===1 }" @click="tabClick(1)">
            <img src="@/assets/icons/wenzhen/tab11.png" v-if="tab === 1" />
            <img src="@/assets/icons/wenzhen/tab1.png" v-else />
            <span>订单信息</span>
          </div>
          <div class="tab tab2" :class="{ active: tab===2 }" @click="tabClick(2)">
            <img src="@/assets/icons/wenzhen/tab22.png" v-if="tab === 2" />
            <img src="@/assets/icons/wenzhen/tab2.png" v-else />
            <span>病历资料</span>
          </div>
          <div class="tab tab3" :class="{ active: tab===3 }" @click="tabClick(3)">
            <img src="@/assets/icons/wenzhen/tab33.png" v-if="tab === 3" />
            <img src="@/assets/icons/wenzhen/tab3.png" v-else />
            <span>聊天记录</span>
          </div>
        </div>
        <div class="content content1" v-show="tab === 1">
          <div class="top">
            <div class="title">基本信息</div>
            <div class="infos">
              <div class="col">
                <div class="item">订单号：1613717611264397314</div>
                <div class="item">所属医院：中南大学湘雅二医院</div>
                <div class="item">用户姓名：张三</div>
                <div class="item">实付金额：1288</div>
                <div class="item">服务医生：邓姿峰</div>
                <div class="item">退款单号：--</div>
              </div>
              <div class="col">
                <div class="item">套餐类型：疾病管理</div>
                <div class="item">下单时间：2023-01-13 10:00:39</div>
                <div class="item">联系方式：18766899908</div>
                <div class="item">套餐包服务时间：2023-01-13 10:00:39 - 2023-01-14 10:00:39</div>
                <div class="item">服务护士：张悦</div>
                <div class="item">退款时间：--</div>
              </div>
              <div class="col">
                <div class="item">套餐名称：糖尿病管理</div>
                <div class="item">订单状态：<span class="ing">使用中</span></div>
                <div class="item">&nbsp;</div>
                <div class="item">&nbsp;</div>
                <div class="item">服务团队：--</div>
                <div class="item">退款原因：--</div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="title">权益使用情况</div>
            <div class="infos">
              <a-timeline>
                <a-timeline-item color="#409EFF"><span class="line">2022年1月5日  12:00  完成【图文咨询】使用</span></a-timeline-item>
                <a-timeline-item color="#CCCCCC"><span class="line ed">2022年1月4日  12:00  用户申请【图文咨询】使用1次</span></a-timeline-item>
                <a-timeline-item color="#CCCCCC"><span class="line ed">2022年1月4日  12:00  完成【图文咨询】使用</span></a-timeline-item>
                <a-timeline-item color="#CCCCCC"><span class="line ed">2022年1月4日  12:00  完成【图文咨询】使用</span></a-timeline-item>
                <a-timeline-item color="#CCCCCC"><span class="line ed">2022年1月4日  12:00  完成【图文咨询】使用</span></a-timeline-item>
                <a-timeline-item color="#CCCCCC"><span class="line ed">2022年1月4日  12:00  完成【图文咨询】使用</span></a-timeline-item>
                <a-timeline-item color="#CCCCCC"><span class="line ed">2022年1月4日  12:00  完成【图文咨询】使用</span></a-timeline-item>
                <a-timeline-item color="#CCCCCC"><span class="line ed">2022年1月4日  12:00  完成【图文咨询】使用</span></a-timeline-item>
              </a-timeline>
            </div>
          </div>
        </div>
        <div class="content content2" v-show="tab === 2">
          <div class="part">
            <div class="title">病情描述</div>
            <div class="word">自从吃了您开的药品以后一直有腹泻，是否可以停止用药呢？</div>
          </div>
          <div class="part">
            <div class="title">希望获得的帮助</div>
            <div class="word">用药调整</div>
          </div>
          <div class="images">
            <div class="desc">上传检查报告或患处图片</div>
            <div class="list">
              <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
              <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
              <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
              <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
              <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
              <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
            </div>
          </div>
        </div>
        <div class="content content3" v-show="tab === 3">
          <div class="chat">
            <div class="title">问诊记录</div>
            <div class="list">
              <div class="item right">
                <div class="msg">
                  <div class="row">
                    <div class="time">2022-10-23 22:23</div>
                    <div class="nick">医生助手</div>
                  </div>
                  <div class="row text" @click="chatClick()">咨询诊室已创建成功，服务开始</div>
                </div>
                <img class="avatar" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
              </div>
              <div class="item right">
                <div class="msg">
                  <div class="row">
                    <div class="time">2022-10-23 22:23</div>
                    <div class="nick">医生助手</div>
                  </div>
                  <div class="row card" @click="chatClick()">【问诊卡】</div>
                </div>
                <img class="avatar" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
              </div>
              <div class="item left">
                <img class="avatar" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                <div class="msg">
                  <div class="row">
                    <div class="nick">医生助手</div>
                    <div class="time">2022-10-23 22:23</div>
                  </div>
                  <div class="row text" @click="chatClick()">文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文</div>
                </div>
              </div>
            </div>
          </div>
          <div class="chat-detail">
            <div class="title">内容详情（<span>点击左侧内容在此查看详情</span>）</div>
            <div class="container">
              <div class="text" v-if="false">
                <span></span>
              </div>
              <div class="tupian" v-if="false">
                <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
              </div>
              <div class="yuying" v-if="false">
                <audio src="file.mp3" controls autoplay />
              </div>
              <div class="wenzhang" v-if="false">
                <div v-html="'1234567'"></div>
              </div>
              <div class="wenjuan" v-if="false">
                <iframe src="https://www.w3school.com.cn/html/html_iframe.asp" width="600" height="500" frameborder="0"></iframe>
              </div>
              <div class="wenzhen" v-if="true">
                <div class="card card1">
                  <div class="title">服务团队</div>
                  <div class="body">
                    <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                    <div class="infos">
                      <div class="row"><span class="name">刘医生</span>副主任医师</div>
                      <div class="row">中南大学湘雅二医院  内分泌内科</div>
                      <div class="row">医疗团队（2人）：王必成、刘月月</div>
                    </div>
                  </div>
                </div>
                <div class="card card2">
                  <div class="title">剩余权益</div>
                  <div class="body">
                    <div class="row">视频咨询【15分钟/24小时】：<span class="num">剩余1次/共2次</span></div>
                    <div class="row">视频咨询【15分钟/24小时】：<span class="num">剩余1次/共2次</span></div>
                    <div class="row">视频咨询【15分钟/24小时】：<span class="num">剩余1次/共2次</span></div>
                  </div>
                </div>
                <div class="card card3">
                  <div class="title">患者提交的信息</div>
                  <div class="body">
                    <div class="subtitle">病情描述</div>
                    <div class="msg">自从吃了您开的药品以后一直有腹泻，是否可以停止用药呢？</div>
                    <div class="subtitle">希望获得帮助</div>
                    <div class="msg">用药调整</div>
                    <div class="subtitle">上传检查报告或患处图片</div>
                    <div class="imgs">
                      <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
                      <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
                      <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
                      <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
                      <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
                      <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" @click="previewClick('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a-modal title="" :footer="null" :visible="previewVisible" @cancel="() => { previewVisible = false; }">
        <img style="width: 100%;" :src="previewImage" />
      </a-modal>
    </a-spin>
  </a-modal>
</template>

<script>
import { info, list2 as list } from '@/api/modular/system/treat'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      
      tab: 1,
      chatItem: {},
      previewVisible: false,
      previewImage: '',
    }
  },
  methods: {
    // 初始化方法
    info(item) {
      this.visible = true
    },
    tabClick(tab) {
      if (this.tab === tab){
        return
      }
      this.tab = tab
    },
    chatClick(item) {
      this.chatItem = item
    },
    previewClick(src) {
      this.previewImage = src
      this.previewVisible = true
    },

    handleSubmit() {
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
      this.previewVisible = false
    }
  }
}
</script>

<style lang="less">
.hide-sure-modal {
  .ant-btn-primary {
    display: none;
  }
}
</style>
<style lang="less" scoped>
.wrap {
  width: 100%;
  .tabs {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
    .tab {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 30px;
      padding-bottom: 5px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      img {
        margin-right: 5px;
      }
      span {
        font-size: 12px;
        font-weight: 400;
        color: #4D4D4D;
        line-height: 20px;
      }
      &.tab1 {
        img {
          width: 12.5px;
          height: 15px;
        }
      }
      &.tab2 {
        img {
          width: 12.857px;
          height: 15px;
        }
      }
      &.tab3 {
        img {
          width: 16px;
          height: 15px;
        }
      }
      &.active {
        border-bottom: 2px solid #409EFF;
        span {
          color: #409EFF;
        }
      }
    }
  }
  .content {
    width: 100%;
    height: 460px;
    &.content1 {
      .top {
        margin-bottom: 10px;
        padding: 0 20px;
        border: 1px solid #DFE3E5;
        .title {
          font-size: 14px;
          font-weight: 500;
          color: #1A1A1A;
          line-height: 34px;
          border-bottom: 1px solid #DFE3E5;
        }
        .infos {
          display: flex;
          justify-content: space-between;
          .col {
            width: 33.33%;
            .item {
              font-size: 12px;
              font-weight: 400;
              color: #4D4D4D;
              line-height: 32px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              span {
                &.ing {
                  color: #409EFF;
                }
                &.ed {
                  color: #F56A6A;
                }
              }
            }
          }
        }
      }
      .bottom {
        padding: 0 20px;
        border: 1px solid #DFE3E5;
        .title {
          font-size: 14px;
          font-weight: 500;
          color: #1A1A1A;
          line-height: 34px;
          border-bottom: 1px solid #DFE3E5;
        }
        .infos {
          height: 164px;
          padding: 10px 0;
          overflow-y: auto;
          &::-webkit-scrollbar {
            width: 10px;
          }
          &::-webkit-scrollbar-thumb {
            background: #D9D9D9;
            border-radius: 5px;
          }
          &::-webkit-scrollbar-track {
            background: transparent;
          }
          .line {
            font-size: 12px;
            font-weight: 400;
            color: #4D4D4D;
            line-height: 18px;
            &.ed {
              color: #999999;
            }
          }
        }
      }
    }
    &.content2 {
      .part {
        .title {}
        .word {}
      }
      .images {
        .desc {}
        .list {
          img {}
        }
      }
    }
    &.content3 {
      .chat {
        .title {}
        .list {
          .item {
            .msg {
              .row {
                .time {}
                .nick {}
                &.text {}
                &.card {}
              }
            }
            .avatar {}
            &.left {
              .msg {
                .row {
                  .time {}
                  .nick {}
                }
              }
            }
            &.right {
              .msg {
                .row {
                  .time {}
                  .nick {}
                }
              }
            }
          }
        }
      }
      .chat-detail {
        .title {
          span {}
        }
        .container {
          .text {
            span {}
          }
          .tupian {
            img {}
          }
          .yuying {
            audio {}
          }
          .wenzhang {}
          .wenjuan {}
          .wenzhen {
            .card {
              .title {}
              .body {}
              &.card1 {
                .body {
                  img {}
                  .infos {
                    .row {
                      .name {}
                    }
                  }
                }
              }
              &.card2 {
                .body {
                  .row {
                    .num {}
                  }
                }
              }
              &.card3 {
                .body {
                  .subtitle {}
                  .msg {}
                  .imgs {
                    img {}
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
