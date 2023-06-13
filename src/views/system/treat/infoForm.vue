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
          <div   class="tab tab1" :class="{ active: tab === 1 }" @click="tabClick(1)">
            <img src="@/assets/icons/wenzhen/tab11.png" v-if="tab === 1" />
            <img src="@/assets/icons/wenzhen/tab1.png" v-else />
            <span>订单信息</span>
          </div>
         
          <div class="tab tab2" :class="{ active: tab === 2 }" @click="tabClick(2)">
            <img src="@/assets/icons/wenzhen/tab22.png" v-if="tab === 2" />
            <img src="@/assets/icons/wenzhen/tab2.png" v-else />
            <span>病历资料</span>
          </div>
          <div v-show="jumpType == 3" class="tab tab3" :class="{ active: tab === 3 }" @click="tabClick(3)">
            <img src="@/assets/icons/wenzhen/tab33.png" v-if="tab === 3" />
            <img src="@/assets/icons/wenzhen/tab3.png" v-else />
            <span>聊天记录</span>
          </div>

          <div v-show="jumpType != 3" class="tab tab5" :class="{ active: tab === 5 }" @click="tabClick(5)">
            <img src="@/assets/icons/wenzhen/tab33.png" v-if="tab === 5" />
            <img src="@/assets/icons/wenzhen/tab3.png" v-else />
            <span>聊天记录</span>
          </div>

          <div v-show="jumpType != 3" class="tab tab4" :class="{ active: tab === 4 }" @click="tabClick(4)">
            <img src="@/assets/icons/wenzhen/phone_n2.png" v-if="tab === 4" />
            <img src="@/assets/icons/wenzhen/phone_n.png" v-else />
            <span>电话记录</span>
          </div>
          <div  class="tab tab5" :class="{ active: tab === 6 }" @click="tabClick(6)">
            <img src="@/assets/icons/wenzhen/chuf.png" v-if="tab === 6" />
            <img src="@/assets/icons/wenzhen/chuf1.png" v-else />
            <span>处方记录</span>
          </div>
        </div>
     
        <div class="content content1" v-show="tab === 1">
          <div class="top">
            <div class="title">基本信息</div>
            <div class="infos">
              <div class="row">
                <div class="item">订单号：{{ tab1Info.orderId || '--' }}</div>
                <div class="item">套餐类型：{{ tab1Info.classifyName || '--' }}</div>
                <div class="item">套餐名称：{{ tab1Info.commodityName || '--' }}</div>
              </div>
             
            </div>
            <div class="infos">
              <div class="row">
                <div class="item">所属医院：{{ tab1Info.hospitalName || '--' }}</div>
                <div class="item">下单时间：{{ tab1Info.createTime || '--' }}</div>
                <div class="item">
                  订单状态：<span class="ing">{{ (tab1Info.status || {}).description || '--' }}</span>
                </div>
              </div>
             
            </div>
            <div class="infos">
              <div class="row">
                <div class="item">用户姓名：{{ tab1Info.userName || '--' }}</div>
                <div class="item">联系方式：{{ tab1Info.phone || '--' }}</div>
                <div class="item">&nbsp;</div>
              </div>           
            </div>
            <div class="infos">
              <div class="row">
                <div class="item">实付金额：{{ tab1Info.payTotal || '--' }}</div>
                <div class="item">
                  套餐包服务时间：{{ tab1Info.effectiveStartTime || '--' }} - {{ tab1Info.effectiveEndTime || '--' }}
                </div>
                <div class="item">&nbsp;</div>
              </div>           
            </div>
            <div class="infos">
              <div class="row">
                <div class="item">服务医生：{{ tab1Info.doctorUserName || '--' }}</div>
                <div v-if="jumpType != 6" class="item">服务护士：{{ tab1Info.nurseUserName || '--' }}</div>
                <div  v-if="jumpType != 6" class="item" :title="tab1Info.teamName || '--'">服务团队：{{ tab1Info.teamName || '--' }}</div>
                <div v-if="jumpType == 6" class="item" style="width:66.66%;display: flex;flex-direction: row;">
                  <div >处方订单号：</div>
                <div v-for="(item,index) in tab1Info.preOrderIds" style="  cursor: pointer; color:#409eff;word-wrap:break-word;word-break:break-all;white-space:pre-wrap;" @click="onTab1ChufangClick(item)"  >{{index !=0?' ，':''}}{{ item }} </div>
                </div>
              </div>           
            </div>
            <div class="infos">
              <div class="row">
                <div class="item">退款单号：{{ tab1Info.refundId || '--' }}</div>
                <div class="item">退款时间：{{ tab1Info.refundTime || '--' }}</div>
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
            <div class="timeLine">
              <div style="margin-left: 10px; margin-top: 5px; margin-bottom: 5px; color: #4d4d4d; font-size: 12px">
                咨询记录:
              </div>
              <div
                class="itemTime"
                v-for="(item, index) in timeAxisList"
                :key="item.id"
                :class="{ 'checked-btntime': currentItem == index }"
                @click="clickTime(index, item)"
              >
                <div class="rowTime">
                  <span
                    style="margin-left: 10px; margin-top: 5px; color: {currentItem == index?#4d4d4d:blue}; font-size: 12px"
                  >
                    {{
                      item.serviceItemType == 101
                        ? item.createdTime.substring(0, 10)
                        : item.appointTime.substring(0, 10)
                    }}
                  </span>
                  <!-- 最后一根横线不显示 -->
                  <div v-if="timeAxisList.length - index > 1" class="rowLine"></div>
                </div>
                <span style="margin-left: 10px; margin-top: 5px; {currentItem == index?#4d4d4d:blue}; font-size: 12px">
                  {{ item.serviceItemName }}
                </span>
              </div>
            </div>

            <div class="recordType">
              <div :class="{ 'checked-btn': currentTab == 'tw' }" @click="checketab('tw')">
                <span>图文咨询记录</span>
              </div>
              <div
                v-if="showdhTab"
                :class="{ 'checked-btn': currentTab == 'dh' }"
                style="margin-left: 15px"
                @click="checketab('dh')"
              >
                <span>电话咨询记录</span>
              </div>
            </div>

            <div v-if="clickType == 101" class="title">问诊记录</div>
            <div v-if="clickType == 101" class="list">
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
          <div v-if="clickType == 101" class="chat-detail">
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

                  <div style="margin-left: 43%; margin-top: 10px;margin-bottom: 20px;">{{ preDetailData.medicalInfo.preTitle }}</div>
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
                  <div
                    style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold"
                  >
                    诊断
                  </div>
                  <div class="line-content"></div>
                  <div style="margin-left: 10px; margin-top: 5px; margin-bottom: 5px">
                    {{ preDetailData.diagnosis }}
                  </div>
                </div>

                <div class="big-kuang">
                  <div
                    style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold"
                  >
                    RP
                  </div>
                  <div
                    style="width: 100%; height: 1px; margin-right: 10px; margin-right: 10px; background: #E6E6E6"
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
                  <div
                    style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold"
                  >
                    签字盖章
                  </div>
                  <div class="line-content"></div>

                  <div style="margin-left: 10px">开发医生：{{ preDetailData.medicalInfo.doctorName }}</div>
                  <div style="margin-left: 10px; margin-bottom: 10px">
                    执行科室：{{ preDetailData.medicalInfo.deptName }}
                  </div>
                </div>
                <div style="margin-left: 10px; color: #999999; font-size: 1em">特别提示：</div>
                <div style="margin-left: 10px;color: #999999; font-size: 1em">1、本次处方仅限于中南大学湘雅二医院互联网医院使用，自行下载配药不具有处方效力。</div>
                <div style="margin-left: 10px;color: #999999; font-size: 1em">2、按照卫生部、国家中医药管理局卫医政发【2011】11号文件规定：为保证患者用药安全，药
