(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-88d0cd54","chunk-2d0e907c","chunk-2d212ef6","chunk-2d0e88b0","chunk-2d2228fc","chunk-2d0c86a1","chunk-2d0a3734","chunk-770c3aa7"],{"01da":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"选择健康宣教",width:900,height:900,visible:e.visible,confirmLoading:e.confirmLoading,footer:""},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.pick(s)}}},[e._v("选择")])])}}])})],1)],1)},i=[],n=(a("d3b7"),a("159b"),a("4cab")),o=a("2af9"),l={components:{STable:o["s"]},data:function(){var e=this;return{queryParam:{deptCode:""},columns:[{title:"序号",dataIndex:"xh"},{title:"名称",dataIndex:"title"},{title:"说明",dataIndex:"brief"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(t){return Object(n["U"])(Object.assign(t,e.queryParam)).then((function(e){var a={pageNo:t.pageNo,pageSize:t.pageSize,totalRows:e.data.total,totalPage:e.data.total/t.pageSize,rows:e.data.list};return a.rows.forEach((function(e,t){e.xh=(a.pageNo-1)*a.pageSize+(t+1)})),a}))},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},type:"",index:-1,form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(e,t){this.visible=!0,this.queryParam.deptCode=t,this.index=e,this.$refs.table.refresh()},pick:function(e){this.$emit("ok",this.index,e),this.visible=!1},handleSubmit:function(){this.$emit("ok",this.index,this.type),this.visible=!1},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},r=l,d=a("2877"),c=Object(d["a"])(r,s,i,!1,null,null,null);t["default"]=c.exports},"1c71":function(e,t,a){},"557b":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"输入文字提醒",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入提醒内容 "},model:{value:e.remindContent,callback:function(t){e.remindContent=t},expression:"remindContent"}})],1)},i=[],n={components:{},data:function(){return{remindContent:"",index:-1,confirmLoading:!1,visible:!1}},methods:{add:function(e){this.visible=!0,this.index=e},handleSubmit:function(){this.remindContent?(this.$emit("ok",this.index,this.remindContent),this.visible=!1):this.$message.error("请输入提醒内容")},handleCancel:function(){this.remindContent="",this.visible=!1}}},o=n,l=a("2877"),r=Object(l["a"])(o,s,i,!1,null,null,null);t["default"]=r.exports},"8a5f":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"选择检验",width:900,visible:e.visible,confirmLoading:e.confirmLoading,footer:""},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.pick(s)}}},[e._v("选择")])])}}])})],1)],1)},i=[],n=(a("b0c0"),a("4cab")),o=a("2af9"),l={components:{STable:o["s"]},data:function(){var e=this;return{queryParam:{type:"Exam"},columns:[{title:"序号",dataIndex:"xh"},{title:"名称",dataIndex:"name"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(t){return Object(n["db"])(Object.assign(t,e.queryParam)).then((function(t){for(var a=0;a<t.data.rows.length;a++)e.$set(t.data.rows[a],"xh",a+1+(t.data.pageNo-1)*t.data.pageSize),e.$set(t.data.rows[a],"nameDes",t.data.rows[a].name);return t.data}))},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},index:-1,form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(e){this.visible=!0,this.index=e},pick:function(e){this.$emit("ok",this.index,e),this.visible=!1},handleSubmit:function(){this.$emit("ok",this.index,this.type),this.visible=!1},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},r=l,d=a("2877"),c=Object(d["a"])(r,s,i,!1,null,null,null);t["default"]=c.exports},"8c94":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"选择计划类型",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"计划类型",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-select",{attrs:{"allow-clear":"",placeholder:"请选择计划类型"},model:{value:e.type,callback:function(t){e.type=t},expression:"type"}},e._l(e.typeData,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.taskType}},[e._v(e._s(t.value))])})),1)],1),"Rdiagnosis"==e.type||"Ddiagnosis"==e.type?a("a-form-item",{attrs:{label:"提醒内容",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入提醒内容"},model:{value:e.remindContent,callback:function(t){e.remindContent=t},expression:"remindContent"}})],1):e._e()],1)],1)],1)},i=[],n=(a("d3b7"),a("159b"),a("4cab")),o={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},type:"",index:-1,typeData:[{taskType:"Knowledge",value:"健康宣教"},{taskType:"Quest",value:"健康问卷"},{taskType:"Check",value:"检查"},{taskType:"Exam",value:"检验"}],form:this.$form.createForm(this),confirmLoading:!1,visible:!1,remindContent:""}},methods:{add:function(e){this.type="",this.index=e,this.visible=!0,this.index=e,this.remindContent="";var t=this;Object(n["yb"])().then((function(e){0==e.code&&(e.data.forEach((function(e){t.$set(e,"value",e.taskValue),delete e.taskValue})),t.typeData=e.data)}))},handleSubmit:function(){var e,t=this;this.type?(this.typeData.forEach((function(a){t.type==a.taskType&&(e=a)})),"Rdiagnosis"!=this.type&&"Ddiagnosis"!=this.type||this.remindContent?(this.$set(e,"remindContent",this.remindContent),this.$emit("ok",this.index,e),this.visible=!1):this.$message.error("请填写提醒内容")):this.$message.error("请选择计划类型")},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},l=o,r=a("2877"),d=Object(r["a"])(l,s,i,!1,null,null,null);t["default"]=d.exports},ab10:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"选择检查",width:900,visible:e.visible,confirmLoading:e.confirmLoading,footer:""},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.pick(s)}}},[e._v("选择")])])}}])})],1)],1)},i=[],n=(a("b0c0"),a("4cab")),o=a("2af9"),l={components:{STable:o["s"]},data:function(){var e=this;return{queryParam:{type:"Check"},columns:[{title:"序号",dataIndex:"xh"},{title:"名称",dataIndex:"name"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(t){return Object(n["db"])(Object.assign(t,e.queryParam)).then((function(t){for(var a=0;a<t.data.rows.length;a++)e.$set(t.data.rows[a],"xh",a+1+(t.data.pageNo-1)*t.data.pageSize),e.$set(t.data.rows[a],"nameDes",t.data.rows[a].name);return t.data}))},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},index:-1,form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(e){this.visible=!0,this.index=e},pick:function(e){this.$emit("ok",this.index,e),this.visible=!1},handleSubmit:function(){this.$emit("ok",this.index,this.type),this.visible=!1},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},r=l,d=a("2877"),c=Object(d["a"])(r,s,i,!1,null,null,null);t["default"]=c.exports},bf88:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"div-new-package"},[a("p",{staticClass:"p-title"},[e._v("新增套餐")]),a("div",{staticClass:"div-divider"}),a("a-form",{ref:"form",staticClass:"my-form-package-add",attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"所属类别",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("div",{staticClass:"global-search-wrapper",staticStyle:{width:"300px"}},[a("a-auto-complete",{staticClass:"global-search",staticStyle:{width:"100%","font-size":"14px"},attrs:{size:"large",placeholder:"请输入并选择","option-label-prop":"title"},on:{select:e.onSelect,search:e.handleSearch}},[a("template",{slot:"dataSource"},e._l(e.goodClassesTemp,(function(t){return a("a-select-option",{key:t.classId+"",attrs:{title:t.className}},[e._v(" "+e._s(t.className)+" ")])})),1)],2)],1)]),a("a-form-item",{attrs:{label:"套餐名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["goodsName",{rules:[{required:!0,message:"请输入套餐名称！"}]}],expression:"['goodsName', { rules: [{ required: true, message: '请输入套餐名称！' }] }]"}]})],1),a("a-form-item",{attrs:{label:"是否上架",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-switch",{attrs:{checked:e.uploadData.goodsInfo.isOnline},on:{click:e.goOnline}})],1),a("a-form-item",{attrs:{label:"价格(￥)",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["price",{initialValue:0,rules:[{required:!0,message:"请输入商品价格！"}]}],expression:"['price', { initialValue: 0, rules: [{ required: true, message: '请输入商品价格！' }] }]"}],attrs:{min:0,max:1e6}})],1),a("a-form-item",{attrs:{label:"有效期",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["theLastTime",{rules:[{required:!0,message:"请选择有效期"}]}],expression:"['theLastTime', { rules: [{ required: true, message: '请选择有效期' }] }]"}],attrs:{"allow-clear":""}},e._l(e.periodData,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.code}},[e._v(e._s(t.value))])})),1)],1)],1),a("div",{staticClass:"div-package-type-add"},[e._m(0),e._l(e.goodsAttr,(function(t,s){return a("div",{key:s,staticClass:"div-item"},[a("div",{staticClass:"div-bg-package"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 类别"+e._s(s+1)+" :")]),a("a-select",{staticClass:"span-item-value",attrs:{"allow-clear":"",placeholder:"请选择服务类别"},model:{value:t.attrName,callback:function(a){e.$set(t,"attrName",a)},expression:"item.attrName"}},e._l(e.typeDatas,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.code}},[e._v(e._s(t.value))])})),1),e._m(1,!0),a("a-input-number",{staticStyle:{"margin-left":"1%"},attrs:{min:0,max:1e6},model:{value:t.attrValue,callback:function(a){e.$set(t,"attrValue",a)},expression:"item.attrValue"}}),e._m(2,!0),a("a-select",{staticClass:"span-item-value",attrs:{"allow-clear":"",placeholder:"请选择上传资料"},model:{value:t.plusInfoVo.uploadDocFlag,callback:function(a){e.$set(t.plusInfoVo,"uploadDocFlag",a)},expression:"item.plusInfoVo.uploadDocFlag"}},e._l(e.uploadDatas,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.code}},[e._v(e._s(t.value)+" ")])})),1),a("span",{staticClass:"span-item-name config",on:{click:function(a){return e.$refs.configForm.edit(s,t)}}},[e._v(" 属性配置")])],1),a("a-button",{staticClass:"btn-delete",attrs:{type:"primary"},on:{click:function(t){return e.deleteItem(s)}}},[e._v("刪除")])],1)})),a("a-button",{staticClass:"btn-add",staticStyle:{"margin-top":"2%","margin-left":"38%"},attrs:{type:"primary"},on:{click:e.addItem}},[e._v("添加")])],2),a("div",{staticStyle:{padding:"0 8%","margin-top":"3%"}},[a("span",{staticClass:"span-item-name"},[e._v("添加随访计划：")]),a("a-switch",{attrs:{checked:e.isPlan},on:{click:e.switchIsPlan}})],1),a("div",{directives:[{name:"show",rawName:"v-show",value:e.isPlan,expression:"isPlan"}],staticClass:"div-my-plan-package-add"},[a("div",{staticClass:"div-divider"}),a("div",{staticClass:"div-line-wrap"},[e._m(3),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block"},attrs:{maxLength:30,"allow-clear":"",placeholder:"请输入计划名称 "},model:{value:e.uploadData.templateName,callback:function(t){e.$set(e.uploadData,"templateName",t)},expression:"uploadData.templateName"}})],1),e._m(4),a("div",{staticClass:"div-health-plan"},e._l(e.uploadData.templateTask,(function(t,s){return a("div",{key:s,staticClass:"div-plan-item"},[e._m(5,!0),a("a-input",{staticStyle:{width:"12.5%","margin-left":"5%"},attrs:{type:"number","allow-clear":"",placeholder:"请输入天数 "},model:{value:e.uploadData.templateTask[s].inputDay,callback:function(t){e.$set(e.uploadData.templateTask[s],"inputDay",t)},expression:"uploadData.templateTask[index].inputDay"}}),a("span",{staticClass:"span-des"},[e._v("天后")]),a("div",{staticClass:"div-top-right"},[a("a-button",{staticClass:"span-add-item",attrs:{type:"primary"},on:{click:function(t){return e.deletePlanItem(s)}}},[e._v("删除任务")]),a("a-button",{staticClass:"span-add-item",attrs:{type:"primary"},on:{click:function(t){return e.$refs.addForm.add(s)}}},[e._v("添加子计划")])],1),a("div",{staticClass:"div-divider"}),e._l(e.uploadData.templateTask[s].templateTaskContent,(function(t,i){return a("div",{key:i,staticClass:"div-plan-item-elements"},[a("div",{staticClass:"div-element"},[a("div",{staticClass:"div-content"},[a("span",{staticClass:"span-item-name",staticStyle:{width:"39%"}},[e._v(" 计划类型 :")]),a("span",{staticClass:"span-item-content"},[e._v(" "+e._s(t.taskTypeName))])]),a("div",{staticClass:"div-content-value"},[a("span",{staticClass:"span-item-name",staticStyle:{width:"37%"}},[e._v(" 具体内容 :")]),a("span",{staticClass:"span-item-content",staticStyle:{width:"35%"}},[e._v(" "+e._s(t.contentDetail.detailName))])]),a("a-icon",{staticClass:"icon-delete",attrs:{title:"删除任务项目",type:"close"},on:{click:function(t){return e.deleteElement(s,i)}}}),a("div",{staticClass:"div-divider-elements"})],1)])}))],2)})),0),a("a-button",{staticClass:"btn-add-plan",attrs:{type:"primary"},on:{click:e.addPlanItem}},[e._v("添加具体计划")])],1),a("a-button",{staticClass:"btn-submit",attrs:{type:"primary"},on:{click:e.validate}},[e._v("提交")]),a("div",{staticStyle:{height:"25px",color:"white"}}),a("add-form",{ref:"addForm",on:{ok:e.handleOk}}),a("add-teach",{ref:"addTeach",on:{ok:e.handleTeach}}),a("add-question",{ref:"addQuestion",on:{ok:e.handleQuestion}}),a("add-remind",{ref:"addRemind",on:{ok:e.handleRemind}}),a("add-cha",{ref:"addJianCha",on:{ok:e.handleJianCha}}),a("add-yan",{ref:"addJianYan",on:{ok:e.handleJianYan}}),a("config-form",{ref:"configForm",on:{ok:e.handleConfig}})],1)},i=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("span",{staticClass:"title-des"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 服务类别 :")])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"5%"}},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 次数 :")])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"5%"}},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 上传资料 :")])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 计划名称 :")])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 计划内容 :")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 计划时间 :")])}],n=a("53ca"),o=(a("d3b7"),a("4de4"),a("7db0"),a("a434"),a("b0c0"),a("4cab")),l=a("8c94"),r=a("01da"),d=a("ab10"),c=a("8a5f"),m=a("ceae"),u=a("557b"),p=a("c3b8c"),h={components:{addForm:l["default"],addTeach:r["default"],addCha:d["default"],addYan:c["default"],addQuestion:m["default"],addRemind:u["default"],configForm:p["default"]},data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:5}},wrapperColN:{xs:{span:24},sm:{span:12}},hosCode:"444885559",loading:!1,hosData:[],periodData:[],headers:{authorization:"authorization-text"},form:this.$form.createForm(this),typeDatas:[],uploadDatas:[{code:"0",value:"无"},{code:"1",value:"重症医学科资料1"}],goodsAttrFull:[],goodsAttr:[],uploadData:{goodsInfo:{goodsName:"",belong:"",goodsType:"service_package",goodsSpec:"",imgList:[],previewList:[],bannerList:[],status:"",price:"",theLastTime:"120",goodsAttr:[],isOnline:!0,isSuggest:!0,goodsClass:""},templateTask:[{timeCount:"1",timeUnit:"天",inputDay:0,templateTaskContent:[]}],templateName:"",basetimeType:"0",disease:[{diseaseName:""}]},goodClasses:[],goodClassesTemp:[],chooseClassItem:{},isPlan:!0,timeCountData:[],timeUnitData:[{code:"1",value:"天"},{code:"2",value:"周"},{code:"3",value:"月"}]}},watch:{visible:function(){}},created:function(){var e=this;this.form.setFieldsValue({topFlagIf:!0,statusIf:!0}),Object(o["rc"])({pageNo:1,pageSize:99}).then((function(t){0==t.code?(e.goodClasses=t.data.rows,e.goodClassesTemp=JSON.parse(JSON.stringify(e.goodClasses))):e.$message.error(t.message)})),Object(o["qb"])().then((function(t){if(0==t.code){e.typeDatas=t.data;for(var a=0;a<e.typeDatas.length;a++)e.goodsAttrFull.push({name:e.typeDatas[a].value,attrName:e.typeDatas[a].code,attrValue:"1",plusInfoVo:{uploadDocFlag:"0"}});e.goodsAttr.push(JSON.parse(JSON.stringify(e.goodsAttrFull[0])))}else e.$message.error(t.message)})),Object(o["oc"])("GOODS_EXPIRATION").then((function(t){0==t.code?e.periodData=t.data:e.$message.error(t.message)}));for(var t=0;t<30;t++)this.timeCountData.push({code:t+1,value:t+1})},methods:{getBase64:function(e){return new Promise((function(t,a){var s=new FileReader;s.readAsDataURL(e),s.onload=function(){return t(s.result)},s.onerror=function(e){return a(e)}}))},goOnline:function(){this.uploadData.goodsInfo.isOnline=!this.uploadData.goodsInfo.isOnline},handleSearch:function(e){this.goodClassesTemp=e?this.goodClasses.filter((function(t){return-1!=t.className.indexOf(e)})):JSON.parse(JSON.stringify(this.goodClasses))},onSelect:function(e){this.uploadData.goodsInfo.goodsClass=e,this.chooseClassItem=this.goodClasses.find((function(t){return t.classId==e}))},deleteItem:function(e){this.goodsAttr.length<=1?this.$message.error("至少选择一个服务类别"):this.goodsAttr.splice(e,1)},addItem:function(){if(this.goodsAttr.length>=this.goodsAttrFull.length)this.$message.error("目前仅支持"+this.goodsAttrFull.length+"种服务类型！");else{var e=this.getNewOne(),t=this.goodsAttrFull.find((function(t){return t.name==e}));this.goodsAttr.push(JSON.parse(JSON.stringify(t)))}},getNewOne:function(){for(var e=this,t=function(t){var a=e.typeDatas[t].value,s=e.goodsAttr.some((function(e){return e.name==a}));if(!s)return{v:a}},a=0;a<this.typeDatas.length;a++){var s=t(a);if("object"===Object(n["a"])(s))return s.v}},switchIsPlan:function(){this.isPlan=!this.isPlan},addPlanItem:function(){this.uploadData.templateTask.push({timeCount:"1",timeUnit:"天",inputDay:0,templateTaskContent:[]})},deletePlanItem:function(e){this.uploadData.templateTask.splice(e,1)},deleteElement:function(e,t){this.uploadData.templateTask[e].templateTaskContent.splice(t,1)},handleOk:function(e,t){switch(t.taskType){case"Knowledge":if(!this.chooseClassItem||!this.chooseClassItem.belong)return void this.$message.error("请先选择类别！");this.$refs.addTeach.add(e,this.chooseClassItem.belong);break;case"Quest":this.$refs.addQuestion.add(e);break;case"Remind":this.$refs.addRemind.add(e);break;case"Check":this.$refs.addJianCha.add(e);break;case"Exam":this.$refs.addJianYan.add(e);break;case"Rdiagnosis":this.handleRdiagnosis(e,t.remindContent);break;case"Ddiagnosis":this.handleDdiagnosis(e,t.remindContent);break}},handleTeach:function(e,t){this.uploadData.templateTask[e].templateTaskContent.push({taskType:"Knowledge",taskTypeName:"健康宣教",taskDescribe:t.title,contentDetail:{knowUrl:t.previewUrl,knowContent:t.title,detailName:t.title,articleId:t.articleId}})},handleQuestion:function(e,t){this.uploadData.templateTask[e].templateTaskContent.push({taskType:"Quest",taskTypeName:"健康问卷",taskDescribe:t.name,contentDetail:{questId:t.key,questName:t.name,detailName:t.name}})},handleRemind:function(e,t){this.uploadData.templateTask[e].templateTaskContent.push({taskType:"Remind",taskTypeName:"文字提醒",taskDescribe:t,contentDetail:{remindContent:t,detailName:t}})},handleRdiagnosis:function(e,t){this.uploadData.templateTask[e].templateTaskContent.push({taskType:"Rdiagnosis",taskTypeName:"复诊提醒",taskDescribe:t,contentDetail:{remindContent:t,detailName:t}})},handleDdiagnosis:function(e,t){this.uploadData.templateTask[e].templateTaskContent.push({taskType:"Ddiagnosis",taskTypeName:"用药提醒",taskDescribe:t,contentDetail:{remindContent:t,detailName:t}})},handleJianCha:function(e,t){this.uploadData.templateTask[e].templateTaskContent.push({taskType:"Check",taskTypeName:"检查",taskDescribe:t.name,contentDetail:{checkType:t.name,detailName:t.name}})},handleJianYan:function(e,t){this.uploadData.templateTask[e].templateTaskContent.push({taskType:"Exam",taskTypeName:"检验",taskDescribe:t.name,contentDetail:{examType:t.name,detailName:t.name}})},handleConfig:function(e,t){this.goodsAttr[e].plusInfoVo=Object.assign(this.goodsAttr[e].plusInfoVo,t)},validate:function(){var e=this,t=this.form.validateFields;t((function(t,a){if(!t){e.uploadData.goodsInfo.goodsName=a.goodsName,e.uploadData.goodsInfo.price=a.price,e.uploadData.goodsInfo.theLastTime=a.theLastTime;for(var s=function(t){var a=JSON.parse(JSON.stringify(e.goodsAttr));a.splice(t,1);for(var s=0;s<a.length;s++)if(e.goodsAttr[t].attrName==a[s].attrName){var i=e.goodsAttrFull.find((function(a){return a.attrName==e.goodsAttr[t].attrName}));return e.$message.error("服务类别【"+i.name+"】重复，同类型的服务类别只能有一个，请删除多余的！"),{v:void 0}}},i=0;i<e.goodsAttr.length;i++){var l=s(i);if("object"===Object(n["a"])(l))return l.v}for(var r=function(t){if(!e.goodsAttr[t].plusInfoVo.serviceExpire){var a=e.goodsAttrFull.find((function(a){return a.attrName==e.goodsAttr[t].attrName}));return e.$message.error("请点击【"+a.name+"】的属性配置，配置其服务时效！"),{v:void 0}}},d=0;d<e.goodsAttr.length;d++){var c=r(d);if("object"===Object(n["a"])(c))return c.v}if(e.uploadData.goodsInfo.goodsAttr=e.goodsAttr,e.uploadData.goodsInfo.status=e.uploadData.goodsInfo.isOnline?"1":"3",e.uploadData.goodsInfo.belong=e.chooseClassItem.belong,e.uploadData.goodsInfo.topFlag=e.chooseClassItem.topFlag,e.uploadData.goodsInfo.previewList=e.chooseClassItem.previewList,e.uploadData.goodsInfo.bannerList=e.chooseClassItem.bannerList,e.uploadData.goodsInfo.imgList=e.chooseClassItem.imgList,!e.uploadData.goodsInfo.goodsClass)return void e.$message.error("请选择类别！");var m=JSON.parse(JSON.stringify(e.uploadData));if(e.isPlan){if(!m.templateName)return void e.$message.error("请填写计划名称");if(0==m.templateTask.length)return void e.$message.error("请添加至少一个计划任务");for(var u=0;u<m.templateTask.length;u++)m.templateTask[u].execTime=m.templateTask[u].inputDay;for(var p=0,h=0;h<m.templateTask.length;h++)p+=m.templateTask[h].templateTaskContent.length;if(0==p)return void e.$message.error("请添加至少一个任务项目");for(var f=[],g=0;g<m.templateTask.length;g++)0!=m.templateTask[g].templateTaskContent.length&&f.push(m.templateTask[g]);m.templateTask=f}else m.templateTask=[];Object(o["cd"])(m).then((function(t){0==t.code?(e.$message.success("保存成功"),e.$router.go(-1)):e.$message.error(t.message)}))}}))}}},f=h,g=(a("edc6"),a("2877")),v=Object(g["a"])(f,s,i,!1,null,null,null);t["default"]=v.exports},c3b8c:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"属性配置",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"服务时效（小时）",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["serviceExpire",{rules:[{required:!0,message:"请输入服务时效！"}]}],expression:"['serviceExpire', { rules: [{ required: true, message: '请输入服务时效！' }] }]"}],attrs:{min:1,max:1e6,placeholder:"请输入"}})],1),a("a-form-item",{attrs:{label:"时长限制（分钟）",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["timeLimit",{rules:[{required:e.isTimeLimit,message:"请输入时长限制！"}]}],expression:"['timeLimit', { rules: [{ required: isTimeLimit, message: '请输入时长限制！' }] }]"}],attrs:{min:1,max:1e6,placeholder:"请输入"}})],1),a("a-form-item",{attrs:{label:"条数限制（条）",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["textNumLimit",{rules:[{required:e.isTextNumLimit,message:"请输入条数限制！"}]}],expression:"['textNumLimit', { rules: [{ required: isTextNumLimit, message: '请输入条数限制！' }] }]"}],attrs:{min:0,max:1e6,placeholder:"请输入"}})],1),a("a-form-item",{attrs:{label:"个案介入",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-switch",{attrs:{checked:e.isCaseFlag,disabled:e.isDisabled},on:{change:e.onChangeCase}})],1),a("a-form-item",{attrs:{label:"服务对象",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["whoDeal",{rules:[{required:!0,message:"请选择服务对象！"}]}],expression:"['whoDeal', { rules: [{ required: true, message: '请选择服务对象！' }] }]"}],attrs:{name:"radioGroup","default-value":1},on:{change:e.onChange}},[a("a-radio",{attrs:{value:1}},[e._v(" 医生 ")]),a("a-radio",{staticStyle:{width:"100px"},attrs:{value:2}},[e._v(" 护士 ")])],1)],1),a("a-form-item",{attrs:{label:e.serviceName,labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("div",{staticClass:"div-text-auto"},[a("a-auto-complete",{staticClass:"global-search",staticStyle:{width:"100%","font-size":"14px"},attrs:{size:"large",placeholder:"请输入并选择","option-label-prop":"title"},on:{select:e.onSelect,search:e.handleSearch},model:{value:e.chooseDeptItem.userName,callback:function(t){e.$set(e.chooseDeptItem,"userName",t)},expression:"chooseDeptItem.userName"}},[a("template",{slot:"dataSource"},e._l(e.keshiDataTemp,(function(t){return a("a-select-option",{key:t.userId+"",attrs:{title:t.userName}},[e._v(" "+e._s(t.userName)+" ")])})),1)],2)],1)])],1)],1)],1)},i=[],n=(a("7db0"),a("d3b7"),a("4de4"),a("4cab")),o=a("9fb0"),l=a("2b0e"),r={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,statusData:[],isCaseFlag:!0,caseFlag:1,confirmLoading:!1,form:this.$form.createForm(this),queryParam:{departmentId:0,userType:"doctor"},index:0,docId:"",serviceName:"服务医生",whoDeal:"doctor",chooseDeptItem:{},originData:[],keshiData:[],keshiDataTemp:[],item:{},isTimeLimit:!1,isTextNumLimit:!1,isDisabled:!1}},created:function(){this.getDocs()},methods:{getDocs:function(e){var t=this;Object(n["nb"])(this.queryParam).then((function(a){t.originData=a.data,t.keshiData=JSON.parse(JSON.stringify(t.originData)),t.keshiDataTemp=JSON.parse(JSON.stringify(t.originData)),t.chooseDeptItem=e?JSON.parse(JSON.stringify(t.originData.find((function(e){return e.userId==t.docId})))):JSON.parse(JSON.stringify(t.originData[0])),t.docId=t.chooseDeptItem.userId}))},edit:function(e,t){var a=this;this.visible=!0,this.docId="",this.isCaseFlag=!0,this.chooseDeptItem={},this.item={},this.isTextNumLimit=!1,this.isTimeLimit=!1,this.isDisabled=!1,setTimeout((function(){a.form.setFieldsValue({serviceExpire:void 0,timeLimit:void 0,textNumLimit:void 0})}),100),this.index=e,this.item=t,"ICUConsultNum"!=this.item.attrName&&"1"!=this.item.plusInfoVo.uploadDocFlag||(this.isDisabled=!0),"textNum"==this.item.attrName||"appointNum"==this.item.attrName?this.isTextNumLimit=!0:"videoNum"!=this.item.attrName&&"telNum"!=this.item.attrName||(this.isTimeLimit=!0);var s=l["a"].ls.get(o["p"]);"doctor"==s.roleName&&(this.chooseDeptItem=JSON.parse(JSON.stringify(this.originData.find((function(e){return e.userId==s.userId})))),this.docId=s.userId),setTimeout((function(){var e;"nurse"==t.plusInfoVo.whoDeal?(e=2,a.whoDeal="nurse",a.serviceName="服务护士"):(e=1,a.whoDeal="doctor",a.serviceName="服务医生"),a.form.setFieldsValue({serviceExpire:t.plusInfoVo.serviceExpire,timeLimit:t.plusInfoVo.timeLimit,textNumLimit:t.plusInfoVo.textNumLimit,whoDeal:e}),a.docId=t.plusInfoVo.docId,t.plusInfoVo.caseFlag?a.caseFlag=t.plusInfoVo.caseFlag:a.caseFlag=0,a.isCaseFlag=1==a.caseFlag,a.queryParam.userType=a.whoDeal,a.getDocs(!0)}),100)},onChangeCase:function(){this.isCaseFlag=!this.isCaseFlag,this.caseFlag=this.isCaseFlag?1:0},onChange:function(e){1==e.target.value?(this.serviceName="服务医生",this.whoDeal="doctor"):(this.serviceName="服务护士",this.whoDeal="nurse"),this.queryParam.userType=this.whoDeal,this.getDocs()},handleSubmit:function(){var e=this,t=this.form.validateFields;t((function(t,a){if(!t){if(!e.docId&&!e.isCaseFlag)return void e.$message.error("请选择服务医生！");e.$set(a,"docId",e.docId),e.$set(a,"caseFlag",e.caseFlag),e.$set(a,"whoDeal",e.whoDeal),e.visible=!1,e.$emit("ok",e.index,a)}}))},handleCancel:function(){this.form.resetFields(),this.visible=!1},handleSearch:function(e){e?this.keshiDataTemp=this.originData.filter((function(t){return-1!=t.userName.indexOf(e)})):(this.keshiDataTemp=JSON.parse(JSON.stringify(this.originData)),this.docId="")},onSelect:function(e,t){this.chooseDeptItem=JSON.parse(JSON.stringify(this.originData.find((function(t){return t.userId==e})))),this.docId=this.chooseDeptItem.userId}}},d=r,c=a("2877"),m=Object(c["a"])(d,s,i,!1,null,null,null);t["default"]=m.exports},ceae:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"选择健康问卷",width:900,visible:e.visible,confirmLoading:e.confirmLoading,footer:""},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.pick(s)}}},[e._v("选择")])])}}])})],1)],1)},i=[],n=(a("d3b7"),a("159b"),a("b0c0"),a("4cab")),o=a("2af9"),l={components:{STable:o["s"]},data:function(){var e=this;return{queryParam:{yljgdm:"444885559"},columns:[{title:"序号",dataIndex:"xh"},{title:"名称",dataIndex:"name"},{title:"说明",dataIndex:"nameDes"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(t){return Object(n["W"])(Object.assign(t,e.queryParam)).then((function(e){var a={pageNo:t.pageNo,pageSize:t.pageSize,totalRows:e.data.total,totalPage:e.data.total/t.pageSize,rows:e.data.list};return a.rows.forEach((function(e,t){e.xh=(a.pageNo-1)*a.pageSize+(t+1),e.nameDes=e.name})),a}))},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},type:"",index:-1,form:this.$form.createForm(this),confirmLoading:!1,visible:!1}},methods:{add:function(e){this.visible=!0,this.index=e},pick:function(e){this.$emit("ok",this.index,e),this.visible=!1},handleSubmit:function(){this.$emit("ok",this.index,this.type),this.visible=!1},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},r=l,d=a("2877"),c=Object(d["a"])(r,s,i,!1,null,null,null);t["default"]=c.exports},edc6:function(e,t,a){"use strict";a("1c71")}}]);