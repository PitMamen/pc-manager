<template>
  <a-modal
    :title="id ? '修改微信模板' : '新增微信模板'"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <div style="display: flex; flex-direction: row; align-items: center">
        <div class="btn-check">
          <a-checkbox @click="goAgin()" :checked="isAgain" />
          <div
            @click="goAgin()"
            style="width: 120px; text-align: left; padding-left: 10px"
          >
            智慧管家同步提醒
          </div>
        </div>
        <div style="flex: 1"></div>
        <div style="display: flex; flex-direction: row; align-items: center">
          <a-button @click="handleCancel">取消</a-button>
          <a-button @click="handleSubmit" type="primary">确定</a-button>
        </div>
      </div>
    </template>

    <a-spin :spinning="confirmLoading">
      <div class="div-check3">
        <div class="div-part">
          <div class="div-line-wrap">
            <div class="div-left">
              <span class="span-item-name" style="text-align: right">公众号 :</span>
              <a-select
                v-model="checkData.wxAppId"
                allow-clear
                @select="onSelectAppId"
                placeholder="请选择"
                @change="onWXProgramChange"
              >
                <a-select-option
                  v-for="(item, index) in wxgzhData"
                  :key="index"
                  :value="item.wxAppId"
                  >{{ item.wxPublicName }}</a-select-option
                >
              </a-select>
            </div>

            <div class="div-left" style="padding-left: 20px">
              <span class="span-item-name">模板标题 :</span>
              <a-input
                v-model="checkData.templateTitle"
                class="span-item-value"
                style="display: inline-block"
                allow-clear
                type="text"
                :maxLength="30"
                placeholder="请输入模板标题 "
              />
            </div>
          </div>
          <div class="div-line-wrap">
            <div class="div-left">
              <span class="span-item-name" style="text-align: right">用途 :</span>
              <a-select
                v-model="checkData.useTo"
                allow-clear
                @select="onSelectUse"
                placeholder="请选择"
              >
                <a-select-option
                  v-for="(item, index) in useDatas"
                  :key="index"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>

            <div v-if="checkData.useTo == 1" class="div-left" style="padding-left: 20px">
              <span class="span-item-name">问卷名称 :</span>
              <a-input
                v-show="questionContent.name"
                v-model="questionContent.name"
                disabled
                class="span-item-value"
                style="display: inline-block; margin-right: 20px; width: 200px"
                allow-clear
                readOnly
                placeholder="请选择问卷 "
              />
              <a-button type="primary" style="margin-left: 8px" @click="selectQestionBtn">
                选择
              </a-button>
            </div>

            <div v-if="checkData.useTo == 2" class="div-left" style="padding-left: 20px">
              <span class="span-item-name">宣教文章 :</span>
              <a-input
                v-show="teachContent.title"
                v-model="teachContent.title"
                disabled
                class="span-item-value"
                style="display: inline-block; margin-right: 20px; width: 200px"
                readOnly
                allow-clear
                placeholder="请选择宣教文章 "
              />
              <a-button type="primary" style="margin-left: 8px" @click="selectTeachBtn">
                选择
              </a-button>
            </div>
          </div>

          <div class="div-line-wrap">
            <div class="div-total-one">
              <span class="span-item-name" style="position: relative; top: -43px"
                >留言消息 :</span
              >
              <!-- readOnly -->
              <a-textarea
                v-model="checkData.message"
                :maxLength="200"
                :disabled="checkData.useTo == 1 || checkData.useTo == 2"
                class="span-item-value"
                style="
                  height: 65px !important;
                  width: 695px !important;
                  display: inline-block;
                "
                allow-clear
                placeholder="请输入留言消息 "
              />
            </div>
          </div>

          <div class="div-line-wrap" v-if="checkData.useTo == 3">
            <div class="div-left">
              <span class="span-item-name" style="text-align: right">跳转类型 :</span>
              <a-select
                @select="onSelectJump"
                v-model="radioTyPe"
                placeholder="请选择跳转内容"
                allow-clear
              >
                <a-select-option
                  v-for="item in selectList"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>

            <div class="div-left" style="padding-left: 20px">
              <div
                v-show="radioTyPe == 4"
                style="display: flex; flex-direction: row; align-items: center"
              >
                <span class="span-item-name">外部链接 :</span>
                <a-input
                  v-model="checkData.navigatorContent"
                  class="span-item-value"
                  style="display: inline-block"
                  allow-clear
                  type="text"
                  :maxLength="300"
                  placeholder="请输入外部链接 "
                />
              </div>

              <div
                style="display: flex; flex-direction: row; align-items: center"
                v-if="radioTyPe == 6"
              >
                <span class="span-item-name" style="text-align: right">APPID :</span>
                <a-input
                  v-model="thirdAppid"
                  class="span-item-value"
                  style="display: inline-block; width: 100px"
                  allow-clear
                  type="text"
                  :maxLength="30"
                  placeholder="请输入 "
                />
                <a-input
                  v-model="thirdLink"
                  class="span-item-value"
                  style="display: inline-block; width: 188px; margin-left: 10px"
                  allow-clear
                  type="text"
                  :maxLength="300"
                  placeholder="请输入 "
                />
              </div>
            </div>
          </div>
        </div>

        <add-question ref="addQuestion" @ok="handleQuestion" />
        <add-teach ref="addTeach" @ok="handleTeach" />
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  getTemplateWxMsg,
  getWxConfigureList,
  qryMetaConfigureDetail,
  addWxTemplate,
  getWxTemplateById,
  modifyWxTemplate,
  getBycode,
  addWxTemplateNew,
  modifyWxTemplateNew,
} from "@/api/modular/system/posManage";
import addQuestion from "../package/addQuestion";
import addTeach from "../package/addTeach";
import Vue from "vue";
export default {
  components: { addQuestion, addTeach },
  data() {
    return {
      bingliTitle: "",
      synCasetype: undefined,
      caseList: [],
      visible: false,
      confirmLoading: false,
      key: "",
      id: "", //业务模板详情ID 修改时才有值
      templateBean: "", //业务模板详情
      // 高级搜索 展开/关闭
      advanced: false,
      radioTyPe: 0,
      checkData: {
        wxConfigureId: "", //公众号配置ID
        wxAppId: "", //公众号ID
        // templateId: "", //模板ID
        // templateTitle: "", //模板標題
        navigatorType: "", //跳转类型
        navigatorContent: "", //跳转内容
        useTo: 1, //用途
        message: "", //留言消息
        syncRemind: 1, // 是否同步提醒 1是 2否
      },
      templateContent: {
        templateId: "",
        title: "",
        primaryIndustry: "",
        deputyIndustry: "",
        content: "",
        example: "",
      },
      questionContent: { name: "" },
      teachContent: { title: "" },
      thirdAppid: "", //第三方appid
      thirdLink: "", //第三方链接
      isAgain: true,
      // 1:问卷2:宣教3:不跳转4:外网地址5小程序病历页6第三方小程序
      myJumpYype: 1,

      wxgzhData: [], //公众号列表
      templateData: [], //模板列表
      zdsxData: ["档案字段", "自定义传参"], //字段属性
      fieldList: [], //微信字段列表
      dananfieldList: [], //微信字段列表
      danandataList: [], //档案日期字段列表
      navigateListData: [],
      // 1问卷收集 2健康宣教 3消息提醒
      //微信只有问卷搜集
      useDatas: [
        { code: 1, value: "问卷收集" },
        { code: 2, value: "健康宣教" },
        { code: 3, value: "消息提醒" },
      ],
      // radioType  jumpType 1:问卷2:宣教3:不跳转4:外网地址5小程序病历页6第三方小程序
      selectList: [
        { code: 6, value: "小程序" },
        { code: 4, value: "外部网站" },
        { code: 3, value: "不跳转" },
        // { code: 3, value: "跳转外网地址" },
        // { code: 4, value: "最新病历" },
        // { code: 5, value: "第三方小程序" },
      ],
    };
  },
  methods: {
    goAgin() {
      // 随访名单更新时需重新匹配：0不匹配1匹配
      this.isAgain = !this.isAgain;
    },

    clearData() {
      (this.synCasetype = undefined), (this.id = "");
      (this.bingliTitle = ""), (this.wxgzhData = []);
      this.checkData = {
        smsConfigureId: "", //短信平台配置ID
        id: "", //短信平台ID
        supplierName: "", //短信平台名称
        templateId: "", //模板ID
        smsTemplateTitle: "", //模板标题
        templateTitle: "", //模板输入标题
        navigatorType: "", //跳转类型
        navigatorContent: "", //跳转内容
        useTo: 1,
        message: "", //留言消息
        syncRemind: 1, // 是否同步提醒 1是 2否
      };
      (this.templateContent = {
        smsConfigureId: "",
        smsTemplateCode: "",
        smsTemplateTitle: "",
        smsTemplateContent: "",
      }),
        (this.fieldList = []);
      this.radioTyPe = 6;
      this.questionContent = { name: "" };
      this.teachContent = { title: "" };
      this.thirdLink = "";
      this.thirdAppid = "";
    },

    onModelFocus() {
      if (!this.checkData.wxAppId) {
        this.$message.warn("请先选择公众号");
        return;
      }
    },

    getBycodeOut() {
      var request = {
        code: "CASE_DATA_TYPE",
      };
      getBycode(request).then((res) => {
        if (res.code == 0) {
          this.caseList = res.data;
        }
      });
    },

    selectContent(code) {
      const target = this.caseList.find((item) => code === item.code);
      if (target) {
        this.bingliTitle = target.value;
      }
      // console.log("HHHHHH:",target)
    },

    //新增
    addModel() {
      this.clearData();
      this.visible = true;
      this.confirmLoading = false;

      if (this.checkData.useTo == 1) {
        this.checkData.message = "请完成今日下发任务：问卷填写";
      } else if (this.checkData.useTo == 2) {
        this.checkData.message = "请完成今日下发任务：健康宣教文章阅读";
      } else {
        this.checkData.message = "";
      }

      //获取公众号列表
      getWxConfigureList({}).then((res) => {
        if (res.code == 0) {
          this.wxgzhData = res.data;
          // this.wxgzhData.shift()  去重的测试数据，因测试环境后台有重复数据
          //默认值需求  默认公众号
          let cacheId = Vue.ls.get("cache_wxAppId");
          let getOne = this.wxgzhData.find((item) => item.wxAppId == cacheId);
          if (cacheId && getOne) {
            this.checkData.wxAppId = cacheId;
            this.onWXProgramChange(this.checkData.wxAppId);
          }
          // this.checkData.wxAppId = this.wxgzhData[0].wxAppId
        }
      });

      //获取档案字段列表
      qryMetaConfigureDetail({ databaseTableName: "tb_patient_baseinfo" }).then((res) => {
        if (res.code == 0) {
          this.dananfieldList = res.data[0].detail;

          //如果是日期类的 需要限制
          var dataList = [];
          this.dananfieldList.forEach((item) => {
            if (item.fieldType.value == 2) {
              dataList.push(item);
            }
          });
          this.danandataList = dataList;
        }
      });

      this.getBycodeOut();
    },
    //修改  详情
    checkModel(id) {
      this.clearData();
      this.visible = true;
      this.id = id;
      this.confirmLoading = true;
      this.getBycodeOut();
      //获取公众号列表
      getWxConfigureList({}).then((res) => {
        if (res.code == 0) {
          this.wxgzhData = res.data;
          //查询详情

          getWxTemplateById(this.id).then((res) => {
            if (res.code == 0) {
              this.checkData = res.data;
              this.templateContent.templateId = res.data.templateId;
              this.templateContent.content = res.data.templateContent;
              this.templateContent.title = res.data.templateName;

              var thisWXData = [];
              this.wxgzhData.forEach((item) => {
                if (item.wxAppId === res.data.wxAppId) {
                  thisWXData.push(item);
                }
              });
              this.wxgzhData = thisWXData;
              console.log("HAHAHA:", res.data.jumpType);

              this.isAgain = this.checkData.syncRemind == 1 ? true : false;

              if (this.checkData.useTo == 1) {
                this.checkData.message = "请完成今日下发任务：问卷填写";
              } else if (this.checkData.useTo == 2) {
                this.checkData.message = "请完成今日下发任务：健康宣教文章阅读";
              } else {
                this.checkData.message = "";
              }

              // radioType  jumpType 1:问卷2:宣教3:不跳转4:外网地址5小程序病历页6第三方小程序
              //useTo 1问卷收集 2健康宣教 3消息提醒
              if (this.checkData.useTo == 1) {
                this.questionContent.questUrl = res.data.jumpValue;
                this.questionContent.name = res.data.jumpTitle;
                this.questionContent.id = res.data.jumpId;
              } else if (this.checkData.useTo == 2) {
                this.teachContent.articleId = res.data.jumpId;
                this.teachContent.title = res.data.jumpTitle;
              } else if (this.checkData.useTo == 3) {
                this.radioTyPe = res.data.jumpType;
                if (this.radioTyPe == 4) {
                  this.$set(this.checkData, "navigatorContent", res.data.jumpValue);
                } else if (this.radioTyPe == 6) {
                  //第三方小程序地址

                  this.thirdAppid = res.data.jumpId;
                  this.thirdLink = res.data.jumpValue;
                }
              }

              this.fieldList = JSON.parse(res.data.templateParamJson);

              this.onWXProgramChange(res.data.wxAppId);
            } else {
              this.$message.error(res.message);
            }
            this.confirmLoading = false;
          });
        }
      });

      //获取档案字段列表
      qryMetaConfigureDetail({ databaseTableName: "tb_patient_baseinfo" }).then((res) => {
        if (res.code == 0) {
          this.dananfieldList = res.data[0].detail;

          //如果是日期类的 需要限制
          var dataList = [];
          this.dananfieldList.forEach((item) => {
            if (item.fieldType.value == 2) {
              dataList.push(item);
            }
          });
          this.danandataList = dataList;
        }
      });
    },

    handleChange(code) {},

    onSelectAppId(wxAppId) {
      debugger;
      console.log("oooooooooo cache set wxAppId", wxAppId);
      Vue.ls.set("cache_wxAppId", wxAppId);
    },

    // 1问卷收集 2健康宣教 3消息提醒
    onSelectUse(code) {
      if (code == 1) {
        this.checkData.message = "请完成今日下发任务：问卷填写";
      } else if (code == 2) {
        this.checkData.message = "请完成今日下发任务：健康宣教文章阅读";
      } else {
        this.checkData.message = "";
      }
      console.log("onSelectUse", code);
      // if (code == 1) {

      //   this.radioTyPe =
      // }
    },

    onSelectJump(code) {
      if (code == 3) {
        this.myJumpYype = 3;
      }
    },

    onSelectTemplateId(templateId) {
      console.log("oooooooooo cache set templateId", templateId);
      Vue.ls.set("cache_templateId", templateId);
    },

    //选择公众号
    onWXProgramChange(value) {
      console.log(value);
      this.wxgzhData.forEach((item) => {
        if (item.wxAppId === value) {
          this.checkData.wxConfigureId = item.id;
        }
      });
      // this.getTemplateWxMsg(value, "");
    },

    selectQestionBtn() {
      this.$refs.addQuestion.add(0);
    },
    selectTeachBtn() {
      this.$refs.addTeach.add(0, undefined);
    },
    handleQuestion(index, record) {
      console.log(record);
      this.questionContent = record;
    },

    handleTeach(index, record) {
      console.log(record);
      this.teachContent = record;
    },
    //读取模板信息
    // readTemplateInfoBtn() {},
    goConfirm() {
      console.log(this.checkData);
      if (!this.checkData.wxAppId) {
        this.$message.error("请选择微信公众号");
        return;
      }
      // if (!this.checkData.templateId) {
      //   this.$message.error("请选择模板ID");
      //   return;
      // }
      if (!this.checkData.templateTitle) {
        this.$message.error("请输入模板标题");
        return;
      }

      if (!this.checkData.useTo) {
        this.$message.error("请选择用途");
        return;
      }
      if (!this.checkData.message) {
        this.$message.error("请输入留言消息");
        return;
      }

      // for (var i = 0; i < this.fieldList.length; i++) {
      //   if (!this.fieldList[i].content) {
      //     this.$message.error("模板参数" + this.fieldList[i].name + "为空");
      //     return;
      //   }
      // }

      var jumpValue = "";
      var jumpTitle = "";
      var jumpId = "";

      //1问卷收集 2健康宣教 3消息提醒
      if (this.checkData.useTo == 1) {
        if (!this.questionContent.questUrl) {
          this.$message.error("请选择问卷");
          return;
        }
        jumpValue = this.questionContent.questUrl;
        jumpTitle = this.questionContent.name;
        jumpId = this.questionContent.id;

        // 1:问卷2:宣教3:不跳转4:外网地址5小程序病历页6第三方小程序
        this.myJumpYype = 1;
      } else if (this.checkData.useTo == 2) {
        if (!this.teachContent.articleId) {
          this.$message.error("请选择宣教文章");
          return;
        }
        jumpValue = this.teachContent.articleId;
        jumpTitle = this.teachContent.title;
        jumpId = this.teachContent.articleId;

        this.myJumpYype = 2;
      } else if (this.checkData.useTo == 3) {
        if (this.radioTyPe == -1) {
          this.$message.error("请选择跳转类型");
          return;
        } else if (this.radioTyPe == 6) {
          if (!this.thirdAppid) {
            this.$message.error("请输入APPID");
            return;
          }
          if (!this.thirdLink) {
            this.$message.error("请输入第三方跳转地址");
            return;
          }
          jumpId = this.thirdAppid;
          jumpValue = this.thirdLink;

          this.myJumpYype = 6;
        } else if (this.radioTyPe == 4) {
          if (!this.checkData.navigatorContent) {
            this.$message.error("请输入第三方链接");
            return;
          }

          jumpValue = this.checkData.navigatorContent;
          jumpTitle = this.checkData.navigatorContent;
          this.myJumpYype = 4;
        }
      }

      // syncRemind 是否同步提醒 1是 2否
      this.checkData.syncRemind = this.isAgain ? 1 : 2;

      console.log("ffff:", jumpTitle);

      var postData = {
        wxAppId: this.checkData.wxAppId,
        wxConfigureId: this.checkData.wxConfigureId,
        templateId: this.checkData.templateId,
        message: this.checkData.message,
        useTo: this.checkData.useTo,
        syncRemind: this.checkData.syncRemind,
        templateStatus: 1,
        templateTitle: this.checkData.templateTitle,
        // templateContent: this.templateContent.content,
        // templateName: this.templateContent.title,
        //jumpType 1:问卷2:宣教3:不跳转4:外网地址5小程序病历页6第三方小程序
        jumpType: this.myJumpYype,
        jumpValue: jumpValue,
        jumpTitle: jumpTitle,
        jumpId: jumpId,
        // templateParamJson: JSON.stringify(this.fieldList),
      };
      this.confirmLoading = true;
      if (this.id) {
        //修改
        postData.id = this.id;
        this.modify(postData);
      } else {
        //新增
        this.add(postData);
        //缓存需求   缓存模版内容与模版id需要一致
        let data = { templateId: this.checkData.templateId, fieldList: this.fieldList };
        Vue.ls.set("cache_fieldList", data);
        console.log("oooooooooo cache set fieldLis", data);
      }
    },

    add(postData) {
      addWxTemplateNew(postData).then((res) => {
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
    modify(postData) {
      modifyWxTemplateNew(postData).then((res) => {
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

    handleStatus(record) {
      record.activeFlag = record.activeFlag == 1 || record.activeFlag == null ? 0 : 1;
      changeStatus(record)
        .then((res) => {
          if (res.success) {
            this.$message.success("切换成功");
            this.$refs.table.refresh();
          } else {
            this.$message.error("切换失败：" + res.message);
          }
        })
        .catch((err) => {
          this.$message.error("切换错误：" + err.message);
        });
    },

    onChange() {},

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    handleSubmit() {
      this.goConfirm();
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ant-input-disabled {
  color: #1a1a1a !important;
}
</style>
<style lang="less">
.ant-select-dropdown {
  z-index: 20000;
}

/deep/ .ant-select-dropdown {
  width: 300px !important;
}
/deep/ .global-search {
  width: 300px !important;
}

.btn-check {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
}

.div-check3 {
  // background-color: white;
  // padding: 0 5% 0 5%;
  // padding: 0 15%;

  .top-btn {
    margin-left: 47%;
    float: right;
    margin-top: 20px;
  }

  .div-divider {
    margin-top: 3%;
    margin-left: 10%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }
  .div-part {
    width: 100%;
    height: 100%;
    margin-top: 10px;
    // border-bottom: 1px solid #e6e6e6;
    // background-color: white;
    // overflow: hidden;
    // padding: 1.5%;

    .p-part-title {
      margin-top: 20px;
      height: 18px;
      font-size: 18px;
      text-align: center;
      color: #000;
      font-weight: bold;
    }

    .ant-calendar-picker {
      margin-left: 3.5%;
    }

    .div-line-wrap {
      width: 100%;
      overflow: hidden;
      margin-bottom: 20px;

      .div-left {
        float: left;
        width: 50%;

        overflow: hidden;

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 12px;
          text-align: left;
          margin-right: 10px;
          width: 55px;
        }
        .span-item-value {
          width: 295px;
          color: #333;
          text-align: left;
          font-size: 12px;
          display: inline-block;
        }
        .ant-select {
          width: 295px !important;
        }
      }

      .div-total-one {
        overflow: hidden;
        width: 100%;

        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: left;
          font-size: 12px;
          margin-right: 10px;
          width: 55px;
        }
        .span-item-value {
          width: 22.5%;
          color: #333;
          font-size: 12px;
          padding-left: 0px;
          text-align: left;
          display: inline-block;
        }

        .ant-select {
          width: 20% !important;
          margin-left: 0% !important;
        }
        .ant-radio-wrapper {
          font-size: 12px;
        }
        .ant-radio {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
