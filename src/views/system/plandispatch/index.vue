<template>
  <div class="div-new-plan">
    <p class="p-title">分配计划</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> {{ nameString }}</span>
    </div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 所属科室 ：&nbsp;&nbsp;&nbsp;{{ keshiName }}</span>

      <span class="span-item-name" style="margin-left: 20%"
        ><span style="color: red">*</span> 所属专病 :&nbsp;&nbsp;&nbsp;&nbsp;{{ diseaseName }}</span
      >
    </div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 请选择计划 :</span>
      <a-button class="span-add-item" type="primary" style="margin-left: 1%" @click="choosePlan">{{
        chooseText
      }}</a-button>
      <span class="span-item-name" style="margin-left: 1%; color: black; font-weight: bold">
        {{ planData.templateName ? planData.templateName : '未选择计划' }}</span
      >
    </div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 计划内容 :</span>
      <a-button class="span-add-item" type="primary" style="margin-left: 2%" @click="editChoosePlan">{{
        editBtnText
      }}</a-button>
    </div>

    <!-- 计划内容 -->
    <div class="div-health-plan" v-show="isPlanChose">
      <div class="div-plan-item" v-for="(item, index) in planData.templateTask" :key="index">
        <span class="span-item-name"><span style="color: red">*</span> 计划时间 :</span>
        <a-select
          v-show="false"
          v-model="planData.templateTask[index].timeCount"
          allow-clear
          placeholder="请选择计划时间"
        >
          <a-select-option v-for="(itemCount, indexCount) in timeCountData" :key="indexCount" :value="itemCount.code">{{
            itemCount.value
          }}</a-select-option>
        </a-select>

        <a-select v-show="false" v-model="planData.templateTask[index].timeUnit" allow-clear placeholder="">
          <a-select-option
            v-for="(itemTimeUnit, timeUnitIndex) in timeUnitData"
            :key="timeUnitIndex"
            :value="itemTimeUnit.code"
            >{{ itemTimeUnit.value }}</a-select-option
          >
        </a-select>
        <span v-show="false" class="span-des">后</span>

        <a-input
          style="width: 12.5%; margin-left: 5%"
          type="number"
          :disabled="!isEdit"
          v-model="planData.templateTask[index].inputDay"
          allow-clear
          placeholder="请输入天数 "
        />
        <span class="span-des">天后</span>

        <div class="div-top-right">
          <a-popconfirm title="确定删除任务吗？" ok-text="确定" cancel-text="取消" @confirm="deletePlanItem(index)">
            <a-button class="span-add-item" type="primary" v-show="isEdit">删除任务</a-button>
          </a-popconfirm>

          <!-- <div class="div-vertical"></div> -->
          <a-button class="span-add-item" @click="$refs.addForm.add(index)" v-show="isEdit" type="primary"
            >添加子计划</a-button
          >
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

            <a-popconfirm
              title="确定删除任务吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteElement(index, indexChild)"
            >
              <a-icon class="icon-delete" title="删除任务项目" v-show="isEdit" type="close" />
            </a-popconfirm>

            <div class="div-divider-elements"></div>
          </div>
        </div>
      </div>
    </div>

    <a-button class="btn-add-plan" @click="addPlanItem" v-show="isPlanChose && isEdit" type="primary"
      >添加具体计划</a-button
    >
    <!-- <a-button class="btn-add-plan" @click="addPlanItem" type="primary">添加具体计划</a-button> -->
    <a-button class="btn-save-plan" @click="savePlan" type="primary">确认分配</a-button>
    <choose-plan ref="choosePlan" @ok="handleChoose" />
    <add-form ref="addForm" @ok="handleOk" />
    <add-teach ref="addTeach" @ok="handleTeach" />
    <add-question ref="addQuestion" @ok="handleQuestion" />
    <add-remind ref="addRemind" @ok="handleRemind" />
    <add-cha ref="addJianCha" @ok="handleJianCha" />
    <add-yan ref="addJianYan" @ok="handleJianYan" />
  </div>
</template>

