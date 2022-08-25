<template>
  <div>
    <!-- <a-tabs default-active-key="1" @change="callback" style="width: 60%"> -->
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="随访计划">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="3" :sm="24">
                  <span
                    class="table-page-search-submitButtons"
                    :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                  >
                    <a-button type="primary" @click="addPlan">新增计划</a-button>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <s-table
            ref="table"
            size="default"
            :columns="columns"
            :data="loadData"
            :alert="true"
            :rowKey="(record) => record.code"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="lookPlan(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="editPlan(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除计划吗？" ok-text="确定" cancel-text="取消" @confirm="deletePlan(record)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </s-table>

          <add-form ref="addForm" @ok="handleOk" />
          <edit-form ref="editForm" @ok="handleOk" />
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="2" tab="计划分配" force-render>
        <div class="div-service-service">
          <div class="div-service-left-service">
            <p class="p-part-title">病区选择</p>
            <!-- 分割线 -->
            <!-- <div class="div-divider"></div> -->

            <!-- <div class="div-part" v-for="(item, index) in partData" :value="item.code" :key="index"> -->
            <!-- <div class="global-search-wrapper" style="width: 160px; display: inline-block"> -->
            <div class="div-text-auto">
              <a-auto-complete
                class="global-search"
                size="large"
                style="width: 100%; font-size: 14px"
                placeholder="请输入并选择病区"
                option-label-prop="title"
                @select="onSelect"
                @search="handleSearch"
              >
                <template slot="dataSource">
                  <a-select-option
                    v-for="item in keshiDataTemp"
                    :key="item.departmentId + ''"
                    :title="item.departmentName"
                  >
                    {{ item.departmentName }}
                  </a-select-option>
                </template>
              </a-auto-complete>
            </div>

            <div class="div-wrap-service" style="margin-top: 8%">
              <div class="div-part" v-for="(item, index) in keshiData" :value="item.departmentName" :key="index">
                <p class="p-name" :class="{ checked: item.isChecked }" @click="onPartChoose(index)">
                  {{ item.departmentName }}
                </p>
                <!-- 分割线 -->
                <div class="div-divider"></div>
              </div>
            </div>
          </div>

          <a-card :bordered="false" class="card-right-service">
            <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="3" :sm="24">
                    <span
                      class="table-page-search-submitButtons"
                      :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                    >
                      <a-button type="primary" @click="dispatchPlan">分配计划</a-button>
                    </span>
                  </a-col>

                  <a-col :md="6" :sm="24">
                    <a-form-item label="专病">
                      <a-input
                        v-model="queryParam.cyzd"
                        allow-clear
                        placeholder="请输入专病 "
                        @keyup.enter="$refs.table.refresh(true)"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :md="6" :sm="24">
                    <a-form-item label="患者名称">
                      <a-input
                        v-model="queryParam.userName"
                        allow-clear
                        placeholder="请输入患者名称"
                        @keyup.enter="$refs.table.refresh(true)"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :md="3" :sm="24">
                    <span
                      class="table-page-search-submitButtons"
                      :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                    >
                      <a-button type="primary" @click="$refs.tableDispatch.refresh(true)">查询</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>

            <!-- 去掉勾选框 -->
            <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
            <s-table
              ref="tableDispatch"
              size="default"
              :columns="columnsDispatch"
              :data="loadDataDispatch"
              :row-selection="rowSelection"
              :alert="true"
              :rowKey="(record) => record.code"
            >
            </s-table>

            <add-form-dispatch ref="addFormDispatch" @ok="handleOkDispatch" />
            <edit-form-dispatch ref="editFormDispatch" @ok="handleOkDispatch" />
          </a-card>
        </div>
      </a-tab-pane>

      <a-tab-pane key="3" tab="随访统计">
        <a-tabs default-active-key="5" @change="callback">
          <a-tab-pane key="5" tab="统计看板">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <!-- <a-col :md="3" :sm="24">
                        <a-button type="primary" @click="$refs.addForm.add()">新增版本</a-button>
                      </a-col> -->
                  <!-- 只有病友服务中心账号和管理员能查看所有科室 -->
                  <a-col v-if="user.departmentCode == 1 || user.roleName == 'admin'" :md="6" :sm="24">
                    <a-form-item label="科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                      <!-- v-decorator="['caseManageIds', { rules: [{ validator: hasCaseManageIds }] }]" -->
                      <a-select allow-clear v-model="queryParamsBor.deptCodes" mode="multiple" placeholder="请选择科室">
                        <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                          item.departmentName
                        }}</a-select-option>
                      </a-select>
                    </a-form-item></a-col
                  >

                  <a-col :md="7" :sm="24">
                    <a-form-item label="时间">
                      <a-range-picker :value="createValueBor" @change="onChangeBor" />
                    </a-form-item>
                  </a-col>

                  <a-col :md="5" :sm="24">
                    <a-button
                      style="margin-right: 3%"
                      type="primary"
                      v-if="user.departmentCode == 1 || user.roleName == 'admin'"
                      @click="resetBor"
                      >全院</a-button
                    >
                    <a-button type="primary" @click="getStatBorData">查询</a-button>
                  </a-col>
                </a-row>
              </a-form>
            </div>

            <div class="row-stat">
              <div class="row-item">
                <div class="item-inside">
                  <!-- src="http://n.sinaimg.cn/ent/4_img/upload/fc8e0ed6/20170427/KNky-fyetwsm0590719.jpg" -->
                  <img class="item-image" src="~@/assets/icons/img1.png" />
                  <div class="item-right">
                    <div class="item-right-top" style="color: #1890ff">
                      <div class="item-stat-num">{{ statData.totalPatient }}</div>
                      <div class="item-stat-unit">人</div>
                    </div>
                    <div class="item-stat-name">随访总人数</div>
                  </div>
                </div>
              </div>

              <div class="row-item">
                <div class="item-inside">
                  <img class="item-image" src="~@/assets/icons/img2.png" />
                  <div class="item-right">
                    <div class="item-right-top" style="color: #4dad90">
                      <div class="item-stat-num">{{ statData.finishedPatient }}</div>
                      <div class="item-stat-unit">人</div>
                    </div>
                    <div class="item-stat-name">随访完成数</div>
                  </div>
                </div>
              </div>

              <div class="row-item">
                <div class="item-inside">
                  <img class="item-image" src="~@/assets/icons/img3.png" />
                  <div class="item-right">
                    <div class="item-right-top" style="color: #cdad3d">
                      <div class="item-stat-num">{{ statData.visitedRate }}</div>
                      <div class="item-stat-unit">%</div>
                    </div>
                    <div class="item-stat-name">随访率</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row-stat">
              <div class="row-item">
                <div class="item-inside">
                  <img class="item-image" src="~@/assets/icons/img4.png" />
                  <div class="item-right">
                    <div class="item-right-top" style="color: #4e6e8d">
                      <div class="item-stat-num">{{ statData.assginedPatient }}</div>
                      <div class="item-stat-unit">人</div>
                    </div>
                    <div class="item-stat-name">待分配随访人数</div>
                  </div>
                </div>
              </div>

              <div class="row-item">
                <div class="item-inside">
                  <img class="item-image" src="~@/assets/icons/img5.png" />
                  <div class="item-right">
                    <div class="item-right-top" style="color: #e05852">
                      <div class="item-stat-num">{{ statData.outTimePatient }}</div>
                      <div class="item-stat-unit">人</div>
                    </div>
                    <div class="item-stat-name">随访超时未完成人数</div>
                  </div>
                </div>
              </div>

              <div class="row-item">
                <div class="item-inside">
                  <img class="item-image" src="~@/assets/icons/img6.png" />
                  <div class="item-right">
                    <div class="item-right-top" style="color: #e48533">
                      <div class="item-stat-num">{{ statData.telVisitPatient }}</div>
                      <div class="item-stat-unit">人</div>
                    </div>
                    <div class="item-stat-name">电话随访人数</div>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="6" tab="随访详情" force-render>
            <div class="div-inquiry-text">
              <a-card :bordered="false" class="card-right">
                <div class="table-page-search-wrapper">
                  <a-form layout="inline">
                    <a-row :gutter="48">
                      <!-- <a-col :md="3" :sm="24">
                        <a-button type="primary" @click="$refs.addForm.add()">新增版本</a-button>
                      </a-col> -->
                      <!-- 只有病友服务中心账号和管理员能查看所有科室 -->
                      <a-col v-if="user.departmentCode == 1 || user.roleName == 'admin'" :md="6" :sm="24">
                        <a-form-item label="科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                          <!-- v-decorator="['caseManageIds', { rules: [{ validator: hasCaseManageIds }] }]" -->
                          <a-select
                            allow-clear
                            v-model="queryParamsStat.deptCodes"
                            mode="multiple"
                            placeholder="请选择科室"
                          >
                            <a-select-option
                              v-for="(item, index) in originData"
                              :key="index"
                              :value="item.departmentId"
                              >{{ item.departmentName }}</a-select-option
                            >
                          </a-select>
                        </a-form-item></a-col
                      >

                      <a-col :md="6" :sm="24">
                        <a-form-item label="状态">
                          <a-select allow-clear v-model="queryParamsStat.status" placeholder="请选择状态">
                            <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                              item.value
                            }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>

                      <a-col :md="6" :sm="24">
                        <a-form-item label="抽查状态">
                          <a-select allow-clear v-model="queryParamsStat.checkStatus" placeholder="请选择抽查状态">
                            <a-select-option v-for="(item, index) in statusDataCheck" :key="index" :value="item.code">{{
                              item.value
                            }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>

                      <a-col :md="7" :sm="24">
                        <a-form-item label="时间">
                          <a-range-picker :value="createValue" @change="onChange" />
                        </a-form-item>
                      </a-col>

                      <a-col :md="5" :sm="24">
                        <a-button
                          style="margin-right: 3%"
                          type="primary"
                          v-if="user.departmentCode == 1 || user.roleName == 'admin'"
                          @click="reset"
                          >全院</a-button
                        >
                        <a-button type="primary" @click="$refs.tableStat.refresh(true)">查询</a-button>
                      </a-col>
                    </a-row>
                  </a-form>
                </div>

                <s-table
                  ref="tableStat"
                  size="default"
                  :columns="columnsStat"
                  :data="loadDataStat"
                  :alert="true"
                  :rowKey="(record) => record.code"
                >
                  <span slot="action" slot-scope="text, record">
                    <!-- 仅对超时的有处理 -->
                    <a v-if="record.status == 4" @click="$refs.statSolve.doDeal(record)">处理</a>
                    <a-divider v-if="record.status == 4" type="vertical" />

                    <!-- <a @click="$refs.statSolve.edit(record)">处理</a>
                    <a-divider type="vertical" /> -->

                    <a @click="$refs.statDetail.edit(record.id)">详情</a>

                    <a-divider v-if="record.status == 5" type="vertical" />

                    <!-- 仅对电话随访有抽查 -->
                    <a v-if="record.status == 5 && record.checkStatus == 0" @click="$refs.statSolve.doCheck(record)"
                      >抽查</a
                    >

                    <a v-if="record.status == 5 && record.checkStatus == 1" @click="$refs.statSolve.checkInfo(record)"
                      >抽查详情</a
                    >

                  </span>
                </s-table>

                <stat-detail ref="statDetail" @ok="handleOkStat" />
                <stat-solve ref="statSolve" @ok="handleOkStat" />
              </a-card>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { STable } from '@/components'
import {
  getDocPlans,
  delPlan,
  getOutPatients,
  statRevisit,
  getDepts,
  deleteAppVersion,
  qryRevisitPatientList,
} from '@/api/modular/system/posManage'
import addForm from './addForm'
import editForm from './editForm'
import addFormDispatch from './addFormDispatch'
import editFormDispatch from './editFormDispatch'
import moment from 'moment'

import statDetail from './statDetail'
import statSolve from './statSolve'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'

import { formatDate, getDateNow, getCurrentMonthLast, getMonthNow } from '@/utils/util'

export default {
  components: {
    STable,
    addForm,
    editForm,

    addFormDispatch,
    editFormDispatch,

    statDetail,
    statSolve,
  },

  data() {
    return {
      /** 随访计划数据*/
      // 高级搜索 展开/关闭
      advanced: false,

      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '计划名称',
          dataIndex: 'templateName',
        },
        {
          title: '科室',
          dataIndex: 'deptName',
        },
        {
          title: '专病',
          dataIndex: 'diseaseName',
        },
        {
          title: '创建时间',
          dataIndex: 'timeDay',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDocPlans(Object.assign(parameter)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'timeDay', formatDate(res.data.rows[i].createTime))
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
          }

          return res.data
        })
      },

      /** 随访计划数据*/

      /** 计划分配数据*/
      selectedRowKeys: [], // Check here to configure the default column
      // 高级搜索 展开/关闭
      // partChoose: '',
      keshiData: [],
      // 查询参数 existsPlanFlag传 1：已订购套餐患者；2：未订购套餐患者；不传和其他：全部患者
      queryParam: {
        // existsPlanFlag: '2',
        existsPlanFlag: 2,
        bqmc: '',
        // deptCode: Vue.ls.get(TRUE_USER).departmentCode,
        // isRegister: '1',
      },
      // 表头
      columnsDispatch: [
        {
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '身份证号',
          dataIndex: 'idNumber',
        },
        {
          title: '电话号码',
          dataIndex: 'tel',
        },
        {
          title: '所在病区',
          dataIndex: 'bqmc',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '年龄',
          dataIndex: 'ageCount',
        },
        {
          title: '科室',
          dataIndex: 'ksmc',
        },
        {
          title: '专病',
          dataIndex: 'cyzd',
        },
        // {
        //   title: '出院时间',
        //   dataIndex: 'outTime',
        // },
        // {
        //   title: '是否购买套餐',
        //   dataIndex: 'hasPlan',
        // },
        // {
        //   title: '状态',
        //   dataIndex: 'hasGive',
        // },
      ],
      loadDataOut: [],
      // 加载数据方法 必须为 Promise 对象
      loadDataDispatch: (parameter) => {
        console.log('loadData', Object.assign(parameter, this.queryParam))
        return getOutPatients(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            // this.$set(res.data.rows[i], 'phoneNo', res.data.rows[i].infoDetail.dhhm) //设置电话号码
            if (res.data.rows[i].age) {
              this.$set(res.data.rows[i], 'ageCount', this.countAge(res.data.rows[i].age)) //计算设置年龄
            } else {
              this.$set(res.data.rows[i], 'ageCount', '暂无') //计算设置年龄
            }
            this.$set(
              res.data.rows[i],
              'outTime',
              res.data.rows[i].cysj.substring(0, 4) +
                '-' +
                res.data.rows[i].cysj.substring(4, 6) +
                '-' +
                res.data.rows[i].cysj.substring(6, 8)
            ) //计算设置出院时间
            //计算是否购买套餐
            if (!res.data.rows[i].planInfo || res.data.rows[i].planInfo.length == 0) {
              this.$set(res.data.rows[i], 'hasPlan', '否')
            } else {
              this.$set(res.data.rows[i], 'hasPlan', '是')
            }
            // //分配状态：  未注册 注册未分配 已分配
            // if (!res.data.rows[i].userId) {
            //   this.$set(res.data.rows[i], 'hasGive', '未注册')
            // } else if (res.data.rows[i].planInfo && res.data.rows[i].planInfo.length > 0) {
            //   this.$set(res.data.rows[i], 'hasGive', '已分配')
            // } else {
            //   this.$set(res.data.rows[i], 'hasGive', '注册未分配')
            // }

            //状态：  未注册 注册未分配 已分配
            if (!res.data.rows[i].bqmc) {
              this.$set(res.data.rows[i], 'hasGive', '门诊')
            } else {
              this.$set(res.data.rows[i], 'hasGive', '住院')
            }
          }
          this.loadDataOut = res.data
          return res.data
        })
      },
      selectedRows: [],

      chooseDeptItem: {},
      originData: [],
      keshiDataTemp: [],
      /** 计划分配数据*/

      /** 统计类别数据*/
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      queryParamsStat: {
        deptCodes: [],
        status: undefined,
        checkStatus: undefined,
        beginDate: getDateNow(),
        endDate: getCurrentMonthLast(),
      },
      queryParamsStatOrigin: {
        deptCodes: [],
        status: undefined,
        checkStatus: undefined,
        beginDate: '',
        endDate: '',
      },

      // 表头
      columnsStat: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '患者',
          dataIndex: 'xm',
        },
        {
          title: '所在病区',
          dataIndex: 'bqmc',
        },
        {
          title: '性别',
          dataIndex: 'xbmc',
        },

        {
          title: '年龄',
          dataIndex: 'nl',
        },
        {
          title: '科室',
          dataIndex: 'ksmc',
        },
        {
          title: '专病',
          dataIndex: 'cyzd',
        },
        {
          title: '登记时间',
          dataIndex: 'createTimeOut',
        },
        {
          title: '住院号',
          dataIndex: 'zyh',
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
        },
        // {
        //   title: '出院小结',
        //   dataIndex: 'versionDescription',
        // },
        {
          title: '执行计划',
          dataIndex: 'planName',
        },
        {
          title: '抽查状态',
          dataIndex: 'checkText',
        },
        {
          title: '状态',
          dataIndex: 'stateText',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      //此属性用来做重置功能的
      createValue: [],
      createValueBor: [],
      user: {},
      //状态(1未注册；2待分配；3执行中；4超时；5电话随访；6失访)
      //抽查状态(1已抽查0未抽查)
      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '未注册' },
        { code: 2, value: '待分配' },
        { code: 3, value: '执行中' },
        { code: 4, value: '超时' },
        { code: 5, value: '电话随访' },
        { code: 6, value: '失访' },
        { code: 7, value: '已完成' },
      ],

      statusDataCheck: [
        { code: -1, value: '全部' },
        { code: 1, value: '已抽查' },
        { code: 0, value: '未抽查' },
      ],
      dateFormat: 'YYYY-MM-DD',

      // 加载数据方法 必须为 Promise 对象
      loadDataStat: (parameter) => {
        /**不是病友服务中心和管理员，写死用户当前的科室 */
        let params = JSON.parse(JSON.stringify(this.queryParamsStat))
        if (this.user.departmentCode != 1 && this.user.roleName != 'admin') {
          params.deptCodes.push(this.user.departmentCode)
        }
        if (this.queryParamsStat.status == -1) {
          delete params.status
        }
        if (this.queryParamsStat.checkStatus == -1) {
          delete params.checkStatus
        }
        return qryRevisitPatientList(Object.assign(parameter, params)).then((res) => {
          if (res.code == 0) {
            for (let i = 0; i < res.data.rows.length; i++) {
              this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)

              this.$set(res.data.rows[i], 'stateText', this.getClassText(res.data.rows[i].status))
              //只有电话随访有抽查状态
              if (res.data.rows[i].status == 5) {
                this.$set(res.data.rows[i], 'checkText', this.getCheckText(res.data.rows[i].checkStatus))
              } else {
                this.$set(res.data.rows[i], 'checkText', '')
              }
              this.$set(res.data.rows[i], 'createTimeOut', formatDate(res.data.rows[i].createTime))
            }
            return res.data
          }
        })
      },
      /** 统计类别数据*/

      /**统计看板参数 */
      statData: {
        outTimePatient: 0,
        finishedPatient: 0,
        assginedPatient: 0,
        telVisitPatient: 0,
        totalPatient: 6,
        visitedRate: '0.0000',
      },
      queryParamsBor: {
        deptCodes: [],
        beginDate: getDateNow(),
        endDate: getCurrentMonthLast(),
        // beginDate: '',
        // endDate: '',
      },
      queryParamsBorOrigin: {
        deptCodes: [],
        beginDate: '',
        endDate: '',
      },
      /**统计看板参数 */
    }
  },

  /** 计划分配方法*/
  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: !record.userId, // Column configuration not to be checked
            name: record.userId,
          },
        }),
      }
    },

    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },
  /** 计划分配方法*/

  created() {
    /** 计划分配方法*/
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
        for (let i = 0; i < res.data.length; i++) {
          // this.$set(res.data[i], 'xh', i + 1)
          if (i == 0) {
            this.$set(res.data[i], 'isChecked', true)
          } else {
            this.$set(res.data[i], 'isChecked', false)
          }
        }
        this.keshiData = res.data
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
    // this.nowDateEnd = moment(getCurrentMonthLast(), this.dateFormat)
    this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
    this.createValueBor = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
    this.user = Vue.ls.get(TRUE_USER)
    console.log('user', this.user)

    this.getStatBorData()
  },

  methods: {
    getStatBorData() {
      statRevisit(this.queryParamsBor).then((res) => {
        if (res.code == 0) {
          this.statData = res.data
          this.statData.visitedRate = (this.statData.visitedRate * 100).toFixed(2)
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    /** 随访计划方法*/
    callback(s1) {
      console.log('s1', s1)
    },

    addPlan() {
      this.$router.push({ name: 'add_plan' })
    },

    editPlan(record) {
      this.$router.push({
        name: 'edit_plan',
        query: {
          planId: record.templateId,
        },
      })
    },

    lookPlan(record) {
      this.$router.push({
        name: 'look_plan',
        query: {
          planId: record.templateId,
        },
      })
    },

    deletePlan(record) {
      delPlan(record.templateId).then((res) => {
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    /** 随访计划方法*/

    /** 计划分配方法*/
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.originData.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
        // this.chooseDeptItem = { departmentName: '', departmentId: '' }
      }
    },

    onSelect(departmentId, s2) {
      console.log('departmentId', departmentId)
      console.log('s2', s2)
      //选择类别
      let index = this.getIndex(departmentId)
      this.chooseDeptItem = this.originData.find((item) => item.departmentId == departmentId)
      console.log('index', index)
      this.onPartChoose(index)
    },

    getIndex(departmentId) {
      let myIndex = -1
      for (let index = 0; index < this.keshiData.length; index++) {
        if (this.keshiData[index].departmentId == departmentId) {
          myIndex = index
          return myIndex
        }
      }
      return myIndex
    },

    countAge(age) {
      let str = age.substring(0, 4) + '-' + age.substring(4, 6) + '-' + age.substring(6, 8)
      var birthday = new Date(str)
      var d = new Date()
      var age =
        d.getFullYear() -
        birthday.getFullYear() -
        (d.getMonth() < birthday.getMonth() || (d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate())
          ? 1
          : 0)
      return age
    },

    onPartChoose(index) {
      this.chooseDeptItem = this.keshiData[index]
      for (let i = 0; i < this.keshiData.length; i++) {
        this.$set(this.keshiData[i], 'isChecked', false)
        if (i == index) {
          this.$set(this.keshiData[i], 'isChecked', true)
          if (this.keshiData[i].departmentId == '-2') {
            this.queryParam.bqmc = ''
          } else {
            this.queryParam.bqmc = this.keshiData[i].departmentName
          }
          this.$refs.tableDispatch.refresh()
        }
      }
    },

    dispatchPlan() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请勾选分配计划的患者')
        return
      }
      let myData = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        myData.push(this.loadDataOut.rows[this.selectedRowKeys[i]])
      }

      //区别科室，一次只能给一个科室分配计划
      let deps = []
      for (let i = 0; i < myData.length; i++) {
        deps.push(myData[i].ks)
      }
      deps.sort()
      for (let i = 0; i < deps.length - 1; i++) {
        if (deps[i] != deps[i + 1]) {
          this.$message.error('请选择同一个科室的患者')
          return
        }
      }

      this.$router.push({ name: 'dispatch_plan', query: myData })
    },

    handleOkDispatch() {
      this.$refs.tableDispatch.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 计划分配方法*/

    /** 统计列表方法*/
    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParamsStat.beginDate = dateArr[0]
      this.queryParamsStat.endDate = dateArr[1]
    },

    onChangeBor(momentArr, dateArr) {
      this.createValueBor = momentArr
      this.queryParamsBor.beginDate = dateArr[0]
      this.queryParamsBor.endDate = dateArr[1]
    },

    reset() {
      // this.form.resetFields()
      this.queryParamsStat = JSON.parse(JSON.stringify(this.queryParamsStatOrigin))
      this.createValue = []
      this.$refs.tableStat.refresh()
    },
    resetBor() {
      // this.form.resetFields()
      this.queryParamsBor = JSON.parse(JSON.stringify(this.queryParamsBorOrigin))
      this.createValueBor = []
      this.getStatBorData()
    },

    delVersion(record) {
      deleteAppVersion({ id: record.id, state: 2 })
        .then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.$refs.table.refresh()
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('删除错误：' + err.message)
        })
    },

    //状态(1未注册；2待分配；3执行中；4超时；5电话随访；6失访；7已完成)
    //抽查状态(1已抽查0未抽查)
    getClassText(status) {
      if (status == 1) {
        return '未注册'
      } else if (status == 2) {
        return '待分配'
      } else if (status == 3) {
        return '执行中'
      } else if (status == 4) {
        return '超时'
      } else if (status == 5) {
        return '电话随访'
      } else if (status == 6) {
        return '失访'
      } else if (status == 7) {
        return '已完成'
      }
    },

    getCheckText(status) {
      if (status == 0) {
        return '未抽查'
      } else if (status == 1) {
        return '已抽查'
      }
    },

    handleOkStat() {
      this.$refs.tableStat.refresh()
    },
    /** 统计列表方法*/
  },
}
</script>

