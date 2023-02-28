<template>
  <a-modal
    :title="title"
    :width="1000"
    :height="950"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="false"
  >
    <a-card :bordered="false" class="card-top-pac1">
      <div class="table-page-wrapper" style="margin-top: -1%;margin-left: 0px;">
        <div class="div-line-wrap">
          <span class="span-item-name"><span style="color: red">*</span> 名单描述 :</span>
          <a-input
            v-model="metaName"
            class="span-item-value"
            :maxLength="30"
           
            allow-clear
            placeholder="请输入内容"
            @blur="changeName()"
            @keyup.enter="changeName()"
            @search="changeName()"
          />

          <span class="span-item-name" style="margin-left: 100px"><span style="color: red">*</span> 数据库表 :</span>
          <a-input
            v-model="queryParam.databaseTableName"
            class="span-item-value"
            :maxLength="30"
           
            allow-clear
            @blur="focus()"
            @keyup.enter="focus()"
            @search="focus()"
          />

          <span class="span-item-name" style="margin-left:  100px"><span style="color: red">*</span> 支持分类查询 :</span>
          <!-- <a-popconfirm class="switch-button" style="margin-left: 1%"> -->
          <a-switch :checked="isOpen" @click="Enable" style="margin-left: 1%" />
          <!-- </a-popconfirm> -->
        </div>

        <div class="div-line-wrap">
          <span v-show="failShow" class="span-item-name"
            ><span style="color: red; margin-left: 345px">当前表名不符合名单建立要求,请重新选择</span>
          </span>
        </div>
      </div>
      <a-table
        style="margin-top: 2%; overflow-y: auto; height: 500px;width: 1000px;margin-right: 50px;"
        ref="table"
        size="default"
        :scroll="{ y: 400, x: 0 }"
        :pagination="false"
        :data-source="loadData"
        :columns="columns"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="show" slot-scope="text, record">
          <a-checkbox v-model="record.show" @change="shwoChange(record)"></a-checkbox>
        </span>

        <span slot="index" slot-scope="text, record">
          <a-checkbox v-model="record.wysy" @change="isOnlyIndex(record)"></a-checkbox>
        </span>

        <span slot="eleDes" slot-scope="text, record">
          <a-input
            v-model="record.fieldComment"
            v-if="record.defaultField != null && record.defaultField.value == 2"
            class="span-item-value"
            :maxLength="30"
            style="display: inline-block; width: 90px; margin-right: 20px"
            allow-clear
            @blur="changeDes(record)"
          />
          <span v-if="record.defaultField != null && record.defaultField.value == 1">{{
            record.fieldComment != null ? record.fieldComment : ''
          }}</span>
        </span>

        <span slot="fileDes" slot-scope="text, record">
          <a-select
            style="width: 90px; margin-right: 20px"
            v-if="record.defaultField != null && record.defaultField.value == 2"
            v-model="record.fieldArchives.description"
            @select="selectDes(record)"
          >
            <a-select-option v-for="(item, index) in dazdList" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
          <span v-if="record.defaultField != null && record.defaultField.value == 1">{{
            record.fieldArchives != null ? record.fieldArchives.description : ''
          }}</span>
        </span>


       <!-- 显示序号 -->
        <span slot="showIndex" slot-scope="text, record">
          <a-input
           type="number"
           :min="0"
           :placeholder="请输入正整数"
           :disabled="isDisable(record.show)"
          v-if="record.defaultField != null && record.defaultField.value == 2"
            v-model="record.showIndex"
            class="span-item-value"
            :maxLength="30"
            style="display: inline-block; width:60px; margin-right: 20px;padding-right:0px"
          />
        </span>

        <!-- 查询条件 -->
        <span slot="queryCriteria" slot-scope="text, record">
          <a-checkbox  v-if="record.defaultField != null && record.defaultField.value == 2" v-model="record.isQryC" @change="isQuery(record)"></a-checkbox>
        </span>

        


      </a-table>
    </a-card>
  </a-modal>
</template>