<script>
import {
  queryDepartment,
  savePlan,
  getPlanDetail,
  delPlanTask,
  delPlanTaskContent,
  dispatchPlan,
  distributePlanList,
} from '@/api/modular/system/posManage'
import addForm from './addForm'
import addTeach from './addTeach'
import addCha from './addJianCha'
import addYan from './addJianYan'
import addQuestion from './addQuestion'
import addRemind from './addRemind'
import choosePlan from './choosePlan'
import moment from 'moment'

export default {
  components: {
    addForm,
    addTeach,
    addCha,
    addYan,
    addQuestion,
    addRemind,
    choosePlan,
  },

  data() {
    return {
      planData: {
        basetimeType: '0', //必传
        templateName: '', //计划名称
        keshiName: '',
        keshiCode: '',
        diseaseName: '',
        goodsInfo: {
          belong: '', //所属科室code
          goodsName: '',
          goodsType: 'plan_package', //必传
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
            inputDay: '',
            templateTaskContent: [
              // { name: '心电图', type: '检查' },
              // { name: '血常规', type: '检验' },
            ],
          },
        ],
      },

      hosCode: '444885559',
      loading: false,
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
      userDatas: [],
      isPlanChose: false,
      isEdit: false,
      editBtnText: '编辑专属计划',
      chooseText: '点击选择',
      nameString: '',
      userIds: [],
      planId: '',
    }
  },

  created() {
    // this.userDatas = this.$route.params
    this.userDatas = this.$route.query
    // this.getPlanDetailOut()
    this.keshiName = this.userDatas[0].ksmc
    this.diseaseName = this.userDatas[0].cyzd
    this.keshiCode = this.userDatas[0].ks

    let nameStringTemp = ''
    this.userDatas.forEach((item) => {
      nameStringTemp = nameStringTemp + item.userName + '，'
      // this.userIds.push(item.userId)
      //加了regNo参数
      this.userIds.push({ userId: item.userId, regNo: item.regNo })
    })
    this.nameString = '患者 ：   ' + nameStringTemp.slice(0, nameStringTemp.length - 1)

    queryDepartment('444885559').then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
      } else {
        this.$message.error('获取科室列表失败：' + res.message)
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
    choosePlan() {
      this.$refs.choosePlan.add(this.keshiCode)
      this.isPlanChose = true
    },

    /**
     *编辑计划展示编辑按钮
     *
     *完成编辑保存编辑后的计划
     */
    editChoosePlan() {
      if (!this.isPlanChose) {
        this.$message.error('请先选择计划')
        return
      }
      this.isEdit = !this.isEdit
      if (this.isEdit) {
        this.editBtnText = '完成编辑'
        // this.savePlan()
      } else {
        this.editBtnText = '编辑专属计划'
      }
    },

    handleChoose(record) {
      this.planId = record.templateId
      this.chooseText = '重新选择'
      this.getPlanDetailOut()
    },

    getPlanDetailOut() {
      getPlanDetail(this.planId).then((res) => {
        if (res.code == 0) {
          this.planData = res.data

          //处理数据为可展示的
          //展示科室
          this.keshiData.forEach((item) => {
            if (this.planData.goodsInfo.belong == item.deptCode) {
              this.planData.goodsInfo.belongName = item.deptName
            }
          })

          //展示名称
          for (let i = 0; i < this.planData.templateTask.length; i++) {
            //处理天数
            this.$set(this.planData.templateTask[i], 'inputDay', this.planData.templateTask[i].execTime)

            for (let j = 0; j < this.planData.templateTask[i].templateTaskContent.length; j++) {
              let taskType = this.planData.templateTask[i].templateTaskContent[j].taskType
              if (taskType == 'Knowledge') {
                this.$set(this.planData.templateTask[i].templateTaskContent[j], 'taskTypeName', '健康宣教')

                this.$set(
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail,
                  'detailName',
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail.title
                )
              } else if (taskType == 'Quest') {
                this.$set(this.planData.templateTask[i].templateTaskContent[j], 'taskTypeName', '健康问卷')
                this.$set(
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail,
                  'detailName',
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail.questName
                )
              } else if (taskType == 'Remind') {
                this.$set(this.planData.templateTask[i].templateTaskContent[j], 'taskTypeName', '文字提醒')
                this.$set(
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail,
                  'detailName',
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail.remindContent
                )
              } else if (taskType == 'Check') {
                this.$set(this.planData.templateTask[i].templateTaskContent[j], 'taskTypeName', '检查')
                this.$set(
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail,
                  'detailName',
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail.checkType
                )
              } else if (taskType == 'Exam') {
                this.$set(this.planData.templateTask[i].templateTaskContent[j], 'taskTypeName', '检验')
                this.$set(
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail,
                  'detailName',
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail.examType
                )
              } else if (taskType == 'Rdiagnosis') {
                this.$set(this.planData.templateTask[i].templateTaskContent[j], 'taskTypeName', '复诊提醒')
                this.$set(
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail,
                  'detailName',
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail.remindContent
                )
              } else if (taskType == 'Ddiagnosis') {
                this.$set(this.planData.templateTask[i].templateTaskContent[j], 'taskTypeName', '用药提醒')
                this.$set(
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail,
                  'detailName',
                  this.planData.templateTask[i].templateTaskContent[j].contentDetail.remindContent
                )
              }
            }
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },

    addPlanItem() {
      this.planData.templateTask.push({
        timeCount: '1',
        timeUnit: '天',
        inputDay: '',
        templateTaskContent: [],
      })
    },

    deletePlanItem(index) {
      //需要判断是否为新增的
      if (this.planData.templateTask[index].taskId) {
        let param = {
          templateId: this.planData.templateId,
          taskId: this.planData.templateTask[index].taskId,
        }
        delPlanTask(param).then((res) => {
          if (res.code == 0) {
            this.planData.templateTask.splice(index, 1)
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
      } else {
        this.planData.templateTask.splice(index, 1)
      }
    },

    deleteElement(index, indexChild) {
      //需要判断是否为新增的
      if (this.planData.templateTask[index].templateTaskContent[indexChild].id) {
        let param = {
          templateId: this.planData.templateId,
          taskId: this.planData.templateTask[index].taskId,
          id: this.planData.templateTask[index].templateTaskContent[indexChild].id,
        }
        delPlanTaskContent(param).then((res) => {
          if (res.code == 0) {
            this.$message.success('删除成功')
            this.planData.templateTask[index].templateTaskContent.splice(indexChild, 1)
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
      } else {
        this.planData.templateTask[index].templateTaskContent.splice(indexChild, 1)
      }
    },

    //Knowledge 健康宣教;Quest 健康问卷;Remind 文字提醒;Check 检查;Exam 检验
    //index为计划任务的位置
    handleOk(index, value) {
      //选择类型后，添加条目
      switch (value.taskType) {
        case 'Knowledge':
          this.$refs.addTeach.add(index, this.planData.goodsInfo.belong)
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
      if (!this.planData.goodsInfo.belong) {
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
        // if (this.planData.templateTask[i].inputDay == 0) {
        //   let num = 1
        //   if (this.planData.templateTask[i].timeUnit == '2') {
        //     num = 7
        //   } else if (this.planData.templateTask[i].timeUnit == '3') {
        //     num = 30
        //   }
        //   this.planData.templateTask[i].execTime = this.planData.templateTask[i].timeCount * num
        // } else {
        //   this.planData.templateTask[i].execTime = this.planData.templateTask[i].inputDay
        // }
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
      // let templateTask = JSON.parse(JSON.stringify(this.planData.templateTask))
      let templateTask = []
      for (let i = 0; i < this.planData.templateTask.length; i++) {
        if (this.planData.templateTask[i].templateTaskContent.length != 0) {
          templateTask.push(this.planData.templateTask[i])
        }
      }
      this.planData.templateTask = templateTask

      savePlan(this.planData).then((res) => {
        if (res.code == 0) {
          this.dispatchPlanOut()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    dispatchPlanOut() {
      let param = {
        beginTime: moment(new Date()).format('YYYY-MM-DD') + ' 05:00:00',
        patientId: this.userIds,
        doctorId: this.planData.userId,
        regNo: this.planData.regNo,
        templateId: this.planData.templateId,
      }

      distributePlanList(param).then((res) => {
        if (res.code == 0) {
          this.$message.success('分配成功')
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
        width: 11% !important;
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
