<template>
  <!-- :width="488" -->
  <a-modal title="药品匹配" :footer="null" :width="1260" :visible="visible" :confirmLoading="confirmLoading"
    @ok="handleSubmit" @cancel="handleCancel" :maskClosable="false">
    <a-card :bordered="false">

      <div class="div-top">
        <div class="div-search">
          <a-input v-model="queryParam.keyWords" allow-clear placeholder="请输入药品编码/药品名/商品名/首拼码/批准文号进行查询"
            style="width: 380px" />
          <a-button icon="search" type="primary" @click="handleOk">搜索</a-button>
          <!-- <a-icon type="search" /> -->
        </div>

        <div style="flex: 1;"></div>
        <div>当前匹配药品：{{ medicName }}</div>
      </div>

      <div class="div-row">
        <div style="display:flex;flex-direction: row;align-items: center;flex: 1">
          <img style="width: 15px;height: 15px;" src="@/assets/icons/wenzhen/shaixuan.png" />
          <span style="margin-left: 5px;">筛选条件</span>
        </div>

        <div class="div-btn" @click="reset">
          <img class="btn-pic" src="@/assets/icons/wenzhen/qk_not.png" />
          <span class="span-btn" style="margin-left: 5px;">清空筛选</span>
        </div>

      </div>

      <div class="table-page-search-wrapper" style="margin-top: 20px;">

        <div class="search-row">
          <span class="name">药品剂型:</span>
          <a-auto-complete v-model="queryParam.dosageFormId" placeholder="请输入选择" option-label-prop="title"
            @select="handleOk" @search="handleSearchDosage">
            <template slot="dataSource">
              <a-select-option v-for="(item, index) in dosageDatas" :title="item.value" :key="index + ''"
                :value="item.id + ''">{{
                  item.value
                }}</a-select-option>
            </template>
          </a-auto-complete>
        </div>
        <div class="search-row">
          <span class="name">生产厂商:</span>
          <a-auto-complete v-model="queryParam.manufacturerCode" placeholder="请输入选择" option-label-prop="title"
            @select="handleOk" @search="handleSearchManu">
            <template slot="dataSource">
              <a-select-option v-for="(item, index) in manuDatas" :title="item.factoryName" :key="index + ''"
                :value="item.id + ''">{{
                  item.factoryName
                }}</a-select-option>
            </template>
          </a-auto-complete>
        </div>
        <div class="search-row">
          <span class="name">药理分类:</span>
          <a-tree-select v-model="queryParam.pharmacologyCategory" style="min-width: 120px" :tree-data="yaoliTree"
            placeholder="请选择" allow-clear tree-default-expand-all>
          </a-tree-select>
        </div>
        <div class="search-row">
          <span class="name">医保类型:</span>
          <a-select v-model="queryParam.healthInsuranceCategory" placeholder="请选择" allow-clear
            style="width: 120px; height: 28px">
            <a-select-option v-for="item in yibaoDatas" :key="item.id" :value="item.code">{{ item.value
            }}</a-select-option>
          </a-select>
        </div>

      </div>


      <s-table :scroll="{ x: true }" ref="table" size="default" :columns="columns" :data="loadData" :alert="true"
        :rowKey="(record) => record.id">
        <span slot="action" slot-scope="text, record">
          <template v-if="true">
            <a @click="goDetail(record)">选择</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </a-modal>
