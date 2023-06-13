<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysConfig:page')">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="所属机构">
              <a-tree-select
                v-model="deptId"
                tree-default-expand-all
                :tree-data="treeData"
                @change="refreshProtocol"
                placeholder="请选择所属机构"
                style="min-width: 120px"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="wrap-tab">
      <!-- <a-tabs default-active-key="2" v-model="activeKey" @change="tabChange"> -->
      <a-tabs default-active-key="2" v-model="activeKey">
        <a-tab-pane key="1">
          <span slot="tab">
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-if="activeKey == '1'"
              src="~@/assets/icons/shouquan.png"
            />
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-else
              src="~@/assets/icons/shouquan_not.png"
            />
            <!-- 患者服务授权协议 -->
            {{ contractList[0].description }}
          </span>
          <!-- <protocol-edit ref="protocolEdit1" :protocolType="'CP_10001'" /> -->
          <protocol-edit ref="protocolEdit1" :protocolType="contractList[0].value" />
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-if="activeKey == '2'"
              src="~@/assets/icons/huanzhe.png"
            />
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-else
              src="~@/assets/icons/huanzhe_not.png"
            />
            <!-- 患者端用户协议 -->
            {{ contractList[1].description }}
          </span>
          <!-- <protocol-edit ref="protocolEdit2" :protocolType="'CP_10002'" /> -->
          <protocol-edit ref="protocolEdit2" :protocolType="contractList[1].value" />
        </a-tab-pane>
        <a-tab-pane key="3">
          <span slot="tab">
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-if="activeKey == '3'"
              src="~@/assets/icons/yisheng.png"
            />
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-else
              src="~@/assets/icons/yisheng_not.png"
            />
            <!-- 医生端用户协议 -->
            {{ contractList[2].description }}
          </span>
          <!-- <protocol-edit ref="protocolEdit3" :protocolType="'CP_10003'" /> -->
          <protocol-edit ref="protocolEdit3" :protocolType="contractList[2].value" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import { accessHospitals, contractTypes } from '@/api/modular/system/posManage'
import protocolEdit from './protocolEdit'

export default {
  components: {
    protocolEdit,
  },

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      activeKey: '1',
      selectedRowKeys: [],
      selectedRows: [],
      groupCodeDictTypeDropDown: [],

      deptId: '',
      treeData: [],
      contractList: [
        { value: '', description: '' },
        { value: '', description: '' },
        { value: '', description: '' },
      ],
    }
  },

  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.contractTypesOut()
  },

  methods: {
    contractTypesOut() {
      contractTypes({})
        .then((res) => {
          if (res.code == 0) {
            this.contractList = res.data
            this.queryHospitalListOut()
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      accessHospitals(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.deptId = res.data[0].hospitalCode

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

          this.refreshProtocol()
          return []
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    refreshProtocol() {
      if (this.$refs.protocolEdit1) {
        this.$refs.protocolEdit1.refreshData(this.deptId)
      }
      if (this.$refs.protocolEdit2) {
        this.$refs.protocolEdit2.refreshData(this.deptId)
      }
      if (this.$refs.protocolEdit3) {
        this.$refs.protocolEdit3.refreshData(this.deptId)
      }
      // this.$refs.protocolEdit2.refreshData(this.deptId)
      // this.$refs.protocolEdit3.refreshData(this.deptId)
    },

    tabChange(key) {
      // switch (key) {
      //   case '1':
      //     this.$refs.protocolEdit1.refreshData(this.deptId)
      //     break
      //   case '2':
      //     this.$refs.protocolEdit2.refreshData(this.deptId)
      //     break
      //   case '3':
      //     this.$refs.protocolEdit3.refreshData(this.deptId)
      //     break
      //   default:
      //     break
      // }
    },
  },
}
</script>

<style lang="less" >
/deep/ .ant-tabs-bar {
  margin-bottom: 10px !important;
}

// .aaa .ant-select-dropdown{
//   z-index: 11111 !important;
// }
// /deep/ .ant-select-dropdown {
//   z-index: 11111 !important;
// }

.w-e-toolbar {
  z-index: 1 !important;
}

.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
</style>