品一经发出，不得退换</div>
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

          <div v-if="clickType == 102" class="content content4" style="margin-left: -50%; margin-top: 97px">
            <div v-if="clickType == 102" class="left">
              <div class="title">基本信息</div>
              <div class="list">
                <!-- <a-empty style="margin-top: 150px" :image="simpleImage" v-if="phoneFollowListData.length === 0" /> -->

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
            <div v-if="clickType == 102" class="right">
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
        </div>

        <div class="content content4" v-show="tab === 4">
          <div class="left">
            <div class="title">基本信息</div>
            <div class="list">
              <!-- <a-empty style="margin-top: 150px" :image="simpleImage" v-if="phoneFollowListData.length === 0" /> -->

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

                  <div style="margin-left: 43%; margin-top: 10px;margin-bottom: 20px;">{{ preDetailData.medicalInfo.preTitle }}</div>
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
                  <div
                    style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold"
                  >
                    诊断
                  </div>
                  <div class="line-content"></div>
                  <div style="margin-left: 10px; margin-top: 5px; margin-bottom: 5px">
                    {{ preDetailData.diagnosis }}
                  </div>
                </div>

                <div class="big-kuang">
                  <div
                    style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold"
                  >
                    RP
                  </div>
                  <div
                    style="width: 100%; height: 1px; margin-right: 10px; margin-right: 10px; background: #E6E6E6"
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
                  <div
                    style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold"
                  >
                    签字盖章
                  </div>
                  <div class="line-content"></div>

                  <div style="margin-left: 10px">开发医生：{{ preDetailData.medicalInfo.doctorName }}</div>
                  <div style="margin-left: 10px; margin-bottom: 10px">
                    执行科室：{{ preDetailData.medicalInfo.deptName }}
                  </div>
                </div>
                <div style="margin-left: 10px; color: #999999; font-size: 1em">特别提示：</div>
                <div style="margin-left: 10px;color: #999999; font-size: 1em">1、本次处方仅限于中南大学湘雅二医院互联网医院使用，自行下载配药不具有处方效力。</div>
                <div style="margin-left: 10px;color: #999999; font-size: 1em">2、按照卫生部、国家中医药管理局卫医政发【2011】11号文件规定：为保证患者用药安全，药
