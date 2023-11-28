<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">关键字查询:</span>
        <a-input
          v-model="queryParam.keyWord"
          allow-clear
          placeholder="可输入患者姓名或电话号码查询"
          style="width: 210px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)"
            >查询</a-button
          >
          <!-- <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()"
            >重置</a-button
          > -->
        </span>
      </div>
    </div>
    <div class="table-operator" style="overflow: hidden"></div>

    <!-- <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="addTransUp()"
        >新增</a-button
      >
    </div> -->

    <s-table
      ref="table"
      class="x-table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :scroll="{ x: true }"
      :rowKey="(record) => record.id"
    >
      <span slot="status" slot-scope="text, record">
        <span v-if="record.status === 1">待审核</span>
        <span v-if="record.status === 2" style="color: #69c07d">通过</span>
        <a
          @click="showDes"
          v-if="record.status === 3"
          style="color: #f40b0b; text-decoration: underline"
          >不通过</a
        >
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="goEdit(record)"
            ><a-icon style="margin-right: 5px" type="edit" />修改</a
          >
        </template>
        <!-- <template v-if="record.status === 2">
          <span style="margin-right: 5px; color: #999"
            ><a-icon type="edit" :style="{ fontSize: '14px', color: '#999' }" />修改</span
          >
        </template> -->
        <template>
          <a @click="goFile(record)" style="margin-left: 8px"
            ><a-icon style="margin-right: 5px" type="printer" />档案</a
          >
        </template>
      </span>
    </s-table>
    <!-- <info-form ref="infoForm" @ok="handleOk" /> -->

    <!-- <a-modal v-model="visibleDes" title="提示" :footer="null" @ok="handleOkDes"> -->
    <!-- <a-modal v-model="visibleDes" cancelText="''" title="提示" @ok="handleOkDes">
      <div
        style="height: 120px; display: flex; flex-direction: column; padding-top: 30px"
      >
        <div style="margin-top;: 30px">不通过原因：小问题，请自行处理。</div>
      </div>

      <template slot="footer">
        <a-button @click="handleOkDes">确定</a-button>
      </template>
    </a-modal> -->

    <info-form ref="infoForm" @ok="handleModify" />
    <file-modal ref="fileModal" />
  </a-card>
</template>

