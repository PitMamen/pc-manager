<template>
  <div class="div-service-pac">
    <a-card :bordered="false" class="card-right-pac">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="newPackage">新增类别</a-button>
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
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="goCheck(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="goChange(record)">修改</a>
          <a-divider type="vertical" v-show="false" />
          <a-popconfirm
            v-show="false"
            title="确定删除套餐吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="goDelete(record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>

        <span slot="ifOnline" slot-scope="text, record">
          <a-popconfirm :title="record.isOnlineText" ok-text="确定" cancel-text="取消" @confirm="goOnline(record)">
            <a-switch :checked="record.isOnline" />
          </a-popconfirm>
        </span>

        <span slot="ifSuggest" slot-scope="text, record">
          <a-popconfirm :title="record.isSuggestText" ok-text="确定" cancel-text="取消" @confirm="goSuggest(record)">
            <a-switch :checked="record.isSuggest" />
          </a-popconfirm>
        </span>

        <span slot="ifCanBuy" v-if="record.belong == '1030810'" slot-scope="text, record">
        <!-- <span slot="ifCanBuy" v-if="record.belong == '2350010'" slot-scope="text, record"> -->
          <a-popconfirm :title="record.isNoBuyText" ok-text="确定" cancel-text="取消" @confirm="goCanBuy(record)">
            <a-switch :checked="record.isNoBuy" />
          </a-popconfirm>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { queryDepartment, qryGoodsClass, saveGoodsClass } from '@/api/modular/system/posManage'

export default {
  components: {
    STable,
    // addForm,
    // editForm,
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
      isNoBuyText: '',
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
      queryParams: {
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
          title: '类别名称',
          dataIndex: 'className',
        },
        {
          title: '所属科室',
          dataIndex: 'deptName',
        },
        {
          title: '是否上架',
          dataIndex: 'ifOnline',
          scopedSlots: { customRender: 'ifOnline' },
        },
        {
          title: '是否推荐',
          dataIndex: 'ifSuggest',
          scopedSlots: { customRender: 'ifSuggest' },
        },
        {
          title: '限制购买',
          // dataIndex: 'ifCanBuy',
          scopedSlots: { customRender: 'ifCanBuy' },
        },

        {
          title: '创建人',
          dataIndex: 'ownerName',
        },

        {
          title: '创建时间',
          dataIndex: 'createTimeName',
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
        return qryGoodsClass(Object.assign(parameter, this.queryParams)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            this.$set(res.data.rows[i], 'createTimeName', this.formatDate(res.data.rows[i].createTime))
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

            if (res.data.rows[i].limitFlag == 1) {
              this.$set(res.data.rows[i], 'isNoBuy', true)
              this.$set(res.data.rows[i], 'isNoBuyText', '确定可购买？')
            } else {
              this.$set(res.data.rows[i], 'isNoBuy', false)
              this.$set(res.data.rows[i], 'isNoBuyText', '确定不可购买？')
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

    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    goOnline(record) {
      if (record.status == 1) {
        record.status = 3
      } else {
        record.status = 1
      }
      let data = { classId: record.classId, status: record.status, className: record.className, owner: record.owner }
      saveGoodsClass(data).then((res) => {
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
      let data = { classId: record.classId, topFlag: record.topFlag, className: record.className, owner: record.owner }
      saveGoodsClass(data).then((res) => {
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

    goCanBuy(record) {
      if (record.limitFlag == 1) {
        record.limitFlag = 0
      } else {
        record.limitFlag = 1
      }
      let data = {
        classId: record.classId,
        limitFlag: record.limitFlag,
        className: record.className,
        owner: record.owner,
      }
      saveGoodsClass(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功')
          record.isNoBuy = !record.isNoBuy

          setTimeout(() => {
            record.isNoBuyText = record.isNoBuy ? '确定可购买？' : '确定不可购买？'
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
      this.$router.push({ name: 'package_type_add' })
    },

    goCheck(record) {
      this.$router.push({ name: 'package_type_look', params: { record: record } })
    },

    //数据传参
    goChange(record) {
      // this.$router.push({ name: 'package_type_edit', params: { record: record } })
      this.$router.push({ name: 'package_type_edit', query: { recordStr: JSON.stringify(record) } })
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
.div-service-pac {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .card-right-pac {
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
