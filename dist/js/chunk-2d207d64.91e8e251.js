(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d207d64"],{a1db:function(n,e,i){"use strict";i.r(e);var t=function(){var n=this,e=n.$createElement,i=n._self._c||e;return i("a-modal",{attrs:{title:"输入文字提醒",width:900,visible:n.visible,confirmLoading:n.confirmLoading},on:{ok:n.handleSubmit,cancel:n.handleCancel}},[i("a-input",{attrs:{"allow-clear":"",placeholder:"请输入提醒内容 "},model:{value:n.remindContent,callback:function(e){n.remindContent=e},expression:"remindContent"}})],1)},o=[],a={components:{},data:function(){return{remindContent:"",index:-1,confirmLoading:!1,visible:!1}},methods:{add:function(n){this.visible=!0,this.index=n},handleSubmit:function(){this.remindContent?(this.$emit("ok",this.index,this.remindContent),this.visible=!1):this.$message.error("请输入提醒内容")},handleCancel:function(){this.remindContent="",this.visible=!1}}},l=a,s=i("2877"),d=Object(s["a"])(l,t,o,!1,null,null,null);e["default"]=d.exports}}]);