<template>
  <div class="div-check">
    <a-button type="primary" @click="goHistoryDetail" class="top-btn">查看病历信息</a-button>
    <div class="div-part">
      <p class="p-part-title">患者基本信息</p>
      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">病历号 :</span>
          <span class="span-item-value">0229901</span>
        </div>

        <div class="div-right">
          <span class="span-item-name">流水号 :</span>
          <span class="span-item-value"> 12122121281882921891</span>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">患者姓名 :</span>
          <span class="span-item-value"> 张三</span>
        </div>

        <div class="div-right">
          <span class="span-item-name">性别 :</span>
          <span class="span-item-value"> 男</span>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">身份证号码 :</span>
          <a-input
            v-model="checkData.idN"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入身份证号 "
          />
        </div>

        <div class="div-right">
          <span class="span-item-name">出生日期 :</span>
          <span class="span-item-value"> 1993-01-01</span>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">年龄 :</span>
          <span class="span-item-value"> 25</span>
        </div>

        <div class="div-right">
          <span class="span-item-name"><span style="color: red">*</span> 手机号码 :</span>
          <a-input
            v-model="checkData.phone"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入手机号码 "
          />
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name"><span style="color: red">*</span> 紧急联系人 :</span>
          <a-input
            v-model="checkData.contact"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入紧急联系人 "
          />
        </div>

        <div class="div-right">
          <span class="span-item-name"><span style="color: red">*</span> 联系人电话 :</span>
          <a-input
            v-model="checkData.contactNo"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入联系人电话 "
          />
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name">现住址 :</span>
          <a-input
            v-model="checkData.address"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入现住址 "
          />
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="div-divider"></div>

    <div class="div-part">
      <p class="p-part-title">入院信息</p>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">门诊科室 :</span>
          <span class="span-item-value">骨科</span>
        </div>

        <div class="div-right">
          <span class="span-item-name">门诊医生 :</span>
          <span class="span-item-value"> 李凯</span>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name">入院诊断 :</span>
          <span class="span-item-value"> 宫颈上皮肉肿瘤1级</span>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">病人来源 :</span>
          <a-select v-model="checkData.patientSource" allow-clear placeholder="请选择来源">
            <a-select-option v-for="(item, index) in patientSourceData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-right">
          <span class="span-item-name">入院情况 :</span>
          <a-select v-model="checkData.insideStatus" allow-clear placeholder="请选择入院情况">
            <a-select-option v-for="(item, index) in insideStatusData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">入院途径 :</span>
          <a-select v-model="checkData.insideMethod" allow-clear placeholder="请选择入院途径">
            <a-select-option v-for="(item, index) in insideMethodData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-right">
          <span class="span-item-name">入院方式 :</span>
          <a-select v-model="checkData.insideType" allow-clear placeholder="请选择入院方式">
            <a-select-option v-for="(item, index) in insideTypeData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="div-divider"></div>

    <div class="div-part">
      <p class="p-part-title">床位诉求</p>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">病房类型 :</span>
          <a-select v-model="checkData.roomType" allow-clear placeholder="请选择病房类型">
            <a-select-option v-for="(item, index) in roomTypeData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-right">
          <span class="span-item-name">病床类型 :</span>
          <a-select v-model="checkData.bedType" allow-clear placeholder="请选择病床类型">
            <a-select-option v-for="(item, index) in bedTypeData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">是否靠窗 :</span>
          <a-select v-model="checkData.windowType" allow-clear placeholder="请选择是否靠窗">
            <a-select-option v-for="(item, index) in windowTypeData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-right">
          <span class="span-item-name">期望日期 :</span>
          <a-input
            v-model="checkData.insideDate"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入期望日期 "
          />
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="div-divider"></div>

    <div class="div-part">
      <p class="p-part-title">床位调配信息</p>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">申请病区 :</span>
          <a-select v-model="checkData.area" allow-clear placeholder="请选择申请病区">
            <a-select-option v-for="(item, index) in areaData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-right">
          <span class="span-item-name">床号 :</span>
          <a-input
            v-model="checkData.bedNo"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入床号 "
          />
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">入院治疗组 :</span>
          <a-input
            v-model="checkData.group"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入入院治疗组 "
          />
        </div>

        <div class="div-right">
          <span class="span-item-name">是否急诊候床 :</span>
          <a-select v-model="checkData.isFast" allow-clear placeholder="请选择是否急诊候床">
            <a-select-option v-for="(item, index) in isFastData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name">专科评估 :</span>
          <a-select v-model="checkData.discuss" allow-clear placeholder="请选择入院方式">
            <a-select-option v-for="(item, index) in discussData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name">原因 :</span>
          <a-input
            v-model="checkData.reason"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入原因 "
          />
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">是否同意跨科收治 :</span>
          <a-select v-model="checkData.agree" allow-clear placeholder="请选择入院方式">
            <a-select-option v-for="(item, index) in agreeData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-right">
          <span class="span-item-name">是否监护床 :</span>
          <a-select v-model="checkData.watch" allow-clear placeholder="请选择入院方式">
            <a-select-option v-for="(item, index) in watchData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">预约需求 :</span>
          <a-input
            v-model="checkData.need"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入现住址 "
          />
        </div>

        <div class="div-right">
          <span class="span-item-name">预约入院时间 :</span>
          <a-input
            v-model="checkData.bookDate"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入预约入院时间 "
          />
        </div>
      </div>
    </div>

    <div style="margin-top: 30px">
      <a-button type="primary" @click="goApply" style="margin-left: 47%">确认申请</a-button>
      <a-button @click="goBack" style="margin-left: 2%">返回</a-button>
    </div>
    <div style="height: 50px; backgroud-color: white" />
  </div>