<style lang="less">
.div-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .card-right {
    overflow: hidden;
    width: 100% !important;

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

.div-service-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-service-left-service {
    background-color: white;
    padding: 2% 2%;
    float: left;
    height: 100%;
    min-height: 300px;
    border-right: 1px dashed #e6e6e6;
    width: 18%;
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

    .div-wrap-service {
      max-height: 662px;
      overflow-y: auto !important;

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
  }

  .card-right-service {
    overflow: hidden;
    width: 82%;

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

  .div-text-auto {
    width: 100%;
    display: inline-block;
    margin-top: -1.5%;
    .ant-input {
      height: 30px;
    }
  }
}

.row-stat {
  display: flex;
  flex-direction: row;

  align-items: center;
  width: 100%;

  .row-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 50px 50px;
    justify-content: center;
    border: 1px #ddd solid;
    border-radius: 10px;
    background-color: white;
    height: 260px;
    width: 30%;

    .item-inside {
      display: flex;
      flex-direction: row;
      align-items: center;

      .item-image {
        width: 50px;
        margin-top: 15px;
        height: 50px;
      }

      .item-right {
        display: flex;
        margin-left: 20px;
        flex-direction: column;

        .item-right-top {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          .item-stat-num {
            font-size: 46px;
          }
          .item-stat-unit {
            font-size: 20px;
          }
        }

        .item-stat-name {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
