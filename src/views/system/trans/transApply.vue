<template>
  <a-spin :spinning="confirmLoading">
    <a-card :bordered="false" >
      <!-- 基本信息 -->
      <div class="div-kuang">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">档案信息</span>
        </div>
        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505; margin-top: 3px">*</span>患者姓名：</div>
            <div class="div-cell-value">{{patientBaseinfo.name||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>身份证：</div>
            <div class="div-cell-value">{{patientBaseinfo.identificationNo||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">性别：</div>
            <div class="div-cell-value">{{patientBaseinfo.sex||''}}</div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>出生日期：</div>
            <div class="div-cell-value">{{ patientBaseinfo.birthday||'' }}</div>
          </div>
        </div>
        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>本人电话：</div>
            <div class="div-cell-value">{{patientBaseinfo.contactTel}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">联系人姓名：</div>
            <div class="div-cell-value">{{patientBaseinfo.contactor||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">联系人电话：</div>
            <div class="div-cell-value">{{patientBaseinfo.contactTel||''}}</div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">国籍：</div>
            <div class="div-cell-value">{{patientBaseinfo.country||''}}</div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">民族：</div>
            <div class="div-cell-value">{{patientBaseinfo.nation||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">血型：</div>
            <div class="div-cell-value">{{patientBaseinfo.bloodType||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">RH阴性：</div>
            <div class="div-cell-value">{{patientBaseinfo.rhFlag||''}}</div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">文化程度：</div>
            <div class="div-cell-value">{{patientBaseinfo.educationLevel||''}}</div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">职业：</div>
            <div class="div-cell-value">{{patientBaseinfo.job||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">婚姻状况：</div>
            <div class="div-cell-value">{{patientBaseinfo.marry||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>常住分类：</div>
            <div class="div-cell-value">{{patientBaseinfo.liveType||''}}</div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">医保类型：</div>
            <div class="div-cell-value">{{patientBaseinfo.insuranceType||''}}</div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>户口住址：</div>
            <div class="div-cell-value">{{patientBaseinfo.address||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name" style="width:90px"><span style="color: #f90505">*</span>户口详细地址：</div>
            <div class="div-cell-value">{{patientBaseinfo.addressDetail||''}}</div>
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
            <div class="div-cell-value">{{ dataInfo.diseaseLevel||'' }}</div>
          </div>
          <div class="div-cell" style="width: 80%">
            <div class="div-cell-name">主要诊断：</div>
            <div class="div-cell-value" style="width: 100%">{{dataInfo.diagnos||''}}</div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 80%">
            <div class="div-cell-name">病情描述：</div>
            <div class="div-cell-value">{{dataInfo.diseaseDesc||''}}</div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 80%">
            <div class="div-cell-name">治疗经过：</div>
            <div class="div-cell-value">
                {{dataInfo.diseaseDeal||''}}
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
            <div class="div-cell-value">{{dataInfo.inHospitalName||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>转诊类型：</div>
            <div class="div-cell-value" style="width: 100%">{{dataInfo.referralType.description||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>转诊原因：</div>
            <div class="div-cell-value" style="width: 100%">{{dataInfo.referralReason||''}}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>转运方式：</div>
            <div class="div-cell-value" style="width: 100%">{{dataInfo.referralWay||''}}</div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell">
            <div class="div-cell-name">申请人：</div>
            <div class="div-cell-value">邓鑫</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">登记日期：</div>
            <div class="div-cell-value" style="width: 100%">{{ dataInfo.regTime||'' }}</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">申请机构：</div>
            <div class="div-cell-value" style="width: 100%">长沙市中心医院</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name"><span style="color: #f90505">*</span>注意事项：</div>
            <div class="div-cell-value" style="width: 100%">{{dataInfo.notice||''}}</div>
          </div>
        </div>

        <div class="div-kuang" style="margin-top: 15px">
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">收治审核</span>
          </div>

          <div class="div-line" style="margin-bottom: 10px">
            <div class="div-cell">
              <div class="div-cell-name">转入科室：</div>
              <div class="div-cell-value">{{ dataInfo.inDept||'' }}
                <!-- <a-select placeholder="请选择" allow-clear style="height: 28px; width: 128px">
                  <a-select-option v-for="item in zhengjianDatas" :key="item.code" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select> -->
              </div>
            </div>
            <div class="div-cell">
              <div class="div-cell-name">接收医生：</div>
              <div class="div-cell-value">{{ dataInfo.docName||'' }}
                <!-- <a-input allow-clear style="width: 100%" placeholder="请输入" /> -->
              </div>
            </div>
            <div class="div-cell">
              <div class="div-cell-name">期望到院时间：</div>
              <div class="div-cell-value">
                <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
              </div>
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell">
            <div class="div-cell-name">收治结论：</div>
            <div class="div-cell-value">
              <a-radio-group
                style="margin-left: 10px"
                name="radioGroup"
                @change="radioChange"
                v-decorator="['roleId', { rules: [{ required: true, message: '请选择审核结论！' }] }]"
              >
                <a-radio :value="1" style="font-size: 8px; color: #1a1a1a; margin-right: 0px !important">
                  通过
                </a-radio>
                <a-radio :value="2" style="font-size: 8px; color: #1a1a1a"> 不通过 </a-radio>
              </a-radio-group>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">审核人员：</div>
            <div class="div-cell-value">王治郅</div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">审核日期：</div>
            <div class="div-cell-value">2023-10-25</div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 100%">
            <div class="div-cell-name">收治意见：</div>
            <div class="div-cell-value" style="width: 100%">
              <a-textarea
                placeholder="请输入意见"
                style="height: 80px; min-height: 100px; width: 80%"
                :maxLength="1000"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="div-pro-btn">
        <div style="flex: 1"></div>
        <a-button type="primary" @click="submitData()">确认收治</a-button>
        <a-button type="primary" ghost @click="submitData()">不予收治</a-button>
        <a-button style="margin-left: 10px" @click="cancel()">打印</a-button>
      </div>
      <!-- <chooseMedic ref="chooseMedic" @choose="handleChoose" /> -->
    </a-card>
  </a-spin>
</template>
  
  <script>
import { getReferralTradeById } from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import { formatDecimal,getDateNow, getCurrentMonthLast } from '@/utils/util'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import moment from 'moment'

export default {
  components: {
    STable,
    Ellipsis,
    // chooseMedic,
  },
  data() {
    return {
      // 审核状态 1未审核2已审核3未登记
      headers: {
        Authorization: '',
      },
      confirmLoading:false,
      tradeId: '',
      dateFormat: 'YYYY-MM-DD',
      createValue: [],
      patientBaseinfo:{},
      dataInfo:{},
      rangeValue:"1",
    }
  },

  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    this.createValue = [
      moment(getDateNow(), this.dateFormat),
      moment(getCurrentMonthLast(), this.dateFormat),
    ]
  },
  mounted() {},
  activated() {
    console.log("YYYYYYYYYYYYYYYYYYYY")
    if (this.$route.query.id) {
      //修改
      this.tradeId = this.$route.query.id
      console.log('CCCC:', this.$route.query.id)
      this.getDetaiData(this.tradeId)
    }
  },
  methods: {
    clearData() {},

    getDetaiData(tradeId) {
        this.confirmLoading =true
      getReferralTradeById({ id: tradeId }).then((res) => {
        if (res.code == 0) {
          if (res.data) {
            this.patientBaseinfo = res.data.patientBaseinfo
            this.dataInfo = res.data
          }
        }else{
            this.$message.error(res.message)
        }
      }).finally((item)=>{
        this.confirmLoading =false
      })
    },


    onChange(momentArr, dateArr) {
      if (dateArr[0] == '' && dateArr[1] == '') {
        // this.queryParams.regTimeBegin = ''
        // this.queryParams.regTimeEnd = ''
        return
      }

      this.createValue = momentArr
    //   this.queryParams.regTimeBegin = dateArr[0]
    //   this.queryParams.regTimeEnd = dateArr[1]
    },

    radioChange(event) {
      if (event.target.value == 1) {
        this.rangeValue = 1
        // this.queryParams.auditStatus = 1
      } else {
        this.rangeValue = 2
        // this.queryParams.auditStatus =2
      }
    },

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
    submitData() {},
  },
}
</script>
  
  <style lang="less" scoped>
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
      width: 23%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .div-cell-name {
        width: 85px;
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
  
  
  
  