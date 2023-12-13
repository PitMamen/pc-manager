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
                  <span class="div-time" :class="{ checked: itemData.isChecked }">{{ itemData.inDate }}</span>
                  <span :class="{ checked: itemData.isChecked }">{{ itemData.hospitalName }}</span>
                </div>

                <div v-if="indexData != historyList.length - 1" class="div-line"></div>
              </div>
            </div>

            <!-- @change="tabChange" -->
            <div v-if="MEDICAL_DATA_SOURCE == '0'" class="content-main">
              <!-- style="margin-top: -10px; position: relative" -->
              <a-tabs
                @change="tabChange"
                v-model="activeKey"
                type="line"
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
                    ref="basicTech1"
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
                    ref="basicTech2"
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
          </div>
        </div>
      </div>
      <div v-else class="nodata">
        <img src="~@/assets/icons/img_nodata.png" />
      </div>
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
  getBycode,
} from '@/api/modular/system/posManage'
import basicInfo from './basicInfo'
import basicXiaojie from './basicXiaojie'
import basicTech from './basicTech'
// import basicMedic from "./basicMedic";
// import basicSurgery from "./basicSurgery";
// import basicFee from "./basicFee";
import { TRUE_USER } from '@/store/mutation-types'
import { decodeRecord } from '@/utils/forgeUtils'
import { formatDateFull, formatDate, countAge, getQiekou, getSurgeryLevel } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
export default {
  components: { basicInfo, basicTech, basicXiaojie },
  props: {
    record: Object,
  },
  data() {
    return {
      MEDICAL_DATA_SOURCE: '0', //档案来源 1：从emr获取 0：从私有云获取
      zmrHtml: '', //出院小结HTML
      isDoubled: true,
      confirmLoading: false,
      isSingle: false,
      defaultShowType: 'jiancha',
      activeKey: '1',
      jbxx: { name: '李四' },
      user: {},
      patientInfo: { baseInfo: { identificationNo: '3256543' } },
      showData: {},
      showDataYizhu: {},
      showDataShoushu: {},
      historyList: [{ time: '2022-10-11' }, { time: '2022-10-16' }, { time: '2023-01-18' }],
      /**
       * 			if (index === 0) {
					recordType = 'all'
				} else if (index === 1) {
					recordType = 'zhuyuan'
				} else if (index === 2) {
					recordType = 'menzhen'
				}
       */
      recordType: 'zhuyuan',
      jianyanData: {},
      jianChaData: {},
      typeList: [], //检查类型
      fileDetailData: {
        // zdxx: {
        //   xm: "张三",
        // },
        ssxx: [{}, {}],
        zdxx: [
          {
            zdbmmc: '的的',
          },
          {
            zdbmmc: '个人个人',
          },
          {
            zdbmmc: '法人',
          },
        ],
        cismain: { csny: '发发发发发' },
      },
      accountUserId: '', //登录用户的userId

      fileMainData: {},
      fileSummaryData: {},
    }
  },

  created() {
    // debugger
    this.user = Vue.ls.get(TRUE_USER)


    console.log('created', this.record)

    this.getTimeLineData()
  },
  methods: {
    //患者档案列表进来时，id就是identificationId
    getTimeLineData() {
      let param
      if (this.record.tradeId) {
        //仅一条
        param = {
          tradeId: this.record.tradeId,
        }
        this.isSingle = true
      } else {
        param = {
          identificationId: this.record.id, //多条时间线
        }
      }

      //TODO 测试代码，暂时写死
      // param = {
      //   identificationId: 74,
      // };
      console.log('getTimeLineData', param)
      this.confirmLoading = true
      getSynRecord(param)
        .then((res) => {
          if (res.code === 0) {
            this.historyList = res.data
            if (this.historyList.length > 0) {
              this.historyList.forEach((history) => {
                this.$set(history, 'isChecked', false)
              })
              this.$set(this.historyList[0], 'isChecked', true)
              // this.getDetailOut(0);
              this.getBycodeOut()
              this.getDetailData(0)
              this.getCaseCheckOut(0)
              this.getCaseExamOut(0)
              this.getSummaryData(0)
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false     //这里不要置为false 数据多加载慢 导致点击其他tab时渲染不出界面 等首页数据加载完了   再置为false
        })
    },

    getBycodeOut() {
      var request = {
        code: 'CHECK_TYPE_DIC',
      }
      getBycode(request).then((res) => {
        if (res.code == 0) {
          this.typeList = res.data
        }
      })
    },

    //档案首页数据
    getDetailData(index) {
      getCaseMain({ caseId: this.historyList[index].id })
        // getCaseMain({ caseId: 1 }) //TODO 测试代码，暂时写死
        .then((res) => {
          if (res.code === 0) {
            this.fileMainData = decodeRecord(res.data.cipher, res.data.data)
            if (this.fileMainData.diagnosisInfo.length > 0) {
              this.fileMainData.diagnosisInfo.forEach((item) => {
                this.$set(item, 'zdsj', formatDateFull(item.zdsj))

                if (item.cyzdbz == 1) {
                  this.$set(item, 'cyzdbz', '主要诊断')
                } else if (item.cyzdbz == 2) {
                  this.$set(item, 'cyzdbz', '其他诊断')
                }

                if (item.yzdbz == 0) {
                  this.$set(item, 'yzdbz', '已确诊')
                } else if (item.yzdbz == 1) {
                  this.$set(item, 'yzdbz', '仍疑似')
                }
              })
            }
            if (this.fileMainData.operationInfo.length > 0) {
              this.fileMainData.operationInfo.forEach((item) => {
                this.$set(item, 'sskssj', formatDateFull(item.sskssj).substring(0, 10))
                this.$set(item, 'qkyhdj', getQiekou(item.qkyhdj))
                // this.$set(item, "ssjb", getSurgeryLevel(item.ssjb));
              })
            }
            // console.log("getDetailData", JSON.stringify(this.fileMainData));
            this.$set(this.fileMainData, 'nl', countAge(this.fileMainData.csny))
            let str =
              this.fileMainData.csny.substring(0, 4) +
              '-' +
              this.fileMainData.csny.substring(4, 6) +
              '-' +
              this.fileMainData.csny.substring(6, 8)
            this.$set(this.fileMainData, 'csny', str)
            this.$set(this.fileMainData, 'rysj', moment(this.fileMainData.rysj).format('YYYY-MM-DD HH:mm:ss'))
            this.$set(this.fileMainData, 'cysj', moment(this.fileMainData.cysj).format('YYYY-MM-DD HH:mm:ss'))
            this.$refs.basicInfo.refreshData(this.fileMainData)
          } else {
            this.fileMainData = undefined
            // this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    // 获取检查数据
    getCaseCheckOut(index) {
      getCaseCheck({ caseId: this.historyList[index].id })
        .then((res) => {
          if (res.code === 0 && res.data.cipher) {
            this.jianChaData = decodeRecord(res.data.cipher, res.data.data)
            console.log('解密检查：', this.jianChaData)
            if (this.jianChaData.length > 0 && this.typeList.length > 0) {
              this.typeList.forEach((itemOut) => {
                this.jianChaData.forEach((itemIn) => {
                  if (itemIn.examtype == itemOut.code) {
                    this.$set(itemIn, 'examtype', itemOut.value)
                    console.log('TTT:', itemIn.examtype)
                  }
                })
              })
            }
            this.$nextTick(() => {
              this.$refs.basicTech2.refreshData(this.jianChaData,'jiancha');
            });
          } else {
            this.jianChaData = undefined
            this.$nextTick(() => {
              this.$refs.basicTech2.refreshData(undefined,'jiancha');
            });
            // this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    // 获取检验数据
    getCaseExamOut(index) {
      getCaseExam({ caseId: this.historyList[index].id })
        .then((res) => {
          if (res.code === 0 && res.data.cipher) {
            this.jianyanData = decodeRecord(res.data.cipher, res.data.data)
            console.log('解密检验：', this.jianyanData)
            this.$nextTick(() => {
              this.$refs.basicTech1.refreshData(this.jianyanData,'jianyan');
            });
          } else {
            this.jianyanData = undefined
            this.$nextTick(() => {
              this.$refs.basicTech1.refreshData(undefined,'jianyan');
            });
            // this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    //档案首页数据
    getSummaryData(index) {
      this.confirmLoading = true
      getCaseSummary({ caseId: this.historyList[index].id })
        // getCaseMain({ caseId: 1 }) //TODO 测试代码，暂时写死
        .then((res) => {
          if (res.code === 0) {
            this.fileSummaryData = decodeRecord(res.data.cipher, res.data.data)
            console.log('fileSummaryData', JSON.stringify(this.fileSummaryData))

            let str =
              this.fileSummaryData.rysj.substring(0, 4) +
              '-' +
              this.fileSummaryData.rysj.substring(4, 6) +
              '-' +
              this.fileSummaryData.rysj.substring(6, 8)
            this.$set(this.fileSummaryData, 'rysj', str)
            let str2 =
              this.fileSummaryData.cysj.substring(0, 4) +
              '-' +
              this.fileSummaryData.cysj.substring(4, 6) +
              '-' +
              this.fileSummaryData.cysj.substring(6, 8)
            this.$set(this.fileSummaryData, 'cysj', str2)

            if (this.fileSummaryData.ywscsj) {
              this.$set(
                this.fileSummaryData,
                'ywscsj',
                moment(this.fileSummaryData.ywscsj).format('YYYY-MM-DD HH:mm:ss')
              )
            }

            this.$nextTick(() => {
              this.$refs.basicXiaojie.refreshData(this.fileSummaryData)
            })
          } else {
            this.fileSummaryData = undefined
            // this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    onFileItemClick(itemData, indexData) {
      console.log('YYY:', indexData)
      for (let index = 0; index < this.historyList.length; index++) {
        this.$set(this.historyList[index], 'isChecked', false)
        if (indexData == index) {
          this.$set(this.historyList[index], 'isChecked', true)
        }
      }
      this.confirmLoading = true

      this.getDetailData(indexData)
      this.getCaseCheckOut(indexData)
      this.getCaseExamOut(indexData)
      this.getSummaryData(indexData)
    },

    tabChange(key) {
      console.log('KKKK:', key)
      if (key == 1) {
        this.$refs.basicInfo.refreshData(this.fileDetailData.zdxx)
      } else if (key == 2) {
        //检验
        if (this.jianyanData&&this.jianyanData.length > 0) {
          this.$nextTick(() => {
            this.$refs.basicTech1.refreshData(this.jianyanData, 'jianyan')
          })
        }else{
          this.$nextTick(() => {
            this.$refs.basicTech1.refreshData(undefined, 'jianyan')
          })
        }
      } else if (key == 3) {
        //检查
        if (this.jianChaData&&this.jianChaData.length > 0) {
          this.$nextTick(() => {
            this.$refs.basicTech2.refreshData(this.jianChaData, 'jiancha')
          })
        }else{
          this.$nextTick(() => {
            this.$refs.basicTech2.refreshData(undefined, 'jiancha')
          })
        }
      } else if (key == 4) {
        this.$nextTick(() => {
          // this.$refs.basicXiaojie.refreshData(this.zmrHtml);
          this.$refs.basicXiaojie.refreshData(this.fileSummaryData)
        })
      }
    },

    goCancel() {
      console.log('hdh')
      // this.$emit("handleCancel", "");
    },
  },
}
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
