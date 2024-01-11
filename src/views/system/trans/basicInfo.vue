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
            性别：<span style="text-decoration: underline">{{
              jbxx.xb == "1" ? "男" : "女"
            }}</span>
          </div>
          <div class="div-item-four">
            <!-- 出生日期：<span style="text-decoration: underline">{{ patientInfo.baseInfo.birthday }}</span> -->
            出生日期：<span style="text-decoration: underline">{{ jbxx.csny }}</span>
          </div>
          <div class="div-item-four">
            出生地：<span style="text-decoration: underline">{{ jbxx.csd }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            籍贯：<span style="text-decoration: underline">{{ jbxx.jg }}</span>
          </div>
          <div class="div-item-four">
            婚姻：<span style="text-decoration: underline">{{ jbxx.hyzkmc }}</span>
          </div>
          <div class="div-item-four">
            民族：<span style="text-decoration: underline">{{ jbxx.mzmc }}</span>
          </div>
          <div class="div-item-four">
            国籍：<span style="text-decoration: underline">{{ jbxx.gjmc }}</span>
          </div>
          <!-- <div class="div-item-four">
            新生儿出生体重：<span style="text-decoration: underline">{{
              jbxx.xsecstz || "-"
            }}</span
            >&nbsp;克
          </div> -->
          <!-- <div class="div-item-four">
            新生儿入院体重：<span style="text-decoration: underline">{{
              jbxx.xserytz || "-"
            }}</span
            >&nbsp;克
          </div> -->
        </div>


        <div class="div-line-wrap">
          <div class="div-item-four">
            身份证号：<span style="text-decoration: underline">{{ jbxx.sfz }}</span>
          </div>
          <!-- <div class="div-item-four">
            职业：<span style="text-decoration: underline">{{ jbxx.zybm }}</span>
          </div>
          <div class="div-item-four">
            婚姻：<span style="text-decoration: underline">{{ jbxx.hyzkmc }}</span>
          </div> -->
        </div>


        <div class="div-line-wrap">
          <div class="div-item-four">
            职业：<span style="text-decoration: underline">{{ jbxx.zybm }}</span>
          </div>
          <div class="div-item-four">
            现居地址：<span style="text-decoration: underline">{{ jbxx.jzd }}</span>
          </div>

          <div class="div-item-four">
            电话：<span style="text-decoration: underline">{{ jbxx.lxdh }}</span>
          </div>

          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.hkyb }}</span>
          </div>
        </div>



        <div class="div-line-wrap">
          <div class="div-item-four" style="width: 50%;">
            工作单位及地址：<span
              style="text-decoration: underline; width: 200px; display: inline-block"
              >{{ jbxx.gzdw }}</span>
          </div>
          <div class="div-item-four" style="margin-left:-24px">
            单位电话：<span style="text-decoration: underline">{{ jbxx.gzdwdh }}</span>
          </div>

          <div class="div-item-four" style="margin-left: 25px;">
            邮编：<span style="text-decoration: underline">{{ jbxx.hkyb }}</span>
          </div>
        </div>


        <div class="div-line-wrap">
          <div class="div-item-four">
            联系人姓名：<span style="text-decoration: underline">{{ jbxx.lxrxm }}</span>
          </div>
          <div class="div-item-four">
            关系：<span style="text-decoration: underline">{{ jbxx.lxrgxmc }}</span>
          </div>
          <div class="div-item-four">
            地址：<span style="text-decoration: underline">{{ jbxx.lxrdz }}</span>
          </div>
          <div class="div-item-four">
            电话：<span style="text-decoration: underline">{{ jbxx.lxrdh }}</span>
          </div>
        </div>






        <!-- <div class="div-line-wrap">
          <div class="div-item-four">
            身份证号：<span style="text-decoration: underline">{{ jbxx.sfz }}</span>
          </div>
          <div class="div-item-four">
            职业：<span style="text-decoration: underline">{{ jbxx.zybm }}</span>
          </div>
          <div class="div-item-four">
            婚姻：<span style="text-decoration: underline">{{ jbxx.hyzkmc }}</span>
          </div>
        </div> -->



        <!-- <div class="div-line-wrap">
          <div class="div-item-four">
            身份证号：<span style="text-decoration: underline">{{ jbxx.sfz }}</span>
          </div>
          <div class="div-item-four">
            职业：<span style="text-decoration: underline">{{ jbxx.zybm }}</span>
          </div>
          <div class="div-item-four">
            婚姻：<span style="text-decoration: underline">{{ jbxx.hyzkmc }}</span>
          </div>
        </div> -->







        <!-- TODO -->
        <!-- csd  overflow: hidden; text-overflow: ellipsis; white-space: nowrap  限制一行 -->
        <!-- <div class="div-line-wrap">
          <div class="div-item-two">
            户籍地址：<span
              style="text-decoration: underline; width: 86%; display: inline-block"
              >{{ jbxx.hkdz }}</span
            >
          </div>

          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.hkyb }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">
            现居地址：<span
              style="text-decoration: underline; width: 86%; display: inline-block"
              >{{ jbxx.jzd }}</span
            >
          </div>
          <div class="div-item-four">
            电话：<span style="text-decoration: underline">{{ jbxx.lxdh }}</span>
          </div>
          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.xzzyb }}</span>
          </div>
        </div> -->


        <!-- <div class="div-line-wrap">
          <div class="div-item-two">
            工作单位及地址：<span
              style="text-decoration: underline; width: 200px; display: inline-block"
              >{{ jbxx.gzdw }}</span
            >
          </div>
          <div class="div-item-four">
            单位电话：<span style="text-decoration: underline">{{ jbxx.gzdwdh }}</span>
          </div>
          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.gzdwyb }}</span>
          </div>
        </div> -->



     

       

        <div class="div-line-wrap">
          <div class="div-item-four">
            入院途径：<span style="text-decoration: underline">{{ jbxx.rylxmc }}</span>
          </div>
          <!-- <div class="div-item-four">
            入院时间：<span style="text-decoration: underline">{{ jbxx.rysj }}</span>
          </div>
          <div class="div-item-four">
            入院科别：<span style="text-decoration: underline">{{ jbxx.rybq }}</span>
          </div>
          <div class="div-item-four">
            病区：<span style="text-decoration: underline">{{ jbxx.rybq }}</span>
          </div> -->
        </div>



        <div class="div-line-wrap">
          <div class="div-item-four">
            入院日期：<span style="text-decoration: underline">{{ jbxx.rysj }}</span>
          </div>
          <div class="div-item-four">
            入院科别：<span style="text-decoration: underline">{{ jbxx.rybq }}</span>
          </div>
          <div class="div-item-four">
            病区：<span style="text-decoration: underline">{{ jbxx.rybq }}</span>
          </div>

          <div class="div-item-four">
            转科：<span style="text-decoration: underline">{{ jbxx.szbq || "-" }}</span>
           
          </div>
        </div>


        <div class="div-line-wrap">
          <div class="div-item-four">
            出院日期：<span style="text-decoration: underline">{{ jbxx.cysj }}</span>
          </div>
          <div class="div-item-four">
            出院科别：<span style="text-decoration: underline">{{ jbxx.cybq }}</span>
          </div>
          <div class="div-item-four">
            科室：<span style="text-decoration: underline">{{ jbxx.cybq }}</span>
          </div>
          <div class="div-item-four">
            实际住院：<span style="text-decoration: underline">{{ jbxx.sjzyts }}</span
            >&nbsp;天
          </div>
        </div>



        <div class="div-line-wrap">
          <div class="div-item-four" style="width: 46.5%;">
            门(急)诊诊断：<span style="text-decoration: underline">{{ jbxx.mzzd }}</span>
          </div>
          <div class="div-item-four">
            入院时病情：<span style="text-decoration: underline">{{ jbxx.ryqk }}</span>
          </div>
          <!-- <div class="div-item-four">
            科室：<span style="text-decoration: underline">{{ jbxx.cybq }}</span>
          </div>
          <div class="div-item-four">
            实际住院：<span style="text-decoration: underline">{{ jbxx.sjzyts }}</span
            >&nbsp;天
          </div> -->
        </div>




        <div class="div-line-wrap">
          <div class="div-item-four" style="width: 45.3%;">
            入院诊断：<span style="text-decoration: underline">{{ jbxx.ryzd }}</span>
          </div>
          <div class="div-item-four">
            入院诊断日期：<span style="text-decoration: underline">{{ jbxx.qzrq }}</span>
          </div>
          <!-- <div class="div-item-four">
            科室：<span style="text-decoration: underline">{{ jbxx.cybq }}</span>
          </div>
          <div class="div-item-four">
            实际住院：<span style="text-decoration: underline">{{ jbxx.sjzyts }}</span
            >&nbsp;天
          </div> -->
        </div>


        <div class="div-line-wrap">
          <div class="div-item-four">
            住院期间是否病危：<span style="text-decoration: underline">{{ jbxx.sfcxwjn }}</span>
          </div>
        </div>








        <!-- <div class="div-line-wrap">
          <div class="div-item-four">
            转科：<span style="text-decoration: underline">{{ jbxx.zkksbm1 || "-" }}</span
            ><span style="margin-left: 10px">转：</span
            ><span style="text-decoration: underline">{{ jbxx.zkksbm2 || "-" }}</span>
            <span style="margin-left: 10px">转：</span
            ><span style="text-decoration: underline">{{ jbxx.zkksbm3 || "-" }}</span>
          </div>
          <div class="div-item-four"></div>
          <div class="div-item-four"></div>
          <div class="div-item-four"></div>
        </div> -->

      
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
        :data-source="jbxx.diagnosisInfo"
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
        :data-source="jbxx.operationInfo"
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
          <span class="fee-des">住院总费用（元）：总费用</span>
          <span class="value">{{ jbxx.zfy + "" || "" }}</span>
          <span class="name">（自付金额：</span>
          <span class="value">{{ jbxx.zfje + "" || "" }}</span>
          <span class="name">其他支付：</span>
          <span class="value">{{ jbxx.zfy - jbxx.zfje + "" || "" }}</span
          >）
        </div>
        <div class="div-fee-line">
          <span class="fee-des">1.综合医疗服务类：</span>
          <span class="name">（1）一般治疗服务费：</span>
          <span class="value">{{ jbxx.ylfwf + "" || "" }}</span>
          <span class="name">（2）一般治疗操作费：</span>
          <span class="value">{{ jbxx.zlczf + "" || "" }}</span>
          <span class="name">（3）护理费：</span>
          <span class="value">{{ jbxx.hlf + "" || "" }}</span>
          <span class="name">（4）其他费用：</span>
          <span class="value">{{ jbxx.qtf + "" || "" }}</span>
        </div>

        <!-- <div class="div-fee-line">
          <span class="name">（4）手术费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（5）麻醉费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（6）接生费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（7）婴儿费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div> -->
        <div class="div-fee-line">
          <span class="fee-des">2.诊断类：</span>
          <span class="name">（5）病理诊断费：</span>
          <span class="value">{{ jbxx.blzdf + "" || "" }}</span>
          <span class="name">（6）实验室诊断费：</span>
          <span class="value">{{ jbxx.syszdf + "" || "" }}</span>
          <span class="name">（7）影像学诊断费：</span>
          <span class="value">{{ jbxx.yxxzdf + "" || "" }}</span>
          <span class="name">（8）临床诊断项目费：</span>
          <span class="value">{{ jbxx.lczdxmf + "" || "" }}</span>
        </div>
        <!-- <div class="div-fee-line">
          <span class="name">（11）监护仪费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（12）调温费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
        </div> -->
        <div class="div-fee-line">
          <span class="fee-des">3.治疗类：</span>
          <span class="name">（9）非手术治疗项目费：</span>
          <span class="value">{{ jbxx.fsszlxmf + "" || "" }}</span>
          <span class="name">（临床物理治疗费：</span>
          <span class="value">{{ jbxx.lcwlzlf + "" || "" }}</span
          >）
        </div>
        <div class="div-fee-line">
          <span class="name">（10）手术治疗费：</span>
          <span class="value">{{ jbxx.sszlf + "" || "" }}</span>
          <span class="name">（麻醉费：</span>
          <span class="value">{{ jbxx.mzf + "" || "" }}</span>
          <span class="name">手术费：</span>
          <span class="value">{{ jbxx.ssf + "" || "" }}</span
          >）

          <!-- <span class="name">（17）病理费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">（18）内镜检查费：</span>
          <span class="value">{{ info.reqDocName || "" }}</span>
          <span class="name">其他检查费用：</span>
          <span class="value">{{ info.reqDocName || "" }}</span> -->
        </div>
        <div class="div-fee-line">
          <span class="fee-des">4.康复类：</span>
          <span class="name">（11）康复费：</span>
          <span class="value">{{ jbxx.kff + "" || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">5.中医类：</span>
          <span class="name">（12）中医治疗费：</span>
          <span class="value">{{ jbxx.zyzlf + "" || "" }}</span>
          <!-- <span class="value" style="padding-right: 20px"
            >{{ info.reqDocName || "" }}（抗菌药物费用:&nbsp;&nbsp;&nbsp;{{}}）</span
          > -->
        </div>
        <div class="div-fee-line">
          <span class="fee-des">6.西药类：</span>
          <span class="name">（13）西药费：</span>
          <span class="value">{{ jbxx.xyf + "" || "" }}</span>
          <span class="name">（抗菌药物费用：</span>
          <span class="value">{{ jbxx.kjywfy + "" || "" }}</span
          >）
        </div>
        <div class="div-fee-line">
          <span class="fee-des">7.中药类：</span>
          <span class="name">（14）中成药费：</span>
          <span class="value">{{ jbxx.zcyf + "" || "" }}</span>
          <span class="name">（15）中草药费：</span>
          <span class="value">{{ jbxx.zcaf + "" || "" }}</span>
        </div>

        <div class="div-fee-line">
          <span class="fee-des">8.血液和血液制品类：</span>
          <span class="name">（16）血费：</span>
          <span class="value">{{ jbxx.xf + "" || "" }}</span>
          <span class="name">（17）白蛋白类制品费：</span>
          <span class="value">{{ jbxx.bdbzpf + "" || "" }}</span>
          <span class="name">（18）球蛋白类制品费：</span>
          <span class="value">{{ jbxx.qdbzpf + "" || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="name">（19）凝血因子类制品费：</span>
          <span class="value">{{ jbxx.nxyzzpf + "" || "" }}</span>
          <span class="name">（20）细胞因子类制品费：</span>
          <span class="value">{{ jbxx.xbyzzpf + "" || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">9.耗材类：</span>
          <span class="name">（21）检查用一次性医用材料费：</span>
          <span class="value">{{ jbxx.jcyyclf  + "" || "" }}</span>
          <span class="name">（22）治疗用一次性医用材料费：</span>
          <span class="value">{{ jbxx.zlyyclf + "" || "" }}</span>
          <span class="name">（23）手术用一次性医用材料费：</span>
          <span class="value">{{ jbxx.ssyyclf + "" || "" }}</span>
        </div>
        <div class="div-fee-line">
          <span class="fee-des">10.其他类：</span>
          <span class="name">（31）其他费：</span>
          <span class="value">{{ jbxx.qtf1 + "" || "" }}</span>
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
    // patientInfo: Object,
  },
  data() {

    // var spanArr = []
    // var position = 0
    // //列合并
    // const renderContent = (value, row, index) => {
    //   const obj = {
    //     children: value,
    //     attrs: {},
    //   }
    //   const _row = spanArr[index]
    //   const _col = _row > 0 ? 1 : 0
    //   obj.attrs = {
    //     rowSpan: _row,
    //     colSpan: _col,
    //   }

    //   return obj
    // }


    //    //计算合并
    //    const rowspan = (data) => {
    //   spanArr = []
    //   position = 0
    //   data.forEach((item, index) => {
    //     if (index === 0) {
    //       spanArr.push(1)
    //       position = 0
    //     } else {
    //       //需要合并的地方判断
    //       if (data[index].zdmc === data[index - 1].zdmc) {
    //         spanArr[position] += 1
    //         spanArr.push(0)
    //       } else {
    //         spanArr.push(1)
    //         position = index
    //       }
    //     }
    //   })
    // }



    return {
      
      info: { reqDocName: "" },
      insideZdxx: this.jbxx,
      columns: [
        {
          title: "出院诊断",
          dataIndex: "cyzdbz",
          width:200,
          ellipse:true,
          align: "center",

          render: (value, record, index) => {
          const obj = {
            children: value,
            props: {},
          };
          let arr = this.jbxx.diagnosisInfo.filter((res) => {
            //这里cyzdbz是我需要判断的字段名（相同就合并）
            return res.cyzdbz == record.cyzdbz;   //cyzdbz
          });
          if (index == 0 || this.jbxx.diagnosisInfot[index - 1].cyzdbz != record.cyzdbz) {
            obj.props.rowSpan = arr.length;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
        },


        

        {
          title: "出院情况",
          dataIndex: "cyqkbm",
          align: "center",
          children: [
            {
              title: "1.治愈",
              dataIndex: "yzy",
              align: "center",
            },
            {
              title: "2.好转",
              dataIndex: "hz",
              align: "center",
            },
            {
              title: "3.未愈",
              dataIndex: "wy",
              align: "center",
            },
            {
              title: "4.死亡",
              dataIndex: "sw",
              align: "center",
            }, {
              title: "5.其他",
              dataIndex: "qt",
              align: "center",
            },
          ],
        },
        {
          title: "ICD-10编码",
          // innerHeight:20,
          dataIndex: "zdbm",
        },
        // {
        //   title: "诊断时间",
        //   dataIndex: "zdsj",
        //   ellipsis: true,
        // },
        // {
        //   title: "主要诊断标志",
        //   // dataIndex: "zyzdbz",
        //   dataIndex: "cyzdbz",
        //   ellipsis: true,
        // },
        // {
        //   title: "疑似诊断标志",
        //   dataIndex: "yzdbz",
        //   ellipsis: true,
        // },
      ],
      columnsSurgery: [
        {
          title: "手术操作编码",
          // ellipsis: true,
          // width:90,
          dataIndex: "ssczbm",
        },
        {
          title: "手术操作日期",
          dataIndex: "sskssj",
          ellipsis: true,
        },
        {
          title: "手术级别",
          // innerHeight:20,
          dataIndex: "ssjbmc",
        },
        {
          title: "手术操作名称",
          dataIndex: "ssczmc",
          ellipsis: true,
        },
        {
          title: "术者",
          dataIndex: "ssysxm",
          ellipsis: true,
          align: "center",
          children: [
            {
              title: "术者",
              dataIndex: "ssysxm",
              align: "center",
            },
            {
              title: "I助",
              dataIndex: "ssysz1xm",
              align: "center",
            },
            {
              title: "II助",
              dataIndex: "ssysz2xm",
              align: "center",
            },
          ],
        },
        {
          title: "切口等级",
          dataIndex: "qkyhdj",
          ellipsis: true,
        },
        {
          title: "麻醉医生",
          dataIndex: "mzysxm",
          ellipsis: true,
        },
        {
          title: "麻醉方式",
          dataIndex: "mzfsmc",
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

    refreshData(fileMainData) {
      // rowspan(fileMainData.diagnosisInfo)
      this.jbxx = fileMainData;
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
