(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-52e90be3"],{"486b":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("a-modal",{attrs:{title:"随访二维码",width:900,visible:t.visible,footer:null,confirmLoading:t.confirmLoading},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[i("div",{staticClass:"div-notice"},[t._v("右键点击下方二维码选择【图片另存为】并添加.png或者.jpg的后缀进行保存！")]),i("div",{key:t.imgKeyDept},[i("img",{attrs:{src:t.extraImage,alt:"testload"}})])])},a=[],c=i("4cab"),o={data:function(){return{extraImage:"",confirmLoading:!1,visible:!1,record:{},imgKeyDept:""}},watch:{visible:function(){this.visible?this.imgKeyDept="":this.imgKeyDept=Math.random()}},methods:{add:function(t){var e=this;this.record={},this.record=t,this.visible=!0,Object(c["yb"])({ks:t.departmentId,bq:0}).then((function(t){0==t.code&&(e.extraImage=t.data)}))},handleSubmit:function(){},handleCancel:function(){this.visible=!1}}},s=o,l=(i("76a8"),i("2877")),r=Object(l["a"])(s,n,a,!1,null,null,null);e["default"]=r.exports},"76a8":function(t,e,i){"use strict";i("b909")},b909:function(t,e,i){}}]);