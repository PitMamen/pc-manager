<template>
  <a-modal
    :title="title"
    :width="700"
    :height="450"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <div class="div-service-user">
      <!-- 左边 -->
      <div class="div-totalleft" style="margin-top: -20px">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">基础信息</span>
        </div>
        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 5px">
            <span style="color: red">*</span> 上级机构:</span
          >
          <a-select
            class="sitemore"
            style="min-width: 200px; height: 28px; margin-left: 5px; margin-top: 5px"
            :maxTagCount="1"
            allow-clear
            v-model="shoudata"
            placeholder="请选择机构类型"
            @select="onSelect"
          >
            <a-select-option
              v-for="(item, index) in ParentList"
              :value="item.hospitalId"
              :key="index"
              >{{ item.hospitalName }}</a-select-option
            >
          </a-select>
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px">
            <span style="color: red">*</span> 机构代码:</span
          >
          <a-input
            type="number"
            v-model="queryParams.hospitalCode"
            allow-clear
            placeholder="请输入内容"
            disabled
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 7px">
            <span style="color: red">*</span> 机构名称:</span
          >
          <a-input
            v-model="queryParams.hospitalName"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span> <span style="color: red">*</span> 显示顺序:</span>
          <a-button
            style="margin-left: 5px; width: 30px"
            icon="plus"
            size="small"
            @click="addNum()"
          />
          <!-- <a-icon type="plus" /> -->
          <a-input
            v-model="queryParams.sortedNo"
            :defaultValue="1"
            allow-clear
            style="width: 127px; margin-left: 7px; text-align: center"
          />
          <a-button
            style="margin-left: 7px; width: 30px"
            size="small"
            icon="minus"
            @click="duleNum()"
          />
        </div>

        <!-- <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 机构类型:</span>

          <a-radio-group
            name="radioGroup"
            v-model="queryParams.orgType"
            @change="radioChange"
            defaultValue="2"
            v-decorator="['roleId', { rules: [{ required: true, message: '请选择机构类型！' }] }]"
          >
            <a-radio :value="1" style="font-size: 8px; margin-left: 10px; margin-top: 10px"> 管理机构 </a-radio>
            <a-radio :value="2" style="font-size: 8px; margin-top: 10px"> 医疗机构 </a-radio>
          </a-radio-group>
        </div> -->

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 5px">
            <span style="color: red">*</span> 组织类型:</span
          >
          <a-select
            class="sitemore"
            style="min-width: 200px; height: 28px; margin-left: 5px; margin-top: 5px"
            :title="queryParams.orgType"
            :maxTagCount="1"
            allow-clear
            v-model="queryParams.orgType"
            placeholder="请选择组织类型"
          >
            <a-select-option
              v-for="item in orgTypeData"
              :value="item.code"
              :key="item.code"
              >{{ item.value }}</a-select-option
            >
          </a-select>
        </div>

        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">医疗机构属性</span>
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px">
            <span style="color: red">*</span> 机构类型:</span
          >
          <a-select
            :disabled="!queryParams.orgType || queryParams.orgType != 2"
            class="sitemore"
            style="min-width: 200px; height: 28px; margin-left: 5px; margin-top: 5px"
            :maxTagCount="1"
            allow-clear
            v-model="hospitalTypeSelect"
            placeholder="请选择机构类型"
            @select="selectTyple"
          >
            <a-select-option
              v-for="(item, index) in HospitalTypeList"
              :value="item.value"
              :key="index"
              >{{ item.description }}</a-select-option
            >
          </a-select>
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px">
            <span style="color: red">*</span> 机构等级:</span
          >
          <a-select
            :disabled="!queryParams.orgType || queryParams.orgType != 2"
            class="sitemore"
            style="min-width: 200px; height: 28px; margin-left: 5px; margin-top: 5px"
            :maxTagCount="1"
            allow-clear
            v-model="Hospitallevel"
            placeholder="请选择机构等级"
            @select="selectLevel"
          >
            <a-select-option
              v-for="(item, index) in HospitalLevelList"
              :value="item.value"
              :key="index"
              >{{ item.description }}</a-select-option
            >
          </a-select>
        </div>

        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">接口配置</span>
        </div>

        <div class="display-item" style="margin-left: 12px; margin-top: 10px">
          <span style="margin-top: 10px; margin-left: -5px">
            <span style="color: red">*</span> 监管分类:</span
          >
          <a-tree-select
            v-model="queryParams.institutionClassify"
            :disabled="!queryParams.orgType || queryParams.orgType != 2"
            style="min-width: 200px; height: 28px; margin-left: 5px; margin-top: 5px"
            :tree-data="classifyTreeData"
            placeholder="请选择监管机构分类"
            allow-clear
            show-search
            tree-node-filter-prop="title"
            @change="onDepartmentSelectChange"
            @search="onDepartmentSelectSearch"
          >
          </a-tree-select>
        </div>

        <div class="display-item" style="margin-left: 12px; margin-top: 10px">
          <span style="margin-top: 10px; margin-left: -5px">
            <span style="color: red">*</span> 监管代码:</span
          >
          <a-input
            :disabled="!queryParams.orgType || queryParams.orgType != 2"
            v-model="queryParams.supervisionHosCode"
            allow-clear
            placeholder="请输入监管机构代码"
            style="width: 200px; margin-top: 5px; margin-left: 7px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 12px; margin-top: 10px">
          <span style="margin-top: 10px">
            <span style="color: red">*</span> HIS编码:
          </span>
          <a-input
            type="number"
            :disabled="!queryParams.orgType || queryParams.orgType != 2"
            v-model="queryParams.hisCode"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 7px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 12px; margin-top: 10px">
          <span style="margin-top: 10px; margin-left: -5px">
            <span style="color: red">*</span> 服务地址:</span
          >
          <a-input
            :disabled="!queryParams.orgType || queryParams.orgType != 2"
            v-model="queryParams.middleware"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 7px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>
      </div>

      <!-- ri -->
      <div class="card-right-user" style="height: 570px">
        <div class="div-title" style="margin-left: 10px; margin-top: 3px">
          <div class="div-line-blue"></div>
          <span class="span-title">区块链注册</span>
        </div>

        <div class="div-qu-kuai">
          <div style="color: #999; font-size: 12px">
            说明：医疗机构在区块链注册后可授权其他机构访问本院患者病例
          </div>
          <div class="div-oper">
            <div style="color: #1a1a1a; font-weight: bold; width: 110px">
              当前状态：{{ blockchainHosId ? "已注册" : "未注册" }}
            </div>
            <div class="div-chain-id" :title="blockchainHosId">
              数字ID：{{ blockchainHosId ? this.blockchainHosId : "暂无" }}
            </div>
            <div style="flex: 1"></div>
            <div v-show="!blockchainHosId" class="btn-kuai" @click="goRegister">注册</div>
          </div>
        </div>

        <div class="div-title" style="margin-left: 10px; margin-top: 13px">
          <div class="div-line-blue"></div>
          <span class="span-title">机构简介</span>
        </div>

        <div class="dddd-r" style="margin-top: 10px; margin-left: 10px">
          <a-upload
            style="width: 40%; height: 30px"
            :action="actionUrlCover"
            :multiple="true"
            :file-list="fileList"
            list-type="picture-card"
            :headers="headers"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>

          <div class="domw-r">
            <!-- <a-button
                class=""
                icon="vertical-align-top"
                style="margin-left: 5px; margin-top: 20px"
                @click="uploadFile()"
                >上传文件</a-button
              > -->
            <span style="margin-top: 20px">支持扩展名:jpg、jpeg、png、bmp格式</span>
          </div>
        </div>

        <div id="div2" ref="editorEl" style="margin-top: 15%; margin-left: 10px"></div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import moment from "moment";