品一经发出，不得退换</div>
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


        <div class="content content5" v-show="tab === 6">
          <div class="chat">
            <div class="title">历史处方</div>
            <div class="list">
              <a-empty style="margin-top: 150px" :image="simpleImage" v-if="chufangList.length === 0" />
              <template v-for="(item,index) in chufangList" v-else>
                <div class="chufangitem" @click="onChufangItemClick(item.preNo)">
                  <img class="msg" src="@/assets/icons/wenzhen/chufang-2.png"/>                  
                  <div :class="chufangItemNo==item.preNo?'cftitle-active':'cftitle' " >{{item.diagnosis}}</div>
                  <div class="right">{{item.createDate}}</div>
                </div>
              </template>
              
            </div>
          </div>
          <div class="chat-detail">
            <div class="title">内容详情（<span>点击左侧内容在此查看详情</span>）</div>
            <div class="container">
              <a-empty style="margin-top: 150px" :image="simpleImage" v-if="chufangItemNo==-1" />
              <div
                class="chufang" v-else
              >
              
                <div class="big-kuang">
                  <div class="top-content">
                    <div style="margin-left: 30%">{{ chufangPreDetailData.medicalInfo.preHead }}</div>
                    <div class="span-gray">{{ chufangPreDetailData.medicalInfo.preType }}</div>
                  </div>

                  <div style="margin-left: 43%; margin-top: 10px;margin-bottom: 20px;">{{ chufangPreDetailData.medicalInfo.preTitle }}</div>
                  <div class="user-content">
                    <div>姓名:{{ chufangPreDetailData.medicalInfo.name }}</div>
                    <div>性别:{{ chufangPreDetailData.medicalInfo.sex }}</div>
                    <div>年龄:{{ chufangPreDetailData.medicalInfo.age }}</div>
                  </div>
                  <div class="user-content" style="margin-bottom: 15px">
                    <div>科室:{{ chufangPreDetailData.medicalInfo.deptName }}</div>
                    <div>日期:{{ chufangPreDetailData.medicalInfo.createDate }}</div>
                  </div>
                </div>

                <div class="big-kuang">
                  <div
                    style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold"
                  >
                    诊断
                  </div>
                  <div class="line-content"></div>
                  <div style="margin-left: 10px; margin-top: 5px; margin-bottom: 5px">
                    {{ chufangPreDetailData.diagnosis }}
                  </div>
                </div>

                <div class="big-kuang">
                  <div
                    style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold"
                  >
                    RP
                  </div>
                  <div
                    style="width: 100%; height: 1px; margin-right: 10px; margin-right: 10px; background: #E6E6E6"
                  ></div>
                  <div v-for="(item, index) in chufangPreDetailData.medOrderItems" :key="index" :value="item.drugName">
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
                  <div
                    style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold"
                  >
                    签字盖章
                  </div>
                  <div class="line-content"></div>

                  <div style="margin-left: 10px">开发医生：{{ chufangPreDetailData.medicalInfo.doctorName }}</div>
                  <div style="margin-left: 10px; margin-bottom: 10px">
                    执行科室：{{ chufangPreDetailData.medicalInfo.deptName }}
                  </div>
                </div>
                <div style="margin-left: 10px; color: #999999; font-size: 1em">特别提示：</div>
                <div style="margin-left: 10px;color: #999999; font-size: 1em">1、本次处方仅限于中南大学湘雅二医院互联网医院使用，自行下载配药不具有处方效力。</div>
                <div style="margin-left: 10px;color: #999999; font-size: 1em">2、按照卫生部、国家中医药管理局卫医政发【2011】11号文件规定：为保证患者用药安全，药
