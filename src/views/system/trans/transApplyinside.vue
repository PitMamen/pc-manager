<template>
  <a-spin :spinning="confirmLoading">
    <a-card :bordered="false">
      <!-- 基本信息 -->
      <div class="div-kuang">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">档案信息</span>
        </div>
        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505; margin-top: 3px">*</span>患者姓名：</div>
            <div class="div-cell-value">{{ patientBaseinfo.name || '' }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>身份证：</div>
            <div class="div-cell-value">{{ patientBaseinfo.identificationNo || '' }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">性别：</div>
            <div class="div-cell-value">{{ patientBaseinfo.sex || '' }}</div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>出生日期：</div>
            <div class="div-cell-value">{{ patientBaseinfo.birthday || '' }}</div>
          </div>
        </div>
        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>本人电话：</div>
            <div class="div-cell-value">{{ patientBaseinfo.contactTel }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">联系人姓名：</div>
            <div class="div-cell-value">{{ patientBaseinfo.contactor || '' }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">联系人电话：</div>
            <div class="div-cell-value">{{ patientBaseinfo.contactTel || '' }}</div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">国籍：</div>
            <div class="div-cell-value">{{ patientBaseinfo.country || '' }}</div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">民族：</div>
            <div class="div-cell-value">{{ patientBaseinfo.nation || '' }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">血型：</div>
            <div class="div-cell-value">{{ patientBaseinfo.bloodType || '' }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">RH阴性：</div>
            <div class="div-cell-value">{{ patientBaseinfo.rhFlag || '' }}</div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">文化程度：</div>
            <div class="div-cell-value">{{ patientBaseinfo.educationLevel || '' }}</div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">职业：</div>
            <div class="div-cell-value">{{ patientBaseinfo.job || '' }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">婚姻状况：</div>
            <div class="div-cell-value">{{ patientBaseinfo.marry || '' }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>常住分类：</div>
            <div class="div-cell-value">{{ patientBaseinfo.liveType || '' }}</div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">医保类型：</div>
            <div class="div-cell-value">{{ patientBaseinfo.insuranceType || '' }}</div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>户口住址：</div>
            <div class="div-cell-value">{{ patientBaseinfo.address || '' }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name" style="width: 90px"><span style="color: #f90505">*</span>户口详细地址：</div>
            <div class="div-cell-value">{{ patientBaseinfo.addressDetail || '' }}</div>
          </div>
        </div>
      </div>

      <div class="div-kuang" style="margin-top: 15px">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">疾病信息</span>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell">
            <div class="div-cell-name">病情分级：</div>
            <div class="div-cell-value">{{ dataInfo.diseaseLevel || '' }}</div>
          </div>
          <div class="div-cell" style="align-items: baseline; width: 100%">
            <div class="div-cell-name">主要诊断：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.diagnos || '' }}
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 80%">
            <div class="div-cell-name">病情描述：</div>
            <div class="div-cell-value">{{ dataInfo.diseaseDesc || '' }}</div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 80%">
            <div class="div-cell-name">治疗经过：</div>
            <div class="div-cell-value">
              {{ dataInfo.diseaseDeal || '' }}
            </div>
          </div>
        </div>
      </div>

      <div class="div-kuang" style="margin-top: 15px">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">转诊信息</span>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>转入机构：</div>
            <div class="div-cell-value">{{ dataInfo.inHospitalName || '' }}</div>
          </div>
          <div class="div-cell" style="margin-left: 3.1%">
            <div class="div-cell-name"><span style="color: #f90505">*</span>转诊类型：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.referralType.description || '' }}
            </div>
          </div>
          <div class="div-cell" style="margin-left: 1.6%">
            <div class="div-cell-name"><span style="color: #f90505">*</span>转诊原因：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.referralReason || '' }}
            </div>
          </div>
          <div class="div-cell" style="margin-left: 2.6%">
            <div class="div-cell-name"><span style="color: #f90505">*</span>转运方式：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.referralWay || '' }}
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 100%; align-items: baseline; margin-left: 0.3%">
            <div class="div-cell-name"><span style="color: #f90505">*</span>注意事项：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.notice || '' }}
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell">
            <div class="div-cell-name">申请人：</div>
            <div class="div-cell-value">{{ dataInfo.reqDocName || '' }}</div>
          </div>
          <div class="div-cell" style="margin-left: 3.1%">
            <div class="div-cell-name">登记日期：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.regTime || '' }}
            </div>
          </div>
          <div class="div-cell" style="margin-left: 1.6%">
            <div class="div-cell-name">申请机构：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.outHospitalName || '' }}
            </div>
          </div>
          <div class="div-cell" style="margin-left: 2.6%">
            <div class="div-cell-name" style="width: 120px"><span style="color: #f90505">*</span>期望到院时间：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.reachBeginDate ? dataInfo.reachBeginDate + '-' + dataInfo.reachEndDate : '' }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="statusType == 1" class="div-kuang" style="margin-top: 15px">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">分配科室</span>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 24.7%">
            <div class="div-cell-name" style="width: 152px">收治学科：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.inSubjectName || '' }}
            </div>
          </div>

          <div class="div-cell" style="width: 24.7%">
            <div class="div-cell-name"><span v-if="!isAssigned" style="color: #f90505">*</span>收治科室：</div>
            <!-- 工单状态（1提交申请 2申请审核通过 3申请审核不通过 4收治审核通过 5收治审核不通过 6已预约 7已收治）这个页面status都是2 -->
            <!-- :disabled="dataInfo.status.value == 4 || dataInfo.status.value == 5" -->
            <a-select
              :disabled="isAssigned"
              show-search
              v-model="requestData.inDeptCode"
              style="width: 44%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              allow-clear
              placeholder="请输入选择科室"
              @change="onDepartmentSelectChange"
              @select="onSelectDept"
              @search="onDepartmentSelectSearch"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option
                v-for="(item, index) in originData"
                :title="item.department_name"
                :key="index"
                :value="item.department_id"
                >{{ item.department_name }}</a-select-option
              >
            </a-select>
          </div>

          <div class="div-cell" style="width: 24.7%">
            <div class="div-cell-name" style="width: 152px">接收医生：</div>
            <a-input
              :disabled="isAssigned"
              v-model="requestData.docName"
              allow-clear
              placeholder="请输入"
              style="width: 100%; height: 28px"
            />
          </div>
        </div>
        <div class="div-line" style="margin-bottom: 10px">
          <div style="flex: 1"></div>
          <a-button :disabled="isAssigned" type="primary" @click="goAssign">确定分配</a-button>
        </div>
      </div>
      <div v-if="statusType == 2" class="div-kuang" style="margin-top: 15px">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">收治审核</span>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 24.7%">
            <div class="div-cell-name" style="width: 152px">收治科室：</div>
            <div class="div-cell-value" style="width: 100%">
              {{ dataInfo.inDept || '' }}
            </div>
          </div>

          <div class="div-cell" style="width: 24.7%">
            <div class="div-cell-name" style="width: 152px">收治医生：</div>
            <a-input
              v-model="shouzhiRequestData.docName"
              :disabled="isAssigned"
              allow-clear
              placeholder="请输入"
              style="width: 100%; height: 28px"
            />
          </div>

          <div class="div-cell" style="width: 24.7%">
            <div class="div-cell-name" style="width: 152px">收治结论：</div>
            <span class="div-cell-value" style="width: 100%">
              <a-radio-group name="radioGroup" :disabled="isAssigned" v-model="shouzhiRequestData.status">
                <a-radio :value="4">收治 </a-radio>
                <a-radio :value="5">不予收治 </a-radio>
              </a-radio-group>
            </span>
          </div>
        </div>
        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 100%">
            <div class="div-cell-name" style="margin-top: -82px; margin-left: 5px">收治意见：</div>
            <div class="div-cell-value" style="width: 100%">
              <a-textarea
                :disabled="isAssigned"
                v-model="shouzhiRequestData.rejectReason"
                placeholder="可在此处输入审核意见"
                style="height: 80px; min-height: 100px; width: 80%"
                :maxLength="1000"
              />
            </div>
          </div>
        </div>
        
        <div class="div-pro-btn">
          <div style="flex: 1"></div>
          <a-button
            type="primary"
            :disabled="dataInfo.status.value == 4 || dataInfo.status.value == 5"
            @click="submitData()"
            >保存</a-button
          >
          <a-button style="margin-left: 10px" @click="print()">打印</a-button>
        </div>
      </div>

      <a-steps progress-dot :current="linePositon" :status="lineStatus" style="margin-top: 50px">
        <a-step
          v-for="item in referralLogList"
          :key="item.id"
          :value="item.id"
          :title="item.dealDetail || '--'"
          :subTitle="item.nameAndTime || '--'"
          :description="item.remark || '--'"
        />
      </a-steps>
    </a-card>
    <printDownForm ref="printDownForm" />
    <printUpForm ref="printUpForm" />
  </a-spin>
