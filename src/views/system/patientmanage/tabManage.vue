<template>
  <a-card :bordered="false" class="card-right-pac">
    <a-spin :spinning="confirmLoading">
      <div class="div-service-control">
        <div class="div-service-left-control">
          <div style="margin-top: 10px">标签类别</div>
          <div class="line"></div>

          <div class="left-content" style="margin-right: 10px">
            <div class="typeadd" @click="$refs.addTab.addTab()">
              新增<a-icon type="plus-circle" :style="{ color: '#409EFF' }" style="margin-right: 5px" />
            </div>
            <div class="ksview" v-for="(item, index) in leftListData" :key="index">
              <div
                :style="item.checked ? 'color:#409EFF;' : 'color:#4D4D4D;'"
                class="left-lb-title"
                @click="onCategoryChange(item)"
              >
                {{ item.tagsTypeName }}
              </div>
              <div class="content-right">
                <a style="color: #409eff; margin-right: 10px" @click="$refs.addTab.editTab(item)">修改</a>
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
          <div class="table-page-search-wrapper">
            <div class="search-row">
              <span class="name">标签名称:</span>
              <a-input
                v-model="params.tagsName"
                allow-clear
                placeholder="请输入标签名称查询"
                style="width: 120px; height: 28px"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </div>

            <div class="action-row">
              <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
                <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset">重置</a-button>
              </span>
            </div>

            <!-- <div class="table-operator" style="overflow: hidden; margin-top: 0px; margin-bottom: 0px">
                <a-button :disabled="!leftListData || leftListData.length == 0" icon="plus" style="float: right; margin-right: 0" 
                  >新增成员</a-button
                >
              </div> -->
          </div>

          <div class="table-operator" style="overflow: hidden">
            <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addLable.addLable()"
              >新增</a-button
            >
          </div>

          <s-table
          style="overflow-y: auto;"
          :showPagination="false"
          ref="table"
          size="default"
            :columns="columns"
            :data="loadData"
            :alert="true"
            :rowKey="(record) => record.code"
          >
            <span slot="action" slot-scope="text, record">
              <a style="margin-right: 5px" @click="$refs.addLable.editLable(record)">
                <a-icon style="margin-right: 5px" type="edit"></a-icon>编辑</a
              >
              <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="deleteUserTagOut(record)">
                <a><a-icon style="margin-right: 5px" type="delete"></a-icon>移除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </div>
      </div>
      <!-- <modify-Team ref="modifyTeam" @ok="refreshLeftList" /> -->
      <add-Tab ref="addTab" @ok="refreshLeftList" />
      <add-Lable ref="addLable" @ok="handleOk" />
    </a-spin>
  </a-card>
</template>
    
    <script>
import { STable } from '@/components'
import { TRUE_USER } from '@/store/mutation-types'
import addTab from './addTab'
//   import modifyTeam from './modifyTeam'
import addLable from './addLable'
import Vue from 'vue'
import {
  getUserTags,
  getUserTagsTypeList,
  queryHospitalList,
  deleteUserTagsType,
  deleteUserTag,
} from '@/api/modular/system/posManage'

export default {
  components: {
    STable,
    //   modifyTeam,
    addTab,
    addLable,
    //   addTeamUser,
  },

  data() {
    return {
      // 高级搜索 展开/关闭
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

      queryParamType: {
        pageNo: 1,
        pageSize: 100,
      },

      params: {
        id: '',
        tagsName: '',
        tagsTypeId: '',
        pageNo: 1,
        pageSize: 999,
      },
      // 表头
      columns: [
        {
          title: '标签名称',
          dataIndex: 'tagsName',
          ellipsis: true,
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
        },
        {
          title: '更新时间',
          dataIndex: 'updatedTime',
        },
        // {
        //   title: '患者数',
        //   dataIndex: 'phone',
        // },

        {
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getUserTags(Object.assign(parameter, this.params)).then((res) => {
          //组装控件需要的数据结构
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.pageSize,
            rows: res.data.records,
          }
          // if (res.code == 0 && res.data.records.length > 0) {
          //   data.rows.forEach((item, index) => {
          //     //   this.$set(item, 'teamRoleValue', item.teamRole ? item.teamRole.description : '')
          //   })
          // }

          return data
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    this.getUserTagsTypeListOut()
    this.queryHospitalListOut()
  },

  methods: {
    reset() {
      this.params.tagsName = ''

      this.$refs.table.refresh()
    },

    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      queryHospitalList(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'value', item.hospitalCode)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //健康团队分页列表  （左侧）
    getUserTagsTypeListOut() {
      getUserTagsTypeList(this.queryParamType).then((res) => {
        if (res.code == 0) {
          if (res.data.records && res.data.records.length > 0) {
            res.data.records.forEach((item) => {
              item.checked = false
            })
            this.leftListData = res.data.records
            this.params.tagsTypeId = this.leftListData[0].id //默认第一个 id
            this.leftListData[0].checked = true
          } else {
            this.leftListData = []
            this.params.tagsTypeId = -1 //默认第一个 id
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
        } else {
          e.checked = false
        }
        this.params.tagsTypeId = item.id
      })
      this.$refs.table.refresh()
    },

    //删除团队
    goDelete(item) {
      //   this.confirmLoading = true
      deleteUserTagsType(item.id).then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.getUserTagsTypeListOut()
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },

    /**
     * 删除标签
     */
    deleteUserTagOut(record) {
      this.confirmLoading = true
      deleteUserTag(record.id)
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
      this.getUserTagsTypeListOut() //刷新健康团队列表 (左侧)
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
  height: 85vh;
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
    height: 100%;
    min-height: 300px;
    flex-shrink: 0;
    width: 200px;
    overflow: hidden;

    border-right: 1px solid #e6e6e6;

    .line {
      height: 1px;
      margin-top: 20px;
      width: 100%;
      background: #e8e8e8;
    }

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
    
    <style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 50px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 55px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 46px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
    