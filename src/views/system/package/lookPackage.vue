<template>
  <div class="div-new-package">
    <p class="p-title">查看套餐</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <a-form ref="form" :form="form" class="my-form-package-look">
      <a-form-item label="所属类别" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <span class="span-item-value">{{ uploadData.goodsInfo.goodsClassInfo.className }} </span>
        <!-- <a-select allow-clear v-decorator="['belong', { rules: [{ required: true, message: '请选择所属科室' }] }]">
          <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.deptCode">{{
            item.deptName
          }}</a-select-option>
        </a-select> -->
      </a-form-item>

      <a-form-item label="套餐名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <!-- <a-input v-decorator="['goodsName', { rules: [{ required: true, message: '请输入套餐名称！' }] }]" /> -->
        <span class="span-item-value">{{ uploadData.templateName || uploadData.goodsInfo.goodsName }} </span>
      </a-form-item>

      <!-- <a-form-item label="服务名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <span class="span-item-value">{{ planData.goodsInfo.goodsSpec }} </span>
      </a-form-item> -->

      <a-form-item label="是否上架" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <!-- <a-switch
          defaultChecked
          v-decorator="['statusIf', { rules: [{ required: true, message: '请选择是否上架！' }] }]"
        /> -->
        <a-switch :checked="uploadData.isOnline" disabled />
      </a-form-item>

      <!-- <a-form-item label="是否推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch :checked="planData.isSuggest" disabled />
      </a-form-item> -->

      <a-form-item label="价格(￥)" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <!-- <a-input v-decorator="['price', { rules: [{ required: true, message: '请输入商品价格！' }] }]" /> -->
        <!-- <a-input-number
          v-decorator="['price', { initialValue: 0, rules: [{ required: true, message: '请输入商品价格！' }] }]"
          :min="0"
          :max="1000000"
        /> -->
        <span class="span-item-value">{{ uploadData.goodsInfo.price }} </span>
      </a-form-item>

      <a-form-item label="有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <span class="span-item-value">{{ uploadData.goodsInfo.theLastTimeName }} </span>
        <!-- <a-select allow-clear v-decorator="['theLastTime', { rules: [{ required: true, message: '请选择有效期' }] }]">
          <a-select-option v-for="(item, index) in periodData" :key="index" :value="item.value">{{
            item.valueName
          }}</a-select-option>
        </a-select> -->
      </a-form-item>

      <!-- <a-form-item label="服务类别" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <span
          v-decorator="['dd', { initialValue: 0, rules: [{ required: true, message: '请输入商品价格！' }] }]"
        ></span>
      </a-form-item> -->
    </a-form>

    <div class="div-package-type">
      <span class="title-des"><span style="color: red">*</span> 服务类别 :</span>

      <div class="div-item" v-for="(item, index) in goodsAttr" :key="index">
        <div class="div-bg-package">
          <span class="span-item-name"><span style="color: red">*</span> 类别{{ index + 1 }} :</span>

          <a-select disabled v-model="item.attrName" class="span-item-value" allow-clear placeholder="请选择服务类别">
            <a-select-option v-for="(itemType, indexType) in typeDatas" :key="indexType" :value="itemType.code">{{
              itemType.value
            }}</a-select-option>
          </a-select>

          <span class="span-item-name" style="margin-left: 5%"><span style="color: red">*</span> 次数 :</span>

          <a-input-number style="margin-left: 3.5%" disabled v-model="item.attrValue" :min="0" :max="1000000" />

          <span class="span-item-name" style="margin-left: 5%"><span style="color: red">*</span> 上传资料 :</span>
          <a-select
            disabled
            v-model="item.plusInfoVo.uploadDocFlag"
            class="span-item-value"
            allow-clear
            placeholder="请选择上传资料"
          >
            <a-select-option v-for="(itemType, indexType) in uploadDatas" :key="indexType" :value="itemType.code"
              >{{ itemType.value }}
            </a-select-option>
          </a-select>
        </div>

        <a-button class="btn-delete" type="primary" v-show="false" @click="deleteItem(index)">刪除</a-button>
      </div>

      <a-button class="btn-add" style="margin-top: 2%" v-show="false" type="primary" @click="addItem">添加</a-button>
    </div>

    <div class="div-service-pic" v-show="false">
      <span class="title-des-pic"><span style="color: red">*</span> 套餐图片 :（只允许上传1张，正方形比例）</span>
      <!-- <div :key="ImgKey" style="margin-top: 1%"> -->
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
          disabled
          :action="actionUrl"
          :multiple="true"
          list-type="picture-card"
          :file-list="fileList"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>

      <span class="title-des-pic"><span style="color: red">*</span> 详情banner图片 :（建议尺寸比例7：4）</span>
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
          disabled
          :action="actionUrl"
          :multiple="true"
          list-type="picture-card"
          :file-list="fileListBanner"
          @preview="handlePreviewBanner"
          @change="handleChangeBanner"
        >
          <div v-if="false">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisibleBanner" :footer="null" @cancel="handleCancelBanner">
          <img alt="example" style="width: 100%" :src="previewImageBanner" />
        </a-modal>
      </div>

      <span class="title-des-pic"><span style="color: red">*</span> 商品详情</span>
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
          disabled
          :action="actionUrl"
          :multiple="true"
          list-type="picture-card"
          :file-list="fileListDetail"
          @preview="handlePreviewDetail"
          @change="handleChangeDetail"
        >
          <div v-if="false">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisibleDetail" :footer="null" @cancel="handleCancelDetail">
          <img alt="example" style="width: 100%" :src="previewImageDetail" />
        </a-modal>
      </div>
    </div>

    <div v-show="isPlan" class="div-my-plan">
      <!-- 分割线 -->
      <div class="div-divider"></div>

      <div class="div-line-wrap">
        <span class="span-item-name"><span style="color: red">*</span> 计划名称 :</span>
        <span class="span-item-value">{{ uploadData.templateName }} </span>
      </div>

      <div class="div-line-wrap">
        <span class="span-item-name"><span style="color: red">*</span> 计划内容 :</span>
      </div>

      <!-- 计划内容 -->
      <div class="div-health-plan">
        <div class="div-plan-item" v-for="(item, index) in uploadData.templateTask" :key="index">
          <span class="span-item-name"><span style="color: red">*</span> 计划时间 :</span>

          <!-- <a-input
            style="width: 12.5%; margin-left: 5%"
            type="number"
            disabled
            v-model="uploadData.templateTask[index].inputDay"
            allow-clear
            placeholder="请输入天数 "
          /> -->
          <span class="span-des">{{ uploadData.templateTask[index].inputDay }}</span>
          <span class="span-des">天后</span>

          <div class="div-top-right">
            <!-- <a-button class="span-add-item" type="primary" @click="deletePlanItem(index)">删除任务</a-button> -->
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
                <span class="span-item-name" style="width: 36%"> 计划类型 :</span>
                <span class="span-item-content"> {{ itemChild.taskTypeName }}</span>
              </div>

              <div class="div-content-value">
                <!-- //style="margin-left: 3%" -->
                <span class="span-item-name" style="width: 17%"> 具体内容 :</span>
                <span class="span-item-content"> {{ itemChild.contentDetail.detailName }}</span>
              </div>

              <a-popconfirm
                v-if="false"
                title="确定删除任务吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteElement(index, indexChild)"
              >
                <a-icon class="icon-delete" title="删除任务项目" type="close" />
              </a-popconfirm>

              <!-- <a-icon class="icon-delete" @click="deleteElement(index, indexChild)" title="删除任务项目" type="close" /> -->

              <div class="div-divider-elements"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- <a-button class="btn-add-plan" @click="addPlanItem" type="primary">添加具体计划</a-button> -->
    </div>

    <a-button class="btn-submit" v-if="false" type="primary" @click="validate">提交</a-button>
    <div style="height: 25px; color: white"></div>
  </div>