<script>
import { checkDetail, updateMetaConfigure, saveMetaConfigure } from '@/api/modular/system/posManage'
import { STable } from '@/components'
import { number } from 'yargs'
export default {
  components: {
    STable,
  },
  data() {
    return {
      clickTtime: new Date().getTime(),
      failShow: false,
      title: '新增名单',
      loadData: [],
      id: '', //表名ID
      isOpen: false,
      record: {},
      metaName: '',
      queryParam: {
        databaseTableName: '',
        metaName: '',
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
      detailList: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      dazdList: [
        { code: 0, value: '无' },
        { code: 1, value: '紧急联系人' },
        { code: 2, value: '紧急电话' },
        { code: 3, value: '微信OpenID' },
      ],

      // 表头
      columns: [
        {
          title: '字段编码',
          dataIndex: 'zdbm',
          width: 100,
        },
        {
          title: '字段描述',
          scopedSlots: { customRender: 'eleDes' },
          // width: 200,
        },
        {
          title: '字段类型',
          dataIndex: 'zdlx',
          width: 100,
        },
        {
          title: '字段大小',
          dataIndex: 'fieldLength',
          width: 100,
        },
        {
          title: '默认值',
          dataIndex: 'DefaultValue',
          width: 100,
        },
        {
          title: '档案字段',
          // dataIndex: 'dazd',
          scopedSlots: { customRender: 'fileDes' },
          // width: 200,
        },
        {
          title: '显示',
          dataIndex: 'show',
          scopedSlots: { customRender: 'show' },
          width: 80,
        },

        {
          title: '显示序号',
          scopedSlots: { customRender: 'showIndex' },
          width: 100,
        },


        {
          title: '查询条件',
          scopedSlots: { customRender: 'queryCriteria' },
          width: 80,
        },

        {
          title: '唯一索引',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 80,
        },
      ],
    }
  },
  methods: {
    //初始化方法
    add() {
      this.visible = true
      this.loadData = null
      this.failShow = false
      this.queryParam.databaseTableName = null
      this.metaName = ''
    },

    //根据输入的表名查询 数据
    quryCheckDetail(queryParamData) {
      // console.log('请求参数：', queryParamData)
      this.confirmLoading = true
      checkDetail(queryParamData)
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0 && res.data.length > 0) {
            this.failShow = false
            var dataItem = res.data[0]
            this.id = dataItem.id
            this.queryParam.metaName = dataItem.metaName
          
            dataItem.detail = dataItem.detail.filter(function(item){
              return  item.tableField!='id'
            })
            dataItem.detail.forEach((item, index) => {
              this.$set(item, 'zdbm', item.tableField)
              this.$set(item, 'zdlx', item.fieldType != null ? item.fieldType.description : '')
              if (item.fieldArchives == null) {
                this.$set(item, 'fieldArchives', { description: '' })
              }
              this.$set(item, 'show', item.showStatus != null && item.showStatus.value == 1)
              this.$set(item, 'wysy', item.uniqueIndexStatus != null && item.uniqueIndexStatus.value == 1)
              this.$set(item, 'DefaultValue', item.fieldDefaultValue != null ? item.fieldDefaultValue : '')
              this.$set(item, 'isQryC', item.isQryCondition != null && item.isQryCondition.value == 1)
            })
            this.detailList = dataItem.detail
            this.loadData = dataItem.detail
          } else {
            this.failShow = true
            //重置数据
            this.detailList = null
            this.loadData = null
          }

          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    // 显示序号 输入框是否禁用
    isDisable(value){
     if(value==1){
      return false
     }else{
      return true
     }
    },

    //失去焦点 查询
    focus() {
      var queryParamData = {
        databaseTableName: this.queryParam.databaseTableName,
      }
      this.quryCheckDetail(queryParamData)
    },

    //修改名单描述
    changeName() {
      var queryParamData = {
        id: this.id,
        metaName: this.metaName,
      }
      // this.updateMetaConfigure(queryParamData)
    },

    //修改字段描述
    changeDes(record) {
      var queryParam = {
        id: this.id,
        detail: [
          {
            id: record.id,
            fieldComment: record.fieldComment,
          },
        ],
      }
      console.log('sss:', queryParam)
      // this.saveMetaConfigure(queryParam)
    },
   
    /**
     * 显示序号
     */
     inputIndex(record){

     },

    /**
     * 查询条件
     */
     isQuery(record){

     },




    /**
     * 选择档案字段
     * @param
     */
    selectDes(record) {
      console.log('papapapap', record.fieldArchives) //2
    },

    //更新名单
    updateMetaConfigure(queryParamData) {
      this.confirmLoading = true
      updateMetaConfigure(queryParamData)
        .then((res) => {
          if (res.success) {
            this.$emit('ok')
          } else {
            this.$message.error('编辑失败：' + res.message)
          }
          this.confirmLoading = false
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //保存名单
    saveMetaConfigureOut(queryParam) {
      this.confirmLoading = true
      saveMetaConfigure(queryParam)
        .then((res) => {
          if (res.success) {
            this.$message.success('新增成功')
            this.$emit('ok')
            this.visible = false
          } else {
            this.$message.error('新增失败：' + res.message)
          }
          // this.confirmLoading = false
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    // 是否显示
    shwoChange(record) {
      if (record.showStatus.value == 1) {
        // this.isShow = true
      } else {
        // this.isShow = false
      }
    },

    //是否 唯一索引
    isOnlyIndex(record) {
      if (record.uniqueIndexStatus.value == 1) {
        this.onlyIndex = true
      } else {
        this.onlyIndex = false
      }
    },

    /**
     *
     * 状态开关  这里每操作一次 调用一次接口
     */
    Enable() {
      this.isOpen = !this.isOpen
      console.log("是否支持：",this.isOpen)
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    /**
     * 提交
     */
    handleSubmit() {
      // repeatclickFun()
      // console.log('重复点击啊：', this.repeatclickFun())
      let detailListTemp = JSON.parse(JSON.stringify(this.detailList))
      detailListTemp.forEach((item, index) => {
        item.defaultField = item.defaultField != null ? item.defaultField.value : 2 //是否缺省值
        item.fieldComment = item.fieldComment //字段描述
        var value = 0
        // console.log("防晒霜111:",item.fieldArchives.description)
        if (item.fieldArchives != null) {
          if (item.fieldArchives.description === '紧急联系人' || item.fieldArchives.description == 1) {
            value = 1
          } else if (item.fieldArchives.description === '紧急电话' || item.fieldArchives.description == 2) {
            value = 2
          } else if (item.fieldArchives.description === '无' || item.fieldArchives.description == 0) {
            value = 0
          }
          item.fieldArchives = item.fieldArchives != null ? value : '' //档案字段
          // console.log("防晒霜222:",item.fieldArchives)
        } else {
          item.fieldArchives = item.fieldArchives != null ? item.fieldArchives.description : '' //档案字段
        }
        // item.fieldArchives = item.fieldArchives  //档案字段
        item.status=this.isOpen ? 1 : 2,
        item.fieldType = item.fieldType.value //字段类型
        item.showStatus = item.show ? 1 : 2 //是否显示
        item.uniqueIndexStatus = item.wysy ? 1 : 2 //是否唯一索引
        item.metaName = this.metaName //名单描述
        item.showIndex = item.showIndex  //显示序号
        item.isQryCondition = item.isQryC ? 1 : 0// 查询条件
      })

      let queryData = {
        status: this.isOpen ? 1 : 2, //状态
        databaseTableName: this.queryParam.databaseTableName,
        metaName: this.metaName,
        qryFlag:  this.isOpen ? 1 : 0, //是否支持分类查询
        detail: detailListTemp,
      }
      if (this.repeatclickFun()) {
        // console.log('执行调用---')
        if (queryData.metaName == null || queryData.metaName == '') {
          this.$message.error('请输入名单描述!')
          return
        }
        this.saveMetaConfigureOut(queryData)
      } else {
        this.$message.error('请勿重复操作!')
      }
    },

    /**
     * 防重复点击
     */
    repeatclickFun() {
      let delta = Date.now() - this.clickTtime //计算两次点击时间差
      this.clickTtime = Date.now()
      console.log('OOOOO', delta)
      if (delta > 0 && delta <= 500) {
        //双击事件
        console.log('双击事件')
        return false
      } else {
        //滑动事件
        console.log('单击事件')
        return true
      }
    },
  },
}
</script>

<style lang="less" scoped>
 

.table-page-wrapper {
  /deep/.ant-spin-nested-loading{
    margin-right: 50px !important;
  }
  .div-line-wrap {
      width: 100%;
      overflow: hidden;
      margin-bottom: 20px;

     

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 12px;
          text-align: left;
          margin-right: 10px;
         
        }
        .span-item-value {
          width: 200px;
          color: #333;
          text-align: left;
          font-size: 12px;
          display: inline-block;
        }
        .ant-select {
          width: 295px !important;
        }
      
    }
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
.card-top-pac1 {
  .ant-spin-nested-loading {
      margin-right: 55px !important;
  }
}
</style>