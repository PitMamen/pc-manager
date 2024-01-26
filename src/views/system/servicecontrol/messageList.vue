<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <div class="div-service-control">
        <a-spin :spinning="confirmLoading2">
          <div class="div-service-left-control">
            <div class="search-row">
              <span class="name">模板名称：</span>
              <!-- <a-input
                style="width: 164px"
                v-model="queryParam.templateName"
                allow-clear
                placeholder="输入模板名称"
              /> -->
              <a-select
                style="width: 164px"
                show-search
                v-model="queryAuto.templateName"
                :filter-option="false"
                :not-found-content="null"
                allow-clear
                placeholder="输入模板名称"
                @search="handleSearchAuto"
                @change="handleChangeAuto"
              >
                <a-select-option
                  v-for="(item, index) in autoTemData"
                  :key="index"
                  :value="item.template_id"
                  >{{ item.template_title }}</a-select-option
                >
              </a-select>
            </div>

            <div class="top-kuang" style="margin-top: 20px">
              <div style="flex: 1">模板名称</div>
              <div>发送数</div>
              <div style="margin-left: 20px">成功数</div>
            </div>
            <div class="left-content">
              <div
                class="div-part"
                :class="{ checked: item.isChecked }"
                v-for="(item, index) in articleList"
                :key="index"
                :value="item.articleName"
                @click="handleChange(item.template_id, item.templateType)"
              >
                <div class="span-name" :title="item.articleName">
                  <div
                    style="
                      width: 50%;
                      overflow: hidden;
                      text-overflow: ellipsis;

                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 2;
                    "
                  >
                    {{ item.template_title }}
                  </div>
                  <div style="font-size: 12px; margin-left: 10px; text-align: right">
                    {{ item.co }}
                  </div>
                  <div style="font-size: 12px; margin-left: auto; margin-right: 20px">
                    {{ item.succ }}/{{ item.rate }}%
                  </div>
                </div>

                <div class="bottom-line"></div>

                <!-- <div class="ksview" :title="item.articleName">
                  {{ item.articleName }}
                </div> -->
                <!-- <div style="color: #999999; margin-top: 3px; display: flex; flex-direction: row; font-size: xx-small">
                  发送:{{ item.count }} &nbsp;成功:{{ item.readCount }}
                  <div style="color: #999999; font-size: 8px; margin-left: 10px">{{ item.rate }}</div>
                </div> -->
              </div>
            </div>
            <a-pagination
              v-if="showPagination"
              simple
              style="margin-left: 68px; margin-top: 10px; margin-bottom: 10px"
              :total="totalPage"
              :defaultCurrent="1"
              :current="currentPage"
              :pageSize="15"
              @change="handleChangePage"
            />
          </div>
        </a-spin>

        <div class="div-service-right-control">
          <div class="table-page-search-wrapper">
            <div class="search-row">
              <span class="name">执行科室:</span>

              <a-select
                style="width: 180px"
                show-search
                v-model="queryParam.executeDepartmentId"
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
                  :key="index"
                  :title="item.department_name"
                  :value="item.department_id"
                  >{{ item.department_name }}</a-select-option
                >
              </a-select>
            </div>
            <div class="search-row">
              <span class="name">发送状态:</span>
              <!-- v-model="queryParams.isVisible" -->
              <a-select
                placeholder="请选择状态"
                v-model="queryParam.sendStatus"
                allow-clear
                style="width: 120px; height: 28px"
              >
                <a-select-option
                  v-for="item in selects"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </div>
            <div class="search-row">
              <span class="name">发送时间:</span>
              <a-range-picker
                style="width: 185px"
                :value="createValue"
                @change="onChange"
              />
            </div>
            <div class="search-row">
              <span class="name">随访方案:</span>
              <a-input
                v-model="queryParam.followPlanName"
                allow-clear
                placeholder="输入方案名称"
                style="width: 180px"
              />
            </div>
            <div class="action-row">
              <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
                <a-button type="primary" icon="search" @click="queryAgain">查询</a-button>
                <a-button
                  icon="undo"
                  style="margin-left: 8px; margin-right: 0"
                  @click="reset"
                  >重置</a-button
                >
              </span>
            </div>
          </div>

          <s-table
            :scroll="{ x: true }"
            ref="table"
            size="default"
            style="margin-right: 20px"
            :columns="columns"
            :data="loadData"
            :alert="true"
            :rowKey="(record) => record.code"
          >
            <span slot="action" slot-scope="text, record">
              <a-popconfirm
                title="确定重新发送吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="send(record)"
              >
                <a :disabled="record.status == 1">重新发送</a>
              </a-popconfirm>
            </span>
            <span slot="status" slot-scope="text, record">
              <span v-if="record.status == 1" style="color: green">成功</span>
              <span v-else style="color: red">失败</span>
            </span>

            <span slot="wx" slot-scope="text, record">
              <span v-if="record.wx_sign > 0">是</span>
              <span v-else>否</span>
            </span>
          </s-table>
        </div>
      </div>
      <add-category ref="addCategory" @ok="handleOk" />
      <add-model ref="addModel" @ok="handleOk" />
      <check-model ref="checkModel" @ok="handleOk" />
    </a-spin>
  </a-card>
