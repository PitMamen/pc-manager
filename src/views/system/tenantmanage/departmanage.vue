<template>
  <a-modal
    title="管理科室"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part" style="margin-top: 0px">
        <div class="div-part-left" style="overflow-y: scroll;">
          <div
            class="left-content1"
            style="margin-bottom: 20px"
            v-for="(item, index) in appListOut"
            :key="index"
          >
            <div class="div-content" style="margin-left: 0px">
              <a-checkbox
                style="margin-left: 0px"
                v-model="item.isChecked"
                @change="checkBoxselectChange(item, index)"
                :disabled="item.applicationId != 1 && item.applicationId != 6"
              ></a-checkbox>
              <span
                class="span-item-value"
                style="
                  font-size: 14px;
                  margin-top: 0px;
                  margin-left: 10px;
                  color: #4d4d4d;
                "
                >{{ item.applicationName }}
              </span>
            </div>

            <div class="div-content" style="margin-left: -10px">
              <span class="span-item-name" style="margin-left: -5px; margin-top: 10px"
                >已选科室:</span
              >
              <!-- :value="item.applicationId == 1 ? selectedRowKeys : item.selectedRowKeyids" -->
              <a-select
                allow-clear
                :disabled="item.applicationId != 1 && item.applicationId != 6"
                :value="item.selectedRowKeyids"
                placeholder="请在表格中勾选科室"
                dropdownClassName="select-tags-hidden"
                :maxTagCount="1"
                :collapse-tags="true"
                mode="multiple"
                style="height: 28px; width: 250px; margin-left: 0px; margin-top: 10px"
                @change="ksSelectChange($event, index)"
                @focus="onSelectFocus(item, index)"
              >
                <a-select-option
                  v-for="(item, index) in allDepartList"
                  :key="index"
                  :value="item.department_id"
                  >{{ item.department_name }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>

        <!-- 右 -->
        <div class="div-part-right">
          <div class="div-content" style="margin-top: 0px">
            <span class="span-item-name">查询条件:</span>
            <a-input
              class="span-item-value"
              v-model="queryParams.departmentName"
              style="display: inline-block"
              allow-clear
              placeholder="可输入科室名称后回车查询"
              @change="onInputChange"
            />
          </div>

          <s-table
            ref="table"
            size="default"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :columns="columnsDept"
            :data="loadData"
            :alert="true"
            :rowKey="(record) => record.department_id"
          >
            <!-- <span slot="statuas" slot-scope="text, record">
          <a-switch  :checked="record.enableStatus" />
        </span> -->
          </s-table>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from "@/components";
import {
  getDepartmentListForReq,
  getManagerDepts,
  updateManagerDepts,
} from "@/api/modular/system/posManage";
import { TRUE_USER, ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
export default {
  components: { STable },
  data() {
    return {
      hospitalCode: "",
      accountId: "",
      isChecked: false,
      visible: false,
      headers: {},
      appList: [],
      appListOut: [],
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      currentIndex: 0, //  正在编辑的item的指针  deptInfos 是当前item的管理科室数组
      // deptInfos     {
      //                   "deptId": 1030731,
      //                   "deptName": "代谢内分泌一病区"
      //               }
      fileList: [],
      danandataList: [],
      treeData: [],
      checkData: {
        account: "", //登录账号
        userId: "", //对应人员
        name: "",
        tel: "",
        role: undefined, //分配角色
        zuoxi: "", //坐席
      },

      queryParamsApp: {
        applicationName: "",
        applicationType: "", //1内部应用,2外部应用
        status: 1, //1开启,2关闭
      },

      accountChecked: false, //客服坐席

      roleList: [], //角色列表
      selectedRowKeys: [],
      // 表头
      columnsDept: [
        {
          title: "科室名称",
          dataIndex: "department_name",
        },

        {
          title: "科室类型",
          dataIndex: "department_type_cn",
        },
      ],
      allDepartList: [],
      queryParams: {
        departmentName: "",
        hospitalCode: "",
        parentDisarmamentId: "",
        status: 1,
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDepartmentListForReq(Object.assign(parameter, this.queryParams)).then(
          (res) => {
            if (res.code == 0) {
              var data = {
                pageNo: res.data.current,
                pageSize: res.data.size,
                totalRows: res.data.total,
                totalPage: res.data.total / res.data.size,
                rows: res.data.records,
              };
              return data;
            }
          }
        );
      },
    };
  },
  created() {},
  methods: {
    clearData() {},
    //科室管理
    assdepartmanage(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN);
      this.clearData();
      this.accountId = record.accountId;
      this.queryParams.hospitalCode = record.hospitalCode;
      this.hospitalCode = record.hospitalCode;
      this.visible = true;
      this.confirmLoading = false;

      if (this.$refs.table) {
        this.reset();
      }
      // this.getApplicationlistOut()
      this.getManagerDeptsOut();

      getDepartmentListForReq({
        departmentName: "",
        pageNo: 1,
        pageSize: 10000,
        parentDisarmamentId: "",
        status: 1,
        hospitalCode: this.hospitalCode,
      }).then((res) => {
        if (res.code == 0) {
          this.allDepartList = res.data.records;
        }
      });
    },

    clearData() {
      this.selectedRowKeyids = [];
      this.selectedRowKeys = [];
      this.queryParams.departmentName = "";
    },

    modalChange(record, id) {
      if (id == 1) {
        return this.selectedRowKeys;
      } else {
        return record.selectedRowKeys;
      }
    },

    getManagerDeptsOut() {
      getManagerDepts({ accountId: this.accountId }).then((res) => {
        if (res.code == 0) {
          if (res.data.items) {
            this.appList = res.data.items;

            this.appListOut = JSON.parse(JSON.stringify(this.appList));
            this.appListOut.forEach((item, index) => {
              // this.$set(item, 'isChecked', item.deptInfos ? true : false)  //根据条件判断
              this.$set(item, "isChecked", true); // 这里默认进来的时候 就是选中状态 ，到时候其他应用放开的时候 再根据条件判断
              this.$set(item, "selectedRowKeyids", []);

              //科室全部初始化
              if (item.deptInfos) {
                // if (item.applicationId == 1) {
                //只添加 全病程管理的应用
                var departList = item.deptInfos;
                var tempList = this.removeDuplicate(departList);
                tempList.forEach((item1, index1) => {
                  item.selectedRowKeyids.push(item1.deptId);
                  // this.selectedRowKeys.push(item1.deptId)
                });
                // }
              }
            });

            //默认第一个获取焦点回显到右侧表格
            this.selectedRowKeys = JSON.parse(
              JSON.stringify(this.appListOut[0].selectedRowKeyids)
            );

            this.updateSelect();
          }
        }
      });
    },

    //checkbox 选择
    checkBoxselectChange(item, index) {
      console.log("checkBoxselectChange", JSON.parse(JSON.stringify(item)));
      if (this.currentIndex != index) {
        this.currentIndex = index;
      }

      if (item.isChecked) {
        //勾选的，则切换
        this.selectedRowKeys = JSON.parse(
          JSON.stringify(this.appListOut[this.currentIndex].selectedRowKeyids)
        );
        this.updateSelect();
      } else {
        this.appListOut[this.currentIndex].selectedRowKeyids = [];
        this.selectedRowKeys = [];
        this.updateSelect();
        //取消勾选
      }

      // this.currentIndex = index;
      // this.selectedRowKeys = JSON.parse(
      //   JSON.stringify(this.appListOut[this.currentIndex].selectedRowKeyids)
      // );
      // this.updateSelect();

      //全局变量isChecked暂时没有实际作用
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      this.appListOut[this.currentIndex].selectedRowKeyids = JSON.parse(
        JSON.stringify(selectedRowKeys)
      );
    },

    // ksSelectChange(item, index,values) {
    ksSelectChange(values, index) {
      //$event 系统参数  index是自定义参数
      // console.log("ksSelectChange item", item);
      // console.log("ksSelectChange index", index);
      console.log("ksSelectChange values", values);
      console.log("ksSelectChange index", index);
      this.currentIndex = index;
      // return
      this.appListOut[this.currentIndex].selectedRowKeyids = JSON.parse(
        JSON.stringify(values)
      );
      this.selectedRowKeys = JSON.parse(JSON.stringify(values));
      this.updateSelect();
    },

    onSelectFocus(item, index) {
      console.log("onSelectFocus index", index);
      if (this.currentIndex != index) {
        this.currentIndex = index;
        this.selectedRowKeys = JSON.parse(
          JSON.stringify(this.appListOut[this.currentIndex].selectedRowKeyids)
        );
        this.updateSelect();
      }
    },

    onInputChange() {
      this.$refs.table.refresh(true);
    },
    updateSelect() {
      this.$refs.table.updateSelect(this.selectedRowKeys, []);
    },

    //数组元素去重
    removeDuplicate(arry) {
      const newArry = [];
      if (arry != null && arry.length > 0) {
        arry.forEach((item) => {
          if (!newArry.includes(item)) {
            newArry.push(item);
          }
        });
      }
      return newArry;
    },

    reset() {
      this.$refs.table.refresh(true);
    },
    handleSubmit() {
      console.log("handleSubmit", JSON.stringify(this.appListOut));
      // return
      // if (this.selectedRowKeys.length == 0) {
      //   this.$message.error('请选择科室')
      //   return
      // }

      let num = 0;
      this.appListOut.forEach((item, index) => {
        if (item.selectedRowKeyids.length > 0) {
          num = num + item.selectedRowKeyids.length;
          item.selectedRowKeyids = this.removeDuplicate(item.selectedRowKeyids);
        }
      });
      if (num == 0) {
        this.$message.error("您未选择科室");
        return;
      }

      // var temparray = this.removeDuplicate(this.selectedRowKeys)
      // this.confirmLoading = true
      // let selectIds = JSON.parse(JSON.stringify(temparray))
      // var items = []
      // items.push({
      //   applicationId: 1,
      //   deptIds: selectIds,
      // })

      var queryParamsData = {
        accountId: this.accountId,
        // items: items,
        items: [],
      };
      this.appListOut.forEach((item, index) => {
        if (item.selectedRowKeyids.length > 0) {
          queryParamsData.items.push({
            applicationId: item.applicationId,
            deptIds: item.selectedRowKeyids,
          });
        } else {
          queryParamsData.items.push({
            applicationId: item.applicationId,
            deptIds: [],
          });
        }
      });

      updateManagerDepts(queryParamsData).then((res) => {
        if (res.code == 0) {
          this.$message.success("关联科室成功！");
          this.visible = false;
          this.$emit("ok", "");
        } else {
          this.$message.error(res.message);
        }
        this.confirmLoading = false;
      });
    },

    goBack() {
      window.history.back();
    },

    handleCancel() {
      this.visible = false;
    },
  },
};
</script>


<style lang="less" scoped>
.content::-webkit-scrollbar {

width: 0px;

}

.content::-webkit-scrollbar-track {

background-color: rgba(255, 255, 255, 255);

 border-radius: 2px;

}

.content::-webkit-scrollbar-thumb {

background-color: rgba(255, 255, 255, 255);

border-radius: 10px;

}

.content::-webkit-scrollbar-thumb:hover {

 background-color: rgb(255, 255, 255);

}
</style>



<style lang="less" scoped>



.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #409eff;
  }
  .span-title {
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.div-part {
  width: 100%;
  height: 475px;
  margin-top: 10px;

  .div-part-left {
    float: left;
    width: 45%;
    overflow: hidden;
    height: 100%;
  }
  .div-part-right {
    float: right;
    width: 55%;
    overflow: hidden;
    height: 100%;
  }

  .div-content {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 60px;
    }

    .span-item-value {
      flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      //   flex: 1;
      font-size: 12px !important;
    }

    .ant-calendar-picker {
      flex: 1;
    }

    .avator {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      background: #dfdfdf;
      margin-right: 20px;
    }
    .avator-right {
      flex: 1;
      display: flex;
      flex-direction: column;

      .avator-right-top {
        width: 82px;
        height: 28px;
        border: 1px solid #cccccc;
        display: flex;
        flex-direction: row;
      }
    }
    .jueseview {
      width: 100%;
      height: 62px;
      border: 1px solid #cccccc;
      border-radius: 2px;
      overflow-y: auto;
      padding-bottom: 10px;

      .checkbox {
        margin-left: 10px;
        margin-top: 6px;
        margin-right: 0px;

        font-size: 12px !important;
      }
    }
  }

  .left-content1 {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }

  .checkview {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .span-check-title {
    font-size: 12px;
    margin-right: 8px;
    font-weight: bold;
    color: #4d4d4d;
  }

  .ant-switch {
    width: 40px !important;
  }
}
</style>
