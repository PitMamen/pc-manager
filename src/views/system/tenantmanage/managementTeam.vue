<template>
  <a-card :bordered="false" class="card-right-pac">
    <a-spin :spinning="confirmLoading">
      <div class="div-service-control">
        <div class="div-service-left-control">
          <!-- <a-tree-select
            v-model="queryParam.hospitalCode"
            style="width: 170px; height: 28px;margin-left: 10px;margin-top: 10px;"
            :tree-data="treeData"
            placeholder="请选择机构"
            tree-default-expand-all
            @select="selectChange"
          >
          </a-tree-select> -->
          <a-select
            v-model="queryParam.hospitalCode"
            placeholder="请选择机构"
            show-search
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            allow-clear
            style="width: 180px; padding-left: 10px; padding-top: 10px"
            @change="onHospitalSelectChange"
            @search="onHospitalSelectSearch"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
              item.hospitalName
            }}</a-select-option>
          </a-select>

          <div class="left-content">
            <div class="typeadd" @click="$refs.addTeam.addTeam()" style="margin-right: 10px">
              新增<a-icon type="plus-circle" :style="{ color: '#409EFF' }" style="margin-right: 5px" />
            </div>
            <div class="ksview" v-for="(item, index) in leftListData" :key="index">
              <div
                :style="item.checked ? 'color:#409EFF;' : 'color:#4D4D4D;'"
                class="left-lb-title"
                @click="onCategoryChange(item)"
              >
                {{ item.teamName }}
              </div>
              <div class="content-right" style="margin-right: 10px">
                <a style="color: #409eff; margin-right: 10px" @click="$refs.modifyTeam.editModel(item)">修改</a>
                <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="goDelete(item)">
                  <a>删除</a>
                </a-popconfirm>
              </div>
            </div>

            <div v-if="!leftListData || leftListData.length == 0" class="no-data">
              <img src="~@/assets/icons/no_data.jpg" />
              <span style="color: #bfbfbf; margin-top: 10px">暂无数据</span>
            </div>
          </div>
        </div>
        <div class="div-service-right-control">
          <div class="table-page-search-wrapper" style="margin-bottom: -20px">
            <div class="table-operator" style="overflow: hidden; margin-top: 0px; margin-bottom: 0px">
              <a-button
                :disabled="!leftListData || leftListData.length == 0"
                icon="plus"
                style="float: right; margin-right: 0"
                @click="$refs.addTeamUser.addUser(params.id)"
                >新增成员</a-button
              >
            </div>
          </div>

          <s-table
            :scroll="{ x: true }"
            ref="table"
            size="default"
            :columns="columns"
            :data="loadData"
            :alert="true"
            :rowKey="(record) => record.code"
          >
            <span slot="action" slot-scope="text, record">
              <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="deleteUser(record)">
                <a><a-icon style="margin-right: 5px" type="delete"></a-icon>移除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </div>
      </div>
      <modify-Team ref="modifyTeam" @ok="refreshLeftList" />
      <add-Team ref="addTeam" @ok="refreshLeftList" />
      <add-TeamUser ref="addTeamUser" @ok="handleOk" />
    </a-spin>
  </a-card>
</template>
  
  <script>
import { STable } from '@/components'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import modifyTeam from './modifyTeam'
import addTeam from './addTeam'
import addTeamUser from './addTeamUser'
import {
  getTdHealthyTeamUserPageList,
  getTdHealthyTeamPageList,
  queryHospitalList2,
  deleteTdHealthyTeam,
  deleteTdHealthyTeamUser,
} from '@/api/modular/system/posManage'

