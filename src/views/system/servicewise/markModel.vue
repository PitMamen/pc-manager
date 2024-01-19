<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
  >
    <!-- <template slot="footer">
      <a-button type="primary" @click="handleSubmit">确定</a-button>
      <a-button @click="handleCancel">关闭</a-button>
    </template> -->

    <span class="span-item-name"> 已选标签 :</span>
    <a-select
      mode="multiple"
      style="width: 87%; margin-left: 5px"
      :token-separators="[',']"
      placeholder="请在表格中勾选标签"
      dropdownClassName="select-tags-hidden"
      :collapse-tags="true"
      :maxTagCount="4"
      v-model="selectedRowKeys"
      @change="onChange"
    >
      <a-select-option v-for="item in tagsList" :key="item.tagsName" :value="item.tagsName">
        {{ item.tagsName }}
      </a-select-option>
    </a-select>

    <div style="height: 500px; width: 100%; display: flex; flex-direction: row">
      <div class="left-content">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">请选择标签类别</span>
        </div>
        <a-empty style="margin-top: 150px" :image="simpleImage" v-if="lableTypeListData.length === 0" />
        <div v-if="lableTypeListData.length > 0" class="big-kuang">
          <div class="conten-hei">
            <div
              :class="{ checked: item.isChecked }"
              v-for="(item, index) in lableTypeListData"
              @click="onItemClick(item, index)"
              :value="item.tagsTypeName"
              :key="index"
              style="cursor: pointer; margin-top: 5px; margin-left: 5px; margin-right: 5px"
            >
              <div class="item-name" :title="item.title">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                  {{ item.tagsTypeName }}
                </div>

                <div v-if="item.isChecked" style="margin-left: auto; margin-right: 20px">√</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-content">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">请选择标签名称</span>
        </div>

        <a-empty style="margin-top: 150px" :image="simpleImage" v-if="tagsList.length === 0" />

        <div v-if="tagsList.length > 0" class="big-kuang">
          <div class="conten-hei">
            <div
              :class="{ checked: item.isChecked }"
              v-for="(item, index) in tagsList"
              @click="onrightItemClick(item, index)"
              :value="item.tagsName"
              :key="index"
              style="cursor: pointer; margin-top: 5px; margin-left: 5px; margin-right: 5px"
            >
              <div class="item-name" :title="item.title">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                  {{ item.tagsName }}
                </div>

                <div v-if="item.isChecked" style="margin-left: auto; margin-right: 20px">√</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
    
    
    <script>
