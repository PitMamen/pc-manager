(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["user"],{"00d8":function(e,t){(function(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r={rotl:function(e,t){return e<<t|e>>>32-t},rotr:function(e,t){return e<<32-t|e>>>t},endian:function(e){if(e.constructor==Number)return 16711935&r.rotl(e,8)|4278255360&r.rotl(e,24);for(var t=0;t<e.length;t++)e[t]=r.endian(e[t]);return e},randomBytes:function(e){for(var t=[];e>0;e--)t.push(Math.floor(256*Math.random()));return t},bytesToWords:function(e){for(var t=[],r=0,n=0;r<e.length;r++,n+=8)t[n>>>5]|=e[r]<<24-n%32;return t},wordsToBytes:function(e){for(var t=[],r=0;r<32*e.length;r+=8)t.push(e[r>>>5]>>>24-r%32&255);return t},bytesToHex:function(e){for(var t=[],r=0;r<e.length;r++)t.push((e[r]>>>4).toString(16)),t.push((15&e[r]).toString(16));return t.join("")},hexToBytes:function(e){for(var t=[],r=0;r<e.length;r+=2)t.push(parseInt(e.substr(r,2),16));return t},bytesToBase64:function(e){for(var r=[],n=0;n<e.length;n+=3)for(var a=e[n]<<16|e[n+1]<<8|e[n+2],o=0;o<4;o++)8*n+6*o<=8*e.length?r.push(t.charAt(a>>>6*(3-o)&63)):r.push("=");return r.join("")},base64ToBytes:function(e){e=e.replace(/[^A-Z0-9+\/]/gi,"");for(var r=[],n=0,a=0;n<e.length;a=++n%4)0!=a&&r.push((t.indexOf(e.charAt(n-1))&Math.pow(2,-2*a+8)-1)<<2*a|t.indexOf(e.charAt(n))>>>6-2*a);return r}};e.exports=r})()},"044b":function(e,t){function r(e){return!!e.constructor&&"function"===typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function n(e){return"function"===typeof e.readFloatLE&&"function"===typeof e.slice&&r(e.slice(0,0))}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
e.exports=function(e){return null!=e&&(r(e)||n(e)||!!e._isBuffer)}},"1d8a":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"main"},[r("a-form",{ref:"formLogin",staticClass:"user-layout-login",attrs:{id:"formLogin",form:e.form},on:{submit:e.handleSubmit}},[r("a-tabs",{attrs:{activeKey:e.customActiveKey,tabBarStyle:{textAlign:"center",borderBottom:"unset"}},on:{change:e.handleTabClick}},[r("a-tab-pane",{key:"tab1",attrs:{tab:"管理员登录"}},[e.isLoginError?r("a-alert",{staticStyle:{"margin-bottom":"24px"},attrs:{type:"error",showIcon:"",message:this.accountLoginErrMsg}}):e._e(),r("a-form-item",[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["username",{rules:[{required:!0,message:"请输入帐户名"},{validator:e.handleUsernameOrEmail}],validateTrigger:"change"}],expression:"[\n              'username',\n              {\n                rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }],\n                validateTrigger: 'change',\n              },\n            ]"}],attrs:{size:"large",type:"text",placeholder:"账号"}},[r("a-icon",{style:{color:"rgba(0,0,0,.25)"},attrs:{slot:"prefix",type:"user"},slot:"prefix"})],1)],1),r("a-form-item",[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["password",{rules:[{required:!0,message:"请输入密码"}],validateTrigger:"blur"}],expression:"[\n              'password',\n              { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' },\n            ]"}],attrs:{size:"large",type:"password",autocomplete:"false",placeholder:"密码"}},[r("a-icon",{style:{color:"rgba(0,0,0,.25)"},attrs:{slot:"prefix",type:"lock"},slot:"prefix"})],1)],1)],1),r("a-tab-pane",{key:"tab2",attrs:{tab:"用户登录"}},[e.isLoginError?r("a-alert",{staticStyle:{"margin-bottom":"24px"},attrs:{type:"error",showIcon:"",message:this.accountLoginErrMsg}}):e._e(),r("a-form-item",[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["username",{rules:[{required:!0,message:"请输入帐户名"},{validator:e.handleUsernameOrEmail}],validateTrigger:"change"}],expression:"[\n              'username',\n              {\n                rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }],\n                validateTrigger: 'change',\n              },\n            ]"}],attrs:{size:"large",type:"text",placeholder:"账号"}},[r("a-icon",{style:{color:"rgba(0,0,0,.25)"},attrs:{slot:"prefix",type:"user"},slot:"prefix"})],1)],1),r("a-row",[r("a-col",{staticClass:"gutter-row"},[r("a-form-item",[r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["password",{rules:[{required:!0,message:"请输入密码"}],validateTrigger:"blur"}],expression:"[\n                  'password',\n                  { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' },\n                ]"}],attrs:{size:"large",type:"password",autocomplete:"false",placeholder:"密码"}},[r("a-icon",{style:{color:"rgba(0,0,0,.25)"},attrs:{slot:"prefix",type:"lock"},slot:"prefix"})],1)],1)],1)],1)],1)],1),r("a-form-item",[r("a-checkbox",{directives:[{name:"decorator",rawName:"v-decorator",value:["rememberMe",{valuePropName:"checked"}],expression:"['rememberMe', { valuePropName: 'checked' }]"}]},[e._v("自动登录")])],1),r("a-form-item",{staticStyle:{"margin-top":"24px"}},[r("a-button",{staticClass:"login-button",attrs:{size:"large",type:"primary",htmlType:"submit",loading:e.state.loginBtn,disabled:e.state.loginBtn}},[e._v("确定")])],1)],1),e.requiredTwoStepCaptcha?r("two-step-captcha",{attrs:{visible:e.stepCaptchaVisible},on:{success:e.stepCaptchaSuccess,cancel:e.stepCaptchaCancel}}):e._e()],1)},a=[],o=r("5530"),i=(r("ac1f"),r("d3b7"),r("25f0"),r("6821"),function(){var e=this,t=this,r=t.$createElement,n=t._self._c||r;return n("a-modal",{attrs:{centered:"",maskClosable:!1},on:{cancel:t.handleCancel},model:{value:t.visible,callback:function(e){t.visible=e},expression:"visible"}},[n("div",{style:{textAlign:"center"},attrs:{slot:"title"},slot:"title"},[t._v("两步验证")]),n("template",{slot:"footer"},[n("div",{style:{textAlign:"center"}},[n("a-button",{key:"back",on:{click:t.handleCancel}},[t._v("返回")]),n("a-button",{key:"submit",attrs:{type:"primary",loading:t.stepLoading},on:{click:t.handleStepOk}},[t._v(" 继续 ")])],1)]),n("a-spin",{attrs:{spinning:t.stepLoading}},[n("a-form",{attrs:{layout:"vertical","auto-form-create":function(t){e.form=t}}},[n("div",{staticClass:"step-form-wrapper"},[t.stepLoading?n("p",{staticStyle:{"text-align":"center"}},[t._v("正在验证.."),n("br"),t._v("请稍后")]):n("p",{staticStyle:{"text-align":"center"}},[t._v("请在手机中打开 Google Authenticator 或两步验证 APP"),n("br"),t._v("输入 6 位动态码")]),n("a-form-item",{style:{textAlign:"center"},attrs:{hasFeedback:"",fieldDecoratorId:"stepCode",fieldDecoratorOptions:{rules:[{required:!0,message:"请输入 6 位动态码!",pattern:/^\d{6}$/,len:6}]}}},[n("a-input",{style:{textAlign:"center"},attrs:{placeholder:"000000"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleStepOk.apply(null,arguments)}}})],1),n("p",{staticStyle:{"text-align":"center"}},[n("a",{on:{click:t.onForgeStepCode}},[t._v("遗失手机?")])])],1)])],1)],2)}),s=[],c={props:{visible:{type:Boolean,default:!1}},data:function(){return{stepLoading:!1,form:null}},methods:{handleStepOk:function(){var e=this,t=this;this.stepLoading=!0,this.form.validateFields((function(r,n){r?(e.stepLoading=!1,e.$emit("error",{err:r})):setTimeout((function(){t.stepLoading=!1,t.$emit("success",{values:n})}),2e3)}))},handleCancel:function(){this.visible=!1,this.$emit("cancel")},onForgeStepCode:function(){}}},l=c,u=(r("edd4"),r("2877")),p=Object(u["a"])(l,i,s,!1,null,"4a462ef6",null),d=p.exports,f=r("2f62"),g=(r("9fb0"),r("ca00"),r("6135")),m=(r("4cab"),r("3452")),h=r.n(m),v={components:{TwoStepCaptcha:d},data:function(){return{customActiveKey:"tab2",loginBtn:!1,loginType:0,isLoginError:!1,requiredTwoStepCaptcha:!1,stepCaptchaVisible:!1,form:this.$form.createForm(this),state:{time:60,loginBtn:!1,loginType:0,smsSendBtn:!1},accountLoginErrMsg:""}},created:function(){},methods:Object(o["a"])(Object(o["a"])({},Object(f["b"])(["Login","Logout"])),{},{handleUsernameOrEmail:function(e,t,r){var n=this.state,a=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;a.test(t)?n.loginType=0:n.loginType=1,r()},handleTabClick:function(e){this.isLoginError=!1,this.customActiveKey=e},handleSubmit:function(e){var t=this;e.preventDefault();var r=this.form.validateFields,n=this.state,a=this.customActiveKey,i=this.Login;n.loginBtn=!0;var s=["username","password"];r(s,{force:!0},(function(e,r){if(e)setTimeout((function(){n.loginBtn=!1}),600);else{var s=Object(o["a"])({},r);delete s.username,s[n.loginType?"username":"email"]=r.username,s.password=r.password,s.loginType="tab1"===a?1:2,s.password=t.encryptDes(s.password),i(s).then((function(e){return t.loginSuccess(e)})).catch((function(e){return t.requestFailed(e)})).finally((function(){n.loginBtn=!1}))}}))},getCaptcha:function(e){var t=this;e.preventDefault();var r=this.form.validateFields,n=this.state;r(["mobile"],{force:!0},(function(e,r){if(!e){n.smsSendBtn=!0;var a=window.setInterval((function(){n.time--<=0&&(n.time=60,n.smsSendBtn=!1,window.clearInterval(a))}),1e3),o=t.$message.loading("验证码发送中..",0);Object(g["c"])({mobile:r.mobile}).then((function(e){setTimeout(o,2500),t.$notification["success"]({message:"提示",description:"验证码获取成功，您的验证码为："+e.result.captcha,duration:8})})).catch((function(e){setTimeout(o,1),clearInterval(a),n.time=60,n.smsSendBtn=!1,t.requestFailed(e)}))}}))},encryptDes:function(e){var t=h.a.enc.Utf8.parse("Login783s7Hyee90.k"),r={mode:h.a.mode.ECB,padding:h.a.pad.Pkcs7},n=h.a.DES.encrypt(e,t,r);return n.ciphertext.toString()},stepCaptchaSuccess:function(){this.loginSuccess()},stepCaptchaCancel:function(){var e=this;this.Logout().then((function(){e.loginBtn=!1,e.stepCaptchaVisible=!1}))},loginSuccess:function(e){this.$router.push({path:"/"}),this.isLoginError=!1},requestFailed:function(e){this.accountLoginErrMsg=e,this.isLoginError=!0}})},b=v,y=(r("4d47"),Object(u["a"])(b,n,a,!1,null,"78bf626c",null));t["default"]=y.exports},"4d47":function(e,t,r){"use strict";r("f15e")},6821:function(e,t,r){(function(){var t=r("00d8"),n=r("9a634").utf8,a=r("044b"),o=r("9a634").bin,i=function(e,r){e.constructor==String?e=r&&"binary"===r.encoding?o.stringToBytes(e):n.stringToBytes(e):a(e)?e=Array.prototype.slice.call(e,0):Array.isArray(e)||e.constructor===Uint8Array||(e=e.toString());for(var s=t.bytesToWords(e),c=8*e.length,l=1732584193,u=-271733879,p=-1732584194,d=271733878,f=0;f<s.length;f++)s[f]=16711935&(s[f]<<8|s[f]>>>24)|4278255360&(s[f]<<24|s[f]>>>8);s[c>>>5]|=128<<c%32,s[14+(c+64>>>9<<4)]=c;var g=i._ff,m=i._gg,h=i._hh,v=i._ii;for(f=0;f<s.length;f+=16){var b=l,y=u,T=p,x=d;l=g(l,u,p,d,s[f+0],7,-680876936),d=g(d,l,u,p,s[f+1],12,-389564586),p=g(p,d,l,u,s[f+2],17,606105819),u=g(u,p,d,l,s[f+3],22,-1044525330),l=g(l,u,p,d,s[f+4],7,-176418897),d=g(d,l,u,p,s[f+5],12,1200080426),p=g(p,d,l,u,s[f+6],17,-1473231341),u=g(u,p,d,l,s[f+7],22,-45705983),l=g(l,u,p,d,s[f+8],7,1770035416),d=g(d,l,u,p,s[f+9],12,-1958414417),p=g(p,d,l,u,s[f+10],17,-42063),u=g(u,p,d,l,s[f+11],22,-1990404162),l=g(l,u,p,d,s[f+12],7,1804603682),d=g(d,l,u,p,s[f+13],12,-40341101),p=g(p,d,l,u,s[f+14],17,-1502002290),u=g(u,p,d,l,s[f+15],22,1236535329),l=m(l,u,p,d,s[f+1],5,-165796510),d=m(d,l,u,p,s[f+6],9,-1069501632),p=m(p,d,l,u,s[f+11],14,643717713),u=m(u,p,d,l,s[f+0],20,-373897302),l=m(l,u,p,d,s[f+5],5,-701558691),d=m(d,l,u,p,s[f+10],9,38016083),p=m(p,d,l,u,s[f+15],14,-660478335),u=m(u,p,d,l,s[f+4],20,-405537848),l=m(l,u,p,d,s[f+9],5,568446438),d=m(d,l,u,p,s[f+14],9,-1019803690),p=m(p,d,l,u,s[f+3],14,-187363961),u=m(u,p,d,l,s[f+8],20,1163531501),l=m(l,u,p,d,s[f+13],5,-1444681467),d=m(d,l,u,p,s[f+2],9,-51403784),p=m(p,d,l,u,s[f+7],14,1735328473),u=m(u,p,d,l,s[f+12],20,-1926607734),l=h(l,u,p,d,s[f+5],4,-378558),d=h(d,l,u,p,s[f+8],11,-2022574463),p=h(p,d,l,u,s[f+11],16,1839030562),u=h(u,p,d,l,s[f+14],23,-35309556),l=h(l,u,p,d,s[f+1],4,-1530992060),d=h(d,l,u,p,s[f+4],11,1272893353),p=h(p,d,l,u,s[f+7],16,-155497632),u=h(u,p,d,l,s[f+10],23,-1094730640),l=h(l,u,p,d,s[f+13],4,681279174),d=h(d,l,u,p,s[f+0],11,-358537222),p=h(p,d,l,u,s[f+3],16,-722521979),u=h(u,p,d,l,s[f+6],23,76029189),l=h(l,u,p,d,s[f+9],4,-640364487),d=h(d,l,u,p,s[f+12],11,-421815835),p=h(p,d,l,u,s[f+15],16,530742520),u=h(u,p,d,l,s[f+2],23,-995338651),l=v(l,u,p,d,s[f+0],6,-198630844),d=v(d,l,u,p,s[f+7],10,1126891415),p=v(p,d,l,u,s[f+14],15,-1416354905),u=v(u,p,d,l,s[f+5],21,-57434055),l=v(l,u,p,d,s[f+12],6,1700485571),d=v(d,l,u,p,s[f+3],10,-1894986606),p=v(p,d,l,u,s[f+10],15,-1051523),u=v(u,p,d,l,s[f+1],21,-2054922799),l=v(l,u,p,d,s[f+8],6,1873313359),d=v(d,l,u,p,s[f+15],10,-30611744),p=v(p,d,l,u,s[f+6],15,-1560198380),u=v(u,p,d,l,s[f+13],21,1309151649),l=v(l,u,p,d,s[f+4],6,-145523070),d=v(d,l,u,p,s[f+11],10,-1120210379),p=v(p,d,l,u,s[f+2],15,718787259),u=v(u,p,d,l,s[f+9],21,-343485551),l=l+b>>>0,u=u+y>>>0,p=p+T>>>0,d=d+x>>>0}return t.endian([l,u,p,d])};i._ff=function(e,t,r,n,a,o,i){var s=e+(t&r|~t&n)+(a>>>0)+i;return(s<<o|s>>>32-o)+t},i._gg=function(e,t,r,n,a,o,i){var s=e+(t&n|r&~n)+(a>>>0)+i;return(s<<o|s>>>32-o)+t},i._hh=function(e,t,r,n,a,o,i){var s=e+(t^r^n)+(a>>>0)+i;return(s<<o|s>>>32-o)+t},i._ii=function(e,t,r,n,a,o,i){var s=e+(r^(t|~n))+(a>>>0)+i;return(s<<o|s>>>32-o)+t},i._blocksize=16,i._digestsize=16,e.exports=function(e,r){if(void 0===e||null===e)throw new Error("Illegal argument "+e);var n=t.wordsToBytes(i(e,r));return r&&r.asBytes?n:r&&r.asString?o.bytesToString(n):t.bytesToHex(n)}})()},"90b4":function(e,t,r){},"9a634":function(e,t){var r={utf8:{stringToBytes:function(e){return r.bin.stringToBytes(unescape(encodeURIComponent(e)))},bytesToString:function(e){return decodeURIComponent(escape(r.bin.bytesToString(e)))}},bin:{stringToBytes:function(e){for(var t=[],r=0;r<e.length;r++)t.push(255&e.charCodeAt(r));return t},bytesToString:function(e){for(var t=[],r=0;r<e.length;r++)t.push(String.fromCharCode(e[r]));return t.join("")}}};e.exports=r},edd4:function(e,t,r){"use strict";r("90b4")},f15e:function(e,t,r){}}]);