webpackJsonp([1],{0:function(t,e){},"33yj":function(t,e){},N2op:function(t,e){t.exports="威盛职场团契周六信息分享\n1.  序乐\n2.  宣召：诗90:1-2\n3.  颂赞诗歌：新赞164 圣事中见主歌\n4.  颂赞祷告\n5.  启应经文：诗90:1-17\n6.  诗班献诗：向高处行\n7.  信息经文：士17:1-6，18:2-6，约18:14-20，约1, 约1:4\n8.  信息主题：任意而行的信仰\n9.  回应诗歌：新赞324 求赐智慧歌\n10. 祝祷\n11. 三一颂：赞美诗399\n12. 會務報告\n\n范例：这是一个文本范例, 生成ppt的过程中请注意\n\t1. 流程的名称不能变, 否则将会被忽略\n\t2. 诗歌类以编号为准,\n\t3. 经文格式要格外注意, 可以支持的格式\n\t\ta. 经文范围 eg 约1:1-3\n\t\tb. 多处经文 eg 约1:2-3, 1:1-2\n\t\tc. 整卷 eg\t约1\n\t\td. 单节 eg\t约1:1\n\t\te. 多卷经文 eg\t士17:1-6，18:2-6，约18:14-20，约1, 约1:4\n\t4. 支持中英文标点, ~, -, :\n\n时间：2019.1.26（周六）9:50am\n地点：威盛大厦30楼 正堂\n（深南大道9966号，地铁罗宝线深大站A3出口直行80-100公尺，或深大北门公交车站）"},NHnr:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s("7+uW"),i={name:"aside-panel",methods:{pptGen:function(){var t=this.$store.state.cur;this.$router.push("/gen-ppt/"+t)},htmlGen:function(){pd.toast("建设中")},notYet:function(){pd.toast("建设中")}}},a={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("aside",[t._m(0),t._v(" "),s("content",[s("li",{on:{click:function(e){t.pptGen()}}},[t._m(1),t._v(" "),s("div",[t._v("崇拜幻灯片生成")])]),t._v(" "),s("li",{on:{click:function(e){t.htmlGen()}}},[t._m(2),t._v(" "),s("div",[t._v("公众号文章生成")])]),t._v(" "),s("li",{on:{click:t.notYet}},[t._m(3),t._v(" "),s("div",[t._v("月刊生成")])])])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("header",{staticClass:"sd-dark"},[e("li",[e("span",{staticClass:"wd-m"}),this._v(" "),e("div",[this._v("威盛小工具")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("label",{staticClass:"wd-m"},[e("i",{staticClass:"fa fa-file-powerpoint-o"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("label",{staticClass:"wd-m"},[e("i",{staticClass:"fa fa-file-powerpoint-o"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("label",{staticClass:"wd-m"},[e("i",{staticClass:"fa fa-file-powerpoint-o"})])}]},r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("article",[e("router-view")],1)},staticRenderFns:[]},o={name:"app",components:{"aside-panel":s("VU/8")(i,a,!1,null,null,null).exports,"article-panel":s("VU/8")({name:"article-panel"},r,!1,null,null,null).exports}},c={render:function(){var t=this.$createElement,e=this._self._c||t;return e("main",{attrs:{id:"app"}},[e("aside-panel"),this._v(" "),e("article-panel")],1)},staticRenderFns:[]},l=s("VU/8")(o,c,!1,null,null,null).exports,p=s("/ocq"),u={methods:{previousStep:function(){switch(this.$store.state.cur){case"parsed":this.cur="input";break;case"output":this.cur="parsed";break;default:return!1}},nextStep:function(){switch(this.$store.state.cur){case"input":this.parse();break;case"parsed":this.generate();break;case"output":res=3;break;default:res=1}},parse:function(t){var e=this,s=this.$store.state.inp;if(!s)return!1;var n=this.$loading({fullscreen:!0});this.$http.post("/api/parse-string",{inp:s}).then(function(t){if(n.close(),0!=t.body.code)return e.$notify.error({title:t.body.msg,message:t.body.msg,duration:0});e.$notify.success({title:t.body.msg,message:"请检查内容和顺序"}),e.$store.commit("setCur","parsed"),e.$store.commit("setWorship",t.body.data),e.$router.replace("/gen-ppt/parsed")})},generate:function(t){var e=this,s=this.$store.state.worship;if(!s)return!1;var n=this.$loading({fullscreen:!0});this.$http.post("/api/gen-ppt",{worship:s}).then(function(t){if(n.close(),0!=t.body.code)return e.$notify.error({title:t.body.msg,message:t.body.msg,duration:0});e.$notify.success({title:t.body.msg,message:"可以下载PPT啦"}),e.$store.commit("setCur","output"),e.$store.commit("setDistPath",t.body.data.distPath),e.$router.replace("/gen-ppt/output")})},download:function(){window.location.href=this.$store.state.distPath}},computed:{cur:{set:function(t){this.$store.commit("setCur",t),this.$router.replace("/gen-ppt/"+t)},get:function(){var t;switch(this.$store.state.cur){case"input":t=1;break;case"parsed":t=2;break;case"output":t=3;break;default:t=1}return t}}}},h={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("article",[s("header",{staticClass:"pd-l"},[s("section",[s("el-steps",{attrs:{active:t.cur,"finish-status":"success"}},[s("el-step",{attrs:{title:"文本 1",description:"将崇拜的步骤和信息按照示例格式输入到文本框"}}),t._v(" "),s("el-step",{attrs:{title:"解析 2",description:"检查解析出的经文, 歌词, 流程是否有遗漏或错误"}}),t._v(" "),s("el-step",{attrs:{title:"导出 3",description:"下载导出的PPT, 如果不成功请根据提示检查输入文本"}})],1)],1)]),t._v(" "),s("content",{staticClass:"lay-r"},[s("router-view")],1),t._v(" "),s("footer",[s("li",{staticClass:"sd-cut ht-l pd-m-h"},[s("button",{directives:[{name:"show",rawName:"v-show",value:1!=t.cur,expression:"cur!=1"}],staticClass:"sd-cut wd-xl",on:{click:t.previousStep}},[t._v("\n        上一步\n      ")]),t._v(" "),s("button",{directives:[{name:"show",rawName:"v-show",value:3!=t.cur,expression:"cur!=3"}],staticClass:"sd-theme wd-xl mg-m-h",on:{click:t.nextStep}},[t._v("\n        下一步\n      ")]),t._v(" "),s("button",{directives:[{name:"show",rawName:"v-show",value:3==t.cur,expression:"cur==3"}],staticClass:"sd-theme wd-xl mg-m-h",on:{click:t.download}},[t._v("\n        下载\n      ")])])])])},staticRenderFns:[]};var d=s("VU/8")(u,h,!1,function(t){s("33yj")},"data-v-5e2a37d8",null).exports,v={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("section",{staticClass:"content wd-max pd-s"},[s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.inp,expression:"inp"}],staticClass:"info-input wd-max ht-max sd-cut pd-s",staticStyle:{"line-height":"1.5em"},domProps:{value:t.inp},on:{input:function(e){e.target.composing||(t.inp=e.target.value)}}})])},staticRenderFns:[]};var m=s("VU/8")({name:"input-panel",computed:{inp:{get:function(){return this.$store.state.inp},set:function(t){this.$store.commit("setInp",t)}}}},v,!1,function(t){s("rj31")},"data-v-2f30b63f",null).exports,f={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("section",{staticClass:"content scroll-y"},[s("ol",{staticClass:"parsed pd-l"},t._l(t.worship,function(e,n){return s("div",{key:n},[s("li",{key:e.id},[s("label",[t._v(t._s(e.id||""))]),t._v(" "),s("span",{staticClass:"wd-xl"},[t._v(t._s(e.name))]),t._v(" "),s("div",[t._v(t._s(e.value||""))]),t._v(" "),s("button",{on:{click:function(s){t.delItem(e)}}},[s("i",{staticClass:"fa fa-minus-circle cl-sec"})])]),t._v(" "),"scripture"==e.parseType||"hymn"==e.parseType?s("div",{staticClass:"pd-m",domProps:{innerHTML:t._s(e.parseTxt)}}):t._e()])}))])},staticRenderFns:[]};var _=s("VU/8")({mounted:function(){this.worship||(this.$store.commit("setCur","input"),this.$router.replace("/gen-ppt/input"))},methods:{delItem:function(t){this.worship=this.worship.filter(function(e){return e.key!==t.key}),this.$store.commit("setWorship",this.worship)}},computed:{worship:{get:function(){return this.$store.state.worship?(this.$store.state.worship.forEach(function(t){if("hymn"===t.parseType)t.parseTxt=t.parsed.join("<br/>");else if("scripture"===t.parseType){var e="";t.parsed.forEach(function(s){t.parsed.length>1&&(e+="<br/>"+s.volumnName+s.chapterSN+":"+s.scope.join("-")+"<br/>"),s.verses.forEach(function(t){e+=t.verseSN+" "+t.lection+"<br/>"})}),t.parseTxt=e}}),this.$store.state.worship):null},set:function(t){this.$store.commit("setWorship",t)}}}},f,!1,function(t){s("lX1i")},"data-v-273c0500",null).exports,y={mounted:function(){this.distPath||(this.$store.commit("setCur","parsed"),this.$router.push("/gen-ppt/parsed"))},data:function(){return{thStyle:{"max-width":"100%",color:"#9e9e9e","margin-top":"16px","font-size":"14px","line-height":"24px","font-weight":"800","box-sizing":"border-box!important","word-wrap":"break-word!important"},pStyle:{"max-width":"100%",color:"#424242","font-size":"16px","line-height":"1.4em","box-sizing":"border-box!important","word-wrap":"break-word!important"}}},methods:{download:function(){window.location.href=this.distPath},copy:function(){var t=this.$refs.content.innerHTML;document.execCommand||this.$notify.info({title:"复制文本",message:"浏览器不支持复制请使用Chrome"});var e=(new Date).valueOf(),s=document.createElement("textarea");s.style="opacity:0; position: absolute; z-index: -1;",s.id=e,s.innerHTML=t,document.body.append(s);var n=document.getElementById(e);n.select(),document.execCommand("copy"),n.parentNode.removeChild(n),this.$notify.success({title:"复制文本",message:"已经复制文章到剪切板"})}},computed:{distPath:function(){return this.$store.state.distPath},hymnList:function(){if(!this.$store.state.worship)return null;var t={pHymn:"颂赞诗歌",hCommunicationHymn:"圣餐诗歌",rHymn:"回应诗歌",song:"三一颂"},e=[];return this.$store.state.worship.forEach(function(s){t[s.key]&&e.push(s)}),e},worship:function(){if(!this.$store.state.worship)return null;var t={name:"威盛职场团契周六信息分享",call:"宣召",lection:"启应经文",hCommunication:"圣餐",hCommunicationScripture:"圣餐经文",choir:"诗班献诗",pScripture:"信息经文",pTitle:"信息主题",time:"时间",place:"地点"};return this.$store.state.worship.forEach(function(e){t[e.key]&&(t[e.key]=e.value)}),t}}},w={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("section",{staticClass:"pd-m"},[s("dl",[t._m(0),t._v(" "),s("div",{staticClass:"output-info pd-m pointer",on:{click:t.download}},[t._v(t._s(t.distPath))])]),t._v(" "),s("dl",{staticClass:"mg-m-v"},[s("li",{staticClass:"bg-bright pd-m-h ht-l"},[s("span",[t._v("公众号的文章")]),t._v(" "),s("div"),t._v(" "),s("button",{staticClass:"sd-theme wd-xl",on:{click:t.copy}},[t._v("点击复制")])]),t._v(" "),s("div",{ref:"content",staticClass:"output-info pd-m pointer"},[s("p",{style:t.thStyle},[t._v("信息主题：")]),t._v(" "),s("p",{style:t.pStyle},[t._v(t._s(t.worship.pTitle))]),t._v(" "),s("p",{style:t.thStyle},[t._v("信息经文：")]),t._v(" "),s("p",{style:t.pStyle},[t._v(t._s(t.worship.pScripture))]),t._v(" "),s("p",{style:t.thStyle},[t._v("宣    召：")]),t._v(" "),s("p",{style:t.pStyle},[t._v(t._s(t.worship.call))]),t._v(" "),s("p",{style:t.thStyle},[t._v("启应经文：")]),t._v(" "),s("p",{style:t.pStyle},[t._v(t._s(t.worship.lection))]),t._v(" "),s("p",{style:t.thStyle},[t._v("诗班献诗：")]),t._v(" "),s("p",{style:t.pStyle},[t._v(t._s(t.worship.choir))]),t._v(" "),s("p",{style:t.thStyle},[t._v("诗歌：")]),t._v(" "),t._l(t.hymnList,function(e){return s("p",{style:t.pStyle},[s("span",[t._v("新编赞美诗歌："+t._s(e.sn))]),t._v(" "),s("span",[t._v(" "+t._s(e.title)+" ")])])}),t._v(" "),s("p",{style:t.thStyle},[t._v("时间：")]),t._v(" "),s("p",{style:t.pStyle},[t._v(t._s(t.worship.time))]),t._v(" "),s("p",{style:t.thStyle},[t._v("地点：")]),t._v(" "),s("p",{style:t.pStyle},[t._v(t._s(t.worship.place))]),t._v(" "),s("p",{style:t.thStyle},[t._v("附近交通信息：")]),t._v(" "),s("p",{style:t.pStyle},[t._v("深南大道9966号")]),t._v(" "),s("p",{style:t.pStyle},[t._v("地铁：①号罗宝线-深大站 A3出口直行80-100米")]),t._v(" "),s("p",{style:t.pStyle},[t._v("公交：深大北门①")])],2)])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("li",{staticClass:"bg-bright pd-m-h ht-l"},[e("span",[this._v("文件已经导出")])])}]},g=s("VU/8")(y,w,!1,null,null,null).exports,$={render:function(){var t=this.$createElement,e=this._self._c||t;return e("section",{staticClass:"content wd-max pd-s"},[e("div",{staticClass:"wd-max ht-max sd-cut pd-s",staticStyle:{"line-height":"1.5em"},domProps:{innerHTML:this._s(this.content)}})])},staticRenderFns:[]};var C={data:function(){return{cur:1,content:""}},methods:{previousStep:function(){this.cur=1},nextStep:function(){this.generate()},generate:function(){var t=this,e=this.$store.state.inp;if(!e)return!1;var s=this.$loading({fullscreen:!0});this.$http.post("/api/gen-html",{worship:e}).then(function(e){if(s.close(),0!=e.body.code)return t.$notify.error({title:e.body.msg,message:e.body.msg,duration:0});t.$notify.success({title:e.body.msg,message:"可以下载PPT啦"}),t.cur=2,t.content=e.body.data.content})}},components:{"input-vchurch":m,"html-preview":s("VU/8")({props:["content"],name:"preview",data:function(){return{output:""}}},$,!1,function(t){s("jaeF")},"data-v-688cc408",null).exports}},x={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("article",[s("header",{staticClass:"pd-l"},[s("section",[s("el-steps",{attrs:{active:t.cur,"finish-status":"success"}},[s("el-step",{attrs:{title:"文本 1",description:"将崇拜的步骤和信息按照示例格式输入到文本框"}}),t._v(" "),s("el-step",{attrs:{title:"解析 2",description:"检查解析出的经文, 歌词, 流程是否有遗漏或错误"}})],1)],1)]),t._v(" "),s("content",{staticClass:"lay-r"},[1==t.cur?s("input-vchurch"):t._e(),t._v(" "),2==t.cur?s("html-preview",{attrs:{content:t.content}}):t._e()],1),t._v(" "),s("footer",[s("li",{staticClass:"sd-cut ht-l pd-m-h"},[s("button",{directives:[{name:"show",rawName:"v-show",value:2==t.cur,expression:"cur==2"}],staticClass:"sd-cut wd-xl",on:{click:t.previousStep}},[t._v("\n        上一步\n      ")]),t._v(" "),s("button",{directives:[{name:"show",rawName:"v-show",value:1==t.cur,expression:"cur==1"}],staticClass:"sd-theme wd-xl",on:{click:t.nextStep}},[t._v("\n        下一步\n      ")])])])])},staticRenderFns:[]};var b=s("VU/8")(C,x,!1,function(t){s("p6+Y")},"data-v-47577f07",null).exports,S={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("article",[s("header",{staticClass:"sd-bright"},[s("section",[s("li",{staticClass:"ht-l pd-m"},[s("span",{staticClass:"fs-xl"},[t._v(t._s(t.$route.name))])]),t._v(" "),s("li",{staticClass:"pd-m ht-l panel-nav align-c cl-sec"},[s("span",{staticClass:"ht-l input-panel-nav wd-l",class:{"cl-theme":"input-panel"===t.cur}},[t._m(0),t._v(" "),s("div",{staticClass:"ht-xs fs-s"},[t._v("文本")])]),t._v(" "),t._m(1),t._v(" "),s("span",{staticClass:"ht-l parsed-panel-nav wd-l",class:{"cl-theme":"parsed-panel"===t.cur}},[t._m(2),t._v(" "),s("div",{staticClass:"ht-xs fs-s"},[t._v("解析")])]),t._v(" "),t._m(3),t._v(" "),s("span",{staticClass:"ht-l output-panel-nav wd-l",class:{"cl-theme":"output-panel"===t.cur}},[t._m(4),t._v(" "),s("div",{staticClass:"ht-xs fs-s"},[t._v("导出")])])])])]),t._v(" "),s("content",[s("router-view")],1)])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"ht-s"},[e("i",{staticClass:"fa fa-file-text-o fs-xl"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"wd-s"},[e("i",{staticClass:"fa fa-angle-right fs-xl"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"ht-s"},[e("i",{staticClass:"fa fa-list fs-xl"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"wd-s"},[e("i",{staticClass:"fa fa-angle-right fs-xl"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"ht-s"},[e("i",{staticClass:"fa fa-download fs-xl"})])}]},k=s("VU/8")({computed:{cur:function(){return this.$store.state.cur}}},S,!1,null,null,null).exports;n.default.use(p.a);var E=new p.a({routes:[{path:"/",name:"威盛工具",redirect:"/gen-ppt/input"},{path:"/gen-ppt",name:"ppt生成工具",component:d,redirect:"/gen-ppt/input",children:[{path:"/gen-ppt/input",name:"文本",component:m},{path:"/gen-ppt/parsed",name:"解析",component:_},{path:"/gen-ppt/output",name:"导出",component:g}]},{path:"/gen-html",name:"公众号文章生成",component:b},{path:"/gen-monthly",name:"月刊生成",redirect:"/gen-monthly/article",children:[{path:"/gen-monthly/article",name:"月刊生成",component:k}]}]}),P=s("8+8L"),T=s("zL8q"),N=(s("tvR6"),s("NYxO"));n.default.use(P.a),n.default.prototype.$loading=T.Loading.service,n.default.prototype.$notify=T.Notification,n.default.use(T.Steps),n.default.use(T.Step),n.default.use(T.Button),n.default.use(N.a);var F=new N.a.Store({state:{cur:"input",inp:s("N2op"),worship:null,distPath:""},mutations:{setCur:function(t,e){t.cur=e},setInp:function(t,e){t.inp=e},setWorship:function(t,e){t.worship=e},setDistPath:function(t,e){t.distPath=e}}});n.default.config.productionTip=!1,new n.default({el:"#app",router:E,store:F,components:{App:l},template:"<App/>"})},jaeF:function(t,e){},lX1i:function(t,e){},"p6+Y":function(t,e){},rj31:function(t,e){},tvR6:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.96c00a28bf71aa4521b8.js.map