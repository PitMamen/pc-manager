<template>
  <a-card :bordered="false" class="card-right-pac" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="姓名">
              <a-input
                v-model="queryParams.templateTitle"
                allow-clear
                placeholder="请输入姓名"
                @blur="$refs.table.refresh(true)"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="手机号">
              <a-input
                v-model="queryParams.templateTitle"
                allow-clear
                placeholder="请输入手机号"
                @blur="$refs.table.refresh(true)"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="执行科室">
              <!-- <a-select allow-clear v-model="idArr" mode="multiple" placeholder="请选择科室"> -->
              <a-select allow-clear v-model="queryParams.templateTi" placeholder="请选择科室">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="随访方式">
              <a-select allow-clear v-model="queryParams.templateTi" placeholder="请选择随访方式">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <!-- <a-form-item label="状态:"> -->
            <!-- <a-switch :checked="isOpen" @click="goOpen" /> -->
            <a-button type="primary" @click="$refs.table.refresh(true)" icon="search">查询</a-button>
            <a-button style="margin-left: 10%" type="primary" @click="reset()" icon="reload">重置</a-button>
            <!-- </a-form-item> -->
          </a-col>
        </a-row>

        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="状态">
              <a-select allow-clear v-model="queryParams.templateTi" placeholder="请选择状态">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="7" :sm="24">
            <a-form-item label="执行日期">
              <a-range-picker :value="createValue" @change="onChange" />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <!-- <a-form-item label="状态:"> -->
            <!-- <a-switch :checked="isOpen" @click="goOpen" /> -->
            <a-button style="margin-left: 10%" type="primary" @click="goVise()" icon="reload">显示/隐藏</a-button>
            <!-- </a-form-item> -->
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
      <!-- add -->
      <span slot="content" slot-scope="text, record">
        <div :title="record.templateContent">{{ record.templateContent }}</div>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="changeModel(record)" :disabled="record.templateStatus == 2">修改</a>
        <a-divider type="vertical" />
        <a @click="Enable(record)">{{ record.enableStatus }}</a>
      </span>
    </s-table>

    <!-- width="100" -->
    <!-- title="选择随访列表" -->
    <!-- :title="drawerTitle" -->
    <a-drawer
      :width="drawerWidth"
      :mask="false"
      :get-container="false"
      :closable="false"
      :visible="visible"
      :wrap-style="{ position: 'absolute' }"
      :header-Style="{ height: '100px' }"
      @close="onClose"
      style="display: flex; flex-direction: row"
    >
      <div class="draw-wrap">
        <div class="div-btn" @click="goVise()">{{ btnText }}</div>

        <div class="draw-bottom">
          <div class="bottom-top">{{ drawerTitle }}</div>
          <div class="bottom-down">
            <a-tree
              v-model="checkedKeys"
              checkable
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              :selected-keys="selectedKeys"
              :tree-data="treeData"
              @expand="onExpand"
              @check="onCheck"
              @select="onSelect"
            />
          </div>
        </div>
      </div>

    </a-drawer>
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import { getSmsTemplateList, changeStatusSmsTemplate } from '@/api/modular/system/posManage'
// import adddxtemplate from './adddxtemplate'
export default {
  components: {
    STable,
    // adddxtemplate,
  },
  data() {
    return {
      isOpen: true,
      childrenDrawer: true,
      datas: [],
      drawerWidth: 300,
      drawerTitle: '选择随访列表',
      btnText: '隐藏',
      expandedKeys: ['3'],
      autoExpandParent: true,
      checkedKeys: ['2'],
      selectedKeys: [],
      // treeData,
      treeData: [
        {
          title: '今日待随访',
          key: '1',
        },
        {
          title: '全部待随访',
          key: '2',
        },
        {
          title: '逾期随访',
          key: '3',
          children: [
            { title: '出院随访问卷1', key: '4' },
            { title: '出院随访问卷2', key: '5' },
          ],
        },
        {
          title: '已随访',
          key: '6',
        },
      ],
      keshiData: [],
      queryParams: {
        templateTitle: '',
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
      clicked: true,
      createValue: [],
      originData: [],
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '模板名称',
          dataIndex: 'templateTitle',
          width: 200,
        },
        {
          title: '内部编码',
          dataIndex: 'templateInsideCode',
          width: 300,
        },
        {
          title: '模板ID',
          dataIndex: 'templateId',
          width: 180,
        },
        {
          title: '模板内容',
          scopedSlots: { customRender: 'content' },
          // width: 350,
        },
        {
          title: '状态',
          dataIndex: 'zt',
          width: 80,
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.confirmLoading = true
        return getSmsTemplateList(Object.assign(parameter, this.queryParams)).then((res) => {
          // console.log('请求结果:', res.message)
          this.confirmLoading = false
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.pages / parameter.pageSize,
            rows: res.data.records,
          }
          data.rows.forEach((item, index) => {
            this.$set(item, 'zt', item.templateStatus == 1 ? '正常' : '停用')
            this.$set(item, 'enableStatus', item.templateStatus == 1 ? '停用' : '启用')
          })

          return data
        })
      },
    }
  },

  watch: {
    checkedKeys(val) {
      console.log('onCheckWatch', val)
    },
  },

  methods: {
    /**
     * 重置
     */
    reset() {
      if (this.queryParams.templateTitle != '') {
        this.queryParams.templateTitle = ''
      }
    },

    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      let that = this
      console.log('onCheck', checkedKeys)
      this.checkedKeys = []
      this.checkedKeys = checkedKeys
      // if (checkedKeys.length > 0) {
      //   this.checkedKeys.push(checkedKeys[checkedKeys.length - 1])
      // }
      // console.log('onCheckEnd', this.checkedKeys)

      // setTimeout(() => {
      //   that.$forceupdate()
      // }, 200)
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info)
      console.log('onSelect selectedKeys', selectedKeys)
      this.selectedKeys = selectedKeys
    },

    goVise() {
      // this.visible = !this.visible
      this.clicked = !this.clicked
      this.drawerWidth = this.clicked ? 300 : 35
      this.drawerTitle = this.clicked ? '选择随访列表' : '  '
      this.btnText = this.clicked ? '隐藏' : '展开'
    },

    showDrawer() {
      this.visible = true
    },

    onChange() {},
    onClose() {
      this.visible = false
    },
    showChildrenDrawer() {
      this.childrenDrawer = true
    },
    hideChildrenDrawer() {
      this.childrenDrawer = false
    },
    onChildrenDrawerClose() {
      this.childrenDrawer = false
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      record.templateStatus = record.templateStatus == 1 ? 2 : 1
      record.enableStatus = record.templateStatus == 1 ? '停用' : '启用'
      var queryParamData = {
        id: record.id,
        templateStatus: record.templateStatus,
      }
      this.confirmLoading = true
      //更新接口调用
      changeStatusSmsTemplate(queryParamData)
        .then((res) => {
          if (res.success) {
            this.confirmLoading = false
            this.$message.success('操作成功!')
            this.handleOk()
          } else {
            this.$message.error('编辑失败：' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 新增 短信模板
     */
    addModel2() {
      console.log('新增 短信模板 按钮')
      this.$router.push({
        name: 'sys_dxtemplate_add',
        query: {},
      })
      // this.$router.push( {path:'./adddxtemplate'})
      // this.$router.push({ name: 'sys_dxtemplate_add', data: null })
    },

    /**
     * 修改
     */
    changeModel(record) {
      this.$router.push({
        name: 'sys_dxtemplate_add',
        query: {
          id: record.id,
        },
      })
      // this.$router.push({ path: './adddxtemplate?id=' + record.id })
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
    <style lang="less">
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}

.ant-drawer-body {
  padding: 0 !important;
}

.draw-wrap {
  height: 300px;
  display: flex;
  flex-direction: row;
  // align-items: center;

  .div-btn {
    // margin-top: 40%;
    // height: 100%;
    height: 38px;
    margin-top: 300px;
    margin-left: 3px;
    margin-right: 3px;
    padding: 5px 2px;
    // margin: 100px 3px 0 3px;
    color: white;
    background-color: #1890ff;
    writing-mode: tb-rl;
    &:hover {
      cursor: pointer;
    }
  }

  .draw-bottom {
    display: flex;
    flex-direction: column;
    width: 100%;
    // justify-content: center;
    // align-items: center;

    .bottom-top {
      // color: #1890ff;
      margin-top: 15px;
      margin-left: 30%;
      font-size: 14px;
    }
    .bottom-down {
      margin-top: 10px;
      border-top: #e6e6e6 1px solid;
      // border-left: #e6e6e6 1px solid;
    }
  }
}
</style>