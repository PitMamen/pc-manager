(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3b6a2a58"],{6755:function(e,t,a){"use strict";a("91fe")},"91fe":function(e,t,a){},c935:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"新增角色",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"角色名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["roleRealName",{rules:[{required:!0,message:"请输入角色名称！"}]}],expression:"['roleRealName', { rules: [{ required: true, message: '请输入角色名称！' }] }]"}],attrs:{placeholder:"请输入角色名称"}})],1),a("a-form-item",{attrs:{label:"显示顺序",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["orderId",{rules:[{required:!0,message:"请输入显示顺序！"}]}],expression:"['orderId', { rules: [{ required: true, message: '请输入显示顺序！' }] }]"}],attrs:{placeholder:"请输入显示顺序",type:"number"}})],1),a("a-form-item",{attrs:{label:"状态",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-switch",{attrs:{checked:e.isOpen},on:{change:e.isOpenChange}})],1),a("div",{staticClass:"content"},[a("div",{staticClass:"left"},[a("a-form-item",{attrs:{label:"角色权限",labelCol:e.labelCol2,wrapperCol:e.wrapperCol2,"has-feedback":""}},e._l(e.list,(function(t){return a("div",{key:t.id,staticClass:"item",class:{active:t.id===e.currentItem.id},on:{click:function(a){return e.itemClick(t)}}},[a("a-checkbox",{staticClass:"check",attrs:{checked:(t.checkedKeys||[]).length>0},on:{change:e.onItemChange}}),a("span",{staticClass:"name"},[e._v(e._s(t.applicationName))])],1)})),0)],1),e._l(e.list,(function(t){return a("div",{directives:[{name:"show",rawName:"v-show",value:t.id===e.currentItem.id,expression:"item.id === currentItem.id"}],key:t.id,staticClass:"right"},[a("a-form-item",{attrs:{label:"菜单权限",labelCol:e.labelCol2,wrapperCol:e.wrapperCol2,"has-feedback":""}},[a("a-radio-group",{attrs:{name:"radioGroup"},on:{change:e.radioChange},model:{value:t.radio,callback:function(a){e.$set(t,"radio",a)},expression:"item.radio"}},[a("a-radio",{attrs:{value:1}},[e._v("全选")]),a("a-radio",{attrs:{value:2}},[e._v("全不选")]),a("a-radio",{attrs:{value:3}},[e._v("部分选择")])],1)],1),a("a-form-item",{staticStyle:{"margin-left":"85px"},attrs:{label:"",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-tree",{attrs:{checkable:"","tree-data":t.treeData},on:{select:e.onSelect,check:e.onCheck},model:{value:t.checkedKeys,callback:function(a){e.$set(t,"checkedKeys",a)},expression:"item.checkedKeys"}})],1)],1)}))],2)],1)],1)],1)},s=[],i=(a("d3b7"),a("159b"),a("b0c0"),a("99af"),a("fe3d")),n=a("4cab"),c={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},labelCol2:{span:5,offset:0},wrapperCol2:{span:19,offset:0},grantMenuIdList:[],replaceFields:{children:"child",title:"name"},checkedKeys:[],halfKeys:[],allKeys:[],isOpen:!0,hosData:[{code:"444885559",value:"湘雅附二医院"}],visible:!1,confirmLoading:!1,treeData:[],list:[],currentItem:{},form:this.$form.createForm(this)}},created:function(){},methods:{add:function(){this.list=[],this.allKeys=[],this.halfKeys=[],this.treeData=[],this.visible=!0,this.checkedKeys=[],this.getList()},getList:function(){var e=this;Object(i["c"])({status:1}).then((function(t){0===t.code?(e.list=t.data||[],e.currentItem=e.list[0]||{},e.list.length>0&&(e.confirmLoading=!0,e.list.forEach((function(t,a){Object(n["tb"])({applicationIds:t.id}).then((function(a){if(0===a.code){a.data=a.data||[];var r=[],s=e.transfromData(a.data,r);e.$set(t,"radio",2),e.$set(t,"halfKeys",[]),e.$set(t,"checkedKeys",[]),e.$set(t,"allKeys",r),e.$set(t,"treeData",s)}else e.$message.error(a.message)})).finally((function(){a===e.list.length-1&&(e.confirmLoading=!1)}))})))):e.$message.error(t.message)}))},itemClick:function(e){this.currentItem=e},onItemChange:function(e){e.target.checked?(this.$set(this.currentItem,"radio",1),this.$set(this.currentItem,"checkedKeys",this.currentItem.allKeys)):(this.$set(this.currentItem,"radio",2),this.$set(this.currentItem,"checkedKeys",[]))},onSelect:function(e,t){},onCheck:function(e,t){this.$set(this.currentItem,"halfKeys",t.halfCheckedKeys),0===this.currentItem.checkedKeys.length?this.$set(this.currentItem,"radio",2):this.currentItem.checkedKeys.length===this.currentItem.allKeys.length?this.$set(this.currentItem,"radio",1):this.$set(this.currentItem,"radio",3)},isOpenChange:function(){this.isOpen=!this.isOpen},radioChange:function(e){1==e.target.value?this.$set(this.currentItem,"checkedKeys",this.currentItem.allKeys):2==e.target.value&&this.$set(this.currentItem,"checkedKeys",[])},transfromData:function(e,t){for(var a=0;a<e.length;a++)e[a].name=e[a].title,e[a].key=e[a].id,t.push(e[a].key),e[a].children&&e[a].children.length>0&&this.transfromData(e[a].children,t);return e},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){if(t)e.confirmLoading=!1;else{if(e.halfKeys=[],e.checkedKeys=[],e.list.forEach((function(t){e.halfKeys=e.halfKeys.concat(t.halfKeys||[]),e.checkedKeys=e.checkedKeys.concat(t.checkedKeys||[])})),0==e.checkedKeys.length)return e.$message.error("请选择菜单权限"),void(e.confirmLoading=!1);var r=e.isOpen?1:0,s=JSON.parse(JSON.stringify(e.checkedKeys));e.halfKeys.length>0&&(s=s.concat(e.halfKeys));var i={roleRealName:a.roleRealName,orderId:parseInt(a.orderId),roleName:e.randomString(8),state:r,grantMenuIdList:s};Object(n["d"])(i).then((function(t){t.success?(e.$message.success("新增成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",a),e.form.resetFields()):e.$message.error("新增失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}}))},handleCancel:function(){this.form.resetFields(),this.visible=!1},randomString:function(e){e=e||11;for(var t="ABCDEFGHJKMNPQRdergfrehjikuykiawSTWXYZabcdefhijkmnprstwxyzdewfgwerg",a=t.length,r="",s=0;s<e;s++)r+=t.charAt(Math.floor(Math.random()*a));return r}}},l=c,o=(a("6755"),a("2877")),d=Object(o["a"])(l,r,s,!1,null,"28cacb3e",null);t["default"]=d.exports},fe3d:function(e,t,a){"use strict";a.d(t,"c",(function(){return s})),a.d(t,"b",(function(){return i})),a.d(t,"a",(function(){return n})),a.d(t,"d",(function(){return c}));var r=a("b775");function s(e){return Object(r["b"])({url:"/uam-api/application/list",method:"post",data:e})}function i(e){return Object(r["b"])({url:"/uam-api/application/detail",method:"get",params:e})}function n(e){return Object(r["b"])({url:"/uam-api/application/save",method:"post",data:e})}function c(e){return Object(r["b"])({url:"/uam-api/application/enable",method:"post",data:e})}}}]);