<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属科室:</span>

        <a-select
          class="deptselect-single"
          show-search
          style="width: 180px"
          v-model="queryParam.inDeptCode"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          placeholder="请选择科室"
          @change="onDepartmentSelectChange"
          @search="onDepartmentSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option
            v-for="(item, index) in originData"
            :title="item.department_name"
            :key="index"
            :value="item.department_id"
            >{{ item.department_name }}</a-select-option
          >
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">申请时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>

      <div class="search-row">
        <span class="name">关键字查询:</span>
        <a-input
          v-model="queryParam.keyword"
          allow-clear
          placeholder="可输入关键字查询"
          style="width: 180px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)"
            >查询</a-button
          >
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()"
            >重置</a-button
          >
        </span>
      </div>
    </div>
    <!-- <div class="table-operator" style="overflow: hidden"></div> -->

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="addTransUp()"
        >新增</a-button
      >
    </div>

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
      <span slot="diagnos" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <!-- 工单状态（1提交申请 2申请审核通过 3申请审核不通过 4收治审核通过 5收治审核不通过 6已预约 7已收治） -->
      <span slot="statusName" slot-scope="text, record">
        <span v-if="record.status.value === 1">{{ record.statusName }}</span>
        <span
          v-if="record.status.value === 2 || record.status.value === 4"
          style="color: #69c07d"
          >{{ record.statusName }}</span
        >
        <a
          @click="showDes(record)"
          v-if="record.status.value === 3 || record.status.value === 5"
          style="color: #f40b0b; text-decoration: underline"
          >{{ record.statusName }}</a
        >
      </span>
      <span slot="action" slot-scope="text, record">
        <!-- 审核通过的不能修改 -->
        <template v-if="record.status.value === 2 || record.status.value === 4">
          <span style="margin-right: 5px; color: #999"
            ><a-icon type="edit" :style="{ fontSize: '14px', color: '#999' }" />修改</span
          >
        </template>
        <template v-else>
          <a @click="goEdit(record)"
            ><a-icon style="margin-right: 5px" type="edit" />修改</a
          >
        </template>
        <template>
          <a @click="goPrint(record)" style="margin-left: 8px"
            ><a-icon style="margin-right: 5px" type="printer" />打印</a
          >
        </template>
      </span>
    </s-table>
    <!-- <info-form ref="infoForm" @ok="handleOk" /> -->

    <!-- <a-modal v-model="visibleDes" title="提示" :footer="null" @ok="handleOkDes"> -->
    <a-modal v-model="visibleDes" cancelText="''" title="提示" @ok="handleOkDes">
      <div
        style="height: 120px; display: flex; flex-direction: column; padding-top: 30px"
      >
        <div style="margin-top;: 30px">{{ failReason }}。</div>
      </div>

      <template slot="footer">
        <a-button @click="handleOkDes">确定</a-button>
      </template>
    </a-modal>

    <print-DownForm ref="printDownForm" />
  </a-card>
</template>

