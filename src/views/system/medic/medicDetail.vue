<template>
  <a-card :bordered="false" :loading="loading">
    <!-- 基本信息 -->
    <div class="div-box">
      <div class="box-title">基本信息</div>
      <div class="box-divider" />
      <div class="div-line">
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;margin-top: 3px;">*</span>药品名称：</div>
          <div class="div-cell-value">
            <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入药品名称" style="width: 210px" />
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>检索码：</div>
          <div class="div-cell-value"> <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入检索码"
              style="width: 210px" /></div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>生产厂商：</div>
          <div class="div-cell-value">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 210px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <div class="div-line">
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>商品名称：</div>
          <div class="div-cell-value">
            <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入商品名称" style="width: 210px" />
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>检索码：</div>
          <div class="div-cell-value"><a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入检索码"
              style="width: 210px" /></div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>药品类型：</div>
          <div class="div-cell-value">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 210px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
      </div>

      <div class="div-line">
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>药品剂型：</div>
          <div class="div-cell-value">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 210px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name">治疗类型：</div>
          <div class="div-cell-value"> <a-select v-model="queryParam.status" placeholder="请选择" allow-clear
              style="width: 210px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name">医保类型：</div>
          <div class="div-cell-value">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 210px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
      </div>

      <div class="div-line">
        <div class="div-cell">
          <div class="div-cell-name">药理分类：</div>
          <div class="div-cell-value">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 210px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name">医保编码：</div>
          <div class="div-cell-value"><a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入检索码"
              style="width: 210px" /></div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name">商品条形码：</div>
          <div class="div-cell-value">
            <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入商品条形码" style="width: 210px" />
          </div>
        </div>
      </div>

      <div class="div-line" style="margin-bottom: 10px;">
        <div class="div-cell">
          <div class="div-cell-name">批准文号：</div>
          <div class="div-cell-value">
            <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入商品名称" style="width: 210px" />
          </div>
        </div>
        <div class="div-cell">
          <!-- <div style="width: 20px;"></div>
          <a-input v-model="queryParam.keyWord" @click="goSearch()" allow-clear placeholder="未匹配药品，请点击匹配"
            style="width: 270px" /> -->

          <div class="div-cell-name">监管编码：</div>
          <div class="div-cell-value">
            <a-input v-model="queryParam.keyWord" @click="goSearch()" allow-clear placeholder="未匹配药品，请点击匹配"
              style="width: 210px" />
          </div>
          <!-- <div class="div-cell-name"><span style="color: #F90505;">*</span>检索码：</div>
          <div class="div-cell-value"><a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入检索码"
              style="width: 210px" /></div> -->
        </div>

      </div>

    </div>
    <!-- 规格计费 -->
    <div class="div-box" style="margin-top: 15px;">
      <div class="box-title">规格计费</div>
      <div class="box-divider" />
      <!-- 上下两行一一对应，才能保证宽度一致对其 -->
      <div class="div-line" style="padding: 20px;margin-top: 0; ">
        <div class="div-shu-cell" style="width: 100px;">
          <div><span style="color: #F90505;">*</span>含量系数</div>
          <div style="margin-top: 10px;">
            <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入" />
          </div>
        </div>

        <div class="div-shu-cell" style="width: 100px;margin-left: 20px;">
          <div><span style="color: #F90505;">*</span>剂量单位</div>
          <div style="margin-top: 10px;">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 100px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div style="margin-top: 30px;margin-left: 10px;">*</div>

        <div class="div-shu-cell" style="width: 100px;margin-left: 10px;">
          <div><span style="color: #F90505;">*</span>含量系数</div>
          <div style="margin-top: 10px;">
            <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入" />
          </div>
        </div>


        <div class="div-shu-cell" style="width: 100px;margin-left: 20px;">
          <div><span style="color: #F90505;">*</span>基本单位</div>
          <div style="margin-top: 10px;">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 100px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div style="margin-top: 30px;margin-left: 10px;">/</div>

        <div class="div-shu-cell" style="width: 100px;margin-left: 10px;">
          <div><span style="color: #F90505;">*</span>包装单位</div>
          <div style="margin-top: 10px;">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 100px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="div-shu-cell" style="width: 200px;margin-left: 20px;">
          <div><span style="color: #F90505;">*</span>规格描述</div>
          <div style="margin-top: 10px;">
            <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入" />
          </div>
        </div>

        <div class="div-shu-cell" style="width: 200px;margin-left: 20px;">
          <div><span style="color: #F90505;">*</span>参考价格</div>
          <div style="margin-top: 10px;">
            <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入" />
          </div>
        </div>

        <div class="div-shu-cell" style="width: 100px;margin-left: 20px;">
          <div><span style="color: #F90505;">*</span>计费方式</div>
          <div style="margin-top: 10px;">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 100px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>

      </div>

    </div>
    <!-- 处方开具 -->
    <div class="div-box" style="margin-top: 15px;">
      <div class="box-title">处方开具</div>
      <div class="box-divider" />
      <div class="div-line" style="margin-bottom: 10px;">
        <a-checkbox @click="goAgin()" :checked="isAgain" style="margin-left: 20px;" />
        <span style="margin-left: 10px;color:#409EFF ;">处方药品</span>

        <a-checkbox @click="goAgin()" :checked="isAgain" style="margin-left: 20px;" />
        <span style="margin-left: 10px;color:#409EFF ;">贵重药品</span>

        <a-checkbox @click="goAgin()" :checked="isAgain" style="margin-left: 20px;" />
        <span style="margin-left: 10px;color:#409EFF ;">剧毒药品</span>
      </div>

      <div class="div-line" style="margin-bottom: 10px;margin-top: 10px;">


        <div class="div-shu-cell" style="width: 100px;">
          <div class="div-shu-cell-ori" >
            <a-checkbox @click="goAgin()" :checked="isAgain" style="margin-left: 20px;" />
            <span style="margin-left: 10px;color:#409EFF ;">精神药品</span>
          </div>

          <div class="div-shu-cell-ori" style="margin-top: 20px;">
            <span style="margin-left: 10px ;width: 100px;text-align: right;">默认剂量：</span>
          </div>
        </div>

        <div class="div-shu-cell" style="width: 300px;margin-left: 0;">
          <div class="div-shu-cell-ori">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 300px; ">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>

          <div class="div-shu-cell-ori" style="width: 300px;margin-top: 10px;">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 300px; ">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="div-shu-cell" style="width: 100px;">
          <div class="div-shu-cell-ori">
            <a-checkbox @click="goAgin()" :checked="isAgain" style="margin-left: 20px;" />
            <span style="margin-left: 10px;color:#409EFF ;">麻醉药品</span>
          </div>

          <div class="div-shu-cell-ori" style="margin-top: 20px;">
            <span style="margin-left: 10px ;width: 100px;text-align: right;">默认用法：</span>
          </div>
        </div>

        <div class="div-shu-cell" style="width: 300px;margin-left: 0;">
          <div class="div-shu-cell-ori">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 300px; ">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>

          <div class="div-shu-cell-ori" style="width: 300px;margin-top: 10px;">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 300px; ">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>


        <div class="div-shu-cell" style="width: 100px;">
          <div class="div-shu-cell-ori">
            <a-checkbox @click="goAgin()" :checked="isAgain" style="margin-left: 20px;" />
            <span style="margin-left: 10px;color:#409EFF ;">抗菌药品</span>
          </div>

          <div class="div-shu-cell-ori" style="margin-top: 20px;">
            <span style="margin-left: 10px ;width: 100px;text-align: right;">默认频次：</span>
          </div>
        </div>

        <div class="div-shu-cell" style="width: 300px;margin-left: 0;">
          <div class="div-shu-cell-ori">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 300px; ">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>

          <div class="div-shu-cell-ori" style="width: 300px;margin-top: 10px;">
            <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 300px; ">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>




      </div>
    </div>
    <!-- 使用说明书 -->
    <div class="div-box" style="margin-top: 15px;">
      <div class="box-title">使用说明书</div>
      <div class="box-divider" />
      <div id="div11" style="padding: 10px;"></div>
      <!-- <div class="div-line"></div> -->
    </div>
  </a-card>
