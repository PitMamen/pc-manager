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
          <span style="margin-top: 5px"> <span style="color: red">*</span> 上级机构:</span>
          <a-select
            class="sitemore"
            style="min-width: 200px; height: 28px; margin-left: 5px; margin-top: 5px"
            :maxTagCount="1"
            allow-clear
            v-model="shoudata"
            placeholder="请选择机构类型"
            @select="onSelect"
          >
            <a-select-option v-for="(item, index) in ParentList" :value="item.hospitalId" :key="index">{{
              item.hospitalName
            }}</a-select-option>
          </a-select>
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 机构代码:</span>
          <a-input
            type="number"
            v-model="queryParams.hospitalCode"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 7px"> <span style="color: red">*</span> 机构名称:</span>
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
          <a-button style="margin-left: 5px" icon="plus" size="small" @click="addNum()" />
          <!-- <a-icon type="plus" /> -->
          <a-input
            v-model="queryParams.sortedNo"
            :disabled="true"
            :defaultValue="1"
            allow-clear
            style="width: 90px; margin-left: 8px; text-align: center"
          />
          <a-button style="margin-left: 5px" size="small" icon="minus" @click="duleNum()" />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 机构类型:</span>

          <a-radio-group
            name="radioGroup"
            v-model="queryParams.orgType"
            @change="radioChange"
            defaultValue="2"
            v-decorator="['roleId', { rules: [{ required: true, message: '请选择机构类型！' }] }]"
          >
            <!-- <a-radio class="btn-add-plan" :value="1" style="font-size:12px"> 立即发送 </a-radio>
              <a-radio :value="2"  style="font-size:12px"> 延时发送 </a-radio> -->
            <a-radio :value="1" style="font-size: 8px; margin-left: 10px; margin-top: 10px"> 管理机构 </a-radio>
            <a-radio :value="2" style="font-size: 8px; margin-top: 10px"> 医疗机构 </a-radio>
          </a-radio-group>
        </div>

        <div v-if="rangeValue == '2' || queryParams.orgType != 1" class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">医疗机构属性</span>
        </div>

        <div
          v-if="rangeValue == '2' || queryParams.orgType != 1"
          class="display-item"
          style="margin-left: 10px; margin-top: 10px"
        >
          <span style="margin-top: 10px"> <span style="color: red">*</span> 机构类型:</span>
          <a-select
            class="sitemore"
            style="min-width: 200px; height: 28px; margin-left: 5px; margin-top: 5px"
            :title="queryParams.hospitalType"
            :maxTagCount="1"
            allow-clear
            v-model="queryParams.hospitalType"
            placeholder="请选择机构类型"
          >
            <a-select-option v-for="(item, index) in HospitalTypeList" :value="item.value" :key="index">{{
              item.description
            }}</a-select-option>
          </a-select>
        </div>

        <div
          v-if="rangeValue == '2' || queryParams.orgType != 1"
          class="display-item"
          style="margin-left: 10px; margin-top: 10px"
        >
          <span style="margin-top: 10px"> <span style="color: red">*</span> 机构等级:</span>
          <a-select
            class="sitemore"
            style="min-width: 200px; height: 28px; margin-left: 5px; margin-top: 5px"
            :title="queryParams.level"
            :maxTagCount="1"
            allow-clear
            v-model="queryParams.level"
            placeholder="请选择机构等级"
          >
            <a-select-option v-for="(item, index) in HospitalLevelList" :value="item.value" :key="index">{{
              item.description
            }}</a-select-option>
          </a-select>
        </div>

        <div v-if="rangeValue == '2' || queryParams.orgType != 1" class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">接口配置</span>
        </div>

        <div
          v-if="rangeValue == '2' || queryParams.orgType != 1"
          class="display-item"
          style="margin-left: 10px; margin-top: 10px"
        >
          <span style="margin-top: 10px"> <span style="color: red">*</span> HIS编码: </span>
          <a-input
            type="number"
            v-model="queryParams.hisCode"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div
          v-if="rangeValue == '2' || queryParams.orgType != 1"
          class="display-item"
          style="margin-left: 10px; margin-top: 10px"
        >
          <span style="margin-top: 10px"> <span style="color: red">*</span> 服务地址:</span>
          <a-input
            v-model="queryParams.middleware"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>
      </div>

      <!-- ri -->
      <div class="card-right-user" style="overflow-y: auto; height: 450px">
        <div class="div-title" style="margin-left: 10px; margin-top: 3px">
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
            <a-icon type="plus" />
            <div class="ant-upload-text">upload</div>
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

        <div id="div2" ref="editorEl" style="margin-top: 15%"></div>
      </div>
    </div>
  </a-modal>
