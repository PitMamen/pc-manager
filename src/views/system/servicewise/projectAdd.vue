<template>
  <!-- <a-spin :spinning="confirmLoading"> -->
  <div class="div-project-add">
    <div class="div-pro-up">
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">基本信息</span>
      </div>

      <div class="div-up-content">
        <div class="div-pro-line">
          <span class="span-item-name"><span style="color: red">*</span> 方案名称 :</span>
          <a-input
            class="span-item-value"
            v-model="projectData.templateName"
            :maxLength="30"
            style="display: inline-block"
            allow-clear
            placeholder="请输入方案名称 "
          />
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"><span style="color: red">*</span> 随访类型 :</span>
          <a-select v-model="projectData.type" allow-clear placeholder="请选择随访类型">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"><span style="color: red">*</span> 来源名单 :</span>
          <a-select v-model="projectData.type" allow-clear placeholder="请选择来源名单">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="div-up-content">
        <div class="div-pro-line">
          <span class="span-item-name"><span style="color: red">*</span> 执行科室 :</span>
          <a-select v-model="projectData.type" allow-clear placeholder="请选择执行科室">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-pro-line" style="width: 60%">
          <span class="span-item-name"><span style="color: red">*</span> 补充说明 :</span>
          <a-input
            class="span-item-value"
            v-model="projectData.templateName"
            :maxLength="30"
            style="display: inline-block; width: 80%; padding-left: 0.9%"
            allow-clear
            placeholder="请输入补充说明 "
          />
        </div>
      </div>
    </div>

    <div class="div-pro-middle">
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">名单过滤</span>
      </div>

      <div class="div-rules">
        <div class="div-middle-content" v-for="(item, index) in projectData.ruleList" :key="index" :value="item.typeId">
          <!-- <span class="span-item-name"><span style="color: red">*</span> 随访类型 :</span> -->
          <a-select class="mid-select-one" v-model="projectData.type" allow-clear placeholder="请选择字段">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>

          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择字段">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>

          <a-input
            class="span-middle-value"
            v-model="projectData.templateName"
            :maxLength="30"
            style="display: inline-block"
            allow-clear
            placeholder="请输入内容"
          />

          <div style="margin-left: 1%">
            <!-- <a-icon type="delete" theme="filled" style="color: #1890ff" /> -->
            <a-button class="span-add-item" type="primary" @click="delRule()">删除</a-button>
          </div>
        </div>
      </div>

      <a-button style="margin-top: 1%; margin-left: 2%" type="primary" @click="delRule()">新增</a-button>
    </div>

    <div class="div-pro-mission">
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">任务管理</span>
      </div>

      <!-- <div class="div-mission-content"> -->
      <div class="div-mission-content" v-for="(item, index) in projectData.ruleList" :key="index" :value="item.typeId">
        <div class="mission-top">
          <a-select class="mid-select-one" v-model="projectData.type" allow-clear placeholder="请选择字段">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>

          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择字段">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>
          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择字段">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>
          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择字段">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>
          <span class="span-titl" style="margin-left: 1%">后</span>
          <a-input
            v-model="projectData.templateName"
            :maxLength="30"
            style="display: inline-block; margin-left: 1%; width: 200px"
            allow-clear
            placeholder="请输入内容"
          />
          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择字段">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>
          <a-time-picker style="margin-left: 1%" :default-value="moment('12:08', 'HH:mm')" format="HH:mm" />
          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择字段">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
              item.typeName
            }}</a-select-option>
          </a-select>
        </div>

        <!-- 分割线 -->
        <div class="div-divider"></div>

        <div class="mission-bottom">
          <div class="mission-bottom-left">
            <span class="span-titl" style="margin-left: 1%">人员分配方案</span>
            <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择字段">
              <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.typeId">{{
                item.typeName
              }}</a-select-option>
            </a-select>
            <span class="span-titl" style="margin-left: 1%">电话跟进</span>
            <span class="span-titl" style="margin-left: 1%">执行人员:</span>
            <a-button class="span-add-item" type="primary" style="margin-left: 1%" @click="delRule()"
              >添加人员</a-button
            >
          </div>

          <a-button style="margin-left: 2%" type="primary" @click="delRule()">刪除任务</a-button>
        </div>
      </div>

      <a-button style="margin-top: 1%; margin-left: 2%" type="primary" @click="delRule()">新增任务</a-button>
    </div>

    <div style="margin-top:3%;margin-bottom:2%;margin-right: 15%;">
      <a-button style="margin-left: 2%; float: right" type="primary" @click="delRule()">取消</a-button>
      <a-button style="margin-left: 2%; float: right" type="primary" @click="delRule()">提交</a-button>
    </div>

    <!-- <add-cha ref="addJianCha" @ok="handleJianCha" /> -->
  </div>
  <!-- </a-spin> -->