</template>

<script>
import { accessHospitals as list2, qryComplaintByPage, saveComplaint } from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import { formatDateFull, formatDate } from '@/utils/util'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

import E from 'wangeditor'
export default {
  components: {
    STable,
    Ellipsis,
  },
  data() {
    return {
      loading: false,
      isAgain: false,
      // 审核状态 1未审核2已审核3未登记
      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '未审核',
        },
        {
          id: 2,
          name: '已审核',
        },
        {
          id: 3,
          name: '未登记',
        },
      ],
      headers: {
        Authorization: '',
      },
      content: '',
      editor: {},
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.queryParam = { ...this.queryParam, ...this.$route.query }
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
  },
  mounted() {
    this.$nextTick(() => {
      this.initEditor()
    })
  },
  methods: {
    initEditor() {
      if (this.editor.isEnable) {
        return
      }
      var editor = new E('#div11')

      editor.config.height = 430
      editor.config.pasteFilterStyle = false
      console.log('editor', editor)
      console.log('editorconfig', editor.config)
      editor.config.onchange = (html) => {
        this.content = html
      }
      // 默认情况下，显示所有菜单
      editor.config.menus = [
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

      editor.config.uploadImgHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      }

      // 配置 server 接口地址
      editor.config.uploadFileName = 'file'
      editor.config.uploadImgServer = '/api/content-api/fileUpload/uploadImgFileForEdit'
      // editor.config.uploadImgServer = '/api/wx-api/health/wx/' + appId + '/uploadInnerImg'

      // editor.config.showLinkVideo = false

      //教育文章先不支持视频，所以注释
      editor.config.uploadVideoName = 'file'
      editor.config.uploadVideoServer = '/api/content-api/fileUpload/uploadVideoFileForEdit'
      editor.config.uploadVideoHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      }

      /**
       * 插入视频写法：
       *
       * <iframe frameborder="0" src="https://v.qq.com/txp/iframe/player.html?vid=n0020yrnly7" allowFullScreen="true"></iframe>
       * <iframe frameborder="0" src="https://vd3.bdstatic.com/mda-nit9wfd413e2xjsh/sc/cae_h264/1664351398486048214/mda-nit9wfd413e2xjsh.mp4?v_from_s=hkapp-haokan-hbf&auth_key=1664420478-0-0-ee34ef2d3450dbb1901bde7ab5ebd63b&bcevod_channel=searchbox_feed&pd=1&cd=0&pt=3&logid=1878163596&vid=7560524968628684931&abtest=104960_1-104959_1&klogid=1878163596" allowFullScreen="true"></iframe>
       *
       */

      editor.create()
      this.editor = editor
    },

    goAgin() {
      // 随访名单更新时需重新匹配：0不匹配1匹配
      this.isAgain = !this.isAgain
      // this.projectData.basePlan.updateMatchStatus = this.isAgain ? 1 : 0
    },

    goSearch() {
      this.$router.push({ path: './medicSearch' })
    },

  },
}
</script>

<style lang="less" scoped>
button {
  margin-right: 8px;
}
</style>
<style lang="less" scoped>
.div-box {
  border: 1px solid #E6E6E6;
  display: flex;
  flex-direction: column;
  font-size: 12px;

  .box-title {
    color: #1A1A1A;
    font-weight: bold;
    font-size: 14px;
    padding: 10px 20px;
  }

  .box-divider {
    height: 1px;
    background-color: #E6E6E6;
  }

  .div-line {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .div-cell {
      width: 30%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .div-cell-name {
        width: 80px;
        text-align: right;
      }

      .div-cell-value {}
    }

    .div-shu-cell {
      display: flex;
      flex-direction: column;

      .div-shu-cell-ori {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

    }
  }
}
</style>