</template>

<script>
import { STable } from '@/components'
import { getKeShiData, getDoctors, changeStatus } from '@/api/modular/system/posManage'
import addForm from './addForm'
import editForm from './editForm'

export default {
  components: {},

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      checkData: {
        idN: '440681199301019876',
        contact: '张朝阳',
        contactNo: '13812812839',
        address: '广东省广州市保利世贸G座3楼303',
        phone: '13612612367',
        insideStatus: '已申请',
        insideMethod: '急诊',
        patientSource: '长沙',
        roomType: '双人间',
        bedType: '席梦思',
        windowType: '靠窗',
        insideType: '行走',
        area: '病区一',
        insideDate: '2021-12-30',
        bedNo: '05-02',
        group: '专家组',
        reason: '需要继续诊断病因',
        need: '有需求',
        isFast: '是',
        discuss: '同意',
        agree: '是',
        watch: '否',
        bookDate: '2021-12-30',
      },
      roomTypeData: [
        { code: 1, value: '单人间' },
        { code: 2, value: '双人间' },
        { code: 3, value: '四人间' },
      ],
      discussData: [
        { code: 1, value: '同意' },
        { code: 2, value: '不同意' },
      ],
      isFastData: [
        { code: 1, value: '是' },
        { code: 2, value: '否' },
      ],
      agreeData: [
        { code: 1, value: '是' },
        { code: 2, value: '否' },
      ],
      watchData: [
        { code: 1, value: '是' },
        { code: 2, value: '否' },
      ],
      areaData: [
        { code: 1, value: '病区一' },
        { code: 2, value: '病区二' },
        { code: 3, value: '病区三' },
      ],
      windowTypeData: [
        { code: 1, value: '靠窗' },
        { code: 2, value: '不靠窗' },
      ],
      bedTypeData: [
        { code: 1, value: '普通车' },
        { code: 2, value: '席梦思' },
        { code: 3, value: '橡胶床' },
      ],
      insideTypeData: [
        { code: 1, value: '车送' },
        { code: 2, value: '行走' },
        { code: 3, value: '抬入' },
      ],
      patientSourceData: [
        { code: 1, value: '长沙' },
        { code: 2, value: '宁乡' },
        { code: 3, value: '浏阳' },
      ],
      insideMethodData: [
        { code: 1, value: '门诊' },
        { code: 2, value: '急诊' },
        { code: 3, value: '转院' },
      ],
      insideStatusData: [
        { code: 1, value: '已申请' },
        { code: 2, value: '已入院' },
        { code: 3, value: '已取消' },
      ],
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      opTypeDict: [
        {
          code: '1',
          value: '儿科',
        },
        {
          code: '2',
          value: '脑科',
        },
        {
          code: '3',
          value: '耳鼻喉科',
        },
        {
          code: '4',
          value: '内科',
        },
        {
          code: '5',
          value: '外科',
        },
        {
          code: '6',
          value: '精神科',
        },
      ],
      // 查询参数
      queryParam: { yljgdm: '444885559' },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: '姓名',
          dataIndex: 'xm',
        },
        {
          title: '性别',
          dataIndex: 'xb',
        },
        {
          title: '手机号',
          dataIndex: 'tel',
        },
        // {
        //   title: '医院',
        //   dataIndex: 'sort',
        // },
        {
          title: '科室',
          dataIndex: 'ssksName',
        },
        {
          title: '职称',
          dataIndex: 'zhic',
        },
      ],
      keshiData: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDoctors(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    if (this.hasPerm('sysPos:edit') || this.hasPerm('sysPos:delete')) {
      this.columns.push({
        title: '操作',
        width: '150px',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
      })
    }

    this.getKeShi()
  },

  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    goApply() {
      this.$message.info('申请成功')
      this.$router.push({ name: 'sys_check_in' })
    },

    goBack() {
      window.history.back()
    },

    handleStatus(record) {
      record.activeFlag = record.activeFlag == 1 || record.activeFlag == null ? 0 : 1
      changeStatus(record)
        .then((res) => {
          if (res.success) {
            this.$message.success('切换成功')
            this.$refs.table.refresh()
          } else {
            this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('切换错误：' + err.message)
        })
    },

    getKeShi() {
      getKeShiData({ hospitalCode: '444885559' })
        .then((res) => {
          if (res.success) {
            let newData = []
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].departmentList && res.data[i].departmentList.length > 0) {
                newData = newData.concat(res.data[i].departmentList)
              }
            }
            this.keshiData = newData
          } else {
            // this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('切换错误：' + err.message)
        })
    },

    goHistoryDetail() {
      window.open(
        'http://www.mclouds.org.cn:30000/patient-view.html?token=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMTk4IiwiZXhwIjoxNjQwODA4MTcxfQ.JLMPdWRjzunm117lNAJFnffKqZvIG10r-Gl0v-Uzn-NQXPkOtBIKMFbpVLiHy4Ba3EyDFlPRCvEuqDfulYf7c7702VDET7vmG51wMiHUo6SL-Onjm6xA7jglGJML4IDDccL3MvMfgJ6xCm_CXVgCTGriCOFrdGZMIIaxiePTf7sTZw1gDa7NvsxvOuKiMvGKXRGJgSw-wkTMvONbmpPrp8ZM6NiGfWwc3kxjLXNBIB30G7ndG19y_wTDk2Vf6NaYYtIlu--H5ekWo6e68n8CdwjLgl9OBJ289UNL8Qhs86FqbC97HA3Vu7U3vQh7C1MFDArc3bz4Pd676Gs2d5V-Cw&no=000006392145&type=9',
        '_blank'
      )
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  },
}
</script>

