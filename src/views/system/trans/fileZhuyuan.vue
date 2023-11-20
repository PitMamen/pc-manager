<template>
  <a-spin :spinning="confirmLoading">
    <div style="height: 600px; width: 100%">
      <div v-if="historyList.length > 0">
        <div class="file-wrap">
          <!-- <div class="left-btn">
            <div class="default" :class="{ doubled: isDoubled }">住院</div>
            <div class="default">门诊</div>
            <div class="default">体检</div>
          </div> -->
          <div class="right-content">
            <div class="content-top" v-if="!isSingle">
              <span style="min-width: 62px">住院记录：</span>
              <div
                class="data-item"
                v-for="(itemData, indexData) in historyList"
                :key="indexData"
                :value="itemData.docId"
              >
                <div class="div-top-item" @click="onFileItemClick(itemData, indexData)">
                  <span class="div-time" :class="{ checked: itemData.isChecked }">{{
                    itemData.inDate
                  }}</span>
                  <span :class="{ checked: itemData.isChecked }">{{
                    itemData.hospitalName
                  }}</span>
                </div>

                <div v-if="indexData != historyList.length - 1" class="div-line"></div>
              </div>
            </div>

            <div v-if="MEDICAL_DATA_SOURCE == '0'" class="content-main">
              <!-- style="margin-top: -10px; position: relative" -->
              <a-tabs
                v-model="activeKey"
                type="line"
                @change="tabChange"
                :tabBarStyle="{ textAlign: 'left', borderBottom: 'unset' }"
                style="position: relative"
              >
                <a-tab-pane key="1">
                  <template #tab>
                    <span class="span-tab">
                      <img
                        style="width: 13px; height: 13px; margin-right: 7px"
                        :class="{ 'checked-icon': activeKey == '1' }"
                        src="~@/assets/icons/jbxx.svg"
                      />
                      病案首页
                    </span>
                  </template>
                  <!-- style="margin-top: 2px; margin-left: 10px; border: #eaeaea solid 1px; overflow: hidden" -->
                  <!-- :patientInfo="patientInfo" -->
                  <basic-info
                    style="margin-top: 2px; margin-left: 10px; overflow: hidden"
                    ref="basicInfo"
                    :jbxx="fileMainData"
                  />
                </a-tab-pane>
                <a-tab-pane key="2">
                  <template #tab>
                    <span class="span-tab">
                      <img
                        style="width: 13px; height: 13px; margin-right: 7px"
                        :class="{ 'checked-icon': activeKey == '2' }"
                        src="~@/assets/icons/yjxx.svg"
                      />
                      检验报告
                    </span>
                  </template>
                  <basic-tech
                    style="margin-top: 2px; margin-left: 10px; overflow: hidden"
                    ref="basicTech"
                    :jbxx="jianyanData"
                    :showType="defaultShowType"
                  />
                </a-tab-pane>
                <a-tab-pane key="3">
                  <template #tab>
                    <span class="span-tab">
                      <img
                        style="width: 13px; height: 13px; margin-right: 7px"
                        :class="{ 'checked-icon': activeKey == '3' }"
                        src="~@/assets/icons/yongyao.svg"
                      />
                      检查报告
                    </span>
                  </template>
                  <basic-tech
                    style="margin-top: 2px; margin-left: 10px; overflow: hidden"
                    ref="basicTech"
                    :jbxx="jianChaData"
                    :showType="defaultShowType"
                  />
                </a-tab-pane>
                <a-tab-pane key="4">
                  <template #tab>
                    <span class="span-tab">
                      <img
                        style="width: 13px; height: 13px; margin-right: 7px"
                        :class="{ 'checked-icon': activeKey == '4' }"
                        src="~@/assets/icons/jbxx.svg"
                      />
                      出院小结
                    </span>
                  </template>

                  <!-- :jbxx="zmrHtml" -->
                  <!-- :showData="showData" -->
                  <basic-xiaojie
                    style="margin-top: 2px; margin-left: 10px; overflow: hidden"
                    ref="basicXiaojie"
                    :jbxx="fileSummaryData"
                  />
                </a-tab-pane>
              </a-tabs>
            </div>

            <!-- TODO 这条分支逻辑先不管，先全部按私有云处理 -->
            <div v-if="MEDICAL_DATA_SOURCE == '1'" class="content-main">
              <a-tabs
                v-model="activeKey"
                type="line"
                @change="tabChange"
                style="margin-top: -10px; position: relative"
              >
                <a-tab-pane key="6">
                  <template #tab>
                    <span class="span-tab">
                      <img
                        style="width: 13px; height: 13px; margin-right: 7px"
                        :class="{ 'checked-icon': activeKey == '6' }"
                        src="~@/assets/icons/jbxx.svg"
                      />
                      出院小结
                    </span>
                  </template>

                  <basic-xiaojie
                    style="margin-top: 2px; margin-left: 10px; overflow: hidden"
                    ref="basicXiaojie"
                    :jbxx="fileSummaryData"
                    :patientInfo="patientInfo"
                  />
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="nodata">
        <img src="~@/assets/icons/img_nodata.png" />
      </div>
      <!-- <div style="margin-top: 12px; display: flex; flex-direction: row-reverse">
        <a-button
          type="default"
          @click="goCancel"
          style="width: 90px; color: #1890ff !important; border-color: #1890ff !important"
        >
          关闭
        </a-button>
      </div> -->
    </div>
  </a-spin>