<script>
import {
  accessHospitals,
  getCommodityClassify,
  getDepartmentListForSelect,
  getDownReferralList,
} from "@/api/modular/system/posManage";
import { list } from "@/api/modular/system/rate";
import { STable, Ellipsis } from "@/components";
import printDownForm from "./printDownForm";
import moment from "moment";
import Vue from "vue";
import { TRUE_USER } from "@/store/mutation-types";
import { formatDateFull, formatDate, getlastMonthToday } from "@/utils/util";
export default {
  components: {
    STable,
    Ellipsis,
    printDownForm,
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      fetching: false,
      visibleDes: false,
      createValue: [],
      // 查询参数
      queryParam: {
        createStartTime: getlastMonthToday(),
        createEndTime: formatDate(new Date().getTime()),
        // createStartTime: undefined,
        // createEndTime: undefined,
        inDeptCode: undefined,
        keyword: undefined,
      },
      queryParamOrigin: {
        createStartTime: undefined,
        createEndTime: undefined,
        inDeptCode: undefined,
        keyword: undefined,
      },
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
          title: "初步诊断",
          dataIndex: "diagnos",
          scopedSlots: { customRender: "diagnos" },
        },
        {
          title: "转诊原因",
          dataIndex: "referralReason",
          scopedSlots: { customRender: "referralReason" },
        },
        {
          title: "申请医生",
          dataIndex: "reqDocName",
          scopedSlots: { customRender: "reqDocName" },
        },
        {
          title: "申请科室",
          dataIndex: "reqDept",
          scopedSlots: { customRender: "reqDept" },
        },
        {
          title: "申请时间",
          dataIndex: "regTime",
          scopedSlots: { customRender: "regTime" },
        },
        {
          title: "期望到院时间",
          dataIndex: "inPeriod",
          scopedSlots: { customRender: "inPeriod" },
        },
        {
          title: "转入机构",
          dataIndex: "inHospitalCodeName",
          scopedSlots: { customRender: "inHospitalCodeName" },
        },
        {
          title: "审核结果",
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
        return getDownReferralList(Object.assign(parameter, this.queryParam)).then(
          (res) => {
            // if (res.code === 0) {
            //   return res.data;
            // } else {
            //   this.$message.error(res.message);
            // }

            if (res.code == 0 && res.data.records.length > 0) {
              //组装控件需要的数据结构
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.total,
                totalPage: res.data.total / parameter.pageSize,
                rows: res.data.records,
              };

              //设置序号
              data.rows.forEach((item, index) => {
                this.$set(item, "statusName", item.status.description);
                this.$set(item, "regTime", formatDateFull(item.regTime));
                this.$set(item, "tradeId", item.tradeIdStr);

                if (item.patientBaseinfo) {
                  this.$set(item, "name", item.patientBaseinfo.name);
                  this.$set(item, "sex", item.patientBaseinfo.sex);
                  this.$set(item, "age", this.countAge(item.patientBaseinfo.birthday));
                  this.$set(item, "name", item.patientBaseinfo.name);
                  this.$set(item, "name", item.patientBaseinfo.name);
                }

                //组装到院时间
                this.$set(
                  item,
                  "inPeriod",
                  formatDate(item.reachBeginDate) + "~" + formatDate(item.reachEndDate)
                );
                // this.$set(item, 'status', 1)
                // item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
                // item.nameDes = item.name
              });
            } else {
              data = [];
            }

            return data;
          }
        );
      },
      classData: [],
      treeData: [],
      originData: [],
      selectedRowKeys: [],
      selectedRows: [],
      failReason: "",
    };
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.queryParam = { ...this.queryParam, ...this.$route.query };
    this.getOrgList();
    this.getClassData();
    this.user = Vue.ls.get(TRUE_USER);
    console.log(this.user);
    this.getDepartmentSelectList(undefined);
    this.createValue = [
      moment(getlastMonthToday(), this.dateFormat),
      moment(formatDate(new Date().getTime()), this.dateFormat),
    ];
    // this.queryParam.createStartTime = this.createValue[0];
    // this.queryParam.createEndTime = this.createValue[1];
  },
  mounted() {
    this.$bus.$on("refreshTransDownListEvent", (record) => {
      console.log("refreshTransDownListEvent", record);
      // this.$refs.table.refresh(true);
      this.$refs.table.refresh();
    });
  },
  methods: {
    /**
     * 根据生日计算年龄
     * @param {*} birthday
     */
    countAge(birthday) {
      // let str = age.substring(0, 4) + '-' + age.substring(4, 6) + '-' + age.substring(6, 8)
      var birthday = new Date(birthday);
      var d = new Date();
      var age =
        d.getFullYear() -
        birthday.getFullYear() -
        (d.getMonth() < birthday.getMonth() ||
        (d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate())
          ? 1
          : 0);
      return age;
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true;
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, "managerDept").then((res) => {
        this.fetching = false;
        if (res.code == 0) {
          this.originData = res.data.records;
        }

        if (!departmentName) {
          this.$refs.table.refresh(true);
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

    showDes(record) {
      if (record.status.value == 3) {
        this.failReason = record.outCheckResult;
      } else if (record.status.value == 5) {
        this.failReason = record.inCheckResult;
      }
      this.visibleDes = true;
    },
    onChange(momentArr, dateArr) {
      console.log("MMM:", dateArr);
      this.createValue = momentArr;
      this.queryParam.createStartTime = dateArr[0];
      this.queryParam.createEndTime = dateArr[1];
    },

    goEdit(record) {
      //TODO
      // this.$message.success("去编辑");
      this.$router.push({
        name: "transdownDetailmodify",
        // path: '/servicewise/projectEdit',
        query: {
          tradeId: record.tradeId,
        },
      });
    },
    goPrint(record) {
      //TODO
      console.log('goPrint',JSON.stringify(record))
      this.$refs.printDownForm.open(record.tradeIdStr)
      // this.$message.success("去打印");
    },

    addTransUp() {
      this.$router.push({
        name: "transdownDetail",
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
      this.createValue = [];
      this.queryParam = JSON.parse(JSON.stringify(this.queryParamOrigin));
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
