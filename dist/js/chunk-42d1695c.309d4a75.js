(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-42d1695c","chunk-2d20813a"],{"6c6c":function(e,t,a){},a2f9:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"选择计划",width:900,visible:e.visible,confirmLoading:e.confirmLoading,footer:""},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-table",{ref:"table",attrs:{pagination:!1,size:"default",columns:e.columns,"data-source":e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.pick(s)}}},[e._v("选择")])])}}])})],1)],1)},i=[],n=a("4cab"),r=a("2af9"),l={components:{STable:r["s"]},data:function(){return{columns:[{title:"序号",dataIndex:"xh"},{title:"计划名称",dataIndex:"goodsName"},{title:"科室",dataIndex:"keshiname"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:[],labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},type:"",form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(e){this.visible=!0;var t={pageNo:1,pageSize:50};this.getDepPlansOut(t)},getDepPlansOut:function(e){var t=this;Object(n["kb"])(e).then((function(e){if(0==e.code){for(var a=0;a<e.data.rows.length;a++)t.$set(e.data.rows[a],"xh",a+1),t.$set(e.data.rows[a],"goodsName",e.data.rows[a].templateName),t.$set(e.data.rows[a],"keshiname",e.data.rows[a].deptName);t.loadData=e.data.rows}else t.$message.error("获取计划列表失败："+e.message)}))},pick:function(e){this.$emit("ok",e),this.visible=!1},handleSubmit:function(){this.$emit("ok"),this.visible=!1},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},o=l,d=a("2877"),c=Object(d["a"])(o,s,i,!1,null,null,null);t["default"]=c.exports},aea0:function(e,t,a){"use strict";a("6c6c")},d7e5:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:e.title,width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("div",{staticClass:"div-order-detail",attrs:{id:"printContent"}},[a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 计划名称 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.planName)+" ")])]),a("a-button",{staticClass:"change-button",attrs:{type:"primary"},on:{click:function(t){return e.$refs.changePlan.add()}}},[e._v(e._s(e.changeText))]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 所属科室 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.selectedDeptname)+" ")])]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 是否开启 :")]),a("a-popconfirm",{staticClass:"switch-button",attrs:{title:e.isOpenText,"ok-text":"确定","cancel-text":"取消"},on:{confirm:function(t){return e.goOpen(e.record)}}},[a("a-switch",{attrs:{checked:e.isOpen}})],1)],1),a("div",{staticClass:"div-line-wrap"},[a("a-form-item",{staticClass:"span-item-name",attrs:{label:"管理科室","has-feedback":""}},[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["roleId",{rules:[{required:!0,message:"请选择科室管理！"}]}],expression:"['roleId', { rules: [{ required: true, message: '请选择科室管理！' }] }]"}],staticStyle:{width:"400px"},attrs:{name:"radioGroup","default-value":e.rangeValue},on:{change:e.radioChange}},[a("a-radio",{staticClass:"btn-add-plan",attrs:{value:1}},[e._v(" 全院 ")]),a("a-radio",{attrs:{value:2}},[e._v(" 部分科室 ")])],1)],1)],1),e.isshowDepa?a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 具体科室 :")]),a("a-select",{attrs:{"allow-clear":"",mode:"multiple",placeholder:"请选择科室"},model:{value:e.idArr,callback:function(t){e.idArr=t},expression:"idArr"}},e._l(e.originData,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.departmentId}},[e._v(e._s(t.departmentName))])})),1)],1):e._e(),a("div",{staticClass:"div-divider"})],1)]),a("change-plan",{ref:"changePlan",on:{ok:e.handleChoose}})],1)},i=[],n=(a("ac1f"),a("1276"),a("d3b7"),a("159b"),a("4cab")),r=a("a2f9"),l={components:{changePlan:r["default"]},data:function(){return{ruleId:"",title:"新增",rangeValue:"2",record:null,changeText:"选择",selectedtemplateId:"",planName:"请选择名称",selectedDeptname:"请选择科室",originData:[],idArr:[],isshowDepa:!1,index:-1,isOpenText:"确定开启吗?",isOpen:!1,labelCol:{xs:{span:24},sm:{span:2}},confirmLoading:!1,visible:!1}},methods:{add:function(e){if(this.visible=!0,this.record=e,e){this.title="配置",this.isOpen=this.record.ruleStatus,this.isOpen?this.isOpenText="确定关闭吗?":this.isOpenText="确定开启吗?",this.planName=this.record.planName,this.rangeValue=this.record.range,this.selectedDeptname=this.record.belongName,this.record.planName&&this.record.belongName&&(this.changeText="重新选择"),1==this.record.range?this.isshowDepa=!1:this.isshowDepa=!0,this.selectedtemplateId=this.record.templateId,this.idArr=this.record.usedDept.split(",");var t=[];this.idArr.forEach((function(e,a){""!=e&&t.push(parseInt(e))})),this.idArr=t}else this.title="新增"},radioChange:function(e){1==e.target.value?(this.rangeValue=1,this.isshowDepa=!1):2==e.target.value&&(this.rangeValue=2,this.isshowDepa=!0)},goOpen:function(){var e=this;this.isOpen?this.isOpen=!1:this.isOpen=!0,setTimeout((function(){e.isOpenText=e.isOpen?"确定关闭吗？":"确定开启吗？"}),200)},handleSubmit:function(){var e=this;if(this.planName&&this.selectedDeptname)if(this.isshowDepa&&0==this.idArr.length)this.$message.error("请选择具体科室名称！");else{var t="";this.idArr.length>0&&this.idArr.forEach((function(a,s){s!=e.idArr.length-1?t=t+a+",":t+=a}));var a=null;a=this.record?{ruleId:this.record.ruleId,ruleStatus:this.isOpen?1:0,templateId:this.selectedtemplateId,usedDept:1==this.rangeValue?"":t,range:this.rangeValue}:{ruleStatus:this.isOpen?1:0,templateId:this.selectedtemplateId,usedDept:t,range:this.rangeValue},this.confirmLoading=!0,Object(n["Tc"])(a).then((function(t){0==t.code?setTimeout((function(){e.confirmLoading=!1,e.$message.success("操作成功"),e.visible=!1,e.$emit("ok")}),1200):(e.confirmLoading=!1,e.$message.error("操作失败："+t.message))}))}else this.$message.error("请选择科室名称！")},handleCancel:function(){this.visible=!1},handleChoose:function(e){this.planName=e.templateName,this.selectedDeptname=e.deptName,this.selectedtemplateId=e.templateId,this.changeText="重新选择"}},created:function(){var e=this;Object(n["eb"])().then((function(t){0==t.code&&(e.originData=t.data,t.data.unshift({departmentId:"-2",departmentName:"全部",hospitalId:1,parentId:0,children:null}),e.keshiDataTemp=JSON.parse(JSON.stringify(e.originData)))}))}},o=l,d=(a("aea0"),a("2877")),c=Object(d["a"])(o,s,i,!1,null,null,null);t["default"]=c.exports}}]);