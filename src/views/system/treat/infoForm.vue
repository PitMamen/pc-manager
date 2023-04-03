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
          <div class="tab tab1" :class="{ active: tab === 1 }" @click="tabClick(1)">
            <img src="@/assets/icons/wenzhen/tab11.png" v-if="tab === 1" />
            <img src="@/assets/icons/wenzhen/tab1.png" v-else />
            <span>订单信息</span>
          </div>
          <div class="tab tab2" :class="{ active: tab === 2 }" @click="tabClick(2)">
            <img src="@/assets/icons/wenzhen/tab22.png" v-if="tab === 2" />
            <img src="@/assets/icons/wenzhen/tab2.png" v-else />
            <span>病历资料</span>
          </div>
          <div class="tab tab3" :class="{ active: tab === 3 }" @click="tabClick(3)">
            <img src="@/assets/icons/wenzhen/tab33.png" v-if="tab === 3" />
            <img src="@/assets/icons/wenzhen/tab3.png" v-else />
            <span>聊天记录</span>
          </div>
          <div v-if="jumpType==4" class="tab tab4" :class="{ active: tab === 4 }" @click="tabClick(4)">
            <img src="@/assets/icons/wenzhen/phone_n.png" v-if="tab === 4" />
            <img src="@/assets/icons/wenzhen/phone_n.png" v-else />
            <span>电话记录</span>
          </div>
        </div>
        <div class="content content1" v-show="tab === 1">
          <div class="top">
            <div class="title">基本信息</div>
            <div class="infos">
              <div class="col">
                <div class="item">订单号：{{ tab1Info.orderId || '--' }}</div>
                <div class="item">所属医院：{{ tab1Info.hospitalName || '--' }}</div>
                <div class="item">用户姓名：{{ tab1Info.userName || '--' }}</div>
                <div class="item">实付金额：{{ tab1Info.payTotal || '--' }}</div>
                <div class="item">服务医生：{{ tab1Info.doctorUserName || '--' }}</div>
                <div class="item">退款单号：{{ tab1Info.refundId || '--' }}</div>
              </div>
              <div class="col">
                <div class="item">套餐类型：{{ tab1Info.classifyName || '--' }}</div>
                <div class="item">下单时间：{{ tab1Info.createTime || '--' }}</div>
                <div class="item">联系方式：{{ tab1Info.phone || '--' }}</div>
                <div class="item">
                  套餐包服务时间：{{ tab1Info.effectiveStartTime || '--' }} - {{ tab1Info.effectiveEndTime || '--' }}
                </div>
                <div class="item">服务护士：{{ tab1Info.nurseUserName || '--' }}</div>
                <div class="item">退款时间：{{ tab1Info.refundTime || '--' }}</div>
              </div>
              <div class="col">
                <div class="item">套餐名称：{{ tab1Info.commodityName || '--' }}</div>
                <div class="item">
                  订单状态：<span class="ing">{{ (tab1Info.status || {}).description || '--' }}</span>
                </div>
                <div class="item">&nbsp;</div>
                <div class="item">&nbsp;</div>
                <div class="item" :title="tab1Info.teamName || '--'">服务团队：{{ tab1Info.teamName || '--' }}</div>
                <div class="item" :title="tab1Info.refundReason || '--'">
                  退款原因：{{ tab1Info.refundReason || '--' }}
                </div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="title">权益使用情况</div>
            <div class="infos">
              <a-empty style="margin-top: 35px" :image="simpleImage" v-if="tab1List.length === 0" />
              <a-timeline v-else>
                <a-timeline-item color="#409EFF" v-for="item in tab1List" :key="item.id">
                  <span class="line"
                    >{{ format(item.createdTime, 'YYYY年MM月DD日  HH:mm') }} {{ item.dealDesc || '--' }}</span
                  >
                </a-timeline-item>
              </a-timeline>
            </div>
          </div>
        </div>
        <div class="content content2" v-show="tab === 2">
          <div class="part">
            <div class="title">病情描述</div>
            <div class="word">{{ tab2Info.diseaseDesc || '--' }}</div>
          </div>
          <div class="part">
            <div class="title">希望获得的帮助</div>
            <div class="word">{{ tab2Info.appealDesc || '--' }}</div>
          </div>
          <div class="images">
            <div class="desc">上传检查报告或患处图片</div>
            <div class="list">
              <div v-if="(tab2Info.images || '').length === 0">--</div>
              <img
                v-for="item in tab2Info.images.split(',')"
                :key="item"
                :src="item"
                @click="previewClick(item)"
                v-else
              />
            </div>
          </div>
        </div>
        <div class="content content3" v-show="tab === 3">
          <div class="chat">
            <div class="title">问诊记录</div>
            <div class="list">
              <a-empty style="margin-top: 150px" :image="simpleImage" v-if="chatList.length === 0" />
              <template v-for="item in chatList" v-else>
                <div class="item left" :key="item.id" v-if="item.isCustomer">
                  <img class="avatar" :src="item.avatar" v-if="item.avatar" />
                  <img class="avatar" src="@/assets/icons/wenzhen/huanzhe.png" v-else />
                  <div class="msg">
                    <div class="row">
                      <span class="nick">{{ item.nick || '' }}</span>
                      <span class="time">{{ format(new Date(item.time * 1000), 'YYYY-MM-DD HH:mm') }}</span>
                    </div>
                    <div
                      class="row text"
                      @click="chatClick(item)"
                      v-if="item.type === 'TIMTextElem'"
                      :title="item.payload.text"
                    >
                      {{ item.payload.text }}
                    </div>
                    <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMImageElem'">
                      【图片】
                    </div>
                    <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMSoundElem'">
                      【语音】
                    </div>
                    <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMCustomElem'">
                      【{{ item.payload.description }}】
                    </div>
                    <div class="row card" v-else>【未定义类型消息】</div>
                  </div>
                </div>
                <div class="item right" :key="item.id" v-else>
                  <div class="msg">
                    <div class="row">
                      <span class="time">{{ format(new Date(item.time * 1000), 'YYYY-MM-DD HH:mm') }}</span>
                      <span class="nick">{{ item.nick || '' }}</span>
                    </div>
                    <div
                      class="row text"
                      @click="chatClick(item)"
                      v-if="item.type === 'TIMTextElem'"
                      :title="item.payload.text"
                    >
                      {{ item.payload.text }}
                    </div>
                    <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMImageElem'">
                      【图片】
                    </div>
                    <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMSoundElem'">
                      【语音】
                    </div>
                    <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMCustomElem'">
                      【{{ item.payload.description }}】
                    </div>
                    <div class="row card" v-else>【未定义类型消息】</div>
                  </div>
                  <img class="avatar" :src="item.avatar" v-if="item.avatar" />
                  <img class="avatar" src="@/assets/icons/wenzhen/header.png" v-else />
                </div>
              </template>
            </div>
          </div>
          <div class="chat-detail">
            <div class="title">内容详情（<span>点击左侧内容在此查看详情</span>）</div>
            <div class="container">
              <div class="text" v-if="chatItem.type === 'TIMTextElem'">
                <span>{{ chatItem.payload.text }}</span>
              </div>
              <div class="tupian" v-else-if="chatItem.type === 'TIMImageElem'">
                <img :src="chatItem.payload.imageInfoArray[0].url" />
              </div>
              <div class="yuying" v-else-if="chatItem.type === 'TIMSoundElem'">
                <audio :src="chatItem.payload.url" controls autoplay />
              </div>
              <div
                class="wenzhang"
                v-else-if="
                  chatItem.type === 'TIMCustomElem' && JSON.parse(chatItem.payload.data).type === 'CustomArticleMessage'
                "
              >
                <div v-html="articleHtml"></div>
              </div>
              <div
                class="wenjuan"
                v-else-if="
                  chatItem.type === 'TIMCustomElem' && JSON.parse(chatItem.payload.data).type === 'CustomWenJuanMessage'
                "
              >
                <iframe :src="JSON.parse(chatItem.payload.data).url" width="520" height="395" frameborder="0"></iframe>
              </div>
              <div
                class="wenzhen"
                v-else-if="
                  chatItem.type === 'TIMCustomElem' && JSON.parse(chatItem.payload.data).type === 'CustomIllnessMessage'
                "
              >
                <div class="card card1">
                  <div class="titles">服务团队</div>
                  <div class="body">
                    <img :src="(wzInfo1.docInfo || {}).avatarUrl" v-if="(wzInfo1.docInfo || {}).avatarUrl" />
                    <img src="@/assets/icons/wenzhen/header.png" v-else />
                    <div class="infos">
                      <div class="row">
                        <span class="name">{{ (wzInfo1.docInfo || {}).userName || '' }}</span
                        >{{ (wzInfo1.docInfo || {}).professionalTitle || '' }}
                      </div>
                      <div class="row">
                        {{ (wzInfo1.docInfo || {}).hospitalName || '' }}
                        {{ (wzInfo1.docInfo || {}).departmentName || '' }}
                      </div>
                      <div class="row" v-if="(wzInfo1.teamInfo || []).length === 0">医疗团队（0人）</div>
                      <div class="row" v-else>
                        医疗团队（{{ (wzInfo1.teamInfo || []).length }}人）：{{ (wzInfo1.teamInfo || []).join('、') }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card card2">
                  <div class="titles">剩余权益</div>
                  <div class="body">
                    <div class="row" v-for="item in wzInfo1.rightsItemInfo || []" :key="item.id">
                      <span
                        >{{ item.serviceItemName }}【{{ item.serviceItemAttrs }}】：<span class="num"
                          >剩余{{ item.surplusQuantity }}{{ item.unit }}/共{{ item.equityQuantity
                          }}{{ item.unit }}</span
                        ></span
                      >
                    </div>
                  </div>
                </div>
                <div class="card card3">
                  <div class="titles">患者提交的信息</div>
                  <div class="body">
                    <div class="subtitle">病情描述</div>
                    <div class="msg">{{ wzInfo2.diseaseDesc || '--' }}</div>
                    <div class="subtitle">希望获得帮助</div>
                    <div class="msg">{{ wzInfo2.appealDesc || '--' }}</div>
                    <div class="subtitle">上传检查报告或患处图片</div>
                    <div class="imgs">
                      <div class="msg" v-if="(wzInfo2.images || '').length === 0">--</div>
                      <img
                        v-for="item in wzInfo2.images.split(',')"
                        :key="item"
                        :src="item"
                        @click="previewClick(item)"
                        v-else
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content content4" v-show="tab === 4">
          <div class="left">
            <div class="title">基本信息</div>
            <div class="list">
              <a-empty style="margin-top: 150px" :image="simpleImage" v-if="phoneFollowListData.length === 0" />

              <div class="top-content">
                <div class="div-content">  
                  <a-avatar
                    :size="48"
                    :src="(phoneFollowListData.docInfo || {}).avatarUrl" v-if="(phoneFollowListData.docInfo|| {}).avatarUrl"
                    icon="user"
                    style="margin-left: 14px; margin-top: 10px"
                  />
                  <a-avatar style="size:48;margin-left: 14px; margin-top: 10px" src="@/assets/icons/wenzhen/header.png" v-else />
                  <div class="nom-content">
                    <div class="row-content">
                      <div style="font-size: 14px; color: #1a1a1a">
                        {{ phoneFollowListData.docInfo?phoneFollowListData.docInfo.userName:'-' || '-' }}
                      </div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 5px">
                        {{phoneFollowListData.docInfo? phoneFollowListData.docInfo.professionalTitle:'-' || '-' }}
                      </div>
                    </div>

                    <div class="row-content">
                      <div style="font-size: 14px; color: #1a1a1a">
                        {{ phoneFollowListData.docInfo?phoneFollowListData.docInfo.hospitalName:'-' || '-' }}
                      </div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 5px">
                        {{ phoneFollowListData.docInfo?phoneFollowListData.docInfo.departmentName:'-' || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="line"></div>
                <div style="margin-left: 11px; color: #4d4d4d; font-size: 12px; margin-top: 5px">
                  套餐名称:{{
                    phoneFollowListData.rightsUseRecordStatus
                      ? phoneFollowListData.rightsUseRecordStatus.serviceItemName
                      : '-' || '-'
                  }}
                </div>
                <div style="margin-left: 11px; color: #4d4d4d; font-size: 12px; margin-top: 5px; margin-bottom: 5px">
                  服务时长:{{
                    phoneFollowListData.rightsUseRecordStatus
                      ? phoneFollowListData.rightsUseRecordStatus.serviceTime
                      : '-' || '-'
                  }}分钟
                </div>
              </div>

              <div class="top-content">
                <div class="div-content">
                  <div v-if="!timelineData" style="width: 100%">
                    <a-empty style="margin-top: 35px" :image="simpleImage" />
                  </div>
                  <div v-else-if="timelineData" class="nom-content">
                    <div class="row-content">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        意向预约时间:{{ phoneFollowListData.rightsUseRecordStatus?phoneFollowListData.rightsUseRecordStatus.appointTime:'-' || '-' }}
                      </div>
                    </div>

                    <div class="colum-line"></div>
                    <div class="row-content">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        设置电话时间:{{ phoneFollowListData.rightsUseRecordStatus?phoneFollowListData.rightsUseRecordStatus.confirmPeriod:'-' || '-' }}
                      </div>
                    </div>
                    <div class="colum-line"></div>
                    <div class="row-content">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        实际拨打时间:{{ voiceListData&&voiceListData.length>0?voiceListData[0].callTime:'-' || '-' }}
                      </div>
                    </div>
                    <div class="colum-line"></div>
                    <div class="row-content">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        结 &nbsp;束 &nbsp;时 &nbsp; 间:{{
                           voiceListData&&voiceListData.length>0?voiceListData[0].endTime:'-' || '-'
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="title">内容详情</div>
            <div class="container">
              <div v-if="!voiceListData||voiceListData.length===0" style="width: 100%">
                <a-empty style="margin-top: 25%" :image="simpleImage" />
              </div>
              <div
              v-else-if="voiceListData||voiceListData.length>0"
                class="radio-content"
                v-for="(item, index) in voiceListData"
                :key="index"
                :value="item"
              >
                <div style="margin-top: 18px; margin-left: 10px; margin-right: 10px">通话录音{{ index + 1 }}:</div>
                <audio :src="item.callTape" controls autoplay />
              </div>
            </div>
          </div>
        </div>
      </div>

      <a-modal
        title="图片预览"
        :footer="null"
        :visible="previewVisible"
        @cancel="
          () => {
            previewVisible = false
          }
        "
      >
        <img style="width: 100%" :src="previewImage" />
      </a-modal>
    </a-spin>
  </a-modal>
</template>

<script>
import { info, info2, info3, info4, list2, list3, list4 } from '@/api/modular/system/treat'
import { Empty } from 'ant-design-vue'
import moment from 'moment'
export default {
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      visible: false,
      confirmLoading: false,

      tab: 0,
      pageNo: 1,
      pageSize: 99999,
      item: {},
      chatItem: {},
      chatList: [],
      tab1Flag: false,
      tab2Flag: false,
      tab3Flag: false,
      tab4Flag: false,
      previewVisible: false,
      previewImage: '',
      articleHtml: '',
      tab1List: [],
      tab1Info: {},
      tab2Info: {},
      wzInfo1: {},
      wzInfo2: {},
      phoneFollowListData: {},
      timelineData: {},
      voiceListData: [],
      jumpType:1,
    }
  },
  methods: {
    // 初始化方法
    info(item, jumbType) {
      this.item = item
      this.visible = true
      this.jumpType = jumbType
      if (jumbType == 1) {
        this.tabClick(1)
      } else {
        this.tabClick(4)
      }
    },
    tabClick(tab) {
      if (this.tab === tab) {
        return
      }
      this.tab = tab
      if (this.tab === 1 && !this.tab1Flag) {
        this.tab1Info = {}
        this.tab1List = []
        this.getTab1Info()
        this.getTab1List()
      }
      if (this.tab === 2 && !this.tab2Flag) {
        this.tab2Info = {}
        this.getTab2Info()
      }
      if (this.tab === 3 && !this.tab3Flag) {
        this.chatItem = {}
        this.chatList = []
        this.getChatList()
      }

      if (this.tab === 4 && !this.tab4Flag) {
        this.chatItem = {}
        this.chatList = []
        this.phoneFollowListData = {}
        this.getphoneRecords()
      }
    },
    chatClick(item) {
      this.chatItem = item
      if (
        this.chatItem.type === 'TIMCustomElem' &&
        JSON.parse(this.chatItem.payload.data).type === 'CustomArticleMessage'
      ) {
        this.articleHtml = ''
        this.getArticle()
      } else if (
        this.chatItem.type === 'TIMCustomElem' &&
        JSON.parse(this.chatItem.payload.data).type === 'CustomIllnessMessage'
      ) {
        this.wzInfo1 = {}
        this.wzInfo2 = {}
        this.getWZInfo1()
        this.getWZInfo2()
      }
    },
    previewClick(src) {
      this.previewImage = src
      this.previewVisible = true
    },

    format(date, fmt) {
      return moment(date).format(fmt)
    },
    getTab1List() {
      list3(this.item.orderId).then((res) => {
        this.tab1List = res.data || []
      })
    },
    getTab1Info() {
      this.confirmLoading = true
      info4({
        orderId: this.item.orderId,
      })
        .then((res) => {
          this.tab1Flag = true
          this.tab1Info = res.data || {}
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    getTab2Info() {
      this.confirmLoading = true
      info2({
        rightsId: this.item.id,
      })
        .then((res) => {
          this.tab2Flag = true
          this.tab2Info = res.data || {}
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    getArticle() {
      info3({
        id: JSON.parse(this.chatItem.payload.data).id,
      }).then((res) => {
        res.data = res.data || {}
        this.articleHtml = res.data.content
      })
    },
    getWZInfo1() {
      info({
        rightsId: this.item.id,
      }).then((res) => {
        this.wzInfo1 = res.data || {}
      })
    },
    getWZInfo2() {
      info2({
        rightsId: this.item.id,
      }).then((res) => {
        this.wzInfo2 = res.data || {}
      })
    },
    getChatList() {
      this.confirmLoading = true
      list2({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        groupId: this.item.orderId,
      })
        .then((res) => {
          this.tab3Flag = true
          this.chatList = res.data.rows || []
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    getphoneRecords() {
      this.confirmLoading = true
      this.timelineData = {}
      this.voiceListData = []
      list4({
        rightsId: this.item.id,
      })
        .then((res) => {
          this.tab4Flag = true
          this.phoneFollowListData = res.data || []
          if (this.phoneFollowListData.rightsUseRecordStatus) {
            this.timelineData = this.phoneFollowListData.rightsUseRecordStatus
          } else {
            this.timelineData = {}
          }

          this.voiceListData = this.phoneFollowListData.voiceTapeInfo

        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    handleSubmit() {
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
      this.voiceListData = []
      this.confirmLoading = false
      this.tab1Flag = false
      this.tab2Flag = false
      this.tab3Flag = false
      this.tab4Flag = false
      this.previewVisible = false
      this.tab = 0
    },
  },
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
        color: #4d4d4d;
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

      &.tab4 {
        img {
          width: 16px;
          height: 15px;
        }
      }
      &.active {
        border-bottom: 2px solid #409eff;
        span {
          color: #409eff;
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
        border: 1px solid #dfe3e5;
        .title {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 34px;
          border-bottom: 1px solid #dfe3e5;
        }
        .infos {
          display: flex;
          justify-content: space-between;
          .col {
            width: 33.33%;
            .item {
              font-size: 12px;
              font-weight: 400;
              color: #4d4d4d;
              line-height: 32px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              span {
                &.ing {
                  color: #409eff;
                }
                &.ed {
                  color: #f56a6a;
                }
              }
            }
          }
        }
      }
      .bottom {
        padding: 0 20px;
        border: 1px solid #dfe3e5;
        .title {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 34px;
          border-bottom: 1px solid #dfe3e5;
        }
        .infos {
          height: 184px;
          padding: 10px 0;
          overflow-y: auto;
          &::-webkit-scrollbar {
            width: 10px;
          }
          &::-webkit-scrollbar-thumb {
            background: #d9d9d9;
            border-radius: 5px;
          }
          &::-webkit-scrollbar-track {
            background: transparent;
          }
          .line {
            font-size: 12px;
            font-weight: 400;
            color: #4d4d4d;
            line-height: 18px;
            &.ed {
              color: #999999;
            }
          }
        }
      }
    }
    &.content2 {
      padding: 10px 20px;
      overflow-y: auto;
      border: 1px solid #dfe3e5;
      .part {
        margin-bottom: 10px;
        border-bottom: 1px solid #dfe3e5;
        .title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 34px;
        }
        .word {
          font-size: 12px;
          font-weight: 400;
          color: #4d4d4d;
          line-height: 32px;
        }
      }
      .images {
        .desc {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 32px;
        }
        .list {
          img {
            display: inline-block;
            width: 60px;
            height: 60px;
            margin-right: 10px;
            margin-bottom: 10px;
            cursor: pointer;
          }
        }
      }
    }
    &.content3 {
      display: flex;
      justify-content: space-between;
      .chat {
        width: 556px;
        .title {
          margin-bottom: 10px;
          padding-left: 10px;
          font-size: 12px;
          font-weight: 500;
          color: #4d4d4d;
          line-height: 28px;
          background: #fafafa;
          border-left: 4px solid #409eff;
        }
        .list {
          height: 422px;
          overflow-y: auto;
          border: 1px solid #dfe3e5;
          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            border-bottom: 1px solid #e6e6e6;
            .msg {
              flex: 1;
              .row {
                max-width: 447px;
                font-size: 12px;
                font-weight: 400;
                line-height: 30px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                .time {
                  color: #999999;
                }
                .nick {
                  color: #999999;
                }
                &.text {
                  color: #1a1a1a;
                  cursor: pointer;
                }
                &.card {
                  position: relative;
                  color: #409eff;
                  cursor: pointer;
                }
              }
            }
            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
            &.left {
              .msg {
                margin-left: 10px;
                .row {
                  text-align: left;
                  &.card {
                    left: -4px;
                  }
                  .time {
                    margin-left: 60px;
                  }
                }
              }
            }
            &.right {
              .msg {
                margin-right: 10px;
                .row {
                  text-align: right;
                  &.card {
                    right: -4px;
                  }
                  .time {
                    margin-right: 60px;
                  }
                }
              }
            }
          }
        }
      }
      .chat-detail {
        width: 556px;
        .title {
          margin-bottom: 10px;
          padding-left: 10px;
          font-size: 12px;
          font-weight: 500;
          color: #4d4d4d;
          line-height: 28px;
          background: #fafafa;
          border-left: 4px solid #409eff;
          span {
            color: #999999;
          }
        }
        .container {
          height: 422px;
          overflow-y: auto;
          border: 1px solid #dfe3e5;
          .text {
            padding: 10px 20px;
            span {
              font-size: 18px;
              font-weight: 400;
              color: #1a1a1a;
              line-height: 38px;
            }
          }
          .tupian {
            padding: 20px;
            img {
              width: 100%;
              height: auto;
            }
          }
          .yuying {
            padding: 20px;
            audio {
              width: 300px;
              height: 54px;
              background: #f1f3f4;
              border-radius: 27px;
            }
          }
          .wenzhang {
            padding: 10px;
          }
          .wenjuan {
            padding: 10px;
          }
          .wenzhen {
            padding: 10px;
            .card {
              margin-bottom: 10px;
              padding: 0 5px 5px 5px;
              border: 1px solid #dfe3e5;
              .titles {
                padding: 0 5px;
                font-size: 14px;
                font-weight: 500;
                color: #4d4d4d;
                line-height: 32px;
                border-bottom: 1px solid #dfe3e5;
              }
              .body {
                padding: 5px;
              }
              &.card1 {
                .body {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  img {
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                    border-radius: 50%;
                  }
                  .infos {
                    flex: 1;
                    .row {
                      font-size: 12px;
                      font-weight: 400;
                      color: #4d4d4d;
                      line-height: 22px;
                      .name {
                        margin-right: 10px;
                        font-size: 14px;
                        color: #1a1a1a;
                      }
                    }
                  }
                }
              }
              &.card2 {
                .body {
                  .row {
                    font-size: 12px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 20px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    .num {
                      color: #027dfd;
                    }
                  }
                }
              }
              &.card3 {
                .body {
                  .subtitle {
                    font-size: 12px;
                    font-weight: 500;
                    color: #1a1a1a;
                    line-height: 20px;
                  }
                  .msg {
                    font-size: 12px;
                    font-weight: 400;
                    color: #4d4d4d;
                    line-height: 20px;
                  }
                  .imgs {
                    margin-top: 6px;
                    img {
                      display: inline-block;
                      width: 25px;
                      height: 25px;
                      margin-right: 4px;
                      margin-bottom: 4px;
                      cursor: pointer;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    &.content4 {
      display: flex;
      justify-content: space-between;
      .left {
        width: 556px;
        .title {
          margin-bottom: 10px;
          padding-left: 10px;
          font-size: 12px;
          font-weight: 500;
          color: #4d4d4d;
          line-height: 28px;
          background: #fafafa;
          border-left: 4px solid #409eff;
        }

        .list {
          height: 422px;
          overflow-y: auto;
          border: 1px solid #dfe3e5;

          .top-content {
            width: 535px;
            height: 116px;
            margin-top: 11px;
            margin-left: 11px;
            background: rgba(0, 1, 3, 0);
            border: 1px solid #dfe3e5;
            display: flex;
            flex-direction: column;

            .docpoint {
              width: 10px;
              height: 10px;
              background: rgba(222, 221, 221, 0.7);
              border-radius: 50%;
              border: 1px solid rgba(0, 0, 0, 0.2);
            }

            .colum-line {
              height: 10px;
              width: 2px;
              margin-left: 18.5px;
              background: #bdbdbd;
            }

            .div-content {
              margin-bottom: 4px;
              width: 100%;
              display: flex;
              flex-direction: row;
              align-items: center;
              overflow: hidden;

              .nom-content {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-top: 10px;

                .row-content {
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                  margin-left: 15px;
                  align-items: center;
                }
              }

              .span-item-name {
                display: inline-block;
                color: #4d4d4d;
                font-size: 12px;
                text-align: right;
                margin-right: 10px;
                width: 60px;
              }
              .span-item-value {
                flex: 1;
                color: #4d4d4d;
                text-align: left;
                font-size: 12px;
                display: inline-block;
              }
              .ant-select {
                flex: 1;
                font-size: 12px !important;
              }

              .ant-calendar-picker {
                flex: 1;
              }

              .avator {
                height: 48px;
                width: 48px;
                border-radius: 50%;
                background: #dfdfdf;
                margin-right: 20px;
              }
              .avator-right {
                flex: 1;
                display: flex;
                flex-direction: column;

                .avator-right-top {
                  width: 82px;
                  height: 28px;
                  border: 1px solid #cccccc;
                  display: flex;
                  flex-direction: row;
                }
              }
              .jueseview {
                width: 100%;
                height: 62px;
                border: 1px solid #cccccc;
                border-radius: 2px;
                overflow-y: auto;
                padding-bottom: 10px;

                .checkbox {
                  margin-left: 10px;
                  margin-top: 6px;
                  margin-right: 0px;

                  font-size: 12px !important;
                }
              }
            }

            .line {
              width: 100%;
              height: 1px;
              background: #dfe3e5;
            }
          }

          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            border-bottom: 1px solid #e6e6e6;
            .msg {
              flex: 1;
              .row {
                max-width: 447px;
                font-size: 12px;
                font-weight: 400;
                line-height: 30px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                .time {
                  color: #999999;
                }
                .nick {
                  color: #999999;
                }
                &.text {
                  color: #1a1a1a;
                  cursor: pointer;
                }
                &.card {
                  position: relative;
                  color: #409eff;
                  cursor: pointer;
                }
              }
            }
            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
            &.left {
              .msg {
                margin-left: 10px;
                .row {
                  text-align: left;
                  &.card {
                    left: -4px;
                  }
                  .time {
                    margin-left: 60px;
                  }
                }
              }
            }
            &.right {
              .msg {
                margin-right: 10px;
                .row {
                  text-align: right;
                  &.card {
                    right: -4px;
                  }
                  .time {
                    margin-right: 60px;
                  }
                }
              }
            }
          }
        }
      }
      .right {
        width: 556px;
        .title {
          margin-bottom: 10px;
          padding-left: 10px;
          font-size: 12px;
          font-weight: 500;
          color: #4d4d4d;
          line-height: 28px;
          background: #fafafa;
          border-left: 4px solid #409eff;
          span {
            color: #999999;
          }
        }
        .container {
          height: 422px;
          overflow-y: auto;
          border: 1px solid #dfe3e5;

          .radio-content {
            width: 100%;
            display: flex;
            flex-direction: row;
            margin-top: 10px;
          }
          .text {
            padding: 10px 20px;
            span {
              font-size: 18px;
              font-weight: 400;
              color: #1a1a1a;
              line-height: 38px;
            }
          }
          .tupian {
            padding: 20px;
            img {
              width: 100%;
              height: auto;
            }
          }
          .yuying {
            padding: 20px;
            audio {
              width: 300px;
              height: 54px;
              background: #f1f3f4;
              border-radius: 27px;
            }
          }
          .wenzhang {
            padding: 10px;
          }
          .wenjuan {
            padding: 10px;
          }
          .wenzhen {
            padding: 10px;
            .card {
              margin-bottom: 10px;
              padding: 0 5px 5px 5px;
              border: 1px solid #dfe3e5;
              .titles {
                padding: 0 5px;
                font-size: 14px;
                font-weight: 500;
                color: #4d4d4d;
                line-height: 32px;
                border-bottom: 1px solid #dfe3e5;
              }
              .body {
                padding: 5px;
              }
              &.card1 {
                .body {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  img {
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                    border-radius: 50%;
                  }
                  .infos {
                    flex: 1;
                    .row {
                      font-size: 12px;
                      font-weight: 400;
                      color: #4d4d4d;
                      line-height: 22px;
                      .name {
                        margin-right: 10px;
                        font-size: 14px;
                        color: #1a1a1a;
                      }
                    }
                  }
                }
              }
              &.card2 {
                .body {
                  .row {
                    font-size: 12px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 20px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    .num {
                      color: #027dfd;
                    }
                  }
                }
              }
              &.card3 {
                .body {
                  .subtitle {
                    font-size: 12px;
                    font-weight: 500;
                    color: #1a1a1a;
                    line-height: 20px;
                  }
                  .msg {
                    font-size: 12px;
                    font-weight: 400;
                    color: #4d4d4d;
                    line-height: 20px;
                  }
                  .imgs {
                    margin-top: 6px;
                    img {
                      display: inline-block;
                      width: 25px;
                      height: 25px;
                      margin-right: 4px;
                      margin-bottom: 4px;
                      cursor: pointer;
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
}
</style>
