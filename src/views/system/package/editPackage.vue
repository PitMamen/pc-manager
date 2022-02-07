<template>
  <div class="div-new-plan">
    <p class="p-title">查看计edit划</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 计划名称 :</span>
      <span class="span-item-value">{{ planData.templateName }} </span>
    </div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 所属科室 :</span>
      <span class="span-item-value">{{ planData.goodsInfo.belongName }} </span>

      <span class="span-item-name" style="margin-left: 3%"><span style="color: red">*</span> 所属专病 :</span>

      <span class="span-item-value">{{ planData.disease[0].diseaseName }} </span>
    </div>

    <div class="div-line-wrap">
      <span class="span-item-name"><span style="color: red">*</span> 计划内容 :</span>
    </div>

    <!-- 计划内容 -->
    <div class="div-health-plan">
      <div class="div-plan-item" v-for="(item, index) in planData.templateTask" :key="index">
        <span class="span-item-name"><span style="color: red">*</span> 计划时间 :</span>


        <span style="margin-left: 2%">{{ planData.templateTask[index].execTime }} </span>
        <span class="span-des">天后</span>

        <div class="div-top-right">

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

            <div class="div-divider-elements"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="btn-add-plan" @click="addPlanItem" type="primary"></div>
  </div>
</template>

<script>
import { getPlanDetail, queryDepartment } from '@/api/modular/system/posManage'

export default {
  components: {},

  data() {
    return {
      planData: {
        basetimeType: '0', //必传
        templateName: '', //计划名称
        goodsInfo: {
          belong: '', //所属科室code
          goodsName: '',
          goodsType: 'servicePackage', //必传
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

      hosCode: '444885559',
      loading: false,
      planId: '',
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
    }
  },

  created() {
    this.planId = this.$route.params.planId
    this.getPlanDetailOut()
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
          width: 100%;
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