import { getUserTagsTypeList, getUserTags, addPatientToTags } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { Empty } from 'ant-design-vue'
export default {
  components: {},

  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      user: {},
      record: {},
      visible: false,
      title: '打标签',
      footer: null,
      confirmLoading: false,
      lableTypeListData: [], //标签分类数据
      tagsList: [], //标签列表

      AlreadytagsList: [],
      selectedTaglist: [],
      selectedRowKeys: [],
      selectedRowKeysIds: [],
      queryParamType: {
        //标签分类参数
        pageNo: 1,
        pageSize: 100,
      },

      params: {
        //标签列表参数
        id: '',
        tagsName: '',
        tagsTypeId: '',
        pageNo: 1,
        pageSize: 999,
      },
    }
  },

  created() {},
  methods: {
    //审核
    mark(record, alreadytagsList) {
      // console.log('1111111111')
      this.user = Vue.ls.get(TRUE_USER)
      this.visible = true
      this.record = record
      this.selectedRowKeys = []
      this.selectedRowKeysIds = []
      this.tagsList = []
      this.AlreadytagsList = alreadytagsList
      console.log('dddd:', this.AlreadytagsList)
      this.getUserTagsTypeListOut()
    },

    //标签类型
    getUserTagsTypeListOut() {
      getUserTagsTypeList(this.queryParamType).then((res) => {
        if (res.code == 0) {
          this.lableTypeListData = res.data.records
          if (this.lableTypeListData && this.lableTypeListData.length > 0) {
            if (this.AlreadytagsList.length > 0) {
              for (let indexin = 0; indexin < this.AlreadytagsList.length; indexin++) {
                this.selectedRowKeys.push(this.AlreadytagsList[indexin].tagsName)
                this.selectedRowKeysIds.push(this.AlreadytagsList[indexin].id)
                this.$set(this.lableTypeListData[0], 'isChecked', true)

                // if (indexin == 0 && this.AlreadytagsList[indexin].value.length > 0) {
                //   this.selectedTaglist = this.AlreadytagsList[indexin].value
                //   this.$set(this.lableTypeListData[indexin], 'isChecked', true)
                // } else {
                //   this.$set(this.lableTypeListData[indexin], 'isChecked', false)
                // }
              }

              console.log('dffff:', this.selectedRowKeys)
            } else {
              this.lableTypeListData.forEach((item, index) => {
                if (index == 0) {
                  this.$set(this.lableTypeListData[0], 'isChecked', true)
                  this.getUserTagsOut(this.lableTypeListData[0]) //第一个默认选中
                } else {
                  this.$set(this.lableTypeListData[index], 'isChecked', false)
                }
              })
            }

            this.getUserTagsOut(this.lableTypeListData[0]) //第一个默认选中
          }
        } else {
          this.$message.error('获取失败：' + res.message)
        }
      })
    },

    // 获取标签列表
    getUserTagsOut(item) {
      var postData = {
        pageNo: 1,
        pageSize: 999,
        tagsTypeId: item.id,
        // tagsTypeId: '',
      }
      getUserTags(postData).then((res) => {
        if (res.code == 0) {
          this.tagsList = res.data.records
          if (this.tagsList && this.tagsList.length > 0) {
            const r = _.intersectionWith(this.tagsList, this.AlreadytagsList, _.isEqual)
            if (r && r.length > 0) {
              for (let index = 0; index < this.tagsList.length; index++) {
                for (let index2 = 0; index2 < r.length; index2++) {
                  if (this.tagsList[index].id == r[index2].id) {
                    // console.log("3333333")
                    this.$set(this.tagsList[index], 'isChecked', true)
                    this.selectedRowKeysIds.push(this.tagsList[index].id)
                  }
                }
              }
            }
          }
        } else {
          this.$message.error('获取失败：' + res.message)
        }
      })
    },

    // 标签分类点击 (左边)
    onItemClick(item, indexClick) {
      for (let index = 0; index < this.lableTypeListData.length; index++) {
        this.$set(this.lableTypeListData[index], 'isChecked', false)
      }
      this.$set(this.lableTypeListData[indexClick], 'isChecked', true)

      this.getUserTagsOut(item)
    },

    // 标签列表 点击(右边)
    onrightItemClick(item, indexClick) {
      console.log('vvvv:', item)
      var isCheck = item.isChecked
      this.$set(this.tagsList[indexClick], 'isChecked', !isCheck)
      if (item.isChecked) {
        let getOne = this.selectedRowKeysIds.find((item1) => item1 == item.id)
        if (getOne) {
          this.$message.warning('该标签已被勾选!')
        } else {
          this.selectedRowKeys.push(item.tagsName)
          this.selectedRowKeysIds.push(item.id)
        }
      } else {
        this.selectedRowKeys = this.selectedRowKeys.filter((item1) => item1 !== item.tagsName) // 过滤元素
      }
    },

    removeDuplicate(arr) {
      const newArr = []
      arr.forEach((item) => {
        if (newArr.indexOf(item.id) === -1) {
          newArr.push(item)
        }
      })
      return newArr
    },

    // 打标签
    addPatientToTagsOut() {
      //   this.selectedRowKeys = this.removeDuplicate(this.selectedRowKeys)
      this.selectedRowKeysIds = this.removeDuplicate(this.selectedRowKeysIds)
      var tagsString = this.selectedRowKeysIds.length > 0 ? this.selectedRowKeysIds.join(',') : ''
      var postData = {
        tags: tagsString,
        userId: this.record.userId,
      }
      this.confirmLoading = true
      addPatientToTags(postData)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功!')
            this.visible = false
            this.$emit('ok', '')
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    onChange(value) {
      console.log('ssss:', value)
    },

    handleCancel() {
      this.visible = false
    },

    handleSubmit() {
      this.addPatientToTagsOut()
    },

    // cancelcheckCaPassword() {
    //   this.previsible = false
    // },

    // handlecheckCaPassword() {
    //   checkCaPassword({ password: this.inputPassword }).then((res) => {
    //     if (res.code == 0) {
    //       this.previsible = false
    //       this.checkPreOut() //密码正确后 提交审核
    //     } else {
    //       this.$message.error(res.message)
    //     }
    //   })
    // },
  },
}
</script>
  

<style lang="less" scoped>
/deep/ .ant-select-selection__rendered > ul > li {
  margin-top: 1px;
}
</style>


    
    <style lang="less">
.midline {
  height: 100%;
  width: 1px;
  margin-left: 12px;
  margin-top: 10px;
}

.left-content {
  width: 50%;
  height: 90%;
  display: flex;
  flex-direction: column;

  .div-title {
    margin-top: 10px;
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 95% !important;
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

  .checked {
    background-color: #e8f3ff; //#E8F3FF
    color: #1990ec;
    //   margin-left: 10px;
    //   margin-right: 10px;
  }
  .big-kuang {
    width: 95%;
    height: 90%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    // position: relative;
    border: 1px solid #dfe3e5;
    overflow: hidden;

    .conten-hei {
      height: 400px;
      //   width: 100%;
      //   overflow-y: auto;
      //   overflow-y: auto !important;
    }

    .item-name {
      width: 100%;
      height: 20px;
      margin-left: 10px;
      margin-top: 5px;
      margin-right: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}

.right-content {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 90%;
  .div-title {
    margin-top: 10px;
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 95% !important;
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

  .checked {
    background-color: #e8f3ff; //#E8F3FF
    color: #1990ec;
    //   margin-left: 10px;
    //   margin-right: 10px;
  }

  .big-kuang {
    width: 95%;
    height: 90%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    // position: relative;
    border: 1px solid #dfe3e5;
    overflow: hidden;

    .conten-hei {
      height: 400px;
      //   width: 100%;
      //   overflow: auto;
    }

    .item-name {
      width: 100%;
      height: 20px;
      margin-left: 10px;
      margin-top: 5px;
      margin-right: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>