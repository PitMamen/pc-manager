<template>
  <a-modal
    title="不良事件登记"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="bad-wrap">
        <!-- 基本信息 -->
        <div class="wrap-info">
          <div class="info-per">
            <div>姓名：张三</div>
            <div class="shu-line"></div>
            <div>性别：男</div>
            <div class="shu-line"></div>
            <div>年龄：18</div>
            <div class="shu-line"></div>
            <div>联系方式：张18888888888</div>
          </div>
        </div>

        <div class="wrap-hor">
          <div class="hor-half">
            <div>业务单号：</div>
            <div>1454545</div>
          </div>
          <div class="hor-half">
            <div>业务类型：</div>
            <div>咨询服务类</div>
          </div>
        </div>

        <div class="wrap-hor">
          <div class="hor-half">
            <div>所属机构：</div>
            <div>湘雅二</div>
          </div>
          <div class="hor-half">
            <div>事件时间：</div>
            <div>2023-09-24</div>
          </div>
        </div>

        <a-form :form="form">
          <a-form-item v-show="false">
            <a-input v-decorator="['id']" />
          </a-form-item>

          <a-form-item
            label="事件描述"
            class="remark"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            has-feedback
            style="position: relative; margin-top: 10px"
          >
            <a-textarea
              :rows="4"
              :maxLength="500"
              placeholder="请输入事件描述"
              style="min-height: 100px"
              v-decorator="['wardName', { rules: [{ required: true, message: '请输入事件描述！' }] }]"
            ></a-textarea>
            <span class="m-count">{{ textLength() }}/200 </span>
          </a-form-item>
          <a-form-item
            label="备注说明"
            class="remark"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            has-feedback
            style="position: relative; margin-top: 10px"
          >
            <a-textarea
              :rows="4"
              :maxLength="500"
              placeholder="备注说明"
              style="min-height: 100px"
              v-decorator="['wardIntroduce']"
            ></a-textarea>
            <span class="m-count">{{ textLength() }}/200 </span>
          </a-form-item>
          <a-form-item
            label="备注说明"
            class="remark"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            has-feedback
            style="position: relative; margin-top: 10px"
          >
            <a-textarea
              :rows="4"
              :maxLength="500"
              placeholder="备注说明"
              style="min-height: 100px"
              v-decorator="['wardIntroduce']"
            ></a-textarea>
            <span class="m-count">{{ textLength() }}/200 </span>
          </a-form-item>
          <a-form-item
            label="备注说明"
            class="remark"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            has-feedback
            style="position: relative; margin-top: 10px"
          >
            <a-textarea
              :rows="4"
              :maxLength="500"
              placeholder="备注说明"
              style="min-height: 100px"
              v-decorator="['wardIntroduce']"
            ></a-textarea>
            <span class="m-count">{{ textLength() }}/200 </span>
          </a-form-item>
          <a-form-item
            label="备注说明"
            class="remark"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            has-feedback
            style="position: relative; margin-top: 10px"
          >
            <a-textarea
              :rows="4"
              :maxLength="500"
              placeholder="备注说明"
              style="min-height: 100px"
              v-decorator="['wardIntroduce']"
            ></a-textarea>
            <span class="m-count">{{ textLength() }}/200 </span>
          </a-form-item>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="上报时间"
                class="row-bottom-0"
                :labelCol="{
                  span: 8,
                  offset: 0,
                }"
                :wrapperCol="{
                  span: 16,
                  offset: 0,
                }"
                has-feedback
              >
                <a-input
                  placeholder="病区名称"
                  v-decorator="['wardName', { rules: [{ required: false, message: '请输入病区名称！' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="上报人"
                class="row-bottom-0"
                :labelCol="{
                  span: 6,
                  offset: 0,
                }"
                :wrapperCol="{
                  span: 18,
                  offset: 0,
                }"
                has-feedback
              >
                <a-input
                  placeholder="病区名称"
                  v-decorator="['wardName', { rules: [{ required: false, message: '请输入病区名称！' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { queryHospitalList as list2 } from '@/api/modular/system/posManage'
import { update } from '@/api/modular/system/ward'
export default {
  data() {
    return {
      labelCol: {
        span: 4,
        offset: 0,
      },
      wrapperCol: {
        span: 20,
        offset: 0,
      },

      visible: false,
      confirmLoading: false,

      treeData: [],
      form: this.$form.createForm(this),
    }
  },
  methods: {
    // 初始化方法
    edit(item) {
      this.visible = true
      this.getTreeData()
      setTimeout(() => {
        this.form.setFieldsValue({
          id: item.id,
          selectHospitalCode: item.hospital_code,
          wardName: item.ward_name,
          wardOrder: item.ward_order,
          bedQuantity: item.bed_quantity,
          hisId: item.his_id,
          hisName: item.his_name,
          wardIntroduce: item.ward_introduce,
        })
      })
    },
    getTreeData() {
      this.confirmLoading = true
      list2({
        status: 1,
        tenantId: '',
        hospitalName: '',
      })
        .then((res) => {
          if (res.code === 0) {
            this.treeData = (res.data || []).map((item) => {
              const tree = {
                key: item.hospitalCode,
                value: item.hospitalCode,
                title: item.hospitalName,
              }
              if (item.hospitals && item.hospitals.length > 0) {
                tree.children = item.hospitals.map((item_) => {
                  return {
                    key: item_.hospitalCode,
                    value: item_.hospitalCode,
                    title: item_.hospitalName,
                  }
                })
              }
              return tree
            })
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    geneSubmitData(values) {
      for (let x = 0; x < this.treeData.length; x++) {
        const tree = this.treeData[x]
        if (tree.value === values.selectHospitalCode) {
          values.parentDisarmamentName = tree.title
          return values
        }
        if (tree.children && tree.children.length > 0) {
          for (let y = 0; y < tree.children.length; y++) {
            const tree_ = tree.children[y]
            if (tree_.value === values.selectHospitalCode) {
              values.parentDisarmamentName = tree_.title
              return values
            }
          }
        }
      }
      return values
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          update(this.geneSubmitData(values))
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('修改成功')
                this.$emit('ok', values)
                this.handleCancel()
                this.clearDatas()
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    //字数统计
    textLength() {
      if (this.form) {
        return (this.form.getFieldValue('wardIntroduce') || '').length
      } else {
        return 0
      }
    },
    handleCancel() {
      this.visible = false
    },
    clearDatas() {
      this.form.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.bad-wrap {
  color: #4d4d4d;
  font-size: 12px;
  .wrap-info {
    // padding-left: 10px;
    .info-per {
      display: flex;
      flex-direction: row;
      align-items: center;

      .shu-line {
        margin: 0 8px;
        height: 10px;
        width: 1px;
        background-color: #999;
      }
    }
  }

  .wrap-hor {
    display: flex;
    flex-direction: row;

    align-items: center;
    margin-top: 10px;

    .hor-half {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 50%;
    }
  }
}
.remark {
  /deep/ .ant-col-3 {
    line-height: 22px;
  }
}
// /deep/ .ant-col-3 {
//   width: calc(12.5% - 16.4px);
// }
// /deep/ .ant-col-21 {
//   width: calc(87.5% + 16.4px);
// }
.m-count {
  position: absolute;
  font-size: 12px;
  bottom: -11px;
  right: 26px;
}
</style>