</template>

<script>
import { STable } from "@/components";
import { Pagination } from "@/components";
import { TRUE_USER } from "@/store/mutation-types";
import addCategory from "../teach/addCategory";
import addModel from "../teach/addModel";
import checkModel from "../teach/checkModel";
import Vue from "vue";
import { formatDateFull, formatDate } from "@/utils/util";
import moment from "moment";
import {
  getFollowArticleData,
  getRecordList,
  getDepartmentListForSelect,
  getFollowArticleUserData,
  deleteArticle,
  getRecordListGroupBy,
} from "@/api/modular/system/posManage";

export default {
  components: {
    STable,
    Pagination,
    addCategory,
    addModel,
    checkModel,
  },

  data() {
    return {
      currentPage: 1, //默认第一页
      totalPage: 10,
      fetching: false,
      showPagination: true,
      // 高级搜索 展开/关闭
      dateFormat: "YYYY-MM-DD",
      advanced: false,
      originData: [],
      articleListTemp: [],
      articleList: [],
      createValue: [],
      confirmLoading: false,
      confirmLoading2: false,
      idArr: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      queryParam: {
        templateId: undefined,
        templateName: undefined,
        executeDepartmentId: undefined,
        followPlanName: undefined,
        sendStartTime: "",
        sendEndTime: "",
        sendStatus: undefined,
      },

      queryAuto: {
        templateName: undefined,
        pageNo: 1,
        pageSize: 15,
      },
      autoTemData: [],

      // 表头
      columns: [
        {
          title: "模板名称",
          dataIndex: "template_title",
        },

        {
          title: "姓名",
          dataIndex: "user_name",
        },
        {
          title: "执行科室",
          dataIndex: "department_name",
        },
        {
          title: "随访方案",
          dataIndex: "plan_name",
        },
        {
          title: "发送方式",
          width: 80,
          dataIndex: "send_type",
        },
        {
          title: "发送时间",
          dataIndex: "created_time",
        },

        {
          title: "发送状态",
          width: 80,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "微信登记",
          width: 80,
          scopedSlots: { customRender: "wx" },
        },
        {
          title: "操作",
          fixed: "right",
          width: 80,
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],

      selects: [
        {
          id: "",
          name: "全部",
        },
        {
          id: 2,
          name: "失败",
        },
        {
          id: 1,
          name: "成功",
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getRecordList(Object.assign(parameter, this.queryParam)).then((res) => {
          //组装控件需要的数据结构
          var data = {
            pageNo: parameter.current,
            pageSize: parameter.size,
            totalRows: res.data.total,
            totalPage: res.data.pages,
            rows: res.data.records,
          };

          //设置序号
          // data.rows.forEach((item, index) => {
          //   item.messageTypeValue = item.messageType.description
          // })

          return data;
        });
      },

      selectedRowKeys: [],
      selectedRows: [],
    };
  },

  created() {
    this.queryParam.sendStartTime = formatDate(
      new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
    );
    this.queryParam.sendEndTime = formatDate(new Date());
    this.createValue = [
      moment(this.queryParam.sendStartTime, "YYYY-MM-DD"),
      moment(this.queryParam.sendEndTime, "YYYY-MM-DD"),
    ];

    this.getFollowArticleDataOut(true);
    this.getDepartmentSelectList(undefined);
  },

  methods: {
    moment,
    handleChangePage(value) {
      this.currentPage = value;
      // console.log("fff:",this.currentPage,value)
      this.getFollowArticleDataOut(false);
    },

    queryAgain() {
      this.queryParam.templateId = undefined;
      this.articleList.forEach((item) => {
        this.$set(item, "isChecked", false);
      });
      this.$refs.table.refresh();
    },
    reset() {
      this.queryParam.executeDepartmentId = undefined;
      this.queryParam.sendStartTime = "";
      this.queryParam.sendEndTime = "";
      this.queryParam.sendStatus = undefined;
      this.queryParam.templateId = undefined;
      this.queryParam.templateName = undefined;
      this.createValue = [];
      (this.queryParam.followPlanName = undefined), this.getFollowArticleDataOut(true);
    },

    onTabChange(key) {
      console.log(key);
    },
    //获取模板列表
    getFollowArticleDataOut(isRefreshAll) {
      this.confirmLoading2 = true;
      var postData = {
        pageNo: this.currentPage,
        pageSize: 15,
      };
      getRecordListGroupBy(postData)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.showPagination = true;
            if (this.queryParam.templateId) {
              res.data.records.forEach((item) => {
                item.checked = item.template_id == this.queryParam.templateId;
              });
            } else {
              // res.data.records[0].checked = true
              // this.queryParam.templateId = res.data.records[0].template_id
              // this.queryParam.templateName = res.data.records[0].template_title
              this.queryParam.templateId = undefined;
              this.queryParam.templateName = undefined;
              this.articleList.forEach((item) => {
                this.$set(item, "isChecked", false);
              });
            }

            this.articleList = res.data.records;
            this.articleListTemp = res.data.records;
            this.totalPage = res.data.total;
            this.currentPage = res.data.current;

            if (isRefreshAll) {
              this.$refs.table.refresh();
            }
          } else {
            this.showPagination = false;
            this.queryParam.templateId = undefined;
            this.queryParam.templateName = undefined;
            this.articleList = [];
            this.articleListTemp = [];
            if (isRefreshAll) {
              this.$refs.table.refresh();
            }
          }
        })
        .finally(() => {
          this.confirmLoading2 = false;
        });
    },

    //获取管理的科室 可首拼
    getAutoSelectList(templateName) {
      this.fetching = true;
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getRecordListGroupBy({ templateName: templateName, pageNo: 1, pageSize: 15 }).then(
        (res) => {
          console.log("ddd--------------auto", res);
          this.fetching = false;
          if (res.code == 0) {
            this.autoTemData = res.data.records;
          }
        }
      );
    },
    //科室搜索
    handleSearchAuto(value) {
      this.autoTemData = [];
      console.log("handleSearchAuto", value);
      this.getAutoSelectList(value);
    },
    //科室选择变化
    handleChangeAuto(value) {
      debugger;
      console.log("handleChangeAuto", value);
      if (value === undefined) {
        this.autoTemData = [];
        this.getAutoSelectList(undefined);
      }
      // let data = this.autoTemData.find((item) => {
      //   item.template_id == value;
      // });
      let data = this.autoTemData.find((item) => item.template_id == value);

      console.log("handleChangeAuto------------data", data);
      this.handleChange(value, data.templateType);
      // this.$refs.table.refresh(true);
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
      });
    },
    //科室搜索
    onDepartmentSelectSearch(value) {
      this.originData = [];
      this.getDepartmentSelectList(value);
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      console.log("onDepartmentSelectChange", value);
      if (value === undefined) {
        this.originData = [];
        this.getDepartmentSelectList(undefined);
      }
      // this.$refs.table.refresh(true)
    },

    handlePlanChange() {},
    handlePlanSearch(inputName) {},

    handleSearch(inputName) {
      this.articleListTemp = this.articleList;
    },
    handleChange(value, templateType) {
      console.log("handleChange", value);

      if (value) {
        this.queryParam.templateId = value;
        this.articleList.forEach((item) => {
          this.$set(item, "isChecked", false);
          if (
            item.template_id == this.queryParam.templateId &&
            item.templateType == templateType
          ) {
            this.queryParam.templateName = item.template_title;
            this.$set(item, "isChecked", true);
          }
        });
      } else {
        this.queryParam.templateId = undefined;
        this.queryParam.templateName = undefined;
        this.articleList.forEach((item) => {
          this.$set(item, "isChecked", false);
        });
      }

      // if (!this.queryParam.templateId) {
      //   this.queryParam.templateId = this.articleList[0].template_id
      //   this.queryParam.templateName = this.articleList[0].template_title
      // }
      console.log(this.queryParam.templateId + "====" + this.queryParam.templateName);
      this.articleListTemp = this.articleList;
      this.$refs.table.refresh();
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr;
      this.queryParam.sendStartTime = dateArr[0];
      this.queryParam.sendEndTime = dateArr[1];
    },

    //重新发送
    send(record) {
      this.$message.success("该功能待开发");
      // this.confirmLoading = true
      // modifyArticle({ id: record.articleId, status: '2' }).then((res) => {
      //   this.confirmLoading = false
      //   if (res.code == 0) {
      //     this.$message.success('发送成功')
      //     this.handleOk()
      //   } else {
      //     this.$message.error('发送失败：' + res.message)
      //   }
      // })
    },

    handleOk() {
      this.$refs.table.refresh();
    },
  },
};
</script>

