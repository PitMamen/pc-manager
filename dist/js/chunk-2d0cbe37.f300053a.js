(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0cbe37"],{"4c1c":function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-modal",{attrs:{title:"编辑角色",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[t("a-spin",{attrs:{spinning:e.confirmLoading}},[t("a-form",{attrs:{form:e.form}},[t("a-form-item",{attrs:{label:"管理科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["caseManageIds",{rules:[{required:!0,message:"请选择管理科室！"}]}],expression:"['caseManageIds', { rules: [{ required: true, message: '请选择管理科室！' }] }]"}],attrs:{"allow-clear":"",mode:"multiple",placeholder:"请选择管理科室"}},e._l(e.keshiDataPerson,(function(a,s){return t("a-select-option",{key:s,attrs:{value:a.departmentId}},[e._v(e._s(a.departmentName))])})),1)],1)],1)],1)],1)},n=[],i=t("4cab"),r={data:function(){return{labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:11}},visible:!1,confirmLoading:!1,keshiDataPerson:[],caseManageIds:[],form:this.$form.createForm(this)}},created:function(){this.getDeptsOut()},methods:{add:function(e){var a=this;this.caseManageIds=e,this.visible=!0,setTimeout((function(){a.form.setFieldsValue({caseManageIds:e})}),100)},getDeptsOut:function(){var e=this;Object(i["gb"])().then((function(a){0==a.code&&(e.keshiDataPerson=JSON.parse(JSON.stringify(a.data)),e.keshiDataPerson.shift())}))},handleSubmit:function(){var e=this,a=this.form.validateFields;a((function(a,t){a?e.confirmLoading=!1:(e.$emit("ok",t),e.visible=!1)}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},o=r,l=t("2877"),c=Object(l["a"])(o,s,n,!1,null,null,null);a["default"]=c.exports}}]);