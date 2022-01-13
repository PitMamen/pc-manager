<template>
  <div class="div-new-plan">
    <p class="p-title">新增计划</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 计划名称 :</span>
      <a-input
        v-model="planData.name"
        class="span-item-value"
        style="display: inline-block"
        allow-clear
        placeholder="请输入计划名称 "
      />
    </div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 所属科室 :</span>
      <a-select v-model="planData.keshi" allow-clear placeholder="请选择入所属科室">
        <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.code">{{
          item.value
        }}</a-select-option>
      </a-select>

      <span class="span-item-name" style="margin-left: 3%"><span style="color: red">*</span> 所属专病 :</span>
      <a-select v-model="planData.disease" allow-clear placeholder="请选择所属专病">
        <a-select-option v-for="(item, index) in diseaseData" :key="index" :value="item.code">{{
          item.value
        }}</a-select-option>
      </a-select>
    </div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 计划内容 :</span>
    </div>

    <!-- 计划内容 -->
    <div class="div-health-plan">
      <div class="div-plan-item" v-for="(item, index) in planData.missions" :key="index">
        <span class="span-item-name"><span style="color: red">*</span> 计划时间 :</span>
        <a-select v-model="planData.timeCount" allow-clear placeholder="请选择计划时间">
          <a-select-option v-for="(itemCount, indexCount) in timeCountData" :key="indexCount" :value="itemCount.code">{{
            itemCount.value
          }}</a-select-option>
        </a-select>

        <a-select v-model="planData.timeUnit" allow-clear placeholder="">
          <a-select-option
            v-for="(itemTimeUnit, timeUnitIndex) in timeUnitData"
            :key="timeUnitIndex"
            :value="itemTimeUnit.code"
            >{{ itemTimeUnit.value }}</a-select-option
          >
        </a-select>
        <span class="span-des">后</span>

        <div class="div-top-right">
          <a-button class="span-add-item" type="primary" @click="deletePlanItem(index)">删除任务</a-button>
          <!-- <div class="div-vertical"></div> -->
          <a-button class="span-add-item" @click="$refs.addForm.add(index)" type="primary">添加子计划</a-button>
        </div>

        <!-- 分割线 -->
        <div class="div-divider"></div>

        <div
          class="div-plan-item-elements"
          v-for="(itemChild, indexChild) in planData.missions[index].items"
          :key="indexChild"
        >
          <div class="div-element">
            <div class="div-content">
              <span class="span-item-name"> 计划类型 :</span>
              <span class="span-item-name" style="margin-left: 3%"> {{ itemChild.type }}</span>
            </div>

            <div class="div-content">
              <!-- //style="margin-left: 3%" -->
              <span class="span-item-name"> 具体内容 :</span>
              <span class="span-item-name" style="margin-left: 3%"> {{ itemChild.name }}</span>
            </div>

            <a-icon class="icon-delete" @click="deleteElement(index, indexChild)" title="删除任务项目" type="close" />

            <div class="div-divider-elements"></div>
          </div>
        </div>
      </div>
    </div>

    <a-button class="btn-add-plan" @click="addPlanItem" type="primary">添加具体计划</a-button>
    <add-form ref="addForm" @ok="handleOk" />
    <add-teach ref="addTeach" @ok="handleTeach" />
    <add-question ref="addQuestion" @ok="handleQuestion" />
    <add-remind ref="addRemind" @ok="handleRemind" />
    <add-cha ref="addJianCha" @ok="handleJianCha" />
    <add-yan ref="addJianYan" @ok="handleJianYan" />
  </div>
</template>

<script>
import { getKeShiData, getDoctors, changeStatus } from '@/api/modular/system/posManage'
import addForm from './addForm'
import addTeach from './addTeach'
import addCha from './addJianCha'
import addYan from './addJianYan'
import addQuestion from './addQuestion'
import addRemind from './addRemind'

