<template>
  <a-card :bordered="false">

    <div class="div-top">

      <div class="div-search">
        <a-input v-model="queryParam.keyWord" @click="goSearch()" allow-clear placeholder="请输入药品编码/药品名/商品名/首拼码/批准文号进行查询"
          style="width: 380px" />
        <a-button icon="search" type="primary" @click="goAdd()">搜索</a-button>
        <!-- <a-icon type="search" /> -->
      </div>

      <div style="flex: 1;"></div>
      <div>当前匹配药品：暂无</div>
    </div>

    <div class="div-row">
      <div style="display:flex;flex-direction: row;align-items: center;flex: 1">
        <img style="width: 15px;height: 15px;" src="@/assets/icons/wenzhen/shaixuan.png" />
        <span style="margin-left: 5px;">筛选条件</span>
      </div>

      <div class="div-btn">
        <img class="btn-pic" src="@/assets/icons/wenzhen/qk_not.png" />
        <span class="span-btn" style="margin-left: 5px;">清空筛选</span>
      </div>

    </div>

    <div class="table-page-search-wrapper" style="margin-top: 20px;">

      <div class="search-row">
        <span class="name">药品剂型:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">生产厂商:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 200px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">商品分类:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">医保类型:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <!-- <div class="action-row" style="margin-top: -10px">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>

          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div> -->
    </div>


    <s-table :scroll="{ x: true }" ref="table" size="default" :columns="columns" :data="loadData" :alert="true"
      :rowKey="(record) => record.id">
      <span slot="action" slot-scope="text, record">
        <template v-if="true">
          <a @click="goDetail()">选择</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { accessHospitals as list2, qryComplaintByPage, saveComplaint } from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import { formatDateFull, formatDate } from '@/utils/util'
export default {
  components: {
    STable,
    Ellipsis,
  },
  data() {
    return {
      // 查询参数  审核状态 1未审核2已审核3未登记
      queryParam: {
        status: '',
        beginDate: '',
        endDate: '',
        hospitalCode: '',
        keyWord: '',
      },
      queryParamOrigin: {
        status: '',
        beginDate: '',
        endDate: '',
        hospitalCode: '',
        keyWord: '',
      },
      createValue: [],
      // 表头
      columns: [
        {
          title: '操作',
          // width: '150px',
          // fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
        {
          title: '批准文号',
          dataIndex: 'orderId',
          scopedSlots: { customRender: 'orderId' },
        },
        {
          title: '监管编码',
          dataIndex: 'broadClassifyName',
          scopedSlots: { customRender: 'broadClassifyName' },
        },
        {
          title: '商品名称',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' },
        },
        {
          title: '药品名称',
          dataIndex: 'userPhone',
          scopedSlots: { customRender: 'userPhone' },
        },
        {
          title: '药品规格',
          dataIndex: 'eventDesc',
          scopedSlots: { customRender: 'eventDesc' },
        },
        {
          title: '剂型',
          dataIndex: 'hospitalName',
          scopedSlots: { customRender: 'hospitalName' },
        },
        {
          title: '类型',
          dataIndex: 'hospitalName',
          scopedSlots: { customRender: 'hospitalName' },
        },
        {
          title: '药理分类',
          dataIndex: 'uploadUserName',
          scopedSlots: { customRender: 'uploadUserName' },
        },
        {
          title: '生产厂商',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return qryComplaintByPage(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {
            res.data.rows.forEach((element) => {
              this.$set(element, 'uploadTime', element.uploadTime ? formatDateFull(element.uploadTime) : '')
              // this.$set(element, 'status', 2)
              this.$set(element, 'createTime', element.createTime ? formatDateFull(element.createTime) : '')
              // 1未审核2已审核3未登记
              if (element.status == 1) {
                this.$set(element, 'statusText', '未审核')
              } else if (element.status == 2) {
                this.$set(element, 'statusText', '已审核')
              } else {
                this.$set(element, 'statusText', '未登记')
              }
            })
            // console.log(JSON.stringify(res.data.rows))
            return res.data
          } else {
            this.$message.error(res.message)
          }
        })
      },

      treeData: [],
      // 审核状态 1未审核2已审核3未登记
      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '未审核',
        },
        {
          id: 2,
          name: '已审核',
        },
        {
          id: 3,
          name: '未登记',
        },
      ],
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.getTreeData()
    this.queryParam = { ...this.queryParam, ...this.$route.query }
  },
  methods: {

    goAdd() { },
    goDetail() {
      this.$router.push({ path: './medicDetail' })
    },
    statusCheck() { },

    /**
     * 重置
     */
    reset() {
      this.createValue = []
      this.queryParam = JSON.parse(JSON.stringify(this.queryParamOrigin))
      this.queryParam.hospitalCode = this.treeData[0].value
      this.handleOk()
    },
    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>

<style lang="less" scoped>
.div-top {
  display: flex;
  align-items: center;
  flex-direction: row;

  .div-search {
    border: 1px solid #1890FF;
    background-color: #1890FF;
    // background-color: #409EFF;
    border-radius: 3px;
    margin-left: 30%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

}

.div-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  background-color: #F5F5F5;
  padding: 15px 20px 15px 10px;

  .div-btn {
    display: flex;
    flex-direction: row;
    align-items: center;

    .btn-pic {
      width: 15px;
      height: 15px;
    }

    // 动态切换背景图片  hover切换背景图片   hover切换图片
    &:hover {
      color: #409EFF;
      cursor: pointer;

      .btn-pic {
        content: url(../../../assets/icons/wenzhen/qk.png)
      }
    }
  }

  // .span-btn {
  //   &:hover {
  //     color: #409EFF;
  //   }
  // }
}

.table-page-search-wrapper {
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;

  .action-row {
    display: inline-block;
    vertical-align: middle;
  }

  .search-row {
    margin-bottom: 10px;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;

    .name {
      margin-right: 10px;
    }
  }
}
</style>



