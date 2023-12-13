<template>
  <a-card :bordered="false" class="table-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">患者信息:</span>
        <a-input
          v-model="queryParam.userInfoQuery"
          allow-clear
          placeholder="可输入患者姓名或电话号码查询"
          style="width: 210px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">授权机构:</span>
        <a-select
          class="deptselect-single"
          style="width: 180px"
          v-model="queryParam.outHospitalCode"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          placeholder="请选择医疗机构"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option
            v-for="(item, index) in originData"
            :title="item.hospitalName"
            :key="index"
            :value="item.hospitalCode"
            >{{ item.hospitalName }}</a-select-option
          >
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">授权时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)"
            >查询</a-button
          >
          <!-- <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button> -->
          <!-- <a-icon type="desktop" /> -->
          <a-button
            icon="desktop"
            style="margin-left: 8px; margin-right: 0"
            @click="goBoard()"
            >看板</a-button
          >
        </span>
      </div>
    </div>
    <!-- <div class="table-operator" style="overflow: hidden"></div> -->

    <div class="table-operator" style="overflow: hidden"></div>

    <s-table
      ref="table"
      class="x-table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :scroll="{ x: true }"
      :showPagination="false"
      :showSizeChanger="false"
      :rowKey="(record) => record.id"
    >
      <!-- <span slot="upNum1" style="cursor: pointer" slot-scope="text, record">
        <a @click="goDetail(record, '上转人数', 1)">{{ record.upNum }}</a>
        <ellipsis :length="10" tooltip>{{text}}</ellipsis>
      </span> -->

      <!-- 查看档案数量 -->
      <span slot="docNum" style="cursor: pointer" slot-scope="text, record">
        <a @click="showFileDangan(record)">{{ record.docNum }}</a>
      </span>

      <!-- 查看合约详情 -->
      <span slot="authorization_id" style="cursor: pointer" slot-scope="text, record">
        <a @click="goDetail(record.authorization_id)">{{ record.authorization_id }}</a>
      </span>
    </s-table>

    <!-- <a-modal v-model="visibleDes" title="提示" :footer="null" @ok="handleOkDes"> -->
    <a-modal v-model="visibleDes" cancelText="''" title="提示" @ok="handleOkDes">
      <div
        style="height: 120px; display: flex; flex-direction: column; padding-top: 30px"
      >
        <div style="margin-top;: 30px">不通过原因：小问题，请自行处理。</div>
      </div>

      <template slot="footer">
        <a-button @click="handleOkDes">确定</a-button>
      </template>
    </a-modal>

    <auth-Detail ref="authDetail" @ok="handleOk" />
    <file-modalshow ref="fileModalshow" />
  </a-card>
</template>

