<template>
  <a-modal
    title="病区二维码"
    :width="900"
    :visible="visible"
    :footer="null"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <!-- <div class="canvas_box" id="mycanvas" ref="mycanvas">
      <img style="overflow: hidden; width: 60%; margin-left: 20%" :src="extraImage" />
    </div> -->
    <div class="div-notice-rea">右键点击下方二维码选择【图片另存为】并添加.png或者.jpg的后缀进行保存！</div>
    <!-- onClick="imageClick" -->
    <div :key="imgKeyArea">
      <img :src="record.url" alt="testload" />
    </div>

    <a-button v-show="false" style="margin-top: 2%" type="primary" @click="downLoadPic">下载二维码</a-button>
    <!-- <a style="display: block; margin-top: 2%; margin-left: 45%" :href="extraImage" target="blank" download
      >下载二维码</a -->
  </a-modal>
</template>


<script>
import { newDept, getQrUrl } from '@/api/modular/system/posManage'
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      extraImage:
        'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQEp8TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAybnJwWDBDSjBlOUMxMDAwME0wN3gAAgQF0DZiAwQAAAAA',
      index: -1,

      confirmLoading: false,
      visible: false,
      record: {},
      imgKeyArea: '',
    }
  },

  watch: {
    visible() {
      if (this.visible) {
        this.imgKeyArea = ''
      } else {
        this.imgKeyArea = Math.random()
      }
      console.log('this.imgKeyArea :>> ', this.imgKeyArea)
    },
  },

  methods: {
    //初始化方法
    add(record) {
      this.record = {}
      this.record = record
      this.visible = true

      getQrUrl({ ks: 0, bq: record.id }).then((res) => {
        if (res.code == 0) {
          this.$set(this.record, 'url', res.data)
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

    saveImg(val) {
      window.pageYoffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      // 先获取你要转换为img的dom节点
      var node = document.getElementById(val) //传入的id名称
      // console.log("node", node);
      var width = node.offsetWidth //dom宽
      var height = node.offsetHeight //dom高
      var scale = 2 //放大倍数 这个相当于清晰度 调大一点更清晰一点
      html2canvas(node, {
        width: width,
        heigth: height,
        backgroundColor: '#ffffff', //背景颜色 为null是透明
        dpi: window.devicePixelRatio * 2, //按屏幕像素比增加像素
        scale: scale,
        X: 0,
        Y: 0,
        scrollX: -3, //如果左边多个白边 设置该偏移-3 或者更多
        scrollY: 0,
        useCORS: true, //是否使用CORS从服务器加载图像 !!!
        allowTaint: true, //是否允许跨域图像污染画布  !!!
      }).then((canvas) => {
        // console.log("canvas", canvas);
        var url = canvas.toDataURL() //这里上面不设值cors会报错
        var a = document.createElement('a') //创建一个a标签 用来下载
        a.download = 'qrCode' //设置下载的图片名称
        var event = new MouseEvent('click') //增加一个点击事件
        a.href = url //此处的url为base64格式的图片资源
        a.dispatchEvent(event) //触发a的单击事件 即可完成下载
      })
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
<style lang="less">
.div-notice-area {
  width: 100% !important;
  overflow: hidden;

  text-align: left;
  font-size: 15px;
  margin-top: 2px;
  width: 98px;
  color: #333;
}
</style>