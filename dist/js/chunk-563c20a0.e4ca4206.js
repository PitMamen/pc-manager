(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-563c20a0"],{6903:function(t,i,s){},"793e":function(t,i,s){"use strict";s.r(i);var e=function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("a-modal",{attrs:{title:"终止条件配置",width:800,height:50,visible:t.visible,confirmLoading:t.confirmLoading},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[s("a-spin",{attrs:{spinning:t.confirmLoading}},[s("div",{staticClass:"stop-wrap"},t._l(t.stopTaskDetailDtos,(function(i,e){return s("div",{key:e,staticClass:"stop-row",attrs:{value:i.stopType}},[s("a-checkbox",{staticStyle:{"margin-left":"1%"},attrs:{checked:i.isChecked},on:{click:function(s){return t.goCheck(i)}}}),s("span",{staticStyle:{"margin-left":"1%",width:"120px"}},[t._v(t._s(i.stopTitle))]),1==i.stopType?s("a-date-picker",{staticStyle:{"margin-left":"1%"},attrs:{"default-value":t.nowDateBegin,format:"YYYY-MM-DD"},model:{value:i.conditionValue,callback:function(s){t.$set(i,"conditionValue",s)},expression:"item.conditionValue"}}):t._e(),2==i.stopType?s("a-select",{staticStyle:{"margin-left":"1%",width:"96px"},attrs:{"allow-clear":"",placeholder:"请选择名单"},model:{value:i.conditionValue,callback:function(s){t.$set(i,"conditionValue",s)},expression:"item.conditionValue"}},t._l(t.sourceData,(function(i,e){return s("a-select-option",{key:e,attrs:{value:i.value}},[t._v(t._s(i.description))])})),1):t._e(),3==i.stopType?s("a-input-number",{staticStyle:{display:"inline-block","margin-left":"1%",width:"96px"},attrs:{min:0,max:1e4,maxLength:30,"allow-clear":"",placeholder:"请输入数量"},model:{value:i.conditionValue,callback:function(s){t.$set(i,"conditionValue",s)},expression:"item.conditionValue"}}):t._e()],1)})),0)])],1)},o=[],a=(s("d3b7"),s("159b"),s("4de4"),s("7db0"),s("4cab"),s("ca00"),s("c1df")),n=s.n(a),l={data:function(){return{index:-1,chooseName:"",nowDateBegin:"",dateFormat:"YYYY-MM-DD",confirmLoading:!1,showList:!0,showNum:!0,stopTaskDetailDtos:[],stopTaskDetailDtosOrigin:[{conditionValue:void 0,stopType:1},{conditionValue:void 0,stopType:2},{conditionValue:void 0,stopType:3}],sourceData:[],visible:!1}},methods:{add:function(t,i,s,e){this.index=t,this.visible=!0,this.stopTaskDetailDtos=i,this.sourceData=s,this.nowDateBegin=n()(new Date,this.dateFormat),this.stopTaskDetailDtosOrigin[0].conditionValue=this.nowDateBegin,this.showList=0!=this.sourceData.length,this.showNum=1!=e,this.processData()},processData:function(){for(var t=this,i=[],s=function(s){var e=t.stopTaskDetailDtosOrigin[s],o=void 0;t.stopTaskDetailDtos&&(o=t.stopTaskDetailDtos.find((function(t){return t.stopType==e.stopType}))),o?(t.$set(o,"isChecked",!0),1==o.stopType&&(o.conditionValue=n()(o.conditionValue,"YYYY-MM-DD HH:mm:ss")),i.push(JSON.parse(JSON.stringify(o)))):(t.$set(e,"isChecked",!1),i.push(JSON.parse(JSON.stringify(e))))},e=0;e<this.stopTaskDetailDtosOrigin.length;e++)s(e);this.stopTaskDetailDtos=JSON.parse(JSON.stringify(i)),this.stopTaskDetailDtos.forEach((function(i){1==i.stopType?t.$set(i,"stopTitle","指定日期结束"):2==i.stopType&&t.$set(i,"stopTitle","出现在特殊名单"),3==i.stopType&&t.$set(i,"stopTitle","指定次数后结束")})),this.showList||(this.stopTaskDetailDtos=this.stopTaskDetailDtos.filter((function(t){return 2!=t.stopType}))),this.showNum||(this.stopTaskDetailDtos=this.stopTaskDetailDtos.filter((function(t){return 3!=t.stopType})))},goCheck:function(t){t.isChecked=!t.isChecked},handleSubmit:function(){for(var t=[],i=0;i<this.stopTaskDetailDtos.length;i++){this.stopTaskDetailDtos[i];if(this.stopTaskDetailDtos[i].isChecked){var s={};if(1==this.stopTaskDetailDtos[i].stopType){if(!this.stopTaskDetailDtos[i].conditionValue)return void this.$message.warn("请选择日期");s={stopType:1,conditionValue:n()(this.stopTaskDetailDtos[i].conditionValue).format("YYYY-MM-DD")+" 23:59:59"}}if(2==this.stopTaskDetailDtos[i].stopType){if(!this.stopTaskDetailDtos[i].conditionValue)return void this.$message.warn("请选择名单");s={stopType:2,conditionValue:this.stopTaskDetailDtos[i].conditionValue}}if(3==this.stopTaskDetailDtos[i].stopType){if(!this.stopTaskDetailDtos[i].conditionValue)return void this.$message.warn("请输入次数");s={stopType:3,conditionValue:this.stopTaskDetailDtos[i].conditionValue}}t.push(s)}}this.$emit("ok",this.index,t),this.visible=!1},handleCancel:function(){this.visible=!1}}},c=l,p=(s("b39c"),s("2877")),r=Object(p["a"])(c,e,o,!1,null,"477245e1",null);i["default"]=r.exports},b39c:function(t,i,s){"use strict";s("6903")}}]);