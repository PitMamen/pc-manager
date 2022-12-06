<template>
  <div style="height: 500px; width: 100%">
    <div v-if="dataList.length > 0">
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
              <div v-if="indexData != dataList.length - 1" class="div-line"></div>
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
                <basic-info
                  style="margin-top: 2px; margin-left: 10px; border: #eaeaea solid 1px; overflow: hidden"
                  ref="basicInfo"
                  :jbxx="jbxx"
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
</template>


<script>
import { getFileList, getFileDtail } from '@/api/modular/system/posManage'
import basicInfo from './basicInfo'
import { TRUE_USER } from '@/store/mutation-types'
import { decodeRecord } from '@/utils/forgeUtils'
import Vue from 'vue'
export default {
  components: { basicInfo },
  props: {
    record: Object,
  },
  data() {
    return {
      isDoubled: true,
      activeKey: '1',
      jbxx: { name: '李四' },
      user: {},
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
      dataList: [
        { time: '2022-11-01', id: 1, isChecked: true },
        { time: '2022-11-02', id: 2, isChecked: false },
        { time: '2022-11-03', id: 3, isChecked: false },
      ],
    }
  },

  created() {
    // debugger
    // this.dataList = [{ name: 'ff' }]
    this.user = Vue.ls.get(TRUE_USER)
    console.log('this.dataList.length', this.dataList.length)
    let param = {
      // dataOwnerId: this.record.userId,
      dataOwnerId: '1195',
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
  },
  methods: {
    onFileItemClick(itemData, indexData) {
      for (let index = 0; index < this.historyList.length; index++) {
        this.$set(this.historyList[index], 'isChecked', false)
        if (indexData == index) {
          this.$set(this.historyList[index], 'isChecked', true)
        }
      }
      this.getDetailOut(indexData)
      this.jbxx = { name: '王五' }
    },

    getDetailOut(index) {
      let param = {
        // dataOwnerId: this.record.userId,
        dataOwnerId: '1195',
        dataUserId: this.user.userId,
        recordType: this.recordType,
        serialNumber: this.historyList[index].serialNumber,
        hospitalCode: this.historyList[index].hospitalCode,
      }
      getFileDtail(param).then((res) => {
        if (res.code === 0) {
          this.fileDetailData = decodeRecord(res.encryptedRecord, res.wrappedDEK)
          if (this.fileDetailData) {
            console.log('this.fileDetailData', this.fileDetailData)
            console.log('this.fileDetailDataStr', JSON.stringify(this.fileDetailData))
          } else {
            uni.$u.toast('解密失败')
          }
          // this.onHistoryItemClick(res.data[0].id)
        } else {
          this.$message.error(res.message)
        }
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
      .span-tab {
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: 12px;
        overflow: hidden;

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