</template>

<script>
import { getDepts } from '@/api/modular/system/posManage'
import moment from 'moment'
// import addCha from './addJianCha'

export default {
  components: {
    // addCha,
  },

  data() {
    return {
      projectData: { ruleList: [{}, {}, {}] },
      typeData: [
        { typeId: 1, typeName: '关怀型随访' },
        { typeId: 2, typeName: '慰问型随访' },
      ],
      confirmLoading: false,
    }
  },

  created() {
    getDepts().then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    moment,

    saveProject() {},
    delRule() {},
  },
}
</script>

<style lang="less">
.div-project-add {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1%;
  padding-bottom: 2%;

  .div-title {
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 100%;
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
      font-size: 14px;
      margin-left: 10px;
      font-weight: bold;
      color: #333;
    }
  }

  .div-pro-line {
    width: 30%;
    margin-top: 1%;
    overflow: hidden;

    .ant-select {
      width: 38% !important;
      margin-left: 1.5% !important;
    }

    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 38%;
      color: #333;
      text-align: left;
      padding-left: 1.5%;
      font-size: 14px;
      display: inline-block;
    }

    // global-search ant-select ant-select-combobox
    .global-search.ant-select {
      width: 90% !important;
    }
  }

  .div-pro-up {
    width: 100%;

    .div-up-content {
      width: 100%;
      display: flex;
      flex-direction: row;
    }
  }

  .div-pro-middle {
    margin-top: 2%;

    .div-rules {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;

      .div-middle-content {
        margin-right: 2%;
        width: 40%;
        display: flex;
        margin-top: 1%;
        flex-direction: row;
        align-items: center;

        .mid-select-one.ant-select {
          width: 30% !important;
          margin-left: 1% !important;
        }
        .mid-select-two.ant-select {
          width: 20% !important;
          margin-left: 1% !important;
        }

        .span-middle-value {
          margin-left: 1%;
          width: 50%;
        }
      }
    }
  }
  .div-pro-mission {
    margin-top: 1%;

    .div-mission-content {
      border-radius: 6px;
      margin-top: 1%;
      border: 1px solid #e6e6e6;
      width: 100%;

      .mission-top {
        margin-top: 1%;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .mid-select-one.ant-select {
          width: 12% !important;
          margin-left: 1% !important;
        }
        .mid-select-two.ant-select {
          width: 10% !important;
          margin-left: 1% !important;
        }
      }

      .div-divider {
        margin: 1% 0% 0% 1%;
        width: 98%;
        background-color: #e6e6e6;
        height: 1px;
      }

      .mission-bottom {
        margin-top: 1%;
        margin-bottom: 1%;
        width: 95%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .mission-bottom-left {
          width: 100%;
          display: flex;
          flex: 1;
          flex-direction: row;
          align-items: center;

          .mid-select-one.ant-select {
            width: 12% !important;
            margin-left: 1% !important;
          }
          .mid-select-two.ant-select {
            width: 10% !important;
            margin-left: 1% !important;
          }
        }
      }
    }
  }
}
</style>