</template>
        
        
        
        <script>
import moment from 'moment'
import {
  save,
  queryHospitalLevel,
  queryHospitalType,
  parent,
  queryHospitaldetail,
} from '@/api/modular/system/posManage'
import { STable } from '@/components'
import { formatDate, formatDateFull } from '@/utils/util'
import E from 'wangeditor'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { appId } from '@/utils/util'
// import { nextTick } from 'vue/types/umd'
export default {
  components: {
    STable,
  },
  data() {
    return {
      shoudata: '',
      bb: '1',
      userId: '',
      timeStr: '',
      originData: [],
      hospitalId: '',
      id: '', //表名ID
      rangeValue: '1',
      previewVisible: false,
      HospitalLevelList: [],
      HospitalTypeList: [],
      ParentList: [],
      record: {},
      queryParams: {
        hisCode: '',
        hospitalCode: '',
        hospitalId: 0,
        hospitalName: '',
        hospitalType: '',
        imgUrl: '',
        introduction: '',
        level: '',
        middleware: '',
        orgType: 0,
        pid: 0,
        sortedNo: 0,
        tenantId: 0,
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      headers: {
        Authorization: '',
      },
      visible: false,
      confirmLoading: false,
      editor: null,
      form: this.$form.createForm(this),
      title: '新增机构',
      actionUrlCover: '/api/content-api/fileUpload/uploadImgFile',
      fileList: [],
    }
  },

  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
  },

  methods: {
    moment,
    //初始化方法
    modify(record) {
      this.visible = true
      console.log('444:', record)
      this.reset()
      this.shoudata = record.hospitalName
      this.queryParams.pid = record.pid
      this.hospitalId = record.hospitalId
      this.queryParams.hospitalId = record.hospitalId
      console.log('9999', record.pid, this.queryParams.hospitalId)
      this.getHospitalDetailOut()
      this.getHospitalLevel()
      this.getHospitalType()
      this.getParentList()
    },

    init(introduction) {
      if (this.editor) {
        this.editor.txt.html(introduction)
        return
      }
      this.editor = new E('#div2')
      this.editor.config.height = 600
      this.editor.config.pasteFilterStyle = false
      this.editor.config.onchange = (html) => {
        console.log('editor modify:', html)
        this.queryParams.introduction = html
      }
      // 默认情况下，显示所有菜单
      this.editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'link',
        'list',
        'todo',
        'justify',
        'quote',
        // 'emoticon',
        'image',
        'video',
        'table',
        'code',
        'splitLine',
        'undo',
        'redo',
      ]

      this.editor.config.uploadImgHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      }
      console.log('Vue.ls.get(ACCESS_TOKEN)', Vue.ls.get(ACCESS_TOKEN))

      // 配置 server 接口地址
      this.editor.config.uploadFileName = 'file'
      // editor.config.uploadImgServer = '/api/content-api/fileUpload/uploadImgFileForEdit'
      this.editor.config.uploadImgServer = '/api/wx-api/health/wx/' + appId + '/uploadInnerImg'

      // editor.config.showLinkVideo = false

      //教育文章先不支持视频，所以注释
      this.editor.config.uploadVideoName = 'file'
      this.editor.config.uploadVideoServer = '/api/content-api/fileUpload/uploadVideoFileForEdit'
      this.editor.config.uploadVideoHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      }
      this.editor.create()
      this.editor.txt.html(introduction)
    },

    /**
     * 增加序号
     */
    addNum() {
      this.queryParams.sortedNo++
    },

    /**
     * 减序号
     */
    duleNum() {
      this.queryParams.sortedNo--
      if (this.queryParams.sortedNo <= 0) {
        this.queryParams.sortedNo = 0
      }
    },

    /**
     * 选择
     *
     */
    onSelect(hospitalId, s2) {
      console.log('hospitalId', hospitalId)
      this.queryParams.hospitalId = hospitalId

      //   this.chooseDeptItem = JSON.parse(JSON.stringify(this.originData.find((item) => item.id == departmentId)))
      //   console.log('chooseDeptItem', this.chooseDeptItem)
      //   this.queryParams.appointItemName = this.chooseDeptItem.name
    },

    /**
     * 获取机构详情
     */
    getHospitalDetailOut() {
      queryHospitaldetail({ hospitalId: this.hospitalId })
        .then((res) => {
          if (res.code == 0) {
            // this.queryParams.hospitalId = res.data.pid
            this.queryParams.hospitalCode = res.data.hospitalCode
            this.queryParams.hospitalName = res.data.hospitalName
            this.queryParams.sortedNo = res.data.sortedNo
            this.queryParams.orgType = res.data.orgType.value
            this.queryParams.hospitalType = res.data.hospitalType != null ? res.data.hospitalType.value : ''
            this.queryParams.level = res.data.level != null ? res.data.level.value : ''
            this.queryParams.hisCode = res.data.hisCode
            this.queryParams.middleware = res.data.middleware
            console.log('5555:', this.queryParams.orgType)
            this.$nextTick(() => {
              this.init(res.data.introduction)
            })
            this.fileList = []
            this.fileList.push({
              uid: '-1',
              name: '封面',
              status: 'done',
              url: res.data.imgUrl,
              // media_id: this.checkData.extraData,
            })
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 上级机构
     */
    getParentList() {
      parent().then((res) => {
        if (res.code == 0) {
          this.ParentList = res.data
        }
      })
    },

    /***
     * 机构等级接口
     */
    getHospitalLevel() {
      queryHospitalLevel()
        .then((res) => {
          if (res.code == 0) {
            this.HospitalLevelList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 机构类型
     */
    getHospitalType() {
      queryHospitalType()
        .then((res) => {
          if (res.code == 0) {
            this.HospitalTypeList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
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
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    handleChange(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileList = changeObj.fileList
      } else {
        this.fileList = changeObj.fileList
      }
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    /***
     * 新增租户接口调用
     */
    addHospital() {
      this.confirmLoading = true
      save(this.queryParams)
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.visible = false
            this.$message.success('修改成功')
            this.$emit('ok')
          } else {
            this.$message.error('修改失败:' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    formatDateOut(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    //数组元素去重
    removeDuplicate(arry) {
      const newArry = []
      if (arry != null && arry.length > 0) {
        arry.forEach((item) => {
          if (!newArry.includes(item)) {
            newArry.push(item)
          }
        })
      }
      return newArry
    },

    /**
     *   机构选择
     */
    radioChange(event) {
      //立即发送
      if (event.target.value == 1) {
        this.rangeValue = '1'
        this.queryParams.orgType = 1
        //延时发送
      } else if (event.target.value == 2) {
        this.rangeValue = '2'
        this.queryParams.orgType = 2
      }
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams.hospitalCode = ''
      this.queryParams.hospitalName = ''
      this.queryParams.hospitalId = ''
      this.queryParams.hospitalType = ''
      this.queryParams.imgUrl = ''
      this.queryParams.introduction = ''
      this.queryParams.level = ''
      this.queryParams.middleware = ''
      this.queryParams.orgType = ''
      this.queryParams.pid = ''
      this.queryParams.sortedNo = ''
      this.queryParams.tenantId = ''
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
      this.previewVisible = false
    },

    /**
     * 提交
     */
    handleSubmit() {
      console.log('0000000:', this.queryParams.hospitalId)
      if (this.queryParams.hospitalId === '') {
        this.$message.error('请选择上级机构')
        return
      }

      if (!this.queryParams.hospitalCode) {
        this.$message.error('请输入机构代码')
        return
      }
      if (!this.queryParams.hospitalName) {
        this.$message.error('请输入机构名称')
        return
      }
      if (!this.queryParams.orgType) {
        this.$message.error('请选择机构类型')
        return
      }

      if (this.queryParams.orgType == 2) {
        if (!this.queryParams.hospitalType) {
          this.$message.error('请选择机构类型')
          return
        }
        if (!this.queryParams.level) {
          this.$message.error('请选择机构等级')
          return
        }
        if (!this.queryParams.hisCode) {
          this.$message.error('请输入HIS编码')
          return
        }
        if (!this.queryParams.middleware) {
          this.$message.error('请输入服务地址')
          return
        }
      }

      //组装图片
      //  if (this.fileList.length == 0) {
      //   this.$message.error('请上传图片！')
      //   return
      // } else {
      //   this.queryParams.imgUrl = this.fileList[0].response.data.url
      // }
      if (this.fileList[0].response) {
        this.queryParams.imgUrl = this.fileList[0].response.data.fileLinkUrl
      } else {
        this.queryParams.imgUrl = this.fileList[0].url
      }

      this.addHospital()
    },
  },
}
</script>
        
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