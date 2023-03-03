<template>
  <a-modal
    title="添加人员"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="whole-wrap">
        <div class="add-wrap">
          <div class="add-wrap-left">
            <div class="div-choose-dept">
              <span style="display: inline-block; width: 22%">请选择配置科室：</span>
              <a-select
                style="width: 76%"
                @select="onDeptSelect"
                @change="onDeptChange"
                v-model="choseDepartmentId"
                allow-clear
                placeholder="请选择"
              >
                <a-select-option v-for="(item, index) in departmentLst" :key="index" :value="item.department_id">{{
                  item.department_name
                }}</a-select-option>
              </a-select>
            </div>
            <!-- size="large" -->
            <a-auto-complete
              style="width: 98%; font-size: 14px"
              placeholder="请输入并选择"
              option-label-prop="title"
              @select="onSelect"
              @search="handleSearch"
            >
              <template slot="dataSource">
                <a-select-option v-for="item in autoUsers" :key="item.userId + ''" :title="item.userName">
                  {{ item.userName }}
                </a-select-option>
              </template>
              <a-input>
                <a-icon slot="suffix" type="search" class="certain-category-icon" />
              </a-input>
            </a-auto-complete>

            <div class="left-num-des">
              <span><span style="color: red">*</span> 选择人员</span>

              <span style="margin-left: 50%"
                >已选人数<span style="color: #1890ff">{{ choseNum }}/{{ deptUsers.users.length }}</span> 人</span
              >
            </div>

            <div class="left-num-des">
              <span style="margin-left: 9%; margin-top: 1%">{{ deptUsers.deptName }}</span>
              <a-icon style="margin-left: 62%" class="checked" :type="iconType" @click="allClicked" />
              <!-- plus -->
              <!-- <a-icon v-if="!isAllChecked" style="margin-left: 2%" :class="{ checked: isAllChecked }" type="minus" @click="allClickedMi" /> -->
            </div>

            <div class="item-person" v-for="(item, index) in deptUsers.users" :key="index" :value="item.id">
              <span style="margin-left: 15%; margin-top: 1%; flex: 1" :class="{ checked: item.isChecked }">{{
                item.userName
              }}</span>
              <a-icon
                style="margin-top: 1%"
                :class="{ checked: item.canAdd }"
                type="plus"
                @click="addPerson(item, index)"
              />
            </div>
            <div v-if="deptUsers.users.length == 0" style="margin-top: 60px; margin-left: 16%">
              <img src="~@/assets/icons/img_nodata.png" />
            </div>
          </div>

          <div class="divider-col"></div>

          <div class="add-wrap-right">
            <a-table
              ref="table"
              :pagination="false"
              size="default"
              style="margin-left: 2%; min-height: 450px; overflow-y: auto"
              :columns="columns"
              :scroll="{ x: true }"
              :data-source="choseUsers"
              :alert="true"
              :rowKey="(record) => record.code"
            >
              <span slot="action" slot-scope="text, record">
                <a-icon
                  type="delete"
                  @click="deleteChoosed(record)"
                  theme="filled"
                  style="color: #1890ff; margin-left: 10px"
                />
              </span>
              <span slot="act_num" slot-scope="text, record">
                <a-input-number
                  style="display: inline-block; margin-left: 1%; width: 50px"
                  v-model="record.weight"
                  @change="countTotal"
                  :disabled="isSingle"
                  :min="0"
                  :max="10000"
                  :maxLength="30"
                  allow-clear
                  placeholder="请输入数量"
                />
              </span>
            </a-table>
            <div class="right-bottom">
              <div class="right-bottom-left">
                <span>平均分配权重：</span><a-switch :disabled="isSingle" :checked="isAverage" @click="goOpen" />
              </div>
              <span>权重合计：{{ totolAverage + '' }}%</span>
            </div>
          </div>
        </div>

        <div class="divider-row"></div>
        <div style="margin-top: 12px; font-size: 12px; color: #4d4d4d">
          未配置科室：{{ notStr }}
          <!-- 未配置科室：{{ departmentLst[0].department_name }} -->
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { getMyDepartments, getTreeUsersByDeptIdsAndRoles } from '@/api/modular/system/posManage'
import DepartmentList from '../mechanism/departmentList.vue'
export default {
  data() {
    return {
      index: -1,
      chooseName: '', //
      confirmLoading: false,
      isAverage: false,
      choseDepartmentId: undefined,
      departmentLst: [],
      lastDeptId: undefined,
      assignments: [],
      departmentDtos: [],
      type: '',
      tenantId: '',
      hospitalCode: '',
      // executeDepartments: '',departmentLst
      isSingle: false,
      isAllChecked: false,
      iconType: 'plus',
      notStr: '',
      choseNum: 0,
      totolAverage: 0,
      deptUsers: { deptName: '', users: [] },
      choseUsers: [],
      autoUsers: [],
      visible: false,
      columns: [
        {
          title: '序号',
          width: 60,
          // innerHeight:20,
          dataIndex: 'xh',
        },
        {
          title: '姓名',
          width: 100,
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '分配权重',
          scopedSlots: { customRender: 'act_num' },
        },
        {
          title: '操作',
          width: 100,
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },
  methods: {
    /**
     * 初始化方法
     *  "deptUsers": [
      {
        "deptName": "精神科门诊",
        "users": [
          {
            "userId": "608",
            "userName": "护士001"
          },
          {
            "userId": "667",
            "userName": "护士002"
          }
        ]
      }
    ]
     * 
     * @param {*} index 
     * @param {*} deptUsers 
     */
    add(index, type, departmentDtos, isSingle, executeDepartments) {
      this.visible = true
      this.index = index
      this.type = type
      // this.tenantId = tenantId
      // this.hospitalCode = hospitalCode
      this.choseDepartmentId = executeDepartments[0].department_id
      this.lastDeptId = executeDepartments[0].department_id
      this.isAverage = false
      this.departmentDtos = departmentDtos || []
      // this.assignments = departmentDtos[0].assignments || []

      this.isSingle = isSingle
      console.log('add departmentDtos', JSON.stringify(departmentDtos))
      console.log('add executeDepartments', JSON.stringify(executeDepartments))
      this.departmentLst = executeDepartments
      //造数据，把每个校验数据绑定到可是列表
      this.departmentLst.forEach((item) => {
        this.$set(item, 'checkData', {
          choseNum: 0,
          totolAverage: 0,
          choseUsers: [],
          assignments: [],
          isAverage: false,
          dataReady: false,
          commodityPkgManageItemRsps: [],
        })
      })

      //处理人员已选的状态
      this.departmentLst.forEach((itemOut, indexOut) => {
        let hasOne = this.departmentDtos.find((itemIn) => itemIn.executeDepartmentId == itemOut.department_id)
        if (hasOne) {
          this.departmentLst[indexOut].checkData.assignments = hasOne.assignments
          this.departmentLst[indexOut].checkData.dataReady = true
          this.departmentLst[indexOut].checkData.totolAverage = 100
        }
      })
      this.assignments = this.departmentLst[0].checkData.assignments

      this.countNotStr()

      this.getTreeUsers()
    },

    onDeptSelect(department_id) {
      if (this.choseDepartmentId != this.lastDeptId) {
        debugger
        this.saveChoseDeptData(true)
      }
    },

    saveChoseDeptData(needChange) {
      debugger
      this.countTotal()

      if (this.choseNum == 0) {
        this.$message.error('请选择人员')
        this.choseDepartmentId = this.lastDeptId
        return
      }

      if (this.totolAverage < 98) {
        this.$message.error('总权重过小')
        this.choseDepartmentId = this.lastDeptId
        return
      }

      if (this.totolAverage > 100) {
        this.$message.error('总权重过大')
        this.choseDepartmentId = this.lastDeptId
        return
      }

      for (let index = 0; index < this.choseUsers.length; index++) {
        if (this.choseUsers[index].weight == 0) {
          this.$message.error(this.choseUsers[index].userName + '权重为0')
          this.choseDepartmentId = this.lastDeptId
          return
        }
      }

      //验证完了保存数据
      for (let indexOut = 0; indexOut < this.departmentLst.length; indexOut++) {
        if (this.departmentLst[indexOut].department_id == this.lastDeptId) {
          // if (this.departmentLst[indexOut].department_id == this.choseDepartmentId) {
          //保存全局数据
          this.departmentLst[indexOut].checkData = {
            choseNum: this.choseNum,
            totolAverage: this.totolAverage,
            choseUsers: JSON.parse(JSON.stringify(this.choseUsers)),
            isAverage: this.isAverage,
            dataReady: true,
          }

          debugger
          //保存后台需要的数据
          let commodityPkgManageItemRsps = JSON.parse(JSON.stringify(this.choseUsers))
          let proccesedAssignments = []
          commodityPkgManageItemRsps.forEach((item, index) => {
            proccesedAssignments.push({
              // achievementRatio: item.achievementRatio,
              // assignId: item.assignId ? item.assignId : '',
              userId: item.userId,
              weight: item.weight,
              userName: item.userName,
            })

            if (item.assignId) {
              this.$set(proccesedAssignments[index], 'assignId', item.assignId)
            }
          })
          debugger
          this.$set(this.departmentLst[indexOut].checkData, 'proccesedAssignments', proccesedAssignments)
          console.log('addItem indexOut', indexOut)
          console.log('addItem', JSON.stringify(this.departmentLst[indexOut]))
        }
      }

      this.countNotStr()
      if (needChange) {
        console.log('onDeptSelect departmentLst', JSON.stringify(this.departmentLst))
        this.lastDeptId = this.choseDepartmentId

        //保存数据后切换department_id
        let hasOne = this.departmentLst.find((item) => item.department_id == this.choseDepartmentId)
        this.choseNum = hasOne.checkData.choseNum
        this.totolAverage = hasOne.checkData.totolAverage
        this.choseUsers = JSON.parse(JSON.stringify(hasOne.checkData.choseUsers))
        this.isAverage = hasOne.checkData.isAverage
        this.assignments = hasOne.checkData.assignments
        this.getTreeUsers()
      }
    },

    countNotStr() {
      this.notStr = ''
      let notArr = this.departmentLst.filter((item) => !item.checkData.dataReady)
      notArr.forEach((itemNot, indexNot) => {
        console.log('itemNot', itemNot)
        if (indexNot != notArr.length - 1) {
          this.notStr = this.notStr + itemNot.department_name + ',  '
        } else {
          this.notStr = this.notStr + itemNot.department_name
        }
      })
    },

    onDeptChange(department_id) {
      console.log('onDeptSelect department_id', department_id)
    },

    getTreeUsers() {
      this.deptUsers = { deptName: '', users: [] }
      getTreeUsersByDeptIdsAndRoles({
        // hospitalCode: this.hospitalCode,
        // tenantId: this.tenantId,
        // roleIds: [this.type],
        roleIds: ['doctor', 'nurse'],
        departmentIds: [this.choseDepartmentId],
      }).then((res) => {
        if (res.code == 0) {
          this.deptUsers = res.data[0]
          if (this.deptUsers.users == null) {
            this.deptUsers.users = []
          }

          if (
            this.assignments &&
            this.assignments.length > 0 &&
            this.deptUsers.users.length == this.assignments.length
          ) {
            this.iconType = 'minus'
          } else {
            this.iconType = 'plus'
          }

          this.choseUsers = []

          console.log('before', JSON.parse(JSON.stringify(this.deptUsers)))
          debugger
          console.log('assignments', JSON.parse(JSON.stringify(this.assignments)))
          this.deptUsers.users.forEach((item) => {
            this.$set(item, 'isChecked', false)
            this.$set(item, 'canAdd', true)
            if (this.assignments && this.assignments.length > 0) {
              this.assignments.forEach((itemAss) => {
                // if (itemAss.objectId == item.userId) {
                if (itemAss.userId == item.userId) {
                  //组装可以添加的用户
                  this.$set(item, 'canAdd', false)
                  this.$set(item, 'isChecked', true)

                  //组装已添加用户
                  let tempItem = JSON.parse(JSON.stringify(item))
                  this.$set(tempItem, 'weight', itemAss.weight)
                  if (itemAss.assignId) {
                    this.$set(tempItem, 'assignId', itemAss.assignId)
                  }
                  this.choseUsers.push(tempItem)
                }
              })
            }
          })
          this.sortChoseUsers()
          this.choseNum = this.choseUsers.length
          this.autoUsers = JSON.parse(JSON.stringify(this.deptUsers.users))
          this.countTotal()
          console.log('after', JSON.parse(JSON.stringify(this.deptUsers)))
        }
      })
    },

    allClicked() {
      if (this.isSingle) {
        this.$message.error('仅限添加一个')
        return
      }

      this.isAllChecked = !this.isAllChecked

      if (this.isAllChecked) {
        this.iconType = 'minus'

        this.choseUsers = []
        this.deptUsers.users.forEach((item) => {
          item.isChecked = true
          item.canAdd = false
          let tempItem = JSON.parse(JSON.stringify(item))
          this.$set(tempItem, 'weight', 0)
          this.choseUsers.push(tempItem)
        })
      } else {
        this.iconType = 'plus'
        this.choseUsers = []
        this.deptUsers.users.forEach((item) => {
          item.isChecked = false
          item.canAdd = true
        })
      }

      this.sortChoseUsers()
      this.choseNum = this.choseUsers.length
    },

    goOpen() {
      this.isAverage = !this.isAverage
      if (this.isAverage) {
        let num = (100 / this.choseUsers.length).toFixed(0)
        //平均的时候先设均值，然后改变最后一个值
        debugger
        this.choseUsers.forEach((item, index) => {
          this.$set(item, 'weight', num)
        })
        this.choseUsers[this.choseUsers.length - 1].weight = 100 - num * (this.choseUsers.length - 1)
        this.totolAverage = 100
      }
    },

    handleSearch(inputName) {
      if (inputName) {
        this.autoUsers = this.deptUsers.users.filter((item) => item.userName.indexOf(inputName) != -1)
      } else {
        this.autoUsers = JSON.parse(JSON.stringify(this.deptUsers.users))
        // this.chooseDeptItem = { departmentName: '', departmentId: '' }
      }
    },

    onSelect(userId) {
      console.log('userId', userId)
      // console.log('s2', s2) s2为系统参数
      this.deptUsers.users.forEach((item, index) => {
        if (item.userId == userId) {
          this.addPerson(item, index)
        }
      })
    },

    /**
     * 左侧添加按钮，左边列表isChecked = true , isDisabled = true
     * @param {} item
     * @param {*} index
     */
    addPerson(item, index) {
      // debugger
      if (!item.canAdd) {
        return
      }

      if (this.isSingle && this.choseUsers.length == 1) {
        this.$message.error('仅限添加一个')
        return
      }

      item.isChecked = true
      item.canAdd = false
      let tempItem = JSON.parse(JSON.stringify(item))
      if (this.isSingle) {
        this.$set(tempItem, 'weight', 100)
      } else {
        this.$set(tempItem, 'weight', 0)
      }
      this.choseUsers.push(tempItem)
      this.sortChoseUsers()
      this.choseNum = this.choseUsers.length
      if (this.isSingle) {
        this.totolAverage = 100
        this.choseUsers.weight = 100
      }

      if (this.deptUsers.users.length == this.choseUsers.length) {
        this.iconType = 'minus'
      }
    },

    deleteChoosed(record) {
      this.choseUsers.splice(this.choseUsers.indexOf(record), 1)
      this.deptUsers.users.forEach((item) => {
        if (item.userId == record.userId) {
          // debugger
          item.isChecked = false
          item.canAdd = true
        }
      })
      this.sortChoseUsers()
      this.choseNum = this.choseUsers.length

      this.countTotal()
    },

    sortChoseUsers() {
      this.choseUsers.forEach((item, index) => {
        this.$set(item, 'xh', index + 1)
      })
    },

    countTotal() {
      this.totolAverage = 0
      for (let index = 0; index < this.choseUsers.length; index++) {
        this.totolAverage = parseInt(this.totolAverage) + parseInt(this.choseUsers[index].weight)
      }
    },

    handleSubmit() {
      debugger
      this.saveChoseDeptData(false)
      debugger
      for (let index = 0; index < this.departmentLst.length; index++) {
        if (!this.departmentLst[index].checkData.dataReady) {
          this.$message.error('【' + this.departmentLst[index].department_name + '】' + '科室未配置人员')
          return
        }
      }

      console.log('fff', JSON.stringify(this.departmentLst))
      //处理没有切换过的科室数据
      for (let indexLo = 0; indexLo < this.departmentLst.length; indexLo++) {
        if (
          this.departmentLst[indexLo].checkData.dataReady &&
          !this.departmentLst[indexLo].checkData.proccesedAssignments
        ) {
          // assignments
          // {"executeDepartmentId":"2351395","assignments":[{"assignId":1797,"userId":1582,"userName":"急诊医生","weight":100}]}
          this.$set(
            this.departmentLst[indexLo].checkData,
            'proccesedAssignments',
            this.departmentLst[indexLo].checkData.assignments
          )
        }
      }

      let departmentDtos = []
      for (let indexDown = 0; indexDown < this.departmentLst.length; indexDown++) {
        debugger
        console.log('in item', JSON.stringify(this.departmentLst[indexDown].checkData.proccesedAssignments))
        departmentDtos.push({
          executeDepartmentId: this.departmentLst[indexDown].department_id,
          assignments: this.departmentLst[indexDown].checkData.proccesedAssignments,
        })
      }
      console.log('emit departmentDtos', JSON.stringify(departmentDtos))
      console.log('this.choseDepartmentId', this.choseDepartmentId)
      this.$emit('ok', this.index, departmentDtos)
      this.visible = false
    },
    handleCancel() {
      // this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
.whole-wrap {
  display: flex;
  flex-direction: column;
  // align-items: center;
  .add-wrap {
    width: 100%;
    // height: 100%;
    overflow: hidden;
    overflow-y: auto;
    padding-top: 10px;
    height: 500px;
    display: flex;
    flex-direction: row;

    /deep/ .ant-table-tbody > tr > td {
      padding: 0px !important;
    }

    .add-wrap-left {
      width: 45%;
      display: flex;

      flex-direction: column;

      .div-choose-dept {
        width: 100%;
        display: flex;
        color: #333;
        align-items: center;
        padding: 2px 0 20px 0;
        flex-direction: row;
      }

      .left-num-des {
        display: flex;
        margin-top: 2%;
        flex-direction: row;
        align-items: center;
      }

      .checked {
        color: #1890ff;
      }

      .item-person {
        width: 90%;
        // height: 100px;
        // overflow-y: auto;
        margin-top: 2%;
        display: flex;
        flex-direction: row;
      }
    }

    .divider-col {
      width: 2px;
      // height: 100%;
      margin-left: 2%;
      background-color: #eee;
    }
    .add-wrap-right {
      width: 45%;
      margin-left: 2%;
      display: flex;
      flex-direction: column;
      /deep/ .ant-table-tbody > tr > td {
        padding: 5px;
      }
      //调整head行属性
      /deep/ .ant-table-thead > tr > th {
        padding: 5px;
      }

      .right-bottom {
        width: 90%;
        margin-top: 2%;
        display: flex;
        align-items: center;
        flex-direction: row;
        .right-bottom-left {
          width: 90%;
          margin-top: 2%;
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
    }
  }

  .divider-row {
    height: 2px;
    // height: 100%;
    margin-top: 2%;
    background-color: #eee;
  }
}
</style>
