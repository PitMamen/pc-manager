<template>
  <a-modal
    :title="titleTop"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <div class="display-item">
      <a-button type="primary" style="margin-left: 20px; margin-left: auto" @click="exportes()">导出</a-button>
    </div>
    <div class="line"></div>
    <s-table
      ref="table"
      size="default"
      style="margin-left: 2px; height: 450px; margin-top: 20px; margin-bottom: 35px; overflow-y: auto"
      :columns="columns"
      :scroll="{ x: true }"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
    </s-table>
  </a-modal>
</template>
    
            
    <script>
import { transfer, statReferralPatientDetail, exportReferralPatient } from '@/api/modular/system/posManage'
import { STable } from '@/components'
import Vue from 'vue'
import { TRUE_USER } from '@/store/mutation-types'
import { formatDate, formatDateFull } from '@/utils/util'
export default {
  components: {
    STable,
  },
  data() {
    return {
      docName: '',
      titleTop: '',
      rangeValue: 1,
      dataInfo: [],
      queryParams: {
        hospitalCode: '',
        statBegin: '',
        statEnd: '',
        statType: 0,
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '转诊类型',
          dataIndex: 'type',
        },
        {
          title: '转出方式',
          dataIndex: 'tradeTypeName',
        },
        {
          title: '审核结果',
          dataIndex: 'statusName',
        },
        {
          title: '患者姓名',
          dataIndex: 'name',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '身份证号',
          dataIndex: 'idNo',
        },
        {
          title: '审核日期',
          dataIndex: 'outCheckTime',
        },
        {
          title: '转出机构',
          dataIndex: 'outHospitalName',
        },
        {
          title: '转入机构',
          dataIndex: 'inHospitalName',
        },
      ],

      loadData: (parameter) => {
        return statReferralPatientDetail(Object.assign(parameter, this.queryParams)).then((res) => {
          //组装控件需要的数据结构
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.totalRows,
            totalPage: res.data.totalPage / parameter.pageSize,
            rows: res.data.rows,
          }

          if (data.rows) {
            //设置序号
            data.rows.forEach((item, index) => {
              item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
            })
          }
          return data
        })
      },
    }
  },

  methods: {
    //初始化方法
    detail(record, title, type) {
      this.visible = true
      this.clearData()
      this.queryParams.hospitalCode = record.hospitalCode
      this.queryParams.statBegin = record.beginTime
      this.queryParams.statEnd = record.endTime
      this.queryParams.statType = type

      this.titleTop = record.hospitalName + '-' + title + '【' + record.beginTime + ' 至 ' + record.endTime + '】'

      this.$refs.table.refresh()
    },

    // 导出
    exportes() {
      // this.queryParams.billMonth = this.formatDate(this.queryParams.billMonth).substring(0, 7)
      let params = JSON.parse(JSON.stringify(this.queryParams))
      exportReferralPatient(params)
        .then((res) => {
          this.downloadfile(res)
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
    },

    downloadfile(res) {
      var blob = new Blob([res.data], { type: 'application/msexcel; charset=UTF-8' })
      var contentDisposition = res.headers['content-disposition']
      var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      var result = patt.exec(contentDisposition)
      var filename = result[1]
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      var reg = /^["](.*)["]$/g
      downloadElement.style.display = 'none'
      downloadElement.href = href
      downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href)
    },

    clearData() {
      this.queryParams.hospitalCode = ''
      this.queryParams.statBegin = ''
      this.queryParams.statEnd = ''
      this.queryParams.statType = ''
    },

    /**
     * 随访医生列表
     */
    // statReferralPatientDetailOut(requestData) {
    //   this.confirmLoading = true
    //   statReferralPatientDetail(requestData)
    //     .then((res) => {
    //       if (res.code == 0) {
    //         var data = {
    //           pageNo: parameter.pageNo,
    //           pageSize: parameter.pageSize,
    //           totalRows: res.data.total,
    //           totalPage: res.data.total / parameter.pageSize,
    //           rows: res.data.rows,
    //         }

    //         data.rows.forEach((item) => {
    //           this.$set(item, 'leixing', item.referralType.description)
    //           this.$set(item, 'xh', (res.data.pageNo - 1) * data.pageSize + (index + 1))
    //         })

    //         return res.data.rows
    //       }
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
    },

    /**
     * 提交
     */
    handleSubmit() {
      this.visible = false
    },
  },
}
</script>
  
  
   <style lang="less" scoped>
/deep/.ant-radio-wrapper {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  // font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: 'tnum';
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  vertical-align: sub;
  outline: none;
  cursor: pointer;
  margin-bottom: 3px !important;
}

/deep/.ant-radio-inner {
  position: relative;
  top: 0;
  left: 0;
  display: block;
  width: 16px;
  height: 16px;
  background-color: #fff;
  border-color: #d9d9d9;
  border-style: solid;
  border-width: 1px;
  border-radius: 100px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
</style>
  
    
    
    <style lang="less">
.display-item {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  /* // justify-content: center; */
  /* // margin-top: -20px; */
}

.ant-radio-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: 'tnum';
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  margin-right: 28px;
  white-space: nowrap;
  cursor: pointer;
  margin-bottom: 3px;
}
</style>