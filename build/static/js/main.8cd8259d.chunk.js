(this["webpackJsonpexample-app"]=this["webpackJsonpexample-app"]||[]).push([[0],{23:function(e,t,n){},24:function(e,t,n){},45:function(e,t,n){"use strict";n.r(t);var r=n(3),c=n.n(r),a=n(17),s=n.n(a),u=(n(23),n(24),n(2)),i=n.n(u),o=n(4),p=n(18),l=n(0),j=function(e){return Object(l.jsxs)("li",{children:[Object(l.jsxs)("h1",{children:[e.name," ",e.surname]}),Object(l.jsx)("div",{children:Object(l.jsxs)("p",{children:[e.validUntil,", ",e.cardNumber]})})]})},d=n(7),f=n.n(d),b="http://localhost:3001/api/cards",h=function(){var e=Object(o.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.a.get(b);case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),x=function(){var e=Object(r.useState)([]),t=Object(p.a)(e,2),n=t[0],c=t[1];return Object(r.useEffect)((function(){var e=function(){var e=Object(o.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,h();case 3:t=e.sent,console.log(t),c(t),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),alert(e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(){return e.apply(this,arguments)}}();e()}),[]),Object(l.jsx)("ul",{children:n&&n.length>0?n.map((function(e){return Object(l.jsx)(j,{card:e},e.id)})):Object(l.jsx)("li",{children:"no cards found"})})};var v=function(){return Object(l.jsx)("div",{className:"App",children:Object(l.jsx)(x,{})})},O=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,46)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),r(e),c(e),a(e),s(e)}))};s.a.render(Object(l.jsx)(c.a.StrictMode,{children:Object(l.jsx)(v,{})}),document.getElementById("root")),O()}},[[45,1,2]]]);
//# sourceMappingURL=main.8cd8259d.chunk.js.map