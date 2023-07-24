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
          <div style="width: 20px;"></div>
          <a-input v-model="queryParam.keyWord" @click="goSearch()" allow-clear placeholder="未匹配药品，请点击匹配"
            style="width: 270px" />
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
      <div class="div-line"></div>
    </div>
    <!-- 处方开具 -->
    <div class="div-box" style="margin-top: 15px;">
      <div class="box-title">处方开具</div>
      <div class="box-divider" />
      <div class="div-line"></div>
    </div>
    <!-- 使用说明书 -->
    <div class="div-box" style="margin-top: 15px;">
      <div class="box-title">使用说明书</div>
      <div class="box-divider" />
      <div class="div-line"></div>
    </div>
  </a-card>
</template>

<script>
import { accessHospitals as list2, qryComplaintByPage, saveComplaint } from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import editForm from './editForm'
import { formatDateFull, formatDate } from '@/utils/util'
export default {
  components: {
    STable,
    Ellipsis,
    editForm,
  },
  data() {
    return {
      loading: false,
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
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.queryParam = { ...this.queryParam, ...this.$route.query }
  },
  methods: {

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
  }
}
</style>



