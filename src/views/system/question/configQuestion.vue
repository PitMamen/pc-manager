<template>
  <a-card :bordered="false" class="sys-card" >
    <div style="margin-top: 15px; height: 100%">
      <iframe
        defer="true"
        :src="questionUrl"
        style="width: 100%; height: 100%; overflow: scroll"
        frameborder="0"
        scrolling="yes"
      >
      </iframe>
    </div>
  </a-card>
</template>
  
  <script>
import { STable } from '@/components'
import moment from 'moment'
import { getDepartmentListForSelect, getQuestionnaireList, queryHospitalList } from '@/api/modular/system/posManage'
import { formatDate, getDateNow, getlastMonthToday } from '@/utils/util'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import addForm from './addForm'
import editForm from './editForm'
import modifyquestion from './modifyquestion'
import addquestion from './addquestion'
import { type } from 'os'

export default {
  components: {
    STable,
    addForm,
    editForm,
    modifyquestion,
    addquestion,
  },

  data() {
    return {
      questionUrl: '',
      jumpData: {},
    }
  },


  activated() {
    // if(to.path.indexOf('configQuestion')>-1){   //判断是否为当前页面
      console.log('KKK:',this.$route.query.data)
        if(this.$route.query.data){
          var jumpData =JSON.parse(this.$route.query.data)
          this.init(jumpData)
        }
        // }
  },


  // watch1: {
  //   deep:true,
  //   immediate:true,
  //   $route(to, from) {
  //     console.log('KKK:',this.$route.query.data)
  //     if(to.path.indexOf('configQuestion')>-1){   //判断是否为当前页面
  //       if(this.$route.query.data){
  //         var jumpData =JSON.parse(this.$route.query.data)
  //         this.init(jumpData)
  //       }
  //       }
       
  //   },
  // },

  created() {
    console.log('执行222222')
    // this.init(undefined)
    
  },

  methods: {
    init(jumpData) {
      if (jumpData.type == 2) {
        this.questionUrl =
          jumpData.url +
          '/project/form?key=' +
          jumpData.key +
          '&departmentId=' +
          jumpData.departmentId +
          '&hospitalCode=' +
          jumpData.hospitalCode +
          '&title=' +
          jumpData.title
      }else if(jumpData.type==1){
        // http://192.168.1.121/project/form/editor?key=1a8dd857616943e9a1ffd66aa1c0dc21&active=editor&departmentId=11&hospitalCode=2222&title=sssss
        this.questionUrl =
          jumpData.url +
          '/project/form/editor?key=' +
          jumpData.key +
          '&active=editor&departmentId='+
          jumpData.departmentId +
          '&hospitalCode='+
          jumpData.hospitalCode +
          '&title=' +
          jumpData.title

      }
      console.log('地址：', this.questionUrl)
    },
  },
}
</script>
  
  <style lang="less" scoped>
button {
  margin-right: 8px;
}

.title {
  background: #fff;
  font-size: 18px;
  font-weight: bold;
  color: #000;
}
.table-wrapper {
  // max-height: 600px;
  // overflow-y: auto;
}
.sys-card {
  // height: 100%;
  // padding-bottom: 52px;
  // /deep/ .ant-table-pagination {
  //   position: fixed;
  //   right: 32px;
  //   bottom: 20px;
  // }
}
.table-page-search-wrapper {
  padding-bottom: 20px !important;
  margin-top: -1px !important;
  padding-top: 8px;
  border-bottom: 1px solid #e8e8e8;
  // li {
  //   height: 24px;
  //   margin-top: 1px !important;
  //   line-height: 22px;
  // }
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
    /deep/.ant-select-selection__rendered {
      margin-top: -2px !important;
    }

    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    .name {
      margin-right: 10px;
    }
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>
  
  <style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 20px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 104px);
      &.tableStat {
        height: calc(100% - 56px);
      }
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 48px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
.ant-tabs {
  height: calc(100% + 17px);
  /deep/ .ant-tabs-content {
    height: calc(100% - 60px);
    .ant-tabs-tabpane {
      height: 100%;
    }
  }
}
</style>
  