<template>
  <div>
    <!-- <a-tabs default-active-key="1" @change="callback" style="width: 60%"> -->
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="科室配置">
        <div class="div-service">
          <a-card :bordered="false" class="card-right">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="3" :sm="24">
                    <span class="table-page-search-submitButtons">
                      <a-button type="primary" @click="$refs.deptAddForm.add(record)">新增科室</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>

            <a-table
              ref="tableDept"
              :pagination="false"
              size="default"
              :columns="columnsDept"
              :data-source="loadDataDept"
              :alert="true"
              :rowKey="(record) => record.code"
            >
              <span  slot="action" slot-scope="text, record">
                <a @click="$refs.depatCode.add(record)">随访二维码</a>
                <a-divider type="vertical" />
                <a @click="$refs.areaPackageCode.add(record)">套餐二维码</a>
                <a-divider type="vertical" />
                <a @click="$refs.deptEditForm.edit(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="$refs.deptConfigure.edit(record)">科室配置</a>
                <a-divider type="vertical" v-show="false" />
                <a-popconfirm
                  v-show="false"
                  placement="topRight"
                  title="确认删除？"
                  @confirm="() => delDeptOut(record)"
                >
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </a-table>

            <dept-code ref="depatCode" @ok="handleOkCode" />
            <area-package-code ref="areaPackageCode" />
            <dept-add-form ref="deptAddForm" @ok="handleOkDept" />
            <dept-edit-form ref="deptEditForm" @ok="handleOkDept" />
            <dept-configure ref="deptConfigure" @ok="handleOkDept" />
          </a-card></div
      ></a-tab-pane>

      <a-tab-pane key="2" tab="专病配置" force-render>
        <div class="div-service">
          <a-card :bordered="false" class="card-right">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="3" :sm="24">
                    <span class="table-page-search-submitButtons">
                      <a-button type="primary" @click="$refs.diseaseAddForm.add(record)">新增专病</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>

            <a-table
              ref="tableDept"
              :pagination="false"
              size="default"
              :columns="columnsDisease"
              :data-source="loadDataDisease"
              :alert="true"
              :rowKey="(record) => record.code"
            >
              <span slot="action" slot-scope="text, record">
                <a @click="$refs.diseaseEditForm.edit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => delDiseaseOut(record)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </a-table>

            <disease-add-form ref="diseaseAddForm" @ok="handleOkDisease" />
            <disease-edit-form ref="diseaseEditForm" @ok="handleOkDisease" />
          </a-card>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="病区配置">
        <div class="div-service">
          <a-card :bordered="false" class="card-right">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="3" :sm="24">
                    <span class="table-page-search-submitButtons">
                      <a-button type="primary" @click="$refs.areaAddForm.add(record)">新增病区</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>

            <!-- 去掉勾选框 -->
            <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
            <!-- :row-selection="rowSelection" -->
            <!-- style="width: 60%" -->
            <a-table
              ref="tableArea"
              :pagination="false"
              size="default"
              :columns="columnsArea"
              :data-source="loadDataArea"
              :alert="true"
              :rowKey="(record) => record.code"
            >
              <span slot="action" slot-scope="text, record">
                <a @click="$refs.areaCode.add(record)">二维码</a>
                <a-divider type="vertical" />
                <a @click="$refs.areaEditForm.edit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => delAreaOut(record)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </a-table>

            <!-- <area-add-form ref="areaCode" @ok="handleOkArea" /> -->
            <area-code ref="areaCode" />
            <area-add-form ref="areaAddForm" @ok="handleOkArea" />
            <area-edit-form ref="areaEditForm" @ok="handleOkArea" />
          </a-card>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { STable } from '@/components'
import {
  getDepts,
  delDept,
  getDiseasesNew,
  delDisease,
  getDiseaseAreas,
  delDiseaseArea,
} from '@/api/modular/system/posManage'
import deptAddForm from './deptAddForm'
import deptCode from './deptCode'
import areaCode from './areaCode'
import areaPackageCode from './areaPackageCode'
import deptEditForm from './deptEditForm'

import diseaseAddForm from './diseaseAddForm'
import diseaseEditForm from './diseaseEditForm'

import areaAddForm from './areaAddForm'
import areaEditForm from './areaEditForm'
import deptConfigure from './deptConfigure'

export default {
  components: {
    STable,
    deptAddForm,
    deptCode,
    areaCode,
    areaPackageCode,
    deptEditForm,
    diseaseAddForm,
    diseaseEditForm,
    areaAddForm,
    areaEditForm,
    deptConfigure,
  },

  data() {
    return {
      partChoose: '',

      queryParamDept: {},
      queryParamDisease: { departmentId: 0 },
      queryParamArea: { departmentId: 0 },
      // 表头
      columnsDept: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '科室名称',
          dataIndex: 'departmentName',
        },
        {
          title: '操作',
          width: '370px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      columnsDisease: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '专病名称',
          dataIndex: 'diseaseName',
        },
        {
          title: '所属科室',
          dataIndex: 'departmentName',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      columnsArea: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '病区名称',
          dataIndex: 'inpatientAreaName',
        },
        {
          title: '所属科室',
          dataIndex: 'departmentName',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          customCell: () => {
            return {
              style: {
                'min-width': '200px',
              },
            }
          },
        },
      ],
      loadDataOut: [],

      loadDataDept: [],
      loadDataDisease: [],
      loadDataArea: [],
    }
  },

  created() {
    this.getDeptsOut()
    this.getDiseasesNewOut()
    this.getAreasOut()
  },

  methods: {
    handleOkDept() {
      this.getDeptsOut()
    },
    handleOkCode() {},

    handleOkDisease() {
      this.getDiseasesNewOut()
    },

    handleOkArea() {
      this.getAreasOut()
    },

    delDeptOut(record) {
      let param = {
        departmentId: record.departmentId,
      }
      delDept(param)
        .then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.handleOkDept()
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('删除错误：' + err.message)
        })
    },

    delDiseaseOut(record) {
      let param = {
        id: record.id,
      }
      delDisease(param)
        .then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.handleOkDisease()
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('删除错误：' + err.message)
        })
    },

    delAreaOut(record) {
      let param = {
        id: record.id,
      }
      delDiseaseArea(param)
        .then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.handleOkArea()
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('删除错误：' + err.message)
        })
    },

    getDeptsOut() {
      getDepts(this.queryParam).then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.$set(res.data[i], 'xh', i + 1)
          }
          this.loadDataDept = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    getDiseasesNewOut() {
      getDiseasesNew(this.queryParamDisease).then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.$set(res.data[i], 'xh', i + 1)
          }
          this.loadDataDisease = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    getAreasOut() {
      getDiseaseAreas(this.queryParamArea).then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.$set(res.data[i], 'xh', i + 1)
          }
          this.loadDataArea = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    callback(s1) {
      console.log('s1', s1)
    },
  },
}
</script>

<style lang="less">
.div-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .card-right {
    overflow: hidden;
    width: 100% !important;

    .table-operator {
      margin-bottom: 18px;
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
}
</style>