<script>
import {
  accessHospitals,
  getCommodityClassify,
  getDepartmentListForSelect,
  qryPatientBaseList,
} from "@/api/modular/system/posManage";
// import { list } from "@/api/modular/system/rate";
import { STable, Ellipsis } from "@/components";
import moment from "moment";
import Vue from "vue";
import { TRUE_USER } from "@/store/mutation-types";
import infoForm from "./infoForm";
import fileModal from "./fileModal";
export default {
  components: {
    STable,
    Ellipsis,
    infoForm,
    fileModal,
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      fetching: false,
      visibleDes: false,
      createValue: [],
      // 查询参数
      queryParam: { keyWord: undefined },
      statusSelects: [
        {
          id: "",
          name: "全部",
        },
        {
          id: 1,
          name: "待审核",
        },
        {
          id: 2,
          name: "通过",
        },
        {
          id: 3,
          name: "不通过",
        },
      ],
      // 表头
      columns: [
        {
          title: "患者姓名",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "性别",
          dataIndex: "sex",
          scopedSlots: { customRender: "sex" },
        },
        {
          title: "年龄",
          dataIndex: "age",
          scopedSlots: { customRender: "age" },
        },
        {
          title: "身份证号",
          dataIndex: "identificationNo",
          scopedSlots: { customRender: "identificationNo" },
        },
        {
          title: "联系电话",
          dataIndex: "phone",
          scopedSlots: { customRender: "phone" },
        },
        {
          title: "家属姓名",
          dataIndex: "contactor",
          scopedSlots: { customRender: "contactor" },
        },
        {
          title: "家属电话",
          dataIndex: "contactTel",
          scopedSlots: { customRender: "contactTel" },
        },
        {
          title: "医保类型",
          dataIndex: "insuranceType",
          scopedSlots: { customRender: "insuranceType" },
        },
        {
          title: "家庭地址",
          dataIndex: "addressDetail",
          scopedSlots: { customRender: "addressDetail" },
        },
        {
          title: "当前机构",
          dataIndex: "hospitalName",
          scopedSlots: { customRender: "hospitalName" },
        },
        {
          title: "转诊状态",
          dataIndex: "statusName",
          scopedSlots: { customRender: "statusName" },
        },
        {
          title: "操作",
          width: "80px",
          fixed: "right",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return qryPatientBaseList(Object.assign(parameter, this.queryParam)).then(
          (res) => {
            if (res.code === 0) {
              return res.data;
            } else {
              this.$message.error(res.message);
            }
          }
        );
      },
      classData: [],
      treeData: [],
      originData: [],
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    // this.queryParam = { ...this.queryParam, ...this.$route.query };
    this.getOrgList();
    this.getClassData();
    this.user = Vue.ls.get(TRUE_USER);
    console.log(this.user);
    this.getDepartmentSelectList(undefined);
    this.createValue = [
      moment(this.formatDate(new Date()), this.dateFormat),
      moment(this.formatDate(new Date()), this.dateFormat),
    ];
  },
  methods: {
    handleModify() {
      this.$refs.table.refresh();
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true;
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, undefined).then((res) => {
        this.fetching = false;
        if (res.code == 0) {
          this.originData = res.data.records;
        }
      });
    },

    //科室搜索
    onDepartmentSelectSearch(value) {
      this.originData = [];
      this.getDepartmentSelectList(value);
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value === undefined) {
        this.originData = [];
        this.getDepartmentSelectList(undefined);
      }
      this.$refs.table.refresh(true);
    },

    handleOkDes() {
      this.visibleDes = false;
    },

    showDes() {
      this.visibleDes = true;
    },
    // onChange(momentArr, dateArr) {
    //   console.log("MMM:", dateArr);
    //   this.createValue = momentArr;
    //   this.queryParam.startTime = dateArr[0];
    //   this.queryParam.endTime = dateArr[1];
    // },

    formatDate(date) {
      date = new Date(date);
      let myyear = date.getFullYear();
      let mymonth = date.getMonth() + 1;
      let myweekday = date.getDate();
      mymonth < 10 ? (mymonth = "0" + mymonth) : mymonth;
      myweekday < 10 ? (myweekday = "0" + myweekday) : myweekday;
      return `${myyear}-${mymonth}-${myweekday}`;
    },

    goEdit(record) {
      //TODO
      // this.$message.success("去编辑");
      this.$refs.infoForm.goModify(record);
    },
    goFile(record) {
      // this.$message.success("去打印");
      this.$refs.fileModal.showFile(record);
    },

    addTransUp() {
      this.$router.push({
        name: "transupDetail",
        // path: '/servicewise/projectEdit',
        // query: {
        //   planId: record.id,
        // },
      });
    },

    getOrgList() {
      let queryData = {
        tenantId: "",
        status: 1,
        hospitalName: "",
      };
      this.confirmLoading = true;
      accessHospitals(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, "key", item.hospitalCode);
              this.$set(item, "value", item.hospitalCode);
              this.$set(item, "title", item.hospitalName);
              this.$set(item, "children", item.hospitals);

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, "key", item1.hospitalCode);
                this.$set(item1, "value", item1.hospitalCode);
                this.$set(item1, "title", item1.hospitalName);
              });
            });

            this.treeData = res.data;
          } else {
            this.treeData = res.data;
          }
          return [];
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },
    getClassData() {
      getCommodityClassify({}).then((res) => {
        if (res.code == 0) {
          this.classData = res.data;
        }
      });
    },
    /**
     * 重置
     */
    reset() {
      this.queryParam = {};
      this.$refs.table.refresh(true);
    },

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleOk() {
      this.$refs.table.refresh();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
  },
};
</script>

<style lang="less">
button {
  margin-right: 8px;
}
.x-table .ant-table td {
  white-space: nowrap;
}
</style>
<style lang="less" scoped>
.table-page-search-wrapper {
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 10px;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    padding-bottom: 10px;
    .name {
      margin-right: 10px;
    }
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
