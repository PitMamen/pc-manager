(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e13f4"],{"7a2f":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:"科室配置",width:700,visible:t.visible,confirmLoading:t.confirmLoading},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[a("a-spin",{attrs:{spinning:t.confirmLoading}},[a("div",{staticClass:"div-order-detail",attrs:{id:"printContent"}},[a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[t._v(" 请输入门诊科室(需从HIS中获取)")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 请输入对应科室编码(需从HIS中获取)")])]),t._l(t.deptList,(function(e,i){return a("div",{key:e.departmentId+"",staticClass:"div-line-wrap"},[a("div",{staticClass:"global-search-wrapper",staticStyle:{width:"200px","margin-top":"3%",display:"inline-block"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入科室名称"},model:{value:e.attrValue,callback:function(a){t.$set(e,"attrValue",a)},expression:"item.attrValue"}})],1),a("div",{staticClass:"global-search-wrapper",staticStyle:{width:"200px","margin-top":"3%","margin-left":"20px",display:"inline-block"}},[a("a-input",{attrs:{type:"number","allow-clear":"",placeholder:"请输入科室编码"},model:{value:e.attrCode,callback:function(a){t.$set(e,"attrCode",a)},expression:"item.attrCode"}})],1),a("a-button",{staticStyle:{"margin-left":"20px"},attrs:{type:"danger"},on:{click:function(a){return t.deleteDept(i,e)}}},[t._v("删除")])],1)})),a("a-button",{staticClass:"btn-add",staticStyle:{"margin-top":"2%","margin-left":"28%"},attrs:{type:"primary"},on:{click:t.addItem}},[t._v("添加")])],2)])],1)},n=[],s=(a("a434"),a("d3b7"),a("159b"),a("4cab")),r={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,deptList:[{attrCode:"",attrValue:"",attrValueExt:"",deptId:this.departmentId,id:"",remark:""}],queryParams:{belong:"",departmentName:"",topFlag:"",departmentCode:""},departmentId:"",goodsAttrFullp:[],record:{},confirmLoading:!1,form:this.$form.createForm(this),keshiDataTemp:[]}},created:function(){},methods:{edit:function(t){this.visible=!0,this.record=t,this.departmentId=t.departmentId,this.getDepartmentAttr(this.record.departmentId)},deleteDept:function(t,e){var a=this;this.deptList.length<=1?this.$message.error("至少配置一个科室"):(this.deptList.splice(t,1),null!=e.id&&""!=e.id&&Object(s["v"])({id:e.id}).then((function(t){0==t.code&&a.$message.success("操作成功")})))},getDepartmentAttr:function(t){var e=this;Object(s["db"])({deptId:t}).then((function(t){0==t.code&&(0==t.data.length?e.deptList=[{attrCode:"",attrValue:"",attrValueExt:"",deptId:e.departmentId,id:"",remark:""}]:e.deptList=t.data)}))},addDepartmentAttr:function(t){var e=this;t.forEach((function(t,a){t.deptId=e.departmentId,a>0&&""==t.attrCode||null==t.attrCode?e.$message.error("请输入科室编码!"):(a>0&&""==t.attrValue||null==t.attrValue)&&e.$message.error("请输入科室名称!")})),Object(s["Pc"])(t).then((function(t){0==t.code&&(e.$message.success("添加成功！"),e.visible=!1)}))},addItem:function(){this.deptList.push({})},getDeptsOut:function(){var t=this;Object(s["eb"])().then((function(e){0==e.code&&(t.keshiData=e.data,t.keshiDataTemp=JSON.parse(JSON.stringify(t.keshiData)))}))},handleSubmit:function(){this.deptList.length<=0?this.$message.error("至少配置一个科室"):this.addDepartmentAttr(this.deptList)},handleCancel:function(){this.form.resetFields(),this.visible=!1,this.record={}}}},d=r,l=a("2877"),o=Object(l["a"])(d,i,n,!1,null,null,null);e["default"]=o.exports}}]);