<style lang="less" scoped>
.div-service-control {
  width: 100%;
  overflow: hidden;
  height: calc(100vh - 173px);
  display: flex;
  flex-direction: row;

  span {
    font-size: 12px;
  }

  .div-divider {
    margin: 0% 0% 0% 1%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-service-left-control {
    // display: grid;
    margin-right: 20px;
    // height: calc(100vh - 170px);
    // height: 510px;
    overflow-y: auto;
    height: 81.7vh;
    flex-shrink: 0;
    width: 270px;
    overflow: hidden;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    padding: 20px 10px 20px 20px;

    .top-kuang {
      display: flex;
      height: 30px;
      align-items: center;
      padding: 15px;
      font-size: 12px;
      background-color: #f2f2f2;
      color: #1a1a1a;
      flex-direction: row !important;
      width: 95%;
      justify-content: space-between;
      border-bottom: #e6e6e6 1px solid;
      border: 1px solid #dfe3e5;
    }

    // border: 1px solid #e6e6e6;

    .left-lb-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 85px;
    }

    .toptab {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 10px;
      height: 28px;
      background: #fafafa;
      font-size: 12px;
      font-weight: bold;
      color: #4d4d4d;
      border-bottom: 1px solid #e6e6e6;
    }
    .toptab-no {
      flex: 1;
      line-height: 30px;
      text-align: center;
    }
    .toptab-yes {
      flex: 1;
      text-align: center;
      line-height: 30px;
      background: #eff7ff;
      border-bottom: 2px solid #409eff;
    }

    .left-content {
      // height: 10%;
      overflow-y: auto;
      padding: 10px;
      // height: 530px;
      // width: 260px;
      .checked {
        color: #1890ff !important;
        // border: 1px solid #1890ff !important;
        // box-shadow: 0px 0px 4px 1px #409eff !important;
      }

      .div-part {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // height: 40px;
        font-size: 12px;
        align-items: center;

        &:hover {
          cursor: pointer;
        }

        .bottom-line {
          width: 100%;
          height: 0.5px;
          background: #e6e6e6;
          margin-top: 10px;
          margin-bottom: 5px;
          margin-right: 10%;
        }

        .span-name {
          // flex: 1;
          // height: 85%;
          // overflow: hidden; //溢出隐藏
          // text-overflow: ellipsis; //超出省略号显示
          // white-space: nowrap; //文字不换行
          // margin-top: 1%;
          // font-size: 12px;
          // text-align: left|center;

          flex: 1;
          height: 85%;
          // overflow: hidden; //溢出隐藏
          // text-overflow: ellipsis; //超出省略号显示
          // white-space: nowrap; //文字不换行
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          text-align: left|center;
        }

        .div-rate {
          display: flex;
          font-size: 12px;
          align-items: center;
          flex-direction: row;
          margin-right: 3%;
        }
      }
    }
    .content-right {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .typeadd {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      margin-bottom: 10px;
      color: #409eff;
    }
    .ksviewaper {
      display: flex;
      flex-direction: row;
      height: 30px;
      align-items: center;
      justify-content: space-between;
    }
    .ksview {
      font-size: 12px;
      width: 200px;

      white-space: nowrap;

      overflow: hidden;

      text-overflow: ellipsis;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .div-service-right-control {
    flex: 1;
    // width: calc(100% - 20px);
    box-sizing: border-box;
    padding: 20px 20px 20px 20px;
    border: 1px solid #e6e6e6;
  }
}

.ant-table-body {
  overflow-x: auto !important;
}
.table-wrapper {
  // max-height: 600px;
  // overflow-y: auto;
}
.sys-card {
  // height: 100%;
  // padding-bottom: 52px;
  // /deep/ .ant-table-pagination {
  //   position: fixed;
  //   right: 32px;
  //   bottom: 20px;
  // }
}
.table-page-search-wrapper {
  padding-bottom: 10px !important;
  // border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }

  .search-row {
    /deep/.ant-select-selection__rendered {
      margin-top: -2px !important;
    }

    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    padding-bottom: 10px !important;
    .name {
      margin-right: 10px;
    }
  }
  .action-row {
    padding-bottom: 10px !important;
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
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
</style>