import {
  save,
  queryHospitalLevel,
  queryHospitalType,
  parent,
  queryHospitaldetail,
  getDictDataForCodeorgType,
  institutionClassify,
  registerBlockchain,
} from "@/api/modular/system/posManage";
import { STable } from "@/components";
import { formatDate, formatDateFull } from "@/utils/util";
import E from "wangeditor";
import { TRUE_USER, ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
import { appId } from "@/utils/util";
// import { nextTick } from 'vue/types/umd'
export default {
  components: {
    STable,
  },
  data() {
    return {
      hospitalTypeSelect: "", //科室类型
      Hospitallevel: "", //科室等级
      shoudata: "",
      blockchainHosId: "",
      bb: "1",
      userId: "",
      timeStr: "",
      originData: [],
      hospitalId: "",
      id: "", //表名ID
      rangeValue: "1",
      previewVisible: false,
      HospitalLevelList: [],
      HospitalTypeList: [],
      ParentList: [],
      classifyTreeData: [],
      record: {},
      queryParams: {
        hisCode: "",
        hospitalCode: "",
        hospitalId: 0,
        hospitalName: "",
        hospitalType: "",
        imgUrl: "",
        introduction: "",
        level: "",
        middleware: "",
        supervisionHosCode: "", //机构代码
        institutionClassify: undefined, //机构分类
        orgType: undefined,
        pid: 0,
        sortedNo: 0,
        tenantId: 0,
      },
      queryClassify: {
        queryText: "",
        ver: "WS 218-2002",
      },
      orgTypeData: [],

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      headers: {
        Authorization: "",
      },
      visible: false,
      confirmLoading: false,
      editor: null,
      form: this.$form.createForm(this),
      title: "修改机构",
      actionUrlCover: "/api/content-api/fileUpload/uploadImgFile",
      fileList: [],
    };
  },

  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN);
  },

  methods: {
    moment,
    //初始化方法
    modify(record) {
      this.visible = true;
      this.reset();
      this.shoudata = record.hospitalName;
      this.queryParams.pid = record.pid;
      this.hospitalId = record.hospitalId;

      this.queryParams.hospitalId = record.hospitalId;
      this.getinstitutionClassify();
      this.getHospitalDetailOut();
      this.getHospitalLevel();
      this.getHospitalType();
      this.getParentList();
      this.getDictDataForCodeorgTypeOut();
    },

    // 获取机构分类列表接口
    getinstitutionClassify() {
      institutionClassify(this.queryClassify).then((res) => {
        if (res.code == 0 && res.data.length > 0) {
          res.data.forEach((item, index) => {
            this.$set(item, "key", item.classify);
            this.$set(item, "value", item.classify);
            this.$set(item, "title", item.name);
            this.$set(item, "children", item.children);

            item.children.forEach((item1, index1) => {
              this.$set(item1, "key", item1.classify);
              this.$set(item1, "value", item1.classify);
              this.$set(item1, "title", item1.name);
              this.$set(item1, "children", item1.children);

              item1.children.forEach((item2, index2) => {
                this.$set(item2, "key", item2.classify);
                this.$set(item2, "value", item2.classify);
                this.$set(item2, "title", item2.name);
              });
            });
          });

          this.classifyTreeData = res.data;
        } else {
          this.classifyTreeData = res.data;
        }
        return [];
      });
    },

    //科室搜索
    onDepartmentSelectSearch(value) {
      this.classifyTreeData = [];
      this.queryClassify.queryText = value;
      console.log("BBB:", this.queryClassify.queryText, value);
      this.getinstitutionClassify(this.queryClassify);
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value === undefined) {
        this.classifyTreeData = [];
        this.getinstitutionClassify(undefined);
      }
    },

    /**
     * 组织类型接口
     */
    getDictDataForCodeorgTypeOut() {
      this.confirmLoading = true;
      getDictDataForCodeorgType()
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.orgTypeData = res.data;
            for (let index = 0; index < this.orgTypeData.length; index++) {
              this.orgTypeData[index].code = Number(this.orgTypeData[index].code);
            }
          } else {
            this.orgTypeData = res.data;
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },

    init(introduction) {
      if (this.editor) {
        this.editor.txt.html(introduction || "");
        return;
      }
      this.editor = new E("#div2");
      this.editor.config.height = 600;
      this.editor.config.pasteFilterStyle = false;
      this.editor.config.onchange = (html) => {
        console.log("editor modify:", html);
        this.queryParams.introduction = html;
      };
      // 默认情况下，显示所有菜单
      this.editor.config.menus = [
        "head",
        "bold",
        "fontSize",
        "fontName",
        "italic",
        "underline",
        "strikeThrough",
        "indent",
        "lineHeight",
        "foreColor",
        "backColor",
        "link",
        "list",
        "todo",
        "justify",
        "quote",
        // 'emoticon',
        "image",
        "video",
        "table",
        "code",
        "splitLine",
        "undo",
        "redo",
      ];

      this.editor.config.uploadImgHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      };
      console.log("Vue.ls.get(ACCESS_TOKEN)", Vue.ls.get(ACCESS_TOKEN));

      // 配置 server 接口地址
      this.editor.config.uploadFileName = "file";
      this.editor.config.uploadImgServer =
        "/api/content-api/fileUpload/uploadImgFileForEdit";
      // this.editor.config.uploadImgServer = '/api/wx-api/health/wx/' + appId + '/uploadInnerImg'
      // this.editor.config.uploadImgServer = '/api/content-api/fileUpload/uploadImgFile'
      // editor.config.showLinkVideo = false

      //教育文章先不支持视频，所以注释
      this.editor.config.uploadVideoName = "file";
      this.editor.config.uploadVideoServer =
        "/api/content-api/fileUpload/uploadVideoFileForEdit";
      this.editor.config.uploadVideoHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      };
      this.editor.create();
      this.editor.txt.html(introduction);
    },

    /**
     * 增加序号
     */
    addNum() {
      this.queryParams.sortedNo++;
    },

    /**
     * 减序号
     */
    duleNum() {
      this.queryParams.sortedNo--;
      if (this.queryParams.sortedNo <= 0) {
        this.queryParams.sortedNo = 0;
      }
    },

    /**
     * 选择
     *
     */
    onSelect(hospitalId, s2) {
      console.log("hospitalId", hospitalId);
      this.queryParams.hospitalId = hospitalId;

      //   this.chooseDeptItem = JSON.parse(JSON.stringify(this.originData.find((item) => item.id == departmentId)))
      //   console.log('chooseDeptItem', this.chooseDeptItem)
      //   this.queryParams.appointItemName = this.chooseDeptItem.name
    },

    /**
     * 选择科室类型
     */
    selectTyple(selectTyple) {
      console.log("科室类型", selectTyple);
      this.queryParams.hospitalType = selectTyple;
    },

    /**
     * 科室等级
     */
    selectLevel(selectLevel) {
      console.log("科室等级", selectLevel);
      this.queryParams.level = selectLevel;
    },

    /**
     * 获取机构详情
     */
    getHospitalDetailOut() {
      queryHospitaldetail({ hospitalId: this.hospitalId })
        .then((res) => {
          if (res.code == 0) {
            // this.queryParams.hospitalId = res.data.pid
            this.queryParams.hospitalCode = res.data.hospitalCode;
            this.queryParams.hospitalName = res.data.hospitalName;
            this.queryParams.sortedNo = res.data.sortedNo;
            this.queryParams.orgType = res.data.orgType.value;
            this.queryParams.hospitalType =
              res.data.hospitalType != null ? res.data.hospitalType.value : "";
            this.queryParams.level = res.data.level != null ? res.data.level.value : "";
            this.queryParams.hisCode = res.data.hisCode;
            this.queryParams.middleware = res.data.middleware;
            this.queryParams.introduction = res.data.introduction;
            this.queryParams.orgType = res.data.orgType.value;
            this.queryParams.institutionClassify = res.data.institutionClassify;
            this.queryParams.supervisionHosCode = res.data.supervisionHosCode;
            if (res.data.hospitalType != null) {
              this.hospitalTypeSelect = res.data.hospitalType.description;
            }
            if (res.data.level != null) {
              this.Hospitallevel = res.data.level.description;
            }
            this.blockchainHosId = res.data.blockchainHosId;

            this.$nextTick(() => {
              this.init(res.data.introduction);
            });
            this.fileList = [];
            this.fileList.push({
              uid: "-1",
              name: "封面",
              status: "done",
              url: res.data.imgUrl,
              // media_id: this.checkData.extraData,
            });
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },

    goRegister() {
      registerBlockchain({ hospitalCode: this.queryParams.hospitalCode })
        .then((res) => {
          if (res.code == 0) {
            this.blockchainHosId = res.data;
          } else {
            this.$message.error(res.message);
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },

    /**
     * 上级机构
     */
    getParentList() {
      parent().then((res) => {
        if (res.code == 0) {
          this.ParentList = res.data;
        }
      });
    },

    /***
     * 机构等级接口
     */
    getHospitalLevel() {
      queryHospitalLevel()
        .then((res) => {
          if (res.code == 0) {
            this.HospitalLevelList = res.data;
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },

    /**
     * 机构类型
     */
    getHospitalType() {
      queryHospitalType()
        .then((res) => {
          if (res.code == 0) {
            this.HospitalTypeList = res.data;
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },

    /**
     * upload commit
     */
    uploadFile() {},

    /**
     *
     * @param
     */

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },

    handleChange(changeObj) {
      if (changeObj.file.status == "done" && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message);
        changeObj.fileList.pop();
        this.fileList = changeObj.fileList;
      } else {
        this.fileList = changeObj.fileList;
      }
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    /***
     * 新增租户接口调用
     */
    addHospital() {
      this.confirmLoading = true;
      save(this.queryParams)
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.visible = false;
            this.$message.success("修改成功");
            this.$emit("ok");
          } else {
            this.$message.error("修改失败:" + res.message);
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },

    formatDateOut(date) {
      date = new Date(date);
      let myyear = date.getFullYear();
      let mymonth = date.getMonth() + 1;
      let myweekday = date.getDate();
      mymonth < 10 ? (mymonth = "0" + mymonth) : mymonth;
      myweekday < 10 ? (myweekday = "0" + myweekday) : myweekday;
      return `${myyear}-${mymonth}-${myweekday}`;
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

    /**
     *   机构选择
     */
    // radioChange(event) {
    //   //立即发送
    //   if (event.target.value == 1) {
    //     this.rangeValue = '1'
    //     this.queryParams.orgType = 1
    //     //延时发送
    //   } else if (event.target.value == 2) {
    //     this.rangeValue = '2'
    //     this.queryParams.orgType = 2
    //   }
    // },

    /**
     * 重置
     */
    reset() {
      this.blockchainHosId = "";
      this.queryParams.hospitalCode = "";
      this.queryParams.hospitalName = "";
      this.queryParams.hospitalId = "";
      this.queryParams.hospitalType = "";
      this.queryParams.imgUrl = "";
      this.queryParams.introduction = "";
      this.queryParams.level = "";
      this.queryParams.middleware = "";
      this.queryParams.orgType = undefined;
      this.queryParams.pid = "";
      this.queryParams.sortedNo = "";
      this.queryParams.tenantId = "";
      (this.queryParams.supervisionHosCode = ""), //机构代码
        (this.queryParams.institutionClassify = undefined); //机构分类
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false;
      this.previewVisible = false;
    },

    /**
     * 提交
     */
    handleSubmit() {
      if (this.queryParams.hospitalId === "") {
        this.$message.error("请选择上级机构");
        return;
      }

      if (!this.queryParams.hospitalCode) {
        this.$message.error("请输入机构代码");
        return;
      }
      if (!this.queryParams.hospitalName) {
        this.$message.error("请输入机构名称");
        return;
      }
      if (!this.queryParams.orgType) {
        this.$message.error("请选择机构类型");
        return;
      }

      if (this.queryParams.orgType == 2) {
        if (!this.queryParams.hospitalType) {
          this.$message.error("请选择机构类型");
          return;
        }
        if (!this.queryParams.level) {
          this.$message.error("请选择机构等级");
          return;
        }
        if (!this.queryParams.hisCode) {
          this.$message.error("请输入HIS编码");
          return;
        }
        if (!this.queryParams.middleware) {
          this.$message.error("请输入服务地址");
          return;
        }

        if (!this.queryParams.supervisionHosCode) {
          this.$message.error("请输入机构代码");
          return;
        }

        if (!this.queryParams.institutionClassify) {
          this.$message.error("请选择机构分类");
          return;
        }
      } else {
        /**
         * 如果 选中的 组织类型不是 医疗机构  则不传医疗机构属性、接口配置等参数
         */
        this.queryParams.hospitalType = "";
        this.queryParams.level = "";
        this.queryParams.hisCode = "";
        this.queryParams.middleware = "";
        this.queryParams.supervisionHosCode = "";
        this.queryParams.institutionClassify = "";
      }
      if (this.fileList.length > 0 && this.fileList[0].response) {
        this.queryParams.imgUrl = this.fileList[0].response.data.fileLinkUrl;
      } else {
        if (this.fileList && this.fileList[0]) {
          this.queryParams.imgUrl = this.fileList[0].url;
        }
        this.queryParams.imgUrl = "";
      }

      if (this.queryParams.sortedNo < 0) {
        this.$message.error("显示序号不能小于0!");
        return;
      }

      this.addHospital();
    },
  },
};
</script>

<style lang="less">
.ant-select-tree-dropdown {
  max-height: 27vh !important; //60
  top: 540px !important; //148
  left: 637px;
}
</style>

<style lang="less">
.dddd-r {
  display: flex;
  flex-direction: row;

  .domw-r {
    display: flex;
    flex-direction: column;
  }
}

.div-title {
  margin-top: 10px;
  display: flex;
  background-color: #ebebeb;
  flex-direction: row;
  width: 98% !important;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #1890ff;
  }
  .span-title {
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #333;
  }
}
.table-page-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
<style lang="less">
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-total1 {
    height: 100px;
    width: 90%;
    margin-left: 20px;
    margin-right: 60px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-totalleft {
    // height: 100%;
    width: 50%;
    margin-left: 10px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 5px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-totaltopleft {
    height: 40px;
    width: 100%;
    margin-right: 60px;
    margin-top: -20px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    // border-radius: 5px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-totaltop {
    height: 90px;
    width: 90%;
    margin-left: 20px;
    margin-right: 60px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-line-wrap {
    width: 120%;
    overflow: hidden;

    .span-item-name {
      width: 80%;
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: left;
    }

    .span-item-value {
      width: 20%;
      // overflow: hidden;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
      text-overflow: ellipsis;
    }

    .span-item-value1 {
      width: 10%;
      margin-bottom: -4px;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
      white-space: nowrap;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .div-service-left-user {
    background-color: white;
    padding: 2% 3%;
    float: left;
    height: 100%;
    min-height: 300px;
    border-right: 1px dashed #e6e6e6;
    width: 50%;
    overflow: hidden;

    .div-divider {
      width: 100%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .p-part-title {
      height: 18px;
      font-size: 18px;
      text-align: left;
      color: #000;
      font-weight: bold;
    }

    .div-part {
      overflow: hidden;
      width: 100%;
      padding-left: 5%;
      height: 10%;

      .checked {
        color: #1890ff !important;
      }

      .p-name {
        margin-top: 3.5%;
        display: block;
        height: 100%;
        padding-left: 1%;
        color: #000;
        font-size: 14px;
        text-align: left|center;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .display-item {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    // justify-content: center;
    // margin-top: -20px;
  }

  .card-right-user {
    overflow: hidden;
    width: 65% !important;

    .div-qu-kuai {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      margin-left: 10px;

      .div-oper {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .div-chain-id {
          width: 160px;
          margin-left: 15px;
          color: #1a1a1a;
          font-weight: bold;
          overflow: hidden; //溢出隐藏
          text-overflow: ellipsis; //超出省略号显示
          white-space: nowrap; //文字不换行
        }

        .btn-kuai {
          color: #1890ff;
          padding: 1px 15px;
          border: 1px solid #1890ff;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .table-operator {
      margin-bottom: 18px;
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
  }
}
</style>
