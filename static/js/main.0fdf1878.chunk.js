(this.webpackJsonpsilverstreaming=this.webpackJsonpsilverstreaming||[]).push([[0],{45:function(e,t,a){e.exports=a(81)},50:function(e,t,a){},51:function(e,t,a){},74:function(e,t){},81:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),r=a(42),o=a.n(r),l=(a(50),a(9)),i=(a(51),a(10)),s=a(1);function u(e){return c.a.createElement("div",{className:"container"},"chatbox here")}var m=a(23),d=a.n(m);function E(e){var t=Object(n.useState)(""),a=Object(l.a)(t,2),r=a[0];a[1];return c.a.createElement("div",{className:"container"},c.a.createElement("video",{className:"mainVideoPlayer",autoPlay:!0,controls:!0,playsInline:!0,src:r}),c.a.createElement(u,null))}var p=a(43);function v(e){var t,a=Object(n.useRef)([]);function r(e){var t,n=Object(p.a)(a.current);try{for(n.s();!(t=n.n()).done;){t.value.muted=e}}catch(c){n.e(c)}finally{n.f()}}return Object(n.useEffect)((function(){console.log(e.participants.length),a.current=a.current.slice(0,e.participants.length),console.log(a.current)}),[e.participants]),c.a.createElement("div",{className:"container"},c.a.createElement("div",{className:"muteButtons"},c.a.createElement("button",{onClick:function(){return r(!0)}},"Mute all"),c.a.createElement("button",{onClick:function(){return r(!1)}},"Unmute all")),c.a.createElement("div",{className:"thumbnails"},null===(t=e.participants)||void 0===t?void 0:t.map((function(e,t){return c.a.createElement("div",{className:"streamThumbnail",key:e},c.a.createElement("video",{className:"participantVideoPlayer",autoPlay:!0,controls:!0,playsInline:!0,source:t,ref:function(t){return a.current[e-1]=t},key:e}))}))))}function f(e){Object(n.useRef)(),Object(n.useRef)(),Object(n.useRef)(),d()(window.location.origin);return c.a.createElement("div",{className:"container"},c.a.createElement("video",{className:"mainVideoPlayer",autoPlay:!0,controls:!0,playsInline:!0}),c.a.createElement(v,{participants:["1","2","3","4","5","6","7","8","9"]}),c.a.createElement(u,null))}function b(){var e=Object(n.useState)(""),t=Object(l.a)(e,2),a=t[0],r=t[1],o=Object(n.useRef)();return c.a.createElement("div",{className:"container"},c.a.createElement("div",{className:"landingInputBox"},c.a.createElement("div",{className:"tokenGenerator"},c.a.createElement("button",{onClick:function(){for(var e="",t="ABCDEFGHJKLMNPQRSTUVXYZabcdefghijklmnopqrstuvwxyz23456789",a=t.length,n=0,c=0;c<12;c++)n=Math.floor(Math.random()*a),e+=t.charAt(n);r(e),o.current.value=e}},"Generate token")),c.a.createElement("div",{className:"input"},c.a.createElement("label",{htmlFor:"#tokenIdInput"},"Token"),c.a.createElement("input",{id:"tokenIdInput",ref:o,onChange:function(e){return r(e.target.value)},placeholder:"Input token id"})),c.a.createElement("div",{className:"buttons"},c.a.createElement(i.b,{to:"/watch/".concat(a),className:"modeButton"},c.a.createElement("button",null,"Watch")),c.a.createElement(i.b,{to:"/broadcast/".concat(a),className:"modeButton"},c.a.createElement("button",null,"Broadcast")))))}var h=function(){var e=Object(n.useState)(!0),t=Object(l.a)(e,2);return t[0],t[1],c.a.createElement("div",{className:"App"},c.a.createElement(i.a,{basename:"/"},c.a.createElement(i.b,{to:"/",className:"AppHeader"},"Silverstreaming Demo"),c.a.createElement(s.d,null,c.a.createElement(s.b,{path:"/home",component:b}),c.a.createElement(s.b,{path:"/watch/:id",component:E}),c.a.createElement(s.b,{exact:!0,path:"/",render:function(){return c.a.createElement(s.a,{to:"/home"})}}),c.a.createElement(s.b,{path:"/broadcast/:id",component:f}),c.a.createElement(s.b,{path:"*",render:function(){return c.a.createElement(s.a,{to:"/home"})}}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(h,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[45,1,2]]]);
//# sourceMappingURL=main.0fdf1878.chunk.js.map