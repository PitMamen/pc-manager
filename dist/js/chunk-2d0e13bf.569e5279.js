(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e13bf"],{"7a21":function(t,n,e){"use strict";e.r(n);var a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("a-modal",{attrs:{title:"选择检查",width:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:""},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[e("a-spin",{attrs:{spinning:t.confirmLoading}},[e("s-table",{ref:"table",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.code}},scopedSlots:t._u([{key:"action",fn:function(n,a){return e("span",{},[e("a",{on:{click:function(n){return t.pick(a)}}},[t._v("选择")])])}}])})],1)],1)},i=[],s=(e("b0c0"),e("4cab")),o=e("2af9"),r={components:{STable:o["s"]},data:function(){var t=this;return{queryParam:{type:"Check"},columns:[{title:"序号",dataIndex:"xh"},{title:"名称",dataIndex:"name"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(n){return Object(s["db"])(Object.assign(n,t.queryParam)).then((function(n){for(var e=0;e<n.data.rows.length;e++)t.$set(n.data.rows[e],"xh",e+1+(n.data.pageNo-1)*n.data.pageSize),t.$set(n.data.rows[e],"nameDes",n.data.rows[e].name);return n.data}))},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},index:-1,form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(t){this.visible=!0,this.index=t},pick:function(t){this.$emit("ok",this.index,t),this.visible=!1},handleSubmit:function(){this.$emit("ok",this.index,this.type),this.visible=!1},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},c=r,l=e("2877"),d=Object(l["a"])(c,a,i,!1,null,null,null);n["default"]=d.exports}}]);