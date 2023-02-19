/*!
 * modernizr v3.12.0
 * Build https://modernizr.com/download?-setclasses-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera
 *  Veeck

 * MIT License
 */
!function(e,n,s,o){var a=[],t={_version:"3.12.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout((function(){n(s[e])}),0)},addTest:function(e,n,s){a.push({name:e,fn:n,options:s})},addAsyncTest:function(e){a.push({name:null,fn:e})}},i=function(){};i.prototype=t,i=new i;var l=[];var f=s.documentElement,r="svg"===f.nodeName.toLowerCase();!function(){var e,n,s,o,t,f;for(var r in a)if(a.hasOwnProperty(r)){if(e=[],(n=a[r]).name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(o=typeof n.fn==="function"?n.fn():n.fn,t=0;t<e.length;t++)1===(f=e[t].split(".")).length?i[f[0]]=o:(i[f[0]]&&(!i[f[0]]||i[f[0]]instanceof Boolean)||(i[f[0]]=new Boolean(i[f[0]])),i[f[0]][f[1]]=o),l.push((o?"":"no-")+f.join("-"))}}(),function(e){var n=f.className,s=i._config.classPrefix||"";if(r&&(n=n.baseVal),i._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(o,"$1"+s+"js$2")}i._config.enableClasses&&(e.length>0&&(n+=" "+s+e.join(" "+s)),r?f.className.baseVal=n:f.className=n)}(l),delete t.addTest,delete t.addAsyncTest;for(var c=0;c<i._q.length;c++)i._q[c]();e.Modernizr=i}(window,window,document);