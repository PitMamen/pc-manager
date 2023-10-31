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
                v-model="userData.name"
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
                v-model="userData.identificationType"
                placeholder="身份证"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 90px"
              >
                <a-select-option
                  v-for="item in zhengjianDatas"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>

            <div class="div-cell-value">
              <a-input
                v-model="userData.identificationNo"
                allow-clear
                style="width: 100%"
                placeholder="请输入证件编号"
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
                v-model="userData.sex"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in genderData"
                  :key="item.code"
                  :value="item.value"
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
              <!-- :default-value="nowDateBegin" -->
              <a-date-picker
                style="width: 100%"
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
                v-model="userData.phone"
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
                v-model="userData.contactor"
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
                v-model="userData.contactTel"
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
                v-model="userData.country"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in countryData"
                  :key="item.code"
                  :value="item.value"
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
                v-model="userData.nation"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in nationData"
                  :key="item.code"
                  :value="item.value"
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
                v-model="userData.bloodType"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in bloodData"
                  :key="item.id"
                  :value="item.value"
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
                v-model="userData.rhFlag"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in rhDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="userData.educationLevel"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in eduDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="userData.job"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in jobDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="userData.marry"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in marryDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="userData.liveType"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in liveDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="userData.insuranceType"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in insuranceDatas"
                  :key="item.code"
                  :value="item.value"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell" style="width: 90%">
            <div class="div-cell-name" style="width: 20%">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>
              户口地址：
            </div>
            <div class="div-cell-value" style="width: 80%">
              <a-auto-complete
                v-model="userData.addressCode"
                placeholder="请输入选择"
                option-label-prop="title"
                @select="onSelectBase"
                @search="handleSearchBase"
                style="width: 100%; height: 28px"
              >
                <template slot="dataSource">
                  <a-select-option
                    v-for="(item, index) in addressDatas"
                    :title="item.townName"
                    :key="index + ''"
                    :value="item.addressId + ''"
                    >{{ item.townName }}</a-select-option
                  >
                </template>
              </a-auto-complete>
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell" style="width: 90%">
            <div class="div-cell-name" style="width: 20%">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>
              详细户口地址：
            </div>
            <div class="div-cell-value" style="width: 80%">
              <a-input
                :maxLength="300"
                v-model="userData.addressDetail"
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
import {
  addTdHealthyTeam,
  queryHospitalList,
  savePatientBaseInfo,
  getPatientBaseInfo,
  getRegionInfo,
  getDictData,
} from "@/api/modular/system/posManage";