</template>

<script>
import {
  getSynRecord,
  getCaseMain,
  getFileList,
  getFileDtail,
  getBaseInfo,
  getZyRecords,
  getZySummary,
  getSysConfigData,
  getCaseExam,
  getCaseCheck,
  getCaseSummary,
} from "@/api/modular/system/posManage";
import basicInfo from "./basicInfo";
import basicXiaojie from "./basicXiaojie";
import basicTech from "./basicTech";
// import basicMedic from "./basicMedic";
// import basicSurgery from "./basicSurgery";
// import basicFee from "./basicFee";
import { TRUE_USER } from "@/store/mutation-types";
import { decodeRecord } from "@/utils/forgeUtils";
import { formatDateFull, formatDate, countAge } from "@/utils/util";
import Vue from "vue";
export default {
  components: { basicInfo, basicTech, basicXiaojie },
  props: {
    record: Object,
  },
  data() {
    return {
      MEDICAL_DATA_SOURCE: "0", //档案来源 1：从emr获取 0：从私有云获取
      zmrHtml: "", //出院小结HTML
      isDoubled: true,
      confirmLoading: false,
      isSingle: false,
      defaultShowType: "jiancha",
      activeKey: "1",
      jbxx: { name: "李四" },
      user: {},
      patientInfo: { baseInfo: { identificationNo: "3256543" } },
      showData: {},
      showDataYizhu: {},
      showDataShoushu: {},
      historyList: [
        { time: "2022-10-11" },
        { time: "2022-10-16" },
        { time: "2023-01-18" },
      ],
      /**
       * 			if (index === 0) {
					recordType = 'all'
				} else if (index === 1) {
					recordType = 'zhuyuan'
				} else if (index === 2) {
					recordType = 'menzhen'
				}
       */
      recordType: "zhuyuan",
      jianyanData: {},
      jianChaData: {},
      fileDetailData: {
        // zdxx: {
        //   xm: "张三",
        // },
        ssxx: [{}, {}],
        zdxx: [
          {
            zdbmmc: "的的",
          },
          {
            zdbmmc: "个人个人",
          },
          {
            zdbmmc: "法人",
          },
        ],
        cismain: { csny: "发发发发发" },
      },
      accountUserId: "", //登录用户的userId

      fileMainData: {},
      fileSummaryData: {},
    };
  },

  created() {
    // debugger
    this.user = Vue.ls.get(TRUE_USER);

    //查询系统配置  显示不同档案来源
    // getSysConfigData('MEDICAL_DATA_SOURCE').then((res) => {
    //   this.MEDICAL_DATA_SOURCE = res.data.value || '0'

    //   if (this.MEDICAL_DATA_SOURCE == '1') {
    //     //从emr获取
    //     this.getZyRecordsOut()
    //   } else {
    //     //私有云
    //     this.getFileListOut()
    //   }
    // }).

    //私有云
    // this.getFileListOut();

    // this.getPatientBaseInfo();

    console.log("created", this.record);

    this.getTimeLineData();
  },
  methods: {
    //患者档案列表进来时，id就是identificationId
    getTimeLineData() {
      let param;
      if (this.record.tradeId) {
        //仅一条
        param = {
          tradeId: this.record.tradeId,
        };
        this.isSingle = true;
      } else {
        param = {
          identificationId: this.record.id, //多条时间线
        };
      }

      //TODO 测试代码，暂时写死
      // param = {
      //   identificationId: 74,
      // };
      console.log("getTimeLineData", param);
      this.confirmLoading = true;
      getSynRecord(param)
        .then((res) => {
          if (res.code === 0) {
            this.historyList = res.data;
            if (this.historyList.length > 0) {
              this.historyList.forEach((history) => {
                this.$set(history, "isChecked", false);
              });
              this.$set(this.historyList[0], "isChecked", true);
              // this.getDetailOut(0);
              this.getDetailData(0);
              this.getCaseCheckOut(0);
              this.getCaseExamOut(0);
              this.getSummaryData(0);
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    //档案首页数据
    getDetailData(index) {
      getCaseMain({ caseId: this.historyList[index].id })
        // getCaseMain({ caseId: 1 }) //TODO 测试代码，暂时写死
        .then((res) => {
          if (res.code === 0) {
            this.fileMainData = decodeRecord(res.data.cipher, res.data.data);
            if (this.fileMainData.diagnosisInfo.length > 0) {
              this.fileMainData.diagnosisInfo.forEach((item) => {
                this.$set(item, "zdsj", formatDateFull(item.zdsj));
              });
            }
            if (this.fileMainData.operationInfo.length > 0) {
              this.fileMainData.operationInfo.forEach((item) => {
                this.$set(item, "sskssj", formatDateFull(item.sskssj).substring(0, 10));
              });
            }
            this.$set(this.fileMainData, "nl", countAge(this.fileMainData.csny));
            console.log("getDetailData", JSON.stringify(this.fileMainData));
            this.$refs.basicInfo.refreshData(this.fileMainData);
          } else {
            this.fileMainData = undefined;
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    // 获取检查数据
    getCaseCheckOut(index) {
      getCaseCheck({ caseId: this.historyList[index].id })
        .then((res) => {
          if (res.code === 0) {
            this.jianChaData = decodeRecord(res.data.cipher, res.data.data);
            console.log("解密：", this.jianChaData);
            // if (this.fileMainData.diagnosisInfo.length > 0) {
            //   this.fileMainData.diagnosisInfo.forEach((item) => {
            //     this.$set(item, 'zdsj', formatDateFull(item.zdsj))
            //   })
            // }
            // if (this.fileMainData.operationInfo.length > 0) {
            //   this.fileMainData.operationInfo.forEach((item) => {
            //     this.$set(item, 'sskssj', formatDateFull(item.sskssj).substring(0, 10))
            //   })
            // }
            // this.$set(this.fileMainData, 'nl', countAge(this.fileMainData.csny))
            // console.log('getDetailData', JSON.stringify(this.fileMainData))
            this.$refs.basicTech.refreshData(this.jianChaData);
          } else {
            this.jianChaData = undefined;
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    // 获取检验数据
    getCaseExamOut(index) {
      getCaseExam({ caseId: this.historyList[index].id })
        .then((res) => {
          if (res.code === 0) {
            this.jianyanData = decodeRecord(res.data.cipher, res.data.data);

            console.log("TTT:", this.jianyanData);
            // if (this.fileMainData.diagnosisInfo.length > 0) {
            //   this.fileMainData.diagnosisInfo.forEach((item) => {
            //     this.$set(item, 'zdsj', formatDateFull(item.zdsj))
            //   })
            // }
            // if (this.fileMainData.operationInfo.length > 0) {
            //   this.fileMainData.operationInfo.forEach((item) => {
            //     this.$set(item, 'sskssj', formatDateFull(item.sskssj).substring(0, 10))
            //   })
            // }
            // this.$set(this.fileMainData, 'nl', countAge(this.fileMainData.csny))
            // console.log('getDetailData', JSON.stringify(this.fileMainData))
            this.$refs.basicTech.refreshData(this.jianyanData);
          } else {
            this.jianyanData = undefined;
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    //档案首页数据
    getSummaryData(index) {
      getCaseSummary({ caseId: this.historyList[index].id })
        // getCaseMain({ caseId: 1 }) //TODO 测试代码，暂时写死
        .then((res) => {
          if (res.code === 0) {
            this.fileSummaryData = decodeRecord(res.data.cipher, res.data.data);
            console.log("fileSummaryData", JSON.stringify(this.fileSummaryData));

            this.$refs.basicXiaojie.refreshData(this.fileSummaryData);
          } else {
            this.fileSummaryData = undefined;
            this.$message.error(res.message);
          }

          //   this.fileMainData = decodeRecord(res.data.cipher, res.data.data);
          //   if (this.fileMainData.diagnosisInfo.length > 0) {
          //     this.fileMainData.diagnosisInfo.forEach((item) => {
          //       this.$set(item, "zdsj", formatDateFull(item.zdsj));
          //     });
          //   }
          //   if (this.fileMainData.operationInfo.length > 0) {
          //     this.fileMainData.operationInfo.forEach((item) => {
          //       this.$set(item, "sskssj", formatDateFull(item.sskssj).substring(0, 10));
          //     });
          //   }
          //   this.$set(this.fileMainData, "nl", countAge(this.fileMainData.csny));
          //   console.log("getDetailData", JSON.stringify(this.fileMainData));
          //   this.$refs.basicInfo.refreshData(this.fileMainData);
          // } else {
          //   this.fileMainData = undefined;
          //   this.$message.error(res.message);
          // }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    onFileItemClick(itemData, indexData) {
      console.log("YYY:", indexData);
      for (let index = 0; index < this.historyList.length; index++) {
        this.$set(this.historyList[index], "isChecked", false);
        if (indexData == index) {
          this.$set(this.historyList[index], "isChecked", true);
        }
      }

      this.getDetailData(indexData);
      this.getCaseCheckOut(indexData);
      this.getCaseExamOut(indexData);
      this.getSummaryData(indexData);
      // if (this.MEDICAL_DATA_SOURCE == "1") {
      //   //从emr获取

      //   this.getEMRData(itemData.zyh);
      // } else {
      //   //私有云
      //   this.getDetailOut(indexData);
      // }
    },

    //私有云档案 列表
    getFileListOut() {
      let param = {
        dataOwnerId: this.record.id,
        // dataOwnerId: this.record.userId,
        dataUserId: this.user.userId,
        recordType: this.recordType,
        pastMonths: "60",
      };
      this.confirmLoading = true;
      getFileList(param)
        .then((res) => {
          if (res.code === 0) {
            this.historyList = res.data;
            if (this.historyList.length > 0) {
              for (let index = 0; index < this.historyList.length; index++) {
                this.$set(this.historyList[index], "isChecked", false);
                var time = "未知时间";
                if (
                  this.historyList[index].happenedTime &&
                  this.historyList[index].happenedTime.length > 10
                ) {
                  time = this.historyList[index].happenedTime.substring(0, 10);
                }
                this.$set(this.historyList[index], "time", time);
              }
              this.$set(this.historyList[0], "isChecked", true);
              this.getDetailOut(0);
            } else {
              this.confirmLoading = false;
            }
          } else {
            this.$message.error(res.message);
            this.confirmLoading = false;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    getPatientBaseInfo() {
      getBaseInfo({ userId: this.record.id }).then((res) => {
        if (res.code === 0) {
          let birthday = res.data.baseInfo.birthday;
          res.data.baseInfo.birthday =
            birthday.substring(0, 4) +
            "-" +
            birthday.substring(4, 6) +
            "-" +
            birthday.substring(6, 8);
          this.patientInfo = res.data;
          this.patientInfo.baseInfo.identificationNo = this.patientInfo.baseInfo.identificationNo.replace(
            /^(.{6})(?:\d+)(.{4})$/,
            "$1********$2"
          );
        } else {
          this.$message.error(res.message);
        }
      });
    },

    //emr档案 列表
    getZyRecordsOut() {
      let param = {
        userId: this.record.id,
      };
      this.confirmLoading = true;
      getZyRecords(param)
        .then((res) => {
          if (res.code === 0 && res.data) {
            this.historyList = res.data;

            if (this.historyList.length > 0) {
              for (let index = 0; index < this.historyList.length; index++) {
                this.$set(this.historyList[index], "isChecked", false);
                var time = "未知时间";
                if (
                  this.historyList[index].cysj &&
                  this.historyList[index].cysj.length > 10
                ) {
                  time = this.historyList[index].cysj.substring(0, 10);
                }
                this.$set(this.historyList[index], "time", time);
              }
              this.$set(this.historyList[0], "isChecked", true);
              this.getEMRData(this.historyList[0].zyh);
            } else {
              this.confirmLoading = false;
            }
          } else {
            this.confirmLoading = false;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    //emr档案 详情
    getEMRData(zylsh) {
      getZySummary({ zylsh: zylsh }).then((res) => {
        this.confirmLoading = false;
        if (res.code == 0 && res.data) {
          this.zmrHtml = res.data;
        } else {
          this.zmrHtml = [];
        }
        this.activeKey = "6";
        this.$nextTick(() => {
          this.$refs.basicXiaojie.refreshData(this.zmrHtml);
        });
      });
    },
    // onFileItemClick(itemData, indexData) {
    //   for (let index = 0; index < this.historyList.length; index++) {
    //     this.$set(this.historyList[index], "isChecked", false);
    //     if (indexData == index) {
    //       this.$set(this.historyList[index], "isChecked", true);
    //     }
    //   }
    //   if (this.MEDICAL_DATA_SOURCE == "1") {
    //     //从emr获取

    //     this.getEMRData(itemData.zyh);
    //   } else {
    //     //私有云
    //     this.getDetailOut(indexData);
    //   }
    // },

    //私有云档案详情
    getDetailOut(index) {
      let param = {
        dataOwnerId: this.record.id,
        // dataOwnerId: '1195',
        // dataOwnerId: '1239',
        // dataOwnerId: '1194',
        dataUserId: this.user.userId,
        recordType: this.recordType,
        serialNumber: this.historyList[index].serialNumber,
        hospitalCode: this.historyList[index].hospitalCode,
      };
      this.confirmLoading = true;
      getFileDtail(param)
        .then((res) => {
          this.confirmLoading = false;
          if (res.code === 0) {
            this.fileDetailData = decodeRecord(res.encryptedRecord, res.wrappedDEK);
            if (this.fileDetailData) {
              console.log(
                "this.fileDetailDataStr ***",
                JSON.stringify(this.fileDetailData)
              );
              //数据处理统一放在外层页面做
              this.fileDetailData.cismain.rysj = formatDate(
                new Date(this.fileDetailData.cismain.rysj)
              );
              this.fileDetailData.cismain.cysj = formatDate(
                new Date(this.fileDetailData.cismain.cysj)
              );

              //脱敏处理
              this.fileDetailData.cismain.lxdh = this.fileDetailData.cismain.lxdh.replace(
                /(\d{3})\d{4}(\d{4})/,
                "$1****$2"
              );
              this.fileDetailData.cismain.gzdwdh = this.fileDetailData.cismain.gzdwdh.replace(
                /(\d{3})\d{4}(\d{4})/,
                "$1****$2"
              );
              this.fileDetailData.cismain.lxrdh = this.fileDetailData.cismain.lxrdh.replace(
                /(\d{3})\d{4}(\d{4})/,
                "$1****$2"
              );
              if (this.fileDetailData.cismain && this.fileDetailData.cismain.csny) {
                this.fileDetailData.cismain.csny =
                  this.fileDetailData.cismain.csny.substring(0, 4) +
                  "-" +
                  this.fileDetailData.cismain.csny.substring(4, 6) +
                  "-" +
                  this.fileDetailData.cismain.csny.substring(6, 8);
                this.fileDetailData.zdxx.forEach((item) => {
                  item.zdsj = formatDate(new Date(item.zdsj));
                });
              }

              //检查检验合并数组并排序
              let newArr = [];
              //处理检查数据
              if (this.fileDetailData.yqjc && this.fileDetailData.yqjc.length > 0) {
                for (let index = 0; index < this.fileDetailData.yqjc.length; index++) {
                  newArr.push({
                    id: index,
                    type: "jiancha",
                    name: this.fileDetailData.yqjc[index].jcmc,
                    color: "gray",
                    time: this.fileDetailData.yqjc[index].jysj,
                    timeStr: formatDate(new Date(this.fileDetailData.yqjc[index].jysj)),
                    data: this.fileDetailData.yqjc[index],
                  });
                }
                console.log(
                  "this.fileDetailData.yqjcStr 检查",
                  JSON.stringify(this.fileDetailData.yqjc)
                );
              }

              //处理检验数据
              let length = newArr.length;
              if (this.fileDetailData.sysjc && this.fileDetailData.sysjc.length > 0) {
                for (let index = 0; index < this.fileDetailData.sysjc.length; index++) {
                  this.fileDetailData.sysjc[index].jyjgzb.forEach((itemFor, indexFor) => {
                    this.$set(itemFor, "xh", indexFor + 1);
                  });
                  newArr.push({
                    id: index + length,
                    type: "jianyan",
                    name: this.fileDetailData.sysjc[index].bgdlb,
                    color: "gray",
                    time: this.fileDetailData.sysjc[index].jyrq,
                    timeStr: formatDate(new Date(this.fileDetailData.sysjc[index].jyrq)),
                    data: this.fileDetailData.sysjc[index],
                  });
                }
                console.log(
                  "this.fileDetailData.sysjc 检验",
                  JSON.stringify(this.fileDetailData.sysjc)
                );
              }
              //排序处理
              newArr.sort((a, b) => {
                return b.time - a.time;
              });
              this.$set(this.fileDetailData, "newArr", newArr);
              if (this.fileDetailData.newArr.length > 0) {
                this.$set(this.fileDetailData.newArr[0], "color", "blue");
                this.defaultShowType = this.fileDetailData.newArr[0].type;
                this.showData = this.fileDetailData.newArr[0].data;
              }
              console.log(
                "this.fileDetailData.newArrStr",
                JSON.stringify(this.fileDetailData.newArr)
              );

              //处理医嘱数据  需要按时间将一级数组封装成新的二级数组
              for (let index = 0; index < this.fileDetailData.yzxx.length; index++) {
                this.$set(
                  this.fileDetailData.yzxx[index],
                  "timeStr",
                  formatDate(new Date(this.fileDetailData.yzxx[index].yzxdsj))
                );
                //组装发药数量
                this.$set(
                  this.fileDetailData.yzxx[index],
                  "fysl",
                  this.fileDetailData.yzxx[index].ypsl +
                    this.fileDetailData.yzxx[index].ypdw
                );
                //组装每次剂量
                this.$set(
                  this.fileDetailData.yzxx[index],
                  "mcjl",
                  this.fileDetailData.yzxx[index].jl + this.fileDetailData.yzxx[index].dw
                );
                //组装每次数量
                this.$set(
                  this.fileDetailData.yzxx[index],
                  "mcsl",
                  this.fileDetailData.yzxx[index].mcsl +
                    this.fileDetailData.yzxx[index].mcdw
                );
              }
              let newYzxx = [];
              let dateArr = [];
              if (this.fileDetailData.yzxx.length > 0) {
                for (let index = 0; index < this.fileDetailData.yzxx.length; index++) {
                  dateArr.push(this.fileDetailData.yzxx[index].timeStr);
                }
                dateArr = dateArr.filter((item, index) => {
                  //去重
                  return dateArr.indexOf(item) === index; // 因为indexOf 只能查找到第一个
                });
              }
              console.log("dateArr", dateArr);
              for (let index = 0; index < dateArr.length; index++) {
                newYzxx.push({ color: "gray", data: [], timeStr: dateArr[index] });
                for (
                  let indexIn = 0;
                  indexIn < this.fileDetailData.yzxx.length;
                  indexIn++
                ) {
                  if (dateArr[index] == this.fileDetailData.yzxx[indexIn].timeStr) {
                    newYzxx[index].data.push(
                      JSON.parse(JSON.stringify(this.fileDetailData.yzxx[indexIn]))
                    );
                  }
                }
              }
              this.$set(this.fileDetailData, "yzxx", newYzxx);

              if (this.fileDetailData.yzxx.length > 0) {
                this.showDataYizhu = this.fileDetailData.yzxx[0];
                this.$set(this.fileDetailData.yzxx[0], "color", "blue");
              }

              //处理手术信息 需要按时间将一级数组封装成新的二级数组
              for (let index = 0; index < this.fileDetailData.ssxx.length; index++) {
                this.$set(
                  this.fileDetailData.ssxx[index],
                  "timeStr",
                  formatDate(new Date(this.fileDetailData.ssxx[index].sskssj))
                );
                // //组装发药数量
                // this.$set(
                //   this.fileDetailData.ssxx[index],
                //   'fysl',
                //   this.fileDetailData.ssxx[index].ypsl + this.fileDetailData.ssxx[index].ypdw
                // )
              }
              let newYzxxSX = [];
              let dateArrSX = [];
              if (this.fileDetailData.ssxx.length > 0) {
                for (let index = 0; index < this.fileDetailData.ssxx.length; index++) {
                  dateArrSX.push(this.fileDetailData.ssxx[index].timeStr);
                }
                dateArrSX = dateArrSX.filter((item, index) => {
                  //去重
                  return dateArrSX.indexOf(item) === index; // 因为indexOf 只能查找到第一个
                });
              }
              console.log("dateArrSS手术", dateArrSX);
              for (let index = 0; index < dateArrSX.length; index++) {
                newYzxxSX.push({ color: "gray", data: [], timeStr: dateArrSX[index] });
                for (
                  let indexIn = 0;
                  indexIn < this.fileDetailData.ssxx.length;
                  indexIn++
                ) {
                  if (dateArrSX[index] == this.fileDetailData.ssxx[indexIn].timeStr) {
                    newYzxxSX[index].data.push(
                      JSON.parse(JSON.stringify(this.fileDetailData.ssxx[indexIn]))
                    );
                  }
                }
              }
              this.$set(this.fileDetailData, "ssxx", newYzxxSX);

              if (this.fileDetailData.ssxx.length > 0) {
                this.showDataShoushu = this.fileDetailData.ssxx[0];
                this.$set(this.fileDetailData.ssxx[0], "color", "blue");
              }

              //组装收费信息 数组根据收费名称封装成二级数组，计算二级数组的总和
              let newYzxxSF = [];
              let dateArrSF = [];
              if (this.fileDetailData.sfxx.length > 0) {
                for (let index = 0; index < this.fileDetailData.sfxx.length; index++) {
                  dateArrSF.push(this.fileDetailData.sfxx[index].mxfylbmc);
                }
                dateArrSF = dateArrSF.filter((item, index) => {
                  //去重
                  return dateArrSF.indexOf(item) === index; // 因为indexOf 只能查找到第一个
                });
              }
              console.log("dateArrSS收费", dateArrSF);
              for (let index = 0; index < dateArrSF.length; index++) {
                newYzxxSF.push({ color: "gray", data: [], mxfylbmc: dateArrSF[index] });
                for (
                  let indexIn = 0;
                  indexIn < this.fileDetailData.sfxx.length;
                  indexIn++
                ) {
                  if (dateArrSF[index] == this.fileDetailData.sfxx[indexIn].mxfylbmc) {
                    newYzxxSF[index].data.push(
                      JSON.parse(JSON.stringify(this.fileDetailData.sfxx[indexIn]))
                    );
                  }
                }
              }

              //增加总数
              for (let index = 0; index < newYzxxSF.length; index++) {
                let itemTotal = 0;
                for (let indexIn = 0; indexIn < newYzxxSF[index].data.length; indexIn++) {
                  itemTotal = itemTotal + newYzxxSF[index].data[indexIn].mxxmje;
                }

                this.$set(
                  newYzxxSF[index],
                  "mxxmje",
                  itemTotal > 0 ? itemTotal.toFixed(2) : 0
                );

                this.$set(newYzxxSF[index], "mxxmmc", newYzxxSF[index].mxfylbmc);
              }

              // mxxmje 收费金额   mxfylbmc 收费名称
              this.$set(this.fileDetailData, "sfxx", newYzxxSF);
              console.log("newYzxxSF", JSON.stringify(newYzxxSF));

              console.log("this.fileDetailDataStr", JSON.stringify(this.fileDetailData));
            } else {
              uni.$u.toast("解密失败");
            }

            // this.$nextTick(() => {
            this.$refs.basicInfo.refreshData(this.fileDetailData.zdxx);
            if (this.$refs.basicTech && this.fileDetailData.newArr.length > 0) {
              this.$refs.basicTech.refreshData(
                this.fileDetailData,
                this.defaultShowType,
                this.showData
              );
            }
            if (this.$refs.basicMedic && this.fileDetailData.yzxx.length > 0) {
              this.$refs.basicMedic.refreshData(this.fileDetailData, this.showDataYizhu);
            }

            if (this.$refs.basicSurgery) {
              this.$refs.basicSurgery.refreshData(
                this.fileDetailData,
                this.showDataShoushu
              );
            }
            if (this.$refs.basicFee) {
              this.$refs.basicFee.refreshData(
                JSON.parse(JSON.stringify(this.fileDetailData.sfxx))
              );
            }
            if (this.$refs.basicXiaojie) {
              this.$refs.basicXiaojie.refreshData(this.fileDetailData.zdxx);
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    tabChange(key) {
      console.log("KKKK:", key);
      if (key == 1) {
        this.$refs.basicInfo.refreshData(this.fileDetailData.zdxx);
      } else if (key == 2) {
        //检验
        if (this.jianyanData.length > 0) {
          this.$refs.basicTech.refreshData(
            "jianyan",
            this.defaultShowType
            // this.showData
          );
        }
      } else if (key == 3) {
        //检查
        if (this.jianChaData.length > 0) {
          this.$refs.basicTech.refreshData(
            "jiancha",
            this.defaultShowType
            // this.showData
          );
        }
      } else if (key == 4) {
        this.$nextTick(() => {
          // this.$refs.basicXiaojie.refreshData(this.zmrHtml);
          this.$refs.basicXiaojie.refreshData(this.fileDetailData);
        });
      }
    },

    goCancel() {
      console.log("hdh");
      // this.$emit("handleCancel", "");
    },
  },
};
</script>
<style lang="less" scoped>
// /deep/ .ant-tabs-bar {
//   margin: 0 !important;
// }
/deep/ .ant-tabs-left-bar {
  margin-top: 100px !important;
}

/deep/ .ant-tabs-bar {
  margin-bottom: 0 !important;
}

/deep/ .ant-tabs-nav-animated {
  margin-left: 15px !important;
}
/deep/ .ant-tabs-tab {
  padding: 12px 4px !important;
}

.file-wrap {
  display: flex;
  height: 450px;
  font-size: 12px;
  flex-direction: row;

  .right-content {
    width: 100%;
    // border-left: #eaeaea 1px solid;
    display: flex;
    flex-direction: column;
    .content-top {
      display: flex;
      width: 100%;
      overflow-x: auto;
      margin-top: 20px;
      align-items: center;
      flex-direction: row;
      flex-shrink: 0;

      .data-item {
        display: flex;
        align-items: center;
        flex-direction: row;
        flex-shrink: 0;

        .div-top-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          &:hover {
            cursor: pointer;
          }

          .div-time {
            font-weight: bold;
            margin-left: 5px;
          }
        }

        .checked {
          color: #1890ff;
        }
      }

      .div-line {
        margin-left: 5px;
        width: 30px;
        height: 2px;
        background-color: #eaeaea;
      }
    }

    .content-main {
      margin-top: 10px;
      // /deep/ .ant-tabs.ant-tabs-top.ant-tabs-line {
      //   border-bottom: 1px solid #eee !important;
      // }
      .span-tab {
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: 12px;
        overflow: hidden;

        &:hover {
          img {
            filter: drop-shadow(#1890ff 600px 0);
            transform: translateX(-600px);
          }
        }

        // svg 使用到 drop-shadow 阴影展示 ， 所以父元素加 overflow: hidden;
        .checked-icon {
          filter: drop-shadow(#1890ff 600px 0);
          transform: translateX(-600px);
        }
      }
    }
  }
}
.nodata {
  height: 90%;
  width: 100%;
  text-align: center;
  padding-top: 150px;
}
</style>
//
<style lang="less" scoped>
// /deep/ .ant-tabs-left-bar {
//   margin-top: 10% !important;
// }
//
</style>
