(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2082eb"],{a468:function(e,a,r){"use strict";r.r(a);var s=function(){var e=this,a=e.$createElement,r=e._self._c||a;return r("a-modal",{attrs:{title:"修改医生用户",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[r("a-spin",{attrs:{spinning:e.confirmLoading}},[r("a-form",{attrs:{form:e.form}},[r("a-form-item",{staticStyle:{display:"none"},attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["id"],expression:"['id']"}]})],1),r("a-form-item",{attrs:{label:"姓名",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["xm",{rules:[{required:!0,message:"请输入姓名！"}]}],expression:"['xm', { rules: [{ required: true, message: '请输入姓名！' }] }]"}],attrs:{disabled:"",placeholder:"请输入姓名"}})],1),r("a-form-item",{attrs:{label:"性别",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["xb",{rules:[{required:!0,message:"请选择性别！"}]}],expression:"['xb', { rules: [{ required: true, message: '请选择性别！' }] }]"}],attrs:{name:"radioGroup","default-value":1}},[r("a-radio",{attrs:{value:1}},[e._v(" 男 ")]),r("a-radio",{staticStyle:{width:"100px"},attrs:{value:2}},[e._v(" 女 ")])],1)],1),r("a-form-item",{attrs:{label:"所属机构科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["jg",{rules:[{required:!0,message:"请选择机构"}]}],expression:"['jg', { rules: [{ required: true, message: '请选择机构' }] }]"}],attrs:{"allow-clear":"",placeholder:"湘雅附二医院"}},e._l(e.hosData,(function(a,s){return r("a-select-option",{key:s,attrs:{value:a.code}},[e._v(e._s(a.value))])})),1)],1),r("a-form-item",{attrs:{label:"科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["ssks",{rules:[{required:!0,message:"请选择科室"}]}],expression:"['ssks', { rules: [{ required: true, message: '请选择科室' }] }]"}],attrs:{"allow-clear":"",placeholder:"请选择科室"},on:{select:e.onSelected}},e._l(e.keshiData,(function(a,s){return r("a-select-option",{key:s,attrs:{value:a.yyksdm}},[e._v(e._s(a.yyksmc))])})),1)],1),r("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"职称","has-feedback":""}},[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["zhic",{rules:[{required:!0,message:"请输入职称！"}]}],expression:"['zhic', { rules: [{ required: true, message: '请输入职称！' }] }]"}],attrs:{placeholder:"请输入职称"}})],1),r("a-form-item",{attrs:{label:"手机号码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["tel",{rules:[{required:!0,message:"请输入手机号码！"}]}],expression:"['tel', { rules: [{ required: true, message: '请输入手机号码！' }] }]"}],attrs:{placeholder:"请输入手机号码"}})],1)],1)],1)],1)},t=[],l=(r("99af"),r("d3b7"),r("4cab")),i={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},keshiData:[],hosData:[{code:"444885559",value:"湘雅附二医院"}],visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},created:function(){this.getKeShi()},methods:{edit:function(e){var a=this;this.visible=!0,setTimeout((function(){a.form.setFieldsValue({id:e.id,xm:e.xm,jg:"湘雅附二医院",ssks:e.ssks,zhic:e.zhic,tel:e.tel}),"男"!=e.xb&&e.xb?a.form.setFieldsValue({xb:2}):a.form.setFieldsValue({xb:1})}),100)},onSelected:function(e){for(var a=0;a<this.keshiData.length;a++)this.keshiData[a].yyksdm==e&&(this.seletSsksName=this.keshiData[a].yyksmc)},getKeShi:function(){var e=this;Object(l["rb"])({hospitalCode:"444885559"}).then((function(a){if(a.success){for(var r=[],s=0;s<a.data.length;s++)a.data[s].departmentList&&a.data[s].departmentList.length>0&&(r=r.concat(a.data[s].departmentList));e.keshiData=r}})).catch((function(e){}))},handleSubmit:function(){var e=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,r){a?e.confirmLoading=!1:(1==r.xb?r.xb="男":r.xb="女",r.ssksName=e.seletSsksName,delete r.jg,Object(l["i"])(r).then((function(a){a.success?(e.$message.success("编辑成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",r),e.form.resetFields()):e.$message.error("编辑失败："+a.message)})).finally((function(a){e.confirmLoading=!1})))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},o=i,n=r("2877"),c=Object(n["a"])(o,s,t,!1,null,null,null);a["default"]=c.exports}}]);