</template>

<script>
import { savePlan, getPlanDetail, qryCodeValue } from '@/api/modular/system/posManage'

export default {
  components: {},

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
      periodData: [
        { code: 1, valueName: '半年', value: 6 },
        { code: 2, valueName: '一年', value: 12 },
        { code: 3, valueName: '永久', value: 1200 },
      ],
      keshiData: [],
      // planData: {},
      planId: '',
      // actionUrl: 'http://192.168.1.122:8071/fileUpload/uploadImgFile',
      actionUrl: '/api/content-api/fileUpload/uploadImgFile',
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
          goodsClassInfo: { className: '' },
          goodsName: '',
          belong: '',
          deptName: '',
          goodsType: 'service_package',
          goodsSpec: '',
          imgList: [],
          previewList: [],
          bannerList: [],
          status: '',
          price: '',
          theLastTime: '120',
          goodsAttr: [],
        },
        templateTask: [
          // {
          //   execTime: '0',
          //   taskName: '套餐购买',
          // },
        ],
        templateName: '',
        basetimeType: '0',
      },

      previewVisible: false,
      previewVisibleBanner: false,
      previewVisibleDetail: false,

      previewImage: '',
      previewImageBanner: '',
      previewImageDetail: '',

      fileList: [],
      fileListBanner: [],
      fileListDetail: [],

      periodData: [],
      isPlan: true,
    }
  },

  watch: {
    visible() {},
  },

  created() {
    this.planId = this.$route.query.planId

    qryCodeValue('GOODS_SERVICE_TYPE').then((res) => {
      if (res.code == 0) {
        this.typeDatas = res.data
        // let item = {
        //   id: 3,
        //   codeGroup: 'GOODS_SERVICE_TYPE',
        //   code: 'videoNum',
        //   value: '视频咨询',
        //   parentCode: null,
        //   remark: null,
        // }
        for (let index = 0; index < this.typeDatas.length; index++) {
          // goodsAttr: [{ name: '视频咨询', attrName: 'videoNum', attrValue: '1' }],
          this.goodsAttrFull.push({
            name: this.typeDatas[index].value,
            attrName: this.typeDatas[index].code,
            attrValue: '1',
            plusInfoVo: {
              uploadDocFlag: '0',
            },
          })
        }

        this.getTimePeriod()
        // this.goodsAttr = JSON.parse(JSON.stringify(this.goodsAttrFull[0]))
      } else {
        this.$message.error(res.message)
      }
    })
  },

  methods: {
    getPlanDetailOut() {
      getPlanDetail(this.planId).then((res) => {
        if (res.code == 0) {
          this.uploadData = res.data
          if (!this.uploadData.goodsInfo.goodsClassInfo) {
            this.$set(this.uploadData.goodsInfo, 'goodsClassInfo', {
              className: '',
            })
          }

          if (this.uploadData.goodsInfo.status == 1) {
            this.$set(this.uploadData, 'isOnline', true)
          } else {
            this.$set(this.uploadData, 'isOnline', false)
          }

          if (this.uploadData.goodsInfo.topFlag == 1) {
            this.$set(this.uploadData, 'isSuggest', true)
          } else {
            this.$set(this.uploadData, 'isSuggest', false)
          }

          //组装服务类型,加名字
          for (let index = 0; index < this.uploadData.goodsInfo.goodsAttr.length; index++) {
            let fullOne = this.goodsAttrFull.find((itemFull) => {
              return itemFull.attrName == this.uploadData.goodsInfo.goodsAttr[index].attrName
            })
            if (fullOne && fullOne.attrName) {
              this.$set(this.uploadData.goodsInfo.goodsAttr[index], 'name', fullOne.name)

              //旧套餐空值做转换，有值的话直接赋值，没值的话构造一个默认值
              if (this.uploadData.goodsInfo.goodsAttr[index].plusInfo) {
                this.$set(
                  this.uploadData.goodsInfo.goodsAttr[index],
                  'plusInfoVo',
                  JSON.parse(JSON.stringify(this.uploadData.goodsInfo.goodsAttr[index].plusInfo))
                )
              } else {
                this.$set(this.uploadData.goodsInfo.goodsAttr[index], 'plusInfoVo', { uploadDocFlag: '0' })
              }

              this.goodsAttr.push(JSON.parse(JSON.stringify(this.uploadData.goodsInfo.goodsAttr[index])))
            }
          }

          //组装计划数据
          if (this.uploadData.templateTask && this.uploadData.templateTask.length > 0) {
            //展示名称
            for (let i = 0; i < this.uploadData.templateTask.length; i++) {
              //处理天数
              this.$set(this.uploadData.templateTask[i], 'inputDay', this.uploadData.templateTask[i].execTime)

              for (let j = 0; j < this.uploadData.templateTask[i].templateTaskContent.length; j++) {
                let taskType = this.uploadData.templateTask[i].templateTaskContent[j].taskType
                if (taskType == 'Knowledge') {
                  this.$set(this.uploadData.templateTask[i].templateTaskContent[j], 'taskTypeName', '健康宣教')

                  this.$set(
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail,
                    'detailName',
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail.title
                  )
                } else if (taskType == 'Quest') {
                  this.$set(this.uploadData.templateTask[i].templateTaskContent[j], 'taskTypeName', '健康问卷')
                  this.$set(
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail,
                    'detailName',
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail.questName
                  )
                } else if (taskType == 'Remind') {
                  this.$set(this.uploadData.templateTask[i].templateTaskContent[j], 'taskTypeName', '文字提醒')
                  this.$set(
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail,
                    'detailName',
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail.remindContent
                  )
                } else if (taskType == 'Check') {
                  this.$set(this.uploadData.templateTask[i].templateTaskContent[j], 'taskTypeName', '检查')
                  this.$set(
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail,
                    'detailName',
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail.checkType
                  )
                } else if (taskType == 'Exam') {
                  this.$set(this.uploadData.templateTask[i].templateTaskContent[j], 'taskTypeName', '检验')
                  this.$set(
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail,
                    'detailName',
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail.examType
                  )
                }else if (taskType == 'Rdiagnosis') {
                  this.$set(this.uploadData.templateTask[i].templateTaskContent[j], 'taskTypeName', '复诊提醒')
                  this.$set(
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail,
                    'detailName',
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail.remindContent
                  )
                } else if (taskType == 'Ddiagnosis') {
                  this.$set(this.uploadData.templateTask[i].templateTaskContent[j], 'taskTypeName', '用药提醒')
                  this.$set(
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail,
                    'detailName',
                    this.uploadData.templateTask[i].templateTaskContent[j].contentDetail.remindContent
                  )
                }
              }
            }
          } else {
            this.isPlan = false
          }

          //组装图片
          /**
           *    {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
           */
          this.fileList.push({
            uid: '-1',
            name: '封面' + 1,
            status: 'done',
            url: this.uploadData.goodsInfo.previewList,
          })

          //banner图
          if (this.uploadData.goodsInfo.bannerList) {
            let bannerPics = this.uploadData.goodsInfo.bannerList.split(',')
            for (let index = 0; index < bannerPics.length; index++) {
              this.fileListBanner.push({
                uid: 0 - index + '',
                name: 'Banner' + index,
                status: 'done',
                url: bannerPics[index],
              })
            }
          }

          //详情图
          if (this.uploadData.goodsInfo.imgList) {
            let detailPics = this.uploadData.goodsInfo.imgList.split(',')
            for (let index = 0; index < detailPics.length; index++) {
              this.fileListDetail.push({
                uid: 0 - index + '',
                name: '详情' + index,
                status: 'done',
                url: detailPics[index],
              })
            }
          }
        } else {
          this.$message.error(res.message)
        }

        this.$set(this.uploadData.goodsInfo, 'theLastTimeName', this.countMonth())
      })
    },

    getTimePeriod() {
      qryCodeValue('GOODS_EXPIRATION').then((res) => {
        if (res.code == 0) {
          this.periodData = res.data
          this.getPlanDetailOut()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    countMonth() {
      let timeName
      this.periodData.forEach((item) => {
        if (item.code == this.uploadData.goodsInfo.theLastTime) {
          timeName = item.value
        }
      })
      return timeName
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    handleCancel() {
      this.previewVisible = false
    },

    handleCancelBanner() {
      this.previewVisibleBanner = false
    },

    handleCancelDetail() {
      this.previewVisibleDetail = false
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    async handlePreviewBanner(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageBanner = file.url || file.preview
      this.previewVisibleBanner = true
    },

    async handlePreviewDetail(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageDetail = file.url || file.preview
      this.previewVisibleDetail = true
    },

    handleChange({ fileList }) {
      this.fileList = fileList
    },

    handleChangeBanner({ fileList }) {
      this.fileListBanner = fileList
    },

    handleChangeDetail({ fileList }) {
      this.fileListDetail = fileList
    },

    deleteItem(index) {
      this.goodsAttr.splice(index, 1)
    },

    /**
     * 添加条目时不能重复，需要处理
     */
    addItem() {},
    validate() {
      const {
        form: { validateFields },
      } = this

      validateFields((errors, values) => {
        if (!errors) {
          console.log('11', values)
          //校验表格数据无误，则组装数据

          this.uploadData.goodsInfo.goodsName = values.goodsName
          this.uploadData.goodsInfo.belong = values.belong
          this.uploadData.goodsInfo.goodsSpec = values.goodsSpec
          this.uploadData.goodsInfo.price = values.price
          this.uploadData.goodsInfo.theLastTime = values.theLastTime
          this.uploadData.goodsInfo.status = values.statusIf ? '1' : '3'
          this.uploadData.goodsInfo.topFlag = values.topFlagIf ? '1' : '0'
          this.uploadData.goodsInfo.goodsAttr = this.goodsAttr

          this.uploadData.templateName = values.goodsName

          //组装图片
          if (this.fileList.length == 0) {
            this.$message.error('请上传套餐图片！')
            return
          } else {
            for (let index = 0; index < this.fileList.length; index++) {
              this.uploadData.goodsInfo.previewList.push(this.fileList[index].response.data.fileLinkUrl)
            }
          }

          if (this.fileListBanner.length == 0) {
            this.$message.error('请上传详情banner图片！')
            return
          } else {
            for (let index = 0; index < this.fileListBanner.length; index++) {
              this.uploadData.goodsInfo.bannerList.push(this.fileListBanner[index].response.data.fileLinkUrl)
            }
          }

          if (this.fileListDetail.length == 0) {
            this.$message.error('请上传商品详情图片！')
            return
          } else {
            for (let index = 0; index < this.fileListDetail.length; index++) {
              this.uploadData.goodsInfo.imgList.push(this.fileListDetail[index].response.data.fileLinkUrl)
            }
          }
          //完成所有数据组装，上传后台
          savePlan(this.uploadData).then((res) => {
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

  .span-item-value {
    color: #333;
    text-align: left;
    font-size: 14px;
    display: inline-block;
  }

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

  .my-form-package-look {
    margin-top: 2%;
    margin-left: -10%;
  }

  .div-package-type {
    width: 100%;
    padding: 0 15.2%;
    overflow: hidden;

    .title-des {
      color: rgba(0, 0, 0, 0.85);
    }

    .div-item {
      margin-top: 2%;
      overflow: hidden;

      .div-bg-package {
        margin-left: 2%;
        padding: 1% 5%;
        border-radius: 6px;
        border: 1px solid #e6e6e6;
        // background-color: #e6e6e6;
        background-color: rgb(240, 240, 242);
        float: left;
        overflow: hidden;
        width: 70%;

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
          width: 20%;
          color: #333;
          text-align: left;
          padding-left: 20px;
          font-size: 14px;
          display: inline-block;
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

  .div-my-plan {
    padding: 0 15% 0 15%;

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
  }

  .btn-submit {
    margin-top: 3%;
    margin-left: 38%;
  }
}
</style>
