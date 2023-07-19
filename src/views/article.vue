<template>
  <a-spin :spinning="confirmLoading">
    <div class="wrap">
      <div class="tabs">
        <div class="tab tab5" :class="{ active: tab === 5 }" @click="tabClick(5)">
          <img src="@/assets/icons/wenzhen/tab33.png" v-if="tab === 5" />
          <img src="@/assets/icons/wenzhen/tab3.png" v-else />
          <span>聊天记录</span>
        </div>

        <div class="tab tab4" :class="{ active: tab === 4 }" @click="tabClick(4)">
          <img src="@/assets/icons/wenzhen/phone_n2.png" v-if="tab === 4" />
          <img src="@/assets/icons/wenzhen/phone_n.png" v-else />
          <span>电话记录</span>
        </div>

        <div class="tab tab5" :class="{ active: tab === 7 }" @click="tabClick(7)">
          <img src="@/assets/icons/wenzhen/video.png" v-if="tab === 7" />
          <img src="@/assets/icons/wenzhen/video_not.png" v-else />
          <span>视频记录</span>
        </div>
      </div>

      <div class="content content5" v-show="tab === 5">
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
                  <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMImageElem'">【图片】</div>
                  <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMSoundElem'">【语音】</div>
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
                  <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMImageElem'">【图片】</div>
                  <div class="row card" @click="chatClick(item)" v-else-if="item.type === 'TIMSoundElem'">【语音】</div>
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
              class="chufang"
              v-else-if="
                chatItem.type === 'TIMCustomElem' && JSON.parse(chatItem.payload.data).type === 'CustomChuFangMessage'
              "
            >
              <div class="big-kuang">
                <div class="top-content">
                  <div style="margin-left: 30%">{{ preDetailData.medicalInfo.preHead }}</div>
                  <div class="span-gray">{{ preDetailData.medicalInfo.preType }}</div>
                </div>

                <div style="margin-left: 43%; margin-top: 10px; margin-bottom: 20px">
                  {{ preDetailData.medicalInfo.preTitle }}
                </div>
                <div class="user-content">
                  <div>姓名:{{ preDetailData.medicalInfo.name }}</div>
                  <div>性别:{{ preDetailData.medicalInfo.sex }}</div>
                  <div>年龄:{{ preDetailData.medicalInfo.age }}</div>
                </div>
                <div class="user-content" style="margin-bottom: 15px">
                  <div>科室:{{ preDetailData.medicalInfo.deptName }}</div>
                  <div>日期:{{ preDetailData.medicalInfo.createDate }}</div>
                </div>
              </div>

              <div class="big-kuang">
                <div style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold">
                  诊断
                </div>
                <div class="line-content"></div>
                <div style="margin-left: 10px; margin-top: 5px; margin-bottom: 5px">
                  {{ preDetailData.diagnosis }}
                </div>
              </div>

              <div class="big-kuang">
                <div style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold">
                  RP
                </div>
                <div
                  style="width: 100%; height: 1px; margin-right: 10px; margin-right: 10px; background: #e6e6e6"
                ></div>
                <div v-for="(item, index) in preDetailData.medOrderItems" :key="index" :value="item.drugName">
                  <div class="top-content">
                    <div style="margin-left: 10px; margin-top: 5px; margin-bottom: 5px">
                      {{ index + 1 }}.{{ item.drugName }}
                    </div>
                    <div style="margin-left: auto; margin-top: 5px; margin-bottom: 5px; margin-right: 5px">
                      x{{ item.itemNum }}{{ item.itemDrugUnit }}
                    </div>
                  </div>
                  <div style="margin-left: 10px; color: #999999; font-size: 1em">规格:{{ item.drugSpec }}</div>
                  <div style="margin-left: 10px; color: #4d4d4d; font-size: 10px">
                    用法用量:{{ item.frequency }},{{ item.useMethod }}
                  </div>
                </div>
              </div>

              <div class="big-kuang">
                <div style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold">
                  备注
                </div>
                <div class="line-content"></div>

                <div style="margin-left: 10px; margin-top: 10px; flex-wrap: wrap">
                  {{ preDetailData.medicalInfo.remark }}
                </div>
              </div>

              <div class="big-kuang">
                <div style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold">
                  签字盖章
                </div>
                <div class="line-content"></div>

                <div
                  style="margin-left: 10px; margin-top: 10px; display: flex; flex-direction: row; align-items: center"
                >
                  开方医生：
                  <img
                    style="height: 25px"
                    v-if="preDetailData.caAuthFlag && preDetailData.doctorCerFile"
                    :src="preDetailData.doctorCerFile"
                  />
                  <div v-else>{{ preDetailData.medicalInfo.doctorName }}</div>
                </div>
                <div style="margin-left: 10px; margin-top: 10px; margin-bottom: 10px">
                  执行科室：{{ preDetailData.medicalInfo.deptName }}
                </div>
                <div style="margin-left: 10px; margin-top: 10px">
                  审核药师：{{ preDetailData.medicalInfo.checkUserName }}
                </div>
              </div>
              <div style="margin-left: 10px; color: #999999; font-size: 1em">特别提示：</div>
              <div style="margin-left: 10px; color: #999999; font-size: 1em">
                1、本次处方仅限于中南大学湘雅二医院互联网医院使用，自行下载配药不具有处方效力。
              </div>
              <div style="margin-left: 10px; color: #999999; font-size: 1em">
                2、按照卫生部、国家中医药管理局卫医政发【2011】11号文件规定：为保证患者用药安全，药 品一经发出，不得退换
              </div>
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
                        >剩余{{ item.surplusQuantity }}{{ item.unit }}/共{{ item.equityQuantity }}{{ item.unit }}</span
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
            <a-empty style="margin-top: 150px" :image="simpleImage" v-if="!phoneFollowListData.id" />
            <div v-else>
              <div class="top-content">
                <div class="div-content">
                  <a-avatar
                    :src="(phoneFollowListData.docInfo || {}).avatarUrl"
                    v-if="(phoneFollowListData.docInfo || {}).avatarUrl"
                    icon="user"
                    style="margin-left: 14px; margin-top: 8px; width: 60px; height: 54px"
                  />
                  <a-avatar
                    style="size: 54; margin-left: 14px; margin-top: 10px"
                    src="@/assets/icons/wenzhen/header.png"
                    v-else
                  />
                  <div class="nom-content">
                    <div class="row-content">
                      <div style="font-size: 14px; color: #1a1a1a">
                        {{ phoneFollowListData.docInfo ? phoneFollowListData.docInfo.userName : '-' || '-' }}
                      </div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 5px">
                        {{ phoneFollowListData.docInfo ? phoneFollowListData.docInfo.professionalTitle : '-' || '-' }}
                      </div>
                    </div>

                    <div class="row-content">
                      <div style="font-size: 14px; color: #1a1a1a">
                        {{ phoneFollowListData.docInfo ? phoneFollowListData.docInfo.hospitalName : '-' || '-' }}
                      </div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 5px">
                        {{ phoneFollowListData.docInfo ? phoneFollowListData.docInfo.departmentName : '-' || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="line"></div>
                <div style="margin-left: 15px; color: #4d4d4d; font-size: 12px; margin-top: 5px">
                  套餐名称:{{
                    phoneFollowListData.rightsUseRecordStatus
                      ? phoneFollowListData.rightsUseRecordStatus.serviceItemName
                      : '-' || '-'
                  }}
                </div>
                <div style="margin-left: 15px; color: #4d4d4d; font-size: 12px; margin-top: 5px; margin-bottom: 5px">
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
                    <div class="row-content" style="padding-top: 10px">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        意向预约时间:{{
                          phoneFollowListData.rightsUseRecordStatus
                            ? phoneFollowListData.rightsUseRecordStatus.appointPeriod
                            : '-' || '-'
                        }}
                      </div>
                    </div>

                    <div class="colum-line"></div>
                    <div class="row-content">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        设置电话时间:{{
                          phoneFollowListData.rightsUseRecordStatus
                            ? phoneFollowListData.rightsUseRecordStatus.confirmPeriod
                            : '-' || '-'
                        }}
                      </div>
                    </div>
                    <div class="colum-line"></div>
                    <div class="row-content">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        实际拨打时间:{{
                          voiceListData && voiceListData.length > 0 ? voiceListData[0].callTime : '-' || '-'
                        }}
                      </div>
                    </div>
                    <div class="colum-line"></div>
                    <div class="row-content" style="padding-bottom: 15px">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        结 &nbsp;束 &nbsp;时 &nbsp; 间:{{
                          voiceListData && voiceListData.length > 0 ? voiceListData[0].endTime : '-' || '-'
                        }}
                      </div>
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
            <div v-if="!voiceListData || voiceListData.length === 0" style="width: 100%">
              <a-empty style="margin-top: 25%" :image="simpleImage" />
            </div>
            <div
              v-else-if="voiceListData || voiceListData.length > 0"
              class="radio-content"
              v-for="(item, index) in voiceListData"
              :key="index"
              :value="item"
            >
              <div style="margin-top: 18px; margin-left: 10px; margin-right: 10px">通话录音{{ index + 1 }}:</div>
              <audio :src="item.callTape" controls />
            </div>
          </div>
        </div>
      </div>

      <div class="content content4" v-show="tab === 7">
        <div class="left">
          <div class="title">基本信息</div>
          <div class="list" style="height: 420px">
            <a-empty style="margin-top: 150px" :image="simpleImage" v-if="!videoFollowListData.id" />
            <div v-else>
              <div class="top-content">
                <div class="div-content">
                  <a-avatar
                    :src="(videoFollowListData.docInfo || {}).avatarUrl"
                    v-if="videoFollowListData.docInfo.avatarUrl != null"
                    icon="user"
                    style="margin-left: 14px; margin-top: 8px; width: 60px; height: 54px"
                  />
                  <a-avatar
                    style="size: 54; margin-left: 14px; margin-top: 10px"
                    src="@/assets/icons/wenzhen/header.png"
                    v-else
                  />
                  <div class="nom-content">
                    <div class="row-content">
                      <div style="font-size: 14px; color: #1a1a1a">
                        {{ videoFollowListData.docInfo ? videoFollowListData.docInfo.userName : '-' || '-' }}
                      </div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 5px">
                        {{ videoFollowListData.docInfo ? videoFollowListData.docInfo.professionalTitle : '-' || '-' }}
                      </div>
                    </div>

                    <div class="row-content">
                      <div style="font-size: 14px; color: #1a1a1a">
                        {{ videoFollowListData.docInfo ? videoFollowListData.docInfo.hospitalName : '-' || '-' }}
                      </div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 5px">
                        {{ videoFollowListData.docInfo ? videoFollowListData.docInfo.departmentName : '-' || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="line"></div>
                <div style="margin-left: 15px; color: #4d4d4d; font-size: 12px; margin-top: 5px">
                  套餐名称:{{
                    videoFollowListData.rightsUseRecordStatus
                      ? videoFollowListData.rightsUseRecordStatus.serviceItemName
                      : '-' || '-'
                  }}
                </div>
                <div style="margin-left: 15px; color: #4d4d4d; font-size: 12px; margin-top: 5px; margin-bottom: 5px">
                  服务时长:{{
                    videoFollowListData.rightsUseRecordStatus
                      ? videoFollowListData.rightsUseRecordStatus.serviceTime
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
                    <div class="row-content" style="padding-top: 10px">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        意向预约时间:{{
                          videoFollowListData.rightsUseRecordStatus
                            ? videoFollowListData.rightsUseRecordStatus.appointPeriod
                            : '-' || '-'
                        }}
                      </div>
                    </div>

                    <div class="colum-line"></div>
                    <div class="row-content">
                      <div class="docpoint"></div>
                      <!-- TODO 这里可能要改字段 -->
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        医生确认时间:{{
                          videoFollowListData.rightsUseRecordStatus
                            ? videoFollowListData.rightsUseRecordStatus.confirmPeriod
                            : '-' || '-'
                        }}
                      </div>
                    </div>
                    <div class="colum-line"></div>
                    <div class="row-content">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        实际视频时间:{{
                          videoListData && videoListData.length > 0 ? videoListData[0].callTime : '-' || '-'
                        }}
                      </div>
                    </div>
                    <div class="colum-line"></div>
                    <div class="row-content" style="padding-bottom: 15px">
                      <div class="docpoint"></div>
                      <div style="font-size: 12px; color: #4d4d4d; margin-left: 11px">
                        结束问诊时间:{{
                          videoListData && videoListData.length > 0 ? videoListData[0].endTime : '-' || '-'
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title">视频文件</div>
          <div class="container" style="height: 420px">
            <div v-if="!videoListData || videoListData.length === 0" style="width: 100%">
              <a-empty style="margin-top: 25%" :image="simpleImage" />
            </div>

            <div class="video-wrap" v-else>
              <!-- class="video-player vjs-custom-skin" -->
              <video-player
                style="width: 534px; height: 300px; margin: 10px 10px 0 10px"
                ref="videoPlayer"
                :playsinline="true"
                :autoplay="true"
                :loop="true"
                :options="playerOptions"
              />

              <div
                class="video-list"
                @click="onVideoClick(item)"
                v-for="(item, index) in videoListData"
                :key="index"
                :value="item"
              >
                <div class="video-list-wrap">
                  <img src="@/assets/icons/wenzhen/video.png" style="width: 15px; height: 15px" />
                  <span style="margin-left: 10px">视频文件{{ index + 1 }}</span>
                </div>
              </div>
            </div>

            <!-- <div
                v-else-if="videoListData || videoListData.length > 0"
                class="radio-content"
                v-for="(item, index) in videoListData"
                :key="index"
                :value="item"
              >
                <div style="margin-top: 18px; margin-left: 10px; margin-right: 10px">视频文件{{ index + 1 }}:</div>
                <video-player
                  class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="playerOptions"
                />
              </div> -->
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
</template>

<script>
import { info, info2, info3, list2, list4 } from '@/api/modular/system/treat'
import { preDetail } from '@/api/modular/system/posManage'
import { Empty } from 'ant-design-vue'
import moment from 'moment'
export default {
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      visible: false,
      confirmLoading: false,
      orderId: '',
      tradeId: '',
      rightsId: '',
      tab: 0,
      pageNo: 1,
      pageSize: 99999,
      item: {},
      chatItem: {},
      chatList: [],
      timeAxisList: [],
      tab1Flag: false,
      tab2Flag: false,
      tab3Flag: false,
      tab4Flag: false,
      tab5Flag: false,
      tab6Flag: false,
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
      videoFollowListData: {},
      videoListData: [
        {
          src: 'https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4',
          name: '青花瓷',
        },
        {
          src: 'https://prod-streaming-video-msn-com.akamaized.net/a8c412fa-f696-4ff2-9c76-e8ed9cdffe0f/604a87fc-e7bc-463e-8d56-cde7e661d690.mp4',
          name: '爱你一万年',
        },
      ],
      // 视频播放
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], //可选择的播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: '',
            src: 'https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4', //url地址
          },
        ],
        poster: '', //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, //当前时间和持续时间的分隔符
          durationDisplay: true, //显示持续时间
          remainingTimeDisplay: false, //是否显示剩余时间功能
          fullscreenToggle: true, //全屏按钮
        },
      },

      currentTab: 'tw',
      currentItem: 0,
      clickType: 101,
      showdhTab: true, //隐藏电话咨询tab标识
      jumbType: 3,
      id: '',
      preDetailData: {
        diagnosis: '',
        medOrderItems: [],
        medicalInfo: {},
      },
      chufangItemNo: -1,
      chufangList: [],
      chufangPreDetailData: {
        diagnosis: '',
        medOrderItems: [],
        medicalInfo: {},
      },
    }
  },
  created() {
    this.currentItem = 0
    this.currentTab = 'tw'
    this.clickType = 101

    this.visible = true

    this.tab = 5
    this.jumpType = 5

    document.title = '问诊记录'

    var url = window.location.href //获取当前url
    console.log('url:' + url)

    var dz_url = url.split('#')[0] //获取#/之前的字符串

    var cs = dz_url.split('?')[1] //获取?之后的参数字符串

    var cs_arr = cs.split('&') //参数字符串分割为数组

    var cs = {}

    for (var i = 0; i < cs_arr.length; i++) {
      //遍历数组，拿到json对象

      cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
    }

    console.log('传参:', cs) //这样就拿到了参数中的数据

    this.orderId = cs.orderId
    this.rightsId = cs.rightsId
    this.chatItem = {}
    this.chatList = []
    this.phoneFollowListData = {}

    this.getphoneRecords()
    this.getChatList()
    this.getVideoRecords()
  },
  methods: {
    tabClick(tab1) {
      if (this.tab === tab1) {
        return
      }
      this.tab = tab1
    },

    //视频咨询记录
    getVideoRecords() {
      this.confirmLoading = true
      this.timelineData = {}
      this.voiceListData = []
      // if (this.jumpType == 4) {
      list4({
        rightsId: this.rightsId,
      })
        .then((res) => {
          console.log('getVideoRecords', res.data)
          this.tab7Flag = true

          var resData = res.data || {}
          if (resData.docInfo && resData.docInfo.avatarUrl) {
            resData.docInfo.avatarUrl = this.replaceURL(resData.docInfo.avatarUrl)
          }

          if (resData.videoTapeInfo && resData.videoTapeInfo.length > 0) {
            resData.videoTapeInfo.forEach((element) => {
              element.callTape = this.replaceURL(element.callTape)
            })
          }

          this.videoFollowListData = resData
          if (this.videoFollowListData.rightsUseRecordStatus) {
            this.timelineDataVideo = this.videoFollowListData.rightsUseRecordStatus
          } else {
            this.timelineDataVideo = {}
          }

          this.videoListData = this.videoFollowListData.videoTapeInfo //TODO 这里处理视频数据
          this.playerOptions.sources[0].src = this.videoListData[0].callTape
        })
        .finally(() => {
          this.confirmLoading = false
        })
      // }
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
      } else if (
        this.chatItem.type === 'TIMCustomElem' &&
        JSON.parse(this.chatItem.payload.data).type === 'CustomChuFangMessage'
      ) {
        this.preDetailOut(JSON.parse(this.chatItem.payload.data).preNo)
      }
    },

    //处方列表点击
    onChufangItemClick(preNo) {
      this.chufangItemNo = preNo

      preDetail({ preNo: preNo }).then((res) => {
        if (res.code == 0) {
          this.chufangPreDetailData = res.data
        }
      })
    },

    previewClick(src) {
      this.previewImage = src
      this.previewVisible = true
    },

    format(date, fmt) {
      return moment(date).format(fmt)
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
        rightsId: this.rightsId,
      }).then((res) => {
        var resData = res.data || {}
        if (resData.docInfo && resData.docInfo.avatarUrl) {
          resData.docInfo.avatarUrl = this.replaceURL(resData.docInfo.avatarUrl)
        }
        this.wzInfo1 = resData
      })
    },
    getWZInfo2() {
      info2({
        rightsId: this.rightsId,
      }).then((res) => {
        var resData = res.data || {}
        if (resData.images) {
          resData.images = this.replaceURL(resData.images)
        }
        this.wzInfo2 = resData
      })
    },
    // 查询处方详情接口
    preDetailOut(preNo) {
      preDetail({ preNo: preNo }).then((res) => {
        if (res.code == 0) {
          this.preDetailData = res.data
        }
      })
    },

    //聊天记录
    getChatList() {
      this.confirmLoading = true
      list2({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        groupId: this.orderId,
      })
        .then((res) => {
          this.tab3Flag = true
          this.tab5Flag = true

          var resData = res.data.rows || []

          resData.forEach((element) => {
            element.avatar = this.replaceURL(element.avatar)
          })

          this.chatList = resData
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    //电话咨询记录
    getphoneRecords() {
      this.confirmLoading = true
      this.timelineData = {}
      this.voiceListData = []

      list4({
        rightsId: this.rightsId,
      })
        .then((res) => {
          this.tab4Flag = true
          var resData = res.data || {}
          if (resData.docInfo && resData.docInfo.avatarUrl) {
            resData.docInfo.avatarUrl = this.replaceURL(resData.docInfo.avatarUrl)
          }
          if (resData.voiceTapeInfo && resData.voiceTapeInfo.length > 0) {
            resData.voiceTapeInfo.forEach((element) => {
              element.callTape = this.replaceURL(element.callTape)
            })
          }
          this.phoneFollowListData = resData

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

    //处理替换URL地址
    replaceURL(url) {
      //192.168.1.121:8089
      //172.16.38.4:8088
      return url
        .replace('https://develop.mclouds.org.cn', 'http://192.168.1.121:8089')	
        .replace('http://develop.mclouds.org.cn:8009', 'http://192.168.1.121:8089')	
        .replace('https://hmg.mclouds.org.cn', 'http://192.168.1.121:8089')
        .replace('https://ys.mclouds.org.cn', 'http://192.168.1.121:8089')
    },

    handleCancel() {
      this.visible = false
      this.voiceListData = []
      this.confirmLoading = false
      this.tab1Flag = false
      this.tab2Flag = false
      this.tab3Flag = false
      this.tab4Flag = false
      this.tab5Flag = false
      this.tab6Flag = false
      this.tab76Flag = false
      this.chufangItemNo = -1
      this.previewVisible = false
      this.tab = 0
    },

    onVideoClick(item) {
      this.playerOptions.sources[0].src = item.callTape
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
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  .tabs {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
    margin-top: 20px;
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
      &.tab5 {
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
          .row {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .item {
              width: 33.33%;
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
          height: 80vh;
          overflow-y: auto;
          border: 1px solid #dfe3e5;

          .top-content {
            width: 535px;
            height: 120px;
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

        .video-wrap {
          width: 100%;
          // height: 300px;
          font-size: 12px;

          color: #409eff;
          .video-list {
            padding: 5px;
            margin-top: 10px;
            border: 1px solid #409eff;
            margin: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;

            &:hover {
              cursor: pointer;
            }
            // justify-content: center;
            .video-list-wrap {
              margin-left: 42%;
              display: flex;
              flex-direction: row;
              align-items: center;
            }
          }
        }
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
          height: 80vh;
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
          .chufang {
            padding: 10px;

            .big-kuang {
              margin-bottom: 10px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              color: #1a1a1a;

              .line-content {
                width: 100%;
                height: 1px;
                margin-right: 10px;
                margin-right: 10px;
                background: #e6e6e6;
              }

              .user-content {
                margin-left: 10px;
                margin-right: 40px;
                margin-top: 10px;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;
              }

              .top-content {
                margin-top: 10px;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .span-gray {
                  padding: 2px 7px;
                  font-size: 12px;
                  margin-left: auto;
                  margin-right: 20px;
                  color: #4d4d4d;
                  border: #4d4d4d 1px solid;
                  border-radius: 4px;
                }
              }
            }

            .span-mid-title {
              width: 100%;
              display: inline-block;
              color: #4d4d4d;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 10px;
            }
            .span-mid-audio {
              position: absolute;

              left: 26%;

              top: 35px;

              z-index: 10000;
            }
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

    &.content5 {
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
          height: 80vh;
          overflow-y: auto;
          border: 1px solid #dfe3e5;

          .chufangitem {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            border-bottom: 1px solid #e6e6e6;
            cursor: pointer;
            .msg {
              width: 13px;
              height: 16px;
              margin-right: 10px;
            }
            .cftitle {
              font-size: 12px;
              font-weight: 400;
              color: #4d4d4d;
            }
            .cftitle-active {
              font-size: 12px;
              font-weight: 400;
              color: #409eff;
            }
            .right {
              font-size: 12px;
              margin-left: auto;
              font-weight: 400;
              color: #4d4d4d;
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
          height: 80vh;
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
          .chufang {
            padding: 10px;

            .big-kuang {
              margin-bottom: 10px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              color: #1a1a1a;

              .line-content {
                width: 100%;
                height: 1px;
                margin-right: 10px;
                margin-right: 10px;
                background: #e6e6e6;
              }

              .user-content {
                margin-left: 10px;
                margin-right: 40px;
                margin-top: 10px;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;
              }

              .top-content {
                margin-top: 10px;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .span-gray {
                  padding: 2px 7px;
                  font-size: 12px;
                  margin-left: auto;
                  margin-right: 20px;
                  color: #4d4d4d;
                  border: #4d4d4d 1px solid;
                  border-radius: 4px;
                }
              }
            }

            .span-mid-title {
              width: 100%;
              display: inline-block;
              color: #4d4d4d;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 10px;
            }
            .span-mid-audio {
              position: absolute;

              left: 26%;

              top: 35px;

              z-index: 10000;
            }
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