</template>
    
    
<script>
import { qryComplaintByPage, getDosageList, qryFactoryList, getHealthInsuranceCategoryList, getDictData, getCategoryList, getStandardMedicList } from '@/api/modular/system/posManage'
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
      visible: false,
      confirmLoading: false,
      queryParam: {
        dosageFormId: undefined,//药品剂型
        pharmacologyCategory: undefined,//药理分类
        healthInsuranceCategory: undefined,//医保类型
        keyWords: "",
        manufacturerCode: "",
        // pageNo: 0,
        // pageSize: 0
      },
      queryParamOrigin: {
        dosageFormId: undefined,//药品剂型
        pharmacologyCategory: undefined,//药理分类
        healthInsuranceCategory: undefined,//医保类型
        keyWords: "",
        manufacturerCode: "",
      },
      createValue: [],
      dosageDatas: [],
      manuDatas: [],
      yaoliTree: [],
      yibaoDatas: [],
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
          dataIndex: 'approvalNumber',
          scopedSlots: { customRender: 'approvalNumber' },
        },
        {
          title: '监管编码',
          dataIndex: 'broadClassifyName',
          scopedSlots: { customRender: 'broadClassifyName' },
        },
        {
          title: '商品名称',
          dataIndex: 'productName',
          scopedSlots: { customRender: 'productName' },
        },
        {
          title: '药品名称',
          dataIndex: 'productName2',
          scopedSlots: { customRender: 'productName2' },
        },
        {
          title: '药品规格',
          dataIndex: 'specification',
          scopedSlots: { customRender: 'specification' },
        },
        {
          title: '剂型',
          dataIndex: 'dosageFormDesc',
          scopedSlots: { customRender: 'dosageFormDesc' },
        },
        {
          title: '类型',
          dataIndex: 'hospitalName',
          scopedSlots: { customRender: 'hospitalName' },
        },
        {
          title: '药理分类',
          dataIndex: 'pharmacologyCategory',
          scopedSlots: { customRender: 'pharmacologyCategory' },
        },
        {
          title: '生产厂商',
          dataIndex: 'manufacturerName',
          scopedSlots: { customRender: 'manufacturerName' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getStandardMedicList(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {

            let data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.pageSize,
              rows: res.data.records,
            }

            //设置序号
            data.rows.forEach((item, index) => {
              this.$set(item, 'productName2', item.productName)
              // this.$set(item, 'xh', (data.pageNo - 1) * data.pageSize + (index + 1))
              // item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
            })

            return data
          } else {
            return {}
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
      passData: {},
      medicName: '',
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    // this.queryParam = { ...this.queryParam, ...this.$route.query }
    // this.getHealthInsuranceCategoryListOut()
    // this.passData = JSON.parse(this.$route.query.dataStr)

    // this.queryParam.keyWords = this.passData.queryText
    this.getYiBaoDatas()
    this.getCategoryListOut()
  },
  methods: {

    choose(queryText, medicName) {
      this.medicName = medicName ? medicName : '暂无'
      this.queryParam.keyWords = queryText
      // this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.handleOk()
    },

    getDosages(name) {
      let param = {
        pageNo: 1,
        pageSize: 10000,
        value: name
      }
      getDosageList(param)
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.dosageDatas = res.data.records
            console.log('dosageDatas-------', this.dosageDatas);
          }
        })
    },

    /**
 * 查询医保类型
 */
    getYiBaoDatas() {//查字典
      getDictData('$BV$HIS$MEDICINE_HEALTH_INSURANCE')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.yibaoDatas = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    getCategoryListOut() {
      let param = {
        // id: 0,
        // pid: 0,
        remark: "",
        // status: 0,
        // value: ""
      }
      getCategoryList(param)
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.yaoliTree = res.data
            console.log('yaoliTree-------111', JSON.stringify(res.data));
            // this.processTreeData(JSON.parse(JSON.stringify(this.yaoliTree)))
            this.processTreeData(this.yaoliTree)
            console.log('yaoliTree-------', JSON.stringify(this.yaoliTree));
          }
        })
    },
    processTreeData(array) {
      array.forEach(item => {
        this.$set(item, 'key', item.id)
        this.$set(item, 'title', item.value)
        this.$set(item, 'value', item.id)
        // this.$set(item, 'children', item.hospitals)
        if (item.children && item.children.length > 0) {
          this.processTreeData(item.children)
        }
      });
    },

    // handleSearch(name) {
    //   this.getTypes(name)
    // },

    handleSearchDosage(name) {
      this.getDosages(name)
    },


    /**
     * 厂商信息查询
     */
    qryFactoryListOut(name) {
      let param = {
        pageNo: 1,
        pageSize: 10000,
        factoryType: 3,
        queryText: name
      }
      qryFactoryList(param)
        .then((res) => {
          if (res.code == 0 && res.data.rows.length > 0) {
            this.manuDatas = res.data.rows
            // this.queryParams.factoryId = this.factoryListData[0].id
            // this.handleOk()
          }
        })
    },



    // handleSearch(name) {
    //   this.getTypes(name)
    // },

    handleSearchManu(name) {
      this.qryFactoryListOut(name)
    },

    reset() {
      this.queryParam = JSON.parse(JSON.stringify(this.queryParamOrigin))
      this.handleOk()
    },

    goDetail(record) {
      this.$emit('choose', record)
      this.handleCancel()

      //都倾向于异步跟新  发bus异步消息到原修改页面并关闭此页面
      // if (this.passData.jumpType == 'add_sku') {//新增
      //   // this.$router.push({
      //   //   path: './medicNew',
      //   //   query: {
      //   //     dataStr: JSON.stringify(record),
      //   //   },
      //   // })
      //   this.$bus.$emit('medicNewEvent', record)

      // } else if (this.passData.jumpType == 'edit_sku') {//修改
      //   this.$set(record, 'editId', this.passData.medicId)//修改需要传medicId进来
      //   this.$set(record, 'goType', 1)//修改需要传medicId进来
      //   // this.$bus.$emit('medicEditEvent', record)
      //   //TODO 在这里直接打开新的修改页面，或者传参到原来的修改页面，或者发bus异步消息到原修改页面并关闭此页面
      //   this.$router.push({
      //     path: './medicDetail',
      //     query: {
      //       // queryText: queryText,
      //       dataStr: JSON.stringify(record),
      //     },
      //   })
      // }

      // this.$router.go(-1)
      // this.$router.push('/')
      // window.close();

    },

    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.visible = false
    },
    handleSubmit() { },
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

  /deep/ .ant-select-selection__choice {
    margin-top: 1px !important;
  }
}
</style>
    