<script>
import {
  accessHospitals,
  getCommodityClassify,
  getReferralHospitalList,
  userCaseSyninfoList,
} from "@/api/modular/system/posManage";
import { list } from "@/api/modular/system/rate";
import { STable, Ellipsis } from "@/components";
import authDetail from "./authDetail";
import fileModalshow from "./fileModalshow";
// import infoForm from "./infoForm";
import moment from "moment";
import Vue from "vue";
import { TRUE_USER } from "@/store/mutation-types";
import { formatDateFull, formatDate, getlastMonthToday } from "@/utils/util";
export default {
  components: {
    STable,
    Ellipsis,
    authDetail,
    fileModalshow,
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
        userInfoQuery: undefined,
        outHospitalCode: undefined,
        // startTime:formatDate(new Date().getTime()),
        // endTime:getlastMonthToday(),
        startTime: undefined,
        endTime: undefined,

        // statBegin: getlastMonthToday(),
        // statEnd: formatDate(new Date().getTime()),
        // hospitalCode: Vue.ls.get(TRUE_USER).hospitalCode,
      },
      queryParamOrigin: {
        startTime: undefined,
        endTime: undefined,
        outHospitalCode: undefined,
        userInfoQuery: undefined,
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
          title: "业务应用",
          dataIndex: "bussType",
        },
        {
          title: "患者姓名",
          dataIndex: "name",
          align: "center",
          // scopedSlots: { customRender: "upNum1" },
        },
        {
          title: "证件类型",
          dataIndex: "identification_type",
          align: "center",
          // scopedSlots: { customRender: "downNum1" },
        },
        {
          title: "证件号码",
          dataIndex: "identification_no",
          align: "center",
          // scopedSlots: { customRender: "backNum1" },
        },
        {
          title: "授权档案",
          dataIndex: "caseDoc",
          align: "center",
          // scopedSlots: { customRender: "outNum1" },
        },
        {
          title: "文档数量",
          dataIndex: "docNum",
          align: "center",
          scopedSlots: { customRender: "docNum" },
        },
        {
          title: "授权机构",
          dataIndex: "out_hospital_name",
          align: "center",
          // scopedSlots: { customRender: "out_hospital_name" },
        },
        {
          title: "被授权机构",
          dataIndex: "in_hospital_name",
          align: "center",
          // scopedSlots: { customRender: "in_hospital_name" },
        },
        {
          title: "授权时间",
          dataIndex: "create_time",
          align: "center",
          // scopedSlots: { customRender: "create_time" },
        },
        {
          title: "授权合约",
          dataIndex: "authorization_id",
          align: "center",
          scopedSlots: { customRender: "authorization_id" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return userCaseSyninfoList(Object.assign(parameter, this.queryParam)).then(
          (res) => {
            if (res.code === 0) {
              //组装控件需要的数据结构
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.total,
                totalPage: res.data.total / parameter.pageSize,
                rows: res.data.records,
              };

              // if (data.rows && data.rows.length > 0) {
              //   data.rows.forEach((item, index) => {
              //     this.$set(item, "beginTime", this.queryParam.statBegin);
              //   });
              // }

              return data;
            } else {
              this.$message.error(res.message);
            }
          }
        );
      },
      user: {},
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
    this.user = Vue.ls.get(TRUE_USER);
    console.log(this.user);
    this.queryParam = { ...this.queryParam, ...this.$route.query };
    this.getDepartmentSelectList(undefined);
    this.createValue = [];
    // this.createValue = [
    //   moment(getlastMonthToday(), this.dateFormat),
    //   moment(formatDate(new Date().getTime()), this.dateFormat),
    // ];
  },
  mounted() {
  },
  methods: {
    goDetail(id) {
      this.$refs.authDetail.detail(id);
    },

    goBoard() {
      window.open("https://www.mclouds.org.cn/blockchain/index.html");
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList() {
      this.fetching = true;
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getReferralHospitalList().then((res) => {
        this.fetching = false;
        if (res.code == 0) {
          this.originData = [
            {
              hospitalCode: "",
              hospitalName: "全部",
            },
          ].concat(res.data);
        }
      });
    },

    handleOkDes() {
      this.visibleDes = false;
    },

    //这里造一个数据结构传入fileModalshow，因为以前的代码逻辑数据结构如此
    showFileDangan(record) {
      this.$refs.fileModalshow.showFile({
        tradeId: record.trade_id_str,
        name: record.name,
        age: record.age,
        patientBaseinfo: { sex: record.sex },
      });
    },

    showDes() {
      this.visibleDes = true;
    },
    onChange(momentArr, dateArr) {
      console.log("MMM:", dateArr);
      this.createValue = momentArr;
      this.queryParam.startTime = dateArr[0];
      this.queryParam.endTime = dateArr[1];
    },

    goEdit(record) {
      //TODO
      // this.$message.success("去编辑");
      this.$router.push({
        name: "transupDetailmodify",
        // path: '/servicewise/projectEdit',
        query: {
          dataStr: JSON.stringify(record),
        },
      });
    },
    goPrint() {
      //TODO
      this.$message.success("去打印");
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
<style lang="less" scoped>
.table-card {
  /deep/ .ant-table-pagination {
    display: none;
  }
}
</style>
