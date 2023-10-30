<template>
  <a-card :bordered="false" class="card-right-pac">
    <a-spin :spinning="confirmLoading">
      <div class="div-service-control">
        <div class="div-service-left-control">
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">转诊机构</span>
          </div>

          <div class="left-content" style="margin-left: 10px">
            <a-button
              type="primary"
              ghost
              style="margin-left: 80%; margin-top: 10px; margin-bottom: 10px"
              @click="$refs.referOrganization.addModel()"
              >新增</a-button
            >

            <a-table
              :showPagination="false"
              ref="table"
              size="default"
              :columns="columnsleft"
              :data-source="leftListData"
              :alert="true"
              :rowKey="(record) => record.code"
              :customRow="clickRow"
            >
              <span slot="action" slot-scope="text, record">
                <a @click="$refs.referOrganization.editModel(record)" style="margin-right: 5px">
                  <a-icon style="margin-right: 5px" type="edit"></a-icon>修改</a
                >
              </span>
            </a-table>
          </div>
        </div>

        <div class="mid-line"></div>

        <div class="div-service-right-control">
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">下辖医疗机构列表</span>
          </div>

          <s-table
            style="overflow-y: auto; margin-top: 10px"
            :showPagination="false"
            ref="table"
            size="default"
            :columns="columns"
            :data="loadData"
            :alert="true"
            :rowKey="(record) => record.code"
          >
            <span slot="action" slot-scope="text, record">
              <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="deleteUserTagOut(record)">
                <a><a-icon style="margin-right: 5px" type="delete"></a-icon>移除</a>
              </a-popconfirm>

              <a style="margin-right: 5px; margin-left: 5px" @click="$refs.parentBody.config(record)">
                <a-icon style="margin-right: 5px" type="setting"></a-icon>配置上级机构</a
              >
            </span>
          </s-table>
        </div>
      </div>
      <referOrganization ref="referOrganization" @ok="refreshLeftList" />
      <parentBody ref="parentBody" @ok="handleOk" />
    </a-spin>
  </a-card>
</template>
      
      <script>
import { STable } from '@/components'
import { TRUE_USER } from '@/store/mutation-types'
import referOrganization from './referOrganization'
import parentBody from './parentBody'
import Vue from 'vue'
import {
  getUserTags,
  getUserTagsTypeList,
  queryHospitalList,
  deleteUserTagsType,
  deleteUserTag,
  getreferralOrgList,
  getDownHospitalList,
  removeDownHospital,
} from '@/api/modular/system/posManage'

export default {
  components: {
    STable,
    referOrganization,
    parentBody,
  },

  data() {
    return {
      // 高级搜索 展开/关闭
      leftListData: [],
      confirmLoading: false,
      tagsTypeId: '',
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
      },

      // 左侧表头
      columnsleft: [
        {
          title: '组织名称',
          dataIndex: 'orgName',
          ellipsis: true,
        },
        {
          title: '机构数量',
          dataIndex: 'count',
          align: 'center',
        
        },

        {
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 右侧表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'hospitalName',
          ellipsis: true,
        },
        {
          title: '机构代码',
          dataIndex: 'hospitalCode',
        },
        {
          title: '机构类型',
          dataIndex: 'orgType',
        },

        {
          title: '上级机构',
          dataIndex: 'uphospital',
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
        console.log("JJJ:", this.params.id )
        return getDownHospitalList(Object.assign(parameter, this.params)).then((res) => {
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
              this.$set(item, 'uphospital', item.upHospitalName.toString())
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
    this.getreferralOrgListOut(true)
    // this.queryHospitalListOut()
  },

  methods: {
    reset() {
      this.params.id = ''
      this.tagsTypeId = ''
      this.$refs.table.refresh()
    },

    showUphospital(list) {},

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

    //分页列表  （左侧）
    getreferralOrgListOut(isfirst) {
      getreferralOrgList().then((res) => {
        if (res.code == 0) {
          if (res.data && res.data.length > 0) {
            res.data.forEach((item) => {
              item.checked = false
            })

            this.leftListData = res.data
            if (isfirst) {
                this.params.id = this.leftListData[0].id //默认第一个 id
                this.leftListData[0].checked = true
            }
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

    clickRow(record, index) {
      return {
        on: {
          click: () => {
            this.onCategoryChange(record)
          },
        },
      }
    },

    //选中团队
    onCategoryChange(item) {
      console.log('ddd:', item)
      this.leftListData.forEach((e) => {
        if (e.id == item.id) {
          e.checked = true
        } else {
          e.checked = false
        }
        this.params.id = item.id
      })
      this.$refs.table.refresh()
    },

    //移除机构
    goDelete(item) {
      //   this.confirmLoading = true
      deleteUserTagsType(item.id).then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.getreferralOrgListOut(false)
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
      removeDownHospital(record.id)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('删除成功')
            this.handleOk()
            this.refreshLeftList()
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    refreshLeftList() {
      this.getreferralOrgListOut(false) //刷新健康团队列表 (左侧)
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
  height: calc(100vh - 121px);
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

  .mid-line {
    width: 1px;
    height: 650px;
    background: #e6e6e6;
  }

  .div-title {
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 100% !important;
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

  .div-service-left-control {
    margin-right: 20px;

    flex-shrink: 0;
    width: 23%;
    overflow: hidden;

    // border: 1px solid #e6e6e6;
    .bottom-top {
      // color: #1890ff;

      height: 33px;

      margin-left: 10%;
      font-size: 14px;
    }

    .line {
      height: 1px;

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
      height: calc(100vh - 155px);
      overflow-y: auto;
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
      margin-top: 10px;
      margin-right: 10px;
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
    width: calc(100vh - 90px);
    margin-left: 10px;
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
      
  
      