export default {
  components: {
    addForm,
    addTeach,
    addCha,
    addYan,
    addQuestion,
    addRemind,
  },

  data() {
    return {
      planData: {
        name: '',
        timeCount: '1',
        timeUnit: '天',
        missions: [
          {
            name: '第一个任务',
            items: [
              { name: '心电图', type: '检查' },
              { name: '血常规', type: '检验' },
            ],
          },
        ],
      },
      loading: false,
      timeCountData: [
        {
          code: '1',
          value: '1',
        },
        {
          code: '2',
          value: '2',
        },
        {
          code: '3',
          value: '3',
        },
      ],
      timeUnitData: [
        {
          code: '1',
          value: '天',
        },
        {
          code: '2',
          value: '周',
        },
        {
          code: '3',
          value: '月',
        },
      ],
      keshiData: [
        {
          code: '1',
          value: '儿科',
        },
        {
          code: '2',
          value: '脑科',
        },
        {
          code: '3',
          value: '耳鼻喉科',
        },
        {
          code: '4',
          value: '内科',
        },
        {
          code: '5',
          value: '外科',
        },
        {
          code: '6',
          value: '精神科',
        },
      ],
      diseaseData: [
        { code: 1, value: '心脏病' },
        { code: 2, value: '糖尿病' },
        { code: 3, value: '高血压' },
      ],
    }
  },

  created() {},

  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    addPlanItem() {
      this.planData.missions.push({
        name: '第二个任务',
        items: [
          { name: 'B超', type: '检查' },
          { name: '尿常规', type: '检验' },
        ],
      })
    },
    deletePlanItem(index) {
      this.planData.missions.splice(index, 1)
    },

    addElement(index) {
      this.$refs.addForm.add(index)
    },

    deleteElement(index, indexChild) {
      this.planData.missions[index].items.splice(indexChild, 1)
    },

    handleOk(index, value) {
      // console.log('ddd', index + '---' + value)
      //选择类型后，添加条目
      switch (value) {
        case '1':
          this.$refs.addTeach.add(index)
          break
        case '2':
          this.$refs.addQuestion.add(index)
          break
        case '3':
          this.$refs.addRemind.add(index)
          break
        case '4':
          this.$refs.addJianCha.add(index)
          break
        case '5':
          this.$refs.addJianYan.add(index)
          break
      }
    },

    handleTeach(record) {
      debugger
    },

    handleQuestion(record) {},
    handleRemind(record) {},
    handleJianCha(record) {},
    handleJianYan(record) {},

    goApply() {
      this.$message.info('申请成功')
      this.$router.push({ name: 'sys_check_in' })
    },
  },
}
</script>

<style lang="less">
.div-new-plan {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 5% 0 5%;
  // padding: 0 15%;
  .p-title {
    margin-top: 20px;
    height: 20px;
    font-size: 20px;
    text-align: left;
    color: #000;
    font-weight: bold;
    // border-bottom: 1px solid #e6e6e6;
  }
  .div-divider {
    margin-top: 2%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 20%;
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      display: inline-block;
    }

    .ant-select {
      width: 18.5% !important;
      margin-left: 1.5% !important;
    }
  }

  .div-health-plan {
    width: 100%;
    height: 100%;

    .div-plan-item {
      margin-left: 2%;
      border-radius: 6px;
      border: 1px solid #e6e6e6;
      background-color: white;
      padding: 2% 2%;
      margin-top: 1%;
      width: 80%;
      height: 100%;
      overflow: hidden;

      .span-item-name {
        display: inline-block;
        color: #000;
        font-size: 14px;
        text-align: left;
      }

      .span-des {
        margin-left: 1%;
        display: inline-block;
        color: #000;
        font-size: 14px;
        text-align: left;
      }

      .div-top-right {
        padding: 3px 10px;
        display: inline-block;
        float: right;
        :hover {
          cursor: pointer;
        }

        .span-add-item {
          float: right;
          margin-left: 3px;
          padding-right: 10px;
          border-right: solid #dce4eb 1px;
        }

        .div-vertical {
          margin: 0 1%;
          width: 1px;
          color: #dce4eb;
          height: 2%;
        }
      }

      .ant-select {
        width: 7% !important;
        margin-left: 1.5% !important;
      }

      .div-plan-item-elements {
        width: 100%;
        margin-top: 1%;
        overflow: hidden;

        .div-element {
          overflow: hidden;
          margin: 0 6%;

          .div-content {
            display: inline-block;
            width: 16%;
            overflow: hidden;

            .span-item-name {
              display: inline-block;
              width: 8;
              color: #000;
              font-size: 14px;
              text-align: left;
            }
          }

          .icon-delete {
            float: right;
            // title:"";
            :hover {
              cursor: pointer;
            }
          }

          .div-divider-elements {
            margin-top: 1%;
            width: 100%;
            background-color: #e6e6e6;
            height: 1px;
          }
        }
      }
    }
  }

  .btn-add-plan {
    margin-top: 3%;
    margin-left: 35%;
    margin-bottom: 10%;
  }
}
</style>
