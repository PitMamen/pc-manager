(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0f0f29"],{"9f17":function(e,a,r){"use strict";r.r(a);var o=function(){var e=this,a=e.$createElement,r=e._self._c||a;return r("a-modal",{attrs:{title:"新增职位",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[r("a-spin",{attrs:{spinning:e.confirmLoading}},[r("a-form",{attrs:{form:e.form}},[r("a-form-item",{attrs:{label:"职位名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"请输入职位名称！"}]}],expression:"['name', {rules: [{required: true, message: '请输入职位名称！'}]}]"}],attrs:{placeholder:"请输入职位名称"}})],1),r("a-form-item",{attrs:{label:"唯一编码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["code",{rules:[{required:!0,message:"请输入唯一编码！"}]}],expression:"['code', {rules: [{required: true,  message: '请输入唯一编码！'}]}]"}],attrs:{placeholder:"请输入唯一编码"}})],1),r("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"排序"}},[r("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["sort",{initialValue:100}],expression:"['sort', { initialValue: 100 }]"}],staticStyle:{width:"100%"},attrs:{placeholder:"请输入排序",min:1,max:1e3}})],1),r("a-form-item",{attrs:{label:"备注",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{rows:4,placeholder:"请输入备注"}})],1)],1)],1)],1)},l=[],i=(r("d3b7"),r("4cab")),t={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},methods:{add:function(e){this.visible=!0},handleSubmit:function(){var e=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,r){a?e.confirmLoading=!1:Object(i["qd"])(r).then((function(a){a.success?(e.$message.success("新增成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",r),e.form.resetFields()):e.$message.error("新增失败："+a.message)})).finally((function(a){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},s=t,n=r("2877"),c=Object(n["a"])(s,o,l,!1,null,null,null);a["default"]=c.exports}}]);