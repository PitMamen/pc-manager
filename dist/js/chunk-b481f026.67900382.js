(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b481f026","chunk-2d2228fc","chunk-2d0a3734"],{"01da":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:"选择健康宣教",width:900,height:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:""},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[a("a-spin",{attrs:{spinning:t.confirmLoading}},[a("s-table",{ref:"table",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.code}},scopedSlots:t._u([{key:"action",fn:function(e,i){return a("span",{},[a("a",{on:{click:function(e){return t.pick(i)}}},[t._v("选择")])])}}])})],1)],1)},n=[],s=(a("d3b7"),a("159b"),a("4cab")),l=a("2af9"),o={components:{STable:l["s"]},data:function(){var t=this;return{queryParam:{deptCode:""},columns:[{title:"序号",dataIndex:"xh"},{title:"名称",dataIndex:"title"},{title:"说明",dataIndex:"brief"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(e){return Object(s["T"])(Object.assign(e,t.queryParam)).then((function(t){var a={pageNo:e.pageNo,pageSize:e.pageSize,totalRows:t.data.total,totalPage:t.data.total/e.pageSize,rows:t.data.list};return a.rows.forEach((function(t,e){t.xh=(a.pageNo-1)*a.pageSize+(e+1)})),a}))},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},type:"",index:-1,form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(t,e){this.visible=!0,this.queryParam.deptCode=e,this.index=t,this.$refs.table.refresh()},pick:function(t){this.$emit("ok",this.index,t),this.visible=!1},handleSubmit:function(){this.$emit("ok",this.index,this.type),this.visible=!1},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},c=o,d=a("2877"),r=Object(d["a"])(c,i,n,!1,null,null,null);e["default"]=r.exports},"060f":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:t.id?"修改微信模板":"新增微信模板",width:800,visible:t.visible,confirmLoading:t.confirmLoading},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[a("a-spin",{attrs:{spinning:t.confirmLoading}},[a("div",{staticClass:"div-check3"},[a("div",{staticClass:"div-part"},[a("div",{staticClass:"div-line-wrap"},[a("div",{staticClass:"div-left"},[a("span",{staticClass:"span-item-name"},[t._v("公众号 :")]),a("a-select",{attrs:{"allow-clear":"",placeholder:"请选择"},on:{change:t.onWXProgramChange},model:{value:t.checkData.wxAppId,callback:function(e){t.$set(t.checkData,"wxAppId",e)},expression:"checkData.wxAppId"}},t._l(t.wxgzhData,(function(e,i){return a("a-select-option",{key:i,attrs:{value:e.wxAppId}},[t._v(t._s(e.wxPublicName))])})),1)],1),a("div",{staticClass:"div-left",staticStyle:{"padding-left":"20px"}},[a("span",{staticClass:"span-item-name"},[t._v("模 板 I D :")]),a("a-select",{attrs:{"allow-clear":"",placeholder:"请选择"},on:{change:t.onTemplateChange},model:{value:t.checkData.templateId,callback:function(e){t.$set(t.checkData,"templateId",e)},expression:"checkData.templateId"}},t._l(t.templateData,(function(e,i){return a("a-select-option",{key:i,attrs:{value:e.templateId}},[t._v(t._s(e.title))])})),1)],1)]),a("div",{staticClass:"div-line-wrap"},[a("div",{staticClass:"div-left"},[a("span",{staticClass:"span-item-name"},[t._v("内部编码 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block"},attrs:{readOnly:"","allow-clear":"",placeholder:"请输入内部编码 "},model:{value:t.templateContent.templateId,callback:function(e){t.$set(t.templateContent,"templateId",e)},expression:"templateContent.templateId"}})],1),a("div",{staticClass:"div-left",staticStyle:{"padding-left":"20px"}},[a("span",{staticClass:"span-item-name"},[t._v("模板标题 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block"},attrs:{"allow-clear":"",type:"text",maxLength:30,placeholder:"请输入模板标题 "},model:{value:t.checkData.templateTitle,callback:function(e){t.$set(t.checkData,"templateTitle",e)},expression:"checkData.templateTitle"}})],1)]),a("div",{staticClass:"div-line-wrap"},[a("div",{staticClass:"div-total-one"},[a("span",{staticClass:"span-item-name",staticStyle:{position:"relative",top:"-43px"}},[t._v("模板内容 :")]),a("a-textarea",{staticClass:"span-item-value",staticStyle:{height:"65px !important",width:"695px !important",display:"inline-block"},attrs:{readOnly:"","allow-clear":"",placeholder:"请输入模板内容 "},model:{value:t.templateContent.content,callback:function(e){t.$set(t.templateContent,"content",e)},expression:"templateContent.content"}})],1)]),t._l(t.fieldList,(function(e,i){return a("div",{key:i,staticClass:"div-line-wrap",attrs:{value:e}},[a("div",{staticClass:"div-left",staticStyle:{width:"205px","margin-left":"65px"}},[a("span",{staticClass:"span-item-name",staticStyle:{width:"100% !important"}},[t._v("模板参数"+t._s(i+1)+" :["+t._s(e.name)+"]")])]),a("div",{staticClass:"div-left",staticStyle:{width:"205px","margin-right":"80px"}},[a("span",{staticClass:"span-item-name"},[t._v("匹配字段 :")]),a("a-select",{staticStyle:{width:"140px !important"},attrs:{"allow-clear":"",placeholder:"请选择字段属性"},on:{change:function(e){return t.onFiledChange(i)}},model:{value:t.fieldList[i].property,callback:function(e){t.$set(t.fieldList[i],"property",e)},expression:"fieldList[index].property"}},t._l(t.zdsxData,(function(e,i){return a("a-select-option",{key:i,attrs:{value:e}},[t._v(t._s(e))])})),1)],1),a("div",{staticClass:"div-left",staticStyle:{width:"205px"}},[a("a-select",{directives:[{name:"show",rawName:"v-show",value:"档案字段"===e.property&&e.name.indexOf("time")<0,expression:"item.property === '档案字段' && item.name.indexOf('time') < 0"}],staticStyle:{width:"100% !important"},attrs:{"allow-clear":"",placeholder:"请选择参数"},model:{value:t.fieldList[i].content,callback:function(e){t.$set(t.fieldList[i],"content",e)},expression:"fieldList[index].content"}},t._l(t.dananfieldList,(function(e,i){return a("a-select-option",{key:i,attrs:{value:e.tableField}},[t._v(t._s(e.fieldComment))])})),1),a("a-select",{directives:[{name:"show",rawName:"v-show",value:"档案字段"===e.property&&e.name.indexOf("time")>-1,expression:"item.property === '档案字段' && item.name.indexOf('time') > -1"}],staticStyle:{width:"100% !important"},attrs:{"allow-clear":"",placeholder:"请选择参数"},model:{value:t.fieldList[i].content,callback:function(e){t.$set(t.fieldList[i],"content",e)},expression:"fieldList[index].content"}},t._l(t.danandataList,(function(e,i){return a("a-select-option",{key:i,attrs:{value:e.tableField}},[t._v(t._s(e.fieldComment))])})),1),a("a-input",{directives:[{name:"show",rawName:"v-show",value:"自定义传参"===e.property,expression:"item.property === '自定义传参'"}],staticClass:"span-item-value",staticStyle:{width:"100%","margin-left":"0",display:"inline-block"},attrs:{"allow-clear":"",maxLength:150,placeholder:"请输入参数,不超过150字 "},model:{value:t.fieldList[i].content,callback:function(e){t.$set(t.fieldList[i],"content",e)},expression:"fieldList[index].content"}})],1)])})),a("div",{staticClass:"div-line-wrap"},[a("div",{staticClass:"div-total-one"},[a("span",{staticClass:"span-item-name"},[t._v(" 跳转内容 :")]),a("a-radio-group",{staticStyle:{width:"70%","margin-left":"0%"},attrs:{name:"radioGroup"},on:{change:t.radioChange},model:{value:t.radioTyPe,callback:function(e){t.radioTyPe=e},expression:"radioTyPe"}},[a("a-radio",{attrs:{value:0}},[t._v(" 问卷 ")]),a("a-radio",{staticStyle:{"margin-left":"16px"},attrs:{value:1}},[t._v(" 宣教 ")]),a("a-radio",{staticStyle:{"margin-left":"16px"},attrs:{value:2}},[t._v(" 不跳转任何内容 ")]),a("a-radio",{staticStyle:{"margin-left":"16px"},attrs:{value:3}},[t._v(" 跳转外网地址 ")])],1)],1)]),a("div",{directives:[{name:"show",rawName:"v-show",value:0===t.radioTyPe,expression:"radioTyPe === 0"}],staticClass:"div-line-wrap"},[a("div",{staticClass:"div-total-one"},[a("span",{staticClass:"span-item-name"},[t._v("问卷名称 :")]),a("a-input",{directives:[{name:"show",rawName:"v-show",value:t.questionContent.name,expression:"questionContent.name"}],staticClass:"span-item-value",staticStyle:{display:"inline-block","margin-right":"20px",width:"410px"},attrs:{"allow-clear":"",readOnly:"",placeholder:"请选择问卷 "},model:{value:t.questionContent.name,callback:function(e){t.$set(t.questionContent,"name",e)},expression:"questionContent.name"}}),a("a-button",{attrs:{type:"primary"},on:{click:t.selectQestionBtn}},[t._v(" 选择 ")])],1)]),a("div",{directives:[{name:"show",rawName:"v-show",value:1===t.radioTyPe,expression:"radioTyPe === 1"}],staticClass:"div-line-wrap"},[a("div",{staticClass:"div-total-one"},[a("span",{staticClass:"span-item-name"},[t._v("宣教名称 :")]),a("a-input",{directives:[{name:"show",rawName:"v-show",value:t.teachContent.title,expression:"teachContent.title"}],staticClass:"span-item-value",staticStyle:{display:"inline-block","margin-right":"20px",width:"410px"},attrs:{readOnly:"","allow-clear":"",placeholder:"请选择宣教文章 "},model:{value:t.teachContent.title,callback:function(e){t.$set(t.teachContent,"title",e)},expression:"teachContent.title"}}),a("a-button",{attrs:{type:"primary"},on:{click:t.selectTeachBtn}},[t._v(" 选择 ")])],1)]),a("div",{directives:[{name:"show",rawName:"v-show",value:3===t.radioTyPe,expression:"radioTyPe === 3"}],staticClass:"div-line-wrap"},[a("div",{staticClass:"div-total-one"},[a("span",{staticClass:"span-item-name"},[t._v("外网地址 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"410px"},attrs:{"allow-clear":"",placeholder:"请输入第三方链接 "},model:{value:t.checkData.navigatorContent,callback:function(e){t.$set(t.checkData,"navigatorContent",e)},expression:"checkData.navigatorContent"}})],1)])],2),a("add-question",{ref:"addQuestion",on:{ok:t.handleQuestion}}),a("add-teach",{ref:"addTeach",on:{ok:t.handleTeach}})],1)])],1)},n=[],s=(a("d3b7"),a("159b"),a("b0c0"),a("ac1f"),a("4de4"),a("4cab")),l=a("ceae"),o=a("01da"),c={components:{addQuestion:l["default"],addTeach:o["default"]},data:function(){return{visible:!1,confirmLoading:!1,key:"",id:"",templateBean:"",advanced:!1,radioTyPe:0,checkData:{wxConfigureId:"",wxAppId:"",templateId:"",templateTitle:"",navigatorType:"",navigatorContent:""},templateContent:{templateId:"",title:"",primaryIndustry:"",deputyIndustry:"",content:"",example:""},questionContent:{name:""},teachContent:{title:""},wxgzhData:[],templateData:[],zdsxData:["档案字段","自定义传参"],fieldList:[],dananfieldList:[],danandataList:[],navigateListData:[]}},methods:{clearData:function(){this.id="",this.wxgzhData=[],this.checkData={smsConfigureId:"",id:"",supplierName:"",templateId:"",smsTemplateTitle:"",templateTitle:"",navigatorType:"",navigatorContent:""},this.templateContent={smsConfigureId:"",smsTemplateCode:"",smsTemplateTitle:"",smsTemplateContent:""},this.fieldList=[],this.radioTyPe=0,this.questionContent={name:""},this.teachContent={title:""}},addModel:function(){var t=this;this.clearData(),this.visible=!0,this.confirmLoading=!1,Object(s["Rb"])({}).then((function(e){0==e.code&&(t.wxgzhData=e.data)})),Object(s["rc"])({databaseTableName:"tb_patient_baseinfo"}).then((function(e){if(0==e.code){t.dananfieldList=e.data[0].detail;var a=[];t.dananfieldList.forEach((function(t){2==t.fieldType.value&&a.push(t)})),t.danandataList=a}}))},checkModel:function(t){var e=this;this.clearData(),this.visible=!0,this.id=t,this.confirmLoading=!0,Object(s["Rb"])({}).then((function(t){0==t.code&&(e.wxgzhData=t.data,Object(s["Tb"])(e.id).then((function(t){if(0==t.code){e.checkData=t.data,e.templateContent.templateId=t.data.templateId,e.templateContent.content=t.data.templateContent,e.templateContent.title=t.data.templateName;var a=[];e.wxgzhData.forEach((function(e){e.wxAppId===t.data.wxAppId&&a.push(e)})),e.wxgzhData=a,e.radioTyPe=t.data.jumpType-1,0==e.radioTyPe?(e.questionContent.questUrl=t.data.jumpValue,e.questionContent.name=t.data.jumpTitle,e.questionContent.id=t.data.jumpId):1==e.radioTyPe?(e.teachContent.articleId=t.data.jumpId,e.teachContent.title=t.data.jumpTitle):3==e.radioTyPe&&e.$set(e.checkData,"navigatorContent",t.data.jumpValue),e.fieldList=JSON.parse(t.data.templateParamJson),e.onWXProgramChange(t.data.wxAppId)}else e.$message.error(t.message);e.confirmLoading=!1})))})),Object(s["rc"])({databaseTableName:"tb_patient_baseinfo"}).then((function(t){if(0==t.code){e.dananfieldList=t.data[0].detail;var a=[];e.dananfieldList.forEach((function(t){2==t.fieldType.value&&a.push(t)})),e.danandataList=a}}))},handleChange:function(t){},onWXProgramChange:function(t){var e=this;this.wxgzhData.forEach((function(a){a.wxAppId===t&&(e.checkData.wxConfigureId=a.id)})),this.getTemplateWxMsg(t,"")},getTemplateWxMsg:function(t,e){var a=this;Object(s["Ob"])({templateId:e,wxAppId:t,wxPublicName:"",wxSecret:""}).then((function(t){if(0==t.code)if(a.$route.query.id){var e=[];t.data.forEach((function(t){t.templateId===a.checkData.templateId&&e.push(t)})),a.templateData=e}else a.templateData=t.data}))},onTemplateChange:function(t){var e=this;this.templateData.forEach((function(a){a.templateId===t&&(e.templateContent=a,e.fieldList=[])}));var a,i=this.templateContent.content,n=/\{\{(.+?)\./g;while(null!=(a=n.exec(i)))this.fieldList.push({name:a[1],property:"请选择",content:""})},fieldSXChange:function(t){this.fieldList[t]},radioChange:function(t){this.radioTyPe=t.target.value},handleSearch:function(t){this.ksTypeDataTemp=t?this.ksTypeData.filter((function(e){return-1!=e.departmentName.indexOf(t)})):JSON.parse(JSON.stringify(this.ksTypeData))},onFiledChange:function(t){this.fieldList[t].content=""},selectQestionBtn:function(){this.$refs.addQuestion.add(0)},selectTeachBtn:function(){this.$refs.addTeach.add(0,"")},handleQuestion:function(t,e){this.questionContent=e},handleTeach:function(t,e){this.teachContent=e},readTemplateInfoBtn:function(){},goConfirm:function(){if(this.checkData.wxAppId)if(this.checkData.templateId)if(this.checkData.templateTitle){for(var t=0;t<this.fieldList.length;t++)if(!this.fieldList[t].content)return void this.$message.error("模板参数"+this.fieldList[t].name+"为空");var e="",a="",i="";if(-1!=this.radioTyPe){if(0==this.radioTyPe){if(!this.questionContent.questUrl)return void this.$message.error("请选择问卷");e=this.questionContent.questUrl,a=this.questionContent.name,i=this.questionContent.id}else if(1==this.radioTyPe){if(!this.teachContent.articleId)return void this.$message.error("请选择宣教文章");e=this.teachContent.articleId,a=this.teachContent.title,i=this.teachContent.articleId}else if(3==this.radioTyPe){if(!this.checkData.navigatorContent)return void this.$message.error("请输入第三方链接");e=this.checkData.navigatorContent,a=this.checkData.navigatorContent}var n={wxAppId:this.checkData.wxAppId,wxConfigureId:this.checkData.wxConfigureId,templateId:this.checkData.templateId,templateStatus:1,templateTitle:this.checkData.templateTitle,templateContent:this.templateContent.content,templateName:this.templateContent.title,jumpType:this.radioTyPe+1,jumpValue:e,jumpTitle:a,jumpId:i,templateParamJson:JSON.stringify(this.fieldList)};this.confirmLoading=!0,this.id?(n.id=this.id,this.modify(n)):this.add(n)}else this.$message.error("请选择跳转类型")}else this.$message.error("请输入模板标题");else this.$message.error("请选择模板ID");else this.$message.error("请选择微信公众号")},add:function(t){var e=this;Object(s["g"])(t).then((function(t){0==t.code?(e.$message.success("新增成功！"),e.visible=!1,e.$emit("ok","")):e.$message.error(t.message),e.confirmLoading=!1}))},modify:function(t){var e=this;Object(s["ec"])(t).then((function(t){0==t.code?(e.$message.success("修改成功！"),e.visible=!1,e.$emit("ok","")):e.$message.error(t.message),e.confirmLoading=!1}))},goBack:function(){window.history.back()},handleStatus:function(t){var e=this;t.activeFlag=1==t.activeFlag||null==t.activeFlag?0:1,changeStatus(t).then((function(t){t.success?(e.$message.success("切换成功"),e.$refs.table.refresh()):e.$message.error("切换失败："+t.message)})).catch((function(t){e.$message.error("切换错误："+t.message)}))},onChange:function(){},onSelectChange:function(t,e){this.selectedRowKeys=t,this.selectedRows=e},handleSubmit:function(){this.goConfirm()},handleCancel:function(){this.visible=!1}}},d=c,r=(a("c837"),a("2877")),p=Object(r["a"])(d,i,n,!1,null,null,null);e["default"]=p.exports},"55ab":function(t,e,a){},c837:function(t,e,a){"use strict";a("55ab")},ceae:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:"选择健康问卷",width:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:""},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[a("a-spin",{attrs:{spinning:t.confirmLoading}},[a("s-table",{ref:"table",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.code}},scopedSlots:t._u([{key:"action",fn:function(e,i){return a("span",{},[a("a",{on:{click:function(e){return t.pick(i)}}},[t._v("选择")])])}}])})],1)],1)},n=[],s=(a("d3b7"),a("159b"),a("b0c0"),a("4cab")),l=a("2af9"),o={components:{STable:l["s"]},data:function(){var t=this;return{queryParam:{yljgdm:"444885559"},columns:[{title:"序号",dataIndex:"xh"},{title:"名称",dataIndex:"name"},{title:"说明",dataIndex:"nameDes"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(e){return Object(s["V"])(Object.assign(e,t.queryParam)).then((function(t){var a={pageNo:e.pageNo,pageSize:e.pageSize,totalRows:t.data.total,totalPage:t.data.total/e.pageSize,rows:t.data.list};return a.rows.forEach((function(t,e){t.xh=(a.pageNo-1)*a.pageSize+(e+1),t.nameDes=t.name})),a}))},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},type:"",index:-1,form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(t){this.visible=!0,this.index=t},pick:function(t){this.$emit("ok",this.index,t),this.visible=!1},handleSubmit:function(){this.$emit("ok",this.index,this.type),this.visible=!1},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},c=o,d=a("2877"),r=Object(d["a"])(c,i,n,!1,null,null,null);e["default"]=r.exports}}]);