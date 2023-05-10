<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-service-phone">
      <div class="div-service-left-phone">
        <div class="draw-bottom">
          <div class="bottom-top">{{ drawerTitle }}</div>
          <div class="bottom-down">
            <div
              class="item-out"
              v-for="(itemOut, indexOut) in treeData"
              :key="indexOut"
              :value="itemOut.subjectClassifyId"
            >
              <div class="out-top">
                <a-icon :type="itemOut.outIcon" @click="onHideAndSee(itemOut, indexOut)" />
                <!-- <a-icon type="caret-down" /> <-->
                <a-checkbox
                  style="margin-left: 3%"
                  @change="onChangeOut(itemOut, indexOut)"
                  :checked="itemOut.isChecked"
                />
                <span class="out-top-title" @click="onChangeOut(itemOut, indexOut)" style="margin-left: 1%">{{
                  itemOut.subjectClassifyName
                }}</span>
              </div>

              <!-- v-if="itemOut.isVisible" -->
              <div
                class="out-list"
                v-show="itemOut.isVisible"
                v-for="(itemChild, indexChild) in treeData[indexOut].children"
                :key="indexChild"
                :value="itemChild.subjectClassifyId"
              >
                <a-checkbox
                  @change="onChangeIn(itemChild, indexChild, itemOut, indexOut)"
                  :checked="itemChild.isChecked"
                />
                <!--  overflow: hidden; text-overflow: ellipsis; white-space: nowrap   限制一行 -->
                <span class="out-list-title" @click="onChangeIn(itemChild, indexChild, itemOut, indexOut)">{{
                  itemChild.subjectClassifyName
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a-card :bordered="false" class="card-right-phone">
        <div class="table-page-search-wrapper">
          <div class="search-row">
            <span class="name">病种名称:</span>
            <a-input
              v-model="queryParams.typeName"
              allow-clear
              placeholder="请输入病种名称"
              @keyup.enter="goSearch"
              @search="goSearch"
              style="width: 140px"
            />
          </div>

          <div class="action-row">
            <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" icon="search" @click="goSearch">查询</a-button>
              <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
            </span>
          </div>
        </div>

        <div class="table-operator" style="overflow: hidden;margin-top: 10px;">
            <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addDisease.addDis(tagsTypeId)"
              >新增</a-button
            >
          </div>

        <s-table
          ref="table"
          size="default"
          :scroll="{ x: true }"
          style="margin-top: 15px; min-height: 500px"
          :columns="columns"
          :data="loadData"
          :class="{ doubled: isDoubled }"
          :isShowLoading="false"
          :alert="true"
          :rowKey="(record) => record.code"
        >
          <span slot="action" slot-scope="text, record">
            <a style="margin-right: 5px" @click="$refs.addDisease.editDis(record)"> <a-icon style="margin-right: 5px" type="edit"></a-icon>编辑</a>
            <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="deleteDiseaseOut(record)">
              <a><a-icon style="margin-right: 5px" type="delete"></a-icon>删除</a>
            </a-popconfirm>
          </span>
        </s-table>

        <add-Disease ref="addDisease" @ok="handleOk" />
      </a-card>
    </div>
  </a-spin>
</template>
      
      
      <script>
import { STable } from '@/components'
import addDisease from './addDisease'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import {
  gettreeMedicalSubjects,
  getDiseaseTypePageList,
  deleteDiseaseType,
} from '@/api/modular/system/posManage'
export default {
  components: {
    STable,
      addDisease,
  },
  data() {
    return {
      isDoubled: false,
      drawerWidth: 300,
      drawerTitle: '学科',
      treeData: [],
      adArryTemp:[],
      queryParams: {
        medicalId: '',
        typeName: '',
      },
      queryParamsOrigin: {
        medicalId: '',
        typeName: '',
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: true,
      canHide: false,
      user: {},
      msgData: [],
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头  默认是
      columns: [
        {
          title: '病种名称',
          dataIndex: 'typeName',
          width: '50px',
          ellipsis: true,
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
          width: 100,
          ellipsis: true,
        },
        {
          title: '更新时间',
          dataIndex: 'updatedTime',
          width: 100,
          ellipsis: true,
        },

        {
          title: '操作',
          width: '130px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(this.queryParams))
        this.confirmLoading = true
        return getDiseaseTypePageList(Object.assign(parameter, param))
          .then((res) => {
            var data = {
              pageNo: parameter.current,
              pageSize: parameter.size,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.size,
              rows: res.data.records,
            }
            /**
             *用于屏蔽第一次刷新的loading，第一次系统自动加在数据的时候loading不隐藏
             */
            if (this.canHide) {
              this.confirmLoading = false
            }
            return data
          })
          .finally((res) => {
            this.confirmLoading = false
          })
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    this.initData(true)
  },

  methods: {


    //删除病种
    deleteDiseaseOut(record) {
      this.confirmLoading = true
      deleteDiseaseType(record.id).then((res)=>{
        if(res.code==0){
          this.$message.success('操作成功！')
          this.handleOk()
        }else {
            this.$message.error('操作失败：' + res.message)
          }
      }).finally((res) => {
          this.confirmLoading = false
        })
    },


    /**
     * 第一次和重置的时候 isRest为true
     * @param {*} isRest
     */
    initData(isRest) {
      gettreeMedicalSubjects().then((res) => {
        if (res.code == 0) {
          this.treeData = res.data
          this.processDataNew(isRest)
        }
      })
    },
    //点击查询时 重置数量
    goSearch() {
      this.confirmLoading = true
      this.handleOk()
      // this.initData(false)
    },

    onHideAndSee(itemOut, indexOut) {
      let tmpVisible = itemOut.isVisible
      for (let index = 0; index < this.treeData.length; index++) {
        this.treeData[index].isVisible = false
        this.treeData[index].outIcon = 'caret-right'
      }
      itemOut.isVisible = !tmpVisible
      itemOut.outIcon = itemOut.isVisible ? 'caret-down' : 'caret-right'
    },

    //点击第一层选中按钮，
    onChangeOut(itemOut, indexOut) {
      itemOut.isChecked = !itemOut.isChecked
      if (itemOut.isChecked) {
        var idArray = []
        idArray.push(itemOut.subjectClassifyId)  //选中一级学科 需要把一级学科的id 带上
        //当父节点切换之后需要切换tree的选中状态；需要改变请求条件
        this.treeData.forEach((itemOutTemp, indexOutTemp) => {
          if (indexOutTemp != indexOut) {
            this.$set(itemOutTemp, 'isChecked', false)
            this.treeData[indexOutTemp].children.forEach((itemChild, indexChild) => {
              this.$set(itemChild, 'isChecked', false)
            })
          } else {
            //处理查询入参
            // this.queryParams.medicalId = itemOutTemp.subjectClassifyId
            this.$set(itemOutTemp, 'isChecked', true)
         
            this.treeData[indexOutTemp].children.forEach((itemChild, indexChild) => {
              this.$set(itemChild, 'isChecked', true)
              idArray.push(itemChild.subjectClassifyId)
             
            })
            this.adArryTemp = idArray

            let ids = idArray.join(',')
              this.queryParams.medicalId = ids
          }
        })

        // 需要改变表格列表数据；

        for (let index = 0; index < this.treeData.length; index++) {
          this.treeData[index].isVisible = false
          this.treeData[index].outIcon = 'caret-right'
        }
        itemOut.isVisible = !itemOut.isVisible
        itemOut.outIcon = itemOut.isVisible ? 'caret-down' : 'caret-right'
      } else {
        //TODO 取消勾选不做，外层没有取消的功能，点击了就是全选
        this.treeData.forEach((itemOutTemp, indexOutTemp) => {
          if (indexOutTemp != indexOut) {
            this.$set(itemOutTemp, 'isChecked', false)
            this.treeData[indexOutTemp].children.forEach((itemChild, indexChild) => {
              this.$set(itemChild, 'isChecked', false)
            })
          } else {
            //处理查询入参
            this.$set(itemOutTemp, 'isChecked', false)
            this.treeData[indexOutTemp].children.forEach((itemChild, indexChild) => {
              this.$set(itemChild, 'isChecked', false)
             
            })
          }

        })
        this.queryParams.medicalId =''
        this.adArryTemp = []

      }

      this.goSearch()
    },

    //点击第二层选中按钮，先判断是否改变
    onChangeIn(itemChild, indexChild, itemOut, indexOut) {
      itemChild.isChecked = !itemChild.isChecked
      if (itemChild.isChecked) {
       
        //当父节点切换之后需要切换选中状态；需要改变列表数据；需求改变请求条件
        // if (this.queryParams.medicalId != itemOut.subjectClassifyId) {
          this.treeData.forEach((itemOutTemp, indexOutTemp) => {
            if (indexOutTemp != indexOut) {
              this.$set(itemOutTemp, 'isChecked', false)
              this.treeData[indexOutTemp].children.forEach((itemChildTemp, indexChildTemp) => {
                this.$set(itemChildTemp, 'isChecked', false)
              })
            } else {
            }
          })

          // this.queryParams.medicalId = ''
          // var idArray = []
          this.adArryTemp.push(itemChild.subjectClassifyId)
          this.queryParams.medicalId = this.adArryTemp.join(',')
          // console.log("KKK111:",this.queryParams.medicalId)
        // } else {
        //   this.$set(itemChild, 'isChecked', true)
        // }
      } else {
        //取消勾选  则是去掉勾选那一条子层数据
        let num = 0
        // var tempIds = this.queryParams.medicalId.split(',')
        // console.log("bbbbbb:",tempIds)
        this.adArryTemp.forEach((id, indexChildTemp) => {
          if (itemChild.subjectClassifyId == id) {
            num = indexChildTemp
            this.adArryTemp.splice(num, 1)
            //  console.log("MMMM:",tempIdvs)
          }
        })
        this.queryParams.medicalId = this.adArryTemp.join(',')
        // console.log("KKK222:",this.queryParams.medicalId)
       
      }


      this.goSearch()
    },

    /**
     * 处理树和勾选
     * @param {} isReset
     */
    processDataNew(isReset) {
      //先整体初始化
      for (let index = 0; index < this.treeData.length; index++) {
        this.treeData[index].subjectClassifyName = this.treeData[index].subjectClassifyName

        this.$set(this.treeData[index], 'outIcon', 'caret-right')
        this.$set(this.treeData[index], 'isChecked', false)
        this.$set(this.treeData[index], 'isVisible', false)

        if (this.treeData[index].children && this.treeData[index].children.length > 0) {
          this.treeData[index].children.forEach((itemChild, indexChild) => {
            this.$set(itemChild, 'isChecked', false)
            this.$set(itemChild, 'subjectClassifyName', itemChild.subjectClassifyName)
          })
        }
      }

      // debugger
      //初始化逻辑
      if (isReset) {
        // debugger
        //再把首个全部展开和勾选
        this.$set(this.treeData[0], 'isChecked', true)
        this.$set(this.treeData[0], 'isVisible', true)
        this.$set(this.treeData[0], 'outIcon', 'caret-down')
        if (this.treeData[0].children && this.treeData[0].children.length > 0) {
          this.treeData[0].children.forEach((item, index) => {
            this.$set(item, 'isChecked', true)
          })
        }

        //初始化请求数据
        this.queryParams.medicalId = ''
        var idArray = []
        idArray.push(this.treeData[0].subjectClassifyId)  //第一次进来 外出的id也要传入
        this.treeData[0].children.forEach((item, index) => {
          idArray.push(item.subjectClassifyId)  // 将里面的一次所有id传入
          this.queryParams.medicalId = idArray.join(',')
        })
        this.adArryTemp = idArray
        console.log("sss:",this.queryParams.medicalId)
      } else {
        // debugger
        //非初始化逻辑，记住了以前选择的父层和子层；子层可能记住了，但是新的树里面没有了，要判断删除请求数据
        this.$set(this.treeData[this.queryParams.queryStatus - 1], 'isChecked', true)
        this.$set(this.treeData[this.queryParams.queryStatus - 1], 'isVisible', true)
        this.$set(this.treeData[this.queryParams.queryStatus - 1], 'outIcon', 'caret-down')
        if (
          this.treeData[this.queryParams.queryStatus - 1].children &&
          this.treeData[this.queryParams.queryStatus - 1].children.length > 0
        ) {
          //勾选记住的子层
          for (let index = 0; index < this.treeData[this.queryParams.queryStatus - 1].children.length; index++) {
            for (let indexIn = 0; indexIn < this.queryParams.medicalId.length; indexIn++) {
              if (
                this.queryParams.medicalId[indexIn] ==
                this.treeData[this.queryParams.queryStatus - 1].children[index].subjectClassifyId
              ) {
                this.$set(this.treeData[this.queryParams.queryStatus - 1].children[index], 'isChecked', true)
              }
            }
          }

          // 子层可能记住了，但是新的树里面没有了，要判断删除请求数据
          let newIds = []
          for (let index = 0; index < this.queryParams.medicalId.length; index++) {
            for (
              let indexIn = 0;
              indexIn < this.treeData[this.queryParams.queryStatus - 1].children.length;
              indexIn++
            ) {
              if (
                this.treeData[this.queryParams.queryStatus - 1].children[indexIn].subjectClassifyId ==
                this.queryParams.medicalId[index]
              ) {
                newIds.push(this.queryParams.medicalId[index])
              }
            }
          }
          this.queryParams.medicalId = JSON.parse(JSON.stringify(newIds))
        } else {
          //父层没有子层了
          this.queryParams.medicalId = ''
        }
      }

      this.canHide = true
      this.$refs.table.refresh(true)
    },
    /**
     * 重置
     */
    reset() {
      // this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.queryParams.typeName = ''

      // this.initData(true)
    },


    /**
     *开始随访
     * @param {} record
     */
    goSolve(record) {
      this.$refs.followModel.doDeal(record)
    },

    handleOk() {
      this.$refs.table.refresh(true)
    },
  },
}
</script>
  <style lang="less" scoped>
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}

// /deep/ .MuiSvgIcon-root.MuiSvgIcon-colorAction {
//   display: none !important;
// }.

/deep/ .MuiSvgIcon-root.MuiSvgIcon-colorAction {
  visibility: hidden !important;
}

.ant-drawer-body {
  padding: 0 !important;
}

.div-action {
  &:hover {
    cursor: pointer;
  }
}

.span-red {
  padding: 1% 2%;
  font-size: 12px;
  color: #f26161;
  // background-color: #f26161;
}
.span-blue {
  padding: 1% 2%;
  font-size: 12px;
  color: #409eff;
  // background-color: #f26161;
}
.span-gray {
  padding: 1% 2%;
  font-size: 12px;
  color: #85888e;
  // background-color: #85888e;
}

.div-service-phone {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-divider {
    margin: 0% 0% 0% 1%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-service-left-phone {
    background-color: white;
    padding: 20px 0 20px 20px;
    // margin:  20px 20px;
    float: left;
    min-height: 100%;
    width: 19%;
    overflow: hidden;

    .draw-bottom {
      display: flex;
      border: 1px solid #e6e6e6;
      flex-direction: column;
      width: 100%;
      // height: 100%;
      min-height: 100%;
      // justify-content: center;
      // align-items: center;

      .bottom-top {
        // color: #1890ff;
        margin-top: 15px;
        height: 10%;
        margin-left: 10%;
        font-size: 14px;
      }
      .bottom-down {
        margin-top: 10px;
        max-height: 90%;
        min-height: 90%;
        margin-bottom: 10px;
        border-top: #e6e6e6 1px solid;
        // border-left: #e6e6e6 1px solid;

        .item-out {
          display: flex;
          flex-direction: column;
          // max-height: 550px;
          overflow-y: auto;
          width: 100%;

          .out-top {
            margin-top: 3%;
            font-size: 12px;
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;

            .out-top-title {
              &:hover {
                cursor: pointer;
              }
            }
          }

          .out-list {
            font-size: 12px;
            margin-top: 3%;
            margin-left: 15%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .out-list-title {
              margin-left: 3%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }

  .card-right-phone {
    overflow: hidden;
    float: right;
    width: 81%;

    /deep/ .ant-card-body {
      padding: 0px 20px !important;
    }

    .table-page-search-wrapper {
      padding-bottom: 20px;
      margin-top: 10px;
      border-bottom: 1px solid #e8e8e8;
      .action-row {
        margin-top: 10px;
        display: inline-block;
        vertical-align: middle;
      }
      .search-row {
        margin-top: 10px;
        display: inline-block;
        vertical-align: middle;
        padding-right: 20px;
        .name {
          margin-right: 10px;
        }
      }

      .ant-input-affix-wrapper {
        width: auto;
      }

      .ant-select {
        width: 90px;
      }
    }
  }
}
</style>
  
  <style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 20px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;

    // 这里不同显示器的电脑反应不一样，采取双行三个table头都是-133px,将原来的doubled样式注释
    .table-wrapper {
      // height: calc(100% - 93px);
      height: calc(100% - 161px);

      // &.doubled {
      //   height: calc(100% - 133px);
      // }
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 80px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
.ant-spin-nested-loading {
  height: calc(100% - 40px);
  /deep/ .ant-spin-container {
    height: 100%;
  }
  .ant-spin-container {
    .div-service-phone {
      height: 100%;
      .ant-card {
        height: 100%;
      }
    }
  }
}
</style>
  