<template>
  <a-modal
    :title="'新增团队成员'"
    :width="460"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>选择成员:</span>
            <a-select
              style="margin-top: 1px"
              v-model="checkData.userId"
              :filter-option="false"
              allow-clear
              placeholder="请选择成员"
            >
              <a-select-option v-for="(item, index) in UserListData" :key="item.userId" :value="item.userId">{{
                item.userName
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content" style="width: 274px; margin-left: -4px">
            <span class="span-item-name" style="width: 146px; margin-right: 23px; margin-top: -60px"
              ><span style="color: red">*</span>团队角色:</span
            >
            <a-radio-group
              v-model="checkData.teamRole"
              name="radioGroup"
              style="margin-left: 0px; margin-top: 10px"
              v-decorator="['xm', { rules: [{ required: true, message: '请选择角色！' }] }]"
            >
              <a-radio
                v-for="(item, index) in TeamTypeData"
                :key="index"
                :value="item.code"
                @click="checkRoleType(item.code)"
              >
                {{ item.value }}
              </a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
    
    
    <script>
import {
  modifyTdHealthyTeam,
  getHealthyTeamUserList,
  getDictDataForCodeTeamType,
  addTdHealthyTeamUser,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      UserListData: [],
      danandataList: [],
      checkData: {
        tdHealthyTeamId: 0,
        teamRole: undefined,
        userId: undefined,
      },
      TeamTypeData: [],
    }
  },
  created() {},
  methods: {
    clearData() {
      this.checkData = {
        tdHealthyTeamId: 0,
        teamRole: undefined,
        userId: undefined,
      }
    },
    //新增
    addUser(tdHealthyTeamId) {
      console.log('UUUUU:', tdHealthyTeamId)
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.checkData.tdHealthyTeamId = tdHealthyTeamId

      this.getHealthyTeamUserListOut()
      this.getDictDataForCodeTeamTypeOut()
    },

    /**
     * 角色类型
     */
    getDictDataForCodeTeamTypeOut() {
      this.confirmLoading = true
      getDictDataForCodeTeamType()
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.TeamTypeData = res.data
            for (let index = 0; index < this.TeamTypeData.length; index++) {
              this.TeamTypeData[index].code = Number(this.TeamTypeData[index].code)
            }
          } else {
            this.TeamTypeData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 提交添加人员
     */
    addTdHealthyTeamUserOut() {
      this.confirmLoading = true
      addTdHealthyTeamUser(this.checkData)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('添加成功！')
            this.visible = false
            this.$emit('ok', '')
          } else {
            this.$message.error(res.message)
          }
          this.confirmLoading = false
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 选中角色
     */
    checkRoleType(code) {
      this.checkData.teamRole = code
    },

    handleSubmit() {
      console.log(this.checkData)

      if (isStringEmpty(this.checkData.userId)) {
        this.$message.error('请选择成员')
        return
      }

      this.addTdHealthyTeamUserOut()
    },

    //修改团队
    modifyTeam(postData) {
      modifyTdHealthyTeam(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },

    /**
     * 成员列表下拉列表
     */
    getHealthyTeamUserListOut() {
      getHealthyTeamUserList().then((res) => {
        if (res.code == 0) {
          this.UserListData = res.data
        }
      })
    },

    goBack() {
      window.history.back()
    },

    handleCancel() {
      this.visible = false
    },
  },
}
</script>
    <style lang="less" scoped>
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
.m-count-pxk {
  position: absolute;
  font-size: 12px;
  bottom: 2px;
  right: 18px;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #409eff;
  }
  .span-title {
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.div-part {
  width: 100%;
  height: 310px;
  margin-top: 10px;

  .div-part-left {
    float: left;
    width: 100%;
    overflow: hidden;
    height: 100%;
  }
  .div-part-right {
    float: right;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }

  .div-content {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 60px;
    }

    .span-item-value {
      flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      flex: 1;
      font-size: 12px !important;
    }

    .ant-calendar-picker {
      flex: 1;
    }

    .avator {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      background: #dfdfdf;
      margin-right: 20px;
    }
    .avator-right {
      flex: 1;
      display: flex;
      flex-direction: column;

      .avator-right-top {
        width: 82px;
        height: 28px;
        border: 1px solid #cccccc;
        display: flex;
        flex-direction: row;
      }
    }
    .jueseview {
      width: 100%;
      height: 62px;
      border: 1px solid #cccccc;
      border-radius: 2px;
      overflow-y: auto;
      padding-bottom: 10px;

      .checkbox {
        margin-left: 10px;
        margin-top: 6px;
        margin-right: 0px;

        font-size: 12px !important;
      }
    }
  }
  .checkview {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .span-check-title {
    font-size: 12px;
    margin-right: 8px;
    font-weight: bold;
    color: #4d4d4d;
  }

  .ant-switch {
    width: 40px !important;
  }
}
</style>
    