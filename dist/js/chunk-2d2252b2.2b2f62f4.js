(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2252b2"],{e2f5:function(e,a,i){"use strict";i.r(a);var n=function(){var e=this,a=e.$createElement,i=e._self._c||a;return i("a-modal",{attrs:{title:"修改检查",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[i("a-input",{attrs:{"allow-clear":"",placeholder:"请输入检查名称 "},model:{value:e.jianchaName,callback:function(a){e.jianchaName=a},expression:"jianchaName"}})],1)},t=[],c=(i("b0c0"),i("4cab")),s={data:function(){return{index:-1,jianchaName:"",record:{},confirmLoading:!1,visible:!1}},methods:{edit:function(e){this.visible=!0,this.jianchaName=e.name,this.record=e},handleSubmit:function(){var e=this;this.jianchaName?(this.record.name=this.jianchaName,Object(c["K"])(this.record).then((function(a){0==a.code?(e.$message.success("修改成功"),e.visible=!1,e.$emit("ok")):e.$message.error("修改失败："+a.message)}))):this.$message.error("请输入名称")},handleCancel:function(){this.visible=!1}}},o=s,l=i("2877"),r=Object(l["a"])(o,n,t,!1,null,null,null);a["default"]=r.exports}}]);