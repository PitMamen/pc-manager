(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1b660c8e"],{"55d0":function(e,a,i){},"9dbd":function(e,a,i){"use strict";i.r(a);var s=function(){var e=this,a=e.$createElement,i=e._self._c||a;return i("a-modal",{attrs:{title:"新增版本",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[i("a-spin",{attrs:{spinning:e.confirmLoading}},[i("a-form",{attrs:{form:e.form}},[e._e(),i("a-form-item",{attrs:{label:"版本号",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[i("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["versionNumber",{rules:[{required:!0,message:"请上传文件！"}]}],expression:"['versionNumber', { rules: [{ required: true, message: '请上传文件！' }] }]"}],attrs:{placeholder:"请上传文件",disabled:""}})],1),i("a-form-item",{attrs:{label:"上传",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[i("div",{staticClass:"clearfix"},[i("a-upload",{attrs:{action:e.actionUrl,multiple:!1,headers:e.headers,data:e.uploadData,"list-type":"text","file-list":e.fileList},on:{change:e.handleChange}},[e.fileList.length<1?i("div",[i("div",{staticClass:"upload-btn"},[e._v("选择文件")])]):e._e()])],1)]),i("a-form-item",{attrs:{label:"更新说明",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[i("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["versionDescription",{rules:[{required:!1,message:"请输入更新说明！"}]}],expression:"['versionDescription', { rules: [{ required: false, message: '请输入更新说明！' }] }]"}],attrs:{placeholder:"请输入更新说明"}})],1)],1)],1)],1)},t=[],r=(i("d3b7"),i("4cab")),o=i("9fb0"),n=i("2b0e"),l={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,statusData:[],confirmLoading:!1,form:this.$form.createForm(this),actionUrl:"/api/health-api/appManager/uploadAppFile",fileList:[],uploadData:{platform:1},versionData:{fileName:"",fileSize:"",downloadUrl:"",fileHash:"",versionCode:"",versionNumber:0,versionDescription:"",platform:1,state:0},headers:{Authorization:""}}},created:function(){this.headers.Authorization=n["a"].ls.get(o["a"])},methods:{add:function(){this.visible=!0,this.fileList=[]},handleChange:function(e){var a=this;"done"==e.file.status&&0!=e.file.response.code?(this.$message.error(e.file.response.message),e.fileList.pop(),this.fileList=e.fileList):(this.fileList=e.fileList,this.fileList[0].response&&this.fileList[0].response.data&&(this.versionData=Object.assign(this.versionData,this.fileList[0].response.data),setTimeout((function(){a.form.setFieldsValue({versionCode:a.versionData.versionCode,versionNumber:a.versionData.versionNumber})}),100)))},handleSubmit:function(){var e=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,i){if(a)e.confirmLoading=!1;else{var s=n["a"].ls.get(o["o"]);e.$set(e.versionData,"createrId",s.userId),e.$set(e.versionData,"createrName",s.userName),e.$set(e.versionData,"versionDescription",i.versionDescription),Object(r["a"])(e.versionData).then((function(a){a.success?(e.$message.success("新增成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",i),e.form.resetFields()):e.$message.error("新增失败："+a.message)})).finally((function(a){e.confirmLoading=!1}))}}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},d=l,c=(i("c0df"),i("2877")),f=Object(c["a"])(d,s,t,!1,null,null,null);a["default"]=f.exports},c0df:function(e,a,i){"use strict";i("55d0")}}]);