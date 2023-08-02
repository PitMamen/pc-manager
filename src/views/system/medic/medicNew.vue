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
            <a-input v-model="medicData.genericName" allow-clear placeholder="请输入药品名称" style="width: 210px" />
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>检索码：</div>
          <div class="div-cell-value"> <a-input disabled v-model="medicData.genericCcronym" allow-clear placeholder="自动生成"
              style="width: 210px" /></div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>生产厂商：</div>
          <div class="div-cell-value">
            <a-auto-complete v-model="medicData.manufacturerId" placeholder="请输入选择" option-label-prop="title"
              @select="onSelectManu" @search="handleSearchManu" style="width: 210px; height: 28px">
              <template slot="dataSource">
                <a-select-option v-for="(item, index) in manuDatas" :title="item.factoryName" :key="index + ''"
                  :value="item.id + ''">{{
                    item.factoryName
                  }}</a-select-option>
              </template>
            </a-auto-complete>
            <!-- <a-select v-model="medicData.manufacturerName" placeholder="请选择" allow-clear
              style="width: 210px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select> -->
          </div>
        </div>
      </div>
      <div class="div-line">
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>商品名称：</div>
          <div class="div-cell-value">
            <a-input v-model="medicData.tradeName" allow-clear placeholder="请输入商品名称" style="width: 210px" />
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>检索码：</div>
          <div class="div-cell-value"><a-input disabled v-model="medicData.tradeAcronym" allow-clear placeholder="自动生成"
              style="width: 210px" /></div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>药品类型：</div>
          <div class="div-cell-value">
            <a-select v-model="medicData.drugTypeId" placeholder="请选择" @select="onSelectType" allow-clear
              style="width: 210px; height: 28px">
              <a-select-option v-for="item in typeDatas" :key="item.id" :value="item.code">{{ item.value
              }}</a-select-option>
            </a-select>
          </div>
        </div>
      </div>

      <div class="div-line">
        <div class="div-cell">
          <div class="div-cell-name"><span style="color: #F90505;">*</span>药品剂型：</div>
          <div class="div-cell-value">
            <a-auto-complete v-model="medicData.dosageFormId" placeholder="请输入选择" option-label-prop="title"
              @select="onSelectDosage" @search="handleSearchDosage" style="width: 210px; height: 28px">
              <template slot="dataSource">
                <a-select-option v-for="(item, index) in dosageDatas" :title="item.value" :key="index + ''"
                  :value="item.id + ''">{{
                    item.value
                  }}</a-select-option>
              </template>
            </a-auto-complete>

            <!-- <a-select v-model="medicData.dosageFormDesc" placeholder="请选择" allow-clear style="width: 210px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select> -->
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name">治疗类型：</div>
          <div class="div-cell-value"> <a-select v-model="medicData.treatTypeId" @select="onSelectTreatType"
              placeholder="请选择" allow-clear style="width: 210px; height: 28px">
              <a-select-option v-for="item in treatTypeDatas" :key="item.id" :value="item.id">{{ item.value
              }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name">医保类型：</div>
          <div class="div-cell-value">
            <a-select v-model="medicData.healthInsuranceCategoryId" @select="onSelectYibao" placeholder="请选择" allow-clear
              style="width: 210px; height: 28px">
              <a-select-option v-for="item in yibaoDatas" :key="item.id" :value="item.code">{{ item.value
              }}</a-select-option>
            </a-select>
          </div>
        </div>
      </div>

      <div class="div-line">
        <div class="div-cell">
          <div class="div-cell-name">药理分类：</div>
          <div class="div-cell-value">
            <!-- <a-select v-model="medicData.status" placeholder="请选择" allow-clear style="width: 210px; height: 28px">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select> -->
            <a-tree-select v-model="medicData.pharmacologyCategoryId" @select="onSeletTree"
              style="width: 210px; height: 28px" :tree-data="yaoliTree" placeholder="请选择" allow-clear
              tree-default-expand-all>
            </a-tree-select>
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name">医保编码：</div>
          <div class="div-cell-value"><a-input v-model="medicData.healthInsuranceCoding" allow-clear placeholder="请输入医保编码"
              style="width: 210px" /></div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name">商品条形码：</div>
          <div class="div-cell-value">
            <a-input v-model="medicData.barCode" allow-clear placeholder="请输入商品条形码" style="width: 210px" />
          </div>
        </div>
      </div>

      <div class="div-line" style="margin-bottom: 10px;">
        <div class="div-cell">
          <div class="div-cell-name">批准文号：</div>
          <div class="div-cell-value">
            <a-input v-model="medicData.approvalNumber" allow-clear placeholder="请输入批准文号" style="width: 210px" />
          </div>
        </div>
        <div class="div-cell">
          <div class="div-cell-name">HIS编码：</div>
          <div class="div-cell-value">
            <a-input v-model="medicData.code" allow-clear placeholder="请输入HIS编码" style="width: 210px" />
          </div>
        </div>
        <div class="div-cell">
          <!-- <div style="width: 20px;"></div>
          <a-input v-model="medicData.keyWord" @click="goSearch()" allow-clear placeholder="未匹配药品，请点击匹配"
            style="width: 270px" /> -->

          <div class="div-cell-name">监管编码：</div>
          <div class="div-cell-value">
            <a-input v-model="medicData.supervisionCode" @click="goSearch()" allow-clear placeholder="未匹配药品，请点击匹配"
              style="width: 210px" />
          </div>
          <!-- <div class="div-cell-name"><span style="color: #F90505;">*</span>检索码：</div>
          <div class="div-cell-value"><a-input v-model="medicData.keyWord" allow-clear placeholder="请输入检索码"
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
            <a-input v-model="medicData.contentCoefficient" allow-clear placeholder="请输入" @change="countSpecDesc" />
          </div>
        </div>

        <div class="div-shu-cell" style="width: 100px;margin-left: 20px;">
          <div><span style="color: #F90505;">*</span>剂量单位</div>
          <div style="margin-top: 10px;">
            <a-select v-model="medicData.dosUomId" @select="onSelectJi" placeholder="请选择" allow-clear
              style="width: 100px; height: 28px">
              <a-select-option v-for="item in unitJiDatas" :key="item.id" :value="item.id">{{ item.value
              }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div style="margin-top: 30px;margin-left: 10px;">*</div>

        <div class="div-shu-cell" style="width: 100px;margin-left: 10px;">
          <div><span style="color: #F90505;">*</span>包装数量</div>
          <div style="margin-top: 10px;">
            <a-input v-model="medicData.minPkgNum" allow-clear placeholder="请输入" @change="countSpecDesc" />
          </div>
        </div>


        <div class="div-shu-cell" style="width: 100px;margin-left: 20px;">
          <div><span style="color: #F90505;">*</span>基本单位</div>
          <div style="margin-top: 10px;">
            <a-select v-model="medicData.baseUnitId" @select="onSelectBase" placeholder="请选择" allow-clear
              style="width: 100px; height: 28px">
              <a-select-option v-for="item in baseUnitDatas" :key="item.id" :value="item.code">{{ item.value
              }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div style="margin-top: 30px;margin-left: 10px;">/</div>

        <div class="div-shu-cell" style="width: 100px;margin-left: 10px;">
          <div><span style="color: #F90505;">*</span>包装单位</div>
          <div style="margin-top: 10px;">
            <a-select v-model="medicData.packingUnitId" @select="onSelectBao" placeholder="请选择" allow-clear
              style="width: 100px; height: 28px">
              <a-select-option v-for="item in unitBaoDatas" :key="item.id" :value="item.id">{{ item.value
              }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="div-shu-cell" style="width: 200px;margin-left: 20px;">
          <div><span style="color: #F90505;">*</span>规格描述</div>
          <div style="margin-top: 10px;">
            <a-input v-model="medicData.specDesc" allow-clear placeholder="请输入" />
          </div>
        </div>

        <div class="div-shu-cell" style="width: 200px;margin-left: 20px;">
          <div>参考价格</div>
          <div style="margin-top: 10px;">
            <a-input type="number" v-model="medicData.retailPrice" allow-clear placeholder="请输入" />
          </div>
        </div>

        <div class="div-shu-cell" style="width: 100px;margin-left: 20px;">
          <div><span style="color: #F90505;">*</span>计费方式</div>
          <div style="margin-top: 10px;">
            <a-select v-model="medicData.expenseId" placeholder="请选择" @select="onSelectExpense" allow-clear
              style="width: 100px; height: 28px">
              <a-select-option v-for="item in expenseDatas" :key="item.id" :value="item.code">{{ item.value
              }}</a-select-option>
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
        <a-checkbox @click="goChufang()" :checked="isChufang" style="margin-left: 20px;" />
        <span style="margin-left: 10px;color:#409EFF ;">处方药品</span>

        <a-checkbox @click="goExpensive()" :checked="isExpensive" style="margin-left: 20px;" />
        <span style="margin-left: 10px;color:#409EFF ;">贵重药品</span>

        <a-checkbox @click="goPoisonous()" :checked="isPoisonous" style="margin-left: 20px;" />
        <span style="margin-left: 10px;color:#409EFF ;">剧毒药品</span>
      </div>

      <div class="div-line" style="margin-bottom: 10px;margin-top: 10px;">


        <div class="div-shu-cell" style="width: 100px;">
          <div class="div-shu-cell-ori">
            <a-checkbox @click="goSpiritual()" :checked="isSpiritual" style="margin-left: 20px;" />
            <span style="margin-left: 10px;color:#409EFF ;">精神药品</span>
          </div>

          <div class="div-shu-cell-ori" style="margin-top: 20px;">
            <span style="margin-left: 10px ;width: 100px;text-align: right;">默认剂量：</span>
          </div>
        </div>

        <div class="div-shu-cell" style="width: 300px;margin-left: 0;">
          <div class="div-shu-cell-ori">
            <!-- <a-select v-model="medicData.status" placeholder="请选择" allow-clear style="width: 300px; ">
              <a-select-option v-for="item in typeSpiritualDatas" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select> -->
            <a-select v-model="medicData.psychotropicId" placeholder="请选择" @select="onSelectSpiritual" allow-clear
              style="width: 300px; height: 28px">
              <a-select-option v-for="item in typeSpiritualDatas" :key="item.id" :value="item.code">{{ item.value
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-shu-cell-ori" style="width: 300px;margin-top: 10px;">
            <a-input v-model="medicData.defDosage" allow-clear placeholder="请输入" />
          </div>
        </div>

        <div class="div-shu-cell" style="width: 100px;">
          <div class="div-shu-cell-ori">
            <a-checkbox @click="goAnesthesia()" :checked="isAnesthesia" style="margin-left: 20px;" />
            <span style="margin-left: 10px;color:#409EFF ;">麻醉药品</span>
          </div>

          <div class="div-shu-cell-ori" style="margin-top: 20px;">
            <span style="margin-left: 10px ;width: 100px;text-align: right;">默认用法：</span>
          </div>
        </div>

        <div class="div-shu-cell" style="width: 300px;margin-left: 0;">
          <div class="div-shu-cell-ori">

            <a-select v-model="medicData.stupefacientId" placeholder="请选择" @select="onSelectAnesthesia" allow-clear
              style="width: 300px; height: 28px">
              <a-select-option v-for="item in typeAnesthesiaDatas" :key="item.id" :value="item.code">{{ item.value
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-shu-cell-ori" style="width: 300px;margin-top: 10px;">
            <!-- <a-select v-model="medicData.defDirectionId" placeholder="请选择" @select="onSelectUse" allow-clear
              style="width: 300px; ">
              <a-select-option v-for="item in defaultUseDatas" :key="item.id" :value="item.code">{{ item.value
              }}</a-select-option>
            </a-select> -->

            <!-- @select="onSelectDosage" @search="handleSearchDosage" style="width: 300px; height: 28px"> -->
            <a-auto-complete v-model="medicData.defDirectionId" placeholder="请输入选择" option-label-prop="title"
              @select="onSelectUse" @search="getDefaultUseDatas" style="width: 300px; height: 28px">
              <template slot="dataSource">
                <a-select-option v-for="(item, index) in defaultUseDatas" :title="item.value" :key="index + ''"
                  :value="item.id + ''">{{
                    item.value
                  }}</a-select-option>
              </template>
            </a-auto-complete>
          </div>
        </div>


        <div class="div-shu-cell" style="width: 100px;">
          <div class="div-shu-cell-ori">
            <a-checkbox @click="goBacteria()" :checked="isBacteria" style="margin-left: 20px;" />
            <span style="margin-left: 10px;color:#409EFF ;">抗菌药品</span>
          </div>

          <div class="div-shu-cell-ori" style="margin-top: 20px;">
            <span style="margin-left: 10px ;width: 100px;text-align: right;">默认频次：</span>
          </div>
        </div>

        <div class="div-shu-cell" style="width: 300px;margin-left: 0;">
          <div class="div-shu-cell-ori">
            <!-- <a-select v-model="medicData.status" placeholder="请选择" allow-clear style="width: 300px; ">
              <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select> -->
            <a-select v-model="medicData.antibacterialId" placeholder="请选择" @select="onSelectBacteria" allow-clear
              style="width: 300px; height: 28px">
              <a-select-option v-for="item in typeBacteriaDatas" :key="item.id" :value="item.code">{{ item.value
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-shu-cell-ori" style="width: 300px;margin-top: 10px;">
            <!-- <a-select v-model="medicData.defFreqId" placeholder="请选择" @select="onSelectFreq" allow-clear
              style="width: 300px; ">
              <a-select-option v-for="item in defaultFreqDatas" :key="item.id" :value="item.code">{{ item.value
              }}</a-select-option>
            </a-select> -->

            <a-auto-complete v-model="medicData.defFreqId" placeholder="请输入选择" option-label-prop="title"
              @select="onSelectFreq" @search="getDefaultFreqDatas" style="width: 300px; height: 28px">
              <template slot="dataSource">
                <a-select-option v-for="(item, index) in defaultFreqDatas" :title="item.value" :key="index + ''"
                  :value="item.id + ''">{{
                    item.value
                  }}</a-select-option>
              </template>
            </a-auto-complete>
          </div>
        </div>




      </div>
    </div>
    <!-- 使用说明书 -->
    <div class="div-box" style="margin-top: 15px;">
      <div class="box-title">使用说明书</div>
      <div class="box-divider" />
      <div id="div11" style="padding: 10px;z-index:1"></div>
      <!-- <div class="div-line"></div> -->
    </div>

    <div class="div-pro-btn">
      <div style="flex: 1"></div>
      <a-button type="primary" @click="submitData()">保存</a-button>
      <a-button style="margin-left: 10px" @click="cancel()">返回</a-button>
    </div>
  </a-card>
</template>

<script>
import {
  medicineDetail, qryFactoryList, getDictData, getUseList, getFreqList,
  getDosageList, getUnitList, getCategoryList, addMedicineSku, getTreatTypeList
} from '@/api/modular/system/posManage'
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
      medicId: undefined,
      medicData: {
        //******基本信息模块字段
        genericName: "",//药品名称
        genericCcronym: "",//药品名称检索码
        manufacturerId: undefined,//生产厂商id(接口获取)
        manufacturerName: "",//生产厂商

        tradeName: "",//商品名称
        tradeAcronym: "",//商品名称检索码
        drugTypeDesc: "",//药品类型
        drugTypeId: undefined,//药品类型id(字典表中，必须是整型)

        dosageFormDesc: "",//药品剂型
        dosageFormId: undefined,//药品剂型id(接口)

        treatTypeDesc: "",//治疗类型
        treatTypeId: undefined,//治疗类型id(接口)

        healthInsuranceCategory: "",//医保类型
        healthInsuranceCategoryId: undefined,//医保类型(字典表中)

        pharmacologyCategory: "",//药理分类
        pharmacologyCategoryId: undefined,//药理分类id(接口)
        healthInsuranceCoding: "",//医保编码
        barCode: "",//商品条形码

        approvalNumber: "",//批准文号
        supervisionCode: "",//监管编码
        code: "",//药品代码   又叫 HIS编码  药品编码?

        // id: 0,//主键ID，修改时传


        //******基本信息模块字段

        //******规格计费模块字段
        contentCoefficient: undefined,//含量系数

        dosUom: "",//剂量单位
        dosUomId: undefined,//剂量单位id(接口)

        minPkgNum: "",//包装数量

        baseUnitId: undefined,//基本单位id(字典表中)
        baseUnitName: "",//基本单位

        packingUnit: "",//包装单位
        packingUnitId: undefined,//接口（表sys_dose_unit）

        specDesc: "",//规格描述
        retailPrice: "",//参考价格

        expenseDesc: '',//计费方式
        expenseId: undefined,//计费方式id(字典表中)

        //******规格计费模块字段


        //******处方开具模块字段
        ethicalsSign: "2",//处方药品：1是 2否
        valuableSign: "2",//贵重药品：1是 2否
        drugSign: "2",//剧毒药品：1是 2否

        psychotropicDesc: "",//精神药品
        psychotropicId: undefined,//精神药品id(字典表中)
        defDosage: "",//默认剂量

        stupefacientDesc: "",//麻醉药品
        stupefacientId: undefined,//麻醉药品id(字典表中)
        defDirectionId: undefined,//默认用法id(接口)
        defDirectionName: "",//默认用法

        antibacterialDesc: "",//抗菌药品
        antibacterialId: undefined,//抗菌药品id(字典表中)
        defFreqId: undefined,//默认频次id(接口)
        defFreqName: "",//默认频次
        //******处方开具模块字段

        //******使用说明书模块字段
        note: "",//使用说明
        //******使用说明书模块字段
      },
      manuDatas: [],
      yaoliTree: [],
      typeDatas: [],
      dosageDatas: [],
      treatTypeDatas: [],
      yibaoDatas: [],
      baseUnitDatas: [],
      expenseDatas: [],
      unitJiDatas: [],
      unitBaoDatas: [],

      isChufang: false,
      isExpensive: false,
      isPoisonous: false,

      isSpiritual: false,
      typeSpiritualDatas: [],

      isAnesthesia: false,
      typeAnesthesiaDatas: [],
      defaultUseDatas: [],

      isBacteria: false,
      typeBacteriaDatas: [],
      defaultFreqDatas: [],

      editor: {},
    }
  },

  watch: {
    $route(to, from) {//TODO watch不回调需要找原因
      console.log('watch-------------------medicNew Be', to, from)
      if (to.path.indexOf('medicNew') > -1) {
        console.log('watch-------------------medicNew', to, from)
        if (this.$route.query.id) {//修改
          // this.medicId = this.$route.query.id
          // this.initData()
        } else {//新增

        }
      }
    },
  },

  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    this.initData()
    this.getMedicTypes()
    this.getTreatTypes()
    this.getYiBaoDatas()
    this.getCategoryListOut()
    this.getBaseUnitDatas()
    this.getExpenseDatas()
    this.getUnitDatas()

    this.getSpiritualDatas()
    this.getAnesthesiaDatas()
    this.getBacteriaDatas()
    this.getDefaultUseDatas()
    this.getDefaultFreqDatas()
  },
  mounted() {
    this.$nextTick(() => {
      this.initEditor()
    })
  },
  // activated() {
  //   console.log('*************medicDetail Activited')
  // if (this.$route.query.id) {//修改
  //         this.medicId = this.$route.query.id
  //         this.getDetaiData()
  //       } else {//新增

  //       }
  // },
  methods: {
    initData() {
      // if (this.$route.query.id) {//修改
      //   this.medicId = this.$route.query.id
      //   this.getDetaiData()
      // } else {//新增

      // }

    },

    onSelectManu(manufacturerId) {
      let getOne = this.manuDatas.find((item) => item.id == manufacturerId)
      this.medicData.manufacturerName = getOne.factoryName
      console.log('onSelectManu manufacturerId', manufacturerId)
      console.log('onSelectManu factoryName', getOne.factoryName)
    },

    onSelectType(drugTypeId) {
      let getOne = this.typeDatas.find((item) => item.code == drugTypeId)
      this.medicData.drugTypeDesc = getOne.value
      console.log('onSelectType drugTypeId', drugTypeId)
      console.log('onSelectType drugTypeDesc', getOne.value)
    },
    onSelectDosage(dosageFormId) {
      let getOne = this.dosageDatas.find((item) => item.id == dosageFormId)
      this.medicData.dosageFormDesc = getOne.value
      console.log('onSelectDosage dosageFormId', dosageFormId)
      console.log('onSelectDosage dosageFormDesc', getOne.value)
    },
    onSelectTreatType(treatTypeId) {
      let getOne = this.treatTypeDatas.find((item) => item.id == treatTypeId)
      this.medicData.treatTypeDesc = getOne.value
      console.log('onSelectTreatType treatTypeId', treatTypeId)
      console.log('onSelectTreatType treatTypeDesc', getOne.value)
    },
    onSelectYibao(healthInsuranceCategoryId) {
      let getOne = this.yibaoDatas.find((item) => item.code == healthInsuranceCategoryId)
      this.medicData.healthInsuranceCategory = getOne.value
      console.log('onSelectYibao healthInsuranceCategoryId', healthInsuranceCategoryId)
      console.log('onSelectYibao healthInsuranceCategory', getOne.value)
    },

    onSeletTree(s, ss, sss) {
      this.medicData.pharmacologyCategory = ss.title
      console.log('onSeletTree s', s)
      console.log('onSeletTree ss', ss)
      console.log('onSeletTree sss', sss)
    },

    onSelectBase(baseUnitId) {
      let getOne = this.baseUnitDatas.find((item) => item.code == baseUnitId)
      this.medicData.baseUnitName = getOne.value
      console.log('onSelectBase baseUnitId', baseUnitId)
      console.log('onSelectBase treatTypeDesc', getOne.value)
      this.countSpecDesc()
    },
    onSelectExpense(expenseId) {
      let getOne = this.expenseDatas.find((item) => item.code == expenseId)
      this.medicData.expenseDesc = getOne.value
      console.log('onSelectExpense expenseId', expenseId)
      console.log('onSelectExpense expenseDesc', getOne.value)
    },

    onSelectJi(dosUomId) {
      let getOne = this.unitJiDatas.find((item) => item.id == dosUomId)
      this.medicData.dosUom = getOne.value
      console.log('onSelectJi dosUomId', dosUomId)
      console.log('onSelectJi dosUom', getOne.value)
      this.countSpecDesc()
    },

    onSelectBao(packingUnitId) {
      let getOne = this.unitBaoDatas.find((item) => item.id == packingUnitId)
      this.medicData.packingUnit = getOne.value
      console.log('onSelectBao packingUnitId', packingUnitId)
      console.log('onSelectBao packingUnit', getOne.value)
      this.countSpecDesc()
    },

    onSelectSpiritual(psychotropicId) {
      let getOne = this.typeSpiritualDatas.find((item) => item.code == psychotropicId)
      this.medicData.psychotropicDesc = getOne.value
      console.log('onSelectSpiritual psychotropicId', psychotropicId)
      console.log('onSelectSpiritual psychotropicDesc', getOne.value)
    },

    onSelectAnesthesia(stupefacientId) {
      let getOne = this.typeAnesthesiaDatas.find((item) => item.code == stupefacientId)
      this.medicData.stupefacientDesc = getOne.value
      console.log('onSelectAnesthesia stupefacientId', stupefacientId)
      console.log('onSelectAnesthesia stupefacientDesc', getOne.value)
    },
    onSelectBacteria(antibacterialId) {
      let getOne = this.typeBacteriaDatas.find((item) => item.code == antibacterialId)
      this.medicData.antibacterialDesc = getOne.value
      console.log('onSelectBacteria antibacterialId', antibacterialId)
      console.log('onSelectBacteria antibacterialDesc', getOne.value)
    },

    onSelectUse(defDirectionId) {
      let getOne = this.defaultUseDatas.find((item) => item.id == defDirectionId)
      this.medicData.defDirectionName = getOne.value
      console.log('onSelectUse defDirectionId', defDirectionId)
      console.log('onSelectUse defDirectionName', getOne.value)
    },

    onSelectFreq(defFreqId) {
      let getOne = this.defaultFreqDatas.find((item) => item.id == defFreqId)
      this.medicData.defFreqName = getOne.value
      console.log('onSelectFreq defFreqId', defFreqId)
      console.log('onSelectFreq defFreqName', getOne.value)
    },

    /**
     * 计算拼接描述
     * 公式如下：含量系数含量单位*包装数量基本单位/包装单位
     */
    countSpecDesc() {
      this.medicData.specDesc = this.medicData.contentCoefficient + this.medicData.dosUom + '*' +
        this.medicData.minPkgNum + this.medicData.baseUnitName + '/' + this.medicData.packingUnit
    },

    /**
     * 搜索厂商
     * @param {} name 
     */
    handleSearchManu(name) {
      let param = {
        pageNo: 1,
        pageSize: 10,
        factoryType: 3,
        queryText: name
      }
      qryFactoryList(param)
        .then((res) => {
          if (res.code == 0 && res.data.rows.length > 0) {
            this.manuDatas = res.data.rows
            // this.queryParams.factoryId = this.factoryListData[0].id
            // this.handleOk()
          }
        })
    },

    handleSearchDosage(name) {
      let param = {
        pageNo: 1,
        pageSize: 10,
        value: name
      }
      getDosageList(param)
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.dosageDatas = res.data.records
            console.log('dosageDatas-------', this.dosageDatas);
          }
        })
    },

    /**
     * 查询药品类型
     */
    getMedicTypes() {//查字典
      getDictData('medicine_types')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.typeDatas = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    // /**
    //  * 查询治疗类型
    //  */
    // getTreatTypes() {//查字典
    //   getDictData('$BV$HIS$MEDICINE_TREAT_TYPE')
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         this.treatTypeDatas = res.data
    //       }
    //     })
    //     .finally((res) => {
    //       // this.confirmLoading = false
    //     })
    // },
    /**
     * 查询治疗类型
     */
    getTreatTypes() {//查字典
      let param = {
        pageNo: 1,
        pageSize: 1000,
      }
      getTreatTypeList(param)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.treatTypeDatas = res.data.records
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    /**
     * 查询医保类型
     */
    getYiBaoDatas() {//查字典
      getDictData('$BV$HIS$MEDICINE_HEALTH_INSURANCE')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.yibaoDatas = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },
    /**
     * 查询基本单位列表
     */
    getBaseUnitDatas() {//查字典
      getDictData('$BV$HIS$MEDICINE_BASEUNIT')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.baseUnitDatas = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },
    /**
     * 查询计费方式列表
     */
    getExpenseDatas() {//查字典
      getDictData('expense_type')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.expenseDatas = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    /**
     * 精神药品列表
     */
    getSpiritualDatas() {//查字典
      getDictData('psychotropic_type')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.typeSpiritualDatas = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    /**
     * 麻醉药品列表
     */
    getAnesthesiaDatas() {//查字典
      getDictData('stupefacien_type')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.typeAnesthesiaDatas = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    /**
     * 抗菌药品列表
     */
    getBacteriaDatas() {//查字典
      getDictData('	antibacterial_type')
        .then((res) => {
          console.log('this.typeBacteriaDatas ddd', res)
          if (res.code == 0 && res.data.length > 0) {
            this.typeBacteriaDatas = res.data
            console.log('this.typeBacteriaDatas', this.typeBacteriaDatas)
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },


    /**
     * 剂量单位 包装单位  都用这个列表
     */
    getUnitDatas() {
      let params = {
        status: 0,
        pageNo: 1,
        pageSize: 10000,
      }
      getUnitList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.unitJiDatas = res.data.records
            this.unitBaoDatas = JSON.parse(JSON.stringify(res.data.records))
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    /**
     * 默认用法列表
     */
    getDefaultUseDatas(value) {
      let params = {
        status: 0,//状态0正常 1停用 2删除
        pageNo: 1,
        value: value,
        pageSize: 10,
      }
      getUseList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.defaultUseDatas = res.data.records
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },
    /**
     * 默认频次列表
     */
    getDefaultFreqDatas(value) {
      let params = {
        status: 0,//状态0正常 1停用 2删除
        pageNo: 1,
        value: value,
        pageSize: 10,
      }
      getFreqList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.defaultFreqDatas = res.data.records
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    getCategoryListOut() {
      let param = {
        remark: "",
      }
      getCategoryList(param)
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.yaoliTree = res.data
            console.log('yaoliTree-------111', JSON.stringify(res.data));
            // this.processTreeData(JSON.parse(JSON.stringify(this.yaoliTree)))
            this.processTreeData(this.yaoliTree)
            console.log('yaoliTree-------', JSON.stringify(this.yaoliTree));
          }
        })
    },

    processTreeData(array) {
      array.forEach(item => {
        this.$set(item, 'key', item.id)
        this.$set(item, 'title', item.value)
        this.$set(item, 'value', item.id)
        // this.$set(item, 'children', item.hospitals)
        if (item.children && item.children.length > 0) {
          this.processTreeData(item.children)
        }
      });
    },

    //   ethicalsSign: "",//处方药品：1是 2否  
    //   valuableSign: "",//贵重药品：1是 2否
    //   drugSign: "",//剧毒药品：1是 2否
    goChufang() {
      this.isChufang = !this.isChufang
      this.medicData.ethicalsSign = this.isChufang ? 1 : 2
    },
    goExpensive() {
      this.isExpensive = !this.isExpensive
      this.medicData.valuableSign = this.isExpensive ? 1 : 2
    },
    goPoisonous() {
      this.isPoisonous = !this.isPoisonous
      this.medicData.drugSign = this.isPoisonous ? 1 : 2
    },


    goSpiritual() {
      this.isSpiritual = !this.isSpiritual
    },
    goAnesthesia() {
      this.isAnesthesia = !this.isAnesthesia
    },
    goBacteria() {
      this.isBacteria = !this.isBacteria
    },

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
        this.medicData.note = html
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

    getDetaiData() {
      let queryData = {
        id: this.medicId
      }
      this.confirmLoading = true
      medicineDetail(queryData)
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.medicData = res.data
          } else {
          }
          // setTimeout(() => {
          //   this.handleOk()
          // }, 500)
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    goAgin() {
      // 随访名单更新时需重新匹配：0不匹配1匹配
      this.isAgain = !this.isAgain
      // this.projectData.basePlan.updateMatchStatus = this.isAgain ? 1 : 0
    },

    goSearch() {
      let queryText = ''
      if (this.medicData.code) {
        queryText = this.medicData.code
      } else if (this.medicData.genericName) {
        queryText = this.medicData.genericName
      } else if (this.medicData.tradeName) {
        queryText = this.medicData.tradeName
      } else if (this.medicData.approvalNumber) {
        queryText = this.medicData.approvalNumber
      }

      this.$router.push({
        path: './medicSearch',
        query: {
          // queryText: queryText,
          dataStr: JSON.stringify({ queryText: queryText, jumpType: 'add_sku' }),
        },
      })
    },

    cancel() {
      this.$router.go(-1)
    },
    submitData() {
      let tempData = JSON.parse(JSON.stringify(this.medicData))
      if (!tempData.genericName) {
        this.$message.error('请输入药品名称')
        return
      }
      if (!tempData.manufacturerId || !tempData.manufacturerName) {
        this.$message.error('请输入选择生产厂商')
        return
      }
      if (!tempData.tradeName) {
        this.$message.error('请输入商品名称')
        return
      }
      if (!tempData.drugTypeId) {
        this.$message.error('请选择药品类型')
        return
      }
      if (!tempData.dosageFormId || !tempData.dosageFormDesc) {
        this.$message.error('请输入选择药品剂型')
        return
      }

      if (!tempData.contentCoefficient) {
        this.$message.error('含量系数')
        return
      }
      if (!tempData.dosUomId) {
        this.$message.error('请选择剂量单位')
        return
      }
      if (!tempData.minPkgNum) {
        this.$message.error('请输入包装数量')
        return
      }
      if (!tempData.baseUnitId) {
        this.$message.error('请选择基本单位')
        return
      }
      if (!tempData.packingUnitId) {
        this.$message.error('请选择包装单位')
        return
      }
      if (!tempData.specDesc) {
        this.$message.error('请输入规格描述')
        return
      }

      if (!tempData.expenseId) {
        this.$message.error('请选择计费方式')
        return
      }

      /**
       *       

      isSpiritual: false,
      isAnesthesia: false,
      isBacteria: false,
       */
      //处理药品勾选
      if (this.isSpiritual) {
        if (!tempData.psychotropicId) {
          this.$message.error('请选择精神药品类型')
          return
        }
        if (!tempData.defDosage) {
          this.$message.error('请输入默认剂量')
          return
        }
      }
      if (this.isAnesthesia) {
        if (!tempData.stupefacientId) {
          this.$message.error('请选择麻醉药品类型')
          return
        }
        if (!tempData.defDirectionId || !tempData.defDirectionName) {
          this.$message.error('请输入选择麻醉药品默认用法')
          return
        }
      }
      if (this.isBacteria) {
        if (!tempData.antibacterialId) {
          this.$message.error('请选择抗菌药品类型')
          return
        }
        if (!tempData.defFreqId || !tempData.defFreqName) {
          this.$message.error('请输入选择抗菌药品默认频次')
          return
        }
      }


      //处理类型转换
      if (tempData.defDirectionId) {
        tempData.defDirectionId = parseInt(tempData.defDirectionId)
      }
      if (tempData.defFreqId) {
        tempData.defFreqId = parseInt(tempData.defFreqId)
      }
      if (tempData.dosUomId) {
        tempData.dosUomId = parseInt(tempData.dosUomId)
      }
      if (tempData.dosageFormId) {
        tempData.dosageFormId = parseInt(tempData.dosageFormId)
      }
      if (tempData.expenseId) {//接口文档有误  expenseDesc int
        tempData.expenseId = parseInt(tempData.expenseId)
      }
      if (tempData.manufacturerId) {
        tempData.manufacturerId = parseInt(tempData.manufacturerId)
      }

      if (tempData.packingUnitId) {
        tempData.packingUnitId = parseInt(tempData.packingUnitId)
      }
      if (tempData.pharmacologyCategoryId) {
        tempData.pharmacologyCategoryId = parseInt(tempData.pharmacologyCategoryId)
      }
      if (tempData.treatTypeId) {
        tempData.treatTypeId = parseInt(tempData.treatTypeId)
      }


      console.log('submitData tempData', tempData)
      addMedicineSku(tempData)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('保存成功')
            // this.$bus.$emit('proEvent', '刷新数据-方案新增')
            this.$router.go(-1)
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
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

.div-pro-btn {
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: 3%;
  margin-bottom: 60px;
}
</style>



