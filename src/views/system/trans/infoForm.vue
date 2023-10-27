<template>
  <a-modal
    :title="'修改患者信息'"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>患者姓名：
            </div>
            <div class="div-cell-value">
              <a-input
                :maxLength="300"
                v-model="userData.genericName"
                allow-clear
                placeholder="请输入患者姓名"
                style="width: 100%"
              />
            </div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <a-select
                v-model="userData.drugTypeId"
                placeholder="身份证"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 90px"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>

            <div class="div-cell-value">
              <a-input
                v-model="userData.genericAcronym"
                allow-clear
                style="width: 100%"
                placeholder="请输入"
              />
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              性别：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>出生日期：
            </div>
            <div class="div-cell-value">
              <a-date-picker
                style="width: 100%"
                :default-value="nowDateBegin"
                format="YYYY-MM-DD"
                v-model="dateValue"
              />
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>本人电话：
            </div>
            <div class="div-cell-value">
              <a-input
                :maxLength="300"
                v-model="userData.genericName"
                allow-clear
                placeholder="请输入本人电话"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>家属姓名：
            </div>
            <div class="div-cell-value">
              <a-input
                :maxLength="300"
                v-model="userData.genericName"
                allow-clear
                placeholder="请输入家属姓名"
                style="width: 100%"
              />
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              家属电话：
            </div>
            <div class="div-cell-value">
              <a-input
                :maxLength="300"
                v-model="userData.genericName"
                allow-clear
                placeholder="请输入家属电话"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              国籍：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>
        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              民族：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              血型：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              RH阴性：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              文化程度：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>
        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              职业：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              婚姻状况：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>
              常住分类：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              医保类别：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="userData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>


        <div class="div-line">
          <div class="div-cell" style="width:90%">
            <div class="div-cell-name" style="width:20%">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>
              户口地址：
            </div>
            <div class="div-cell-value" style="width:80%">
              <a-input
                :maxLength="300"
                v-model="userData.genericName"
                allow-clear
                placeholder="请输入户口地址"
                style="width: 100%"
              />
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell" style="width:90%">
            <div class="div-cell-name" style="width:20%">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>
              详细户口地址：
            </div>
            <div class="div-cell-value" style="width:80%">
              <a-input
                :maxLength="300"
                v-model="userData.genericName"
                allow-clear
                placeholder="请输入详细户口地址"
                style="width: 100%"
              />
            </div>
          </div>
        </div>


      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { addTdHealthyTeam, queryHospitalList } from "@/api/modular/system/posManage";

import { TRUE_USER, ACCESS_TOKEN } from "@/store/mutation-types";
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from "@/utils/util";
import Vue from "vue";
export default {
  components: {},
  data() {
    return {
      visible: false,
      record: {},
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      fileList: [],
      danandataList: [],
      treeData: [],
      userData: {
        description: "",
        hospitalCode: undefined,
        teamName: "",
      },
    };
  },
  created() {},
  methods: {
    clearData() {
      this.record = {};
      this.checkData = {
        description: "",
        hospitalCode: undefined,
        teamName: "",
      };
    },
    //修改
    addTeam(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN);
      this.clearData();
      this.visible = true;
      this.confirmLoading = false;
      this.record = record;

      // this.queryHospitalListOut()
    },

    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
    queryHospitalListOut() {
      let queryData = {
        tenantId: "",
        status: 1,
        hospitalName: "",
      };
      this.confirmLoading = true;
      queryHospitalList(queryData)
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

    handleSubmit() {
      console.log(this.checkData);

      if (isStringEmpty(this.checkData.hospitalCode)) {
        this.$message.error("请选择所属机构");
        return;
      }

      if (isStringEmpty(this.checkData.teamName)) {
        this.$message.error("请输入团队名称");
        return;
      }
      this.addTeamOut(this.checkData);
    },

    selectChange(value) {},

    //修改团队
    addTeamOut(postData) {
      addTdHealthyTeam(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success("新增成功！");
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
.div-part {
  width: 100%;
  // height: 310px;
  margin-top: 10px;

  .div-line {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .div-cell {
      width: 45%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .div-cell-name {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 40%;
        text-align: right;
      }

      .div-cell-value {
        width: 60%;
      }

      .temp {
        /deep/ .ant-input {
          color: #409eff;
        }
      }
    }

    .check {
      &:hover {
        cursor: pointer;
      }
    }

    .div-shu-cell {
      display: flex;
      flex-direction: column;

      .div-shu-cell-ori {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
</style>
