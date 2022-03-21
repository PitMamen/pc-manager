<template>
  <a-modal
    title="科室二维码"
    :width="900"
    :visible="visible"
    :footer="null"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <div>
      <img :src="extraImage" alt="testload" />
    </div>

    <a-button style="margin-top: 2%" type="primary" @click="downLoadPic">下载二维码</a-button>
    >
  </a-modal>
</template>


<script>
import { newDept, getQrUrl } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      // extraImage: 'https://img.lianzhixiu.com/uploads/allimg/202111/9999/4bc94899be.jpg',
      extraImage: 'http://192.168.1.122/content-api/file/I20220310112304297UULIZFA5GH8Z1L-方法.jpg',
      index: -1,

      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    add(record) {
      // this.extraImage = ''
      this.visible = true
      getQrUrl({ ks: record.departmentId, bq: 0 }).then((res) => {
        if (res.code == 0) {
          this.data = res.data
          this.$emit('ok', this.index, this.type)
        } else {
          // this.$message.error('新增失败：' + res.message)
        }
      })
    },

    downLoadPic() {
      // 下载图片
      // const imgUrl = 'https://cn.gravatar.com/avatar/b8ea6205c38fad951b5b02ae22f037c8&d=mm'
      const str = `${new Date().getTime()}.jpg`
      const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      this.commonDownloads(this.extraImage, str, type)
    },

    commonDownloads(imgData, str, type) {
      const blob = new Blob([imgData], { type: type })
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // 兼容ie
        window.navigator.msSaveOrOpenBlob(blob, str)
      } else {
        console.log(imgData)
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象
        downloadElement.href = href
        downloadElement.download = str
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href) // 释放之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
      }
    },

    handleSubmit() {
      if (!this.deptName) {
        this.$message.error('请输入科室名称！')
        return
      }

      newDept({ departmentName: this.deptName, parentId: 0, hospitalId: 1 }).then((res) => {
        if (res.code == 0) {
          this.$message.success('新增成功')
          this.visible = false
          this.$emit('ok', this.index, this.type)
        } else {
          this.$message.error('新增失败：' + res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