</template>

<script>
import {
  getReferralTradeById,
  getDepartmentListForSelect,
  getTreeUsersByDeptIdsAndRoles,
  referralExamine,
  getReferralLogList,
  allocationDept,
} from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import { formatDecimal, getDateNow, getCurrentMonthLast } from '@/utils/util'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import moment from 'moment'
import printJS from 'print-js'
import printDownForm from './printDownForm'
import printUpForm from './printUpForm'
import { time } from 'echarts/core'

export default {
  components: {
    STable,
    Ellipsis,
    printDownForm,
    printUpForm,
    // chooseMedic,
  },
  data() {
    return {
      // 审核状态 1未审核2已审核3未登记
      headers: {
        Authorization: '',
      },
      user: {},
      confirmLoading: false,
      tradeId: '',
      dateFormat: 'YYYY-MM-DD',
      createValue: [],
      patientBaseinfo: {},
      dataInfo: { referralType: {}, status: {} },
      rangeValue: '4',
      fetching: false,
      isAssigned: false,
      originData: [],
      inDocDatas: [],
      inSelectDepartment: [],
      referralLogList: [],
      tradeType: 2, //根据此标致 打印 上转 还是下转  2 下转  1 上转
      lineStatus: 'error', //wait process finish error
      linePositon: 1,
      statusType: 0, //根据此标志 显示 1分配科室 2收治审核
      //分配科室请求参数
      requestData: {
        inDept: '', //准入科室名称
        inDeptCode: undefined, //转入科室编码
        tradeId: '',
        docName: '',
        // reachBeginDate: getDateNow(), //期望到院 结束时间
        // reachEndDate: getCurrentMonthLast(), //期望到院 开始时间
        // rejectReason: "", //收治意见
        // status: 4, // 4 确认收治  5 拒绝收治
        // docId: undefined,
      },
      //收治审核请求参数
      shouzhiRequestData: {
       
        // reachBeginDate: getDateNow(), //期望到院 结束时间
        // reachEndDate: getCurrentMonthLast(), //期望到院 开始时间
        rejectReason:undefined, //收治意见
        status: 4, // 4 确认收治  5 拒绝收治
        tradeId: '',
       
        docName: undefined,
      },
    }
  },

  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    this.user = Vue.ls.get(TRUE_USER)
    console.log('BBBB:', this.user)
    this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
    this.getDepartmentSelectList(undefined)
  },
  mounted() {},
  activated() {
    if (this.$route.query.id) {
      //修改
      this.clearData()
      this.tradeId = this.$route.query.id
      this.requestData.tradeId = this.$route.query.id
      this.shouzhiRequestData.tradeId = this.$route.query.id
      this.getDetaiData(this.tradeId)
      this.getReferralLogListOut(this.tradeId)
    }
  },
  methods: {
    clearData() {
      this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
      // this.requestData.reachBeginDate = getDateNow();
      // this.requestData.reachEndDate = getCurrentMonthLast();
    },

    // 打印
    print() {
      // 下转
      if (this.tradeType == 2) {
        this.$refs.printDownForm.open(this.tradeId)
        // 上转
      } else {
        this.$refs.printUpForm.open(this.tradeId)
      }
    },

    getDetaiData(tradeId) {
      this.confirmLoading = true
      getReferralTradeById({ id: tradeId })
        .then((res) => {
          if (res.code == 0) {
            if (res.data) {
              this.patientBaseinfo = res.data.patientBaseinfo
              this.dataInfo = res.data

             

              this.getDepartmentSelectList(this.dataInfo.inDept)
              this.getTreeUsers(this.dataInfo.inDeptCode)
              this.tradeType = this.dataInfo.tradeType.value
              this.requestData.status = this.dataInfo.status.value
              this.shouzhiRequestData.status = this.dataInfo.status.value
              // this.requestData.docId = this.dataInfo.docId;

              this.requestData.docName = this.dataInfo.docName
              this.shouzhiRequestData.docName = this.dataInfo.docName
              this.shouzhiRequestData.rejectReason = this.dataInfo.inCheckResult || undefined

              if (this.dataInfo.inDeptCode) {
                //显示收治审核
                this.statusType = 2  
                //2未收治  4已收治 5不予收治
                //只有已收治的情况不能再修改 不予收治可以修改
                this.isAssigned = this.dataInfo.status.value === 4 
                
                this.requestData.inDeptCode = this.dataInfo.inDept //这里有显示问题，用inDept赋值给inDeptCode避免这个问题
                this.originData = {
                  department_id: this.dataInfo.inDeptCode,
                 
                  department_name: this.dataInfo.inDept,
                }
              } else {
                //显示分配学科
                this.statusType = 1
                this.isAssigned = false
                this.requestData.inDeptCode = undefined
                this.originData = []
              }

              console.log('  this.originData ', this.requestData.inDeptCode + '')
              console.log('  this.originData ', this.originData)

              // this.requestData.inDept = this.dataInfo.inDept;
              // this.requestData.inDept = this.dataInfo.inDept;

              // this.requestData.rejectReason = this.dataInfo.inCheckResult;
              this.createValue = [
                moment(this.dataInfo.reachBeginDate, this.dateFormat),
                moment(this.dataInfo.reachEndDate, this.dateFormat),
              ]
              // this.requestData.reachBeginDate = moment(
              //   this.dataInfo.reachBeginDate,
              //   this.dateFormat
              // );
              // this.requestData.reachEndDate = moment(
              //   this.dataInfo.reachEndDate,
              //   this.dateFormat
              // );

              // console.log("GGG:",this.requestData.reachBeginDate)
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .finally((item) => {
          this.confirmLoading = false
        })
    },

    getReferralLogListOut(tradeId) {
      getReferralLogList(tradeId).then((res) => {
        if (res.code == 0) {
          this.referralLogList = res.data
          let haveIndex = this.referralLogList.findIndex((itemTemp, indexTemp) => {
            return !itemTemp.dealUserName
          })
          console.log('getReferralLogList', haveIndex)
          if (haveIndex != -1) {
            this.linePositon = haveIndex - 1 //算出目前的步骤
          } else {
            this.linePositon = this.referralLogList.length - 1
          }

          this.lineStatus = this.referralLogList[this.linePositon].deal_result == '成功' ? 'process' : 'error'

          if (this.referralLogList[this.linePositon].deal_result == '失败') {
            this.$set(
              this.referralLogList[this.linePositon],
              'createTime',
              this.referralLogList[this.linePositon].dealImages
            )
          }

          //申请人和时间拼在一起
          this.referralLogList.forEach((element, index) => {
            if (element.deal_result == '成功') {
              this.$set(element, 'nameAndTime', element.dealUserName + '\n' + element.createTime || '')
            } else if (element.deal_result == '失败') {
              this.$set(element, 'dealDetail', element.dealDetail + '(不通过)')
              this.$set(element, 'nameAndTime', element.dealUserName + '\n' + element.dealImages || '')
            }
            // else{
            //   this.$set(element, 'nameAndTime', element.dealUserName + '\n' + element.dealImages)
            // }
          })

          console.log('FFFFFFF:', this.referralLogList)
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },

    goAssign() {
      if (!this.requestData.inDept) {
        this.$message.error('请选择收治科室')
        return
      }
      // if (!this.requestData.docName) {  非必填
      //   this.$message.error("请输入接收医生");
      //   return;
      // }
      allocationDept(this.requestData).then((res) => {
        if (res.code == 0) {
          this.$message.success('分配成功')
          this.$bus.$emit('refreshtransAssign', '刷新列表')
          this.$router.go(-1)
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },

    // onChange(momentArr, dateArr) {
    //   if (dateArr[0] == "" && dateArr[1] == "") {
    //     this.requestData.reachBeginDate = "";
    //     this.requestData.reachEndDate = "";
    //     return;
    //   }

    //   this.createValue = momentArr;
    //   this.requestData.reachBeginDate = dateArr[0];
    //   this.requestData.reachEndDate = dateArr[1];
    // },

    //科室搜索
    onDepartmentSelectSearch(value) {
      this.originData = []
      this.getDepartmentSelectList(value)
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value === undefined) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, 'managerDept').then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.originData = res.data.records
        }
      })
    },

    // onSelectInDoctor(userId) {
    //   let getOne = this.inDocDatas.find((item) => item.userId == userId);
    //   //   this.uploadData.docName = getOne.userName;
    //   // console.log('onSelectInDoctor docId', getOne.userId)
    //   // console.log('onSelectInDoctor docName', getOne.userName)
    //   if (getOne) {
    //     this.requestData.docName = getOne.userName;
    //     this.requestData.docId = getOne.userId;
    //   }
    // },

    onDocFocus() {
      if (!this.inSelectDepartment) {
        this.$message.warn('请先选择转入科室')
        return
      }
    },

    // refreshData(tradeId) {
    //   console.log("ggggggg", tradeId);
    //   this.confirmLoading = true;
    //   // console.log("refreshData transup", JSON.stringify(tradeId))
    //   this.tradeId = tradeId;
    //   this.getDetaiData(this.tradeId);
    //   this.getReferralLogListOut(this.tradeId);
    // },

    onSelectDept(department_id) {
      let getOne = this.originData.find((item) => item.department_id == department_id)
      //   this.uploadData.inDept = getOne.department_name;
      console.log('onSelectDept getOne', getOne)
      console.log('onSelectDept department_id', department_id)
      console.log('onSelectDept department_name', getOne.department_name)
      if (getOne) {
        this.requestData.inDept = getOne.department_name
        this.requestData.inDeptCode = getOne.department_id
      }
      this.getTreeUsers(this.requestData.inDeptCode)
    },

    getTreeUsers(inDeptCode) {
      getTreeUsersByDeptIdsAndRoles({
        roleIds: ['doctor'],
        departmentIds: [inDeptCode],
      }).then((res) => {
        if (res.code == 0) {
          this.inDocDatas = res.data[0].users || []
        }
      })
    },

    // radioChange(event) {
    //   if (event.target.value == 4) {
    //     this.rangeValue = 4;
    //     this.requestData.status = 4;
    //   } else {
    //     this.rangeValue = 5;
    //     this.requestData.status = 5;
    //   }
    // },

    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    cancel() {
      this.$router.go(-1)
    },
    submitData() {
      if (!this.shouzhiRequestData.docName) {
          this.$message.error("请输入收治医生!");
          return;
        }
      if (this.shouzhiRequestData.status == 5) {
        if (!this.shouzhiRequestData.rejectReason) {
          this.$message.error("请输入不通过原因!");
          return;
        }
      }
      this.confirmLoading = true;

     
      referralExamine(this.shouzhiRequestData)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.$bus.$emit("refreshtransinManage", "刷新入院收治列表");
            this.$router.go(-1);
          }
        })
        .finally((error) => {
          this.confirmLoading = false;
        });
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-steps-item-subtitle {
  white-space: pre-line !important;
}

button {
  margin-right: 8px;
}
</style>
<style lang="less" scoped>
.div-kuang {
  // border: 1px solid #E6E6E6;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  margin-top: -10px;

  .div-title {
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 100% !important;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 26px;

    .div-line-blue {
      width: 5px;
      height: 100%;
      background-color: #1890ff;
    }

    .span-title {
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      color: #333;
    }
  }

  .box-title {
    color: #1a1a1a;
    font-weight: bold;
    font-size: 14px;
    padding: 10px 20px;
  }

  .box-divider {
    height: 1px;
    background-color: #e6e6e6;
  }

  .div-line {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .div-cell {
      width: 26.2%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .div-cell-name {
        width: 110px;
        text-align: right;
        color: #4d4d4d;
      }

      .div-cell-value {
        color: #4d4d4d;
      }

      .temp {
        /deep/ .ant-input {
          color: #409eff;
        }
      }
    }

    .check {
      &:hover {
        cursor: pointer;
      }
    }

    .div-shu-cell {
      display: flex;
      flex-direction: column;

      .div-shu-cell-ori {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}

.div-pro-btn {
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: 3%;
  margin-bottom: 60px;
}
</style>
