<template>
  <a-spin :spinning="confirmLoading">
    <div class="wrap-upload">
      <div class="btn-back" @click="goBack">返回</div>

      <div class="btn-out" v-if="!isAllUploaded" @click="goReUpload">重新上传</div>
      <div class="btn-out-disabled" v-else>重新上传</div>
      <!-- <div class="btn-out-disabled" >重新上传</div> -->

      <div class="wrap-info" style="margin-top: 20px">
        <div class="info-per">
          <div>姓名：{{ item.userName }}</div>
          <div class="shu-line"></div>
          <div>性别：{{ item.sex }}</div>
          <div class="shu-line"></div>
          <div>年龄：{{ item.age }}</div>
          <div class="shu-line"></div>
          <div>联系方式：{{ item.userPhone }}</div>
        </div>
      </div>

      <div class="wrap-info">
        <div class="info-per">
          <div>机构：{{ item.hospitalName }}</div>
          <div class="shu-line"></div>
          <div>服务医生：{{ item.doctorName }}</div>
          <div class="shu-line"></div>
          <div>业务类型：{{ item.broadClassifyName }}</div>
          <div class="shu-line"></div>
          <div>服务时间：{{ item.serviceTime }}</div>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">预约信息</div>
          <div class="card-status" v-if="regData.baseInfo.uploadStatus == '已上传'">
            {{ regData.baseInfo.uploadStatus }}
          </div>
          <div v-else class="card-status-red">{{ regData.baseInfo.uploadStatus }}</div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <div class="wrap-hor">
            <div class="hor-half">
              <div class="in-half">预约流水的号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">预约科室：</div>
              <div>{{ regData.baseInfo.deptName }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">开展业务类型：</div>
              <div>{{ regData.baseInfo.classify }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">预约状态：</div>
              <div>{{ regData.baseInfo.preStatus }}</div>
            </div>
          </div>

          <div class="wrap-hor" style="margin-top: 20px">
            <div class="hor-half">
              <div class="in-half">就诊时间：</div>
              <div>{{ regData.baseInfo.execDate }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">预约金额：</div>
              <div>{{ regData.baseInfo.price }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">退号时间：</div>
              <div>{{ regData.baseInfo.refundDate || '' }}</div>
            </div>
            <!-- <div class="hor-half">
              <div class="in-half">开展业务类型：</div>
              <div>{{ regData.broadClassifyName }}</div>
            </div> -->
          </div>

          <div style="background-color: #e6e6e6; height: 1px; margin-top: 10px"></div>

          <div class="bottom-content">
            <div style="margin-bottom: 10px">上传记录：</div>
            <a-timeline>
              <a-timeline-item
                v-for="(itemChild, indexChild) in regData.uploadRecord"
                :key="indexChild"
                :value="itemChild.id"
                >{{ itemChild.createTime }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  itemChild.uploadStatus == 1 ? '上传成功' : '上传失败'
                }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ itemChild.uploadReturn.msg }}</a-timeline-item
              >
            </a-timeline>
            <div style="margin-bottom: 10px" v-if="regData.uploadRecord.length == 0">无</div>
          </div>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">在线咨询</div>
          <div class="card-status" v-if="consultData.baseInfo.uploadStatus == '已上传'">
            {{ consultData.baseInfo.uploadStatus }}
          </div>
          <div v-else class="card-status-red">{{ consultData.baseInfo.uploadStatus }}</div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <div class="wrap-hor">
            <div class="hor-half">
              <div class="in-half">咨询流水的号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">咨询科室：</div>
              <div>{{ consultData.baseInfo.deptName }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">咨询类别：</div>
              <div>{{ consultData.baseInfo.broadClassify }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">咨询属性：</div>
              <div>{{ consultData.baseInfo.classify }}</div>
            </div>
          </div>

          <div class="wrap-hor" style="margin-top: 20px">
            <div class="hor-half">
              <div class="in-half">咨询日期：</div>
              <div>{{ consultData.baseInfo.execDate }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">咨询价格：</div>
              <div>{{ consultData.baseInfo.price }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">咨询是否回复：</div>
              <div>{{ consultData.baseInfo.answer }}</div>
            </div>
          </div>

          <div style="background-color: #e6e6e6; height: 1px; margin-top: 10px"></div>

          <div class="bottom-content">
            <div style="margin-bottom: 10px">上传记录：</div>
            <a-timeline>
              <a-timeline-item
                v-for="(itemChild, indexChild) in consultData.uploadRecord"
                :key="indexChild"
                :value="itemChild.id"
                >{{ itemChild.createTime }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  itemChild.uploadStatus == 1 ? '上传成功' : '上传失败'
                }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ itemChild.uploadReturn.msg }}</a-timeline-item
              >
            </a-timeline>
            <div style="margin-bottom: 10px" v-if="consultData.uploadRecord.length == 0">无</div>
          </div>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">在线复诊</div>
          <div class="card-status" v-if="regConsultData.baseInfo.uploadStatus == '已上传'">
            {{ regConsultData.baseInfo.uploadStatus }}
          </div>
          <div v-else class="card-status-red">{{ regConsultData.baseInfo.uploadStatus }}</div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <div class="wrap-hor">
            <div class="hor-half">
              <div class="in-half">复诊流水的号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">咨询科室：</div>
              <div>{{ regConsultData.baseInfo.deptName }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">复诊类别：</div>
              <div>{{ regConsultData.baseInfo.classify }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">诊断名称：</div>
              <div>{{ regConsultData.baseInfo.ggg || '' }}</div>
            </div>
          </div>

          <div class="wrap-hor" style="margin-top: 20px">
            <div class="hor-half">
              <div class="in-half">咨询日期：</div>
              <div>{{ regConsultData.baseInfo.execDate }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">复诊价格：</div>
              <div>{{ regConsultData.baseInfo.price }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">复诊是否回复：</div>
              <div>{{ regConsultData.baseInfo.answer }}</div>
            </div>
            <!-- <div class="hor-half">
              <div class="in-half">开展业务类型：</div>
              <div>{{ regConsultData.baseInfo.price }}</div>
            </div> -->
          </div>

          <div style="background-color: #e6e6e6; height: 1px; margin-top: 10px"></div>

          <div class="bottom-content">
            <div style="margin-bottom: 10px">上传记录：</div>
            <a-timeline>
              <a-timeline-item
                v-for="(itemChild, indexChild) in regConsultData.uploadRecord"
                :key="indexChild"
                :value="itemChild.id"
                >{{ itemChild.createTime }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  itemChild.uploadStatus == 1 ? '上传成功' : '上传失败'
                }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ itemChild.uploadReturn.msg }}</a-timeline-item
              >
            </a-timeline>
            <div style="margin-bottom: 10px" v-if="regConsultData.uploadRecord.length == 0">无</div>
          </div>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">处方信息</div>
          <div class="">
            处方数：{{ preSaveData.baseInfo.total }}，已上传：{{ preSaveData.baseInfo.success }}，未上传{{
              preSaveData.baseInfo.fail
            }}
          </div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <a-table :columns="columnsChufang" :data-source="preSaveData.preList">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="action" slot-scope="text, record">
              <a class="ant-dropdown-link" @click="goRecord(record)">上传记录</a>
            </span>
          </a-table>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">处方核销</div>
          <div class="">
            处方数：{{ preCancelData.baseInfo.total }}，已上传：{{ preCancelData.baseInfo.success }}，未上传{{
              preCancelData.baseInfo.fail
            }}
          </div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <a-table :columns="columnsHexiao" :data-source="preCancelData.preList">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="action" slot-scope="text, record">
              <a class="ant-dropdown-link" @click="goRecord(record)">上传记录</a>
            </span>
          </a-table>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">收费信息</div>
          <div class="">
            处方数：{{ feeData.baseInfo.total }}，已上传：{{ feeData.baseInfo.success }}，未上传{{
              feeData.baseInfo.fail
            }}
          </div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <a-table :columns="columnsFee" :data-source="feeData.preList">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="action" slot-scope="text, record">
              <a class="ant-dropdown-link" @click="goRecord(record)">上传记录</a>
            </span>
          </a-table>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">服务评价</div>
          <div class="card-status" v-if="appraiseData.baseInfo.uploadStatus == '已上传'">
            {{ appraiseData.baseInfo.uploadStatus }}
          </div>
          <div v-else class="card-status-red">{{ appraiseData.baseInfo.uploadStatus }}</div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <div class="wrap-hor">
            <div class="hor-half">
              <div class="in-half">业务流水号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">业务类型：</div>
              <div>{{ appraiseData.baseInfo.classify }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">综合评分：</div>
              <div>{{ appraiseData.baseInfo.pf }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">服务质量评分：</div>
              <div>{{ appraiseData.baseInfo.fwzlpf }}</div>
            </div>
          </div>

          <div class="wrap-hor" style="margin-top: 20px">
            <div class="hor-half">
              <div class="in-half">服务态度评分：</div>
              <div>{{ appraiseData.baseInfo.fwtdpf }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">系统使用评分：</div>
              <div>{{ appraiseData.baseInfo.xtsypf }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">评价内容：</div>
              <div>{{ appraiseData.baseInfo.pjnr }}</div>
            </div>
            <div class="hor-half">
              <div class="in-half">评价时间：</div>
              <div>{{ appraiseData.baseInfo.pjsj }}</div>
            </div>
          </div>

          <div style="background-color: #e6e6e6; height: 1px; margin-top: 10px"></div>

          <div class="bottom-content">
            <div style="margin-bottom: 10px">上传记录：</div>
            <a-timeline>
              <a-timeline-item
                v-for="(itemChild, indexChild) in appraiseData.uploadRecord"
                :key="indexChild"
                :value="itemChild.id"
                >{{ itemChild.createTime }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  itemChild.uploadStatus == 1 ? '上传成功' : '上传失败'
                }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ itemChild.uploadReturn.msg }}</a-timeline-item
              >
            </a-timeline>
            <div style="margin-bottom: 10px" v-if="appraiseData.uploadRecord.length == 0">无</div>
          </div>
        </div>
      </div>
      <edit-form ref="editForm" />
    </div>
  </a-spin>
</template>

<script>
import {
  saveGoodsClass,
  getDepts,
  getPreUploadLogByOrderIdAndType,
  getUploadLogByOrderIdAndType,
  reUpload,
} from '@/api/modular/system/posManage'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import editForm from './editForm'

export default {
  components: { editForm },

  data() {
    return {
      // item: {
      //   id: 57,
      //   broadClassifyName: '咨询服务类',
      //   rightsId: '708',
      //   orderId: '1648592815308070914',
      //   userId: 1841,
      //   userName: '沈峰',
      //   userPhone: '13574111026',
      //   createTime: '2023-06-09 14:17:05',
      //   uploadUserId: null,
      //   uploadUserName: null,
      //   uploadTime: '',
      //   eventType: '评价自动生成不良事件',
      //   eventDesc: '服务评价低于三星',
      //   eventReason: '医生回复超快，解答详细，医术高明。哈哈哈哈哈',
      //   eventDeal: null,
      //   eventLevel: null,
      //   eventImprove: null,
      //   status: 3,
      //   uploadFlag: null,
      //   tenantId: '100000',
      //   hospitalCode: '444885559',
      //   hospitalName: '湘雅二医院',
      //   sex: '男',
      //   age: '28',
      //   statusText: '未登记',
      // },
      confirmLoading: false,
      columnsChufang: [
        {
          title: '处方号',
          dataIndex: 'cfh',
          key: 'cfh',
          scopedSlots: { customRender: 'cfh' },
        },
        {
          title: '处方类型',
          dataIndex: 'cflx',
          key: 'cflx',
          // width: 80,
        },
        {
          title: '业务类型',
          dataIndex: 'ywlx',
          key: 'ywlx',
          ellipsis: true,
        },
        {
          title: '诊断名称',
          dataIndex: 'zdmc',
          key: 'zdmc',
          ellipsis: true,
        },
        {
          title: '开方日期',
          dataIndex: 'kfrq',
          key: 'kfrq',
          ellipsis: true,
        },
        {
          title: '处方金额',
          dataIndex: 'cfje',
          key: 'cfje',
          ellipsis: true,
        },
        {
          title: '是否支付',
          dataIndex: 'sfzf',
          key: 'sfzf',
          ellipsis: true,
        },
        {
          title: '上传状态',
          dataIndex: 'uploadStatus',
          key: 'uploadStatus',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columnsHexiao: [
        {
          title: '处方号',
          dataIndex: 'preNo',
          key: 'preNo',
          scopedSlots: { customRender: 'preNo' },
        },
        {
          title: '处方核销方式',
          dataIndex: 'hxfs',
          key: 'hxfs',
          // width: 80,
        },
        {
          title: '物流公司',
          dataIndex: 'psgsmc',
          key: 'psgsmc',
          ellipsis: true,
        },
        {
          title: '配送单号',
          dataIndex: 'psdh',
          key: 'psdh',
          ellipsis: true,
        },
        {
          title: '配送日期',
          dataIndex: 'pskssj',
          key: 'pskssj',
          ellipsis: true,
        },
        {
          title: '上传状态',
          dataIndex: 'uploadStatus',
          key: 'uploadStatus',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      columnsFee: [
        {
          title: '业务流水号',
          dataIndex: 'orderId',
          key: 'orderId',
          scopedSlots: { customRender: 'orderId' },
        },
        {
          title: '业务咨询类型',
          dataIndex: 'ywlx',
          key: 'ywlx',
          // width: 80,
        },
        {
          title: '处方数',
          dataIndex: 'cfs',
          key: 'cfs',
          ellipsis: true,
        },
        {
          title: '挂号费',
          dataIndex: 'ghf',
          key: 'ghf',
          ellipsis: true,
        },
        {
          title: '在线咨询费',
          dataIndex: 'zxzxf',
          key: 'zxzxf',
          ellipsis: true,
        },
        {
          title: '在线复诊费',
          dataIndex: 'zxzlf',
          key: 'zxzlf',
          ellipsis: true,
        },
        {
          title: '西药费',
          dataIndex: 'address',
          key: 'adfgdress 3',
          ellipsis: true,
        },
        {
          title: '上传状态',
          dataIndex: 'xyf',
          key: 'xyf',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      data: [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 2 Lake Park, London No. 2 Lake Park',
          tags: ['loser'],
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
          tags: ['cool', 'teacher'],
        },
      ],

      item: {},

      regData: [], //预约信息
      consultData: [], //咨询上传记录
      regConsultData: [], //复诊咨询上传记录
      isAllUploaded: true, //7个板块都上传完成才不需要重新上传

      preSaveData: [], //处方上传记录
      preCancelData: [], //处方核销上传记
      feeData: [], //收费上传记录

      appraiseData: [], //评价上传记录
    }
  },

  watch: {
    visible() {},
  },

  created() {
    // this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    this.item = JSON.parse(this.$route.query.recordStr)
    this.getRegData()
    this.getConsultData()
    this.getRegConsultData()

    this.getPreSaveData()
    this.getPreCancelData()
    this.getFeeData()

    this.getAppraiseData()
  },

  methods: {
    //返回
    goBack() {
      this.$router.go(-1)
      // this.$router.back()
    },

    goRecord(record) {
      this.$refs.editForm.edit(record)
    },

    goReUpload() {
      reUpload({ orderId: this.item.orderId })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.isAllUploaded = true
            this.getRegData()
            this.getConsultData()
            this.getRegConsultData()

            this.getPreSaveData()
            this.getPreCancelData()
            this.getFeeData()

            this.getAppraiseData()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    getRegData() {
      // 上传类型1预约2咨询3复诊7评价
      getUploadLogByOrderIdAndType({ orderId: this.item.orderId, type: 1 }).then((res) => {
        // getUploadLogByOrderIdAndType({ orderId: this.item.orderId, type: 4 }).then((res) => {
        if (res.code == 0) {
          this.regData = res.data
          if (this.regData.baseInfo.uploadStatus == '未上传') {
            this.isAllUploaded = false
          }
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    getConsultData() {
      // 上传类型1预约2咨询3复诊7评价
      getUploadLogByOrderIdAndType({ orderId: this.item.orderId, type: 2 }).then((res) => {
        if (res.code == 0) {
          this.consultData = res.data
          if (this.consultData.baseInfo.uploadStatus == '未上传') {
            this.isAllUploaded = false
          }
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    getRegConsultData() {
      // 上传类型1预约2咨询3复诊7评价
      getUploadLogByOrderIdAndType({ orderId: this.item.orderId, type: 3 }).then((res) => {
        if (res.code == 0) {
          this.regConsultData = res.data
          if (this.regConsultData.baseInfo.uploadStatus == '未上传') {
            this.isAllUploaded = false
          }
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    getAppraiseData() {
      // 上传类型1预约2咨询3复诊7评价
      getUploadLogByOrderIdAndType({ orderId: this.item.orderId, type: 7 }).then((res) => {
        if (res.code == 0) {
          this.appraiseData = res.data
          if (this.appraiseData.baseInfo.uploadStatus == '未上传') {
            this.isAllUploaded = false
          }
          // this.appraiseData.uploadRecord.push({
          //   time: '2023-01-23',
          //   result: '上传失败',
          //   des: '网络错误',
          // })
          // this.appraiseData.uploadRecord.push({
          //   time: '2023-01-23',
          //   result: '上传失败',
          //   des: '无网络',
          // })
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    getPreSaveData() {
      // 上传类型4处方5核销6收费
      getPreUploadLogByOrderIdAndType({ orderId: this.item.orderId, type: 4 }).then((res) => {
        if (res.code == 0) {
          this.preSaveData = res.data
          this.preSaveData.preList.forEach((element) => {
            this.$set(element, 'orderId', this.item.orderId)
          })
          if (this.preSaveData.baseInfo.total != this.preSaveData.baseInfo.success) {
            this.isAllUploaded = false
          }
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    getPreCancelData() {
      // 上传类型4处方5核销6收费
      getPreUploadLogByOrderIdAndType({ orderId: this.item.orderId, type: 5 }).then((res) => {
        if (res.code == 0) {
          this.preCancelData = res.data
          this.preCancelData.preList.forEach((element) => {
            this.$set(element, 'orderId', this.item.orderId)
          })
          if (this.preCancelData.baseInfo.total != this.preCancelData.baseInfo.success) {
            this.isAllUploaded = false
          }
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    getFeeData() {
      // 上传类型4处方5核销6收费
      getPreUploadLogByOrderIdAndType({ orderId: this.item.orderId, type: 6 }).then((res) => {
        if (res.code == 0) {
          this.feeData = res.data
          this.feeData.preList.forEach((element) => {
            this.$set(element, 'orderId', this.item.orderId)
          })
          if (this.feeData.baseInfo.total != this.feeData.baseInfo.success) {
            this.isAllUploaded = false
          }
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.wrap-upload {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  font-size: 12px;

  .btn-back {
    display: inline-block;
    padding: 5px 20px;
    color: #409eff;
    background-color: white;
    border: 1px solid #409eff;
    border-radius: 2px;
    &:hover {
      cursor: pointer;
    }
  }
  .btn-out {
    display: inline-block;
    padding: 5px 20px;
    color: white;
    background-color: #409eff;
    border: 1px solid #409eff;
    border-radius: 2px;
    position: absolute;
    top: 72px;
    right: 20px;
    font-size: 12px;
    &:hover {
      cursor: pointer;
    }
  }
  .btn-out-disabled {
    display: inline-block;
    padding: 5px 20px;
    color: #999;
    background-color: #e6e6e6;
    border: 1px solid #999;
    border-radius: 2px;
    position: absolute;
    top: 72px;
    right: 20px;
    font-size: 12px;
  }

  .wrap-info {
    .info-per {
      display: flex;
      flex-direction: row;
      align-items: center;

      .shu-line {
        margin: 0 8px;
        height: 10px;
        width: 1px;
        background-color: #999;
      }
    }
  }

  .div-card {
    display: flex;
    margin-top: 20px;
    flex-direction: column;
    border: 1px solid #e6e6e6;
    border-radius: #e6e6e6;

    .card-top {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px 20px;

      .cart-title {
        font-weight: bold;
        flex: 1;
        font-size: 14px;
        color: #1a1a1a;
      }

      .card-status {
        display: inline-block;
        padding: 5px 20px;
        color: white;
        background-color: #409eff;
        border: 1px solid #409eff;
        border-radius: 2px;
      }
      .card-status-red {
        display: inline-block;
        padding: 5px 20px;
        color: white;
        background-color: #fb2929;
        border: 1px solid #fb2929;
        border-radius: 2px;
      }
    }

    .div-divider {
      background-color: #e6e6e6;
      height: 1px;
    }

    .card-bottom {
      display: flex;
      flex-direction: column;
      padding: 10px 20px 0 20px;
      .wrap-hor {
        display: flex;
        flex-direction: row;
        align-items: center;

        .hor-half {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 25%;

          .in-half {
            width: 90px;
            text-align: right;
          }
        }
      }

      .bottom-content {
        display: flex;
        flex-direction: row;
        margin-top: 15px;

        .ant-timeline-item {
          padding-bottom: 10px !important;
        }

        // .ant-timeline-item-last > .ant-timeline-item-content {
        //   min-height: 0 !important;
        // }
      }
    }
  }

  /deep/ .ant-timeline-item-last > .ant-timeline-item-content {
    min-height: 0 !important;
  }
}
</style>