export default {
  components: {
    STable,
    modifyTeam,
    addTeam,
    addTeamUser,
  },

  data() {
    return {
      // 高级搜索 展开/关闭
      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
      leftListData: [],
      confirmLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      queryParam: {
        description: undefined,
        hospitalCode: undefined,
        pageNo: 1,
        pageSize: 999,
        teamName: '',
      },

      params: {
        id: -1,
      },
      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          width: 80,
          ellipsis: true,
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '出生日期',
          dataIndex: 'birthday',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
        },
        {
          title: '团队角色',
          dataIndex: 'teamRoleValue',
        },
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
        },
        {
          title: '所属部门',
          dataIndex: 'departmentNames',
        },

        {
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getTdHealthyTeamUserPageList(Object.assign(parameter, this.params)).then((res) => {
          //组装控件需要的数据结构
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.pageSize,
            rows: res.data.records,
          }
          if (res.code == 0 && res.data.records.length > 0) {
            data.rows.forEach((item, index) => {
              this.$set(item, 'teamRoleValue', item.teamRole ? item.teamRole.description : '')
            })
          }

          return data
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.queryHospitalListOut(undefined)
    this.getTdHealthyTeamPageListOut()
  },

  methods: {
    onStatusSelect(id) {
      this.queryParam.isVisible = id == 1 ? true : false
    },

    onStatusChange(id) {
      if (!id) {
        delete this.queryParam.isVisible
      }
    },

    reset() {
      this.queryParam.title = ''
      this.queryParam.isVisible = true
      this.queryParam.categoryId = ''
      this.queryParam.departmentId = ''

      this.$refs.table.refresh()
    },

    /**
     * 下拉框选中
     */
    selectChange(data) {
      this.queryParam.hospitalCode = data
      this.getTdHealthyTeamPageListOut()
    },

    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   queryHospitalList(queryData)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         res.data.forEach((item, index) => {
    //           this.$set(item, 'key', item.hospitalCode)
    //           this.$set(item, 'value', item.hospitalCode)
    //           this.$set(item, 'title', item.hospitalName)
    //           this.$set(item, 'children', item.hospitals)

    //           item.hospitals.forEach((item1, index1) => {
    //             this.$set(item1, 'key', item1.hospitalCode)
    //             this.$set(item1, 'value', item1.hospitalCode)
    //             this.$set(item1, 'title', item1.hospitalName)
    //           })
    //         })

    //         this.treeData = res.data
    //       } else {
    //         this.treeData = res.data
    //       }
    //       return []
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },

    /**
     * 所属机构接口
     */
    queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      queryHospitalList2(queryData)
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                this.queryParam.hospitalCode = item.hospitalCode
              }
            })
            this.treeData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //机构搜索
    onHospitalSelectSearch(value) {
      this.treeData = []
      this.getTdHealthyTeamPageListOut(value)
      this.queryHospitalListOut(value)
    },
    //机构选择变化
    onHospitalSelectChange(value) {
      if (value === undefined) {
        this.localHospitalCode = undefined
        this.treeData = []
        this.queryHospitalListOut(undefined)
      }
      this.getTdHealthyTeamPageListOut(value)
    },

    //健康团队分页列表  （左侧）
    getTdHealthyTeamPageListOut() {
      getTdHealthyTeamPageList(this.queryParam).then((res) => {
        if (res.code == 0) {
          if (res.data.records && res.data.records.length > 0) {
            res.data.records.forEach((item) => {
              item.checked = false
            })

            this.leftListData = res.data.records
            this.params.id = this.leftListData[0].id //默认第一个 id
            this.leftListData[0].checked = true
          } else {
            this.leftListData = []
            this.params.id = -1 //默认第一个 id
          }
          this.$refs.table.refresh()
        } else {
          this.$message.error('获取失败：' + res.message)
        }
      })
    },

    //选中团队
    onCategoryChange(item) {
      console.log(item)
      this.leftListData.forEach((e) => {
        if (e.id == item.id) {
          e.checked = true
          this.queryParam.id = e.id
        } else {
          e.checked = false
        }
        this.params.id = item.id
      })
      this.$refs.table.refresh()
    },

    //删除团队
    goDelete(item) {
      this.confirmLoading = true
      deleteTdHealthyTeam(item.id).then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.getTdHealthyTeamPageListOut()
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },

    /**
     * 删除成员
     */
    deleteUser(record) {
      this.confirmLoading = true
      deleteTdHealthyTeamUser(record.id)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('删除成功')
            this.handleOk()
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    handleOk() {
      console.log('77777777777777')
      this.$refs.table.refresh()
    },

    refreshLeftList() {
      console.log('88888888888')
      this.getTdHealthyTeamPageListOut() //刷新健康团队列表 (左侧)
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  },
}
</script>

<style >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 148px !important;
}
</style>
  
  <style lang="less" scoped>
.card-right-pac {
  overflow: hidden;
  width: 100%;

  .table-operator {
    margin-top: 10px;
    margin-bottom: 10px !important;
  }
  button {
    margin-right: 8px;
  }

  .title {
    background: #fff;
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }
}

.no-data {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.div-service-control {
  width: 100%;
  overflow: hidden;
  height: calc(100vh - 124px);
  display: flex;
  flex-direction: row;

  span {
    font-size: 12px;
  }

  .div-divider {
    margin: 0% 0% 0% 1%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-service-left-control {
    margin-right: 20px;
    height: calc(100vh - 124px);
    min-height: 300px;
    flex-shrink: 0;
    width: 200px;
    overflow: hidden;

    border: 1px solid #e6e6e6;

    .left-lb-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 85px;
    }

    .toptab {
      display: flex;
      flex-direction: row;
      height: 30px;

      font-size: 12px;
      font-weight: bold;
      color: #4d4d4d;
    }
    .toptab-no {
      flex: 1;
      line-height: 30px;
      text-align: center;
    }
    .toptab-yes {
      flex: 1;
      text-align: center;
      line-height: 30px;
      background: #eff7ff;
      border-bottom: 2px solid #409eff;
    }

    .left-content {
      height: 100%;
      overflow-y: auto;
      padding: 10px;
    }
    .content-right {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .typeadd {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      margin-bottom: 10px;
      color: #409eff;
    }
    .ksview {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 30px;
      font-size: 12px;
      align-items: center;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .div-service-right-control {
    flex: 1;
    width: calc(100% - 220px);
  }
}

.ant-table-body {
  overflow-x: auto !important;
}
.table-wrapper {
  // max-height: 600px;
  // overflow-y: auto;
}
.sys-card {
  // height: 100%;
  // padding-bottom: 52px;
  // /deep/ .ant-table-pagination {
  //   position: fixed;
  //   right: 32px;
  //   bottom: 20px;
  // }
}
.table-page-search-wrapper {
  padding-bottom: 20px !important;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }

  .search-row {
    /deep/.ant-select-selection__rendered {
      margin-top: -2px !important;
    }

    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    .name {
      margin-right: 10px;
    }
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}

button {
  margin-right: 8px;
}

.title {
  background: #fff;
  font-size: 18px;
  font-weight: bold;
  color: #000;
}
</style>
  
