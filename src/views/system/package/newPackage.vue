<template>
  <div class="div-new-package">
    <p class="p-title">新增套餐</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <a-form ref="form" :form="form" class="my-form-package-add">
      <a-form-item label="所属类别" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <!-- <a-select allow-clear v-decorator="['belong', { rules: [{ required: true, message: '请选择所属科室' }] }]">
          <a-select-option v-for="(item, index) in goodClasses" :key="index" :value="item.classId">{{
            item.className
          }}</a-select-option>
        </a-select> -->

        <div class="global-search-wrapper" style="width: 300px">
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
              <a-select-option v-for="item in goodClassesTemp" :key="item.classId + ''" :title="item.className">
                {{ item.className }}
              </a-select-option>
            </template>
          </a-auto-complete>
        </div>
      </a-form-item>

      <a-form-item label="套餐名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-decorator="['goodsName', { rules: [{ required: true, message: '请输入套餐名称！' }] }]" />
      </a-form-item>

      <!-- <a-form-item label="服务名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-decorator="['goodsSpec', { rules: [{ required: true, message: '请输入服务名称！' }] }]" />
      </a-form-item> -->

      <a-form-item label="是否上架" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch :checked="uploadData.goodsInfo.isOnline" @click="goOnline" />
      </a-form-item>

      <!-- <a-form-item label="是否推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch :checked="uploadData.goodsInfo.isSuggest" />
      </a-form-item> -->

      <a-form-item label="价格(￥)" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <!-- <a-input v-decorator="['price', { rules: [{ required: true, message: '请输入商品价格！' }] }]" /> -->
        <a-input-number
          v-decorator="['price', { initialValue: 0, rules: [{ required: true, message: '请输入商品价格！' }] }]"
          :min="0"
          :max="1000000"
        />
      </a-form-item>

      <a-form-item label="有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-select allow-clear v-decorator="['theLastTime', { rules: [{ required: true, message: '请选择有效期' }] }]">
          <a-select-option v-for="(item, index) in periodData" :key="index" :value="item.code">{{
            item.value
          }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <div class="div-package-type-add">
      <span class="title-des"><span style="color: red">*</span> 服务类别 :</span>

      <div class="div-item" v-for="(item, index) in goodsAttr" :key="index">
        <div class="div-bg-package">
          <span class="span-item-name"><span style="color: red">*</span> 类别{{ index + 1 }} :</span>

          <a-select v-model="item.attrName" class="span-item-value" allow-clear placeholder="请选择服务类别">
            <a-select-option v-for="(itemType, indexType) in typeDatas" :key="indexType" :value="itemType.code">{{
              itemType.value
            }}</a-select-option>
          </a-select>

          <span class="span-item-name" style="margin-left: 5%"><span style="color: red">*</span> 次数 :</span>

          <a-input-number style="margin-left: 1%" v-model="item.attrValue" :min="0" :max="1000000" />

          <span class="span-item-name" style="margin-left: 5%"><span style="color: red">*</span> 上传资料 :</span>

          <a-select
            v-model="item.plusInfoVo.uploadDocFlag"
            class="span-item-value"
            allow-clear
            placeholder="请选择上传资料"
          >
            <a-select-option v-for="(itemType, indexType) in uploadDatas" :key="indexType" :value="itemType.code"
              >{{ itemType.value }}
            </a-select-option>
          </a-select>

          <span class="span-item-name config" @click="$refs.configForm.edit(index, item)"> 属性配置</span>
        </div>

        <a-button class="btn-delete" type="primary" @click="deleteItem(index)">刪除</a-button>
      </div>

      <a-button class="btn-add" style="margin-top: 2%; margin-left: 38%" type="primary" @click="addItem">添加</a-button>
    </div>

    <div style="padding: 0 8%; margin-top: 3%">
      <span class="span-item-name">添加随访计划：</span>
      <a-switch :checked="isPlan" @click="switchIsPlan" />
    </div>
    <div v-show="isPlan" class="div-my-plan-package-add">
      <!-- 分割线 -->
      <div class="div-divider"></div>

      <div class="div-line-wrap">
        <span class="span-item-name"><span style="color: red">*</span> 计划名称 :</span>
        <a-input
          v-model="uploadData.templateName"
          class="span-item-value"
          :maxLength="30"
          style="display: inline-block"
          allow-clear
          placeholder="请输入计划名称 "
        />
      </div>

      <!-- 计划内容 -->
      <div class="div-line-wrap">
        <span class="span-item-name"><span style="color: red">*</span> 计划内容 :</span>
      </div>
      <div class="div-health-plan">
        <div class="div-plan-item" v-for="(item, index) in uploadData.templateTask" :key="index">
          <span class="span-item-name"><span style="color: red">*</span> 计划时间 :</span>

          <a-input
            style="width: 12.5%; margin-left: 5%"
            type="number"
            v-model="uploadData.templateTask[index].inputDay"
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
            v-for="(itemChild, indexChild) in uploadData.templateTask[index].templateTaskContent"
            :key="indexChild"
          >
            <div class="div-element">
              <div class="div-content">
                <span class="span-item-name" style="width: 39%"> 计划类型 :</span>
                <span class="span-item-content"> {{ itemChild.taskTypeName }}</span>
              </div>

              <div class="div-content-value">
                <!-- //style="margin-left: 3%" -->
                <span class="span-item-name" style="width: 37%"> 具体内容 :</span>
                <span class="span-item-content" style="width: 35%"> {{ itemChild.contentDetail.detailName }}</span>
              </div>

              <a-icon class="icon-delete" @click="deleteElement(index, indexChild)" title="删除任务项目" type="close" />

              <div class="div-divider-elements"></div>
            </div>
          </div>
        </div>
      </div>

      <a-button class="btn-add-plan" @click="addPlanItem" type="primary">添加具体计划</a-button>
    </div>

    <a-button class="btn-submit" type="primary" @click="validate">提交</a-button>
    <div style="height: 25px; color: white"></div>

    <add-form ref="addForm" @ok="handleOk" />
    <add-teach ref="addTeach" @ok="handleTeach" />
    <add-question ref="addQuestion" @ok="handleQuestion" />
    <add-remind ref="addRemind" @ok="handleRemind" />
    <add-cha ref="addJianCha" @ok="handleJianCha" />
    <add-yan ref="addJianYan" @ok="handleJianYan" />
    <config-form ref="configForm" @ok="handleConfig" />
  </div>
</template>

<script>
import { savePlan, qryGoodsClass, qryCodeValue, getGoodsServiceType } from '@/api/modular/system/posManage'
import addForm from './addForm'
import addTeach from './addTeach'
import addCha from './addJianCha'
import addYan from './addJianYan'
import addQuestion from './addQuestion'
import addRemind from './addRemind'
import configForm from './configForm'

export default {
  components: {
    addForm,
    addTeach,
    addCha,
    addYan,
    addQuestion,
    addRemind,
    configForm,
  },

  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperColN: {
        xs: { span: 24 },
        sm: { span: 12 },
      },

      hosCode: '444885559',
      loading: false,
      hosData: [],
      periodData: [],
      // periodData: [
      //   { code: 1, valueName: '半年', value: 6 },
      //   { code: 2, valueName: '一年', value: 12 },
      //   { code: 3, valueName: '永久', value: 1200 },
      // ],
      headers: {
        authorization: 'authorization-text',
      },
      form: this.$form.createForm(this),
      typeDatas: [],
      uploadDatas: [
        {
          code: '0',
          value: '无',
        },
        {
          code: '1',
          value: '重症医学科资料1',
        },
      ],

      goodsAttrFull: [],
      goodsAttr: [],

      uploadData: {
        goodsInfo: {
          goodsName: '',
          belong: '',
          goodsType: 'service_package',
          goodsSpec: '',
          imgList: [],
          previewList: [],
          bannerList: [],
          status: '',
          price: '',
          theLastTime: '120',
          goodsAttr: [],
          isOnline: true,
          isSuggest: true,
          goodsClass: '',
        },
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
        templateName: '',
        basetimeType: '0',

        disease: [
          {
            diseaseName: '',
          },
        ],
      },

      goodClasses: [],
      goodClassesTemp: [],
      chooseClassItem: {},

      isPlan: true,
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
    }
  },

  watch: {
    visible() {},
  },

  created() {
    this.form.setFieldsValue({
      topFlagIf: true,
      statusIf: true,
    })

    qryGoodsClass({ pageNo: 1, pageSize: 99 }).then((res) => {
      if (res.code == 0) {
        this.goodClasses = res.data.rows
        this.goodClassesTemp = JSON.parse(JSON.stringify(this.goodClasses))
      } else {
        this.$message.error(res.message)
      }
    })

    // qryCodeValue('GOODS_SERVICE_TYPE').then((res) => {
    getGoodsServiceType().then((res) => {
      if (res.code == 0) {
        this.typeDatas = res.data
        // typeDatas元素的值 let item = {
        //   id: 3,
        //   codeGroup: 'GOODS_SERVICE_TYPE',
        //   code: 'videoNum',
        //   value: '视频咨询',
        //   parentCode: null,
        //   remark: null,
        // }

        //将typeDatas组装转换成goodsAttrFull
        for (let index = 0; index < this.typeDatas.length; index++) {
          // goodsAttrFull元素值: [{ name: '视频咨询', attrName: 'videoNum', attrValue: '1' }],
          this.goodsAttrFull.push({
            name: this.typeDatas[index].value,
            attrName: this.typeDatas[index].code,
            attrValue: '1',
            plusInfoVo: {
              uploadDocFlag: '0',
            },
          })
        }
        this.goodsAttr.push(JSON.parse(JSON.stringify(this.goodsAttrFull[0])))
      } else {
        this.$message.error(res.message)
      }
    })

    qryCodeValue('GOODS_EXPIRATION').then((res) => {
      if (res.code == 0) {
        this.periodData = res.data
      } else {
        this.$message.error(res.message)
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
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    goOnline() {
      this.uploadData.goodsInfo.isOnline = !this.uploadData.goodsInfo.isOnline
    },

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      if (inputName) {
        this.goodClassesTemp = this.goodClasses.filter((item) => item.className.indexOf(inputName) != -1)
      } else {
        this.goodClassesTemp = JSON.parse(JSON.stringify(this.goodClasses))
      }
    },

    onSelect(choseClassId) {
      //选择类别
      this.uploadData.goodsInfo.goodsClass = choseClassId
      this.chooseClassItem = this.goodClasses.find((item) => item.classId == choseClassId)
    },

    deleteItem(index) {
      if (this.goodsAttr.length <= 1) {
        this.$message.error('至少选择一个服务类别')
        return
      }
      this.goodsAttr.splice(index, 1)
    },

    /**
     * 添加条目时不能重复，需要处理
     */
    addItem() {
      if (this.goodsAttr.length >= this.goodsAttrFull.length) {
        this.$message.error('目前仅支持' + this.goodsAttrFull.length + '种服务类型！')
        return
      }

      let newName = this.getNewOne()
      let item = this.goodsAttrFull.find((item) => {
        return item.name == newName
      })
      this.goodsAttr.push(JSON.parse(JSON.stringify(item)))
    },

    getNewOne() {
      //添加typeDatas没有包含在this.goodsAttr里面的数据
      for (let index = 0; index < this.typeDatas.length; index++) {
        let value = this.typeDatas[index].value

        let has = this.goodsAttr.some((item) => {
          return item.name == value
        })

        if (!has) {
          return value
        }
      }
    },

    switchIsPlan() {
      this.isPlan = !this.isPlan
    },

    addPlanItem() {
      this.uploadData.templateTask.push({
        timeCount: '1',
        timeUnit: '天',
        inputDay: 0,
        templateTaskContent: [],
      })
    },

    deletePlanItem(index) {
      this.uploadData.templateTask.splice(index, 1)
    },

    deleteElement(index, indexChild) {
      this.uploadData.templateTask[index].templateTaskContent.splice(indexChild, 1)
    },

    //Knowledge 健康宣教;Quest 健康问卷;Remind 文字提醒;Check 检查;Exam 检验
    //index为计划任务的位置
    handleOk(index, value) {
      //选择类型后，添加条目
      switch (value.taskType) {
        case 'Knowledge':
          if (!this.chooseClassItem || !this.chooseClassItem.belong) {
            this.$message.error('请先选择类别！')
            return
          }
          this.$refs.addTeach.add(index, this.chooseClassItem.belong)
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
      this.uploadData.templateTask[index].templateTaskContent.push({
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
      this.uploadData.templateTask[index].templateTaskContent.push({
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
      this.uploadData.templateTask[index].templateTaskContent.push({
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
      this.uploadData.templateTask[index].templateTaskContent.push({
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
      this.uploadData.templateTask[index].templateTaskContent.push({
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
      this.uploadData.templateTask[index].templateTaskContent.push({
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
      this.uploadData.templateTask[index].templateTaskContent.push({
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

    handleConfig(index, values) {
      console.log('before', this.goodsAttr[index].plusInfoVo)
      console.log('values', values)
      this.goodsAttr[index].plusInfoVo = Object.assign(this.goodsAttr[index].plusInfoVo, values)
      console.log('after', this.goodsAttr[index].plusInfoVo)
    },

    validate() {
      const {
        form: { validateFields },
      } = this

      validateFields((errors, values) => {
        if (!errors) {
          //校验表格数据无误，则组装数据

          this.uploadData.goodsInfo.goodsName = values.goodsName
          // this.uploadData.goodsInfo.goodsSpec = values.goodsSpec
          this.uploadData.goodsInfo.price = values.price
          this.uploadData.goodsInfo.theLastTime = values.theLastTime
          // this.uploadData.templateName = values.goodsName

          //提示用户服务类别去重
          for (let index = 0; index < this.goodsAttr.length; index++) {
            let tempArr = JSON.parse(JSON.stringify(this.goodsAttr))
            tempArr.splice(index, 1)
            for (let indexTemp = 0; indexTemp < tempArr.length; indexTemp++) {
              if (this.goodsAttr[index].attrName == tempArr[indexTemp].attrName) {
                let item = this.goodsAttrFull.find((item) => item.attrName == this.goodsAttr[index].attrName)
                // console.log('item', item)
                this.$message.error('服务类别【' + item.name + '】重复，同类型的服务类别只能有一个，请删除多余的！')
                return
              }
            }
          }

          //属性配置时长必选 serviceExpire
          for (let index = 0; index < this.goodsAttr.length; index++) {
            if (!this.goodsAttr[index].plusInfoVo.serviceExpire) {
              let item = this.goodsAttrFull.find((item) => item.attrName == this.goodsAttr[index].attrName)
              // console.log('item', item)
              this.$message.error('请点击【' + item.name + '】的属性配置，配置其服务时效！')
              return
            }
          }

          this.uploadData.goodsInfo.goodsAttr = this.goodsAttr
          this.uploadData.goodsInfo.status = this.uploadData.goodsInfo.isOnline ? '1' : '3'

          //从类别里面拿的属性
          this.uploadData.goodsInfo.belong = this.chooseClassItem.belong
          this.uploadData.goodsInfo.topFlag = this.chooseClassItem.topFlag
          this.uploadData.goodsInfo.previewList = this.chooseClassItem.previewList
          this.uploadData.goodsInfo.bannerList = this.chooseClassItem.bannerList
          this.uploadData.goodsInfo.imgList = this.chooseClassItem.imgList

          if (!this.uploadData.goodsInfo.goodsClass) {
            this.$message.error('请选择类别！')
            return
          }

          let processUploadData = JSON.parse(JSON.stringify(this.uploadData))
          //校验计划
          if (!this.isPlan) {
            // delete processUploadData.templateTask
            processUploadData.templateTask = []
          } else {
            if (!processUploadData.templateName) {
              this.$message.error('请填写计划名称')
              return
            }
            if (processUploadData.templateTask.length == 0) {
              this.$message.error('请添加至少一个计划任务')
              return
            }

            //组装每次任务天数
            for (let i = 0; i < processUploadData.templateTask.length; i++) {
              processUploadData.templateTask[i].execTime = processUploadData.templateTask[i].inputDay
            }

            //组装每次任务的项目
            let templateTaskContentNo = 0
            for (let i = 0; i < processUploadData.templateTask.length; i++) {
              templateTaskContentNo =
                templateTaskContentNo + processUploadData.templateTask[i].templateTaskContent.length
            }
            if (templateTaskContentNo == 0) {
              this.$message.error('请添加至少一个任务项目')
              return
            }

            //删除没有任务项目的任务
            let templateTask = []
            for (let i = 0; i < processUploadData.templateTask.length; i++) {
              if (processUploadData.templateTask[i].templateTaskContent.length != 0) {
                templateTask.push(processUploadData.templateTask[i])
              }
            }
            processUploadData.templateTask = templateTask
          }

          //完成所有数据组装，上传后台
          savePlan(processUploadData).then((res) => {
            if (res.code == 0) {
              this.$message.success('保存成功')
              this.$router.go(-1)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('22', errors)
        }
      })
    },
  },
}
</script>

<style lang="less">
.div-new-package {
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

  .my-form-package-add {
    margin-top: 2%;
    margin-left: -10%;
  }

  .div-package-type-add {
    width: 100%;
    padding: 0 8%;
    overflow: hidden;

    .title-des {
      color: rgba(0, 0, 0, 0.85);
    }

    .div-item {
      margin-top: 2%;
      overflow: hidden;

      .div-bg-package {
        margin-left: 2%;
        padding: 1% 3%;
        border-radius: 6px;
        border: 1px solid #e6e6e6;
        // background-color: #e6e6e6;
        background-color: rgb(240, 240, 242);
        float: left;
        overflow: hidden;
        width: 80%;

        .ant-select {
          // width: 7% !important;
          // margin-left: 1.5% !important;
        }

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
        }

        .span-item-value {
          width: 21%;
          color: #333;
          text-align: left;
          padding-left: 3px;
          font-size: 14px;
          display: inline-block;
        }

        .config {
          // width: 20%;
          margin-left: 2%;
          color: #1890ff;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .btn-delete {
        margin-top: 1%;
        width: 12%;
        margin-left: 3%;
        overflow: hidden;
      }
    }
  }

  .div-service-pic {
    width: 100%;
    padding: 0 15.2%;
    margin-top: 2%;
    overflow: hidden;

    .title-des-pic {
      margin-top: 2%;
      display: block;
      color: rgba(0, 0, 0, 0.85);
    }

    // .upload-list-inline .ant-upload-list-item {
    //   float: left;
    //   width: 200px;
    //   margin-right: 8px;
    // }

    .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
  }

  .span-item-name {
    display: inline-block;
    color: #000;
    font-size: 14px;
    text-align: left;
  }

  .div-my-plan-package-add {
    padding: 0 8%;

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
              width: 30%;
              overflow: hidden;

              .span-item-name {
                display: inline-block;
                overflow: hidden;
                width: 25%;
                color: #000;
                font-size: 14px;
                text-align: left;
              }
              .span-item-content {
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis; //文本溢出显示省略号
                white-space: nowrap; //文本不会换行
                width: 20%;
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
  }

  .btn-submit {
    margin-top: 3%;
    margin-left: 38%;
  }
}
</style>
