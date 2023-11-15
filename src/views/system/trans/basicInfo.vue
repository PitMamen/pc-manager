<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div
      v-if="jbxx"
      style="overflow-y: auto; height: 480px; padding-right: 10px; padding-bottom: 10px"
    >
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
            出生日期：<span style="text-decoration: underline">{{
              jbxx.cismain.csny
            }}</span>
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
            新生儿出生体重：<span style="text-decoration: underline">{{
              jbxx.fgg || "-"
            }}</span
            >&nbsp;克
          </div>
          <div class="div-item-four">
            新生儿入院体重：<span style="text-decoration: underline">{{
              jbxx.cismain.xserytz || "-"
            }}</span
            >&nbsp;克
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">
            出生地址：<span
              style="text-decoration: underline; width: 86%; display: inline-block"
              >{{ jbxx.cismain.csd }}</span
            >
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
            身份证号：<span style="text-decoration: underline">{{
              patientInfo.baseInfo.identificationNo
            }}</span>
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
            户籍地址：<span
              style="text-decoration: underline; width: 86%; display: inline-block"
              >{{ jbxx.cismain.hkdz }}</span
            >
          </div>

          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.cismain.hkyb }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">
            现居地址：<span
              style="text-decoration: underline; width: 86%; display: inline-block"
              >{{ jbxx.cismain.jzd }}</span
            >
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
            工作单位及地址：<span
              style="text-decoration: underline; width: 200px; display: inline-block"
              >{{ jbxx.cismain.gzdw }}</span
            >
          </div>
          <div class="div-item-four">
            单位电话：<span style="text-decoration: underline">{{
              jbxx.cismain.gzdwdh
            }}</span>
          </div>
          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{
              jbxx.cismain.gzdwyb
            }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            联系人姓名：<span style="text-decoration: underline">{{
              jbxx.cismain.lxrxm
            }}</span>
          </div>
          <div class="div-item-four">
            关系：<span style="text-decoration: underline">{{
              jbxx.cismain.lxrgxmc
            }}</span>
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
            入院途径：<span style="text-decoration: underline">{{
              jbxx.cismain.rylxmc
            }}</span>
          </div>
          <div class="div-item-four">
            入院时间：<span style="text-decoration: underline">{{
              jbxx.cismain.rysj
            }}</span>
          </div>
          <div class="div-item-four">
            入院科别：<span style="text-decoration: underline">{{
              jbxx.cismain.ryksmc
            }}</span>
          </div>
          <div class="div-item-four">
            病区：<span style="text-decoration: underline">{{ jbxx.cismain.rybq }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            转科：<span style="text-decoration: underline">{{
              jbxx.cismain.zkksbm1 || "-"
            }}</span
            ><span style="margin-left: 10px">转：</span
            ><span style="text-decoration: underline">{{
              jbxx.cismain.zkksbm2 || "-"
            }}</span>
            <span style="margin-left: 10px">转：</span
            ><span style="text-decoration: underline">{{
              jbxx.cismain.zkksbm3 || "-"
            }}</span>
          </div>
          <div class="div-item-four"></div>
          <div class="div-item-four"></div>
          <div class="div-item-four"></div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            出院时间：<span style="text-decoration: underline">{{
              jbxx.cismain.cysj
            }}</span>
          </div>
          <div class="div-item-four">
            出院科别：<span style="text-decoration: underline">{{
              jbxx.cismain.cyksmc
            }}</span>
          </div>
          <div class="div-item-four">
            病房：<span style="text-decoration: underline">{{ jbxx.cismain.cybq }}</span>
          </div>
          <div class="div-item-four">
            实际住院：<span style="text-decoration: underline">{{
              jbxx.cismain.sjzyts
            }}</span
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

      <div class="div-title" style="margin-top: 10px">
        <div class="div-line-blue"></div>
        <span class="span-title">患者手术</span>
      </div>
      <!-- :scroll="{ x: true }" -->
      <!-- style="margin-left: 2%; min-height: 450px; overflow-y: auto" -->
      <a-table
        ref="table"
        :pagination="false"
        style="margin-top: 10px"
        size="default"
        bordered
        :scroll="{ x: true }"
        :columns="columnsSurgery"
        :data-source="insideZdxx"
        :alert="true"
        :rowKey="(record) => record.code"
      >
      </a-table>

      <div class="div-title" style="margin-top: 10px">
        <div class="div-line-blue"></div>
        <span class="span-title">住院费用</span>
      </div>
      <!-- 费用布局 -->
      <div class="div-fee">
        <div class="div-fee-line">
          <span class="fee-des">住院费用（元）：总费用</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">1.医疗类：</span>
          <span class="name">（1）一般治疗费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（2）特殊治疗费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（3）诊疗费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>

        <div class="div-fee-line">
          <!-- <span class="fee-des">1.医疗类：</span> -->
          <span class="name">（4）手术费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（5）麻醉费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（6）接生费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（7）婴儿费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">2.辅助医疗类：</span>
          <span class="name">（8）辅助医疗费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（9）输氧费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（10）呼吸机费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="name">（11）监护仪费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（12）调温费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">3.检查检验类：</span>
          <span class="name">（13）化验费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（14）放射费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（15）核素费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="name">（16）超声费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（17）病理费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（18）内镜检查费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">其他检查费用：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">4.护理类：</span>
          <span class="name">（20）护理费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（21）护理治疗费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">5.西药类：</span>
          <span class="name">（22）西药费：</span>
          <span class="value" >{{ info.reqDocName || "" }}</span>
          <span class="value" style="padding-right: 20px;">{{ info.reqDocName || "" }}（抗菌药物费用:&nbsp;&nbsp;&nbsp;{{  }}）</span>

        </div>
        <div class="div-fee-line">
          <span class="fee-des">6.中药类：</span>
          <span class="name">（23）中成药费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（24）中草药费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>

        </div>
        <div class="div-fee-line">
          <span class="fee-des">7.耗材类：</span>
          <span class="name">（25）手术用一次性医用材料费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（26）治疗用一次性医用材料费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="name">（27）检查用一次性医用材料费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">8.血液制品类：</span>
          <span class="name">（28）输血费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">9.床位类：</span>
          <span class="name">（29）床位费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（30）陪床费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">10.其他类：</span>
          <span class="name">（31）其他费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>

        </div>
      </div>
    </div>

    <div v-else class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    jbxx: Object,
    patientInfo: Object,
  },
  data() {
    return {
      info: { reqDocName: "" },
      insideZdxx: this.jbxx.zdxx,
      columns: [
        {
          title: "医院诊断类别名称",
          dataIndex: "zdlbmc",
        },
        {
          title: "诊断编码",
          dataIndex: "zdbm",
          ellipsis: true,
        },
        {
          title: "医院诊断名称",
          // innerHeight:20,
          dataIndex: "zdbmmc",
        },
        {
          title: "诊断时间",
          dataIndex: "zdsj",
          ellipsis: true,
        },
        {
          title: "主要诊断标志",
          dataIndex: "zyzdbz",
          ellipsis: true,
        },
        {
          title: "疑似诊断标志",
          dataIndex: "yzdbz",
          ellipsis: true,
        },
      ],
      columnsSurgery: [
        {
          title: "手术操作编码",
          // ellipsis: true,
          // width:90,
          dataIndex: "zdlbmc",
        },
        {
          title: "手术操作日期",
          dataIndex: "zdbm",
          ellipsis: true,
        },
        {
          title: "手术级别",
          // innerHeight:20,
          dataIndex: "zdbmmc",
        },
        {
          title: "手术操作名称",
          dataIndex: "zdsj",
          ellipsis: true,
        },
        {
          title: "术者",
          dataIndex: "zyzdbz",
          ellipsis: true,
          align: "center",
          children: [
            {
              title: "术者",
              dataIndex: "inNum",
              align: "center",
            },
            {
              title: "I助",
              dataIndex: "avgPrice",
              align: "center",
            },
            {
              title: "II助",
              dataIndex: "inMoney",
              align: "center",
            },
          ],
        },
        {
          title: "切口等级",
          dataIndex: "defe",
          ellipsis: true,
        },
        {
          title: "麻醉医生",
          dataIndex: "fergre",
          ellipsis: true,
        },
        {
          title: "麻醉方式",
          dataIndex: "fergtre",
          ellipsis: true,
        },
      ],
    };
  },

  created() {},
  methods: {
    formatDate(date) {
      date = new Date(date);
      let myyear = date.getFullYear();
      let mymonth = date.getMonth() + 1;
      let myweekday = date.getDate();
      mymonth < 10 ? (mymonth = "0" + mymonth) : mymonth;
      myweekday < 10 ? (myweekday = "0" + myweekday) : myweekday;
      return `${myyear}-${mymonth}-${myweekday}`;
    },

    refreshData(zdxx) {
      this.insideZdxx = zdxx;
    },
  },
};
</script>
<style lang="less" scoped>
.nodata {
  height: 90%;
  width: 99%;
  text-align: center;
  padding-top: 150px;
}

.inner-wrap {
  max-height: 488px;
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

  .div-fee {
    .div-fee-line {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      // align-items: center;

      .fee-des {
        color: #1a1a1a;
        font-weight: bold;
      }
      .name {
        padding-left: 10px;
        padding-right: 10px;
        &:first-child {
          padding-left: 0px;
        }
      }
      .value {
        padding-left: 5px;
        padding-right: 20px;
        border-bottom: 1px solid #1a1a1a;
        &.image {
          display: inline-block;
          max-width: 80px;
          max-height: 80px;
          vertical-align: bottom;
          border-bottom: none;
        }
      }
    }
  }
}
</style>
