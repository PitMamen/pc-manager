<template>
  <div class="div-new-plan">
    <p class="p-title">新增计划</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 计划名称 :</span>
      <a-input
        v-model="planData.templateName"
        class="span-item-value"
        :maxLength="30"
        style="display: inline-block"
        allow-clear
        placeholder="请输入计划名称 "
      />
    </div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 所属科室 :</span>
      <div style="width: 300px; display: inline-block; margin-left: 1%">
        <a-auto-complete
          class="global-search"
          size="large"
          style="width: 100%; font-size: 14px"
          placeholder="请输入并选择"
          option-label-prop="title"
          @select="onSelect"
          @search="handleSearch"
        >
          <template slot="dataSource">
            <a-select-option v-for="item in keshiDataTemp" :key="item.departmentId + ''" :title="item.departmentName">
              {{ item.departmentName }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </div>

      <span class="span-item-name" style="margin-left: 3%"><span style="color: red">*</span> 所属专病 :</span>
      <a-select v-model="planData.disease[0].diseaseName" allow-clear placeholder="请选择入所属科室">
        <a-select-option v-for="(item, index) in diseaseData" :key="index" :value="item.diseaseName">{{
          item.diseaseName
        }}</a-select-option>
      </a-select>
    </div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 计划内容 :</span>
    </div>

    <!-- 计划内容 -->
    <div class="div-health-plan">
      <div class="div-plan-item" v-for="(item, index) in planData.templateTask" :key="index">
        <span class="span-item-name"><span style="color: red">*</span> 计划时间 :</span>
        <a-input
          style="width: 12.5%; margin-left: 5%"
          type="number"
          v-model="planData.templateTask[index].inputDay"
          allow-clear
          placeholder="请输入天数 "
        />
        <span class="span-des">天后</span>

        <div class="div-top-right">
          <a-button class="span-add-item" type="primary" @click="deletePlanItem(index)">删除任务</a-button>
          <!-- <div class="div-vertical"></div> -->
          <a-button class="span-add-item" @click="$refs.addForm.add(index)" type="primary">添加子计划</a-button>
        </div>

        <!-- 分割线 -->
        <div class="div-divider"></div>

        <div
          class="div-plan-item-elements"
          v-for="(itemChild, indexChild) in planData.templateTask[index].templateTaskContent"
          :key="indexChild"
        >
          <div class="div-element">
            <div class="div-content">
              <span class="span-item-name"> 计划类型 :</span>
              <span class="span-item-content"> {{ itemChild.taskTypeName }}</span>
            </div>

            <div class="div-content-value">
              <!-- //style="margin-left: 3%" -->
              <span class="span-item-name"> 具体内容 :</span>
              <span class="span-item-content"> {{ itemChild.contentDetail.detailName }}</span>
            </div>

            <a-icon class="icon-delete" @click="deleteElement(index, indexChild)" title="删除任务项目" type="close" />

            <div class="div-divider-elements"></div>
          </div>
        </div>
      </div>
    </div>

    <a-button class="btn-add-plan" @click="addPlanItem" type="primary">添加具体计划</a-button>
    <a-button class="btn-save-plan" @click="savePlan" type="primary">保存计划</a-button>
    <add-form ref="addForm" @ok="handleOk" />
    <add-teach ref="addTeach" @ok="handleTeach" />
    <add-question ref="addQuestion" @ok="handleQuestion" />
    <add-remind ref="addRemind" @ok="handleRemind" />
    <add-cha ref="addJianCha" @ok="handleJianCha" />
    <add-yan ref="addJianYan" @ok="handleJianYan" />
  </div>
</template>

<script>
import { getDepts, savePlan, getDiseases } from '@/api/modular/system/posManage'
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
        basetimeType: '0', //必传
        templateName: '', //计划名称
        goodsInfo: {
          belong: '', //所属科室code
          goodsName: '',
          goodsType: 'plan_package', //计划
          // goodsType: 'service_package', //套餐
        },
        disease: [
          {
            diseaseName: '',
          },
        ],

        templateTask: [
          {
            timeCount: '1',
            timeUnit: '天',
            inputDay: 0,
            templateTaskContent: [
              // { name: '心电图', type: '检查' },
              // { name: '血常规', type: '检验' },
            ],
          },
        ],
      },

      timeCountData: [],
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
      keshiData: [],
      diseaseData: [],

      chooseDeptItem: {},
      keshiDataTemp: [],
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

    for (let i = 0; i < 30; i++) {
      this.timeCountData.push({
        code: i + 1,
        value: i + 1,
      })
    }
  },

  methods: {
    getDiseasesOut(departmentId) {
      getDiseases({ departmentId: departmentId }).then((res) => {
        if (res.code == 0) {
          this.diseaseData = res.data
        } else {
          this.$message.error('获取专病列表失败：' + res.message)
        }
      })
    },

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.keshiData.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
      }
    },

    onSelect(departmentId) {
      //选择类别
      this.planData.goodsInfo.belong = departmentId
      this.chooseDeptItem = this.keshiData.find((item) => item.departmentId == departmentId)
      this.planData.disease[0].diseaseName = ''
      this.getDiseasesOut(departmentId)
    },

    addPlanItem() {
      this.planData.templateTask.push({
        timeCount: '1',
        timeUnit: '天',
        inputDay: 0,
        templateTaskContent: [],
      })
    },

    deletePlanItem(index) {
      this.planData.templateTask.splice(index, 1)
    },

    deleteElement(index, indexChild) {
      this.planData.templateTask[index].templateTaskContent.splice(indexChild, 1)
    },

    //Knowledge 健康宣教;Quest 健康问卷;Remind 文字提醒;Check 检查;Exam 检验 ;Rdiagnosis 复诊提醒 ;Ddiagnosis 用药提醒
    //index为计划任务的位置
    handleOk(index, value) {
      //选择类型后，添加条目
      switch (value.taskType) {
        case 'Knowledge':
          if (!this.chooseDeptItem || !this.chooseDeptItem.departmentId) {
            this.$message.error('请先选择科室！')
            return
          }
          this.$refs.addTeach.add(index, this.chooseDeptItem.departmentId)
          break
        case 'Quest':
          this.$refs.addQuestion.add(index)
          break
        case 'Remind':
          this.$refs.addRemind.add(index)
          break
        case 'Check':
          this.$refs.addJianCha.add(index)
          break
        case 'Exam':
          this.$refs.addJianYan.add(index)
          break
        case 'Rdiagnosis':
          this.handleRdiagnosis(index, value.remindContent)
          break
        case 'Ddiagnosis':
          this.handleDdiagnosis(index, value.remindContent)
          break
      }
    },

    /**
     * taskTypeName是构造的项目名称字段
     *
     * detailName是构造的列表展示的字段
     *
     * 两个字段不需要传到后台，仅前端使用
     */
    handleTeach(index, record) {
      this.planData.templateTask[index].templateTaskContent.push({
        taskType: 'Knowledge', //类型
        taskTypeName: '健康宣教',
        taskDescribe: record.title,
        contentDetail: {
          //健康宣教，也就是文章，构造文章的数据
          knowUrl: record.previewUrl,
          knowContent: record.title,
          detailName: record.title,
          articleId: record.articleId,
        },
      })
    },

    handleQuestion(index, record) {
      this.planData.templateTask[index].templateTaskContent.push({
        taskType: 'Quest', //类型
        taskTypeName: '健康问卷',
        taskDescribe: record.name,
        contentDetail: {
          //问卷
          questId: record.key,
          questName: record.name,
          detailName: record.name,
        },
      })
    },

    handleRemind(index, remindContent) {
      this.planData.templateTask[index].templateTaskContent.push({
        taskType: 'Remind', //类型
        taskTypeName: '文字提醒',
        taskDescribe: remindContent,
        contentDetail: {
          //文字提醒
          remindContent: remindContent,
          detailName: remindContent,
        },
      })
    },

    //复诊提醒
    handleRdiagnosis(index, remindContent) {
      this.planData.templateTask[index].templateTaskContent.push({
        taskType: 'Rdiagnosis', //类型
        taskTypeName: '复诊提醒',
        taskDescribe: remindContent,
        contentDetail: {
          remindContent: remindContent,
          detailName: remindContent,
        },
      })
    },

    //用药提醒
    handleDdiagnosis(index, remindContent) {
      this.planData.templateTask[index].templateTaskContent.push({
        taskType: 'Ddiagnosis', //类型
        taskTypeName: '用药提醒',
        taskDescribe: remindContent,
        contentDetail: {
          remindContent: remindContent,
          detailName: remindContent,
        },
      })
    },

    handleJianCha(index, record) {
      this.planData.templateTask[index].templateTaskContent.push({
        taskType: 'Check', //类型
        taskTypeName: '检查',
        taskDescribe: record.name,
        contentDetail: {
          //检查
          checkType: record.name,
          detailName: record.name,
        },
      })
    },

    handleJianYan(index, record) {
      this.planData.templateTask[index].templateTaskContent.push({
        taskType: 'Exam', //类型
        taskTypeName: '检验',
        taskDescribe: record.name,
        contentDetail: {
          //检验
          examType: record.name,
          detailName: record.name,
        },
      })
    },

    savePlan() {
      if (!this.planData.templateName) {
        this.$message.error('请填写计划名称')
        return
      }
      if (!this.chooseDeptItem || !this.chooseDeptItem.departmentId) {
        this.$message.error('请选择所属科室')
        return
      }

      if (!this.planData.disease[0].diseaseName) {
        this.$message.error('请输入所属专病')
        return
      }

      if (this.planData.templateTask.length == 0) {
        this.$message.error('请添加至少一个计划任务')
        return
      }

      this.planData.goodsInfo.goodsName = this.planData.templateName

      //组装每次任务天数
      for (let i = 0; i < this.planData.templateTask.length; i++) {
        this.planData.templateTask[i].execTime = this.planData.templateTask[i].inputDay
      }

      //组装每次任务的项目
      let templateTaskContentNo = 0
      for (let i = 0; i < this.planData.templateTask.length; i++) {
        templateTaskContentNo = templateTaskContentNo + this.planData.templateTask[i].templateTaskContent.length
      }
      if (templateTaskContentNo == 0) {
        this.$message.error('请添加至少一个任务项目')
        return
      }

      //删除没有任务项目的任务
      let templateTask = []
      for (let i = 0; i < this.planData.templateTask.length; i++) {
        if (this.planData.templateTask[i].templateTaskContent.length != 0) {
          templateTask.push(this.planData.templateTask[i])
        }
      }
      this.planData.templateTask = templateTask

      savePlan(this.planData).then((res) => {
        if (res.code == 0) {
          this.$message.success('保存成功')
          this.$router.go(-1)
        } else {
          this.$message.error(res.message)
        }
      })
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

    // global-search ant-select ant-select-combobox
    .global-search.ant-select {
      width: 90% !important;
    }
  }

  .div-health-plan {
    width: 100%;
    // height: 100%;

    .div-plan-item {
      margin-left: 2%;
      border-radius: 6px;
      border: 1px solid #e6e6e6;
      background-color: white;
      padding: 2% 2%;
      margin-top: 1%;
      width: 80%;
      // height: 100%;
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
          width: 80%;
          overflow: hidden;
          margin: 0 6%;

          .div-content {
            display: inline-block;
            width: 30%;
            overflow: hidden;

            .span-item-name {
              display: inline-block;
              width: 25%;
              color: #000;
              overflow: hidden;
              font-size: 14px;
              text-align: left;
            }
            .span-item-content {
              display: inline-block;
              width: 50%;
              overflow: hidden;
              color: #000;
              font-size: 14px;
              text-align: left;
            }
          }

          .div-content-value {
            display: inline-block;
            width: 66%;
            overflow: hidden;

            .span-item-name {
              display: inline-block;
              overflow: hidden;
              width: 11%;
              color: #000;
              font-size: 14px;
              text-align: left;
            }
            .span-item-content {
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis; //文本溢出显示省略号
              white-space: nowrap; //文本不会换行
              width: 75%;
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
  }
  .btn-save-plan {
    margin-top: 5%;
    display: block;
    margin-bottom: 10%;
  }
}
</style>
