(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2105e1"],{b81f:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:"选择健康问卷",width:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:""},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[a("a-spin",{attrs:{spinning:t.confirmLoading}},[a("s-table",{ref:"table",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.code}},scopedSlots:t._u([{key:"action",fn:function(e,n){return a("span",{},[a("a",{on:{click:function(e){return t.pick(n)}}},[t._v("选择")])])}}])})],1)],1)},i=[],o=(a("d3b7"),a("159b"),a("b0c0"),a("4cab")),s=a("2af9"),l={components:{STable:s["s"]},data:function(){var t=this;return{queryParam:{yljgdm:"444885559"},columns:[{title:"序号",dataIndex:"xh"},{title:"名称",dataIndex:"name"},{title:"说明",dataIndex:"nameDes"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(e){return Object(o["V"])(Object.assign(e,t.queryParam)).then((function(t){var a={pageNo:e.pageNo,pageSize:e.pageSize,totalRows:t.data.total,totalPage:t.data.total/e.pageSize,rows:t.data.list};return a.rows.forEach((function(t,e){t.xh=(a.pageNo-1)*a.pageSize+(e+1),t.nameDes=t.name})),a}))},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},type:"",index:-1,form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(t){this.visible=!0,this.index=t},pick:function(t){this.$emit("ok",this.index,t),this.visible=!1},handleSubmit:function(){this.$emit("ok",this.index,this.type),this.visible=!1},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},c=l,r=a("2877"),d=Object(r["a"])(c,n,i,!1,null,null,null);e["default"]=d.exports}}]);