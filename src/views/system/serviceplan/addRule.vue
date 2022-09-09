<template>
  <a-modal
    title="新增"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-order-detail" id="printContent">
        <div class="div-line-wrap">
          <span class="span-item-name"> 计划名称 :</span>
          <span class="span-item-value">{{ planName }} </span>
        </div>

        <a-button class="change-button" type="primary" @click="$refs.changePlan.add()">{{changeText}}</a-button>

        <div class="div-line-wrap">
          <span class="span-item-name"> 所属科室 :</span>
          <span class="span-item-value">{{ selectedDeptname }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 是否开启 :</span>
          <a-popconfirm
            class="switch-button"
            :title="isOpenText"
            ok-text="确定"
            cancel-text="取消"
            @confirm="goOpen(record)"
          >
            <a-switch :checked="isOpen" />
          </a-popconfirm>
        </div>


        <div class="div-line-wrap">

          <a-form-item class="span-item-name" label="管理科室"  has-feedback>
          <a-radio-group
            name="radioGroup"
            style="width: 400px"
            :default-value="3"
            @change="radioChange"
            v-decorator="['roleId', { rules: [{ required: true, message: '请选择科室管理！' }] }]"
          >
          <a-radio class="btn-add-plan" :value="3"> 全院 </a-radio>
            <a-radio :value="4"> 部分科室 </a-radio>         
          </a-radio-group>
        </a-form-item>

        </div>
        
       







        <div class="div-line-wrap" v-if="isshowDepa">
          <span class="span-item-name"> 具体科室 :</span>
          <a-select allow-clear v-model="idArr" mode="multiple" placeholder="请选择科室">
            <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-divider"></div>
      </div>
    </a-spin>
    <change-plan ref="changePlan" @ok="handleChoose" />
  </a-modal>
</template>


<script>
import { saveTemplateRule ,getDepts } from '@/api/modular/system/posManage'
import changePlan from './changePlan'
export default {
  components: {
    changePlan,
    // editForm,
  },

  data() {
    return {
      record:'',
      changeText:'选择',
      selectedtemplateId:'',
      planName:'请选择名称',
      selectedDeptname:'请选择科室',
      originData: [],
      idArr:[],
      isshowDepa:false,
      index: -1,
      isOpenText: '确认开启吗?',
      isOpen: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    add() {
      this.visible = true
    },

    /**
     * 全院  部分科室选择
     */
    radioChange(event) {
      //全院
      if (event.target.value == 3) {
        this.isshowDepa = false
        //部分科室
      } else if (event.target.value == 4) {
       this. isshowDepa = true
      }
    },

    goOpen() {
      if (this.isOpen) {
        this.isOpen = false
      } else {
        this.isOpen = true
      }
      setTimeout(() => {
        this.isOpenText = this.isOpen ? '确定关闭吗？' : '确定开启吗？'
      }, 200)
    },

    //确认按钮
    handleSubmit() {
      if (!this.planName||!this.selectedDeptname) {
        this.$message.error('请选择科室名称！')
        return
      }
      let params 
        if (this.idArr.length > 0) {
          this.idArr.forEach((item, index) => {
            if (index != this.idArr.length - 1) {
              params = params + item + ','
            } else {
              params = params + item
            }
          })
        }
      let data = {
        'ruleStatus': this.isOpen?1:0,
        'templateId':this.selectedtemplateId,
        'usedDept':params,
      }
      console.log('传参：',data)
      this.confirmLoading = true
      saveTemplateRule(data).then((res) => {
        if (res.code == 0) {
          setTimeout(() => {
            this.confirmLoading = false
            this.$message.success('新增成功')
            this.visible = false
            this.$emit('ok')
          }, 1200)
        } else {
          this.confirmLoading = false
          this.$message.error('新增失败：' + res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },

    handleChoose(record){
      console.log("选择的数据啊：",record)
      this.planName = record.templateName
      this.selectedDeptname = record.deptName
      this.selectedtemplateId = record.templateId
      this.changeText = '重新选择'
    }


  },

  created() {
    /** 获取科室*/
    getDepts().then((res) => {
      if (res.code == 0) {
        this.originData = res.data
        res.data.unshift({
          departmentId: '-2',
          departmentName: '全部',
          hospitalId: 1,
          parentId: 0,
          children: null,
        })
     

        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })

    // this.getStatBorData()
  },
}
</script>
<style lang="less">
.div-order-detail {
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
    margin-top: 4%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1.5px;
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 13%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 35%;
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

    .sign-name {
      color: #000;
      font-size: 18px;
      font-family: '楷体', '楷体_GB2312';
      // font-family: 'FZKai-Z03S';
      // font-family: 'LiSu';
      font-style: italic;
    }
  }

  .div-medicine-fang-wrap {
    margin-top: 2%;
    width: 96%;
    margin-left: 2%;
    // height: 100%;
    border-radius: 6px;
    border: 1px solid #e6e6e6;

    .firstItem {
      // border-radius: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .div-medicine-fang-item {
      background-color: white;
      padding: 2% 2%;

      // margin-top: 1%;
      // margin-bottom: 1%;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .div-line-medicine {
        width: 100%;
        margin-top: 1%;
        overflow: hidden;
        .span-item-name {
          width: 15%;
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
        }

        .span-item-value {
          width: 15%;
          color: #333;
          text-align: left;
          padding-left: 10px;
          font-size: 14px;
          display: inline-block;
        }
      }
    }
  }

  .btn-add-plan {
    
    margin-left: 17%;
  }
  .switch-button {
    margin-left: 2%;
  }

  .change-button {
    margin-top: 2%;
    margin-left: 16%;
  }

  .btn-save-plan {
    margin-top: 5%;
    display: block;
    margin-bottom: 10%;
  }
}
.div-detail {
  margin-left: 2%;
  margin-top: 1%;
  color: #1890ff;
  &:hover {
    cursor: pointer;
  }
}
</style>