<style lang="less">
.div-check {
  background-color: white;
  padding: 0 15% 0 5%;
  // padding: 0 15%;

  .top-btn {
    margin-left: 47%;
    float: right;
    margin-top: 20px;
  }

  .div-divider {
    margin-top: 3%;
    margin-left: 10%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }
  .div-part {
    width: 100%;
    height: 100%;

    // border-bottom: 1px solid #e6e6e6;
    background-color: white;
    overflow: hidden;
    padding: 1.5%;

    .p-part-title {
      margin-top: 20px;
      height: 18px;
      font-size: 18px;
      text-align: center;
      color: #000;
      font-weight: bold;
    }

    .ant-select {
      width: 42% !important;
      margin-left: 4% !important;
    }

    .ant-input {
      margin-left: 2% !important;
    }

    .div-line-wrap {
      width: 100%;
      overflow: hidden;

      .div-left {
        float: left;
        width: 50%;
        margin-top: 3%;
        overflow: hidden;

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: right;
          width: 50%;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          text-align: left;
          padding-left: 20px;
          font-size: 14px;
          display: inline-block;
        }
      }

      .div-right {
        margin-top: 3%;
        width: 50%;
        float: right;
        overflow: hidden;
        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: right;
          font-size: 14px;
          width: 50%;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          font-size: 14px;
          padding-left: 20px;
          text-align: left;
          display: inline-block;
        }
      }

      .div-total-one {
        margin-top: 3%;
        overflow: hidden;
        width: 100%;

        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: right;
          font-size: 14px;
          width: 25%;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          font-size: 14px;
          padding-left: 20px;
          text-align: left;
          display: inline-block;
        }

        .ant-input {
          margin-left: 0.5% !important;
        }

        .ant-select {
          width: 35% !important;
          margin-left: 2% !important;
        }
      }
    }
  }
}
</style>
