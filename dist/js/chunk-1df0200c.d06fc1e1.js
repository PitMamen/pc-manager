(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1df0200c"],{"1da1":function(e,a,r){"use strict";r.d(a,"a",(function(){return t}));r("d3b7");function i(e,a,r,i,t,s,l){try{var n=e[s](l),o=n.value}catch(c){return void r(c)}n.done?a(o):Promise.resolve(o).then(i,t)}function t(e){return function(){var a=this,r=arguments;return new Promise((function(t,s){var l=e.apply(a,r);function n(e){i(l,t,s,n,o,"next",e)}function o(e){i(l,t,s,n,o,"throw",e)}n(void 0)}))}}},"65ab":function(e,a,r){"use strict";r.r(a);var i=function(){var e=this,a=e.$createElement,r=e._self._c||a;return r("a-modal",{attrs:{title:"编辑角色",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[r("a-spin",{attrs:{spinning:e.confirmLoading}},[r("a-form",{attrs:{form:e.form}},[r("a-form-item",{attrs:{label:"头像",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("div",{staticClass:"clearfix",staticStyle:{"margin-top":"20px"}},[r("a-upload",{attrs:{action:e.actionUrl,headers:e.headers,multiple:!0,"list-type":"picture-card","file-list":e.fileList},on:{preview:e.handlePreview,change:e.handleChange}},[e.fileList.length<1?r("div",[r("a-icon",{attrs:{type:"plus"}}),r("div",{staticClass:"ant-upload-text"},[e._v("Upload")])],1):e._e()]),r("a-modal",{attrs:{visible:e.previewVisible,footer:null},on:{cancel:e.handleCancelPreview}},[r("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:e.previewImage}})])],1)]),r("a-form-item",{attrs:{label:"职级",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["professionalTitle",{rules:[{required:!1,message:"请输入职级！"}]}],expression:"['professionalTitle', { rules: [{ required: false, message: '请输入职级！' }] }]"}],attrs:{placeholder:"请输入职级"}})],1),r("a-form-item",{attrs:{label:"擅长",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["expertInDisease",{rules:[{required:!1,message:"请输入擅长！"}]}],expression:"['expertInDisease', { rules: [{ required: false, message: '请输入擅长！' }] }]"}],attrs:{placeholder:"请输入擅长"}})],1),r("a-form-item",{attrs:{label:"个人简介",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[r("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["doctorBrief",{rules:[{required:!1,message:"请输入个人简介！"}]}],expression:"['doctorBrief', { rules: [{ required: false, message: '请输入个人简介！' }] }]"}],attrs:{placeholder:"请输入个人简介"}})],1)],1)],1)],1)},t=[],s=r("1da1"),l=(r("d3b7"),r("96cf"),r("9fb0")),n=r("2b0e"),o={data:function(){return{labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:11}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this),fileList:[],previewVisible:!1,docInfo:{},previewImage:"",actionUrl:"/api/content-api/fileUpload/uploadImgFile",headers:{Authorization:""}}},created:function(){this.headers.Authorization=n["a"].ls.get(l["a"])},methods:{add:function(e){var a=this;this.fileList=[],this.docInfo=e,this.visible=!0,this.docInfo&&(setTimeout((function(){a.form.setFieldsValue({professionalTitle:e.professionalTitle,expertInDisease:e.expertInDisease,doctorBrief:e.doctorBrief})}),100),this.docInfo.avatarUrl&&this.fileList.push({uid:"-1",name:"封面1",status:"done",url:this.docInfo.avatarUrl}))},handleChange:function(e){"done"==e.file.status&&0!=e.file.response.code?(this.$message.error(e.file.response.message),e.fileList.pop(),this.fileList=e.fileList):this.fileList=e.fileList},handleCancelPreview:function(){this.previewVisible=!1},handlePreview:function(e){var a=this;return Object(s["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:if(e.url||e.preview){r.next=4;break}return r.next=3,a.getBase64(e.originFileObj);case 3:e.preview=r.sent;case 4:a.previewImage=e.url||e.preview,a.previewVisible=!0;case 6:case"end":return r.stop()}}),r)})))()},getBase64:function(e){return new Promise((function(a,r){var i=new FileReader;i.readAsDataURL(e),i.onload=function(){return a(i.result)},i.onerror=function(e){return r(e)}}))},handleSubmit:function(){var e=this,a=this.form.validateFields;a((function(a,r){a?e.confirmLoading=!1:(e.fileList.length>0&&(e.$set(r,"avatarUrl",""),e.fileList[0].response?r.avatarUrl=e.fileList[0].response.data.fileLinkUrl:r.avatarUrl=e.fileList[0].url),e.$emit("ok",r),e.visible=!1)}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},c=o,d=r("2877"),f=Object(d["a"])(c,i,t,!1,null,null,null);a["default"]=f.exports}}]);