品一经发出，不得退换</div>
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
import { info, info2, info3, info4, list2, list3, list4, qryRightsUseRecord } from '@/api/modular/system/treat'
import { preDetail,getPreListByRightsId } from '@/api/modular/system/posManage'
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
      chufangItemNo:-1,
      chufangList:[],
      chufangPreDetailData:{
        diagnosis: '',
        medOrderItems: [],
        medicalInfo: {},
      }
    }
  },
  methods: {
    // 初始化方法
    info(item, Type) {
      this.currentItem = 0
      this.currentTab = 'tw'
      this.clickType = 101
      this.id = item.id
      this.item = item
      // console.log('HAHAH：', item)
      this.visible = true
      this.jumpType = Type
      console.log('LLL:', this.jumpType)
      if (this.jumbType == 1) {
        this.tabClick(1)
      } else if (this.jumpType == 3) {
        this.tabClick(3)
      } else if (this.jumpType == 4) {
        this.tabClick(4)
      } else if (this.jumpType == 5) {
        this.tabClick(5)
      }else if (this.jumpType == 6) { //复诊续方
        this.tabClick(5)
      }
    },

    clickTime(index, item) {
      if (this.currentItem == index) {
        return
      }
      this.item = item
      this.currentItem = index
      this.clickType = item.serviceItemType
      if (item.serviceItemType == 101) {
        //图文
        this.currentTab = 'tw'
        this.showdhTab = false
        this.getChatList(item.orderId)
      } else if (item.serviceItemType == 102) {
        //电话
        this.currentTab = 'dh'
        this.showdhTab = true
        this.getphoneRecords(item)
      }
    },

    checketab(type) {
      if (this.currentTab == type) {
        return
      }
      this.currentTab = type
      if (type == 'tw') {
        this.clickType = 101
        this.getChatList(this.item.orderId)
      } else if (type == 'dh') {
        this.clickType = 102
        this.getphoneRecords(this.item)
      }
    },

    tabClick(tab1) {
      if (this.tab === tab1) {
        return
      }
      this.tab = tab1
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
        this.getChatList(this.item.orderId)
        this.getTimeData()
      }
      if (this.tab === 4 && !this.tab4Flag) {
        this.chatItem = {}
        // this.chatList = []
        this.phoneFollowListData = {}
        this.getphoneRecords(this.item)
      }

      if (this.tab === 5 && !this.tab5Flag) {
        this.chatItem = {}
        this.chatList = []
        // this.phoneFollowListData = {}
        this.getChatList(this.item.orderId)
      }
      
      if (this.tab === 6 && !this.tab6Flag) {
        this.chufangItemNo = -1
        this.chufangList = []
        
        this.getPreListByRightsIdOut(this.item.id)
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
      } else if (
        this.chatItem.type === 'TIMCustomElem' &&
        JSON.parse(this.chatItem.payload.data).type === 'CustomChuFangMessage'
      ) {
       
        this.preDetailOut(JSON.parse(this.chatItem.payload.data).preNo)
      }
    },

    //处方列表点击
    onChufangItemClick(preNo){
     
      this.chufangItemNo=preNo

      preDetail({ preNo: preNo })
        .then((res) => {
          if (res.code == 0) {
            this.chufangPreDetailData = res.data
          }
        })
    },
    onTab1ChufangClick(preOrderId){
     

      
      this.$router.push({
        path: '../order/prescriptionDetail',
        query: {
          orderId: preOrderId,
        },
      })
      
      this.handleSubmit() 
      

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
      console.log('KKK:', this.id)
      info2({
        rightsId: this.id,
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
        rightsId: this.jumpType == 3 ? this.item.rightsId : this.item.id,
      }).then((res) => {
        this.wzInfo1 = res.data || {}
      })
    },
    getWZInfo2() {
      console.log('OOO:', this.item, this.jumpType)
      info2({
        rightsId: this.jumpType == 3 ? this.item.rightsId : this.item.id,
      }).then((res) => {
        this.wzInfo2 = res.data || {}
      })
    },
    // 查询处方详情接口
    preDetailOut(preNo) {
      preDetail({ preNo: preNo })
        .then((res) => {
          if (res.code == 0) {
            this.preDetailData = res.data
          }
        })
       
    },
