(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0ab507"],{"156c":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"选择计划类型",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"计划类型的",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-select",{attrs:{"allow-clear":"",placeholder:"请选择计划类型"},model:{value:e.type,callback:function(t){e.type=t},expression:"type"}},e._l(e.typeData,(function(t,n){return a("a-select-option",{key:n,attrs:{value:t.taskType}},[e._v(e._s(t.value))])})),1)],1),"Rdiagnosis"==e.type||"Ddiagnosis"==e.type?a("a-form-item",{attrs:{label:"提醒内容",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入提醒内容"},model:{value:e.remindContent,callback:function(t){e.remindContent=t},expression:"remindContent"}})],1):e._e()],1)],1)],1)},i=[],s=(a("d3b7"),a("159b"),a("4cab")),l={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},type:"",index:-1,remindContent:"",typeData:[{taskType:"Knowledge",value:"健康宣教"},{taskType:"Quest",value:"健康问卷"},{taskType:"Check",value:"检查"},{taskType:"Exam",value:"检验"}],form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(e){this.type="",this.index=e,this.visible=!0,this.index=e,this.remindContent="";var t=this;Object(s["yb"])().then((function(e){0==e.code&&(e.data.forEach((function(e){t.$set(e,"value",e.taskValue),delete e.taskValue})),t.typeData=e.data)}))},handleSubmit:function(){var e,t=this;this.type?(this.typeData.forEach((function(a){t.type==a.taskType&&(e=a)})),"Rdiagnosis"!=this.type&&"Ddiagnosis"!=this.type||this.remindContent?(this.$set(e,"remindContent",this.remindContent),this.$emit("ok",this.index,e),this.visible=!1):this.$message.error("请填写提醒内容")):this.$message.error("请选择计划类型")},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},o=l,r=a("2877"),p=Object(r["a"])(o,n,i,!1,null,null,null);t["default"]=p.exports}}]);