var C="timely-v11",Q="timely-q",F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C&&x!==Q}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
self.addEventListener("fetch",function(e){if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(C).then(function(x){x.put(e.request,c)});return r}).catch(function(){return caches.match(e.request,{ignoreSearch:true})}))});
function p2(n){return ("0"+n).slice(-2)}
function hhmm(t){var d=new Date(t);return p2(d.getHours())+":"+p2(d.getMinutes())}
self.addEventListener("notificationclick",function(e){
  var n=e.notification,d=n.data||{};
  if(e.action&&d.acts){
    var c=d.acts[+e.action.slice(1)];if(c===undefined)return;
    e.waitUntil((async function(){
      var t=Date.now(),ch=await caches.open(Q),r=await ch.match("q"),q=r?await r.json():[];
      q.push({p:d.prof,c:c,t:t});await ch.put("q",new Response(JSON.stringify(q)));
      var run=c==="__stop"?null:c,acts=d.btns.filter(function(b){return b!==run&&!(b==="__stop"&&!run)}).slice(0,d.max||2);
      await self.registration.showNotification(run?"⏱ "+run:"⏱ Timely",{tag:"timely",silent:true,renotify:false,requireInteraction:true,icon:"icon-192.png",badge:"icon-192.png",timestamp:t,
        body:run?"▶ started "+hhmm(t)+" · timer updates when you open Timely":"Stopped at "+hhmm(t)+" – tap a button to start",
        actions:acts.map(function(x,i){return{action:"a"+i,title:x==="__stop"?"⏹ Stop":x}}),
        data:{btns:d.btns,acts:acts,cur:run,s:t,prof:d.prof,max:d.max}});
      var cl=await self.clients.matchAll({type:"window",includeUncontrolled:true});cl.forEach(function(w){w.postMessage({timelyQ:1})});
    })());
    return;
  }
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(l){if(l.length)return l[0].focus();return self.clients.openWindow("./")}));
});