// 查询处方列表
getPreListByRightsIdOut(rightsId) {
  getPreListByRightsId({ rightsId:   rightsId })
        .then((res) => {
          if (res.code == 0) {
           this.tab6Flag=true
           this.chufangList=res.data
           if(res.data.length > 0){
            if(this.chufangItemNo == -1){
              this.onChufangItemClick(res.data[0].preNo)
            }
           
           }
           
          }
        })
       
    },
    //聊天记录
    getChatList(orderId) {
      this.confirmLoading = true
      list2({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        groupId: orderId,
      })
        .then((res) => {
          this.tab3Flag = true
          this.tab5Flag = true
          this.chatList = res.data.rows || []
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    //时间轴
    getTimeData() {
      this.confirmLoading = true
      qryRightsUseRecord({ rightsId: this.item.id })
        .then((res) => {
          this.tab3Flag = true
          this.timeAxisList = res.data || []
          if (this.timeAxisList && this.timeAxisList.length > 0) {
            this.item = this.timeAxisList[0]
            if (this.item.serviceItemType == 101) {
              this.showdhTab = false
              this.currentTab = 'tw'
              this.clickType = 101
              this.getChatList(this.item.orderId)
            } else {
              this.showdhTab = true
              this.currentTab = 'dh'
              this.clickType = 102
              this.getphoneRecords(this.item)
            }
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    //电话咨询记录
    getphoneRecords(item) {
      this.confirmLoading = true
      this.timelineData = {}
      this.voiceListData = []
      if (this.jumpType == 4) {
        list4({
          rightsId: item.id,
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
      } else {
        list4({
          tradeId: item.id,
          rightsId: item.rightsId,
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
      }
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
      this.tab5Flag = false
      this.tab6Flag=false
      this.tab76Flag=false
      this.chufangItemNo=-1
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
          .row{
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
    &.content3 {
      display: flex;
      justify-content: space-between;
      .chat {
        width: 556px;

        .checked-btn {
          color: #1890ff;
          border-bottom: #1890ff 2px solid;
        }
        .checked-btntime {
          color: #1890ff;
        }

        .timeLine {
          width: 1163px;
          // height: 52px;
          background: #ffffff;
          border: 1px solid #dfe3e5;
          margin-bottom: 15px;
          flex-wrap: wrap;
          display: flex;
          flex-direction: row;

          .rowLine {
            width: 32px;
            height: 1px;
            background: #cccccc;
            margin-top: 15px;
            margin-left: 10px;
          }

          .itemTime {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            &:hover {
              cursor: pointer;

              .checked-btn1 {
                color: #1890ff;
                &span {
                  color: #409eff;
                }
                // border-bottom: #1890ff 2px solid;
              }
            }

            .rowTime {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            }
          }
        }

        .recordType {
          flex-wrap: wrap;
          display: flex;
          flex-direction: row;
          margin-bottom: 10px;
          &:hover {
            cursor: pointer;
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
        }
        .list {
          height: 330px;
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
          margin-top: 94px;
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
          height: 330px;
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
              color: #1A1A1A;

              .line-content {
                width: 100%;
                height: 1px;
                margin-right: 10px;
                margin-right: 10px;
                background: #E6E6E6;
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
          height: 330px;
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
          height: 330px;
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
              color: #1A1A1A;

              .line-content {
                width: 100%;
                height: 1px;
                margin-right: 10px;
                margin-right: 10px;
                background: #E6E6E6;
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
          height: 422px;
          overflow-y: auto;
          border: 1px solid #dfe3e5;

          .chufangitem{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            border-bottom: 1px solid #e6e6e6;
            cursor: pointer;
            .msg{
              width: 13px;
              height: 16px;
              margin-right: 10px;
            }
            .cftitle{
              font-size: 12px;
              font-weight: 400;
              color: #4D4D4D;
            }
            .cftitle-active{
              font-size: 12px;
              font-weight: 400;
              color: #409EFF;
            }
            .right{
              font-size: 12px;
              margin-left: auto;
              font-weight: 400;
              color: #4D4D4D;
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
          .chufang {
            
            
            padding: 10px;
          
            

            .big-kuang {
              
             
              margin-bottom: 10px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              color: #1A1A1A;

              .line-content {
                width: 100%;
                height: 1px;
                margin-right: 10px;
                margin-right: 10px;
                background: #E6E6E6;
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
