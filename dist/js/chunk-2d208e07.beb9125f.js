(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d208e07"],{a750:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"编辑问答",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"所属类别",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["knowledgeType",{rules:[{required:!0,message:"请选择类别"}]}],expression:"['knowledgeType', { rules: [{ required: true, message: '请选择类别' }] }]"}],attrs:{"allow-clear":"",placeholder:"请选择类别"}},e._l(e.statusData,(function(t,r){return a("a-select-option",{key:r,attrs:{value:t.code}},[e._v(e._s(t.value))])})),1)],1),a("a-form-item",{attrs:{label:"内容标题",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["title",{rules:[{required:!0,message:"请输入内容标题！"}]}],expression:"['title', { rules: [{ required: true, message: '请输入内容标题！' }] }]"}],attrs:{placeholder:"请输入内容标题"}})],1),a("a-form-item",{attrs:{label:"内容详情",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["content",{rules:[{required:!0,message:"请输入内容详情！"}]}],expression:"['content', { rules: [{ required: true, message: '请输入内容详情！' }] }]"}],attrs:{placeholder:"请输入内容详情"}})],1)],1)],1)],1)},o=[],s=(a("7db0"),a("d3b7"),a("4cab")),l={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},statusData:[],visible:!1,record:{},confirmLoading:!1,form:this.$form.createForm(this)}},created:function(){var e=this;Object(s["ic"])("KNOWLEDGE_TYPE").then((function(t){0==t.code&&t.data&&t.data.length>0&&(e.statusData=t.data)}))},methods:{edit:function(e){var t=this;this.visible=!0,this.record={},this.record=e,setTimeout((function(){t.form.setFieldsValue({knowledgeType:e.knowledgeType,title:e.title,content:e.content})}),100)},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){if(t)e.confirmLoading=!1;else{var r=e.statusData.find((function(e){return e.code==a.knowledgeType}));e.record.knowledgeType=a.knowledgeType,e.record.title=a.title,e.record.content=a.content,e.record.typeName=r.value,delete e.record.updateTimeOut,delete e.record.xh,Object(s["Sc"])(e.record).then((function(t){t.success?(e.$message.success("编辑成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",a),e.form.resetFields()):e.$message.error("编辑失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},n=l,i=a("2877"),c=Object(i["a"])(n,r,o,!1,null,null,null);t["default"]=c.exports}}]);