import { TRUE_USER, ACCESS_TOKEN } from "@/store/mutation-types";
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from "@/utils/util";
import Vue from "vue";
import moment from "moment";
export default {
  components: {},
  data() {
    return {
      visible: false,
      dateFormat: "YYYY-MM-DD",
      nowDateBegin: "", //
      dateValue: undefined, //
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      fileList: [],
      danandataList: [],
      typeDatas: [
        { id: 1, code: "1", value: "张三" },
        { id: 11, code: "11", value: "王二" },
      ],
      treeData: [],
      zhengjianDatas: [],
      genderData: [],
      countryData: [],
      nationData: [],
      bloodData: [],
      rhDatas: [],
      eduDatas: [],
      jobDatas: [],
      marryDatas: [],
      liveDatas: [],
      insuranceDatas: [],
      addressDatas: [],
      userData: {
        name: undefined,
        identificationType: "01", //默认身份证
        identificationNo: undefined,
        sex: undefined,
        birthday: undefined,
        phone: undefined,
        contactor: undefined,
        contactTel: undefined,
        country: undefined,
        nation: undefined,
        bloodType: undefined,
        rhFlag: undefined, //RH阴性
        educationLevel: undefined, //文化程度
        job: undefined, //职业
        marry: undefined, //婚姻状况
        liveType: undefined, //常住分类
        insuranceType: undefined, //医保类别

        address: undefined, //户口地址
        addressCode: undefined, //户口地址编码
        addressDetail: undefined, //户口详细地址

        createTime: undefined,
        departmentId: undefined,
        hospitalCode: undefined,
        id: undefined,
        tenantId: undefined,
        updateTime: undefined,
      },
    };
  },

  created() {
    //获取 证件类型
    getDictData("IDENTIFICATION_TYPE").then((res) => {
      if (res.code == 0) {
        this.zhengjianDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("sex").then((res) => {
      if (res.code == 0) {
        this.genderData = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("PART_COUNTRY").then((res) => {
      if (res.code == 0) {
        this.countryData = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("NATION").then((res) => {
      if (res.code == 0) {
        this.nationData = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("BLOOD_TYPE").then((res) => {
      if (res.code == 0) {
        this.bloodData = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("BLOOD_RH").then((res) => {
      if (res.code == 0) {
        this.rhDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("EDUCATION_LEVEL").then((res) => {
      if (res.code == 0) {
        this.eduDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("JOB_TYPE").then((res) => {
      if (res.code == 0) {
        this.jobDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("MARRY_STATUS").then((res) => {
      if (res.code == 0) {
        this.marryDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("LIVE_TYPE").then((res) => {
      if (res.code == 0) {
        this.liveDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("INSURANCE_TYPE").then((res) => {
      if (res.code == 0) {
        this.insuranceDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
  },

  methods: {
    clearData() {
      this.userData = {};
      this.addressDatas=[]
    },

    onSelectBase(addressId) {
      let getOne = this.addressDatas.find((item) => item.addressId == addressId);
      this.userData.address = getOne.townName;
    },

    handleSearchBase(name) {
      let params = {
        keyWord: name,
      };
      getRegionInfo(params)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.addressDatas = res.data;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    //修改
    goModify(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN);
      // this.nowDateBegin = moment(new Date(), this.dateFormat);
      this.clearData();
      this.visible = true;
      this.confirmLoading = false;
      // this.userData = JSON.parse(JSON.stringify(record));
      this.getPatientDataDetail(record);
    },

    getPatientDataDetail(record) {
      // this.confirmLoading = true;
      getPatientBaseInfo({ id: record.id }).then((res) => {
        if (res.code == 0) {
          this.userData = res.data;
          if (this.userData.birthday) {
            this.dateValue = moment(this.userData.birthday, "YYYY-MM-DD");
          }

          if (this.userData.addressCode) {
            this.addressDatas = [
              { addressId: this.userData.addressCode, townName: this.userData.address },
            ];
          }
        } else {
          this.$message.error(res.message);
        }
        this.confirmLoading = false;
      });
    },

    onSelectType(value) {
      console.log("vvv", value);
    },

    handleSubmit() {
      console.log("handleSubmit", JSON.stringify(this.userData));
      if (this.dateValue) {
        this.userData.birthday = moment(this.dateValue).format("YYYY-MM-DD");
      }
      console.log("handleSubmit After", JSON.stringify(this.userData));

      if (isStringEmpty(this.userData.name)) {
        this.$message.error("请输入患者姓名");
        return;
      }

      if (isStringEmpty(this.userData.identificationType)) {
        this.$message.error("请选择证件类型");
        return;
      }
      if (isStringEmpty(this.userData.identificationNo)) {
        this.$message.error("请输入证件编号");
        return;
      }
      if (isStringEmpty(this.userData.birthday)) {
        this.$message.error("请选择出生日期");
        return;
      }
      if (isStringEmpty(this.userData.phone)) {
        this.$message.error("请输入本人电话");
        return;
      }
      if (isStringEmpty(this.userData.liveType)) {
        this.$message.error("请输选择常住分类");
        return;
      }
      if (isStringEmpty(this.userData.addressCode)) {
        this.$message.error("请输入选择户口地址");
        return;
      }
      if (isStringEmpty(this.userData.addressDetail)) {
        this.$message.error("请输输入详细户口地址");
        return;
      }
      this.addTeamOut(this.userData);
    },

    selectChange(value) {},

    //修改团队
    addTeamOut(postData) {
      savePatientBaseInfo(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success("修改成功！");
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
