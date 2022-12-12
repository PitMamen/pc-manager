<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div v-if="jbxx" style="overflow-y: auto; height: 380px; padding-right: 10px; padding-bottom: 10px">
      <!-- <span>{{ jbxx.name }}</span> -->
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">患者信息</span>
      </div>
      <div class="div-basic">
        <div class="div-line-wrap">
          <div class="div-item-four">
            姓名：<span style="text-decoration: underline">{{ jbxx.xm }}</span>
          </div>
          <div class="div-item-four">
            性别：<span style="text-decoration: underline">{{ jbxx.xbs }}</span>
          </div>
          <div class="div-item-four">
            <!-- 出生日期：<span style="text-decoration: underline">{{ patientInfo.baseInfo.birthday }}</span> -->
            出生日期：<span style="text-decoration: underline">{{ jbxx.cismain.csny }}</span>
          </div>
          <div class="div-item-four">
            年龄：<span style="text-decoration: underline">{{ jbxx.nl }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            国籍：<span style="text-decoration: underline">{{ jbxx.cismain.gjmc }}</span>
          </div>
          <div class="div-item-four">
            民族：<span style="text-decoration: underline">{{ jbxx.yymzmc }}</span>
          </div>
          <div class="div-item-four">
            新生儿出生体重：<span style="text-decoration: underline">{{ jbxx.fgg || '-' }}</span
            >&nbsp;克
          </div>
          <div class="div-item-four">
            新生儿入院体重：<span style="text-decoration: underline">{{ jbxx.cismain.xserytz || '-' }}</span
            >&nbsp;克
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">
            出生地址：<span style="text-decoration: underline; width: 86%; display: inline-block">{{
              jbxx.cismain.csd
            }}</span>
            <!-- 出生地址：<span style="border-bottom: 1px solid #333; width: 200px; display: inline-block">{{ -->
            <!-- jbxx.name
            }}</span> -->
          </div>

          <div class="div-item-four">
            <span style="text-decoration: underline"></span>
          </div>
          <div class="div-item-four">
            籍贯：<span style="text-decoration: underline">{{ jbxx.cismain.jg }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            身份证号：<span style="text-decoration: underline">{{ patientInfo.baseInfo.identificationNo }}</span>
          </div>
          <div class="div-item-four">
            职业：<span style="text-decoration: underline">{{ jbxx.cismain.zybm }}</span>
          </div>
          <div class="div-item-four">
            婚姻：<span style="text-decoration: underline">{{ jbxx.hyzkmc }}</span>
          </div>
        </div>

        <!-- TODO -->
        <!-- csd  overflow: hidden; text-overflow: ellipsis; white-space: nowrap  限制一行 -->
        <div class="div-line-wrap">
          <div class="div-item-two">
            户籍地址：<span style="text-decoration: underline; width: 86%; display: inline-block">{{
              jbxx.cismain.hkdz
            }}</span>
          </div>

          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.cismain.hkyb }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">
            现居地址：<span style="text-decoration: underline; width: 86%; display: inline-block">{{
              jbxx.cismain.jzd
            }}</span>
          </div>
          <div class="div-item-four">
            电话：<span style="text-decoration: underline">{{ jbxx.cismain.lxdh }}</span>
          </div>
          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.cismain.xzzyb }}</span>
          </div>
        </div>
        <div class="div-line-wrap">
          <div class="div-item-two">
            工作单位及地址：<span style="text-decoration: underline; width: 200px; display: inline-block">{{
              jbxx.cismain.gzdw
            }}</span>
          </div>
          <div class="div-item-four">
            单位电话：<span style="text-decoration: underline">{{ jbxx.cismain.gzdwdh }}</span>
          </div>
          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.cismain.gzdwyb }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            联系人姓名：<span style="text-decoration: underline">{{ jbxx.cismain.lxrxm }}</span>
          </div>
          <div class="div-item-four">
            关系：<span style="text-decoration: underline">{{ jbxx.cismain.lxrgxmc }}</span>
          </div>
          <div class="div-item-four">
            地址：<span style="text-decoration: underline">{{ jbxx.cismain.lxrdz }}</span>
          </div>
          <div class="div-item-four">
            电话：<span style="text-decoration: underline">{{ jbxx.cismain.lxrdh }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            入院途径：<span style="text-decoration: underline">{{ jbxx.cismain.rylxmc }}</span>
          </div>
          <div class="div-item-four">
            入院时间：<span style="text-decoration: underline">{{ jbxx.cismain.rysj }}</span>
          </div>
          <div class="div-item-four">
            入院科别：<span style="text-decoration: underline">{{ jbxx.cismain.ryksmc }}</span>
          </div>
          <div class="div-item-four">
            病区：<span style="text-decoration: underline">{{ jbxx.cismain.rybq }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            转科：<span style="text-decoration: underline">{{ jbxx.cismain.zkksbm1 || '-' }}</span
            ><span style="margin-left: 10px">转：</span
            ><span style="text-decoration: underline">{{ jbxx.cismain.zkksbm2 || '-' }}</span>
            <span style="margin-left: 10px">转：</span
            ><span style="text-decoration: underline">{{ jbxx.cismain.zkksbm3 || '-' }}</span>
          </div>
          <div class="div-item-four"></div>
          <div class="div-item-four"></div>
          <div class="div-item-four"></div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            出院时间：<span style="text-decoration: underline">{{ jbxx.cismain.cysj }}</span>
          </div>
          <div class="div-item-four">
            出院科别：<span style="text-decoration: underline">{{ jbxx.cismain.cyksmc }}</span>
          </div>
          <div class="div-item-four">
            病房：<span style="text-decoration: underline">{{ jbxx.cismain.cybq }}</span>
          </div>
          <div class="div-item-four">
            实际住院：<span style="text-decoration: underline">{{ jbxx.cismain.sjzyts }}</span
            >&nbsp;天
          </div>
        </div>
      </div>

      <div class="div-title" style="margin-top: 10px">
        <div class="div-line-blue"></div>
        <span class="span-title">患者诊断</span>
      </div>
      <!-- :scroll="{ x: true }" -->
      <!-- style="margin-left: 2%; min-height: 450px; overflow-y: auto" -->
      <a-table
        ref="table"
        :pagination="false"
        style="margin-top: 10px"
        size="default"
        bordered
        :columns="columns"
        :data-source="insideZdxx"
        :alert="true"
        :rowKey="(record) => record.code"
      >
      </a-table>
    </div>

    <div v-else class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div>
  </div>
</template>


<script>
import { getSoundRecordingList } from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'

export default {
  components: {},
  props: {
    jbxx: Object,
    patientInfo: Object,
  },
  data() {
    return {
      insideZdxx: this.jbxx.zdxx,
      columns: [
        {
          title: '医院诊断类别名称',
          dataIndex: 'zdlbmc',
        },
        {
          title: '诊断编码',
          dataIndex: 'zdbm',
          ellipsis: true,
        },
        {
          title: '医院诊断名称',
          // innerHeight:20,
          dataIndex: 'zdbmmc',
        },
        {
          title: '诊断时间',
          dataIndex: 'zdsj',
          ellipsis: true,
        },
        {
          title: '主要诊断标志',
          dataIndex: 'zyzdbz',
          ellipsis: true,
        },
        {
          title: '疑似诊断标志',
          dataIndex: 'yzdbz',
          ellipsis: true,
        },
      ],
    }
  },

  created() {},
  methods: {
    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    refreshData(zdxx) {
      this.insideZdxx = zdxx
    },
  },
}
</script>
<style lang="less" scoped>
.nodata {
  height: 90%;
  width: 99%;
  text-align: center;
  padding-top: 150px;
}

.inner-wrap {
  max-height: 388px;
  // overflow-y: auto;
  // overflow: hidden;
  font-size: 12px;
  padding: 10px;
  // background-color: aquamarine;
  width: 99%;

  .div-title {
    // margin-top: 10px;
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

  .div-basic {
    padding: 0 10px 10px 10px;
    margin-top: 8px;
    color: #333;
    border: #eaeaea solid 1px;
    .div-line-wrap {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: center;
      flex-direction: row;

      .div-item-four {
        width: 25%;
      }

      .div-item-two {
        width: 50%;
      }
    }
  }
}
</style>
