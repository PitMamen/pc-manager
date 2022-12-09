<template>
  <a-spin :spinning="confirmLoading">
    <div style="height: 500px; width: 100%">
      <div v-if="historyList.length > 0">
        <div class="file-wrap">
          <div class="left-btn">
            <div class="default" :class="{ doubled: isDoubled }">住院</div>
            <div class="default">门诊</div>
            <div class="default">体检</div>
          </div>
          <div class="right-content">
            <div class="content-top">
              <span style="margin-left: 10px">住院时间：</span>
              <div
                class="data-item"
                v-for="(itemData, indexData) in historyList"
                :key="indexData"
                :value="itemData.docId"
              >
                <span
                  @click="onFileItemClick(itemData, indexData)"
                  class="div-time"
                  :class="{ checked: itemData.isChecked }"
                  >{{ itemData.happenedTime.substring(0, 11) }}</span
                >
                <div v-if="indexData != historyList.length - 1" class="div-line"></div>
              </div>
            </div>
            <div class="content-main">
              <a-tabs v-model="activeKey" type="line" style="margin-top: -10px; position: relative">
                <a-tab-pane key="1">
                  <template #tab>
                    <span class="span-tab">
                      <img
                        style="width: 13px; height: 13px; margin-right: 7px"
                        :class="{ 'checked-icon': activeKey == '1' }"
                        src="~@/assets/icons/jbxx.svg"
                      />
                      基本信息
                    </span>
                  </template>
                  <!-- style="margin-top: 2px; margin-left: 10px; border: #eaeaea solid 1px; overflow: hidden" -->
                  <basic-info
                    style="margin-top: 2px; margin-left: 10px; overflow: hidden"
                    ref="basicInfo"
                    :jbxx="fileDetailData"
                    :patientInfo="patientInfo"
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
                      医技信息
                    </span>
                  </template>
                  <basic-tech
                    style="margin-top: 2px; margin-left: 10px; overflow: hidden"
                    ref="basicTech"
                    :jbxx="fileDetailData"
                    :showType="defaultShowType"
                    :showData="showData"
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
                      医嘱
                    </span>
                  </template>
                  <basic-medic
                    style="margin-top: 2px; margin-left: 10px; overflow: hidden"
                    ref="basicMedic"
                    :jbxx="fileDetailData"
                    :showData="showDataYizhu"
                  />
                </a-tab-pane>
                <a-tab-pane key="4">
                  <template #tab>
                    <span class="span-tab">
                      <img
                        style="width: 13px; height: 13px; margin-right: 7px"
                        :class="{ 'checked-icon': activeKey == '4' }"
                        src="~@/assets/icons/shoushu.svg"
                      />
                      手术
                    </span>
                  </template>
                </a-tab-pane>
                <a-tab-pane key="5">
                  <template #tab>
                    <span class="span-tab">
                      <img
                        style="width: 13px; height: 13px; margin-right: 7px"
                        :class="{ 'checked-icon': activeKey == '5' }"
                        src="~@/assets/icons/feiyong.svg"
                      />
                      费用
                    </span>
                  </template>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="nodata">
        <img src="~@/assets/icons/img_nodata.png" />
      </div>
      <div style="margin-top: 12px; display: flex; flex-direction: row-reverse">
        <a-button
          type="default"
          @click="goCancel"
          style="width: 90px; color: #1890ff !important; border-color: #1890ff !important"
        >
          关闭
        </a-button>
      </div>
    </div>
  </a-spin>
</template>


