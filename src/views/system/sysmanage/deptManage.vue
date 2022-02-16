<template>
  <div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="科室配置">
        <div class="div-service">
          <a-card :bordered="false" class="card-right">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="3" :sm="24">
                    <span
                      class="table-page-search-submitButtons"
                      :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                    >
                      <a-button type="primary" @click="$refs.addForm.add(record)">新增科室</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>

            <s-table
              ref="table"
              size="default"
              :columns="columns"
              :data="loadData"
              :alert="true"
              :rowKey="(record) => record.code"
            >
              <span slot="action" slot-scope="text, record">
                <a @click="$refs.editForm.edit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => bannerDelete(record)">
                  <a>删除</a>
                </a-popconfirm>
              </span>

              <span slot="ifSuggest" slot-scope="text, record">
                <a-popconfirm
                  :title="record.isSuggestText"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="goSuggest(record)"
                >
                  <a-switch :checked="record.isSuggest" />
                </a-popconfirm>
              </span>
            </s-table>

            <add-form ref="addForm" @ok="handleOk" />
            <edit-form ref="editForm" @ok="handleOk" />
          </a-card></div
      ></a-tab-pane>

      <a-tab-pane key="2" tab="专病配置" force-render>
        <div class="div-service">
          <a-card :bordered="false" class="card-right">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="3" :sm="24">
                    <span
                      class="table-page-search-submitButtons"
                      :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                    >
                      <a-button type="primary" @click="$refs.addForm.add(record)">新增专病</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <s-table
              ref="table"
              size="default"
              :columns="columnsDisease"
              :data="loadData"
              :alert="true"
              :rowKey="(record) => record.code"
            >
              <span slot="action" slot-scope="text, record">
                <a @click="$refs.editForm.edit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => bannerDelete(record)">
                  <a>删除</a>
                </a-popconfirm>
              </span>

              <span slot="ifSuggest" slot-scope="text, record">
                <a-popconfirm
                  :title="record.isSuggestText"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="goSuggest(record)"
                >
                  <a-switch :checked="record.isSuggest" />
                </a-popconfirm>
              </span>
            </s-table>

            <add-form ref="addForm" @ok="handleOk" />
            <edit-form ref="editForm" @ok="handleOk" />
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
                    <span
                      class="table-page-search-submitButtons"
                      :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                    >
                      <a-button type="primary" @click="$refs.addForm.add(record)">新增病区</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>

            <!-- 去掉勾选框 -->
            <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
            <!-- :row-selection="rowSelection" -->
            <s-table
              ref="table"
              size="default"
              :columns="columnsArea"
              :data="loadData"
              :alert="true"
              :rowKey="(record) => record.code"
            >
              <span slot="action" slot-scope="text, record">
                <a @click="$refs.editForm.edit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => bannerDelete(record)">
                  <a>删除</a>
                </a-popconfirm>
              </span>

              <!-- <span slot="ifOnline" slot-scope="text, record">
          <a-popconfirm :title="record.isOnlineText" ok-text="确定" cancel-text="取消" @confirm="goOnline(record)">
            <a-switch :checked="record.isOnline" />
          </a-popconfirm>
        </span> -->

              <span slot="ifSuggest" slot-scope="text, record">
                <a-popconfirm
                  :title="record.isSuggestText"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="goSuggest(record)"
                >
                  <a-switch :checked="record.isSuggest" />
                </a-popconfirm>
              </span>
            </s-table>

            <add-form ref="addForm" @ok="handleOk" />
            <edit-form ref="editForm" @ok="handleOk" />
          </a-card>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { STable } from '@/components'
import { queryDepartment, getServicePackages, savePlan } from '@/api/modular/system/posManage'
import addForm from './roleAddForm'
import editForm from './roleEditForm'

export default {
  components: {
    STable,
    addForm,
    editForm,
  },

  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: !record.userId, // Column configuration not to be checked
            name: record.userId,
          },
        }),
      }
    },

    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },

  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      // 高级搜索 展开/关闭
      advanced: false,
      isSuggestText: '确定推荐？',
      isOnlineText: '',
      keshiData: [],
      //（1：正常 2：待上架 3 ：下架）
      onlineData: [
        { code: 1, value: '正常' },
        { code: 2, value: '待上架' },
        { code: 3, value: '下架' },
      ],
      //推荐标识(0:不推荐1:推荐)
      suggestData: [
        { code: 1, value: '推荐' },
        { code: 0, value: '不推荐' },
      ],
      partChoose: '',
      // 查询参数 existsPlanFlag 1已分配 2未分配套餐 ;isRegister传 1：已注册；2：未注册；不传和其他：全部患者
      queryParams: {
        // existsPlanFlag: '',
        belong: undefined,
        status: undefined,
        topFlag: undefined,
        keyWords: undefined,
        // isRegister: '1',
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '科室名称',
          dataIndex: 'goodsName',
        },
        {
          title: '操作',
          width: '150px',
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
          dataIndex: 'goodsName',
        },
        {
          title: '所属科室',
          dataIndex: 'deptName',
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
          dataIndex: 'goodsName',
        },
        {
          title: '所属科室',
          dataIndex: 'deptName',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      loadDataOut: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getServicePackages(Object.assign(parameter, this.queryParams)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            if (res.data.rows[i].topFlag == 1) {
              this.$set(res.data.rows[i], 'isSuggest', true)
              this.$set(res.data.rows[i], 'isSuggestText', '确定取消推荐？')
            } else {
              this.$set(res.data.rows[i], 'isSuggest', false)
              this.$set(res.data.rows[i], 'isSuggestText', '确定推荐？')
            }

            if (res.data.rows[i].status == 1) {
              this.$set(res.data.rows[i], 'isOnline', true)
              this.$set(res.data.rows[i], 'isOnlineText', '确定下架？')
            } else {
              this.$set(res.data.rows[i], 'isOnline', false)
              this.$set(res.data.rows[i], 'isOnlineText', '确定上架？')
            }
          }
          this.loadDataOut = res.data
          return res.data
        })
      },
      selectedRows: [],
    }
  },

  created() {
    this.getKeShi()
  },

  methods: {
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    goOnline(record) {
      if (record.status == 1) {
        record.status = 3
      } else {
        record.status = 1
      }
      let data = { templateId: record.templateId, goodsInfo: { goodsId: record.goodsId, status: record.status } }
      savePlan(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功')
          record.isOnline = !record.isOnline

          setTimeout(() => {
            record.isOnlineText = record.isOnline ? '确定下架？' : '确定上架？'
          }, 200)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    goSuggest(record) {
      if (record.topFlag == 1) {
        record.topFlag = 0
      } else {
        record.topFlag = 1
      }
      let data = { templateId: record.templateId, goodsInfo: { goodsId: record.goodsId, topFlag: record.topFlag } }
      savePlan(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功')
          record.isSuggest = !record.isSuggest

          setTimeout(() => {
            record.isSuggestText = record.isSuggest ? '确定取消推荐？' : '确定推荐？'
          }, 200)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    getKeShi() {
      queryDepartment('444885559').then((res) => {
        if (res.code == 0) {
          this.keshiData = res.data
        } else {
          this.$message.error('获取科室列表失败：' + res.message)
        }
      })
    },

    newPackage() {
      this.$router.push({ name: 'package_new' })
    },

    goCheck(record) {
      this.$router.push({
        name: 'package_look',
        params: {
          planId: record.templateId,
        },
      })
    },

    goChange(record) {
      this.$router.push({
        name: 'package_edit',
        params: {
          planId: record.templateId,
        },
      })
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
    width: 100%;

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
