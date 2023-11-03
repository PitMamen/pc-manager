<template>
  <a-card :bordered="false" class="table-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">医疗机构:</span>
        <a-select
          class="deptselect-single"
          style="width: 180px"
          v-model="queryParam.hospitalCode"
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
        <span class="name">审核时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)"
            >查询</a-button
          >
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()"
            >重置</a-button
          >
          <a-button icon="export" style="margin-left: 8px; margin-right: 0" @click="exportOut()"
            >导出</a-button
          >
        </span>
      </div>
    </div>
    <!-- <div class="table-operator" style="overflow: hidden"></div> -->

    <div class="table-operator" style="overflow: hidden">
    </div>

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
    </s-table>
    <!-- <info-form ref="infoForm" @ok="handleOk" /> -->

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
  </a-card>
</template>

<script>
import {
  accessHospitals,
  getCommodityClassify,
  getReferralHospitalList,
  statReferralPatient,
  exportReferralPatient,
} from "@/api/modular/system/posManage";
import { list } from "@/api/modular/system/rate";
import { STable, Ellipsis } from "@/components";
// import infoForm from "./infoForm";
import moment from "moment";
import Vue from "vue";
import { TRUE_USER } from "@/store/mutation-types";
import { formatDateFull, formatDate, getlastMonthToday } from "@/utils/util";
export default {
  components: {
    STable,
    Ellipsis,
    // infoForm,
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
        statBegin: getlastMonthToday(),
        statEnd: formatDate(new Date().getTime()),
        hospitalCode: Vue.ls.get(TRUE_USER).hospitalCode,
      },
      queryParamOrigin: {
        statBegin: undefined,
        statEnd: undefined,
        hospitalCode: undefined,
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
          title: "机构名称",
          dataIndex: "hospitalName",
          scopedSlots: { customRender: "hospitalName" },
        },
        {
          title: "上转人数",
          dataIndex: "upNum",
          scopedSlots: { customRender: "upNum" },
        },
        {
          title: "下转人数",
          dataIndex: "downNum",
          scopedSlots: { customRender: "downNum" },
        },
        {
          title: "回转人数",
          dataIndex: "backNum",
          scopedSlots: { customRender: "backNum" },
        },
        {
          title: "转出人数",
          dataIndex: "outNum",
          scopedSlots: { customRender: "outNum" },
        },
        {
          title: "转出审核不通过",
          dataIndex: "outUncheckedNum",
          scopedSlots: { customRender: "outUncheckedNum" },
        },
        {
          title: "转入接收",
          dataIndex: "inNum",
          scopedSlots: { customRender: "inNum" },
        },
        {
          title: "转入拒收",
          dataIndex: "inUncheckedNum",
          scopedSlots: { customRender: "inUncheckedNum" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return statReferralPatient(Object.assign({}, this.queryParam)).then( res => {
            if (res.code === 0) {
              return {
                rows: res.data,
                total: res.data.length
              };
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
    this.createValue = [
      moment(getlastMonthToday(), this.dateFormat),
      moment(formatDate(new Date().getTime()), this.dateFormat),
    ];
  },
  mounted() {
    this.$bus.$on("refreshTransUpListEvent", (record) => {
      return;
      console.log("refreshTransUpListEvent", record);
      // this.$refs.table.refresh(true);
      this.$refs.table.refresh();
    });
  },
  methods: {
    //导出
    exportOut() {
      let params = JSON.parse(JSON.stringify(this.queryParam))
      exportReferralPatient(params)
        .then((res) => {
          this.downloadfile(res)
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
    },

    downloadfile(res) {
      var blob = new Blob([res.data], { type: 'application/octet-stream; charset=UTF-8' })
      var contentDisposition = res.headers['content-disposition']
      var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      var result = patt.exec(contentDisposition)
      if (result) {
        var filename = result[1]
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) // 创建下载的链接
        var reg = /^["](.*)["]$/g
        downloadElement.style.display = 'none'
        downloadElement.href = href
        downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href)
      }
    },
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
    getDepartmentSelectList() {
      this.fetching = true;
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getReferralHospitalList().then((res) => {
        this.fetching = false;
        if (res.code == 0) {
          this.originData = [{
            hospitalCode:'',
             hospitalName:'全部'
          }].concat(res.data);
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
    onChange(momentArr, dateArr) {
      console.log("MMM:", dateArr);
      this.createValue = momentArr;
      this.queryParam.statBegin = dateArr[0];
      this.queryParam.statEnd = dateArr[1];
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