<script>
import { getFileList, getFileDtail, getBaseInfo } from '@/api/modular/system/posManage'
import basicInfo from './basicInfo'
import basicTech from './basicTech'
import basicMedic from './basicMedic'
import { TRUE_USER } from '@/store/mutation-types'
import { decodeRecord } from '@/utils/forgeUtils'
import { formatDateFull, formatDate } from '@/utils/util'
import Vue from 'vue'
export default {
  components: { basicInfo, basicTech, basicMedic },
  props: {
    record: Object,
  },
  data() {
    return {
      isDoubled: true,
      confirmLoading: false,
      defaultShowType: undefined,
      activeKey: '1',
      jbxx: { name: '李四' },
      user: {},
      patientInfo: {},
      showData: {},
      showDataYizhu: {},
      historyList: [],
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
      fileDetailData: {},
      accountUserId: '', //登录用户的userId
    }
  },

  created() {
    // debugger
    this.user = Vue.ls.get(TRUE_USER)
    console.log('this.historyList.length', this.historyList.length)
    let param = {
      dataOwnerId: this.record.userId,
      // dataOwnerId: '1195',
      // dataOwnerId: '1239',
      // dataOwnerId: '1194',
      dataUserId: this.user.userId,
      recordType: this.recordType,
      pastMonths: '60',
    }
    getFileList(param).then((res) => {
      if (res.code === 0) {
        this.historyList = res.data
        for (let index = 0; index < this.historyList.length; index++) {
          this.$set(this.historyList[index], 'isChecked', false)
        }
        this.$set(this.historyList[0], 'isChecked', true)
        this.getDetailOut(0)
        // this.onHistoryItemClick(res.data[0].id)
      } else {
        this.$message.error(res.message)
      }
    })

    this.getPatientBaseInfo()
  },
  methods: {
    getPatientBaseInfo() {
      getBaseInfo({ userId: this.record.userId }).then((res) => {
        if (res.code === 0) {
          let birthday = res.data.baseInfo.birthday
          res.data.baseInfo.birthday =
            birthday.substring(0, 4) + '-' + birthday.substring(4, 6) + '-' + birthday.substring(6, 8)
          this.patientInfo = res.data
          // this.subStringIdcardNo(this.patientInfo.identificationNo);
        } else {
          this.$message.error(res.message)
        }
      })
    },

    onFileItemClick(itemData, indexData) {
      for (let index = 0; index < this.historyList.length; index++) {
        this.$set(this.historyList[index], 'isChecked', false)
        if (indexData == index) {
          this.$set(this.historyList[index], 'isChecked', true)
        }
      }
      this.getDetailOut(indexData)
    },

    getDetailOut(index) {
      let param = {
        dataOwnerId: this.record.userId,
        // dataOwnerId: '1195',
        // dataOwnerId: '1239',
        // dataOwnerId: '1194',
        dataUserId: this.user.userId,
        recordType: this.recordType,
        serialNumber: this.historyList[index].serialNumber,
        hospitalCode: this.historyList[index].hospitalCode,
      }
      this.confirmLoading = true
      getFileDtail(param)
        .then((res) => {
          this.confirmLoading = false
          if (res.code === 0) {
            this.fileDetailData = decodeRecord(res.encryptedRecord, res.wrappedDEK)
            if (this.fileDetailData) {
              //数据处理统一放在外层页面做
              this.fileDetailData.cismain.rysj = formatDate(new Date(this.fileDetailData.cismain.rysj))
              this.fileDetailData.cismain.cysj = formatDate(new Date(this.fileDetailData.cismain.cysj))
              this.fileDetailData.zdxx.zdsj = formatDate(new Date(this.fileDetailData.zdxx.zdsj))

              //检查检验合并数组并排序
              let newArr = []
              //处理检查数据
              if (this.fileDetailData.yqjc && this.fileDetailData.yqjc.length > 0) {
                for (let index = 0; index < this.fileDetailData.yqjc.length; index++) {
                  newArr.push({
                    id: index,
                    type: 'jiancha',
                    name: this.fileDetailData.yqjc[index].jcmc,
                    color: 'gray',
                    time: this.fileDetailData.yqjc[index].jysj,
                    timeStr: formatDate(new Date(this.fileDetailData.yqjc[index].jysj)),
                    data: this.fileDetailData.yqjc[index],
                  })
                }
                console.log('this.fileDetailData.yqjcStr 检查', JSON.stringify(this.fileDetailData.yqjc))
              }

              //处理检验数据
              let length = newArr.length
              if (this.fileDetailData.sysjc && this.fileDetailData.sysjc.length > 0) {
                for (let index = 0; index < this.fileDetailData.sysjc.length; index++) {
                  this.fileDetailData.sysjc[index].jyjgzb.forEach((itemFor, indexFor) => {
                    this.$set(itemFor, 'xh', indexFor + 1)
                  })
                  newArr.push({
                    id: index + length,
                    type: 'jianyan',
                    name: this.fileDetailData.sysjc[index].bgdlb,
                    color: 'gray',
                    time: this.fileDetailData.sysjc[index].jyrq,
                    timeStr: formatDate(new Date(this.fileDetailData.sysjc[index].jyrq)),
                    data: this.fileDetailData.sysjc[index],
                  })
                }
                console.log('this.fileDetailData.sysjc 检验', JSON.stringify(this.fileDetailData.sysjc))
              }
              //排序处理
              newArr.sort((a, b) => {
                return b.time - a.time
              })
              this.$set(this.fileDetailData, 'newArr', newArr)
              if (this.fileDetailData.newArr.length > 0) {
                this.$set(this.fileDetailData.newArr[0], 'color', 'blue')
                this.defaultShowType = this.fileDetailData.newArr[0].type
                this.showData = this.fileDetailData.newArr[0].data
              }
              console.log('this.fileDetailData.newArrStr', JSON.stringify(this.fileDetailData.newArr))

              //处理医嘱数据  需要按时间将一级数组封装成新的二级数组
              for (let index = 0; index < this.fileDetailData.yzxx.length; index++) {
                this.$set(
                  this.fileDetailData.yzxx[index],
                  'timeStr',
                  formatDate(new Date(this.fileDetailData.yzxx[index].yzxdsj))
                )
                //组装发药数量
                this.$set(
                  this.fileDetailData.yzxx[index],
                  'fysl',
                  this.fileDetailData.yzxx[index].ypsl + this.fileDetailData.yzxx[index].ypdw
                )
                //组装每次剂量
                this.$set(
                  this.fileDetailData.yzxx[index],
                  'mcjl',
                  this.fileDetailData.yzxx[index].jl + this.fileDetailData.yzxx[index].dw
                )
                //组装每次数量
                this.$set(
                  this.fileDetailData.yzxx[index],
                  'mcsl',
                  this.fileDetailData.yzxx[index].mcsl + this.fileDetailData.yzxx[index].mcdw
                )
              }
              let newYzxx = []
              let dateArr = []
              if (this.fileDetailData.yzxx.length > 0) {
                for (let index = 0; index < this.fileDetailData.yzxx.length; index++) {
                  dateArr.push(this.fileDetailData.yzxx[index].timeStr)
                }
                dateArr = dateArr.filter((item, index) => {
                  //去重
                  return dateArr.indexOf(item) === index // 因为indexOf 只能查找到第一个
                })
              }
              console.log('dateArr', dateArr)
              for (let index = 0; index < dateArr.length; index++) {
                newYzxx.push({ color: 'gray', data: [], timeStr: dateArr[index] })
                for (let indexIn = 0; indexIn < this.fileDetailData.yzxx.length; indexIn++) {
                  if (dateArr[index] == this.fileDetailData.yzxx[indexIn].timeStr) {
                    newYzxx[index].data.push(JSON.parse(JSON.stringify(this.fileDetailData.yzxx[indexIn])))
                  }
                }
              }
              this.$set(this.fileDetailData, 'yzxx', newYzxx)

              if (this.fileDetailData.yzxx.length > 0) {
                this.showDataYizhu = this.fileDetailData.yzxx[0]
                this.$set(this.fileDetailData.yzxx[0], 'color', 'blue')
              }

              console.log('this.fileDetailDataStr', JSON.stringify(this.fileDetailData))
            } else {
              uni.$u.toast('解密失败')
            }

            // insideJbxx, insideShowType, insideShowData
            // :jbxx="fileDetailData"
            // :showType="defaultShowType"
            // :showData="showData"
            this.$refs.basicInfo.refreshData(this.fileDetailData.zdxx)
            this.$refs.basicTech.refreshData(this.fileDetailData, this.defaultShowType, this.showData)
            this.$refs.basicMedic.refreshData(this.fileDetailData, this.showDataYizhu)
            // this.onHistoryItemClick(res.data[0].id)
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    goCancel() {
      console.log('hdh')
      this.$emit('handleCancel', '')
    },
  },
}
</script>
<style lang="less" scoped>
/deep/ .ant-tabs-bar {
  margin: 0 !important;
}
.file-wrap {
  display: flex;
  height: 450px;
  font-size: 12px;
  flex-direction: row;

  .left-btn {
    width: 50px;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .default {
      margin: 0 auto;
      padding: 5px 12px;
      font-size: 12px;
      &.doubled {
        color: #1890ff;
        background-color: #eff7ff;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .right-content {
    width: 97%;
    border-left: #eaeaea 1px solid;
    display: flex;
    flex-direction: column;
    .content-top {
      display: flex;
      width: 100%;
      overflow-x: auto;
      align-items: center;
      flex-direction: row;

      .data-item {
        display: flex;
        align-items: center;
        flex-direction: row;

        .checked {
          color: #1890ff;
        }
      }
      .div-time {
        font-weight: bold;
        margin-left: 5px;
        &:hover {
          cursor: pointer;
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
      /deep/ .ant-tabs.ant-tabs-top.ant-tabs-line {
        border-bottom: 1px solid #eee !important;
      }
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
