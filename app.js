/* BAHR — app.js : منطق التطبيق (Supabase، الإعلانات، الطلبات، الحسابات، الواجهة). مستخرج بالترتيب الأصلي دون تغيير في الكود.
   كل جزء معزول بـ try/catch حتى لا يوقف خطأ في جزء بقية الأجزاء كما كان مع وسوم script المنفصلة. */

/* ===== [b77-log] ===== */
try{
/* B77: طبقة موحّدة لتسجيل أخطاء المنصة. تعمل فقط عبر دالة b77_log_error (b77_errors.sql). إن لم تكن مفعّلة على الخادم تتوقف بصمت ولا تؤثر على الموقع. لا كلمات مرور ولا رموز ولا محتوى رسائل ولا IDs ولا query strings. */
(function(){var C=window.BAHR_CONFIG||{},U=C.supabaseUrl,K=C.supabaseAnonKey,VER='B77';if(!U||!K||!window.fetch)return;
var F=window.fetch.bind(window),seen={},sent=0,off=false,Q=[],lastToast=0,MAX=30,O;try{O=new URL(U).origin}catch(e){return}
function clean(s){return String(s==null?'':s).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,'[email]').replace(/eyJ[A-Za-z0-9_-]{10,}(\.[A-Za-z0-9_-]+)*/g,'[token]').replace(/[A-Fa-f0-9]{24,}/g,'[id]').replace(/[0-9][0-9 ()+-]{6,}[0-9]/g,'[num]').replace(/\?[^\s]*/g,'').slice(0,200)}
function page(){var h=(location.hash||'').replace(/^#/,'').split('?')[0].replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi,':id');return(h||'home').slice(0,40)}
function dev(){var w=innerWidth,ua=navigator.userAgent||'',os=/iPhone|iPad|iPod/.test(ua)?'iOS':/Android/.test(ua)?'Android':/Windows/.test(ua)?'Windows':/Mac/.test(ua)?(navigator.maxTouchPoints>1?'iPadOS':'Mac'):'Other';return(w<600?'mobile':w<1024?'tablet':'desktop')+'/'+os}
function hash(s){var h=5381,i;for(i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return(h>>>0).toString(36)}
function ref(){var a=new Uint8Array(3),r='';try{crypto.getRandomValues(a)}catch(e){a=[Date.now()%255,Math.random()*255|0,Math.random()*255|0]}for(var i=0;i<3;i++)r+=('0'+(a[i]&255).toString(16)).slice(-2);return 'ERR-'+Date.now().toString(36).toUpperCase().slice(-5)+r.toUpperCase()}
function post(b){if(off)return;if(!navigator.onLine){if(Q.length<10)Q.push(b);return}
 F(U+'/rest/v1/rpc/b77_log_error',{method:'POST',keepalive:true,headers:{'Content-Type':'application/json',apikey:K,Authorization:'Bearer '+K},body:JSON.stringify(b)}).then(function(r){if(r.status===404)off=true;else if(r.status>=500&&Q.length<10)Q.push(b)},function(){if(Q.length<10)Q.push(b)})}
addEventListener('online',function(){var q=Q.splice(0);q.forEach(post)});
function log(kind,area,op,status,msg){if(off||sent>=MAX)return null;var pg=page(),m=clean(msg),fp=hash([kind,area,op,status,pg,m.replace(/\d+/g,'#')].join('|')),n=Date.now(),s=seen[fp];
 if(s&&n-s.t<6e4){s.c++;return s.r}var r=s?s.r:ref(),c=s?s.c:1;seen[fp]={t:n,c:0,r:r};sent++;
 var b={p_ref:r,p_fp:fp,p_kind:kind,p_area:area,p_op:op,p_page:pg,p_status:status||null,p_msg:m,p_device:dev(),p_viewport:(Math.round(innerWidth/50)*50)+'w',p_ver:VER,p_count:c};
 (window.requestIdleCallback||function(f){setTimeout(f,300)})(function(){post(b)});return r}
var AR=[[/^(listings|listing_images)$/,'listings'],[/^(profiles|biz_profiles)$/,'account'],[/^parts|^b60|^b62/,'parts'],[/service/,'services'],[/connect|chat|^b22|^b46|message/,'chat'],[/^b57|support/,'support'],[/^is_admin$|^admin|^b5[68]|^b74/,'admin'],[/report/,'reports']];
function area(n){for(var i=0;i<AR.length;i++)if(AR[i][0].test(n))return AR[i][1];return 'other'}
function adm(){return /^#(admin|adm|opscenter)/.test(location.hash)}
function cls(url,m,st,fail){var u;try{u=new URL(url,location.href)}catch(e){return}if(u.origin!==O)return;var p=u.pathname,op,a;
 if(/\/rpc\/b77_/.test(p))return;
 if(p.indexOf('/auth/v1/')===0){if(!fail&&st<500)return;op='auth';a='account'}
 else if(p.indexOf('/rest/v1/rpc/')===0){var n=p.split('/').pop();op='rpc:'+n;a=area(n)}
 else if(p.indexOf('/rest/v1/')===0){var tb=p.split('/')[3];op=m+':'+tb;a=area(tb)}
 else if(p.indexOf('/storage/v1/')===0){var q=p.split('/');op='storage:'+(q[4]||'')+':'+m;a='upload'}
 else if(p.indexOf('/functions/v1/')===0){op='function:'+p.split('/')[3];a='other'}
 else return;if(adm())a='admin';
 var k=fail?'network':st>=500?'server':st===401||st===403?'denied':st===404?'config':'request';
 if(!fail&&(st===406||st===409||st===429))return;log(k,a,op,st,fail?'network failure':'http '+st);}
window.fetch=function(i,o){var url=typeof i==='string'?i:i&&i.url,m=((o&&o.method)||(i&&i.method)||'GET').toUpperCase();
 return F(i,o).then(function(r){if(!r.ok)try{cls(url,m,r.status,false)}catch(e){}return r},function(e){if(!(e&&e.name==='AbortError'))try{cls(url,m,0,true)}catch(x){}throw e})};
function ut(r){var n=Date.now();if(n-lastToast<3e4||!r)return;lastToast=n;try{sessionStorage.setItem('b77ref',r)}catch(e){}var el=document.getElementById('toast');if(el){el.textContent='صار خطأ غير متوقع، إذا تكررت المشكلة تگدر ترسل بلاغ للدعم. رقم المرجع: '+r;el.classList.add('on');setTimeout(function(){el.classList.remove('on')},6000)}}
addEventListener('error',function(e){if(!e||e.target&&e.target!==window)return;var f=e.filename||'';if(f&&f.indexOf(location.origin)!==0)return;var m=e.message||'';if(!m||/ResizeObserver|^Script error/.test(m))return;ut(log('client',adm()?'admin':'other','js',null,m+(e.lineno?' @'+e.lineno:'')))});
addEventListener('unhandledrejection',function(e){var r=e&&e.reason,m=r&&(r.message||r.name)||'';if(!m||r&&r.name==='AbortError')return;ut(log('client',adm()?'admin':'other','promise',null,m))});
window.B77={log:log,page:page}})();
}catch(e){try{console.error('[BAHR:b77-log]',e)}catch(_){}}

/* ===== [b85-perf] ===== */
try{
/* B85: قياس أداء من المتصفح لهذه الجلسة فقط، في الذاكرة. لا يُرسل شيء لأي خادم ولا يُخزَّن. لا روابط ولا IDs ولا query strings ولا محتوى: اسم العملية ومدتها ونتيجتها فقط. المدة هي ما يراه المتصفح (شبكة + خادم) وليست زمن تنفيذ قاعدة البيانات. */
(function(){var C=window.BAHR_CONFIG||{},O;try{O=new URL(C.supabaseUrl).origin}catch(e){return}if(!window.fetch||!window.performance)return;
var F=window.fetch,S=[],IM=[],MAX=300,V={lcp:null,imgFail:0};
function cls(url,m){var u;try{u=new URL(url,location.href)}catch(e){return null}if(u.origin!==O)return null;var p=u.pathname;if(/\/rpc\/b77_/.test(p))return null;
 if(p.indexOf('/auth/v1/')===0)return{op:'auth',ty:'auth'};
 if(p.indexOf('/rest/v1/rpc/')===0)return{op:'rpc:'+p.split('/').pop(),ty:'rpc'};
 if(p.indexOf('/rest/v1/')===0)return{op:m+':'+p.split('/')[3],ty:'rest'};
 if(p.indexOf('/storage/v1/')===0){var q=p.split('/'),b=/^(public|sign|authenticated)$/.test(q[4])?q[5]:q[4];return{op:'storage:'+(b||'')+':'+m,ty:'storage'}}
 if(p.indexOf('/functions/v1/')===0)return{op:'function:'+p.split('/')[3],ty:'function'};return null}
function rec(c,t,st,ok){S.push({t:Date.now(),op:c.op,ty:c.ty,ms:Math.round(performance.now()-t),st:st,ok:ok});if(S.length>MAX)S.shift()}
window.fetch=function(i,o){var url=typeof i==='string'?i:i&&i.url,m=((o&&o.method)||(i&&i.method)||'GET').toUpperCase(),c=null;try{c=cls(url,m)}catch(e){}
 if(!c)return F.call(window,i,o);var t=performance.now();
 return F.call(window,i,o).then(function(r){rec(c,t,r.status,r.ok);return r},function(e){if(!(e&&e.name==='AbortError'))rec(c,t,0,false);throw e})};
try{new PerformanceObserver(function(l){var e=l.getEntries();if(e.length)V.lcp=Math.round(e[e.length-1].startTime)}).observe({type:'largest-contentful-paint',buffered:true})}catch(e){}
try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(e.initiatorType==='img'&&e.name.indexOf(O+'/storage/')===0){IM.push(Math.round(e.duration));if(IM.length>MAX)IM.shift()}})}).observe({type:'resource',buffered:true})}catch(e){}
document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.src&&t.src.indexOf(O+'/storage/')===0)V.imgFail++},true);
window.B85={samples:function(){return S.slice()},images:function(){return{ms:IM.slice(),fail:V.imgFail}},
 nav:function(){var n=(performance.getEntriesByType('navigation')||[])[0],f=(performance.getEntriesByName('first-contentful-paint')||[])[0],r=function(x){return typeof x==='number'&&x>0?Math.round(x):null};return{ttfb:n?r(n.responseStart):null,fcp:f?r(f.startTime):null,lcp:V.lcp,dcl:n?r(n.domContentLoadedEventEnd):null,load:n?r(n.loadEventEnd):null}}}})();
}catch(e){try{console.error('[BAHR:b85-perf]',e)}catch(_){}}

/* ===== [b88-collector] ===== */
try{
/* B88: مجمّع أحداث واجهة في ذاكرة هذه الجلسة فقط (أخطاء JavaScript وانقطاع الاتصال). لا يُرسل شيئاً لأي خادم ولا يُخزَّن. لا كلمات مرور ولا رموز ولا IDs ولا query strings. */
(function(){var MAX=60,L=[];
function clean(s){return String(s==null?'':s).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,'[email]').replace(/eyJ[A-Za-z0-9_-]{10,}(\.[A-Za-z0-9_-]+)*/g,'[token]').replace(/[A-Fa-f0-9]{24,}/g,'[id]').replace(/[0-9][0-9 ()+-]{6,}[0-9]/g,'[num]').replace(/\?[^\s]*/g,'').slice(0,160)}
function pg(){var h=(location.hash||'').replace(/^#/,'').split('?')[0].replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi,':id');return(h||'home').slice(0,40)}
function add(k,m){L.push({t:Date.now(),k:k,pg:pg(),m:clean(m)});if(L.length>MAX)L.shift()}
addEventListener('error',function(e){if(!e||e.target&&e.target!==window)return;var f=e.filename||'';if(f&&f.indexOf(location.origin)!==0)return;var m=e.message||'';if(!m||/ResizeObserver|^Script error/.test(m))return;add('js',m+(e.lineno?' @'+e.lineno:''))});
addEventListener('unhandledrejection',function(e){var r=e&&e.reason,m=r&&(r.message||r.name)||'';if(!m||r&&r.name==='AbortError')return;add('promise',m)});
addEventListener('offline',function(){add('offline','انقطع الاتصال بالإنترنت')});addEventListener('online',function(){add('online','عاد الاتصال بالإنترنت')});
window.B88C={events:function(){return L.slice()}}})();
}catch(e){try{console.error('[BAHR:b88-collector]',e)}catch(_){}}

/* ===== [bahr-help-data] ===== */
try{
(function(){var px=function(i){return 'https://images.pexels.com/photos/'+i+'/pexels-photo-'+i+'.jpeg?auto=compress&cs=tinysrgb&w=1000'};
var NOTE='المعلومات هنا تعليمية عامة. للتفاصيل الدقيقة والقيم والمواعيد الخاصة بموديلك راجع دليل الشركة المصنعة أو فنياً مختصاً.';
window.BAHR_HELP={
cats:[
{id:'basics',t:'أساسيات الجت سكي والقوارب',d:'تعريف عام بالمركبات المائية وأنواعها.',ic:'jetski'},
{id:'engines',t:'المحركات البحرية ومكوناتها',d:'أنواع المحركات وأجزاؤها الرئيسية.',ic:'engine'},
{id:'parts',t:'قطع الغيار ووظيفة كل قطعة',d:'ما تفعله القطع الشائعة ولماذا تهم.',ic:'parts'},
{id:'maintenance',t:'الصيانة الدورية والعناية',d:'عادات عناية عامة وكيف تنظّم الصيانة.',ic:'wrench'},
{id:'buying',t:'شراء المعدات المستعملة',d:'ما تفحصه وما تسأل عنه قبل الدفع.',ic:'shield'},
{id:'glossary',t:'مصطلحات بحرية شائعة',d:'قاموس مبسّط للمصطلحات المتداولة.',ic:'search'}],
arts:[
{id:'jetski-basics',c:'basics',t:'ما هو الجت سكي وكيف يعمل بشكل عام؟',s:'فكرة مبسطة عن الدفع بنفاثة الماء وأساسيات الأمان.',img:'hero1.jpg',cap:'صورة توضيحية لجت سكي.',date:'2026-10-21',tags:'جت سكي نفاثة دفع امان سترة نجاة',
b:[['p','الجت سكي مركبة مائية شخصية. يدير المحرك مضخة نفاثة تسحب الماء وتدفعه إلى الخلف عبر فوهة، فتتحرك المركبة إلى الأمام. وبدل الدفة التقليدية يُغيَّر اتجاه الفوهة للتوجيه.'],['h','ما يجدر معرفته'],['ul',['التوجيه يحتاج إلى دفع من المحرك، لذلك يتأثر التحكم عند ترك الخانق.','لا توجد مروحة مكشوفة كما في المحركات الخارجية، لكن مدخل الماء والمضخة يحتاجان إلى عناية.','استخدم سترة نجاة وحبل قطع المحرك دائماً.','الحدود المسموحة للركاب والاستخدام تحددها الشركة المصنعة والقوانين المحلية.']],['note',NOTE]]},
{id:'boat-types',c:'basics',t:'أنواع القوارب الشائعة واستخداماتها',s:'نظرة سريعة على أنواع القوارب ومواد الهيكل.',img:px(38102883),cap:'صورة توضيحية لقارب على ضفة نهر.',date:'2026-10-21',tags:'قوارب صيد نزهة هيكل فايبر المنيوم',
b:[['p','يختلف القارب المناسب باختلاف المكان والاستخدام: نهر أو بحر، صيد أو نزهة أو نقل.'],['h','أنواع شائعة'],['ul',['قوارب صيد صغيرة: بسيطة وعملية للاستخدام اليومي.','قوارب النزهة والسرعة: مصممة للراحة أو للأداء.','قوارب بمحرك خارجي: يُثبَّت المحرك على مؤخرتها.','قوارب بمحرك داخلي: المحرك داخل الهيكل.']],['h','مواد الهيكل'],['p','من المواد المعروفة الفايبرغلاس والألمنيوم والخشب. لكل مادة مزايا وعيوب وطريقة فحص مختلفة، ويُفضَّل أن يفحصها شخص خبير قبل الشراء.']]},
{id:'engine-types',c:'engines',t:'المحرك الخارجي والداخلي: الفرق العام',s:'كيف يختلف موضع المحرك، وما أجزاؤه الرئيسية.',img:px(7386238),cap:'صورة توضيحية لمحرك خارجي على قارب.',date:'2026-10-21',tags:'محرك خارجي داخلي شوطين اربعة اشواط تبريد',
b:[['p','المحرك الخارجي يُثبَّت على مؤخرة القارب ويضم المحرك والوحدة السفلية والمروحة. أما الداخلي فيكون داخل الهيكل وتنتقل حركته عبر ناقل خاص. والجت سكي يستخدم عادة محركاً داخلياً مع مضخة نفاثة.'],['h','أجزاء رئيسية'],['ul',['كتلة المحرك والأسطوانات.','نظام الوقود.','نظام الإشعال والكهرباء.','نظام التبريد بماء المصدر المحيط.','الوحدة السفلية أو ناقل الحركة.']],['h','الشوطان والأربعة أشواط'],['p','يختلف النوعان في طريقة التزييت والاحتراق. نوع الزيت ونسبته وطريقة استخدامه يحددها دليل الشركة المصنعة فقط، فلا تعتمد على نصيحة عامة.'],['note',NOTE]]},
{id:'parts-functions',c:'parts',t:'المروحة والإمبلر وشمعات الإشعال: وظيفة كل قطعة',s:'شرح مبسط لقطع شائعة وما تفعله.',img:px(32967413),cap:'صورة توضيحية لمحرك خارجي — لا تمثّل قطعة بعينها.',date:'2026-10-21',tags:'مروحة امبلر شمعة فلتر وقود انود حبل',
b:[['dl',[['المروحة','في المحركات الخارجية تحوّل دوران المحرك إلى دفع للقارب.'],['الإمبلر (الجت سكي)','دوّار داخل المضخة النفاثة يدفع الماء ويولّد حركة المركبة.'],['إمبلر مضخة الماء','قطعة تدفع ماء التبريد داخل بعض المحركات الخارجية، ووظيفتها مختلفة عن إمبلر الجت سكي رغم تشابه الاسم.'],['شمعات الإشعال','تشعل خليط الوقود والهواء في المحركات التي تستخدمها.'],['فلتر الوقود','يحجز الشوائب والماء الزائد قبل وصول الوقود للمحرك.'],['الأنود التضحوي','قطعة معدنية صُمّمت لتتآكل بدل المعادن المهمة في الماء.'],['حبل قطع المحرك','يوقف المحرك عند ابتعاد السائق عن موضعه، وهو وسيلة أمان.']]],['note','عند شراء قطعة اعتمد على الموديل ورقم القطعة في دليل الشركة أو من وكيل أو فني، فالقطع المتشابهة قد لا تتوافق.']]},
{id:'care-routine',c:'maintenance',t:'عادات عناية عامة بالمعدات البحرية',s:'ما يمكن فعله بأمان للحفاظ على المعدة، وما يُترك للفني.',img:px(32408246),cap:'صورة توضيحية لقارب سريع.',date:'2026-10-21',tags:'صيانة شطف تخزين فحص تسرب ساعات التشغيل',
b:[['h','بعد الاستخدام'],['ul',['اشطف المعدة بالماء العذب إذا استُخدمت في ماء مالح أو شديد العكر، وبالطريقة التي يسمح بها الدليل.','افحص بصرياً: تسربات، خراطيم، أسلاك، تشققات في الهيكل.','فرّغ الماء المتجمع من الهيكل إن وُجد.','خزّن المعدة في مكان جاف ومظلل قدر الإمكان.']],['h','تنظيم الصيانة'],['ul',['دوّن ساعات التشغيل وتواريخ الصيانة في سجل.','اتبع جدول الصيانة في دليل الشركة المصنعة، فهو يختلف باختلاف الموديل.']],['note','أعمال الوقود والكهرباء والتبريد وناقل الحركة تتطلب خبرة. لا تجرّبها إن لم تكن مؤهلاً، وراجع فنياً مختصاً. لا تشغّل المحرك خارج الماء إلا بالطريقة التي يسمح بها الدليل.']]},
{id:'used-checklist',c:'buying',t:'قائمة فحص عامة قبل شراء قارب أو جت سكي مستعمل',s:'خطوات عملية تقلل مخاطر الشراء.',img:'hero2.jpg',cap:'صورة توضيحية لجت سكي.',date:'2026-10-21',tags:'شراء مستعمل فحص اوراق رقم تسلسلي تجربة',
b:[['ul',['اطلب أوراق الملكية أو التسجيل وطابق الرقم التسلسلي للهيكل والمحرك مع الموجود فعلياً.','افحص الهيكل: تشققات، إصلاحات واضحة، رطوبة، تآكل.','شغّل المحرك وهو بارد واستمع إلى الصوت وانتبه للدخان أو التسرب.','اطلب سجل الصيانة، وعامل عداد الساعات بحذر فقد لا يكون موثوقاً.','جرّب المعدة في الماء قبل الدفع.','اصطحب فنياً مختصاً إن أمكن.','وثّق الاتفاق كتابياً واحتفظ بإيصال الدفع.']],['note','لا تدفع كامل المبلغ قبل التأكد من الملكية والمعاينة والتجربة.']]},
{id:'used-engine-questions',c:'buying',t:'شراء محرك بحري مستعمل: أسئلة تسألها للبائع',s:'أسئلة تكشف حال المحرك قبل أن تقرر.',img:px(7386238),cap:'صورة توضيحية لمحرك خارجي.',date:'2026-10-21',tags:'محرك مستعمل بائع اسئلة ضغط الاسطوانات',
b:[['ul',['ما سنة الصنع والموديل والرقم التسلسلي؟','لماذا يُباع المحرك؟','متى آخر صيانة، ومن أجراها؟','هل أُصلح أو غُمر بالماء سابقاً؟','هل القطع أصلية؟','هل يمكن تصوير فيديو لتشغيله على بارد؟']],['p','فحوصات مثل ضغط الأسطوانات يُجريها فني مختص بأدواته. السعر المنخفض جداً والاستعجال في البيع من علامات الحذر.'],['note',NOTE]]},
{id:'glossary-basic',c:'glossary',t:'مصطلحات بحرية شائعة',s:'تعريفات مبسطة لمصطلحات تتكرر في الإعلانات.',img:'',cap:'',date:'2026-10-21',tags:'مصطلحات قاموس مقدمة مؤخرة ترانسوم غاطس ترم',
b:[['dl',[['المقدمة (Bow)','الجزء الأمامي من القارب.'],['المؤخرة (Stern)','الجزء الخلفي.'],['الميمنة (Starboard)','يمين القارب عند النظر نحو المقدمة.'],['الميسرة (Port)','يسار القارب بالنظر نفسه.'],['الهيكل (Hull)','الجسم الأساسي للقارب أو المركبة.'],['الترانسوم (Transom)','اللوح الخلفي الذي يُثبَّت عليه المحرك الخارجي.'],['الغاطس (Draft)','عمق الجزء المغمور من القارب تحت سطح الماء.'],['الوحدة السفلية (Lower unit)','الجزء السفلي من المحرك الخارجي الذي يحمل المروحة.'],['الترِم (Trim)','ضبط زاوية المحرك أو الدفع، ويختلف أسلوبه حسب النوع.'],['ساعات التشغيل (Engine hours)','عدد ساعات عمل المحرك، وتُستخدم مؤشراً تقريبياً للاستهلاك.'],['HP','وحدة تُعبّر عن قدرة المحرك (حصان).']]]]}
]};})();
}catch(e){try{console.error('[BAHR:bahr-help-data]',e)}catch(_){}}

/* ===== [line1067] ===== */
try{
(function(){'use strict';
var $=function(s){return document.querySelector(s)},ic=function(n){return '<svg class="ic" aria-hidden="true"><use href="#i-'+n+'"/></svg>'};
/* ---------- الصور المتحركة في الواجهة: غيّر HOLD (بالميلي ثانية) للتحكم بمدة بقاء كل صورة ---------- */
var HOLD=2000,sls=document.querySelectorAll('#slides .sl'),cur=0,AR=function(n){return String(n).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d]})},tmr=null;
function showS(n){sls[cur].classList.remove('on');cur=(n+sls.length)%sls.length;sls[cur].classList.add('on');$('#cnt').textContent=AR(cur+1)+' / '+AR(sls.length)}
function runS(){clearInterval(tmr);if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&sls.length>1)tmr=setInterval(function(){showS(cur+1)},HOLD)}
if(sls.length){showS(0);runS();$('#hsnext').addEventListener('click',function(){showS(cur+1);runS()});$('#hsprev').addEventListener('click',function(){showS(cur-1);runS()})}
/* ===== B23: مكوّن التمرير الأفقي القابل لإعادة الاستخدام (RTL، لمس، أسهم للكمبيوتر، تلميح بتلاشي الحافة) ===== */
var HS={
 row:function(h,c){return '<div class="hz-t'+(c?' '+c:'')+'" tabindex="0" role="region" aria-label="قائمة تُمرَّر أفقياً">'+h+'</div>'},
 set:function(el,h,c){el.classList.add('hz');el.innerHTML=HS.row(h,c);HS.init(el)},
 msg:function(el,m,retry){el.classList.remove('can');el.innerHTML='<p class="hz-msg">'+m+(retry?' <button class="btn" type="button" data-hretry>إعادة المحاولة</button>':'')+'</p>'},
 init:function(el){var t=el.querySelector('.hz-t');if(!t)return;
  [].forEach.call(el.querySelectorAll(':scope>.hz-a'),function(x){x.remove()});
  var rtl=getComputedStyle(t).direction==='rtl',sg=rtl?-1:1,p=document.createElement('button'),n=document.createElement('button');
  p.type=n.type='button';p.className='hz-a p';n.className='hz-a n';p.setAttribute('aria-label','السابق');n.setAttribute('aria-label','التالي');
  p.textContent=rtl?'›':'‹';n.textContent=rtl?'‹':'›';el.appendChild(p);el.appendChild(n);
  function upd(){var mx=t.scrollWidth-t.clientWidth,ps=Math.abs(t.scrollLeft),more=ps<mx-2,back=ps>2;
   el.classList.toggle('can',mx>4);p.disabled=!back;n.disabled=!more;
   t.classList.toggle('hz-fl',rtl?more:back);t.classList.toggle('hz-fr',rtl?back:more)}
  function go(d){t.scrollBy({left:d*sg*Math.max(160,t.clientWidth*.8),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})}
  p.addEventListener('click',function(){go(-1)});n.addEventListener('click',function(){go(1)});
  t.addEventListener('scroll',upd,{passive:true});
  if(window.ResizeObserver)new ResizeObserver(upd).observe(t);else window.addEventListener('resize',upd);
  upd()}
};
/* بطاقة محتوى موحّدة: القيم تُمرَّر بعد تهريبها؛ الحقول الفارغة لا تُعرض */
function CARD(o){return '<a class="uc" href="'+o.href+'"><div class="uc-m">'+(o.img?'<img src="'+o.img+'" alt="'+(o.alt||'')+'" loading="lazy" decoding="async" onerror="this.remove()">':'')+'<span class="uc-i">'+ic(o.icon||'shield')+'<small>الصورة غير متوفرة</small>'+'</span>'+(o.id?B11.heart(o.id)+'<button type="button" class="uc-sh" data-sh="#p-'+o.id+'" data-t="'+ex(o.alt||'')+'" aria-label="مشاركة"><svg class="ic" viewBox="0 0 24 24"><path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6"/></svg></button>':'')+'</div><div class="uc-b"><h3 dir="auto">'+o.title+'</h3>'+(o.price?'<div class="price">'+o.price+'</div>':'')+(o.sub?'<div class="uc-s">'+o.sub+'</div>':'')+((o.loc||o.badge)?'<div class="meta">'+(o.loc?'<span>'+ic('pin')+o.loc+'</span>':'<span></span>')+(o.badge?'<span class="cond">'+o.badge+'</span>':'')+'</div>':'')+'</div></a>'}
/* B28: مشاركة البطاقة، «عرض الكل» حسب النوع، والتمرير الناعم */
document.addEventListener('click',function(e){var s=e.target.closest('[data-sh]');if(s){e.preventDefault();e.stopImmediatePropagation();var u=location.origin+location.pathname+s.dataset.sh;if(navigator.share)navigator.share({title:s.dataset.t||'بحر',url:u}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(u).then(function(){toast('تم نسخ الرابط')},function(){});return}
 var a=e.target.closest('a[data-mt]');if(a){e.preventDefault();M.t=a.dataset.mt;if(location.hash==='#market')render();else location.hash='#market';return}
 var d=e.target.closest('[data-scroll]');if(d){var x=document.querySelector(d.dataset.scroll);if(x)x.scrollIntoView({behavior:'smooth',block:'start'})}},true);
var CATS=[['boat','القوارب','جديدة ومستعملة','#market','boat'],['jetski','جت سكي','أحدث الإعلانات','#market','jetski'],['engine','المحركات','داخلية وخارجية','#market','engine'],['parts','قطع الغيار','كتالوج BAHR PARTS','#parts'],['wrench','الورش والخدمات','صيانة وتصليح','#services'],['shield','المعدات والإكسسوارات','إكسسوارات بحرية','#market','acc'],['shield','المتاجر والموردون','أنشطة تجارية','#stores'],['tech','BAHR TECH','مركز فني — قيد التجهيز','#bt']];
HS.set($('#cats'),CATS.map(function(c){return '<a class="cat" href="'+c[3]+'"'+(c[4]?' data-mt="'+c[4]+'"':'')+'>'+ic(c[0])+'<b>'+c[1]+'</b><span>'+c[2]+'</span><em>'+ic('arrow')+'</em></a>'}).join(''),'hz-cr');
$('#cats').addEventListener('click',function(e){var a=e.target.closest('[data-mt]');if(!a)return;e.preventDefault();M.t=a.dataset.mt;if(location.hash==='#market')render();else location.hash='#market'});
var ps=$('#partsSearch');if(ps)ps.addEventListener('submit',function(e){e.preventDefault();var i=this.querySelector('input');FD.q=i?i.value.trim():'';FD.t='parts';if(location.hash==='#find')FD.page('#find');else location.hash='#find'});
$('#search').addEventListener('submit',function(e){e.preventDefault();var i=this.querySelector('input');FD.q=i?i.value.trim():'';if(location.hash==='#find')FD.page('#find');else location.hash='#find'});
var nav=$('#nav'),mb=$('#menuBtn');function menu(o){nav.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.innerHTML=ic(o?'close':'menu')}
mb.addEventListener('click',function(){menu(!nav.classList.contains('open'))});nav.addEventListener('click',function(e){if(e.target.closest('a'))menu(false)});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){menu(false);mb.focus()}});document.addEventListener('click',function(e){if(nav.classList.contains('open')){var pth=e.composedPath?e.composedPath():[];if(pth.indexOf(nav)<0&&pth.indexOf(mb)<0)menu(false)}});window.addEventListener('hashchange',function(){menu(false)});window.addEventListener('resize',function(){if(innerWidth>980)menu(false)});
var tt;function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},2800)}

/* ===== B4: السوق (بيانات تجريبية في الواجهة فقط) ===== */
var PX=function(i){return 'https://images.pexels.com/photos/'+i+'/pexels-photo-'+i+'.jpeg?auto=compress&cs=tinysrgb&w=900'};
var TY={boat:'القوارب',jetski:'الجت سكي',engine:'المحركات',parts:'قطع الغيار',acc:'الإكسسوارات'};
var DEMO_ITEMS=[
{id:1,t:'jetski',n:'جت سكي أبيض بخطوط رمادية',p:12500,pv:'البصرة',c:'مستعمل',img:['hero1.jpg'],d:'إعلان تجريبي لعرض شكل البطاقة والتفاصيل.'},
{id:2,t:'jetski',n:'جت سكي أخضر وأبيض',p:9800,pv:'البصرة',c:'مستعمل',img:['hero2.jpg'],d:'إعلان تجريبي لعرض شكل البطاقة والتفاصيل.'},
{id:3,t:'jetski',n:'جت سكي للنزهة',p:11200,pv:'ذي قار',c:'جديد',img:[PX(18636560)],d:'إعلان تجريبي لعرض شكل البطاقة والتفاصيل.'},
{id:4,t:'jetski',n:'جت سكي رياضي',p:13900,pv:'بغداد',c:'جديد',img:[PX(29867681)],d:'إعلان تجريبي لعرض شكل البطاقة والتفاصيل.'},
{id:5,t:'boat',n:'قارب سريع',p:18000,pv:'الزبير',c:'مستعمل',img:[PX(32408246)],d:'إعلان تجريبي لعرض شكل البطاقة والتفاصيل.'},
{id:6,t:'boat',n:'قارب راسٍ على ضفة النهر',p:7500,pv:'ميسان',c:'مستعمل',img:[PX(38102883)],d:'إعلان تجريبي لعرض شكل البطاقة والتفاصيل.'},
{id:7,t:'engine',n:'محرك خارجي مثبت على قارب',p:6400,pv:'البصرة',c:'مستعمل',img:[PX(7386238)],d:'إعلان تجريبي لعرض شكل البطاقة والتفاصيل.'},
{id:8,t:'engine',n:'محرك Johnson خارجي',m:'Johnson',p:2200,pv:'البصرة',c:'مستعمل',img:[PX(32967413)],d:'إعلان تجريبي لعرض شكل البطاقة والتفاصيل.'},
{id:9,t:'parts',n:'قطع غيار محركات (مثال)',p:350,pv:'الزبير',c:'جديد',img:[],d:'إعلان تجريبي. صورة المنتج غير متوفرة بعد.'},
{id:10,t:'acc',n:'سترة نجاة (مثال)',p:45,pv:'بغداد',c:'جديد',img:[],d:'إعلان تجريبي. صورة المنتج غير متوفرة بعد.'}];
var B61={cats:[],loaded:false,inact:{},files:[],keep:[],dirty:false,t:null,act:function(k){return !B61.inact[k]}};var ITEMS=[];var M={t:'',st:'load'},E=function(i){return document.getElementById(i)},fm=function(n,c){return c==='IQD'?n.toLocaleString('en-US')+' د.ع':'$ '+n.toLocaleString('en-US')};
function opts(el,arr){arr.forEach(function(v){var o=document.createElement('option');o.textContent=v;el.appendChild(o)})}
function uniq(k){return ITEMS.map(function(x){return x[k]}).filter(function(v,i,a){return v&&a.indexOf(v)===i})}
function fill(el,a){while(el.options.length>1)el.remove(1);opts(el,a)}
function refM(){var pv=E('pv'),mf=E('mf'),pk=pv.value,mk=mf.value;fill(pv,PVM);pv.value=pk;fill(mf,uniq('m'));if(mk&&![].some.call(mf.options,function(o){return o.value===mk}))opts(mf,[mk]);mf.value=mk}
function emp(st,n,w){return st==='error'?'تعذّر تحميل '+w+' الآن. تحقق من الاتصال ثم اضغط «إعادة المحاولة».<br><button class="btn btn-p" type="button" data-hretry="1" style="margin-top:10px">إعادة المحاولة</button>':st==='load'?'جارٍ تحميل '+w+'…':n?'لا توجد نتائج مطابقة. جرّب تغيير التصفية.':st==='live'?'لا توجد '+w+' منشورة بعد.':'لا توجد نتائج.'}
function tabs(){E('tabs').innerHTML=[['','الكل']].concat(Object.keys(TY).map(function(k){return[k,TY[k]]})).map(function(a){return '<button type="button" data-t="'+a[0]+'" class="'+(M.t===a[0]?'on':'')+'">'+a[1]+'</button>'}).join('')}
function thumb(x){return x.img.length?'<img src="'+x.img[0]+'" alt="'+x.n+'" loading="lazy" decoding="async" onerror="this.remove()">':ic(x.t==='engine'?'engine':x.t==='boat'?'boat':x.t==='jetski'?'jetski':x.t==='parts'?'parts':'shield')+'<span>الصورة غير متوفرة</span>'}
/* ===== B47: البحث والاكتشاف — الفلاتر والترتيب والترقيم تُنفَّذ في استعلامات Supabase (RLS يبقى هو الحماية الفعلية) ===== */
var PVM=['بغداد','البصرة','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var S47={n:0,pg:0,per:12,tot:null,key:'',ok:false,hp:false,pb:false,core:false,busy:false,shown:{}},
 U47=['t','q','pv','cd','mf','md','p1','p2','cu','y1','y2','hp','so'],
 SEL47='id,category,title,description,price,currency,condition,province,area,manufacturer,model,year,created_at,listing_images(storage_path,sort_order)';
var cat47=function(k){return k==='acc'?'accessory':k};
/* توحيد الكتابة: حذف التشكيل والتطويل، وتحويل الأرقام الهندية، والحروف المتقاربة (ا أ إ آ / ى ي / ة ه) إلى محرف بديل _ في ilike؛ وإزالة محارف تكسر صيغة or() */
function w47(s){return String(s||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[%,()*\\"'_:]/g,' ').replace(/[أإآاٱ]/g,'_').replace(/[ىيئ]/g,'_').replace(/[ةه]/g,'_').replace(/\s+/g,' ').trim().slice(0,120)}
function s47(c,f,from,to,core){core=core||S47.core;
 var q=c.from('listings').select(SEL47,{count:'exact'}).eq('status','published');
 if(f.t)q=q.eq('category',cat47(f.t));
 if(f.pv)q=q.eq('province',f.pv);
 if(f.cd)q=q.eq('condition',f.cd);
 if(f.mf)q=q.eq('manufacturer',f.mf);
 var md=w47(f.md);if(md)q=q.or('model.ilike.%'+md+'%,title.ilike.%'+md+'%');
 if(f.p1!==''&&f.p1!=null&&isFinite(f.p1))q=q.gte('price',Number(f.p1));
 if(f.p2!==''&&f.p2!=null&&isFinite(f.p2))q=q.lte('price',Number(f.p2));
 if((f.p1||f.p2)&&f.cu)q=q.eq('currency',f.cu);
 if(f.y1&&isFinite(f.y1))q=q.gte('year',Number(f.y1));if(f.y2&&isFinite(f.y2))q=q.lte('year',Number(f.y2));
 if(f.hp&&isFinite(f.hp)&&S47.hp)q=q.gte('hp_num',Number(f.hp));
 w47(f.q).split(' ').filter(function(t){return t.replace(/_/g,'').length>0}).slice(0,5).forEach(function(t){
  var o=['title','manufacturer','model'].concat(core?[]:['serial_number','specs->>part_number']).map(function(k){return k+'.ilike.%'+t+'%'});
  if(/^\d{4}$/.test(t)&&t>=1950&&t<=2100)o.push('year.eq.'+t);q=q.or(o.join(','))});
 q=f.so==='a'?q.order('price',{ascending:true}):f.so==='d'?q.order('price',{ascending:false}):q.order('created_at',{ascending:false});
 return q.order('id').range(from,to).then(function(r){
  if(r.error){if(!core&&(r.error.code==='42703'||r.error.code==='PGRST100')){S47.core=true;return s47(c,f,from,to,true)}throw r.error}
  var pub=function(p){return ex(c.storage.from('listing-images').getPublicUrl(p).data.publicUrl)};
  var d=(r.data||[]).map(function(x){return{id:ex(x.id),t:x.category==='accessory'?'acc':x.category,n:ex(x.title),p:Number(x.price),cur:x.currency,pv:ex(x.province),ar:ex(x.area),c:x.condition==='new'?'جديد':'مستعمل',m:ex(x.manufacturer),mo:ex(x.model),y:x.year||'',d:ex(x.description),dt:x.created_at,img:(x.listing_images||[]).slice().sort(function(i,j){return i.sort_order-j.sort_order}).map(function(i){return pub(i.storage_path)})}});
  d.forEach(function(x){if(!ITEMS.some(function(i){return i.id===x.id}))ITEMS.push(x)});/* ليعمل فتح التفاصيل #p-id لنتائج خارج أول 200 */
  return{n:r.count==null?null:r.count,d:d}})}
function d47(s){var t=new Date(s);return isNaN(t)?'':t.toLocaleDateString('ar-IQ-u-nu-latn',{year:'numeric',month:'short',day:'numeric'})}
function f47(){var v=function(i){return E(i).value.trim()},yo=E('yrw').style.display!=='none',ho=E('hpw').style.display!=='none';
 return{t:M.t||'',q:v('q'),pv:v('pv'),cd:{'جديد':'new','مستعمل':'used'}[v('cd')]||'',mf:v('mf'),md:v('md'),p1:v('p1'),p2:v('p2'),cu:(v('p1')||v('p2'))?v('cu'):'',y1:yo?v('y1'):'',y2:yo?v('y2'):'',hp:ho?v('hp'):'',so:v('so')}}
function u47(f){var p=new URLSearchParams();U47.forEach(function(k){if(f[k])p.set(k,f[k])});var s=p.toString();try{history.replaceState(null,'',location.pathname+(s?'?'+s:'')+location.hash)}catch(e){}}
function vis47(){var t=M.t,y=E('yrw'),h=E('hpw');if(y)y.style.display=(t==='parts'||t==='acc')?'none':'';if(h)h.style.display=(S47.hp&&(t==='boat'||t==='jetski'||t==='engine'))?'':'none'}
function pr47(c){if(S47.pb)return;S47.pb=true;/* هل أُنشئ العمود hp_num (b47_search.sql)؟ لا يظهر فلتر القدرة إلا إذا نجح الفحص */
 c.from('listings').select('hp_num').limit(1).then(function(r){S47.hp=!r.error;vis47();if(S47.hp&&E('hp').value)render(true)},function(){})}
function cd47(x){var dt=d47(x.dt);return '<article class="mc"><div class="thumb">'+thumb(x)+B11.heart(x.id)+'</div><div class="cb"><h3>'+x.n+'</h3><div class="price">'+fm(x.p,x.cur)+'</div><div class="meta"><span>'+ic('pin')+x.pv+(x.ar?'، '+x.ar:'')+'</span><span class="cond">'+x.c+'</span></div>'+(dt?'<div class="uc-s">نُشر: '+dt+'</div>':'')+'<button class="btn" data-id="'+x.id+'" style="min-height:44px">عرض التفاصيل</button></div></article>'}
function mm47(rem){var b=E('mm47');if(!b){b=document.createElement('button');b.id='mm47';b.type='button';b.className='btn btn-p';b.style.cssText='display:none;margin:18px auto;min-height:44px';E('mg').insertAdjacentElement('afterend',b)}b.disabled=false;b.style.display=rem>0?'block':'none';b.textContent='عرض المزيد'+(rem>0&&rem<1e6?' ('+rem+' متبقٍ)':'')}
function err47(e){S47.ok=false;E('mg').innerHTML='<div class="empty">تعذّر الاتصال بقاعدة البيانات، ولا تُعرض بيانات بديلة. <br><button class="btn btn-p" type="button" data-r47="1" style="margin-top:10px;min-height:44px">إعادة المحاولة</button></div>';E('cnt2').textContent='';mm47(0);try{console.error('B47',e&&(e.code||''),e&&(e.message||e))}catch(_){}}
function add47(L,first,more){var g=E('mg'),h=L.filter(function(x){return!S47.shown[x.id]}).map(function(x){S47.shown[x.id]=1;return cd47(x)}).join(''),sh=Object.keys(S47.shown).length,f=JSON.parse(S47.key);
 if(first)g.innerHTML=h||'<div class="empty">'+((f.q||f.pv||f.cd||f.mf||f.md||f.p1||f.p2||f.y1||f.y2||f.hp||f.t)?'لا توجد نتائج مطابقة'+(f.q?' لـ «'+ex(f.q)+'»':'')+'. جرّب كلمة أخرى أو اضغط «مسح التصفية».':'لا توجد إعلانات منشورة بعد.')+'</div>';else g.insertAdjacentHTML('beforeend',h);
 E('cnt2').textContent=(S47.tot==null?'تم عرض '+sh+' نتيجة':'عدد النتائج: '+S47.tot+(sh<S47.tot?' (المعروض '+sh+')':''))+(f.so?' — الترتيب بالسعر يقارن الأرقام كما أُدخلت دون تحويل بين الدولار والدينار':'');
 mm47(S47.tot==null?(more&&L.length===S47.per?1e6:0):Math.max(0,S47.tot-sh))}
function render(force){var f=f47(),key=JSON.stringify(f);tabs();vis47();u47(f);
 if(force!==true&&key===S47.key&&S47.ok)return;
 S47.key=key;S47.ok=false;S47.pg=0;S47.shown={};var n=++S47.n,c=sbc();
 E('mg').innerHTML='<div class="empty">جارٍ البحث…</div>';E('cnt2').textContent='جارٍ البحث…';mm47(0);
 if(!c){err47({message:'no-client'});return}
 pr47(c);
 s47(c,f,0,S47.per-1).then(function(r){if(n!==S47.n)return;S47.ok=true;S47.tot=r.n;add47(r.d,true,true)}).catch(function(e){if(n!==S47.n)return;err47(e)})}
function more47(){var c=sbc();if(!c||S47.busy||!S47.ok)return;S47.busy=true;var b=E('mm47'),n=S47.n,pg=S47.pg+1;b.disabled=true;b.textContent='جارٍ التحميل…';
 s47(c,JSON.parse(S47.key),pg*S47.per,pg*S47.per+S47.per-1).then(function(r){S47.busy=false;if(n!==S47.n)return;S47.pg=pg;if(r.n!=null)S47.tot=r.n;add47(r.d,false,true)}).catch(function(){S47.busy=false;b.disabled=false;b.textContent='تعذّر التحميل، أعد المحاولة'})}
document.addEventListener('click',function(e){if(e.target.closest('#mm47'))more47();else if(e.target.closest('[data-r47]'))render(true)});
/* ===== B14: تفاصيل الإعلان (معرض + 3D اختياري حقيقي + قطع الغيار + مشاركة وإبلاغ) ===== */
var G={a:[],i:0,x:null};
var MV=null;
function g14bad(im){var p=im.parentNode;im.remove();if(p&&!p.querySelector('.g14e'))p.insertAdjacentHTML('beforeend','<span class="g14e">تعذّر تحميل هذه الصورة</span>')}
window.g14bad=g14bad;
function g14set(i){var n=G.a.length;if(!n)return;G.i=(i+n)%n;var m=E('gm');if(m){var z=m.querySelector('.g14z');if(z){var old=z.querySelector('.g14e');if(old)old.remove();var im=z.querySelector('img');if(!im){im=document.createElement('img');im.setAttribute('decoding','async');im.setAttribute('onerror','g14bad(this)');z.appendChild(im)}im.alt=(G.x&&G.x.n?G.x.n+' — ':'')+'صورة '+(G.i+1)+' من '+n;im.src=G.a[G.i]}var c=E('gc');if(c)c.textContent=(G.i+1)+' / '+n;[].forEach.call(document.querySelectorAll('.g14t button'),function(b,k){b.classList.toggle('on',k===G.i);if(k===G.i)b.scrollIntoView({block:'nearest',inline:'nearest'})})}
 if(n>1){[(G.i+1)%n,(G.i-1+n)%n].forEach(function(k){var pi=new Image();pi.src=G.a[k]})}
 var l=E('lb');if(l&&!l.hidden){var li=l.querySelector('.lbs img'),le=l.querySelector('.lbe');if(le)le.remove();li.style.display='';li.onerror=function(){li.style.display='none';l.querySelector('.lbs').insertAdjacentHTML('beforeend','<div class="lbe">تعذّر تحميل هذه الصورة</div>')};li.src=G.a[G.i];l.classList.remove('z');E('lbc').textContent=(G.i+1)+' / '+n;[].forEach.call(l.querySelectorAll('[data-g="next"],[data-g="prev"]'),function(b){b.hidden=n<2});E('lbc').hidden=n<2}}
function g14swipe(){var m=E('gm');if(!m||G.a.length<2)return;var sx=0,sy=0,sw=false;m.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;sw=false},{passive:true});m.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){sw=true;g14set(G.i+(dx<0?1:-1))}},{passive:true});m.addEventListener('click',function(e){if(sw){e.stopPropagation();e.preventDefault();sw=false}},true)}
function lbOpen(){if(!G.a.length)return;var l=E('lb');if(!l){l=document.createElement('div');l.id='lb';l.hidden=true;l.setAttribute('role','dialog');l.setAttribute('aria-modal','true');l.setAttribute('aria-label','معرض الصور');
 l.innerHTML='<div class="lbs"><img alt=""></div><div class="lbt"><button type="button" data-g="close" aria-label="سدّ">'+ic('close')+'</button><button type="button" data-g="next" aria-label="التالية">‹</button><span id="lbc"></span><button type="button" data-g="prev" aria-label="السابقة">›</button><button type="button" data-g="zoom" aria-label="تكبير أو تصغير">+</button></div>';document.body.appendChild(l);
 var sx=0;l.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});l.addEventListener('touchend',function(e){if(l.classList.contains('z'))return;var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>60)g14set(G.i+(d<0?1:-1))},{passive:true})}
 l.hidden=false;l.classList.remove('z');g14set(G.i);l.querySelector('.lbs img').onclick=function(){l.classList.toggle('z')};l.querySelector('[data-g="close"]').focus()}
function lbClose(){var l=E('lb');if(l)l.hidden=true}
window.addEventListener('keydown',function(e){var l=E('lb');if(!l||l.hidden)return;if(e.key==='Escape'){e.stopImmediatePropagation();lbClose();return}if(e.key==='ArrowLeft')g14set(G.i+1);if(e.key==='ArrowRight')g14set(G.i-1)},true);
var CT14={'engine':1,'jetski':1,'boat':1};
function parts14(x){var rows=[['الشركة المصنعة',x.m],['الموديل',x.mo],['سنة الصنع',x.y],['رقم المحرك أو الرقم التسلسلي',x.sn]],miss=rows.filter(function(r){return !r[1]}).map(function(r){return r[0]});
 return '<div class="g14s" id="g14p"><h3>اعرف قطع الغيار المناسبة</h3><table class="sp">'+rows.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+(r[1]||'مو مذكور بالإعلان')+'</td></tr>'}).join('')+'</table>'+
 '<div class="sel"><b>دليل القطع المتوافقة:</b> مو جاهز لحد هسه. ما بعد اكو قاعدة بيانات قطع موثّقة بالمنصة، وما راح نكتب توافق قطعة مع هذي المعدة إلا لما يكون مثبت من مصدر موثوق (دليل الشركة أو الوكيل).</div>'+
 (miss.length?'<p>البيانات الناقصة: '+miss.join('، ')+'. كل ما تكتمل البيانات يصير التحقق أدق.</p>':'')+
 '<div class="g14b"><button class="btn" type="button" disabled>دليل القطع (مو جاهز)</button><button class="btn btn-p" type="button" data-a14="preq" style="background:var(--b);color:#fff">ما لگيت القطعة؟ اطلبها من بحر</button></div></div>'}
function sim14(x){var pr=function(i){return isFinite(i.p)&&i.p>0},sc=function(i){var s=0;if(x.m&&i.m===x.m)s+=3;if(x.mo&&i.mo===x.mo)s+=2;if(pr(x)&&pr(i)&&i.cur===x.cur&&Math.abs(i.p-x.p)<=x.p*.3)s+=2;if(x.pv&&i.pv===x.pv)s+=1;return s};
 var l=ITEMS.filter(function(i){return i.t===x.t&&i.id!=x.id}).map(function(i){return{i:i,s:sc(i)}}).sort(function(a,b){return b.s-a.s}).slice(0,8).map(function(o){return o.i});
 return '<div class="g14s"><h3>قد يعجبك أيضاً</h3>'+(l.length?'<div class="g14sim">'+l.map(function(i){return '<a href="#p-'+i.id+'">'+(i.img.length?'<img src="'+i.img[0]+'" alt="" loading="lazy" decoding="async" onerror="this.remove()">':'<div class="ph0">'+ic(i.t==='acc'?'shield':i.t)+'</div>')+'<b>'+i.n+'</b><span>'+(pr(i)?fm(i.p,i.cur):'')+'</span></a>'}).join('')+'</div>':'<p class="g29e">لا توجد إعلانات مشابهة منشورة حالياً.</p>')+'</div>'}
var F29={boat:[['الطول',['length_m','boat_length','length'],' م'],['المادة / الهيكل',['hull_material','hull_type','material']],['عدد الأشخاص',['capacity','passengers','seats','max_persons']],['المحرك',['engine_info','engine','engine_model']]],jetski:[['ساعات التشغيل',['engine_hours','hours','operating_hours']],['المحرك',['engine_info','engine','engine_model']]],engine:[['القدرة (حصان)',['horsepower','hp','power_hp']],['نوع الوقود',['fuel_type','fuel']],['عدد الأشواط',['strokes','stroke_count','stroke']],['ساعات التشغيل',['engine_hours','hours','operating_hours']]]};
/* B29: رأس الإعلان (رقم/تاريخ/حالة/منطقة) ومواصفات حسب النوع؛ تظهر فقط الحقول الموجودة فعلياً في الصف */
function x29(x){var c=sbc();if(!c||M.st!=='live')return;var S={published:'منشور',pending:'بانتظار المراجعة',sold:'مباع'};
 c.from('listings').select('created_at,area,status').eq('id',x.id).maybeSingle().then(function(r){if(r.error||!r.data||G.x!==x)return;var d=r.data,h=E('g29h'),a=['رقم الإعلان: <bdi dir="ltr">'+ex(String(x.id).slice(0,8))+'</bdi>'];
  if(d.created_at){try{a.push('نُشر: '+new Date(d.created_at).toLocaleDateString('ar-IQ',{year:'numeric',month:'long',day:'numeric'}))}catch(e){}}
  if(d.status)a.push('الحالة: '+(S[d.status]||ex(d.status)));
  if(h)h.innerHTML=a.map(function(s){return '<span>'+s+'</span>'}).join('');
  var t=E('g14sp');if(d.area&&t)t.insertAdjacentHTML('beforeend','<tr><td>المنطقة</td><td>'+ex(d.area)+'</td></tr>')}).catch(function(){});
 var f=F29[x.t];if(!f)return;
 c.from('listings').select('*').eq('id',x.id).maybeSingle().then(function(r){if(r.error||!r.data||G.x!==x)return;var d=r.data,o=[d].concat(['specs','attributes','details'].map(function(k){return d[k]}).filter(function(q){return q&&typeof q==='object'})),h='';
  f.forEach(function(s){var v='';o.some(function(q){return s[1].some(function(k){var z=q[k];if(z!=null&&z!==''&&typeof z!=='object'){v=String(z);return true}})});if(v)h+='<tr><td>'+s[0]+'</td><td>'+ex(v)+(s[2]||'')+'</td></tr>'});
  var t=E('g14sp');if(t&&h)t.insertAdjacentHTML('beforeend',h)}).catch(function(){})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-a29]'),d=E('g29d');if(!b||!d)return;b.textContent=d.classList.toggle('open')?'عرض أقل':'عرض المزيد'});
function detail(id){
  var x=ITEMS.filter(function(i){return i.id==id})[0];if(!x)return;G.x=x;G.a=x.img.slice();G.i=0;
  var rows=[['النوع',TY[x.t]],['الحالة',x.c],['الموقع',x.pv]];if(x.m)rows.push(['الشركة المصنعة',x.m]);if(x.mo)rows.push(['الموديل',x.mo]);if(x.y)rows.push(['سنة الصنع',x.y]);
  var n=G.a.length,gal='<div class="gal"><div class="g14m" id="gm">'+(n?'<button class="g14z" type="button" data-g="open" aria-label="كبّر الصورة"><img src="'+G.a[0]+'" alt="'+x.n+' — صورة 1 من '+n+'" decoding="async" fetchpriority="high" onerror="g14bad(this)"></button>'+(n>1?'<button class="g14a g14n" type="button" data-g="next" aria-label="التالية">'+ic('arrow')+'</button><button class="g14a g14p" type="button" data-g="prev" aria-label="السابقة">'+ic('arrow')+'</button>':'')+''+(n>1?'<span class="g14c" id="gc">1 / '+n+'</span>':''):ic(x.t==='acc'?'shield':x.t)+'<span>ماكو صورة للمنتج لحد هسه</span>')+'</div>'+(n>1?'<div class="g14t">'+G.a.map(function(u,k){return '<button type="button" data-gi="'+k+'" class="'+(k?'':'on')+'" aria-label="صورة '+(k+1)+' من '+n+'"><img src="'+u+'" alt="" loading="lazy" decoding="async" onerror="this.parentNode.classList.add(\'bad\')"></button>'}).join('')+'</div>':'')+'<div id="g14d"></div></div>';
  E('dw').innerHTML='<button class="x" id="cl" aria-label="سدّ">'+ic('close')+'</button><div class="dg">'+gal+'<div>'+(M.st==='demo'?'<span class="cond">إعلان تجريبي</span>':'')+'<h2>'+x.n+'</h2><div class="price">'+fm(x.p,x.cur)+'</div><div class="g29h" id="g29h"></div>'+(x.d?'<div class="dsc" id="g29d" dir="auto">'+x.d+'</div><button class="btn" type="button" id="g29m" data-a29="more" hidden style="color:var(--b);border-color:var(--b)">عرض المزيد</button>':'')+'<table class="sp" id="g14sp">'+rows.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>'}).join('')+'</table>'+
   '<div class="g14b">'+B11.heart(x.id,0,1)+'<button class="btn" type="button" data-a14="share">شارك الإعلان</button><button class="btn" type="button" data-a14="rep">بلّغ عن الإعلان</button></div><div id="g14rp"></div>'+
   (M.st==='demo'?'<div class="sel"><b>البائع:</b> بائع تجريبي (مو حقيقي)</div><button class="btn go" id="ct" type="button" disabled>التواصل غير متاح في العرض التجريبي</button>':'<div class="sel">التواصل المباشر وي البائع مو متوفر لحد هسه. إذا البائع مفعّل رقمه راح تلگاه ببطاقة البائع.</div>')+'</div>'+
   (CT14[x.t]?parts14(x):'')+sim14(x)+'</div>';
  E('dt').classList.add('on');document.body.style.overflow='hidden';E('cl').focus();g14swipe();var dd=E('g29d'),dm=E('g29m');if(dd&&dm&&dd.scrollHeight>dd.clientHeight+4)dm.hidden=false;x29(x);
  if(M.st==='live'){B10.attach(x.id);if(window.B52&&B52.view)B52.view(x.id);var c=sbc();if(c)c.from('listings').select('model_3d_url,serial_number').eq('id',x.id).maybeSingle().then(function(r){if(r.error||!r.data||G.x!==x)return;var d=r.data;
    if(d.serial_number){x.sn=ex(d.serial_number);var t=E('g14sp');if(t)t.insertAdjacentHTML('beforeend','<tr><td>الرقم التسلسلي</td><td dir="ltr">'+x.sn+'</td></tr>');var p=E('g14p');if(p)p.outerHTML=parts14(x)}
    var u=String(d.model_3d_url||'');if(/^https:\/\/[^\s"'<>]+\.(glb|gltf)(\?[^\s"'<>]*)?$/i.test(u)){x.m3=u;var g=E('g14d');if(g)g.innerHTML='<div class="g14b"><button class="btn" type="button" data-a14="m3d" style="background:var(--nav);color:#fff">شوف المجسّم 3D (يتحمّل لما تضغط)</button></div>'}}).catch(function(){})}
}
function m3d(){var x=G.x,g=E('g14d');if(!x||!x.m3||!g)return;g.innerHTML='<p class="hmeta" id="g14ms">جاي يتحمّل المجسّم… يمكن ياخذ شوية على النت الضعيف.</p>';
 var show=function(){g.innerHTML='<model-viewer class="g14v" src="'+encodeURI(x.m3)+'" alt="مجسّم ثلاثي الأبعاد: '+x.n.replace(/"/g,'')+'" camera-controls touch-action="pan-y" auto-rotate shadow-intensity="1"></model-viewer><p class="hmeta">دوّر بإصبعك أو الماوس، وكبّر وصغّر بالقرص أو العجلة. هذا مجسّم رفعه صاحب الإعلان.</p>';var v=g.querySelector('model-viewer');v.addEventListener('error',function(){g.innerHTML='<p class="pmsg er">ما گدرنا نحمّل المجسّم. كمّل بالصور.</p>'})};
 if(window.customElements&&customElements.get('model-viewer')){show();return}
 if(!MV){MV=document.createElement('script');MV.type='module';MV.src='https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js';document.head.appendChild(MV)}
 MV.addEventListener('error',function(){g.innerHTML='<p class="pmsg er">ما گدرنا نحمّل عارض 3D. كمّل بالصور.</p>'});
 customElements.whenDefined('model-viewer').then(show)}
function share14(){var x=G.x,u=location.href;if(navigator.share){navigator.share({title:x.n,url:u}).catch(function(){})}else if(navigator.clipboard){navigator.clipboard.writeText(u).then(function(){toast('انسخ الرابط')},function(){toast('ما گدرنا ننسخ الرابط')})}else toast(u)}
function rep14(){var b=E('g14rp');if(b.innerHTML){b.innerHTML='';return}
 b.innerHTML='<div class="g14r"><label>سبب البلاغ<select id="rp-r">'+[['scam','احتيال أو نصب'],['wrong_info','سعر أو معلومات مضلِّلة'],['fake','إعلان مكرر أو وهمي'],['wrong_info','الصور مو تخص المنتج'],['prohibited','محتوى ممنوع'],['other','غير ذلك']].map(function(r){return '<option value="'+r[0]+'">'+r[1]+'</option>'}).join('')+'</select></label><label>تفاصيل (اختياري)<textarea id="rp-d" maxlength="1000"></textarea></label><button class="btn btn-p" type="button" data-a14="rsend" style="background:var(--b);color:#fff">ارسل البلاغ</button><div class="pmsg" id="rp-m" role="status"></div></div>'}
function rsend(btn){var m=E('rp-m'),x=G.x;var say=function(t,k){m.className='pmsg '+k;m.textContent=t};
 if(M.st!=='live'){say('هذا إعلان تجريبي، ما ينبلّغ عنه.','er');return}
 if(!AU.user){NEXT='سجّل دخولك حتى تگدر تبلّغ عن إعلان.';location.hash='#login';return}
 try{if(localStorage.getItem('bahr_rp_'+x.id)){say('سبق أن أرسلت بلاغاً عن هذا الإعلان من هذا الجهاز.','er');return}}catch(e){}var c=sbc();if(!c){say('الخدمة مو جاهزة هسه.','er');return}btn.disabled=true;
 c.from('reports').insert({listing_id:x.id,reason:E('rp-r').value,details:((E('rp-r').selectedOptions[0]||{}).textContent||'')+(E('rp-d').value.trim()?' — '+E('rp-d').value.trim():'')}).then(function(r){btn.disabled=false;
  if(r.error){say('ما انحفظ البلاغ ('+PF.err.msg(r.error)+'). تگدر تبعثه من صفحة تواصل معنا.','er');window.BAHR_PF={s:'بلاغ عن إعلان',m:'رابط الإعلان: '+location.href+'\nالسبب: '+E('rp-r').value};return}
  say('انحفظ بلاغك وراح تراجعه الإدارة. شكراً.','ok');try{localStorage.setItem('bahr_rp_'+x.id,'1')}catch(e){}btn.remove()}).catch(function(){btn.disabled=false;say('انقطع الاتصال. حاول مرة ثانية.','er')})}
document.addEventListener('click',function(e){var g=e.target.closest('[data-g]'),a=e.target.closest('[data-a14]'),t=e.target.closest('[data-gi]');
 if(t){g14set(+t.dataset.gi);return}
 if(g){var k=g.dataset.g;if(k==='open')lbOpen();else if(k==='close')lbClose();else if(k==='next')g14set(G.i+1);else if(k==='prev')g14set(G.i-1);else if(k==='zoom')E('lb').classList.toggle('z');return}
 if(a){var k2=a.dataset.a14;if(k2==='share')share14();else if(k2==='rep')rep14();else if(k2==='rsend')rsend(a);else if(k2==='m3d')m3d();else if(k2==='preq'){var x=G.x||{};window.BAHR_RP={e:({engine:'marine_engine',jetski:'jetski',boat:'boat'})[x.t]||'',m:x.m||'',mo:x.mo||'',y:x.y||'',sn:x.sn||'',d:'الإعلان: '+x.n+'\nالقطعة المطلوبة: '};lbClose();location.hash='#requestpart'}}});
function closeD(){E('dt').classList.remove('on');document.body.style.overflow='';if(/^#p-/.test(location.hash))history.replaceState(null,'','#market')}

/* ===== B5: الخدمات والورش (بيانات تجريبية في الواجهة فقط) ===== */
var ST={jet:['صيانة وإصلاح الجت سكي','jetski'],engine:['صيانة المحركات البحرية','engine'],diag:['فحص وتشخيص الأعطال','tech'],parts:['توفير وتركيب قطع الغيار','parts'],boat:['صيانة القوارب والمعدات البحرية','boat'],tow:['النقل والسحب البحري','truck'],elec:['كهرباء المعدات البحرية','tech'],fuelcool:['أنظمة الوقود والتبريد','engine'],hull:['الهياكل والألياف الزجاجية','boat'],install:['تركيب الملحقات والتجهيزات','wrench'],other:['خدمات بحرية أخرى','wrench']};
var DEMO_PRV=[
{id:1,n:'ورشة تجريبية للجت سكي',s:['jet'],pv:'البصرة',ar:'العشار',eq:['جت سكي'],img:['hero1.jpg'],d:'مثال لورشة متخصصة بصيانة وإصلاح الجت سكي.'},
{id:2,n:'ورشة تجريبية للمحركات البحرية',s:['engine','diag'],pv:'البصرة',ar:'أبو الخصيب',eq:['محرك خارجي'],img:[PX(32967413)],d:'مثال لورشة صيانة المحركات الخارجية وفحصها.'},
{id:3,n:'فني تجريبي لتشخيص الأعطال',s:['diag'],pv:'ذي قار',ar:'الناصرية',eq:['محرك خارجي','جت سكي'],img:[PX(7386238)],d:'مثال لفني يفحص الأعطال ويقدّر الإصلاح.'},
{id:4,n:'مركز تجريبي لقطع الغيار والتركيب',s:['parts'],pv:'بغداد',ar:'الكرخ',eq:['محرك خارجي'],img:[],d:'مثال لمركز يوفّر قطع الغيار ويركّبها.'},
{id:5,n:'ورشة تجريبية لصيانة القوارب',s:['boat'],pv:'ميسان',ar:'العمارة',eq:['قارب'],img:[PX(38102883)],d:'مثال لورشة صيانة هياكل القوارب ومعداتها.'},
{id:6,n:'مقدم خدمة تجريبي للنقل والسحب',s:['tow'],pv:'البصرة',ar:'الفاو',eq:['قارب','جت سكي'],img:[PX(32408246)],d:'مثال لخدمة نقل وسحب بحري.'},
{id:7,n:'ورشة تجريبية شاملة',s:['jet','engine','parts'],pv:'البصرة',ar:'الزبير',eq:['جت سكي','محرك خارجي'],img:[PX(18636560)],d:'مثال لورشة تقدّم عدة خدمات في مكان واحد.'}];
var PRV=[];var SV={t:'',st:'load'};
function su(f){var o=[];PRV.forEach(function(p){[].concat(p[f]).forEach(function(v){if(o.indexOf(v)<0)o.push(v)})});return o}
function refS(){fill(E('spv'),su('pv'));fill(E('sar'),su('ar'));fill(E('seq'),su('eq'))}
function sth(p){return p.img.length?'<img src="'+p.img[0]+'" alt="'+p.n+'" loading="lazy" decoding="async" onerror="this.remove()">':ic(ST[p.s[0]][1])+'<span>الصورة غير متوفرة</span>'}
function stabs(){E('stabs').innerHTML=[['','الكل','menu']].concat(Object.keys(ST).filter(function(k){return B61.act(k)}).map(function(k){return[k,ST[k][0],ST[k][1]]})).map(function(a){return '<button type="button" data-t="'+a[0]+'" class="'+(SV.t===a[0]?'on':'')+'">'+a[1]+'</button>'}).join('')}
function srender(){
  var q=E('sq').value.trim().toLowerCase(),pv=E('spv').value,ar=E('sar').value,eq=E('seq').value;
  var r=PRV.filter(function(p){return(!SV.t||p.s.indexOf(SV.t)>-1)&&(!pv||p.pv===pv)&&(!ar||p.ar===ar)&&(!eq||p.eq.indexOf(eq)>-1)&&(!q||(p.n+' '+p.d+' '+p.s.map(function(k){return ST[k][0]}).join(' ')).toLowerCase().indexOf(q)>-1)});
  E('scnt').textContent='عدد النتائج: '+r.length;
  E('smg').innerHTML=r.length?r.map(function(p){return '<article class="mc"><div class="thumb">'+sth(p)+(SV.st==='demo'?'<span class="tag">تجريبي</span>':'')+'</div><div class="cb"><h3>'+p.n+'</h3><div class="chips">'+p.s.map(function(k){return '<span class="chip">'+ST[k][0]+'</span>'}).join('')+'</div><div class="meta"><span>'+ic('pin')+p.pv+'، '+p.ar+'</span></div><p class="ds">'+p.d+'</p><button class="btn" data-sid="'+p.id+'">عرض التفاصيل</button></div></article>'}).join(''):'<div class="empty">'+emp(SV.st,PRV.length,'ورش وخدمات')+'</div>';
  stabs();
}
function sdetail(id){
  var p=PRV.filter(function(i){return i.id==id})[0];if(!p)return;
  E('sdw').innerHTML='<button class="x" id="scl" aria-label="إغلاق">'+ic('close')+'</button><div class="dg"><div class="gal"><div class="main">'+sth(p)+'</div></div><div>'+(SV.st==='demo'?'<span class="cond">بيانات تجريبية</span>':'')+'<h2>'+p.n+'</h2><p>'+p.d+(SV.st==='demo'?' هذا الوصف توضيحي ولا يخص جهة حقيقية.':'')+'</p><h3 style="margin:10px 0 4px;font-size:16px">الخدمات</h3><div class="chips">'+p.s.map(function(k){return '<span class="chip">'+ST[k][0]+'</span>'}).join('')+'</div><table class="sp"><tr><td>المحافظة</td><td>'+p.pv+'</td></tr><tr><td>المنطقة</td><td>'+p.ar+'</td></tr><tr><td>المعدات</td><td>'+p.eq.join('، ')+'</td></tr><tr><td>أوقات العمل</td><td>'+(p.h||'غير متوفرة')+'</td></tr><tr><td>وسيلة التواصل</td><td dir="auto">'+(p.ph||'غير متوفرة')+'</td></tr></table>'+(SV.st==='live'?B61.sdExtra(p):'<div class="sel">عند توفر بيانات حقيقية ستظهر وسيلة التواصل المباشر هنا.</div>')+'</div></div>';
  E('sd').classList.add('on');document.body.style.overflow='hidden';E('scl').focus();
}
function closeS(){E('sd').classList.remove('on');document.body.style.overflow='';if(/^#s-/.test(location.hash))history.replaceState(null,'','#services')}
['sq'].forEach(function(i){E(i).addEventListener('input',srender)});['spv','sar','seq'].forEach(function(i){E(i).addEventListener('change',srender)});
E('srs').addEventListener('click',function(){E('sfb').reset();SV.t='';srender()});
E('stabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b){SV.t=b.dataset.t;srender()}});
E('smg').addEventListener('click',function(e){var b=e.target.closest('[data-sid]');if(b)location.hash='#s-'+b.dataset.sid});
E('sd').addEventListener('click',function(e){if(e.target.id==='sd'||e.target.closest('#scl'))closeS()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeS()});

/* ===== B6: الحساب عبر Supabase Auth (مفتاح anon العام فقط) ===== */
var _c,AU={user:null,ready:false,recovery:false},NEXT='',ADH={check:function(){},open:function(){}},B10={profile:function(){},seller:function(){},attach:function(){},reset:function(){}},B11={heart:function(){return''},sync:function(){},page:function(){},reset:function(){}},B12={is:function(){return false},nav:function(){return'i'},page:function(){},reset:function(){}};
var RM={on:function(){try{return localStorage.getItem('bahr_rm')!=='0'}catch(e){return true}},set:function(v){try{localStorage.setItem('bahr_rm',v?'1':'0')}catch(e){}}};
var AST={getItem:function(k){try{return localStorage.getItem(k)||sessionStorage.getItem(k)}catch(e){return null}},setItem:function(k,v){try{if(RM.on()){localStorage.setItem(k,v);sessionStorage.removeItem(k)}else{sessionStorage.setItem(k,v);localStorage.removeItem(k)}}catch(e){}},removeItem:function(k){try{localStorage.removeItem(k);sessionStorage.removeItem(k)}catch(e){}}};
var AUX={MODE:'phone',DOM:'phone.example.com',
 dg:function(x){return String(x||'').replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632}).replace(/[۰-۹]/g,function(d){return d.charCodeAt(0)-1776})},
 np:function(raw){var x=AUX.dg(raw).trim().replace(/[\s\-().]/g,'');if(!x)return '';if(/^00/.test(x))x='+'+x.slice(2);
  if(/^\+?964/.test(x)){x=x.replace(/^\+?964/,'').replace(/^0/,'');return /^7\d{9}$/.test(x)?'+964'+x:''}
  if(/^07\d{9}$/.test(x))return '+964'+x.slice(1);if(/^7\d{9}$/.test(x))return '+964'+x;
  if(/^\+[1-9]\d{7,14}$/.test(x))return x;return ''},
 alias:function(p){return 'p'+p.replace('+','')+'@'+AUX.DOM},
 isAlias:function(e){var t='@'+AUX.DOM;return !!e&&e.length>t.length&&e.slice(-t.length)===t},
 mail:function(u){var m=u&&u.user_metadata||{};return u&&u.email&&!AUX.isAlias(u.email)?u.email:(m.contact_email||'')},
 ph:function(u){var m=u&&u.user_metadata||{};return m.phone||(u&&u.phone?'+'+String(u.phone).replace('+',''):'')},
 acct:function(c){try{return Promise.resolve(c.rpc('my_account')).then(function(r){return r&&!r.error?r.data:null}).catch(function(){return null})}catch(e){return Promise.resolve(null)}},
 types:function(a){var t=[];if(!a)return 'مستخدم';if(a.is_admin)t.push('مدير المنصة');if((a.businesses||[]).length)t.push('صاحب نشاط تجاري');var ms=a.memberships||[];
  if(ms.some(function(m){return m.role==='manager'&&m.status==='active'}))t.push('مدير نشاط');if(ms.some(function(m){return m.role==='staff'&&m.status==='active'}))t.push('موظف نشاط');return t.length?t.join(' · '):'مستخدم'},
 dest:function(c){return AUX.acct(c).then(function(a){return a&&a.is_admin?'#admin':(a&&(a.businesses||[]).length?'#business':'#account')}).catch(function(){return '#account'})},
 cred:function(p,pw){return AUX.MODE==='alias'?{email:AUX.alias(p),password:pw}:{phone:p,password:pw}}};
function sbc(){if(_c)return _c;var cf=window.BAHR_CONFIG||{};if(!window.supabase||!window.supabase.createClient||!cf.supabaseUrl||jwtRole(cf.supabaseAnonKey)!=='anon')return null;
  _c=window.supabase.createClient(cf.supabaseUrl,cf.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storage:AST}});return _c}
function aerr(e){var m=String(e&&e.message||'').toLowerCase(),c=e&&e.code||'',st=e&&e.status;
  if(/failed to fetch|network|load failed/.test(m)||(e&&e.name==='AuthRetryableFetchError'))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت وحاول مرة أخرى.';
  if(c==='invalid_credentials'||m.indexOf('invalid login')>-1)return 'رقم الهاتف أو كلمة المرور غير صحيحة.';
  if(c==='email_not_confirmed'||c==='phone_not_confirmed'||m.indexOf('not confirmed')>-1)return 'الحساب غير مفعّل بعد. تواصل مع الدعم.';
  if(c==='user_already_exists'||c==='phone_exists'||c==='email_exists'||m.indexOf('already registered')>-1)return 'هذا الرقم مسجّل مسبقاً. جرّب تسجيل الدخول.';
  if(c==='phone_provider_disabled'||c==='sms_send_failed'||m.indexOf('unsupported phone provider')>-1)return 'التسجيل برقم الهاتف غير مفعّل على الخادم بعد. تواصل مع الإدارة.';
  if(c==='weak_password'||m.indexOf('password should')>-1)return 'كلمة المرور ضعيفة. استخدم 8 أحرف على الأقل.';
  if(c==='same_password')return 'كلمة المرور الجديدة يجب أن تختلف عن الحالية.';
  if(c==='signup_disabled')return 'إنشاء الحسابات معطّل حالياً.';
  if(st===429||/rate limit/.test(m)||c==='over_email_send_rate_limit')return 'محاولات كثيرة. انتظر قليلاً ثم أعد المحاولة.';
  return 'حدث خطأ غير متوقع. حاول مرة أخرى.'}
function pmsg(k,t,x){var m=document.querySelector('#ap-'+k+' .msg');if(!m)return;m.className='msg'+(t?' '+t:'');m.textContent=x||''}
function ferr(f,id,x){var e=document.querySelector('[data-e="'+id+'"]');if(e)e.textContent=x||'';return !x}
function clr(f){f.querySelectorAll('.fe').forEach(function(e){e.textContent=''})}
function setU(){document.body.dataset.u=AU.user?'1':''}
function guarded(f,k,fn){f.addEventListener('submit',function(e){e.preventDefault();if(f._b)return;clr(f);pmsg(k,'');if(!fn.v())return;
  var c=sbc();if(!c){pmsg(k,'err','تعذّر تحميل خدمة الحساب. حدّث الصفحة وحاول مرة أخرى.');return}
  var b=f.querySelector('button[type=submit]'),t=b.textContent;f._b=true;b.disabled=true;b.textContent='جارٍ التنفيذ…';
  Promise.resolve().then(function(){return fn.run(c)}).catch(function(x){pmsg(k,'err',aerr(x))}).then(function(){f._b=false;b.disabled=false;b.textContent=t})})}
var EM=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,V=function(i){return E(i).value};
guarded(E('f-login'),'login',{v:function(){var ok=1,id=V('l-e').trim();
 if(!id)ok=ferr(0,'l-e','أدخل رقم الهاتف.')&&0;else if(id.indexOf('@')>-1){if(!EM.test(id))ok=ferr(0,'l-e','أدخل بريداً إلكترونياً صحيحاً.')&&0}else if(!AUX.np(id))ok=ferr(0,'l-e','رقم الهاتف غير صحيح. مثال: 07701234567')&&0;
 if(!V('l-p'))ok=ferr(0,'l-p','أدخل كلمة المرور.')&&0;return ok},
 run:function(c){var id=V('l-e').trim(),cr=id.indexOf('@')>-1?{email:id.toLowerCase(),password:V('l-p')}:AUX.cred(AUX.np(id),V('l-p'));RM.set(E('l-r').checked);
  return c.auth.signInWithPassword(cr).then(function(r){if(r.error)throw r.error;E('f-login').reset();toast('تم تسجيل الدخول.');return AUX.dest(c).then(function(h){location.hash=(typeof B22!=='undefined'&&B22.ret&&B22.ret())||h})})}});
guarded(E('f-signup'),'signup',{v:function(){var ok=1,em=V('s-e').trim();
 if(V('s-n').trim().length<2)ok=ferr(0,'s-n','أدخل اسمك (حرفان على الأقل).')&&0;
 if(!V('s-ph').trim())ok=ferr(0,'s-ph','رقم الهاتف مطلوب.')&&0;else if(!AUX.np(V('s-ph')))ok=ferr(0,'s-ph','رقم الهاتف غير صحيح. مثال: 07701234567')&&0;
 if(em&&!EM.test(em))ok=ferr(0,'s-e','البريد الإلكتروني غير صحيح (أو اتركه فارغاً).')&&0;
 if(V('s-p').length<8)ok=ferr(0,'s-p','كلمة المرور 8 أحرف على الأقل.')&&0;
 if(V('s-p2')!==V('s-p'))ok=ferr(0,'s-p2','كلمة المرور غير متطابقة.')&&0;
 if(!E('s-t').checked)ok=ferr(0,'s-t','يجب الموافقة على الشروط وسياسة الخصوصية.')&&0;return ok},
 run:function(c){var p=AUX.np(V('s-ph')),em=V('s-e').trim().toLowerCase(),d={full_name:V('s-n').trim(),phone:p,terms_accepted_at:new Date().toISOString()};if(em)d.contact_email=em;
  var cr=AUX.cred(p,V('s-p'));cr.options={data:d};RM.set(true);
  return c.auth.signUp(cr).then(function(r){
   if(r.error)throw r.error;var u=r.data&&r.data.user;
   if(r.data&&r.data.session){E('f-signup').reset();toast('تم إنشاء الحساب وتسجيل الدخول.');location.hash=(typeof B22!=='undefined'&&B22.ret&&B22.ret())||'#account';return}
   if(u&&u.identities&&u.identities.length===0){pmsg('signup','err','هذا الرقم مسجّل مسبقاً. جرّب تسجيل الدخول.');return}
   pmsg('signup','err','لم يكتمل إنشاء الحساب: الخادم يطلب تأكيد الرقم برسالة، وهذه الميزة غير مفعّلة حالياً. تواصل مع الإدارة.')})}});
guarded(E('f-forgot'),'forgot',{v:function(){return EM.test(V('f-e').trim())||ferr(0,'f-e','أدخل بريداً إلكترونياً صحيحاً.')&&0},
 run:function(c){return c.auth.resetPasswordForEmail(V('f-e').trim().toLowerCase(),{redirectTo:location.origin+location.pathname}).then(function(r){if(r.error)throw r.error;pmsg('forgot','ok','إذا كان البريد مسجّلاً لدينا فسيصلك رابط استعادة كلمة المرور خلال دقائق.')})}});
guarded(E('f-reset'),'reset',{v:function(){var ok=1;if(V('r-p').length<8)ok=ferr(0,'r-p','كلمة المرور 8 أحرف على الأقل.')&&0;if(V('r-p2')!==V('r-p'))ok=ferr(0,'r-p2','كلمة المرور غير متطابقة.')&&0;return ok},
 run:function(c){return c.auth.updateUser({password:V('r-p')}).then(function(r){if(r.error)throw r.error;AU.recovery=false;E('f-reset').reset();toast('تم تغيير كلمة المرور.');location.hash='#account'})}});
document.querySelectorAll('.eye').forEach(function(b){var i=b.previousElementSibling;b.innerHTML=ic('eye');b.addEventListener('click',function(){var h=i.type==='password';i.type=h?'text':'password';b.innerHTML=ic(h?'eyeoff':'eye');b.setAttribute('aria-label',h?'إخفاء كلمة المرور':'إظهار كلمة المرور')})});
function logout(){var c=sbc();if(!c)return;PF.session.manual=true;c.auth.signOut().then(function(r){if(r&&r.error)throw r.error;toast('تم تسجيل الخروج.')}).catch(function(x){PF.session.manual=false;toast(aerr(x))})}
document.addEventListener('click',function(e){var g=e.target.closest('[data-go]');if(g){menu(false);location.hash=g.dataset.go;return}
 var o=e.target.closest('[data-act="logout"]');if(o){e.preventDefault();menu(false);askLogout()}});
/* B78: تأكيد قبل تسجيل الخروج، ثم آلية الخروج الأصلية (Supabase signOut) */
function askLogout(){if(document.querySelector('.b78c'))return;var d=document.createElement('div');d.className='b78c';d.setAttribute('role','alertdialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','تأكيد تسجيل الخروج');d.innerHTML='<div class="b78d"><p>تريد تسجّل الخروج من حسابك؟</p><div><button type="button" class="btn btn-p" data-y>تسجيل الخروج</button><button type="button" class="btn btn-o" data-n>إلغاء</button></div></div>';document.body.appendChild(d);var prev=document.activeElement;function cl(){d.remove();document.removeEventListener('keydown',kd);if(prev&&prev.focus)try{prev.focus()}catch(x){}}function kd(k){if(k.key==='Escape')cl()}document.addEventListener('keydown',kd);d.querySelector('[data-n]').onclick=cl;d.querySelector('[data-y]').onclick=function(){cl();logout();if(location.hash!=='#home')location.hash='#home'};d.onclick=function(k){if(k.target===d)cl()};d.querySelector('[data-n]').focus()}
function showAuth(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-'+k)});
 if(k==='account'){var u=AU.user,md=u.user_metadata||{};E('acc').innerHTML=[['الاسم',ex(md.full_name||'غير مُدخل')],['الهاتف',ex(AUX.ph(u)||'غير مُدخل')],['البريد الإلكتروني',ex(AUX.mail(u)||'غير مُدخل')]].concat(u.email&&!AUX.isAlias(u.email)?[['حالة البريد',u.email_confirmed_at?'مؤكد':'غير مؤكد']]:[]).map(function(r){return '<div class="acc-r"><span>'+r[0]+'</span><span dir="auto">'+r[1]+'</span></div>'}).join('')}
 if(k==='account')E('f-rec').hidden=!(AUX.MODE==='phone'&&u.phone&&!AUX.mail(u));
 if(k==='account'){var c0=sbc(),u0=u;if(c0)AUX.acct(c0).then(function(a){if(!a||!AU.user||u0.id!==AU.user.id)return;
  var old=E('acc').querySelectorAll('.acc-x');for(var i=0;i<old.length;i++)old[i].remove();
  var BS={draft:'مسودة',pending:'قيد المراجعة',approved:'معتمد',rejected:'مرفوض',need_info:'يحتاج معلومات',suspended:'موقوف'},row=function(l,v){return '<div class="acc-r acc-x"><span>'+l+'</span><span dir="auto">'+v+'</span></div>'},h=row('نوع الحساب',AUX.types(a))+row('حالة الحساب',a.status==='suspended'?'موقوف':'نشط');
  (a.businesses||[]).forEach(function(b){h+=row('النشاط: '+ex(b.name||'—'),BS[b.status]||ex(b.status||'—'))});
  if(a.is_admin)h+='<p class="acc-x" style="margin:12px 0 0"><a class="btn" href="#admin">لوحة الإدارة</a></p>';
  if((a.businesses||[]).length)h+='<p class="acc-x" style="margin:12px 0 0"><a class="btn" href="#business">إدارة نشاطي</a></p>';
  E('acc').insertAdjacentHTML('beforeend',h);
  if(a.status==='suspended')pmsg('account','err','حسابك موقوف. تواصل مع الدعم.')})}
 if(k==='account'&&window.B74A)B74A();
 if(NEXT&&k==='login'){pmsg('login','in',NEXT);NEXT=''}}
guarded(E('f-rec'),'account',{v:function(){var e=V('rc-e').trim();return EM.test(e)||ferr(0,'rc-e','أدخل بريداً إلكترونياً صحيحاً.')&&0},
 run:function(c){return c.auth.updateUser({email:V('rc-e').trim().toLowerCase()},{emailRedirectTo:location.origin+location.pathname}).then(function(r){if(r.error)throw r.error;E('f-rec').reset();pmsg('account','ok','أرسلنا رابط تأكيد إلى بريدك. افتحه لإتمام الإضافة.')})}});
function initAuth(){var c=sbc(),done=function(){AU.ready=true;setU();ADH.check();B11.sync();B15.sync();route()};
 if(!c){done();return}
 c.auth.onAuthStateChange(function(ev,ses){var prev=AU.user;AU.user=ses?ses.user:null;if(ev==='PASSWORD_RECOVERY'){AU.recovery=true;location.hash='#reset'}if(ev==='SIGNED_OUT')AU.recovery=false;if(PF.session.onAuth(ev,prev,AU.user))return;done()});
 setTimeout(function(){if(!AU.ready)done()},4000)}
window.addEventListener('load',initAuth);
/* ===== BAHR UI-NAV-1: صفحة «أطلب اللي تحتاجه» — مدخل واحد لصفحات الطلبات الحالية (لا وظائف جديدة ولا تغيير في قاعدة البيانات) ===== */
window.RQH={page:function(){
 document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-rqh')});
 document.title='بحر | أطلب اللي تحتاجه';
 var a=[E('rqhA1'),E('rqhA2')],c=sbc();
 a.forEach(function(x){if(x)x.style.display='none'});
 if(c&&AU.user)c.rpc('is_admin').then(function(r){if(!r.error&&r.data===true)a.forEach(function(x){if(x)x.style.display=''})},function(){})}};
function route(){var h=location.hash,ip=B12.is(h),m=h==='#market'||/^#p-[\w-]+$/.test(h),v=h==='#services'||/^#s-[\w-]+$/.test(h),a=/^#(login|signup|forgot|reset|account|mylistings|newlisting|editlisting-[0-9a-f-]{36}|requestpart|requestservice|myrequests|admreq|request-[0-9a-f-]{36}|parts|part-[0-9a-f-]{36}|bizparts|admbiz|admsvc|biz-[0-9a-f-]{36}|inbox|chat-[0-9a-f-]{36}|business|admparts|packages|admpay|opscenter|savedparts|admpartrep|admcms|faqs|page-[a-z]+|admrisk|support|admsupport|ticket-[0-9a-f-]{36}|buyhub|buynew|buymine|buyboard|buy-[0-9a-f-]{36}|admbuy|requests|bizstats|admstats|admreviews)$/i.test(h),d=h==='#admin',pf=h==='#profile',sl=/^#u-[0-9a-f-]{36}$/i.test(h),uc=/^#(favorites|searches|alerts)$/.test(h),xs=h==='#find'||h==='#stores';
  document.body.dataset.v=ip?'i':m?'m':v?'s':a?'a':d?'d':pf?'f':sl?'u':uc?'c':xs?'x':'';PF.nav.mark(h);
  if(!ip)B12.reset();if(!pf)B10.reset('p');if(!sl)B10.reset('s');if(!uc)B11.reset();
  document.querySelectorAll('[data-n]').forEach(function(x){x.classList.toggle('on',x.dataset.n===(m?'m':v?'s':ip?B12.nav(h):h==='#stores'?'st':/^#(buyhub|buynew|buymine|buyboard|buy-|request|myrequests|bizstats)/.test(h)?'rq':/^#(parts|part-)/.test(h)?'pt':xs?'':'h'))});
  if(!m){E('dt').classList.remove('on')}if(!v){E('sd').classList.remove('on')}if(!m&&!v)document.body.style.overflow='';
  if(xs){FD.page(h);window.scrollTo(0,0);return}
  if(ip){B12.page(h);window.scrollTo(0,0);return}
  if(uc){if(!AU.ready)return;if(!AU.user){NEXT='سجّل الدخول للوصول إلى المفضلة والتنبيهات.';location.hash='#login';return}B11.page(h.slice(1));window.scrollTo(0,0);return}
  if(pf){if(!AU.ready)return;if(!AU.user){NEXT='سجّل الدخول لتعديل ملفك الشخصي.';location.hash='#login';return}B10.profile();window.scrollTo(0,0);return}
  if(sl){B10.seller(h.slice(3));window.scrollTo(0,0);return}
  if(d){if(!AU.ready)return;if(!AU.user){NEXT='سجّل الدخول بحساب المشرف.';location.hash='#login';return}ADH.open();window.scrollTo(0,0);return}
  if(a){var k=h.slice(1),AS;
    if(!AU.ready)k='load';
    else if(k==='requests'){RQH.page();window.scrollTo(0,0);return}
    else if(/^(admbiz|admparts|admreq|admbuy)$/i.test(k)&&AU.user&&(AS=PF.nav.adminState(route))!==true){if(AS===null)showAuth('load');else PF.nav.deny(AS==='err'?'err':'admin');window.scrollTo(0,0);return}
    else if(/^(faqs|page-[a-z]+)$/i.test(k)){B59.page(k);window.scrollTo(0,0);return}
    else if(/^(savedparts|admpartrep)$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول للمتابعة.';location.hash='#login';return}B60.page(k);window.scrollTo(0,0);return}
    else if(/^admcms$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول بحساب المشرف.';location.hash='#login';return}B59.page(k);window.scrollTo(0,0);return}
    else if(/^admrisk$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول بحساب المشرف.';location.hash='#login';return}B58.page();window.scrollTo(0,0);return}
    else if(/^(support|admsupport|ticket-[0-9a-f-]{36})$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول للوصول إلى الدعم.';location.hash='#login';return}B57.page(k);window.scrollTo(0,0);return}
    else if(/^opscenter$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول بحساب المشرف.';location.hash='#login';return}B56.page();window.scrollTo(0,0);return}
    else if(/^(packages|admpay)$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول لإدارة باقاتك.';location.hash='#login';return}B55.page(k);window.scrollTo(0,0);return}
    else if(/^(mylistings|newlisting|editlisting-)/i.test(k)){if(!AU.user){NEXT='سجّل الدخول لإدارة إعلاناتك.';location.hash='#login';return}B17.page(k);window.scrollTo(0,0);return}
    else if(/^(inbox|chat-[0-9a-f-]{36})$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول لعرض رسائلك.';location.hash='#login';return}B22.page(k);window.scrollTo(0,0);return}
    else if(/^biz-[0-9a-f-]{36}$/i.test(k)){B21.page(k);window.scrollTo(0,0);return}
    else if(/^(business|admbiz)$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول لتسجيل نشاطك التجاري أو إدارته.';location.hash='#login';return}B21.page(k);window.scrollTo(0,0);return}
    else if(/^admsvc$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول بحساب المشرف.';location.hash='#login';return}B61.admin();window.scrollTo(0,0);return}
    else if(/^(bizparts|admparts)$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول لإدارة نشاطك التجاري.';location.hash='#login';return}B20.page(k);window.scrollTo(0,0);return}
    else if(/^(parts|part-[0-9a-f-]{36})$/i.test(k)){B19.page(k);window.scrollTo(0,0);return}
    else if(/^bizstats$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول لعرض إحصائيات نشاطك.';location.hash='#login';return}B52.biz();window.scrollTo(0,0);return}
    else if(/^admstats$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول بحساب المشرف.';location.hash='#login';return}B52.adm();window.scrollTo(0,0);return}
    else if(/^admreviews$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول بحساب المشرف.';location.hash='#login';return}B50.page(k);window.scrollTo(0,0);return}
    else if(/^(buyhub|buy-[0-9a-f-]{36})$/i.test(k)){B62.page(k);window.scrollTo(0,0);return}
    else if(/^(buynew|buymine|buyboard|admbuy)$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول لإدارة طلبات الشراء والعروض.';location.hash='#login';return}B62.page(k);window.scrollTo(0,0);return}
    else if(/^(requestpart|requestservice|myrequests|admreq|request-[0-9a-f-]{36})$/i.test(k)){if(!AU.user){NEXT='سجّل الدخول لإرسال الطلبات ومتابعتها.';location.hash='#login';return}B15.page(k);window.scrollTo(0,0);return}
    else if(k==='account'&&!AU.user){NEXT='سجّل الدخول للوصول إلى حسابك.';location.hash='#login';return}
    else if((k==='login'||k==='signup'||k==='forgot')&&AU.user){location.hash='#account';return}
    else if(k==='reset'&&!AU.recovery){location.hash='#forgot';return}
    showAuth(k);window.scrollTo(0,0);return}
  if(m){render();if(h.slice(0,3)==='#p-')detail(h.slice(3));else{E('dt').classList.remove('on');document.body.style.overflow=''}window.scrollTo(0,0)}
  else if(v){srender();if(h.slice(0,3)==='#s-')sdetail(h.slice(3));else{E('sd').classList.remove('on');document.body.style.overflow=''}window.scrollTo(0,0)}}

/* مستمعات السوق (أُعيدت: كانت قد حُذفت بالخطأ في B5) */
var t47;['q','md','p1','p2','y1','y2','hp'].forEach(function(i){E(i).addEventListener('input',function(){clearTimeout(t47);t47=setTimeout(function(){render()},350)})});['pv','cd','mf','so','cu'].forEach(function(i){E(i).addEventListener('change',function(){render()})});
/* B47: استعادة الفلاتر من رابط الصفحة (قيم غير صحيحة تُتجاهل دون تعطيل الصفحة؛ لا بيانات خاصة بالمستخدم في الرابط) */
(function(){var p=new URLSearchParams(location.search),any=false,num=function(v,lo,hi){var n=Number(v);return(v!==null&&v!==''&&isFinite(n)&&n>=lo&&n<=hi)?String(n):''},
 put=function(id,v,sel){if(!v)return;var el=E(id);if(sel&&![].some.call(el.options,function(o){return o.value===v||o.text===v}))opts(el,[v]);el.value=v;any=true};
 fill(E('pv'),PVM);
 var t=p.get('t');if(t&&TY[t]){M.t=t;any=true}
 put('q',(p.get('q')||'').slice(0,80));put('md',(p.get('md')||'').slice(0,60));
 var pv=p.get('pv');if(PVM.indexOf(pv)>-1)put('pv',pv,true);
 var mf=(p.get('mf')||'').slice(0,60);if(mf)put('mf',mf,true);
 var cd={new:'جديد',used:'مستعمل'}[p.get('cd')];if(cd)put('cd',cd,true);
 put('p1',num(p.get('p1'),0,1e12));put('p2',num(p.get('p2'),0,1e12));if(p.get('cu')==='IQD'||p.get('cu')==='USD')E('cu').value=p.get('cu');
 put('y1',num(p.get('y1'),1950,2100));put('y2',num(p.get('y2'),1950,2100));put('hp',num(p.get('hp'),0,100000));
 if(p.get('so')==='a'||p.get('so')==='d'){E('so').value=p.get('so');any=true}
 if(any&&!location.hash)history.replaceState(null,'',location.pathname+location.search+'#market')})();
E('rs').addEventListener('click',function(){E('fb').reset();M.t='';render()});
E('tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b){M.t=b.dataset.t;render()}});
E('mg').addEventListener('click',function(e){var b=e.target.closest('[data-id]');if(b){location.hash='#p-'+b.dataset.id}});
E('dt').addEventListener('click',function(e){if(e.target.id==='dt'||e.target.closest('#cl'))closeD();
  if(e.target.closest('#ct'))toast('هذا زر تجريبي ولا يرسل أي رسالة فعلية.');
  var t=e.target.closest('[data-u]');if(t){E('gm').innerHTML='<img src="'+t.dataset.u+'" alt="">';document.querySelectorAll('.th img').forEach(function(i){i.classList.toggle('on',i===t)})}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeD()});

/* ===== B26: BAHR PLATFORM FOUNDATION — بنية مشتركة للواجهات الثلاث =====
   ملاحظة أمنية: كل ما هنا لتجربة الاستخدام فقط (إخفاء/توجيه/رسائل). الحماية الفعلية للبيانات في Supabase (RLS + دوال security definer).
   لا يوجد هنا أي مفتاح سري، ولا يُعتمد على دور يرسله المتصفح: الأدوار تُقرأ من الخادم عبر admin_my_roles/is_admin وملكية النشاط عبر RLS. */
var PF=(function(){
 var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
 var UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

 /* ---------- 1) تنسيق موحّد ---------- */
 var fmt={esc:esc,
  date:function(x){try{return new Date(x).toLocaleDateString('ar-IQ',{year:'numeric',month:'long',day:'numeric'})}catch(e){return''}},
  dateTime:function(x){try{return new Date(x).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}catch(e){return''}},
  price:function(n,c){n=Number(n);if(!isFinite(n))return'';return c==='IQD'?n.toLocaleString('en-US')+' د.ع':'$ '+n.toLocaleString('en-US')}};

 /* ---------- 2) تصنيف الأخطاء ورسائل عربية آمنة (لا تُعرض رسالة الخادم الخام) ---------- */
 var err={
  kind:function(e){var m=String(e&&e.message||e||'').toLowerCase(),c=String(e&&e.code||''),st=Number(e&&(e.status||e.statusCode))||0;
   if(navigator.onLine===false||/failed to fetch|networkerror|network request|load failed|fetch failed|authretryablefetch/.test(m)||(e&&e.name==='AuthRetryableFetchError'))return'net';
   if(c==='PGRST301'||/jwt expired|invalid jwt|invalid token|refresh_token|not authenticated|auth session missing/.test(m)||st===401)return'auth';
   if(c==='42501'||st===403||/row-level security|permission denied|not authorized|forbidden|policy/.test(m))return'perm';
   if(c==='42P01'||c==='42883'||c==='PGRST202'||c==='PGRST205'||/does not exist|schema cache/.test(m))return'setup';
   if(c==='23505')return'dup';
   if(c==='23503'||c==='23514'||c==='23502'||c==='22P02')return'bad';
   if(st===429||/rate limit|too many/.test(m))return'limit';
   if(st===413||/payload too large|exceeded the maximum|file size/.test(m))return'big';
   if(c==='PGRST116'||st===404||/not found/.test(m))return'miss';
   return'unk'},
  TXT:{net:'تعذّر الاتصال بالخادم. تحقق من الإنترنت وحاول مرة أخرى.',auth:'انتهت جلستك. سجّل الدخول مرة أخرى.',perm:'ليست لديك صلاحية لتنفيذ هذا الإجراء.',
   setup:'هذه الميزة غير جاهزة بعد. حاول لاحقاً.',dup:'هذا السجل موجود مسبقاً.',bad:'بعض البيانات غير صالحة. راجعها وحاول مرة أخرى.',limit:'محاولات كثيرة. انتظر قليلاً ثم أعد المحاولة.',
   big:'حجم الملف كبير جداً.',miss:'العنصر غير موجود أو لم يعد متاحاً.',unk:'حدث خطأ غير متوقع. حاول مرة أخرى.'},
  /* يسجّل التفاصيل في كونسول جهاز المستخدم فقط ويعيد نصاً عربياً عاماً */
  msg:function(e){try{console.warn('[BAHR]',e)}catch(x){}return err.TXT[err.kind(e)]}
 };

 /* ---------- 3) حالات الواجهة المشتركة + نافذة التأكيد ---------- */
 var ui={
  loading:function(t){return'<p class="pf-st" role="status">'+esc(t||'جارٍ التحميل…')+'</p>'},
  empty:function(t){return'<p class="pf-st">'+esc(t||'لا توجد نتائج.')+'</p>'},
  error:function(e,retry){return'<div class="pf-st pf-er" role="alert">'+esc(typeof e==='string'?e:err.msg(e))+(retry?' <button class="btn btn-p" type="button" '+retry+'>إعادة المحاولة</button>':'')+'</div>'},
  confirm:function(m,o){o=o||{};return new Promise(function(res){var prev=document.activeElement,w=document.createElement('div');w.id='pf-cf';
   w.innerHTML='<div class="pf-cb" role="alertdialog" aria-modal="true" aria-label="تأكيد"><p>'+esc(m)+'</p><div><button type="button" class="btn pf-y" data-y>'+esc(o.ok||'تأكيد')+'</button><button type="button" class="btn pf-n" data-n>إلغاء</button></div></div>';
   var done=function(v){document.removeEventListener('keydown',kd,true);w.remove();try{prev&&prev.focus()}catch(x){}res(v)};
   var kd=function(e){if(e.key==='Escape'){e.stopPropagation();done(false)}};
   w.addEventListener('click',function(e){if(e.target===w||e.target.closest('[data-n]'))done(false);else if(e.target.closest('[data-y]'))done(true)});
   document.addEventListener('keydown',kd,true);document.body.appendChild(w);w.querySelector('[data-n]').focus()})}
 };

 /* ---------- 4) اتصال الشبكة: شريط موحّد (لا يدّعي شيئاً عن حالة الخادم) ---------- */
 var net={init:function(){var b=document.createElement('div'),t;b.id='pf-net';b.setAttribute('role','status');b.hidden=true;document.body.appendChild(b);
  var show=function(m,c,ms){clearTimeout(t);b.textContent=m;b.className=c;b.hidden=false;if(ms)t=setTimeout(function(){b.hidden=true},ms)};
  window.addEventListener('offline',function(){show('لا يوجد اتصال بالإنترنت. قد لا تُحفظ التغييرات.','off')});
  window.addEventListener('online',function(){show('عاد الاتصال بالإنترنت.','on',2500)});
  if(navigator.onLine===false)show('لا يوجد اتصال بالإنترنت. قد لا تُحفظ التغييرات.','off')}};

 /* ---------- 5) الجلسة ومساحات العمل (قراءة من الخادم، تخزين مؤقت لكل مستخدم) ---------- */
 var WS=null;
 function adminRoles(c){return c.rpc('admin_my_roles').then(function(r){if(!r.error)return r.data||[];return c.rpc('is_admin').then(function(a){if(a.error)throw a.error;return a.data===true?['platform_admin']:[]})})}
 var session={manual:false,
  user:function(){return AU.user},
  reset:function(){WS=null},
  /* يعيد {customer,business:{id,status,business_type}|null,admin:[roles],err:bool} */
  ws:function(force){var c=sbc(),u=AU.user;if(!c||!u)return Promise.resolve({customer:false,business:null,admin:[],err:false});
   if(!force&&WS&&WS.uid===u.id)return WS.p;
   var uid=u.id,p=Promise.all([
    c.from('biz_profiles').select('id,status,business_type').eq('owner_id',uid).maybeSingle().then(function(r){if(r.error)throw r.error;return r.data||null}),
    adminRoles(c)
   ]).then(function(a){return{customer:true,business:a[0],admin:a[1],err:false}},function(e){err.msg(e);return{customer:true,business:null,admin:[],err:true}})
   .then(function(v){if(WS&&WS.uid===uid)WS.v=v;return v});
   WS={uid:uid,p:p,v:null};return p},
  cached:function(){return WS&&AU.user&&WS.uid===AU.user.id?WS.v:null},
  require:function(m){if(AU.user)return true;NEXT=m||'سجّل الدخول للمتابعة.';location.hash='#login';return false},
  /* يُستدعى من onAuthStateChange: true إذا كان الحدث لا يستلزم إعادة رسم الصفحة (نفس المستخدم) */
  onAuth:function(ev,prev,u){
   if(!u||!prev||prev.id!==u.id)WS=null;
   if(ev==='SIGNED_OUT'){var was=!!prev,man=session.manual;session.manual=false;if(was&&!man)toast('انتهت الجلسة أو تم تسجيل الخروج من جهاز آخر. سجّل الدخول مرة أخرى.')}
   return AU.ready&&!!prev&&!!u&&prev.id===u.id&&(ev==='SIGNED_IN'||ev==='TOKEN_REFRESHED')}
 };

 /* ---------- 6) مساحات العمل والتنقل ---------- */
 var nav={
  /* تصنيف المسارات: لتمييز التجربة فقط، وليس للحماية */
  wsOf:function(h){return/^#(admin|admbiz|admparts|admreq|admbuy)$/.test(h)?'admin':/^#(business|bizparts)$/.test(h)?'business':'customer'},
  mark:function(h){document.body.dataset.ws=nav.wsOf(h)},
  /* true | false | null (جارٍ التحقق؛ يستدعي cb عند الانتهاء) | 'err' (تعذّر التحقق) */
  adminState:function(cb){var v=session.cached();if(v)return v.err?'err':v.admin.length>0;session.ws().then(function(){if(cb)cb()});return null},
  deny:function(kind){var p=E('ap-denied');if(!p)return;
   p.innerHTML=kind==='err'?'<h1>تعذّر التحقق من الصلاحية</h1><p class="sub">تحقق من اتصالك بالإنترنت ثم أعد المحاولة.</p><p><button class="btn btn-p" type="button" data-pf-retry>إعادة المحاولة</button></p>'
    :'<h1>غير مصرح</h1><p class="sub">هذه الصفحة للمشرفين فقط.</p><p><a class="btn btn-p" href="#home">العودة للرئيسية</a></p>';
   showAuth('denied')}
 };

 /* ---------- 7) الإشعارات المشتركة (تعيد استخدام جدول notifications الحالي) ---------- */
 var notify={
  TYPES:{price_drop:'انخفاض سعر',search_match:'بحث محفوظ',listing_status:'حالة إعلانك',
   new_message:'رسالة جديدة',request_update:'تحديث طلب',availability:'توفر وأسعار',business_reply:'رد نشاط',account:'الحساب',admin_alert:'تنبيه إدارة',business_status:'حالة النشاط',listing_report:'بلاغ',saved_ad_update:'إعلان محفوظ',subscription:'الاشتراك'},
  label:function(t){return notify.TYPES[t]||''},
  /* رابط الصفحة المرتبطة: قائمة بيضاء ومعرّفات UUID فقط (لا يُستخدم أي رابط نصي قادم من قاعدة البيانات) */
  href:function(n){var id=n&&(n.entity_id||n.listing_id),t=n&&(n.entity_type||(n.listing_id?'listing':''));if(!id||!UUID.test(id))return'';
   var M={listing:'#p-',request:'#request-',conversation:'#chat-',business:'#biz-',buyreq:'#buy-'};return M[t]?M[t]+id:''}
 };

 /* ---------- 8) الصور والملفات ---------- */
 var files={TYPES:{'image/jpeg':'jpg','image/png':'png','image/webp':'webp'},
  check:function(f,o){var max=(o&&o.max)||5242880;if(!f)return'اختر ملفاً أولاً.';if(!files.TYPES[f.type])return'نوع الملف غير مدعوم. المسموح: JPG وPNG وWEBP.';if(!f.size)return'الملف فارغ.';if(f.size>max)return'حجم الملف أكبر من '+Math.round(max/1048576)+' ميغابايت.';return''},
  /* التحقق من توقيع الملف الفعلي وليس من النوع الذي يعلنه المتصفح */
  sniff:function(f){return new Promise(function(res){var r=new FileReader();r.onerror=function(){res(false)};r.onload=function(){var a=new Uint8Array(r.result),s=function(i,t){for(var k=0;k<t.length;k++)if(a[i+k]!==t.charCodeAt(k))return false;return true};
   var t=(a[0]===255&&a[1]===216&&a[2]===255)?'image/jpeg':(a[0]===137&&s(1,'PNG'))?'image/png':(s(0,'RIFF')&&s(8,'WEBP'))?'image/webp':'';res(t===f.type)};r.readAsArrayBuffer(f.slice(0,12))})},
  /* يرفع إلى <bucket>/<uid>/…: مجلد المستخدم الحالي فقط. منع الكتابة في مجلد غيره يعتمد على سياسات التخزين في Supabase (يلزم اختبارها) */
  upload:function(bucket,f,o){o=o||{};var c=sbc(),u=AU.user;
   if(!c||!u)return Promise.reject({pfMsg:'انتهت جلستك. سجّل الدخول مرة أخرى.'});
   var bad=files.check(f,o);if(bad)return Promise.reject({pfMsg:bad});
   return files.sniff(f).then(function(ok){if(!ok)throw{pfMsg:'محتوى الملف لا يطابق نوعه.'};
    var path=u.id+'/'+(o.prefix||'file')+'-'+Date.now()+'.'+files.TYPES[f.type];
    return c.storage.from(bucket).upload(path,f,{contentType:f.type,upsert:false}).then(function(r){if(r.error)throw r.error;return path})})},
  msg:function(e){return e&&e.pfMsg?e.pfMsg:'فشل رفع الصورة. '+err.msg(e)},
  publicUrl:function(bucket,p){var c=sbc();return c&&p?c.storage.from(bucket).getPublicUrl(p).data.publicUrl:''}
 };

 /* ---------- 9) التدقيق: قراءة موحّدة من السجلات الموجودة فقط (الكتابة من دوال الخادم، لا من المتصفح) ---------- */
 var audit={SRC:[['admin_activity','إدارة الإعلانات والحسابات والبلاغات'],['biz_audit','الأنشطة التجارية'],['parts_audit','BAHR PARTS']],
  read:function(limit){var c=sbc();return Promise.all(audit.SRC.map(function(s){return c.from(s[0]).select('*').order('created_at',{ascending:false}).limit(limit||100).then(function(r){return{s:s,r:r}},function(e){return{s:s,r:{error:e}}})})).then(function(a){var rows=[],bad=[];
   a.forEach(function(x){if(x.r.error){bad.push(x.s[1]);return}(x.r.data||[]).forEach(function(y){rows.push({created_at:y.created_at,src:x.s[1],action:y.action||'',actor:y.actor||y.admin_id||y.actor_id||y.user_id||y.created_by||null,note:y.note||y.reason||[y.entity,y.detail?JSON.stringify(y.detail).slice(0,120):''].filter(Boolean).join(' · ')})})});
   return{rows:rows,bad:bad}})}};

 return{esc:esc,UUID:UUID,fmt:fmt,err:err,ui:ui,net:net,session:session,nav:nav,notify:notify,files:files,audit:audit};
})();
document.addEventListener('click',function(e){if(e.target.closest('[data-pf-retry]')){PF.session.reset();route()}});

PF.net.init();

/* ===== B7: قراءة البيانات المنشورة من Supabase (anon + RLS) مع رجوع تجريبي عند الفشل ===== */
var ex=function(v){return v==null?'':String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function tIcon(k){return k==='engine'?'engine':k==='boat'?'boat':k==='jetski'?'jetski':k==='parts'?'parts':'shield'}
function adCard(x){return CARD({id:x.id,href:'#p-'+x.id,img:x.img[0],alt:x.n,icon:tIcon(x.t),title:x.n,price:(isFinite(x.p)&&x.p>0)?fm(x.p,x.cur):'',loc:x.pv,badge:x.c})}
function svCard(p){return CARD({href:'#s-'+p.id,img:p.img[0],alt:p.n,icon:'wrench',title:p.n,sub:p.s.map(function(k){return ST[k][0]}).slice(0,2).join(' · '),loc:p.pv+(p.ar?'، '+p.ar:'')})}
function homeAds(){var el=$('#ads');if(!el)return;
  if(M.st==='live'){var L=ITEMS.slice(0,12);if(L.length)HS.set(el,L.map(adCard).join(''));else HS.msg(el,'لا توجد إعلانات منشورة بعد.');return}
  HS.msg(el,'تعذّر تحميل الإعلانات من قاعدة البيانات الآن.',true)}
function homeTypes(){[['#hmboat','boat','القوارب'],['#hmjet','jetski','الجت سكي'],['#hmeng','engine','المحركات']].forEach(function(r){var el=$(r[0]);if(!el)return;
  if(M.st!=='live'){HS.msg(el,'تعذّر تحميل '+r[2]+' الآن.',true);return}
  var L=ITEMS.filter(function(x){return x.t===r[1]}).slice(0,12);
  if(L.length)HS.set(el,L.map(adCard).join(''));else HS.msg(el,'لا توجد إعلانات '+r[2]+' منشورة بعد.')})}
function homeTips(){var el=$('#hmtips'),A=(window.BAHR_HELP&&BAHR_HELP.arts)||[];if(!el)return;if(!A.length){el.closest('section').style.display='none';return}
  HS.set(el,A.slice(0,8).map(function(a){return CARD({href:'#help-'+ex(a.c),img:a.img?ex(a.img):'',alt:ex(a.t),icon:'shield',title:ex(a.t),sub:ex((a.s||'').slice(0,90))})}).join(''))}
function homeMore(){var c=sbc(),sv=$('#hms'),bz=$('#hmb'),pc=$('#hmp');
  if(sv){var loc=SV.st==='live'?PRV.slice(0,12).map(svCard):[];
    var fin=function(extra,err){var all=loc.concat(extra||[]);if(all.length)HS.set(sv,all.join(''));else if(err&&SV.st!=='live')HS.msg(sv,'تعذّر تحميل الورش والخدمات الآن.',true);else HS.msg(sv,'لا توجد ورش أو خدمات منشورة بعد.')};
    if(!c)fin([],true);else bizQ(BSV,'',12).then(function(d){fin(d.map(bizCard))}).catch(function(){fin([],true)})}
  if(bz){if(!c)HS.msg(bz,'تعذّر الاتصال بقاعدة البيانات.',true);else bizQ(BST,'',12).then(function(d){if(d.length)HS.set(bz,d.map(bizCard).join(''));else HS.msg(bz,'لا توجد متاجر أو موردون منشورون بعد.')}).catch(function(){HS.msg(bz,'تعذّر تحميل المتاجر والموردين الآن.',true)})}
  if(pc){if(!c)pc.textContent='تعذّر الاتصال بالكتالوج الآن.';else c.from('parts_items').select('id',{count:'exact',head:true}).eq('status','published').then(function(r){if(r.error||r.count==null){pc.textContent='تعذّر قراءة حالة الكتالوج الآن.';return}pc.textContent=r.count?('يضم الكتالوج '+r.count.toLocaleString('en-US')+' قطعة منشورة.'):'الكتالوج قيد التجهيز ولا توجد قطع منشورة بعد.'}).catch(function(){pc.textContent='تعذّر قراءة حالة الكتالوج الآن.'})}}
document.addEventListener('click',function(e){var b=e.target.closest('[data-hretry]');if(!b)return;['#ads','#hmb','#hms','#hmboat','#hmjet','#hmeng'].forEach(function(s){var el=$(s);if(el)HS.msg(el,'جارٍ التحميل…')});M.st='load';SV.st='load';loadData()});
function loadData(){var c=sbc();
  var dM=function(e){ITEMS=[];M.st='error';M.err=e||null;window.BAHR_LAST_ERR=e||null;try{console.error('BAHR: تعذّر تحميل الإعلانات',e&&(e.code||''),e&&(e.message||e),e&&(e.details||''),e&&(e.hint||''))}catch(_){}},dS=function(){PRV=[];SV.st='error'};
  var fin=function(){homeAds();homeTypes();homeTips();homeMore();refM();refS();E('dm').style.display=M.st==='demo'?'block':'none';E('ds').style.display=SV.st==='demo'?'block':'none';route()};
  if(!c){dM({message:'مكتبة Supabase لم تُحمَّل (تحقق من الاتصال أو من حجب الشبكة للرابط jsdelivr)'});dS();fin();return}
  var pub=function(p){return ex(c.storage.from('listing-images').getPublicUrl(p).data.publicUrl)};
  var a=c.from('listings').select('id,category,title,description,price,currency,condition,province,area,manufacturer,model,year,listing_images(storage_path,sort_order)').eq('status','published').order('created_at',{ascending:false}).limit(200)
   .then(function(r){if(r.error)throw r.error;ITEMS=(r.data||[]).map(function(x){return{id:ex(x.id),t:x.category==='accessory'?'acc':x.category,n:ex(x.title),p:Number(x.price),cur:x.currency,pv:ex(x.province),ar:ex(x.area),c:x.condition==='new'?'جديد':'مستعمل',m:ex(x.manufacturer),mo:ex(x.model),y:x.year||'',d:ex(x.description),img:(x.listing_images||[]).slice().sort(function(i,j){return i.sort_order-j.sort_order}).map(function(i){return pub(i.storage_path)})}});M.st='live'}).catch(dM);
  var b0=function(){return c.from('marine_services').select('id,name,service_types,province,area,equipment,description,hours,contact_phone:phone,image_path').eq('status','published').order('created_at',{ascending:false}).limit(200)
   .then(function(r){if(r.error)throw r.error;PRV=(r.data||[]).map(function(x){return{id:ex(x.id),n:ex(x.name),s:(x.service_types||[]).filter(function(k){return ST[k]}),pv:ex(x.province),ar:ex(x.area),eq:(x.equipment||[]).map(ex),img:x.image_path?[pub(x.image_path)]:[],d:ex(x.description),h:ex(x.hours),ph:ex(x.contact_phone)}}).filter(function(p){return p.s.length});SV.st='live'}).catch(dS)};
  var b=B61.loadCats(c).then(function(){return B61.loadPub(c,pub)}).then(function(x){PRV=x.filter(function(p){return p.s.length});SV.st='live'}).catch(function(e){try{console.warn('BAHR B61: العرض b61_public_services غير متاح، استُخدم الاستعلام القديم',e&&e.message)}catch(_){}return b0()});
  Promise.all([a,b]).then(fin)}
window.addEventListener('load',loadData);
/* ===== B23: البحث الموحد وصفحة المتاجر (إعادة استخدام ITEMS/PRV المحمّلة + استعلامات حقيقية لـ biz_public وparts_items) ===== */
var BT={parts_store:'متجر قطع غيار بحرية',boat_engine_dealer:'تاجر قوارب ومحركات بحرية',jetski_dealer:'تاجر جت سكي',wholesale_supplier:'مورد قطع غيار بالجملة',workshop:'ورشة صيانة بحرية',technician:'فني أو مقدم خدمة بحرية'};
var BST=['parts_store','boat_engine_dealer','jetski_dealer','wholesale_supplier'],BSV=['workshop','technician'],BSEL='id,name,business_type,province,area,is_verified,categories';
function bizCard(b){var k=b.business_type;return CARD({href:'#biz-'+ex(b.id),icon:(k==='workshop'||k==='technician')?'wrench':(k==='parts_store'||k==='wholesale_supplier')?'parts':k==='jetski_dealer'?'jetski':'boat',title:ex(b.name),sub:ex(BT[k]||''),loc:ex(b.province||'')+(b.area?'، '+ex(b.area):''),badge:b.is_verified?'موثّق':''})}
function bizQ(types,q,lim){var c=sbc();if(!c)return Promise.reject(new Error('no-client'));
  var r=c.from('biz_public').select(BSEL).in('business_type',types);q=(q||'').replace(/[%,()*\\]/g,' ').trim();
  if(q)r=r.or('name.ilike.%'+q+'%,description.ilike.%'+q+'%,categories.ilike.%'+q+'%');
  return r.order('name').limit(lim).then(function(x){if(x.error)throw x.error;return x.data||[]})}
function bizEntry(){var a=E('bizLink'),p=E('bizPartsLink');if(!a)return;var c=sbc();
  if(!c||!AU.user){a.textContent='سجّل نشاطك التجاري';if(p)p.style.display='none';return}
  c.from('biz_profiles').select('id').eq('owner_id',AU.user.id).maybeSingle().then(function(r){var has=!r.error&&!!r.data;a.textContent=has?'لوحة نشاطي التجاري':'سجّل نشاطك التجاري';if(p)p.style.display=has?'':'none'}).catch(function(){})}
var FD={t:'all',q:'',pv:'',bt:'',n:0,mode:'find',R:{},TT:{ads:'المعدات والإعلانات',parts:'قطع الغيار (BAHR PARTS)',stores:'المتاجر والموردون',svc:'الورش والفنيون والخدمات'}};
FD.cur=function(){return FD.mode==='stores'?['stores']:FD.t==='all'?['ads','stores','svc','parts']:[FD.t]};
FD.page=function(h){var box=E('cxc'),st=h==='#stores';FD.mode=st?'stores':'find';if(!st&&FD.q===undefined)FD.q='';
  var tabs=st?'':'<div class="tabs" id="fdt">'+[['all','الكل']].concat(['ads','parts','stores','svc'].map(function(k){return[k,FD.TT[k]]})).map(function(a){return '<button type="button" data-fdt="'+a[0]+'" class="'+(FD.t===a[0]?'on':'')+'">'+a[1]+'</button>'}).join('')+'</div>';
  var bsel=st?'<select id="fdb" aria-label="نوع النشاط"><option value="">كل الأنواع</option>'+BST.map(function(k){return '<option value="'+k+'"'+(FD.bt===k?' selected':'')+'>'+BT[k]+'</option>'}).join('')+'</select>':'';
  box.innerHTML='<h1>'+(st?'المتاجر والموردون':'البحث في بحر')+'</h1><p class="b17n">'+(st?'الأنشطة التجارية المنشورة على المنصة.':'ابحث في الإعلانات وقطع الغيار والمتاجر والورش.')+'</p>'
   +'<form class="fdf'+(st?' s':'')+'" id="fdf" role="search"><input id="fdq" type="search" value="'+ex(FD.q)+'" placeholder="'+(st?'اسم المتجر أو فئاته':'اسم المنتج أو القطعة أو النشاط')+'" aria-label="بحث"><select id="fdp" aria-label="المحافظة"><option value="">كل المحافظات</option></select>'+bsel+'<button class="btn btn-p" type="submit">بحث</button></form>'+tabs
   +'<p class="fd-n">المتاح هنا: البحث بالنص والتصفية حسب المحافظة'+(st?' ونوع النشاط':'')+'. '+(st?'':'للتصفية المتقدمة للإعلانات استخدم <a href="#market">السوق البحري</a>، ولقطع الغيار حسب المعدة <a href="#parts">BAHR PARTS</a>.')+'</p><div id="fdr" aria-live="polite"></div>';
  if(!box.dataset.b){box.dataset.b='1';
   box.addEventListener('submit',function(e){if(!e.target.closest('#fdf'))return;e.preventDefault();FD.q=E('fdq').value.trim();FD.run()});
   box.addEventListener('change',function(e){if(e.target.id==='fdp'){FD.pv=e.target.value;FD.paint()}else if(e.target.id==='fdb'){FD.bt=e.target.value;FD.paint()}});
   box.addEventListener('click',function(e){var b=e.target.closest('[data-fdt]');if(b){FD.t=b.dataset.fdt;[].forEach.call(box.querySelectorAll('#fdt button'),function(x){x.classList.toggle('on',x.dataset.fdt===FD.t)});FD.paint();return}if(e.target.closest('[data-fdr]'))FD.run()})}
  FD.run()};
FD.local=function(t,q){var Q=q.toLowerCase();
  if(t==='ads'){if(M.st==='load')return{st:'load'};if(M.st!=='live')return{st:'na'};
   return{st:'ok',d:ITEMS.filter(function(x){return!Q||(x.n+' '+(x.m||'')+' '+(x.mo||'')+' '+(x.d||'')).toLowerCase().indexOf(Q)>-1}).map(function(x){return{pv:x.pv,h:adCard(x)}})}}
  if(SV.st==='load')return{st:'load'};if(SV.st!=='live')return{st:'na'};
  return{st:'ok',d:PRV.filter(function(p){return!Q||(p.n+' '+p.d+' '+p.ar+' '+p.s.map(function(k){return ST[k][0]}).join(' ')).toLowerCase().indexOf(Q)>-1}).map(function(p){return{pv:p.pv,h:svCard(p)}})}};
FD.run=function(){var n=++FD.n,q=FD.q.trim(),c=sbc(),R=FD.R={},cur=FD.cur(),done=function(k,v){if(n!==FD.n)return;R[k]=v;FD.paint()};
  R.ads={st:'load'};var sl=FD.local('svc',q);R.svc={st:'load'};R.stores={st:'load'};R.parts={st:'load'};
  if(q.length<2)R.parts={st:'hint'};
  FD.paint();
  if(!c){done('ads',{st:'err'});done('stores',{st:'err'});done('svc',sl.st==='ok'?sl:{st:sl.st==='load'?'err':sl.st});if(q.length>=2)done('parts',{st:'err'});return}
  if(cur.indexOf('ads')>-1)s47(c,{q:q},0,59).then(function(r){done('ads',{st:'ok',d:r.d.map(function(x){return{pv:x.pv,h:adCard(x)}})})}).catch(function(){done('ads',{st:'err'})});
  if(cur.indexOf('stores')>-1)bizQ(BST,q,60).then(function(d){done('stores',{st:'ok',d:d.map(function(b){return{pv:b.province,bt:b.business_type,h:bizCard(b)}})})}).catch(function(){done('stores',{st:'err'})});
  if(cur.indexOf('svc')>-1){bizQ(BSV,q,60).then(function(d){return d.map(function(b){return{pv:b.province,h:bizCard(b)}})},function(){return null}).then(function(bd){
    if(sl.st==='ok'||bd){done('svc',{st:'ok',d:(sl.st==='ok'?sl.d:[]).concat(bd||[])})}else done('svc',{st:sl.st==='na'?'na':'err'})})}
  if(cur.indexOf('parts')>-1&&q.length>=2){var q2=q.replace(/[%,()]/g,'');
   c.from('parts_items').select('id,name,part_number,parts_manufacturers(name)').eq('status','published').or('part_number.ilike.%'+q2+'%,name.ilike.%'+q2+'%').limit(40).then(function(r){if(r.error)throw r.error;
    done('parts',{st:'ok',d:(r.data||[]).map(function(p){var mf=Array.isArray(p.parts_manufacturers)?p.parts_manufacturers[0]:p.parts_manufacturers;return{pv:null,h:CARD({href:'#part-'+ex(p.id),icon:'parts',title:ex(p.name),sub:'رقم القطعة: <bdi dir="ltr">'+ex(p.part_number)+'</bdi>',badge:mf&&mf.name?ex(mf.name):''})}})})}).catch(function(){done('parts',{st:'err'})})}};
FD.paint=function(){var box=E('fdr');if(!box)return;var cur=FD.cur(),one=cur.length===1,pvs={};
  var V=function(k){var r=FD.R[k]||{st:'load'};if(r.st!=='ok')return r;(r.d||[]).forEach(function(x){if(x.pv)pvs[x.pv]=1});return{st:'ok',d:(r.d||[]).filter(function(x){return(!FD.pv||x.pv==null||x.pv===FD.pv)&&(!FD.bt||x.bt===FD.bt)})}};
  var views=cur.map(function(k){return[k,V(k)]});
  var sel=E('fdp');if(sel){var keep=FD.pv;sel.innerHTML='<option value="">كل المحافظات</option>'+Object.keys(pvs).sort().map(function(p){return '<option value="'+p+'"'+(p===keep?' selected':'')+'>'+p+'</option>'}).join('')}
  var msg=function(r){return r.st==='load'?'<p class="fd-m">جارٍ البحث…</p>':r.st==='err'?'<p class="fd-m">تعذّر الاتصال بمصدر البيانات. <button class="btn" type="button" data-fdr>إعادة المحاولة</button></p>':r.st==='na'?'<p class="fd-m">بيانات هذا القسم غير متاحة حالياً.</p>':r.st==='hint'?'<p class="fd-m">اكتب حرفين على الأقل للبحث في كتالوج قطع الغيار، أو استخدم <a href="#parts">البحث بالمعدة في BAHR PARTS</a>.</p>':''};
  if(views.every(function(v){return v[1].st==='ok'})&&views.every(function(v){return!v[1].d.length})){box.innerHTML='<p class="fd-m">لا توجد نتائج مطابقة'+(FD.q?' لـ «'+ex(FD.q)+'»':'')+'. جرّب كلمة أخرى أو غيّر التصفية.</p>';return}
  if(views.every(function(v){return v[1].st==='err'})){box.innerHTML='<p class="fd-m">تعذّر الاتصال بقاعدة البيانات. <button class="btn" type="button" data-fdr>إعادة المحاولة</button></p>';return}
  box.innerHTML=views.map(function(v){var k=v[0],r=v[1],body;
   if(r.st!=='ok')body=msg(r);else if(!r.d.length)body='<p class="fd-m">لا توجد نتائج في هذا القسم.</p>';else if(one)body='<div class="uc-g">'+r.d.map(function(x){return x.h}).join('')+'</div>';else body='<div class="hz" data-hsx>'+HS.row(r.d.slice(0,12).map(function(x){return x.h}).join(''))+'</div>';
   return '<section class="fd-s">'+(one?'':'<div class="sec-h"><h2>'+FD.TT[k]+(r.st==='ok'?' <small>('+r.d.length+')</small>':'')+'</h2>'+((r.st==='ok'&&r.d.length)?'<button class="all2" type="button" data-fdt="'+k+'">عرض الكل ←</button>':'')+'</div>')+body+'</section>'}).join('');
  [].forEach.call(box.querySelectorAll('.hz[data-hsx]'),HS.init)};
/* قائمة الحساب (سطح المكتب) */
function closeAcg(){var g=E('acg');if(g)g.classList.remove('open');var b=document.querySelector('[data-act="acct"]');if(b)b.setAttribute('aria-expanded','false')}
document.addEventListener('click',function(e){var b=e.target.closest('[data-act="acct"]'),g=E('acg');if(!g)return;if(b){var o=!g.classList.contains('open');g.classList.toggle('open',o);b.setAttribute('aria-expanded',o);return}if(!e.target.closest('#acg')||e.target.closest('#acg a'))closeAcg()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAcg()});
window.addEventListener('hashchange',closeAcg);
/* B11 */
/* ===== B11: المفضلة والبحث المحفوظ والتنبيهات (RLS في الخادم؛ التنبيهات تولّدها triggers قاعدة البيانات) ===== */
(function(){
var X=PF.esc;
var PV=['بغداد','البصرة','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var NT={price_drop:'انخفاض سعر',search_match:'بحث محفوظ',listing_status:'حالة إعلانك'};
var fd=function(x){try{return new Date(x).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}catch(e){return''}};
var dbc=function(k){return k==='acc'?'accessory':k},uic=function(k){return k==='accessory'?'acc':k};
var FAV={},unread=0,st={k:null};
var LS='id,category,title,price,currency,condition,province,status,listing_images(storage_path,sort_order)';
function badge(){if(window.B45&&B45.badge)B45.badge()}
function paint(){[].forEach.call(document.querySelectorAll('[data-fv]'),function(b){var on=!!FAV[b.dataset.fv];b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);var s=b.querySelector('span');if(s)s.textContent=on?'في المفضلة':'أضف إلى المفضلة'})}
B11.heart=function(id,force,txt){if(!force&&M.st!=='live')return'';var on=!!FAV[id];return '<button type="button" class="fv'+(txt?' fvt':'')+(on?' on':'')+'" data-fv="'+X(id)+'" aria-pressed="'+on+'" aria-label="المفضلة">'+ic('heart')+(txt?'<span>'+(on?'في المفضلة':'أضف إلى المفضلة')+'</span>':'')+'</button>'};
function need(m){NEXT=m;toast(m);location.hash='#login'}
function count(){if(window.B45&&B45.poll)B45.poll()}
B11.sync=function(){var c=sbc();FAV={};unread=0;paint();if(!c||!AU.user){if(window.B45&&B45.sync)B45.sync();return}
  c.from('favorites').select('listing_id').eq('user_id',AU.user.id).then(function(r){if(!r.error){(r.data||[]).forEach(function(x){FAV[x.listing_id]=1})}paint();if(st.k==='favorites'){st.k=null;B11.page('favorites')}});if(window.B45&&B45.sync)B45.sync()};
setInterval(function(){if(!document.hidden)count()},60000);
/* B48: لا يتغير شكل الزر إلا بعد تأكيد الخادم؛ قفل ضد النقر المزدوج؛ الزائر يعود لنفس الإعلان بعد الدخول */
var BZ={};
function tog(id){if(!AU.user){B22.setRet('#p-'+id);return need('سجّل الدخول لحفظ الإعلان في المفضلة.')}
  var c=sbc();if(!c){toast('الاتصال بقاعدة البيانات غير جاهز. أعد المحاولة بعد قليل.');return}if(BZ[id])return;BZ[id]=1;
  var had=!!FAV[id],bs=[].slice.call(document.querySelectorAll('[data-fv]')).filter(function(b){return b.dataset.fv===id});
  bs.forEach(function(b){b.disabled=true;b.setAttribute('aria-busy','true')});
  var done=function(){BZ[id]=0;bs.forEach(function(b){b.disabled=false;b.removeAttribute('aria-busy')})};
  var q=had?c.from('favorites').delete().eq('listing_id',id).eq('user_id',AU.user.id).select('listing_id'):c.from('favorites').insert({user_id:AU.user.id,listing_id:id}).select('listing_id');
  q.then(function(r){done();
   if(r.error&&!(r.error.code==='23505'&&!had)){toast('تعذّر تحديث المفضلة: '+PF.err.msg(r.error));return}
   if(!r.error&&!had&&!(r.data&&r.data.length)){toast('لم يتأكد حفظ الإعلان في المفضلة. أعد المحاولة.');return}
   if(had)delete FAV[id];else FAV[id]=1;paint();toast(had?'أُزيل من المفضلة.':'أُضيف إلى المفضلة.');
   if(had&&st.k==='favorites'){st.k=null;B11.page('favorites')}},function(){done();toast('تعذّر الاتصال بقاعدة البيانات. لم يتغير شيء، أعد المحاولة.')})}

/* ---------- الصفحات ---------- */
var TB=[['favorites','المفضلة'],['searches','البحوث المحفوظة'],['alerts','التنبيهات']];
function tabs(k){E('uct').innerHTML=TB.map(function(t){return '<a href="#'+t[0]+'" class="'+(t[0]===k?'on':'')+'">'+(t[0]==='favorites'?ic('heart'):t[0]==='alerts'?ic('bell'):'')+t[1]+'</a>'}).join('')}
var P=function(h){E('ucp').innerHTML=h},box=function(t,er){return '<div class="ucc" style="text-align:center;'+(er?'color:#a02a1c':'')+'">'+t+'</div>'};
B11.reset=function(){st.k=null};
B11.page=function(k){if(st.k===k)return;st.k=k;tabs(k);P(box('جارٍ التحميل…'));if(!sbc()){P(box('الاتصال بـ Supabase غير جاهز.',1));return}({favorites:favs,searches:srch,alerts:alrt})[k]()};
var fail=function(e){P(box('تعذّر التحميل: '+X(PF.err.msg(e))+'<br><br><button class="btn btn-p" type="button" data-b48r="1" style="min-height:44px">إعادة المحاولة</button>',1))};
var mp=function(x){return{id:x.id,t:uic(x.category),n:x.title,p:Number(x.price),cur:x.currency,pv:x.province||'',ar:x.area||'',dt:x.created_at||'',c:x.condition==='new'?'جديد':'مستعمل',img:(x.listing_images||[]).slice().sort(function(i,j){return i.sort_order-j.sort_order}).map(function(i){return sbc().storage.from('listing-images').getPublicUrl(i.storage_path).data.publicUrl})}};

/* ===== B48: صفحة «إعلاناتي المحفوظة» — سجل الأسعار من listing_price_history (b48_price_history.sql)؛ إن لم يُنشأ الجدول لا يظهر أي مؤشر انخفاض ===== */
var FS={L:[],H:null,q:'',so:''};
var dfm=function(x){try{return new Date(x).toLocaleDateString('ar-IQ-u-nu-latn',{year:'numeric',month:'short',day:'numeric'})}catch(e){return''}};
function fdrop(x){var h=FS.H&&FS.H[x.id];if(!h||h.currency!==h.old_currency||!(Number(h.new_price)<Number(h.old_price))||Number(h.new_price)!==x.p)return null;return{o:Number(h.old_price),pc:Math.round((1-Number(h.new_price)/Number(h.old_price))*100)}}
function fvCard(f){var l=f.listings,x=f._x,rm='<button type="button" class="btn btn-o" data-fv="'+X(f.listing_id)+'" style="min-height:44px;color:#a02a1c;border-color:#a02a1c">إزالة من المفضلة</button>';
  if(!x)return '<article class="mc"><div class="cb"><h3>إعلان لم يعد متاحاً</h3><p>أُزيل هذا الإعلان أو لم يعد منشوراً.</p>'+rm+'</div></article>';
  var d=fdrop(x);
  return '<article class="mc"><div class="thumb">'+thumb(x)+'</div><div class="cb"><h3>'+x.n+'</h3><div class="price">'+fm(x.p,x.cur)+'</div>'+(d?'<div class="uc-s"><span class="cond" style="background:#d8f3e4;color:#0b6b3a;border-color:#0b6b3a">انخفض السعر '+d.pc+'% (كان '+fm(d.o,x.cur)+')</span></div>':'')+'<div class="meta"><span>'+ic('pin')+x.pv+(x.ar?'، '+x.ar:'')+'</span><span class="cond">'+x.c+'</span></div><div class="uc-s">'+X(TY[x.t]||'')+(x.dt&&dfm(x.dt)?' · نُشر: '+dfm(x.dt):'')+'</div><div class="ucb"><a class="btn" href="#p-'+X(x.id)+'" style="min-height:44px">عرض التفاصيل</a>'+rm+'</div></div></article>'}
function fvl(){var el=E('fv-l');if(!el)return;var q=FS.q.trim().toLowerCase(),L=FS.L.filter(function(f){return f._x?(!q||(f._x.n+' '+f._x.pv+' '+(TY[f._x.t]||'')).toLowerCase().indexOf(q)>-1):!q});
  if(FS.so==='a'||FS.so==='d')L=L.slice().sort(function(a,b){return(a._x&&b._x)?(FS.so==='a'?a._x.p-b._x.p:b._x.p-a._x.p):(a._x?-1:1)});
  else if(FS.so==='drop'){var dp=function(f){var d=f._x&&fdrop(f._x);return d?d.pc:-1};L=L.slice().sort(function(a,b){return dp(b)-dp(a)})}
  el.innerHTML=L.length?'<div class="mg">'+L.map(fvCard).join('')+'</div>':box('لا توجد نتائج مطابقة لبحثك.')}
function favs(){sbc().from('favorites').select('listing_id,created_at,listings('+LS+',area,created_at)').eq('user_id',AU.user.id).order('created_at',{ascending:false}).limit(200).then(function(r){
  if(r.error)return fail(r.error);var L=r.data||[];
  if(!L.length){P(box('لا توجد إعلانات في مفضلتك بعد.<br>اضغط على القلب في أي إعلان لحفظه هنا.<br><br><a class="btn btn-p" href="#market">تصفّح السوق البحري</a>'));return}
  L.forEach(function(f){f._x=null;if(f.listings&&f.listings.status==='published'){var x=mp(f.listings);x.n=X(x.n);x.pv=X(x.pv);x.ar=X(x.ar);f._x=x}});
  FS.L=L;FS.H=null;FS.q='';FS.so='';
  var ids=L.filter(function(f){return f._x}).map(function(f){return f.listing_id}),
   go=function(){P('<p class="hmeta">'+L.length+' إعلان محفوظ</p>'+(L.length>6?'<div class="ucf"><label>بحث في المحفوظات<input id="fv-q" type="search" maxlength="60" placeholder="الاسم أو المحافظة أو النوع"></label><label>الترتيب<select id="fv-s"><option value="">الأحدث حفظاً</option><option value="a">السعر: الأقل</option><option value="d">السعر: الأعلى</option><option value="drop">الأكثر انخفاضاً</option></select></label></div>':'')+'<div id="fv-l"></div>');fvl();paint()};
  if(!ids.length)return go();
  sbc().from('listing_price_history').select('listing_id,old_price,new_price,old_currency,currency,created_at').in('listing_id',ids).order('created_at',{ascending:false}).limit(1000).then(function(h){if(!h.error){FS.H={};(h.data||[]).forEach(function(w){if(!FS.H[w.listing_id])FS.H[w.listing_id]=w})}go()},function(){go()})},fail)}
document.addEventListener('input',function(e){if(e.target.id==='fv-q'){FS.q=e.target.value;fvl()}});
document.addEventListener('change',function(e){if(e.target.id==='fv-s'){FS.so=e.target.value;fvl()}});

function crit(s){var a=[];if(s.category)a.push(TY[uic(s.category)]);if(s.province)a.push(s.province);if(s.area)a.push('المنطقة: '+s.area);if(s.manufacturer)a.push(s.manufacturer);if(s.model)a.push('الموديل: '+s.model);
  if(s.min_price!=null||s.max_price!=null)a.push('السعر '+(s.min_price!=null?'من '+s.min_price:'')+(s.max_price!=null?' إلى '+s.max_price:'')+' '+(s.currency==='IQD'?'د.ع':'$'));return a}
var SS={};
function srch(){sbc().from('saved_searches').select('*').order('created_at',{ascending:false}).then(function(r){if(r.error)return fail(r.error);var L=r.data||[];SS={};L.forEach(function(s){SS[s.id]=s});
  P(L.length?L.map(function(s){return '<div class="ucc" id="ss-'+s.id+'">'+sview(s)+'</div>'}).join(''):box('لا توجد بحوث محفوظة.<br>افتح السوق البحري واختر التصفية ثم اضغط «حفظ هذا البحث».<br><br><a class="btn btn-p" href="#market">السوق البحري</a>'))})}
function sview(s){return '<h3>'+X(s.name)+'</h3><div class="ucb">'+crit(s).map(function(t){return '<span class="cond">'+X(t)+'</span>'}).join('')+'</div><div class="ucb"><button class="btn btn-p" data-so="'+s.id+'">فتح البحث</button><button class="btn btn-o" style="color:var(--b);border-color:var(--b)" data-se="'+s.id+'">تعديل</button><button class="btn btn-o" style="color:#a02a1c;border-color:#a02a1c" data-sd="'+s.id+'">حذف</button></div><small>تنبيه عند نشر إعلان جديد مطابق.</small>'}
function sedit(s){var o=function(v,l,c){return '<option value="'+v+'"'+(c?' selected':'')+'>'+l+'</option>'};
  return '<div class="ucf"><label>اسم البحث<input id="e-n" maxlength="60" value="'+X(s.name)+'"></label><label>النوع<select id="e-c">'+o('','الكل',!s.category)+Object.keys(TY).map(function(k){return o(dbc(k),TY[k],s.category===dbc(k))}).join('')+'</select></label>'+
   '<label>المحافظة<select id="e-p">'+o('','الكل',!s.province)+PV.map(function(v){return o(v,v,s.province===v)}).join('')+'</select></label><label>المنطقة<input id="e-a" maxlength="80" value="'+X(s.area||'')+'"></label>'+
   '<label>الشركة المصنعة<input id="e-m" value="'+X(s.manufacturer||'')+'"></label><label>الموديل<input id="e-o" value="'+X(s.model||'')+'"></label>'+
   '<label>السعر من<input id="e-1" type="number" min="0" value="'+(s.min_price==null?'':s.min_price)+'"></label><label>إلى<input id="e-2" type="number" min="0" value="'+(s.max_price==null?'':s.max_price)+'"></label><label>العملة<select id="e-u">'+o('USD','دولار ($)',s.currency!=='IQD')+o('IQD','دينار (د.ع)',s.currency==='IQD')+'</select></label></div><div class="ucb"><button class="btn btn-p" data-ss="'+s.id+'">حفظ التعديل</button><button class="btn btn-o" style="color:var(--b);border-color:var(--b)" data-sx="'+s.id+'">إلغاء</button></div>'}
var nv=function(id){var v=E(id).value.trim();return v===''?null:v};
function sfields(g){var p1=nv(g.p1),p2=nv(g.p2);return{category:g.c||null,province:g.p||null,area:g.a||null,manufacturer:g.m||null,model:g.o||null,min_price:p1==null?null:Number(p1),max_price:p2==null?null:Number(p2),currency:(p1!=null||p2!=null)?g.u:null}}
function applyS(s){M.t=uic(s.category||'');var set=function(id,v){var el=E(id);if(v&&el.tagName==='SELECT'&&![].some.call(el.options,function(o){return o.value===v||o.text===v})){var o=document.createElement('option');o.textContent=v;el.appendChild(o)}el.value=v||''};
  set('pv',s.province);set('mf',s.manufacturer);E('md').value=s.model||'';E('p1').value=s.min_price==null?'':s.min_price;E('p2').value=s.max_price==null?'':s.max_price;if(s.currency)E('cu').value=s.currency;E('q').value='';E('cd').value='';
  if(s.area)toast('تم فتح البحث. المنطقة تُستخدم في التنبيهات فقط ولا تصفّي نتائج السوق.');location.hash='#market';render()}

function alrt(){B45.history(E('ucp'))}
function mark(q,ok){q.then(function(r){if(r.error){toast('تعذّر التحديث: '+PF.err.msg(r.error));return}ok();count();st.k=null;B11.page('alerts')})}

document.addEventListener('click',function(e){var t=e.target,b;
  if((b=t.closest('[data-fv]'))){e.preventDefault();return tog(b.dataset.fv)}
  if(t.closest('#sv-s'))return svOpen();
  if(!t.closest('#uc')&&!t.closest('#svp'))return;var c=sbc();
  if(t.closest('[data-b48r]')){var kk=st.k||'favorites';st.k=null;B11.page(kk);return}
  if((b=t.closest('[data-so]')))return applyS(SS[b.dataset.so]);
  if((b=t.closest('[data-se]'))){var s=SS[b.dataset.se];E('ss-'+s.id).innerHTML=sedit(s);return}
  if((b=t.closest('[data-sx]'))){var s2=SS[b.dataset.sx];E('ss-'+s2.id).innerHTML=sview(s2);return}
  if((b=t.closest('[data-ss]'))){var id=b.dataset.ss,n=nv('e-n');if(!n){toast('اكتب اسم البحث.');return}
   var f=sfields({c:E('e-c').value,p:E('e-p').value,a:nv('e-a'),m:nv('e-m'),o:nv('e-o'),p1:'e-1',p2:'e-2',u:E('e-u').value});f.name=n;
   if(f.min_price!=null&&f.max_price!=null&&f.min_price>f.max_price){toast('السعر الأدنى أكبر من الأعلى.');return}
   b.disabled=true;c.from('saved_searches').update(f).eq('id',id).select().maybeSingle().then(function(r){b.disabled=false;if(r.error||!r.data){toast('تعذّر الحفظ: '+(r.error?PF.err.msg(r.error):'لم يتأكد التعديل'));return}toast('تم حفظ التعديل.');SS[id]=r.data;E('ss-'+id).innerHTML=sview(r.data)});return}
  if((b=t.closest('[data-sd]'))){var d=b.dataset.sd;PF.ui.confirm('حذف هذا البحث المحفوظ؟',{ok:'حذف'}).then(function(ok){if(!ok)return;c.from('saved_searches').delete().eq('id',d).then(function(r){if(r.error){toast('تعذّر الحذف: '+PF.err.msg(r.error));return}toast('تم حذف البحث.');st.k=null;B11.page('searches')})});return}
  if((b=t.closest('[data-na]')))return mark(c.from('notifications').update({read_at:new Date().toISOString()}).eq('user_id',AU.user.id).is('read_at',null),function(){toast('عُلّمت كل التنبيهات كمقروءة.')});
  if((b=t.closest('[data-nr]')))return mark(c.from('notifications').update({read_at:new Date().toISOString()}).eq('id',b.dataset.nr),function(){});
  if((b=t.closest('[data-no]'))){var l=b.dataset.l;c.from('notifications').update({read_at:new Date().toISOString()}).eq('id',b.dataset.no).then(function(){count();location.hash='#p-'+l});return}});

/* ---------- حفظ البحث من صفحة السوق ---------- */
function svOpen(){if(!AU.user)return need('سجّل الدخول لحفظ البحث.');var p=E('svp');if(p){p.remove();return}
  var g={c:dbc(M.t),p:E('pv').value,a:null,m:E('mf').value,o:E('md').value.trim()||null,p1:E('p1').value.trim()||null,p2:E('p2').value.trim()||null,u:E('cu').value};
  var f={category:g.c||null,province:g.p||null,manufacturer:g.m||null,model:g.o,min_price:g.p1==null?null:Number(g.p1),max_price:g.p2==null?null:Number(g.p2),currency:(g.p1!=null||g.p2!=null)?g.u:null};
  if(!f.category&&!f.province&&!f.manufacturer&&!f.model&&f.min_price==null&&f.max_price==null){toast('اختر معياراً واحداً على الأقل (النوع أو المحافظة أو السعر…) قبل الحفظ.');return}
  if(f.min_price!=null&&f.max_price!=null&&f.min_price>f.max_price){toast('السعر الأدنى أكبر من الأعلى.');return}
  var d=document.createElement('div');d.className='svp';d.id='svp';d.innerHTML='<b>حفظ هذا البحث</b><div class="ucb">'+crit(f).map(function(t){return '<span class="cond">'+X(t)+'</span>'}).join('')+'</div><label>اسم البحث<input id="sv-n" maxlength="60" placeholder="مثال: جت سكي ياماها في البصرة"></label><label>المنطقة (اختياري، للتنبيهات)<input id="sv-a" maxlength="80"></label><div class="ucb"><button class="btn btn-p" type="button" id="sv-ok">حفظ</button><button class="btn btn-o" type="button" id="sv-no" style="color:var(--b);border-color:var(--b)">إلغاء</button></div>';
  E('fb').insertAdjacentElement('afterend',d);E('sv-n').focus();E('sv-no').onclick=function(){d.remove()};
  E('sv-ok').onclick=function(){var n=E('sv-n').value.trim();if(!n){toast('اكتب اسماً للبحث.');return}var row=Object.assign({},f,{name:n,area:E('sv-a').value.trim()||null,user_id:AU.user.id});this.disabled=true;var bt=this;
   sbc().from('saved_searches').insert(row).select().maybeSingle().then(function(r){bt.disabled=false;if(r.error||!r.data){toast('تعذّر الحفظ: '+(r.error?PF.err.msg(r.error):'لم يتأكد الحفظ'));return}d.remove();toast('تم حفظ البحث. ستصلك تنبيهات عند نشر إعلان مطابق.')})}}
})();
/* ===== B45: مركز الإشعارات الموحّد — جرس + قائمة + سجل + Realtime + تفضيلات + Web Push (يعيد استخدام جدول notifications من B11) ===== */
var B45=(function(){
var X=PF.esc,PN=8,PS=20;
var S={uid:null,unread:0,items:[],ch:null,rt:'off',lost:false,seq:0,dt:null,ut:null,hist:{page:0,filter:'all',total:0,items:[],err:'',busy:false}};
var fd=function(x){try{return new Date(x).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}catch(e){return''}};
var MISS=function(e){var c=e&&e.code||'';return c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883'||c==='42703'};
var tl=function(n){return PF.notify.label(n.type)||'إشعار'};

function badge(){var b=E('bc'),bell=E('bell');if(b){b.textContent=S.unread>99?'99+':S.unread;b.hidden=!S.unread}
 if(bell)bell.setAttribute('aria-label',S.unread?'التنبيهات، '+S.unread+' غير مقروء':'التنبيهات')}
function fetchUnread(){var c=sbc(),u=S.uid;if(!c||!u)return Promise.resolve();
 return c.from('notifications').select('id',{count:'exact',head:true}).is('read_at',null).then(function(r){if(u!==S.uid||r.error)return;S.unread=r.count||0;badge();paintPanel('ok')})}
function poll(){if(S.uid&&!document.hidden)fetchUnread()}

function row(n){var h=PF.notify.href(n),un=!n.read_at;
 return '<div class="nfi'+(un?' un':'')+'"><button type="button" class="nfm" data-b45="open" data-id="'+X(n.id)+'" data-h="'+X(h)+'"><b>'+X(n.title||'')+(un?' <span class="nfn">جديد</span>':'')+'</b>'+(n.body?'<span dir="auto">'+X(n.body)+'</span>':'')+'<small>'+X(tl(n))+' · '+fd(n.created_at)+'</small></button>'+
 (un?'<button type="button" class="nfr" data-b45="read" data-id="'+X(n.id)+'" aria-label="تعليم كمقروء" title="تعليم كمقروء">✓</button>':'')+'</div>'}

/* ---------- القائمة المنسدلة من الجرس ---------- */
function panel(){var p=E('nfp');if(p)return p;p=document.createElement('div');p.id='nfp';p.className='nfp';p.hidden=true;p.setAttribute('role','region');p.setAttribute('aria-label','الإشعارات');document.body.appendChild(p);return p}
function place(){var p=E('nfp'),b=E('bell');if(!p||!b)return;var r=b.getBoundingClientRect(),W=Math.min(380,window.innerWidth-24);
 p.style.width=W+'px';p.style.left=Math.min(Math.max(12,r.right-W),window.innerWidth-W-12)+'px';p.style.top=Math.max(8,r.bottom+8)+'px'}
function paintPanel(st,er){var p=E('nfp');if(!p||p.hidden)return;
 var h='<div class="nfh"><b>الإشعارات'+(S.unread?' ('+S.unread+')':'')+'</b>'+(S.unread?'<button type="button" class="nfl" data-b45="all">تعليم الكل كمقروء</button>':'')+'</div><div class="nfb" aria-live="polite">';
 if(st==='load')h+='<p class="nfe">جارٍ التحميل…</p>';
 else if(st==='err')h+='<p class="nfe er">'+X(er||'')+'</p><p class="nfe"><button class="btn btn-p" type="button" data-b45="retry">إعادة المحاولة</button></p>';
 else if(!S.items.length)h+='<p class="nfe">لا توجد إشعارات بعد.</p>';
 else h+=S.items.map(row).join('');
 h+='</div>'+(S.rt==='down'?'<p class="nfs">التحديث الفوري متوقف مؤقتاً، يجري التحديث دورياً.</p>':'')+'<a class="nff" href="#alerts" data-b45="hist">عرض كل الإشعارات والإعدادات</a>';
 p.innerHTML=h}
function loadLatest(){var c=sbc(),u=S.uid;if(!c||!u)return;var q=++S.seq;
 c.from('notifications').select('*').order('created_at',{ascending:false}).limit(PN).then(function(r){if(u!==S.uid||q!==S.seq)return;
  if(r.error){paintPanel('err','تعذّر تحميل الإشعارات: '+PF.err.msg(r.error));return}S.items=r.data||[];paintPanel('ok')})}
function openP(){if(!S.uid)return;var p=panel(),b=E('bell');p.hidden=false;if(b)b.setAttribute('aria-expanded','true');place();paintPanel(S.items.length?'ok':'load');loadLatest();fetchUnread()}
function closeP(){var p=E('nfp'),b=E('bell');if(p)p.hidden=true;if(b)b.setAttribute('aria-expanded','false')}

/* ---------- تعليم كمقروء (تحديث متفائل + تراجع عند الخطأ؛ RLS يمنع تعديل إشعار غيرك) ---------- */
function lists(){return[S.items,S.hist.items]}
function setRead(ids,val){var d=0;ids.forEach(function(id){var seen=false;lists().forEach(function(L){L.forEach(function(n){if(n.id===id){if(!seen){seen=true;if(val&&!n.read_at)d--;else if(!val&&n.read_at)d++}n.read_at=val}})})});
 S.unread=Math.max(0,S.unread+d);badge();paintPanel('ok');histPaint()}
function markRead(id){var c=sbc();if(!c||!S.uid||!id)return;var now=new Date().toISOString(),was=lists().some(function(L){return L.some(function(n){return n.id===id&&n.read_at})});if(was)return;
 setRead([id],now);
 c.from('notifications').update({read_at:now}).eq('id',id).eq('user_id',S.uid).is('read_at',null).then(function(r){if(r.error){setRead([id],null);fetchUnread();toast('تعذّر التحديث: '+PF.err.msg(r.error))}})}
function markAll(){var c=sbc();if(!c||!S.uid||!S.unread)return;var now=new Date().toISOString();
 lists().forEach(function(L){L.forEach(function(n){if(!n.read_at)n.read_at=now})});S.unread=0;badge();paintPanel('ok');histPaint();
 c.from('notifications').update({read_at:now}).eq('user_id',S.uid).is('read_at',null).then(function(r){
  if(r.error){toast('تعذّر التحديث: '+PF.err.msg(r.error));fetchUnread();loadLatest();histLoad(true);return}toast('عُلّمت كل الإشعارات كمقروءة.')})}

/* ---------- Realtime: اشتراك واحد لكل مستخدم، يُزال عند الخروج/مغادرة الصفحة، ويُعاد جلب ما فات عند عودة الاتصال ---------- */
function stop(){var ch=S.ch;S.ch=null;S.rt='off';clearTimeout(S.dt);clearTimeout(S.ut);if(ch){try{sbc().removeChannel(ch)}catch(e){}}}
function byNew(a,b){return a.created_at<b.created_at?1:a.created_at>b.created_at?-1:0}
function onRow(ev){var n=ev&&ev.new;if(!n||!n.id||n.user_id!==S.uid)return;
 var old=null;S.items.forEach(function(x){if(x.id===n.id)old=x});
 S.items=S.items.filter(function(x){return x.id!==n.id});S.items.push(n);S.items.sort(byNew);S.items=S.items.slice(0,PN);
 if(ev.eventType==='INSERT'){if(old)return;if(!n.read_at){S.unread++;toast('إشعار جديد: '+(n.title||''))}}
 else{if(old&&!n.read_at&&n.created_at>old.created_at)toast('إشعار جديد: '+(n.title||''));clearTimeout(S.ut);S.ut=setTimeout(fetchUnread,300)}
 badge();paintPanel('ok');histSoft()}
function catchUp(){fetchUnread();var p=E('nfp');if(p&&!p.hidden)loadLatest();histSoft()}
function start(){var c=sbc(),uid=S.uid;if(!c||!uid)return;stop();
 var ch=c.channel('b45:'+uid);S.ch=ch;
 ch.on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:'user_id=eq.'+uid},onRow).subscribe(function(st){
  if(S.ch!==ch||uid!==S.uid)return;
  if(st==='SUBSCRIBED'){var was=S.lost;S.rt='live';S.lost=false;if(was)catchUp();else paintPanel('ok')}
  else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'||st==='CLOSED'){S.rt='down';S.lost=true;paintPanel('ok')}})}
function sync(){var u=AU.user?AU.user.id:null;
 if(u===S.uid&&(S.ch||!u)){if(u)fetchUnread();return}
 if(u!==S.uid){stop();S.uid=u;S.items=[];S.unread=0;S.hist={page:0,filter:'all',total:0,items:[],err:'',busy:false};closeP();var p=E('nfp');if(p)p.innerHTML=''}
 badge();if(!u)return;start();fetchUnread()}
window.addEventListener('pagehide',stop);
window.addEventListener('pageshow',function(e){if(e.persisted&&S.uid){start();catchUp()}});
window.addEventListener('online',function(){if(S.uid)start()});
window.addEventListener('offline',function(){if(S.uid){S.rt='down';S.lost=true;paintPanel('ok')}});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&S.uid&&S.rt!=='live')catchUp()});

/* ---------- صفحة السجل (#alerts) مع تنقّل بين الصفحات ---------- */
function histSoft(){if(!E('b45h'))return;clearTimeout(S.dt);S.dt=setTimeout(function(){histLoad(true)},250)}
function histLoad(silent){var c=sbc(),u=S.uid,H=S.hist;if(!c||!u||!E('b45h'))return;H.busy=true;
 if(!silent&&E('b45l'))E('b45l').innerHTML='<p class="nfe">جارٍ التحميل…</p>';
 var from=H.page*PS,q=c.from('notifications').select('*',{count:'exact'}).order('created_at',{ascending:false}).range(from,from+PS-1);
 if(H.filter==='unread')q=q.is('read_at',null);
 q.then(function(r){H.busy=false;if(u!==S.uid||!E('b45h'))return;
  if(r.error){if(r.error.code==='PGRST103'&&H.page>0){H.page=0;histLoad();return}H.err='تعذّر تحميل الإشعارات: '+PF.err.msg(r.error);histPaint();return}
  H.err='';H.items=r.data||[];H.total=r.count||0;
  if(!H.items.length&&H.page>0){H.page=Math.max(0,Math.ceil(H.total/PS)-1);if(H.total>0)return histLoad()}
  histPaint()})}
function histPaint(){var el=E('b45l');if(!el||!E('b45h'))return;var H=S.hist;
 if(H.err){el.innerHTML='<div class="ucc" style="color:#a02a1c">'+X(H.err)+'<div class="ucb"><button class="btn btn-p" type="button" data-b45="hretry">إعادة المحاولة</button></div></div>';return}
 if(!H.items.length){el.innerHTML='<div class="ucc" style="text-align:center">'+(H.filter==='unread'?'لا توجد إشعارات غير مقروءة.':'لا توجد إشعارات بعد.<br>ستصلك هنا الرسائل وتحديثات الطلبات وانخفاض أسعار إعلاناتك المحفوظة وتغيّر حالة إعلاناتك.')+'</div>';return}
 var pages=Math.max(1,Math.ceil(H.total/PS));
 el.innerHTML='<div class="nfls">'+H.items.map(row).join('')+'</div>'+(pages>1?'<div class="nfpg"><button type="button" class="nfbtn" data-b45="prev"'+(H.page<=0?' disabled':'')+'>السابق</button><span>صفحة '+(H.page+1)+' من '+pages+'</span><button type="button" class="nfbtn" data-b45="next"'+(H.page>=pages-1?' disabled':'')+'>التالي</button></div>':'')}
function history(el){var H=S.hist;H.page=0;H.filter='all';H.items=[];H.err='';H.total=0;
 el.innerHTML='<div id="b45h"><div class="nfbar"><div class="nfchips"><button type="button" class="on" data-b45="f" data-f="all">الكل</button><button type="button" data-b45="f" data-f="unread">غير المقروءة</button></div><button class="btn btn-p" type="button" data-b45="all">تعليم الكل كمقروء</button></div><div id="b45l" aria-live="polite"></div><div id="b45pf"></div><div id="b45p"></div></div>';
 histLoad();prefs();push()}

/* ---------- تفضيلات الإشعارات (جدول notification_preferences) ---------- */
var PREF=[['messages','الرسائل والمحادثات'],['saved_ads','الإعلانات والبحوث المحفوظة (انخفاض السعر وتطابق البحث)'],['requests','تغيّرات الطلبات والاستفسارات والردود'],['subscriptions','تنبيهات الاشتراك (عند توفر نظام اشتراكات)']];
function prefs(){var box=E('b45pf'),c=sbc(),u=S.uid;if(!box||!c||!u)return;
 box.innerHTML='<div class="ucc"><h3>تفضيلات الإشعارات</h3><p>جارٍ التحميل…</p></div>';
 c.from('notification_preferences').select('*').eq('user_id',u).maybeSingle().then(function(r){var b=E('b45pf');if(!b||u!==S.uid)return;
  if(r.error){b.innerHTML='<div class="ucc"><h3>تفضيلات الإشعارات</h3><p'+(MISS(r.error)?'>إعدادات الإشعارات غير مفعّلة على الخادم بعد (يلزم تشغيل b45_notifications.sql).':' style="color:#a02a1c">تعذّر تحميل التفضيلات: '+X(PF.err.msg(r.error)))+'</p>'+(MISS(r.error)?'':'<div class="ucb"><button class="btn btn-p" type="button" data-b45="pretry">إعادة المحاولة</button></div>')+'</div>';return}
  var d=r.data||{};b.innerHTML='<div class="ucc"><h3>تفضيلات الإشعارات</h3>'+PREF.map(function(p){return '<label class="nfck"><input type="checkbox" data-b45p="'+p[0]+'"'+(d[p[0]]===false?'':' checked')+'><span>'+X(p[1])+'</span></label>'}).join('')+'<small>الإشعارات الإدارية والأمنية وحالة إعلانك أو نشاطك والبلاغات لا يمكن إيقافها.</small></div>'})}
document.addEventListener('change',function(e){var t=e.target.closest&&e.target.closest('[data-b45p]');if(!t||!S.uid)return;var k=t.dataset.b45p,v=t.checked,row={user_id:S.uid,updated_at:new Date().toISOString()};row[k]=v;t.disabled=true;
 sbc().from('notification_preferences').upsert(row,{onConflict:'user_id'}).then(function(r){t.disabled=false;if(r.error){t.checked=!v;toast('تعذّر حفظ التفضيل: '+PF.err.msg(r.error));return}toast('حُفظ التفضيل.')})});

/* ---------- إشعارات المتصفح (Web Push): لا يُطلب الإذن إلا بعد ضغط المستخدم، ولا يظهر الزر إلا إذا ضُبطت المفاتيح والخدمة الخلفية ---------- */
function pcfg(){var cf=window.BAHR_CONFIG||{};return!!(cf.vapidPublicKey&&cf.pushEnabled===true)}
function u8(s){var p='='.repeat((4-s.length%4)%4),b=(s+p).replace(/-/g,'+').replace(/_/g,'/'),r=atob(b),a=new Uint8Array(r.length);for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a}
function pbox(h){var b=E('b45p');if(b)b.innerHTML='<div class="ucc"><h3>إشعارات المتصفح</h3>'+h+'</div>'}
function push(){if(!E('b45p'))return;
 if(!pcfg())return pbox('<p>غير مفعّلة بعد: لم تُضبط مفاتيح Push وخدمة الإرسال الخلفية لهذا الموقع. الإشعارات داخل الموقع تعمل بشكل طبيعي.</p>');
 if(!('serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window))return pbox('<p>متصفحك لا يدعم إشعارات المتصفح (على iPhone يلزم إضافة الموقع إلى الشاشة الرئيسية أولاً).</p>');
 if(Notification.permission==='denied')return pbox('<p>الإشعارات محظورة لهذا الموقع من إعدادات المتصفح. فعّلها من هناك ثم أعد المحاولة.</p>');
 navigator.serviceWorker.getRegistration('/').then(function(reg){return reg&&reg.pushManager?reg.pushManager.getSubscription():null}).then(function(sub){
  pbox(sub?'<p>مفعّلة على هذا الجهاز.</p><div class="ucb"><button class="nfbtn" type="button" data-b45="poff">إيقاف على هذا الجهاز</button></div>':'<p>استلم تنبيهاتك حتى عندما يكون الموقع مغلقاً.</p><div class="ucb"><button class="btn btn-p" type="button" data-b45="pon">تفعيل إشعارات المتصفح</button></div>')},function(){pbox('<p style="color:#a02a1c">تعذّر قراءة حالة الإشعارات.</p>')})}
function pushOn(btn){var cf=window.BAHR_CONFIG||{};btn.disabled=true;
 navigator.serviceWorker.register('/sw.js').then(function(){return navigator.serviceWorker.ready}).then(function(reg){return Notification.requestPermission().then(function(p){if(p!=='granted')throw{pfMsg:'لم تمنح إذن الإشعارات.'};return reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(cf.vapidPublicKey)})})})
 .then(function(sub){var j=sub.toJSON();return sbc().rpc('b45_push_register',{p_endpoint:sub.endpoint,p_p256dh:j.keys.p256dh,p_auth:j.keys.auth,p_ua:navigator.userAgent}).then(function(r){if(r.error){sub.unsubscribe();throw r.error}toast('تم تفعيل إشعارات المتصفح على هذا الجهاز.')})})
 .catch(function(e){toast(e&&e.pfMsg?e.pfMsg:'تعذّر التفعيل: '+PF.err.msg(e))}).then(push)}
function pushOff(){navigator.serviceWorker.getRegistration('/').then(function(reg){return reg&&reg.pushManager.getSubscription()}).then(function(sub){if(!sub)return;var ep=sub.endpoint;return sub.unsubscribe().then(function(){return sbc().rpc('b45_push_unregister',{p_endpoint:ep})})}).catch(function(e){toast('تعذّر الإيقاف: '+PF.err.msg(e))}).then(push)}

/* ---------- التفويض العام للنقرات ---------- */
document.addEventListener('click',function(e){var t=e.target,b=t.closest('[data-b45]');
 if(t.closest('#bell')&&AU.user){e.preventDefault();var p=E('nfp');if(p&&!p.hidden)closeP();else openP();return}
 if(!b){var p2=E('nfp');if(p2&&!p2.hidden&&!t.closest('#nfp'))closeP();return}
 var a=b.dataset.b45,H=S.hist;
 if(a==='hist'){closeP();return}
 if(a==='retry'){paintPanel('load');loadLatest();return}
 if(a==='all'){markAll();return}
 if(a==='read'){markRead(b.dataset.id);return}
 if(a==='open'){markRead(b.dataset.id);closeP();location.hash=b.dataset.h||'#alerts';return}
 if(a==='hretry'){histLoad();return}
 if(a==='pretry'){prefs();return}
 if(a==='prev'||a==='next'){if(H.busy)return;H.page=Math.max(0,H.page+(a==='next'?1:-1));histLoad();var l=E('b45h');if(l&&l.scrollIntoView)l.scrollIntoView({block:'start'});return}
 if(a==='f'){H.filter=b.dataset.f;H.page=0;[].forEach.call(document.querySelectorAll('.nfchips button'),function(x){x.classList.toggle('on',x===b)});histLoad();return}
 if(a==='pon'){pushOn(b);return}
 if(a==='poff'){pushOff();return}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var p=E('nfp');if(p&&!p.hidden){closeP();var b=E('bell');if(b&&b.focus)b.focus()}}});
window.addEventListener('hashchange',closeP);
window.addEventListener('resize',function(){var p=E('nfp');if(p&&!p.hidden)place()});

return{sync:sync,poll:poll,badge:badge,history:history,_s:S};
})();
/* B10 */
/* ===== B10: الملفات الشخصية وصفحات البائعين (RLS في الخادم؛ الهاتف لا يظهر إلا بموافقة صاحبه) ===== */
(function(){
var X=PF.esc;
var K={sell_vessels:'بيع الجت سكي والقوارب',sell_parts:'بيع المحركات وقطع الغيار',repair:'صيانة وإصلاح المعدات البحرية',wholesale:'بيع الجملة والتجهيزات البحرية',rental:'تأجير المعدات البحرية'};
var PV=['بغداد','البصرة','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var LS='id,category,title,price,currency,condition,province,listing_images(storage_path,sort_order)';
var fd=function(x){try{return new Date(x).toLocaleDateString('ar-IQ',{year:'numeric',month:'long',day:'numeric'})}catch(e){return''}};
var nm=function(p){return p.business_name||p.display_name||'مستخدم بحر'};
var av=function(p){var u=p.avatar_path?sbc().storage.from('avatars').getPublicUrl(p.avatar_path).data.publicUrl:'';return u?'<img class="pav" src="'+X(u)+'" alt="'+X(nm(p))+'">':'<div class="pav" aria-hidden="true">'+X(nm(p).charAt(0))+'</div>'};
var acts=function(p){var a=(p.activity_types||[]).filter(function(k){return K[k]});return a.length?'<div class="achips">'+a.map(function(k){return '<span>'+K[k]+'</span>'}).join('')+'</div>':''};
function dg(p){var d=String(p||'').replace(/[٠-٩]/g,function(c){return c.charCodeAt(0)-1632}).replace(/\D/g,'');if(d.indexOf('00')===0)d=d.slice(2);else if(d[0]==='0')d='964'+d.slice(1);return d}
function contact(p){var n=AUX.np(p&&p.phone),d=n.replace('+','');return n?'<div class="pcn"><a class="btn btn-p" href="tel:'+n+'">'+ic('chat')+' اتصال هاتفي</a><a class="btn btn-o" style="color:var(--b);border-color:var(--b)" href="https://wa.me/'+d+'" target="_blank" rel="noopener">واتساب</a></div>':''}
var vb=function(p){return p.verified?'<span class="vb">موثّق من بحر</span>':''};
var st={p:null,s:null,cur:null};
B10.reset=function(k){st[k]=null};

/* ---------- صفحة البائع العامة ---------- */
B10.seller=function(id){if(st.s===id)return;var c=sbc(),el=E('slc');
  var bad=function(t){el.innerHTML='<div class="pcard adE">'+X(t)+'</div>'};
  el.innerHTML='<div class="pcard adE">جارٍ التحميل…</div>';if(!c){bad('الاتصال بـ Supabase غير جاهز.');return}
  c.from('public_profiles').select('*').eq('id',id).maybeSingle().then(function(r){
   if(r.error)throw r.error;if(!r.data){bad('هذه الصفحة غير موجودة.');return}var p=r.data;
   return c.from('listing_owners').select('listing_id').eq('owner_id',id).then(function(o){if(o.error)throw o.error;var ids=(o.data||[]).map(function(x){return x.listing_id});
    return(ids.length?c.from('listings').select(LS).in('id',ids).eq('status','published').order('created_at',{ascending:false}).limit(100):Promise.resolve({data:[]})).then(function(l){
     if(l.error)throw l.error;var L=(l.data||[]).map(function(x){return{id:x.id,t:x.category==='accessory'?'acc':x.category,n:x.title,p:Number(x.price),cur:x.currency,pv:x.province||'',c:x.condition==='new'?'جديد':'مستعمل',img:(x.listing_images||[]).slice().sort(function(i,j){return i.sort_order-j.sort_order}).map(function(i){return c.storage.from('listing-images').getPublicUrl(i.storage_path).data.publicUrl})}});
     st.s=id;document.title=nm(p)+' | بحر';
     el.innerHTML='<div class="pcard"><div class="phd">'+av(p)+'<div><h1>'+X(nm(p))+vb(p)+'</h1><p>'+(p.province?ic('pin')+' '+X(p.province)+(p.area?'، '+X(p.area):''):'')+'</p><p>عضو منذ '+fd(p.created_at)+' · '+L.length+' إعلان منشور</p></div></div>'+acts(p)+(p.bio?'<p style="white-space:pre-wrap;margin:14px 0 0">'+X(p.bio)+'</p>':'')+contact(p)+'</div>'+
      '<h2 style="margin:0 0 12px;font-size:20px">إعلانات البائع</h2>'+(L.length?'<div class="mg">'+L.map(function(x){return '<article class="mc"><div class="thumb">'+thumb(x)+B11.heart(x.id)+'</div><div class="cb"><h3>'+X(x.n)+'</h3><div class="price">'+fm(x.p,x.cur)+'</div><div class="meta"><span>'+ic('pin')+X(x.pv)+'</span><span class="cond">'+x.c+'</span></div><a class="btn" href="#p-'+X(x.id)+'">عرض التفاصيل</a></div></article>'}).join('')+'</div>':'<div class="pcard adE">لا توجد إعلانات منشورة لهذا البائع حالياً.</div>')})})
  }).catch(function(e){bad('تعذّر تحميل الصفحة: '+PF.err.msg(e))})};

/* ---------- ملفي الشخصي (تعديل وحفظ في Supabase) ---------- */
B10.profile=function(){var uid=AU.user.id;if(st.p===uid)return;var c=sbc(),el=E('pfc');
  el.innerHTML='<div class="pcard adE">جارٍ التحميل…</div>';if(!c){el.innerHTML='<div class="pcard adE">الاتصال بـ Supabase غير جاهز.</div>';return}
  c.from('profiles').select('*').eq('id',uid).maybeSingle().then(function(r){if(r.error)throw r.error;st.p=uid;form(r.data||{},uid)})
   .catch(function(e){el.innerHTML='<div class="pcard adE er">تعذّر تحميل الملف: '+X(PF.err.msg(e))+'</div>'})};
function form(p,uid){var md=AU.user.user_metadata||{},c=sbc(),pa=p.avatar_path||null,el=E('pfc'),A=p.activity_types||[];
  var q=function(i){return document.getElementById(i)};
  el.innerHTML='<div class="pcard"><div class="phd" id="pf-h"></div><p style="color:var(--mut);margin:12px 0 0">عضو منذ '+fd(AU.user.created_at)+' · '+(p.verified?'<span class="vb">حسابك موثّق من بحر</span>':'الحساب غير موثّق. التوثيق تمنحه إدارة بحر بعد تحقق فعلي، ولا يتغيّر بإدخال رقم هاتف أو اسم نشاط.')+'</p></div>'+
   '<form class="pcard pff" id="pf-f" novalidate><label>الاسم<input id="pf-n" maxlength="80" value="'+X(p.display_name||md.full_name||'')+'"></label><label>اسم النشاط التجاري (اختياري)<input id="pf-b" maxlength="80" value="'+X(p.business_name||'')+'"></label>'+
   '<label>المحافظة<select id="pf-p"><option value="">اختر المحافظة</option>'+PV.map(function(v){return '<option'+(v===p.province?' selected':'')+'>'+v+'</option>'}).join('')+'</select></label><label>المنطقة<input id="pf-a" maxlength="80" value="'+X(p.area||'')+'"></label>'+
   '<label class="w">الصورة الشخصية (JPG/PNG/WebP حتى 2 ميغابايت)<input id="pf-i" type="file" accept="image/jpeg,image/png,image/webp"></label>'+
   '<div class="w pck"><b>نوع النشاط (يمكن اختيار أكثر من نوع وتعديله لاحقاً)</b>'+Object.keys(K).map(function(k){return '<label><input type="checkbox" name="pf-k" value="'+k+'"'+(A.indexOf(k)>-1?' checked':'')+'>'+K[k]+'</label>'}).join('')+'</div>'+
   '<label>رقم التواصل (لا يغيّر رقم تسجيل الدخول)<input id="pf-t" type="tel" inputmode="tel" dir="ltr" maxlength="20" value="'+X(p.phone||md.phone||'')+'"></label><div class="pck" style="align-self:end"><label><input id="pf-s" type="checkbox"'+(p.show_phone?' checked':'')+'>عرض رقمي للزوار في صفحتي العامة</label></div>'+
   '<label class="w">نبذة مختصرة<textarea id="pf-o" maxlength="500">'+X(p.bio||'')+'</textarea></label><div class="w pcn"><button class="btn btn-p" type="submit" id="pf-sv">حفظ</button><a class="btn btn-o" style="color:var(--b);border-color:var(--b)" href="#u-'+uid+'">عرض صفحتي العامة</a></div><div class="w pmsg" id="pf-m" role="status"></div></form>';
  var head=function(){q('pf-h').innerHTML=av({display_name:q('pf-n').value||md.full_name,business_name:q('pf-b').value,avatar_path:pa})+'<div><h1>'+X(q('pf-b').value||q('pf-n').value||'ملفي الشخصي')+'</h1><p dir="ltr" style="text-align:start">'+X(AUX.mail(AU.user)||AUX.ph(AU.user))+'</p></div>'};head();
  var msg=function(t,ok){var m=q('pf-m');m.className='w pmsg '+(ok?'ok':'er');m.textContent=t};
  q('pf-i').addEventListener('change',function(){var f=this.files[0];if(!f)return;
   var inp=this;msg('جارٍ رفع الصورة…',1);
   PF.files.upload('avatars',f,{prefix:'avatar',max:2097152}).then(function(path){pa=path;head();msg('تم رفع الصورة. اضغط «حفظ» لتثبيتها في ملفك.',1)},function(e){inp.value='';msg(PF.files.msg(e))})});
  q('pf-f').addEventListener('submit',function(e){e.preventDefault();
   var n=q('pf-n').value.trim(),ph=q('pf-t').value.trim(),sp=q('pf-s').checked,d=dg(ph);
   if(n.length<2){msg('اكتب اسمك (حرفان على الأقل).');return}
   if(ph&&(d.length<8||d.length>15)){msg('رقم التواصل غير صالح.');return}
   if(sp&&!ph){msg('أدخل رقم التواصل أولاً إن أردت عرضه.');return}
   var row={id:uid,display_name:n,business_name:q('pf-b').value.trim()||null,avatar_path:pa,province:q('pf-p').value||null,area:q('pf-a').value.trim()||null,bio:q('pf-o').value.trim()||null,phone:ph||null,show_phone:sp,
    activity_types:[].map.call(document.querySelectorAll('input[name="pf-k"]:checked'),function(x){return x.value})};
   var b=q('pf-sv');b.disabled=true;
   c.from('profiles').upsert(row,{onConflict:'id'}).select().maybeSingle().then(function(r){b.disabled=false;
    if(r.error){msg('تعذّر الحفظ: '+PF.err.msg(r.error));return}if(!r.data){msg('لم يتأكد الحفظ. حاول مرة أخرى.');return}
    msg('تم حفظ ملفك الشخصي.',1);toast('تم حفظ ملفك الشخصي.');head()})})}

/* ---------- ربط تفاصيل الإعلان بصفحة البائع ---------- */
B10.attach=function(lid){var c=sbc();if(!c)return;st.cur=lid;
  c.from('listing_owners').select('owner_id').eq('listing_id',lid).maybeSingle().then(function(o){if(o.error||!o.data)return;
   return c.from('public_profiles').select('id,display_name,business_name,phone,verified').eq('id',o.data.owner_id).maybeSingle().then(function(r){
    var p=r.data,s=document.querySelector('#dw .sel');if(r.error||!p||!s||st.cur!==lid)return;var ct=contact(p);
    s.insertAdjacentHTML('beforebegin','<div class="sel"><b>البائع:</b> <a class="sl" href="#u-'+X(p.id)+'">'+X(nm(p))+'</a>'+vb(p)+'</div>'+ct+''+(AU.user&&AU.user.id===p.id?'':'<div class="pcn"><button class="btn btn-p" data-cn="listing|'+lid+'|'+p.id+'" type="button">راسل صاحب الإعلان</button></div>'));if(ct)s.remove()})}).catch(function(){})};
})();
/* ===== ADM2: التحكم بمحتوى المنصة (الواجهة الرئيسية، الأقسام، حقول التصنيفات، الصور).
   الحفظ بنفس آلية B59: جدول b59_site عبر دالة الخادم b59_set_site المحصورة بالمدير (لا SQL جديد ولا تغيير سياسات).
   لا يُعلن نجاح الحفظ قبل قراءة القيمة من الخادم ومطابقتها. المطبَّق على الموقع العام: نصوص وأزرار الشرائح، خلفيات الشرائح (استبدال/حذف عبر site-assets)، موضع النص، وترتيب وإظهار/إخفاء عناصر الواجهة.
   الأقسام وحقول التصنيفات: إعدادات محفوظة غير مطبّقة على الموقع العام بعد. ===== */
window.ADM2=(function(){
var K={hero:'home_hero',cat:'categories',fld:'category_fields'},DEF=null,
BASE=[['boat','القوارب','جديدة ومستعملة'],['jetski','جت سكي','أحدث الإعلانات'],['engine','المحركات','داخلية وخارجية'],['parts','قطع الغيار','كتالوج BAHR PARTS'],['services','الورش والخدمات','صيانة وتصليح'],['accessory','المعدات والإكسسوارات','إكسسوارات بحرية'],['stores','المتاجر والموردون','أنشطة تجارية'],['tech','BAHR TECH','مركز فني — قيد التجهيز']],
TY={text:'نص',number:'رقم',price:'سعر',select:'قائمة منسدلة',year:'السنة',model:'الموديل',brand:'الشركة المصنعة'},
PRE={year:['السنة','year'],model:['الموديل','model'],brand:['الشركة المصنعة','brand'],price:['السعر','price']},
SN=['يخت','جت سكي','محركات وخدمات'],TG=[['search','مربع البحث'],['chips','أزرار الوصول السريع'],['trust','شريط الثقة']],
S={sub:'hero',busy:false,dirty:false,hero:null,cat:null,fld:null,fc:'boat',sl:0,bk:null,bkErr:'',url:null};
var esc=function(v){return PF.esc(v)},$=function(i){return document.getElementById(i)};
function okT(v,n){return typeof v==='string'&&v.trim().length>0&&v.length<=(n||300)&&!/[<>]/.test(v)}
function okH(h){return typeof h==='string'&&(/^#[A-Za-z0-9_-]{1,60}$/.test(h)||/^https:\/\/[^\s<>"']{3,300}$/.test(h))}
function imgBase(){return String((window.BAHR_CONFIG||{}).supabaseUrl||'').replace(/\/+$/,'')+'/storage/v1/object/public/site-assets/'}
function okImg(u){return u===''||u==='none'||(typeof u==='string'&&/^https:\/\/[^\s<>"'()]{10,400}$/.test(u)&&u.indexOf(imgBase())===0&&u.indexOf('..')<0)}
function okPos(p){return p==='left'||p==='center'||p==='right'}
function okOrd(o){return Array.isArray(o)&&o.length===3&&['search','chips','trust'].every(function(k){return o.indexOf(k)>-1})}
function snap(){var H=$('home');if(!H||DEF)return;var o={slides:[]};[].forEach.call(H.querySelectorAll('.hsl-c'),function(e){var p=e.querySelector('.hsl-t'),g=p&&p.querySelector('.gd'),b=e.querySelectorAll('.hsl-b a'),r=function(a){return a?{t:a.textContent.trim(),h:a.getAttribute('href')||''}:{t:'',h:''}},l=e.querySelector('.lead');o.slides.push({img:'',src:(function(){var im=H.querySelectorAll('.hsl-bg img')[o.slides.length];return im?im.getAttribute('src')||'':''})(),t:p&&p.firstChild?String(p.firstChild.nodeValue||'').trim():'',g:g?g.textContent.trim():'',l:l?l.textContent.trim():'',b1:r(b[0]),b2:r(b[1])})});o.pos='left';o.ord=['search','chips','trust'];if(o.slides.length===3)DEF=o}
function applyLay(H,v){
 if(okOrd(v.ord)){var m={search:'#search',chips:'.hero-chips',trust:'.trust'},els=v.ord.map(function(k){return H.querySelector(m[k])});
  if(els.every(Boolean)&&els[0].parentNode===els[1].parentNode&&els[1].parentNode===els[2].parentNode){var P=els[0].parentNode;els.forEach(function(x){P.appendChild(x)})}}
 var css='';
 if(v.pos==='right')css='.hero .hero-t{margin-left:auto;margin-right:0}section.hero::before{background:linear-gradient(270deg,rgba(4,17,43,.88),rgba(4,17,43,.62) 42%,rgba(4,17,43,.05) 72%)}';
 else if(v.pos==='center')css='.hero .hero-t{margin-left:auto;margin-right:auto;text-align:center}.hero .hsl-b,.hero .hero-chips,.hero .trust{justify-content:center}section.hero::before{background:rgba(4,17,43,.62)}';
 var el=document.getElementById('adm2-lay');
 if(!css){if(el)el.remove();return}
 if(!el){el=document.createElement('style');el.id='adm2-lay';document.head.appendChild(el)}
 el.textContent='@media(min-width:981px){'+css+'}'}
function applyHero(v){var H=$('home');if(!H||!v||typeof v!=='object')return;var sl=H.querySelectorAll('.hsl-c');
 (Array.isArray(v.slides)?v.slides:[]).forEach(function(s,i){var e=sl[i];if(!e||!s||typeof s!=='object')return;var p=e.querySelector('.hsl-t'),g=p&&p.querySelector('.gd');
  if(p&&okT(s.t,120)&&p.firstChild&&p.firstChild.nodeType===3)p.firstChild.nodeValue=s.t+' ';
  if(g&&okT(s.g,120))g.textContent=s.g;
  var ld=e.querySelector('.lead');if(ld&&okT(s.l,300))ld.textContent=s.l;
   var bg=H.querySelectorAll('.hsl-bg')[i];if(bg&&typeof s.img==='string'&&s.img){if(s.img==='none')bg.classList.add('noimg');else if(okImg(s.img)){var im=bg.querySelector('img'),so=bg.querySelector('source');if(im){im.removeAttribute('srcset');im.src=s.img}if(so)so.setAttribute('srcset',s.img);bg.classList.add('cust');bg.classList.remove('noimg')}}
  var bs=e.querySelectorAll('.hsl-b a');[s.b1,s.b2].forEach(function(b,j){var a=bs[j];if(!a||!b||typeof b!=='object')return;if(okT(b.t,60))a.textContent=b.t;
   if(okH(b.h)&&b.h!==a.getAttribute('href')){a.setAttribute('href',b.h);a.removeAttribute('data-mt');a.removeAttribute('data-go');if(/^https:/.test(b.h)){a.target='_blank';a.rel='noopener'}}})});
 [['search','#search'],['chips','.hero-chips'],['trust','.trust']].forEach(function(t){if(v[t[0]]===!1){var el=H.querySelector(t[1]);if(el)el.style.display='none'}});applyLay(H,v)}
function boot(n){var c=window.sbc&&sbc();if(!c){if((n||0)<40)setTimeout(function(){boot((n||0)+1)},300);return}try{c.from('b59_site').select('value').eq('key',K.hero).maybeSingle().then(function(r){if(r.error||!r.data)return;applyHero(r.data.value)},function(){})}catch(x){}}
snap();boot(0);
function rd(k){return sbc().from('b59_site').select('value').eq('key',k).maybeSingle().then(function(r){if(r.error)throw r.error;return r.data?r.data.value:null})}
function cn(v){if(Array.isArray(v))return '['+v.map(cn).join(',')+']';if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(function(k){return JSON.stringify(k)+':'+cn(v[k])}).join(',')+'}';return JSON.stringify(v)}
function wr(k,v){return sbc().rpc('b59_set_site',{p_key:k,p_value:v}).then(function(r){if(r.error)throw r.error;return rd(k)}).then(function(x){if(cn(x)!==cn(v))throw{message:'verify_failed'};return true})}
function em(e){var m=String(e&&e.message||e||''),c=e&&e.code||'';if(m.indexOf('forbidden')>-1)return 'غير مصرح: هذه الصفحة للمدير العام فقط.';if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'نظام المحتوى غير مفعّل على الخادم (يلزم b59_cms.sql).';if(/bad_url/.test(m))return 'الرابط يجب أن يبدأ بـ https://';if(/bad_text/.test(m))return 'غير مسموح بالرمزين < و > في النص.';if(/bad_key|invalid_key|unknown_key|not.?allowed|check constraint|violates/i.test(m))return 'رفض الخادم هذا الإعداد: غالباً دالة b59_set_site لا تقبل هذا المفتاح بعد (يلزم تحديث SQL لاحقاً). لم يُحفظ شيء.';if(/verify_failed/.test(m))return 'لم يتأكد الحفظ من الخادم: القيمة المقروءة لا تطابق ما أُرسل. لا تعتمد على هذا التغيير.';if(/Failed to fetch|network/i.test(m))return 'انقطع الاتصال. أعد المحاولة.';return 'تعذّر الحفظ. حاول مرة ثانية.'}
function note(k,t){var m=$('a2m');if(!m)return;m.className='admsg '+(k||'');m.textContent=t||'';m.style.display=t?'block':'none'}
function st(t){var e=$('a2s');if(e)e.textContent=t||''}
function dirty(){S.dirty=true;st('تعديلات غير محفوظة: المعروض معاينة فقط ولم يصل إلى الخادم بعد.')}
function B(){return $('a2b')}
function shell(){$('adm').innerHTML='<h2>واجهة الموقع والأقسام</h2><p class="adE" style="padding:0 0 10px;text-align:start">«حفظ» يخزّن التعديل في الخادم وينشره فور نجاحه وتأكّده؛ أما المعاينة فلا تغيّر شيئاً.</p><div class="adc" id="a2t">'+[['hero','الواجهة الرئيسية'],['cat','الأقسام'],['fld','حقول التصنيفات'],['img','الصور والمحتوى']].map(function(t){return '<button type="button" data-a2="sub" data-v="'+t[0]+'"'+(S.sub===t[0]?' class="on"':'')+'>'+t[1]+'</button>'}).join('')+'</div><div class="admsg" id="a2m" role="status"></div><p class="adE" id="a2s" style="padding:0 0 10px;text-align:start"></p><div id="a2b"></div>'}
function lbl(l,f,v,ml,k,dir,ta){return '<label class="a2l">'+l+(ta?'<textarea data-a2i="'+k+'" data-f="'+f+'" maxlength="'+ml+'" rows="3">'+esc(v)+'</textarea>':'<input data-a2i="'+k+'" data-f="'+f+'" maxlength="'+ml+'" value="'+esc(v)+'"'+(dir?' dir="ltr"':'')+'>')+'</label>'}
function err(e,rt){B().innerHTML='<div class="adE er">'+esc(em(e))+'<br><br><button type="button" class="ab pr" data-a2="reload">إعادة المحاولة</button></div>'}
/* ---- الواجهة الرئيسية ---- */
function hf(v){v=v&&typeof v==='object'?v:{};var f={slides:[],search:v.search!==false,chips:v.chips!==false,trust:v.trust!==false,pos:okPos(v.pos)?v.pos:'left',ord:okOrd(v.ord)?v.ord.slice():DEF.ord.slice()};DEF.slides.forEach(function(d,i){var s=(Array.isArray(v.slides)?v.slides[i]:null)||{};var g=function(k){return typeof s[k]==='string'&&s[k]?s[k]:d[k]},b=function(k){var x=s[k]||{};return{t:typeof x.t==='string'&&x.t?x.t:d[k].t,h:typeof x.h==='string'&&x.h?x.h:d[k].h}};f.slides.push({t:g('t'),g:g('g'),l:g('l'),b1:b('b1'),b2:b('b2'),img:(typeof s.img==='string'&&okImg(s.img))?s.img:'',src:d.src})});return f}
function hv(f){return f.slides.map(function(s,i){var u=s.img==='none'?'':(s.img||s.src);return '<div class="a2p"'+(u?' style="background:linear-gradient(rgba(6,25,58,.72),rgba(6,25,58,.72)),url(\''+esc(u)+'\') center/cover"':'')+'><small>الشريحة '+(i+1)+': '+SN[i]+'</small><p class="a2pt">'+esc(s.t)+' <span>'+esc(s.g)+'</span></p><p>'+esc(s.l)+'</p><div><span class="a2pb p">'+esc(s.b1.t)+'</span><span class="a2pb">'+esc(s.b2.t)+'</span></div></div>'}).join('')+'<p class="adE" style="text-align:start">موضع النص: '+({left:'يسار',center:'وسط',right:'يمين'})[f.pos]+' | الترتيب: '+f.ord.map(function(k){return TG.filter(function(t){return t[0]===k})[0][1]}).join(' ← ')+'</p>'+(TG.filter(function(t){return f[t[0]]===false}).length?'<p class="adE" style="text-align:start">سيُخفى: '+TG.filter(function(t){return f[t[0]]===false}).map(function(t){return t[1]}).join('، ')+'</p>':'')}
function probe(){var c=sbc();return new Promise(function(res){try{c.storage.from('site-assets').list('',{limit:1}).then(function(r){S.bk=!r.error;S.bkErr=r.error?r.error.message:'';res()},function(e){S.bk=false;S.bkErr=String(e&&e.message||e);res()})}catch(e){S.bk=false;S.bkErr=String(e.message||e);res()}})}
function bgPrev(s){if(s.img==='none')return '<p class="adE" style="text-align:start">بلا خلفية: تظهر خلفية لونية بدلاً من الصورة (لم يُحذف أي ملف).</p>';return '<img src="'+esc(s.img||s.src)+'" alt="الخلفية">'+'<p class="adE" style="text-align:start">'+(s.img?'خلفية جديدة مختارة (تُنشر عند «حفظ ونشر»).':'الخلفية الأصلية للموقع.')+'</p>'}
function stage(f){var p=f.pos||'left',pl={left:'يسار',center:'وسط',right:'يمين'};return '<div class="a2st" id="a2st"><div class="a2sb a2sb-'+p+'" id="a2sb">النص والأزرار</div></div><div class="adbs">'+['right','center','left'].map(function(k){return '<button type="button" class="ab'+(p===k?' pr':'')+'" data-a2="pos" data-v="'+k+'">'+pl[k]+'</button>'}).join('')+'</div><p class="adE" style="text-align:start;padding:0 0 8px">اسحب المستطيل أو اختر الموضع. يُطبَّق على الشاشات العريضة (981px فأكثر)، وعلى الهاتف والآيباد يبقى النص بعرض الشاشة.</p>'}
function hero(){if(!DEF){B().innerHTML='<p class="adE er">تعذّر قراءة الواجهة الحالية للموقع (عناصر الرئيسية غير موجودة)، فلا توجد قيم افتراضية للمقارنة.</p>';return}
 B().innerHTML='<p class="adE">جارٍ التحميل…</p>';
 Promise.all([rd(K.hero),probe()]).then(function(a){var v=a[0];S.hero=hf(v);st(v?'المعروض محمّل من الإعدادات المحفوظة في الخادم.':'لا توجد إعدادات محفوظة: تُعرض القيم الافتراضية الحالية للموقع.');drawHero()}).catch(err)}
function drawHero(){var f=S.hero,s=f.slides[S.sl];
 B().innerHTML='<div class="adc">'+SN.map(function(n,i){return '<button type="button" data-a2="hsl" data-v="'+i+'"'+(i===S.sl?' class="on"':'')+'>الشريحة '+(i+1)+': '+n+'</button>'}).join('')+'</div>'
 +'<div class="a2g">'+lbl('العنوان الرئيسي','t',s.t,120,'h')+lbl('الجزء الملوّن من العنوان','g',s.g,120,'h')+'</div>'+lbl('الوصف التعريفي','l',s.l,300,'h',0,1)
 +'<div class="a2g">'+lbl('نص الزر الأول','b1t',s.b1.t,60,'h')+lbl('رابط الزر الأول (#قسم أو https://)','b1h',s.b1.h,300,'h',1)+lbl('نص الزر الثاني','b2t',s.b2.t,60,'h')+lbl('رابط الزر الثاني (#قسم أو https://)','b2h',s.b2.h,300,'h',1)+'</div>'
 +'<h3>خلفية الشريحة</h3><div class="a2bg">'+bgPrev(s)+'</div>'+(S.bk?'':'<p class="adE er" style="text-align:start">رفع الصور غير متاح: حاوية <bdi>site-assets</bdi> غير موجودة أو غير مسموحة'+(S.bkErr?' ('+esc(S.bkErr.slice(0,80))+')':'')+'. الحذف والاسترجاع يعملان.</p>')+'<label class="a2l">استبدال الخلفية (JPG أو PNG أو WebP، حتى 2 ميغابايت؛ الصورة نفسها للحاسوب والهاتف)<input type="file" id="a2f" accept="image/jpeg,image/png,image/webp" data-a2i="file"></label><div id="a2fp"></div><div class="adbs"><button type="button" class="ab pr" id="a2up" data-a2="iup" disabled>رفع واستخدامها</button><button type="button" class="ab no" data-a2="bgdel">حذف الخلفية</button><button type="button" class="ab" data-a2="bgdef">الخلفية الأصلية</button></div>'
 +'<h3>موضع النص</h3>'+stage(f)
 +'<h3>عناصر الواجهة وترتيبها</h3>'+f.ord.map(function(k,i){var t=TG.filter(function(x){return x[0]===k})[0];return '<div class="a2or" data-k="'+k+'"><label class="a2k"><input type="checkbox" data-a2i="tg" data-f="'+k+'"'+(f[k]!==false?' checked':'')+'> '+t[1]+' (ظاهر)</label><span><button type="button" class="ab" data-a2="oup"'+(i?'':' disabled')+'>▲</button><button type="button" class="ab" data-a2="odn"'+(i<2?'':' disabled')+'>▼</button></span></div>'}).join('')
 +'<p class="adE" style="text-align:start">ترتيب الشرائح الثلاث وإخفاء شريحة كاملة غير متاح (المنزلق مبني على ثلاث شرائح ثابتة). نص الشريحة يبقى أعلى هذه العناصر.</p>'
 +'<h3>معاينة (لم تُحفظ)</h3><div id="a2pv">'+hv(f)+'</div>'
 +'<div class="adbs"><button type="button" class="ab pr" data-a2="hsave">حفظ ونشر</button><button type="button" class="ab" data-a2="hprev">معاينة</button><button type="button" class="ab" data-a2="hdef">استرجاع القيم الافتراضية</button><button type="button" class="ab" data-a2="hcancel">إلغاء</button></div>'}
function hval(f){var P=[];f.slides.forEach(function(s,i){var n='الشريحة '+(i+1)+': ';if(!okT(s.t,120))P.push(n+'العنوان مطلوب ولا يحتوي < أو >');if(!okT(s.g,120))P.push(n+'الجزء الملوّن مطلوب');if(!okT(s.l,300))P.push(n+'الوصف مطلوب');if(!okImg(s.img))P.push(n+'مسار الخلفية غير صالح');['b1','b2'].forEach(function(b,j){if(!okT(s[b].t,60))P.push(n+'نص الزر '+(j+1)+' مطلوب');if(!okH(s[b].h))P.push(n+'رابط الزر '+(j+1)+' يجب أن يكون #قسم أو https://')})});return P}
function hdiff(f){var o={slides:[]};f.slides.forEach(function(s,i){var d=DEF.slides[i],x={};['t','g','l'].forEach(function(k){if(s[k]!==d[k])x[k]=s[k]});if(s.img!==d.img)x.img=s.img;['b1','b2'].forEach(function(b){var y={};if(s[b].t!==d[b].t)y.t=s[b].t;if(s[b].h!==d[b].h)y.h=s[b].h;if(Object.keys(y).length)x[b]=y});o.slides.push(x)});TG.forEach(function(t){if(f[t[0]]===false)o[t[0]]=false});if(f.pos&&f.pos!=='left')o.pos=f.pos;if(f.ord.join()!==DEF.ord.join())o.ord=f.ord.slice();return o}
/* ---- الأقسام ---- */
function normC(v){var ids={},out=[],bi={};BASE.forEach(function(b){bi[b[0]]=b});
 if(v&&Array.isArray(v.items))v.items.forEach(function(x){if(!x||typeof x.id!=='string'||!/^[a-z0-9_]{2,40}$/.test(x.id)||ids[x.id])return;ids[x.id]=1;var b=bi[x.id];out.push({id:x.id,name:typeof x.name==='string'&&x.name?x.name:(b?b[1]:x.id),desc:typeof x.desc==='string'?x.desc:(b?b[2]:''),active:x.active!==false,parent:typeof x.parent==='string'?x.parent:'',builtin:!!b})});
 BASE.forEach(function(b){if(!ids[b[0]]){ids[b[0]]=1;out.push({id:b[0],name:b[1],desc:b[2],active:true,parent:'',builtin:true})}});
 out.forEach(function(c){if(c.parent&&(c.parent===c.id||!ids[c.parent]))c.parent=''});
 out.forEach(function(c){if(c.parent){var p=out.filter(function(x){return x.id===c.parent})[0];if(p&&p.parent)c.parent=''}});return out}
function cats(){B().innerHTML='<p class="adE">جارٍ التحميل…</p>';rd(K.cat).then(function(v){S.cat=normC(v);st(v?'المعروض محمّل من الإعدادات المحفوظة في الخادم.':'لا توجد إعدادات محفوظة: تُعرض الأقسام الحالية في الموقع كنقطة بداية.');drawCats()}).catch(err)}
function kids(id){return S.cat.some(function(c){return c.parent===id})}
function drawCats(){var it=S.cat,nm=function(id){var c=it.filter(function(x){return x.id===id})[0];return c?c.name:id};
 B().innerHTML='<div class="adE er" style="text-align:start;padding:10px 12px;margin:0 0 12px">هذه إعدادات تصميم محفوظة فقط. الموقع العام ونماذج الإعلانات ما زالت تستخدم الأقسام الثابتة، ولم يُربط أي قسم هنا بالإعلانات بعد.</div>'
 +'<div class="adbs"><button type="button" class="ab pr" data-a2="cadd">إضافة قسم</button>'+(it.some(function(c){return c.id==='jackpot'})?'':'<button type="button" class="ab" data-a2="cjack">إضافة قسم «جاكبوت»</button>')+'</div>'
 +it.map(function(c,i){return '<div class="a2r'+(c.parent?' a2s2':'')+'" data-id="'+esc(c.id)+'"><div class="a2h"><b>'+esc(c.name)+'</b><bdi class="a2id">'+esc(c.id)+'</bdi><span class="bd '+(c.builtin?'published':'pending')+'">'+(c.builtin?'قسم قائم':'قسم جديد غير مربوط')+'</span>'+(c.parent?'<small>فرعي من: '+esc(nm(c.parent))+'</small>':'')+'</div>'
  +'<div class="a2g">'+lbl('الاسم','name',c.name,80,'c')+lbl('الوصف','desc',c.desc,200,'c')+'</div>'
  +'<label class="a2l">القسم الأب<select data-a2i="c" data-f="parent"'+(kids(c.id)?' disabled':'')+'><option value="">— قسم رئيسي —</option>'+it.filter(function(p){return p.id!==c.id&&!p.parent}).map(function(p){return '<option value="'+esc(p.id)+'"'+(c.parent===p.id?' selected':'')+'>'+esc(p.name)+'</option>'}).join('')+'</select></label>'
  +'<label class="a2k"><input type="checkbox" data-a2i="c" data-f="active"'+(c.active?' checked':'')+'> مفعّل (ظاهر في الواجهة)</label>'
  +'<p class="adE" style="text-align:start;padding:0 0 8px">الصورة: غير متاحة قبل ربط تخزين مخصص لصور الموقع (انظر «الصور والمحتوى»). المعرّف ثابت ولا يتغير بتغيير الاسم.</p>'
  +'<div class="adbs"><button type="button" class="ab" data-a2="cup"'+(i?'':' disabled')+'>▲ أعلى</button><button type="button" class="ab" data-a2="cdn"'+(i<it.length-1?'':' disabled')+'>▼ أسفل</button></div></div>'}).join('')
 +'<div class="adbs"><button type="button" class="ab pr" data-a2="csave">حفظ</button><button type="button" class="ab" data-a2="ccancel">إلغاء</button></div>'
 +'<details class="a2d"><summary>ما يلزم لاحقاً (SQL وإعدادات، لم يُنفَّذ)</summary><ul><li>قبول دالة b59_set_site للمفتاحين categories وcategory_fields، وإتاحة قراءتهما للزوار.</li><li>توسيع قيد تصنيف الإعلانات (listings.category) أو استبداله بجدول تصنيفات ليقبل معرّفات جديدة مثل jackpot دون المساس بالإعلانات القديمة.</li><li>تعديل الموقع العام لاحقاً ليقرأ الأقسام في الرئيسية والبحث ونموذج النشر.</li><li>تفاصيل الجاكبوت الفنية غير معروفة؛ أُضيف كتصنيف بالاسم فقط ومخفي افتراضياً.</li></ul></details>'}
function cval(){var P=[];S.cat.forEach(function(c){if(!okT(c.name,80))P.push('«'+c.id+'»: الاسم مطلوب ولا يحتوي < أو >');if(c.desc&&(c.desc.length>200||/[<>]/.test(c.desc)))P.push('«'+c.id+'»: الوصف غير صالح')});return P}
/* ---- حقول التصنيفات ---- */
function normF(v){var m={};if(v&&v.fields&&typeof v.fields==='object')Object.keys(v.fields).forEach(function(k){if(!Array.isArray(v.fields[k]))return;m[k]=v.fields[k].filter(function(f){return f&&typeof f.id==='string'&&TY[f.type]&&typeof f.label==='string'}).map(function(f){return{id:f.id,label:f.label,type:f.type,required:f.required===!0,options:Array.isArray(f.options)?f.options.filter(function(o){return typeof o==='string'}):[]}})});return m}
function flds(){B().innerHTML='<p class="adE">جارٍ التحميل…</p>';Promise.all([rd(K.cat).catch(function(){return null}),rd(K.fld)]).then(function(a){S.cat=normC(a[0]);S.fld=normF(a[1]);if(!S.cat.some(function(c){return c.id===S.fc}))S.fc=S.cat[0].id;st(a[1]?'المعروض محمّل من الإعدادات المحفوظة في الخادم.':'لا توجد حقول محفوظة بعد.');drawFlds()}).catch(err)}
function drawFlds(){var L=S.fld[S.fc]||[];
 B().innerHTML='<div class="adE er" style="text-align:start;padding:10px 12px;margin:0 0 12px">هيكل تصميم فقط. الإعلانات الحالية تستخدم حقولاً ثابتة، وهذه الحقول لا تظهر في نماذج النشر أو البحث ولا تغيّر الإعلانات القديمة.</div>'
 +'<label class="a2l">التصنيف<select data-a2i="fc">'+S.cat.map(function(c){return '<option value="'+esc(c.id)+'"'+(c.id===S.fc?' selected':'')+'>'+esc(c.name)+'</option>'}).join('')+'</select></label>'
 +'<div class="adbs"><button type="button" class="ab pr" data-a2="fadd">إضافة حقل</button>'+Object.keys(PRE).map(function(k){return '<button type="button" class="ab" data-a2="fpre" data-v="'+k+'">+ '+PRE[k][0]+'</button>'}).join('')+'</div>'
 +(L.length?L.map(function(f,i){return '<div class="a2r" data-id="'+esc(f.id)+'"><div class="a2h"><b>'+esc(f.label||'حقل جديد')+'</b><bdi class="a2id">'+esc(f.id)+'</bdi></div><div class="a2g">'+lbl('التسمية','label',f.label,60,'f')+'<label class="a2l">النوع<select data-a2i="f" data-f="type">'+Object.keys(TY).map(function(t){return '<option value="'+t+'"'+(f.type===t?' selected':'')+'>'+TY[t]+'</option>'}).join('')+'</select></label></div>'
  +'<label class="a2k"><input type="checkbox" data-a2i="f" data-f="required"'+(f.required?' checked':'')+'> إلزامي (الأصل: اختياري)</label>'
  +(f.type==='select'?lbl('الخيارات (خيار في كل سطر)','options',f.options.join('\n'),1500,'f',0,1):'')
  +'<div class="adbs"><button type="button" class="ab" data-a2="fup"'+(i?'':' disabled')+'>▲ أعلى</button><button type="button" class="ab" data-a2="fdn"'+(i<L.length-1?'':' disabled')+'>▼ أسفل</button><button type="button" class="ab no" data-a2="fdel">إزالة من التصميم</button></div></div>'}).join(''):'<p class="adE">لا توجد حقول لهذا التصنيف.</p>')
 +'<div class="adbs"><button type="button" class="ab pr" data-a2="fsave">حفظ</button><button type="button" class="ab" data-a2="fcancel">إلغاء</button></div>'
 +'<details class="a2d"><summary>ما يلزم لاحقاً (SQL وإعدادات، لم يُنفَّذ)</summary><ul><li>عمود jsonb اختياري في الإعلانات (مثل attrs) لحفظ قيم الحقول الديناميكية دون المساس بالأعمدة الحالية، فتبقى الإعلانات القديمة سليمة.</li><li>التحقق في الخادم من الحقول الإلزامية وأنواعها عند النشر.</li><li>قبول دالة b59_set_site للمفتاح category_fields وقراءته للزوار.</li><li>تعديل نموذج النشر وفلاتر البحث لاحقاً ليقرآ هذا التصميم.</li></ul></details>'}
function fval(){var P=[];Object.keys(S.fld).forEach(function(k){(S.fld[k]||[]).forEach(function(f){if(!okT(f.label,60))P.push('تصنيف «'+k+'»: تسمية الحقل مطلوبة ولا تحتوي < أو >');if(f.type==='select'){var o=f.options;if(o.length<2||o.length>50||o.some(function(x){return!okT(x,60)}))P.push('تصنيف «'+k+'»: قائمة «'+f.label+'» تحتاج 2 إلى 50 خياراً صالحاً')}})});return P}
/* ---- الصور والمحتوى ---- */
function imgs(){st('');B().innerHTML='<p class="adE">جارٍ فحص التخزين…</p>';probe().then(drawImgs)}
function drawImgs(){B().innerHTML=(S.bk?'<div class="adE" style="text-align:start;padding:10px 12px;margin:0 0 12px">حاوية التخزين <bdi>site-assets</bdi> متاحة للقراءة. نجاح الرفع يُعلن فقط بعد التحقق منه.</div>':'<div class="adE er" style="text-align:start;padding:10px 12px;margin:0 0 12px">تخزين صور الموقع غير متاح: لا توجد حاوية <bdi>site-assets</bdi> يمكن الوصول إليها'+(S.bkErr?' ('+esc(S.bkErr.slice(0,100))+')':'')+'. الرفع معطّل ولن يُعرض أي نجاح وهمي. صور الواجهة الحالية ملفات ثابتة داخل المشروع.</div>')
 +'<p class="adE" style="text-align:start;padding:0 0 8px">خلفيات الشرائح الثلاث تُستبدل وتُحذف من تبويب «الواجهة الرئيسية». صور الأقسام غير مفعّلة بعد.</p><div class="adbs"><button type="button" class="ab pr" data-a2="sub" data-v="hero">الواجهة الرئيسية</button></div>'
 +'<h3>المحتوى النصي</h3><p class="adE" style="text-align:start;padding:0 0 8px">النصوص والصفحات والأسئلة الشائعة وإخفاء أقسام الرئيسية تُدار من محرر المحتوى الحالي.</p><div class="adbs"><a class="ab pr" href="#admcms">محرر المحتوى</a><a class="ab" href="#admin" data-adgo="b72">إعدادات المنصة</a></div>'}
function fpv(file){var p=$('a2fp'),u=$('a2up');if(S.url){URL.revokeObjectURL(S.url);S.url=null}u.disabled=true;if(!file){p.innerHTML='';return}
 if(['image/jpeg','image/png','image/webp'].indexOf(file.type)<0){p.innerHTML='<p class="adE er">نوع الملف غير مسموح: '+esc(file.type||'غير معروف')+'.</p>';return}
 if(file.size>2*1024*1024){p.innerHTML='<p class="adE er">الحجم '+(file.size/1048576).toFixed(1)+' ميغابايت يتجاوز الحد (2).</p>';return}
 S.url=URL.createObjectURL(file);p.innerHTML='<img src="'+S.url+'" alt="معاينة الصورة" style="max-width:100%;max-height:260px;border-radius:10px;border:1px solid var(--line)"><p class="adE" style="text-align:start">معاينة محلية فقط: لم تُرفع الصورة بعد.</p>';u.disabled=!S.bk}
function iup(){var fe=$('a2f'),f=fe&&fe.files[0],c=sbc(),ix=S.sl;if(!f||!S.bk||S.busy||!S.hero)return;S.busy=true;var ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[f.type],nm='slide'+(ix+1)+'-'+Date.now()+'.'+ext,path='hero/'+nm;note('','جارٍ الرفع…');
 c.storage.from('site-assets').upload(path,f,{contentType:f.type,upsert:false}).then(function(r){if(r.error)throw r.error;return c.storage.from('site-assets').list('hero',{search:nm})}).then(function(r){if(r.error||!(r.data||[]).some(function(x){return x.name===nm}))throw{message:'not_found'};var u=c.storage.from('site-assets').getPublicUrl(path).data.publicUrl;return new Promise(function(res,rej){var im=new Image();im.onload=function(){res(u)};im.onerror=function(){rej({message:'not_public'})};im.src=u})}).then(function(u){S.busy=false;if(!okImg(u))return note('er','رابط الصورة خارج مسار التخزين المسموح. لم تُستخدم.');S.hero.slides[ix].img=u;dirty();if(S.sub==='hero'){S.sl=ix;drawHero()}note('ok','رُفعت الصورة وتأكّد تحميلها من الرابط العام. لم تُنشر بعد: اضغط «حفظ ونشر».')}).catch(function(e){S.busy=false;var m=String(e&&e.message||e);note('er',m==='not_found'?'لم يتأكد وجود الملف في التخزين بعد الرفع. لا تعتمد عليه.':m==='not_public'?'رُفع الملف لكن رابطه العام لا يعمل (الحاوية ليست عامة). لم تُستخدم الصورة.':'فشل الرفع: '+m.slice(0,120))})}
/* ---- التوجيه والأحداث ---- */
function go(sub){S.sub=sub;S.dirty=false;S.busy=false;[].forEach.call(document.querySelectorAll('#a2t button'),function(b){b.classList.toggle('on',b.dataset.v===sub)});note('');({hero:hero,cat:cats,fld:flds,img:imgs})[sub]()}
function render(host,roles){if((roles||[]).indexOf('platform_admin')<0){host.innerHTML='<h2>واجهة الموقع والأقسام</h2><p class="adE">هذه الصفحة للمدير العام فقط.</p>';return}shell();go(S.sub)}
function mv(a,id,d){var i=a.map(function(x){return x.id}).indexOf(id),j=i+d;if(i<0||j<0||j>=a.length)return false;var t=a[i];a[i]=a[j];a[j]=t;return true}
function save(key,payload,okm,after){if(S.busy)return;S.busy=true;note('','جارٍ الحفظ…');wr(key,payload).then(function(){S.busy=false;S.dirty=false;note('ok',okm);st('محفوظ في الخادم وتأكّد بالقراءة منه.');if(after)after()}).catch(function(e){S.busy=false;note('er',em(e))})}
document.addEventListener('click',function(e){var b=e.target.closest('#adm [data-a2]');if(!b||!$('a2b'))return;var a=b.dataset.a2,id=(b.closest('[data-id]')||{dataset:{}}).dataset.id;
 if(a==='sub'){if(S.dirty&&!confirm('لديك تعديلات غير محفوظة. تجاهلها؟'))return;return go(b.dataset.v)}
 if(a==='reload'){return go(S.sub)}
 if(a==='hsl'){S.sl=+b.dataset.v;return drawHero()}
 if(a==='hprev'){note('','المعاينة أدناه لا تغيّر الموقع ولا تُحفظ.');var pv=$('a2pv');if(pv&&pv.scrollIntoView)pv.scrollIntoView({block:'nearest'});return}
 if(a==='hdef'){S.hero=hf(null);dirty();return drawHero()}
 if(a==='hcancel'||a==='ccancel'||a==='fcancel'){S.dirty=false;return go(S.sub)}
 if(a==='hsave'){var P=hval(S.hero);if(P.length)return note('er',P[0]+(P.length>1?' (و'+(P.length-1)+' مشكلة أخرى)':''));var d=hdiff(S.hero);return save(K.hero,d,'حُفظت الواجهة الرئيسية وتأكّدت من الخادم. حدّث صفحة الموقع لرؤية التغيير.',function(){S.hero=hf(d);drawHero()})}
 if(a==='cadd'){S.cat.push({id:'c_'+Math.random().toString(36).slice(2,8),name:'قسم جديد',desc:'',active:false,parent:'',builtin:false});dirty();return drawCats()}
 if(a==='cjack'){if(S.cat.some(function(c){return c.id==='jackpot'}))return;S.cat.push({id:'jackpot',name:'جاكبوت',desc:'',active:false,parent:'',builtin:false});dirty();return drawCats()}
 if(a==='cup'||a==='cdn'){if(mv(S.cat,id,a==='cup'?-1:1)){dirty();drawCats()}return}
 if(a==='csave'){var Q=cval();if(Q.length)return note('er',Q[0]);var p={v:1,items:S.cat.map(function(c){return{id:c.id,name:c.name,desc:c.desc,active:c.active,parent:c.parent}})};return save(K.cat,p,'حُفظت إعدادات الأقسام وتأكّدت من الخادم. هي غير مطبّقة على الموقع العام بعد.',function(){S.cat=normC(p);drawCats()})}
 if(a==='fadd'||a==='fpre'){var pr=PRE[b.dataset.v]||['حقل جديد','text'];(S.fld[S.fc]=S.fld[S.fc]||[]).push({id:'f_'+Math.random().toString(36).slice(2,8),label:a==='fpre'?pr[0]:'حقل جديد',type:a==='fpre'?pr[1]:'text',required:false,options:[]});dirty();return drawFlds()}
 if(a==='fup'||a==='fdn'){if(mv(S.fld[S.fc]||[],id,a==='fup'?-1:1)){dirty();drawFlds()}return}
 if(a==='fdel'){if(!confirm('إزالة هذا الحقل من التصميم؟ لا يؤثر على أي إعلان.'))return;S.fld[S.fc]=(S.fld[S.fc]||[]).filter(function(x){return x.id!==id});dirty();return drawFlds()}
 if(a==='fsave'){var R=fval();if(R.length)return note('er',R[0]);var m={};Object.keys(S.fld).forEach(function(k){if((S.fld[k]||[]).length)m[k]=S.fld[k].map(function(f){var o={id:f.id,label:f.label,type:f.type,required:f.required};if(f.type==='select')o.options=f.options;return o})});var q={v:1,fields:m};return save(K.fld,q,'حُفظ تصميم الحقول وتأكّد من الخادم. هو غير مطبّق على نماذج النشر والبحث بعد.',function(){S.fld=normF(q);drawFlds()})}
 if(a==='pos'){S.hero.pos=b.dataset.v;dirty();return drawHero()}
 if(a==='oup'||a==='odn'){var kk=b.closest('[data-k]').dataset.k,o=S.hero.ord,ix=o.indexOf(kk),jx=ix+(a==='oup'?-1:1);if(ix<0||jx<0||jx>2)return;o[ix]=o[jx];o[jx]=kk;dirty();return drawHero()}
 if(a==='bgdel'){if(!confirm('حذف خلفية هذه الشريحة؟ ستظهر خلفية لونية بدلاً من الصورة، ولا يُحذف الملف الأصلي. لن يظهر ذلك للزوار قبل «حفظ ونشر».'))return;S.hero.slides[S.sl].img='none';dirty();return drawHero()}
 if(a==='bgdef'){S.hero.slides[S.sl].img='';dirty();return drawHero()}
 if(a==='iup')return iup()});
function stX(st,e){var r=st.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,p=x<.34?'left':x>.66?'right':'center';if(S.hero&&S.hero.pos!==p){S.hero.pos=p;var bx=$('a2sb');if(bx)bx.className='a2sb a2sb-'+p;[].forEach.call(document.querySelectorAll('#adm [data-a2="pos"]'),function(q){q.classList.toggle('pr',q.dataset.v===p)});dirty()}}
document.addEventListener('pointerdown',function(e){var st=e.target.closest('#a2st');if(!st||!S.hero)return;S.drag=1;try{st.setPointerCapture(e.pointerId)}catch(x){}stX(st,e)});
document.addEventListener('pointermove',function(e){if(!S.drag)return;var st=$('a2st');if(st)stX(st,e)});
['pointerup','pointercancel'].forEach(function(n){document.addEventListener(n,function(){S.drag=0})});
function onIn(e){var t=e.target.closest('#adm [data-a2i]');if(!t||!$('a2b'))return;var k=t.dataset.a2i,f=t.dataset.f,id=(t.closest('[data-id]')||{dataset:{}}).dataset.id;
 if(k==='file')return fpv(t.files&&t.files[0]);
 if(k==='h'){var s=S.hero.slides[S.sl],m=/^(b[12])([th])$/.exec(f);if(m)s[m[1]][m[2]]=t.value;else s[f]=t.value;dirty();$('a2pv').innerHTML=hv(S.hero);return}
 if(k==='tg'){S.hero[f]=t.checked;dirty();$('a2pv').innerHTML=hv(S.hero);return}
 if(k==='c'){var c=S.cat.filter(function(x){return x.id===id})[0];if(!c)return;if(f==='active')c.active=t.checked;else c[f]=t.value;dirty();if(f==='parent')drawCats();return}
 if(k==='fc'){S.fc=t.value;return drawFlds()}
 if(k==='f'){var L=S.fld[S.fc]||[],x=L.filter(function(y){return y.id===id})[0];if(!x)return;if(f==='required')x.required=t.checked;else if(f==='options')x.options=t.value.split('\n').map(function(o){return o.trim()}).filter(Boolean);else x[f]=t.value;dirty();if(f==='type')drawFlds()}}
var tx=function(t){return t&&(t.tagName==='TEXTAREA'||(t.tagName==='INPUT'&&/^(text|search)?$/.test(t.type)))};document.addEventListener('input',function(e){if(tx(e.target))onIn(e)});document.addEventListener('change',function(e){if(!tx(e.target))onIn(e)});
return{render:render,_t:{okImg:okImg,okPos:okPos,okOrd:okOrd,cn:cn,okH:okH,okT:okT,hdiff:hdiff,hf:hf,normC:normC,normF:normF,setDef:function(d){DEF=d}}};
})();

/* ===== B9: لوحة المشرف (الحماية الفعلية في الخادم: is_admin() + RLS + دوال security definer) ===== */
(function(){
var AD={tab:'dash',f:{ads:'pending',reps:'open'},users:null,um:{},cache:{}};
var X=PF.esc;
var SL={pending:'بانتظار المراجعة',published:'منشور',rejected:'مرفوض',suspended:'موقوف'},RS={open:'جديد',reviewing:'قيد المعالجة',closed:'تمت المعالجة'},RR={fake:'وهمي أو مكرر',scam:'احتيال',prohibited:'محتوى ممنوع',wrong_info:'معلومات مضلِّلة',other:'غير ذلك'};
var ACT={role_grant:'منح دور إداري',role_revoke:'سحب دور إداري',listing_archived:'أرشفة إعلان',listing_published:'نشر إعلان',listing_rejected:'رفض إعلان',listing_suspended:'إيقاف إعلان',listing_pending:'إعادة إعلان للمراجعة',report_new:'إعادة بلاغ إلى جديد',report_in_progress:'بلاغ قيد المعالجة',report_resolved:'معالجة بلاغ',user_restrict:'تقييد حساب',user_unrestrict:'رفع تقييد حساب'};
var fd=function(x){try{return new Date(x).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}catch(e){return x||''}};
var own=function(r){return r.user_id||r.owner_id||r.seller_id||r.created_by||null};
function msg(t,ok){var m=E('admsg');m.className='admsg '+(ok?'ok':'er');m.textContent=t;m.style.display='block';toast(t)}
function ld(){E('adm').innerHTML='<p class="adE">جارٍ التحميل…</p>'}
function er(m,fn){E('adm').innerHTML='<div class="adE er">'+X(m)+'<br><br><button class="ab pr" id="adr">إعادة المحاولة</button></div>';E('adr').onclick=fn}
function gate(h){E('adg').style.display='';E('adl').style.display='none';E('adg').innerHTML=h}
function chips(k,L){return '<div class="adc">'+Object.keys(L).map(function(v){return '<button data-ck="'+k+'" data-cv="'+v+'" class="'+(AD.f[k]===v?'on':'')+'">'+L[v]+'</button>'}).join('')+'</div>'}
function users(){if(AD.users)return Promise.resolve(AD.users);return sbc().rpc('admin_list_users').then(function(r){if(r.error)throw r.error;AD.users=r.data||[];AD.um={};AD.users.forEach(function(u){AD.um[u.id]=u});return AD.users})}
function imgs(r){return(r.listing_images||[]).slice().sort(function(a,b){return(a.sort_order||0)-(b.sort_order||0)}).map(function(i){return sbc().storage.from('listing-images').getPublicUrl(i.storage_path).data.publicUrl})}
var SEL='*,listing_images(storage_path,sort_order)';
function getAd(id){if(AD.cache[id])return Promise.resolve(AD.cache[id]);return sbc().from('listings').select(SEL).eq('id',id).maybeSingle().then(function(r){if(r.error)throw r.error;if(!r.data)throw new Error('الإعلان غير موجود');AD.cache[id]=r.data;return r.data})}
function reload(){show(AD.tab)}
function secSet(x){AD.sec=x;[].forEach.call(document.querySelectorAll('#adn .ads'),function(b){var on=b.dataset.s===x;b.classList.toggle('on',on);if(on){b.setAttribute('aria-current','true');try{if(matchMedia('(max-width:820px)').matches)b.scrollIntoView({block:'nearest',inline:'center'})}catch(e){}}else b.removeAttribute('aria-current')});[].forEach.call(document.querySelectorAll('#adsub .adsg'),function(g){g.hidden=g.dataset.s!==x})}
function secLand(x){var g=document.querySelector('#adsub .adsg[data-s="'+x+'"]');if(!g)return;secSet(x);[].forEach.call(document.querySelectorAll('#adsub button'),function(b){b.classList.remove('on')});var L=[].filter.call(g.querySelectorAll('a'),function(a){return a.style.display!=='none'});E('adm').innerHTML='<h2>'+X(g.dataset.title)+'</h2>'+(g.dataset.note?'<p class="adE" style="padding:0 0 10px;text-align:start">'+X(g.dataset.note)+'</p>':'')+'<div class="adk">'+L.map(function(a){return '<a href="'+X(a.getAttribute('href'))+'" style="display:block;border:1px solid var(--line);border-radius:12px;padding:14px;color:var(--mut);font-size:14px;text-decoration:none"><b style="display:block;font-size:16px;color:var(--b)">'+X(a.textContent)+'</b>'+X(a.dataset.d||'')+'</a>'}).join('')+'</div>'}
function secGo(x){var g=document.querySelector('#adsub .adsg[data-s="'+x+'"]');if(!g)return;var vis=function(b){return b.style.display!=='none'},cur=g.querySelector('button[data-t="'+AD.tab+'"]');if(cur&&vis(cur))return show(AD.tab);var f=[].filter.call(g.querySelectorAll('button[data-t]'),vis)[0];if(f)return show(f.dataset.t);secLand(x)}
function show(t){AD.tab=t;if(AD.roles&&!canSee(t)){t=AD.tab='dash'}[].forEach.call(document.querySelectorAll('#adsub button'),function(b){b.classList.toggle('on',b.dataset.t===t)});var sb=document.querySelector('#adsub button[data-t="'+t+'"]'),sg=sb&&sb.closest('[data-s]');if(sg)secSet(sg.dataset.s);var f=({dash:dash,ads:l4,ord5:l5,com6:l6,reps:reps,trust:trustPage,users:usr,u3:usr3,stores:stores,workshops:workshops,verif:verif,convrep:convReps,ref:refData,pdup:partsQA,audit:audit,monitor:monitor,qa:qaPage,set:rolesPage,b72:hub,b74:acctc,perf:perfPage,b87:b87Page,b88:b88Page,b90:b90Page,b91:b91Page,fil:a13Page,adm14:a14Page,f81:f8sumPage,f82:f8promoPage,f83:f8campPage,f84:f8ledgerPage,f85:f8reqPage,f86:f8spPage,f87:f8repPage,an1:an1,an2:an2,an3:an3,an4:an4,an5:an5,an6:an6,sy1:sy1,sy2:sy2,sy3:sy3,sy4:sy4,sy8:sy8,site:function(){ADM2.render(E('adm'),AD.roles)}})[t];if(!f&&SK[t])f=function(){skel(SK[t][0],SK[t][1],SK[t][2])};f()}

function dash(){ld();var c=sbc();Promise.all([c.rpc('admin_stats'),c.from('admin_activity').select('*').order('created_at',{ascending:false}).limit(10).then(function(q){return q.error?{data:[]}:q})]).then(function(r){
  if(r[0].error)throw r[0].error;if(r[1].error)throw r[1].error;var s=r[0].data||{},a=r[1].data||[];
  var K=[['users','المستخدمون'],['published','إعلانات منشورة'],['pending','بانتظار المراجعة'],['blocked','مرفوضة أو موقوفة'],['reports_new','بلاغات جديدة']];
  E('adm').innerHTML='<h2>لوحة المعلومات الرئيسية</h2><div class="adk">'+K.map(function(k){return '<div>'+k[1]+'<b>'+(s[k[0]]==null?'—':s[k[0]])+'</b></div>'}).join('')+'</div><h3>أحدث النشاطات الإدارية</h3>'+
   (a.length?'<ul class="adact">'+a.map(function(x){return '<li><span>'+X(ACT[x.action]||x.action)+(x.note?' — '+X(x.note):'')+'</span><span>'+fd(x.created_at)+'</span></li>'}).join('')+'</ul>':'<p class="adE">لا توجد نشاطات بعد.</p>')+'<h3>الأنشطة والعروض والطلبات</h3><div class="adk" id="adk2"><p class="adE">جارٍ التحميل…</p></div>';kpi2();
 }).catch(function(e){er('تعذّر تحميل الأرقام: '+e.message,dash)})}
function kpi2(){var K=[['الأنشطة التجارية','biz_profiles',null,'#admbiz'],['أنشطة تنتظر التحقق','biz_profiles',function(q){return q.in('status',['pending','need_info'])},'#admbiz'],['عروض قطع بانتظار المراجعة','parts_offers',function(q){return q.eq('review_status','pending')},'#admparts'],['طلبات القطع والخدمات (الكل)','service_requests',null,'#admreq'],['عروض قطع الغيار (الكل)','parts_offers',null,'#admparts'],['إعلانات بانتظار المراجعة','listings',function(q){return q.eq('status','pending')},null,'ads|pending'],['إعلانات موقوفة','listings',function(q){return q.eq('status','suspended')},null,'ads|suspended'],['بلاغات جديدة','reports',function(q){return q.eq('status','open')},null,'reps|open']];
 Promise.all(K.map(function(k){return cnt(k[1],k[2]).then(function(n){return n},function(){return null})})).then(function(a){var h=E('adk2');if(!h)return;h.innerHTML=K.map(function(k,i){return '<a '+(k[3]?'href="'+k[3]+'"':'href="#admin" data-adgo="'+(k[4]||'')+'"')+' style="display:block;border:1px solid var(--line);border-radius:12px;padding:14px;color:var(--mut);font-size:14px;text-decoration:none">'+k[0]+'<b style="display:block;font-size:'+(a[i]==null?'15px':'30px')+';color:var(--b);line-height:1.3">'+(a[i]==null?'غير متاح حالياً':a[i])+'</b></a>'}).join('')})}

function ads(){ld();var f=AD.f.ads;Promise.all([sbc().from('listings').select(SEL).eq('status',f).order('created_at',{ascending:false}).limit(100),users().catch(function(){return[]})]).then(function(r){
  if(r[0].error)throw r[0].error;var L=r[0].data||[];L.forEach(function(x){AD.cache[x.id]=x});
  E('adm').innerHTML='<h2>مراجعة الإعلانات</h2>'+chips('ads',SL)+(L.length?'<div class="adtw"><table class="adt"><thead><tr><th></th><th>الإعلان</th><th>السعر</th><th>صاحب الإعلان</th><th>التاريخ</th><th></th></tr></thead><tbody>'+L.map(function(x){var im=imgs(x)[0],u=AD.um[own(x)];
   return '<tr><td>'+(im?'<img class="th" loading="lazy" decoding="async" src="'+X(im)+'" alt="">':'')+'</td><td>'+X(x.title)+'<br><span class="bd '+x.status+'">'+(SL[x.status]||X(x.status))+'</span></td><td>'+(x.price!=null?X(x.price)+' '+X(x.currency||''):'—')+'</td><td>'+X(u?(u.full_name||u.email):(own(x)||'—'))+'</td><td>'+fd(x.created_at)+'</td><td><button class="ab pr" data-ad="'+x.id+'">عرض ومراجعة</button></td></tr>'}).join('')+'</tbody></table></div>':'<p class="adE">لا توجد إعلانات في هذه الحالة.</p>');
 }).catch(function(e){er('تعذّر تحميل الإعلانات: '+e.message,ads)})}

function modal(h){E('adw').innerHTML='<button class="x" data-xc aria-label="إغلاق">'+ic('close')+'</button>'+h;E('adx').classList.add('on');document.body.style.overflow='hidden'}
function closeM(){E('adx').classList.remove('on');document.body.style.overflow=''}
function openAd(id){delete AD.cache[id];var c=sbc();getAd(id).then(function(r){var o=own(r);return Promise.all([users().catch(function(){return[]}),b83Q(c.from('reports').select('*').eq('listing_id',id).order('created_at',{ascending:false}).limit(10)),o?b83Q(c.from('biz_profiles').select('id,name,status').eq('owner_id',o).maybeSingle()):Promise.resolve({data:null}),b83Q(c.from('admin_activity').select('*').order('created_at',{ascending:false}).limit(300))]).then(function(a){
  var u=AD.um[o],st=r.status,rp=a[1],bz=a[2].data,ha=a[3],H=ha.error?null:(ha.data||[]).filter(function(x){return Object.keys(x).some(function(k){return x[k]===id})}).slice(0,10),
  F=[['الفئة',r.category],['السعر',r.price!=null?r.price+' '+(r.currency||''):null],['الحالة',r.condition],['المحافظة',r.province],['المنطقة',r.area],['الشركة',r.manufacturer],['الموديل',r.model],['السنة',r.year],['تاريخ الإنشاء',r.created_at?fd(r.created_at):null],['آخر تحديث',r.updated_at?fd(r.updated_at):null],['ينتهي',r.expires_at?fd(r.expires_at):null]].filter(function(x){return x[1]}),im=imgs(r);
  var B=function(d,t,x){return '<button class="ab '+x+'" data-do="'+d+'" data-id="'+r.id+'">'+t+'</button>'};
  modal('<h2 style="margin:0 0 6px">'+X(r.title)+'</h2><span class="bd '+X(st)+'">'+X(a4sl(st))+'</span> <bdi class="a2id">'+X(r.id)+'</bdi>'+(r.rejection_reason?'<p>سبب الرفض/الإيقاف: '+X(r.rejection_reason)+'</p>':'')+
   (im.length?'<div class="adgal">'+im.map(function(s){return '<img loading="lazy" decoding="async" src="'+X(s)+'" alt="">'}).join('')+'</div>':'<p class="adE">لا توجد صور.</p>')+
   '<div class="addl">'+F.map(function(x){return '<div><span>'+x[0]+'</span>'+X(x[1])+'</div>'}).join('')+'</div><p style="white-space:pre-wrap">'+X(r.description||'')+'</p>'+
   '<h3>الناشر والنشاط</h3><div class="addl"><div><span>صاحب الإعلان</span>'+X(u?(u.full_name||'بدون اسم'):'غير متاح')+'</div><div><span>البريد</span><bdi>'+X(u?u.email:'—')+'</bdi></div><div><span>الهاتف</span><bdi>'+X(u&&u.phone||'—')+'</bdi></div><div><span>النشاط التجاري</span>'+(bz?X(bz.name||'—')+' ('+X(BST[bz.status]||bz.status||'')+')':'لا يوجد')+'</div></div>'+
   (o?'<button class="ab" data-u="'+X(o)+'">عرض الملف الشخصي</button>':'')+
   '<h3>البلاغات المرتبطة ('+(rp.error?'غير متاحة':(rp.data||[]).length)+')</h3>'+(rp.error?'':(rp.data||[]).length?'<ul class="adact">'+rp.data.map(function(x){return '<li><span>'+X(RR[x.reason]||x.reason)+' · <span class="bd '+X(x.status)+'">'+X(RS[x.status]||x.status)+'</span>'+(x.details?' · '+X(String(x.details).slice(0,120)):'')+'</span><span>'+fd(x.created_at)+'</span></li>'}).join('')+'</ul>':'<p class="adE">لا بلاغات.</p>')+
   '<h3>سجل القرارات</h3>'+(H===null?'<p class="adE">غير متاح (سجل النشاط الإداري).</p>':H.length?'<ul class="adact">'+H.map(function(x){return '<li><span>'+X(ACT[x.action]||x.action||'')+(x.note?' — '+X(x.note):'')+'</span><span>'+(x.created_at?fd(x.created_at):'')+'</span></li>'}).join('')+'</ul><p class="adE" style="text-align:start">من آخر 300 نشاط إداري فقط.</p>':'<p class="adE">لا قرارات مسجّلة ضمن آخر 300 نشاط.</p>')+
   '<h3>القرار</h3>'+(st==='pending'||st==='published'?'<textarea id="adrs" placeholder="السبب (إلزامي عند الرفض أو الإيقاف، 5 أحرف على الأقل)"></textarea>':'')+
   '<div class="adbs">'+(st==='pending'?B('published','الموافقة والنشر','ok')+B('rejected','رفض','no')+'<button class="ab" disabled title="غير مدعوم في الخادم">إعادة لاستكمال البيانات (غير مفعّل)</button>':st==='published'?B('suspended','إيقاف الإعلان','no'):(st==='suspended'||st==='rejected')?B('pending','استعادة: إعادة إلى المراجعة','pr'):'')+'</div>'+
   (st==='archived'||st==='draft'?'<p class="adE" style="text-align:start">لا قرار إداري متاح على هذه الحالة.</p>':'')+'<p class="adE" style="text-align:start">لا حذف نهائي للإعلانات من هذه الواجهة. القرار يُعتمد بعد قراءة الحالة من الخادم، والصلاحية الفعلية يفرضها الخادم.</p>')})}).catch(function(e){msg(e.message)})}
function doAd(b){var id=b.dataset.id,st=b.dataset.do,rs=E('adrs')?E('adrs').value.trim():'',need=st==='rejected'||st==='suspended';
  if(need&&(rs.length<5||rs.length>500||/[<>]/.test(rs))){msg('اكتب السبب (5 إلى 500 حرف، بدون < أو >).');if(E('adrs'))E('adrs').focus();return}
  var T={published:'نشر هذا الإعلان للجميع؟',rejected:'رفض هذا الإعلان؟ سيظهر السبب لصاحبه.',suspended:'إيقاف هذا الإعلان المنشور؟ سيختفي عن الزوار.',pending:'إعادة الإعلان إلى المراجعة؟'};
  if(!confirm(T[st]||'تنفيذ الإجراء؟'))return;
  var en=function(){[].forEach.call(document.querySelectorAll('#adw .ab'),function(x){x.disabled=false})};
  [].forEach.call(document.querySelectorAll('#adw .ab'),function(x){x.disabled=true});
  sbc().rpc('admin_set_listing_status',{p_id:id,p_status:st,p_reason:rs||null}).then(function(r){if(r.error)throw r.error;return sbc().from('listings').select('status').eq('id',id).maybeSingle()}).then(function(v){
   if(v.error||!v.data||v.data.status!==st){en();msg('لم يتأكد التنفيذ من الخادم. افتح الإعلان وتحقق من حالته قبل إعادة المحاولة.');return}
   delete AD.cache[id];closeM();msg({published:'تم نشر الإعلان وتأكّد من الخادم.',rejected:'تم رفض الإعلان وتأكّد من الخادم.',suspended:'تم إيقاف الإعلان وتأكّد من الخادم.',pending:'أُعيد الإعلان إلى المراجعة وتأكّد من الخادم.'}[st],1);reload()}).catch(function(e){en();msg('فشلت العملية: '+(e&&e.message||e))})}

function RTSEL(){var T={all:'كل الأنواع',listing:'إعلانات',business:'أنشطة تجارية',user:'مستخدمون'};return '<select id="rptype" aria-label="نوع المُبلَّغ عنه" style="min-height:40px;margin:0 8px 10px;padding:0 10px;border-radius:10px;border:1px solid var(--line)">'+Object.keys(T).map(function(k){return '<option value="'+k+'"'+((AD.rt||'all')===k?' selected':'')+'>'+T[k]+'</option>'}).join('')+'</select>'}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='rptype'){AD.rt=e.target.value;reps()}});
document.addEventListener('click',function(e){var a=e.target.closest('[data-adgo]');if(!a||!E('adm')||!E('adm').contains(a))return;e.preventDefault();var q=a.dataset.adgo.split('|');if(q[1])AD.f[q[0]]=q[1];show(q[0])});
function reps(){ld();var f=AD.f.reps;sbc().from('reports').select('*').eq('status',f).order('created_at',{ascending:false}).limit(100).then(function(r){
  if(r.error)throw r.error;var L=r.data||[],RT=AD.rt||'all';L=L.filter(function(x){return RT==='all'||(RT==='listing'?!!x.listing_id:RT==='business'?!!x.business_id:!x.listing_id&&!x.business_id)});
  E('adm').innerHTML='<h2>البلاغات</h2>'+chips('reps',RS)+RTSEL()+'<p class="adE" style="padding:0 0 10px;text-align:start">وصول بلاغ لا يحذف شيئاً تلقائياً؛ راجع الإعلان أو الحساب ثم اتخذ الإجراء المناسب.</p>'+
   (L.length?L.map(function(x){return '<div class="adrc"><div><b>'+(x.listing_id?'بلاغ على إعلان':x.business_id?'بلاغ على نشاط تجاري':'بلاغ على مستخدم')+'</b> <small>'+idt(x.listing_id||x.business_id||x.reported_user_id)+'</small> <span class="bd '+x.status+'">'+RS[x.status]+'</span> <small>'+fd(x.created_at)+'</small></div><div>السبب: '+X(RR[x.reason]||x.reason)+'</div>'+(x.handled_by||x.reviewed_by?'<div>المعالج: '+idt(x.handled_by||x.reviewed_by)+'</div>':'')+(x.details?'<div style="white-space:pre-wrap">'+X(x.details)+'</div>':'')+
    '<div class="adbs" style="margin:0">'+(x.listing_id?'<button class="ab pr" data-ad="'+x.listing_id+'">عرض الإعلان</button>':'')+(x.reported_user_id?'<button class="ab pr" data-u="'+x.reported_user_id+'">عرض الحساب</button>':'')+(x.business_id?'<a class="ab pr" href="#admbiz">مراجعة النشاط</a>':'')+'</div>'+
    '<textarea id="n-'+x.id+'" placeholder="ملاحظة إدارية">'+X(x.admin_note||'')+'</textarea><div class="adbs" style="margin:0">'+['reviewing','closed','open'].filter(function(s){return s!==x.status}).map(function(s){return '<button class="ab" data-rp="'+x.id+'" data-st="'+s+'">'+({reviewing:'قيد المعالجة',closed:'تمت المعالجة',open:'إعادة إلى جديد'})[s]+'</button>'}).join('')+'</div></div>'}).join(''):'<p class="adE">لا توجد بلاغات في هذه الحالة.</p>');
 }).catch(function(e){er('تعذّر تحميل البلاغات: '+e.message,reps)})}
function doRp(b){var id=b.dataset.rp,n=E('n-'+id).value.trim();b.disabled=true;
  sbc().rpc('admin_handle_report',{p_id:id,p_status:b.dataset.st,p_note:n||null}).then(function(r){if(r.error){b.disabled=false;msg('فشل التحديث: '+r.error.message);return}msg('تم تحديث البلاغ.',1);reload()})}

/* B83: مركز «إدارة المستخدمين والحسابات». قراءة فقط هنا؛ التعطيل/إعادة التفعيل يبقى عبر دوال B74 على الخادم. لا SQL جديد. أي مصدر غير متاح يظهر «غير متاح» ولا يُخمَّن */
function b83Q(p){return p.then(function(r){return r},function(e){return{error:e}})}
var B83AL={suspend:'تعطيل حساب',unsuspend:'إعادة تفعيل حساب',deletion_requested:'طلب حذف',deletion_cancelled:'إلغاء طلب حذف',deletion_in_review:'طلب حذف: قيد المراجعة',deletion_approved:'طلب حذف: موافقة',deletion_rejected:'طلب حذف: رفض'};
function usr(){ld();var c=sbc();
  users().then(function(){return Promise.all([b83Q(c.from('b74_suspensions').select('user_id,reason,suspended_at')),b83Q(c.from('listings').select('*').limit(1000))])}).then(function(a){
  var SU={},AC={},sErr=!!a[0].error,lErr=!!a[1].error,LD=a[1].data||[],cut=LD.length>=1000;
  (a[0].data||[]).forEach(function(x){SU[x.user_id]=x});LD.forEach(function(x){var o=own(x);if(o)AC[o]=(AC[o]||0)+1});
  var st=function(u){return u.is_admin?'مدير':sErr?'غير متاحة':SU[u.id]?'معطّل':'نشط'};
  E('adm').innerHTML='<h2>إدارة المستخدمين والحسابات</h2><p class="adE" style="padding:0 0 10px;text-align:start">بحث وتصفية وترتيب. حالة الحساب من إدارة الحسابات (B74): '+(sErr?'<b>غير متاحة حالياً</b> (يلزم b74_accounts.sql وصلاحية المدير العام)':'متاحة')+'. عدد الإعلانات: '+(lErr?'<b>غير متاح</b>':'محسوب من الإعلانات المقروءة'+(cut?' <b>(أول 1000 إعلان فقط، قد يقلّ العدد الفعلي)</b>':''))+'. لا يُعرض «آخر نشاط» لعدم وجود مصدر موثوق له؛ المعروض «آخر دخول» من نظام المصادقة.</p><label class="adE" style="display:block;padding:0 0 8px;text-align:start">تصفية: <select id="adfs"><option value="">كل الحسابات</option><option value="active">نشط</option><option value="suspended">معطّل</option><option value="admin">مدير</option><option value="ads">لديه إعلانات</option></select></label><div id="adut"></div>';
  function paint(){var f=E('adfs').value,rows=AD.users.filter(function(u){return f==='admin'?!!u.is_admin:f==='active'?st(u)==='نشط':f==='suspended'?st(u)==='معطّل':f==='ads'?(AC[u.id]||0)>0:true});
   tbl(E('adut'),[{k:'full_name',t:'الاسم',h:function(u){return X(u.full_name||'—')}},{k:'email',t:'البريد',h:function(u){return '<bdi>'+X(u.email||'')+'</bdi>'}},{k:'id',t:'المعرّف',h:function(u){return idt(u.id)}},{k:'role',t:'النوع',v:function(u){return u.is_admin?'مدير':'مستخدم'}},{k:'st',t:'الحالة',v:st,h:function(u){var s=st(u);return '<span class="bd '+(s==='معطّل'?'rejected':s==='نشط'?'published':'in_progress')+'">'+s+'</span>'}},{k:'created_at',t:'الإنشاء',h:function(u){return u.created_at?fd(u.created_at):'—'}},{k:'last_sign_in_at',t:'آخر دخول',h:function(u){return u.last_sign_in_at?fd(u.last_sign_in_at):'—'}},{k:'ads',t:'الإعلانات',v:function(u){return lErr?'':(AC[u.id]||0)},h:function(u){return lErr?'—':(AC[u.id]||0)}},{k:'x',t:'',s:false,h:function(u){return '<button class="ab pr" data-u="'+X(u.id)+'" type="button">تفاصيل</button>'}}],rows,{sort:'created_at',ps:10,empty:'لا يوجد مستخدمون.'})}
  E('adfs').onchange=paint;paint();
 }).catch(function(e){er('تعذّر تحميل المستخدمين: '+(e.message||e),usr)})}
function openU(id){users().then(function(){var u=AD.um[id];if(!u)throw new Error('المستخدم غير موجود');var c=sbc();
  return Promise.all([b83Q(c.from('listings').select('*').limit(1000)),b83Q(c.from('b74_suspensions').select('user_id,reason,suspended_at').eq('user_id',id).maybeSingle()),b83Q(c.from('biz_profiles').select('id,name,status').eq('owner_id',id).maybeSingle()),b83Q(c.from('b74_audit').select('*').eq('target',id).order('created_at',{ascending:false}).limit(20))]).then(function(a){
  var LD=a[0],L=(LD.data||[]).filter(function(x){return own(x)===id});L.forEach(function(x){if(!AD.cache[x.id])AD.cache[x.id]=x});
  var sp=a[1],bz=a[2],au=a[3],pend=L.filter(function(x){return x.status==='pending'}).length,isPA=(AD.roles||[]).indexOf('platform_admin')>-1;
  var stT=u.is_admin?'مدير':sp.error?'غير متاحة (يلزم b74_accounts.sql وصلاحية المدير العام)':sp.data?'معطّل':'نشط';
  modal('<h2 style="margin:0 0 8px">'+X(u.full_name||'بدون اسم')+'</h2><div class="addl"><div><span>المعرّف</span><bdi>'+X(u.id)+'</bdi></div><div><span>البريد</span><bdi>'+X(u.email)+'</bdi></div><div><span>الهاتف</span><bdi>'+X(u.phone||'—')+'</bdi></div><div><span>الانضمام</span>'+(u.created_at?fd(u.created_at):'—')+'</div><div><span>آخر دخول</span>'+(u.last_sign_in_at?fd(u.last_sign_in_at):'—')+'</div><div><span>النوع</span>'+(u.is_admin?'مدير':'مستخدم')+'</div><div><span>حالة الحساب</span>'+stT+'</div>'+(sp.data?'<div><span>سبب التعطيل</span>'+X(sp.data.reason||'—')+'</div><div><span>تاريخ التعطيل</span>'+(sp.data.suspended_at?fd(sp.data.suspended_at):'—')+'</div>':'')+'<div><span>النشاط التجاري</span>'+(bz.error?'غير متاح':bz.data?X(bz.data.name||'—')+' ('+X(BST[bz.data.status]||bz.data.status||'—')+')':'لا يوجد')+'</div></div>'+
   '<h3>إعلانات المستخدم ('+(LD.error?'غير متاحة':L.length)+')</h3>'+(LD.error?'<p class="adE">تعذّر قراءة الإعلانات.</p>':(pend?'<p class="adE" style="text-align:start"><b>'+pend+'</b> إعلان بانتظار المراجعة الإدارية.</p>':'')+(L.length?'<ul class="adact">'+L.map(function(x){return '<li><span>'+X(x.title)+' <span class="bd '+X(x.status)+'">'+(SL[x.status]||X(x.status))+'</span></span><button class="ab" data-ad="'+x.id+'">مراجعة</button></li>'}).join('')+'</ul>':'<p class="adE">لا توجد إعلانات.</p>')+(L.length>=1000?'<p class="adE">قُرئت أول 1000 إعلان فقط.</p>':''))+
   '<h3>الإجراءات الإدارية السابقة</h3>'+(au.error?'<p class="adE">غير متاحة (تُقرأ من سجل B74 للمدير العام).</p>':(au.data||[]).length?'<ul class="adact">'+au.data.map(function(x){return '<li><span>'+X(B83AL[x.action]||x.action)+' · '+fd(x.created_at)+(x.reason?' · '+X(x.reason):'')+'</span><span>'+idt(x.actor)+'</span></li>'}).join('')+'</ul>':'<p class="adE">لا إجراءات مسجّلة لهذا الحساب.</p>')+
   (isPA&&!u.is_admin?'<p><button class="ab '+(sp.data?'pr':'no')+'" data-b83go="'+X(id)+'" type="button">'+(sp.data?'إعادة تفعيل الحساب':'تعطيل الحساب')+' (من إدارة الحسابات، مع السبب والتأكيد)</button></p>':'')+
   '<p class="adE" style="text-align:start">التعطيل يمنع الحساب من إنشاء محتوى جديد ويفرضه الخادم، ولا يحذف أي إعلان أو طلب. <b>لم يُتحقق من هذه الواجهة</b> أن الخادم يخفي إعلانات الحساب المعطّل عن العامة أو أنه لا يعيد نشرها تلقائياً عند إعادة التفعيل؛ تُراجع سياسات RLS في الخادم. «تقييد النشر فقط» دون تعليق الحساب غير متاح هنا لعدم التحقق من وجوده في الخادم، والملاحظات الإدارية الداخلية غير مدعومة.</p>')})}).catch(function(e){msg(e.message)})}
document.addEventListener('click',function(e){var g=e.target.closest('[data-b83go]');if(!g)return;window.B83G=g.dataset.b83go;var x=document.querySelector('#adw [data-xc]');if(x)x.click();var n=document.querySelector('#adsub button[data-t="b74"]');if(n)n.click()});
function doRs(b){var rs=E('adrs').value.trim(),on=b.dataset.v==='1';if(on&&!rs){msg('اكتب السبب أولاً.');return}b.disabled=true;
  sbc().rpc('admin_set_restriction',{p_user:b.dataset.rs,p_restricted:on,p_reason:rs||null}).then(function(r){if(r.error){b.disabled=false;msg('فشلت العملية: '+r.error.message);return}AD.users=null;closeM();msg(on?'تم تقييد نشر الإعلانات لهذا الحساب.':'تم رفع التقييد.',1);reload()})}

/* ===== ADM3: مركز المستخدمين والتجار (للمدير العام فقط). قراءة من الجداول المستخدمة فعلاً، والإجراءات عبر دوال الخادم الموجودة (b74_admin_set_suspension وbiz_admin_decide) مع سبب وتأكيد وتحقق من الخادم. لا SQL جديد ولا حذف نهائي. ما لا يُدعم يُعرض «غير متاح». ===== */
var A3={sub:'ov',D:null,busy:false,f:{q:'',ty:'',st:'',pv:'',d1:'',d2:'',so:'new'},bf:{q:'',st:'',ty:'',pv:''}};
var A3BA={approve:'قبول',reject:'رفض',need_info:'طلب معلومات',suspend:'إيقاف',reinstate:'إعادة تفعيل',verify:'توثيق إداري',unverify:'إلغاء التوثيق',submit:'تقديم للمراجعة'};
function a3pa(){return(AD.roles||[]).indexOf('platform_admin')>-1}
function a3nm(id){var u=(AD.um||{})[id];return u?(u.full_name||u.email||''):''}
function a3tm(x){var t=x?new Date(x).getTime():NaN;return isNaN(t)?null:t}
function a3load(force){if(A3.D&&!force)return Promise.resolve(A3.D);if(force)AD.users=null;var c=sbc();
 return users().then(function(U){return Promise.all([b83Q(c.from('b74_suspensions').select('user_id,reason,suspended_at')),b83Q(c.from('biz_profiles').select('*').order('created_at',{ascending:false}).limit(1000)),b83Q(c.from('listings').select('*').limit(1000))]).then(function(a){
  var D={U:U,susErr:!!a[0].error,SU:{},bizErr:!!a[1].error,B:a[1].data||[],lsErr:!!a[2].error,LS:a[2].data||[],BO:{},AC:{},PN:{}};
  (a[0].data||[]).forEach(function(x){D.SU[x.user_id]=x});
  D.B.forEach(function(b){(D.BO[b.owner_id]=D.BO[b.owner_id]||[]).push(b)});
  D.LS.forEach(function(x){var o=own(x);if(o){D.AC[o]=(D.AC[o]||0)+1;if(x.status==='pending')D.PN[o]=(D.PN[o]||0)+1}});
  D.cut=D.LS.length>=1000;D.bcut=D.B.length>=1000;A3.D=D;return D})})}
function a3st(D,u){return u.is_admin?'مدير':D.susErr?'غير متاحة':D.SU[u.id]?'موقوف':'نشط'}
function a3ty(D,u){return u.is_admin?'مدير':(D.BO[u.id]||[]).length?'تاجر':'مستخدم'}
function a3upv(D,u){var b=(D.BO[u.id]||[])[0];return b&&b.province?b.province:''}
function a3rev(D,u){return(D.PN[u.id]||0)>0||(D.BO[u.id]||[]).some(function(b){return b.status==='pending'||b.status==='need_info'})}
function a3card(l,v){return '<div class="a3k'+(v==null?' na':'')+'"><b>'+(v==null?'غير متاح':v)+'</b><span>'+l+'</span></div>'}
function a3shell(){E('adm').innerHTML='<h2>مركز المستخدمين والتجار</h2><p class="adE" style="padding:0 0 10px;text-align:start">للمدير العام فقط. الحماية الفعلية في الخادم؛ إخفاء التبويب لا يكفي وحده. كل أرقام هذه الصفحة محسوبة من بيانات مقروءة فعلاً، وما لا مصدر له يظهر «غير متاح».</p><div class="adc" id="a3t">'+[['ov','نظرة عامة'],['us','الحسابات'],['bz','الأنشطة التجارية'],['lg','سجل الإجراءات']].map(function(t){return '<button type="button" data-a3="sub" data-v="'+t[0]+'"'+(A3.sub===t[0]?' class="on"':'')+'>'+t[1]+'</button>'}).join('')+'</div><div id="a3b"></div>'}
function usr3(){if(!a3pa()){E('adm').innerHTML='<h2>مركز المستخدمين والتجار</h2><p class="adE">هذه الصفحة للمدير العام فقط.</p>';return}a3shell();a3go(A3.sub)}
function a3go(s,force){A3.sub=s;[].forEach.call(document.querySelectorAll('#a3t button'),function(b){b.classList.toggle('on',b.dataset.v===s)});var h=E('a3b');if(!h){return usr3()}h.innerHTML='<p class="adE">جارٍ التحميل…</p>';
 (s==='lg'?a3lg():a3load(force).then(function(D){return({ov:a3ov,us:a3us,bz:a3bz})[s](D)})).catch(function(e){er('تعذّر التحميل: '+(e.message||e),usr3)})}
function a3ov(D){var now=Date.now(),d7=now-7*864e5,d30=now-30*864e5,U=D.U,hasC=U.some(function(u){return a3tm(u.created_at)!=null}),hasL=U.some(function(u){return a3tm(u.last_sign_in_at)!=null});
 var cn=function(k,t){return hasC?U.filter(function(u){return(a3tm(u.created_at)||0)>=t}).length:null};
 var sus=D.susErr?null:U.filter(function(u){return D.SU[u.id]}).length,B=D.bizErr?null:D.B,bc=function(f){return B?B.filter(f).length:null};
 var rv=(D.lsErr&&D.bizErr)?null:U.filter(function(u){return a3rev(D,u)}).length;
 E('a3b').innerHTML='<div class="a3g">'+a3card('إجمالي الحسابات',U.length)+a3card('جديدة آخر 7 أيام',cn('c',d7))+a3card('جديدة آخر 30 يوماً',cn('c',d30))+a3card('حسابات نشطة',sus==null?null:U.length-sus)+a3card('حسابات موقوفة',sus)+a3card('مديرون',U.filter(function(u){return u.is_admin}).length)+a3card('دخلوا آخر 7 أيام',hasL?U.filter(function(u){return(a3tm(u.last_sign_in_at)||0)>=d7}).length:null)+a3card('أنشطة تجارية',B?B.length+(D.bcut?'+':''):null)+a3card('أنشطة قيد المراجعة',bc(function(b){return b.status==='pending'||b.status==='need_info'}))+a3card('أنشطة معتمدة',bc(function(b){return b.status==='approved'}))+a3card('أنشطة موقوفة',bc(function(b){return b.status==='suspended'}))+a3card('حسابات تحتاج مراجعة',rv)+'</div>'
 +'<p class="adE" style="text-align:start">«تحتاج مراجعة» = حساب لديه إعلان أو نشاط تجاري بانتظار القرار. «آخر نشاط» غير متاح لعدم وجود مصدر موثوق؛ المعروض «آخر دخول» من نظام المصادقة.'+(D.cut?' <b>الإعلانات: قُرئت أول 1000 فقط.</b>':'')+(D.susErr?' <b>حالة الإيقاف غير متاحة (تلزم b74_accounts.sql وصلاحية المدير العام).</b>':'')+'</p>'
 +'<div class="adbs"><button type="button" class="ab pr" data-a3="sub" data-v="us">الحسابات</button><button type="button" class="ab" data-a3="sub" data-v="bz">الأنشطة التجارية</button><button type="button" class="ab" data-a3="refresh">تحديث البيانات</button></div>'
 +'<details class="a2d"><summary>ما يلزم لاحقاً (SQL وإعدادات، لم يُنفَّذ)</summary><ul><li>دالة خادم مُرقَّمة لقائمة المستخدمين وعدّادات مجمّعة؛ الحالية (admin_list_users) تُرجع كل الحسابات دفعة واحدة والعرض فقط مُرقَّم.</li><li>مصدر موثوق لـ«آخر نشاط» ولمحافظة/منطقة المستخدم نفسه (المتاح حالياً محافظة نشاطه التجاري فقط).</li><li>دالة خادم لتعديل بيانات المستخدم من الإدارة وحقل ملاحظات إدارية داخلية.</li><li>جدول تدقيق موحّد (حسابات وأنشطة) بنتيجة كل عملية؛ السجل الحالي يجمع b74_audit وbiz_audit فقط.</li><li>التأكد من سياسات القراءة للمدير على biz_profiles وb74_suspensions وbuyer_requests.</li></ul></details>'}
function a3pvs(D){var o={};D.B.forEach(function(b){if(b.province)o[b.province]=1});return Object.keys(o).sort()}
function a3sel(id,k,opts,cur,l){return '<label>'+l+'<select id="'+id+'" data-a3f="'+k+'">'+opts.map(function(p){return '<option value="'+X(p[0])+'"'+(cur===p[0]?' selected':'')+'>'+X(p[1])+'</option>'}).join('')+'</select></label>'}
function a3us(D){var f=A3.f,P=a3pvs(D).map(function(p){return[p,p]});
 E('a3b').innerHTML='<div class="a3f"><label>بحث (اسم، بريد، هاتف، معرّف)<input type="search" id="a3q" data-a3f="q" value="'+X(f.q)+'" maxlength="80"></label>'+a3sel('a3ty','ty',[['','الكل'],['مستخدم','مستخدم عادي'],['تاجر','تاجر / نشاط تجاري'],['مدير','مدير']],f.ty,'نوع الحساب')+a3sel('a3st','st',[['','الكل'],['نشط','نشط'],['موقوف','موقوف'],['rev','تحتاج مراجعة']],f.st,'الحالة')+a3sel('a3pv','pv',[['','الكل']].concat(P),f.pv,'محافظة النشاط التجاري')+'<label>من تاريخ التسجيل<input type="date" id="a3d1" data-a3f="d1" value="'+X(f.d1)+'"></label><label>إلى تاريخ<input type="date" id="a3d2" data-a3f="d2" value="'+X(f.d2)+'"></label>'+a3sel('a3so','so',[['new','الأحدث'],['old','الأقدم'],['name','الاسم']],f.so,'الترتيب')+'</div><div class="adbs"><button type="button" class="ab" data-a3="reset">مسح الفلاتر</button><button type="button" class="ab" data-a3="refresh">تحديث</button></div><p class="adE" id="a3c" style="padding:0 0 8px;text-align:start"></p><div id="a3tb"></div>'+(D.susErr?'<p class="adE er" style="text-align:start">حالة الإيقاف غير متاحة حالياً، فلا تعمل فلترة الحالة.</p>':'');a3usP()}
function a3usP(){var D=A3.D,f=A3.f,q=f.q.trim().toLowerCase(),d1=f.d1?new Date(f.d1+'T00:00:00').getTime():null,d2=f.d2?new Date(f.d2+'T23:59:59').getTime():null,tb=E('a3tb');if(!tb||!D)return;
 var rows=D.U.filter(function(u){var ct=a3tm(u.created_at);if(q&&[u.full_name,u.email,u.phone,u.id].join(' ').toLowerCase().indexOf(q)<0)return false;if(f.ty&&a3ty(D,u)!==f.ty)return false;if(f.st==='rev'){if(!a3rev(D,u))return false}else if(f.st&&a3st(D,u)!==f.st)return false;if(f.pv&&a3upv(D,u)!==f.pv)return false;if(d1!=null&&(ct==null||ct<d1))return false;if(d2!=null&&(ct==null||ct>d2))return false;return true});
 rows=rows.slice().sort(function(a,b){if(f.so==='name')return String(a.full_name||a.email||'').localeCompare(String(b.full_name||b.email||''),'ar');var x=a3tm(a.created_at)||0,y=a3tm(b.created_at)||0;return f.so==='old'?x-y:y-x});
 E('a3c').textContent=rows.length+' من '+D.U.length+' حساب';
 tbl(tb,[{k:'n',t:'الاسم',v:function(u){return u.full_name||''},h:function(u){return X(u.full_name||'—')}},{k:'e',t:'البريد',v:function(u){return u.email||''},h:function(u){return '<bdi>'+X(u.email||'—')+'</bdi>'}},{k:'p',t:'الهاتف',v:function(u){return u.phone||''},h:function(u){return '<bdi>'+X(u.phone||'—')+'</bdi>'}},{k:'t',t:'النوع',v:function(u){return a3ty(D,u)}},{k:'s',t:'الحالة',v:function(u){return a3st(D,u)},h:function(u){var s=a3st(D,u);return '<span class="bd '+(s==='موقوف'?'rejected':s==='نشط'?'published':'in_progress')+'">'+s+'</span>'+(a3rev(D,u)?' <span class="bd pending">تحتاج مراجعة</span>':'')}},{k:'c',t:'التسجيل',v:function(u){return u.created_at||''},h:function(u){return u.created_at?fd(u.created_at):'—'}},{k:'l',t:'آخر دخول',v:function(u){return u.last_sign_in_at||''},h:function(u){return u.last_sign_in_at?fd(u.last_sign_in_at):'—'}},{k:'a',t:'الإعلانات',v:function(u){return D.lsErr?'':(D.AC[u.id]||0)},h:function(u){return D.lsErr?'—':(D.AC[u.id]||0)+(D.cut?'+':'')}},{k:'x',t:'',s:false,h:function(u){return '<button class="ab pr" data-a3="user" data-id="'+X(u.id)+'" type="button">الملف</button>'}}],rows,{q:false,ps:20,empty:'لا توجد حسابات مطابقة.'})}
function a3img(b){var u=b.logo_url||b.image_url||b.avatar_url||b.cover_url||'';return/^https:\/\/[^\s<>"']+$/.test(u)?'<img class="a3av" src="'+X(u)+'" alt="'+X(b.name||'')+'">':''}
function a3bz(D){var f=A3.bf,P=a3pvs(D).map(function(p){return[p,p]});if(D.bizErr){E('a3b').innerHTML='<p class="adE er">تعذّر قراءة الأنشطة التجارية (صلاحية القراءة أو الجدول غير متاح).</p>';return}
 E('a3b').innerHTML='<div class="adE" style="text-align:start;padding:0 0 10px">حقل «موثّق» قرار إداري داخلي بعد مراجعة بيانات النشاط، ولا يعني ملكية قانونية أو توثيقاً رسمياً. الاشتراك المدفوع أو أي شارة بصرية لا يُعدّان دليلاً على التوثيق.</div><div class="a3f"><label>بحث (اسم، هاتف، مالك، معرّف)<input type="search" id="a3bq" data-a3f="bq" value="'+X(f.q)+'" maxlength="80"></label>'+a3sel('a3bs','bst',[['','الكل']].concat(Object.keys(BST).map(function(k){return[k,BST[k]]})),f.st,'الحالة')+a3sel('a3bt','bty',[['','الكل']].concat(Object.keys(BTY).map(function(k){return[k,BTY[k]]})),f.ty,'نوع النشاط')+a3sel('a3bp','bpv',[['','الكل']].concat(P),f.pv,'المحافظة')+'</div><p class="adE" id="a3bc" style="padding:0 0 8px;text-align:start"></p><div id="a3bt2"></div>'+(D.bcut?'<p class="adE er" style="text-align:start">قُرئت أول 1000 نشاط فقط.</p>':'');a3bzP()}
function a3bzP(){var D=A3.D,f=A3.bf,q=f.q.trim().toLowerCase(),tb=E('a3bt2');if(!tb||!D)return;
 var rows=D.B.filter(function(b){if(q&&[b.name,b.phone,b.whatsapp,b.id,b.owner_id,a3nm(b.owner_id)].join(' ').toLowerCase().indexOf(q)<0)return false;if(f.st&&b.status!==f.st)return false;if(f.ty&&b.business_type!==f.ty)return false;if(f.pv&&b.province!==f.pv)return false;return true});
 E('a3bc').textContent=rows.length+' من '+D.B.length+' نشاط';
 tbl(tb,[{k:'n',t:'النشاط',v:function(b){return b.name||''},h:function(b){return a3img(b)+X(b.name||'—')}},{k:'t',t:'النوع',v:function(b){return BTY[b.business_type]||b.business_type||''}},{k:'o',t:'المالك',v:function(b){return a3nm(b.owner_id)},h:function(b){return X(a3nm(b.owner_id)||'—')+' '+idt(b.owner_id)}},{k:'p',t:'المحافظة',v:function(b){return b.province||''}},{k:'s',t:'الحالة',v:function(b){return BST[b.status]||b.status||''},h:function(b){return '<span class="bd '+(b.status==='approved'?'published':b.status==='rejected'||b.status==='suspended'?'rejected':'pending')+'">'+X(BST[b.status]||b.status||'—')+'</span>'}},{k:'v',t:'توثيق إداري',v:function(b){return b.is_verified?'موثّق':'غير موثّق'}},{k:'a',t:'إعلانات المالك',v:function(b){return D.lsErr?'':(D.AC[b.owner_id]||0)},h:function(b){return D.lsErr?'—':(D.AC[b.owner_id]||0)+(D.cut?'+':'')}},{k:'c',t:'التسجيل',v:function(b){return b.created_at||''},h:function(b){return b.created_at?fd(b.created_at):'—'}},{k:'x',t:'',s:false,h:function(b){return '<button class="ab pr" data-a3="biz" data-id="'+X(b.id)+'" type="button">إدارة</button>'}}],rows,{q:false,ps:20,empty:'لا توجد أنشطة مطابقة.',sort:'c'})}
function a3user(id){var D=A3.D,u=(AD.um||{})[id],c=sbc();if(!u||!D){msg('الحساب غير موجود في البيانات المحمّلة.');return}
 Promise.all([b83Q(c.from('public_profiles').select('*').eq('id',id).maybeSingle()),b83Q(c.from('buyer_requests').select('*').eq('user_id',id).order('created_at',{ascending:false}).limit(10)),b83Q(c.from('b74_audit').select('*').eq('target',id).order('created_at',{ascending:false}).limit(20))]).then(function(a){
  var pp=a[0].data||{},av=pp.avatar_path?c.storage.from('avatars').getPublicUrl(pp.avatar_path).data.publicUrl:'',L=D.LS.filter(function(x){return own(x)===id}),BZ=D.BO[id]||[],sp=D.SU[id],me=AU&&AU.user&&AU.user.id===id,can=a3pa()&&!u.is_admin&&!me&&!D.susErr,rq=a[1];
  modal('<div class="a2h">'+(av&&/^https:/.test(av)?'<img class="a3av" src="'+X(av)+'" alt="">':'')+'<h2 style="margin:0">'+X(u.full_name||'بدون اسم')+'</h2></div><h3>بيانات المستخدم</h3><div class="addl"><div><span>المعرّف</span><bdi>'+X(u.id)+'</bdi></div><div><span>البريد</span><bdi>'+X(u.email||'—')+'</bdi></div><div><span>الهاتف</span><bdi>'+X(u.phone||'—')+'</bdi></div><div><span>النوع</span>'+a3ty(D,u)+'</div><div><span>الحالة</span>'+a3st(D,u)+'</div><div><span>التسجيل</span>'+(u.created_at?fd(u.created_at):'—')+'</div><div><span>آخر دخول</span>'+(u.last_sign_in_at?fd(u.last_sign_in_at):'—')+'</div>'+(sp?'<div><span>سبب الإيقاف</span>'+X(sp.reason||'—')+'</div><div><span>تاريخ الإيقاف</span>'+(sp.suspended_at?fd(sp.suspended_at):'—')+'</div>':'')+'</div>'
  +'<h3>النشاط التجاري (منفصل عن بيانات المستخدم)</h3>'+(D.bizErr?'<p class="adE">غير متاح.</p>':BZ.length?'<ul class="adact">'+BZ.map(function(b){return '<li><span>'+X(b.name||'—')+' · '+X(BTY[b.business_type]||'')+' <span class="bd '+(b.status==='approved'?'published':'pending')+'">'+X(BST[b.status]||b.status||'')+'</span></span><button class="ab" data-a3="biz" data-id="'+X(b.id)+'" type="button">إدارة</button></li>'}).join('')+'</ul>':'<p class="adE">لا يملك نشاطاً تجارياً. ليس كل مستخدم تاجراً.</p>')
  +'<h3>الإعلانات ('+(D.lsErr?'غير متاحة':L.length+(D.cut?'+':''))+')</h3>'+(D.lsErr?'':L.length?'<ul class="adact">'+L.slice(0,15).map(function(x){return '<li><span>'+X(x.title||'—')+' <span class="bd '+X(x.status)+'">'+X(SL[x.status]||x.status)+'</span></span><button class="ab" data-ad="'+X(x.id)+'" type="button">مراجعة</button></li>'}).join('')+'</ul>'+(L.length>15?'<p class="adE">عُرض أول 15 فقط.</p>':''):'<p class="adE">لا توجد إعلانات.</p>')
  +'<h3>الطلبات ('+(rq.error?'غير متاحة':(rq.data||[]).length)+')</h3>'+(rq.error?'':(rq.data||[]).length?'<ul class="adact">'+rq.data.map(function(x){return '<li><span>'+X(x.title||x.category||'طلب')+'</span><span>'+(x.created_at?fd(x.created_at):'')+'</span></li>'}).join('')+'</ul>':'<p class="adE">لا توجد طلبات.</p>')
  +'<p class="adE" style="text-align:start">الاستفسارات والمحادثات الخاصة غير معروضة هنا لحماية الخصوصية، ولا يوجد ربط إداري مؤكد لها. بلاغات المستخدم تُراجع من مركز الثقة.</p>'
  +'<h3>الإجراءات الإدارية السابقة</h3>'+(a[2].error?'<p class="adE">غير متاحة.</p>':(a[2].data||[]).length?'<ul class="adact">'+a[2].data.map(function(x){return '<li><span>'+X(B83AL[x.action]||x.action)+' · '+fd(x.created_at)+(x.reason?' · '+X(x.reason):'')+'</span><span>'+X(a3nm(x.actor)||'')+' '+idt(x.actor)+'</span></li>'}).join('')+'</ul>':'<p class="adE">لا إجراءات مسجّلة.</p>')
  +'<h3>الإجراءات</h3>'+(can?'<textarea id="a3r" maxlength="500" rows="3" placeholder="سبب القرار (إلزامي، 5 أحرف على الأقل، يُسجَّل)" style="width:100%;box-sizing:border-box"></textarea><div class="adbs"><button type="button" class="ab '+(sp?'pr':'no')+'" data-a3="acc" data-id="'+X(id)+'" data-v="'+(sp?'0':'1')+'">'+(sp?'إعادة تفعيل الحساب':'تعطيل الحساب')+'</button></div><p class="adE" style="text-align:start">التعطيل يمنع إنشاء محتوى جديد ويفرضه الخادم، ولا يحذف أي شيء. لا يوجد حذف نهائي من هذه الواجهة.</p>':'<p class="adE" style="text-align:start">'+(u.is_admin?'لا تُنفَّذ إجراءات على حسابات المديرين.':me?'لا يمكنك تنفيذ إجراء على حسابك.':D.susErr?'غير مفعّل: حالة الحسابات غير متاحة فلا يمكن تنفيذ أو التحقق من الإجراء.':'غير مصرح.')+'</p>')
  +'<p class="adE" style="text-align:start">تعديل بيانات المستخدم وتغيير دوره غير مفعّلين: لا توجد دالة خادم مؤكدة لذلك، ولا يُقبل أي دور قادم من المتصفح.</p>')}).catch(function(e){msg('تعذّر فتح الملف: '+(e.message||e))})}
function a3biz(id){var D=A3.D,b=D&&D.B.filter(function(x){return x.id===id})[0],c=sbc();if(!b){msg('النشاط غير موجود في البيانات المحمّلة.');return}
 b83Q(c.from('biz_audit').select('*').eq('business_id',id).order('created_at',{ascending:false}).limit(30)).then(function(au){var s=b.status,B=function(k,t,x){return '<button type="button" class="ab '+(x||'')+'" data-a3="bact" data-k="'+k+'" data-id="'+X(id)+'">'+t+'</button>'},ow=D.U.filter(function(u){return u.id===b.owner_id})[0];
  modal('<div class="a2h">'+a3img(b)+'<h2 style="margin:0">'+X(b.name||'—')+'</h2></div><div class="addl"><div><span>النوع</span>'+X(BTY[b.business_type]||b.business_type||'—')+'</div><div><span>الحالة</span>'+X(BST[s]||s||'—')+'</div><div><span>التوثيق الإداري</span>'+(b.is_verified?'موثّق':'غير موثّق')+'</div><div><span>المالك</span>'+X(a3nm(b.owner_id)||'—')+'</div><div><span>معرّف المالك</span><bdi>'+X(b.owner_id||'—')+'</bdi></div><div><span>المحافظة</span>'+X([b.province,b.area].filter(Boolean).join('، ')||'—')+'</div><div><span>الهاتف</span><bdi>'+X(b.phone||'—')+'</bdi></div><div><span>واتساب</span><bdi>'+X(b.whatsapp||'—')+'</bdi></div><div><span>إعلانات المالك</span>'+(D.lsErr?'غير متاح':(D.AC[b.owner_id]||0)+(D.cut?'+':''))+'</div><div><span>التسجيل</span>'+(b.created_at?fd(b.created_at):'—')+'</div>'+(b.review_note?'<div><span>آخر ملاحظة</span>'+X(b.review_note)+'</div>':'')+'</div>'+(a3img(b)?'':'<p class="adE" style="text-align:start">صورة النشاط غير متاحة في بيانات النشاط.</p>')+(b.description?'<p style="white-space:pre-wrap">'+X(b.description)+'</p>':'')
  +(ow?'<p><button type="button" class="ab" data-a3="user" data-id="'+X(ow.id)+'">ملف المالك</button></p>':'')
  +'<h3>سجل مراجعة النشاط وتغيير حالته</h3>'+(au.error?'<p class="adE">غير متاح.</p>':(au.data||[]).length?'<ul class="adact">'+au.data.map(function(x){return '<li><span>'+X(A3BA[x.action]||x.action||'')+' · '+(x.created_at?fd(x.created_at):'')+(x.note||x.reason?' · '+X(x.note||x.reason):'')+'</span><span>'+X(a3nm(x.actor||x.actor_id||x.admin_id)||'')+'</span></li>'}).join('')+'</ul>':'<p class="adE">لا سجل لهذا النشاط.</p>')
  +'<h3>الإجراءات</h3><textarea id="a3r" maxlength="500" rows="3" placeholder="سبب القرار (إلزامي لغير القبول وإعادة التفعيل، 5 أحرف على الأقل، يُسجَّل ويراه صاحب النشاط)" style="width:100%;box-sizing:border-box"></textarea><div class="adbs">'+((s==='pending'||s==='need_info')?B('approve','قبول','pr')+(s==='pending'?B('need_info','طلب معلومات'):'')+B('reject','رفض','no'):'')+(s==='approved'?B('suspend','إيقاف النشاط','no')+(b.is_verified?B('unverify','إلغاء التوثيق'):B('verify','توثيق إداري')):'')+(s==='suspended'?B('reinstate','إعادة التفعيل','pr'):'')+'</div>'+((s==='draft'||s==='rejected')?'<p class="adE" style="text-align:start">لا إجراء إداري متاح على هذه الحالة.</p>':'')+'<p class="adE" style="text-align:start">لا حذف نهائي للأنشطة من هذه الواجهة؛ الإيقاف هو الإجراء الآمن.</p>')})}
function a3bact(b){var id=b.dataset.id,k=b.dataset.k,rs=(E('a3r').value||'').trim(),need=!/^(approve|reinstate)$/.test(k),EX={approve:['status','approved'],reject:['status','rejected'],need_info:['status','need_info'],suspend:['status','suspended'],reinstate:['status','approved'],verify:['is_verified',true],unverify:['is_verified',false]}[k];
 if(!EX||A3.busy)return;if(need&&(rs.length<5||rs.length>500||/[<>]/.test(rs))){msg('اكتب السبب (5 إلى 500 حرف، بدون < أو >).');return}if(rs&&(rs.length>500||/[<>]/.test(rs))){msg('السبب غير صالح.');return}
 if(!confirm('تنفيذ الإجراء «'+(A3BA[k]||k)+'»؟ سيُسجَّل'+(need?' ويراه صاحب النشاط':'')+'.'))return;A3.busy=true;b.disabled=true;var c=sbc();
 c.rpc('biz_admin_decide',{p_id:id,p_action:k,p_note:rs||null}).then(function(r){if(r.error)throw r.error;return c.from('biz_profiles').select('status,is_verified').eq('id',id).maybeSingle()}).then(function(v){A3.busy=false;b.disabled=false;if(v.error||!v.data||v.data[EX[0]]!==EX[1]){msg('لم يتأكد التنفيذ من الخادم. افتح النشاط وتحقق من حالته قبل إعادة المحاولة.');return}closeM();msg('تم التنفيذ وتأكّد من الخادم وسُجّل.',1);A3.D=null;a3go(A3.sub,true)}).catch(function(e){A3.busy=false;b.disabled=false;var m=String(e&&e.message||e);msg('فشل: '+(/forbidden/.test(m)?'غير مصرح.':'حاول مرة ثانية.'))})}
function a3acc(b){var id=b.dataset.id,sus=b.dataset.v==='1',rs=(E('a3r').value||'').trim();if(A3.busy)return;if(rs.length<5||rs.length>500||/[<>]/.test(rs)){msg('اكتب السبب (5 إلى 500 حرف، بدون < أو >).');return}
 if(!confirm(sus?'تعطيل هذا الحساب؟ سيُمنع من إنشاء محتوى جديد ولا يُحذف أي شيء.':'إعادة تفعيل الحساب؟'))return;A3.busy=true;b.disabled=true;var c=sbc();
 c.rpc('b74_admin_set_suspension',{p_user:id,p_suspend:sus,p_reason:rs}).then(function(r){if(r.error)throw r.error;return c.from('b74_suspensions').select('user_id').eq('user_id',id).maybeSingle()}).then(function(v){A3.busy=false;b.disabled=false;if(v.error||!!v.data!==sus){msg('لم يتأكد التنفيذ من الخادم. تحقق من حالة الحساب قبل إعادة المحاولة.');return}closeM();msg('تم التنفيذ وتأكّد من الخادم وسُجّل.',1);A3.D=null;a3go(A3.sub,true)}).catch(function(e){A3.busy=false;b.disabled=false;var m=String(e&&e.message||e);msg('فشل: '+(/forbidden/.test(m)?'غير مصرح.':/target_admin|self_action/.test(m)?'لا يمكن تنفيذ الإجراء على حساب مدير أو حسابك.':'حاول مرة ثانية.'))})}
function a3lg(){var c=sbc();return Promise.all([users(),b83Q(c.from('b74_audit').select('*').order('created_at',{ascending:false}).limit(200)),b83Q(c.from('biz_audit').select('*,biz_profiles(name)').order('created_at',{ascending:false}).limit(200))]).then(function(a){var e1=a[1].error,e2=a[2].error,R=[];
  (a[1].data||[]).forEach(function(x){R.push({t:x.created_at,src:'حساب',actor:x.actor,act:B83AL[x.action]||x.action||'',tg:a3nm(x.target)||(x.target?String(x.target).slice(0,8)+'…':''),why:x.reason||''})});
  (a[2].data||[]).forEach(function(x){R.push({t:x.created_at,src:'نشاط',actor:x.actor||x.actor_id||x.admin_id,act:A3BA[x.action]||x.action||'',tg:(x.biz_profiles||{}).name||'',why:x.note||x.reason||''})});
  R.sort(function(p,q){return(a3tm(q.t)||0)-(a3tm(p.t)||0)});
  E('a3b').innerHTML='<p class="adE" style="text-align:start;padding:0 0 10px">يجمع سجل الحسابات (b74_audit) وسجل الأنشطة (biz_audit)، آخر 200 سجل من كل منهما. كل سجل يعني أن العملية نُفّذت وسُجّلت؛ لا تُسجَّل العمليات الفاشلة.'+(e1?' <b>سجل الحسابات غير متاح (يلزم b74_accounts.sql وصلاحية المدير العام).</b>':'')+(e2?' <b>سجل الأنشطة غير متاح.</b>':'')+' أي إجراء لا يمر عبر دوال الخادم هذه لا يظهر هنا.</p><div id="a3lt"></div>';
  tbl(E('a3lt'),[{k:'t',t:'الوقت',v:function(r){return r.t||''},h:function(r){return r.t?fd(r.t):'—'}},{k:'a',t:'المسؤول',v:function(r){return a3nm(r.actor)||String(r.actor||'')},h:function(r){return X(a3nm(r.actor)||'—')+' '+idt(r.actor)}},{k:'s',t:'النوع',v:function(r){return r.src}},{k:'x',t:'الإجراء',v:function(r){return r.act}},{k:'g',t:'المتأثر',v:function(r){return r.tg}},{k:'w',t:'السبب',v:function(r){return r.why}},{k:'r',t:'النتيجة',v:function(){return 'نُفّذ وسُجّل'}}],R,{ps:20,sort:'t',empty:'لا توجد سجلات.'})})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-a3]');if(!b||!(E('a3b')||E('adw').contains(b)))return;if(!a3pa())return;var a=b.dataset.a3;
 if(a==='sub'){return a3go(b.dataset.v)}if(a==='refresh'){return a3go(A3.sub,true)}
 if(a==='reset'){A3.f={q:'',ty:'',st:'',pv:'',d1:'',d2:'',so:'new'};return a3us(A3.D)}
 if(a==='user'){return a3user(b.dataset.id)}if(a==='biz'){return a3biz(b.dataset.id)}if(a==='acc'){return a3acc(b)}if(a==='bact'){return a3bact(b)}});
function a3in(e){var t=e.target.closest('[data-a3f]');if(!t||!A3.D||!E('a3b'))return;var k=t.dataset.a3f,v=t.value;
 if(k==='bq'){A3.bf.q=v;return a3bzP()}if(k==='bst'){A3.bf.st=v;return a3bzP()}if(k==='bty'){A3.bf.ty=v;return a3bzP()}if(k==='bpv'){A3.bf.pv=v;return a3bzP()}
 A3.f[k]=v;a3usP()}
document.addEventListener('input',function(e){if(e.target.matches&&e.target.matches('input[data-a3f]'))a3in(e)});document.addEventListener('change',function(e){if(e.target.matches&&e.target.matches('select[data-a3f],input[type=date][data-a3f]'))a3in(e)});
/* ===== ADM4: مركز الإعلانات والمنتجات. يعيد تنظيم صفحة مراجعة الإعلانات الحالية (نفس دالة الخادم admin_set_listing_status ونفس الصلاحيات) ويضيف قائمة مُرقَّمة من الخادم وصفحات فرعية. لا يُعتمد أي قرار قبل قراءة الحالة من الخادم. ما لا يدعمه النظام (إعادة لاستكمال البيانات، التمييز، اختيار إعلانات الواجهة) يُعرض كهيكل غير مفعّل بلا حفظ. ===== */
var A4={sub:null,seen:null,pg:0,q:'',cat:'',pv:'',d1:'',d2:'',so:'new',C:{},bad:{},opts:null,ownCol:null,seq:0,tmo:0};
var A4S={all:1,pending:1,draft:1,published:1,rejected:1,suspended:1,archived:1},A4PS=20;
var A4T=[['all','جميع الإعلانات'],['pending','بانتظار المراجعة'],['draft','المسودات'],['published','المنشورة'],['returned','المعادة لاستكمال البيانات'],['rejected','المرفوضة'],['suspended','الموقوفة'],['archived','المؤرشفة'],['paid','المميزة والمدفوعة'],['home','إعلانات الواجهة'],['cats','التصنيفات والحقول']];
var A4CL={boat:'قوارب',jetski:'جت سكي',engine:'محركات',accessory:'معدات وإكسسوارات',parts:'قطع غيار'};
var A4UU=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function a4sl(s){return SL[s]||(s==='archived'?'متوقف من صاحبه (مؤرشف)':s==='draft'?'مسودة':s||'—')}
function a4s(t){return String(t).replace(/[%_,()*\\]/g,' ').trim()}
function a4dt(v,end){try{return new Date(v+(end?'T23:59:59+03:00':'T00:00:00+03:00')).toISOString()}catch(e){return null}}
function a4box(h){E('a4b').innerHTML=h}
function l4(){if(AD.f.ads!==A4.seen){A4.seen=AD.f.ads;if(A4S[AD.f.ads])A4.sub=AD.f.ads;A4.pg=0}if(!A4.sub)A4.sub='pending';
 E('adm').innerHTML='<h2>الإعلانات والمنتجات</h2><p class="adE" style="padding:0 0 10px;text-align:start">كل وظائف الإعلانات في مكان واحد. القرارات تُنفَّذ عبر دالة الخادم ولا تُعتمد إلا بعد قراءة الحالة منه؛ الصلاحية الفعلية في الخادم لا في هذه الواجهة.</p><div class="adc" id="a4t">'+A4T.map(function(t){return '<button type="button" data-a4="sub" data-v="'+t[0]+'"'+(A4.sub===t[0]?' class="on"':'')+'>'+t[1]+(A4S[t[0]]?' <small id="a4n-'+t[0]+'"></small>':'')+'</button>'}).join('')+'</div><div id="a4b"></div>';
 a4cnt();a4go(A4.sub)}
function a4bd(k,n){var e=E('a4n-'+k);if(e)e.textContent=n==null?'(؟)':'('+n+')'}
function a4cnt(){Object.keys(A4S).forEach(function(k){cnt('listings',k==='all'?null:function(q){return q.eq('status',k)}).then(function(n){A4.C[k]=n;A4.bad[k]=false;a4bd(k,n)},function(){A4.C[k]=null;A4.bad[k]=true;a4bd(k,null)})})}
function a4go(s){A4.sub=s;if(A4S[s]){AD.f.ads=s;A4.seen=s}[].forEach.call(document.querySelectorAll('#a4t button'),function(b){b.classList.toggle('on',b.dataset.v===s)});
 ({returned:a4ret,paid:a4paid,home:a4home,cats:a4cats})[s]?({returned:a4ret,paid:a4paid,home:a4home,cats:a4cats})[s]():a4list()}
function a4opts(){if(A4.opts)return Promise.resolve(A4.opts);var c=sbc();return Promise.all([b83Q(c.from('listings').select('category,province').limit(1000)),b83Q(c.from('listings').select('*').limit(1))]).then(function(a){var o={cats:[],pvs:[],cut:false},C={},P={};(a[0].data||[]).forEach(function(x){if(x.category)C[x.category]=1;if(x.province)P[x.province]=1});o.cats=Object.keys(C).sort();o.pvs=Object.keys(P).sort();o.cut=(a[0].data||[]).length>=1000;var r=(a[1].data||[])[0];if(r)['user_id','owner_id','seller_id','created_by'].some(function(k){if(k in r){A4.ownCol=k;return true}});A4.opts=o;return o})}
function a4fill(o){var c=E('a4c'),p=E('a4p');if(c)c.innerHTML='<option value="">الكل</option>'+o.cats.map(function(v){return '<option value="'+X(v)+'"'+(A4.cat===v?' selected':'')+'>'+X(A4CL[v]||v)+'</option>'}).join('');if(p)p.innerHTML='<option value="">الكل</option>'+o.pvs.map(function(v){return '<option value="'+X(v)+'"'+(A4.pv===v?' selected':'')+'>'+X(v)+'</option>'}).join('')}
function a4list(){var f=A4;a4box('<div class="a3f"><label>بحث (عنوان، معرّف كامل، ناشر أو نشاط)<input type="search" id="a4q" data-a4f="q" value="'+X(f.q)+'" maxlength="80"></label><label>التصنيف<select id="a4c" data-a4f="cat"><option value="">الكل</option></select></label><label>المحافظة<select id="a4p" data-a4f="pv"><option value="">الكل</option></select></label><label>من تاريخ النشر<input type="date" data-a4f="d1" value="'+X(f.d1)+'"></label><label>إلى تاريخ<input type="date" data-a4f="d2" value="'+X(f.d2)+'"></label><label>الترتيب<select data-a4f="so"><option value="new"'+(f.so==='new'?' selected':'')+'>الأحدث</option><option value="old"'+(f.so==='old'?' selected':'')+'>الأقدم</option></select></label></div><div class="adbs"><button type="button" class="ab" data-a4="reset">مسح الفلاتر</button><button type="button" class="ab" data-a4="refresh">تحديث</button></div><p class="adE" id="a4m" style="padding:0 0 8px;text-align:start"></p><div id="a4l"></div><p class="adE" style="text-align:start">المشاهدات لكل إعلان غير معروضة: لا مصدر إداري مؤكد لها (b52_admin_stats تعرض إجماليات فقط). التقييمات والأسئلة غير مرتبطة بالإعلانات في هذه الواجهة.</p>');
 a4opts().then(a4fill);a4fetch()}
function a4build(){var t=A4.q.trim(),c=sbc(),pre=Promise.resolve([]);
 if(t&&!A4UU.test(t)){var lw=t.toLowerCase();pre=Promise.all([users().catch(function(){return[]}),b83Q(c.from('biz_profiles').select('owner_id').ilike('name','%'+a4s(t)+'%').limit(50))]).then(function(a){var ids={};a[0].forEach(function(u){if([u.full_name,u.email,u.phone].join(' ').toLowerCase().indexOf(lw)>-1)ids[u.id]=1});(a[1].data||[]).forEach(function(b){if(b.owner_id)ids[b.owner_id]=1});return Object.keys(ids).filter(function(i){return A4UU.test(i)}).slice(0,60)})}
 return Promise.all([pre,a4opts()]).then(function(a){var ids=a[0],q=c.from('listings').select(SEL,{count:'exact'});
  if(A4S[A4.sub]&&A4.sub!=='all')q=q.eq('status',A4.sub);if(A4.cat)q=q.eq('category',A4.cat);if(A4.pv)q=q.eq('province',A4.pv);
  var d1=A4.d1&&a4dt(A4.d1),d2=A4.d2&&a4dt(A4.d2,1);if(d1)q=q.gte('created_at',d1);if(d2)q=q.lte('created_at',d2);
  if(t){if(A4UU.test(t))q=q.eq('id',t);else if(ids.length&&A4.ownCol)q=q.or('title.ilike.%'+a4s(t)+'%,'+A4.ownCol+'.in.('+ids.join(',')+')');else q=q.ilike('title','%'+a4s(t)+'%')}
  return q.order('created_at',{ascending:A4.so==='old'}).range(A4.pg*A4PS,A4.pg*A4PS+A4PS-1)})}
function a4fetch(){var sq=++A4.seq,L=E('a4l');if(!L)return;L.innerHTML='<p class="adE">جارٍ التحميل…</p>';var m=E('a4m');if(m)m.textContent=(A4.q.trim()&&!A4UU.test(A4.q.trim())&&!A4.ownCol)?'البحث بالناشر غير متاح (عمود المالك غير معروف)؛ البحث بالعنوان فقط.':'';
 a4build().then(function(q){return q}).then(function(r){if(sq!==A4.seq)return;if(r.error)throw r.error;var D=r.data||[],tot=r.count,c=sbc();D.forEach(function(x){AD.cache[x.id]=x});var ow={};D.forEach(function(x){var o=own(x);if(o)ow[o]=1});var ids=Object.keys(ow);
  return Promise.all([users().catch(function(){return[]}),ids.length?b83Q(c.from('biz_profiles').select('owner_id,name,status').in('owner_id',ids)):Promise.resolve({data:[]})]).then(function(z){if(sq!==A4.seq)return;a4draw(D,tot,z[1].data||[])})}).catch(function(e){if(sq!==A4.seq)return;var msg0=String(e&&e.message||e),bad=/invalid input value for enum|22P02/.test(msg0);L.innerHTML='<div class="adE er">'+(bad?'هذه الحالة غير مدعومة في قاعدة البيانات الحالية، فلا توجد إعلانات بها.':'تعذّر تحميل الإعلانات: '+X(msg0))+'<br><br><button type="button" class="ab pr" data-a4="refresh">إعادة المحاولة</button></div>'})}
function a4draw(D,tot,B){var L=E('a4l');if(!L)return;var bm={};B.forEach(function(b){bm[b.owner_id]=b});var pgs=tot==null?null:Math.max(1,Math.ceil(tot/A4PS));
 L.innerHTML=D.length?'<div class="adtw"><table class="adt adt-r"><thead><tr><th></th><th>الإعلان</th><th>الناشر</th><th>السعر والمنطقة</th><th>الحالة</th><th>التاريخ</th><th></th></tr></thead><tbody>'+D.map(function(x){var im=imgs(x)[0],u=AD.um[own(x)],b=bm[own(x)];return '<tr><td data-l="">'+(im?'<img class="th" loading="lazy" decoding="async" src="'+X(im)+'" alt="">':'—')+'</td><td data-l="الإعلان"><b>'+X(x.title||'—')+'</b><br><small>'+idt(x.id)+' · '+X(A4CL[x.category]||x.category||'—')+'</small></td><td data-l="الناشر">'+X(u?(u.full_name||u.email):(own(x)?String(own(x)).slice(0,8)+'…':'—'))+(b?'<br><small>نشاط: '+X(b.name||'—')+'</small>':'')+'</td><td data-l="السعر والمنطقة">'+(x.price!=null?X(x.price)+' '+X(x.currency||''):'—')+'<br><small>'+X([x.province,x.area].filter(Boolean).join('، ')||'—')+'</small></td><td data-l="الحالة"><span class="bd '+X(x.status)+'">'+X(a4sl(x.status))+'</span></td><td data-l="التاريخ">'+(x.created_at?fd(x.created_at):'—')+(x.updated_at&&x.updated_at!==x.created_at?'<br><small>تحديث: '+fd(x.updated_at)+'</small>':'')+'</td><td><button class="ab pr" data-ad="'+X(x.id)+'" type="button">فتح ومراجعة</button></td></tr>'}).join('')+'</tbody></table></div><div class="adpg"><button class="ab" data-a4="pg" data-v="-1" type="button"'+(A4.pg?'':' disabled')+'>السابق</button><span>صفحة '+(A4.pg+1)+(pgs?' / '+pgs:'')+(tot!=null?' · '+tot+' إعلان':'')+'</span><button class="ab" data-a4="pg" data-v="1" type="button"'+((pgs?A4.pg<pgs-1:D.length===A4PS)?'':' disabled')+'>التالي</button></div>':'<p class="adE">'+(A4.pg?'لا توجد نتائج في هذه الصفحة.':'لا توجد إعلانات مطابقة.')+'</p>'+(A4.pg?'<div class="adbs"><button class="ab" data-a4="pg" data-v="-1" type="button">السابق</button></div>':'')}
function a4unsup(t,why,need){a4box('<div class="adE" style="text-align:start"><h3 style="margin-top:0">'+t+' <span class="bz-t">غير مفعّل</span></h3><p>'+why+'</p><p><b>المطلوب لاحقاً:</b> '+need+'</p></div>')}
function a4ret(){a4unsup('المعادة لاستكمال البيانات','حالات الإعلان المؤكدة في النظام هي: بانتظار المراجعة، منشور، مرفوض، موقوف، متوقف (مؤرشف). لا توجد حالة «إعادة لاستكمال البيانات» ولا تدعمها دالة الخادم admin_set_listing_status، لذلك لا يظهر زر لها ولا أُجبر الرفض على أداء دورها.','حالة جديدة (مثل needs_info) أو حقل ملاحظة المراجع، مع تحديث دالة القرار، وإظهار السبب لصاحب الإعلان في «إعلاناتي» ليعدّل ويعيد الإرسال، وإشعاره.')}
function a4pl(t){return '<fieldset disabled style="border:1px dashed var(--line);border-radius:12px;padding:10px;margin:0 0 12px"><legend>'+t+' (هيكل تصميم، لا يُحفظ)</legend><div class="a3f"><label>الإعلان (المعرّف)<input type="text"></label><label>الموضع<select><option>الرئيسية: عام</option><option>قوارب</option><option>جت سكي</option><option>محركات</option></select></label><label>الترتيب<input type="number" min="1"></label><label>بداية العرض<input type="date"></label><label>نهاية العرض<input type="date"></label><label><input type="checkbox"> تفعيل العرض</label></div><button type="button" class="ab">حفظ (غير مفعّل)</button></fieldset>'}
function a4paid(){a4box('<p class="adE">جارٍ التحميل…</p>');var f0=function(f){return cnt('b55_payments',f).then(function(n){return n},function(){return null})};
 Promise.all([f0(null),f0(function(q){return q.eq('status','pending_review')})]).then(function(a){var v=function(n){return n==null?'غير متاح':n};
  a4box('<div class="a3g"><div class="a3k"><b>'+v(a[0])+'</b><span>طلبات شراء باقات المنشورات (الكل)</span></div><div class="a3k"><b>'+v(a[1])+'</b><span>طلبات دفع بانتظار المراجعة</span></div><div class="a3k na"><b>غير متاح</b><span>إعلانات مميزة أو مروَّجة</span></div></div>'
  +'<div class="adE" style="text-align:start"><h3 style="margin-top:0">حالة الدفع وحالة الترويج منفصلتان</h3><p><b>الدفع:</b> النظام الحالي (B55) يبيع باقات «عدد منشورات» لحساب المستخدم، ولا يربط دفعة بإعلان معيّن. لا تُسجَّل هنا أي دفعة أو إيراد.</p><p><b>الترويج/التمييز:</b> لا يوجد حقل أو جدول لتمييز إعلان أو ترويجه، فلا يمكن تحديد إعلان «مميز» فعلياً.</p><p><a class="ab pr" href="#admpay">مراجعة المدفوعات (الحالية)</a></p></div>'
  +a4pl('إدارة الإعلانات المميزة')+'<details class="a2d"><summary>ما يلزم لاحقاً (SQL وتكامل، لم يُنفَّذ)</summary><ul><li>جدول عروض ترويجية (listing_id، الموضع، الترتيب، بداية ونهاية، مفعّل، مصدر الدفع) مع سياسات تقصر الكتابة على المدير.</li><li>ربط الترويج بطلب دفع مؤكد (b55_payments أو جدول جديد) قبل التفعيل، وتسجيل الإيراد في دفتر مالي لا من الواجهة.</li><li>قراءة الموقع العام للترويج الفعّال فقط ضمن مدة العرض.</li></ul></details>')})}
function a4home(){a4box('<p class="adE">جارٍ التحميل…</p>');sbc().from('listings').select(SEL).eq('status','published').order('created_at',{ascending:false}).limit(12).then(function(r){if(r.error)throw r.error;var D=r.data||[];D.forEach(function(x){AD.cache[x.id]=x});
  a4box('<div class="adE" style="text-align:start"><h3 style="margin-top:0">إعلانات الواجهة الرئيسية</h3><p>الواجهة الحالية تعرض أحدث الإعلانات المنشورة تلقائياً (عام، ثم قوارب وجت سكي ومحركات)، ولا يوجد اختيار يدوي لإعلانات الواجهة. يمكن إخفاء أقسام الرئيسية من <a href="#admin" data-adgo="site">تعديل المنصة</a> أو <a href="#admcms">محرر المحتوى</a>.</p></div><h3>أحدث المنشور الآن (للاطلاع فقط)</h3>'+(D.length?'<ul class="adact">'+D.map(function(x){var im=imgs(x)[0];return '<li><span>'+(im?'<img class="th" loading="lazy" src="'+X(im)+'" alt=""> ':'')+X(x.title||'—')+' · '+X(A4CL[x.category]||x.category||'')+'</span><button class="ab" data-ad="'+X(x.id)+'" type="button">فتح</button></li>'}).join('')+'</ul>':'<p class="adE">لا توجد إعلانات منشورة.</p>')+a4pl('اختيار إعلانات الواجهة يدوياً')+'<details class="a2d"><summary>ما يلزم لاحقاً (SQL، لم يُنفَّذ)</summary><ul><li>جدول أو إعداد لاختيار الإعلانات وترتيبها وفترة عرضها، وقراءة الموقع العام له مع الرجوع للعرض التلقائي عند غيابه.</li></ul></details>')}).catch(function(e){er('تعذّر تحميل إعلانات الواجهة: '+(e.message||e),l4)})}
function a4cats(){a4box('<p class="adE">جارٍ التحميل…</p>');a4opts().then(function(o){return Promise.all(o.cats.map(function(k){return cnt('listings',function(q){return q.eq('category',k)}).then(function(n){return[k,n]},function(){return[k,null]})}))}).then(function(a){
  a4box('<div class="adE" style="text-align:start"><p>تصنيفات الإعلانات الفعلية في قاعدة البيانات (المعرّفات ثابتة ولا تُغيَّر من هنا). إعدادات الأقسام وحقولها وإضافة تصنيف جديد مثل «جاكبوت» تُدار من «تعديل المنصة»، وهي محفوظة كتصميم فقط وغير مطبّقة على نماذج الإعلانات بعد.</p></div><div class="adbs"><button type="button" class="ab pr" data-adgo="site">تعديل المنصة: الأقسام وحقول التصنيفات</button><button type="button" class="ab" data-adgo="ref">التصنيفات والمراجع</button></div>'+(a.length?'<ul class="adact">'+a.map(function(x){return '<li><span>'+X(A4CL[x[0]]||x[0])+' <bdi class="a2id">'+X(x[0])+'</bdi></span><span>'+(x[1]==null?'غير متاح':x[1]+' إعلان')+'</span></li>'}).join('')+'</ul>':'<p class="adE">لا توجد تصنيفات مقروءة.</p>')+'<p class="adE" style="text-align:start">«جاكبوت» لا تفاصيل فنية له بعد؛ لا يُربط بحقول ولا يظهر في الإعلانات قبل تحديد صاحب المنصة لها وتوسيع قيد التصنيف في الخادم (SQL لاحق).</p>')}).catch(function(e){er('تعذّر تحميل التصنيفات: '+(e.message||e),l4)})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-a4]');if(!b||!E('adm')||!E('adm').contains(b)||AD.tab!=='ads')return;var a=b.dataset.a4;
 if(a==='sub'){A4.pg=0;return a4go(b.dataset.v)}if(a==='pg'){A4.pg=Math.max(0,A4.pg+(+b.dataset.v));return a4fetch()}
 if(a==='reset'){A4.q='';A4.cat='';A4.pv='';A4.d1='';A4.d2='';A4.so='new';A4.pg=0;return a4list()}if(a==='refresh'){a4cnt();return a4fetch()}});
function a4in(e){var t=e.target.closest('[data-a4f]');if(!t||AD.tab!=='ads'||!E('a4b'))return;var k=t.dataset.a4f;A4[k]=t.value;A4.pg=0;if(k==='q'){clearTimeout(A4.tmo);A4.tmo=setTimeout(a4fetch,350);return}a4fetch()}
document.addEventListener('input',function(e){if(e.target.matches&&e.target.matches('input[data-a4f][type=search]'))a4in(e)});document.addEventListener('change',function(e){if(e.target.matches&&e.target.matches('select[data-a4f],input[type=date][data-a4f]'))a4in(e)});
/* ===== ADM5: مركز الطلبات والخدمات. يجمع طلبات القطع والخدمات (service_requests) وطلبات الشراء (buyer_requests عبر b62_admin_requests) والمتابعة في تبويب واحد. قراءة بترقيم من الخادم؛ تغيير الحالة عبر admin_set_request_status فقط وبعد قراءة الحالة من الخادم. ما لا تدعمه البنية الحالية (إسناد لموظف، ملاحظة داخلية، محادثة مرتبطة، السعر والكمية، حالات التوصيل، التأخر بموعد) يُعرض «غير متاح» بلا حفظ. لا SQL ولا حذف. ===== */
var A5={sub:'ov',pg:0,q:'',ty:'',st:'',d1:'',d2:'',bz:'',so:'new',seq:0,tmo:0,bpg:0,bq:'',bst:'',bseq:0,fseq:0};
var A5S={'new':'جديد',reviewing:'قيد المراجعة',need_info:'نحتاج معلومات إضافية',searching:'جارٍ البحث عن القطعة أو مقدم الخدمة',found:'تم العثور على خيار مناسب',done:'مكتمل',cancelled:'ملغي'},A5PS=20,A5NEWD=2,A5STALED=7;
var A5T=[['ov','نظرة عامة'],['req','طلبات القطع والخدمات'],['buy','طلبات الشراء والعروض'],['fu','المتابعة']];
var A5TY={part:'قطعة غيار',service:'خدمة'},A5BS={open:'مفتوح',expired:'منتهٍ',closed_found:'تم العثور',closed_cancelled:'ملغي',closed_x:'مغلق (قديم)',hidden:'مخفي'};
function a5b(s){return '<span class="bd '+(s==='cancelled'?'rejected':(s==='done'||s==='found')?'published':'pending')+'">'+X(A5S[s]||s||'—')+'</span>'}
function a5box(h){var e=E('a5b');if(e)e.innerHTML=h}
function a5ago(d){return new Date(Date.now()-d*864e5).toISOString()}
function l5(){E('adm').innerHTML='<h2>مركز الطلبات والخدمات</h2><p class="adE" style="padding:0 0 10px;text-align:start">كل طلبات المنصة في مكان واحد. القراءة والتغيير عبر الخادم فقط، ولا يُعلَن نجاح أي إجراء قبل قراءة الحالة منه؛ الصلاحية الفعلية في الخادم لا في هذه الواجهة.</p><div class="adc" id="a5t">'+A5T.map(function(t){return '<button type="button" data-a5="sub" data-v="'+t[0]+'"'+(A5.sub===t[0]?' class="on"':'')+'>'+t[1]+'</button>'}).join('')+'</div><div id="a5b"></div>';a5go(A5.sub)}
function a5go(s){A5.sub=s;[].forEach.call(document.querySelectorAll('#a5t button'),function(b){b.classList.toggle('on',b.dataset.v===s)});({ov:a5ov,req:a5req,buy:a5buy,fu:a5fu})[s]()}
function a5c(f){return cnt('service_requests',f).then(function(n){return n},function(){return null})}
function a5sum(a){return a.some(function(n){return n==null})?null:a.reduce(function(x,y){return x+y},0)}
function a5ov(){a5box('<p class="adE">جارٍ التحميل…</p>');var K=['new','reviewing','need_info','searching','found','done','cancelled'];
 Promise.all([a5c(null)].concat(K.map(function(k){return a5c(function(q){return q.eq('status',k)})})).concat([cnt('buyer_requests').then(function(n){return n},function(){return null}),a5c(function(q){return q.eq('req_type','part')}),a5c(function(q){return q.eq('req_type','service')}),a5c(function(q){return q.in('status',['reviewing','need_info','searching','found']).lt('updated_at',a5ago(A5STALED))})])).then(function(a){
  var v=function(n){return n==null?'غير متاح':n},T=a[0],S={};K.forEach(function(k,i){S[k]=a[i+1]});var kn=a5sum(K.map(function(k){return S[k]})),oth=(T!=null&&kn!=null&&T!==kn)?T-kn:0;
  var card=function(n,t,na){return '<div class="a3k'+(na?' na':'')+'"><b>'+v(n)+'</b><span>'+t+'</span></div>'};
  a5box('<h3>طلبات القطع والخدمات (جدول service_requests)</h3><div class="a3g">'+card(T,'إجمالي الطلبات')+card(S['new'],'جديدة')+card(S.reviewing,'تنتظر المراجعة (قيد المراجعة)')+card(S.need_info,'بانتظار معلومات من الزبون')+card(a5sum([S.searching,S.found]),'قيد المعالجة (بحث أو تم العثور)')+card(S.done,'مكتملة')+card(S.cancelled,'ملغاة')+card(a[11],'راكدة أكثر من '+A5STALED+' أيام')+card(null,'متأخرة بموعد (لا مواعيد في النظام)',1)+'</div>'
  +(oth?'<p class="adE" style="text-align:start">'+oth+' طلب بحالة غير معروفة للواجهة ضمن الإجمالي.</p>':'')
  +'<p class="adE" style="text-align:start">حسب النوع: قطع غيار '+v(a[9])+' · خدمات '+v(a[10])+'. الحالات متنافية فلا يُحسب طلب مرتين.</p>'
  +'<h3>طلبات الشراء (جدول مستقل، لا يُجمع مع ما سبق)</h3><div class="a3g">'+card(a[8],'إجمالي طلبات الشراء')+'</div><p class="adE" style="text-align:start">تفصيل حالاتها (مفتوح، منتهٍ، مغلق، مخفي) في تبويب «طلبات الشراء والعروض» لأن الحالة الفعلية تُحسب في الخادم.</p>'
  +'<div class="adbs"><button type="button" class="ab pr" data-a5="sub" data-v="req">فتح قائمة الطلبات</button><button type="button" class="ab" data-a5="sub" data-v="fu">المتابعة</button></div>')})}
function a5opts(){var o='<option value="">الكل</option>';return o}
function a5list(){var f=A5;a5box('<div class="a3f"><label>بحث (رقم الطلب، اسم الزبون، الهاتف)<input type="search" data-a5f="q" value="'+X(f.q)+'" maxlength="80"></label><label>النوع<select data-a5f="ty"><option value="">الكل</option>'+Object.keys(A5TY).map(function(k){return '<option value="'+k+'"'+(f.ty===k?' selected':'')+'>'+A5TY[k]+'</option>'}).join('')+'</select></label><label>الحالة<select data-a5f="st"><option value="">الكل</option>'+Object.keys(A5S).map(function(k){return '<option value="'+k+'"'+(f.st===k?' selected':'')+'>'+X(A5S[k])+'</option>'}).join('')+'</select></label><label>التاجر أو مقدم الخدمة (اسم)<input type="search" data-a5f="bz" value="'+X(f.bz)+'" maxlength="60"></label><label>من تاريخ<input type="date" data-a5f="d1" value="'+X(f.d1)+'"></label><label>إلى تاريخ<input type="date" data-a5f="d2" value="'+X(f.d2)+'"></label><label>الترتيب<select data-a5f="so"><option value="new"'+(f.so==='new'?' selected':'')+'>الأحدث</option><option value="old"'+(f.so==='old'?' selected':'')+'>الأقدم</option></select></label></div><div class="adbs"><button type="button" class="ab" data-a5="reset">مسح الفلاتر</button></div><p class="adE" id="a5m" style="padding:4px 0"></p><div id="a5l"></div>');a5fetch()}
function a5req(){a5list()}
function a5ids(){var t=A5.q.trim(),b=A5.bz.trim(),c=sbc(),lw=t.toLowerCase();return Promise.all([t?users().catch(function(){return[]}):Promise.resolve([]),b?b83Q(c.from('biz_profiles').select('id').ilike('name','%'+a4s(b)+'%').limit(50)):Promise.resolve(null)]).then(function(a){var u=[];if(t)a[0].forEach(function(x){if([x.full_name,x.email,x.phone].join(' ').toLowerCase().indexOf(lw)>-1&&A4UU.test(x.id))u.push(x.id)});return{u:u.slice(0,60),b:a[1]?(a[1].data||[]).map(function(x){return x.id}).filter(function(i){return A4UU.test(i)}):null}})}
function a5fetch(){var sq=++A5.seq,L=E('a5l');if(!L)return;L.innerHTML='<p class="adE">جارٍ التحميل…</p>';var c=sbc();
 a5ids().then(function(z){if(sq!==A5.seq)return;if(z.b&&!z.b.length)return{data:[],count:0};var t=A5.q.trim(),q=c.from('service_requests').select('*',{count:'exact'});
  if(A5.ty)q=q.eq('req_type',A5.ty);if(A5.st)q=q.eq('status',A5.st);if(z.b)q=q.in('biz_id',z.b);
  var d1=A5.d1&&a4dt(A5.d1),d2=A5.d2&&a4dt(A5.d2,1);if(d1)q=q.gte('created_at',d1);if(d2)q=q.lte('created_at',d2);
  if(t){var p=[];if(/^#?\d+$/.test(t))p.push('req_no.eq.'+t.replace('#',''));if(a4s(t))p.push('contact_value.ilike.%'+a4s(t)+'%');if(z.u.length)p.push('user_id.in.('+z.u.join(',')+')');if(p.length)q=q.or(p.join(','))}
  return q.order('created_at',{ascending:A5.so==='old'}).range(A5.pg*A5PS,A5.pg*A5PS+A5PS-1)}).then(function(r){if(sq!==A5.seq||!r)return;if(r.error)throw r.error;var D=r.data||[],ids={};D.forEach(function(x){if(x.biz_id)ids[x.biz_id]=1});ids=Object.keys(ids);
  return Promise.all([users().catch(function(){return[]}),ids.length?b83Q(c.from('biz_profiles').select('id,name').in('id',ids)):Promise.resolve({data:[]})]).then(function(z){if(sq!==A5.seq)return;a5draw(D,r.count,z[1].data||[])})}).catch(function(e){if(sq!==A5.seq)return;L.innerHTML='<div class="adE er">تعذّر تحميل الطلبات: '+X(String(e&&e.message||e))+'<br><br><button type="button" class="ab pr" data-a5="refresh">إعادة المحاولة</button></div>'})}
function a5draw(D,tot,B){var L=E('a5l');if(!L)return;var bm={};B.forEach(function(b){bm[b.id]=b.name});var pgs=tot==null?null:Math.max(1,Math.ceil(tot/A5PS));
 L.innerHTML=D.length?'<div class="adtw"><table class="adt adt-r"><thead><tr><th>رقم الطلب</th><th>النوع</th><th>الزبون</th><th>التاجر / مقدم الخدمة</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>'+D.map(function(x){var u=AD.um[x.user_id];return '<tr><td data-l="رقم الطلب"><b><bdi>#'+X(x.req_no!=null?x.req_no:String(x.id).slice(0,8))+'</bdi></b></td><td data-l="النوع">'+X(A5TY[x.req_type]||x.req_type||'—')+'</td><td data-l="الزبون">'+X(u?(u.full_name||u.email||'—'):'—')+'<br><small><bdi>'+X(x.contact_value||(u&&u.phone)||'—')+'</bdi></small></td><td data-l="التاجر">'+(x.biz_id?X(bm[x.biz_id]||'نشاط غير معروف'):'غير مرتبط')+'</td><td data-l="التاريخ">'+(x.created_at?fd(x.created_at):'—')+(x.updated_at&&x.updated_at!==x.created_at?'<br><small>تحديث: '+fd(x.updated_at)+'</small>':'')+'</td><td data-l="الحالة">'+a5b(x.status)+'</td><td><button class="ab pr" data-a5="open" data-id="'+X(x.id)+'" type="button">التفاصيل</button></td></tr>'}).join('')+'</tbody></table></div><div class="adpg"><button class="ab" data-a5="pg" data-v="-1" type="button"'+(A5.pg?'':' disabled')+'>السابق</button><span>صفحة '+(A5.pg+1)+(pgs?' / '+pgs:'')+(tot!=null?' · '+tot+' طلب':'')+'</span><button class="ab" data-a5="pg" data-v="1" type="button"'+((pgs?A5.pg<pgs-1:D.length===A5PS)?'':' disabled')+'>التالي</button></div>':'<p class="adE">'+(A5.pg?'لا توجد نتائج في هذه الصفحة.':'لا توجد طلبات مطابقة.')+'</p>'+(A5.pg?'<div class="adbs"><button class="ab" data-a5="pg" data-v="-1" type="button">السابق</button></div>':'')}
function a5next(s){return s==='done'||s==='cancelled'?[]:Object.keys(A5S).filter(function(k){return k!==s})}
function a5open(id){var c=sbc();modal('<p class="adE">جارٍ التحميل…</p>');
 b83Q(c.from('service_requests').select('*').eq('id',id).maybeSingle()).then(function(r){if(r.error||!r.data){E('adw').innerHTML='<button class="x" data-xc aria-label="إغلاق">'+ic('close')+'</button><p class="adE er">'+X(r.error?r.error.message:'الطلب غير موجود أو لا تملك صلاحية عرضه.')+'</p>';return}
  var x=r.data;return Promise.all([users().catch(function(){return[]}),b83Q(c.from('request_events').select('actor,to_status,note,created_at').eq('request_id',id).order('created_at')),b83Q(c.from('request_offers').select('*').eq('request_id',id).order('created_at')),x.biz_id?b83Q(c.from('biz_profiles').select('id,name,status').eq('id',x.biz_id).maybeSingle()):Promise.resolve({data:null}),b83Q(c.from('service_request_log').select('actor_role,from_status,to_status,note,created_at').eq('request_id',id).order('created_at')),(x.images&&x.images.length)?b83Q(c.storage.from('request-images').createSignedUrls(x.images,3600)):Promise.resolve({data:[]})]).then(function(a){
   var u=AD.um[x.user_id],ev=a[1],of=a[2],bz=a[3].data,lg=a[4],im=(a[5].data||[]).filter(function(i){return i&&i.signedUrl}),nx=a5next(x.status);
   var F=[['النوع',A5TY[x.req_type]],['نوع الخدمة',x.service_kind],['المعدة',x.equipment_type],['الشركة',x.manufacturer],['الموديل',x.model],['السنة',x.year],['القدرة (حصان)',x.power_hp],['الرقم التسلسلي / القطعة',x.serial_or_part_no],['اسم القطعة',x.part_name],['المحافظة',x.province],['المنطقة',x.area],['الإنشاء',x.created_at?fd(x.created_at):null],['آخر تحديث',x.updated_at?fd(x.updated_at):null]].filter(function(p){return p[1]!=null&&p[1]!==''});
   var L1=function(t,rows,fn,em){return '<h3>'+t+' ('+(rows.error?'غير متاح':(rows.data||[]).length)+')</h3>'+(rows.error?'<p class="adE">تعذّر القراءة: '+X(rows.error.message||'')+'</p>':(rows.data||[]).length?'<ul class="adact">'+rows.data.map(fn).join('')+'</ul>':'<p class="adE">'+em+'</p>')};
   E('adw').innerHTML='<button class="x" data-xc aria-label="إغلاق">'+ic('close')+'</button><h2 style="margin:0 0 6px">طلب <bdi>#'+X(x.req_no!=null?x.req_no:String(x.id).slice(0,8))+'</bdi></h2>'+a5b(x.status)+' <bdi class="a2id">'+X(x.id)+'</bdi>'
   +'<div class="addl">'+F.map(function(p){return '<div><span>'+p[0]+'</span>'+X(p[1])+'</div>'}).join('')+'</div><p style="white-space:pre-wrap">'+X(x.description||'')+'</p>'
   +(im.length?'<div class="adgal">'+im.map(function(i){return '<a href="'+X(i.signedUrl)+'" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="'+X(i.signedUrl)+'" alt="صورة الطلب"></a>'}).join('')+'</div>':'<p class="adE">'+(x.images&&x.images.length?'تعذّر عرض المرفقات (صلاحية التخزين).':'لا مرفقات.')+'</p>')
   +'<h3>الزبون</h3><div class="addl"><div><span>الاسم</span>'+X(u?(u.full_name||'بدون اسم'):'غير متاح')+'</div><div><span>وسيلة التواصل المُدخلة</span><bdi>'+X((x.contact_method||'')+(x.contact_value?': '+x.contact_value:''))+'</bdi></div><div><span>هاتف الحساب</span><bdi>'+X(u&&u.phone||'—')+'</bdi></div><div><span>البريد</span><bdi>'+X(u&&u.email||'—')+'</bdi></div></div>'
   +'<h3>التاجر أو مقدم الخدمة</h3><div class="addl"><div><span>النشاط</span>'+(x.biz_id?X(bz?(bz.name||'—'):'غير متاح'):'غير مرتبط بالطلب')+'</div>'+(x.provider_status?'<div><span>حالة مقدم الخدمة</span>'+X(x.provider_status)+'</div>':'')+'</div>'
   +L1('عروض وردود الموردين',a[2],function(o){return '<li><span>'+X(o.provider_name||'—')+(o.price!=null?' · '+X(o.price)+' '+X(o.currency||''):'')+(o.availability?' · '+X(o.availability):'')+(o.note?' — '+X(o.note):'')+'</span><span>'+(o.created_at?fd(o.created_at):'')+'</span></li>'},'لا ردود مسجّلة.')
   +L1('سجل تغييرات الحالة',a[1],function(o){return '<li><span>'+X(A5S[o.to_status]||o.to_status||'')+(o.note?' — '+X(o.note):'')+'</span><span>'+(o.created_at?fd(o.created_at):'')+'</span></li>'},'لا تغييرات مسجّلة.')
   +L1('سجل مقدم الخدمة',a[4],function(o){return '<li><span>'+X(o.actor_role||'')+': '+X(o.to_status||'')+(o.note?' — '+X(o.note):'')+'</span><span>'+(o.created_at?fd(o.created_at):'')+'</span></li>'},'لا سجل.')
   +'<p class="adE" style="text-align:start">غير متاح في النظام الحالي: السعر والكمية والمجموع، الإسناد لموظف، الملاحظة الداخلية الخاصة بالإدارة، والمحادثة المرتبطة بالطلب.</p>'
   +'<h3>تحديث الحالة</h3>'+(nx.length?'<div class="a3f"><label>الحالة الجديدة<select id="a5ns">'+nx.map(function(k){return '<option value="'+k+'">'+X(A5S[k])+'</option>'}).join('')+'</select></label><label>الملاحظة أو السبب (إلزامي عند الإلغاء، 5 أحرف على الأقل، حتى 200)<input id="a5nt" maxlength="200"></label></div><div class="adbs"><button type="button" class="ab pr" data-a5="st" data-id="'+X(x.id)+'" data-cur="'+X(x.status)+'">تحديث الحالة</button></div><p class="adE" style="text-align:start">الملاحظة تُسجَّل في سجل الطلب مع القرار، وقد تظهر لصاحبه. لا حذف نهائي للطلبات.</p>':'<p class="adE" style="text-align:start">هذا الطلب في حالة نهائية (مكتمل أو ملغي) ولا يُغيَّر من الواجهة.</p>')})})}
function a5st(b){var id=b.dataset.id,s=E('a5ns').value,n=E('a5nt').value.trim();if(s==='cancelled'&&(n.length<5||n.length>200||/[<>]/.test(n))){msg('اكتب سبب الإلغاء (5 إلى 200 حرف، بدون < أو >).');E('a5nt').focus();return}
 if(n&&(n.length>200||/[<>]/.test(n))){msg('الملاحظة طويلة أو تحتوي رموزاً غير مسموحة.');return}
 if(a5next(b.dataset.cur).indexOf(s)<0)return msg('هذا الانتقال غير مسموح.');
 if(!confirm('تغيير حالة الطلب إلى «'+A5S[s]+'»؟'))return;var all=[].slice.call(document.querySelectorAll('#adw .ab'));all.forEach(function(x){x.disabled=true});
 sbc().rpc('admin_set_request_status',{p_id:id,p_status:s,p_note:n||null}).then(function(r){if(r.error)throw r.error;return sbc().from('service_requests').select('status').eq('id',id).maybeSingle()}).then(function(v){if(v.error||!v.data||v.data.status!==s){all.forEach(function(x){x.disabled=false});msg('لم يتأكد التحديث من الخادم. افتح الطلب وتحقق من حالته قبل إعادة المحاولة.');return}
  closeM();msg('تم تحديث الحالة وتأكّد من الخادم.',1);if(A5.sub==='req')a5fetch();else a5go(A5.sub)}).catch(function(e){all.forEach(function(x){x.disabled=false});msg('فشلت العملية: '+(e&&e.message||e))})}
function a5buy(){var f=A5;a5box('<div class="a3f"><label>بحث (رقم الطلب أو العنوان)<input type="search" data-a5f="bq" value="'+X(f.bq)+'" maxlength="80"></label><label>الحالة<select data-a5f="bst"><option value="">الكل</option>'+Object.keys(A5BS).map(function(k){return '<option value="'+k+'"'+(f.bst===k?' selected':'')+'>'+A5BS[k]+'</option>'}).join('')+'</select></label></div><p class="adE" style="text-align:start">للقراءة هنا عبر دالة الخادم الحالية b62_admin_requests؛ الإخفاء والإظهار وسحب العروض والبلاغات من صفحة <a href="#admbuy">إدارة طلبات الشراء</a>. بيانات الزبون (الاسم والهاتف) لا تُرجعها هذه الدالة فلا تُعرض.</p><div id="a5l"></div>');a5bfetch()}
function a5bfetch(){var sq=++A5.bseq,L=E('a5l');if(!L)return;L.innerHTML='<p class="adE">جارٍ التحميل…</p>';
 sbc().rpc('b62_admin_requests',{p_q:A5.bq.trim()||null,p_type:null,p_province:null,p_status:A5.bst||null,p_from:null,p_to:null,p_limit:A5PS,p_offset:A5.bpg*A5PS}).then(function(r){if(sq!==A5.bseq)return;if(r.error)throw r.error;var D=r.data||[];
  L.innerHTML=D.length?'<div class="adtw"><table class="adt adt-r"><thead><tr><th>الرقم</th><th>العنوان</th><th>المحافظة</th><th>التاريخ</th><th>العروض</th><th>البلاغات</th><th>الحالة</th><th></th></tr></thead><tbody>'+D.map(function(x){return '<tr><td data-l="الرقم"><bdi>'+X(x.ref||'')+'</bdi></td><td data-l="العنوان">'+X(x.title||'—')+(x.hidden_reason?'<br><small>سبب الإخفاء: '+X(x.hidden_reason)+'</small>':'')+'</td><td data-l="المحافظة">'+X(x.province||'—')+'</td><td data-l="التاريخ">'+(x.created_at?fd(x.created_at):'—')+'</td><td data-l="العروض">'+X(x.offers_count!=null?x.offers_count:'—')+'</td><td data-l="البلاغات">'+X(x.reports_count||0)+'</td><td data-l="الحالة"><span class="bd '+(x.effective_status==='open'?'published':x.effective_status==='hidden'?'rejected':'pending')+'">'+X(A5BS[x.effective_status]||x.effective_status||'—')+'</span></td><td><a class="ab pr" href="#buy-'+X(x.id)+'" target="_blank" rel="noopener">فتح</a></td></tr>'}).join('')+'</tbody></table></div>':'<p class="adE">'+(A5.bpg?'لا نتائج في هذه الصفحة.':'لا توجد طلبات مطابقة.')+'</p>';
  L.innerHTML+='<div class="adpg"><button class="ab" data-a5="bpg" data-v="-1" type="button"'+(A5.bpg?'':' disabled')+'>السابق</button><span>صفحة '+(A5.bpg+1)+'</span><button class="ab" data-a5="bpg" data-v="1" type="button"'+(D.length===A5PS?'':' disabled')+'>التالي</button></div>'}).catch(function(e){if(sq!==A5.bseq)return;L.innerHTML='<div class="adE er">تعذّر التحميل: '+X(String(e&&e.message||e))+'<br><br><button type="button" class="ab pr" data-a5="refresh">إعادة المحاولة</button></div>'})}
function a5fu(){a5box('<p class="adE">جارٍ التحميل…</p>');var sq=++A5.fseq,c=sbc(),g=function(f,o){return b83Q(f(c.from('service_requests').select('*',{count:'exact'})).order(o,{ascending:true}).limit(10))};
 Promise.all([g(function(q){return q.eq('status','new').lt('created_at',a5ago(A5NEWD))},'created_at'),g(function(q){return q.in('status',['reviewing','need_info','searching','found']).lt('updated_at',a5ago(A5STALED))},'updated_at'),g(function(q){return q.eq('status','reviewing')},'updated_at'),users().catch(function(){return[]})]).then(function(a){if(sq!==A5.fseq)return;
  var sec=function(t,d,r,tm){if(r.error)return '<h3>'+t+' (غير متاح)</h3><p class="adE">تعذّر القراءة: '+X(r.error.message||'')+'</p>';var D=r.data||[];return '<h3>'+t+' ('+(r.count!=null?r.count:D.length)+')</h3><p class="adE" style="padding:0 0 6px;text-align:start">'+d+'</p>'+(D.length?'<ul class="adact">'+D.map(function(x){var u=AD.um[x.user_id];return '<li><span><b><bdi>#'+X(x.req_no!=null?x.req_no:String(x.id).slice(0,8))+'</bdi></b> · '+X(A5TY[x.req_type]||'')+' · '+X(u?(u.full_name||u.email||''):'')+' · '+a5b(x.status)+' · منذ '+fd(x[tm])+'</span><button class="ab pr" data-a5="open" data-id="'+X(x.id)+'" type="button">فتح</button></li>'}).join('')+'</ul>'+((r.count||0)>D.length?'<p class="adE">عُرض أقدم '+D.length+' فقط؛ استخدم الفلاتر في «طلبات القطع والخدمات» لبقية القائمة.</p>':''):'<p class="adE">لا شيء هنا.</p>')};
  a5box(sec('جديدة لم تُتابَع منذ أكثر من '+A5NEWD+' يوم','طلبات بحالة «جديد» مضى على إنشائها أكثر من '+A5NEWD+' يوم؛ تحتاج تدخلاً إدارياً. الحد ثابت في الواجهة وليس قاعدة عمل من الخادم.',a[0],'created_at')+sec('تنتظر المراجعة','طلبات بحالة «قيد المراجعة» بانتظار إجراء.',a[2],'updated_at')+sec('راكدة في الحالة نفسها أكثر من '+A5STALED+' أيام','طلبات نشطة لم يتغيّر تاريخ آخر تحديث لها منذ '+A5STALED+' أيام (من updated_at الفعلي).',a[1],'updated_at')+'<p class="adE" style="text-align:start">لا تُرسل إشعارات ولا تُنشأ مهام مجدولة من هنا؛ هذه المرحلة عرض فقط.</p>')}).catch(function(e){a5box('<div class="adE er">تعذّر التحميل: '+X(String(e&&e.message||e))+'<br><br><button type="button" class="ab pr" data-a5="refresh">إعادة المحاولة</button></div>')})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-a5]');if(!b||AD.tab!=='ord5'||!(E('adm').contains(b)||E('adw').contains(b)))return;var a=b.dataset.a5;
 if(a==='sub'){A5.pg=0;A5.bpg=0;return a5go(b.dataset.v)}if(a==='pg'){A5.pg=Math.max(0,A5.pg+(+b.dataset.v));return a5fetch()}if(a==='bpg'){A5.bpg=Math.max(0,A5.bpg+(+b.dataset.v));return a5bfetch()}
 if(a==='reset'){A5.q='';A5.ty='';A5.st='';A5.d1='';A5.d2='';A5.bz='';A5.so='new';A5.pg=0;return a5list()}if(a==='refresh')return a5go(A5.sub);if(a==='open')return a5open(b.dataset.id);if(a==='st')return a5st(b)});
function a5in(e){var t=e.target.closest&&e.target.closest('[data-a5f]');if(!t||AD.tab!=='ord5'||!E('a5b'))return;var k=t.dataset.a5f;A5[k]=t.value;if(k==='bq'||k==='bst'){A5.bpg=0;if(k==='bq'){clearTimeout(A5.tmo);A5.tmo=setTimeout(a5bfetch,350);return}return a5bfetch()}A5.pg=0;if(k==='q'||k==='bz'){clearTimeout(A5.tmo);A5.tmo=setTimeout(a5fetch,350);return}a5fetch()}
document.addEventListener('input',function(e){if(e.target.matches&&e.target.matches('input[data-a5f][type=search]'))a5in(e)});document.addEventListener('change',function(e){if(e.target.matches&&e.target.matches('select[data-a5f],input[type=date][data-a5f]'))a5in(e)});
/* ===== ADM6: مركز التواصل وخدمة العملاء. يجمع في تبويب واحد ما هو موجود فعلاً: تذاكر الدعم والشكاوى (B57: b57_admin_list وb57_stats، والرد والملاحظة الداخلية والإسناد تبقى في صفحة التذكرة)، وبلاغات الإعلانات والمستخدمين والأنشطة (جدول reports ومعالجتها عبر admin_handle_report في صفحة البلاغات)، وبلاغات المحادثات (connect_reports) وبلاغات القطع (b60_admin_reports)، ورسائل «اتصل بنا» (contact_messages إن سمحت الصلاحيات). قراءة فقط ومرقّمة. لا تُقرأ المحادثات الخاصة بين المستخدمين ولا رسائلها؛ لا SQL ولا تغيير صلاحيات. ما لا يدعمه النظام يُعرض «غير متاح». ===== */
var A6={sub:'in',tp:0,tq:'',ts:'',tt:'',rp:0,rs:'open',rt:'',cp:0,cq:'',seq:0,tmo:0,M:{}},A6PS=20,A6OLD=3;
var A6T=[['in','الوارد الموحّد'],['tk','استفسارات وشكاوى (تذاكر الدعم)'],['rp','البلاغات'],['cm','رسائل إلى الإدارة'],['ch','المحادثات'],['fu','المتابعة']];
var A6TY={account:'الحساب أو تسجيل الدخول',business:'صفحة النشاط التجاري',listing:'نشر إعلان',package:'الباقات ورصيد المنشورات',payment:'الدفع أو إثبات التحويل',verification:'طلب التوثيق',chat:'المحادثات أو الإشعارات',fraud:'الإبلاغ عن احتيال أو حساب مشبوه',tech:'مشكلة تقنية عامة',suggest:'اقتراح تطوير',other:'أخرى'};
var A6ST={'new':'جديدة',in_review:'بانتظار المراجعة',in_progress:'قيد المعالجة',waiting_user:'بانتظار المستخدم',waiting_other:'بانتظار جهة أخرى',resolved:'تم الحل',closed:'مغلقة',reopened:'أُعيد فتحها'};
function a6box(h){var e=E('a6b');if(e)e.innerHTML=h}
function a6ago(d){return new Date(Date.now()-d*864e5).toISOString()}
function a6na(t,m){return '<h3>'+t+' <span class="bz-t">غير متاح</span></h3><p class="adE" style="text-align:start">'+X(m||'')+'</p>'}
function a6err(e){return String(e&&e.message||e||'')}
function l6(){E('adm').innerHTML='<h2>التواصل وخدمة العملاء</h2><p class="adE" style="padding:0 0 10px;text-align:start">كل قنوات التواصل في مكان واحد، مبنيّة على الأنظمة الموجودة (الدعم والبلاغات والرسائل). هذه الصفحة للقراءة والتنقل؛ الرد والقرار يتمّان في صفحاتها الأصلية بصلاحيات الخادم. المحادثات الخاصة بين المستخدمين لا تُفتح هنا.</p><div class="adc" id="a6t">'+A6T.map(function(t){return '<button type="button" data-a6="sub" data-v="'+t[0]+'"'+(A6.sub===t[0]?' class="on"':'')+'>'+t[1]+'</button>'}).join('')+'</div><div id="a6b"></div>';a6go(A6.sub)}
function a6go(s){A6.sub=s;[].forEach.call(document.querySelectorAll('#a6t button'),function(b){b.classList.toggle('on',b.dataset.v===s)});({'in':a6in,tk:a6tk,rp:a6rp,cm:a6cm,ch:a6ch,fu:a6fu})[s]()}
function a6c(t,f){return cnt(t,f).then(function(n){return n},function(){return null})}
function a6tkq(st,lim,off,q,ty){return sbc().rpc('b57_admin_list',{p_status:st||null,p_type:ty||null,p_q:q||null,p_att:false,p_limit:lim,p_offset:off||0})}
function a6in(){a6box('<p class="adE">جارٍ التحميل…</p>');var c=sbc(),sq=++A6.seq,q8=function(t){return b83Q(c.from(t).select('*',{count:'exact'}).order('created_at',{ascending:false}).limit(8))};
 Promise.all([b83Q(a6tkq(null,8,0)),b83Q(c.rpc('b57_stats')),q8('reports'),q8('connect_reports'),q8('contact_messages'),b83Q(c.rpc('b60_admin_reports',{p_status:null})),a6c('reports',function(q){return q.eq('status','open')}),users().catch(function(){return[]})]).then(function(a){if(sq!==A6.seq)return;
  var T=a[0],S=a[1],R=a[2],CR=a[3],CM=a[4],PR=a[5],items=[],N=function(r){return r.error?'غير متاح':(r.count!=null?r.count:(r.data||[]).length)};
  if(!T.error)(T.data||[]).forEach(function(x){items.push({k:'تذكرة دعم: '+(A6TY[x.type]||x.type||''),d:x.updated_at||x.created_at,t:x.title,s:A6ST[x.status]||x.status,b:'<a class="ab pr" href="#ticket-'+X(x.id)+'">فتح الرد</a>'})});
  if(!R.error)(R.data||[]).forEach(function(x){items.push({k:x.listing_id?'بلاغ على إعلان':x.business_id?'بلاغ على نشاط':'بلاغ على مستخدم',d:x.created_at,t:RR[x.reason]||x.reason,s:RS[x.status]||x.status,b:'<button type="button" class="ab pr" data-adgo="reps|'+X(x.status)+'">معالجة</button>'})});
  if(!CR.error)(CR.data||[]).forEach(function(x){items.push({k:'بلاغ عن محادثة',d:x.created_at,t:x.reason||'',s:x.status||'',b:'<button type="button" class="ab pr" data-adgo="convrep">عرض</button>'})});
  if(!CM.error)(CM.data||[]).forEach(function(x){A6.M[x.id]=x;items.push({k:'رسالة إلى الإدارة',d:x.created_at,t:x.subject||x.name||'',s:'',b:'<button type="button" class="ab pr" data-a6="msg" data-id="'+X(x.id)+'">قراءة</button>'})});
  if(!PR.error)(PR.data||[]).slice(0,8).forEach(function(x){items.push({k:'بلاغ عن قطعة',d:x.created_at,t:x.reason||'',s:x.status||'',b:'<a class="ab pr" href="#admpartrep">معالجة</a>'})});
  items.sort(function(x,y){return new Date(y.d||0)-new Date(x.d||0)});
  var kp=function(n,t){return '<div class="a3k'+(n==='غير متاح'?' na':'')+'"><b>'+X(n)+'</b><span>'+t+'</span></div>'},ts=S.error?null:S.data||{};
  a6box('<div class="a3g">'+kp(S.error?'غير متاح':ts.total,'تذاكر الدعم (الكل)')+kp(S.error?'غير متاح':ts.new,'تذاكر جديدة')+kp(a[6]==null?'غير متاح':a[6],'بلاغات جديدة')+kp(N(R),'بلاغات إعلانات ومستخدمين (الكل)')+kp(N(CR),'بلاغات محادثات')+kp(N(CM),'رسائل إلى الإدارة')+kp(PR.error?'غير متاح':(PR.data||[]).length,'بلاغات قطع')+'</div>'
  +'<p class="adE" style="text-align:start">لا يوجد عدّاد «غير مقروء» للإدارة: حالة القراءة الموجودة في النظام تخص المستخدمين لا صندوق الإدارة. المحادثات الخاصة بين المستخدمين لا تدخل هذا الصندوق عمداً.</p><h3>آخر الواردات من كل المصادر (أحدث 8 من كل مصدر)</h3>'
  +(items.length?'<ul class="adact">'+items.map(function(i){return '<li><span><span class="bz-t">'+X(i.k)+'</span> '+X(i.t||'—')+(i.s?' · '+X(i.s):'')+' · <small>'+(i.d?fd(i.d):'')+'</small></span>'+i.b+'</li>'}).join('')+'</ul>':'<p class="adE">لا توجد واردات.</p>')
  +[['تذاكر الدعم',T],['البلاغات',R],['بلاغات المحادثات',CR],['رسائل الإدارة',CM],['بلاغات القطع',PR]].filter(function(p){return p[1].error}).map(function(p){return '<p class="adE" style="text-align:start">مصدر «'+p[0]+'» غير متاح الآن: '+X(a6err(p[1].error))+'</p>'}).join(''))}).catch(function(e){a6box('<div class="adE er">تعذّر التحميل: '+X(a6err(e))+'<br><br><button type="button" class="ab pr" data-a6="refresh">إعادة المحاولة</button></div>')})}
function a6tk(){a6box('<div id="a6k"></div><div class="a3f"><label>بحث (رقم التذكرة أو العنوان أو معرّف مستخدم)<input type="search" data-a6f="tq" value="'+X(A6.tq)+'" maxlength="80"></label><label>الحالة<select data-a6f="ts"><option value="">الكل</option>'+Object.keys(A6ST).map(function(k){return '<option value="'+k+'"'+(A6.ts===k?' selected':'')+'>'+A6ST[k]+'</option>'}).join('')+'</select></label><label>الموضوع<select data-a6f="tt"><option value="">الكل</option>'+Object.keys(A6TY).map(function(k){return '<option value="'+k+'"'+(A6.tt===k?' selected':'')+'>'+A6TY[k]+'</option>'}).join('')+'</select></label></div><p class="adE" style="text-align:start">الرد على العميل والملاحظة الداخلية وتحديث الحالة والإسناد لنفسك تتم من صفحة التذكرة (زر «فتح»). تصنيف «استفسار عن إعلان/طلب» غير موجود كنوع تذكرة؛ المواضيع هي ما يحدده النظام.</p><div id="a6l"></div>');a6tkf()}
function a6tkf(){var sq=++A6.seq,L=E('a6l');if(!L)return;L.innerHTML='<p class="adE">جارٍ التحميل…</p>';
 Promise.all([a6tkq(A6.ts,A6PS,A6.tp*A6PS,A6.tq.trim(),A6.tt),b83Q(sbc().rpc('b57_stats'))]).then(function(a){if(sq!==A6.seq)return;if(a[0].error)throw a[0].error;var D=a[0].data||[],tot=D.length?Number(D[0].total):0,pgs=Math.max(1,Math.ceil(tot/A6PS)),n=a[1].error?null:a[1].data;
  var k=E('a6k');if(k)k.innerHTML=n?'<div class="a3g"><div class="a3k"><b>'+X(n.total)+'</b><span>الإجمالي</span></div><div class="a3k"><b>'+X(n['new'])+'</b><span>جديدة</span></div><div class="a3k"><b>'+X(n.open)+'</b><span>مفتوحة</span></div><div class="a3k"><b>'+X(n.waiting_user)+'</b><span>بانتظار المستخدم</span></div><div class="a3k"><b>'+X(n.overdue)+'</b><span>بلا رد أول بعد 24 ساعة</span></div></div>':'';
  L.innerHTML=D.length?'<div class="adtw"><table class="adt adt-r"><thead><tr><th>الرقم</th><th>الموضوع</th><th>العنوان</th><th>الحالة</th><th>التاريخ</th><th></th></tr></thead><tbody>'+D.map(function(x){return '<tr><td data-l="الرقم"><bdi>'+X(x.num)+'</bdi></td><td data-l="الموضوع">'+X(A6TY[x.type]||x.type||'—')+'</td><td data-l="العنوان">'+X(x.title||'—')+(x.assignee?' <span class="bz-t">مُعيَّنة</span>':'')+'</td><td data-l="الحالة"><span class="bd '+(x.status==='resolved'||x.status==='closed'?'published':x.status==='new'||x.status==='reopened'?'rejected':'pending')+'">'+X(A6ST[x.status]||x.status)+'</span></td><td data-l="التاريخ">'+(x.created_at?fd(x.created_at):'—')+(x.updated_at?'<br><small>تحديث: '+fd(x.updated_at)+'</small>':'')+'</td><td><a class="ab pr" href="#ticket-'+X(x.id)+'">فتح</a></td></tr>'}).join('')+'</tbody></table></div>'+a6pg('tp',A6.tp,pgs,tot):'<p class="adE">لا توجد تذاكر مطابقة.</p>'}).catch(function(e){L.innerHTML='<div class="adE er">تعذّر التحميل: '+X(a6err(e))+'<br><br><button type="button" class="ab pr" data-a6="refresh">إعادة المحاولة</button></div>'})}
function a6pg(k,p,pgs,tot){return '<div class="adpg"><button class="ab" data-a6="pg" data-k="'+k+'" data-v="-1" type="button"'+(p?'':' disabled')+'>السابق</button><span>صفحة '+(p+1)+' / '+pgs+' · '+tot+'</span><button class="ab" data-a6="pg" data-k="'+k+'" data-v="1" type="button"'+(p<pgs-1?'':' disabled')+'>التالي</button></div>'}
function a6rp(){a6box('<div class="a3f"><label>الحالة<select data-a6f="rs"><option value="">الكل</option>'+Object.keys(RS).map(function(k){return '<option value="'+k+'"'+(A6.rs===k?' selected':'')+'>'+RS[k]+'</option>'}).join('')+'</select></label><label>المُبلَّغ عنه<select data-a6f="rt"><option value="">الكل</option><option value="listing"'+(A6.rt==='listing'?' selected':'')+'>إعلان</option><option value="business"'+(A6.rt==='business'?' selected':'')+'>نشاط تجاري</option><option value="user"'+(A6.rt==='user'?' selected':'')+'>مستخدم</option></select></label></div><p class="adE" style="text-align:start">وصول بلاغ لا يوقف حساباً ولا يحذف إعلاناً؛ القرار والملاحظة وسببه يتمّان من «معالجة» (دالة الخادم admin_handle_report)، و«يحتاج معلومات إضافية» ليست حالة موجودة في النظام. بلاغات المحادثات وبلاغات القطع في صفحتيهما: <a href="#admpartrep">بلاغات القطع</a>.</p><div class="adbs"><button type="button" class="ab" data-adgo="convrep">بلاغات المحادثات</button><button type="button" class="ab pr" data-adgo="reps|open">صفحة معالجة البلاغات</button></div><div id="a6l"></div>');a6rpf()}
function a6rpf(){var sq=++A6.seq,L=E('a6l');if(!L)return;L.innerHTML='<p class="adE">جارٍ التحميل…</p>';var q=sbc().from('reports').select('*',{count:'exact'});if(A6.rs)q=q.eq('status',A6.rs);if(A6.rt==='listing')q=q.not('listing_id','is',null);else if(A6.rt==='business')q=q.not('business_id','is',null);else if(A6.rt==='user')q=q.not('reported_user_id','is',null);
 q.order('created_at',{ascending:false}).range(A6.rp*A6PS,A6.rp*A6PS+A6PS-1).then(function(r){if(sq!==A6.seq)return;if(r.error)throw r.error;var D=r.data||[],tot=r.count||0,pgs=Math.max(1,Math.ceil(tot/A6PS));
  L.innerHTML=D.length?'<div class="adtw"><table class="adt adt-r"><thead><tr><th>رقم البلاغ</th><th>النوع</th><th>السبب</th><th>التفاصيل</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>'+D.map(function(x){return '<tr><td data-l="رقم البلاغ">'+idt(x.id)+'</td><td data-l="النوع">'+(x.listing_id?'إعلان':x.business_id?'نشاط':'مستخدم')+'<br><small>'+idt(x.listing_id||x.business_id||x.reported_user_id)+'</small></td><td data-l="السبب">'+X(RR[x.reason]||x.reason||'—')+'</td><td data-l="التفاصيل">'+X(String(x.details||'—').slice(0,140))+(x.admin_note?'<br><small>ملاحظة الإدارة: '+X(String(x.admin_note).slice(0,100))+'</small>':'')+'</td><td data-l="التاريخ">'+(x.created_at?fd(x.created_at):'—')+'</td><td data-l="الحالة"><span class="bd '+X(x.status)+'">'+X(RS[x.status]||x.status)+'</span></td><td>'+(x.listing_id?'<button class="ab" data-ad="'+X(x.listing_id)+'" type="button">الإعلان</button>':'')+(x.reported_user_id?'<button class="ab" data-u="'+X(x.reported_user_id)+'" type="button">الحساب</button>':'')+'<button class="ab pr" data-adgo="reps|'+X(x.status)+'" type="button">معالجة</button></td></tr>'}).join('')+'</tbody></table></div>'+a6pg('rp',A6.rp,pgs,tot):'<p class="adE">لا توجد بلاغات مطابقة.</p>'}).catch(function(e){L.innerHTML='<div class="adE er">تعذّر التحميل: '+X(a6err(e))+'<br><br><button type="button" class="ab pr" data-a6="refresh">إعادة المحاولة</button></div>'})}
function a6cm(){a6box('<div class="a3f"><label>بحث (الاسم أو البريد أو الموضوع)<input type="search" data-a6f="cq" value="'+X(A6.cq)+'" maxlength="80"></label></div><p class="adE" style="text-align:start">رسائل نموذج «اتصل بنا» الموجّهة إلى الإدارة. قراءة فقط: لا يوجد في الجدول حقل حالة أو رد معروف، ولا يُرسَل رد من هنا.</p><div id="a6l"></div>');a6cmf()}
function a6cmf(){var sq=++A6.seq,L=E('a6l');if(!L)return;L.innerHTML='<p class="adE">جارٍ التحميل…</p>';var q=sbc().from('contact_messages').select('*',{count:'exact'}),t=a4s(A6.cq.trim());if(t)q=q.or('name.ilike.%'+t+'%,email.ilike.%'+t+'%,subject.ilike.%'+t+'%');
 q.order('created_at',{ascending:false}).range(A6.cp*A6PS,A6.cp*A6PS+A6PS-1).then(function(r){if(sq!==A6.seq)return;if(r.error)throw r.error;var D=r.data||[],tot=r.count||0,pgs=Math.max(1,Math.ceil(tot/A6PS));D.forEach(function(x){A6.M[x.id]=x});
  L.innerHTML=D.length?'<div class="adtw"><table class="adt adt-r"><thead><tr><th>المرسل</th><th>الموضوع</th><th>التاريخ</th><th>حساب</th><th></th></tr></thead><tbody>'+D.map(function(x){return '<tr><td data-l="المرسل">'+X(x.name||'—')+'<br><small><bdi>'+X(x.email||'')+'</bdi></small></td><td data-l="الموضوع">'+X(x.subject||'—')+'</td><td data-l="التاريخ">'+(x.created_at?fd(x.created_at):'—')+'</td><td data-l="حساب">'+(x.user_id?'<button class="ab" data-u="'+X(x.user_id)+'" type="button">الملف</button>':'زائر')+'</td><td><button class="ab pr" data-a6="msg" data-id="'+X(x.id)+'" type="button">قراءة</button></td></tr>'}).join('')+'</tbody></table></div>'+a6pg('cp',A6.cp,pgs,tot):'<p class="adE">لا توجد رسائل مطابقة.</p>'}).catch(function(e){L.innerHTML=a6na('رسائل الإدارة','تعذّرت القراءة بهذا الحساب ('+a6err(e)+'). غالباً لا توجد سياسة قراءة للإدارة على contact_messages؛ تحتاج دالة أو سياسة خادم لاحقاً ولم أغيّر شيئاً.')})}
function a6msg(id){var x=A6.M[id];if(!x)return;modal('<h2 style="margin:0 0 6px">'+X(x.subject||'رسالة إلى الإدارة')+'</h2><div class="addl"><div><span>الاسم</span>'+X(x.name||'—')+'</div><div><span>البريد</span><bdi>'+X(x.email||'—')+'</bdi></div><div><span>التاريخ</span>'+(x.created_at?fd(x.created_at):'—')+'</div></div><p style="white-space:pre-wrap">'+X(x.message||'')+'</p>'+(x.user_id?'<button class="ab" data-u="'+X(x.user_id)+'" type="button">عرض الحساب</button>':'')+'<p class="adE" style="text-align:start">للقراءة فقط؛ الرد يتم بالبريد خارج المنصة.</p>')}
function a6ch(){a6box('<div class="adE" style="text-align:start"><h3 style="margin-top:0">المحادثات الخاصة (BAHR CONNECT) <span class="bz-t">محمية</span></h3><p>المحادثات بين المستخدمين، وقد ترتبط بإعلان أو طلب عبر معرّف مرجعي، خاصة بطرفيها. لا توجد في النظام دالة خادم تمنح الإدارة حق قراءة محادثة محددة مع تسجيل ذلك في التدقيق، ولذلك لا أعرض هنا قائمة محادثات ولا رسائلها ولا آخر رسالة ولا عدّاد غير مقروء، ولا أحاول قراءتها من الجداول مباشرة.</p><p><b>ما يمكن للإدارة رؤيته الآن:</b> بلاغات المحادثات التي أرسلها المستخدمون (السبب والطرفان)، من صفحة «بلاغات المحادثات». حذف أو إيقاف أي طرف لا يتم تلقائياً.</p><p><b>المطلوب لاحقاً (لم يُنفَّذ):</b> دالة خادم تفتح محادثة مُبلَّغ عنها فقط، لدور محدد، بسبب إلزامي وتسجيل في سجل التدقيق؛ وسياسة تمنع بقية الأدوار من القراءة.</p></div><div class="adbs"><button type="button" class="ab pr" data-adgo="convrep">بلاغات المحادثات</button><button type="button" class="ab" data-adgo="audit">سجل التدقيق</button></div>')}
function a6fu(){a6box('<p class="adE">جارٍ التحميل…</p>');var c=sbc(),sq=++A6.seq;
 Promise.all([b83Q(c.rpc('b57_stats')),b83Q(a6tkq('new',10,0)),a6c('reports',function(q){return q.eq('status','open')}),a6c('reports',function(q){return q.eq('status','open').lt('created_at',a6ago(A6OLD))}),a6c('reports',function(q){return q.eq('status','reviewing')}),b83Q(c.from('reports').select('*').eq('status','open').lt('created_at',a6ago(A6OLD)).order('created_at',{ascending:true}).limit(10))]).then(function(a){if(sq!==A6.seq)return;var S=a[0],T=a[1],R=a[5],kp=function(n,t){return '<div class="a3k'+(n==null||n==='غير متاح'?' na':'')+'"><b>'+(n==null?'غير متاح':X(n))+'</b><span>'+t+'</span></div>'},n=S.error?{}:(S.data||{});
  a6box('<div class="a3g">'+kp(S.error?null:n['new'],'تذاكر جديدة')+kp(S.error?null:n.overdue,'تذاكر بلا رد أول بعد 24 ساعة')+kp(S.error?null:n.waiting_user,'تذاكر بانتظار المستخدم')+kp(a[2],'بلاغات جديدة')+kp(a[3],'بلاغات جديدة لم تُعالج منذ '+A6OLD+' أيام')+kp(a[4],'بلاغات قيد المعالجة')+kp(null,'مسندة لموظف معيّن (غير مدعوم في البلاغات)')+'</div><p class="adE" style="text-align:start">الأعداد من الخادم. حدّ '+A6OLD+' أيام ثابت في الواجهة وليس قاعدة عمل. لا تُرسل إشعارات ولا تُجدول مهام من هنا. إسناد التذاكر موجود في صفحة التذكرة («عيّنها لي»)؛ لا إسناد للبلاغات.</p>'
  +'<h3>تذاكر جديدة بانتظار الرد'+(T.error?'':' ('+(T.data||[]).length+(((T.data||[])[0]&&Number(T.data[0].total)>(T.data||[]).length)?' من '+T.data[0].total:'')+')')+'</h3>'+(T.error?'<p class="adE">غير متاح: '+X(a6err(T.error))+'</p>':(T.data||[]).length?'<ul class="adact">'+T.data.map(function(x){return '<li><span><bdi>'+X(x.num)+'</bdi> · '+X(A6TY[x.type]||'')+' · '+X(x.title||'')+(x.assignee?' · مُعيَّنة':'')+' · <small>'+fd(x.created_at)+'</small></span><a class="ab pr" href="#ticket-'+X(x.id)+'">فتح</a></li>'}).join('')+'</ul>':'<p class="adE">لا تذاكر جديدة.</p>')
  +'<h3>بلاغات جديدة لم تُعالج منذ '+A6OLD+' أيام</h3>'+(R.error?'<p class="adE">غير متاح: '+X(a6err(R.error))+'</p>':(R.data||[]).length?'<ul class="adact">'+R.data.map(function(x){return '<li><span>'+(x.listing_id?'إعلان':x.business_id?'نشاط':'مستخدم')+' · '+X(RR[x.reason]||x.reason||'')+' · <small>'+fd(x.created_at)+'</small></span><button type="button" class="ab pr" data-adgo="reps|open">معالجة</button></li>'}).join('')+'</ul>':'<p class="adE">لا بلاغات متأخرة.</p>'))}).catch(function(e){a6box('<div class="adE er">تعذّر التحميل: '+X(a6err(e))+'<br><br><button type="button" class="ab pr" data-a6="refresh">إعادة المحاولة</button></div>')})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-a6]');if(!b||AD.tab!=='com6'||!(E('adm').contains(b)||E('adw').contains(b)))return;var a=b.dataset.a6;
 if(a==='sub'){A6.tp=A6.rp=A6.cp=0;return a6go(b.dataset.v)}if(a==='refresh')return a6go(A6.sub);if(a==='msg')return a6msg(b.dataset.id);
 if(a==='pg'){var k=b.dataset.k;A6[k]=Math.max(0,A6[k]+(+b.dataset.v));return k==='tp'?a6tkf():k==='rp'?a6rpf():a6cmf()}});
function a6in2(e){var t=e.target.closest&&e.target.closest('[data-a6f]');if(!t||AD.tab!=='com6'||!E('a6b'))return;var k=t.dataset.a6f;A6[k]=t.value;var f={tq:a6tkf,ts:a6tkf,tt:a6tkf,rs:a6rpf,rt:a6rpf,cq:a6cmf}[k];if(!f)return;if(k==='tq'||k==='cq'){clearTimeout(A6.tmo);A6.tmo=setTimeout(function(){A6.tp=0;A6.cp=0;f()},350);return}A6.tp=0;A6.rp=0;f()}
document.addEventListener('input',function(e){if(e.target.matches&&e.target.matches('input[data-a6f][type=search]'))a6in2(e)});document.addEventListener('change',function(e){if(e.target.matches&&e.target.matches('select[data-a6f]'))a6in2(e)});
/* ===== ADM7: مركز الثقة والمراجعة. صفحة موحّدة فوق ما هو موجود فعلاً ولا تنفذ SQL ولا تغيّر RLS ولا التخزين: القرارات عبر نفس دوال الخادم الحالية (admin_set_listing_status عبر نافذة ADM4، biz_admin_decide، admin_handle_report) وكل قرار يُقرأ تأكيده من الخادم قبل إظهار النجاح؛ المؤشرات من b58_risk وb58_dups فقط (للمراجعة وليست اتهاماً ولا حظراً تلقائياً)؛ السجل من admin_activity وbiz_audit وb74_audit. الأرقام قراءات مباشرة، وما لا يدعمه الخادم يُعرض «غير مدعوم» أو «غير متاح» بدل رقم مُختلَق. الصلاحية الفعلية يفرضها الخادم؛ إخفاء الأزرار هنا لا يُعدّ حماية. ===== */
var A7={sub:'ov',seq:0,busy:false,tmo:0,R:null,B:null,ls:'pending',lc:'',lq:'',lo:'new',lpg:0,bs:'pending',rs:'open',rt:'all',rq:'',rpg:0};
var A7T=[['ov','الرئيسية'],['ads','مراجعة الإعلانات'],['biz','طلبات التوثيق'],['rep','البلاغات'],['sig','مؤشرات المراجعة'],['log','سجل القرارات']];
var A7LS=[['pending','بانتظار المراجعة'],['draft','مسودة غير مرسلة'],['rejected','مرفوض'],['published','منشور'],['suspended','موقوف من الإدارة'],['archived','متوقف من صاحبه'],['reported','عليه بلاغات غير مغلقة'],['all','الكل']];
var A7BS=[['pending','جديد (بانتظار المراجعة)'],['need_info','بانتظار معلومات إضافية'],['approved','مقبول'],['verified','موثّق حالياً'],['suspended','موقوف'],['rejected','مرفوض'],['all','الكل']];
var A7RS=[['open','جديد'],['reviewing','قيد المراجعة'],['closed','مغلق (تمت المعالجة)'],['all','الكل']];
var A7RT=[['all','كل الأنواع'],['listing','إعلانات'],['business','أنشطة تجارية'],['user','مستخدمون']];
function a7pa(){return(AD.roles||[]).indexOf('platform_admin')>-1}
function a7has(r){return a7pa()||(AD.roles||[]).indexOf(r)>-1}
function a7tabOk(k){return k==='ov'?true:k==='ads'?a7has('listings_reviewer'):k==='biz'||k==='sig'?a7pa():k==='rep'?(a7has('requests_reports_manager')||a7has('support')):true}
function a7nm(id){var u=(AD.um||{})[id];return u?(u.full_name||u.email||''):''}
function a7who(id){return id?(X(a7nm(id)||'')+' '+idt(id)):'—'}
function a7box(h){var e=E('a7b');if(e)e.innerHTML=h}
function a7sel(k,L,v,lbl){return '<label>'+lbl+'<select data-a7f="'+k+'">'+L.map(function(o){return '<option value="'+X(o[0])+'"'+(v===o[0]?' selected':'')+'>'+X(o[1])+'</option>'}).join('')+'</select></label>'}
function a7na(t,why){return '<div class="a3k na"><b>غير متاح</b><span>'+t+'</span><small style="display:block;color:var(--mut)">'+why+'</small></div>'}
function a7bd(s,m){return '<span class="bd '+X(s)+'">'+X(m[s]||s||'—')+'</span>'}
/* فهرس البلاغات غير المغلقة لكل هدف (حتى 1000 بلاغ). يُستعمل للعدّ الحقيقي فقط */
function a7rep(force){if(A7.R&&!force&&!A7.R.err)return Promise.resolve(A7.R);
 return b83Q(sbc().from('reports').select('id,listing_id,business_id,reported_user_id,status').in('status',['open','reviewing']).limit(1000)).then(function(r){
  if(r.error){A7.R={err:r.error,l:{},b:{},u:{},n:0};return A7.R}
  var M={l:{},b:{},u:{},n:0,cut:false},D=r.data||[];D.forEach(function(x){if(x.listing_id)M.l[x.listing_id]=(M.l[x.listing_id]||0)+1;else if(x.business_id)M.b[x.business_id]=(M.b[x.business_id]||0)+1;else if(x.reported_user_id)M.u[x.reported_user_id]=(M.u[x.reported_user_id]||0)+1});
  M.n=D.length;M.cut=D.length>=1000;A7.R=M;return M})}
function a7last(n){var c=sbc();n=n||15;return Promise.all([users().catch(function(){return[]}),b83Q(c.from('admin_activity').select('*').order('created_at',{ascending:false}).limit(n)),b83Q(c.from('biz_audit').select('*,biz_profiles(name)').order('created_at',{ascending:false}).limit(n))]).then(function(a){var R=[];
  (a[1].data||[]).forEach(function(x){R.push({t:x.created_at,src:'إعلانات وبلاغات وحسابات',act:ACT[x.action]||x.action||'—',who:x.actor_id||x.admin_id||x.actor||x.created_by||x.user_id,why:x.note||x.reason||'',tg:''})});
  (a[2].data||[]).forEach(function(x){R.push({t:x.created_at,src:'أنشطة تجارية',act:A3BA[x.action]||x.action||'—',who:x.actor||x.actor_id||x.admin_id,why:x.note||x.reason||'',tg:(x.biz_profiles||{}).name||''})});
  R.sort(function(p,q){return(Date.parse(q.t)||0)-(Date.parse(p.t)||0)});return{rows:R.slice(0,n),e1:a[1].error,e2:a[2].error}})}
function trustPage(){if(!a7tabOk(A7.sub))A7.sub='ov';
 E('adm').innerHTML='<h2>مركز الثقة والمراجعة</h2><p class="adE" style="padding:0 0 10px;text-align:start">نقطة واحدة لمتابعة ما يحتاج إلى قرار: الإعلانات وطلبات توثيق الأنشطة والبلاغات. لا تُعرض هنا أرقام تجريبية، ولا يُرفض إعلان ولا يُحظر حساب تلقائياً؛ القرار النهائي للمراجع المخوّل، والصلاحية الفعلية يفرضها الخادم لا هذه الواجهة.</p><div class="adc" id="a7t">'+A7T.filter(function(t){return a7tabOk(t[0])}).map(function(t){return '<button type="button" data-tr="sub" data-v="'+t[0]+'"'+(A7.sub===t[0]?' class="on"':'')+'>'+t[1]+'</button>'}).join('')+'</div><div id="a7b"></div>';
 a7go(A7.sub)}
function a7go(s){A7.sub=s;[].forEach.call(document.querySelectorAll('#a7t button'),function(b){b.classList.toggle('on',b.dataset.v===s)});
 ({ov:a7ov,ads:a7ads,biz:a7biz,rep:a7rp,sig:a7sg,log:a7lg})[s]()}
function a7refresh(){if(A7.sub==='ads')a7adsF();else if(A7.sub==='rep')a7rpF();else if(A7.sub==='biz')a7bizP()}
/* ---- الرئيسية ---- */
function a7ov(){var sq=++A7.seq;a7box('<p class="adE">جارٍ التحميل…</p>');
 var K=function(t,f){return cnt(t,f).then(function(n){return n},function(){return null})},L=function(s){return K('listings',function(q){return q.eq('status',s)})},B=function(s){return K('biz_profiles',function(q){return q.eq('status',s)})},R=function(s){return K('reports',function(q){return q.eq('status',s)})};
 Promise.all([L('pending'),L('published'),L('rejected'),L('suspended'),B('pending'),B('need_info'),B('approved'),B('rejected'),B('suspended'),K('biz_profiles',function(q){return q.eq('is_verified',true)}),R('open'),R('reviewing'),R('closed'),a7rep(true),a7last(10)]).then(function(a){if(sq!==A7.seq||A7.sub!=='ov')return;
  var v=function(n){return n==null?'غير متاح':n},M=a[13],lg=a[14],tk=function(t,n,sub,go){return '<a class="a3k" href="#admin" data-tr="to" data-v="'+go[0]+'" data-f="'+go[1]+'" style="display:block;text-decoration:none;color:inherit"><b>'+v(n)+'</b><span>'+t+'</span>'+(sub?'<small style="display:block;color:var(--mut)">'+sub+'</small>':'')+'</a>'},
   nl=M.err?null:Object.keys(M.l).length,nb=M.err?null:Object.keys(M.b).length,nu=M.err?null:Object.keys(M.u).length;
  var Y=function(n){return n==null?'<td data-l="">غير متاح</td>':'<td data-l="">'+n+'</td>'},NS='<td data-l="" class="a7x">غير مدعوم في الخادم</td>',NA='<td data-l="" class="a7x">لا ينطبق</td>';
  var mx=[['جديد',Y(a[0]),Y(a[4]),Y(a[10])],['قيد المراجعة (قرار لم يُتخذ بعد)',NS,NS,Y(a[11])],['بانتظار معلومات إضافية / أُعيد لاستكمال النواقص',NS,Y(a[5]),NA],['مقبول / منشور',Y(a[1]),Y(a[6]),NA],['مرفوض',Y(a[2]),Y(a[7]),NA],['موقوف',Y(a[3]),Y(a[8]),NA],['مغلق (تمت المعالجة)',NA,NA,Y(a[12])]];
  a7box('<div class="a3g">'+tk('إعلانات تنتظر المراجعة',a[0],'',['ads','ls=pending'])+tk('طلبات توثيق الأنشطة الجديدة',a[4],'وبانتظار معلومات إضافية: '+v(a[5]),['biz','bs=pending'])+tk('بلاغات جديدة',a[10],'وقيد المعالجة: '+v(a[11]),['rep','rs=open'])+a7na('إعلانات أُعيدت لأصحابها لاستكمال المعلومات','لا توجد حالة بهذا المعنى في الخادم ولا تدعمها admin_set_listing_status')
   +'<a class="a3k" href="#admin" data-tr="to" data-v="rep" data-f="rs=reviewing" style="display:block;text-decoration:none;color:inherit"><b>'+(M.err?'غير متاح':nl+nb+nu)+'</b><span>حالات تحتاج إلى مراجعة إضافية</span><small style="display:block;color:var(--mut)">'+(M.err?'تعذّر قراءة البلاغات':'أهداف عليها بلاغات غير مغلقة: '+nl+' إعلان، '+nb+' نشاط، '+nu+' مستخدم'+(M.cut?' (أول 1000 بلاغ فقط)':''))+'</small></a>'
   +'<div class="a3k"><b>'+v(a[9])+'</b><span>أنشطة موثّقة حالياً</span></div></div>'
   +'<h3>سير المراجعة: الحالات الفعلية في النظام</h3><p class="adE" style="padding:0 0 8px;text-align:start">العدّ مباشر من الخادم لكل مصدر. «غير مدعوم» يعني أن الخادم لا يملك هذه الحالة لذلك المصدر فلا تُعرض ولا يُدّعى وجودها. تعيين مراجع مسؤول للحالات غير مفعّل لأنه لا توجد آلية تعيين لهذه المصادر.</p><div class="adtw"><table class="adt adt-r"><thead><tr><th>الحالة</th><th>الإعلانات</th><th>الأنشطة التجارية</th><th>البلاغات</th></tr></thead><tbody>'+mx.map(function(r){return '<tr><td data-l="الحالة"><b>'+r[0]+'</b></td>'+r[1].replace('data-l=""','data-l="الإعلانات"')+r[2].replace('data-l=""','data-l="الأنشطة التجارية"')+r[3].replace('data-l=""','data-l="البلاغات"')+'</tr>'}).join('')+'</tbody></table></div>'
   +'<h3>آخر قرارات المراجعة والإجراءات الإدارية</h3>'+((lg.e1&&lg.e2)?'<p class="adE er">تعذّر قراءة سجلات القرارات.</p>':lg.rows.length?'<ul class="adact">'+lg.rows.map(function(x){return '<li><span>'+X(x.act)+(x.tg?' · '+X(x.tg):'')+(x.why?' — '+X(String(x.why).slice(0,140)):'')+'<br><small>'+X(x.src)+' · '+a7who(x.who)+'</small></span><span>'+(x.t?fd(x.t):'')+'</span></li>'}).join('')+'</ul>'+((lg.e1||lg.e2)?'<p class="adE" style="text-align:start">أحد السجلين غير متاح حالياً فقد لا تكتمل القائمة.</p>':''):'<p class="adE">لا توجد قرارات مسجّلة.</p>')
   +'<p class="adE" style="text-align:start">لا يُسجَّل هنا إلا ما نُفّذ عبر دوال الخادم الحالية. توثيق «الحسابات» كأفراد غير موجود في النظام: التوثيق متاح للأنشطة التجارية فقط.</p>')})
 .catch(function(e){a7box('<div class="adE er">تعذّر التحميل: '+X(e&&e.message||e)+'<br><br><button type="button" class="ab pr" data-tr="refresh">إعادة المحاولة</button></div>')})}
/* ---- مراجعة الإعلانات (قائمة موحّدة تفتح نافذة ADM4 نفسها: نفس القرارات ونفس التحقق من الخادم) ---- */
function a7ads(){a7box('<div class="adE" style="padding:0 0 10px;text-align:start">هذه قائمة مراجعة مختصرة تفتح نفس نافذة القرار في «مركز الإعلانات والمنتجات» (قبول ونشر، رفض بسبب، إيقاف، استعادة للمراجعة)، دون نسخ منطقها. للفلاتر الأوسع والترقيم الكامل: <button type="button" class="ab" data-adgo="ads|pending">فتح مركز الإعلانات الكامل</button></div><div class="a3f"><label>بحث (عنوان أو معرّف كامل)<input type="search" data-a7f="lq" value="'+X(A7.lq)+'" maxlength="80"></label>'+a7sel('ls',A7LS,A7.ls,'الحالة')+a7sel('lc',[['','الكل']].concat(Object.keys(A4CL).map(function(k){return[k,A4CL[k]]})),A7.lc,'القسم (نوع الإعلان)')+a7sel('lo',[['new','الأحدث'],['old','الأقدم']],A7.lo,'الترتيب')+'</div><div id="a7l"></div><p class="adE" style="text-align:start">الأقسام الفعلية في الإعلانات: قوارب، جت سكي، محركات، معدات وإكسسوارات، قطع غيار. «جاكبوت» ليس تصنيفاً في الخادم بعد. الخدمات والورش جدول مستقل يُراجع من <a href="#admsvc">الخدمات البحرية</a>. حالة «تحتاج إلى استكمال» وقرار «إعادة لصاحبه مع النواقص» غير مدعومين في الخادم، فلا زر لهما ولا يُستعمل الرفض بديلاً عنهما. المشاهدات وتاريخ «الإرسال» غير مخزّنين صراحةً؛ المعروض تاريخ الإنشاء والتحديث.</p>');a7adsF()}
function a7adsF(){var sq=++A7.seq,L=E('a7l');if(!L)return;L.innerHTML='<p class="adE">جارٍ التحميل…</p>';var c=sbc(),t=A7.lq.trim();
 Promise.all([users().catch(function(){return[]}),a7rep()]).then(function(z){var M=z[1],q=c.from('listings').select(SEL,{count:'exact'}),s=A7.ls;
  if(s==='reported'){var ids=Object.keys(M.l||{}).slice(0,150);if(M.err){return{stop:'تعذّر قراءة البلاغات فلا يمكن حساب هذه القائمة.'}}if(!ids.length)return{stop:'لا توجد إعلانات عليها بلاغات غير مغلقة.'};q=q.in('id',ids)}else if(s!=='all')q=q.eq('status',s);
  if(A7.lc)q=q.eq('category',A7.lc);if(t){q=A4UU.test(t)?q.eq('id',t):q.ilike('title','%'+a4s(t)+'%')}
  return q.order('created_at',{ascending:A7.lo==='old'}).range(A7.lpg*A4PS,A7.lpg*A4PS+A4PS-1).then(function(r){return{r:r,M:M}})}).then(function(o){if(sq!==A7.seq)return;
  if(o.stop){L.innerHTML='<p class="adE">'+o.stop+'</p>';return}if(o.r.error)throw o.r.error;var D=o.r.data||[],tot=o.r.count,M=o.M,pgs=tot==null?null:Math.max(1,Math.ceil(tot/A4PS));D.forEach(function(x){AD.cache[x.id]=x});
  L.innerHTML=D.length?'<div class="adtw"><table class="adt adt-r"><thead><tr><th></th><th>الإعلان</th><th>صاحب الإعلان</th><th>الحالة</th><th>التاريخ</th><th>بلاغات غير مغلقة</th><th></th></tr></thead><tbody>'+D.map(function(x){var im=imgs(x)[0],n=M.err?null:(M.l[x.id]||0);return '<tr><td data-l="">'+(im?'<img class="th" loading="lazy" decoding="async" src="'+X(im)+'" alt="">':'—')+'</td><td data-l="الإعلان"><b>'+X(x.title||'—')+'</b><br><small>'+idt(x.id)+' · '+X(A4CL[x.category]||x.category||'—')+'</small></td><td data-l="صاحب الإعلان">'+a7who(own(x))+'</td><td data-l="الحالة"><span class="bd '+X(x.status)+'">'+X(a4sl(x.status))+'</span></td><td data-l="التاريخ">'+(x.created_at?fd(x.created_at):'—')+(x.updated_at&&x.updated_at!==x.created_at?'<br><small>تحديث: '+fd(x.updated_at)+'</small>':'')+'</td><td data-l="بلاغات غير مغلقة">'+(n==null?'غير متاح':n)+'</td><td><button class="ab pr" data-ad="'+X(x.id)+'" type="button">فتح ومراجعة</button></td></tr>'}).join('')+'</tbody></table></div><div class="adpg"><button class="ab" data-tr="lpg" data-v="-1" type="button"'+(A7.lpg?'':' disabled')+'>السابق</button><span>صفحة '+(A7.lpg+1)+(pgs?' / '+pgs:'')+(tot!=null?' · '+tot+' إعلان':'')+'</span><button class="ab" data-tr="lpg" data-v="1" type="button"'+((pgs?A7.lpg<pgs-1:D.length===A4PS)?'':' disabled')+'>التالي</button></div>':'<p class="adE">لا توجد إعلانات مطابقة.</p>'+(A7.lpg?'<div class="adbs"><button class="ab" data-tr="lpg" data-v="-1" type="button">السابق</button></div>':'')})
 .catch(function(e){if(sq!==A7.seq)return;var m=String(e&&e.message||e),bad=/invalid input value for enum|22P02/.test(m);L.innerHTML='<div class="adE er">'+(bad?'هذه الحالة غير مدعومة في قاعدة البيانات الحالية، فلا توجد إعلانات بها.':'تعذّر تحميل الإعلانات: '+X(m))+'<br><br><button type="button" class="ab pr" data-tr="refresh">إعادة المحاولة</button></div>'})}
/* ---- طلبات توثيق الأنشطة التجارية ---- */
function a7biz(){a7box('<div class="adE" style="padding:0 0 10px;text-align:start"><b>ماذا تعني الشارة؟</b> «موثّق» قرار إداري يعني اجتياز إجراءات التحقق المعتمدة في المنصة من بيانات النشاط. <b>لا تعني</b> إثبات الملكية القانونية لأي قارب أو معدة، ولا يوجد في النظام آلية منفصلة لإثبات ذلك. الاشتراك أو أي شارة بصرية أخرى ليست دليلاً على التوثيق. لا يغيّر صاحب النشاط ولا أي واجهة عامة حالة التوثيق: القرار عبر دالة الخادم biz_admin_decide فقط.</div><div class="a3f"><label>بحث (اسم، محافظة، مالك، معرّف)<input type="search" data-a7f="bq" value="'+X(A7.bq||'')+'" maxlength="80"></label>'+a7sel('bs',A7BS,A7.bs,'الحالة')+'</div><div id="a7l"><p class="adE">جارٍ التحميل…</p></div><p class="adE" style="text-align:start"><b>المستندات والصور المرفقة:</b> غير مدعومة؛ لا يوجد في النظام رفع مستندات توثيق ولا حاوية تخزين لها. المتوفر نص «معلومات التحقق» الذي يكتبه صاحب النشاط، ويظهر داخل نافذة المراجعة للمدير العام فقط. إضافة مستندات تحتاج جدولاً وحاوية تخزين محمية وسياسات RLS (SQL لاحق، لم يُنفَّذ). طلب «مستندات إضافية» يتم الآن كنص عبر «طلب معلومات».</p>');
 var sq=++A7.seq;users().catch(function(){return[]}).then(function(){return b83Q(sbc().from('biz_profiles').select('*').order('updated_at',{ascending:false}).limit(1000))}).then(function(r){if(sq!==A7.seq)return;
  if(r.error){var L=E('a7l');if(L)L.innerHTML='<div class="adE er">تعذّر قراءة الأنشطة التجارية (صلاحية القراءة أو الجدول): '+X(r.error.message||'')+'<br><br><button type="button" class="ab pr" data-tr="refresh">إعادة المحاولة</button></div>';return}
  A7.B=r.data||[];a7bizP()})}
function a7bizP(){var L=E('a7l');if(!L||!A7.B)return;var q=(A7.bq||'').trim().toLowerCase(),s=A7.bs;
 var rows=A7.B.filter(function(b){if(s==='verified'){if(!b.is_verified)return false}else if(s!=='all'&&b.status!==s)return false;if(q&&[b.name,b.province,b.area,b.id,b.owner_id,a7nm(b.owner_id)].join(' ').toLowerCase().indexOf(q)<0)return false;return true});
 tbl(L,[{k:'name',t:'النشاط',h:function(b){return '<b>'+X(b.name||'—')+'</b>'}},{k:'t',t:'النوع',v:function(b){return BTY[b.business_type]||b.business_type||''}},{k:'o',t:'المالك',v:function(b){return a7nm(b.owner_id)},h:function(b){return a7who(b.owner_id)}},{k:'p',t:'المحافظة',v:function(b){return b.province||''}},{k:'s',t:'الحالة',v:function(b){return BST[b.status]||b.status||''},h:function(b){return '<span class="bd '+(b.status==='approved'?'published':b.status==='rejected'||b.status==='suspended'?'rejected':'pending')+'">'+X(BST[b.status]||b.status||'—')+'</span>'}},{k:'v',t:'التوثيق',v:function(b){return b.is_verified?'موثّق':'غير موثّق'}},{k:'u',t:'تاريخ الطلب / آخر تحديث',v:function(b){return b.updated_at||b.created_at||''},h:function(b){return (b.created_at?'أُنشئ: '+fd(b.created_at):'')+(b.updated_at?'<br><small>تحديث: '+fd(b.updated_at)+'</small>':'')}},{k:'x',t:'',s:false,h:function(b){return '<button class="ab pr" data-tr="bz" data-id="'+X(b.id)+'" type="button">مراجعة</button>'}}],rows,{q:false,ps:15,sort:'u',empty:'لا توجد أنشطة بهذه الحالة.'});
 if(A7.B.length>=1000)L.insertAdjacentHTML('beforeend','<p class="adE er" style="text-align:start">قُرئت أول 1000 نشاط فقط.</p>')}
function a7bzd(id){var c=sbc(),pa=a7pa();
 Promise.all([users().catch(function(){return[]}),b83Q(c.from('biz_profiles').select('*').eq('id',id).maybeSingle()),pa?b83Q(c.from('biz_private').select('verification_info').eq('business_id',id).maybeSingle()):Promise.resolve({data:null,hidden:1}),b83Q(c.from('biz_audit').select('*').eq('business_id',id).order('created_at',{ascending:false}).limit(30)),b83Q(c.from('reports').select('*').eq('business_id',id).order('created_at',{ascending:false}).limit(20))]).then(function(a){
  var b=a[1].data;if(a[1].error||!b){msg('تعذّر فتح النشاط: '+(a[1].error?(a[1].error.message||''):'غير موجود'));return}var vi=a[2],au=a[3],rp=a[4],s=b.status,B=function(k,t,x){return '<button type="button" class="ab '+(x||'')+'" data-tr="bact" data-k="'+k+'" data-id="'+X(id)+'">'+t+'</button>'},open=(rp.data||[]).filter(function(x){return x.status!=='closed'}).length;
  modal('<h2 style="margin:0 0 6px">'+X(b.name||'—')+'</h2>'+a7bd(s,BST)+' '+(b.is_verified?'<span class="bd published">موثّق</span>':'<span class="bd pending">غير موثّق</span>')+' <bdi class="a2id">'+X(b.id)+'</bdi>'
   +'<div class="addl"><div><span>النوع</span>'+X(BTY[b.business_type]||b.business_type||'—')+'</div><div><span>المالك</span>'+a7who(b.owner_id)+'</div><div><span>المحافظة</span>'+X([b.province,b.area].filter(Boolean).join('، ')||'—')+'</div><div><span>تاريخ الطلب</span>'+(b.created_at?fd(b.created_at):'—')+'</div><div><span>آخر تحديث</span>'+(b.updated_at?fd(b.updated_at):'—')+'</div>'+(b.verified_at?'<div><span>تاريخ التوثيق</span>'+fd(b.verified_at)+'</div>':'')+(b.review_note?'<div><span>آخر ملاحظة للمراجعة</span>'+X(b.review_note)+'</div>':'')
   +(pa?'<div><span>الهاتف</span><bdi>'+X(b.phone||'—')+'</bdi></div><div><span>واتساب</span><bdi>'+X(b.whatsapp||'—')+'</bdi></div>':'<div><span>معلومات التواصل</span>مخفية لصلاحيتك</div>')+'</div>'
   +(b.description?'<p style="white-space:pre-wrap">'+X(b.description)+'</p>':'')
   +'<h3>معلومات التحقق (نص خاص)</h3>'+(!pa?'<p class="adE" style="text-align:start">تُعرض للمدير العام فقط.</p>':vi.error?'<p class="adE">غير متاحة: '+X(vi.error.message||'')+'</p>':'<p style="white-space:pre-wrap">'+X((vi.data&&vi.data.verification_info)||'لم يُدخل صاحب النشاط معلومات تحقق.')+'</p>')
   +'<p class="adE" style="text-align:start">لا مستندات أو صور توثيق مرفقة: النظام لا يدعم رفعها.</p>'
   +'<h3>البلاغات على هذا النشاط ('+(rp.error?'غير متاحة':(rp.data||[]).length)+(open?'، غير مغلقة: '+open:'')+')</h3>'+(rp.error?'':(rp.data||[]).length?'<ul class="adact">'+rp.data.map(function(x){return '<li><span>'+X(RR[x.reason]||x.reason)+' · '+a7bd(x.status,RS)+(x.details?' · '+X(String(x.details).slice(0,120)):'')+'</span><span>'+fd(x.created_at)+'</span></li>'}).join('')+'</ul><p><button class="ab" type="button" data-tr="to" data-v="rep" data-f="rt=business">فتح البلاغات</button></p>':'<p class="adE">لا بلاغات.</p>')
   +'<h3>القرارات السابقة وملاحظات المراجعة</h3>'+(au.error?'<p class="adE">غير متاح.</p>':(au.data||[]).length?'<ul class="adact">'+au.data.map(function(x){return '<li><span>'+X(A3BA[x.action]||x.action||'')+(x.note||x.reason?' — '+X(x.note||x.reason):'')+'<br><small>'+a7who(x.actor||x.actor_id||x.admin_id)+'</small></span><span>'+(x.created_at?fd(x.created_at):'')+'</span></li>'}).join('')+'</ul>':'<p class="adE">لا سجل لهذا النشاط.</p>')
   +'<h3>القرار</h3>'+(pa?'<textarea id="a7r" maxlength="500" rows="3" placeholder="السبب أو الملاحظة (إلزامي لغير القبول وإعادة التفعيل، 5 أحرف على الأقل، يُسجَّل ويراه صاحب النشاط)" style="width:100%;box-sizing:border-box"></textarea><div class="adbs">'+((s==='pending'||s==='need_info')?B('approve','قبول الطلب','pr')+(s==='pending'?B('need_info','طلب معلومات أو مستندات إضافية'):'')+B('reject','رفض مع السبب','no'):'')+(s==='approved'?(b.is_verified?B('unverify','إلغاء التوثيق (تعليق الشارة)','no'):B('verify','منح الشارة بعد التحقق','pr'))+B('suspend','إيقاف النشاط','no'):'')+(s==='suspended'?B('reinstate','إعادة التفعيل','pr')+(b.is_verified?B('unverify','إلغاء التوثيق','no'):''):'')+'</div>'+((s==='draft'||s==='rejected')?'<p class="adE" style="text-align:start">لا إجراء إداري متاح على هذه الحالة.</p>':''):'<p class="adE" style="text-align:start">قرارات التوثيق والرفض والإيقاف للمدير العام فقط (يفرضها الخادم أيضاً)، فلا أزرار لصلاحيتك.</p>')
   +'<p class="adE" style="text-align:start">كل قرار يُنفَّذ عبر دالة الخادم ثم يُقرأ تأكيده منه قبل إظهار النجاح. لا حذف نهائي للأنشطة من هذه الواجهة.</p>')})}
function a7bact(b){var id=b.dataset.id,k=b.dataset.k,ta=E('a7r'),rs=ta?(ta.value||'').trim():'',need=!/^(approve|reinstate)$/.test(k),EX={approve:['status','approved'],reject:['status','rejected'],need_info:['status','need_info'],suspend:['status','suspended'],reinstate:['status','approved'],verify:['is_verified',true],unverify:['is_verified',false]}[k];
 if(!EX||A7.busy||!a7pa())return;if((need&&rs.length<5)||rs.length>500||/[<>]/.test(rs)){msg('اكتب السبب (5 إلى 500 حرف، بدون < أو >).');if(ta)ta.focus();return}
 if(!confirm('تنفيذ الإجراء «'+(A3BA[k]||k)+'»؟ سيُسجَّل'+(need?' ويراه صاحب النشاط':'')+'.'+(k==='verify'?'\nالشارة تعني اجتياز التحقق المعتمد في المنصة، لا إثبات ملكية قانونية.':'')))return;
 A7.busy=true;b.disabled=true;var c=sbc();
 c.rpc('biz_admin_decide',{p_id:id,p_action:k,p_note:rs||null}).then(function(r){if(r.error)throw r.error;return c.from('biz_profiles').select('status,is_verified').eq('id',id).maybeSingle()}).then(function(v){A7.busy=false;b.disabled=false;
  if(v.error||!v.data||v.data[EX[0]]!==EX[1]){msg('لم يتأكد التنفيذ من الخادم. افتح النشاط وتحقق من حالته قبل إعادة المحاولة.');return}closeM();msg('تم التنفيذ وتأكّد من الخادم وسُجّل.',1);A7.B=null;a7go(A7.sub)}).catch(function(e){A7.busy=false;b.disabled=false;var m=String(e&&e.message||e);msg('فشل: '+(/forbidden/.test(m)?'غير مصرح.':'حاول مرة ثانية.'))})}
/* ---- البلاغات ---- */
function a7rp(){var can=a7has('requests_reports_manager');a7box('<p class="adE" style="padding:0 0 10px;text-align:start">وصول بلاغ أو كثرتها لا يحذف إعلاناً ولا يوقف حساباً تلقائياً؛ راجع الهدف ثم قرّر. '+(can?'':'<b>صلاحيتك قراءة فقط: لا أزرار معالجة.</b> ')+'مقدّم البلاغ يظهر للمدير العام فقط حفاظاً على الخصوصية. لا توجد في النظام مرفقات أدلة مع البلاغات (نص السبب والتفاصيل فقط).</p><div class="a3f"><label>بحث (في التفاصيل أو معرّف البلاغ)<input type="search" data-a7f="rq" value="'+X(A7.rq)+'" maxlength="80"></label>'+a7sel('rs',A7RS,A7.rs,'الحالة')+a7sel('rt',A7RT,A7.rt,'نوع الهدف')+'</div><div id="a7l"></div>');a7rpF()}
function a7rpF(){var sq=++A7.seq,L=E('a7l');if(!L)return;L.innerHTML='<p class="adE">جارٍ التحميل…</p>';var c=sbc(),t=A7.rq.trim(),can=a7has('requests_reports_manager'),pa=a7pa();
 var q=c.from('reports').select('*',{count:'exact'});if(A7.rs!=='all')q=q.eq('status',A7.rs);
 if(A7.rt==='listing')q=q.not('listing_id','is',null);else if(A7.rt==='business')q=q.not('business_id','is',null);else if(A7.rt==='user')q=q.is('listing_id',null).is('business_id',null);
 if(t){q=A4UU.test(t)?q.eq('id',t):q.ilike('details','%'+a4s(t)+'%')}
 Promise.all([users().catch(function(){return[]}),a7rep(true),q.order('created_at',{ascending:false}).range(A7.rpg*A4PS,A7.rpg*A4PS+A4PS-1)]).then(function(z){if(sq!==A7.seq)return;var r=z[2],M=z[1];if(r.error)throw r.error;var D=r.data||[],tot=r.count,pgs=tot==null?null:Math.max(1,Math.ceil(tot/A4PS)),lid=[],bid=[];
  D.forEach(function(x){if(x.listing_id)lid.push(x.listing_id);else if(x.business_id)bid.push(x.business_id)});
  return Promise.all([lid.length?b83Q(c.from('listings').select('id,title,status').in('id',lid)):Promise.resolve({data:[]}),bid.length?b83Q(c.from('biz_profiles').select('id,name,status').in('id',bid)):Promise.resolve({data:[]})]).then(function(n){if(sq!==A7.seq)return;
   var LM={},BM={};(n[0].data||[]).forEach(function(x){LM[x.id]=x});(n[1].data||[]).forEach(function(x){BM[x.id]=x});
   L.innerHTML=(D.length?D.map(function(x){var ty=x.listing_id?'listing':x.business_id?'business':'user',tid=x.listing_id||x.business_id||x.reported_user_id,nm=ty==='listing'?(LM[tid]||{}).title:ty==='business'?(BM[tid]||{}).name:a7nm(tid),op=M.err?null:((ty==='listing'?M.l:ty==='business'?M.b:M.u)[tid]||0),rpt=x.reporter_id||x.reported_by||x.created_by||x.user_id;
    return '<div class="adrc"><div><b>'+(ty==='listing'?'بلاغ على إعلان':ty==='business'?'بلاغ على نشاط تجاري':'بلاغ على مستخدم')+'</b> '+X(nm||'')+' <small>'+idt(tid)+'</small> '+a7bd(x.status,RS)+' <small>'+(x.created_at?fd(x.created_at):'')+'</small></div><div>السبب: '+X(RR[x.reason]||x.reason||'—')+' · بلاغات غير مغلقة على نفس الهدف: <b>'+(op==null?'غير متاح':op)+'</b></div>'
     +(x.details?'<div style="white-space:pre-wrap">'+X(String(x.details).slice(0,600))+'</div>':'')+'<div><small>مقدّم البلاغ: '+(pa?(rpt?a7who(rpt):'غير متاح في البيانات'):'مخفي (الخصوصية)')+(x.handled_by||x.reviewed_by?' · المعالج: '+a7who(x.handled_by||x.reviewed_by):'')+'</small></div>'+(x.admin_note?'<div><b>ملاحظة المراجعة / القرار:</b> '+X(x.admin_note)+'</div>':'')
     +'<div class="adbs" style="margin:0">'+(ty==='listing'?'<button class="ab pr" data-ad="'+X(tid)+'" type="button">فتح الإعلان</button>':'')+(ty==='business'?'<button class="ab pr" data-tr="bz" data-id="'+X(tid)+'" type="button">فتح النشاط</button>':'')+(ty==='user'&&tid?'<button class="ab pr" data-u="'+X(tid)+'" type="button">عرض الحساب</button>':'')+'</div>'
     +(can?'<textarea id="n7-'+X(x.id)+'" maxlength="500" placeholder="ملاحظة أو قرار نهائي (إلزامي عند الإغلاق، 5 أحرف على الأقل)">'+X(x.admin_note||'')+'</textarea><div class="adbs" style="margin:0">'+['reviewing','closed','open'].filter(function(s){return s!==x.status}).map(function(s){return '<button class="ab'+(s==='closed'?' pr':'')+'" data-tr="rpa" data-id="'+X(x.id)+'" data-st="'+s+'" type="button">'+({reviewing:'قيد المراجعة',closed:'إغلاق: تمت المعالجة',open:'إعادة إلى جديد'})[s]+'</button>'}).join('')+'</div>':'')+'</div>'}).join('')
    :'<p class="adE">لا توجد بلاغات مطابقة.</p>')+((pgs&&pgs>1)||A7.rpg?'<div class="adpg"><button class="ab" data-tr="rpg" data-v="-1" type="button"'+(A7.rpg?'':' disabled')+'>السابق</button><span>صفحة '+(A7.rpg+1)+(pgs?' / '+pgs:'')+(tot!=null?' · '+tot+' بلاغ':'')+'</span><button class="ab" data-tr="rpg" data-v="1" type="button"'+((pgs?A7.rpg<pgs-1:D.length===A4PS)?'':' disabled')+'>التالي</button></div>':'')})})
 .catch(function(e){if(sq!==A7.seq)return;L.innerHTML='<div class="adE er">تعذّر تحميل البلاغات: '+X(e&&e.message||e)+'<br><br><button type="button" class="ab pr" data-tr="refresh">إعادة المحاولة</button></div>'})}
function a7rpa(b){var id=b.dataset.id,st=b.dataset.st,ta=E('n7-'+id),n=ta?ta.value.trim():'';if(A7.busy||!a7has('requests_reports_manager'))return;
 if(n.length>500||/[<>]/.test(n)){msg('الملاحظة غير صالحة (حتى 500 حرف، بدون < أو >).');return}
 if(st==='closed'&&n.length<5){msg('اكتب ملاحظة القرار النهائي (5 أحرف على الأقل) قبل إغلاق البلاغ.');if(ta)ta.focus();return}
 if(!confirm(st==='closed'?'إغلاق هذا البلاغ كمعالَج؟ سيُسجَّل القرار، ولن يُرفض أي إعلان أو يُحظر أي حساب تلقائياً.':'تحديث حالة البلاغ؟'))return;
 A7.busy=true;b.disabled=true;var c=sbc();
 c.rpc('admin_handle_report',{p_id:id,p_status:st,p_note:n||null}).then(function(r){if(r.error)throw r.error;return c.from('reports').select('status').eq('id',id).maybeSingle()}).then(function(v){A7.busy=false;b.disabled=false;
  if(v.error||!v.data||v.data.status!==st){msg('لم يتأكد التنفيذ من الخادم. أعد تحميل القائمة وتحقق من حالة البلاغ.');return}msg('تم تحديث البلاغ وتأكّد من الخادم.',1);a7go(A7.sub)}).catch(function(e){A7.busy=false;b.disabled=false;msg('فشل التحديث: '+(e&&e.message||e))})}
/* ---- مؤشرات المراجعة: من b58 فقط ومن عدّ البلاغات الفعلي. ليست دليلاً على مخالفة ---- */
function a7sg(){var sq=++A7.seq,c=sbc();a7box('<p class="adE">جارٍ التحميل…</p>');
 Promise.all([users().catch(function(){return[]}),b83Q(c.rpc('b58_risk',{p_min:3})),b83Q(c.rpc('b58_dups')),a7rep(true)]).then(function(z){if(sq!==A7.seq||A7.sub!=='sig')return;var rk=z[1],dp=z[2],M=z[3],LV={high:'خطر مرتفع',review:'يحتاج إلى مراجعة',normal:'طبيعي'},err=function(e){var m=String(e&&e.message||'');return /forbidden/.test(m)?'غير متاح لصلاحيتك.':/PGRST202|42883/.test(String(e&&e.code||m))?'مركز الأمان (b58_security.sql) غير مفعّل على الخادم.':'تعذّر التحميل.'},
   many=M.err?null:[].concat(Object.keys(M.l).filter(function(k){return M.l[k]>=3}).map(function(k){return['listing',k,M.l[k]]}),Object.keys(M.b).filter(function(k){return M.b[k]>=3}).map(function(k){return['business',k,M.b[k]]}),Object.keys(M.u).filter(function(k){return M.u[k]>=3}).map(function(k){return['user',k,M.u[k]]})).sort(function(a,b){return b[2]-a[2]});
  a7box('<div class="adE" style="padding:0 0 10px;text-align:start"><b>تنبيه:</b> المؤشر المعروض سبب للمراجعة اليدوية وليس دليلاً على مخالفة. لا حظر ولا رفض تلقائي، وكثرة البلاغات وحدها مؤشر ضعيف. القرار للمراجع المخوّل بعد فحص الإعلان أو الحساب. الإجراءات (تحذير، تصعيد، إخفاء) تتم من <a href="#admrisk">مركز الأمان والمخاطر</a>.</div>'
   +'<h3>حسابات بمؤشرات للمراجعة ('+(rk.error?'غير متاح':(rk.data||[]).length)+')</h3>'+(rk.error?'<p class="adE">'+err(rk.error)+'</p>':(rk.data||[]).length?'<ul class="adact">'+rk.data.slice(0,15).map(function(u){return '<li><span><b>'+X(LV[u.level]||u.level||'')+'</b> · النقاط: '+X(u.score)+' · '+a7who(u.user_id)+'<br><small>سبب التنبيه: '+(u.reasons||[]).map(X).join('، ')+'</small></span><button class="ab" data-u="'+X(u.user_id)+'" type="button">عرض الحساب</button></li>'}).join('')+'</ul>'+(rk.data.length>15?'<p class="adE">عُرض أول 15 فقط.</p>':''):'<p class="adE">لا توجد حسابات بمؤشرات كافية الآن.</p>')
   +'<h3>إعلانات مشتبه بتكرارها ('+(dp.error?'غير متاح':(dp.data||[]).length)+')</h3>'+(dp.error?'<p class="adE">'+err(dp.error)+'</p>':(dp.data||[]).length?'<ul class="adact">'+dp.data.slice(0,15).map(function(p){return '<li><span><b>'+(p.same_owner?'نفس المالك':'مالكان مختلفان')+'</b> · السعر: '+X(p.price==null?'—':p.price)+'<br><small dir="auto">أ: '+X(p.title_a)+' ('+X(p.status_a)+')<br>ب: '+X(p.title_b)+' ('+X(p.status_b)+')</small></span><span><button class="ab" data-ad="'+X(p.a)+'" type="button">فتح أ</button> <button class="ab" data-ad="'+X(p.b)+'" type="button">فتح ب</button></span></li>'}).join('')+'</ul>':'<p class="adE">لا توجد إعلانات مشتبه بتكرارها.</p>')
   +'<h3>أهداف عليها 3 بلاغات غير مغلقة أو أكثر ('+(many==null?'غير متاح':many.length)+')</h3>'+(many==null?'<p class="adE">تعذّر قراءة البلاغات.</p>':many.length?'<ul class="adact">'+many.slice(0,20).map(function(x){return '<li><span>'+(x[0]==='listing'?'إعلان':x[0]==='business'?'نشاط تجاري':'مستخدم')+' '+idt(x[1])+' · <b>'+x[2]+'</b> بلاغات</span>'+(x[0]==='listing'?'<button class="ab" data-ad="'+X(x[1])+'" type="button">فتح الإعلان</button>':x[0]==='business'?'<button class="ab" data-tr="bz" data-id="'+X(x[1])+'" type="button">فتح النشاط</button>':'<button class="ab" data-u="'+X(x[1])+'" type="button">عرض الحساب</button>')+'</li>'}).join('')+'</ul>'+(M.cut?'<p class="adE er" style="text-align:start">قُرئ أول 1000 بلاغ غير مغلق فقط.</p>':''):'<p class="adE">لا يوجد هدف بهذا العدد.</p>')
   +'<p class="adE" style="text-align:start"><b>غير معروضة لأن النظام لا يملك بياناتها هنا:</b> «معلومات متعارضة» داخل الإعلان الواحد، وتكرار تعديل البيانات عدا سجل تغيّر الأسعار الذي يظهر في مركز الأمان والمخاطر لكل إعلان.</p>')}).catch(function(e){a7box('<div class="adE er">تعذّر التحميل: '+X(e&&e.message||e)+'<br><br><button type="button" class="ab pr" data-tr="refresh">إعادة المحاولة</button></div>')})}
/* ---- سجل القرارات ---- */
function a7lg(){var sq=++A7.seq,c=sbc();a7box('<p class="adE">جارٍ التحميل…</p>');
 Promise.all([users().catch(function(){return[]}),b83Q(c.from('admin_activity').select('*').order('created_at',{ascending:false}).limit(200)),b83Q(c.from('biz_audit').select('*,biz_profiles(name)').order('created_at',{ascending:false}).limit(200)),b83Q(c.from('b74_audit').select('*').order('created_at',{ascending:false}).limit(200))]).then(function(a){if(sq!==A7.seq||A7.sub!=='log')return;var R=[];
  (a[1].data||[]).forEach(function(x){R.push({t:x.created_at,src:'إعلانات وبلاغات وحسابات',who:x.actor_id||x.admin_id||x.actor||x.created_by||x.user_id,act:ACT[x.action]||x.action||'',tg:'',why:x.note||x.reason||''})});
  (a[2].data||[]).forEach(function(x){R.push({t:x.created_at,src:'أنشطة تجارية',who:x.actor||x.actor_id||x.admin_id,act:A3BA[x.action]||x.action||'',tg:(x.biz_profiles||{}).name||'',why:x.note||x.reason||''})});
  (a[3].data||[]).forEach(function(x){R.push({t:x.created_at,src:'تعطيل الحسابات',who:x.actor,act:B83AL[x.action]||x.action||'',tg:a7nm(x.target)||(x.target?String(x.target).slice(0,8)+'…':''),why:x.reason||''})});
  a7box('<p class="adE" style="padding:0 0 10px;text-align:start">يجمع آخر 200 سجل من كل مصدر: إعلانات وبلاغات وحسابات (admin_activity)، الأنشطة التجارية (biz_audit)، تعطيل الحسابات (b74_audit، للمدير العام). يظهر هنا ما نفّذته دوال الخادم وسُجّل؛ لا تُسجَّل العمليات الفاشلة ولا أي إجراء لا يمرّ بهذه الدوال.'+(a[1].error?' <b>سجل الإعلانات والبلاغات غير متاح.</b>':'')+(a[2].error?' <b>سجل الأنشطة غير متاح.</b>':'')+(a[3].error?' <b>سجل الحسابات غير متاح لصلاحيتك.</b>':'')+'</p><div id="a7l"></div>');
  tbl(E('a7l'),[{k:'t',t:'الوقت',v:function(r){return r.t||''},h:function(r){return r.t?fd(r.t):'—'}},{k:'w',t:'المنفّذ',v:function(r){return a7nm(r.who)||String(r.who||'')},h:function(r){return a7who(r.who)}},{k:'s',t:'المصدر',v:function(r){return r.src}},{k:'a',t:'الإجراء',v:function(r){return r.act}},{k:'g',t:'المتأثر',v:function(r){return r.tg}},{k:'y',t:'السبب أو الملاحظة',v:function(r){return r.why},h:function(r){return X(String(r.why||'').slice(0,200))}}],R.sort(function(p,q){return(Date.parse(q.t)||0)-(Date.parse(p.t)||0)}),{ps:20,sort:'t',empty:'لا توجد سجلات.'})})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-tr]');if(!b||!E('ad')||!E('ad').contains(b)||AD.tab!=='trust')return;var a=b.dataset.tr;
 if(a==='to'){e.preventDefault();var f=(b.dataset.f||'').split('=');if(f[0]&&f[1]!==undefined)A7[f[0]]=f[1];if(f[0]==='rs'||f[0]==='rt')A7.rpg=0;if(f[0]==='ls')A7.lpg=0;if(!a7tabOk(b.dataset.v)){msg('هذا القسم غير متاح لصلاحيتك.');return}closeM();return trustPage2(b.dataset.v)}
 if(a==='sub'){return trustPage2(b.dataset.v)}if(a==='refresh'){A7.R=null;A7.B=null;return a7go(A7.sub)}
 if(a==='lpg'){A7.lpg=Math.max(0,A7.lpg+(+b.dataset.v));return a7adsF()}if(a==='rpg'){A7.rpg=Math.max(0,A7.rpg+(+b.dataset.v));return a7rpF()}
 if(a==='bz'){return a7bzd(b.dataset.id)}if(a==='bact'){return a7bact(b)}if(a==='rpa'){return a7rpa(b)}});
function trustPage2(s){A7.sub=s;trustPage()}
document.addEventListener('input',function(e){var t=e.target;if(AD.tab!=='trust'||!t.matches||!t.matches('input[data-a7f]'))return;A7[t.dataset.a7f]=t.value;A7.lpg=0;A7.rpg=0;clearTimeout(A7.tmo);A7.tmo=setTimeout(a7refresh,350)});
document.addEventListener('change',function(e){var t=e.target;if(AD.tab!=='trust'||!t.matches||!t.matches('select[data-a7f]'))return;A7[t.dataset.a7f]=t.value;A7.lpg=0;A7.rpg=0;a7refresh()});
/* ===== B25: BAHR ADMIN — هيكل مركزي. الصلاحية الفعلية: is_admin() + RLS في الخادم (لا SQL جديد). الأقسام غير المنفذة موسومة «هيكل فقط» ===== */
var BTY={parts_store:'متجر قطع غيار',boat_engine_dealer:'تاجر قوارب ومحركات',jetski_dealer:'تاجر جت سكي',wholesale_supplier:'مورد بالجملة',workshop:'ورشة صيانة',technician:'فني/مقدم خدمة'},
 BST={draft:'مسودة',pending:'بانتظار المراجعة',need_info:'يحتاج معلومات',approved:'مقبول',rejected:'مرفوض',suspended:'موقوف'};
var STORE_T=['parts_store','boat_engine_dealer','jetski_dealer','wholesale_supplier'],SVC_T=['workshop','technician'];
function tg(t){return '<span class="bz-t">'+t+'</span>'}
function skel(t,why,need){E('adm').innerHTML='<h2>'+t+' '+tg('هيكل فقط')+'</h2><div class="adE" style="text-align:start"><p>'+why+'</p>'+(need?'<p><b>المطلوب لاحقاً:</b> '+need+'</p>':'')+'<p style="color:var(--mut)">لا توجد أزرار تعديل أو حذف هنا لأن الوظيفة غير منفذة.</p></div>'}
function cnt(t,f){var q=sbc().from(t).select('*',{count:'exact',head:true});if(f)q=f(q);return q.then(function(r){if(r.error)throw r.error;return r.count})}
/* مكوّن الجداول الموحد: بحث + فرز + ترقيم + تخطيط بطاقات على الهاتف + حالات فراغ */
function tbl(host,cols,rows,o){o=o||{};var S={q:'',p:0,k:o.sort||null,d:-1},PS=o.ps||10;
 function raw(r,c){var v=c.v?c.v(r):r[c.k];return v==null?'':v}
 function draw(){var L=rows.filter(function(r){return !S.q||cols.some(function(c){return String(raw(r,c)).toLowerCase().indexOf(S.q)>-1})});
  if(S.k){var c0=cols.filter(function(c){return c.k===S.k})[0];if(c0)L=L.slice().sort(function(a,b){var x=raw(a,c0),y=raw(b,c0);return(x>y?1:x<y?-1:0)*S.d})}
  var n=L.length,pg=Math.max(1,Math.ceil(n/PS));if(S.p>=pg)S.p=pg-1;var V=L.slice(S.p*PS,S.p*PS+PS);
  host.innerHTML=(o.q===false?'':'<input class="adq" type="search" data-tq placeholder="بحث في الجدول…" value="'+X(S.q)+'" aria-label="بحث">')
   +(n?'<div class="adtw"><table class="adt adt-r"><thead><tr>'+cols.map(function(c){return '<th>'+(c.s===false?X(c.t):'<button class="adts" data-ts="'+c.k+'" type="button">'+X(c.t)+(S.k===c.k?(S.d>0?' ▲':' ▼'):'')+'</button>')+'</th>'}).join('')+'</tr></thead><tbody>'
    +V.map(function(r){return '<tr>'+cols.map(function(c){return '<td data-l="'+X(c.t)+'">'+(c.h?c.h(r):X(raw(r,c)))+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'
    +'<div class="adpg"><button class="ab" data-tp="-1" type="button"'+(S.p?'':' disabled')+'>السابق</button><span>'+(S.p+1)+' / '+pg+' · '+n+' سجل</span><button class="ab" data-tp="1" type="button"'+(S.p<pg-1?'':' disabled')+'>التالي</button></div>'
   :'<p class="adE">'+(rows.length?'لا توجد نتائج مطابقة للبحث.':o.empty||'لا توجد سجلات.')+'</p>');
  var qi=host.querySelector('[data-tq]');if(qi&&S.q){qi.focus();qi.setSelectionRange(qi.value.length,qi.value.length)}}
 host.onclick=function(e){var b=e.target.closest('[data-ts]'),p=e.target.closest('[data-tp]');if(b){var k=b.dataset.ts;S.d=S.k===k?-S.d:1;S.k=k;draw()}else if(p&&!p.disabled){S.p+=+p.dataset.tp;draw()}};
 host.oninput=function(e){if(e.target.matches('[data-tq]')){S.q=e.target.value.trim().toLowerCase();S.p=0;draw()}};draw()}
function idt(v){return v?'<bdi>'+X(String(v).slice(0,8))+'…</bdi>':'—'}
function bizList(t,types,note){ld();sbc().from('biz_profiles').select('id,name,business_type,province,status,is_verified,created_at').in('business_type',types).order('created_at',{ascending:false}).limit(500).then(function(r){if(r.error)throw r.error;
  E('adm').innerHTML='<h2>'+t+'</h2><p class="adE" style="padding:0 0 10px;text-align:start">'+note+' قرارات القبول والتوثيق تتم من صفحة <a href="#admbiz">إدارة الأنشطة التجارية</a>.</p><div id="adth"></div>';
  tbl(E('adth'),[{k:'name',t:'الاسم'},{k:'business_type',t:'النوع',h:function(x){return X(BTY[x.business_type]||x.business_type)}},{k:'province',t:'المحافظة'},{k:'status',t:'الحالة',h:function(x){return '<span class="bd '+(x.status==='approved'?'published':x.status==='rejected'||x.status==='suspended'?'rejected':'pending')+'">'+X(BST[x.status]||x.status)+'</span>'}},{k:'is_verified',t:'التوثيق',v:function(x){return x.is_verified?'موثّق':'غير موثّق'}},{k:'created_at',t:'التسجيل',h:function(x){return fd(x.created_at)}},{k:'id',t:'',s:false,h:function(x){return x.status==='approved'?'<a class="ab pr" href="#biz-'+X(x.id)+'">الصفحة العامة</a>':'—'}}],r.data||[],{sort:'created_at',empty:'لا توجد أنشطة من هذا النوع.'})}).catch(function(e){er('تعذّر تحميل الأنشطة: '+e.message,function(){bizList(t,types,note)})})}
function stores(){bizList('المتاجر والموردون وتجار المعدات',STORE_T,'عرض للقراءة فقط.')}
function workshops(){bizList('الورش والفنيون ومقدمو الخدمات',SVC_T,'عرض للقراءة فقط؛ إدارة خدماتهم غير مفعّلة بعد.')}
function verif(){ld();sbc().from('biz_profiles').select('id,name,business_type,status,is_verified,updated_at').in('status',['pending','need_info']).order('updated_at',{ascending:false}).limit(300).then(function(r){if(r.error)throw r.error;
  E('adm').innerHTML='<h2>التحقق من الأنشطة وحالات المراجعة</h2><p class="adE" style="padding:0 0 10px;text-align:start">الأنشطة التي تنتظر قراراً. الشارة وحدها لا تعني اكتمال التحقق: التوثيق قرار يدوي مسجّل في سجل التدقيق. للقرار افتح <a href="#admbiz">إدارة الأنشطة التجارية</a>.</p><div id="adth"></div>';
  tbl(E('adth'),[{k:'name',t:'الاسم'},{k:'business_type',t:'النوع',h:function(x){return X(BTY[x.business_type]||'')}},{k:'status',t:'الحالة',h:function(x){return X(BST[x.status])}},{k:'updated_at',t:'آخر تحديث',h:function(x){return fd(x.updated_at)}}],r.data||[],{sort:'updated_at',empty:'لا توجد أنشطة بانتظار المراجعة.'})}).catch(function(e){er('تعذّر التحميل: '+e.message,verif)})}
function convReps(){ld();sbc().from('connect_reports').select('*').order('created_at',{ascending:false}).limit(300).then(function(r){if(r.error)throw r.error;var R0=r.data||[],ks=['status','reason','details'].filter(function(k){return R0[0]&&k in R0[0]});
  E('adm').innerHTML='<h2>الاستفسارات والمحادثات والبلاغات المتعلقة بها</h2><p class="adE" style="padding:0 0 10px;text-align:start">بلاغات المحادثات (BAHR CONNECT) للقراءة فقط. لا يوجد هنا إجراء معالجة؛ معالجتها تحتاج دوال خادم مخصصة في مرحلة لاحقة.</p><div id="adth"></div>';
  tbl(E('adth'),[{k:'created_at',t:'التاريخ',h:function(x){return fd(x.created_at)}}].concat(ks.map(function(k){return{k:k,t:({status:'الحالة',reason:'السبب',details:'التفاصيل'})[k]}})).concat([{k:'id',t:'المعرّف',s:false,h:function(x){return idt(x.id)}}]),R0,{sort:'created_at',empty:'لا توجد بلاغات محادثات.'})}).catch(function(e){er('تعذّر تحميل بلاغات المحادثات: '+e.message,convReps)})}
function partsQA(){ld();var c=sbc();Promise.all([c.from('parts_items').select('id,name,part_number,status,parts_manufacturers(name)').limit(2000),c.from('parts_fitment').select('part_id,status,parts_models(id,model)').limit(5000)]).then(function(a){
 if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;var g={},P={},f={};
 (a[0].data||[]).forEach(function(p){P[p.id]=p;var m=Array.isArray(p.parts_manufacturers)?p.parts_manufacturers[0]:p.parts_manufacturers,n=String(p.part_number||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(n)(g[((m&&m.name)||'')+'|'+n]=g[((m&&m.name)||'')+'|'+n]||[]).push(p)});
 (a[1].data||[]).forEach(function(x){var m=Array.isArray(x.parts_models)?x.parts_models[0]:x.parts_models;if(!m)return;var k=x.part_id+'|'+m.id;(f[k]=f[k]||{m:m,p:x.part_id,s:{}}).s[x.status]=1});
 var D=Object.keys(g).filter(function(k){return g[k].length>1}),C=Object.keys(f).filter(function(k){return Object.keys(f[k].s).length>1});
 E('adm').innerHTML='<h2>جودة كتالوج القطع '+tg('قراءة فقط')+'</h2><p class="adE" style="padding:0 0 10px;text-align:start">كشف للمراجعة اليدوية فقط: لا يُدمج سجل ولا يتغيّر توافق من هنا، وتشابه الرقم لا يعني أن القطعتين واحدة.</p><h3>أرقام قطع مكررة محتملة ('+D.length+')</h3>'+(D.length?D.slice(0,50).map(function(k){return '<div class="adrc"><b dir="ltr">'+X(g[k][0].part_number)+'</b> — '+g[k].map(function(p){return X(p.name)+' ('+idt(p.id)+(p.status?' · '+X(p.status):'')+')'}).join(' | ')+'</div>'}).join(''):'<p class="adE">لا يوجد تكرار ظاهر.</p>')+'<h3>تعارض حالات التوافق للقطعة والموديل نفسيهما ('+C.length+')</h3>'+(C.length?C.slice(0,50).map(function(k){var o=f[k],p=P[o.p]||{};return '<div class="adrc"><b>'+X(p.name||'')+'</b> ← '+X(o.m.model||'')+' : '+Object.keys(o.s).map(X).join(' ≠ ')+'</div>'}).join(''):'<p class="adE">لا توجد تعارضات ظاهرة.</p>')+'<p class="adE" style="text-align:start">فُحصت '+(a[0].data||[]).length+' قطعة و'+(a[1].data||[]).length+' علاقة توافق (الحد 2000 و5000).</p>'}).catch(function(e){er('تعذّر الفحص: '+e.message,partsQA)})}
function refData(){ld();Promise.all([['parts_manufacturers','الشركات المصنّعة'],['parts_models','الموديلات'],['parts_items','قطع الكتالوج'],['parts_fitment','علاقات التوافق']].map(function(t){return cnt(t[0]).then(function(n){return[t[1],n]},function(){return[t[1],null]})})).then(function(a){
  E('adm').innerHTML='<h2>التصنيفات والموديلات والبيانات المرجعية '+tg('عرض فقط')+'</h2><div class="adk">'+a.map(function(x){return '<div>'+x[0]+'<b>'+(x[1]==null?'غير متاح حالياً':x[1])+'</b></div>'}).join('')+'</div><p class="adE" style="text-align:start">الأعداد حقيقية من الجداول. إضافة التصنيفات وتعديلها وتوحيد المراجع بين الإعلانات وBAHR PARTS: غير منفذ، ويحتاج مرحلة مستقلة. مراجعة اقتراحات التوافق متاحة في <a href="#admparts">إدارة BAHR PARTS</a>.</p>'})}
/* ===== B89: مركز سجل التدقيق الإداري. قراءة فقط: يدمج سجلات كتبتها دوال الخادم الحالية (لا يُكتب أي حدث من المتصفح ولا يوجد أي تعديل أو حذف هنا) + سجل B89 الموحّد عند تفعيله (b89_audit_list من مقترح SQL منفصل غير منفَّذ). الحماية الفعلية في RLS ودوال الخادم لا في إخفاء التبويب. ===== */
var B89={PS:50,STEP:30,lim:30,g:0,busy:0,S:{},V:[],
 SRC:[
  {k:'b89_audit_list',n:'سجل B89 الموحّد',t:'rpc',opt:1,sx:'rpc'},
  {k:'admin_activity',n:'الإعلانات والبلاغات والحسابات والصلاحيات',t:'table'},
  {k:'biz_audit',n:'الأنشطة التجارية والتحقق',t:'table',dm:'business',et:'business'},
  {k:'parts_audit',n:'BAHR PARTS',t:'table',dm:'parts'},
  {k:'b74_audit',n:'تعطيل الحسابات وطلبات الحذف',t:'table',dm:'accounts',et:'account'},
  {k:'b72_audit',n:'إعدادات المنصة والصيانة',t:'table',dm:'settings',et:'setting'},
  {k:'b61_audit',n:'الخدمات البحرية',t:'table',dm:'services',et:'service'},
  {k:'b62_admin_audit',n:'الطلبات والعروض (B62)',t:'rpc',np:1,dm:'services',et:'request'}
 ],
 f:{q:'',dm:'',src:'',rs:'',ac:'',fromD:'',toD:'',from:'',to:''}};
var B89DM={ads:'الإعلانات',business:'الأنشطة التجارية والتحقق',payments:'المدفوعات',reports:'البلاغات',accounts:'تقييد الحسابات وإيقافها وحذفها',roles:'الصلاحيات والأدوار',settings:'إعدادات المنصة',parts:'BAHR PARTS',services:'الخدمات والطلبات',other:'أخرى'};
var B89ET={listing:'إعلان',report:'بلاغ',request:'طلب',offer:'عرض',business:'نشاط تجاري',account:'حساب',setting:'إعداد',service:'خدمة',role:'صلاحية',payment:'دفعة',part:'قطعة'};
var B89AL={hide_request:'إخفاء طلب',unhide_request:'إظهار طلب',withdraw_offer:'سحب عرض',report_reviewed:'بلاغ: تمت المراجعة',report_dismissed:'بلاغ: مرفوض',payment_approve:'قبول دفعة',payment_reject:'رفض دفعة',payment_need_info:'طلب معلومات عن دفعة',payment_setting_change:'تعديل إعدادات الدفع',settings_change:'تغيير إعدادات المنصة',cms_change:'تعديل محتوى الموقع',support_update:'تحديث تذكرة دعم',security_action:'إجراء أمني',review_moderate:'إشراف على تقييم',part_report_handle:'معالجة بلاغ قطعة',verification_decide:'قرار تحقق'};
var B89SENS=/pass(word|wd)?|pwd|secret|token|jwt|cookie|authori[sz]|service_?role|api_?key|apikey|(^|_)(card|cvv|iban)|account_?num|phone|mobile|whatsapp|e-?mail|(^|_)(body|content|chat|messages?)($|_)/i;
function b89lbl(a){return ACT[a]||B89AL[a]||a||'—'}
function b89p(y){for(var i=1;i<arguments.length;i++){var v=y[arguments[i]];if(v!==undefined&&v!==null&&v!=='')return[arguments[i],v]}return null}
function b89red(v,d,c){d=d||0;if(v==null)return v;if(typeof v==='string')return v.length>300?v.slice(0,300)+'…':v;if(typeof v!=='object')return v;if(d>3)return'[…]';
 if(Array.isArray(v))return v.slice(0,20).map(function(x){return b89red(x,d+1,c)});
 var o={};Object.keys(v).forEach(function(k){if(B89SENS.test(k)){o[k]='[مُخفى]';c.n++}else o[k]=b89red(v[k],d+1,c)});return o}
function b89norm(s,y){
 var at=b89p(y,'created_at','occurred_at','at'),t=at?Date.parse(at[1]):NaN,ap=b89p(y,'action','event_type'),a=ap?String(ap[1]):'';
 var ac=b89p(y,'actor_id','actor','admin_id','performed_by','created_by'),rs=null,rp=b89p(y,'result','outcome');
 if(rp){var rv=String(rp[1]).toLowerCase();rs=/^(success|succeeded|ok|done)$/.test(rv)?'ok':/^(fail|failed|failure|error|denied)$/.test(rv)?'bad':null}
 else if(typeof y.success==='boolean')rs=y.success?'ok':'bad';
 var et=b89p(y,'entity_type','target_type','entity'),ei=b89p(y,'entity_id','target_id','listing_id','report_id','request_id','offer_id','biz_id','business_id','profile_id','service_id','target');
 var MP={listing_id:'listing',report_id:'report',request_id:'request',offer_id:'offer',biz_id:'business',business_id:'business',profile_id:'business',service_id:'service'};
 var ety=et&&typeof et[1]==='string'?et[1]:(ei&&MP[ei[0]])||(ei?s.et:null)||null;
 var dm=s.dm||'';if(!dm){if(s.sx==='rpc')dm=B89DM[y.domain]?y.domain:'other';else dm=/^listing_/.test(a)?'ads':/^report_/.test(a)?'reports':/^user_/.test(a)?'accounts':/^role_/.test(a)?'roles':'other'}
 var np=b89p(y,'reason','note'),note=np?String(typeof np[1]==='object'?JSON.stringify(b89red(np[1],0,{n:0})):np[1]).slice(0,200):'';
 var id=y.id!=null?String(y.id):null;
 return{key:s.k+'|'+(id!==null?id:JSON.stringify(y)),k:s.k,sn:s.n,t:isNaN(t)?0:t,at:at?String(at[1]):null,a:a,ac:ac?String(ac[1]):null,acc:ac?ac[0]:null,rs:rs,et:ety,ei:ei?String(ei[1]):null,id:id,dm:dm,note:note,raw:y}}
function b89err(e){var c=String(e&&e.code||''),m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205')return'الجدول غير موجود على الخادم';
 if(c==='42883'||c==='PGRST202')return'الدالة غير مفعّلة على الخادم';
 if(c==='42501'||c==='PGRST301'||/permission denied|not authorized|jwt/i.test(m))return'لا توجد صلاحية قراءة (حماية الخادم)';
 if(/failed to fetch|networkerror|load failed|network request/i.test(m))return'تعذّر الاتصال بالشبكة';
 return'خطأ من الخادم'+(c?' ('+c+')':'')}
function b89fresh(){return{off:0,done:false,err:null,ec:'',ok:false,rows:[],seen:{},oldest:null}}
function b89reset(){B89.g++;B89.lim=B89.STEP;B89.busy=0;B89.S={};B89.SRC.forEach(function(s){B89.S[s.k]=b89fresh()})}
function b89fetch(s){var c=sbc(),st=B89.S[s.k],q;
 if(!c){st.err='الاتصال بـ Supabase غير جاهز';st.done=true;return Promise.resolve()}
 try{
  if(s.t==='rpc')q=c.rpc(s.k,s.np?{p_limit:100}:{p_limit:B89.PS,p_offset:st.off,p_from:B89.f.from||null,p_to:B89.f.to||null});
  else{q=c.from(s.k).select('*');if(B89.f.from)q=q.gte('created_at',B89.f.from);if(B89.f.to)q=q.lte('created_at',B89.f.to);q=q.order('created_at',{ascending:false}).range(st.off,st.off+B89.PS-1)}
 }catch(x){st.err=b89err(x);st.done=true;return Promise.resolve()}
 return Promise.resolve(q).then(function(r){
  if(r.error){st.err=b89err(r.error);st.ec=String(r.error.code||'');st.done=true;return}
  var d=Array.isArray(r.data)?r.data:[];st.err=null;st.ok=true;
  d.forEach(function(y){var e=b89norm(s,y);if(!st.seen[e.key]){st.seen[e.key]=1;st.rows.push(e);if(e.t&&(st.oldest==null||e.t<st.oldest))st.oldest=e.t}});
  st.off+=d.length;if(s.np||d.length<B89.PS)st.done=true
 },function(e){st.err=b89err(e);st.done=true})}
function b89run(list){var g=B89.g;B89.busy=1;b89draw();
 return Promise.all(list.map(b89fetch)).then(function(){if(g!==B89.g)return;B89.busy=0;b89draw()})}
function b89view(){var all=[],hz=null;
 B89.SRC.forEach(function(s){var st=B89.S[s.k];if(!st)return;st.rows.forEach(function(e){all.push(e)});if(!st.done&&!st.err&&st.oldest!=null&&(hz==null||st.oldest>hz))hz=st.oldest});
 all.sort(function(a,b){return b.t-a.t});
 var vis=hz==null?all:all.filter(function(e){return e.t>=hz});return{all:all,vis:vis,hid:all.length-vis.length}}
function b89flt(rows){var f=B89.f,q=f.q.trim().toLowerCase(),ac=f.ac.trim().toLowerCase(),fm=f.from?Date.parse(f.from):0,to=f.to?Date.parse(f.to):0;
 return rows.filter(function(e){
  if(f.dm&&e.dm!==f.dm)return false;if(f.src&&e.k!==f.src)return false;
  if(f.rs==='na'){if(e.rs!==null)return false}else if(f.rs&&e.rs!==f.rs)return false;
  if(ac&&String(e.ac||'').toLowerCase().indexOf(ac)<0)return false;
  if(e.t&&((fm&&e.t<fm)||(to&&e.t>to)))return false;
  if(q&&[e.id,e.a,b89lbl(e.a),e.ei,e.et,e.note,e.sn,e.ac].join(' ').toLowerCase().indexOf(q)<0)return false;
  return true})}
function b89dt(e){if(!e.t)return'—';return'<span title="'+X(new Date(e.t).toISOString())+'">'+X(fd(e.t))+'</span>'}
function b89pill(k,t){return'<span class="b88p b88p-'+k+'">'+X(t)+'</span>'}
function b89actor(e){if(!e.ac)return b89pill('na','غير متوفر');var u=AD.um&&AD.um[e.ac];return(u&&u.full_name?X(u.full_name)+' ':'')+idt(e.ac)}
function b89ent(e){if(!e.ei&&!e.et)return'—';return(e.et?X(B89ET[e.et]||e.et)+' ':'')+(e.ei?idt(e.ei):'')}
function b89res(e){return e.rs==='ok'?b89pill('ok','نجاح'):e.rs==='bad'?b89pill('bad','فشل'):b89pill('na','غير مسجّلة')}
function b89srcDraw(){var el=E('b89src');if(!el)return;var n=0,bad=[],rows=B89.SRC.map(function(s){var st=B89.S[s.k],p;
  if(!st.ok&&!st.err&&!st.done)p=b89pill('na','جارٍ الجلب…');
  else if(st.err){if(s.opt&&(st.ec==='42883'||st.ec==='PGRST202'))p=b89pill('na','غير مفعّل بعد (مقترح SQL)');else{p=b89pill('bad','غير متاح: '+st.err);bad.push(s.n)}}
  else{n++;p=b89pill('ok','متصل · '+st.rows.length+(st.done?'':'+'))}
  return'<li><span>'+X(s.n)+'</span> '+p+'</li>'}).join('');
 el.innerHTML='<details class="b89n"'+(bad.length?' open':'')+'><summary>المصادر المقروءة: '+n+' من '+B89.SRC.length+(bad.length?' · تعذّر: '+X(bad.join('، ')):'')+'</summary><ul class="b87lg">'+rows+'</ul>'+(bad.length?'<p><button class="ab" type="button" data-b89="retry">إعادة محاولة المصادر الفاشلة</button></p>':'')+'</details>'}
function b89draw(){var L=E('b89l');if(!L)return;b89srcDraw();
 var pending=B89.SRC.some(function(s){var st=B89.S[s.k];return!st.ok&&!st.err&&!st.done}),anyOk=B89.SRC.some(function(s){return B89.S[s.k].ok});
 if(!anyOk&&B89.busy&&pending){L.innerHTML='<p class="adE">جارٍ التحميل…</p>';E('b89sum').innerHTML='';return}
 if(!anyOk&&!B89.busy){L.innerHTML='<p class="adE er">لم يمكن جلب أي سجل تدقيق. تحقق من الاتصال أو من صلاحياتك ثم أعد المحاولة.</p>';E('b89sum').innerHTML='';return}
 var V=b89view(),F=b89flt(V.vis),shown=F.slice(0,B89.lim);B89.V=shown;
 var more=B89.SRC.some(function(s){var st=B89.S[s.k];return!st.done&&!st.err}),noA=0,noR=0;F.forEach(function(e){if(!e.ac)noA++;if(e.rs===null)noR++});
 E('b89sum').innerHTML='<p class="b17n">محمّل من الخادم: <b>'+V.all.length+'</b> حدثاً · مطابق للفلاتر: <b>'+F.length+'</b>'+(F.length?' · بلا معرّف منفّذ: <b>'+noA+'</b> · بلا نتيجة مسجّلة: <b>'+noR+'</b>':'')+'. البحث والفلاتر (عدا التاريخ) تعمل على ما هو محمّل فقط.'+(V.hid?' أُخفي مؤقتاً '+V.hid+' حدثاً أقدم للحفاظ على صحة الترتيب بين المصادر؛ يظهر عند تحميل المزيد.':'')+'</p>';
 if(!shown.length){L.innerHTML='<p class="adE">'+(V.all.length?'لا توجد أحداث تطابق الفلاتر في المحمّل حالياً.':'لا توجد أحداث في المصادر المتاحة.')+'</p>'+(more?'<p style="text-align:center"><button class="ab" type="button" data-b89="more"'+(B89.busy?' disabled':'')+'>تحميل أقدم من الخادم</button></p>':'');return}
 L.innerHTML='<div class="adtw"><table class="adt adt-r"><thead><tr><th>الوقت</th><th>المصدر</th><th>الإجراء</th><th>العنصر</th><th>المنفّذ</th><th>النتيجة</th><th></th></tr></thead><tbody>'+
  shown.map(function(e,i){return'<tr><td data-l="الوقت">'+b89dt(e)+'</td><td data-l="المصدر">'+X(e.sn)+'</td><td data-l="الإجراء">'+X(b89lbl(e.a))+'</td><td data-l="العنصر">'+b89ent(e)+'</td><td data-l="المنفّذ">'+b89actor(e)+'</td><td data-l="النتيجة">'+b89res(e)+'</td><td data-l=""><button class="b89x" type="button" data-b89="d" data-i="'+i+'">تفاصيل</button></td></tr>'}).join('')+'</tbody></table></div>'+
  '<div class="adpg"><span>يُعرض '+shown.length+' من '+F.length+'</span>'+((F.length>shown.length||more)?'<button class="ab" type="button" data-b89="more"'+(B89.busy?' disabled':'')+'>'+(F.length>shown.length?'عرض المزيد':'تحميل أقدم من الخادم')+'</button>':'<span>انتهت السجلات المتاحة</span>')+'</div>'}
function b89mo(){var x=E('adx');if(!x)return;x.classList.add('b89o');if(window.MutationObserver){var o=new MutationObserver(function(){if(!x.classList.contains('on')){x.classList.remove('b89o');o.disconnect()}});o.observe(x,{attributes:true,attributeFilter:['class']})}}
function b89detail(e){var miss=[];
 if(!e.ac)miss.push('لا يوجد معرّف منفّذ في هذا السجل');if(e.rs===null)miss.push('نتيجة الإجراء (نجاح/فشل) غير مسجّلة في هذا المصدر');if(!e.ei)miss.push('لا يوجد معرّف للعنصر المتأثر');if(!e.id)miss.push('لا يوجد معرّف فريد للحدث في هذا المصدر');if(!e.at)miss.push('وقت الحدث غير متوفر');
 var cnt={n:0},js;try{js=JSON.stringify(b89red(e.raw,0,cnt),null,2)}catch(x){js='—'}if(js&&js.length>3000)js=js.slice(0,3000)+'…';
 var D=function(a,b){return'<dt>'+a+'</dt><dd>'+b+'</dd>'};
 modal('<h2>تفاصيل الحدث</h2><dl class="b89dl">'+D('معرّف الحدث',e.id?'<bdi>'+X(e.id)+'</bdi>':b89pill('na','غير متوفر'))
  +D('الوقت (محلي)',e.t?X(new Date(e.t).toLocaleString('ar-IQ',{dateStyle:'full',timeStyle:'medium'})):'—')+D('الوقت الموحّد (UTC)',e.t?'<bdi>'+X(new Date(e.t).toISOString())+'</bdi>':'—')
  +D('المصدر',X(e.sn)+' <bdi>('+X(e.k)+')</bdi>')+D('الإجراء',X(b89lbl(e.a))+(e.a&&b89lbl(e.a)!==e.a?' <bdi>('+X(e.a)+')</bdi>':''))
  +D('المجال',X(B89DM[e.dm]||'أخرى'))+D('العنصر',e.et||e.ei?(e.et?X(B89ET[e.et]||e.et)+' ':'')+(e.ei?'<bdi>'+X(e.ei)+'</bdi>':''):'—')
  +D('المنفّذ',e.ac?'<bdi>'+X(e.ac)+'</bdi> <small>(من عمود '+X(e.acc)+')</small>':b89pill('na','غير متوفر'))+D('النتيجة',b89res(e))+D('السبب/الملاحظة',e.note?X(e.note):'—')+'</dl>'
  +(miss.length?'<h3>بيانات غير مكتملة</h3><ul>'+miss.map(function(m){return'<li>'+X(m)+'</li>'}).join('')+'</ul>':'')
  +'<h3>الحقول المسجّلة في المصدر (منقّحة)</h3>'+(cnt.n?'<p class="b17n">أُخفي '+cnt.n+' حقل حساس.</p>':'')+'<pre class="b89pre">'+X(js||'—')+'</pre>');b89mo()}
function b89shell(){var o=function(m,v,all){return(all?'<option value="">'+all+'</option>':'')+Object.keys(m).map(function(k){return'<option value="'+X(k)+'"'+(k===v?' selected':'')+'>'+X(m[k])+'</option>'}).join('')},f=B89.f,SM={};B89.SRC.forEach(function(s){SM[s.k]=s.n});
 return'<div id="b89w"><h2>سجل التدقيق والنشاط الإداري '+b89pill('na','B89 · قراءة فقط')+'</h2>'
 +'<p class="b89n">يعرض إجراءات إدارية سجّلتها دوال الخادم الحالية. لا يُسجَّل أي حدث من المتصفح، ولا يمكن تعديل السجل أو حذفه من هذه الصفحة. أوقات العرض بتوقيت جهازك، والمخزَّن في البيانات توقيت موحّد (UTC) يظهر في تفاصيل الحدث. إن غاب عمود النتيجة في مصدر ما تظهر «غير مسجّلة» ولا تُعامَل كنجاح.</p>'
 +'<div id="b89src"></div>'
 +'<div class="b87f"><input id="b89q" type="search" placeholder="بحث في السجل" value="'+X(f.q)+'" aria-label="بحث"><select id="b89dm" aria-label="نوع الإجراء">'+o(B89DM,f.dm,'كل أنواع الإجراءات')+'</select><select id="b89s" aria-label="المصدر">'+o(SM,f.src,'كل المصادر')+'</select><select id="b89r" aria-label="النتيجة">'+o({ok:'نجاح',bad:'فشل',na:'غير مسجّلة'},f.rs,'كل النتائج')+'</select><input id="b89ac" type="search" placeholder="معرّف المنفّذ" value="'+X(f.ac)+'" aria-label="المنفّذ"><label>من تاريخ<input id="b89fd" type="date" value="'+X(f.fromD)+'"></label><label>إلى تاريخ<input id="b89td" type="date" value="'+X(f.toD)+'"></label></div>'
 +'<div id="b89sum"></div><div id="b89l"></div>'
 +'<details class="b89n"><summary>ما الذي يغطيه السجل حالياً؟ (حسب فحص الكود)</summary><p><b>له مصدر تدقيق تقرؤه الواجهة:</b> مراجعة الإعلانات، معالجة البلاغات، تقييد الحسابات ورفع التقييد، منح الأدوار الإدارية وسحبها، مراجعة الأنشطة التجارية، مراجعة عروض BAHR PARTS، تعطيل الحسابات وقرارات الحذف، وضع الصيانة، إجراءات الإدارة على الخدمات البحرية، وإجراءات الطلبات والعروض (B62).</p><p><b>لم يُعثر على مصدر تدقيق مقروء لها:</b> قرارات المدفوعات وإثباتاتها وتعليمات الدفع (B55)، محتوى الموقع والأسئلة والصفحات (B59)، تذاكر الدعم (B57)، إجراءات الأمان والتكرار (B58)، بلاغات القطع (B60)، إشراف التقييمات (B50)، توزيع المهام (B56). قد يكون بعضها مسجَّلاً على الخادم دون أن تقرأه الواجهة؛ يلزم تأكيد ذلك من ملفات SQL.</p><p><b>المحاولات الفاشلة أو المرفوضة:</b> لا تظهر إلا إذا كان المصدر يسجّلها صراحةً أو بعد تفعيل سجل B89 الموحّد (مقترح SQL غير منفَّذ).</p></details></div>'}
function b89bind(){var W=E('b89w');if(!W)return;
 var on=function(id,ev,fn){var x=E(id);if(x)x.addEventListener(ev,fn)};
 on('b89q','input',function(){B89.f.q=this.value;B89.lim=B89.STEP;b89draw()});on('b89ac','input',function(){B89.f.ac=this.value;B89.lim=B89.STEP;b89draw()});
 on('b89dm','change',function(){B89.f.dm=this.value;B89.lim=B89.STEP;b89draw()});on('b89s','change',function(){B89.f.src=this.value;B89.lim=B89.STEP;b89draw()});on('b89r','change',function(){B89.f.rs=this.value;B89.lim=B89.STEP;b89draw()});
 var dt=function(){var a=E('b89fd').value,b=E('b89td').value,f=B89.f;f.fromD=a;f.toD=b;
  f.from=a?new Date(a+'T00:00:00').toISOString():'';f.to=b?new Date(b+'T23:59:59.999').toISOString():'';
  if(a&&b&&f.from>f.to){msg('تاريخ البداية بعد تاريخ النهاية.');return}
  b89reset();b89run(B89.SRC)};
 on('b89fd','change',dt);on('b89td','change',dt);
 W.addEventListener('click',function(ev){var b=ev.target.closest('[data-b89]');if(!b||b.disabled)return;var k=b.dataset.b89;
  if(k==='d'){var e=B89.V[parseInt(b.dataset.i,10)];if(e)b89detail(e);return}
  if(k==='more'){B89.lim+=B89.STEP;var vf=b89flt(b89view().vis);if(vf.length>=B89.lim){b89draw();return}
   var l=B89.SRC.filter(function(s){var st=B89.S[s.k];return!st.done&&!st.err});if(!l.length){b89draw();return}b89run(l);return}
  if(k==='retry'){var r=B89.SRC.filter(function(s){var st=B89.S[s.k];return st.err&&!(s.opt&&(st.ec==='42883'||st.ec==='PGRST202'))});r.forEach(function(s){B89.S[s.k]=b89fresh()});if(r.length)b89run(r)}})}
function audit(){var c=sbc();if(!c){er('الاتصال بـ Supabase غير جاهز.',audit);return}
 b89reset();E('adm').innerHTML=b89shell();b89bind();b89run(B89.SRC)}
/* ===== B90: مركز سلامة البيانات وتكامل الأنظمة. قراءة فقط بالكامل: لا insert ولا update ولا delete ولا upsert ولا حذف ولا إصلاح تلقائي. يقرأ بصلاحية حساب المدير الحالي فقط، وكل نتيجة تعتمد على ما تسمح به RLS؛ الحماية الفعلية في الخادم لا في إخفاء التبويب. أسماء الجداول والأعمدة مأخوذة من استخدامها الفعلي في هذا الملف لا من SQL (لا توجد ملفات SQL مرفقة). ===== */
var B90={CAP:2000,PG:1000,LK:100,C:{},K:{},g:0,busy:0,at:null,R:{},f:{q:'',gr:'',st:''}};
var B90G={ads:'الإعلانات والمالكون',media:'صور الإعلانات',favs:'المفضلة',biz:'الأنشطة والخدمات',req:'الطلبات والعروض',rev:'التقييمات والبلاغات',parts:'قطع الغيار',adm:'اتساق لوحة الإدارة',pay:'المدفوعات'};
var B90S={ok:'سليم',conf:'مشكلة مؤكدة',rev:'يحتاج مراجعة',na:'تعذّر التحقق',none:'لم يُفحص بعد'};
var B90P={ok:'ok',conf:'bad',rev:'warn',na:'na',none:'na'};
var B90LS=['published','pending','rejected','suspended','draft'];
/* الأعمدة المقروءة لكل جدول، مع مفاتيح الترتيب (لثبات الترقيم). مأخوذة من استخدام الواجهة. */
var B90T={
 listings:{c:'id,status,title',o:['id']},
 listing_images:{c:'listing_id,storage_path',o:['listing_id','storage_path']},
 listing_owners:{c:'listing_id,owner_id',o:['listing_id']},
 favorites:{c:'user_id,listing_id',o:['user_id','listing_id']},
 reports:{c:'listing_id,business_id,review_id,status,created_at',o:['created_at']},
 marine_services:{c:'id,biz_id,owner_id',o:['id']},
 buyer_request_offers:{c:'id,request_id,biz_id',o:['id']},
 service_requests:{c:'id,biz_id,service_id',o:['id']},
 biz_reviews:{c:'id,biz_id,rating',o:['id']},
 parts_offers:{c:'id,part_id',o:['id']},
 parts_fitment:{c:'part_id,status',o:['part_id']},
 parts_items:{c:'id,manufacturer_id',o:['id']},
 b74_suspensions:{c:'user_id',o:['user_id']},
 b55_payments:{c:'user_id,created_at',o:['created_at']}
};
function b90pill(k,t){return'<span class="b88p b88p-'+k+'">'+X(t)+'</span>'}
function b90tm(t){if(!t)return'—';var d=new Date(t);return isNaN(d)?'—':d.toLocaleString('ar-IQ',{dateStyle:'short',timeStyle:'short'})}
function b90em(e){var c=String(e&&e.code||''),m=String(e&&e.message||'');
 if(c==='42P01'||c==='PGRST205')return'الجدول غير موجود أو غير مكشوف عبر API.';
 if(c==='42703'||c==='PGRST204')return'عمود مطلوب للفحص غير موجود (الأعمدة مأخوذة من استخدام الواجهة لا من SQL).';
 if(c==='42501'||c==='PGRST301'||/permission|denied|jwt|forbidden/i.test(m))return'لا صلاحية قراءة لهذا الجدول (RLS).';
 if(c==='42883'||c==='PGRST202')return'الدالة غير موجودة على الخادم.';
 if(/Failed to fetch|network/i.test(m))return'انقطع الاتصال.';
 return'تعذّر الاستعلام'+(c?' ('+c+')':'')+'.'}
function b90res(st,n,o){o=o||{};return{st:st,n:n,sc:o.sc,tot:o.tot,part:!!o.part,ids:o.ids||[],lb:o.lb||'',note:o.note||'',at:Date.now()}}
function b90na(m){return b90res('na',null,{note:m})}
function b90bad(e,t){return b90na('تعذّر قراءة «'+t+'»: '+b90em(e))}
function b90empty(t){return b90na('لم يُقرأ أي سجل من «'+t+'»: الجدول فارغ فعلاً أو أن RLS تمنع الإدارة من رؤية صفوفه. لا يمكن اعتبار ذلك سليماً.')}
/* قراءة جدول بالصفحات حتى سقف CAP؛ تُخزَّن النتيجة طوال دورة الفحص. */
function b90read(t){if(B90.C[t])return B90.C[t];var c=sbc(),sp=B90T[t];
 return B90.C[t]=new Promise(function(res){var rows=[],tot=null;
  (function go(off){var q=c.from(t).select(sp.c,off?{}:{count:'exact'});sp.o.forEach(function(k){q=q.order(k,{ascending:true})});
   q.range(off,off+B90.PG-1).then(function(r){if(r.error){res({err:r.error,rows:rows});return}
    var d=r.data||[];if(tot==null&&r.count!=null)tot=r.count;rows=rows.concat(d);
    if(d.length<B90.PG||rows.length>=B90.CAP){var T=tot==null?rows.length:tot;res({rows:rows,total:T,part:T>rows.length});return}
    go(off+B90.PG)},function(e){res({err:e,rows:rows})})})(0)})}
/* بحث عن معرّفات في جدول أب (دفعات صغيرة، قراءة فقط). يُخزَّن الموجود والمفقود لتفادي التكرار. */
function b90look(t,k,ids){var c=sbc(),key=t+'.'+k,K=B90.K[key]=B90.K[key]||{},todo=ids.filter(function(i){return K[i]===undefined}),bs=[];
 for(var i=0;i<todo.length;i+=B90.LK)bs.push(todo.slice(i,i+B90.LK));
 return bs.reduce(function(p,b){return p.then(function(er){if(er)return er;return c.from(t).select(k).in(k,b).then(function(r){if(r.error)return r.error;var f={};(r.data||[]).forEach(function(x){f[x[k]]=1});b.forEach(function(i){K[i]=!!f[i]});return null})})},Promise.resolve(null)).then(function(er){var f={};ids.forEach(function(i){if(K[i])f[i]=1});return{found:f,err:er}})}
/* قراءة صفوف من جدول بقيم محددة لعمود (دفعات). */
function b90inq(t,sel,col,vals,fn){var c=sbc(),out=[],bs=[];for(var i=0;i<vals.length;i+=B90.LK)bs.push(vals.slice(i,i+B90.LK));
 return bs.reduce(function(p,b){return p.then(function(er){if(er)return er;var q=c.from(t).select(sel).in(col,b);if(fn)q=fn(q);return q.then(function(r){if(r.error)return r.error;out=out.concat(r.data||[]);return null})})},Promise.resolve(null)).then(function(er){return{rows:out,err:er}})}
function b90fin(bads,R,st,o){o=o||{};var n=bads.length;
 if(n)return b90res(st,n,{sc:R.rows.length,tot:R.total,part:R.part,ids:bads.slice(0,25).map(o.lbl||function(r){return r.id||''}),lb:o.lb,note:(o.note||'')+(R.part?' الفحص جزئي ('+R.rows.length+' من '+R.total+') فقد توجد حالات أخرى.':'')});
 if(R.part)return b90res('na',null,{sc:R.rows.length,tot:R.total,part:1,note:'لم تُكتشف مشكلة ضمن السجلات المفحوصة، لكن الفحص جزئي ('+R.rows.length+' من '+R.total+') فلا يُعدّ سليماً.'});
 return b90res('ok',0,{sc:R.rows.length,tot:R.total})}
/* سجل في جدول ابن يشير إلى معرّف غير موجود في الجدول الأب. تُصنَّف النتيجة «يحتاج مراجعة» لأن RLS قد تخفي صفوف الأب عن الإدارة. */
function b90orph(ch,col,pt,pk,o){o=o||{};return b90read(ch).then(function(R){
 if(R.err)return b90bad(R.err,ch);if(!R.rows.length)return b90empty(ch);
 var ids=[],sn={};R.rows.forEach(function(r){var v=r[col];if(v!=null&&v!==''&&!sn[v]){sn[v]=1;ids.push(v)}});
 if(!ids.length)return b90fin([],R);
 return b90look(pt,pk,ids).then(function(L){if(L.err)return b90bad(L.err,pt);
  var f=0;ids.forEach(function(i){if(L.found[i])f++});
  if(ids.length>=5&&!f)return b90na('الجدول «'+pt+'» لم يُرجع أي سجل لـ '+ids.length+' معرّفاً: غالباً RLS تمنع الإدارة من رؤيته، فلا يمكن الحكم على السجلات اليتيمة.');
  var bad=R.rows.filter(function(r){var v=r[col];return v!=null&&v!==''&&!L.found[v]});
  return b90fin(bad,R,'rev',{lbl:function(r){return r[col]},lb:'المعرّفات المشار إليها وغير الموجودة',note:'قد يكون السبب حذفاً فعلياً أو أن RLS تخفي الجدول الأب عن الإدارة.'})})})}
function b90dups(t,cols,lbl){return b90read(t).then(function(R){if(R.err)return b90bad(R.err,t);if(!R.rows.length)return b90empty(t);
 var m={},bad=[];R.rows.forEach(function(r){var k=cols.map(function(c){return r[c]==null?'':r[c]}).join('|');if(cols.some(function(c){return r[c]==null||r[c]===''}))return;m[k]=(m[k]||0)+1;if(m[k]===2)bad.push(r)});
 return b90fin(bad,R,'conf',{lbl:lbl,lb:'أمثلة على السجلات المكررة',note:'تكرار صريح لنفس القيم داخل الجدول نفسه.'})})}
function b90rpcdup(fn,lbl){return sbc().rpc(fn).then(function(r){if(r.error)return b90bad(r.error,fn);var L=r.data||[];
 return b90res(L.length?'rev':'ok',L.length,{ids:L.slice(0,25).map(lbl),lb:'أمثلة على مجموعات الاشتباه',note:L.length?'العدد = مجموعات الاشتباه التي أرجعتها دالة الخادم الحالية، وهي للمراجعة اليدوية فقط (لا دمج ولا حذف).':''})},function(e){return b90bad(e,fn)})}
function b90cnt(t,fn){var q=sbc().from(t).select('*',{count:'exact',head:true});if(fn)q=fn(q);return q.then(function(r){return r.error?{e:r.error}:{n:r.count}},function(e){return{e:e}})}
var B90K=[
 {id:'ads-img-orphan',g:'media',t:'صور بلا إعلان',d:'سجلات listing_images يشير listing_id فيها إلى إعلان غير موجود في listings.',im:'صور يتيمة لا تظهر في أي إعلان وقد تدل على حذف ناقص.',rec:'راجع يدوياً بعد التأكد أن RLS لا تخفي الإعلانات عن الإدارة. لا تحذف قبل المراجعة.',go:{t:'ads'},run:function(){return b90orph('listing_images','listing_id','listings','id')}},
 {id:'media-empty',g:'media',t:'صور بمسار تخزين فارغ',d:'سجلات listing_images عمود storage_path فيها فارغ.',im:'سجل لا يمكن عرض صورته أبداً.',rec:'راجع السجل ومالك الإعلان يدوياً؛ الإصلاح يحتاج قاعدة معتمدة.',go:{t:'ads'},run:function(){return b90read('listing_images').then(function(R){if(R.err)return b90bad(R.err,'listing_images');if(!R.rows.length)return b90empty('listing_images');return b90fin(R.rows.filter(function(r){return!String(r.storage_path||'').trim()}),R,'conf',{lbl:function(r){return'listing_id: '+r.listing_id},lb:'الإعلانات المتأثرة'})})}},
 {id:'media-dup',g:'media',t:'صور مكررة لنفس الإعلان',d:'نفس المسار (storage_path) مسجّل أكثر من مرة لنفس الإعلان.',im:'ازدواج في المعرض وقد يخلّ بالترتيب.',rec:'راجع يدوياً قبل أي إجراء.',go:{t:'ads'},run:function(){return b90dups('listing_images',['listing_id','storage_path'],function(r){return r.listing_id+' · '+r.storage_path})}},
 {id:'media-storage',g:'media',t:'وجود ملفات الصور فعلياً في Storage',d:'مطابقة storage_path مع الملفات في حاوية listing-images.',im:'ملف مفقود يعني صورة مكسورة.',rec:'يحتاج دالة خادم للقراءة فقط أو معرفة بنية المسارات؛ لم يُنفَّذ.',run:function(){return Promise.resolve(b90na('لم يُنفَّذ: التحقق من وجود الملفات يتطلب سرد محتوى حاوية Storage، وبنية المجلدات غير موثقة في الملف، ولا يمكن تنفيذه بأمان من المتصفح دون افتراض.'))}},
 {id:'ads-own-listing',g:'ads',t:'ربط مالك بإعلان غير موجود',d:'سجلات listing_owners يشير listing_id فيها إلى إعلان غير موجود.',im:'علاقة ملكية بلا إعلان.',rec:'راجع يدوياً؛ لا حذف تلقائي.',go:{t:'ads'},run:function(){return b90orph('listing_owners','listing_id','listings','id')}},
 {id:'ads-own-profile',g:'ads',t:'إعلان يشير إلى حساب مالك غير موجود',d:'سجلات listing_owners يشير owner_id فيها إلى حساب غير موجود في profiles.',im:'إعلان بلا صاحب معروف: تتعذر المراسلة والمساءلة.',rec:'راجع الحساب والإعلان يدوياً.',go:{t:'ads'},run:function(){return b90orph('listing_owners','owner_id','profiles','id')}},
 {id:'ads-status',g:'ads',t:'إعلان بحالة غير معروفة',d:'حالة الإعلان خارج المجموعة المعروفة في الواجهة: '+B90LS.join('، ')+'.',im:'قد لا يظهر الإعلان في أي قائمة إدارة.',rec:'تأكد هل أُضيفت حالة جديدة في الخادم قبل اعتبارها خللاً.',go:{t:'ads'},run:function(){return b90read('listings').then(function(R){if(R.err)return b90bad(R.err,'listings');if(!R.rows.length)return b90empty('listings');return b90fin(R.rows.filter(function(r){return B90LS.indexOf(r.status)<0}),R,'rev',{lbl:function(r){return r.id+' · '+(r.status==null?'(بلا حالة)':r.status)},lb:'الإعلانات المتأثرة',note:'المجموعة المعروفة مأخوذة من الواجهة لا من قاعدة البيانات.'})})}},
 {id:'ads-pub-title',g:'ads',t:'إعلان منشور بعنوان فارغ',d:'إعلان حالته published وعنوانه فارغ.',im:'ظهور إعلان بلا عنوان للزوار.',rec:'راجع الإعلان يدوياً وأعد حالته عبر مسار المراجعة الحالي.',go:{t:'ads'},run:function(){return b90read('listings').then(function(R){if(R.err)return b90bad(R.err,'listings');if(!R.rows.length)return b90empty('listings');return b90fin(R.rows.filter(function(r){return r.status==='published'&&!String(r.title||'').trim()}),R,'rev',{lbl:function(r){return r.id},lb:'الإعلانات المتأثرة',note:'اعتبار العنوان إلزامياً قاعدة مستنتجة من واجهة النشر.'})})}},
 {id:'ads-susp',g:'ads',t:'إعلان منشور لمالك موقوف',d:'إعلان published يعود لمستخدم له سجل في b74_suspensions.',im:'استمرار ظهور محتوى حساب موقوف.',rec:'راجع سياسة الإيقاف: هل يجب إخفاء إعلانات الموقوف؟ ثم قرّر.',go:{t:'ads'},run:function(){return b90read('b74_suspensions').then(function(S){if(S.err)return b90bad(S.err,'b74_suspensions');
  var u=[];S.rows.forEach(function(r){if(r.user_id&&u.indexOf(r.user_id)<0)u.push(r.user_id)});
  if(!u.length)return b90na('لا توجد سجلات إيقاف مقروءة في b74_suspensions (لا موقوفين فعلاً أو RLS تمنع القراءة)، فلا يوجد ما يُقارَن به.');
  return b90inq('listing_owners','listing_id,owner_id','owner_id',u).then(function(O){if(O.err)return b90bad(O.err,'listing_owners');
   var lid=[];O.rows.forEach(function(r){if(r.listing_id&&lid.indexOf(r.listing_id)<0)lid.push(r.listing_id)});
   if(!lid.length)return b90res('ok',0,{note:'لا إعلانات مرتبطة بالموقوفين ('+u.length+' موقوف).'});
   return b90inq('listings','id,status','id',lid,function(q){return q.eq('status','published')}).then(function(L){if(L.err)return b90bad(L.err,'listings');
    if(!L.rows.length)return b90res('ok',0,{note:'فُحص '+lid.length+' إعلاناً لموقوفين، ولا منشور منها.'});
    return b90res('rev',L.rows.length,{ids:L.rows.slice(0,25).map(function(r){return r.id}),lb:'الإعلانات المتأثرة',note:'يُفترض هنا أن وجود السجل في b74_suspensions يعني إيقافاً قائماً، وهذا غير مؤكد من الملف.'})})})})}},
 {id:'fav-orphan',g:'favs',t:'مفضلة تشير إلى إعلان غير موجود',d:'سجلات favorites يشير listing_id فيها إلى إعلان غير موجود.',im:'عناصر مفضلة فارغة أو أخطاء عرض عند المستخدم.',rec:'راجع يدوياً؛ قد يكون الإعلان حُذف.',run:function(){return b90orph('favorites','listing_id','listings','id')}},
 {id:'fav-dup',g:'favs',t:'مفضلة مكررة',d:'نفس (user_id, listing_id) مسجّل أكثر من مرة في favorites.',im:'عدّ مضاعف لحفظ الإعلان.',rec:'راجع يدوياً؛ لا حذف تلقائي.',run:function(){return b90dups('favorites',['user_id','listing_id'],function(r){return String(r.user_id).slice(0,8)+'… · '+r.listing_id})}},
 {id:'svc-biz',g:'biz',t:'خدمة تشير إلى نشاط غير موجود',d:'marine_services.biz_id يشير إلى نشاط غير موجود في biz_profiles.',im:'خدمة بلا نشاط صاحب.',rec:'راجع الخدمة والنشاط يدوياً.',go:{h:'#admbiz'},run:function(){return b90orph('marine_services','biz_id','biz_profiles','id')}},
 {id:'svc-owner',g:'biz',t:'خدمة تشير إلى حساب مالك غير موجود',d:'marine_services.owner_id يشير إلى حساب غير موجود في profiles.',im:'خدمة بلا مالك معروف.',rec:'راجع يدوياً.',go:{h:'#admbiz'},run:function(){return b90orph('marine_services','owner_id','profiles','id')}},
 {id:'svc-mismatch',g:'biz',t:'مالك الخدمة يختلف عن مالك النشاط',d:'marine_services.owner_id لا يساوي biz_profiles.owner_id للنشاط المرتبط.',im:'تضارب في من يملك الخدمة ويديرها.',rec:'راجع يدوياً؛ قد يكون النقل مقصوداً.',go:{h:'#admbiz'},run:function(){return b90read('marine_services').then(function(R){if(R.err)return b90bad(R.err,'marine_services');if(!R.rows.length)return b90empty('marine_services');
  var ids=[],sn={};R.rows.forEach(function(r){if(r.biz_id&&!sn[r.biz_id]){sn[r.biz_id]=1;ids.push(r.biz_id)}});if(!ids.length)return b90fin([],R);
  return b90inq('biz_profiles','id,owner_id','id',ids).then(function(B){if(B.err)return b90bad(B.err,'biz_profiles');var m={};B.rows.forEach(function(b){m[b.id]=b.owner_id});
   if(ids.length>=5&&!B.rows.length)return b90na('«biz_profiles» لم يُرجع أي سجل: غالباً RLS تمنع الإدارة من رؤيته.');
   return b90fin(R.rows.filter(function(r){return r.owner_id&&m[r.biz_id]&&m[r.biz_id]!==r.owner_id}),R,'rev',{lbl:function(r){return r.id},lb:'الخدمات المتأثرة',note:'قد يكون اختلاف المالك مقصوداً.'})})})}},
 {id:'req-offer-req',g:'req',t:'عرض على طلب غير موجود',d:'buyer_request_offers.request_id يشير إلى طلب غير موجود في buyer_requests.',im:'عرض معلّق بلا طلب.',rec:'راجع يدوياً؛ قد يكون الطلب محذوفاً أو مخفياً بـ RLS.',go:{h:'#admreq'},run:function(){return b90orph('buyer_request_offers','request_id','buyer_requests','id')}},
 {id:'req-offer-biz',g:'req',t:'عرض من نشاط غير موجود',d:'buyer_request_offers.biz_id يشير إلى نشاط غير موجود في biz_profiles.',im:'عرض بلا نشاط معروف.',rec:'راجع يدوياً.',go:{h:'#admreq'},run:function(){return b90orph('buyer_request_offers','biz_id','biz_profiles','id')}},
 {id:'req-sr-biz',g:'req',t:'طلب خدمة مرتبط بنشاط غير موجود',d:'service_requests.biz_id يشير إلى نشاط غير موجود في biz_profiles.',im:'طلب لا يصل إلى مزوّد.',rec:'راجع يدوياً.',go:{h:'#admreq'},run:function(){return b90orph('service_requests','biz_id','biz_profiles','id')}},
 {id:'req-sr-svc',g:'req',t:'طلب خدمة مرتبط بخدمة غير موجودة',d:'service_requests.service_id يشير إلى خدمة غير موجودة في marine_services.',im:'طلب مرتبط بخدمة محذوفة.',rec:'راجع يدوياً.',go:{h:'#admreq'},run:function(){return b90orph('service_requests','service_id','marine_services','id')}},
 {id:'req-dups',g:'req',t:'طلبات مكررة محتملة (دالة الخادم)',d:'نتيجة b62_admin_duplicates الحالية: طلبات بنفس العنوان أو النص.',im:'ازدحام وتكرار في الطلبات.',rec:'مراجعة يدوية فقط.',go:{h:'#admreq'},run:function(){return b90rpcdup('b62_admin_duplicates',function(x){return(x.kind==='same_user_same_title'?'نفس المستخدم ×':'نص متطابق ×')+(x.cnt||'')+' · '+(x.sample_title||'')})}},
 {id:'rev-biz',g:'rev',t:'تقييم لنشاط غير موجود',d:'biz_reviews.biz_id يشير إلى نشاط غير موجود في biz_profiles.',im:'تقييم بلا نشاط.',rec:'راجع يدوياً.',go:{h:'#admbiz'},run:function(){return b90orph('biz_reviews','biz_id','biz_profiles','id')}},
 {id:'rev-rating',g:'rev',t:'تقييم خارج المقياس 1–5',d:'قيمة rating ليست عدداً صحيحاً بين 1 و5.',im:'يشوّه متوسط التقييم.',rec:'راجع يدوياً.',go:{h:'#admbiz'},run:function(){return b90read('biz_reviews').then(function(R){if(R.err)return b90bad(R.err,'biz_reviews');if(!R.rows.length)return b90empty('biz_reviews');return b90fin(R.rows.filter(function(r){var n=Number(r.rating);return!(r.rating!=null&&isFinite(n)&&n%1===0&&n>=1&&n<=5)}),R,'rev',{lbl:function(r){return r.id+' · '+r.rating},lb:'التقييمات المتأثرة',note:'المقياس 1–5 مأخوذ من واجهة التقييم لا من قيد في قاعدة البيانات.'})})}},
 {id:'rep-listing',g:'rev',t:'بلاغ عن إعلان غير موجود',d:'reports.listing_id يشير إلى إعلان غير موجود في listings.',im:'بلاغ لا يمكن معالجته.',rec:'راجع البلاغ يدوياً.',go:{t:'reps'},run:function(){return b90orph('reports','listing_id','listings','id')}},
 {id:'rep-biz',g:'rev',t:'بلاغ عن نشاط غير موجود',d:'reports.business_id يشير إلى نشاط غير موجود في biz_profiles.',im:'بلاغ لا يمكن معالجته.',rec:'راجع البلاغ يدوياً.',go:{t:'reps'},run:function(){return b90orph('reports','business_id','biz_profiles','id')}},
 {id:'rep-empty',g:'rev',t:'بلاغ بلا هدف',d:'بلاغ ليس له listing_id ولا business_id ولا review_id.',im:'لا يُعرف عمّا يبلّغ.',rec:'راجع يدوياً.',go:{t:'reps'},run:function(){return b90read('reports').then(function(R){if(R.err)return b90bad(R.err,'reports');if(!R.rows.length)return b90empty('reports');return b90fin(R.rows.filter(function(r){return!r.listing_id&&!r.business_id&&!r.review_id}),R,'rev',{lbl:function(r){return b90tm(r.created_at)+' · '+(r.status||'')},lb:'البلاغات المتأثرة (وقت الإنشاء)',note:'قد تكون هناك أنواع بلاغات أخرى لا تُربط بهذه الأعمدة.'})})}},
 {id:'part-offer',g:'parts',t:'عرض قطعة لقطعة غير موجودة',d:'parts_offers.part_id يشير إلى قطعة غير موجودة في parts_items.',im:'عرض بلا قطعة في الكتالوج.',rec:'راجع يدوياً.',go:{h:'#admparts'},run:function(){return b90orph('parts_offers','part_id','parts_items','id')}},
 {id:'part-fit',g:'parts',t:'توافق لقطعة غير موجودة',d:'parts_fitment.part_id يشير إلى قطعة غير موجودة في parts_items.',im:'علاقة توافق بلا قطعة.',rec:'راجع يدوياً.',go:{h:'#admparts'},run:function(){return b90orph('parts_fitment','part_id','parts_items','id')}},
 {id:'part-mfr',g:'parts',t:'قطعة لمصنّع غير موجود',d:'parts_items.manufacturer_id يشير إلى مصنّع غير موجود في parts_manufacturers.',im:'قطعة بلا شركة مصنّعة.',rec:'راجع يدوياً.',go:{h:'#admparts'},run:function(){return b90orph('parts_items','manufacturer_id','parts_manufacturers','id')}},
 {id:'part-dups',g:'parts',t:'قطع وعروض مكررة محتملة (دالة الخادم)',d:'نتيجة b63_admin_duplicates الحالية.',im:'تكرار في الكتالوج أو عروض المورد.',rec:'مراجعة يدوية فقط.',go:{h:'#admparts'},run:function(){return b90rpcdup('b63_admin_duplicates',function(x){return(x.kind==='offer_same_part'?'عروض متعددة لنفس القطعة':'رقم قطعة مطابق')+' ×'+(x.n||'')+' · '+(x.dup_key||'')})}},
 {id:'adm-stats',g:'adm',t:'أرقام لوحة الإدارة مقابل البيانات الفعلية',d:'مقارنة admin_stats (منشورة، بانتظار المراجعة، مرفوضة أو موقوفة، بلاغات جديدة) بعدّ مباشر من listings وreports.',im:'أرقام لوحة لا تطابق الواقع تضلّل قرارات الإدارة.',rec:'أعد الفحص بعد لحظات لاستبعاد فارق التوقيت، ثم راجع تعريف الدالة على الخادم.',go:{t:'dash'},run:function(){var c=sbc();return Promise.all([c.rpc('admin_stats'),b90cnt('listings',function(q){return q.eq('status','published')}),b90cnt('listings',function(q){return q.eq('status','pending')}),b90cnt('listings',function(q){return q.in('status',['rejected','suspended'])}),b90cnt('reports',function(q){return q.eq('status','open')})]).then(function(a){
  if(a[0].error)return b90bad(a[0].error,'admin_stats');var s=a[0].data||{},P=[['منشورة','published',a[1]],['بانتظار المراجعة','pending',a[2]],['مرفوضة أو موقوفة','blocked',a[3]],['بلاغات جديدة','reports_new',a[4]]],df=[],cm=0,ms=[];
  P.forEach(function(p){if(p[2].e||s[p[1]]==null){ms.push(p[0]);return}cm++;if(Number(s[p[1]])!==Number(p[2].n))df.push(p[0]+': اللوحة '+s[p[1]]+' ≠ الفعلي '+p[2].n)});
  if(!cm)return b90na('تعذّرت المقارنة: لم يتوفر أي رقم من الطرفين.');
  if(df.length)return b90res('rev',df.length,{ids:df,lb:'الفروق',note:'قد يكون الفرق لحظياً بين استعلامين، أو أن تعريف الرقم في الدالة يختلف عن افتراض الربط المستخدم هنا (مأخوذ من لوحة المعلومات).'});
  return b90res('ok',0,{note:'قورنت '+cm+' من 4 أرقام'+(ms.length?'؛ تعذّرت مقارنة: '+ms.join('، '):'')+'.'})})}},
 {id:'pay-user',g:'pay',t:'سجل دفع لحساب غير موجود',d:'b55_payments.user_id يشير إلى حساب غير موجود في profiles.',im:'دفعة بلا صاحب.',rec:'راجع يدوياً مع مركز المدفوعات.',run:function(){return b90orph('b55_payments','user_id','profiles','id')}},
 {id:'pay-flow',g:'pay',t:'مطابقة حالة الدفع لسير العمل',d:'التحقق من أن حالات b55_payments تتوافق مع مسار الموافقة والرفض.',im:'دفعة بحالة شاذة قد تعني رصيداً أو اشتراكاً خاطئاً.',rec:'يحتاج توثيق أسماء الحالات وقواعد الانتقال (SQL الدالة b55_admin_decide)؛ لم يُنفَّذ.',run:function(){return Promise.resolve(b90na('لم يُنفَّذ: أسماء حالات الدفع وقواعد الانتقال بينها غير موثقة في الملف، ولا توجد ملفات SQL للرجوع إليها. لا يُفترض شيء هنا.'))}}
];
function b90vis(){var f=B90.f,q=f.q.trim().toLowerCase();return B90K.filter(function(k){var r=B90.R[k.id],st=r?r.st:'none';if(f.gr&&k.g!==f.gr)return false;if(f.st&&st!==f.st)return false;
 if(q&&[k.t,k.d,k.im,(r?r.ids.join(' ')+' '+r.note:'')].join(' ').toLowerCase().indexOf(q)<0)return false;return true})}
function b90card(k){var r=B90.R[k.id],st=r?r.st:'none',n=r&&r.n!=null?r.n:null;
 return'<div class="adrc"><div><b>'+X(k.t)+'</b> '+b90pill(B90P[st],B90S[st])+' <small>'+X(B90G[k.g])+(n!=null?' · عدد السجلات المتأثرة: <b>'+n+'</b>':'')+(r?' · آخر فحص: '+X(b90tm(r.at)):'')+'</small></div>'
  +'<div><small><b>الفحص:</b> '+X(k.d)+'</small></div><div><small><b>التأثير المحتمل:</b> '+X(k.im)+'</small></div><div><small><b>التوصية:</b> '+X(k.rec)+'</small></div>'
  +(r&&r.note?'<p class="b89n" style="margin:0">'+X(r.note)+'</p>':'')
  +(r&&r.sc!=null?'<small>السجلات المفحوصة: '+r.sc+(r.tot!=null?' من '+r.tot:'')+(r.part?' (فحص جزئي)':'')+'</small>':'')
  +(r&&r.ids.length?'<details><summary>'+X(r.lb||'أمثلة')+' ('+r.ids.length+(r.n>r.ids.length?' من '+r.n:'')+')</summary><p dir="ltr" style="text-align:left;white-space:pre-wrap;word-break:break-all;margin:6px 0"><small>'+r.ids.map(function(x){return X(String(x))}).join('\n')+'</small></p></details>':'')
  +'<div class="adbs" style="margin:0"><button class="ab" type="button" data-b90="one" data-id="'+X(k.id)+'"'+(B90.busy?' disabled':'')+'>فحص هذا فقط</button>'+(k.go?'<button class="ab" type="button" data-b90="go" data-id="'+X(k.id)+'">فتح القسم المرتبط</button>':'')+'</div></div>'}
function b90draw(){var l=E('b90l');if(!l)return;var C={ok:0,conf:0,rev:0,na:0,none:0};B90K.forEach(function(k){var r=B90.R[k.id];C[r?r.st:'none']++});
 E('b90s').innerHTML='<div class="adk"><div>سليم<b>'+C.ok+'</b></div><div>مشكلة مؤكدة<b>'+C.conf+'</b></div><div>يحتاج مراجعة<b>'+C.rev+'</b></div><div>تعذّر التحقق<b>'+C.na+'</b></div><div>لم يُفحص بعد<b>'+C.none+'</b></div></div><p class="adE" style="padding:6px 0;text-align:start">الأرقام أعلاه عدد الفحوصات لا عدد السجلات. آخر تشغيل كامل: '+X(b90tm(B90.at))+(B90.busy?' · جارٍ الفحص…':'')+'</p>';
 var v=b90vis();l.innerHTML=v.length?v.map(b90card).join(''):'<p class="adE">لا توجد فحوصات مطابقة للبحث أو الفلتر.</p>'}
function b90one(k){var g=B90.g;return Promise.resolve().then(function(){return k.run()}).catch(function(e){return b90na('تعذّر تنفيذ الفحص: '+b90em(e))}).then(function(r){if(g!==B90.g)return;B90.R[k.id]=r;b90draw()})}
function b90runAll(list,full){var g=++B90.g;B90.C={};B90.K={};B90.busy=1;b90draw();
 return list.reduce(function(p,k){return p.then(function(){if(g!==B90.g)return;return b90one(k)})},Promise.resolve()).then(function(){if(g!==B90.g)return;B90.busy=0;if(full)B90.at=Date.now();b90draw()})}
function b90Page(){
 if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>مركز سلامة البيانات</h2><p class="adE">هذه الصفحة للمدير العام فقط.</p>';return}
 if(!sbc()){er('الاتصال بـ Supabase غير جاهز، فلا يمكن إجراء أي فحص (تعذّر التحقق).',b90Page);return}
 var o=function(m,v,all){return'<option value="">'+all+'</option>'+Object.keys(m).map(function(k){return'<option value="'+X(k)+'"'+(k===v?' selected':'')+'>'+X(m[k])+'</option>'}).join('')},f=B90.f,ref=Object.keys(B90T).map(function(t){return'<li><bdi dir="ltr">'+X(t)+'</bdi>: <bdi dir="ltr">'+X(B90T[t].c)+'</bdi></li>'}).join('');
 E('adm').innerHTML='<h2>مركز التحقق من سلامة البيانات وتكامل الأنظمة '+b90pill('na','B90 · قراءة فقط')+'</h2>'
 +'<p class="b89n"><b>ما الذي يثبته هذا المركز؟</b> نتائج استعلامات قراءة حقيقية تُنفَّذ عند الضغط على «تشغيل» فقط وبصلاحية حسابك الحالي. لا يعدّل ولا يحذف ولا يصلح أي سجل، ولا توجد أرقام تجريبية. «سليم» لا تظهر إلا إذا قُرئ الجدول كاملاً ولم تُوجد مخالفة؛ وإن تعذّر الاتصال أو القراءة تظهر «تعذّر التحقق». السجل اليتيم يُصنَّف «يحتاج مراجعة» لا «مؤكدة» لأن RLS قد تخفي الجدول الأب عن الإدارة؛ و«مؤكدة» تقتصر على تناقض داخلي في الجدول نفسه (تكرار صريح، مسار فارغ).</p>'
 +'<div class="adbs" style="margin:6px 0 12px"><button class="ab pr" type="button" data-b90="all">تشغيل كل الفحوصات</button><button class="ab" type="button" data-b90="stop">إيقاف</button></div>'
 +'<div class="b87f"><input id="b90q" type="search" placeholder="بحث بالاسم أو الوصف أو المعرّف" value="'+X(f.q)+'" aria-label="بحث"><select id="b90gr" aria-label="نوع البيانات">'+o(B90G,f.gr,'كل أنواع البيانات')+'</select><select id="b90st" aria-label="نتيجة الفحص">'+o(B90S,f.st,'كل النتائج')+'</select></div>'
 +'<div id="b90s"></div><div id="b90l"></div>'
 +'<details class="b89n"><summary>ما لا يغطيه المركز، والأعمدة المقروءة</summary><p>لم تُنفَّذ: وجود ملفات Storage فعلياً، وحالات الدفع مقابل سير العمل، وعلاقات لم يثبت جدولها الأب من الملف (مثل request_offers وparts_offers.supplier_id)، وتطابق حالة نشاط مع حالة خدماته. الفحص يقرأ حتى '+B90.CAP+' سجل لكل جدول؛ ما زاد يُعلَّم «فحص جزئي». الأعمدة التالية مأخوذة من استخدامها في الواجهة، لا من مخطط قاعدة البيانات (لا ملفات SQL متاحة):</p><ul>'+ref+'</ul></details>';
 b90draw()}
document.addEventListener('click',function(e){var b=e.target.closest('#adm [data-b90]');if(!b)return;var k=b.dataset.b90;
 if(k==='all')return b90runAll(B90K,true);
 if(k==='stop'){B90.g++;B90.busy=0;b90draw();return}
 var c=B90K.filter(function(x){return x.id===b.dataset.id})[0];if(!c)return;
 if(k==='one'){B90.C={};B90.K={};B90.busy=1;b90draw();var g=B90.g;return b90one(c).then(function(){if(g===B90.g){B90.busy=0;b90draw()}})}
 if(k==='go'&&c.go){if(c.go.t){var n=document.querySelector('#adsub button[data-t="'+c.go.t+'"]');if(n)n.click()}else if(c.go.h)location.hash=c.go.h}});
document.addEventListener('input',function(e){if(e.target&&e.target.id==='b90q'){B90.f.q=e.target.value;b90draw()}});
document.addEventListener('change',function(e){var t=e.target;if(!t)return;if(t.id==='b90gr'){B90.f.gr=t.value;b90draw()}if(t.id==='b90st'){B90.f.st=t.value;b90draw()}});

/* ===== B91: مركز جاهزية النسخ الاحتياطي والتعافي. قراءة فقط: لا ينشئ نسخاً ولا يستعيد ولا يعدّل Supabase أو Netlify ولا يكتب في أي جدول. النسخ الاحتياطية لا يمكن قراءتها من المتصفح، لذا لا يُعرض شيء كمؤكد إلا بدليل يُدخله المدير يدوياً (يُحفظ في هذا المتصفح فقط)، وما تقيسه الصفحة بنفسها (اتصال، أعداد مرئية، قابلية قراءة الحاويات) لا يثبت وجود نسخة. ===== */
var B91={K:'bahr_b91_v1',S:null,P:{run:0,busy:0,cnt:{},bk:{},at:null},IT:[["c1", "تفعيل النسخ الاحتياطي لقاعدة البيانات", 1, "Supabase: Database ثم Backups. المطلوب أن ترى قائمة نسخ فعلية لمشروعك.", "اكتب اسم الخطة أو ما تراه في صفحة Backups."], ["c2", "آخر نسخة قاعدة بيانات مؤكدة (تاريخها)", 1, "في صفحة Backups انظر تاريخ أحدث نسخة وحالتها.", "اكتب التاريخ الظاهر وحالة النسخة."], ["c3", "مدة الاحتفاظ بالنسخ", 0, "في صفحة Backups أو تفاصيل الخطة.", "اكتب مدة الاحتفاظ كما تظهر لك."], ["c4", "PITR أو قبول فقدان حتى 24 ساعة (RPO)", 0, "Database ثم Backups ثم Point in Time.", "اكتب هل PITR مفعّل أم قررت قبول النسخ اليومية."], ["c5", "نسخ ملفات Storage منفصلة عن قاعدة البيانات", 1, "نسخ قاعدة البيانات لا تشمل ملفات Storage: يلزم تنزيل أو نسخ الحاويات الست بطريقة مستقلة.", "اكتب أين نُسخت الملفات ومتى وكم ملفاً."], ["c6", "نسخة من ملفات الموقع خارج Netlify", 0, "احتفظ بـ index.html وأصوله (فيديو وصور) في مكان آخر.", "اكتب أين تحفظها وتاريخ آخر نسخة."], ["c7", "توثيق إعدادات المنصة (Auth، SQL، السياسات)", 1, "ملفات SQL المنفَّذة وإعدادات Auth وروابط التوجيه، دون كتابة أي مفتاح.", "اكتب أين هي الوثيقة ومتى حُدّثت."], ["c8", "حماية الوصول إلى النسخ والحسابات", 0, "التحقق بخطوتين وقائمة من يملك الوصول.", "اكتب ما فعلته دون ذكر كلمات مرور."], ["c9", "اختبار استعادة في بيئة منفصلة", 1, "استعادة تجريبية في مشروع اختبار، لا الإنتاج.", "اكتب تاريخ الاختبار ونتيجته."], ["c10", "خطة استعادة موثقة ويمكن الوصول إليها عند تعطل الموقع", 1, "احفظ الخطة (ملف md المرفق) خارج الموقع.", "اكتب أين تحفظ الخطة."], ["c11", "لا توجد بيانات اعتماد أو إعدادات مفقودة تمنع الاستعادة", 0, "من يملك الدخول إلى Supabase وNetlify والنطاق والبريد؟", "اكتب من يملكها دون ذكر أي سر."]],RC:[["c1", "فعّل النسخ اليومية في Supabase (قد تتطلب خطة مدفوعة) وتأكد من ظهور نسخة فعلية."], ["c5", "رتّب نسخاً مستقلاً لملفات Storage، فهي لا تدخل ضمن نسخ قاعدة البيانات."], ["c9", "نفّذ اختبار استعادة في مشروع اختبار منفصل، وهو الدليل الوحيد على أن النسخ تصلح."], ["c10", "احفظ خطة الاستعادة خارج الموقع (ملف md المرفق)."], ["c7", "وثّق إعدادات Auth وملفات SQL المنفَّذة وسياسات Storage."], ["c2", "سجّل تاريخ آخر نسخة مؤكدة وراجعه دورياً."], ["c4", "قرّر RPO/RTO وهل تحتاج PITR."], ["c3", "دوّن مدة الاحتفاظ."], ["c6", "احفظ نسخة من index.html وأصوله خارج Netlify."], ["c8", "فعّل التحقق بخطوتين وراجع من لديه الوصول."], ["c11", "دوّن من يملك كل وصول، مع بديل."]],CT:[["حسابات المستخدمين", ["profiles", "b74_suspensions", "b74_deletion_requests", "notification_preferences"]], ["الإعلانات وصورها", ["listings", "listing_images", "favorites", "listing_price_history", "saved_searches"]], ["الأنشطة التجارية", ["biz_profiles", "biz_private", "biz_reviews", "reports"]], ["الطلبات والعروض", ["buyer_requests", "buyer_request_offers", "service_requests", "request_offers", "request_events", "service_request_log", "service_request_notes"]], ["المحادثات والإشعارات", ["connect_conversations", "connect_messages", "connect_blocks", "connect_reports", "notifications", "contact_messages"]], ["BAHR PARTS", ["parts_items", "parts_fitment", "parts_offers", "parts_offer_history", "parts_manufacturers", "parts_models", "parts_suppliers", "parts_supplier_requests", "parts_suggestions"]], ["الخدمات", ["marine_services", "service_categories"]], ["إعدادات المنصة وسجلات الإدارة", ["b72_settings", "b59_site", "b59_faq", "b59_pages", "b55_settings", "admin_activity", "b72_audit", "b74_audit", "b61_audit", "biz_audit", "parts_audit", "b57_events"]], ["المدفوعات وإثباتاتها", ["b55_packages", "b55_wallets", "b55_payments", "b55_ledger"]], ["الدعم", ["b57_tickets", "b57_messages", "b57_ratings"]]],BK:[["listing-images", "صور الإعلانات"], ["avatars", "صور الحسابات"], ["b55-proofs", "إثباتات الدفع (خاصة)"], ["b57-files", "ملفات الدعم"], ["request-images", "صور الطلبات"], ["service-images", "صور الخدمات"]],PL:[["1) ما الذي يجب نسخه احتياطياً", ["قاعدة البيانات (Postgres): كل الجداول المعروضة في قسم «تغطية البيانات» (حسابات، إعلانات، أنشطة، طلبات وعروض، محادثات وإشعارات، قطع الغيار، خدمات، إعدادات وسجلات إدارة، مدفوعات).", "ملفات Storage (منفصلة عن قاعدة البيانات): listing-images وavatars وb55-proofs وb57-files وrequest-images وservice-images. نسخ قاعدة بيانات Supabase لا تشمل ملفات Storage، بل بياناتها الوصفية فقط، حسب وثائق Supabase.", "ملفات الموقع: index.html وأصوله (الفيديو الافتتاحي والصور والشعار) كنسخة خارج Netlify.", "إعدادات المنصة غير الموجودة في الجداول: إعدادات Auth وروابط إعادة التوجيه والبريد، وسياسات RLS والدوال (ملفات SQL التي نُفّذت)، وسياسات Storage، وإعدادات Netlify (النطاقات والمتغيرات) موثقة دون كتابة أي مفتاح سري."]], ["2) كيف تتأكد من اكتمال النسخة وسلامتها", ["من لوحة Supabase: Database ثم Backups: تأكد أن آخر نسخة موجودة وحالتها سليمة وتاريخها حديث.", "سجّل أعداد السجلات لكل جدول من قسم «تغطية البيانات» قبل أي استعادة، وقارنها بعد الاستعادة.", "لأي ملف تصدير (SQL أو أرشيف): سجّل حجمه وبصمته (checksum) وافتح عينة منه في بيئة اختبار.", "لملفات Storage: قارن عدد الملفات في كل حاوية بعدد سجلاتها في قاعدة البيانات (مثل listing_images)."]], ["3) حماية النسخ من الوصول غير المصرح به", ["فعّل التحقق بخطوتين لحسابات Supabase وNetlify، وقلّل عدد من لديهم صلاحية لوحة التحكم.", "خزّن ملفات التصدير في مكان مشفّر أو محمي بكلمة مرور، ولا ترسلها بالبريد أو المحادثات.", "لا تضع service_role أو أي مفتاح سري في index.html ولا في ملاحظات هذه الصفحة.", "اعتبر نسخ قاعدة البيانات بيانات خاصة: فيها حسابات ومحادثات وإثباتات دفع."]], ["4) تحديد آخر نقطة زمنية يمكن الاستعادة إليها", ["النسخ اليومية تعطي نقطة استعادة ثابتة كل يوم (فقدان محتمل حتى 24 ساعة). إضافة PITR تسمح بالاستعادة لأي لحظة ضمن مدة الاحتفاظ.", "تحقق من لوحة Supabase: هل PITR مفعّل؟ وما مدة الاحتفاظ في خطتك؟ هذه الصفحة لا تستطيع قراءتها.", "قرّر مقدار فقدان البيانات المقبول (RPO) والزمن المقبول لعودة الخدمة (RTO) ودوّنهما."]], ["5) خطوات الاستعادة إلى بيئة اختبار منفصلة", ["لا تجرِّب الاستعادة على مشروع الإنتاج: استعادة نسخة من لوحة التحكم تستبدل بيانات المشروع نفسه.", "أنشئ مشروع Supabase جديداً للاختبار، واستعد إليه نسخة منطقية أو الميزة المتاحة في خطتك (تحقق من لوحة التحكم).", "أعد رفع ملفات Storage إلى حاويات المشروع الاختباري بنفس الأسماء والمسارات.", "اربط نسخة من index.html بعنوان ومفتاح المشروع الاختباري فقط (anon)، ولا تستخدم مفاتيح الإنتاج.", "طبّق نفس ملفات SQL (الجداول والسياسات والدوال) إن لم تأتِ مع النسخة، بموافقتك وفي الاختبار فقط."]], ["6) التحقق من العلاقات بين الجداول والملفات بعد الاستعادة", ["قارن أعداد الجداول بما سجّلته قبل الاستعادة.", "شغّل «مركز سلامة البيانات B90» على المشروع الاختباري: سجلات يتيمة وتكرارات.", "افتح عينة من الإعلانات وتأكد أن صورها تظهر (storage_path يقابل ملفاً موجوداً).", "جرّب تسجيل الدخول بحساب اختبار وصلاحيات المدير وسياسات RLS (مستخدم عادي لا يرى بيانات غيره)."]], ["7) العودة إلى الحالة السابقة إذا فشلت الاستعادة", ["قبل أي استعادة إنتاجية: خذ نسخة جديدة وسجّل الأعداد، وفعّل وضع الصيانة من إعدادات المنصة (B72).", "لا تحذف المشروع القديم قبل نجاح التحقق؛ ولا تحذف أي نسخة قديمة.", "عند الفشل: أعد الاستعادة من النسخة التي أخذتها قبل البدء، أو أعد توجيه الموقع لمشروع الاختبار السليم إن لزم.", "للموقع نفسه: أعد نشر النسخة السابقة من Netlify (سجل النشرات) أو من نسختك الخارجية."]], ["8) المسؤوليات والقرارات قبل الاستعادة الإنتاجية", ["صاحب المنصة: يقرر الاستعادة ونقطة الزمن المقبولة كتابياً قبل التنفيذ.", "من يملك صلاحية Supabase وNetlify: يحدَّد بالاسم، مع بديل في حال غيابه.", "قرار مكتوب: ما البيانات التي ستُفقد بين نقطة الاستعادة والحاضر، وكيف يُبلَّغ المستخدمون.", "بعد العودة: راجع النتائج وسجّل ما حدث وما يلزم تحسينه."]]]};
var B91ST={ok:['ok','متحقق منه (بإقرار المدير)'],unv:['na','غير متحقق منه'],setup:['warn','يحتاج إعداداً'],adm:['bad','يحتاج تدخلاً إدارياً']};
function b91load(){if(B91.S)return B91.S;var s={};try{s=JSON.parse(localStorage.getItem(B91.K)||'{}')||{}}catch(e){s={}}return B91.S=s}
function b91save(){try{localStorage.setItem(B91.K,JSON.stringify(B91.S));return true}catch(e){return false}}
var B91SEC=/eyJ[A-Za-z0-9_-]{10,}|sb_secret|service_?role|\bsk_[a-z0-9]{10,}|(pass(word)?|pwd|secret|token|api_?key)\s*[:=]\s*\S{4,}|postgres(ql)?:\/\/\S+:\S+@/i;
function b91age(d){var t=Date.parse(d);return isNaN(t)?null:Math.floor((Date.now()-t)/864e5)}
function b91state(it){var r=b91load()[it[0]]||{};if(!r.v)return{s:'adm',n:'لم يُسجَّل أي دليل بعد.'};
 if(r.v==='no')return{s:'setup',n:'أقررتَ أن هذا غير متوفر.'};if(r.v==='unk')return{s:'unv',n:'أقررتَ أنك لا تعرف.'};
 var e=String(r.e||'').trim(),a=b91age(r.d);
 if(!r.d||isNaN(Date.parse(r.d))||e.length<10)return{s:'adm',n:'الإقرار ناقص: يلزم تاريخ ووصف للدليل (10 أحرف على الأقل).'};
 if(a!=null&&a<0)return{s:'adm',n:'التاريخ في المستقبل.'};
 if(it[0]==='c2'&&a>7)return{s:'setup',n:'النسخة عمرها '+a+' يوماً: أقدم من أسبوع.'};
 return{s:'ok',n:'تاريخ الدليل: '+r.d+(a!=null?' (قبل '+a+' يوماً)':'')+'. هذا إقرار منك لم تتحقق الصفحة منه.'}}
function b91itemCard(it){var st=b91state(it),r=b91load()[it[0]]||{},p=B91ST[st.s];
 return'<div class="adrc" data-b91i="'+it[0]+'"><div><b>'+X(it[1])+'</b> '+b91pill(p)+(it[2]?' <small>(بند حرج)</small>':'')+'</div>'
 +'<small>'+X(st.n)+'</small>'
 +'<details><summary>كيف تتحقق؟</summary><p class="b89n" style="margin:6px 0">'+X(it[3])+'<br>'+X(it[4])+'</p></details>'
 +'<div class="b87f"><select data-f="v" aria-label="الإقرار"><option value="">لم يُفحص</option><option value="yes"'+(r.v==='yes'?' selected':'')+'>نعم، وعندي دليل</option><option value="no"'+(r.v==='no'?' selected':'')+'>لا، غير متوفر</option><option value="unk"'+(r.v==='unk'?' selected':'')+'>لا أعرف</option></select><input type="date" data-f="d" value="'+X(r.d||'')+'" aria-label="تاريخ الدليل"></div>'
 +'<textarea data-f="e" maxlength="400" placeholder="وصف الدليل (دون كلمات مرور أو مفاتيح)">'+X(r.e||'')+'</textarea>'
 +'<div class="adbs" style="margin:0"><button class="ab pr" type="button" data-b91="save" data-id="'+it[0]+'">حفظ الإقرار</button></div></div>'}
function b91pill(p){return'<span class="b88p b88p-'+p[0]+'">'+X(p[1])+'</span>'}
function b91verdict(){var cr=B91.IT.filter(function(i){return i[2]}),ok=cr.filter(function(i){return b91state(i).s==='ok'}).length,all=ok===cr.length,c2=b91state(B91.IT[1]),r2=b91load().c2||{},c9=b91state(B91.IT[8]),r9=b91load().c9||{};
 return'<div class="adrc"><div><b>الحكم العام</b> '+b91pill(all?B91ST.ok:B91ST.adm)+'</div><p style="margin:0">'+(all?'كل البنود الحرجة مُقرّ بها بدليل. هذا لا يعني أن الصفحة تحققت من النسخ؛ الحكم قائم على إقراراتك.':'غير جاهز للتعافي: '+ok+' من '+cr.length+' بنود حرجة فقط لها دليل.')+'</p>'
 +'<small><b>هل توجد نسخة احتياطية حقيقية مؤكدة؟</b> '+(c2.s==='ok'||c2.s==='setup'&&r2.d?'بإقرار المدير بتاريخ '+X(r2.d)+'، ولم تتحقق الصفحة منها.':'لا يوجد دليل.')+'<br><b>هل اختُبرت الاستعادة في بيئة منفصلة؟</b> '+(c9.s==='ok'?'بإقرار المدير بتاريخ '+X(r9.d)+'.':'لا يوجد دليل.')+'</small></div>'}
function b91recs(){var m={};B91.IT.forEach(function(i){m[i[0]]=i});var L=B91.RC.filter(function(r){return b91state(m[r[0]]).s!=='ok'});
 return L.length?'<ol style="margin:0;padding-inline-start:20px">'+L.map(function(r){return'<li style="margin:6px 0">'+X(r[1])+'</li>'}).join('')+'</ol>':'<p class="adE">لا توصيات: كل البنود مُقرّ بها بدليل.</p>'}
function b91live(){var P=B91.P,t=0,ok=0,bad=0,rows=[];
 B91.CT.forEach(function(c){c[1].forEach(function(n){t++;if(P.cnt[n]!==undefined){if(P.cnt[n]===null)bad++;else ok++}})});
 var bk=B91.BK.map(function(b){var r=P.bk[b[0]];return'<li><bdi dir="ltr">'+X(b[0])+'</bdi> ('+X(b[1])+'): '+(r===undefined?'لم يُفحص':r?'قابلة للقراءة':'تعذّرت القراءة')+'</li>'}).join('');
 var row=function(n,p,d){return'<tr><td>'+n+'</td><td>'+b91pill(p)+'</td><td>'+d+'</td></tr>'};
 return'<div class="adtw"><table class="adt"><thead><tr><th>العنصر</th><th>الحالة</th><th>التفاصيل</th></tr></thead><tbody>'
 +row('اتصال Supabase',sbc()?B91ST.ok:B91ST.unv,sbc()?'العميل جاهز في هذه الجلسة.':'غير جاهز.')
 +row('صلاحية المدير العام',(AD.roles||[]).indexOf('platform_admin')>-1?B91ST.ok:B91ST.unv,'من أدوار الحساب الحالي.')
 +row('قراءة الجداول المرئية',P.run?(bad?B91ST.setup:B91ST.ok):B91ST.unv,P.run?ok+' من '+t+' جدولاً قابلاً للعدّ'+(bad?'، و'+bad+' غير متاح (غير موجود أو RLS)':''):'لم يُشغَّل القياس بعد.')
 +row('قراءة حاويات Storage',Object.keys(P.bk).length?(B91.BK.every(function(b){return P.bk[b[0]]})?B91ST.ok:B91ST.setup):B91ST.unv,'القابلية للقراءة لا تثبت وجود نسخة احتياطية.')
 +row('وجود نسخ قاعدة البيانات',B91ST.unv,'لا يمكن قراءتها من المتصفح؛ تُراجع في لوحة Supabase.')
 +row('نسخ ملفات Storage',B91ST.unv,'منفصلة عن نسخ قاعدة البيانات ولا تُقرأ من هنا.')
 +row('نشرات Netlify والموقع',B91ST.unv,'لا اتصال بـ Netlify من الصفحة.')
 +'</tbody></table></div><details><summary>حالة الحاويات</summary><ul>'+bk+'</ul></details><small>آخر قياس: '+X(b90tm(P.at))+'</small>'}
function b91inv(){var P=B91.P;return B91.CT.map(function(c){var tot=0,miss=0;var rows=c[1].map(function(n){var v=P.cnt[n];if(typeof v==='number')tot+=v;else if(v===null)miss++;return'<li><bdi dir="ltr">'+X(n)+'</bdi>: <b>'+(v===undefined?'لم يُقَس':v===null?'غير متاح':Number(v).toLocaleString('en-US'))+'</b></li>'}).join('');
 return'<details class="b89n"><summary>'+X(c[0])+(P.run?' · '+tot.toLocaleString('en-US')+' سجلاً مرئياً'+(miss?' ('+miss+' جدول غير متاح)':''):'')+'</summary><ul>'+rows+'</ul></details>'}).join('')}
function b91plan(){return B91.PL.map(function(s){return'<details class="b89n"><summary>'+X(s[0])+'</summary><ul>'+s[1].map(function(x){return'<li style="margin:4px 0">'+X(x)+'</li>'}).join('')+'</ul></details>'}).join('')}
function b91draw(){if(!E('b91w'))return;E('b91v').innerHTML=b91verdict();E('b91t').innerHTML=B91.IT.map(b91itemCard).join('');E('b91r').innerHTML=b91recs();E('b91a').innerHTML=b91live();E('b91c').innerHTML=b91inv()}
function b91measure(){var P=B91.P;if(P.busy)return;P.busy=1;P.cnt={};P.bk={};E('b91a').innerHTML='<p class="adE">جارٍ القياس…</p>';var all=[];B91.CT.forEach(function(c){c[1].forEach(function(n){all.push(n)})});
 var c=sbc(),i=0;function nx(){var b=all.slice(i,i+6);i+=6;if(!b.length)return Promise.resolve();return Promise.all(b.map(function(n){return b90cnt(n).then(function(r){P.cnt[n]=r.e?null:r.n})})).then(nx)}
 nx().then(function(){return B91.BK.reduce(function(p,b){return p.then(function(){return Promise.resolve(c.storage.from(b[0]).list('',{limit:1})).then(function(r){P.bk[b[0]]=!r.error},function(){P.bk[b[0]]=false})})},Promise.resolve())}).then(function(){P.run=1;P.at=Date.now();P.busy=0;b91draw()},function(){P.busy=0;b91draw()})}
function b91Page(){
 if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>جاهزية النسخ والتعافي</h2><p class="adE">هذه الصفحة للمدير العام فقط.</p>';return}
 b91load();
 E('adm').innerHTML='<div id="b91w"><h2>مركز جاهزية النسخ الاحتياطي والتعافي '+b90pill('na','B91 · قراءة فقط')+'</h2>'
 +'<p class="b89n"><b>ما الذي تثبته هذه الصفحة؟</b> لا تنشئ نسخاً ولا تستعيد شيئاً ولا تغيّر Supabase أو Netlify، ولا تستطيع قراءة النسخ الاحتياطية من المتصفح. لذلك لا يظهر أي بند «متحقق منه» إلا بإقرار تدخله أنت مع تاريخ ووصف دليل، ويُحفظ في هذا المتصفح فقط (ليس في قاعدة البيانات). لا تكتب كلمات مرور أو مفاتيح. نسخ قاعدة بيانات Supabase لا تشمل ملفات Storage، فهي تُحمى بشكل منفصل.</p>'
 +'<div id="b91v"></div><h3>1) قائمة تحقق الجاهزية</h3><div id="b91t"></div><h3>2) التوصيات مرتبة حسب الأولوية</h3><div id="b91r"></div>'
 +'<h3>3) ما تقيسه الصفحة فعلاً</h3><div class="adbs" style="margin:6px 0 10px"><button class="ab pr" type="button" data-b91="run">قياس الجداول والحاويات (قراءة فقط)</button></div><div id="b91a"></div>'
 +'<h3>4) تغطية بيانات BAHR (جداول مأخوذة من استخدام الواجهة)</h3><p class="adE" style="padding:0 0 8px;text-align:start">الأعداد كما يراها حسابك وقد تُقيّدها RLS، ولا تثبت وجود نسخة. قد تكون بعض الأسماء عروضاً لا جداولاً. الصور والمستندات في Storage لا في قاعدة البيانات.</p><div id="b91c"></div>'
 +'<h3>5) خطة الاستعادة الآمنة</h3>'+b91plan()+'</div>';
 b91draw()}
document.addEventListener('click',function(e){var b=e.target.closest('#adm [data-b91]');if(!b)return;var k=b.dataset.b91;
 if(k==='run')return b91measure();
 if(k==='save'){var c=b.closest('[data-b91i]'),id=b.dataset.id,g=function(f){var x=c.querySelector('[data-f="'+f+'"]');return x?x.value:''},t=g('e').trim();
  if(B91SEC.test(t)){msg('الوصف يبدو كأنه يحوي كلمة مرور أو مفتاحاً. احذفه ولا تكتب أسراراً هنا.',false);return}
  var S=b91load();S[id]={v:g('v'),d:g('d'),e:t,at:Date.now()};if(!b91save()){msg('تعذّر الحفظ في هذا المتصفح.',false);return}b91draw();msg('حُفظ الإقرار في هذا المتصفح فقط.',true)}});

/* B77: مراقبة الجودة والأخطاء (b77_errors.sql). للمشرف العام فقط؛ الحماية الفعلية في دوال الخادم (is_admin) لا في إخفاء الزر */
var QS={new:'جديد',in_progress:'قيد المعالجة',fixed:'تم الإصلاح',closed:'مغلق'},QK={network:'اتصال/شبكة',server:'خطأ خادم',request:'طلب مرفوض',denied:'صلاحيات',config:'ميزة غير مفعّلة على الخادم',client:'خطأ في الواجهة'},QA={listings:'الإعلانات',account:'الحساب',upload:'رفع الملفات',support:'الدعم',chat:'المحادثات',parts:'قطع الغيار',services:'الخدمات',admin:'الإدارة',reports:'البلاغات',other:'أخرى'},QF={s:'',k:'',a:'',d:'7',q:''},QO=0,QL=[];
function qaEm(e){var c=e&&e.code||'',m=String(e&&e.message||'');if(c==='42883'||c==='PGRST202'||c==='42P01'||c==='PGRST205')return 'نظام مراقبة الأخطاء غير مفعّل على الخادم بعد (يلزم تنفيذ b77_errors.sql).';if(m.indexOf('forbidden')>-1)return 'ما عندك صلاحية لهذا القسم.';if(/Failed to fetch|network/i.test(m))return 'انقطع الاتصال. تحقق من الإنترنت وأعد المحاولة.';return 'تعذّر تحميل البيانات. حاول مرة ثانية.'}
function qaSel(id,o,v,all){return '<select id="'+id+'" class="adq">'+'<option value="">'+all+'</option>'+Object.keys(o).map(function(k){return '<option value="'+k+'"'+(k===v?' selected':'')+'>'+X(o[k])+'</option>'}).join('')+'</select>'}
function qaTop(a,L){return (a&&a.length)?a.map(function(x){return X(L[x.k]||x.k)+': <b>'+Number(x.n).toLocaleString('en-US')+'</b>'}).join(' · '):'—'}
function qaRow(e){var d='<div class="adrc"><div><b dir="ltr">'+X(e.ref)+'</b> <span class="bd">'+X(QS[e.state]||e.state)+'</span> <small>'+X(QK[e.kind]||e.kind)+' · '+X(QA[e.area]||e.area)+' · الصفحة: <span dir="ltr">'+X(e.page||'')+'</span></small></div>'
 +'<div><small>مرات الحدوث: <b>'+Number(e.cnt).toLocaleString('en-US')+'</b>'+(e.reopened>0?' · <b>أُعيد ظهورها بعد الإصلاح '+e.reopened+' مرة</b>':'')+' · أول مرة: '+fd(e.first_seen)+' · آخر مرة: '+fd(e.last_seen)+(e.fixed_at?' · أُصلحت: '+fd(e.fixed_at):'')+'</small></div>'
 +'<details><summary>التفاصيل التقنية الآمنة</summary><p dir="ltr" style="white-space:pre-wrap;text-align:left"><small>'+X(e.op||'')+(e.status_code?' · HTTP '+e.status_code:'')+'\n'+X(e.message||'')+'\n'+X(e.device||'')+' · '+X(e.viewport||'')+' · '+X(e.app_ver||'')+'</small></p></details>'
 +'<textarea data-qn="'+e.id+'" maxlength="1000" placeholder="ملاحظة إدارية">'+X(e.admin_note||'')+'</textarea><textarea data-qf="'+e.id+'" maxlength="1000" placeholder="وصف الإصلاح">'+X(e.fix_note||'')+'</textarea>'
 +'<div class="adbs" style="margin:0">'+qaSel('qs-'+e.id,QS,e.state,'الحالة').replace('<option value="">الحالة</option>','')+'<input class="adq" id="qt-'+e.id+'" inputmode="numeric" dir="ltr" style="max-width:150px" placeholder="رقم تذكرة BH" value="'+(e.ticket_num==null?'':X(e.ticket_num))+'"><button class="ab pr" data-qa="save" data-id="'+e.id+'">حفظ</button></div></div>';return d}
function qaPage(){ld();var c=sbc(),d=parseInt(QF.d,10)||0;QO=0;
 Promise.all([c.rpc('b77_admin_stats',{p_days:d}),c.rpc('b77_admin_list',{p_state:QF.s||null,p_kind:QF.k||null,p_area:QF.a||null,p_days:d,p_q:QF.q||null,p_limit:20,p_offset:0})]).then(function(a){if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;var s=a[0].data||{},L=a[1].data||[];QL=L;
  E('adm').innerHTML='<h2>مراقبة الجودة والأخطاء</h2><div class="adrc"><small>الإجمالي: <b>'+Number(s.total||0).toLocaleString('en-US')+'</b> · جديدة: <b>'+(s.new||0)+'</b> · قيد المعالجة: <b>'+(s.in_progress||0)+'</b> · تم الإصلاح: <b>'+(s.fixed||0)+'</b> · مغلقة: <b>'+(s.closed||0)+'</b> · عادت بعد الإصلاح: <b>'+(s.reopened||0)+'</b><br>أكثر الأنواع: '+qaTop(s.top_kinds,QK)+'<br>أكثر الأقسام: '+qaTop(s.top_areas,QA)+'<br>أكثر الصفحات: '+qaTop(s.top_pages,{})+'</small></div>'
  +'<div class="adbs" style="margin:10px 0"><input class="adq" id="qq" dir="ltr" placeholder="الرقم المرجعي ERR-…" value="'+X(QF.q)+'">'+qaSel('qfs',QS,QF.s,'كل الحالات')+qaSel('qfk',QK,QF.k,'كل الأنواع')+qaSel('qfa',QA,QF.a,'كل الأقسام')+qaSel('qfd',{1:'آخر 24 ساعة',7:'آخر 7 أيام',30:'آخر 30 يوماً'},QF.d,'كل الفترات')+'<button class="ab pr" data-qa="filter">بحث</button></div>'
  +(L.length?'<div id="qlist">'+L.map(qaRow).join('')+'</div>'+(Number(L[0].total)>L.length?'<p><button class="ab" data-qa="more">تحميل المزيد</button></p>':''):'<p class="adE">لا توجد أخطاء مسجّلة ضمن هذه الفلاتر.</p>');
 }).catch(function(e){er(qaEm(e),qaPage)})}
document.addEventListener('click',function(e){var b=e.target.closest('#adm [data-qa]');if(!b)return;var k=b.dataset.qa,c=sbc();
 if(k==='filter'){QF={s:E('qfs').value,k:E('qfk').value,a:E('qfa').value,d:E('qfd').value,q:E('qq').value.trim()};return qaPage()}
 if(k==='more'){QO+=20;b.disabled=true;return c.rpc('b77_admin_list',{p_state:QF.s||null,p_kind:QF.k||null,p_area:QF.a||null,p_days:parseInt(QF.d,10)||0,p_q:QF.q||null,p_limit:20,p_offset:QO}).then(function(r){if(r.error)throw r.error;E('qlist').insertAdjacentHTML('beforeend',(r.data||[]).map(qaRow).join(''));if((r.data||[]).length<20)b.remove();else b.disabled=false}).catch(function(x){b.disabled=false;QO-=20;msg(qaEm(x),false)})}
 if(k==='save'){var id=b.dataset.id,tn=E('qt-'+id).value.trim();if(tn&&!/^\d{1,12}$/.test(tn))return msg('رقم التذكرة أرقام فقط (مثال: 12 لـ BH-00012).',false);b.disabled=true;
  c.rpc('b77_admin_set',{p_id:id,p_state:E('qs-'+id).value,p_admin_note:document.querySelector('[data-qn="'+id+'"]').value.trim()||null,p_fix_note:document.querySelector('[data-qf="'+id+'"]').value.trim()||null,p_ticket_num:tn?parseInt(tn,10):null}).then(function(r){b.disabled=false;if(r.error)throw r.error;msg('حُفظت التغييرات.',true)}).catch(function(x){b.disabled=false;msg(qaEm(x),false)})}});
function monitor(){ld();var T=['listings','biz_profiles','parts_offers','parts_items','service_requests','reports','connect_conversations','notifications','marine_services'],RP=['is_admin','admin_stats','admin_list_users'];
 Promise.all(T.map(function(t){return cnt(t).then(function(n){return{n:t,k:'جدول',ok:1,i:n+' سجل مرئي'}},function(e){return{n:t,k:'جدول',ok:0,i:e.code||e.message||'خطأ'}})}).concat(RP.map(function(f){return sbc().rpc(f).then(function(r){return r.error?{n:f,k:'دالة',ok:0,i:r.error.code||r.error.message}:{n:f,k:'دالة',ok:1,i:'تعمل'}},function(e){return{n:f,k:'دالة',ok:0,i:e.message}})}))).then(function(a){var bad=a.filter(function(x){return !x.ok}).length;
  E('adm').innerHTML='<h2>مراقبة حالة الوظائف والتكاملات</h2><p class="adE" style="padding:0 0 10px;text-align:start">فحص حقيقي لحظي بصلاحيتك الحالية: «متاح» تعني أن الاستعلام نجح. فشل الاستعلام قد يعني أن الجدول غير موجود أو أن RLS تمنع الإدارة منه. لا يشمل الفحص التخزين ولا البريد.</p><p><b>'+(bad?bad+' من '+a.length+' غير متاح':'كل الفحوصات ناجحة')+'</b></p><div id="adth"></div>';
  tbl(E('adth'),[{k:'n',t:'العنصر',h:function(x){return '<bdi>'+X(x.n)+'</bdi>'}},{k:'k',t:'النوع'},{k:'ok',t:'الحالة',h:function(x){return '<span class="bd '+(x.ok?'published':'rejected')+'">'+(x.ok?'متاح':'غير متاح')+'</span>'}},{k:'i',t:'التفاصيل',h:function(x){return '<bdi>'+X(x.i)+'</bdi>'}}],a,{q:false,ps:20})})}
var SK={
 cnt:['المحتوى والصفحات التعريفية والأسئلة الشائعة','لا يوجد جدول محتوى في المنصة؛ الصفحات التعريفية والأسئلة الشائعة مكتوبة داخل index.html.','جدول محتوى ودوال نشر محمية بصلاحية مسؤول المحتوى.'],
 ntf:['الإشعارات (إدارة)','إشعارات المستخدمين موجودة وتُرسل من الخادم لكل مستخدم، لكن لا توجد واجهة إرسال أو إشعارات جماعية للإدارة.','دالة خادم للإرسال المحدود وسجل لمن أُرسل له.'],
 fil:['إدارة الملفات والصور','الصور تُرفع إلى حاويات Storage مثل listing-images وavatars، لكن لا توجد واجهة لإدارتها أو حذف المخالف منها.','دوال خادم لسرد الملفات وحذفها مع تسجيلها في التدقيق.']};


var ROLE_L={listings_reviewer:'مسؤول مراجعة الإعلانات',business_verifier:'مسؤول الأنشطة والتحقق',parts_manager:'مسؤول BAHR PARTS',requests_reports_manager:'مسؤول الطلبات والبلاغات',content_manager:'مسؤول المحتوى',support:'مسؤول الدعم'},
 ROLE_ON=['listings_reviewer','requests_reports_manager','support'],
 ALLOW={dash:'*',ads:['listings_reviewer'],ord5:['requests_reports_manager','support'],com6:['requests_reports_manager','support'],reps:['requests_reports_manager','support'],trust:['listings_reviewer','requests_reports_manager','support'],cnt:['content_manager']};
function myRoles(){var c=sbc();return c.rpc('admin_my_roles').then(function(r){if(!r.error)return r.data||[];return c.rpc('is_admin').then(function(a){return(!a.error&&a.data===true)?['platform_admin']:[]})})}
function canSee(t,isLink){var R0=AD.roles||[];if(R0.indexOf('platform_admin')>-1)return true;if(isLink)return false;var a=ALLOW[t];return a==='*'||!!(a&&a.some(function(x){return R0.indexOf(x)>-1}))}
function filterNav(){var vis={};[].forEach.call(document.querySelectorAll('#adsub button[data-t],#adsub a'),function(e){var ok=canSee(e.dataset.t,e.tagName==='A');e.style.display=ok?'':'none';if(ok){var g=e.closest('[data-s]');if(g)vis[g.dataset.s]=1}});[].forEach.call(document.querySelectorAll('#adn .ads'),function(b){b.style.display=vis[b.dataset.s]?'':'none'})}
function rolesPage(){ld();if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>الأدوار الإدارية</h2><p class="adE">إدارة الأدوار للمدير العام فقط.</p>';return}
 var c=sbc();Promise.all([c.rpc('admin_list_roles'),c.rpc('admin_list_users')]).then(function(a){if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;
  var RL=a[0].data||[],US=(a[1].data||[]).filter(function(u){return!u.is_admin});
  E('adm').innerHTML='<h2>الأدوار الإدارية</h2><p class="adE" style="padding:0 0 10px;text-align:start">المدير العام هو الحساب الذي <bdi>profiles.role = admin</bdi> ويفتح كل شيء. الأدوار أدناه محدودة وتُفرض في الخادم (RLS ودوال). منح الدور وسحبه للمدير العام فقط ويُسجَّلان في سجل التدقيق.</p>'
   +'<h3>الأدوار المفعّلة</h3><ul><li><b>'+ROLE_L.listings_reviewer+'</b>: قراءة الإعلانات واتخاذ قرارات النشر والرفض والإيقاف.</li><li><b>'+ROLE_L.requests_reports_manager+'</b>: قراءة البلاغات ومعالجتها.</li><li><b>'+ROLE_L.support+'</b>: قراءة البلاغات فقط.</li></ul>'
   +'<p class="b17n">أدوار «الأنشطة والتحقق» و«BAHR PARTS» و«المحتوى»: '+tg('غير مفعّلة بعد')+' لأن دوال قراراتها ما زالت للمدير العام فقط، ولذلك لا يمكن منحها الآن.</p>'
   +'<h3>منح دور</h3><div class="b15h"><select id="rl-u" class="adq" style="max-width:300px"><option value="">اختر مستخدماً</option>'+US.map(function(u){return '<option value="'+X(u.id)+'">'+X((u.full_name||'بدون اسم')+' — '+(u.email||''))+'</option>'}).join('')+'</select><select id="rl-r" class="adq" style="max-width:240px">'+ROLE_ON.map(function(r){return '<option value="'+r+'">'+ROLE_L[r]+'</option>'}).join('')+'</select><button class="ab pr" data-gr="1" type="button">منح</button></div>'
   +'<h3>الأدوار الممنوحة</h3><div id="adth"></div>';
  tbl(E('adth'),[{k:'full_name',t:'المستخدم',h:function(x){return X(x.full_name||'—')+' <bdi>'+X(x.email||'')+'</bdi>'}},{k:'role',t:'الدور',h:function(x){return X(ROLE_L[x.role]||x.role)}},{k:'created_at',t:'التاريخ',h:function(x){return fd(x.created_at)}},{k:'user_id',t:'',s:false,h:function(x){return '<button class="ab no" data-rv="'+X(x.user_id)+'|'+X(x.role)+'" type="button">سحب</button>'}}],RL,{q:false,empty:'لا توجد أدوار ممنوحة.'})
 }).catch(function(e){er('تعذّر تحميل الأدوار: '+(e.message||e)+(/does not exist|PGRST202|42883/.test(String(e.code||e.message))?' — طبّق b25_admin_foundation.sql أولاً.':''),rolesPage)})}
E('ad').addEventListener('click',function(e){var g=e.target.closest('[data-gr]'),v=e.target.closest('[data-rv]');if(!g&&!v)return;var c=sbc(),p,b=g||v;
 if(g){var u=E('rl-u').value;if(!u){msg('اختر المستخدم أولاً.');return}p=c.rpc('admin_grant_role',{p_user:u,p_role:E('rl-r').value})}
 else{if(!confirm('سحب هذا الدور؟'))return;var q=v.dataset.rv.split('|');p=c.rpc('admin_revoke_role',{p_user:q[0],p_role:q[1]})}
 b.disabled=true;p.then(function(r){b.disabled=false;if(r.error){msg('فشلت العملية: '+r.error.message);return}msg(g?'تم منح الدور.':'تم سحب الدور.',1);rolesPage()})});

/* ===== B72: مركز الإعدادات العامة (b72_settings.sql). المدير العام فقط؛ الكتابة عبر دالة خادم تسجّل في b72_audit. لا يكرر B55/B59: يعرض حالتهما ويربط بمحرّريهما.
   B82: صار «إعدادات المنصة» بتبويبات. لا جداول ولا دوال جديدة: نفس مصادر القراءة ونفس دالة حفظ الصيانة، مع قراءة تحقّق من الخادم بعد الحفظ قبل إظهار النجاح ===== */
var H82T='ov',H82B=[['ov','نظرة عامة'],['info','معلومات المنصة'],['home','الواجهة الرئيسية'],['sec','الأقسام والخدمات'],['mt','الصيانة'],['pv','الخصوصية والعرض'],['lg','سجل التغييرات']];
var H82P={
 ov:function(D){var NA='غير متاح',pl=D.site.platform||{},plN=Object.keys(pl).filter(function(k){return String(pl[k]||'').trim()}).length,hid=((D.site.home_sections||{}).hidden||[]).length,pi=(D.S55.data||[]).filter(function(r){return r.key==='payment_instructions'})[0],pk=D.pk.data||[],mv=(!D.M.error&&D.M.data&&D.M.data.value)||{};
  var ST=[{n:'وضع الصيانة',s:D.M.error?NA:(mv.enabled===true?'مفعّل':'متوقف'),l:''},{n:'معلومات المنصة والتواصل',s:D.siteErr?NA:plN+' حقول معبأة',l:'#admcms'},{n:'أقسام الصفحة الرئيسية',s:D.siteErr?NA:(hid?hid+' قسم مخفي':'كل الأقسام ظاهرة'),l:'#admcms'},{n:'تعليمات الدفع',s:D.S55.error?NA:(pi&&String(pi.value||'').trim()?'مكتوبة':'غير مكتوبة'),l:'#admpay'},{n:'الباقات (الأسعار تُعدَّل من الخادم فقط)',s:D.pk.error?NA:pk.length+' باقة، المفعّل '+pk.filter(function(x){return x.is_active}).length,l:'#admpay'},{n:'مراجعة الأنشطة التجارية',s:'يدوية من الإدارة',l:'#admbiz'},{n:'الأمان والمخاطر',s:'قراءة وإجراءات للمدير',l:'#admrisk'},{n:'الدعم الفني',s:'تذاكر الدعم',l:'#admsupport'},{n:'الإشعارات',s:((window.BAHR_CONFIG||{}).vapidPublicKey&&(window.BAHR_CONFIG||{}).pushEnabled===true)?'إشعارات المتصفح مفعّلة':'إشعارات المتصفح غير مفعّلة بعد',l:''}];
  E('b82p').innerHTML='<div id="b72s"></div>';
  tbl(E('b72s'),[{k:'n',t:'الإعداد'},{k:'s',t:'الحالة الحالية'},{k:'l',t:'',s:false,h:function(x){return x.l?'<a class="ab" href="'+x.l+'">فتح</a>':'—'}}],ST,{q:false,ps:20})},
 info:function(D){if(D.siteErr){E('b82p').innerHTML='<p class="adE er">تعذّرت قراءة معلومات المنصة (يلزم b59_cms.sql على الخادم).</p>';return}
  var pl=D.site.platform||{},L=window.B59_PF||{},SH={phone:'صفحة «تواصل معنا»'},rows=Object.keys(L).map(function(k){var v=String(pl[k]||'').trim();return{n:L[k],v:v,w:SH[k]||'غير معروض في الموقع بعد'}});
  E('b82p').innerHTML='<p class="b17n">القيم المحفوظة حالياً. التعديل من محرّر المحتوى (B59) لتجنّب نظام مكرر. الشعار وملفات الهوية الحالية لا تُستبدل من هنا. حقل بلا قيمة لا يُعرض شيء افتراضي مكانه.</p><div id="b82i"></div><p><a class="ab pr" href="#admcms">تعديل من محرّر المحتوى</a></p>';
  tbl(E('b82i'),[{k:'n',t:'الحقل'},{k:'v',t:'القيمة المحفوظة',h:function(x){return x.v?'<bdi>'+X(x.v)+'</bdi>':'—'}},{k:'w',t:'أين يظهر في الموقع؟'}],rows,{q:false,ps:20})},
 home:function(D){if(D.siteErr){E('b82p').innerHTML='<p class="adE er">تعذّرت قراءة إعدادات الرئيسية (يلزم b59_cms.sql على الخادم).</p>';return}
  var S=window.B59_SEC||{},h=((D.site.home_sections||{}).hidden||[]),rows=Object.keys(S).map(function(k){return{n:S[k],s:h.indexOf(k)>-1?'مخفي':'ظاهر'}});
  E('b82p').innerHTML='<p class="b17n">المتاح فعلياً: إخفاء قسم من الصفحة الرئيسية وإظهاره (من محرّر المحتوى). ترتيب الأقسام وتعديل عناوينها ونصوصها <b>غير متاح بعد</b>: لا توجد له آلية في الكود الحالي، ولا أضفتُ أدوات وهمية له.</p><div id="b82h"></div><p><a class="ab pr" href="#admcms">إخفاء/إظهار الأقسام</a></p>';
  tbl(E('b82h'),[{k:'n',t:'قسم الصفحة الرئيسية'},{k:'s',t:'الحالة',h:function(x){return '<span class="bd '+(x.s==='ظاهر'?'published':'rejected')+'">'+x.s+'</span>'}}],rows,{q:false,ps:20})},
 sec:function(D){var S=window.B59_SEC||{},h=((D.site.home_sections||{}).hidden||[]),K=['hm-boat','hm-jet','hm-eng','hm-parts','hm-biz','hm-srv'],rows=K.filter(function(k){return S[k]}).map(function(k){return{n:S[k],s:D.siteErr?'غير متاح':(h.indexOf(k)>-1?'مخفي من الرئيسية':'ظاهر في الرئيسية')}});
  E('b82p').innerHTML='<p class="b17n"><b>إخفاء قسم من الرئيسية لا يوقف الإعلانات ولا البحث ولا الطلبات ولا الروابط، ولا يحذف أي بيانات.</b> أما إيقاف نوع الإعلان نفسه (قوارب، جت سكي، محركات، قطع، إكسسوارات، خدمات) فـ<b>غير مدعوم</b>: لا يوجد جدول أقسام، وتبويب «التصنيفات والمراجع» للعرض فقط. لذلك لا توجد هنا أزرار تفعيل/إيقاف.</p><div id="b82s"></div>';
  tbl(E('b82s'),[{k:'n',t:'القسم'},{k:'s',t:'ظهوره في الصفحة الرئيسية'}],rows,{q:false,ps:20})},
 mt:function(D){var okM=!D.M.error,mv=(okM&&D.M.data&&D.M.data.value)||{};
  if(!okM){E('b82p').innerHTML='<p class="adE er">وضع الصيانة غير مفعّل على الخادم: طبّق b72_settings.sql.</p>';return}
  E('b82p').innerHTML='<p class="b17n">الحالة الآن: <b>'+(mv.enabled===true?'صيانة مفعّلة':'تعمل بصورة طبيعية')+'</b>. عند التفعيل: تظهر لافتة لكل الزوار، ويرفض الخادم <b>إنشاء</b> إعلانات وطلبات قطع/خدمات وطلبات شراء جديدة من المستخدمين العاديين. لا يتأثر الدخول ولا القراءة ولا الدفع ولا السجلات القائمة، والمسؤولون مستثنون (حسب تصميم B72). اللافتة لا تحجب الموقع ولا لوحة الإدارة.</p><label style="display:block"><input type="checkbox" id="b72on"'+(mv.enabled===true?' checked':'')+'> تفعيل وضع الصيانة</label><textarea id="b72t" rows="3" maxlength="300" placeholder="رسالة الصيانة للمستخدمين (نص عادي، حتى 300 حرف)">'+X(mv.message||'')+'</textarea><button class="ab pr" data-b72="1" type="button">حفظ</button><p class="b17n">صيانة مجدولة، صيانة طارئة، ووقت بداية ونهاية: '+tg('غير متاحة بعد')+' تحتاج تعديلاً في الخادم (دالة الحفظ والعرض العام لا تدعم إلا مفعّل/متوقف). لا توجد لها عناصر تحكم هنا عمداً.</p>'},
 pv:function(D){E('b82p').innerHTML='<ul><li><b>رقم التواصل العام للمنصة</b>: يظهر في صفحة «تواصل معنا» فقط إذا كان محفوظاً. لإخفائه امسح الحقل من محرّر المحتوى.</li><li><b>أرقام تواصل الأنشطة التجارية</b>: يتحكم بها صاحب كل نشاط (خيار إخفاء الأرقام عن العامة في ملف النشاط)، ولا تُدار من هذه الصفحة.</li><li><b>حماية البيانات الخاصة</b> تتم بسياسات RLS ودوال الخادم، لا بإخفاء عناصر في الواجهة؛ لذلك لا تضيف هذه الصفحة أي مفتاح خصوصية يدّعي ذلك.</li></ul><p class="b17n">مفاتيح عرض عامة جديدة (مثل إظهار/إخفاء وسائل التواصل الرسمية): '+tg('مقترح فقط')+' تحتاج حقلاً وسياسة في الخادم.</p>'},
 lg:function(D){if(D.lg.error){E('b82p').innerHTML='<p class="adE">السجل غير متاح (طبّق b72_settings.sql).</p>';return}
  E('b82p').innerHTML='<p class="b17n">يسجّل هذا السجل تغييرات وضع الصيانة فقط. تغييرات محرّر المحتوى (B59) تُراجع من «سجل التدقيق» إن كان مصدرها مفعّلاً.</p><div id="b72a"></div>';
  tbl(E('b72a'),[{k:'created_at',t:'الوقت',h:function(x){return fd(x.created_at)}},{k:'key',t:'الإعداد',v:function(x){return x.key==='maintenance'?'وضع الصيانة':x.key}},{k:'old_value',t:'قبل',v:function(x){return x.old_value?(x.old_value.enabled?'مفعّل':'متوقف'):'—'}},{k:'new_value',t:'بعد',v:function(x){return x.new_value?(x.new_value.enabled?'مفعّل':'متوقف'):'—'}},{k:'actor',t:'المنفّذ',h:function(x){return idt(x.actor)}}],D.lg.data||[],{sort:'created_at',q:false,empty:'لا تغييرات مسجّلة بعد.'})}
};
function hub(tab){if(typeof tab==='string'&&H82P[tab])H82T=tab;ld();if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>إعدادات المنصة</h2><p class="adE">هذه الصفحة للمدير العام فقط.</p>';return}
 var c=sbc(),Q=function(p){return p.then(function(r){return r},function(e){return{error:e}})};
 Promise.all([Q(c.from('b72_settings').select('value,updated_at').eq('key','maintenance').maybeSingle()),Q(c.from('b59_site').select('key,value')),Q(c.from('b55_settings').select('key,value')),Q(c.from('b55_packages').select('id,is_active')),Q(c.from('b72_audit').select('*').order('created_at',{ascending:false}).limit(50))]).then(function(a){
  var D={M:a[0],siteErr:a[1].error,site:{},S55:a[2],pk:a[3],lg:a[4]};(a[1].data||[]).forEach(function(r){D.site[r.key]=r.value||{}});
  E('adm').innerHTML='<h2>إعدادات المنصة</h2><p class="adE" style="padding:0 0 10px;text-align:start">مكان واحد لإعدادات المنصة: يعرض الحالة الفعلية ويربط بالمحرّرات الموجودة (B55 وB59) دون نقلها أو تكرارها. المُعدَّل من هنا فعلياً: وضع الصيانة فقط؛ وما سواه عرض أو رابط.</p><div class="adbs" role="tablist" aria-label="أقسام إعدادات المنصة">'+H82B.map(function(t){return '<button type="button" role="tab" aria-selected="'+(t[0]===H82T)+'" class="ab'+(t[0]===H82T?' pr':'')+'" data-b82t="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div><div id="b82p" role="tabpanel" style="margin-top:14px"></div>';
  H82P[H82T](D)}).catch(function(e){er('تعذّر تحميل إعدادات المنصة: '+(e.message||e),hub)})}
E('adm').addEventListener('click',function(e){var tb=e.target.closest('[data-b82t]');if(tb){hub(tb.dataset.b82t);return}
 var b=e.target.closest('[data-b72]');if(!b||b.disabled)return;var on=E('b72on').checked,t=E('b72t').value.trim();
 if(on&&!t){msg('اكتب رسالة الصيانة أولاً.');return}
 if(t.length>300||/[<>]/.test(t)){msg('الرسالة حتى 300 حرف ولا يُسمح بالرمزين < و >.');return}
 if(!confirm(on?'تفعيل الصيانة يمنع المستخدمين العاديين من إنشاء إعلانات وطلبات جديدة فور الحفظ، وتظهر لافتة لكل الزوار. المسؤولون غير متأثرين. للرجوع: افتح هذه الصفحة مرة ثانية وأزل علامة التفعيل ثم احفظ. متابعة؟':'إيقاف وضع الصيانة؟'))return;
 var c=sbc();b.disabled=true;
 c.rpc('b72_set_maintenance',{p_enabled:on,p_message:t}).then(function(r){
  if(r.error){b.disabled=false;var m=String(r.error.message||'');msg('فشل الحفظ: '+(/forbidden/.test(m)?'غير مصرح.':/does not exist|PGRST202|42883/.test(String(r.error.code||m))?'طبّق b72_settings.sql أولاً.':'حاول مرة ثانية.'));return}
  /* B82: لا نجاح قبل قراءة القيمة من الخادم ومطابقتها لما أُرسل */
  return c.from('b72_settings').select('value').eq('key','maintenance').maybeSingle().then(function(v){b.disabled=false;
   var ok=!v.error&&v.data&&v.data.value&&((v.data.value.enabled===true)===on);
   if(!ok){msg('لم يتأكد الحفظ: القيمة المقروءة من الخادم لا تطابق ما أُرسل. لا تعتمد على هذا التغيير وأعد المحاولة.');hub();return}
   msg('تم الحفظ وتأكّد من الخادم.',1);hub()})
 }).catch(function(){b.disabled=false;msg('انقطع الاتصال أو تعذّر التأكد من نتيجة الحفظ. أعد فتح الصفحة وتحقق من الحالة قبل إعادة المحاولة.')})});
/* ===== B85: أداء المنصة وصحتها التشغيلية. للمدير العام فقط (والحماية الفعلية في دوال الخادم). لا SQL ولا إرسال بيانات: قياسات متصفحك في هذه الجلسة (window.B85) + فحوصات يدوية عند الطلب + ملخص أخطاء B77 من دوال الخادم الموجودة ===== */
var P85={m:'all',ty:'',rs:'',days:7,pr:null,busy:false,at:0},P85T={rest:'قاعدة بيانات (REST)',rpc:'دالة خادم (RPC)',storage:'تخزين',auth:'مصادقة','function':'دالة Edge'};
function p85n(v){return v==null?'—':Number(v).toLocaleString('en-US')}
function p85q(a,p){if(!a.length)return null;a=a.slice().sort(function(x,y){return x-y});return a[Math.min(a.length-1,Math.max(0,Math.ceil(p/100*a.length)-1))]}
function p85sel(id,o,v){return '<select id="'+id+'" class="adq">'+Object.keys(o).map(function(k){return '<option value="'+k+'"'+(k===v?' selected':'')+'>'+X(o[k])+'</option>'}).join('')+'</select>'}
function p85data(){var S=window.B85.samples(),now=Date.now(),lim=P85.m==='all'?0:parseInt(P85.m,10)*60000;
 S=S.filter(function(x){return(!lim||now-x.t<=lim)&&(!P85.ty||x.ty===P85.ty)&&(!P85.rs||(P85.rs==='ok')===x.ok)});
 var g={};S.forEach(function(x){var r=g[x.op]||(g[x.op]={op:x.op,ty:x.ty,n:0,ok:0,ms:[],last:x.st});r.n++;if(x.ok)r.ok++;r.ms.push(x.ms);r.last=x.st});
 return{all:S,rows:Object.keys(g).map(function(k){var r=g[k];return{op:r.op,ty:r.ty,n:r.n,ok:r.ok,bad:r.n-r.ok,rate:Math.round(r.ok/r.n*100),med:p85q(r.ms,50),p95:r.n>=20?p85q(r.ms,95):null,max:Math.max.apply(null,r.ms),last:r.last}})}}
function p85tab(){var h=E('p85g');if(!h)return;var d=p85data(),ok=d.all.filter(function(x){return x.ok}).length;
 E('p85s').innerHTML=d.all.length?'العمليات ضمن الفلاتر: <b>'+p85n(d.all.length)+'</b> · ناجحة: <b>'+p85n(ok)+'</b> · فاشلة: <b>'+p85n(d.all.length-ok)+'</b> · نسبة النجاح: <b>'+Math.round(ok/d.all.length*100)+'%</b>':'';
 tbl(h,[{k:'op',t:'العملية',h:function(x){return '<bdi>'+X(x.op)+'</bdi>'}},{k:'ty',t:'النوع',v:function(x){return P85T[x.ty]||x.ty}},{k:'n',t:'العدد'},{k:'ok',t:'نجاح'},{k:'bad',t:'فشل'},{k:'rate',t:'نسبة النجاح',h:function(x){return x.rate+'%'}},{k:'med',t:'الوسيط (م.ث)',h:function(x){return p85n(x.med)}},{k:'p95',t:'P95 (م.ث)',h:function(x){return x.p95==null?'— (أقل من 20 عملية)':p85n(x.p95)}},{k:'max',t:'الأبطأ (م.ث)',h:function(x){return p85n(x.max)}},{k:'last',t:'آخر حالة HTTP',h:function(x){return x.last?x.last:'فشل شبكة'}}],d.rows,{sort:'n',ps:10,empty:'لم تُسجَّل عمليات تطابق هذه الفلاتر في هذه الجلسة بعد.'})}
function p85probe(){return P85.pr?'<div id="p85pt"></div>':''}
function p85prRows(){var NT=[['البحث والفلاتر','لم يُختبر','يعتمد على معاملات البحث الفعلية للتطبيق؛ لا يوجد اختبار آلي له.'],['المصادقة (تسجيل الدخول)','لم يُختبر','لا يُجرى تسجيل دخول اختباري بحسابات حقيقية. (يُفحص فقط صلاحية الجلسة الحالية.)'],['رفع الصور','لم يُختبر','يتطلب كتابة في التخزين؛ لا آلية اختبار آمنة.']];
 var R=(P85.pr?P85.pr.rows:[]).map(function(r){return{n:r.n,s:r.s,ms:r.ms,i:r.i,w:r.w}});
 if(!P85.pr)return[{n:'كل الفحوصات',s:'لم يُختبر',ms:null,i:'اضغط «تشغيل الفحص الآن».',w:'—'}].concat(NT.map(function(x){return{n:x[0],s:x[1],ms:null,i:x[2],w:'—'}}));
 return R.concat(NT.map(function(x){return{n:x[0],s:x[1],ms:null,i:x[2],w:'—'}}))}
function p85prDraw(){var h=E('p85pt');if(!h)return;var cl={'يعمل وفق آخر اختبار':'published','فشل آخر اختبار':'rejected','تعذّر التحقق':'pending','لم يُختبر':'in_progress'};
 tbl(h,[{k:'n',t:'الوظيفة'},{k:'s',t:'الحالة',h:function(x){return '<span class="bd '+(cl[x.s]||'')+'">'+X(x.s)+'</span>'}},{k:'ms',t:'المدة (م.ث)',h:function(x){return p85n(x.ms)}},{k:'i',t:'تفاصيل'},{k:'w',t:'مصدر الفحص',h:function(x){return X(x.w)}}],p85prRows(),{q:false,ps:20})}
function p85run(){if(P85.busy)return;if(Date.now()-P85.at<10000){msg('انتظر 10 ثوانٍ بين الفحوصات اليدوية.');return}
 var C=window.BAHR_CONFIG||{},U=String(C.supabaseUrl||'').replace(/\/+$/,''),K=C.supabaseAnonKey,c=sbc();if(!c||!U||!K){msg('تعذّر الاتصال بالخادم.');return}
 P85.busy=true;P85.at=Date.now();var b=E('p85run');if(b)b.disabled=true;
 var MISS=/42883|PGRST202|42P01|PGRST205/;
 function T(n,w,fn){var t=performance.now();return Promise.resolve().then(fn).then(function(r){var ms=Math.round(performance.now()-t),code=r.code||'',miss=r.http===404||MISS.test(String(code));
  if(r.ok)return{n:n,w:w,s:'يعمل وفق آخر اختبار',ms:ms,i:'نجح'};
  if(miss)return{n:n,w:w,s:'تعذّر التحقق',ms:ms,i:'غير مفعّل على الخادم ('+(code||r.http)+')'};
  return{n:n,w:w,s:'فشل آخر اختبار',ms:ms,i:'رمز: '+(code||r.http||'—')}},function(e){return{n:n,w:w,s:'تعذّر التحقق',ms:Math.round(performance.now()-t),i:'تعذّر الاتصال'}})}
 var H={apikey:K,Authorization:'Bearer '+K},J=[
  function(){return T('اتصال Supabase (إعدادات المصادقة)','اختبار يدوي من متصفحك',function(){return fetch(U+'/auth/v1/settings',{headers:{apikey:K}}).then(function(r){return{ok:r.ok,http:r.status}})})},
  function(){return T('تحميل الإعلانات العامة (كزائر)','اختبار يدوي من متصفحك',function(){return fetch(U+'/rest/v1/listings?select=id&status=eq.published&limit=1',{headers:H}).then(function(r){return{ok:r.ok,http:r.status}})})},
  function(){return T('الجلسة الحالية للمدير','اختبار يدوي من متصفحك',function(){return c.auth.getUser().then(function(r){return{ok:!r.error&&!!(r.data&&r.data.user),code:r.error&&(r.error.code||r.error.status)}})})},
  function(){return T('تحميل الإشعارات (بحسابك)','اختبار يدوي من متصفحك',function(){return c.from('notifications').select('id').limit(1).then(function(r){return{ok:!r.error,http:r.status,code:r.error&&r.error.code}})})},
  function(){return T('وظائف الإدارة (is_admin)','اختبار يدوي من متصفحك',function(){return c.rpc('is_admin').then(function(r){return{ok:!r.error&&r.data===true,http:r.status,code:r.error&&r.error.code}})})},
  function(){return T('نظام الأخطاء B77 (b77_admin_stats)','اختبار يدوي من متصفحك',function(){return c.rpc('b77_admin_stats',{p_days:1}).then(function(r){return{ok:!r.error,http:r.status,code:r.error&&r.error.code}})})}],R=[];
 J.reduce(function(p,f){return p.then(function(){return f().then(function(x){R.push(x)})})},Promise.resolve()).then(function(){P85.pr={at:Date.now(),rows:R};P85.busy=false;perfPage(true)})}
function p85csv(){var d=p85data().all;if(!d.length){msg('لا قياسات لتصديرها ضمن الفلاتر الحالية.');return}
 var q=function(v){return '"'+String(v).replace(/"/g,'""')+'"'},o='\ufefftime_iso,operation,type,duration_ms,http_status,success\n'+d.map(function(x){return[new Date(x.t).toISOString(),x.op,x.ty,x.ms,x.st,x.ok?1:0].map(q).join(',')}).join('\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([o],{type:'text/csv;charset=utf-8'}));a.download='bahr-session-performance.csv';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function perfPage(keep){if(!keep)ld();if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>أداء المنصة وصحتها التشغيلية</h2><p class="adE">هذه الصفحة للمدير العام فقط.</p>';return}
 if(!window.B85){E('adm').innerHTML='<h2>أداء المنصة وصحتها التشغيلية</h2><p class="adE er">أداة القياس غير مدعومة في هذا المتصفح.</p>';return}
 var c=sbc();b83Q(c.rpc('b77_admin_stats',{p_days:P85.days})).then(function(r){var N=window.B85.nav(),I=window.B85.images(),
  nv=[{n:'زمن أول بايت (TTFB)',v:N.ttfb,w:'المتصفح: Navigation Timing'},{n:'أول محتوى مرسوم (FCP)',v:N.fcp,w:'المتصفح: Paint Timing'},{n:'أكبر محتوى مرسوم (LCP)',v:N.lcp,w:'المتصفح: LCP Observer'},{n:'اكتمال بناء الصفحة (DOMContentLoaded)',v:N.dcl,w:'المتصفح: Navigation Timing'},{n:'اكتمال التحميل (load)',v:N.load,w:'المتصفح: Navigation Timing'}],
  er=r.error?'<p class="adE">'+X(qaEm(r.error))+'</p>':'<div class="adrc"><small>الأخطاء المسجّلة ('+(P85.days?'آخر '+P85.days+' يوماً':'كل الفترات')+'): الإجمالي <b>'+p85n((r.data||{}).total||0)+'</b> · جديدة <b>'+((r.data||{}).new||0)+'</b><br>أكثر الأقسام: '+qaTop((r.data||{}).top_areas,QA)+'<br>أكثر الأنواع: '+qaTop((r.data||{}).top_kinds,QK)+'</small></div>';
  E('adm').innerHTML='<h2>أداء المنصة وصحتها التشغيلية</h2><p class="adE" style="padding:0 0 10px;text-align:start"><b>مهم:</b> القياسات هنا من <b>متصفحك أنت في هذه الجلسة فقط</b> (قياس استخدام حقيقي لجلستك، وليس لكل الزوار)، وتُحفظ في الذاكرة وتختفي عند إغلاق الصفحة. المدة المعروضة هي ما يراه المتصفح (شبكة + خادم) وليست زمن تنفيذ قاعدة البيانات الداخلي. لا تُرسل أي بيانات أداء لأي مكان.</p>'
  +'<h3>1) أداء تحميل الصفحة (قياس المتصفح)</h3><div id="p85n"></div>'
  +'<h3>2) عمليات Supabase في هذه الجلسة (قياس المتصفح)</h3><div class="adbs" style="margin:6px 0">'+p85sel('p85m',{all:'كل الجلسة','5':'آخر 5 دقائق','15':'آخر 15 دقيقة'},P85.m)+p85sel('p85t',{'':'كل الأنواع',rest:'قاعدة بيانات (REST)',rpc:'دوال خادم (RPC)',storage:'تخزين',auth:'مصادقة','function':'دوال Edge'},P85.ty)+p85sel('p85r',{'':'نجاح وفشل',ok:'ناجحة فقط',bad:'فاشلة فقط'},P85.rs)+'<button class="ab" data-b85="csv" type="button">تصدير CSV (لا بيانات مستخدمين)</button></div><p class="b17n">نوع الجهاز: جهازك الحالي فقط، فلا مقارنة بين الأجهزة هنا. «القسم» غير مسجّل في القياس المحلي.</p><p id="p85s" class="b17n"></p><div id="p85g"></div>'
  +'<h3>3) تحميل صور الإعلانات (التخزين)</h3><p class="b17n">'+(I.ms.length||I.fail?'صور محمّلة: <b>'+p85n(I.ms.length)+'</b> · وسيط مدة التحميل: <b>'+p85n(p85q(I.ms,50))+' م.ث</b> · صور فشلت: <b>'+p85n(I.fail)+'</b> (مصدر: Resource Timing وأحداث الخطأ، لهذه الجلسة)':'لم تُقَس صور في هذه الجلسة بعد.')+'</p>'
  +'<h3>4) صحة الوظائف الأساسية (اختبار يدوي عند الطلب)</h3><p class="b17n">لا تُجرى فحوصات تلقائية ولا دورية. «يعمل» تعني نجاح فحص فعلي في آخر تشغيل'+(P85.pr?' (<b>'+fd(P85.pr.at)+' '+new Date(P85.pr.at).toLocaleTimeString('ar-IQ')+'</b>)':'')+'.</p><p><button class="ab pr" id="p85run" data-b85="run" type="button">تشغيل الفحص الآن</button></p><div id="p85pt"></div>'
  +'<h3>5) الأخطاء التشغيلية (B77)</h3><div class="adbs" style="margin:6px 0">'+p85sel('p85d',{'1':'آخر 24 ساعة','7':'آخر 7 أيام','30':'آخر 30 يوماً','0':'كل الفترات'},String(P85.days))+'<button class="ab" data-b85="qa" type="button">فتح مراقبة الأخطاء</button></div>'+er
  +'<h3>6) الاتجاهات والاختبارات الآلية</h3><p class="b17n"><b>الاتجاهات الزمنية غير متاحة:</b> لا توجد بيانات أداء محفوظة على الخادم، ولا أعرض رسوماً أو أرقاماً مقارنة بلا بيانات. الحفظ الدائم يحتاج جدولاً ودوالاً جديدة (مقترح SQL غير منفّذ في b85_perf_proposal.sql). اختبارات B79 الآلية: <b>غير موجودة</b> في الملفات المتاحة، فلا نتائج تُعرض.</p>';
  var nh=E('p85n');tbl(nh,[{k:'n',t:'المؤشر'},{k:'v',t:'القيمة (م.ث)',h:function(x){return x.v==null?'غير متاح':p85n(x.v)}},{k:'w',t:'المصدر'}],nv,{q:false,ps:10});
  p85tab();p85prDraw();
  ['p85m','p85t','p85r'].forEach(function(id){E(id).onchange=function(){P85.m=E('p85m').value;P85.ty=E('p85t').value;P85.rs=E('p85r').value;p85tab()}});
  E('p85d').onchange=function(){P85.days=parseInt(this.value,10)||0;perfPage()}})}
/* ===== B87: مركز متابعة المهام والمخاطر. واجهة فقط: لا بيانات مهام داخل هذا الملف العام. التخزين محلي على متصفح المدير حتى يُعتمد جدول الخادم المقترح. ===== */
var B87={k:'bahr_b87_v1',f:{q:'',cat:'',sev:'',st:'',cf:''},
 CAT:{security:'أمان',functional:'وظيفة',feature:'ميزة غير مكتملة',test:'اختبار لم يُنفذ',dependency:'ينتظر ملفات أو بيانات',retest:'يحتاج إعادة اختبار'},
 SEV:{critical:'حرج',high:'عالٍ',medium:'متوسط',low:'منخفض'},
 ST:{new:'جديدة',doing:'قيد العمل',waiting:'تنتظر معلومات',retest:'تحتاج اختباراً',done:'مكتملة'},
 CF:{confirmed:'مؤكدة',probable:'محتملة',unverified:'غير متحقق منها'},
 PR:{p1:'أولوية 1',p2:'أولوية 2',p3:'أولوية 3'}};
function b87load(){try{var r=JSON.parse(localStorage.getItem(B87.k)||'null');return Array.isArray(r)?r:[]}catch(e){return[]}}
function b87save(a){try{localStorage.setItem(B87.k,JSON.stringify(a));return true}catch(e){return false}}
function b87clean(raw){var arr=Array.isArray(raw)?raw:(raw&&Array.isArray(raw.tasks)?raw.tasks:null);
 if(!arr)return{err:'الملف لا يحتوي قائمة مهام.'};if(arr.length>500)return{err:'عدد المهام أكبر من 500.'};
 var S=function(v,n){return typeof v==='string'?v.slice(0,n):''},pk=function(v,o,d){return typeof v==='string'&&Object.prototype.hasOwnProperty.call(o,v)?v:d},seen={},out=[];
 for(var i=0;i<arr.length;i++){var t=arr[i];if(!t||typeof t!=='object')return{err:'مهمة غير صالحة رقم '+(i+1)+'.'};
  var id=S(t.id,24).trim();if(!/^[A-Za-z0-9_.-]{1,24}$/.test(id))return{err:'رقم مرجعي غير صالح في المهمة '+(i+1)+'.'};
  if(seen[id])return{err:'رقم مرجعي مكرر: '+id};seen[id]=1;
  var ti=S(t.title,160).trim();if(!ti)return{err:'مهمة بلا عنوان: '+id};
  out.push({id:id,title:ti,desc:S(t.desc,3000),cat:pk(t.cat,B87.CAT,'functional'),sev:pk(t.sev,B87.SEV,'medium'),pri:pk(t.pri,B87.PR,'p2'),st:pk(t.st,B87.ST,'new'),cf:pk(t.cf,B87.CF,'unverified'),src:S(t.src,120),
   steps:Array.isArray(t.steps)?t.steps.slice(0,20).map(function(x){return S(x,300)}).filter(Boolean):[],created:S(t.created,30),updated:S(t.updated,30),
   log:Array.isArray(t.log)?t.log.slice(-100).map(function(l){return{at:S(l&&l.at,30),txt:S(l&&l.txt,600)}}):[]})}
 return{ok:out}}
function b87dt(v){if(!v)return'—';var d=new Date(v);return isNaN(d)?X(String(v)):d.toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}
function b87view(all){var f=B87.f,q=f.q.trim().toLowerCase(),R={critical:0,high:1,medium:2,low:3},C={confirmed:0,probable:1,unverified:2};
 return all.filter(function(t){return(!q||t.id.toLowerCase().indexOf(q)>-1||t.title.toLowerCase().indexOf(q)>-1)&&(!f.cat||t.cat===f.cat)&&(!f.sev||t.sev===f.sev)&&(!f.st||t.st===f.st)&&(!f.cf||t.cf===f.cf)})
 .sort(function(a,b){var da=a.st==='done'?1:0,db=b.st==='done'?1:0;if(da!==db)return da-db;if(R[a.sev]!==R[b.sev])return R[a.sev]-R[b.sev];if(a.pri!==b.pri)return a.pri<b.pri?-1:1;if(C[a.cf]!==C[b.cf])return C[a.cf]-C[b.cf];return(b.updated||'')<(a.updated||'')?-1:1})}
function b87draw(){var all=b87load(),L=E('b87l'),K=E('b87k');if(!L||!K)return;
 var cnt=function(key,map){return Object.keys(map).map(function(k){var n=all.filter(function(t){return t[key]===k}).length;return'<div><b>'+n+'</b>'+X(map[k])+'</div>'}).join('')};
 K.innerHTML='<h3>حسب الحالة</h3><div class="adk">'+cnt('st',B87.ST)+'</div><h3>حسب الخطورة</h3><div class="adk">'+cnt('sev',B87.SEV)+'</div><h3>حسب التحقق</h3><div class="adk">'+cnt('cf',B87.CF)+'</div>';
 if(!all.length){L.innerHTML='<p class="adE">لا توجد مهام في هذا المتصفح. استورد ملف المهام (JSON) من زر «استيراد» أعلاه. لا تُعرض بيانات افتراضية.</p>';return}
 var v=b87view(all);if(!v.length){L.innerHTML='<p class="adE">لا نتائج مطابقة للفلاتر.</p>';return}
 L.innerHTML='<p class="b17n">عدد النتائج: <b>'+v.length+'</b> من '+all.length+' · الأعلى خطورة أولاً والمكتملة في النهاية.</p>'+v.map(function(t){
  return'<button type="button" class="b87i b87s-'+X(t.sev)+'" data-b87="open" data-id="'+X(t.id)+'"><span class="b87h"><b dir="ltr">'+X(t.id)+'</b><span class="b87t">'+X(t.title)+'</span></span><span class="b87g"><i class="b87v b87v-'+X(t.sev)+'">'+X(B87.SEV[t.sev])+'</i><i class="b87c b87c-'+X(t.cf)+'">'+X(B87.CF[t.cf])+'</i><i>'+X(B87.CAT[t.cat])+'</i><i>'+X(B87.ST[t.st])+'</i><i>'+X(B87.PR[t.pri])+'</i></span></button>'}).join('')}
function b87opt(map,sel,all){return(all?'<option value="">'+all+'</option>':'')+Object.keys(map).map(function(k){return'<option value="'+X(k)+'"'+(k===sel?' selected':'')+'>'+X(map[k])+'</option>'}).join('')}
function b87Page(){
 if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>متابعة المهام والمخاطر</h2><p class="adE">هذه الصفحة للمدير العام فقط.</p>';return}
 var f=B87.f;
 E('adm').innerHTML='<h2>متابعة المهام والمخاطر</h2>'
 +'<p class="adE" style="padding:0 0 10px;text-align:start"><b>مهم:</b> هذا السجل <b>محفوظ في متصفحك أنت فقط</b> (لا يُشارَك مع مدير آخر ولا مع الخادم) إلى أن يُعتمد جدول الخادم المقترح. لا تحتوي الصفحة العامة على أي مهام: تُستورد من ملف تحتفظ به أنت. «غير متحقق منها» تعني أن الدليل غير كافٍ، وليست ثغرة مؤكدة.</p>'
 +'<div class="adbs" style="margin:6px 0 12px"><label class="ab" style="cursor:pointer">استيراد (JSON)<input id="b87f" type="file" accept="application/json,.json" hidden></label><button class="ab" type="button" data-b87="exj">تصدير JSON</button><button class="ab" type="button" data-b87="exc">تصدير CSV</button></div>'
 +'<div id="b87k"></div><h3>المهام</h3>'
 +'<div class="b87f"><input id="b87q" type="search" placeholder="بحث بالعنوان أو الرقم المرجعي" value="'+X(f.q)+'" aria-label="بحث"><select id="b87cat" aria-label="التصنيف">'+b87opt(B87.CAT,f.cat,'كل التصنيفات')+'</select><select id="b87sev" aria-label="الخطورة">'+b87opt(B87.SEV,f.sev,'كل الخطورات')+'</select><select id="b87st" aria-label="الحالة">'+b87opt(B87.ST,f.st,'كل الحالات')+'</select><select id="b87cf" aria-label="التحقق">'+b87opt(B87.CF,f.cf,'كل مستويات التحقق')+'</select></div><div id="b87l"></div>';
 var bind=function(id,k,ev){E(id).addEventListener(ev,function(){B87.f[k]=this.value;b87draw()})};
 bind('b87q','q','input');bind('b87cat','cat','change');bind('b87sev','sev','change');bind('b87st','st','change');bind('b87cf','cf','change');
 E('b87f').addEventListener('change',function(){var fl=this.files&&this.files[0],inp=this;if(!fl)return;if(fl.size>1048576){msg('الملف أكبر من 1 ميغابايت.');inp.value='';return}
  var rd=new FileReader();rd.onerror=function(){msg('تعذّرت قراءة الملف.')};
  rd.onload=function(){var raw;try{raw=JSON.parse(rd.result)}catch(e){msg('الملف ليس JSON صالحاً.');inp.value='';return}
   var r=b87clean(raw);if(r.err){msg('رُفض الاستيراد: '+r.err);inp.value='';return}
   var cur=b87load(),ids={};cur.forEach(function(t){ids[t.id]=1});var add=r.ok.filter(function(t){return!ids[t.id]});
   if(!b87save(cur.concat(add))){msg('تعذّر الحفظ في هذا المتصفح (التخزين ممتلئ أو ممنوع).');inp.value='';return}
   inp.value='';msg('أُضيفت '+add.length+' مهمة جديدة، وتُجوهلت '+(r.ok.length-add.length)+' موجودة مسبقاً (بدون تعديل حالتها المحلية).',1);b87draw()};
  rd.readAsText(fl)});
 b87draw()}
function b87detail(id){var all=b87load(),t=all.filter(function(x){return x.id===id})[0];if(!t)return;
 E('adw').innerHTML='<div style="display:flex;justify-content:space-between;gap:10px;align-items:start"><h2 style="margin:0">'+X(t.title)+'</h2><button class="btn" type="button" data-xc>إغلاق</button></div>'
 +'<p class="b17n" dir="ltr" style="text-align:start">'+X(t.id)+'</p>'
 +'<div class="b87g"><i class="b87v b87v-'+X(t.sev)+'">الخطورة: '+X(B87.SEV[t.sev])+'</i><i class="b87c b87c-'+X(t.cf)+'">'+X(B87.CF[t.cf])+'</i><i>'+X(B87.CAT[t.cat])+'</i><i>'+X(B87.PR[t.pri])+'</i></div>'
 +'<h3>الوصف</h3><p style="white-space:pre-wrap">'+X(t.desc||'—')+'</p>'
 +'<h3>المصدر</h3><p>'+X(t.src||'—')+'</p>'
 +'<h3>خطوات المعالجة</h3>'+(t.steps.length?'<ol>'+t.steps.map(function(s){return'<li>'+X(s)+'</li>'}).join('')+'</ol>':'<p class="b17n">لم تُحدَّد خطوات.</p>')
 +'<h3>التواريخ</h3><p class="b17n">أُنشئت: '+b87dt(t.created)+' · آخر تحديث: '+b87dt(t.updated)+'</p>'
 +'<h3>تحديث المهمة</h3><div class="b87f"><select id="b87ns" aria-label="الحالة">'+b87opt(B87.ST,t.st)+'</select></div><textarea id="b87nt" rows="3" maxlength="600" placeholder="ملاحظة (اختياري، 600 حرف)" style="width:100%;margin-top:8px"></textarea>'
 +'<p><button class="btn btn-p" type="button" data-b87="sv" data-id="'+X(t.id)+'">حفظ</button></p>'
 +'<h3>سجل التغييرات</h3>'+(t.log.length?'<ul class="b87lg">'+t.log.slice().reverse().map(function(l){return'<li><small>'+b87dt(l.at)+'</small><br>'+X(l.txt)+'</li>'}).join('')+'</ul>':'<p class="b17n">لا توجد تغييرات مسجّلة.</p>');
 E('adx').classList.add('on');document.body.style.overflow='hidden'}
function b87csvq(v){v=String(v==null?'':v);if(/^[=+\-@\t\r]/.test(v))v="'"+v;return'"'+v.replace(/"/g,'""')+'"'}
function b87dl(name,mime,txt){var a=document.createElement('a'),u=URL.createObjectURL(new Blob([txt],{type:mime}));a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},1000)}
/* ===== B88: مراقبة العمليات التشغيلية. يقرأ فقط: قياسات B85 (هذه الجلسة)، أحداث B88 (هذه الجلسة)، وبيانات الخادم عند الطلب عبر admin_stats وb77_admin_* واستعلامات عدّ خفيفة. لا يكتب شيئاً ولا يحدّث تلقائياً. ===== */
var B88={P:'0',G:'',R:'',days:'7',d:null,busy:0,last:0,okAt:null,
 GR:[{k:'ads',n:'تحميل الإعلانات (قراءة)',re:/^GET:listings$/},
  {k:'cre',n:'إنشاء إعلان',re:/^POST:listings$/},
  {k:'edt',n:'تعديل إعلان أو تغيير حالته (يشمل الإرسال للمراجعة والإيقاف)',re:/^PATCH:listings$/},
  {k:'img',n:'رفع صور الإعلانات',re:/^storage:listing-images:(POST|PUT)$/},
  {k:'ntf',n:'الإشعارات والتفضيلات',re:/^(GET|PATCH|POST):(notifications|notification_preferences)$/},
  {k:'svc',n:'طلبات الخدمات',re:/^(GET|POST|PATCH):service_requests$|^rpc:b61_/},
  {k:'buy',n:'طلبات المشترين',re:/^(GET|POST|PATCH):buyer_requests$/},
  {k:'off',n:'العروض (مشترين وخدمات وقطع)',re:/^(GET|POST|PATCH):(buyer_request_offers|request_offers|parts_offers)$/},
  {k:'cht',n:'المحادثات',re:/^(GET|POST|PATCH|DELETE):connect_|^rpc:connect_/},
  {k:'aut',n:'المصادقة',ty:'auth'}],
 T:[['service_requests','طلبات الخدمات'],['buyer_requests','طلبات المشترين'],['buyer_request_offers','عروض طلبات المشترين'],['request_offers','عروض الخدمات'],['parts_offers','عروض قطع الغيار'],['connect_conversations','المحادثات'],['notifications','الإشعارات']]};
function b88grp(s){for(var i=0;i<B88.GR.length;i++){var g=B88.GR[i];if(g.ty?s.ty===g.ty:g.re.test(s.op))return g.k}return''}
function b88tm(t){if(!t)return'—';var d=new Date(t);return isNaN(d)?'—':d.toLocaleTimeString('ar-IQ',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}
function b88dt(t){if(!t)return'—';var d=new Date(t);return isNaN(d)?'—':d.toLocaleString('ar-IQ',{dateStyle:'short',timeStyle:'short'})}
function b88em(e){var c=String(e&&e.code||''),m=String(e&&e.message||'');
 if(c==='42883'||c==='PGRST202'||c==='42P01'||c==='PGRST205'||c==='404')return'غير مفعّل على الخادم بعد';
 if(c==='42501'||c==='401'||c==='403'||m.indexOf('forbidden')>-1)return'لا صلاحية لهذا الحساب (دور أو RLS)';
 if(/Failed to fetch|network|NetworkError/i.test(m)||c==='0')return'تعذّر الاتصال';return'فشل الطلب'+(c?' ('+X(c)+')':'')}
function b88samples(){if(!window.B85||!window.B85.samples)return null;var p=parseInt(B88.P,10)||0,min=p?Date.now()-p*60000:0;return window.B85.samples().filter(function(s){return s.t>=min&&s.op.indexOf('HEAD:')!==0})}
function b88pill(k,t){return'<span class="b88p b88p-'+k+'">'+X(t)+'</span>'}
function b88conn(){var S=window.B85&&window.B85.samples?window.B85.samples():null,ok=null,bad=null;
 if(S){for(var i=S.length-1;i>=0;i--){if(S[i].ok&&!ok)ok=S[i];if(!S[i].ok&&!bad)bad=S[i];if(ok&&bad)break}}
 var ev=(window.B88C?window.B88C.events():[]);
 return'<div class="adk"><div>الاتصال بالإنترنت (متصفحك الآن)<b style="font-size:20px">'+(navigator.onLine?'متصل':'منقطع')+'</b></div>'
 +'<div>آخر نجاح لعملية جلب في هذه الجلسة<b style="font-size:20px">'+(ok?b88tm(ok.t):'—')+'</b></div>'
 +'<div>آخر فشل عملية في هذه الجلسة<b style="font-size:20px">'+(bad?b88tm(bad.t):'—')+'</b></div>'
 +'<div>آخر تحديث ناجح لأرقام هذه الصفحة<b style="font-size:20px">'+(B88.okAt?b88tm(B88.okAt):'—')+'</b></div></div>'
 +'<p class="b17n">كل ما فوق يخص <b>هذه الجلسة في متصفحك</b> (حتى 300 عملية أخيرة). لا يعكس مستخدمين آخرين.'+'</p>'}
function b88groups(){var S=b88samples(),el=E('b88g');if(S===null){el.innerHTML='<p class="adE er">أداة قياس العمليات (B85) غير مدعومة في هذا المتصفح، فلا قياسات متاحة.</p>';return}
 var rows=B88.GR.map(function(g){var a=S.filter(function(s){return b88grp(s)===g.k}),o=a.filter(function(s){return s.ok}),f=a.filter(function(s){return!s.ok}),st,why;
  if(!a.length){st=b88pill('na','تعذّر التحقق');why='لم تُنفَّذ عملية من هذا النوع في المدة المحددة'}
  else{var l=a[a.length-1],p=a.length>1?a[a.length-2]:null;
   if(l.ok){st=b88pill('ok','يعمل');why='آخر عملية نجحت'+(f.length?' (مع '+f.length+' فشل سابق)':'')}
   else if(p&&!p.ok){st=b88pill('bad','متوقف');why='آخر عمليتين فشلتا (آخر رمز: '+X(l.st||'شبكة')+')'}
   else{st=b88pill('na','تعذّر التحقق');why='آخر محاولة فشلت مرة واحدة (رمز: '+X(l.st||'شبكة')+')'}}
  return'<tr><td data-l="العملية">'+X(g.n)+'</td><td data-l="الحالة">'+st+'</td><td data-l="نجحت">'+o.length+'</td><td data-l="فشلت">'+f.length+'</td><td data-l="آخر نجاح">'+(o.length?b88tm(o[o.length-1].t):'—')+'</td><td data-l="آخر فشل">'+(f.length?b88tm(f[f.length-1].t):'—')+'</td><td data-l="ملاحظة">'+why+'</td></tr>'}).join('');
 el.innerHTML='<p class="b17n">المدة المعروضة: <b>'+({'0':'كل الجلسة','5':'آخر 5 دقائق','15':'آخر 15 دقيقة','60':'آخر ساعة'}[B88.P]||'كل الجلسة')+'</b> (تُغيَّر من قسم 4).</p><div class="adtw"><table class="adt"><thead><tr><th>العملية</th><th>الحالة</th><th>نجحت</th><th>فشلت</th><th>آخر نجاح</th><th>آخر فشل</th><th>ملاحظة</th></tr></thead><tbody>'+rows+'</tbody></table></div>'
 +'<p class="b17n">«يعمل» تعني نجاح عملية فعلية في هذه الجلسة فقط، وليست فحصاً للخادم من الداخل. «تعذّر التحقق» تعني أنه لا دليل كافياً، وليست دليلاً على السلامة ولا على العطل. عمليات العدّ (HEAD) مستثناة لأن هذه الصفحة تستخدمها.</p>'}
function b88real(){var el=E('b88d'),d=B88.d;if(!d){el.innerHTML='<p class="adE">اضغط «تحديث الأرقام» لجلب الأرقام الحقيقية من الخادم. لا تحديث تلقائي.</p>';return}
 if(d.off){el.innerHTML='<p class="adE er">لا يوجد اتصال بالإنترنت، فلم تُجلب أي أرقام.</p>';return}
 var s=d.stats,h='<p class="b17n">آخر جلب من الخادم: <b>'+b88dt(d.at)+'</b></p>';
 if(s.ok){var D=s.d||{};h+='<div class="adk">'+[['published','إعلانات منشورة'],['pending','بانتظار المراجعة'],['blocked','مرفوضة أو موقوفة'],['reports_new','بلاغات جديدة']].map(function(k){return'<div>'+k[1]+'<b>'+(D[k[0]]==null?'—':X(String(D[k[0]])))+'</b></div>'}).join('')+'</div><p class="b17n">المصدر: دالة admin_stats على الخادم (محصورة بالمدير). «مرفوضة أو موقوفة» رقم واحد مجمّع كما تعرضه لوحة المعلومات، ولا أفصل بينهما.</p>'}
 else h+='<p class="adE er">تعذّر جلب أرقام الإعلانات: '+b88em(s.e)+'.</p>';
 h+='<h3>سجلات مرئية لحسابك</h3><div class="adtw"><table class="adt"><thead><tr><th>النظام</th><th>العدد</th><th>الحالة</th></tr></thead><tbody>'+d.tables.map(function(t){return'<tr><td data-l="النظام">'+X(t.n)+'</td><td data-l="العدد">'+(t.ok?(t.v==null?'غير متاح':X(String(t.v))):'—')+'</td><td data-l="الحالة">'+(t.ok?b88pill('ok','نجح الاستعلام'):b88pill('bad',b88em(t.e)))+'</td></tr>'}).join('')+'</tbody></table></div><p class="b17n">هذه أعداد ما تسمح به سياسات الخادم لحسابك، وقد تقل عن الإجمالي الفعلي إن حجبت السياسات بعض السجلات. لا أعرض تقسيماً حسب الحالة لأن قيم الحالات غير موثّقة هنا. أنظمة قد لا تكون مفعّلة على الخادم تظهر هنا بحالة «غير مفعّل» بدل رقم.</p>';
 el.innerHTML=h}
function b88errs(){var el=E('b88e'),d=B88.d;
 var sel='<div class="adbs" style="margin:6px 0"><select id="b88dy" aria-label="الفترة" class="adq">'+[['1','آخر 24 ساعة'],['7','آخر 7 أيام'],['30','آخر 30 يوماً'],['0','كل الفترات']].map(function(o){return'<option value="'+o[0]+'"'+(B88.days===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select><button class="ab" type="button" data-b88="qa">فتح مراقبة الأخطاء الكاملة</button></div>';
 if(!d||d.off){el.innerHTML=sel+'<p class="adE">'+(d&&d.off?'لا يوجد اتصال.':'اضغط «تحديث الأرقام» لجلب الأخطاء المسجلة.')+'</p>';return}
 var h=sel,a=d.bst,l=d.blist;
 if(!a.ok||!l.ok){var e=a.ok?l.e:a.e;h+='<p class="adE er">تعذّر التحقق من الأخطاء المسجّلة: '+b88em(e)+'.</p>'}
 else{var S=a.d||{},L=l.d||[];
  h+='<div class="adk"><div>أخطاء مسجّلة في الفترة<b>'+Number(S.total||0).toLocaleString('en-US')+'</b></div><div>جديدة<b>'+Number(S.new||0).toLocaleString('en-US')+'</b></div></div>'
  +'<p class="b17n">أكثر الأقسام: '+qaTop(S.top_areas,QA)+'<br>أكثر الأنواع: '+qaTop(S.top_kinds,QK)+'</p>'
  +(L.length?'<div class="adtw"><table class="adt"><thead><tr><th>المرجع</th><th>النوع</th><th>القسم</th><th>العملية</th><th>الصفحة</th><th>الرمز</th><th>آخر ظهور</th></tr></thead><tbody>'+L.map(function(r){return'<tr><td data-l="المرجع" dir="ltr">'+X(r.ref||'')+'</td><td data-l="النوع">'+X(QK[r.kind]||r.kind||'')+'</td><td data-l="القسم">'+X(QA[r.area]||r.area||'')+'</td><td data-l="العملية" dir="ltr">'+X(r.op||'')+'</td><td data-l="الصفحة" dir="ltr">'+X(r.page||'')+'</td><td data-l="الرمز">'+X(String(r.status_code==null?'—':r.status_code))+'</td><td data-l="آخر ظهور">'+b88dt(r.last_seen)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="adE">لا أخطاء مسجّلة في هذه الفترة.</p>')
  +'<p class="b17n"><b>تنبيه:</b> عدم وجود أخطاء مسجّلة ليس دليلاً على عدم وجود أخطاء. التسجيل يتم من متصفحات المستخدمين ويتوقف بصمت إن لم تكن الدالة مفعّلة، أو انقطع الاتصال، أو بلغت الجلسة حدّها.</p>'}
 el.innerHTML=h;var dy=E('b88dy');if(dy)dy.onchange=function(){B88.days=this.value;b88load(true)}}
function b88log(){var el=E('b88s'),S=b88samples();if(S===null){el.innerHTML='';return}
 var ev=(window.B88C?window.B88C.events():[]),p=parseInt(B88.P,10)||0,min=p?Date.now()-p*60000:0;ev=ev.filter(function(x){return x.t>=min});
 var rows=S.filter(function(s){return(!B88.G||b88grp(s)===B88.G)&&(!B88.R||(B88.R==='ok')===!!s.ok)}).slice().reverse();
 var lim=rows.slice(0,60),ge=function(){return B88.GR.map(function(g){return'<option value="'+g.k+'"'+(B88.G===g.k?' selected':'')+'>'+X(g.n)+'</option>'}).join('')};
 var h='<div class="b87f"><select id="b88p" aria-label="المدة"><option value="0"'+(B88.P==='0'?' selected':'')+'>كل الجلسة</option><option value="5"'+(B88.P==='5'?' selected':'')+'>آخر 5 دقائق</option><option value="15"'+(B88.P==='15'?' selected':'')+'>آخر 15 دقيقة</option><option value="60"'+(B88.P==='60'?' selected':'')+'>آخر ساعة</option></select>'
  +'<select id="b88f" aria-label="النظام"><option value="">كل الأنظمة</option>'+ge()+'</select><select id="b88r" aria-label="النتيجة"><option value="">نجاح وفشل</option><option value="ok"'+(B88.R==='ok'?' selected':'')+'>ناجحة فقط</option><option value="bad"'+(B88.R==='bad'?' selected':'')+'>فاشلة فقط</option></select></div>'
  +(rows.length?'<p class="b17n">عدد النتائج: <b>'+rows.length+'</b>'+(rows.length>60?' (أعرض أحدث 60)':'')+'</p><div class="adtw"><table class="adt"><thead><tr><th>الوقت</th><th>العملية</th><th>النتيجة</th><th>الرمز</th><th>المدة (م.ث)</th></tr></thead><tbody>'+lim.map(function(s){return'<tr><td data-l="الوقت">'+b88tm(s.t)+'</td><td data-l="العملية" dir="ltr">'+X(s.op)+'</td><td data-l="النتيجة">'+(s.ok?b88pill('ok','نجحت'):b88pill('bad','فشلت'))+'</td><td data-l="الرمز">'+X(String(s.st||'شبكة'))+'</td><td data-l="المدة">'+X(String(s.ms))+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="adE">لا عمليات مسجّلة بهذه الفلاتر في هذه الجلسة.</p>')
  +'<h3>أحداث الواجهة في هذه الجلسة</h3>'+(ev.length?'<div class="adtw"><table class="adt"><thead><tr><th>الوقت</th><th>النوع</th><th>الصفحة</th><th>رسالة مختصرة</th></tr></thead><tbody>'+ev.slice().reverse().map(function(x){return'<tr><td data-l="الوقت">'+b88tm(x.t)+'</td><td data-l="النوع">'+X({js:'خطأ JavaScript',promise:'وعد مرفوض',offline:'انقطاع',online:'عودة الاتصال'}[x.k]||x.k)+'</td><td data-l="الصفحة" dir="ltr">'+X(x.pg)+'</td><td data-l="الرسالة" dir="ltr">'+X(x.m)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="adE">لم تُرصد أخطاء واجهة أو انقطاعات في هذه الجلسة. هذا لا يعني عدم وجودها عند غيرك.</p>');
 el.innerHTML=h;E('b88p').onchange=function(){B88.P=this.value;b88draw()};E('b88f').onchange=function(){B88.G=this.value;b88log()};E('b88r').onchange=function(){B88.R=this.value;b88log()}}
function b88gaps(){var pe=!!(window.BAHR_CONFIG&&window.BAHR_CONFIG.pushEnabled);
 var R=[['مراقبة داخل Supabase/PostgreSQL (سجلات الخادم)','غير مربوطة','الواجهة لا تملك وصولاً لها ولا أدّعي مراقبتها.'],
 ['سجل تاريخي لنجاح العمليات عبر كل المستخدمين','غير موجود','يبدأ جمعه فقط بعد اعتماد جدول جديد بموافقتك. المتاح الآن: قياسات هذه الجلسة، وأخطاء B77 المسجّلة.'],
 ['فشل إرسال الإشعار من الخادم','غير مرصود','الإشعارات تُرسل من الخادم والواجهة لا ترى فشلها.'],
 ['الإشعارات الفورية (Web Push)',pe?'مفعّلة في الإعدادات (لم تُختبر)':'معطّلة في الإعدادات','القيمة من إعدادات الواجهة الفعلية (pushEnabled).'],
 ['اختبارات B79 الآلية','غير موجودة','لا ملفات لها في المشروع المتاح.'],
 ['اختبار العمليات على Supabase الحقيقي ببيانات مستخدمين','لم يُنفَّذ','الأعداد أعلاه تثبت نجاح استعلامات القراءة لحسابك فقط.']];
 E('b88x').innerHTML='<div class="adtw"><table class="adt"><thead><tr><th>العنصر</th><th>الحالة</th><th>التوضيح</th></tr></thead><tbody>'+R.map(function(r){return'<tr><td data-l="العنصر">'+X(r[0])+'</td><td data-l="الحالة">'+b88pill('na',r[1])+'</td><td data-l="التوضيح">'+X(r[2])+'</td></tr>'}).join('')+'</tbody></table></div>'}
function b88draw(){if(!E('b88n'))return;E('b88n').innerHTML=b88conn();b88groups();b88real();b88errs();b88log();b88gaps()}
function b88load(force){var c=sbc();if(!c)return;
 if(!navigator.onLine){B88.d={off:1};b88draw();return}
 if(B88.busy)return;if(!force&&B88.d)return;if(Date.now()-B88.last<4000){msg('انتظر بضع ثوانٍ قبل التحديث مرة أخرى.');return}
 B88.busy=1;B88.last=Date.now();var days=parseInt(B88.days,10)||0,btn=document.querySelector('#adm [data-b88="ref"]');if(btn)btn.disabled=true;
 var one=function(p){return Promise.resolve(p).then(function(r){return r&&r.error?{ok:0,e:r.error}:{ok:1,d:r?r.data:null}},function(e){return{ok:0,e:e}})};
 Promise.all([one(c.rpc('admin_stats')),one(c.rpc('b77_admin_stats',{p_days:days})),one(c.rpc('b77_admin_list',{p_state:null,p_kind:null,p_area:null,p_days:days,p_q:null,p_limit:10,p_offset:0}))]
  .concat(B88.T.map(function(t){return one(c.from(t[0]).select('*',{count:'exact',head:true}).then(function(r){return r.error?r:{data:r.count}}))})))
 .then(function(a){B88.busy=0;var ok=a.some(function(x){return x.ok});B88.d={at:Date.now(),stats:a[0],bst:a[1],blist:a[2],tables:B88.T.map(function(t,i){var r=a[3+i];return{n:t[1],ok:r.ok,v:r.d,e:r.e}})};if(ok)B88.okAt=Date.now();
  if(btn)btn.disabled=false;b88draw()})}
function b88Page(){
 if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>مراقبة العمليات التشغيلية</h2><p class="adE">هذه الصفحة للمدير العام فقط.</p>';return}
 E('adm').innerHTML='<h2>مراقبة العمليات التشغيلية</h2>'
 +'<p class="adE" style="padding:0 0 10px;text-align:start"><b>ما الذي تثبته هذه الصفحة؟</b> قياسات حقيقية من متصفحك في هذه الجلسة، وأرقام يجلبها الخادم لحسابك عند الضغط على «تحديث»، وأخطاء B77 المسجّلة من المستخدمين. <b>لا تراقب الخادم من الداخل</b>، ولا تحوي أرقاماً تجريبية. هي للقراءة فقط ولا تحدّث تلقائياً.</p>'
 +'<div class="adbs" style="margin:6px 0 12px"><button class="ab pr" type="button" data-b88="ref">تحديث الأرقام</button><button class="ab" type="button" data-b88="rd">إعادة رسم قياسات الجلسة</button><button class="ab" type="button" data-b88="go" data-t="monitor">فحص الوظائف والتكاملات</button><button class="ab" type="button" data-b88="go" data-t="perf">الأداء والصحة</button><button class="ab" type="button" data-b88="go" data-t="b87">متابعة المهام</button><a class="ab" href="#opscenter">طابور المراجعة (مركز العمليات B56)</a></div>'
 +'<div id="b88n"></div><h3>1) حالة الأنظمة (من عمليات هذه الجلسة)</h3><div id="b88g"></div>'
 +'<h3>2) الأرقام الحقيقية من الخادم</h3><div id="b88d"></div>'
 +'<h3>3) الأخطاء التشغيلية المسجّلة (B77)</h3><div id="b88e"></div>'
 +'<h3>4) سجل العمليات والأحداث (هذه الجلسة)</h3><div id="b88s"></div>'
 +'<h3>5) ما لم يُربط أو لم يُتحقق منه</h3><div id="b88x"></div>';
 B88.d=B88.d&&B88.d.off?null:B88.d;b88draw();b88load(false)}
document.addEventListener('click',function(e){var b=e.target.closest('#adm [data-b88]');if(!b)return;var k=b.dataset.b88;
 if(k==='ref')return b88load(true);if(k==='rd')return b88draw();
 if(k==='qa'){var n=document.querySelector('#adsub button[data-t="qa"]');if(n)n.click();return}
 if(k==='go'){var m=document.querySelector('#adsub button[data-t="'+b.dataset.t+'"]');if(m)m.click()}});
addEventListener('online',function(){if(AD.tab==='b88'&&E('b88n'))b88draw()});addEventListener('offline',function(){if(AD.tab==='b88'&&E('b88n'))b88draw()});

document.addEventListener('click',function(e){var b=e.target.closest('#adm [data-b87],#adw [data-b87]');if(!b)return;var k=b.dataset.b87;
 if(k==='open')return b87detail(b.dataset.id);
 if(k==='sv'){var all=b87load(),t=all.filter(function(x){return x.id===b.dataset.id})[0];if(!t)return;var ns=E('b87ns').value,nt=E('b87nt').value.trim().slice(0,600),now=new Date().toISOString(),ch=false;
  if(!B87.ST[ns])return;if(ns!==t.st){t.log.push({at:now,txt:'تغيّرت الحالة من «'+B87.ST[t.st]+'» إلى «'+B87.ST[ns]+'»'});t.st=ns;ch=true}
  if(nt){t.log.push({at:now,txt:'ملاحظة: '+nt});ch=true}
  if(!ch){msg('لا تغيير للحفظ.');return}
  t.log=t.log.slice(-100);t.updated=now;if(!b87save(all)){msg('تعذّر الحفظ في هذا المتصفح.');return}msg('تم حفظ التحديث.',1);b87detail(t.id);b87draw();return}
 if(k==='exj'){b87dl('bahr-b87-tasks.json','application/json',JSON.stringify(b87load(),null,2));return}
 if(k==='exc'){var H=['id','title','category','severity','verification','priority','status','source','created','updated'],rows=b87load().map(function(t){return[t.id,t.title,B87.CAT[t.cat],B87.SEV[t.sev],B87.CF[t.cf],B87.PR[t.pri],B87.ST[t.st],t.src,t.created,t.updated].map(b87csvq).join(',')});b87dl('bahr-b87-tasks.csv','text/csv;charset=utf-8','\ufeff'+H.join(',')+'\n'+rows.join('\n'))}});

document.addEventListener('click',function(e){var b=e.target.closest('#adm [data-b85]');if(!b)return;var k=b.dataset.b85;if(k==='run')return p85run();if(k==='csv')return p85csv();if(k==='qa'){var n=document.querySelector('#adsub button[data-t="qa"]');if(n)n.click()}});
/* ===== B74: إدارة الحسابات (b74_accounts.sql). المدير العام فقط؛ كل الكتابة عبر دوال خادم تسجّل في b74_audit. لا حذف فعلي لأي حساب أو بيانات ===== */
var B74S={u:null};
function acctc(){ld();if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>إدارة الحسابات</h2><p class="adE">هذه الصفحة للمدير العام فقط.</p>';return}
 var c=sbc(),Q=function(p){return p.then(function(r){return r},function(e){return{error:e}})};
 users().then(function(){return Promise.all([Q(c.from('b74_suspensions').select('user_id,reason,suspended_at')),Q(c.from('b74_deletion_requests').select('*').order('created_at',{ascending:false}).limit(100)),Q(c.from('b74_audit').select('*').order('created_at',{ascending:false}).limit(100))])}).then(function(a){
  if(a[0].error){E('adm').innerHTML='<h2>إدارة الحسابات وطلبات الحذف</h2><p class="adE er">غير مفعّل على الخادم: طبّق b74_accounts.sql أولاً.</p>';return}
  var SU={};(a[0].data||[]).forEach(function(x){SU[x.user_id]=x});B74S.su=SU;
  var DR=(a[1].data||[]),AUD=a[2].data||[],UM=AD.um||{},nm=function(id){var u=UM[id];return u?X(u.full_name||'—')+' <bdi>'+X(u.email||'')+'</bdi>':idt(id)};
  var DS={pending:'بانتظار المراجعة',in_review:'قيد المراجعة',approved:'موافَق عليه (معالجة يدوية)',rejected:'مرفوض',cancelled:'ألغاه المستخدم'},AL={suspend:'تعطيل حساب',unsuspend:'إعادة تفعيل حساب',deletion_requested:'طلب حذف',deletion_cancelled:'إلغاء طلب حذف',deletion_in_review:'طلب حذف: قيد المراجعة',deletion_approved:'طلب حذف: موافقة',deletion_rejected:'طلب حذف: رفض'};
  E('adm').innerHTML='<h2>إدارة الحسابات وطلبات الحذف</h2><p class="adE" style="padding:0 0 10px;text-align:start">التعطيل يمنع الحساب من <b>إنشاء</b> إعلانات وطلبات ومحادثات ومراجعات جديدة (يفرضه الخادم)، ويبقى الدخول والقراءة والدعم. لا يُحذف أي حساب أو بيانات من هنا. تقييد نشر الإعلانات الموجود يبقى في «المستخدمون والحسابات».</p><div id="b74p"></div><h3>الحسابات</h3><div id="b74u"></div><h3>طلبات حذف الحساب</h3><div id="b74d"></div><h3>سجل إجراءات الحسابات</h3><div id="b74a"></div>';
  tbl(E('b74u'),[{k:'full_name',t:'الاسم',h:function(x){return X(x.full_name||'—')}},{k:'email',t:'البريد',h:function(x){return '<bdi>'+X(x.email||'')+'</bdi>'}},{k:'created_at',t:'الانضمام',h:function(x){return fd(x.created_at)}},{k:'st',t:'الحالة',v:function(x){return x.is_admin?'مدير':SU[x.id]?'معطّل':'نشط'},h:function(x){return x.is_admin?'<span class="bd in_progress">مدير</span>':SU[x.id]?'<span class="bd rejected">معطّل</span>':'نشط'}},{k:'id',t:'',s:false,h:function(x){return x.is_admin?'—':'<button class="ab pr" data-b74u="'+X(x.id)+'" type="button">إجراء</button>'}}],AD.users||[],{ps:10});
  tbl(E('b74d'),[{k:'created_at',t:'التاريخ',h:function(x){return fd(x.created_at)}},{k:'user_id',t:'الحساب',h:function(x){return nm(x.user_id)}},{k:'status',t:'الحالة',h:function(x){return X(DS[x.status]||x.status)}},{k:'reason',t:'سبب المستخدم',h:function(x){return X(x.reason||'—')}},{k:'id',t:'',s:false,h:function(x){return(x.status==='pending'||x.status==='in_review')?'<button class="ab pr" data-b74r="'+X(x.id)+'" type="button">معالجة</button>':X(x.admin_note||'')}}],DR,{q:false,empty:'لا توجد طلبات حذف.'});
  tbl(E('b74a'),[{k:'created_at',t:'الوقت',h:function(x){return fd(x.created_at)}},{k:'action',t:'الإجراء',h:function(x){return X(AL[x.action]||x.action)}},{k:'actor',t:'المنفّذ',h:function(x){return nm(x.actor)}},{k:'target',t:'الحساب',h:function(x){return nm(x.target)}},{k:'reason',t:'السبب'}],AUD,{q:false,ps:15,empty:'لا إجراءات مسجّلة بعد.'});
  if(window.B83G){var gb=document.querySelector('[data-b74u="'+window.B83G+'"]');window.B83G=null;if(gb)gb.click()}
 }).catch(function(e){er('تعذّر تحميل إدارة الحسابات: '+(e.message||e),acctc)})}
E('adm').addEventListener('click',function(e){var u=e.target.closest('[data-b74u]'),r=e.target.closest('[data-b74r]'),a=e.target.closest('[data-b74x]'),P=E('b74p');if(!u&&!r&&!a)return;
 if(u){var id=u.dataset.b74u,x=(AD.um||{})[id]||{},sp=!!(B74S.su&&B74S.su[id]);P.innerHTML='<div class="adrc"><b>'+X(x.full_name||'—')+'</b> <bdi>'+X(x.email||'')+'</bdi><div>الحالة: '+(sp?'معطّل — '+X(B74S.su[id].reason):'نشط')+'</div><textarea id="b74n" maxlength="500" placeholder="السبب (إلزامي، 5 أحرف على الأقل، يُسجَّل)"></textarea><button class="ab '+(sp?'pr':'no')+'" data-b74x="s|'+X(id)+'|'+(sp?'0':'1')+'" type="button">'+(sp?'إعادة تفعيل الحساب':'تعطيل الحساب')+'</button></div>';P.scrollIntoView();return}
 if(r){var rid=r.dataset.b74r;P.innerHTML='<div class="adrc"><b>معالجة طلب حذف</b><p class="adE" style="text-align:start">«موافقة» تعني قبول الطلب للمعالجة اليدوية فقط؛ لا يُحذف شيء تلقائياً، وتبقى السجلات المالية وسجلات التدقيق.</p><textarea id="b74n" maxlength="500" placeholder="ملاحظة القرار (إلزامية، تُعرض للمستخدم)"></textarea>'+[['in_review','قيد المراجعة'],['approved','موافقة للمعالجة اليدوية'],['rejected','رفض']].map(function(s){return '<button class="ab" data-b74x="d|'+X(rid)+'|'+s[0]+'" type="button">'+s[1]+'</button> '}).join('')+'</div>';P.scrollIntoView();return}
 if(a.disabled)return;var q=a.dataset.b74x.split('|'),n=(E('b74n').value||'').trim();
 if(n.length<5||n.length>500||/[<>]/.test(n)){msg('اكتب السبب (5 إلى 500 حرف، بدون < أو >).');return}
 var p,t=q[0]==='s';if(t){var sus=q[2]==='1';if(!confirm(sus?'تعطيل هذا الحساب؟ سيُمنع من إنشاء محتوى جديد.':'إعادة تفعيل الحساب؟'))return;p=sbc().rpc('b74_admin_set_suspension',{p_user:q[1],p_suspend:sus,p_reason:n})}
 else{if(!confirm('تنفيذ القرار؟ سيظهر للمستخدم ويُسجَّل.'))return;p=sbc().rpc('b74_admin_decide_deletion',{p_id:q[1],p_status:q[2],p_note:n})}
 a.disabled=true;p.then(function(r){if(!r.error&&t){var want=q[2]==='1';return sbc().from('b74_suspensions').select('user_id').eq('user_id',q[1]).maybeSingle().then(function(v){a.disabled=false;if(v.error||!!v.data!==want){msg('لم يتأكد التنفيذ من الخادم. افتح الصفحة وتحقق من حالة الحساب قبل إعادة المحاولة.');acctc();return}msg('تم التنفيذ وتأكّد من الخادم وسُجّل.',1);acctc()})}a.disabled=false;if(r.error){var m=String(r.error.message||'');msg('فشل: '+(/forbidden/.test(m)?'غير مصرح.':/target_admin|self_action/.test(m)?'لا يمكن تنفيذ الإجراء على حساب مدير أو حسابك.':/not_open/.test(m)?'الطلب لم يعد مفتوحاً.':'حاول مرة ثانية.'));return}msg('تم التنفيذ وسُجّل.',1);acctc()},function(){a.disabled=false;msg('انقطع الاتصال. أعد المحاولة.')})});
E('ad').addEventListener('click',function(e){var t=e.target,b;
  if((b=t.closest('#adn .ads')))return secGo(b.dataset.s);
  if((b=t.closest('#adsub button[data-t]')))return show(b.dataset.t);
  if((b=t.closest('[data-ck]'))){AD.f[b.dataset.ck]=b.dataset.cv;return show(AD.tab)}
  if((b=t.closest('[data-ad]'))){return openAd(b.dataset.ad)}
  if((b=t.closest('[data-u]:not(body)'))){return openU(b.dataset.u)}
  if((b=t.closest('[data-do]'))){return doAd(b)}
  if((b=t.closest('[data-rp]'))){return doRp(b)}
  if((b=t.closest('[data-rs]'))){return doRs(b)}
  if(t.closest('[data-xc]')||t===E('adx'))closeM()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});

/* ===== ADM8: مركز المالية والإيرادات والترويج المدفوع. واجهة قراءة فقط.
   المصدر الفعلي الوحيد: جدول b55_payments (باقات المنشورات، دفع يدوي تراجعه الإدارة).
   لا كتابة في قاعدة البيانات، لا SQL، لا بوابة دفع. الترويج والحملات والطلبات والرعاة: واجهة فقط بلا تخزين.
   الوصول: المدير العام (platform_admin) فقط. الحماية الحقيقية في الخادم عبر RLS. ===== */
var F8={p:'all',from:'',to:'',st:'',D:null,at:0,V:{}};
var F8ST={awaiting_payment:'بانتظار الدفع',pending_review:'بانتظار المراجعة',need_info:'يحتاج معلومات',approved:'محصّل (مقبول)',rejected:'مرفوض'};
var F8PL={approved:'ok',rejected:'bad',pending_review:'warn',need_info:'warn',awaiting_payment:'na'};
var F8TY='باقة منشورات (B55)';
function f8nf(n){return Number(n||0).toLocaleString('en-US')}
function f8m(n){return f8nf(n)+' د.ع'}
function f8pill(k,t){return '<span class="b88p b88p-'+k+'">'+X(t)+'</span>'}
function f8p2(n){return n<10?'0'+n:''+n}
function f8gate(t){if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>'+X(t)+'</h2><p class="adE">البيانات المالية للمدير العام فقط، ولا تُعرض تلقائياً لبقية موظفي الإدارة.</p>';return false}return true}
function f8em(e){var c=String(e&&e.code||''),m=String(e&&e.message||e||'');if(c==='42P01'||c==='PGRST205')return 'جدول المدفوعات (b55_payments) غير موجود على الخادم بعد.';if(c==='42501'||/permission|row-level/i.test(m))return 'لا تملك صلاحية قراءة المدفوعات (RLS).';return 'تعذّر تحميل البيانات المالية: '+m}
function f8load(force){
 if(F8.D&&!force&&Date.now()-F8.at<60000)return Promise.resolve(F8.D);
 var c=sbc(),PG=1000,MX=5,rows=[],total=null;
 function pg(i){return c.from('b55_payments').select('*',{count:'exact'}).order('created_at',{ascending:false}).range(i*PG,i*PG+PG-1).then(function(r){if(r.error)throw r.error;if(i===0)total=r.count;var d=r.data||[];rows=rows.concat(d);if(d.length===PG&&i+1<MX)return pg(i+1)})}
 return pg(0).then(function(){F8.D={rows:rows,total:total==null?rows.length:total,part:total!=null&&rows.length<total};F8.at=Date.now();return F8.D})}
function f8sod(d){var x=new Date(d);x.setHours(0,0,0,0);return x}
function f8rng(){var n=new Date(),p=F8.p,eod=f8sod(n).getTime()+864e5-1;
 if(p==='today')return{a:f8sod(n).getTime(),b:eod};
 if(p==='week'){var d=f8sod(n);d.setDate(d.getDate()-6);return{a:d.getTime(),b:eod}}
 if(p==='month'){var m=f8sod(n);m.setDate(1);return{a:m.getTime(),b:eod}}
 if(p==='custom'){var a=F8.from?new Date(F8.from+'T00:00:00').getTime():NaN,b=F8.to?new Date(F8.to+'T23:59:59.999').getTime():NaN;if(isNaN(a)||isNaN(b)||a>b)return{bad:true};return{a:a,b:b}}
 return null}
function f8inr(rows,rg){if(!rg)return rows;if(rg.bad)return[];return rows.filter(function(r){var t=new Date(r.created_at).getTime();return t>=rg.a&&t<=rg.b})}
function f8sum(L){var s={ap:0,apN:0,pr:0,prN:0,ni:0,niN:0,aw:0,awN:0,rj:0,rjN:0,oth:0};L.forEach(function(r){var a=Number(r.amount_iqd)||0,t=r.status;
 if(t==='approved'){s.ap+=a;s.apN++}else if(t==='pending_review'){s.pr+=a;s.prN++}else if(t==='need_info'){s.ni+=a;s.niN++}else if(t==='awaiting_payment'){s.aw+=a;s.awN=(s.awN||0)+1}else if(t==='rejected'){s.rj+=a;s.rjN++}else s.oth++});s.awN=s.awN||0;return s}
function f8rlabel(rg){if(!rg)return 'كل الفترات';if(rg.bad)return 'فترة مخصصة غير صالحة';var f=function(t){return new Date(t).toLocaleDateString('ar-IQ',{dateStyle:'medium'})};return f(rg.a)+' — '+f(rg.b)}
function f8bar(){var P={today:'اليوم',week:'آخر 7 أيام',month:'هذا الشهر',all:'كل الفترات',custom:'فترة مخصصة'};
 return '<div class="adc" role="group" aria-label="الفترة الزمنية">'+Object.keys(P).map(function(k){return '<button type="button" data-f8p="'+k+'" class="'+(F8.p===k?'on':'')+'">'+P[k]+'</button>'}).join('')+'<button type="button" data-f8r="1" class="ab" title="إعادة قراءة البيانات من الخادم">تحديث</button></div>'
 +(F8.p==='custom'?'<div class="adbs" style="margin:0 0 12px"><label class="ab" style="display:inline-flex;gap:6px;align-items:center">من <input type="date" id="f8a" value="'+X(F8.from)+'"></label><label class="ab" style="display:inline-flex;gap:6px;align-items:center">إلى <input type="date" id="f8b" value="'+X(F8.to)+'"></label><button type="button" class="ab pr" data-f8ap="1">تطبيق</button></div>':'')}
function f8note(D){return (D.part?'<p class="b89n" style="border-color:#f0dc9b">'+f8pill('warn','أرقام جزئية')+' قُرئ '+f8nf(D.rows.length)+' من أصل '+f8nf(D.total)+' عملية، فالمجاميع أدناه أقل من الحقيقة. ضيّق الفترة أو راجع الخادم.</p>':'')}
function f8src(){return '<details class="b89n"><summary>مصدر الأرقام وحدودها</summary><ul class="b87lg"><li><b>المصدر:</b> جدول <bdi>b55_payments</bdi> فقط (باقات المنشورات بتحويل يدوي). لا يوجد في المنصة نظام ترويج أو حملات أو رعاية أو استرداد يسجّل مبالغ.</li><li><b>المحصّل:</b> العمليات بحالة «مقبول» فقط. المعلّق والمرفوض وبانتظار الدفع لا يدخل في الإجمالي.</li><li><b>تاريخ العملية:</b> تاريخ إنشاء الطلب. لا يُعتمد تاريخ القبول لأنه غير مؤكد في الواجهة، فقد يقع قبول طلب قديم في فترة لاحقة.</li><li><b>العملة:</b> دينار عراقي. القراءة بصلاحية حسابك، وقد تقيّدها RLS.</li><li>لا تُنفَّذ هنا أي موافقة أو رفض أو تحصيل. القرارات تبقى في صفحة «مراجعة المدفوعات».</li></ul></details>'}
function f8k(l,v,o){o=o||{};return '<div>'+X(l)+'<b'+(o.s?' style="font-size:'+o.s+'"':'')+'>'+v+'</b>'+(o.n?'<small style="display:block;margin-top:4px">'+X(o.n)+'</small>':'')+'</div>'}
function f8na(l,why){return f8k(l,'غير متاح',{s:'16px',n:why})}
function f8head(t,tag){return '<h2>'+X(t)+' '+(tag||'')+'</h2>'}
function f8fail(t,fn){return function(e){er(f8em(e),fn)}}

/* 1) ملخص الإيرادات */
function f8grp(L,rg){var byDay=rg&&!rg.bad&&(rg.b-rg.a)<=62*864e5,M={};
 L.forEach(function(r){var d=new Date(r.created_at),k=d.getFullYear()+'-'+f8p2(d.getMonth()+1)+(byDay?'-'+f8p2(d.getDate()):'');var g=M[k]=M[k]||[];g.push(r)});
 return Object.keys(M).sort().reverse().map(function(k){return{k:k,s:f8sum(M[k]),n:M[k].length}})}
function f8cmp(D,rg,s){
 if(!rg||rg.bad)return '<p class="adE" style="padding:0;text-align:start">المقارنة تحتاج فترة محددة (اليوم أو الأسبوع أو الشهر أو مخصصة).</p>';
 var len=rg.b-rg.a,pv={a:rg.a-len,b:rg.a-1},min=D.rows.reduce(function(m,r){var t=new Date(r.created_at).getTime();return t<m?t:m},Infinity);
 if(D.part||min>pv.a)return '<p class="adE" style="padding:0;text-align:start">'+f8pill('na','غير متاحة')+' المقارنة غير ممكنة لأن البيانات المقروءة لا تغطي كامل الفترة السابقة ('+X(f8rlabel(pv))+')'+(D.part?'، والقراءة جزئية':'، وأقدم عملية مسجّلة أحدث من بدايتها')+'.</p>';
 var ps=f8sum(f8inr(D.rows,pv)),d=s.ap-ps.ap,pc=ps.ap>0?Math.round(d/ps.ap*100):null;
 return '<div class="adk">'+f8k('المحصّل في الفترة الحالية',f8m(s.ap),{s:'20px',n:s.apN+' عملية'})+f8k('المحصّل في الفترة السابقة',f8m(ps.ap),{s:'20px',n:ps.apN+' عملية · '+f8rlabel(pv)})+f8k('الفرق',(d>0?'+':'')+f8m(d),{s:'20px',n:pc==null?'لا نسبة: الفترة السابقة صفر':(pc>0?'+':'')+pc+'%'})+'</div>'}
function f8sumPage(){
 if(!f8gate('ملخص الإيرادات'))return;ld();
 f8load().then(function(D){var rg=f8rng(),L=f8inr(D.rows,rg),s=f8sum(L),G=f8grp(L,rg),mx=G.reduce(function(m,g){return Math.max(m,g.s.ap)},0);
  E('adm').innerHTML=f8head('ملخص الإيرادات',f8pill('na','قراءة فقط · B55'))+f8bar()+'<p class="adE" style="padding:0 0 8px;text-align:start">الفترة: <b>'+X(f8rlabel(rg))+'</b> · '+f8nf(L.length)+' عملية</p>'+f8note(D)
  +(rg&&rg.bad?'<p class="adE er">حدّد تاريخ بداية ونهاية صحيحين ثم اضغط «تطبيق».</p>':'')
  +'<h3>المحصّل فعلاً</h3><div class="adk">'+f8k('إجمالي الإيرادات المحصلة',f8m(s.ap),{s:'24px',n:s.apN+' عملية مقبولة'})+f8k(F8TY,f8m(s.ap),{s:'20px',n:'المصدر الوحيد المربوط حالياً'})
  +f8na('إيرادات الترويج المدفوع','لا يوجد نظام ترويج مدفوع مربوط.')+f8na('إيرادات الإعلانات المميزة','لا يوجد تمييز إعلانات ولا دفع مرتبط به.')+f8na('إيرادات الرعاية التجارية','لا توجد اتفاقات رعاية ولا تحصيل.')+f8na('إيرادات الخدمات الاختيارية','لم تُفعَّل خدمات اختيارية مدفوعة.')+f8na('المبالغ المستردة','لا يوجد نظام استرداد يسجّل مبالغ.')+'</div>'
  +'<h3>غير محصّل (لا يدخل في الإجمالي)</h3><div class="adk">'+f8k('بانتظار المراجعة',f8m(s.pr),{s:'20px',n:s.prN+' عملية أُرسل إثباتها'})+f8k('يحتاج معلومات',f8m(s.ni),{s:'20px',n:s.niN+' عملية'})+f8k('بانتظار الدفع',f8m(s.aw),{s:'20px',n:s.awN+' طلب لم يُرسل إثبات'})+f8k('مرفوضة (فاشلة)',f8m(s.rj),{s:'20px',n:s.rjN+' عملية'})+'</div>'
  +(s.oth?'<p class="adE er" style="text-align:start">'+f8nf(s.oth)+' عملية بحالة غير معروفة للواجهة ولم تُحتسب في أي بطاقة.</p>':'')
  +'<h3>الإيرادات حسب الفترة</h3>'+(G.length?'<div class="adtw"><table class="adt adt-r"><thead><tr><th>'+((rg&&!rg.bad&&(rg.b-rg.a)<=62*864e5)?'اليوم':'الشهر')+'</th><th>المحصّل</th><th>عمليات مقبولة</th><th>معلّقة</th><th>مرفوضة</th></tr></thead><tbody>'+G.map(function(g){var w=mx>0?Math.round(g.s.ap/mx*100):0,pend=g.s.prN+g.s.niN+g.s.awN;return '<tr><td data-l="الفترة"><bdi dir="ltr">'+X(g.k)+'</bdi></td><td data-l="المحصّل"><div class="f8b"><i style="width:'+w+'%"></i></div>'+f8m(g.s.ap)+'</td><td data-l="عمليات مقبولة">'+g.s.apN+'</td><td data-l="معلّقة">'+pend+'</td><td data-l="مرفوضة">'+g.s.rjN+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="adE">'+(D.rows.length?'لا توجد عمليات ضمن هذه الفترة.':'لا توجد أي عمليات دفع مسجّلة بعد، فلا إيرادات لعرضها.')+'</p>')
  +'<h3>مقارنة بالفترة السابقة</h3>'+f8cmp(D,rg,s)+f8src()
 }).catch(f8fail('ملخص الإيرادات',f8sumPage))}

/* 2) خيارات الترويج: واجهة فقط، لا تخزين */
var F8OPT=[['إعلان مميز يظهر في مواضع بارزة','featured'],['إبراز إعلان داخل القسم المناسب','highlight'],['ترويج مؤقت بمدة محددة','timed'],['ظهور ضمن محتوى الصفحة الرئيسية','home'],['حملات رعاية تجارية أو بانرات إعلانية','sponsor'],['خدمات تصوير أو إعداد إعلان احترافي','pro']];
function f8optForm(o){var d=' disabled aria-disabled="true"';
 return '<details class="adrc"><summary><b>'+X(o[0])+'</b> '+f8pill('na','غير مفعّلة')+(o[1]==='pro'?' '+f8pill('na','مؤجّلة: لم تقرر المنصة تقديمها'):'')+'</summary>'
 +'<div class="f8g"><label>اسم الخدمة<input'+d+' value="'+X(o[0])+'"></label><label>حالة التفعيل<select'+d+'><option>معطّلة</option></select></label><label>السعر (د.ع)<input'+d+' placeholder="لم تحدّد الإدارة سعراً"></label><label>مدة الترويج (أيام)<input'+d+' placeholder="غير محددة"></label><label>موضع الظهور<input'+d+' placeholder="غير محدد"></label><label>تاريخ البداية<input type="date"'+d+'></label><label>تاريخ النهاية<input type="date"'+d+'></label></div>'
 +'<label class="f8w">الوصف<textarea'+d+' rows="2" placeholder="لا وصف معتمد"></textarea></label><label class="f8w">شروط الخدمة وحدودها<textarea'+d+' rows="2" placeholder="لا شروط معتمدة"></textarea></label>'
 +'<p class="adE" style="padding:0;text-align:start">الحقول معطّلة: لا حفظ ولا تفعيل ولا تحصيل في هذه المرحلة.</p></details>'}
function f8promoPage(){
 if(!f8gate('خيارات الترويج'))return;
 E('adm').innerHTML=f8head('خيارات الترويج',f8pill('na','واجهة فقط'))
 +'<div class="b89n"><b>الحالة الفعلية:</b> لا يوجد جدول لخدمات الترويج، ولا دالة خادم تحفظ سعراً أو مدة أو موضعاً، ولا بوابة دفع. لذلك لا يمكن تعديل أو تفعيل أي خيار من هنا، ولا توجد أسعار معتمدة، ولا أي خدمة مدفوعة تعمل.</div>'
 +'<p class="adE" style="padding:0 0 8px;text-align:start">الهيكل أدناه يوضّح حقول الإدارة المطلوبة لكل خيار فقط.</p>'
 +F8OPT.map(f8optForm).join('')
 +'<div class="b89n"><b>المطلوب لاحقاً (خارج هذه المرحلة):</b> جدول خدمات ترويج + دالة إدارية تحفظ التعديل وتسجّله في التدقيق، ثم قرار بربط الدفع. لا يُنفَّذ SQL هنا.</div>'}

/* 3) الحملات: قائمة غير موجودة + معاينة محلية لا تُحفظ */
var F8CS={draft:'مسودة',scheduled:'مجدولة',active:'فعالة',paused:'متوقفة',ended:'منتهية'};
var F8POS=['مواضع بارزة','داخل قسم الإعلانات','الصفحة الرئيسية','بانر إعلاني'];
function f8url(u){try{var x=new URL(String(u||'').trim());return(x.protocol==='https:'||x.protocol==='http:')?x:null}catch(e){return null}}
function f8prevHtml(v){var w=[],now=Date.now(),a=v.a?new Date(v.a+'T00:00:00').getTime():NaN,b=v.b?new Date(v.b+'T23:59:59.999').getTime():NaN,iu=f8url(v.i),du=f8url(v.d);
 if(!v.n.trim())w.push('اسم الحملة ناقص.');if(!v.s.trim())w.push('الجهة الراعية ناقصة.');if(!v.i.trim())w.push('لا توجد صورة أو مادة للحملة.');else if(!iu)w.push('رابط الصورة غير صالح (يجب http أو https).');
 if(!v.d.trim())w.push('رابط الوجهة ناقص.');else if(!du)w.push('رابط الوجهة غير صالح (يجب http أو https).');
 if(!v.p)w.push('موضع العرض غير محدد.');if(!v.r.trim())w.push('الجهة المسؤولة عن الإعلان غير مذكورة.');
 if(isNaN(a)||isNaN(b))w.push('تاريخ البداية أو النهاية ناقص.');else{if(b<a)w.push('تاريخ النهاية قبل البداية.');else if(b<now)w.push('انتهت مدة الحملة بالفعل.');else if(b-now<3*864e5)w.push('تنتهي المدة خلال أقل من 3 أيام.');
  if(v.st==='active'&&b<now)w.push('الحالة «فعالة» لكن المدة منتهية.');if(v.st==='active'&&a>now)w.push('الحالة «فعالة» لكن البداية في المستقبل.');if(v.st==='scheduled'&&a<now&&b>=now)w.push('الحالة «مجدولة» لكن المدة بدأت فعلاً.')}
 var vis=v.st==='draft'?'المسودة لا تظهر للزوار.':'هذه معاينة محلية فقط: لا تُنشر ولا تظهر للزوار لأن نظام الحملات غير منفّذ.';
 return '<div class="f8pv"><div class="f8im">'+(iu?'<img alt="" referrerpolicy="no-referrer" loading="lazy" src="'+X(iu.href)+'">':'<span>لا صورة</span>')+'</div><div class="f8bd"><b>'+X(v.n||'اسم الحملة')+'</b><small>'+(v.s.trim()?'برعاية: '+X(v.s):'جهة راعية غير محددة')+'</small>'+f8pill(v.st==='active'?'ok':(v.st==='ended'?'bad':(v.st==='draft'?'na':'warn')),F8CS[v.st]||v.st)+'<small>الموضع: '+X(v.p||'—')+'</small><small>الوجهة: <bdi dir="ltr">'+X(du?du.host:'—')+'</bdi></small><small>المدة: '+X(v.a||'—')+' ← '+X(v.b||'—')+'</small></div></div><p class="adE" style="padding:6px 0 0;text-align:start">'+X(vis)+'</p>'
 +(w.length?'<ul class="b87lg">'+w.map(function(x){return '<li>⚠ '+X(x)+'</li>'}).join('')+'</ul>':'<p class="adE" style="padding:0;text-align:start">'+f8pill('ok','البيانات مكتملة')+' لا تنبيهات.</p>')}
function f8prevRead(){var g=function(i){var e=E(i);return e?e.value:''};return{n:g('f8cn'),s:g('f8cs'),i:g('f8ci'),p:g('f8cp'),d:g('f8cd'),a:g('f8ca'),b:g('f8cb'),st:g('f8cst')||'draft',r:g('f8cr')}}
function f8prevDraw(){var h=E('f8pvh');if(!h)return;h.innerHTML=f8prevHtml(f8prevRead());var im=h.querySelector('.f8im img');if(im)im.onerror=function(){this.replaceWith(Object.assign(document.createElement('span'),{textContent:'تعذّر تحميل الصورة'}))}}
function f8campPage(){
 if(!f8gate('الحملات والإعلانات الممولة'))return;
 E('adm').innerHTML=f8head('الحملات والإعلانات الممولة',f8pill('na','واجهة فقط'))
 +'<div class="b89n"><b>الحالة الفعلية:</b> لا يوجد جدول حملات ولا مواضع إعلانية ولا تتبع ظهور أو نقرات. لذلك لا توجد حملات محفوظة، ولا أرقام ظهور أو نقرات، ولا حملة تظهر للزوار.</div>'
 +'<h3>الحملات المسجّلة</h3><p class="adE">غير متاح: لم يُنفَّذ نظام الحملات بعد، فلا توجد قائمة. الحالات المخطّطة: '+Object.keys(F8CS).map(function(k){return f8pill('na',F8CS[k])}).join(' ')+'</p>'
 +'<h3>معاينة محلية للحملة</h3><p class="adE" style="padding:0 0 8px;text-align:start">أداة للتأكد من اكتمال البيانات وشكل الحملة قبل أن يوجد نظام نشر. ما تكتبه هنا لا يُحفظ ولا يُرسل لأي مكان، ويضيع عند إعادة تحميل الصفحة.</p>'
 +'<div class="f8c"><form id="f8cf" onsubmit="return false" class="f8g" autocomplete="off"><label>اسم الحملة<input id="f8cn" maxlength="80"></label><label>الجهة الراعية<input id="f8cs" maxlength="80"></label><label>رابط الصورة<input id="f8ci" dir="ltr" inputmode="url" placeholder="https://"></label><label>رابط الوجهة<input id="f8cd" dir="ltr" inputmode="url" placeholder="https://"></label><label>موضع العرض<select id="f8cp"><option value="">اختر</option>'+F8POS.map(function(p){return '<option>'+X(p)+'</option>'}).join('')+'</select></label><label>الحالة<select id="f8cst">'+Object.keys(F8CS).map(function(k){return '<option value="'+k+'">'+F8CS[k]+'</option>'}).join('')+'</select></label><label>تاريخ البداية<input type="date" id="f8ca"></label><label>تاريخ النهاية<input type="date" id="f8cb"></label><label class="f8w">الجهة المسؤولة عن الإعلان<input id="f8cr" maxlength="80"></label></form><div id="f8pvh" aria-live="polite"></div></div>'
 +'<div class="b89n"><b>المطلوب لاحقاً:</b> جدول حملات، مواضع، رفع مواد، وتتبع ظهور ونقرات بدالة خادم. إلى أن يوجد ذلك لا تُعرض أي نتائج حملات.</div>';f8prevDraw()}

/* 4) السجل المالي */
function f8view(r,U){var u=U&&U[r.user_id],nm=u?(u.full_name||u.email||''):'';var o={id:r.id,ref:r.ref_code||'—',t:new Date(r.created_at).getTime(),dt:r.created_at,type:F8TY,rel:'غير مرتبطة',user:nm||(r.user_id?String(r.user_id).slice(0,8):'—'),amt:Number(r.amount_iqd)||0,st:r.status,tr:r.transfer_ref||'',pf:!!r.proof_path,posts:r.posts,note:r.reviewer_note||'',uid:r.user_id||''};return o}
function f8ledgerPage(){
 if(!f8gate('السجل المالي'))return;ld();
 Promise.all([f8load(),users().catch(function(){return[]})]).then(function(a){var D=a[0],rg=f8rng(),L=f8inr(D.rows,rg),U=AD.um||{};
  var s=f8sum(L),V=(F8.st?L.filter(function(r){return r.status===F8.st}):L).map(function(r){return f8view(r,U)});F8.V={};V.forEach(function(v){F8.V[v.id]=v});
  var chips='<div class="adc" role="group" aria-label="الحالة"><button type="button" data-f8s="" class="'+(F8.st===''?'on':'')+'">كل الحالات</button>'+Object.keys(F8ST).map(function(k){return '<button type="button" data-f8s="'+k+'" class="'+(F8.st===k?'on':'')+'">'+F8ST[k]+'</button>'}).join('')+'</div>';
  E('adm').innerHTML=f8head('السجل المالي',f8pill('na','قراءة فقط · B55'))+f8bar()+chips+f8note(D)
  +'<div class="adk">'+f8k('محصّل',f8m(s.ap),{s:'20px',n:s.apN+' عملية'})+f8k('معلّق (مراجعة + معلومات + بانتظار الدفع)',f8m(s.pr+s.ni+s.aw),{s:'20px',n:(s.prN+s.niN+s.awN)+' عملية'})+f8k('مرفوض',f8m(s.rj),{s:'20px',n:s.rjN+' عملية'})+f8k('مستردّ','غير متاح',{s:'16px',n:'لا يوجد نظام استرداد'})+'</div>'
  +'<p class="adE" style="padding:8px 0;text-align:start">الإعلان أو الحملة المرتبطة: الدفع الحالي يشتري باقة منشورات للحساب ولا يرتبط بإعلان أو حملة. «مرجع التحويل» رقم يدخله المستخدم يدوياً وليس رقماً من مزود دفع.</p>'
  +'<div id="f8t"></div><div id="f8dt" aria-live="polite"></div><p class="b15h"><a class="ab pr" href="#admpay">مراجعة المدفوعات وقراراتها</a></p>';
  tbl(E('f8t'),[{k:'ref',t:'رقم العملية',h:function(v){return '<bdi dir="ltr">'+X(v.ref)+'</bdi>'}},{k:'t',t:'التاريخ',h:function(v){return fd(v.dt)}},{k:'type',t:'نوع الخدمة'},{k:'rel',t:'الإعلان/الحملة'},{k:'user',t:'المستخدم',h:function(v){return '<bdi>'+X(v.user)+'</bdi>'}},{k:'amt',t:'المبلغ',h:function(v){return f8m(v.amt)}},{k:'st',t:'الحالة',h:function(v){return f8pill(F8PL[v.st]||'na',F8ST[v.st]||v.st)}},{k:'tr',t:'مرجع التحويل (يدوي)',h:function(v){return '<bdi dir="ltr">'+X(v.tr||'—')+'</bdi>'}},{k:'id',t:'',s:false,h:function(v){return '<button type="button" class="ab" data-f8d="'+X(v.id)+'">تفاصيل</button>'}}],V,{ps:15,empty:D.rows.length?'لا توجد عمليات ضمن الفلاتر الحالية.':'لا توجد أي عمليات دفع مسجّلة بعد. الربط المالي الوحيد الموجود هو باقات المنشورات، ولم تُنشأ فيه عمليات.'})
 }).catch(f8fail('السجل المالي',f8ledgerPage))}
function f8detail(id){var v=F8.V[id],h=E('f8dt');if(!v||!h)return;var R=function(k,x){return '<div class="acc-r"><span>'+X(k)+'</span><span>'+x+'</span></div>'};
 h.innerHTML='<div class="adrc"><b>تفاصيل العملية <bdi dir="ltr">'+X(v.ref)+'</bdi></b>'+R('التاريخ',X(fd(v.dt)))+R('نوع الخدمة',X(v.type)+' · '+f8nf(v.posts)+' منشور')+R('الإعلان/الحملة','غير مرتبطة (B55 لا يربط الدفع بإعلان)')+R('المستخدم','<bdi>'+X(v.user)+'</bdi> · <bdi dir="ltr">'+X(String(v.uid).slice(0,8))+'</bdi>')+R('المبلغ والعملة',X(f8m(v.amt))+' (دينار عراقي)')+R('الحالة',f8pill(F8PL[v.st]||'na',F8ST[v.st]||v.st)+(v.st==='approved'?' محصّلة':' غير محصّلة'))+R('مرجع التحويل (يدوي)','<bdi dir="ltr">'+X(v.tr||'—')+'</bdi>')+R('رقم مرجع مزود الدفع','غير متاح: لا يوجد مزود دفع إلكتروني')+R('إثبات الدفع',v.pf?'مرفوع (يُعرض من «مراجعة المدفوعات»)':'لا يوجد')+(v.note?R('ملاحظة الإدارة',X(v.note)):'')+'<div class="adbs"><button type="button" class="ab" data-f8d="">إغلاق</button></div></div>';h.scrollIntoView({block:'nearest'})}

/* 5) طلبات الترويج */
function f8reqPage(){
 if(!f8gate('طلبات الترويج'))return;
 var S=[['طلب الترويج','يرسله صاحب الإعلان'],['موافقة الإدارة','قرار مراجعة، وليست دفعاً'],['دفع مؤكد','يؤكَّد من سجل مالي فعلي'],['بدء الظهور','لا يبدأ قبل الدفع المؤكد']];
 E('adm').innerHTML=f8head('طلبات الترويج',f8pill('na','واجهة فقط'))
 +'<div class="b89n"><b>الحالة الفعلية:</b> لا يوجد جدول طلبات ترويج، ولا تستطيع الواجهة الحالية استقبال طلب ترويج أو سعراً معتمداً وقت الطلب. المعروض هنا هيكل فقط.</div>'
 +'<h3>الطلبات</h3><p class="adE">غير متاح: لم يُنفَّذ نظام طلبات الترويج، فلا توجد قائمة.</p>'
 +'<h3>أربع مراحل منفصلة</h3><ol class="f8st">'+S.map(function(x,i){return '<li><span>'+(i+1)+'</span><b>'+X(x[0])+'</b><small>'+X(x[1])+'</small></li>'}).join('')+'</ol><p class="adE" style="padding:0;text-align:start">موافقة الإدارة على طلب لا تعني أنه مدفوع، ولا تعني أن الإعلان بدأ بالظهور.</p>'
 +'<h3>الحقول المطلوبة لكل طلب</h3><ul class="b87lg"><li>صاحب الطلب والإعلان المرتبط</li><li>نوع الترويج المطلوب</li><li>المدة والموضع المطلوبان</li><li>السعر المعتمد وقت الطلب (إن حُفظ)</li><li>حالة الطلب</li><li>ملاحظات الإدارة</li></ul>'
 +'<div class="b89n"><b>المطلوب لاحقاً:</b> جدول طلبات ودوال قرار مسجّلة في التدقيق وربط بالسجل المالي. عمليات باقات المنشورات الحالية تُراجَع من «مراجعة المدفوعات» ولا تُعد طلبات ترويج.</div>'}

/* 6) الرعاة والشركاء */
function f8spPage(){
 if(!f8gate('الرعاة والشركاء'))return;
 E('adm').innerHTML=f8head('الرعاة والشركاء التجاريون',f8pill('na','واجهة فقط'))
 +'<div class="b89n"><b>الحالة الفعلية:</b> لا يوجد جدول رعاة أو اتفاقات. لا توجد عقود أو قيم اتفاق مسجّلة، وأي قيمة اتفاق غير محصّلة لن تُحسب إيراداً فعلياً.</div>'
 +'<h3>الجهات الراعية</h3><p class="adE">غير متاح: لم يُنفَّذ هذا القسم بعد، فلا توجد قائمة.</p>'
 +'<h3>الحقول المطلوبة لكل جهة</h3><ul class="b87lg"><li>اسم الجهة وبيانات التواصل المصرّح بعرضها</li><li>الحملات المرتبطة</li><li>مدة الاتفاق</li><li>قيمة الاتفاق (إن سُجّلت فعلاً)</li><li>حالة الاتفاق</li><li>المواد الإعلانية والملاحظات</li></ul>'
 +'<p class="adE" style="padding:0;text-align:start">ملاحظة: الأنشطة التجارية المسجّلة (BAHR BUSINESS) ليست رعاة، ولا تُحوَّل إلى رعاة تلقائياً.</p>'
 +'<div class="b89n"><b>المطلوب لاحقاً:</b> جدول رعاة واتفاقات بصلاحية المدير العام فقط.</div>'}

/* 7) التقارير والتصدير */
function f8csvq(v){v=String(v==null?'':v);if(/^[=+\-@\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'}
function f8dl(name,rows){var txt='﻿'+rows.map(function(r){return r.map(f8csvq).join(',')}).join('\r\n'),a=document.createElement('a'),u=URL.createObjectURL(new Blob([txt],{type:'text/csv;charset=utf-8'}));a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},1000)}
function f8stamp(){var d=new Date();return d.getFullYear()+f8p2(d.getMonth()+1)+f8p2(d.getDate())}
function f8repPage(){
 if(!f8gate('التقارير والتصدير'))return;ld();
 f8load().then(function(D){var rg=f8rng(),L=f8inr(D.rows,rg),s=f8sum(L),G=f8grp(L,{a:0,b:Infinity});
  var pc={};L.forEach(function(r){var k=r.status;pc[k]=(pc[k]||0)+1});
  E('adm').innerHTML=f8head('التقارير والتصدير',f8pill('na','قراءة فقط · B55'))+f8bar()+f8note(D)+'<p class="adE" style="padding:0 0 8px;text-align:start">الفترة: <b>'+X(f8rlabel(rg))+'</b> · '+f8nf(L.length)+' عملية</p>'
  +'<h3>حسب نوع الإيراد والخدمة</h3><div class="adtw"><table class="adt adt-r"><thead><tr><th>النوع</th><th>المحصّل</th><th>عمليات مقبولة</th><th>معلّقة</th><th>مرفوضة</th></tr></thead><tbody><tr><td data-l="النوع">'+X(F8TY)+'</td><td data-l="المحصّل">'+f8m(s.ap)+'</td><td data-l="عمليات مقبولة">'+s.apN+'</td><td data-l="معلّقة">'+(s.prN+s.niN+s.awN)+'</td><td data-l="مرفوضة">'+s.rjN+'</td></tr><tr><td data-l="النوع">الترويج المدفوع · الإعلانات المميزة · الرعاية · الخدمات الاختيارية</td><td colspan="4">غير متاح: لا يوجد نظام مربوط</td></tr></tbody></table></div>'
  +'<h3>حسب الحملة</h3><p class="adE">غير متاح: لا توجد حملات في النظام.</p>'
  +'<h3>حسب الشهر (كل البيانات المقروءة)</h3>'+(G.length?'<div class="adtw"><table class="adt adt-r"><thead><tr><th>الشهر</th><th>المحصّل</th><th>مقبولة</th><th>معلّقة</th><th>مرفوضة</th></tr></thead><tbody>'+G.map(function(g){return '<tr><td data-l="الشهر"><bdi dir="ltr">'+X(g.k)+'</bdi></td><td data-l="المحصّل">'+f8m(g.s.ap)+'</td><td data-l="مقبولة">'+g.s.apN+'</td><td data-l="معلّقة">'+(g.s.prN+g.s.niN+g.s.awN)+'</td><td data-l="مرفوضة">'+g.s.rjN+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="adE">لا توجد عمليات لعرضها.</p>')
  +'<h3>تصدير CSV</h3><p class="adE" style="padding:0 0 8px;text-align:start">يُصدَّر ما تراه بصلاحية حسابك فقط. الملف لا يتضمن أسماء المستخدمين ولا معرّفاتهم ولا مرجع التحويل ولا مسارات الإثباتات ولا كلمات مرور أو مفاتيح. يُطلب تأكيد قبل كل تصدير.</p>'
  +'<div class="adbs"><button type="button" class="ab pr" data-f8x="tx"'+(L.length?'':' disabled')+'>تصدير العمليات ('+f8nf(L.length)+')</button><button type="button" class="ab" data-f8x="mo"'+(G.length?'':' disabled')+'>تصدير الملخص الشهري</button></div>'+f8src()
 }).catch(f8fail('التقارير والتصدير',f8repPage))}
function f8export(k){var D=F8.D;if((AD.roles||[]).indexOf('platform_admin')<0||!D)return;var rg=f8rng(),L=f8inr(D.rows,rg);
 if(k==='tx'){if(!L.length)return msg('لا عمليات لتصديرها ضمن الفترة.');if(!confirm('تصدير '+L.length+' عملية مالية إلى ملف CSV على جهازك؟'))return;
  f8dl('bahr-finance-transactions-'+f8stamp()+'.csv',[['ref_code','created_at','service_type','amount','currency','status']].concat(L.map(function(r){return[r.ref_code||'',r.created_at||'','post_package',Number(r.amount_iqd)||0,'IQD',r.status||'']})));msg('بدأ تنزيل الملف.',1)}
 if(k==='mo'){var G=f8grp(D.rows,{a:0,b:Infinity});if(!G.length)return msg('لا بيانات لتصديرها.');if(!confirm('تصدير الملخص الشهري إلى ملف CSV على جهازك؟'))return;
  f8dl('bahr-finance-monthly-'+f8stamp()+'.csv',[['month','collected_iqd','approved_count','pending_count','rejected_count']].concat(G.map(function(g){return[g.k,g.s.ap,g.s.apN,g.s.prN+g.s.niN+g.s.awN,g.s.rjN]})));msg('بدأ تنزيل الملف.'+(D.part?' تنبيه: البيانات جزئية.':''),1)}}
E('ad').addEventListener('click',function(e){var t=e.target,b;
 if((b=t.closest('[data-f8p]'))){F8.p=b.dataset.f8p;return show(AD.tab)}
 if((b=t.closest('[data-f8s]'))){F8.st=b.dataset.f8s;return show(AD.tab)}
 if(t.closest('[data-f8r]'))return f8load(true).then(function(){show(AD.tab)},function(x){msg(f8em(x))});
 if(t.closest('[data-f8ap]')){var a=E('f8a').value,c=E('f8b').value;if(!a||!c||a>c)return msg('حدّد تاريخ بداية ونهاية صحيحين (البداية قبل النهاية).');F8.from=a;F8.to=c;return show(AD.tab)}
 if((b=t.closest('[data-f8d]'))){var id=b.dataset.f8d;if(!id){E('f8dt').innerHTML='';return}return f8detail(id)}
 if((b=t.closest('[data-f8x]')))return f8export(b.dataset.f8x)});
E('adm').addEventListener('input',function(e){if(e.target.closest('#f8cf'))f8prevDraw()});
E('adm').addEventListener('change',function(e){if(e.target.closest('#f8cf'))f8prevDraw()});

/* ===== ADM9: مركز التحليلات والتسويق (قراءة فقط). يعتمد على بيانات المنصة الفعلية وحدها: b52_admin_stats وadmin_list_users وlistings وfavorites وmarine_services. لا جداول ولا دوال جديدة ولا كتابة في الخادم. ما لا يُقاس اليوم يظهر «غير متاح» مع المطلوب لتفعيله، ولا توجد أي أرقام تجريبية. المدير العام فقط (لا يوجد تبويب منها في ALLOW). ===== */
var A9={p:'7',from:'',to:'',cat:'',pv:'',st:'',nw:false,D:null,at:0,pub:null,pubErr:'',C:{n:'',code:'',plat:'facebook',ct:'post',dest:'#market',lid:'',a:'',b:'',st:'draft',note:''}};
var A9BG=108e5,A9DAY=864e5;
var A9ST={published:'منشور',pending:'بانتظار المراجعة',rejected:'مرفوض',suspended:'موقوف',archived:'متوقف'};
var A9PL={facebook:['فيسبوك','facebook','social'],instagram:['إنستغرام','instagram','social'],whatsapp:['واتساب','whatsapp','messaging'],partner:['شريك أو جهة راعية','partner','referral'],other:['منصة أو موقع آخر','other','referral']};
var A9CT={post:'منشور',story:'ستوري',video:'فيديو أو ريلز',ad:'إعلان ممول',message:'رسالة أو بث',banner:'بانر أو صورة',other:'أخرى'};
var A9CS={draft:'مسودة',scheduled:'مجدولة',active:'فعالة',paused:'متوقفة',ended:'منتهية'};
var A9DEST=[['#home','الصفحة الرئيسية'],['#market','السوق البحري'],['#services','الورش والخدمات'],['#parts','BAHR PARTS'],['#stores','المتاجر والموردون'],['#requests','أطلب اللي تحتاجه'],['#help','مركز المساعدة'],['ad','إعلان محدد']];
var A9SRC={direct:'زيارة مباشرة',search:'محركات البحث',facebook:'فيسبوك',instagram:'إنستغرام',whatsapp:'واتساب',other:'مواقع أخرى',unknown:'مصدر غير معروف'};
function a9n(v){return Number(v).toLocaleString('en-US')}
function a9nz(v){return v==null||v===''||isNaN(Number(v))?null:Number(v)}
function a9ds(t){return Math.floor((t+A9BG)/A9DAY)*A9DAY-A9BG}
function a9fdt(t){try{return new Date(t).toLocaleDateString('ar-IQ',{timeZone:'Asia/Baghdad',dateStyle:'medium'})}catch(e){return''}}
function a9fdd(x){try{return new Date(x).toLocaleDateString('ar-IQ',{timeZone:'Asia/Baghdad',dateStyle:'medium'})}catch(e){return''}}
function a9day(t){return new Date(t+A9BG).toISOString().slice(0,10)}
function a9inr(t,a,b){var x=t?Date.parse(t):NaN;return !isNaN(x)&&x>=a&&x<b}
function a9rng(){var n=Date.now(),e=a9ds(n)+A9DAY,p=A9.p;
 if(p==='1')return{a:e-A9DAY,b:e};if(p==='7')return{a:e-7*A9DAY,b:e};if(p==='30')return{a:e-30*A9DAY,b:e};
 var a=Date.parse(A9.from+'T00:00:00+03:00'),b=Date.parse(A9.to+'T00:00:00+03:00')+A9DAY;
 if(!A9.from||!A9.to||isNaN(a)||isNaN(b)||b<=a)return{bad:'اختر تاريخ بداية ونهاية صحيحين (النهاية لا تسبق البداية).'};
 if(b-a>366*A9DAY)return{bad:'الحد الأقصى للنطاق 366 يوماً.'};
 return{a:a,b:b}}
function a9key(){return A9.p+'|'+(A9.p==='c'?A9.from+'|'+A9.to:'')}
function a9err(e){var c=String(e&&e.code||''),m=String(e&&e.message||e||'');
 if(c==='42883'||c==='PGRST202'||c==='42P01'||c==='PGRST205')return 'المصدر غير موجود على الخادم أو لم يُفعَّل بعد.';
 if(c==='42501'||/forbidden|permission|row-level/i.test(m))return 'لا تملك صلاحية قراءة هذا المصدر (RLS أو صلاحية الدالة).';
 if(/bad_range/.test(m))return 'نطاق التاريخ غير صحيح (الحد الأقصى 366 يوماً).';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم.';
 return String(m).slice(0,140)||'خطأ غير معروف'}
function a9pages(mk,max){var PG=1000,rows=[],tot=null;max=max||5;
 function go(i){return mk().range(i*PG,i*PG+PG-1).then(function(r){if(r.error)throw r.error;if(i===0)tot=r.count;var d=r.data||[];rows=rows.concat(d);if(d.length===PG&&i+1<max)return go(i+1)})}
 return go(0).then(function(){return{rows:rows,total:tot==null?rows.length:tot,part:tot!=null&&rows.length<tot}})}
function a9catL(k){return A4CL[k]||k||'غير محدد'}
/* ---- تحميل البيانات (مخزّن دقيقة واحدة) ---- */
function a9load(force){
 var r=a9rng();if(r.bad)return Promise.reject({bad:r.bad});
 if(A9.D&&!force&&A9.D.key===a9key()&&Date.now()-A9.at<6e4)return Promise.resolve(A9.D);
 var c=sbc(),pr={a:r.a-(r.b-r.a),b:r.a},iso=function(t){return new Date(t).toISOString()},D={key:a9key(),r:r,pr:pr,E:{},S:null,SP:null,U:null,L:null,F:null,V:null};
 if(force)AD.users=null;
 var P=[
  b83Q(c.rpc('b52_admin_stats',{p_from:iso(r.a),p_to:iso(r.b)})).then(function(x){if(x.error)D.E.stats=a9err(x.error);else D.S=x.data}),
  b83Q(c.rpc('b52_admin_stats',{p_from:iso(pr.a),p_to:iso(pr.b)})).then(function(x){if(x.error)D.E.statsP=a9err(x.error);else D.SP=x.data}),
  users().then(function(u){D.U=u},function(e){D.E.users=a9err(e)}),
  a9pages(function(){return c.from('listings').select('*',{count:'exact'}).order('created_at',{ascending:false})},2).then(function(x){D.L=x},function(e){D.E.listings=a9err(e)}),
  a9pages(function(){return c.from('favorites').select('listing_id,created_at',{count:'exact'}).gte('created_at',iso(pr.a)).lt('created_at',iso(r.b)).order('created_at',{ascending:false})},5).then(function(x){D.F=x},function(e){D.E.favorites=a9err(e)}),
  a9pages(function(){return c.from('marine_services').select('id,province,area,status,created_at',{count:'exact'}).order('created_at',{ascending:false})},2).then(function(x){D.V=x},function(e){D.E.services=a9err(e)})];
 return Promise.all(P).then(function(){
  D.hasCreated=!!(D.U&&D.U.some(function(u){return u.created_at}));
  D.acc=D.U&&D.hasCreated?D.U.filter(function(u){return a9inr(u.created_at,r.a,r.b)}).map(function(u){return u.created_at}):null;
  D.accP=D.U&&D.hasCreated?D.U.filter(function(u){return a9inr(u.created_at,pr.a,pr.b)}).length:null;
  D.fav={};D.favN=null;D.favP=null;
  if(D.F){D.favN=0;D.favP=0;D.F.rows.forEach(function(f){if(a9inr(f.created_at,r.a,r.b)){D.favN++;if(f.listing_id)D.fav[f.listing_id]=(D.fav[f.listing_id]||0)+1}else if(a9inr(f.created_at,pr.a,pr.b))D.favP++})}
  D.prov={};if(D.L)D.L.rows.forEach(function(x){if(x.province)D.prov[x.province]=1});
  D.provs=Object.keys(D.prov).sort();
  D.Lfull=!!(D.L&&(!D.L.part||(D.L.rows.length&&Date.parse(D.L.rows[D.L.rows.length-1].created_at)<=r.a)));
  A9.D=D;A9.at=Date.now();return D})}
/* ---- مكونات الواجهة ---- */
function a9head(t,tag){return '<h2>'+X(t)+' '+(tag||'')+'</h2>'}
function a9sel(attr,label,opts,val){return '<label>'+X(label)+'<select data-a9f="'+attr+'">'+opts.map(function(o){return '<option value="'+X(o[0])+'"'+(String(val)===String(o[0])?' selected':'')+'>'+X(o[1])+'</option>'}).join('')+'</select></label>'}
function a9bar(D,f){var P={'1':'اليوم','7':'آخر 7 أيام','30':'آخر 30 يوماً','c':'فترة مخصصة'},r=a9rng(),h='';
 h+='<div class="adc" role="group" aria-label="الفترة الزمنية">'+Object.keys(P).map(function(k){return '<button type="button" data-a9="per" data-v="'+k+'" class="'+(A9.p===k?'on':'')+'">'+P[k]+'</button>'}).join('')+'</div>';
 if(A9.p==='c')h+='<div class="adbs" style="margin:0 0 12px"><label class="ab" style="display:inline-flex;gap:6px;align-items:center">من <input type="date" id="a9a" value="'+X(A9.from)+'"></label><label class="ab" style="display:inline-flex;gap:6px;align-items:center">إلى <input type="date" id="a9b" value="'+X(A9.to)+'"></label><button type="button" class="ab pr" data-a9="apply">تطبيق</button></div>';
 if(f&&D){var cats=[['','كل الأقسام']].concat(Object.keys(A4CL).map(function(k){return[k,A4CL[k]]})),pvs=[['','كل المحافظات']].concat((D.provs||[]).map(function(p){return[p,p]}));
  h+='<div class="a3f">'+a9sel('cat','القسم',cats,A9.cat)+a9sel('pv','المحافظة',pvs,A9.pv)+(f==='ads'?a9sel('st','حالة الإعلان',[['','كل الحالات']].concat(Object.keys(A9ST).map(function(k){return[k,A9ST[k]]})),A9.st)+'<label class="a9ck"><input type="checkbox" data-a9f="nw"'+(A9.nw?' checked':'')+'> جديدة في الفترة فقط</label>':'')+'</div>'}
 if(!r.bad)h+='<p class="adE" style="padding:0 0 6px;text-align:start">الفترة: من '+X(a9fdt(r.a))+' إلى '+X(a9fdt(r.b-A9DAY))+' (بتوقيت العراق). الفترة السابقة المماثلة للمقارنة: من '+X(a9fdt(r.a-(r.b-r.a)))+' إلى '+X(a9fdt(r.a-A9DAY))+'.</p>';
 if(D)h+='<p class="adE" style="padding:0 0 10px;text-align:start">آخر تحديث للبيانات: '+X(new Date(A9.at).toLocaleString('ar-IQ',{timeZone:'Asia/Baghdad',dateStyle:'medium',timeStyle:'short'}))+' <button type="button" class="ab" data-a9="refresh">تحديث</button></p>';
 return h}
function a9srcStatus(D){var L=[['stats','إحصائيات المنصة الحالية (b52_admin_stats)'],['statsP','إحصائيات الفترة السابقة (للمقارنة)'],['users','الحسابات (admin_list_users)'],['listings','الإعلانات (listings)'],['favorites','المفضلة (favorites)'],['services','الخدمات البحرية (marine_services)']],bad=L.filter(function(x){return D.E[x[0]]});
 return '<details class="b89n"'+(bad.length?' open':'')+'><summary>المصادر المقروءة: '+(L.length-bad.length)+' من '+L.length+(bad.length?' · تعذّر: '+X(bad.map(function(x){return x[1]}).join('، ')):'')+'</summary>'
  +'<ul class="b87lg">'+L.map(function(x){var e=D.E[x[0]];return '<li>'+(e?f8pill('bad','تعذّر'):f8pill('ok','مقروء'))+' '+X(x[1])+(e?': '+X(e):'')+'</li>'}).join('')
  +'</ul>'+(D.L&&D.L.part?'<p class="adE" style="padding:0;text-align:start"><b>الإعلانات:</b> قُرئ '+a9n(D.L.rows.length)+' من '+a9n(D.L.total)+' (الأحدث أولاً)، فالجداول المبنية على صفوف الإعلانات جزئية.</p>':'')
  +(D.F&&D.F.part?'<p class="adE" style="padding:0;text-align:start"><b>المفضلة:</b> قُرئ '+a9n(D.F.rows.length)+' من '+a9n(D.F.total)+' ضمن الفترتين، فأعداد المفضلة أقل من الواقع.</p>':'')+'</details>'}
function a9card(l,v,d,why){var na=v==null;return '<div'+(na?' class="a9na"':'')+'>'+X(l)+'<b>'+(na?'غير متاح':X(a9n(v)))+'</b><small>'+X(na&&why?why:d)+'</small></div>'}
function a9cmp(now,prev,ok){if(!ok||prev==null||now==null)return 'لا توجد بيانات كافية للمقارنة بالفترة السابقة.';if(!prev)return 'الفترة السابقة المماثلة: 0 (لا نسبة لأن القاعدة صفر).';var p=Math.round((now-prev)*100/prev);return 'الفترة السابقة المماثلة: '+a9n(prev)+' (\u200E'+(p>0?'+':'')+p+'%).'}
function a9cov(S){var first=S&&S.first_event_at;return first?'تسجيل المشاهدات في المنصة بدأ في '+a9fdt(Date.parse(first))+'.':'لم تُسجَّل أي مشاهدة بعد في المنصة.'}
function a9na(items){return '<div class="adk a9k">'+items.map(function(x){return '<div class="a9na">'+X(x[0])+'<b>غير متاح</b><small>'+X(x[1])+'</small></div>'}).join('')+'</div>'}
function a9chart(times,r,t){var days=Math.round((r.b-r.a)/A9DAY),m={},mx=0,i,tot=0,h='',arr=[];
 if(days<2)return '<p class="adE" style="padding:6px 0;text-align:start">المخطط اليومي يحتاج فترة يومين فأكثر.</p>';
 if(days>62)return '<p class="adE" style="padding:6px 0;text-align:start">المخطط اليومي يظهر للفترات حتى 62 يوماً.</p>';
 times.forEach(function(x){var d=a9day(Date.parse(x));m[d]=(m[d]||0)+1;tot++});
 if(!tot)return '<p class="adE" style="padding:6px 0;text-align:start">لا بيانات في هذه الفترة.</p>';
 for(i=0;i<days;i++){var d=a9day(r.a+i*A9DAY),n=m[d]||0;if(n>mx)mx=n;arr.push([d,n])}
 arr.forEach(function(x){h+='<i class="'+(x[1]?'':'z')+'" title="'+x[0]+': '+x[1]+'" style="height:'+Math.max(2,Math.round(x[1]*100/mx))+'%"></i>'});
 return '<div class="a9ch" role="img" aria-label="'+X(t)+'">'+h+'</div><small class="adE" style="padding:4px 0 0;display:block;text-align:start">أعلى يوم: '+mx+' · المجموع: '+tot+'</small>'}
function a9csv(name,rows,warn){if((AD.roles||[]).indexOf('platform_admin')<0)return;if(!confirm('تصدير '+(rows.length-1)+' صفاً إلى ملف CSV على جهازك؟'+(warn?'\n\nتنبيه: '+warn:'')))return;f8dl(name+'-'+f8stamp()+'.csv',rows);msg('بدأ تنزيل الملف.',1)}
function a9run(title,tag,f,body,after){if(!a9gate(title))return;
 if(!sbc()){E('adm').innerHTML=a9head(title,tag)+'<p class="adE">الاتصال بـ Supabase غير جاهز.</p>';return}
 ld();a9load(false).then(function(D){E('adm').innerHTML=a9head(title,tag)+a9bar(D,f)+a9srcStatus(D)+body(D);if(after)after(D)},function(e){E('adm').innerHTML=a9head(title,tag)+a9bar(null,0)+'<div class="adE er">'+X(e&&e.bad?e.bad:a9err(e))+'</div>'})}
function a9gate(t){if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>'+X(t)+'</h2><p class="adE">التحليلات والتسويق للمدير العام فقط.</p>';return false}return true}
function a9need(t,items){return '<div class="b89n"><b>'+X(t)+'</b><ul class="b87lg">'+items.map(function(x){return '<li>'+X(x)+'</li>'}).join('')+'</ul></div>'}
/* ---- 1) لوحة التحليلات الرئيسية ---- */
function a9kpis(D){var S=D.S,SP=D.SP,first=S&&S.first_event_at,vOK=!!(S&&SP&&first&&Date.parse(first)<=D.pr.a),ls=S&&S.listing_status||{},R=[];
 var vn=S?a9nz(S.views_period):null,ln=S?a9nz(S.listings_new):null,lp=SP?a9nz(SP.listings_new):null;
 R.push(['مشاهدات صفحات الإعلانات',vn,'مرات فتح تفاصيل الإعلانات وليست أشخاصاً فريدين. إعادة التحميل خلال 30 دقيقة في الجلسة نفسها لا تُحسب. '+a9cmp(vn,SP?a9nz(SP.views_period):null,vOK),D.E.stats]);
 R.push(['حسابات جديدة',D.acc?D.acc.length:null,'حسابات أُنشئت ضمن الفترة حسب تاريخ التسجيل. '+a9cmp(D.acc?D.acc.length:null,D.accP,D.hasCreated),D.E.users||'تاريخ إنشاء الحساب غير متوفر في بيانات الحسابات.']);
 R.push(['إعلانات جديدة في الفترة',ln,'إعلانات أُنشئت ضمن الفترة بأي حالة (ليست كلها منشورة). '+a9cmp(ln,lp,ln!=null&&lp!=null),D.E.stats]);
 R.push(['إعلانات منشورة الآن',S?a9nz(ls.published):null,'الظاهرة للعامة حالياً. لقطة آنية وليست رقماً للفترة.',D.E.stats]);
 R.push(['محادثات نشطة في الفترة',S?a9nz(S.convs_active):null,'محادثات آخر رسالة فيها ضمن الفترة. ليست استفسارات ناتجة عن إعلانات، ولا تُقارن بالفترة السابقة لأن «آخر رسالة» تتغير بمرور الوقت.',D.E.stats]);
 R.push(['حفظ إعلانات في المفضلة',D.favN,'مرات إضافة إعلانات للمفضلة ضمن الفترة، وهي إشارة اهتمام مستقلة وليست تواصلاً. '+a9cmp(D.favN,D.favP,D.F&&!D.F.part)+(D.F&&D.F.part?' الأرقام ناقصة (قراءة جزئية).':''),D.E.favorites]);
 return R}
var A9NA=[['عدد الزيارات','لا يوجد تسجيل لزيارات المنصة. المسجَّل فقط مشاهدات تفاصيل الإعلانات.'],['الزوار الفريدون','لا يوجد معرّف زائر موثوق: مفتاح المشاهدة عشوائي لكل جلسة متصفح ولا يصلح لعدّ الأشخاص.'],['نقرات الاتصال','أزرار الاتصال روابط tel: مباشرة ولا يُسجَّل النقر عليها.'],['نقرات واتساب','روابط wa.me مباشرة ولا يُسجَّل النقر عليها، ولا يمكن معرفة إن أُرسلت رسالة فعلاً.'],['استفسارات ناتجة عن الإعلانات','المحادثات خاصة بأطرافها ولا توجد دالة تجميع للإدارة تربطها بإعلان معيّن.'],['معدل التفاعل والتحول','لا يُحسب: لا مقام موثوق (زيارات أو زوار) ولا تعريف معتمد للتحول.']];
function an1(){a9run('لوحة التحليلات الرئيسية',f8pill('ok','بيانات فعلية جزئياً'),0,function(D){var K=a9kpis(D),S=D.S,cats=(S&&S.categories||[]).slice().sort(function(a,b){return(b.views||0)-(a.views||0)}),r=D.r;
  return '<p class="adE" style="padding:0 0 8px;text-align:start">'+X(S?a9cov(S):'')+' كل مؤشر يُعرض مستقلاً: المشاهدة ليست نقرة، والنقرة ليست تواصلاً، وفتح صفحة الإعلان ليس استفساراً.</p>'
  +'<h3>مؤشرات مقاسة فعلاً</h3><div class="adk a9k">'+K.map(function(k){return a9card(k[0],k[1],k[2],k[3])}).join('')+'</div>'
  +'<h3>مؤشرات غير مقاسة بعد</h3>'+a9na(A9NA)
  +'<div class="a9sec"><h3>الحسابات الجديدة يومياً</h3>'+(D.acc?a9chart(D.acc,r,'الحسابات الجديدة يومياً'):'<p class="adE">غير متاح: '+X(D.E.users||'تاريخ إنشاء الحساب غير متوفر.')+'</p>')+'</div>'
  +'<div class="a9sec"><h3>الإعلانات الجديدة يومياً</h3>'+(D.L?(D.Lfull?a9chart(D.L.rows.map(function(x){return x.created_at}).filter(function(t){return a9inr(t,r.a,r.b)}),r,'الإعلانات الجديدة يومياً'):'<p class="adE">غير متاح: قُرئت الإعلانات جزئياً ولا تغطي كامل الفترة.</p>'):'<p class="adE">غير متاح: '+X(D.E.listings||'')+'</p>')+'</div>'
  +'<div class="a9sec"><h3>الأقسام الأكثر مشاهدة</h3>'+(S?(cats.length?'<div class="adtw"><table class="adt"><thead><tr><th>القسم</th><th>مشاهدات</th><th>إعلانات جديدة في الفترة</th></tr></thead><tbody>'+cats.map(function(x){return '<tr><td>'+X(a9catL(x.category))+'</td><td>'+a9n(x.views||0)+'</td><td>'+a9n(x.new_listings||0)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="adE">لا مشاهدات أو إعلانات مسجّلة في هذه الفترة.</p>'):'<p class="adE">غير متاح: '+X(D.E.stats||'')+'</p>')
  +'<p class="adE" style="text-align:start"><b>أكثر الإعلانات مشاهدة:</b> غير متاح للإدارة حالياً. المشاهدات تُسجَّل لكل إعلان لكن الخادم لا يُرجع للإدارة إلا إجماليات (انظر «أداء الإعلانات»).</p></div>'
  +'<div class="adbs"><button type="button" class="ab" data-a9="csv1">تصدير المؤشرات CSV</button></div>'})}
/* ---- 2) مصادر الزيارات ---- */
function a9src(utm,ref){var s=String(utm||'').toLowerCase().trim(),h=String(ref||'').toLowerCase().trim(),own=String(location.hostname||'').replace(/^www\./,''),host='',pk='';
 if(s){if(/^(facebook|fb|meta)$/.test(s))return['facebook','وسم utm_source='+s];if(/^(instagram|ig)$/.test(s))return['instagram','وسم utm_source='+s];if(/^(whatsapp|wa)$/.test(s))return['whatsapp','وسم utm_source='+s];if(/^(google|bing|yahoo|duckduckgo|yandex)$/.test(s))return['search','وسم utm_source='+s];return['other','وسم utm_source='+s+' (مصدر موسوم غير مصنّف)']}
 if(!h)return['direct','لا وسوم ولا مرجع. قد يكون الرابط مكتوباً أو محفوظاً، وقد يكون المرجع مخفياً من تطبيق ما، لذلك تُقرأ «مباشرة» بحذر.'];
 var m=h.match(/^android-app:\/\/([^\/?#]+)/);if(m){pk=m[1];if(/^com\.facebook\./.test(pk))return['facebook','مرجع تطبيق '+pk];if(/^com\.instagram\./.test(pk))return['instagram','مرجع تطبيق '+pk];if(/^com\.whatsapp/.test(pk))return['whatsapp','مرجع تطبيق '+pk];return['unknown','مرجع تطبيق غير معروف: '+pk]}
 m=h.match(/^https?:\/\/([^\/?#:]+)/);if(!m)return['unknown','المرجع غير قابل للقراءة'];host=m[1].replace(/^www\./,'');
 if(host===own)return['internal','مرجع من المنصة نفسها: لا يُعدّ مصدراً جديداً'];
 if(/(^|\.)(facebook|fb)\.com$/.test(host)||host==='fb.me')return['facebook','مرجع '+host];if(/(^|\.)instagram\.com$/.test(host))return['instagram','مرجع '+host];if(/(^|\.)whatsapp\.com$/.test(host)||host==='wa.me')return['whatsapp','مرجع '+host];
 if(/(^|\.)google\.[a-z.]+$/.test(host)||/(^|\.)(bing|duckduckgo|yandex)\.[a-z.]+$/.test(host)||host==='search.yahoo.com')return['search','مرجع '+host];
 return['other','مرجع '+host]}
function a9srcTest(){var u=E('a9tu'),o=E('a9to');if(!u||!o)return;var v=u.value.trim(),rf=E('a9tr').value.trim();if(!v&&!rf){o.innerHTML='<span class="adE" style="padding:0">أدخل رابطاً أو مرجعاً لاختبار القاعدة.</span>';return}
 var us='';try{us=new URL(v,location.origin).searchParams.get('utm_source')||''}catch(e){}
 var x=a9src(us,rf);o.innerHTML=f8pill(x[0]==='unknown'?'warn':'ok',x[0]==='internal'?'داخلي (لا يُحتسب مصدراً)':A9SRC[x[0]])+' <small>'+X(x[1])+'</small>'}
function an2(){if(!a9gate('مصادر الزيارات'))return;
 E('adm').innerHTML=a9head('مصادر الزيارات',f8pill('na','واجهة فقط'))
 +'<div class="b89n"><b>الحالة الفعلية:</b> المنصة لا تسجّل مصدر الزيارة. لا يوجد جدول زيارات، ولا يقرأ التطبيق وسوم UTM ولا مرجع الصفحة (document.referrer) ولا يخزّنهما. لذلك لا تُعرض أي أرقام هنا: كل مصدر أدناه «غير مقاس».</div>'
 +'<div class="a9sec"><h3>المصادر المعتمدة في التصنيف</h3><div class="adtw"><table class="adt"><thead><tr><th>المصدر</th><th>عدد الزيارات</th><th>الحالة</th></tr></thead><tbody>'+Object.keys(A9SRC).map(function(k){return '<tr><td>'+X(A9SRC[k])+'</td><td>غير متاح</td><td>'+f8pill('na','غير مقاس')+'</td></tr>'}).join('')+'</tbody></table></div></div>'
 +'<div class="a9sec"><h3>قاعدة التصنيف المقترحة</h3><ul class="b87lg"><li>إن وُجد وسم <bdi dir="ltr">utm_source</bdi> فهو المرجع الأول (فيسبوك، إنستغرام، واتساب، محركات بحث، وإلا «مواقع أخرى»).</li><li>إن لم يوجد وسم يُقرأ مرجع الصفحة ويُطابق نطاقه مع المصادر المعروفة، وأي نطاق آخر يُصنَّف «مواقع أخرى».</li><li>لا وسم ولا مرجع = «زيارة مباشرة»، ويُنبَّه أنها قد تشمل مراجع مخفية.</li><li><b>لا تُنسب زيارة إلى فيسبوك أو إنستغرام بسبب نوع الجهاز أو المتصفح الداخلي.</b> إن تعذّر تحديد المصدر (مرجع غير مفهوم أو تطبيق غير معروف) يُسجَّل «مصدر غير معروف».</li></ul></div>'
 +'<div class="a9sec"><h3>اختبار محلي للقاعدة</h3><p class="adE" style="padding:0 0 8px;text-align:start">يختبر منطق التصنيف فقط على ما تكتبه هنا. لا يُرسل ولا يُحفظ شيء، ولا يقيس زيارات حقيقية.</p><div class="f8g"><label>رابط الزيارة (مثل رابط حملة)<input id="a9tu" dir="ltr" inputmode="url" placeholder="https://..."></label><label>مرجع الصفحة (referrer)<input id="a9tr" dir="ltr" placeholder="https://l.facebook.com/"></label></div><div id="a9to" aria-live="polite"></div></div>'
 +a9need('المطلوب لتفعيل القياس (غير منفّذ)',['جدول أحداث زيارة بسيط في Supabase: معرّف جلسة عشوائي، المصدر، الوسيط، الحملة، الصفحة المقصودة، التاريخ. بلا IP ولا أي بيانات شخصية.','دالة تسجيل للزوار مع حد معدل، ودالة تجميع محمية بصلاحية المدير العام (تعديل قاعدة بيانات وRLS يحتاج موافقتك ومرحلة مستقلة).','كود في التطبيق يلتقط وسوم utm_* والمرجع مرة واحدة لكل جلسة قبل أن يغيّر التوجيه الرابط، بعد تحديد صيغة الإشعار والموافقة المناسبة.','تحديث سياسة الخصوصية لتذكر هذا القياس.']);a9srcTest()}
/* ---- 3) روابط الحملات ---- */
function a9pubLoad(){if(A9.pub)return Promise.resolve();return b83Q(sbc().from('listings').select('id,title,category').eq('status','published').order('created_at',{ascending:false}).limit(300)).then(function(r){if(r.error)A9.pubErr=a9err(r.error);else{A9.pub=r.data||[];A9.pubErr=''}})}
function a9cRead(){var g=function(i){var e=E(i);return e?e.value:''},C=A9.C;if(!E('a9cf'))return C;C.n=g('a9nm');C.code=g('a9code').trim();C.plat=g('a9plat')||'other';C.ct=g('a9ct')||'other';C.dest=g('a9dest')||'#market';C.lid=g('a9lid');C.a=g('a9ca');C.b=g('a9cb');C.st=g('a9cst')||'draft';C.note=g('a9note');return C}
function a9link(C){var pl=A9PL[C.plat]||A9PL.other,hash=C.dest==='ad'?(C.lid?'#p-'+C.lid:''):C.dest,base=location.origin+location.pathname,q='utm_source='+encodeURIComponent(pl[1])+'&utm_medium='+encodeURIComponent(pl[2])+'&utm_campaign='+encodeURIComponent(C.code)+'&utm_content='+encodeURIComponent(C.ct);return{dest:base+hash,url:base+'?'+q+hash}}
function a9cCheck(C){var bad=[],w=[],now=Date.now(),a=C.a?Date.parse(C.a+'T00:00:00+03:00'):NaN,b=C.b?Date.parse(C.b+'T23:59:59+03:00'):NaN;
 if(!/^https?:$/.test(location.protocol))bad.push('افتح لوحة الإدارة من عنوان الموقع الفعلي (http أو https) كي يُبنى الرابط بنطاقه الصحيح.');
 if(!C.n.trim())bad.push('اسم الحملة مطلوب.');
 if(!/^[a-z0-9][a-z0-9_-]{1,39}$/.test(C.code))bad.push('رمز الحملة مطلوب: حروف إنجليزية صغيرة وأرقام وشرطات فقط (2 إلى 40).');
 if(C.dest==='ad'&&!C.lid)bad.push('اختر الإعلان المستهدف.');
 if(C.a&&C.b){if(b<a)bad.push('تاريخ النهاية قبل البداية.');else{if(b<now)w.push('انتهت مدة الحملة بالفعل.');else if(b-now<3*A9DAY)w.push('تنتهي المدة خلال أقل من 3 أيام.')}}
 else if(C.st==='scheduled'||C.st==='active')w.push('تاريخ البداية أو النهاية غير محدد.');
 if(!isNaN(a)&&C.st==='active'&&a>now)w.push('الحالة «فعالة» لكن البداية في المستقبل.');
 if(!isNaN(b)&&C.st==='active'&&b<now)w.push('الحالة «فعالة» لكن المدة منتهية.');
 return{bad:bad,w:w}}
function a9cCard(C,L){var t=function(v){return v||'—'},dl=(A9DEST.filter(function(x){return x[0]===C.dest})[0]||[0,C.dest])[1];if(C.dest==='ad'){var p=(A9.pub||[]).filter(function(x){return x.id===C.lid})[0];dl='إعلان: '+(p?p.title:C.lid)}
 return ['حملة: '+C.n,'المنصة: '+(A9PL[C.plat]||A9PL.other)[0],'نوع المحتوى: '+(A9CT[C.ct]||C.ct),'الوجهة: '+dl,'الفترة: '+t(C.a)+' ← '+t(C.b),'الحالة: '+(A9CS[C.st]||C.st),'الرابط: '+L.url,'ملاحظات الإدارة: '+t(C.note.trim())].join('\n')}
function a9cDraw(){var o=E('a9o');if(!o)return;var C=a9cRead(),k=a9cCheck(C),L=a9link(C),ok=!k.bad.length;
 var w=E('a9lw');if(w)w.hidden=C.dest!=='ad';
 o.innerHTML=(k.bad.length?'<ul class="b87lg">'+k.bad.map(function(x){return '<li>⚠ '+X(x)+'</li>'}).join('')+'</ul>':'')+(k.w.length?'<ul class="b87lg">'+k.w.map(function(x){return '<li>ℹ '+X(x)+'</li>'}).join('')+'</ul>':'')
  +(ok?'<label class="f8w">الرابط الناتج<input id="a9url" dir="ltr" readonly value="'+X(L.url)+'" onclick="this.select()"></label><p class="adE" style="padding:0 0 8px;text-align:start">عند تفعيل القياس سيُصنَّف هذا الرابط كمصدر: <b>'+X(A9SRC[a9src((A9PL[C.plat]||A9PL.other)[1],'')[0]])+'</b>. الوسوم: <bdi dir="ltr">utm_source، utm_medium، utm_campaign، utm_content</bdi>. الوسوم قبل علامة # كي لا يتعارض مع توجيه الصفحات.</p>':'<p class="adE" style="padding:0 0 8px;text-align:start">أكمل البيانات المطلوبة لتوليد الرابط.</p>')
  +'<div class="adbs"><button type="button" class="ab pr" data-a9="ccopy"'+(ok?'':' disabled')+'>نسخ الرابط</button><button type="button" class="ab" data-a9="copen"'+(ok?'':' disabled')+'>فتح معاينة الوجهة</button><button type="button" class="ab" data-a9="ccard"'+(ok?'':' disabled')+'>نسخ بطاقة الحملة</button></div><p class="adE" style="padding:6px 0 0;text-align:start">معاينة الوجهة تفتح الصفحة المقصودة بدون وسوم التتبع كي لا تُحسب زيارة حملة. بطاقة الحملة نص تلصقه في سجلاتك لأن الحملات لا تُحفظ هنا.</p>'}
function an3(){if(!a9gate('روابط الحملات التسويقية'))return;if(!sbc()){E('adm').innerHTML=a9head('روابط الحملات التسويقية','')+'<p class="adE">الاتصال بـ Supabase غير جاهز.</p>';return}
 var C=A9.C,opt=function(M,v){return Object.keys(M).map(function(k){return '<option value="'+k+'"'+(v===k?' selected':'')+'>'+X(Array.isArray(M[k])?M[k][0]:M[k])+'</option>'}).join('')};
 E('adm').innerHTML=a9head('روابط الحملات التسويقية',f8pill('na','مولّد روابط فقط'))
 +'<div class="b89n"><b>الحالة الفعلية:</b> هذه الأداة تُنشئ رابطاً موسوماً قابلاً للمشاركة فقط. التطبيق لا يقرأ وسوم UTM ولا يسجّل نقرات أو زيارات، فلا تُعرض أي أرقام لأي حملة. الحملات لا تُحفظ في الخادم، وما تكتبه يضيع عند إعادة تحميل الصفحة.</div>'
 +'<h3>الحملات المسجّلة</h3><p class="adE" style="text-align:start">غير متاح: لا يوجد جدول حملات، فلا توجد قائمة محفوظة ولا نتائج لكل حملة.</p>'
 +'<div class="a9sec"><h3>إنشاء رابط حملة</h3><div class="f8c"><form id="a9cf" onsubmit="return false" class="f8g" autocomplete="off">'
 +'<label>اسم الحملة<input id="a9nm" maxlength="80" value="'+X(C.n)+'"></label><label>رمز الحملة (utm_campaign)<input id="a9code" dir="ltr" maxlength="40" placeholder="eid-boats-2026" value="'+X(C.code)+'"></label>'
 +'<label>المنصة أو المصدر<select id="a9plat">'+opt(A9PL,C.plat)+'</select></label><label>نوع المحتوى<select id="a9ct">'+opt(A9CT,C.ct)+'</select></label>'
 +'<label>الصفحة المستهدفة<select id="a9dest">'+A9DEST.map(function(x){return '<option value="'+x[0]+'"'+(C.dest===x[0]?' selected':'')+'>'+X(x[1])+'</option>'}).join('')+'</select></label>'
 +'<label id="a9lw" '+(C.dest==='ad'?'':'hidden')+'>الإعلان المستهدف<select id="a9lid"><option value="">جارٍ تحميل الإعلانات…</option></select></label>'
 +'<label>تاريخ البداية (اختياري)<input type="date" id="a9ca" value="'+X(C.a)+'"></label><label>تاريخ النهاية (اختياري)<input type="date" id="a9cb" value="'+X(C.b)+'"></label>'
 +'<label>حالة الحملة<select id="a9cst">'+opt(A9CS,C.st)+'</select></label><label class="f8w" style="grid-column:1/-1">ملاحظات الإدارة<textarea id="a9note" rows="2" maxlength="300">'+X(C.note)+'</textarea></label></form><div id="a9o" aria-live="polite"></div></div></div>'
 +a9need('ما يحتاج تنفيذاً لاحقاً',['قراءة وسوم utm_* وتسجيلها (انظر «مصادر الزيارات») كي تظهر زيارات كل حملة.','جدول حملات محمي بصلاحية المدير العام إن أردت حفظ الحملات وملاحظاتها وحالتها.','الروابط المباشرة لقسم محدد داخل السوق غير مدعومة في التوجيه الحالي (القسم يُختار بنقرة لا برابط)، لذلك الوجهات المتاحة: صفحات رئيسية وإعلان بعينه.','لا تُضمَّن في الرابط أي بيانات شخصية.']);
 var fill=function(){var s=E('a9lid');if(!s)return;var L=A9.pub||[];s.innerHTML=A9.pubErr?'<option value="">تعذّر تحميل الإعلانات: '+X(A9.pubErr)+'</option>':'<option value="">اختر إعلاناً منشوراً</option>'+L.map(function(p){return '<option value="'+X(p.id)+'"'+(A9.C.lid===p.id?' selected':'')+'>'+X((p.title||'بدون عنوان').slice(0,70))+' · '+X(a9catL(p.category))+'</option>'}).join('');if(A9.pub&&A9.pub.length>=300)s.insertAdjacentHTML('beforeend','<option value="" disabled>(عُرض أحدث 300 إعلان منشور فقط)</option>');a9cDraw()};
 a9cDraw();a9pubLoad().then(fill,fill)}
/* ---- 4) أداء الإعلانات ---- */
function a9adRows(D){var um=AD.um||{};return(D.L?D.L.rows:[]).map(function(x){var o=own(x),u=o&&um[o];return{id:x.id,title:x.title||'',cat:x.category||'',pv:x.province||'',ar:x.area||'',owner:u?(u.full_name||''):'',st:x.status||'',t:x.created_at?Date.parse(x.created_at):0,fav:D.fav[x.id]||0}})}
function a9adFilter(R,D){var r=D.r;return R.filter(function(x){return(!A9.cat||x.cat===A9.cat)&&(!A9.pv||x.pv===A9.pv)&&(!A9.st||x.st===A9.st)&&(!A9.nw||(x.t>=r.a&&x.t<r.b))})}
var A9COV=[['حالة الإعلان والقسم والمحافظة والمنطقة وتاريخ النشر وصاحب الإعلان','ok','مقاسة','من جدول الإعلانات والحسابات.'],['حفظ في المفضلة','ok','مقاس','من جدول المفضلة، ضمن الفترة. إشارة اهتمام وليست تواصلاً.'],['مشاهدات كل إعلان','na','غير متاح للإدارة','تُسجَّل المشاهدات لكل إعلان، لكن الخادم يُرجعها لصاحب الإعلان فقط، وللإدارة كإجماليات. يلزم دالة خادم للإدارة (تعديل قاعدة بيانات).'],['النقر على تفاصيل الإعلان','na','غير مقاس','تُسجَّل مشاهدة صفحة الإعلان ولا يُسجَّل النقر على البطاقة.'],['مرات المشاركة','na','غير مقاسة','زر المشاركة يستخدم مشاركة المتصفح أو نسخ الرابط دون تسجيل.'],['استفسارات أو محادثات مرتبطة بالإعلان','na','غير متاح للإدارة','المحادثات خاصة بأطرافها، ولا توجد دالة تجميع للإدارة.'],['نقرات الاتصال وواتساب','na','غير مقاسة','روابط مباشرة بلا تسجيل. والنقر على واتساب لا يعني أن رسالة أُرسلت.']];
function an4(){a9run('أداء الإعلانات والمنتجات',f8pill('ok','جزئي: بيانات فعلية'),'ads',function(D){
  if(!D.L)return '<div class="adE er">تعذّر تحميل الإعلانات: '+X(D.E.listings||'')+'</div>';
  var all=a9adRows(D),R=a9adFilter(all,D),top=R.filter(function(x){return x.fav>0}).sort(function(a,b){return b.fav-a.fav}).slice(0,5),nw=R.slice().sort(function(a,b){return b.t-a.t}).slice(0,5),li=function(x,s){return '<li><button type="button" class="b89x" data-a9="ad" data-id="'+X(x.id)+'" dir="auto">'+X(x.title||'بدون عنوان')+'</button> — '+s+'</li>'};
  return '<div class="a9sec"><h3>ما يُقاس وما لا يُقاس في الإعلانات</h3><div class="adtw"><table class="adt"><thead><tr><th>المؤشر</th><th>الحالة</th><th>التفاصيل</th></tr></thead><tbody>'+A9COV.map(function(x){return '<tr><td>'+X(x[0])+'</td><td>'+f8pill(x[1],x[2])+'</td><td>'+X(x[3])+'</td></tr>'}).join('')+'</tbody></table></div></div>'
  +'<div class="a9sec"><h3>الأكثر حفظاً في المفضلة (الفترة)</h3>'+(top.length?'<ol class="b87lg">'+top.map(function(x){return li(x,x.fav+' حفظ')}).join('')+'</ol>':'<p class="adE">لا إعلانات محفوظة في المفضلة ضمن الفترة والفلاتر المختارة.</p>')+'<small class="adE" style="padding:0;display:block;text-align:start">هذا ترتيب بالمفضلة فقط. ترتيب «الأكثر مشاهدة» غير متاح للإدارة (انظر الجدول أعلاه).</small></div>'
  +'<div class="a9sec"><h3>الأحدث نشراً</h3>'+(nw.length?'<ol class="b87lg">'+nw.map(function(x){return li(x,X(a9fdd(x.t)))}).join('')+'</ol>':'<p class="adE">لا إعلانات مطابقة للفلاتر.</p>')+'</div>'
  +'<div class="a9sec"><h3>قائمة الإعلانات ('+a9n(R.length)+(D.L.part?' ضمن '+a9n(D.L.rows.length)+' مقروءة من '+a9n(D.L.total):'')+')</h3><div id="a9t"></div><div class="adbs"><button type="button" class="ab" data-a9="csv4">تصدير القائمة CSV</button></div></div>'
  +'<p class="adE" style="text-align:start">فلتر «الحملة» غير متاح: لا يوجد تتبع يربط الإعلانات بحملات.</p>'},function(D){
  if(!D.L)return;var R=a9adFilter(a9adRows(D),D);A9.last=R;
  tbl(E('a9t'),[{k:'title',t:'الإعلان',h:function(x){return '<button type="button" class="b89x" data-a9="ad" data-id="'+X(x.id)+'" dir="auto">'+X(x.title||'بدون عنوان')+'</button>'+(x.st==='published'?' <a href="#p-'+X(x.id)+'" target="_blank" rel="noopener">عرض عام</a>':'')}},{k:'cat',t:'القسم',v:function(x){return a9catL(x.cat)}},{k:'pv',t:'المحافظة / المنطقة',v:function(x){return(x.pv||'—')+(x.ar?' / '+x.ar:'')}},{k:'owner',t:'صاحب الإعلان',v:function(x){return x.owner||'—'}},{k:'st',t:'الحالة',v:function(x){return A9ST[x.st]||x.st}},{k:'t',t:'تاريخ النشر',h:function(x){return x.t?X(a9fdd(x.t)):'—'}},{k:'fav',t:'حفظ بالمفضلة (الفترة)',h:function(x){return a9n(x.fav)}}],R,{sort:'t',ps:10,empty:'لا إعلانات مطابقة للفلاتر.'})})}
/* ---- 5) رحلة الزائر ---- */
function an5(){a9run('تحليل رحلة الزائر',f8pill('na','واجهة فقط'),0,function(D){var S=D.S,vn=S?a9nz(S.views_period):null,st=[
  ['1','دخول الزائر إلى المنصة',null,'لا يوجد تسجيل لزيارات المنصة.'],['2','فتح قسم',null,'فتح القسم لا يُسجَّل.'],['3','مشاهدة إعلان',vn,'عدد مشاهدات تفاصيل الإعلانات في الفترة (أحداث وليست زواراً).'],['4','الضغط على التواصل أو إرسال استفسار',null,'نقرات الاتصال وواتساب لا تُسجَّل، والمحادثات لا تُربط بإعلان للإدارة.'],['5','إنشاء حساب',D.acc?D.acc.length:null,'حسابات أُنشئت في الفترة (أحداث وليست مرتبطة بزوار بعينهم).']];
  return '<div class="b89n"><b>الحالة الفعلية:</b> لا يمكن بناء مسار زائر أو حساب نسب انتقال بين الخطوات. الأحداث المسجَّلة (مشاهدة إعلان، حساب جديد) غير مترابطة: لا يوجد معرّف يربط زائراً واحداً عبر الخطوات، وكل رقم هنا عدّاد مستقل. لا نحاول تحديد هوية أي زائر مجهول.</div>'
  +'<ol class="f8st">'+st.map(function(x){return '<li><span>'+x[0]+'</span><b>'+X(x[1])+'</b>'+(x[2]==null?f8pill('na','غير مقاس'):'<b dir="ltr" style="font-size:22px;color:var(--b)">'+a9n(x[2])+'</b>'+f8pill('warn','عدّاد مستقل'))+'<small style="color:var(--mut)">'+X(x[3])+'</small></li>'}).join('')+'</ol>'
  +'<p class="adE" style="text-align:start"><b>نسب الانتقال بين الخطوات:</b> غير متاحة. قسمة عدّاد على آخر من مصادر غير مترابطة تعطي رقماً مضللاً (مثلاً مشاهدات إعلانات ÷ حسابات جديدة ليست نسبة تحويل).</p>'
  +a9need('المطلوب لتفعيل تحليل الرحلة (غير منفّذ)',['معرّف جلسة عشوائي مؤقت (بلا هوية) يُسجَّل مع أحداث: دخول، فتح قسم، مشاهدة إعلان، نقر اتصال أو واتساب، إنشاء حساب.','جدول أحداث ودالة تجميع للإدارة تعرض أعداداً مجمّعة فقط، بلا عرض أي جلسة فردية.','إشعار خصوصية وموافقة مناسبة قبل بدء التسجيل، ونافذة حذف قصيرة للبيانات الخام.','عند توفر ذلك فقط تُحسب نسب الانتقال بين الخطوات.'])})}
/* ---- 6) المناطق والفئات ---- */
function a9geo(D){var R=a9adRows(D).filter(function(x){return(!A9.cat||x.cat===A9.cat)&&(!A9.pv||x.pv===A9.pv)}),r=D.r,C={},P={},A={};
 R.forEach(function(x){var n=x.t>=r.a&&x.t<r.b,pub=x.st==='published';
  [[C,x.cat||'غير محدد'],[P,x.pv||'غير محدد'],[A,(x.pv||'غير محدد')+' / '+(x.ar||'غير محددة')]].forEach(function(z){var o=z[0][z[1]]=z[0][z[1]]||{k:z[1],pub:0,nw:0,fav:0};if(pub)o.pub++;if(n)o.nw++;o.fav+=x.fav})});
 return{R:R,C:C,P:P,A:A}}
function a9tab(rows,cols){return '<div class="adtw"><table class="adt"><thead><tr>'+cols.map(function(c){return '<th>'+X(c[0])+'</th>'}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+cols.map(function(c){return '<td>'+c[1](r)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'}
function an6(){a9run('المناطق والفئات الأكثر طلباً',f8pill('ok','جزئي: بيانات فعلية'),'geo',function(D){
  if(!D.L)return '<div class="adE er">تعذّر تحميل الإعلانات: '+X(D.E.listings||'')+'</div>';
  var G=a9geo(D),S=D.S,rpcCat={};(S&&S.categories||[]).forEach(function(x){rpcCat[x.category||'غير محدد']=x});
  var vOK=!!S&&!A9.pv,cats=Object.keys(G.C).map(function(k){var o=G.C[k],q=rpcCat[k];return{k:k,pub:o.pub,nw:(vOK&&q)?(q.new_listings||0):o.nw,fav:o.fav,views:vOK?(q?q.views||0:0):null}}).sort(function(a,b){return(b.views==null?b.nw:b.views)-(a.views==null?a.nw:a.views)||b.nw-a.nw}),
   pvs=Object.keys(G.P).map(function(k){return G.P[k]}).sort(function(a,b){return b.nw-a.nw||b.pub-a.pub}),ars=Object.keys(G.A).map(function(k){return G.A[k]}).sort(function(a,b){return b.nw-a.nw||b.pub-a.pub}).slice(0,15),
   sv={};if(D.V)D.V.rows.forEach(function(x){if(x.status==='published'){var p=x.province||'غير محدد';sv[p]=(sv[p]||0)+1}});
  var svr=Object.keys(sv).map(function(k){return{k:k,n:sv[k]}}).sort(function(a,b){return b.n-a.n}),nw=G.R.filter(function(x){return x.t>=D.r.a&&x.t<D.r.b}).sort(function(a,b){return b.t-a.t}).slice(0,8),att=G.R.filter(function(x){return x.fav>0}).sort(function(a,b){return b.fav-a.fav}).slice(0,8),li=function(x,s){return '<li><button type="button" class="b89x" data-a9="ad" data-id="'+X(x.id)+'" dir="auto">'+X(x.title||'بدون عنوان')+'</button> — '+X(s)+'</li>'};
  return '<div class="b89n"><b>ملاحظة:</b> المحافظات والمناطق هنا هي المسجّلة في الإعلانات والخدمات (جانب العرض). موقع الزائر غير مقاس ولا نخمّنه، فلا يوجد «طلب» جغرافي حقيقي. المشاهدات حسب القسم فقط (لا حسب المحافظة).'+(A9.pv?' مع فلتر المحافظة تُحسب «الإعلانات الجديدة» من صفوف الإعلانات والمشاهدات غير متاحة.':'')+'</div>'
  +'<div class="a9sec"><h3>حسب القسم / نوع المعدة</h3>'+(cats.length?a9tab(cats,[['القسم',function(x){return X(a9catL(x.k))}],['منشورة الآن',function(x){return a9n(x.pub)}],['جديدة في الفترة',function(x){return a9n(x.nw)}],['مشاهدات',function(x){return x.views==null?'غير متاح':a9n(x.views)}],['حفظ بالمفضلة',function(x){return a9n(x.fav)}]]):'<p class="adE">لا بيانات مطابقة.</p>')+'</div>'
  +'<div class="a9sec"><h3>حسب المحافظة</h3>'+(pvs.length?a9tab(pvs,[['المحافظة',function(x){return X(x.k)}],['منشورة الآن',function(x){return a9n(x.pub)}],['جديدة في الفترة',function(x){return a9n(x.nw)}],['حفظ بالمفضلة',function(x){return a9n(x.fav)}]]):'<p class="adE">لا بيانات مطابقة.</p>')+'</div>'
  +'<div class="a9sec"><h3>المحافظة / المنطقة (أعلى 15)</h3>'+(ars.length?a9tab(ars,[['المحافظة / المنطقة',function(x){return X(x.k)}],['منشورة الآن',function(x){return a9n(x.pub)}],['جديدة في الفترة',function(x){return a9n(x.nw)}],['حفظ بالمفضلة',function(x){return a9n(x.fav)}]]):'<p class="adE">لا بيانات مطابقة.</p>')+'</div>'
  +'<div class="a9sec"><h3>الورش والخدمات المنشورة حسب المحافظة</h3>'+(D.V?(svr.length?a9tab(svr,[['المحافظة',function(x){return X(x.k)}],['خدمات منشورة',function(x){return a9n(x.n)}]]):'<p class="adE">لا خدمات منشورة.</p>')+(D.V.part?'<small class="adE" style="padding:0;display:block;text-align:start">قراءة جزئية.</small>':''):'<p class="adE">غير متاح: '+X(D.E.services||'')+'</p>')+'</div>'
  +'<div class="a9sec"><h3>إعلانات جديدة مقابل إعلانات تجذب اهتماماً</h3><div class="f8c"><div><b>الأحدث في الفترة</b>'+(nw.length?'<ol class="b87lg">'+nw.map(function(x){return li(x,a9fdd(x.t))}).join('')+'</ol>':'<p class="adE">لا إعلانات جديدة.</p>')+'</div><div><b>الأكثر حفظاً بالمفضلة</b>'+(att.length?'<ol class="b87lg">'+att.map(function(x){return li(x,x.fav+' حفظ')}).join('')+'</ol>':'<p class="adE">لا مفضلة ضمن الفترة.</p>')+'</div></div><small class="adE" style="padding:0;display:block;text-align:start">«الاهتمام» هنا = المفضلة فقط لعدم توفر مشاهدات لكل إعلان للإدارة.</small></div>'
  +'<div class="adbs"><button type="button" class="ab" data-a9="csv6">تصدير المناطق والفئات CSV</button></div>'})}
/* ---- الأحداث ---- */
function a9copy(t,ok){var done=function(){msg(ok,1)},fb=function(){var a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){msg('تعذّر النسخ. انسخه يدوياً.')}a.remove()};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,fb);else fb()}
E('ad').addEventListener('click',function(e){var b=e.target.closest('[data-a9]');if(!b)return;var k=b.dataset.a9,D=A9.D;
 if(k==='per'){A9.p=b.dataset.v;if(A9.p==='c'&&!A9.from){var d=a9day(Date.now());A9.from=A9.to=d}return show(AD.tab)}
 if(k==='apply'){var a=E('a9a').value,c=E('a9b').value;if(!a||!c||c<a)return msg('حدّد تاريخ بداية ونهاية صحيحين (النهاية لا تسبق البداية).');A9.from=a;A9.to=c;return show(AD.tab)}
 if(k==='refresh'){A9.D=null;return show(AD.tab)}
 if(k==='ad')return openAd(b.dataset.id);
 if(k==='ccopy'||k==='copen'||k==='ccard'){var C=a9cRead(),ck=a9cCheck(C);if(ck.bad.length)return msg(ck.bad[0]);var L=a9link(C);
  if(k==='ccopy')return a9copy(L.url,'تم نسخ رابط الحملة.');if(k==='ccard')return a9copy(a9cCard(C,L),'تم نسخ بطاقة الحملة.');return void window.open(L.dest,'_blank','noopener')}
 if(!D)return;
 if(k==='csv1'){var K=a9kpis(D),rows=[['metric','value','status','note']].concat(K.map(function(x){return[x[0],x[1]==null?'':x[1],x[1]==null?'unavailable':'measured',x[1]==null?(x[3]||''):x[2]]})).concat(A9NA.map(function(x){return[x[0],'','unavailable',x[1]]}));
  rows.splice(1,0,['period_from',a9day(D.r.a),'info',''],['period_to',a9day(D.r.b-A9DAY),'info','']);return a9csv('bahr-analytics-summary',rows,D.F&&D.F.part?'بيانات المفضلة جزئية.':'')}
 if(k==='csv4'){var R=A9.last||[];if(!R.length)return msg('لا إعلانات لتصديرها ضمن الفلاتر.');return a9csv('bahr-ads-performance',[['listing_id','title','category','province','area','owner','status','created_at','favorites_in_period']].concat(R.map(function(x){return[x.id,x.title,x.cat,x.pv,x.ar,x.owner,x.st,x.t?new Date(x.t).toISOString():'',x.fav]})),D.L&&D.L.part?'الإعلانات المقروءة جزئية.':'')}
 if(k==='csv6'){if(!D.L)return;var G=a9geo(D),rows6=[['dimension','name','published_now','new_in_period','favorites_in_period']];[['category',G.C],['province',G.P],['province_area',G.A]].forEach(function(z){Object.keys(z[1]).forEach(function(n){var o=z[1][n];rows6.push([z[0],n,o.pub,o.nw,o.fav])})});return a9csv('bahr-geo-categories',rows6,D.L.part?'الإعلانات المقروءة جزئية.':'')}});
E('adm').addEventListener('change',function(e){var t=e.target.closest('[data-a9f]');if(t){var k=t.dataset.a9f;if(k==='nw')A9.nw=t.checked;else A9[k]=t.value;return show(AD.tab)}if(e.target.closest('#a9cf'))a9cDraw()});
E('adm').addEventListener('input',function(e){if(e.target.closest('#a9cf'))a9cDraw();if(e.target.closest('#a9tu,#a9tr'))a9srcTest()});

/* ===== ADM10: إعدادات النظام (تنظيم وصحة النظام). لا SQL ولا جداول ولا دوال جديدة ولا أي كتابة جديدة: القراءة من b59_site وb72_settings (موجودتين) وفحوصات قراءة فقط. الحفظ الفعلي يبقى في محرّر المحتوى B59 ولوحة الصيانة B72 (كلاهما بتحقّق من الخادم). المدير العام فقط. ===== */
var A10={site:null,siteErr:'',M:null,at:0,H:null,hAt:0,busy:false};
var A10LS='bahr_a10_lastok';
var A10SL={ok:'تعمل',deg:'متدهورة',down:'متوقفة',na:'غير متحقق منها'},A10SP={ok:'ok',deg:'warn',down:'bad',na:'na'};
function a10gate(t){if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>'+X(t)+'</h2><p class="adE">إعدادات النظام للمدير العام فقط.</p>';return false}if(!sbc()){E('adm').innerHTML='<h2>'+X(t)+'</h2><p class="adE">الاتصال بـ Supabase غير جاهز.</p>';return false}return true}
function a10em(e){var c=String(e&&e.code||''),m=String(e&&e.message||e||'');if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'المصدر غير مفعّل على الخادم (يلزم تطبيق ملف SQL الخاص به).';if(c==='42501'||/forbidden|permission|row-level/i.test(m))return 'لا تملك صلاحية القراءة (RLS).';if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم.';return m.slice(0,140)||'خطأ غير معروف'}
function a10read(){var c=sbc();return Promise.all([b83Q(c.from('b59_site').select('key,value')),b83Q(c.from('b72_settings').select('value,updated_at').eq('key','maintenance').maybeSingle())]).then(function(a){var S={};(a[0].data||[]).forEach(function(r){S[r.key]=r.value||{}});A10.site=a[0].error?null:S;A10.siteErr=a[0].error?a10em(a[0].error):'';A10.M=a[1];A10.at=Date.now();return A10})}
function a10top(extra){return '<p class="adE" style="padding:0 0 10px;text-align:start">آخر قراءة للبيانات: '+X(new Date(A10.at).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'}))+' <button type="button" class="ab" data-a10="refresh">تحديث</button></p>'+(extra||'')}
function a10pv(k){return String(((A10.site&&A10.site.platform)||{})[k]||'').trim()}
function a10chk(k,v){if(!v)return null;
 if(k==='phone'){return /^\+[1-9]\d{7,14}$/.test(v.replace(/[\s-]/g,''))?['ok','صيغة دولية صالحة']:['warn','الصيغة ليست دولية. الأفضل كتابة رمز الدولة مثل +964…']}
 var u=null;try{u=new URL(v)}catch(e){}
 if(!u||u.protocol!=='https:')return['warn','يجب أن يكون رابطاً يبدأ بـ https'];
 if(k==='whatsapp'&&/(^|\.)wa\.me$/.test(u.hostname)){return /^\/[1-9]\d{7,14}$/.test(u.pathname)?['ok','رابط واتساب برمز دولة صالح']:['warn','رقم واتساب في الرابط يجب أن يبدأ برمز الدولة بلا صفر أو + (مثل wa.me/964…)']}
 return['ok','رابط https صالح']}
/* صف إعداد: s = ok محفوظ / na غير مهيأ / unsup غير مدعوم / fixed ثابت في الكود */
function a10row(label,k,opt){opt=opt||{};var v=a10pv(k),c=a10chk(k,v),s,val;
 if(A10.siteErr){s=f8pill('na','غير متاح');val='—'}else if(v){s=f8pill(c&&c[0]==='warn'?'warn':'ok','محفوظ');val='<bdi>'+X(v)+'</bdi>'+(c?'<br><small>'+X(c[1])+'</small>':'')}else{s=f8pill('na','غير مهيأ');val='—'}
 return[label,s,val,X(opt.w||'غير معروض في الموقع العام بعد')]}
function a10fixed(label,tag,val,w){return[label,f8pill(tag==='unsup'?'bad':'warn',tag==='unsup'?'غير مدعوم':'ثابت في الكود'),val,w]}
function a10tab(rows){return a9tab(rows,[['الإعداد',function(r){return X(r[0])}],['الحالة',function(r){return r[1]}],['القيمة الحالية',function(r){return r[2]}],['أثره / ملاحظة',function(r){return r[3]}]])}
function a10edit(){return '<div class="adbs"><a class="ab pr" href="#admcms">تعديل من محرّر المحتوى (حفظ بتحقّق من الخادم)</a></div>'}
function a10load(title,fn){if(!a10gate(title))return;ld();a10read().then(function(){E('adm').innerHTML='<h2>'+X(title)+'</h2>'+a10top()+fn()},function(e){er('تعذّر تحميل '+title+': '+a10em(e),function(){a10load(title,fn)})})}
/* 1) الإعدادات العامة */
function sy1(){a10load('الإعدادات العامة',function(){
 var rows=[a10row('اسم المنصة','name'),a10fixed('الشعار','fixed','<bdi>logo-white.png / logo-blue.png</bdi>','ملفات ضمن الموقع. لا يوجد رفع أو استبدال للشعار من اللوحة.'),a10row('وصف المنصة','description'),a10row('حقوق النشر','copyright'),
  a10fixed('البريد الإلكتروني الرسمي','unsup','—','لا يوجد حقل أو مفتاح محفوظ له، لذلك لا يُعرض بريد رسمي ولا يُعدَّل من هنا.'),
  a10fixed('العملة الافتراضية','unsup','—','لا يوجد إعداد عام: العملة تُختار لكل إعلان (دولار أو دينار عراقي).'),
  a10fixed('اللغة واتجاه الواجهة','fixed','<bdi>'+X(document.documentElement.lang||'—')+' / '+X(document.documentElement.dir||'—')+'</bdi>','القيمة الفعلية في الصفحة: العربية من اليمين لليسار، ثابتة في index.html، ولا تُغيَّر من اللوحة.')];
 return '<div class="b89n"><b>مصدر البيانات:</b> جدول إعدادات المحتوى (b59_site) كما هو محفوظ على الخادم. التعديل والحفظ الفعليان في محرّر المحتوى حصراً لأن حفظه يتحقق من الخادم قبل إعلان النجاح، فلا نكرر محرراً ثانياً. لا تُعرض قيمة افتراضية على أنها رسمية: الحقل الفارغ «غير مهيأ».'+(A10.siteErr?' <b>تعذّرت قراءة الإعدادات: '+X(A10.siteErr)+'</b>':'')+'</div>'+a10tab(rows)+a10edit()})}
/* 2) إعدادات التواصل */
function sy2(){a10load('إعدادات التواصل',function(){
 var rows=[a10row('رقم الهاتف الرسمي','phone',{w:'يظهر في صفحة «تواصل معنا» إذا كان محفوظاً.'}),a10row('واتساب الرسمي (رابط)','whatsapp'),a10row('الموقع الرسمي','website'),a10row('فيسبوك','facebook'),a10row('إنستغرام','instagram'),a10row('تيليغرام','telegram'),
  a10fixed('البريد الإلكتروني الرسمي','unsup','—','لا يوجد حقل محفوظ له.'),
  a10fixed('التحكم بعرض بيانات التواصل في الموقع','unsup','—','لا يوجد مفتاح عرض عام. الرقم العام يُعرض إن وُجد ويُخفى بمسح الحقل. أرقام الأنشطة التجارية يتحكم بها كل صاحب نشاط.')];
 return '<div class="b89n"><b>التحقق من الصيغة:</b> يفحص هذا الجدول القيمة المحفوظة فقط (دولي للهاتف، https للروابط، ورمز الدولة في رابط واتساب). لا يُغيّر شيئاً. لا يوجد في المنصة حالياً أي عرض للروابط الاجتماعية في الموقع العام، فهي محفوظة وغير معروضة.'+(A10.siteErr?' <b>تعذّرت القراءة: '+X(A10.siteErr)+'</b>':'')+'</div>'+a10tab(rows)+a10edit()})}
/* 3) إعدادات المنصة */
function sy3(){a10load('إعدادات المنصة',function(){
 var hid=((A10.site&&A10.site.home_sections)||{}).hidden||[],mv=(A10.M&&!A10.M.error&&A10.M.data&&A10.M.data.value)||{},mOK=!!(A10.M&&!A10.M.error),
  rows=[['تشغيل أو إيقاف أقسام المنصة',f8pill('bad','غير مدعوم'),'—','لا يوجد جدول أقسام. يمكن فقط إخفاء قسم من الصفحة الرئيسية، ولا يوقف ذلك الإعلانات ولا البحث ولا الروابط.'],
  ['عناصر الصفحة الرئيسية',A10.siteErr?f8pill('na','غير متاح'):f8pill('ok','يعمل'),A10.siteErr?'—':(hid.length?a9n(hid.length)+' قسم مخفي':'كل الأقسام ظاهرة'),'إخفاء الأقسام وإظهارها من محرّر المحتوى، ويُطبَّق على الموقع العام.'],
  ['رسالة تنبيه عامة',f8pill('warn','جزئي'),'—','المتاح لافتة الصيانة فقط. لا توجد رسالة تنبيه عامة مستقلة عن الصيانة.'],
  ['استقبال الإعلانات الجديدة',f8pill('bad','غير مدعوم منفصلاً'),'—','لا يوجد مفتاح مستقل. وضع الصيانة يمنع الخادم من قبول إعلانات وطلبات جديدة من المستخدمين العاديين.'],
  ['وضع الصيانة',mOK?f8pill(mv.enabled===true?'warn':'ok',mv.enabled===true?'مفعّل':'متوقف'):f8pill('na','غير متاح'),mOK?(mv.enabled===true?'مفعّل الآن':'تعمل المنصة طبيعياً'):X(a10em(A10.M&&A10.M.error)),'يُدار من «الصيانة وحالة الخدمات» وفيه تأكيد قبل التفعيل.']];
 return '<div class="b89n"><b>مبدأ هذه الصفحة:</b> لا يوجد هنا مفتاح يدّعي تغيير سلوك المنصة دون أثر فعلي. كل صف يوضح هل الميزة مدعومة وأين تُدار.</div>'+a10tab(rows)+'<div class="adbs"><button type="button" class="ab pr" data-a10="hub" data-v="ov">فتح مركز إعدادات المنصة</button><a class="ab" href="#admcms">محرّر المحتوى</a></div>'})}
/* 4) صحة النظام */
function a10lastok(){try{return JSON.parse(localStorage.getItem(A10LS)||'{}')}catch(e){return{}}}
function a10saveok(o){try{localStorage.setItem(A10LS,JSON.stringify(o))}catch(e){}}
function a10cls(r,ms){var code=String(r.code||''),h=r.http||0,miss=/42883|PGRST202|42P01|PGRST205/.test(code);
 if(r.ok)return ms>=2000?{st:'deg',ms:ms,note:'تعمل ببطء (أكثر من ثانيتين)'}:{st:'ok',ms:ms,note:'نجح الفحص'};
 if(code==='NETWORK'||h>=500)return{st:'down',ms:ms,note:code==='NETWORK'?'تعذّر الاتصال بالخدمة':'خطأ من الخادم ('+h+')'};
 if(miss||h===401||h===403||h===404||/^(42501|PGRST301)$/.test(code))return{st:'na',ms:ms,note:miss?'الميزة غير مفعّلة على الخادم، فلا يمكن الحكم':'لا صلاحية لفحص هذا الجزء من حسابك، فلا يمكن الحكم'};
 return{st:'deg',ms:ms,note:'استجابة غير متوقعة ('+(code||h||'—')+')'}}
function a10T(fn){var t=performance.now(),to=new Promise(function(_,j){setTimeout(function(){j({timeout:1})},1e4)});
 return Promise.race([Promise.resolve().then(fn),to]).then(function(r){return a10cls(r,Math.round(performance.now()-t))},function(e){return{st:'down',ms:Math.round(performance.now()-t),note:e&&e.timeout?'لم تستجب خلال 10 ثوانٍ':'تعذّر الاتصال بالخدمة'}})}
function a10sb(r){var e=r.error;if(!e)return{ok:true,http:r.status};var m=String(e.message||'');return{ok:false,http:r.status||0,code:/failed to fetch|network|load failed/i.test(m)?'NETWORK':(e.code||e.statusCode||'')}}
function a10checks(){var C=window.BAHR_CONFIG||{},U=String(C.supabaseUrl||'').replace(/\/+$/,''),K=C.supabaseAnonKey,c=sbc(),H={apikey:K,Authorization:'Bearer '+K},NA=function(w){return Promise.resolve({st:'na',ms:null,note:w})};
 var fz=function(u,h){return fetch(U+u,{headers:h}).then(function(r){return{ok:r.ok,http:r.status}},function(){return{ok:false,http:0,code:'NETWORK'}})};
 return[
  {id:'conn',n:'اتصال التطبيق بالخدمات الخلفية',w:'قراءة إعدادات المصادقة العامة',run:function(){return U&&K?a10T(function(){return fz('/auth/v1/settings',{apikey:K})}):NA('إعدادات الاتصال غير موجودة')}},
  {id:'data',n:'تحميل البيانات الأساسية (إعلانات منشورة كزائر)',w:'قراءة صف واحد بصلاحية الزائر',run:function(){return U&&K?a10T(function(){return fz('/rest/v1/listings?select=id&status=eq.published&limit=1',H)}):NA('إعدادات الاتصال غير موجودة')}},
  {id:'auth',n:'المصادقة (جلسة المدير الحالية)',w:'التحقق من الجلسة الحالية فقط، لا تسجيل دخول اختباري',run:function(){return a10T(function(){return c.auth.getUser().then(function(r){return r.error?{ok:false,code:(r.error.status===0||/fetch|network/i.test(String(r.error.message)))?'NETWORK':(r.error.code||r.error.status||'')}:{ok:!!(r.data&&r.data.user),http:200}})})}},
  {id:'adm',n:'وظائف الإدارة على الخادم',w:'استدعاء is_admin (قراءة)',run:function(){return a10T(function(){return c.rpc('is_admin').then(function(r){var o=a10sb(r);o.ok=o.ok&&r.data===true;return o})})}},
  {id:'sto',n:'قراءة حاوية صور الإعلانات',w:'سرد ملف واحد (قراءة فقط)',run:function(){return a10T(function(){return c.storage.from('listing-images').list('',{limit:1}).then(function(r){return r.error?{ok:false,http:+(r.error.statusCode||r.error.status)||0,code:/failed to fetch|network/i.test(String(r.error.message))?'NETWORK':''}:{ok:true,http:200}})})}},
  {id:'upl',n:'رفع الملفات',w:'غير مُختبر عمداً',run:function(){return NA('الاختبار يتطلب كتابة في التخزين، ولا يوجد اختبار آمن بلا كتابة.')}},
  {id:'ntf',n:'تحميل الإشعارات (بحسابك)',w:'قراءة صف واحد',run:function(){return a10T(function(){return c.from('notifications').select('id').limit(1).then(a10sb)})}},
  {id:'err',n:'نظام مراقبة الأخطاء (B77)',w:'استدعاء b77_admin_stats (قراءة)',run:function(){return a10T(function(){return c.rpc('b77_admin_stats',{p_days:1}).then(a10sb)})}},
  {id:'mnt',n:'حالة الصيانة العامة (B72)',w:'قراءة b72_public',run:function(){return a10T(function(){return c.from('b72_public').select('enabled').maybeSingle().then(a10sb)})}}]}
function a10draw(){var h=E('a10h');if(!h)return;var L=A10.H;if(!L){h.innerHTML='<p class="adE">جارٍ الفحص…</p>';return}var lo=a10lastok(),cnt={ok:0,deg:0,down:0,na:0};L.forEach(function(x){cnt[x.st]++});
 h.innerHTML='<p class="adE" style="padding:0 0 8px;text-align:start">'+Object.keys(A10SL).map(function(k){return f8pill(A10SP[k],A10SL[k]+': '+cnt[k])}).join(' ')+'<br>آخر فحص: '+X(new Date(A10.hAt).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'medium'}))+'</p>'
  +a9tab(L,[['الخدمة',function(x){return X(x.n)}],['الحالة',function(x){return f8pill(A10SP[x.st],A10SL[x.st])}],['زمن الاستجابة',function(x){return x.ms==null?'—':a9n(x.ms)+' م.ث'}],['آخر نجاح (في هذا المتصفح)',function(x){return lo[x.id]?X(new Date(lo[x.id]).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})):'لم ينجح بعد'}],['طريقة الفحص',function(x){return X(x.w)}],['التفاصيل',function(x){return X(x.note)}]])}
function a10run(force){if(A10.busy)return;if(!force&&A10.H&&Date.now()-A10.hAt<1e4)return a10draw();if(force&&Date.now()-A10.hAt<1e4){msg('انتظر 10 ثوانٍ بين الفحوصات اليدوية.');return}
 A10.busy=true;A10.H=null;a10draw();var ck=a10checks(),R=[],b=E('a10run');if(b)b.disabled=true;
 ck.reduce(function(p,k){return p.then(function(){return k.run().then(function(r){r.id=k.id;r.n=k.n;r.w=k.w;R.push(r)})})},Promise.resolve()).then(function(){var lo=a10lastok(),now=Date.now();R.forEach(function(r){if(r.st==='ok'||r.st==='deg')lo[r.id]=now});a10saveok(lo);A10.H=R;A10.hAt=now;A10.busy=false;a10draw();var b2=E('a10run');if(b2)b2.disabled=false})}
function sy4(){if(!a10gate('صحة النظام'))return;
 E('adm').innerHTML='<h2>صحة النظام ومراقبة الخدمات</h2><div class="b89n"><b>كيف تعمل هذه الصفحة؟</b> كل حالة نتيجة فحص فعلي بقراءة فقط عند فتح الصفحة أو الضغط على «إعادة الفحص». لا كتابة ولا حذف ولا أي مؤشر ثابت. «تعمل» نجح الفحص بسرعة، «متدهورة» نجح ببطء أو بنتيجة غير متوقعة، «متوقفة» فشل الاتصال أو أعاد الخادم خطأً داخلياً، «غير متحقق منها» لا يمكن الحكم (لا صلاحية أو ميزة غير مفعّلة أو لا اختبار آمن). لا تُعرض هنا مفاتيح ولا عناوين اتصال. «آخر نجاح» محفوظ في هذا المتصفح فقط وليس في الخادم.</div><div class="adbs"><button type="button" class="ab pr" id="a10run" data-a10="run">إعادة الفحص</button><button type="button" class="ab" data-a10="perf">قياسات أداء الجلسة (B85)</button><button type="button" class="ab" data-a10="mon">مراقبة الجداول والدوال</button></div><div id="a10h"></div>'
 +'<p class="adE" style="text-align:start">غير متاح حالياً: مراقبة مستمرة في الخلفية أو سجل تاريخي لحالة الخدمات، لأنها تحتاج مهمة خادم مجدولة غير موجودة. ما يظهر هنا لقطة لحظية من متصفحك.</p>';a10run(false)}
/* 8) الصيانة وحالة الخدمات */
function a10banner(t){return '<div style="background:#8A5A00;color:#fff;padding:10px 14px;text-align:center;font-size:14px;border-radius:10px" role="status">'+X(t||'المنصة في وضع الصيانة حالياً.')+'</div>'}
function sy8(){a10load('الصيانة وحالة الخدمات',function(){
 var ok=!!(A10.M&&!A10.M.error),mv=(ok&&A10.M.data&&A10.M.data.value)||{},up=ok&&A10.M.data&&A10.M.data.updated_at,H=A10.H;
 var svc=H?'<p class="adE" style="padding:0 0 8px;text-align:start">'+['ok','deg','down','na'].map(function(k){return f8pill(A10SP[k],A10SL[k]+': '+H.filter(function(x){return x.st===k}).length)}).join(' ')+' (آخر فحص: '+X(new Date(A10.hAt).toLocaleString('ar-IQ',{timeStyle:'short',dateStyle:'medium'}))+')</p>':'<p class="adE" style="padding:0 0 8px;text-align:start">لم يُجرَ فحص في هذه الجلسة بعد. افتح «صحة النظام» لإجرائه.</p>';
 return '<div class="a9sec"><h3>حالة الصيانة الحالية</h3>'+(ok?'<p>'+f8pill(mv.enabled===true?'warn':'ok',mv.enabled===true?'الصيانة مفعّلة':'المنصة تعمل طبيعياً')+(up?' <small>آخر تعديل: '+X(new Date(up).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'}))+'</small>':'')+'</p><h4>الرسالة المحفوظة (كما تظهر للزوار)</h4>'+(mv.message?a10banner(mv.message):'<p class="adE" style="padding:0;text-align:start">لا توجد رسالة محفوظة. عند التفعيل بلا رسالة تظهر الرسالة الافتراضية للافتة، لكن النموذج يطلب كتابة رسالة.</p>')+'<p class="adE" style="padding:6px 0 0;text-align:start">اللافتة تظهر لكل الزوار ولا تحجب الموقع. عند التفعيل يرفض الخادم إنشاء إعلانات وطلبات جديدة من المستخدمين العاديين، ولا يتأثر الدخول ولا القراءة، والمسؤولون مستثنون.</p>':'<p class="adE er" style="padding:0">وضع الصيانة غير متاح: '+X(a10em(A10.M&&A10.M.error))+'</p>')+'</div>'
 +'<div class="a9sec"><h3>التعديل والمعاينة</h3><p class="adE" style="padding:0 0 8px;text-align:start">التفعيل والإيقاف يتمان من نموذج الصيانة الذي يطلب تأكيداً صريحاً ويشرح الأثر وطريقة الرجوع، ويتحقق من الخادم بعد الحفظ. فيه أيضاً معاينة للرسالة قبل الحفظ. لا يُفعَّل شيء تلقائياً.</p><div class="adbs"><button type="button" class="ab pr" data-a10="hub" data-v="mt">فتح نموذج الصيانة</button></div></div>'
 +'<div class="a9sec"><h3>جدولة الصيانة</h3><p>'+f8pill('bad','غير مدعومة')+'</p><p class="adE" style="padding:0;text-align:start">لا يدعم الخادم وقت بداية أو نهاية، ولا صيانة مجدولة أو طارئة منفصلة؛ المتاح مفعّل أو متوقف فقط. تنفيذها يحتاج حقولاً جديدة في b72_settings ودالة حفظ تدعمها (غير منفّذ).</p></div>'
 +'<div class="a9sec"><h3>حالة الخدمات</h3>'+svc+'<div class="adbs"><button type="button" class="ab" data-a10="health">فتح صحة النظام</button></div></div>'})}
/* تغليف: معاينة الرسالة قبل الحفظ داخل نموذج الصيانة B72 (يُضاف دون تغيير سلوك الحفظ) */
var a10mt0=H82P.mt;
H82P.mt=function(D){a10mt0(D);var p=E('b82p');if(!p||!E('b72t'))return;p.insertAdjacentHTML('beforeend','<div class="a9sec" style="margin-top:12px"><h3>معاينة الرسالة قبل الحفظ</h3><div id="a10pv"></div><small class="adE" style="padding:6px 0 0;display:block;text-align:start">هكذا ستظهر اللافتة للزوار عند التفعيل. المعاينة محلية ولا تُفعّل شيئاً ولا تحفظ شيئاً.</small></div>');a10pvDraw()};
function a10pvDraw(){var h=E('a10pv'),t=E('b72t');if(h&&t)h.innerHTML=a10banner(t.value.trim())}
E('adm').addEventListener('input',function(e){if(e.target.id==='b72t')a10pvDraw()});
E('ad').addEventListener('click',function(e){var b=e.target.closest('[data-a10]');if(!b)return;var k=b.dataset.a10;
 if(k==='refresh')return show(AD.tab);if(k==='run')return a10run(true);
 if(k==='hub')return hub(b.dataset.v);
 var go=function(t){var n=document.querySelector('#adsub button[data-t="'+t+'"]');if(n)n.click()};
 if(k==='perf')return go('perf');if(k==='mon')return go('monitor');if(k==='health')return go('sy4')});

ADH.check=function(){var c=sbc(),l=E('admLink'),lm=E('admLinkM'),h=E('acgAdm'),sh=function(ok){var d=ok?'':'none';l.style.display=d;if(lm)lm.style.display=d;if(h)h.style.display=d};bizEntry();if(!c||!AU.user){sh(false);return}
  PF.session.ws().then(function(w){sh(w.admin.length>0)}).catch(function(){sh(false)})};
ADH.open=function(){var c=sbc();document.title='بحر | BAHR ADMIN';gate('<p>جارٍ التحقق من الصلاحية…</p>');
  if(!c){gate('<p>الاتصال بـ Supabase غير جاهز.</p>');return}
  myRoles().then(function(roles){AD.roles=roles;
   if(!roles.length){gate('<h2>غير مصرح</h2><p>هذه الصفحة للمشرفين فقط.</p><a class="btn btn-p" href="#home">العودة للرئيسية</a>');return}
   E('adg').style.display='none';E('adl').style.display='';filterNav();show(AD.tab)}).catch(function(e){gate('<h2>تعذّر التحقق</h2><p dir="ltr" style="color:var(--mut)">'+X(e.message||e)+'</p>')})};

/* ===== ADM13: مركز الوسائط (الملفات والصور). قراءة فقط: لا رفع ولا حذف ولا استبدال ولا كتابة في أي جدول أو حاوية. المصدر: قوائم Storage للحاويات العامة المعروفة في الكود، وربطها بالسجلات من الجداول الموجودة فعلاً (listing_images وprofiles وmarine_services وbiz_profiles وparts_items وb59_site). الحاويات الخاصة (b55-proofs وb57-files وrequest-images) لا تُقرأ ولا تُعرض هنا عمداً. المدير العام فقط. ===== */
var A13={tab:'ov',F:[],N:[],trunc:false,uOK:false,U:{},R:null,at:0,busy:0,q:'',ty:'',bk:'',dy:0,so:'new',n:48,fail:0};
var A13B=[['listing-images','صور الإعلانات',1],['avatars','صور الحسابات',1],['service-images','صور الخدمات',1],['site-assets','صور الموقع والصفحة الرئيسية',1],['request-images','صور الطلبات (خاصة)',0],['b55-proofs','إثباتات الدفع (خاصة)',0],['b57-files','ملفات الدعم (خاصة)',0]];
var A13MAX=1200,A13LIM=3000,A13PG=48,A13UU=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var A13T=[['ov','نظرة عامة'],['lib','المكتبة'],['rev','المراجعة'],['home','الصفحة الرئيسية'],['up','الرفع والحذف']];
var A13HK={home_hero:'الشرائح الرئيسية'};
var A13KL={image:'صورة',pdf:'PDF',other:'ملف آخر'};
function a13gate(t){if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>'+X(t)+'</h2><p class="adE">مركز الوسائط للمدير العام فقط.</p>';return false}if(!sbc()){E('adm').innerHTML='<h2>'+X(t)+'</h2><p class="adE">الاتصال بـ Supabase غير جاهز.</p>';return false}return true}
function a13fs(n){if(typeof n!=='number'||isNaN(n))return 'غير معروف';if(n<1024)return n+' B';if(n<1048576)return (n/1024).toFixed(1)+' KB';return (n/1048576).toFixed(2)+' MB'}
function a13fd(d){var x=new Date(d);return(!d||isNaN(x))?'غير معروف':x.toLocaleDateString('ar-IQ',{dateStyle:'medium'})}
function a13kind(f){var m=(f.mt||'').toLowerCase(),e=(f.n.split('.').pop()||'').toLowerCase();if(m.indexOf('image/')===0||/^(jpe?g|png|webp|gif|avif|svg)$/.test(e))return 'image';if(m==='application/pdf'||e==='pdf')return 'pdf';return 'other'}
function a13url(f){var c=sbc();return c?c.storage.from(f.b).getPublicUrl(f.p).data.publicUrl:''}
function a13use(f){return f.u.length?f.u.map(function(u){return u.k==='home'?'الصفحة الرئيسية: '+(A13HK[u.id]||u.id):u.l}).filter(function(v,i,a){return a.indexOf(v)===i}).join('، '):(A13.uOK?'غير مرتبط بسجل معروف':'غير معروف')}
function a13has(f,k){return f.u.some(function(u){return u.k===k})}
/* قراءة قوائم Storage للحاويات العامة فقط (تتابعي، بحد أقصى A13MAX ملفاً) */
function a13walk(c,b,prefix,depth){var off=0;
 function pg(){if(A13.F.length>=A13MAX){A13.trunc=true;return Promise.resolve()}
  return c.storage.from(b[0]).list(prefix,{limit:100,offset:off,sortBy:{column:'created_at',order:'desc'}}).then(function(r){
   if(r.error){A13.N.push('تعذّرت قراءة '+b[0]+(prefix?'/'+prefix:'')+': '+a10em(r.error));return}
   var d=r.data||[],ch=Promise.resolve();
   d.forEach(function(it){ch=ch.then(function(){
    if(A13.F.length>=A13MAX){A13.trunc=true;return}
    if(!it.name||it.name.charAt(0)==='.')return;
    var p=(prefix?prefix+'/':'')+it.name;
    if(it.id){var m=it.metadata||{};A13.F.push({b:b[0],bl:b[1],p:p,n:it.name,sz:m.size,mt:m.mimetype,cr:it.created_at||it.updated_at,u:[],ok:null})}
    else if(depth<3)return a13walk(c,b,p,depth+1)})});
   return ch.then(function(){if(d.length>=100&&A13.F.length<A13MAX){off+=100;return pg()}if(d.length>=100)A13.trunc=true})},function(e){A13.N.push('تعذّرت قراءة '+b[0]+': '+a10em(e))})}
 return pg()}
function a13scan(v,out,id,d){if(v==null||d>6)return;
 if(typeof v==='string'){var re=/\/storage\/v1\/object\/(?:public|sign)\/([\w-]+)\/([^?#"'\s<>]+)/g,m;while((m=re.exec(v))){var p=m[2];try{p=decodeURIComponent(p)}catch(e){}out.push([m[1],p,id])}return}
 if(Array.isArray(v)){v.forEach(function(x){a13scan(x,out,id,d+1)});return}
 if(typeof v==='object')Object.keys(v).forEach(function(k){a13scan(v[k],out,id,d+1)})}
function a13urls(v,id){var o=[];a13scan(v,o,id,0);return o}
var A13S=[
 {k:'ads',l:'إعلان',t:'listing_images',s:'listing_id,storage_path',m:function(r){return r.storage_path?[['listing-images',r.storage_path,r.listing_id]]:[]}},
 {k:'acc',l:'صورة حساب',t:'profiles',s:'id,avatar_path',f:function(q){return q.not('avatar_path','is',null)},m:function(r){return r.avatar_path?[['avatars',r.avatar_path,r.id]]:[]}},
 {k:'svc',l:'خدمة بحرية',t:'marine_services',s:'*',m:function(r){var o=a13urls(r,r.id);(r.images||[]).forEach(function(p){if(typeof p==='string')o.push(['service-images',p,r.id])});if(typeof r.image_path==='string'&&r.image_path){o.push(['service-images',r.image_path,r.id]);o.push(['listing-images',r.image_path,r.id])}return o}},
 {k:'biz',l:'نشاط تجاري',t:'biz_profiles',s:'*',m:function(r){return a13urls(r,r.id)}},
 {k:'part',l:'قطعة غيار',t:'parts_items',s:'id,image_url',m:function(r){return a13urls(r.image_url,r.id)}},
 {k:'home',l:'الصفحة الرئيسية',t:'b59_site',s:'key,value',m:function(r){return a13urls(r.value,r.key)}}];
/* ربط الملفات بالسجلات: المطابقة بالمسار الكامل داخل الحاوية فقط، دون أي تخمين */
function a13usage(c){var idx={};A13.F.forEach(function(f){idx[f.b+'/'+f.p]=f});A13.U={};A13.uOK=true;
 return A13S.reduce(function(pr,S){return pr.then(function(){var q=c.from(S.t).select(S.s);if(S.f)q=S.f(q);
  return b83Q(q.limit(A13LIM)).then(function(r){
   if(r.error){A13.U[S.k]={e:a10em(r.error)};A13.uOK=false;A13.N.push('تعذّر ربط ملفات «'+S.l+'» بالسجلات (جدول '+S.t+'): '+a10em(r.error));return}
   var rows=r.data||[];A13.U[S.k]={n:rows.length};
   if(rows.length>=A13LIM){A13.U[S.k].part=1;A13.uOK=false;A13.N.push('جدول '+S.t+' أكبر من الحد المقروء ('+A13LIM+')، فالربط جزئي.')}
   rows.forEach(function(row){S.m(row).forEach(function(x){var f=idx[x[0]+'/'+x[1]];if(f&&!f.u.some(function(u){return u.k===S.k&&u.id===x[2]}))f.u.push({k:S.k,l:S.l,id:x[2]})})})})})},Promise.resolve())}
function a13rev(c){return b83Q(c.from('listings').select('id,title,status').in('status',['pending','rejected','suspended']).limit(1000)).then(function(r){A13.R={e:r.error?a10em(r.error):'',L:{}};(r.data||[]).forEach(function(x){A13.R.L[x.id]=x});if(!r.error&&(r.data||[]).length>=1000)A13.N.push('إعلانات المراجعة أكثر من 1000، فنتائج المراجعة جزئية.')})}
function a13load(){if(!a13gate('مركز الوسائط')||A13.busy)return;A13.busy=1;ld();var c=sbc();
 A13.F=[];A13.N=[];A13.trunc=false;A13.fail=0;A13.U={};A13.R=null;
 A13B.filter(function(b){return b[2]}).reduce(function(pr,b){return pr.then(function(){return a13walk(c,b,'',0)})},Promise.resolve())
  .then(function(){return a13usage(c)}).then(function(){return a13rev(c)})
  .then(function(){A13.F.forEach(function(f,i){f.i=i});A13.at=Date.now();A13.busy=0;a13draw()},function(e){A13.busy=0;er('تعذّر تحميل مركز الوسائط: '+a10em(e),a13load)})}
function a13draw(){
 E('adm').innerHTML='<h2>مركز الوسائط</h2><p class="adE" style="padding:0 0 10px;text-align:start">عرض للقراءة فقط للملفات الموجودة فعلاً في Storage. آخر قراءة: '+X(new Date(A13.at).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'}))+' <button type="button" class="ab" data-a13="refresh">تحديث</button></p>'
 +(A13.N.length?'<div class="adE er" style="text-align:start;padding:10px 14px;margin-bottom:10px"><b>تنبيهات القراءة:</b><ul style="margin:6px 0 0;padding-inline-start:20px">'+A13.N.map(function(n){return '<li>'+X(n)+'</li>'}).join('')+'</ul></div>':'')
 +'<div class="a13t" role="tablist">'+A13T.map(function(t){return '<button type="button" class="a13tb'+(A13.tab===t[0]?' on':'')+'" data-a13="tab" data-v="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div><div id="a13b"></div>';
 a13body()}
function a13body(){var f={ov:a13ov,lib:a13libPage,rev:a13revPage,home:a13homePage,up:a13upPage}[A13.tab]||a13ov;E('a13b').innerHTML=f();if(A13.tab==='lib')a13lib()}
function a13cardS(l,v,na){return '<div'+(na?' style="opacity:.75"':'')+'>'+X(l)+'<b'+(na?' style="font-size:15px"':'')+'>'+X(v)+'</b></div>'}
function a13cnt(k){var u=A13.U[k];if(!u||u.e)return null;return A13.F.filter(function(f){return a13has(f,k)}).length}
function a13ov(){var F=A13.F,im=F.filter(function(f){return a13kind(f)==='image'}).length,sz=F.reduce(function(a,f){return a+(typeof f.sz==='number'?f.sz:0)},0),h='';
 var n=function(k){var v=a13cnt(k);return v==null?['غير متاح',1]:[v,0]};
 var ads=n('ads'),home=n('home'),biz=n('biz'),un=(A13.uOK&&!A13.trunc)?F.filter(function(f){return !f.u.length}).length:null;
 h+='<div class="adk">'+a13cardS('الملفات المقروءة'+(A13.trunc?' (جزئي، الحد '+A13MAX+')':''),F.length)+a13cardS('الصور',im)+a13cardS('ملفات أخرى',F.length-im)
  +a13cardS('صور مرتبطة بإعلانات',ads[0],ads[1])+a13cardS('صور الصفحة الرئيسية',home[0],home[1])+a13cardS('ملفات الأنشطة التجارية',biz[0],biz[1])
  +a13cardS('بلا ربط في السجلات المقروءة',un==null?'غير متاح':un,un==null)+a13cardS('فشل تحميل معاينة (ما ظهر فقط)',A13.fail)
  +a13cardS('مجموع أحجام الملفات المقروءة'+(A13.trunc?' (جزئي)':''),a13fs(sz))+a13cardS('إجمالي مساحة التخزين','غير متاح',1)+'</div>';
 h+='<h3>الحاويات</h3>'+a9tab(A13B,[['الحاوية',function(b){return '<bdi dir="ltr">'+X(b[0])+'</bdi> '+X(b[1])}],['الحالة',function(b){return b[2]?f8pill('ok','عامة: مقروءة'):f8pill('na','خاصة: لا تُقرأ هنا')}],['ملفات مقروءة',function(b){return b[2]?String(F.filter(function(f){return f.b===b[0]}).length):'—'}]]);
 var rc=F.slice().sort(function(a,b){return (Date.parse(b.cr)||0)-(Date.parse(a.cr)||0)}).slice(0,12);
 h+='<h3>آخر الملفات المضافة</h3>'+(rc.length?'<div class="a13g">'+rc.map(a13card).join('')+'</div>':'<p class="adE">لا ملفات في الحاويات المقروءة.</p>');
 return h}
function a13card(f){var k=a13kind(f),th=k==='image'?(f.ok===false?'تعذّر تحميل المعاينة':'<img loading="lazy" decoding="async" data-a13i="'+f.i+'" alt="" src="'+X(a13url(f))+'">'):A13KL[k];
 return '<button type="button" class="a13c" data-a13="open" data-i="'+f.i+'"><span class="a13th">'+th+'</span><b>'+X(f.n)+'</b><small>'+X(f.bl)+' · '+a13fs(f.sz)+'</small></button>'}
function a13libPage(){var bs=A13B.filter(function(b){return b[2]});
 return '<div class="a13f"><input id="a13q" class="adq" type="search" placeholder="ابحث باسم الملف أو المسار" value="'+X(A13.q)+'" aria-label="بحث">'
 +'<select id="a13ty" aria-label="النوع"><option value="">كل الأنواع</option><option value="image"'+(A13.ty==='image'?' selected':'')+'>صور</option><option value="pdf"'+(A13.ty==='pdf'?' selected':'')+'>PDF</option><option value="other"'+(A13.ty==='other'?' selected':'')+'>ملفات أخرى</option></select>'
 +'<select id="a13bk" aria-label="المصدر"><option value="">كل المصادر</option>'+bs.map(function(b){return '<option value="'+X(b[0])+'"'+(A13.bk===b[0]?' selected':'')+'>'+X(b[1])+'</option>'}).join('')+'</select>'
 +'<select id="a13dy" aria-label="تاريخ الإضافة"><option value="0">كل التواريخ</option><option value="7"'+(A13.dy===7?' selected':'')+'>آخر 7 أيام</option><option value="30"'+(A13.dy===30?' selected':'')+'>آخر 30 يوماً</option></select>'
 +'<select id="a13so" aria-label="الفرز"><option value="new">الأحدث</option><option value="old"'+(A13.so==='old'?' selected':'')+'>الأقدم</option><option value="name"'+(A13.so==='name'?' selected':'')+'>الاسم</option><option value="size"'+(A13.so==='size'?' selected':'')+'>الأكبر حجماً</option></select></div><div id="a13l"></div>'}
function a13filt(){var now=Date.now(),q=A13.q.toLowerCase(),d=function(f){return Date.parse(f.cr)||0};
 var a=A13.F.filter(function(f){if(A13.ty&&a13kind(f)!==A13.ty)return false;if(A13.bk&&f.b!==A13.bk)return false;if(q&&(f.n+' '+f.p).toLowerCase().indexOf(q)<0)return false;if(A13.dy){var t=Date.parse(f.cr);if(isNaN(t)||now-t>A13.dy*864e5)return false}return true});
 a.sort(function(x,y){if(A13.so==='old')return d(x)-d(y);if(A13.so==='name')return x.n.localeCompare(y.n,'ar');if(A13.so==='size')return (y.sz||0)-(x.sz||0);return d(y)-d(x)});return a}
function a13lib(){var el=E('a13l');if(!el)return;var all=a13filt(),a=all.slice(0,A13.n);
 if(!all.length){el.innerHTML='<p class="adE">'+(A13.F.length?'لا نتائج مطابقة للفلاتر.':'لا توجد ملفات في الحاويات المقروءة.')+'</p>';return}
 var im=a.filter(function(f){return a13kind(f)==='image'}),ot=a.filter(function(f){return a13kind(f)!=='image'}),h='<p class="adE" style="padding:0 0 8px;text-align:start">'+all.length+' ملفاً</p>';
 if(im.length)h+='<div class="a13g">'+im.map(a13card).join('')+'</div>';
 if(ot.length)h+=a9tab(ot,[['الاسم',function(f){return '<bdi>'+X(f.n)+'</bdi>'}],['النوع',function(f){return A13KL[a13kind(f)]}],['الحجم',function(f){return a13fs(f.sz)}],['الإضافة',function(f){return a13fd(f.cr)}],['الاستخدام',function(f){return X(a13use(f))}],['',function(f){return '<button type="button" class="ab" data-a13="open" data-i="'+f.i+'">تفاصيل</button>'}]]);
 if(all.length>a.length)h+='<div class="adbs"><button type="button" class="ab pr" data-a13="more">عرض المزيد ('+(all.length-a.length)+')</button></div>';
 el.innerHTML=h}
function a13lnk(u){if(u.k==='ads'&&A13UU.test(String(u.id)))return '<a class="ab" data-a13="x" href="#p-'+X(u.id)+'">فتح صفحة الإعلان</a>';
 if(u.k==='biz'&&A13UU.test(String(u.id)))return '<a class="ab" data-a13="x" href="#biz-'+X(u.id)+'">فتح صفحة النشاط</a>';
 if(u.k==='home')return '<button type="button" class="ab" data-a13="go" data-v="site">فتح واجهة الموقع والأقسام (ADM2)</button>';return ''}
function a13open(i){var f=A13.F[i];if(!f)return;a13close();var k=a13kind(f),seg=f.p.split('/')[0],own='غير متاح',um=(AD.um||{})[seg];
 if(A13UU.test(seg))own='مجلد المستخدم <bdi dir="ltr">'+X(seg)+'</bdi>'+(um?' ('+X(um.display_name||um.business_name||um.name||um.full_name||'—')+')':'');
 var acc=k!=='image'?'لم يُختبر (ليست صورة)':f.ok===true?'قابل للوصول (حُمّلت المعاينة)':f.ok===false?'تعذّر تحميل المعاينة':'لم يُختبر بعد';
 var row=function(a,b){return '<dt>'+a+'</dt><dd>'+b+'</dd>'};
 var th=k==='image'?(f.ok===false?'تعذّر تحميل المعاينة':'<img decoding="async" data-a13i="'+f.i+'" alt="" src="'+X(a13url(f))+'">'):A13KL[k];
 var lk=f.u.map(a13lnk).filter(Boolean).join(' ');
 var o=document.createElement('div');o.className='a13ov';o.id='a13ov';
 o.innerHTML='<div class="a13dlg" role="dialog" aria-modal="true" aria-label="تفاصيل الملف"><button type="button" class="a13x" data-a13="close" aria-label="إغلاق">×</button><div class="a13th a13big">'+th+'</div><dl class="a13dl">'
  +row('الاسم','<bdi>'+X(f.n)+'</bdi>')+row('النوع',A13KL[k]+(f.mt?' (<bdi dir="ltr">'+X(f.mt)+'</bdi>)':''))+row('الحجم',a13fs(f.sz))+row('الحاوية','<bdi dir="ltr">'+X(f.b)+'</bdi> · '+X(f.bl))+row('المسار','<bdi dir="ltr">'+X(f.p)+'</bdi>')+row('تاريخ الإضافة',a13fd(f.cr))+row('صاحب الملف',own)+row('مكان الاستخدام',X(a13use(f)))+row('إمكانية الوصول',X(acc))+'</dl>'+(lk?'<div class="adbs">'+lk+'</div>':'')+'</div>';
 document.body.appendChild(o);var x=o.querySelector('.a13x');if(x)x.focus()}
function a13close(){var o=E('a13ov');if(o)o.remove()}
function a13lst(L,cols,empty){if(!L.length)return '<p class="adE">'+empty+'</p>';return (L.length>50?'<p class="adE" style="padding:0 0 6px;text-align:start">يُعرض أول 50 من '+L.length+'.</p>':'')+a9tab(L.slice(0,50),cols)}
function a13revPage(){var h='<div class="adE" style="text-align:start;padding:10px 14px;margin-bottom:10px">هذه مؤشرات للمراجعة وليست مخالفة تلقائياً. المراجعة الفعلية والقرارات تبقى بصلاحيات مراجعة الإعلان أو النشاط نفسه (ADM4 وADM7)، ولا تُحذف الملفات لأن الإعلان رُفض أو أُوقف: قد تلزم للسجلات والمراجعة اللاحقة.</div>';
 var R=A13.R,st=function(f){var u=f.u.filter(function(x){return x.k==='ads'&&R&&R.L[x.id]})[0];return u?(R.L[u.id].status):''};
 var cols=[['الملف',function(f){return '<button type="button" class="ab" data-a13="open" data-i="'+f.i+'">'+X(f.n)+'</button>'}],['الحاوية',function(f){return '<bdi dir="ltr">'+X(f.b)+'</bdi>'}],['حالة الإعلان',function(f){return X(SL[st(f)]||st(f)||'—')}],['الإعلان',function(f){var u=f.u.filter(function(x){return x.k==='ads'})[0];return u?'<bdi dir="ltr">'+X(String(u.id).slice(0,8))+'</bdi>':'—'}]];
 if(!R||R.e){h+='<p class="adE er">تعذّرت قراءة حالات الإعلانات: '+X(R?R.e:'غير متاح')+'</p>'}
 else{h+='<h3>صور إعلانات بانتظار المراجعة</h3>'+a13lst(A13.F.filter(function(f){return st(f)==='pending'}),cols,'لا توجد صور مرتبطة بإعلانات بانتظار المراجعة ضمن الملفات المقروءة.')
  +'<h3>ملفات مرتبطة بإعلان مرفوض أو موقوف (تُحفظ ولا تُحذف)</h3>'+a13lst(A13.F.filter(function(f){var s=st(f);return s==='rejected'||s==='suspended'}),cols,'لا توجد ملفات مرتبطة بإعلانات مرفوضة أو موقوفة ضمن الملفات المقروءة.')}
 var un=(A13.uOK&&!A13.trunc)?A13.F.filter(function(f){return !f.u.length}):null;
 h+='<h3>ملفات بلا ربط في السجلات المقروءة</h3>'+(un?a13lst(un,[cols[0],cols[1],['الإضافة',function(f){return a13fd(f.cr)}]],'كل الملفات المقروءة مرتبطة بسجل.')+'<p class="adE" style="padding:6px 0;text-align:start">غياب الربط ليس مخالفة: قد يكون الملف يخص سجلاً لا تقرؤه هذه الصفحة.</p>':'<p class="adE">غير متاح: الربط غير مكتمل (فشل قراءة جدول أو تجاوز الحد أو قراءة جزئية للملفات).</p>');
 h+='<h3>صور مكررة</h3><p class="adE" style="text-align:start">غير مدعوم: الكشف الموثوق يحتاج مقارنة بصمة محتوى الملف على الخادم، وأسماء الملفات تُولَّد بطابع زمني فلا يُعتمد عليها.</p><h3>ملفات مُبلَّغ عنها</h3><p class="adE" style="text-align:start">غير مدعوم: البلاغات في المنصة مسجلة على الإعلانات وليست على الملفات.</p>';return h}
function a13homePage(){var H=A13.F.filter(function(f){return a13has(f,'home')}),e=A13.U.home&&A13.U.home.e;
 var h='<div class="adE" style="text-align:start;padding:10px 14px;margin-bottom:10px">الصور المعروضة هي ما يشير إليه محتوى الصفحة الرئيسية المحفوظ (ADM2 / جدول b59_site) من ملفات الحاوية site-assets. الاستبدال يتم فقط من واجهة الموقع والأقسام حيث آلية الرفع والتحقق قائمة. الصور الثابتة داخل index.html لا تظهر هنا لأنها ليست في Storage.</div>';
 if(e)return h+'<p class="adE er">تعذّرت قراءة محتوى الصفحة الرئيسية: '+X(e)+'</p>';
 h+='<div class="adbs" style="margin:0 0 10px"><button type="button" class="ab pr" data-a13="go" data-v="site">فتح واجهة الموقع والأقسام</button></div>';
 return h+(H.length?a9tab(H,[['معاينة',function(f){return f.ok===false?'تعذّر التحميل':'<img class="a13sm" loading="lazy" decoding="async" data-a13i="'+f.i+'" alt="" src="'+X(a13url(f))+'">'}],['الملف',function(f){return '<button type="button" class="ab" data-a13="open" data-i="'+f.i+'"><bdi>'+X(f.n)+'</bdi></button>'}],['مكان الظهور',function(f){return X(a13use(f))}],['الحجم',function(f){return a13fs(f.sz)}]]):'<p class="adE">لا توجد ملفات مرتبطة بالصفحة الرئيسية ضمن ما قُرئ.</p>')}
function a13upPage(){return '<h3>الرفع</h3><div class="adE" style="text-align:start;padding:10px 14px;margin-bottom:10px">لا يوجد رفع عام من هذه الصفحة، لأن سياسات الكتابة في Storage لا يمكن التحقق منها من المتصفح، ولا يجوز إنشاء ملفات تجريبية في التخزين الحقيقي. الرفع القائم حالياً يتم من مساره المخصص: صور الإعلانات والحساب من صفحات المستخدمين، وخلفيات شرائح الصفحة الرئيسية من واجهة الموقع (ADM2).</div>'
 +a9tab([['الأنواع المسموحة في رفع الصور القائم','JPG وPNG وWEBP فقط (لا ملفات تنفيذية ولا PDF)'],['الحد الأقصى الافتراضي','5 ميغابايت للملف'],['فحص الملف','فحص نوع الملف وحجمه، وفحص توقيع الملف الفعلي قبل الرفع'],['الحماية الفعلية','سياسات Storage في Supabase (تُختبر من لوحة Supabase، لا من هذه الصفحة)']],[['البند',function(r){return X(r[0])}],['القيمة',function(r){return X(r[1])}]])
 +'<h3>الحذف</h3><div class="adE" style="text-align:start;padding:10px 14px">الحذف غير مفعّل ولا يوجد زر حذف: لا توجد دالة خادم مخصصة لحذف الملفات مع تسجيلها في التدقيق، ولا آلية أرشفة أو حذف منطقي للملفات، والاعتماد على إخفاء الزر وحده لا يحمي. لا حذف جماعي ولا تنظيف تلقائي. أي حذف مستقبلي يلزمه: التحقق من أن الملف غير مرتبط بسجل، وتحذير واضح، وصلاحية خاصة، وتسجيل في التدقيق من الخادم.</div>'
 +'<h3>ما لم يُنفَّذ</h3><ul style="padding-inline-start:20px;line-height:1.9"><li>رفع الملفات واستبدال صور الصفحة الرئيسية من المركز.</li><li>الحذف والأرشفة.</li><li>الصور المصغّرة من الخادم ومساحة التخزين الإجمالية.</li><li>اكتشاف الصور المكررة والملفات المُبلَّغ عنها.</li><li>قراءة الحاويات الخاصة (إثباتات الدفع وملفات الدعم وصور الطلبات).</li></ul>'}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-a13]');
 if(e.target.id==='a13ov'){a13close();return}
 if(!b||!b.closest('#adm,#a13ov'))return;var k=b.dataset.a13;
 if(k==='tab'){A13.tab=b.dataset.v;A13.n=A13PG;a13draw();return}
 if(k==='refresh'){a13load();return}
 if(k==='open'){a13open(+b.dataset.i);return}
 if(k==='close'||k==='x'){a13close();return}
 if(k==='more'){A13.n+=A13PG;a13lib();return}
 if(k==='go'){a13close();var n=document.querySelector('#adsub button[data-t="'+b.dataset.v+'"]');if(n)n.click()}});
document.addEventListener('input',function(e){if(e.target.id==='a13q'){A13.q=e.target.value;A13.n=A13PG;a13lib()}});
document.addEventListener('change',function(e){var m={a13ty:'ty',a13bk:'bk',a13dy:'dy',a13so:'so'}[e.target.id];if(!m)return;A13[m]=m==='dy'?+e.target.value:e.target.value;A13.n=A13PG;a13lib()});
document.addEventListener('error',function(e){var t=e.target;if(!t||t.tagName!=='IMG'||t.dataset.a13i==null)return;var f=A13.F[+t.dataset.a13i];if(f&&f.ok!==false){f.ok=false;A13.fail++}var s=document.createElement('span');s.textContent='تعذّر تحميل المعاينة';t.replaceWith(s)},true);
document.addEventListener('load',function(e){var t=e.target;if(!t||t.tagName!=='IMG'||t.dataset.a13i==null)return;var f=A13.F[+t.dataset.a13i];if(f&&f.ok===null)f.ok=true},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape')a13close()});
function a13Page(){a13load()}

/* ===== ADM14: مركز النسخ الاحتياطي والتعافي من الكوارث. قراءة فقط: لا ينشئ نسخاً ولا يستعيد ولا يحمّل نسخاً ولا يعدّل Supabase أو Netlify. لا يوجد في المنصة سجل عمليات نسخ ولا وجهات نسخ مسجلة، ولا يمكن قراءة نسخ Supabase من المتصفح؛ لذلك لا يظهر أي بند «يعمل» بلا دليل، وما يظهر من تاريخ هو إقرار يدخله المدير في B91 (محفوظ في هذا المتصفح فقط) ولم تتحقق الصفحة منه. المدير العام فقط. ===== */
var A14={tab:'ov',cnt:{},bk:{},run:0,at:null,busy:0};
var A14T=[['ov','نظرة عامة'],['types','أنواع النسخ'],['log','السجل والوجهات'],['integ','سلامة النسخ'],['rec','التعافي والاستعادة'],['dr','خطة التعافي']];
function a14it(id){var it=B91.IT.filter(function(i){return i[0]===id})[0];if(!it)return{k:'na',t:'غير متاح',n:'',e:'',d:''};
 var r=b91load()[id]||{},s=b91state(it),o={e:String(r.e||'').trim(),d:r.d||''};
 if(!r.v){o.k='na';o.t='غير متاح';o.n='لا إقرار ولا عملية مسجلة.'}
 else if(r.v==='no'){o.k='warn';o.t='يحتاج إلى إعداد';o.n='أقرّ المدير بعدم توفره.'}
 else if(r.v==='unk'){o.k='na';o.t='لم يتم التحقق';o.n='أقرّ المدير بأنه لا يعرف.'}
 else if(s.s==='ok'){o.k='na';o.t='لم يتم التحقق';o.n='إقرار المدير بتاريخ '+r.d+': لم تتحقق الصفحة منه.'}
 else{o.k='warn';o.t='يحتاج إلى إعداد';o.n=s.n}
 return o}
function a14gate(t){if((AD.roles||[]).indexOf('platform_admin')<0){E('adm').innerHTML='<h2>'+X(t)+'</h2><p class="adE">مركز النسخ والتعافي للمدير العام فقط.</p>';return false}return true}
function a14measure(){var P=A14;if(P.busy)return;P.busy=1;P.cnt={};P.bk={};var all=[];B91.CT.forEach(function(c){c[1].forEach(function(n){all.push(n)})});var c=sbc(),i=0;
 function nx(){var b=all.slice(i,i+6);i+=6;if(!b.length)return Promise.resolve();return Promise.all(b.map(function(n){return b90cnt(n).then(function(r){P.cnt[n]=r.e?null:r.n})})).then(nx)}
 nx().then(function(){return B91.BK.reduce(function(p,b){return p.then(function(){return Promise.resolve(c.storage.from(b[0]).list('',{limit:1})).then(function(r){P.bk[b[0]]=!r.error},function(){P.bk[b[0]]=false})})},Promise.resolve())}).then(function(){P.run=1;P.at=Date.now();P.busy=0;a14draw()},function(){P.busy=0;a14draw()})}
function a14Page(){if(!a14gate('مركز النسخ الاحتياطي والتعافي'))return;b91load();a14draw()}
function a14draw(){E('adm').innerHTML='<h2>مركز النسخ الاحتياطي والتعافي</h2><p class="adE" style="padding:0 0 10px;text-align:start">عرض للقراءة فقط. لا ينشئ نسخاً ولا يستعيد ولا يحمّل بيانات. لا يوجد في المنصة سجل عمليات نسخ، والنسخ لا تُقرأ من المتصفح، فتأتي التواريخ من إقرارات المدير في صفحة B91 (محفوظة في هذا المتصفح فقط).</p>'
 +'<div class="a13t" role="tablist">'+A14T.map(function(t){return '<button type="button" class="a13tb'+(A14.tab===t[0]?' on':'')+'" data-a14="tab" data-v="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div><div id="a14b"></div>';
 E('a14b').innerHTML=({ov:a14ov,types:a14types,log:a14log,integ:a14integ,rec:a14rec,dr:a14dr}[A14.tab]||a14ov)()}
function a14row(l,o,x){return [l,f8pill(o.k,o.t),X(x!=null?x:(o.n+(o.e?' — '+o.e:'')))]}
function a14tab(rows){return a9tab(rows,[['البند',function(r){return X(r[0])}],['الحالة',function(r){return r[1]}],['التفاصيل',function(r){return r[2]}]])}
function a14ov(){var c1=a14it('c1'),c2=a14it('c2'),c5=a14it('c5'),c6=a14it('c6'),c7=a14it('c7'),c9=a14it('c9'),na={k:'na',t:'غير متاح'};
 var rows=[a14row('حالة منظومة النسخ الاحتياطي (قاعدة البيانات)',c1),a14row('آخر نسخة احتياطية ناجحة',c2),a14row('وقت آخر محاولة نسخ',na,'لا سجل عمليات نسخ في المنصة.'),a14row('نتيجة آخر عملية',na,'لا عملية مسجلة.'),
  a14row('البيانات المشمولة: قاعدة البيانات',c1),a14row('البيانات المشمولة: ملفات Storage',c5),a14row('البيانات المشمولة: ملفات الموقع خارج Netlify',c6),a14row('البيانات المشمولة: توثيق إعدادات الخدمات',c7),
  a14row('التحقق من سلامة النسخة',na,'لا فحص سلامة مسجل.'),a14row('آخر اختبار استعادة ناجح',c9)];
 var P=A14,t=0,ok=0,bad=0;B91.CT.forEach(function(c){c[1].forEach(function(n){t++;if(P.cnt[n]!==undefined){if(P.cnt[n]===null)bad++;else ok++}})});
 var bkOK=Object.keys(P.bk).length?B91.BK.every(function(b){return P.bk[b[0]]}):null;
 var live=[['اتصال Supabase',sbc()?{k:'ok',t:'يعمل'}:{k:'bad',t:'فشل'},sbc()?'العميل جاهز في هذه الجلسة.':'غير جاهز.'],
  ['قراءة الجداول المرئية',P.run?(bad?{k:'warn',t:'يحتاج إلى إعداد'}:{k:'ok',t:'يعمل'}):{k:'na',t:'لم يتم التحقق'},P.run?ok+' من '+t+' جدولاً قابلاً للعدّ'+(bad?'، و'+bad+' غير متاح (غير موجود أو RLS)':''):'لم يُشغَّل القياس بعد.'],
  ['قراءة حاويات Storage',bkOK==null?{k:'na',t:'لم يتم التحقق'}:bkOK?{k:'ok',t:'يعمل'}:{k:'warn',t:'يحتاج إلى إعداد'},'قابلية القراءة لا تثبت وجود نسخة.']];
 return a14tab(rows)+'<h3>فحوصات اتصال (ليست دليل نسخ احتياطي)</h3>'+a14tab(live.map(function(r){return [r[0],f8pill(r[1].k,r[1].t),X(r[2])]}))
  +'<div class="adbs"><button type="button" class="ab pr" data-a14="run">'+(P.busy?'جارٍ القياس…':'قياس الجداول والحاويات (قراءة فقط)')+'</button><button type="button" class="ab" data-a14="go" data-v="b91">فتح صفحة B91 لتسجيل الإقرارات</button></div>'
  +'<p class="adE" style="text-align:start">آخر قياس: '+X(b90tm(P.at))+'. التنبيهات: ADM11 غير موجود في الكود الحالي، فلا ربط بتنبيهات النسخ الاحتياطي ولا تُرسل تنبيهات.</p>'}
function a14types(){var G=[['ملفات الموقع',['c6'],['ملفات الواجهة والكود (index.html وapp.js وstyle.css)','الصور والملفات الثابتة والفيديو الافتتاحي','إعدادات البناء والتشغيل (Netlify)']],
  ['قاعدة البيانات',['c1','c2','c3','c4'],['الإعلانات والحسابات والأنشطة','الطلبات والمحادثات والسجلات والمدفوعات','الإعدادات والصلاحيات (RLS والدوال)']],
  ['الملفات المرفوعة (Storage)',['c5'],['صور الإعلانات والحسابات والخدمات والطلبات','إثباتات الدفع وملفات الدعم (خاصة)','لا تدخل ضمن نسخ قاعدة البيانات']],
  ['إعدادات الخدمات',['c7','c8','c11'],['Auth وروابط التوجيه والبريد','ملفات SQL المنفَّذة وسياسات Storage','الأسرار تُسترجع من مصدرها الآمن ولا تُعرض هنا']]];
 return '<div class="adE" style="text-align:start;padding:10px 14px;margin-bottom:10px">نسخ ملفات الموقع وحدها ليس نسخة كاملة من BAHR، ونسخة قاعدة البيانات لا تشمل ملفات Storage. لكل نوع نسخته المستقلة.</div><div class="a13g" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr))">'
 +G.map(function(g){var its=g[1].map(a14it),w=its.filter(function(x){return x.k==='warn'}).length?{k:'warn',t:'يحتاج إلى إعداد'}:its.some(function(x){return x.e||x.d})?{k:'na',t:'لم يتم التحقق'}:{k:'na',t:'غير متاح'};
  return '<div class="a13c" style="cursor:default"><b>'+X(g[0])+'</b>'+f8pill(w.k,w.t)+'<small>'+g[2].map(X).join('<br>')+'</small><small>'+g[1].map(function(id,i){var it=B91.IT.filter(function(x){return x[0]===id})[0];return X(it[1])+': '+X(its[i].t)}).join('<br>')+'</small></div>'}).join('')+'</div>'
 +'<h3>حاويات Storage</h3>'+a9tab(B91.BK,[['الحاوية',function(b){return '<bdi dir="ltr">'+X(b[0])+'</bdi>'}],['الوصف',function(b){return X(b[1])}],['قابلية القراءة',function(b){var v=A14.bk[b[0]];return v===undefined?f8pill('na','لم يتم التحقق'):v?f8pill('ok','يعمل'):f8pill('bad','فشل')}]])}
function a14log(){var d=[['c5','ملفات Storage'],['c6','ملفات الموقع'],['c7','توثيق الإعدادات']];
 return '<h3>سجل عمليات النسخ</h3><div class="adE" style="text-align:start;padding:10px 14px">لم يتم ربط النسخ الاحتياطي بعد: لا يوجد جدول ولا دالة خادم تسجّل عمليات النسخ (رقم العملية، البدء والانتهاء، الحجم، الخطأ)، فلا تُعرض سجلات وهمية. عند وجود سجل فعلي يُضاف الجدول مع البحث والتصفية حسب التاريخ والنوع والحالة.</div>'
 +'<h3>وجهات النسخ</h3><p class="adE" style="padding:0 0 8px;text-align:start">لا وجهات مسجلة في النظام. الأوصاف أدناه من إقرارات المدير في B91 ولم يتحقق منها النظام، ولا يُربط أي تخزين خارجي جديد.</p>'
 +a9tab(d,[['النوع',function(x){return X(x[1])}],['وصف الوجهة (إقرار المدير)',function(x){var o=a14it(x[0]);return o.e?X(o.e):'لا وصف'}],['آخر نسخة (إقرار)',function(x){var o=a14it(x[0]);return o.d?X(o.d):'—'}],['حالة الاتصال وصلاحية الوصول',function(){return f8pill('na','لم يتم التحقق')}]])}
function a14integ(){var na='<span class="b88p b88p-na">غير متاح</span>',c9=a14it('c9');
 return '<div class="adE" style="text-align:start;padding:10px 14px;margin-bottom:10px">وجود نسخة لا يعني أنها قابلة للاستعادة. لا تُعتبر النسخة صالحة لمجرد وجودها أو نجاح رفعها؛ الدليل الوحيد هو اختبار استعادة في بيئة منفصلة.</div>'
 +a14tab([['اكتمال الملف',{k:'na',t:'غير متاح'},'لا فحص مسجل.'],['إمكانية قراءة النسخة',{k:'na',t:'غير متاح'},'لا فحص مسجل.'],['تطابق بصمة الملف',{k:'na',t:'غير متاح'},'لا بصمات محفوظة في المنصة.'],['وجود الملفات الأساسية المطلوبة',{k:'na',t:'غير متاح'},'لا فحص مسجل.'],['تاريخ آخر فحص',{k:'na',t:'غير متاح'},'لا فحص مسجل.']].map(function(r){return [r[0],f8pill(r[1].k,r[1].t),X(r[2])]}).concat([a14row('اختبار استعادة في بيئة منفصلة',c9)]))}
function a14rec(){var G=[['ملفات الموقع','c6',['تحديد نسخة الواجهة المطلوبة','تجهيز موقع النشر المستهدف','مراجعة إعدادات البناء']],['قاعدة البيانات','c2',['تحديد النسخة والبيئة المستهدفة','فحص توافق النسخة مع المخطط الحالي','خطة تراجع قبل أي كتابة على البيانات الحية']],['الملفات المرفوعة','c5',['تحديد نسخة الملفات (مستقلة عن قاعدة البيانات)','التأكد من الحاويات وسياساتها','مطابقة الملفات مع سجلاتها']],['إعدادات الخدمات','c7',['جرد إعدادات Auth وSQL والسياسات','استرجاع الأسرار من مصدرها الآمن','اختبار الاتصال بكل خدمة']]];
 return '<div class="adE" style="text-align:start;padding:10px 14px;margin-bottom:10px"><b>لا توجد أزرار استعادة.</b> لا آلية استعادة آمنة ومختبرة في المنصة، ولا تُستعاد نسخة فوق البيانات الحية دون حماية ومراجعة مسبقة.</div><div class="a13g" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr))">'
 +G.map(function(g){var o=a14it(g[1]);return '<div class="a13c" style="cursor:default"><b>استعادة '+X(g[0])+'</b>'+f8pill('warn','غير جاهز')+'<small>المتوفر: '+X(o.k==='na'&&!o.e&&!o.d?'لا شيء مسجل':o.n)+'<br>المفقود: آلية استعادة مختبرة.</small><small>قبل الاستعادة:<br>'+g[2].map(X).join('<br>')+'</small></div>'}).join('')+'</div>'
 +'<h3>شروط أي استعادة مستقبلية</h3><ol style="padding-inline-start:20px;line-height:1.9"><li>صلاحية إدارية خاصة.</li><li>تحديد النسخة والبيئة المستهدفة.</li><li>تأكيد صريح على العملية.</li><li>فحص توافق النسخة.</li><li>خطة تراجع عند الفشل.</li><li>سجل تدقيق للعملية.</li></ol>'}
function a14dr(){var cf=window.BAHR_CONFIG||{},c10=a14it('c10'),c9=a14it('c9'),meta=(document.querySelector('meta[name="bahr-version"]')||{}).content||'غير معروف';
 var sv=[['Supabase (Auth وقاعدة البيانات وStorage)','الرابط في supabase-config.js'],['مكتبة supabase-js عبر jsDelivr','سطر script في index.html'],['استضافة الواجهة (Netlify)','مذكورة في خطة B91؛ لا اتصال بها من الصفحة'],['خطوط Google Fonts','رابط في index.html'],['Web Push','pushEnabled = '+(cf.pushEnabled?'true':'false')+' في الإعداد']];
 return '<div class="adE" style="text-align:start;padding:10px 14px;margin-bottom:10px">صفحة مرجعية. لا تُخترع أسماء مسؤولين ولا نتائج اختبارات؛ ما لم يوثَّق يظهر «غير محدد».</div>'
 +'<h3>الخدمات التي يعتمد عليها الكود</h3>'+a9tab(sv,[['الخدمة',function(r){return X(r[0])}],['مصدر المعلومة',function(r){return X(r[1])}]])
 +'<p class="adE" style="text-align:start">إصدار الواجهة (meta bahr-version): '+X(meta)+'</p>'
 +'<h3>ترتيب استعادة مقترح (للمراجعة، وليس خطة معتمدة)</h3><ol style="padding-inline-start:20px;line-height:1.9"><li>مشروع Supabase وقاعدة البيانات (المخطط والسياسات والدوال).</li><li>حاويات Storage ثم الملفات.</li><li>إعدادات Auth والأسرار من مصدرها الآمن.</li><li>استضافة الواجهة وإعداداتها.</li><li>اختبار الدخول والإعلانات والصور.</li></ol>'
 +a14tab([['الجهات والمسؤوليات',{k:'na',t:'غير محدد'},'لا تحديد في المنصة.'],a14row('خطة استعادة موثقة (تاريخ آخر مراجعة)',c10),a14row('نتيجة آخر اختبار استعادة',c9)].map(function(r){return r.length===3&&typeof r[1]==='string'?r:[r[0],f8pill(r[1].k,r[1].t),X(r[2])]}))}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#adm [data-a14]');if(!b)return;var k=b.dataset.a14;
 if(k==='tab'){A14.tab=b.dataset.v;a14draw();return}
 if(k==='run'){a14measure();a14draw();return}
 if(k==='go'){var n=document.querySelector('#adsub button[data-t="'+b.dataset.v+'"]');if(n)n.click()}});

})();
/* ===== مجسم جت سكي 3D (Three.js r128 من cdnjs، يُحمَّل عند الاقتراب من القسم) ===== */
(function(){
var sec=E('show3d');if(!sec)return;var started=false;
function fail(){E('j3m').textContent='تعذّر تشغيل المجسم ثلاثي الأبعاد على هذا الجهاز.'}
function boot(){if(started)return;started=true;var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=init;s.onerror=fail;document.head.appendChild(s)}
if('IntersectionObserver'in window)new IntersectionObserver(function(e){if(e[0].isIntersecting)boot()},{rootMargin:'300px'}).observe(sec);else boot();
function init(){var T=window.THREE,cv=E('j3'),box=cv.parentNode,ren;
 try{ren=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){fail();return}
 ren.setPixelRatio(Math.min(devicePixelRatio||1,2));
 var sc=new T.Scene(),cam=new T.PerspectiveCamera(36,1,.1,100);
 sc.add(new T.HemisphereLight(0xffffff,0x1a3a6a,.95));var dl=new T.DirectionalLight(0xffffff,1.1);dl.position.set(4,6,3);sc.add(dl);var rl=new T.PointLight(0x5aa0ff,.9,20);rl.position.set(-4,2,-3);sc.add(rl);
 var M=function(c,r,m){return new T.MeshStandardMaterial({color:c,roughness:r,metalness:m})};
 var mDeck=M(0xf2f4f7,.35,.15),mSeat=M(0x4a2c20,.7,0),mHull=M(0x15181d,.5,.3),mEng=M(0x8b95a3,.3,.8),mJet=M(0xb8c0cc,.25,.9),mMetal=M(0x9aa3b0,.3,.9),
  mGlass=new T.MeshStandardMaterial({color:0x9fd0ff,transparent:true,opacity:.35,roughness:.1});
 var sph=function(m,sx,sy,sz,x,y,z){var o=new T.Mesh(new T.SphereGeometry(1,40,24),m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o};
 var cyl=function(m,rt,rb,h,x,y,z,rx,rz){var o=new T.Mesh(new T.CylinderGeometry(rt,rb,h,24),m);o.position.set(x,y,z);o.rotation.x=rx||0;o.rotation.z=rz||0;return o};
 var ski=new T.Group();
 ski.add(sph(mHull,2.7,.42,.95,0,-.05,0),sph(mDeck,2.5,.38,.88,0,.2,0),sph(mDeck,1.1,.36,.72,1.1,.45,0),sph(mSeat,1.05,.17,.42,-.8,.55,0));
 ski.add(cyl(mMetal,.07,.07,.5,.55,.8,0,0,.35),cyl(mMetal,.05,.05,1.1,.45,1.02,0,Math.PI/2,0));
 var gl=new T.Mesh(new T.BoxGeometry(.04,.5,.7),mGlass);gl.position.set(1,.95,0);gl.rotation.z=.55;ski.add(gl);
 var eng=new T.Group();eng.add(new T.Mesh(new T.BoxGeometry(1.1,.4,.6),mEng));[-.2,0,.2].forEach(function(z){eng.add(cyl(mEng,.13,.13,.3,0,.3,z))});eng.position.set(-.2,.3,0);ski.add(eng);
 var nz=cyl(mJet,.22,.32,.6,-2.6,.05,0,0,Math.PI/2);ski.add(nz,cyl(mMetal,.34,.34,.08,-2.3,.05,0,0,Math.PI/2));
 sc.add(ski);
 var water=new T.Mesh(new T.CircleGeometry(6,48),new T.MeshStandardMaterial({color:0x0a4fd0,transparent:true,opacity:.5,roughness:.2}));water.rotation.x=-Math.PI/2;water.position.y=-.55;sc.add(water);
 var rip=new T.Mesh(new T.RingGeometry(2.8,2.9,64),new T.MeshBasicMaterial({color:0x8fc1ff,transparent:true,opacity:.5,side:T.DoubleSide}));rip.rotation.x=-Math.PI/2;rip.position.y=-.53;sc.add(rip);
 var BASE=11000,ST=[
  {n:'اللون والهيكل',o:[['أبيض لؤلؤي',0xf2f4f7,0],['أزرق بحر',0x0145F2,150],['أسود مات',0x1c1f24,200],['أحمر',0xc8102e,150]],a:[.2,.65,.55],p:{y:.35,d:6.2,h:2.2,t:[0,.3,0]}},
  {n:'المحرك',o:[['1050 cc',0x8b95a3,0,'≈ 130 حصان'],['1800 cc',0x4aa3ff,2200,'≈ 180 حصان'],['1800 cc مع شاحن',0xff6a2a,4800,'≈ 250 حصان']],a:[-.2,.6,0],p:{y:.2,d:5,h:3.6,t:[-.2,.3,0]}},
  {n:'المقعد',o:[['جلد بني',0x4a2c20,0],['أسود',0x14161a,0],['رمادي فاتح',0x9aa1aa,100]],a:[-.8,.78,0],p:{y:.5,d:5,h:2.2,t:[-.8,.5,0]}},
  {n:'الزجاج الأمامي',o:[['شفاف',0x9fd0ff,0],['مدخّن',0x1a1d22,120]],a:[1,1.25,0],p:{y:-.9,d:5,h:2.2,t:[1,.7,0]}},
  {n:'الدفع النفاث',o:[['قياسي',0xb8c0cc,0],['رياضي',0xff7a1a,600]],a:[-2.7,.3,0],p:{y:1.2,d:5.2,h:2,t:[-2.5,.1,0]}}];
 var OV={y:.7,d:7.6,h:2.7,t:[0,.2,0]},pick=[0,0,0,0,0],sel=-1,P=Object.assign({},OV),C=Object.assign({},OV),pn=E('j3p'),hh=E('j3h'),W=1,H=1;
 var hs=ST.map(function(s,i){var b=document.createElement('button');b.className='hs';b.textContent=i+1;b.setAttribute('aria-label',s.n);b.dataset.s=i;hh.appendChild(b);return b});
 function apply(){mDeck.color.setHex(ST[0].o[pick[0]][1]);var e=ST[1].o[pick[1]];mEng.color.setHex(e[1]);eng.scale.setScalar(1+.08*pick[1]);mSeat.color.setHex(ST[2].o[pick[2]][1]);
  mGlass.color.setHex(ST[3].o[pick[3]][1]);mGlass.opacity=pick[3]?.65:.35;mJet.color.setHex(ST[4].o[pick[4]][1]);var x=sel===1;[mDeck,mSeat].forEach(function(m){m.transparent=x;m.opacity=x?.14:1;m.needsUpdate=true})}
 function panel(){var tot=BASE+ST.reduce(function(s,t,i){return s+t.o[pick[i]][2]},0);
  pn.innerHTML='<div class="ph"><span>Yamaha VX · نموذج توضيحي</span><b>$ '+tot.toLocaleString('en-US')+'</b></div><ol class="pst">'+ST.map(function(t,i){return '<li><button data-s="'+i+'" class="'+(i===sel?'on':'')+'"><i>'+(i+1)+'</i>'+t.n+'</button></li>'}).join('')+'</ol>'+
   (sel>=0?'<div class="pop">'+ST[sel].o.map(function(o,j){return '<button data-o="'+j+'" class="'+(j===pick[sel]?'on':'')+'">'+(sel!==1?'<s style="background:#'+('000000'+o[1].toString(16)).slice(-6)+'"></s>':'')+o[0]+(o[2]?'<em>+$'+o[2]+'</em>':'')+'</button>'}).join('')+'</div>'+(sel===1?'<p class="psp">'+ST[1].o[pick[1]][3]+' (قيمة توضيحية)</p>':''):'<p class="psp">اختر رقماً من القائمة أو من المجسم لعرض الخيارات.</p>')}
 function pickStep(i){sel=sel===i?-1:i;var p=sel<0?OV:ST[sel].p;P={y:p.y,d:p.d,h:p.h,t:p.t};apply();panel();hs.forEach(function(b,k){b.classList.toggle('on',k===sel)})}
 function onClick(e){var s=e.target.closest('[data-s]'),o=e.target.closest('[data-o]');if(s)pickStep(+s.dataset.s);else if(o){pick[sel]=+o.dataset.o;apply();panel()}}
 pn.addEventListener('click',onClick);hh.addEventListener('click',onClick);
  /* B36: التمرير يستكشف الأجزاء بالترتيب (المجسم العام ثم الأجزاء 1..5)؛ يُعطَّل مع تقليل الحركة */
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches){sec.classList.add('sd');var spb=E('j3sp'),last=-2,tk=0;
   if(spb)spb.innerHTML=ST.map(function(){return '<i></i>'}).join('');
   var sp=function(){tk=0;var r=sec.getBoundingClientRect(),tot=r.height-innerHeight;if(tot<=0)return;var p=Math.max(0,Math.min(.9999,-r.top/tot)),k=Math.floor(p*(ST.length+1))-1;
    if(k===last)return;last=k;if(k<0){if(sel>=0)pickStep(sel)}else if(k!==sel)pickStep(k);
    if(spb)[].forEach.call(spb.children,function(b,j){b.classList.toggle('on',j<=k)})};
   var onS=function(){if(!tk)tk=requestAnimationFrame(sp)};addEventListener('scroll',onS,{passive:true});addEventListener('resize',onS);sp()}
 var drag=false,lx=0,idle=0,red=matchMedia('(prefers-reduced-motion:reduce)').matches;
 cv.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX;cv.setPointerCapture(e.pointerId)});
 cv.addEventListener('pointermove',function(e){if(!drag)return;P.y+=(e.clientX-lx)*.008;C.y=P.y;lx=e.clientX;idle=performance.now()});
 ['pointerup','pointercancel'].forEach(function(n){cv.addEventListener(n,function(){drag=false})});
 function size(){W=box.clientWidth;H=box.clientHeight;ren.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix()}
 if(window.ResizeObserver)new ResizeObserver(size).observe(box);else addEventListener('resize',size);size();
 var vis=true;if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(box);
 var v=new T.Vector3(),tg=new T.Vector3(),ok=false;apply();panel();
 (function loop(t){requestAnimationFrame(loop);if(!vis)return;t*=.001;
  if(sel<0&&!drag&&!red&&performance.now()-idle>2500)P.y+=.004;
  ['y','d','h'].forEach(function(k){C[k]+=(P[k]-C[k])*.07});C.t=C.t.map(function(x,i){return x+(P.t[i]-x)*.07});
  ski.rotation.y=C.y;ski.position.y=red?0:Math.sin(t*1.5)*.05;ski.rotation.z=red?0:Math.sin(t*1.1)*.025;ski.updateMatrixWorld(true);
  tg.set(C.t[0],C.t[1],C.t[2]);ski.localToWorld(tg);tg.x*=.5;cam.position.set(0,C.h,C.d);cam.lookAt(tg);
  rip.scale.setScalar(1+((t*.4)%1)*.5);rip.material.opacity=.5*(1-((t*.4)%1));
  ren.render(sc,cam);if(!ok){ok=true;E('j3m').style.display='none'}
  hs.forEach(function(b,i){v.set(ST[i].a[0],ST[i].a[1],ST[i].a[2]);ski.localToWorld(v);v.project(cam);b.style.transform='translate('+((v.x*.5+.5)*W)+'px,'+((-v.y*.5+.5)*H)+'px) translate(-50%,-50%)';b.style.opacity=v.z<1?1:0})})(0);
 }
})();

/* ===== B12: صفحات المعلومات ومركز المساعدة + نموذج التواصل ===== */
(function(){
var H=window.BAHR_HELP||{cats:[],arts:[]},T0=document.title,PAGES={guide:'دليل الاستخدام',about:'من نحن',howitworks:'كيف تعمل المنصة',sellerguide:'دليل البائع والورش',faq:'الأسئلة الشائعة',contact:'تواصل معنا',terms:'الشروط والأحكام',privacy:'سياسة الخصوصية',safety:'السلامة والثقة',help:'مركز المساعدة'};
var X=PF.esc;
var nz=function(s){return String(s||'').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')};
var RX=/^#(guide|about|howitworks|sellerguide|faq|contact|terms|privacy|safety|help|help-[a-z0-9]+|a-[a-z0-9-]+)$/;
var hd=function(t,s,cr){return '<div class="iph">'+(cr||'')+'<h1>'+t+'</h1>'+(s?'<p>'+s+'</p>':'')+'</div>'};
var cd=function(h,b,f){return '<section class="ipc'+(f?' full':'')+'">'+(h?'<h2>'+h+'</h2>':'')+b+'</section>'};
var ul=function(a){return '<ul>'+a.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'};
var wn=function(t){return '<div class="ipw">'+t+'</div>'};
var lk=function(h,t){return '<a class="sl" href="'+h+'">'+t+'</a>'};
var LEGAL=wn('<b>نص أولي:</b> هذه الصفحة مسودة تنظيمية لم تُراجَع قانونياً بعد، ولا تُعتمد وثيقةً نهائية قبل مراجعة مختص قانوني.');
var cat=function(id){return H.cats.filter(function(c){return c.id===id})[0]};
var art=function(id){return H.arts.filter(function(a){return a.id===id})[0]};
function crumbs(a){return '<nav class="crm" aria-label="مسار التنقل">'+a.map(function(x,i){return x[0]?'<a href="'+x[0]+'">'+x[1]+'</a>':'<span>'+x[1]+'</span>'}).join('<span>›</span>')+'</nav>'}
function thumb(a){var c=cat(a.c)||{ic:'tech'};return '<div class="im">'+ic(c.ic)+(a.img?'<img src="'+X(a.img)+'" alt="'+X(a.cap||'صورة توضيحية للمقال')+'" loading="lazy" decoding="async" onerror="this.remove()">':'')+'</div>'}
function acard(a){var c=cat(a.c)||{t:''};return '<a class="ipk" href="#a-'+X(a.id)+'">'+thumb(a)+'<div class="tx"><small>'+X(c.t)+'</small><h3>'+X(a.t)+'</h3><p>'+X(a.s)+'</p></div></a>'}
function ccard(c){var n=H.arts.filter(function(a){return a.c===c.id}).length;return '<a class="ipk cat" href="#help-'+X(c.id)+'"><div class="im">'+ic(c.ic)+'</div><div class="tx"><h3>'+X(c.t)+'</h3><p>'+X(c.d)+'</p><small>'+n+' مقال</small></div></a>'}
function find(q){var t=nz(q).split(/\s+/).filter(Boolean).map(function(w){return w.length>3?w.replace(/^ال/,''):w});if(!t.length)return null;return H.arts.filter(function(a){var h=nz(a.t+' '+a.s+' '+(a.tags||'')+' '+a.b.map(function(x){return typeof x[1]==='string'?x[1]:JSON.stringify(x[1])}).join(' '));return t.every(function(w){return h.indexOf(w)>-1})})}
function hlist(q){var r=find(q);if(r)return r.length?'<p class="hmeta">'+r.length+' نتيجة</p><div class="ipg">'+r.map(acard).join('')+'</div>':cd('','<p>لا توجد مقالات مطابقة. جرّب كلمات أخرى أو تصفّح التصنيفات.</p>');
 return '<div class="ipg">'+H.cats.map(ccard).join('')+'</div><h2 style="color:var(--nav)">أحدث المقالات</h2><div class="ipg">'+H.arts.slice(0,6).map(acard).join('')+'</div>'}
var SB='<div class="hsr">'+'<input id="hq" type="search" placeholder="ابحث في المقالات…" aria-label="بحث في المقالات"><span>'+ic('search')+'</span></div>';
function body(b){return b.map(function(x){var t=x[0],v=x[1];return t==='h'?'<h2>'+X(v)+'</h2>':t==='p'?'<p>'+X(v)+'</p>':t==='ul'?'<ul>'+v.map(function(i){return'<li>'+X(i)+'</li>'}).join('')+'</ul>':t==='note'?wn(X(v)):t==='dl'?'<dl>'+v.map(function(r){return'<dt>'+X(r[0])+'</dt><dd>'+X(r[1])+'</dd>'}).join('')+'</dl>':''}).join('')}
var P={};
P.help=function(){return hd('مركز المساعدة والتعليم البحري','مقالات تعليمية عربية قصيرة عن القوارب والجت سكي والمحركات والمعدات البحرية.',crumbs([['#home','الرئيسية'],['','مركز المساعدة']]))+SB+'<div id="hr">'+hlist('')+'</div>'};
function catPage(id){var c=cat(id);if(!c)return nf();var l=H.arts.filter(function(a){return a.c===id});return hd(X(c.t),X(c.d),crumbs([['#home','الرئيسية'],['#help','مركز المساعدة'],['',X(c.t)]]))+(l.length?'<div class="ipg">'+l.map(acard).join('')+'</div>':cd('','<p>لا توجد مقالات في هذا التصنيف بعد.</p>'))}
function artPage(id){var a=art(id);if(!a)return nf();var c=cat(a.c)||{t:'',id:''};var rel=H.arts.filter(function(x){return x.c===a.c&&x.id!==a.id}).slice(0,3);document.title=a.t+' | بحر';
 return hd(X(a.t),'',crumbs([['#home','الرئيسية'],['#help','مركز المساعدة'],['#help-'+X(c.id),X(c.t)],['',X(a.t)]]))+'<article class="ipc">'+(a.img?'<figure class="ipf"><img src="'+X(a.img)+'" alt="'+X(a.cap)+'" loading="lazy" decoding="async" onerror="this.closest(\'figure\').remove()"><figcaption>'+X(a.cap)+'</figcaption></figure>':'')+'<p class="hmeta">'+X(c.t)+' · '+X(a.date)+'</p>'+body(a.b)+'</article>'+(rel.length?'<h2 style="color:var(--nav)">مقالات ذات صلة</h2><div class="ipg">'+rel.map(acard).join('')+'</div>':'')+'<p>'+lk('#help','← العودة إلى مركز المساعدة')+'</p>'}
function nf(){return hd('الصفحة غير موجودة','')+cd('','<p>تعذّر العثور على هذا المحتوى.</p><p>'+lk('#help','العودة إلى مركز المساعدة')+'</p>')}
P.about=function(){return hd('من نحن','بحر منصة عربية تجمع المهتمين بالقوارب والجت سكي والمحركات والمعدات البحرية في مكان واحد.')+cd('هدفنا',ul(['تسهيل الوصول إلى الإعلانات البحرية والورش والخدمات المتخصصة.','تقديم محتوى تعليمي مبسّط يساعد على قرار شراء أوضح.','تنظيم التعامل بين المشتري والبائع عبر ملفات واضحة ومراجعة للإعلانات.']))+cd('ما تقدمه المنصة',ul(['السوق البحري: قوارب وجت سكي ومحركات وقطع غيار ومعدات.','الخدمات والورش: فنيون وورش صيانة وتشخيص.','المفضلة والبحوث المحفوظة والتنبيهات للمستخدمين المسجلين.','مركز المساعدة: '+lk('#help','مقالات تعليمية بحرية')+'.']))+wn('بحر منصة إعلانات وتعريف. لا تبيع المعدات ولا تتسلّم أموالاً ولا تضمن الصفقات، ويبقى الاتفاق بين المشتري والبائع.')};
P.howitworks=function(){return hd('كيف تعمل المنصة','رحلة كل مستخدم من البحث حتى التواصل.')+cd('الزائر',ul(['تصفّح '+lk('#market','السوق البحري')+' و'+lk('#services','الخدمات والورش')+' دون حساب.','استخدم التصنيفات والبحث والتصفية للوصول لما يناسبك.']))+cd('المشتري','<ol class="ips"><li><span>أنشئ حساباً مجانياً عبر '+lk('#signup','التسجيل')+'.</span></li><li><span>ابحث وصفّح الإعلانات واحفظ ما يعجبك في المفضلة.</span></li><li><span>احفظ بحثاً لتصلك تنبيهات بالإعلانات المطابقة وتغيّر الأسعار.</span></li><li><span>تواصل مع صاحب الإعلان عبر بطاقة البائع وصفحته العامة، حين يختار إظهار وسيلة اتصال. التواصل المباشر داخل الإعلان نفسه غير متاح حالياً.</span></li><li><span>عاين المعدة وتحقق منها قبل الدفع، واقرأ '+lk('#safety','السلامة والثقة')+'.</span></li></ol>')+cd('البائع','<ol class="ips"><li><span>أنشئ حساباً وأكمل ملفك الشخصي.</span></li><li><span>تُراجَع الإعلانات قبل ظهورها للعامة.</span></li><li><span>يتواصل المهتمون معك عبر الوسائل التي تختار إظهارها.</span></li></ol><p>التفاصيل في '+lk('#sellerguide','دليل البائع')+'.</p>')};
P.sellerguide=function(){var o='<span class="st2 ok">متاح الآن</span>',s='<span class="st2 soon">قيد التجهيز</span>';return hd('دليل البائع والورش','خطوات واضحة، مع بيان ما هو متاح فعلاً في النسخة الحالية.')+cd('',
 '<h2>1) إنشاء الحساب '+o+'</h2><p>سجّل من '+lk('#signup','صفحة التسجيل')+' بالاسم والبريد وكلمة مرور، ثم أكّد بريدك إن طُلب منك.</p>'+
 '<h2>2) إدارة الملف الشخصي '+o+'</h2><p>من '+lk('#profile','ملفي الشخصي')+' أضف صورتك واسمك ومحافظتك ونبذة عنك وأنواع نشاطك. رقم الهاتف اختياري ولا يظهر للزوار إلا إذا فعّلت خيار عرضه.</p>'+
 '<h2>3) إضافة الإعلانات '+s+'</h2><p>واجهة النشر الذاتي للإعلانات غير مفعّلة بعد في هذه النسخة. للاستفسار عن نشر إعلان أو إدراج ورشة تواصل معنا عبر '+lk('#contact','نموذج التواصل')+'.</p>'+
 '<h2>4) رفع الصور '+s+'</h2><p>أداة رفع صور الإعلانات تأتي مع واجهة النشر. وحتى ذلك الحين جهّز صوراً واضحة بإضاءة جيدة من زوايا متعددة: الهيكل، المحرك، الرقم التسلسلي، وأي عيوب قائمة، وتجنّب الصور المنسوخة.</p>'+
 '<h2>5) مراجعة الإعلان '+o+'</h2><p>يراجع فريق بحر الإعلانات ويمكنه نشرها أو رفضها أو إيقافها. لا يظهر للعامة إلا الإعلان المنشور، ولا تُعدّ المراجعة ضماناً لجودة المعدة.</p>'+
 '<h2>الورش والخدمات</h2><p>تظهر في '+lk('#services','الخدمات والورش')+' الورش المنشورة فقط، ويُستحسن أن تذكر الخدمات والمعدات التي تتعامل معها وأوقات العمل ووسيلة اتصال.</p>')};
var QA=[['هل التسجيل مجاني؟','نعم، ولا يوجد نظام دفع أو اشتراكات في المنصة حالياً.'],['هل أحتاج حساباً للتصفح؟','لا. التصفح والبحث متاحان للجميع، أما المفضلة والبحوث المحفوظة والتنبيهات فتحتاج حساباً.'],['نسيت كلمة المرور، ماذا أفعل؟','استخدم صفحة '+lk('#forgot','استعادة كلمة المرور')+' وسيصلك رابط على بريدك.'],['كيف أضيف إعلاناً إلى المفضلة؟','يظهر زر القلب على الإعلانات الحقيقية المنشورة بعد تسجيل الدخول. الإعلانات التجريبية لا تُحفظ.'],['ما التنبيهات؟','إشعارات داخل بحر تظهر على أيقونة الجرس: رسالة جديدة، تحديث على طلبك، انخفاض سعر إعلان في مفضلتك، مطابقة بحث محفوظ، أو تغيّر حالة إعلانك. يمكنك إيقاف بعض الأنواع من صفحة التنبيهات.'],['كيف أبحث عن إعلان؟','من '+lk('#market','السوق البحري') +' اختر تصنيفاً أو اكتب في خانة البحث واستخدم المحافظة والحالة والسعر للتصفية.'],['كيف أتواصل مع صاحب الإعلان؟','عبر بطاقة البائع وصفحته العامة حين يختار إظهار رقمه. لا توجد رسائل مباشرة داخل المنصة حالياً.'],['هل الإعلانات التجريبية حقيقية؟','لا. أي إعلان موسوم «تجريبي» هو للتصميم فقط، وتُعرض عند تعذّر تحميل البيانات.'],['كيف أبلّغ عن إعلان مشبوه؟','لا يوجد زر بلاغ في الواجهة حالياً. أرسل رابط الإعلان ووصف المشكلة عبر '+lk('#contact','تواصل معنا')+'.'],['هل تضمن بحر الصفقات؟','لا. بحر منصة تعريف وإعلان، والتحقق من المعدة والبائع مسؤولية المشتري. راجع '+lk('#safety','السلامة والثقة')+'.']];
P.faq=function(){return hd('الأسئلة الشائعة','أجوبة مختصرة عن الحسابات والإعلانات والمفضلة والبحث والتواصل.')+cd('','<div class="ipq">'+QA.map(function(q){return '<details><summary>'+q[0]+'</summary><p>'+q[1]+'</p></details>'}).join('')+'</div>')};
P.safety=function(){return hd('السلامة والثقة','إرشادات تقلل مخاطر الشراء والاحتيال.')+cd('عند التعامل مع البائع',ul(['اطلع على ملفه وإعلاناته السابقة إن وُجدت.','تكلّم معه واطرح أسئلة محددة عن المعدة وتاريخها.','احذر من الاستعجال والضغط على الدفع السريع.']))+cd('التحقق من حالة المعدات',ul(['عاين المعدة بنفسك أو بواسطة فني، وطابق الرقم التسلسلي مع الأوراق.','جرّب التشغيل في الماء إن أمكن.','اقرأ '+lk('#a-used-checklist','قائمة فحص الشراء')+'.']))+cd('علامات الاحتيال',ul(['سعر أقل بكثير من المعتاد.','طلب تحويل مبلغ قبل المعاينة.','رفض المعاينة أو التجربة، أو الاكتفاء بالصور.','صور تبدو منسوخة أو لا تطابق الوصف.','طلب رموز تحقق أو بيانات حساب شخصية.']))+cd('قبل إتمام الشراء',ul(['قابل البائع في مكان عام نهاراً قدر الإمكان.','وثّق الاتفاق كتابياً واحتفظ بإيصال.','ادفع بعد التأكد من الملكية والحالة.']))+wn('قد تظهر شارة «موثّق من بحر» على بعض الملفات، وهي علامة تضعها الإدارة ولا تُعدّ ضماناً للمعدة أو للصفقة.')};
P.terms=function(){return hd('الشروط والأحكام','')+LEGAL+cd('',
 '<h2>1) التعريف والقبول</h2><p>باستخدامك منصة بحر فإنك توافق على هذه الشروط. إن لم توافق فلا تستخدم المنصة.</p>'+
 '<h2>2) طبيعة الخدمة</h2><p>بحر منصة للإعلان والتعريف، وليست طرفاً في أي صفقة بين المشتري والبائع، ولا تضمن جودة المعدات أو دقة الإعلانات.</p>'+
 '<h2>3) الحساب</h2><p>أنت مسؤول عن صحة بياناتك وسرية كلمة مرورك وما يجري عبر حسابك.</p>'+
 '<h2>4) الإعلانات والمحتوى</h2><p>الناشر مسؤول عن صحة ما ينشره وعن امتلاكه حقوق الصور. يحق للإدارة مراجعة المحتوى ورفضه أو إيقافه أو تقييد حساب مخالف.</p>'+
 '<h2>5) المحظورات</h2>'+ul(['نشر معلومات كاذبة أو مضللة.','الاحتيال أو انتحال الهوية.','نشر محتوى مخالف للقانون أو ينتهك حقوق الآخرين.','إساءة استخدام المنصة أو محاولة اختراقها.'])+
 '<h2>6) حدود المسؤولية</h2><p>[يُحدَّد النص النهائي بعد المراجعة القانونية.]</p>'+
 '<h2>7) تعديل الشروط</h2><p>قد تُحدَّث هذه الشروط، ويُعدّ استمرار الاستخدام موافقة على التحديث.</p>'+
 '<h2>8) القانون والجهة المختصة</h2><p>[تُحدَّد بعد المراجعة القانونية.]</p>')};
P.privacy=function(){return hd('سياسة الخصوصية','ما نجمعه وكيف نستخدمه، وفق ما تنفّذه النسخة الحالية.')+LEGAL+cd('',
 '<h2>البيانات التي نجمعها</h2>'+ul(['بيانات الحساب: الاسم والبريد الإلكتروني ورقم الهاتف (اختياري) وكلمة المرور (تديرها خدمة المصادقة ولا نطّلع عليها).','بيانات الملف الشخصي: المحافظة والمنطقة والنبذة والصورة وأنواع النشاط، وخيار إظهار الهاتف.','نشاطك: المفضلة والبحوث المحفوظة والتنبيهات.','الإعلانات والصور التي تُنشر عبر المنصة.','رسائل «تواصل معنا»: الاسم والبريد والموضوع والنص.'])+
 '<h2>كيف نستخدمها</h2><p>لتشغيل الحساب والإعلانات والتنبيهات، وللرد على رسائلك، ولمراجعة المحتوى والحفاظ على أمان المنصة.</p>'+
 '<h2>ما يظهر للعامة</h2><p>صفحة البائع العامة تعرض الاسم والنشاط والمحافظة والنبذة والصورة، ولا يظهر الهاتف إلا إذا فعّلت ذلك. بيانات المفضلة والتنبيهات والرسائل خاصة بصاحبها.</p>'+
 '<h2>خدمات أطراف ثالثة</h2><p>تعتمد المنصة على Supabase للحسابات وقاعدة البيانات وتخزين الصور، وعلى Google Fonts لتحميل الخط، وjsDelivr لمكتبة برمجية، وعلى Pexels لصور توضيحية. طلب هذه الموارد يكشف عنوان IP لمزوّديها حسب سياساتهم.</p>'+
 '<h2>التخزين في متصفحك</h2><p>تُحفظ جلسة الدخول في التخزين المحلي للمتصفح. لا تتضمن النسخة الحالية أدوات تحليل أو إعلانات.</p>'+
 '<h2>الحماية</h2><p>الاتصال عبر HTTPS، وصُمّمت صلاحيات الوصول على مستوى قاعدة البيانات لتحدّ من اطلاع المستخدمين على بيانات غيرهم الخاصة. لا يوجد نظام حماية مطلق.</p>'+
 '<h2>حقوقك</h2><p>تعدّل بيانات ملفك من صفحته. لا توجد أداة حذف حساب ذاتية حالياً؛ لطلب التصحيح أو الحذف راسلنا عبر '+lk('#contact','تواصل معنا')+'.</p>'+
 '<h2>مدة الاحتفاظ</h2><p>[تُحدَّد بعد المراجعة القانونية.]</p>')};
P.contact=function(){return hd('تواصل معنا','للاستفسارات والاقتراحات والإبلاغ عن مشكلة.')+cd('','<p>تُحفظ رسالتك في قاعدة بيانات بحر ويراجعها فريق المنصة. لا يُرسَل بريد تأكيد تلقائي، ولا نعد بوقت محدد للرد.</p>'+
 '<form id="cf" class="pff" novalidate><label>الاسم<input id="cf-n" maxlength="80" autocomplete="name" required><span class="fe" data-ce="n"></span></label>'+
 '<label>البريد الإلكتروني<input id="cf-e" type="email" dir="ltr" maxlength="254" autocomplete="email" required><span class="fe" data-ce="e"></span></label>'+
 '<label class="w">الموضوع<input id="cf-s" maxlength="120" required><span class="fe" data-ce="s"></span></label>'+
 '<label class="w">الرسالة<textarea id="cf-m" maxlength="2000" required></textarea><span class="fe" data-ce="m"></span></label>'+
 '<div style="position:absolute;inset-inline-start:-9999px" aria-hidden="true"><label>اترك هذا الحقل فارغاً<input id="cf-h" tabindex="-1" autocomplete="off"></label></div>'+
 '<div class="w pcn"><button class="btn btn-p" id="cf-b" type="submit">إرسال الرسالة</button></div><div class="w pmsg" id="cf-r" role="status" aria-live="polite"></div></form>')};
/* ---- نموذج التواصل ---- */
var CK='bahr_cf_t',lastT=0,lastH='';
function cfMsg(t,x){var r=E('cf-r');r.className='w pmsg'+(t?' '+t:'');r.textContent=x||''}
function cfErr(e){var m=String(e&&e.message||''),c=e&&e.code||'';if(/rate_limit/.test(m))return 'تم إرسال عدد كبير من الرسائل. حاول لاحقاً.';if(c==='42P01'||c==='PGRST205'||c==='PGRST204')return 'خدمة الرسائل غير مفعّلة على الخادم بعد، ولم تُحفظ رسالتك.';if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة. لم تُحفظ رسالتك.';return 'تعذّر حفظ الرسالة. حاول مرة أخرى لاحقاً.'}
function cfSend(e){e.preventDefault();var f=e.target;if(f._b)return;
 var v={n:E('cf-n').value.trim(),e:E('cf-e').value.trim().toLowerCase(),s:E('cf-s').value.trim(),m:E('cf-m').value.trim()},ok=true;
 var er=function(k,t){f.querySelector('[data-ce="'+k+'"]').textContent=t;if(t)ok=false};
 er('n',v.n.length<2?'أدخل اسمك (حرفان على الأقل).':'');er('e',/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.e)?'':'أدخل بريداً إلكترونياً صحيحاً.');er('s',v.s.length<3?'أدخل موضوعاً (3 أحرف على الأقل).':'');er('m',v.m.length<10?'اكتب رسالة من 10 أحرف على الأقل.':'');
 if(E('cf-h').value){return}
 if(!ok){cfMsg('er','راجع الحقول المشار إليها.');return}
 var last=lastT;try{last=Math.max(last,+localStorage.getItem(CK)||0)}catch(x){}
 var w=Math.ceil((60000-(Date.now()-last))/1000);if(w>0){cfMsg('er','انتظر '+w+' ثانية قبل إرسال رسالة أخرى.');return}
 var h=v.e+'|'+v.s+'|'+v.m;if(h===lastH){cfMsg('er','هذه الرسالة أُرسلت سابقاً.');return}
 var c=sbc();if(!c){cfMsg('er','خدمة الرسائل غير متاحة الآن، ولم تُرسَل رسالتك.');return}
 f._b=true;var b=E('cf-b');b.disabled=true;b.textContent='جارٍ الإرسال…';cfMsg('','');
 var done=function(){f._b=false;b.disabled=false;b.textContent='إرسال الرسالة'};
 c.from('contact_messages').insert({name:v.n,email:v.e,subject:v.s,message:v.m,user_id:AU.user?AU.user.id:null}).then(function(r){done();
  if(r.error){cfMsg('er',cfErr(r.error));return}
  lastT=Date.now();lastH=h;try{localStorage.setItem(CK,String(lastT))}catch(x){}
  f.reset();cfMsg('ok','تم حفظ رسالتك لدى فريق بحر. لم يُرسَل بريد تأكيد، وسنراجعها ونرد على بريدك عند الإمكان.')}).catch(function(x){done();cfMsg('er',cfErr(x))})}
/* ===== B73: (1) صفحات B12 تعرض المحتوى المنشور من B59 إن وُجد، وإلا يبقى النص الثابت. المسودات لا تُقرأ (RLS + شرط status). (2) دليل الاستخدام حسب المهمة ===== */
var CMS_SLUG={about:'about',howitworks:'howitworks',terms:'terms',privacy:'privacy',contact:'contact'};
var cmsBody=function(t){return String(t||'').split(/\n{2,}/).map(function(q){return '<p dir="auto">'+X(q).replace(/\n/g,'<br>')+'</p>'}).join('')};
function ov(k,h){var c=window.sbc&&sbc();if(!c)return;
 var ok=function(){return location.hash===h&&E('ipc')};
 if(k==='faq'){c.from('b59_faq').select('question,answer').eq('status','published').order('sort').limit(300).then(function(r){if(r.error||!r.data||!r.data.length||!ok())return;E('ipc').innerHTML=hd('الأسئلة الشائعة','')+cd('','<div class="ipq">'+r.data.map(function(q){return '<details><summary dir="auto">'+X(q.question)+'</summary>'+cmsBody(q.answer)+'</details>'}).join('')+'</div>')},function(){});return}
 var sl=CMS_SLUG[k];if(!sl)return;
 c.from('b59_pages').select('title,body').eq('slug',sl).eq('status','published').maybeSingle().then(function(r){if(r.error||!r.data||!r.data.body||!ok())return;E('ipc').innerHTML=hd(X(r.data.title||PAGES[k]),'')+cd('',cmsBody(r.data.body),true);document.title=(r.data.title||PAGES[k])+' | بحر'},function(){})}
var GUIDE=[
['إنشاء الحساب والدخول',[['#signup','إنشاء حساب','رقم الهاتف مطلوب والبريد اختياري.'],['#login','تسجيل الدخول','خيار «تذكّرني» متوفر.'],['#forgot','نسيت كلمة المرور','']]],
['البحث عن إعلان',[['#market','سوق القوارب والمحركات','استخدم الفلاتر والترتيب.'],['#find','البحث الموحّد','يبحث بالإعلانات والمتاجر والقطع.'],['#favorites','المفضلة','تحتاج حساباً.']]],
['نشر إعلان وإدارته',[['#newlisting','نشر إعلان جديد','حتى 8 صور (JPG أو PNG أو WebP). قد يمرّ الإعلان بمراجعة الإدارة قبل ظهوره.'],['#mylistings','إعلاناتي','تعديل الإعلان أو إيقافه.'],['#packages','الباقات والدفع','الدفع يدوي: ترفع إثبات الدفع وتراجعه الإدارة، ولا يُمنح شيء قبل قبوله.']]],
['صفحة نشاط تجاري',[['#business','BAHR BUSINESS','سجّل نشاطك؛ يظهر للعامة بعد موافقة الإدارة.']]],
['البحث عن قطعة غيار',[['#parts','BAHR PARTS','ابحث حسب الشركة والموديل والرقم.'],['#savedparts','قطعي المحفوظة',''],['#requestpart','طلب قطعة','إن لم تجدها.']]],
['طلب خدمة أو صيانة',[['#services','الخدمات والورش',''],['#requestservice','طلب خدمة',''],['#myrequests','طلباتي','تابع حالة الطلب.']]],
['طلب شراء واستقبال العروض',[['#buynew','طلب شراء جديد',''],['#buymine','طلباتي ومتابعة العروض',''],['#buyboard','لوحة الطلبات','للأنشطة المسجّلة.']]],
['المحادثات والتواصل',[['#inbox','محادثاتي','التواصل مع البائع من داخل المنصة.']]],
['التبليغ والدعم',[['#support','الدعم الفني','افتح تذكرة وتابع الرد.'],['#contact','تواصل معنا',''],['#safety','السلامة والثقة','']]]];
P.guide=function(){return hd('دليل استخدام بحر','كل خطوة هنا مربوطة بصفحة تعمل فعلاً في المنصة.')+wn('<b>قيد التطوير:</b> إشعارات المتصفح غير مفعّلة بعد، وبعض الصفحات تحتاج تسجيل دخول.')+GUIDE.map(function(g){return cd(g[0],'<ul>'+g[1].map(function(x){return '<li><a class="sl" href="'+x[0]+'">'+x[1]+'</a>'+(x[2]?' — '+x[2]:'')+'</li>'}).join('')+'</ul>')}).join('')};
var _help=P.help;P.help=function(){return lk('#guide','دليل استخدام المنصة خطوة بخطوة')+_help()};
/* ---- التوجيه ---- */
B12.is=function(h){return RX.test(h)};
B12.nav=function(h){return /^#(help|a-)/.test(h)?'i2':'i'};
B12.reset=function(){if(document.title!==T0)document.title=T0};
B12.page=function(h){var k=h.slice(1),o,t;
 if(k.slice(0,2)==='a-'){o=artPage(k.slice(2));t=(art(k.slice(2))||{}).t||'غير موجود'}
 else if(k.slice(0,5)==='help-'){o=catPage(k.slice(5));t=(cat(k.slice(5))||{}).t||'غير موجود'}
 else{o=P[k]();t=PAGES[k]}
 E('ipc').innerHTML=o;document.title=t+' | بحر';try{ov(k,h)}catch(x){}
 var q=E('hq');if(q)q.addEventListener('input',function(){E('hr').innerHTML=hlist(q.value)});
 var f=E('cf');if(f){f.addEventListener('submit',cfSend);if(AU.user){var md=AU.user.user_metadata||{};E('cf-n').value=md.full_name||'';E('cf-e').value=AUX.mail(AU.user)}if(window.BAHR_PF){E('cf-s').value=window.BAHR_PF.s||'';E('cf-m').value=window.BAHR_PF.m||'';window.BAHR_PF=null}}};
})();

/* ===== B55: باقات المنشورات + الدفع اليدوي + مراجعة المدفوعات (b55_commerce.sql). لا يُعرض نجاح قبل رد الخادم؛ الأسعار والرصيد من الخادم فقط ===== */
var B55={};
(function(){
var SL={awaiting_payment:'بانتظار الدفع',pending_review:'بانتظار المراجعة',need_info:'يحتاج معلومات إضافية',approved:'مقبول',rejected:'مرفوض'};
var R=function(){return E('b55c')},X=function(v){return ex(v)},nf=function(n){return Number(n||0).toLocaleString('en-US')},S={busy:false,key:null};
function em(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'نظام الباقات غير مفعّل على الخادم بعد (يلزم تطبيق b55_commerce.sql).';
 var M={forbidden:'ما عندك صلاحية لهذا الإجراء.',not_pending:'هذا الطلب لم يعد بانتظار المراجعة.',already_claimed:'استلمت الحصة المجانية سابقاً.',proof_required:'اكتب مرجع التحويل أو ارفع صورة الإثبات.',not_editable:'لا يمكن تعديل هذا الطلب الآن.',note_required:'اكتب السبب (3 أحرف على الأقل).',package_unavailable:'هذه الباقة غير متاحة.'};
 for(var k in M)if(m.indexOf(k)>-1)return M[k];return 'تعذّر تنفيذ العملية. حاول مرة ثانية.'}
function msg(t,x){var m=E('b55m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function shell(h){R().innerHTML=h+'<div id="b55m" class="msg" role="alert"></div>'}
function payCard(p,ins){var ed=p.status==='awaiting_payment'||p.status==='need_info';
 return '<div class="b17c" style="display:block;margin:10px 0" data-p="'+X(p.id)+'"><b>رقم المعاملة: <span dir="ltr">'+X(p.ref_code)+'</span></b> · '+X(SL[p.status]||p.status)+'<br><small>'+nf(p.posts)+' منشور · '+nf(p.amount_iqd)+' د.ع · '+X(new Date(p.created_at).toLocaleDateString('ar-IQ'))+'</small>'
 +(p.reviewer_note?'<p>ملاحظة الإدارة: '+X(p.reviewer_note)+'</p>':'')
 +(ed?'<p class="b17n">'+(ins?X(ins):'لم تضف الإدارة تعليمات الدفع بعد. لا تحوّل أي مبلغ قبل ظهورها.')+'</p><input data-r placeholder="مرجع التحويل" dir="ltr" maxlength="60" value="'+X(p.transfer_ref||'')+'"> <label class="btn">صورة الإثبات<input data-f type="file" accept="image/jpeg,image/png,image/webp" hidden></label> <button class="btn btn-p" data-a="send">أرسلت الدفع</button>':'')+'</div>'}
function user(){var c=sbc(),u=AU.user.id;shell('<h1>باقات المنشورات</h1><p class="b17n">جارٍ التحميل…</p>');
 Promise.all([c.from('b55_packages').select('*').eq('is_active',true).order('sort'),c.from('b55_wallets').select('*').eq('user_id',u).maybeSingle(),c.from('b55_payments').select('*').eq('user_id',u).order('created_at',{ascending:false}).limit(50),c.from('b55_settings').select('value').eq('key','payment_instructions').maybeSingle(),c.from('b55_ledger').select('delta,reason,created_at').eq('user_id',u).order('created_at',{ascending:false}).limit(30)]).then(function(a){
 a.forEach(function(x){if(x.error)throw x.error});var P=a[0].data,w=a[1].data,pay=a[2].data,ins=a[3].data&&a[3].data.value,lg=a[4].data,fr=!(w&&w.free_granted);
 var used=lg.filter(function(l){return l.delta<0}).reduce(function(s,l){return s-l.delta},0);
 shell('<h1>باقات المنشورات</h1><div class="b17c" style="display:block"><b>رصيدك المتبقي: '+nf(w&&w.balance)+' منشور</b><br><small>المستهلك (من آخر 30 حركة): '+nf(used)+'. لا اشتراك شهري: تشتري عدداً مسبقاً وتستخدمه متى شئت.</small></div>'
 +P.map(function(k){return '<div class="b17c" style="display:block;margin:8px 0"><b>'+X(k.name)+'</b> — '+nf(k.posts)+' منشور — '+(k.is_free?'مجاناً (مرة واحدة)':nf(k.price_iqd)+' د.ع')+' <button class="btn btn-p" data-a="'+(k.is_free?'free':'buy')+'" data-k="'+X(k.id)+'" data-n="'+k.posts+'" data-pr="'+k.price_iqd+'"'+(k.is_free&&!fr?' disabled':'')+'>'+(k.is_free?(fr?'استلم الحصة المجانية':'تم الاستلام'):'اشترِ')+'</button></div>'}).join('')
 +'<h2>طلبات الدفع</h2>'+(pay.length?pay.map(function(p){return payCard(p,ins)}).join(''):'<p class="b17n">ما عندك طلبات دفع.</p>')
 +'<h2>سجل الرصيد</h2>'+(lg.length?lg.map(function(l){return '<div class="b15e"><small>'+X(new Date(l.created_at).toLocaleDateString('ar-IQ'))+'</small> '+(l.delta>0?'+':'')+l.delta+' — '+X(l.reason)+'</div>'}).join(''):'<p class="b17n">لا توجد حركات.</p>'))
 }).catch(function(e){shell('<h1>باقات المنشورات</h1><p>'+X(em(e))+'</p><button class="btn" data-a="retry">إعادة المحاولة</button>')})}
function adm(){var c=sbc();shell('<h1>مراجعة المدفوعات</h1><p class="b17n">جارٍ التحميل…</p>');
 c.rpc('is_admin').then(function(a){if(a.error||a.data!==true)throw {message:'forbidden'};return Promise.all([c.from('b55_payments').select('*').order('created_at',{ascending:true}).limit(200),c.from('b55_settings').select('value').eq('key','payment_instructions').maybeSingle()])}).then(function(a){
 if(a[0].error)throw a[0].error;var q=a[0].data;
 shell('<h1>مراجعة المدفوعات</h1><h2>تعليمات الدفع (كي كارد/تحويل) — تظهر للمستخدمين</h2><textarea id="b55i" rows="4" style="width:100%" maxlength="2000">'+X(a[1].data&&a[1].data.value||'')+'</textarea><button class="btn" data-a="ins">حفظ التعليمات</button><h2>الطلبات (الأقدم أولاً)</h2>'
 +(q.length?q.map(function(p){var rv=p.status==='pending_review';return '<div class="b17c" style="display:block;margin:8px 0" data-p="'+X(p.id)+'" data-u="'+X(p.proof_path||'')+'"><b dir="ltr">'+X(p.ref_code)+'</b> · '+X(SL[p.status])+' · '+nf(p.amount_iqd)+' د.ع · '+nf(p.posts)+' منشور<br><small>مرجع التحويل: <span dir="ltr">'+X(p.transfer_ref||'—')+'</span> · المستخدم: <span dir="ltr">'+X(p.user_id)+'</span></small><br>'+(p.proof_path?'<button class="btn" data-a="proof">عرض الإثبات</button> ':'')+(rv?'<button class="btn btn-p" data-a="approve">قبول</button> <button class="btn" data-a="reject">رفض</button> <button class="btn" data-a="need_info">طلب معلومات</button>':'')+'</div>'}).join(''):'<p class="b17n">لا توجد طلبات.</p>'))
 }).catch(function(e){shell('<h1>مراجعة المدفوعات</h1><p>'+X(em(e))+'</p>')})}
function run(p,ok){if(S.busy)return;S.busy=true;msg('','جارٍ التنفيذ…');p.then(function(r){if(r&&r.error)throw r.error;S.busy=false;S.key=null;toast(ok);return ok}).then(function(){B55.page(location.hash.slice(1))}).catch(function(e){S.busy=false;msg('err',em(e))})}
document.addEventListener('click',function(e){var b=e.target.closest('#b55c [data-a]');if(!b)return;var a=b.dataset.a,c=sbc(),card=b.closest('[data-p]'),id=card&&card.dataset.p;
 if(a==='retry')return B55.page(location.hash.slice(1));
 if(a==='free')return run(c.rpc('b55_claim_free'),'تمت إضافة الحصة المجانية.');
 if(a==='buy'){if(!confirm('ستحصل على '+b.dataset.n+' منشور مقابل '+nf(b.dataset.pr)+' د.ع بعد قبول الدفع من الإدارة. متابعة؟'))return;S.key=S.key||(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random());return run(c.rpc('b55_create_payment',{p_package:b.dataset.k,p_key:S.key}),'أُنشئ طلب الدفع. اتبع التعليمات وأرسل مرجع التحويل.')}
 if(a==='send'){var ref=card.querySelector('[data-r]').value,f=card.querySelector('[data-f]').files[0];if(f&&f.size>8e6)return msg('err','الصورة أكبر من 8MB.');
  var up=f?c.storage.from('b55-proofs').upload(AU.user.id+'/'+id+'-'+Date.now()+'.'+(f.type.split('/')[1]||'jpg'),f,{contentType:f.type}).then(function(r){if(r.error)throw r.error;return r.data.path}):Promise.resolve(null);
  return run(up.then(function(path){return c.rpc('b55_submit_proof',{p_id:id,p_ref:ref,p_path:path})}),'أُرسل الإثبات للمراجعة. لن يُضاف الرصيد إلا بعد قبول الإدارة.')}
 if(a==='ins')return run(c.rpc('b55_admin_set_setting',{p_key:'payment_instructions',p_value:E('b55i').value}),'حُفظت التعليمات.');
 if(a==='proof')return c.storage.from('b55-proofs').createSignedUrl(card.dataset.u,60).then(function(r){if(r.error)return msg('err',em(r.error));window.open(r.data.signedUrl,'_blank','noopener')});
 if(a==='approve'||a==='reject'||a==='need_info'){var n=a==='approve'?(confirm('تأكيد قبول الدفع وإضافة الرصيد؟')?'':null):prompt('اكتب السبب:');if(n===null)return;run(c.rpc('b55_admin_decide',{p_id:id,p_action:a,p_note:n||null}),'تم تنفيذ القرار.')}});
B55.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b55')});if(!sbc()){shell('<p>تعذّر الاتصال بالخادم.</p>');return}if(k==='admpay')adm();else user()};
})();

/* ===== B56: مركز العمليات (b56_ops.sql). كل الأرقام من الخادم؛ الصلاحية مفروضة في الدوال (is_admin) ===== */
var B56={};
(function(){
var R=function(){return E('b56c')},X=function(v){return ex(v)},nf=function(n){return Number(n||0).toLocaleString('en-US')};
var TY={biz:'فتح نشاط تجاري',payment:'دفع',listing:'إعلان',report:'بلاغ'},LK={biz:'#admbiz',payment:'#admpay',listing:'#admin',report:'#admin'},S={t:null,b:'review',pg:0,busy:false},PS=20;
function em(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');if(m.indexOf('forbidden')>-1)return 'هذه الصفحة للمشرفين فقط.';if(c==='42883'||c==='PGRST202')return 'مركز العمليات غير مفعّل على الخادم بعد (يلزم b55_commerce.sql ثم b56_ops.sql).';return 'تعذّر التحميل. حاول مرة ثانية.'}
function wt(h){h=Number(h);return h<1?'أقل من ساعة':h<48?nf(Math.round(h))+' ساعة':nf(Math.round(h/24))+' يوم'}
function card(k,l,v,on,w){return '<button class="btn'+(on?' btn-p':'')+'" data-k="'+k+'" style="margin:4px"><b>'+nf(v)+'</b> '+l+(w?' ⚠':'')+'</button>'}
function load(){var c=sbc();R().innerHTML='<h1>مركز العمليات</h1><p class="b17n">جارٍ التحميل…</p>';
 Promise.all([c.rpc('b56_counts'),c.rpc('b56_queue',{p_type:S.t,p_bucket:S.b,p_limit:PS,p_offset:S.pg*PS})]).then(function(a){a.forEach(function(x){if(x.error)throw x.error});draw(a[0].data,a[1].data)}).catch(function(e){R().innerHTML='<h1>مركز العمليات</h1><div class="msg err" role="alert">'+X(em(e))+'</div><button class="btn" data-k="retry">إعادة المحاولة</button>'})}
function draw(n,q){var tot=q.length?Number(q[0].total):0,pa=n.pay_avg_n>0?nf(n.pay_avg_hours)+' ساعة (من '+nf(n.pay_avg_n)+' طلب دفع خلال 30 يوماً)':'لا توجد بيانات كافية';
 R().innerHTML='<h1>مركز العمليات</h1><div>'+card('biz','أنشطة تنتظر الموافقة',n.biz,S.t==='biz'&&S.b==='review',n.overdue_biz>0)+card('payment','مدفوعات تنتظر التحقق',n.payment,S.t==='payment'&&S.b==='review')+card('listing','إعلانات تنتظر المراجعة',n.listing,S.t==='listing'&&S.b==='review')+card('report','بلاغات غير معالجة',n.report,S.t==='report'&&S.b==='review')+card('wait','بانتظار رد المستخدم',n.waiting_user,S.b==='waiting_user')+card('all','الكل',n.biz+n.payment+n.listing+n.report,!S.t&&S.b==='review')+'</div>'
 +'<div class="b17c" style="display:block;margin:8px 0"><small>أنشطة متأخرة عن الهدف ('+nf(n.target_hours)+' ساعة): <b>'+nf(n.overdue_biz)+'</b> · مدفوعات عولجت اليوم: <b>'+nf(n.payments_decided_today)+'</b> · متوسط قرار الدفع: '+X(pa)+' · مقبولة/مرفوضة (دفع): '+nf(n.pay_approved)+' / '+nf(n.pay_rejected)+'<br>زمن قبول الأنشطة وبقية المقاييس غير متاحة بعد (لا يوجد وقت قرار مسجّل لها).</small> <button class="btn" data-k="target">تعديل الهدف</button></div>'
 +(q.length?q.map(function(r){return '<div class="b17c" style="display:block;margin:8px 0"><b>'+X(TY[r.req_type])+'</b>'+(r.title?' — <span dir="auto">'+X(r.title)+'</span>':'')+' · '+X(r.status)+(r.overdue?' · <b>متأخر</b>':'')+'<br><small>رقم: <bdi dir="ltr">'+X(String(r.req_id).slice(0,8))+'</bdi> · أُرسل: '+X(new Date(r.created_at).toLocaleString('ar-IQ'))+' · الانتظار: '+wt(r.wait_hours)+(r.assignee?' · مُعيَّن':'')+'</small><br><a class="btn" href="'+LK[r.req_type]+'">فتح</a> <button class="btn" data-k="me" data-t="'+r.req_type+'" data-i="'+X(r.req_id)+'">تعييني</button></div>'}).join(''):'<p class="b17n">لا توجد طلبات مطابقة.</p>')
 +(tot>PS?'<p><button class="btn" data-k="prev"'+(S.pg?'':' disabled')+'>السابق</button> '+nf(S.pg+1)+' / '+nf(Math.ceil(tot/PS))+' <button class="btn" data-k="next"'+((S.pg+1)*PS>=tot?' disabled':'')+'>التالي</button></p>':'')+'<div id="b56m" class="msg" role="alert"></div>'}
document.addEventListener('click',function(e){var b=e.target.closest('#b56c [data-k]');if(!b||S.busy)return;var k=b.dataset.k,c=sbc();
 if(k==='retry'){return load()}if(k==='prev'){S.pg--;return load()}if(k==='next'){S.pg++;return load()}
 if(k==='me'){S.busy=true;return c.rpc('b56_assign_me',{p_type:b.dataset.t,p_id:b.dataset.i}).then(function(r){S.busy=false;if(r.error)throw r.error;toast('تم تعيين الطلب لك.');load()}).catch(function(x){S.busy=false;E('b56m').className='msg err';E('b56m').textContent=em(x)})}
 if(k==='target'){var v=parseInt(prompt('الهدف بالساعات لمراجعة طلبات الأنشطة (هدف تنظيمي لا موافقة تلقائية):'),10);if(!v)return;S.busy=true;return c.rpc('b56_set_target',{p_hours:v}).then(function(r){S.busy=false;if(r.error)throw r.error;toast('حُفظ الهدف.');load()}).catch(function(x){S.busy=false;E('b56m').className='msg err';E('b56m').textContent=em(x)})}
 S.pg=0;S.b=k==='wait'?'waiting_user':'review';S.t=(k==='wait'||k==='all')?null:k;load()});
B56.page=function(){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b56')});if(!sbc()){R().innerHTML='<p>تعذّر الاتصال بالخادم.</p>';return}S={t:null,b:'review',pg:0,busy:false};load()};
})();

/* ===== B57: الدعم الفني (b57_support.sql). الصلاحيات في الخادم (RLS + دوال)؛ لا نجاح قبل رد الخادم؛ لا Realtime (تحديث يدوي) ===== */
var B57={};
(function(){
var TY={account:'الحساب أو تسجيل الدخول',business:'صفحة النشاط التجاري',listing:'نشر إعلان',package:'الباقات ورصيد المنشورات',payment:'الدفع أو إثبات التحويل',verification:'طلب التوثيق',chat:'المحادثات أو الإشعارات',fraud:'الإبلاغ عن احتيال أو حساب مشبوه',tech:'مشكلة تقنية عامة',suggest:'اقتراح تطوير',other:'أخرى'},BIZ=['business','verification'],TPS=[['tech','مشكلة تقنية في الموقع','تقني','tech'],['suggest','اقتراح لتحسين المنصة','اقتراح','suggest'],['ux','مشكلة في التصميم أو سهولة الاستخدام','تصميم','suggest'],['ad','معلومات غير صحيحة في إعلان','إعلان','other'],['biz','مشكلة في نشاط تجاري أو خدمة','نشاط','other'],['video','مشكلة في تشغيل الفيديو الافتتاحي','فيديو','tech'],['nav','مشكلة في البحث أو تسجيل الدخول أو التصفح','تصفح','tech']];
var ST={new:'جديدة',in_review:'بانتظار المراجعة',in_progress:'قيد المعالجة',waiting_user:'بانتظار ردك',waiting_other:'بانتظار جهة أخرى',resolved:'تم الحل',closed:'مغلقة',reopened:'أُعيد فتحها'},PR={low:'منخفضة',normal:'عادية',high:'عالية',urgent:'عاجلة'};
var R=function(){return E('b57c')},X=function(v){return ex(v)},nf=function(n){return Number(n||0).toLocaleString('en-US')},S={busy:false,key:null,f:{},pg:0,adm:false,id:null},PS=20;
var fd=function(d){return X(new Date(d).toLocaleString('ar-IQ'))},num=function(n){return 'BH-'+String(n).padStart(5,'0')};
function em(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'نظام الدعم غير مفعّل على الخادم بعد (يلزم تطبيق b55 ثم b57_support.sql).';
 var M={rate_limited:'وصلت للحد اليومي (5 تذاكر). حاول لاحقاً.',type_not_allowed:'هذا النوع غير متاح لحسابك.',rel_denied:'لا تملك صلاحية ربط هذا العنصر.',ticket_closed:'التذكرة مغلقة؛ أعد فتحها للرد.',not_allowed:'هذا الإجراء غير متاح الآن.',forbidden:'ما عندك صلاحية.',duplicate:'قيّمت هذه التذكرة سابقاً.','23505':'قيّمت هذه التذكرة سابقاً.'};for(var k in M)if(m.indexOf(k)>-1||c===k)return M[k];if(/Failed to fetch|network/i.test(m))return 'انقطع الاتصال. تحقق من الإنترنت وأعد المحاولة.';return 'تعذّر تنفيذ العملية. حاول مرة ثانية.'}
function shell(h){R().innerHTML=h+'<div id="b57m" class="msg" role="alert"></div>'}
function msg(t,x){var m=E('b57m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function sel(id,o,v,all){return '<select id="'+id+'">'+(all?'<option value="">'+all+'</option>':'')+Object.keys(o).map(function(k){return '<option value="'+k+'"'+(k===v?' selected':'')+'>'+X(o[k])+'</option>'}).join('')+'</select>'}
function bad(e){shell('<h1>الدعم والمساعدة</h1><div class="msg err">'+X(em(e))+'</div><button class="btn" data-k="retry">إعادة المحاولة</button>')}
function user(){var c=sbc(),u=AU.user.id;shell('<h1>الدعم والمساعدة</h1><p class="b17n">جارٍ التحميل…</p>');
 Promise.all([c.from('b57_tickets').select('id,num,type,title,status,updated_at').eq('user_id',u).order('updated_at',{ascending:false}).limit(50),c.from('biz_profiles').select('id').eq('owner_id',u).maybeSingle()]).then(function(a){if(a[0].error)throw a[0].error;var hb=!!a[1].data,tp={};Object.keys(TY).forEach(function(k){if(hb||BIZ.indexOf(k)<0)tp[k]=TY[k]});
 shell('<h1>الدعم والمساعدة</h1><div class="b17n"><b>نصائح أمان:</b> لا ترسل كلمة المرور أو رموز الدخول لأي شخص. احذر من أي طلب تحويل مال خارج الإجراءات المعتمدة. علامة «موثّق من بحر» تعني مراجعة الحساب وفق سياسة المنصة ولا تضمن كل معاملة، وعلامة الترويج لا تعني أن الحساب موثّق. يمكنك الإبلاغ عن أي محاولة احتيال من هنا (نوع: الإبلاغ عن احتيال).</div><h2>تذكرة جديدة</h2><form id="b57f" novalidate><select id="b57tp" aria-label="موضوع الملاحظة"><option value="">موضوع الملاحظة (اختياري)</option>'+TPS.map(function(x){return '<option value="'+x[0]+'">'+X(x[1])+'</option>'}).join('')+'</select>'+sel('b57t',tp,'tech')+'<input id="b57ti" maxlength="105" placeholder="عنوان مختصر (4 أحرف على الأقل)"><input id="b57u" maxlength="300" dir="ltr" placeholder="رابط الصفحة أو رقم الإعلان (اختياري)"><textarea id="b57b" rows="4" maxlength="4000" placeholder="اشرح المشكلة. لا تكتب كلمات مرور أو أرقام بطاقات."></textarea><label class="btn">صورة اختيارية (JPG/PNG/WebP حتى 5MB)<input id="b57fx" type="file" accept="image/jpeg,image/png,image/webp" hidden></label> <button class="btn btn-p" type="submit">إرسال التذكرة</button></form><h2>تذاكري</h2>'
 +(a[0].data.length?a[0].data.map(function(t){return '<div class="b17c" style="display:block;margin:8px 0"><b>'+num(t.num)+'</b> · '+X(TY[t.type])+' · '+X(ST[t.status])+'<br><span dir="auto">'+X(t.title)+'</span><br><small>آخر تحديث: '+fd(t.updated_at)+'</small> <a class="btn" href="#ticket-'+X(t.id)+'">فتح</a></div>'}).join(''):'<p class="b17n">ما عندك تذاكر.</p>'));
 var pre=null;try{pre=sessionStorage.getItem('b76pre');sessionStorage.removeItem('b76pre')}catch(e){}
 E('b57tp').addEventListener('change',function(){var m=TPS.filter(function(x){return x[0]===E('b57tp').value})[0];if(m&&tp[m[3]])E('b57t').value=m[3]});
 if(pre==='video'){E('b57tp').value='video';E('b57t').value='tech';E('b57ti').value='لا يعمل الفيديو الافتتاحي'}
 E('b57f').addEventListener('submit',function(e){e.preventDefault();if(S.busy)return;var rf=null;try{rf=sessionStorage.getItem('b77ref')}catch(e){}var m=TPS.filter(function(x){return x[0]===E('b57tp').value})[0],ti=E('b57ti').value.trim(),b=E('b57b').value.trim(),u=E('b57u').value.trim(),fl=E('b57fx').files[0];if(ti.length<4||!b)return msg('err','اكتب العنوان والتفاصيل.');if(fl&&!/^image\/(jpeg|png|webp)$/.test(fl.type)||fl&&fl.size>5242880)return msg('err','الصورة يجب أن تكون JPG أو PNG أو WebP حتى 5MB.');S.busy=true;S.key=S.key||(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random());msg('','جارٍ الإرسال…');
  c.rpc('b57_create',{p_type:E('b57t').value,p_title:(m?'['+m[2]+'] ':'')+ti,p_body:b+(u?'\n\nالصفحة/الإعلان: '+u:'')+(rf?'\n\nمرجع خطأ: '+rf:''),p_rel_type:null,p_rel_id:null,p_key:S.key}).then(function(r){if(r.error)throw r.error;S.key=null;var id=r.data,go=function(w){S.busy=false;c.from('b57_tickets').select('num').eq('id',id).maybeSingle().then(function(q){toast('أُرسلت. رقم المتابعة: '+(q.data?num(q.data.num):'')+(w?' — تعذّر رفع الصورة.':''));location.hash='#ticket-'+id},function(){toast('أُرسلت.'+(w?' تعذّر رفع الصورة.':''));location.hash='#ticket-'+id})};if(!fl)return go(false);
   return c.storage.from('b57-files').upload(id+'/'+Date.now()+'.'+({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[fl.type]),fl,{contentType:fl.type}).then(function(up){if(up.error)throw up.error;return c.rpc('b57_reply',{p_id:id,p_body:'صورة مرفقة',p_internal:false,p_path:up.data.path})}).then(function(rr){if(rr&&rr.error)throw rr.error;go(false)}).catch(function(){go(true)})}).catch(function(x){S.busy=false;msg('err',em(x))})})}).catch(bad)}
function thread(id){var c=sbc();S.id=id;shell('<p class="b17n">جارٍ التحميل…</p>');
 Promise.all([c.rpc('is_admin'),c.from('b57_tickets').select('*').eq('id',id).maybeSingle(),c.from('b57_messages').select('*').eq('ticket_id',id).order('created_at'),c.from('b57_events').select('*').eq('ticket_id',id).order('created_at'),c.from('b57_ratings').select('rating').eq('ticket_id',id).maybeSingle()]).then(function(a){
 if(a[1].error)throw a[1].error;if(!a[1].data)throw{message:'forbidden'};var t=a[1].data,ad=a[0].data===true,ms=a[2].data||[],ev=a[3].data||[],rt=a[4].data,done=t.status==='resolved'||t.status==='closed';
 shell('<p><a href="#'+(ad?'admsupport':'support')+'">← رجوع</a></p><h1>'+num(t.num)+' — <span dir="auto">'+X(t.title)+'</span></h1><p>'+X(TY[t.type])+' · '+X(ST[t.status])+' · الأولوية: '+X(PR[t.priority])+' · آخر تحديث: '+fd(t.updated_at)+'</p>'
 +'<div>'+ms.map(function(m){return '<div class="b17c" style="display:block;margin:6px 0'+(m.is_internal?';border:2px dashed #c60':'')+'"><b>'+(m.is_internal?'ملاحظة داخلية (لا تظهر للمستخدم)':m.is_staff?'فريق الدعم':'المستخدم')+'</b> <small>'+fd(m.created_at)+'</small><p dir="auto" style="white-space:pre-wrap">'+X(m.body)+'</p>'+(m.attachment_path?'<button class="btn" data-k="att" data-p="'+X(m.attachment_path)+'">عرض المرفق</button>':'')+'</div>'}).join('')+'</div>'
 +(done?'':'<textarea id="b57r" rows="3" maxlength="4000" placeholder="اكتب ردك"></textarea><label class="btn">مرفق (صورة أو PDF، حتى 5MB)<input id="b57fi" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" hidden></label> '+(ad?'<label><input type="checkbox" id="b57in"> ملاحظة داخلية</label> ':'')+'<button class="btn btn-p" data-k="send">إرسال</button>')
 +(ad?'<h3>إجراءات الدعم</h3>'+sel('b57s',{in_review:ST.in_review,in_progress:ST.in_progress,waiting_user:'بانتظار رد المستخدم',waiting_other:ST.waiting_other,resolved:ST.resolved,closed:ST.closed},'', 'تغيير الحالة…')+sel('b57p',PR,t.priority)+'<button class="btn" data-k="set">حفظ</button> <button class="btn" data-k="me">تعييني على التذكرة</button>':'')
 +(!ad&&done&&t.user_id===AU.user.id?'<p><button class="btn" data-k="reopen">إعادة فتح</button></p>':'')+(!ad&&!done?'<p><button class="btn" data-k="close">إغلاق التذكرة (تم الحل)</button></p>':'')
 +(!ad&&done&&!rt?'<h3>قيّم الدعم</h3>'+sel('b57st',{5:'5 ممتاز',4:'4',3:'3',2:'2',1:'1 سيئ'},'5')+'<input id="b57cm" maxlength="500" placeholder="تعليق اختياري"><button class="btn" data-k="rate">إرسال التقييم</button>':'')+(rt?'<p class="b17n">تقييمك: '+rt.rating+'/5</p>':'')
 +'<h3>سجل التغييرات</h3>'+(ev.length?ev.map(function(e){return '<div class="b15e"><small>'+fd(e.created_at)+'</small> '+X(e.action)+(e.to_val?': '+X(ST[e.to_val]||e.to_val):'')+'</div>'}).join(''):'—')+'<p><button class="btn" data-k="retry">تحديث</button></p>')}).catch(bad)}
function admin(){var c=sbc(),f=S.f;shell('<h1>الدعم الفني والشكاوى</h1><p class="b17n">جارٍ التحميل…</p>');
 Promise.all([c.rpc('b57_stats'),c.rpc('b57_admin_list',{p_status:f.s||null,p_type:f.t||null,p_q:f.q||null,p_att:!!f.a,p_limit:PS,p_offset:S.pg*PS})]).then(function(a){a.forEach(function(x){if(x.error)throw x.error});var n=a[0].data,q=a[1].data,tot=q.length?Number(q[0].total):0,bt=Object.keys(n.by_type||{}).map(function(k){return X(TY[k]||k)+': '+nf(n.by_type[k])}).join(' · ');
 shell('<h1>الدعم الفني والشكاوى</h1><div class="b17c" style="display:block"><small>الإجمالي: <b>'+nf(n.total)+'</b> · جديدة: <b>'+nf(n.new)+'</b> · مفتوحة: <b>'+nf(n.open)+'</b> · بانتظار المستخدم: <b>'+nf(n.waiting_user)+'</b> · محلولة: <b>'+nf(n.resolved)+'</b> · متأخرة (بلا رد أول بعد 24 ساعة): <b>'+nf(n.overdue)+'</b><br>الرد الأول: '+(n.frt_n>0?nf(n.frt_h)+' ساعة (من '+nf(n.frt_n)+' تذكرة)':'لا توجد بيانات كافية')+' · الحل: '+(n.res_n>0?nf(n.res_h)+' ساعة (من '+nf(n.res_n)+')':'لا توجد بيانات كافية')+' · أُعيد فتحها: '+nf(n.reopened)+' · التقييم: '+(n.rating_n>0?nf(n.rating_avg)+'/5 (من '+nf(n.rating_n)+')':'لا توجد تقييمات')+'<br>'+(bt||'')+'</small></div>'
 +'<div><input id="b57q" placeholder="رقم التذكرة أو عنوان أو معرّف مستخدم" value="'+X(f.q||'')+'">'+sel('b57fs',ST,f.s||'','كل الحالات')+sel('b57ft',TY,f.t||'','كل الأنواع')+'<label><input type="checkbox" id="b57fa"'+(f.a?' checked':'')+'> بمرفقات</label> <button class="btn btn-p" data-k="filter">بحث</button></div>'
 +(q.length?q.map(function(t){return '<div class="b17c" style="display:block;margin:8px 0"><b>'+num(t.num)+'</b> · '+X(TY[t.type])+' · '+X(ST[t.status])+' · '+X(PR[t.priority])+(t.assignee?' · مُعيَّنة':'')+'<br><span dir="auto">'+X(t.title)+'</span><br><small>أُنشئت: '+fd(t.created_at)+' · آخر تحديث: '+fd(t.updated_at)+'</small> <a class="btn" href="#ticket-'+X(t.id)+'">فتح</a></div>'}).join(''):'<p class="b17n">لا توجد تذاكر مطابقة.</p>')
 +(tot>PS?'<p><button class="btn" data-k="prev"'+(S.pg?'':' disabled')+'>السابق</button> '+(S.pg+1)+' / '+Math.ceil(tot/PS)+' <button class="btn" data-k="next"'+((S.pg+1)*PS>=tot?' disabled':'')+'>التالي</button></p>':''))}).catch(bad)}
function run(p,ok,re){if(S.busy)return;S.busy=true;msg('','جارٍ التنفيذ…');p.then(function(r){if(r&&r.error)throw r.error;S.busy=false;toast(ok);re()}).catch(function(e){S.busy=false;msg('err',em(e))})}
document.addEventListener('click',function(e){var b=e.target.closest('#b57c [data-k]');if(!b)return;var k=b.dataset.k,c=sbc(),id=S.id,re=function(){thread(id)};
 if(k==='retry')return B57.page(location.hash.slice(1));if(k==='prev'){S.pg--;return admin()}if(k==='next'){S.pg++;return admin()}
 if(k==='filter'){S.f={q:E('b57q').value.trim(),s:E('b57fs').value,t:E('b57ft').value,a:E('b57fa').checked};S.pg=0;return admin()}
 if(k==='att')return c.storage.from('b57-files').createSignedUrl(b.dataset.p,60).then(function(r){if(r.error)return msg('err','تعذّر فتح المرفق.');window.open(r.data.signedUrl,'_blank','noopener')});
 if(k==='send'){var body=E('b57r').value.trim(),f=E('b57fi').files[0];if(!body)return msg('err','اكتب الرد.');if(f&&(f.size>5242880||!/^(image\/(jpeg|png|webp)|application\/pdf)$/.test(f.type)))return msg('err','المرفق يجب أن يكون صورة JPG/PNG/WebP أو PDF حتى 5MB.');
  var up=f?c.storage.from('b57-files').upload(id+'/'+Date.now()+'.'+({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','application/pdf':'pdf'}[f.type]),f,{contentType:f.type}).then(function(r){if(r.error)throw r.error;return r.data.path}):Promise.resolve(null);
  return run(up.then(function(p){return c.rpc('b57_reply',{p_id:id,p_body:body,p_internal:!!(E('b57in')&&E('b57in').checked),p_path:p})}),'أُرسل الرد.',re)}
 if(k==='set')return run(c.rpc('b57_admin_set',{p_id:id,p_status:E('b57s').value||null,p_priority:E('b57p').value,p_assign_me:false}),'حُفظت التغييرات.',re);
 if(k==='me')return run(c.rpc('b57_admin_set',{p_id:id,p_status:null,p_priority:null,p_assign_me:true}),'عُيّنت عليك.',re);
 if(k==='close'||k==='reopen')return run(c.rpc('b57_user_action',{p_id:id,p_action:k}),k==='close'?'أُغلقت التذكرة.':'أُعيد فتح التذكرة.',re);
 if(k==='rate')return run(c.rpc('b57_rate',{p_id:id,p_rating:parseInt(E('b57st').value,10),p_comment:E('b57cm').value}),'شكراً لتقييمك.',re)});
B57.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b57')});if(!sbc()){R().innerHTML='<p>تعذّر الاتصال بالخادم.</p>';return}S.busy=false;S.pg=k==='admsupport'?S.pg:0;
 if(k==='admsupport')admin();else if(/^ticket-/.test(k))thread(k.slice(7));else user()};
})();

/* ===== B58: مركز الأمان والمخاطر (b58_security.sql). للمشرفين فقط (is_admin في الخادم). لا حظر تلقائي ===== */
var B58={};
(function(){
var R=function(){return E('b58c')},X=function(v){return ex(v)},LV={high:'خطر مرتفع',review:'يحتاج إلى مراجعة',normal:'طبيعي'},S={t:'risk',busy:false},nf=function(n){return n==null?'—':Number(n).toLocaleString('en-US')};
function em(e){var m=String(e&&e.message||e||''),c=e&&e.code||'';if(m.indexOf('forbidden')>-1)return 'هذه الصفحة للمشرفين فقط.';if(c==='42883'||c==='PGRST202')return 'مركز الأمان غير مفعّل على الخادم بعد (يلزم b55 وb57 ثم b58_security.sql).';if(m.indexOf('reason_required')>-1)return 'اكتب سببًا (5 أحرف على الأقل).';if(m.indexOf('bad_listing')>-1)return 'الإعلان لا يخص هذا المستخدم.';if(/Failed to fetch|network/i.test(m))return 'انقطع الاتصال. أعد المحاولة.';return 'تعذّر التنفيذ. حاول مرة ثانية.'}
function shell(h){R().innerHTML='<h1>مركز الأمان والمخاطر</h1><div><button class="btn'+(S.t==='risk'?' btn-p':'')+'" data-k="tab" data-t="risk">الحسابات</button> <button class="btn'+(S.t==='dup'?' btn-p':'')+'" data-k="tab" data-t="dup">إعلانات مشتبه بتكرارها</button></div><p class="b17n">المؤشرات للمراجعة فقط وليست اتهامًا؛ لا يوجد حظر تلقائي. البلاغات وحدها مؤشر ضعيف.</p>'+h+'<div id="b58m" class="msg" role="alert"></div>'}
function msg(t,x){var m=E('b58m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function bad(e){shell('<div class="msg err">'+X(em(e))+'</div><button class="btn" data-k="retry">إعادة المحاولة</button>')}
function risk(){var c=sbc();shell('<p>جارٍ التحميل…</p>');c.rpc('b58_risk',{p_min:3}).then(function(r){if(r.error)throw r.error;var d=r.data||[];
 shell(d.length?d.map(function(u){return '<div class="b17c" style="display:block;margin:8px 0" data-u="'+X(u.user_id)+'"><b>'+X(LV[u.level])+'</b> · النقاط: '+u.score+'<br><small>المستخدم: <bdi dir="ltr">'+X(u.user_id)+'</bdi></small><ul>'+u.reasons.map(function(x){return '<li>'+X(x)+'</li>'}).join('')+'</ul><button class="btn" data-k="ls">إعلاناته</button> <button class="btn" data-k="act" data-a="warn">تحذير مسجّل</button> <button class="btn" data-k="act" data-a="escalate">تصعيد للمدير</button> <button class="btn" data-k="act" data-a="note">ملاحظة</button><div data-l></div></div>'}).join(''):'<p class="b17n">لا توجد حسابات بمؤشرات كافية الآن.</p>')}).catch(bad)}
function dup(){var c=sbc();shell('<p>جارٍ التحميل…</p>');c.rpc('b58_dups').then(function(r){if(r.error)throw r.error;var d=r.data||[];
 shell(d.length?d.map(function(p){return '<div class="b17c" style="display:block;margin:8px 0" data-a="'+X(p.a)+'" data-b="'+X(p.b)+'"><b>'+(p.same_owner?'نفس المالك':'مالكان مختلفان')+'</b> · السعر: '+nf(p.price)+'<br><small dir="auto">أ: '+X(p.title_a)+' ('+X(p.status_a)+')<br>ب: '+X(p.title_b)+' ('+X(p.status_b)+')</small><br><button class="btn" data-k="ph" data-i="'+X(p.a)+'">سجل أسعار أ</button> <button class="btn" data-k="dd" data-d="not_dup">ليس مكررًا</button> <button class="btn" data-k="dd" data-d="hidden_newer">إخفاء الأحدث</button><div data-l></div></div>'}).join(''):'<p class="b17n">لا توجد إعلانات مشتبه بتكرارها.</p>')}).catch(bad)}
function run(p,ok,re){if(S.busy)return;S.busy=true;msg('','جارٍ التنفيذ…');p.then(function(r){if(r&&r.error)throw r.error;S.busy=false;toast(ok);re()}).catch(function(e){S.busy=false;msg('err',em(e))})}
document.addEventListener('click',function(e){var b=e.target.closest('#b58c [data-k]');if(!b)return;var k=b.dataset.k,c=sbc(),card=b.closest('[data-u],[data-a]'),re=function(){S.t==='dup'?dup():risk()};
 if(k==='retry')return re();if(k==='tab'){S.t=b.dataset.t;return re()}
 if(k==='ls')return c.rpc('b58_owner_listings',{p_owner:card.dataset.u}).then(function(r){var h=card.querySelector('[data-l]');if(r.error){h.textContent=em(r.error);return}h.innerHTML=(r.data||[]).map(function(l){return '<div class="b15e"><span dir="auto">'+X(l.title)+'</span> · '+X(l.status)+' · '+nf(l.price)+' <button class="btn" data-k="ph" data-i="'+X(l.id)+'">الأسعار</button>'+(l.status!=='suspended'?' <button class="btn" data-k="hide" data-i="'+X(l.id)+'">إخفاء</button>':'')+'</div>'}).join('')||'لا إعلانات.'});
 if(k==='ph')return c.rpc('b58_price_history',{p_listing:b.dataset.i}).then(function(r){var h=b.closest('[data-u],[data-a]').querySelector('[data-l]');if(r.error){h.textContent=em(r.error);return}h.innerHTML=(r.data||[]).map(function(x){var big=x.pct!=null&&Math.abs(x.pct)>=50;return '<div class="b15e">'+X(new Date(x.at).toLocaleDateString('ar-IQ'))+': '+nf(x.old)+' → '+nf(x.new)+(x.pct!=null?' ('+x.pct+'%)':'')+(big?' ⚠ تغيير كبير':'')+'</div>'}).join('')||'لا تغييرات أسعار مسجّلة.'});
 if(k==='act'||k==='hide'){var n=prompt('اكتب السبب (5 أحرف على الأقل):');if(n===null)return;var u=card.dataset.u;return run(c.rpc('b58_act',{p_target:u,p_action:k==='hide'?'hide_listing':b.dataset.a,p_reason:n,p_listing:k==='hide'?b.dataset.i:null}),'سُجّل الإجراء.',re)}
 if(k==='dd'){var n2=prompt('اكتب سبب القرار:');if(n2===null)return;if(b.dataset.d==='hidden_newer'&&!confirm('سيُوقف الإعلان الأحدث. متابعة؟'))return;return run(c.rpc('b58_dup_decide',{p_a:card.dataset.a,p_b:card.dataset.b,p_decision:b.dataset.d,p_note:n2}),'سُجّل القرار.',re)}});
B58.page=function(){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b58')});if(!sbc()){R().innerHTML='<p>تعذّر الاتصال بالخادم.</p>';return}S.busy=false;S.t='risk';risk()};
})();

/* ===== B59: نظام المحتوى (b59_cms.sql). نص عادي فقط (يُهرَّب عند العرض)؛ الكتابة عبر دوال الخادم للمشرف فقط ===== */
var B59={};
(function(){
var SEC={'hm-boat':'القوارب','hm-jet':'الجت سكي','hm-eng':'المحركات','hm-parts':'قطع الغيار','hm-biz':'الأنشطة التجارية','hm-srv':'الخدمات والورش','show3d':'المجسم ثلاثي الأبعاد','tech':'قسم التقنية','how':'كيف تعمل المنصة','hm-trust':'السلامة والثقة','hm-tips':'نصائح بحرية','hm-why':'لماذا بحر؟','hm-rev':'آراء المستخدمين','hm-about':'من نحن'};
var PG={about:'من نحن',howitworks:'كيف تعمل بحر',pricing:'الأسعار والباقات',promotion:'الترويج الإعلاني',verification:'التوثيق',privacy:'سياسة الخصوصية',terms:'شروط الاستخدام',contact:'اتصل بنا'},STS={draft:'مسودة',published:'منشور',hidden:'مخفي'};
var PF_={name:'اسم المنصة',description:'وصف مختصر',phone:'رقم التواصل العام',copyright:'حقوق النشر',website:'الموقع (https)',facebook:'فيسبوك (https)',instagram:'إنستغرام (https)',telegram:'تيليغرام (https)',whatsapp:'واتساب (https)'};
window.B59_PF=PF_;window.B59_SEC=SEC;
var R=function(){return E('b59c')},X=function(v){return ex(v)},S={t:'sec',busy:false,hid:[]};
function em(e){var m=String(e&&e.message||e||''),c=e&&e.code||'';if(m.indexOf('forbidden')>-1)return 'هذه الصفحة للمشرفين فقط.';if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'نظام المحتوى غير مفعّل على الخادم بعد (يلزم b59_cms.sql).';if(/bad_url/.test(m))return 'الرابط يجب أن يبدأ بـ https://';if(/bad_text/.test(m))return 'غير مسموح بالرمزين < و > في النص.';if(/check constraint|violates/.test(m))return 'قيمة غير صالحة (راجع الطول المسموح).';if(/verify_failed/.test(m))return 'تعذّر التأكد من نتيجة الحفظ من الخادم. أعد فتح الصفحة وتحقق من القيمة قبل إعادة المحاولة.';if(/Failed to fetch|network/i.test(m))return 'انقطع الاتصال. أعد المحاولة.';return 'تعذّر الحفظ. حاول مرة ثانية.'}
function body(t){return String(t||'').split(/\n{2,}/).map(function(p){return '<p dir="auto">'+X(p).replace(/\n/g,'<br>')+'</p>'}).join('')}
function msg(t,x){var m=E('b59m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function shell(h){R().innerHTML='<h1>إدارة الموقع والصفحة الرئيسية</h1><div>'+[['sec','أقسام الرئيسية'],['faq','الأسئلة الشائعة'],['pg','الصفحات'],['pl','معلومات المنصة']].map(function(t){return '<button class="btn'+(S.t===t[0]?' btn-p':'')+'" data-k="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join(' ')+'</div>'+h+'<div id="b59m" class="msg" role="alert"></div>'}
function bad(e){shell('<div class="msg err">'+X(em(e))+'</div><button class="btn" data-k="retry">إعادة المحاولة</button>')}
function sel(id,o,v){return '<select id="'+id+'">'+Object.keys(o).map(function(k){return '<option value="'+k+'"'+(k===v?' selected':'')+'>'+X(o[k])+'</option>'}).join('')+'</select>'}
function load(){var c=sbc();shell('<p class="b17n">جارٍ التحميل…</p>');
 c.rpc('is_admin').then(function(a){if(a.error||a.data!==true)throw{message:'forbidden'};
 if(S.t==='sec')return c.from('b59_site').select('value').eq('key','home_sections').maybeSingle().then(function(r){if(r.error)throw r.error;var h=(r.data&&r.data.value&&r.data.value.hidden)||[];shell('<p class="b17n">أخفِ أقسامًا من الصفحة الرئيسية (الإخفاء فقط؛ ترتيب الأقسام غير متاح بعد).</p>'+Object.keys(SEC).map(function(k){return '<label style="display:block"><input type="checkbox" data-s="'+k+'"'+(h.indexOf(k)<0?' checked':'')+'> '+X(SEC[k])+' (ظاهر)</label>'}).join('')+'<button class="btn btn-p" data-k="savesec">حفظ</button> <a class="btn" href="#" target="_blank">معاينة الرئيسية</a>')});
 if(S.t==='faq')return c.from('b59_faq').select('*').order('sort').order('created_at').limit(300).then(function(r){if(r.error)throw r.error;shell(faqForm({})+'<h2>الأسئلة</h2>'+(r.data.length?r.data.map(function(f){return '<div class="b17c" style="display:block;margin:6px 0" data-f="'+encodeURIComponent(JSON.stringify(f))+'"><b dir="auto">'+X(f.question)+'</b> · '+X(STS[f.status])+' · '+X(f.category)+'<br><button class="btn" data-k="editfaq">تعديل</button> <button class="btn" data-k="delfaq">حذف</button></div>'}).join(''):'<p class="b17n">لا توجد أسئلة.</p>'))});
 if(S.t==='pg')return c.from('b59_pages').select('*').then(function(r){if(r.error)throw r.error;S.pages={};r.data.forEach(function(p){S.pages[p.slug]=p});pgForm('about')});
 return c.from('b59_site').select('value').eq('key','platform').maybeSingle().then(function(r){if(r.error)throw r.error;var v=(r.data&&r.data.value)||{};shell('<p class="b17n">لا تُعرض أي قيمة افتراضية؛ اترك الحقل فارغًا إن لم يكن رسميًا.</p>'+Object.keys(PF_).map(function(k){return '<label style="display:block">'+X(PF_[k])+'<input data-p="'+k+'" maxlength="300" value="'+X(v[k]||'')+'"></label>'}).join('')+'<button class="btn btn-p" data-k="savepl">حفظ</button>')})}).catch(bad)}
function faqForm(f){return '<h2>'+(f.id?'تعديل سؤال':'سؤال جديد')+'</h2><input type="hidden" id="b59id" value="'+X(f.id||'')+'"><input id="b59q" maxlength="300" placeholder="السؤال" value="'+X(f.question||'')+'"><textarea id="b59a" rows="4" maxlength="3000" placeholder="الإجابة (نص عادي). لا تكتب أسعارًا ثابتة هنا؛ اربط القارئ بصفحة الباقات.">'+X(f.answer||'')+'</textarea><input id="b59cat" maxlength="60" placeholder="التصنيف" value="'+X(f.category||'عام')+'"><input id="b59so" type="number" value="'+(f.sort||0)+'">'+sel('b59st',STS,f.status||'draft')+'<button class="btn btn-p" data-k="savefaq">حفظ</button>'}
function pgForm(slug){var p=S.pages[slug]||{};shell('<h2>تعديل صفحة</h2>'+sel('b59sl',PG,slug)+'<input id="b59t" maxlength="120" placeholder="العنوان" value="'+X(p.title||'')+'"><textarea id="b59b" rows="10" maxlength="20000" placeholder="المحتوى (نص عادي، فقرات بسطر فارغ). لا يُسمح بـ HTML.">'+X(p.body||'')+'</textarea><input id="b59so" type="number" value="'+(p.sort||0)+'">'+sel('b59st',STS,p.status||'draft')+'<button class="btn btn-p" data-k="savepg">حفظ</button> <button class="btn" data-k="prevpg">معاينة</button><div id="b59pv"></div>')}
/* B82: إن مُرّرت دالة تحقق (vf) فلا نجاح قبل قراءة القيمة من الخادم ومطابقتها لما أُرسل */
function run(p,ok,vf){if(S.busy)return;S.busy=true;msg('','جارٍ الحفظ…');p.then(function(r){if(r&&r.error)throw r.error;return vf?vf().then(function(v){return v},function(){throw{message:'verify_failed'}}):true}).then(function(v){S.busy=false;if(v===false){msg('err','لم يتأكد الحفظ: القيمة المقروءة من الخادم لا تطابق ما أُرسل. لا تعتمد على هذا التغيير وأعد المحاولة.');return}toast(ok);load()}).catch(function(e){S.busy=false;msg('err',em(e))})}
function b82rd(key){return sbc().from('b59_site').select('value').eq('key',key).maybeSingle().then(function(r){if(r.error)throw r.error;return(r.data&&r.data.value)||{}})}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='b59sl'&&S.pages)pgForm(e.target.value)});
document.addEventListener('click',function(e){var b=e.target.closest('#b59c [data-k]');if(!b)return;var k=b.dataset.k,c=sbc(),V=function(i){return E(i).value};
 if(k==='retry')return load();if(k==='tab'){S.t=b.dataset.t;return load()}
 if(k==='savesec'){var h=[].filter.call(R().querySelectorAll('[data-s]'),function(x){return!x.checked}).map(function(x){return x.dataset.s});return run(c.rpc('b59_set_site',{p_key:'home_sections',p_value:{hidden:h}}),'حُفظ وتأكّد من الخادم.',function(){return b82rd('home_sections').then(function(v){var a=(v.hidden||[]).slice().sort().join('|'),b=h.slice().sort().join('|');return a===b})})}
 if(k==='savepl'){var o={};[].forEach.call(R().querySelectorAll('[data-p]'),function(x){o[x.dataset.p]=x.value.trim()});return run(c.rpc('b59_set_site',{p_key:'platform',p_value:o}),'حُفظت المعلومات وتأكّدت من الخادم.',function(){return b82rd('platform').then(function(v){return Object.keys(o).every(function(k){return String(v[k]||'')===o[k]})})})}
 if(k==='savefaq')return run(c.rpc('b59_save_faq',{p_id:V('b59id')||null,p_q:V('b59q'),p_a:V('b59a'),p_cat:V('b59cat'),p_sort:parseInt(V('b59so'),10)||0,p_status:V('b59st')}),'حُفظ السؤال.');
 if(k==='editfaq'){var f=JSON.parse(decodeURIComponent(b.closest('[data-f]').dataset.f));E('b59id').value=f.id;E('b59q').value=f.question;E('b59a').value=f.answer;E('b59cat').value=f.category;E('b59so').value=f.sort;E('b59st').value=f.status;window.scrollTo(0,0);msg('','يتم الآن تعديل سؤال موجود؛ اضغط «حفظ» لتأكيد التعديل.');return}
 if(k==='delfaq'){if(!confirm('حذف السؤال؟ تُحفظ نسخة منه في السجل.'))return;return run(c.rpc('b59_delete_faq',{p_id:JSON.parse(decodeURIComponent(b.closest('[data-f]').dataset.f)).id}),'حُذف السؤال.')}
 if(k==='savepg')return run(c.rpc('b59_save_page',{p_slug:V('b59sl'),p_title:V('b59t'),p_body:V('b59b'),p_status:V('b59st'),p_sort:parseInt(V('b59so'),10)||0}),'حُفظت الصفحة.');
 if(k==='prevpg'){E('b59pv').innerHTML='<div class="b17c" style="display:block"><h2>'+X(V('b59t'))+'</h2>'+body(V('b59b'))+'</div>'}
 if(k==='more'){}});
function pub(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b59p')});var c=sbc(),h=E('b59p');if(!c){h.innerHTML='<p>تعذّر الاتصال بالخادم.</p>';return}h.innerHTML='<p class="b17n">جارٍ التحميل…</p>';
 var fail=function(){h.innerHTML='<div class="msg err">تعذّر تحميل المحتوى.</div><button class="btn" id="b59rt">إعادة المحاولة</button>';E('b59rt').onclick=function(){pub(k)}};
 if(k==='faqs')return c.from('b59_faq').select('question,answer,category').eq('status','published').order('sort').limit(300).then(function(r){if(r.error)return fail();var d=r.data;h.innerHTML='<h1>الأسئلة الشائعة</h1>'+(d.length?'<input id="b59fs" type="search" placeholder="ابحث في الأسئلة">'+'<div id="b59fl">'+d.map(function(f){return '<details class="b17c" style="display:block;margin:6px 0" data-t="'+X((f.question+' '+f.answer).toLowerCase())+'"><summary dir="auto"><b>'+X(f.question)+'</b></summary>'+body(f.answer)+'</details>'}).join('')+'</div>':'<p class="b17n">لا توجد أسئلة منشورة بعد.</p>');var i=E('b59fs');if(i)i.oninput=function(){var q=i.value.trim().toLowerCase();[].forEach.call(h.querySelectorAll('details'),function(x){x.style.display=x.dataset.t.indexOf(q)>-1?'':'none'})}});
 var slug=k.slice(5);return Promise.all([c.from('b59_pages').select('title,body').eq('slug',slug).eq('status','published').maybeSingle(),c.from('b59_site').select('value').eq('key','platform').maybeSingle()]).then(function(a){if(a[0].error)return fail();var p=a[0].data,pl=a[1].data&&a[1].data.value||{};
 h.innerHTML=p?'<h1>'+X(p.title)+'</h1>'+body(p.body)+(slug==='contact'&&pl.phone?'<p>رقم التواصل: <bdi dir="ltr">'+X(pl.phone)+'</bdi></p>':''):'<h1>الصفحة غير متاحة</h1><p class="b17n">لم يُنشر محتوى لهذه الصفحة بعد.</p>'})}
B59.page=function(k){if(k==='admcms'){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b59')});if(!sbc()){R().innerHTML='<p>تعذّر الاتصال بالخادم.</p>';return}S.busy=false;S.t='sec';load()}else pub(k)};
/* إخفاء أقسام الرئيسية المحددة من الإدارة. أي فشل = تبقى الصفحة كما هي */
(function(){var n=0;function go(){var c=window.sbc&&sbc();if(!c){if(n++<40)setTimeout(go,300);return}try{c.from('b59_site').select('value').eq('key','home_sections').maybeSingle().then(function(r){if(r.error||!r.data)return;((r.data.value||{}).hidden||[]).forEach(function(id){if(!SEC[id])return;var el=document.getElementById(id);if(el)el.style.display='none'})},function(){})}catch(x){}}go()})();
})();
/* ===== B72: لافتة الصيانة العامة (قراءة فقط من b72_public). أي فشل = لا لافتة ===== */
(function(){var n=0;function go(){var c=window.sbc&&sbc();if(!c){if(n++<40)setTimeout(go,300);return}try{c.from('b72_public').select('enabled,message').maybeSingle().then(function(r){if(r.error||!r.data||r.data.enabled!==true)return;var d=document.createElement('div');d.id='b72bn';d.setAttribute('role','status');d.style.cssText='position:sticky;top:0;z-index:9999;background:#8A5A00;color:#fff;padding:10px 14px;text-align:center;font-size:14px';d.textContent=r.data.message||'المنصة في وضع الصيانة حالياً.';document.body.insertBefore(d,document.body.firstChild)},function(){})}catch(x){}}go()})();

/* ===== B60: بلاغات تصحيح القطع وحفظها (b60_parts_extras.sql). إضافي: لا يمس B19/B20 ===== */
var B60={};
(function(){
var KD={wrong_fitment:'قطعة غير مناسبة للموديل المذكور',wrong_part_no:'رقم قطعة خاطئ',wrong_image:'صورة لا تطابق القطعة',old_price:'سعر قديم',unavailable_offer:'عرض غير متوفر',conflicting_info:'معلومة متعارضة أو مصدر غير موثوق',other:'أخرى'},ST={new:'جديد',in_review:'قيد المراجعة',corrected:'تم التصحيح',rejected:'مرفوض',closed:'مغلق'};
var R=function(){return E('b60c')},X=function(v){return ex(v)},S={busy:false,f:'new'},fd=function(d){return X(new Date(d).toLocaleDateString('ar-IQ'))};
function em(e){var m=String(e&&e.message||e||''),c=e&&e.code||'';if(c==='42883'||c==='PGRST202'||c==='42P01'||c==='PGRST205')return 'الميزة غير مفعّلة على الخادم بعد (يلزم b60_parts_extras.sql).';if(/forbidden/.test(m))return 'للمشرفين فقط.';if(/rate_limited/.test(m))return 'وصلت للحد اليومي للبلاغات.';if(/part_unavailable/.test(m))return 'القطعة غير متاحة.';if(/bad_text/.test(m))return 'غير مسموح بالرمزين < و >.';if(/note_required/.test(m))return 'اكتب سببًا (3 أحرف على الأقل).';if(/Failed to fetch|network/i.test(m))return 'انقطع الاتصال. أعد المحاولة.';return 'تعذّر التنفيذ. حاول مرة ثانية.'}
function shell(h){R().innerHTML=h+'<div id="b60m" class="msg" role="alert"></div>'}
function msg(t,x){var m=E('b60m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function bad(e){shell('<div class="msg err">'+X(em(e))+'</div><button class="btn" data-k="retry">إعادة المحاولة</button>')}
function mine(){var c=sbc();shell('<h1>قطعي المحفوظة</h1><p class="b17n">جارٍ التحميل…</p>');Promise.all([c.rpc('b60_my_favs'),c.rpc('b60_my_reports')]).then(function(a){a.forEach(function(x){if(x.error)throw x.error});
 shell('<h1>قطعي المحفوظة</h1>'+(a[0].data.length?a[0].data.map(function(p){return '<div class="b17c" style="display:block;margin:6px 0"><b dir="auto">'+X(p.name)+'</b> · <bdi dir="ltr">'+X(p.part_number||'')+'</bdi>'+(p.status!=='published'?' · <small>لم تعد منشورة</small>':'')+' <a class="btn" href="#part-'+X(p.id)+'">فتح</a> <button class="btn" data-k="unfav" data-p="'+X(p.id)+'">إزالة</button></div>'}).join(''):'<p class="b17n">لم تحفظ أي قطعة بعد. افتح قطعة من <a href="#parts">BAHR PARTS</a> واضغط «حفظ القطعة». لا توجد إشعارات تغيّر سعر أو توفر لها حاليًا.</p>')
 +'<h2>بلاغاتي</h2>'+(a[1].data.length?a[1].data.map(function(r){return '<div class="b15e"><small>'+fd(r.created_at)+'</small> <span dir="auto">'+X(r.part)+'</span> — '+X(KD[r.kind])+' — <b>'+X(ST[r.status])+'</b></div>'}).join(''):'<p class="b17n">لا بلاغات.</p>'))}).catch(bad)}
function adm(){var c=sbc();shell('<h1>بلاغات القطع</h1><p class="b17n">جارٍ التحميل…</p>');c.rpc('is_admin').then(function(a){if(a.error||a.data!==true)throw{message:'forbidden'};return c.rpc('b60_admin_reports',{p_status:S.f||null})}).then(function(r){if(r.error)throw r.error;
 shell('<h1>بلاغات القطع</h1><div>'+['new','in_review','corrected','rejected','closed'].map(function(s){return '<button class="btn'+(S.f===s?' btn-p':'')+'" data-k="flt" data-s="'+s+'">'+ST[s]+'</button>'}).join(' ')+'</div><p class="b17n">هوية المبلّغ لا تُعرض هنا. الأقدم أولًا.</p>'
 +(r.data.length?r.data.map(function(x){return '<div class="b17c" style="display:block;margin:8px 0" data-r="'+X(x.id)+'"><b>'+X(KD[x.kind])+'</b> · '+X(ST[x.status])+'<br><span dir="auto">'+X(x.part)+'</span> · <bdi dir="ltr">'+X(x.part_number||'')+'</bdi><br><small>'+fd(x.created_at)+'</small>'+(x.details?'<p dir="auto" style="white-space:pre-wrap">'+X(x.details)+'</p>':'')+(x.admin_note?'<p><small>ملاحظتك: '+X(x.admin_note)+'</small></p>':'')+'<a class="btn" href="#part-'+X(x.part_id)+'">فتح القطعة</a> '+['in_review','corrected','rejected','closed'].filter(function(s){return s!==x.status}).map(function(s){return '<button class="btn" data-k="set" data-s="'+s+'">'+ST[s]+'</button>'}).join(' ')+'</div>'}).join(''):'<p class="b17n">لا توجد بلاغات بهذه الحالة.</p>'))}).catch(bad)}
function run(p,ok,re){if(S.busy)return;S.busy=true;msg('','جارٍ التنفيذ…');p.then(function(r){if(r&&r.error)throw r.error;S.busy=false;toast(ok);if(re)re()}).catch(function(e){S.busy=false;msg('err',em(e))})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-b60]'),c=sbc();
 if(b){if(!AU.user){NEXT='سجّل الدخول لحفظ القطع أو الإبلاغ.';location.hash='#login';return}var id=b.dataset.p,k=b.dataset.b60;
  if(k==='fav'){if(S.busy)return;S.busy=true;return c.rpc('b60_toggle_fav',{p_part:id}).then(function(r){S.busy=false;if(r.error)throw r.error;toast(r.data?'حُفظت القطعة. يمكنك رؤيتها في #savedparts':'أُزيلت من المحفوظة.')}).catch(function(x){S.busy=false;toast(em(x))})}
  if(k==='rpt'){var h=b.parentNode.querySelector('[data-rf]');if(h){h.remove();return}h=document.createElement('div');h.setAttribute('data-rf','1');h.innerHTML='<select data-t>'+Object.keys(KD).map(function(x){return '<option value="'+x+'">'+X(KD[x])+'</option>'}).join('')+'</select><textarea data-d rows="3" maxlength="1000" placeholder="تفاصيل اختيارية (بدون بيانات خاصة)"></textarea><button class="btn btn-p" data-b60="sendrpt" data-p="'+X(id)+'" type="button">إرسال البلاغ</button><span data-s class="b17n"></span>';b.parentNode.appendChild(h);return}
  if(k==='sendrpt'){var f=b.closest('[data-rf]'),s=f.querySelector('[data-s]');if(S.busy)return;S.busy=true;s.textContent='جارٍ الإرسال…';return c.rpc('b60_report_part',{p_part:id,p_kind:f.querySelector('[data-t]').value,p_details:f.querySelector('[data-d]').value}).then(function(r){S.busy=false;if(r.error)throw r.error;f.innerHTML='<div class="b17n">أُرسل بلاغك. تستطيع متابعة حالته من #savedparts. شكرًا لك.</div>'}).catch(function(x){S.busy=false;s.textContent=em(x)})}}
 var a=e.target.closest('#b60c [data-k]');if(!a)return;var kk=a.dataset.k,card=a.closest('[data-r]'),re=function(){location.hash==='#admpartrep'?adm():mine()};
 if(kk==='retry')return re();if(kk==='flt'){S.f=a.dataset.s;return adm()}
 if(kk==='unfav')return run(c.rpc('b60_toggle_fav',{p_part:a.dataset.p}),'أُزيلت.',re);
 if(kk==='set'){var n=prompt('اكتب السبب/الملاحظة:');if(n===null)return;run(c.rpc('b60_admin_handle',{p_id:card.dataset.r,p_status:a.dataset.s,p_note:n}),'حُفظ القرار.',re)}});
B60.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b60')});if(!sbc()){R().innerHTML='<p>تعذّر الاتصال بالخادم.</p>';return}S.busy=false;S.f='new';k==='admpartrep'?adm():mine()};
})();

/* ===== B17: إنشاء وتعديل وإيقاف الإعلانات ورفع الصور (الملكية والنشر محميان بـ RLS وtrigger في الخادم: b17_listings.sql) ===== */
var B17={};
(function(){
var PV=['البصرة','بغداد','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var CAT={boat:'قارب',jetski:'جت سكي',engine:'محرك بحري',parts:'قطعة غيار',accessory:'إكسسوار بحري'};
var SF={boat:[['length_m','الطول (متر)','number'],['hp','قدرة المحرك (حصان)','number']],jetski:[['hp','القدرة (حصان)','number'],['hours','ساعات التشغيل','number']],engine:[['hp','القدرة (حصان)','number'],['hours','ساعات التشغيل','number'],['kind','النوع (خارجي أو داخلي)','text']],parts:[['part_number','رقم القطعة','text'],['fits','يناسب (حسب علم البائع)','text']],accessory:[['kind','نوع الإكسسوار','text']]};
var SL={pending:'بانتظار المراجعة',published:'منشور',rejected:'مرفوض',suspended:'موقوف من الإدارة',archived:'متوقف'};
var S={list:[],gone:[],busy:false,id:null,sp:{}};
var X=function(v){return ex(v)},R=function(){return E('b17c')};
function say(t,x){var m=E('b17m');m.className='msg'+(t?' '+t:'');m.textContent=x||''}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='noRow')return 'لم يُحفظ شيء: لا تملك صلاحية على هذا الإعلان أو لم يعد موجوداً.';
 if(c==='PGRST202'||c==='42883'||c==='42P01'||c==='PGRST205'||/b17_owner_col|my_listings/.test(m))return 'ميزة الإعلانات غير مفعّلة على الخادم بعد (يلزم تطبيق b17_listings.sql).';
 if(/owner_locked|status_locked|suspended_locked/.test(m))return 'هذا الإجراء غير مسموح لحسابك على هذا الإعلان.';
 if(c==='42501'||/row-level security|not authorized|policy/i.test(m))return 'لا تملك صلاحية تنفيذ هذا الإجراء.';
 if(/jwt|expired/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة.';
 if(/mime|size|exceed|too large/i.test(m))return 'ملف غير مقبول (النوع أو الحجم).';
 return 'حدث خطأ غير متوقع: '+m.slice(0,120)}
function pub(c,p){return c.storage.from('listing-images').getPublicUrl(p).data.publicUrl}
function comp(f){return new Promise(function(res,rej){var u=URL.createObjectURL(f),i=new Image();i.onload=function(){var r=Math.min(1,1600/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*r);c.height=Math.round(i.height*r);c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej(new Error('تعذّر معالجة الصورة'))},'image/jpeg',.85)};i.onerror=function(){URL.revokeObjectURL(u);rej(new Error('ملف الصورة تالف'))};i.src=u})}
function fld(id,l,t,v,x){return '<label>'+l+'<input id="'+id+'" type="'+t+'" value="'+X(v==null?'':v)+'" '+(x||'')+'></label>'}
function sel(id,l,o,v,ph){return '<label>'+l+'<select id="'+id+'">'+(ph?'<option value="">'+ph+'</option>':'')+o.map(function(a){return '<option value="'+X(a[0])+'"'+(a[0]===v?' selected':'')+'>'+X(a[1])+'</option>'}).join('')+'</select></label>'}
function specs(){var c=E('b-c').value,h='';(SF[c]||[]).forEach(function(f){h+=fld('sp-'+f[0],f[1],f[2],S.sp[f[0]],f[2]==='number'?'min="0" step="any" inputmode="decimal"':'maxlength="80"')});E('b17s').innerHTML=h;E('b17sn').style.display=(c&&c!=='parts'&&c!=='accessory')?'':'none'}
function kb(n){return n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB'}
function thumbs(){var c=sbc(),h='',n=S.list.length;S.list.forEach(function(it,i){var u=it.k==='o'?pub(c,it.p):it.u;
 h+='<div class="b51i'+(it.err?' err':'')+'"><div class="b17t"><img src="'+X(u)+'" alt="صورة '+(i+1)+' من '+n+'" decoding="async" onerror="this.style.visibility=\'hidden\'"><button type="button" data-rm="'+i+'" aria-label="حذف الصورة '+(i+1)+'">×</button></div>'
 +'<div class="b51m"><button type="button" data-mv="'+i+':-1" aria-label="تقديم الصورة" '+(i?'':'disabled')+'>▶</button><button type="button" data-mv="'+i+':1" aria-label="تأخير الصورة" '+(i<n-1?'':'disabled')+'>◀</button></div>'
 +'<small>'+(i===0?'<span class="b51k">الرئيسية</span> ':'')+(it.k==='o'?'محفوظة':X(kb(it.f.size))+(it.err?'<br>'+X(it.err):''))+'</small></div>'});
 E('b17p').innerHTML=h;E('b17pc').textContent=n+' / 8 صور'}
function formHtml(d){d=d||{};S.sp=d.specs||{};
 return '<h1>'+(S.id?'تعديل الإعلان':'إضافة إعلان')+'</h1><p class="b17n">سيُراجَع إعلانك من الإدارة قبل ظهوره للعامة.'+(S.id&&d.status==='published'?' <b>تعديل إعلان منشور يعيده إلى المراجعة.</b>':'')+'</p><div id="b17m" class="msg" role="alert"></div><form id="b17f" novalidate>'
 +sel('b-c','نوع الإعلان',Object.keys(CAT).map(function(k){return[k,CAT[k]]}),d.category,'اختر النوع')+fld('b-t','عنوان الإعلان','text',d.title,'maxlength="120"')
 +'<label>الوصف<textarea id="b-d" rows="5" maxlength="3000">'+X(d.description||'')+'</textarea></label>'
 +'<div class="b17r">'+fld('b-p','السعر','number',d.price,'min="0" step="any" inputmode="decimal"')+sel('b-cu','العملة',[['USD','دولار'],['IQD','دينار عراقي']],d.currency||'USD')+'</div>'
 +'<div class="b17r">'+sel('b-cd','الحالة',[['new','جديد'],['used','مستعمل']],d.condition||'used')+sel('b-pv','المحافظة',PV.map(function(p){return[p,p]}),d.province,'اختر المحافظة')+'</div>'
 +fld('b-a','المنطقة (اختياري)','text',d.area,'maxlength="80"')+'<div class="b17r">'+fld('b-m','الشركة المصنعة (اختياري)','text',d.manufacturer,'maxlength="80"')+fld('b-mo','الموديل (اختياري)','text',d.model,'maxlength="80"')+'</div>'
 +fld('b-y','سنة الصنع (اختياري)','number',d.year,'min="1950" max="'+(new Date().getFullYear()+1)+'" inputmode="numeric"')
 +'<div id="b17sn">'+fld('b-sn','الرقم التسلسلي (اختياري)','text',d.serial_number,'maxlength="80" dir="ltr"')+'</div><div id="b17s"></div>'
 +'<div class="b17i"><b>الصور</b> <span id="b17pc"></span><div id="b17p" class="b17g"></div><label class="btn b17u">إضافة صور<input id="b17fi" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label><small>JPG أو PNG أو WebP، حتى 8 صور، وحتى 15MB للصورة الواحدة قبل الضغط. تُصغَّر تلقائياً إلى 1600 بكسل. الصورة الأولى هي الرئيسية ويمكنك ترتيب الصور بالأسهم.</small><div class="b51pr" id="b51pr" hidden><i></i></div></div>'
 +'<button class="btn btn-p" id="b17b" type="submit">'+(S.id?'حفظ التعديلات':'إرسال للمراجعة')+'</button> <a class="btn" href="#mylistings">إعلاناتي</a></form>'}
function magic(f){return new Promise(function(res){var r=new FileReader();r.onload=function(){var a=new Uint8Array(r.result),s=function(o,x){return x.every(function(v,k){return a[o+k]===v})};res(s(0,[255,216,255])||s(0,[137,80,78,71,13,10,26,10])||(s(0,[82,73,70,70])&&s(8,[87,69,66,80])))};r.onerror=function(){res(false)};r.readAsArrayBuffer(f.slice(0,12))})}
function addFiles(files){var bad=[],full=0,ok=Promise.resolve();files.forEach(function(f){ok=ok.then(function(){
  if(S.list.length>=8){full=1;return}
  if(S.list.some(function(x){return x.k==='n'&&x.f.name===f.name&&x.f.size===f.size&&x.f.lastModified===f.lastModified}))return;
  if(!/^image\/(jpeg|png|webp)$/.test(f.type)){bad.push(f.name+' (النوع غير مدعوم)');return}
  if(f.size<=0||f.size>15e6){bad.push(f.name+(f.size>15e6?' (أكبر من 15MB)':' (ملف فارغ)'));return}
  return magic(f).then(function(g){if(!g){bad.push(f.name+' (المحتوى ليس صورة JPG/PNG/WebP صالحة)');return}S.list.push({k:'n',f:f,u:URL.createObjectURL(f),err:''})})})});
 return ok.then(function(){thumbs();say(bad.length||full?'err':'',(full?'الحد الأقصى 8 صور. ':'')+(bad.length?'تم رفض: '+bad.join('، '):''))})}
function bind(){specs();thumbs();E('b-c').addEventListener('change',function(){S.sp={};specs()});
 E('b17fi').addEventListener('change',function(){var fs=[].slice.call(this.files);this.value='';if(!S.busy)addFiles(fs)});
 E('b17p').addEventListener('click',function(e){if(S.busy)return;var b=e.target.closest('[data-rm]'),m=e.target.closest('[data-mv]');
  if(b){var i=+b.dataset.rm,it=S.list.splice(i,1)[0];if(it.k==='o')S.gone.push(it.p);else URL.revokeObjectURL(it.u);thumbs();return}
  if(m){var q=m.dataset.mv.split(':'),a=+q[0],z=a+ +q[1];if(z<0||z>=S.list.length)return;var tmp=S.list[a];S.list[a]=S.list[z];S.list[z]=tmp;thumbs()}});
 E('b17f').addEventListener('submit',save)}
function collect(){var g=function(i){return E(i).value.trim()},sp={};(SF[g('b-c')]||[]).forEach(function(f){var v=g('sp-'+f[0]);if(v!=='')sp[f[0]]=f[2]==='number'?Number(v):v});
 return{category:g('b-c'),title:g('b-t'),description:g('b-d'),price:Number(g('b-p')),currency:g('b-cu'),condition:g('b-cd'),province:g('b-pv'),area:g('b-a')||null,manufacturer:g('b-m')||null,model:g('b-mo')||null,year:g('b-y')?Number(g('b-y')):null,serial_number:E('b17sn').style.display==='none'?null:(g('b-sn')||null),specs:sp}}
function check(p){var y=new Date().getFullYear()+1;if(!CAT[p.category])return 'اختر نوع الإعلان.';if(p.title.length<5)return 'العنوان 5 أحرف على الأقل.';if(p.description.length<20)return 'الوصف 20 حرفاً على الأقل.';if(!isFinite(p.price)||p.price<=0||p.price>1e12||!E('b-p').value)return 'أدخل سعراً صحيحاً أكبر من صفر.';if(!p.province)return 'اختر المحافظة.';if(p.year!==null&&(p.year<1950||p.year>y))return 'سنة الصنع غير صحيحة.';for(var k in p.specs)if(typeof p.specs[k]==='number'&&(!isFinite(p.specs[k])||p.specs[k]<0))return 'قيمة رقمية غير صحيحة في الحقول الخاصة.';return ''}
function up(c,id,uid){var nw=S.list.filter(function(x){return x.k==='n'}),total=nw.length,done=0,fails=0,of=0,chain=Promise.resolve(),pr=E('b51pr');
 if(total&&pr){pr.hidden=false;pr.firstChild.style.width='0'}
 S.list.slice().forEach(function(it){if(it.k!=='n')return;chain=chain.then(function(){it.err='';done++;say('in','جارٍ رفع الصورة '+done+' من '+total+'…');
  return comp(it.f).then(function(b){var p=uid+'/'+id+'/'+Date.now().toString(36)+Math.random().toString(36).slice(2,8)+'.jpg',pos=S.list.indexOf(it);
   return c.storage.from('listing-images').upload(p,b,{contentType:'image/jpeg',upsert:false}).then(function(r){if(r.error)throw r.error;
    return c.from('listing_images').insert({listing_id:id,storage_path:p,sort_order:pos}).then(function(q){if(q.error){c.storage.from('listing-images').remove([p]);throw q.error}
     URL.revokeObjectURL(it.u);it.k='o';it.p=p;it.so=pos;delete it.f;delete it.u})})})
  .catch(function(x){fails++;it.err=emsg(x)}).then(function(){if(pr)pr.firstChild.style.width=Math.round(done*100/total)+'%'})})});
 S.list.forEach(function(it,i){chain=chain.then(function(){if(it.k!=='o'||it.so===i)return;
  return c.from('listing_images').update({sort_order:i}).eq('listing_id',id).eq('storage_path',it.p).select('storage_path').then(function(r){if(r.error||!r.data||!r.data.length)of++;else it.so=i}).catch(function(){of++})})});
 return chain.then(function(){if(pr)pr.hidden=true;return{fails:fails,of:of}})}
function save(e){e.preventDefault();if(S.busy)return;var p=collect(),v=check(p);if(v){say('err',v);return}
 var c=sbc();if(!c||!AU.user){say('err','تعذّر الاتصال بالخدمة أو انتهت الجلسة.');return}
 S.busy=true;var b=E('b17b'),fi=E('b17fi');b.disabled=true;fi.disabled=true;say('in','جارٍ الحفظ…');var uid=AU.user.id;
 (S.id?c.from('listings').update(p).eq('id',S.id).select('id'):c.from('listings').insert(p).select('id')).then(function(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw{code:'noRow'};S.id=r.data[0].id;
  var rm=S.gone.slice();return(rm.length?c.from('listing_images').delete().eq('listing_id',S.id).in('storage_path',rm).select('storage_path').then(function(d){if(d.error)throw d.error;var ok=(d.data||[]).map(function(x){return x.storage_path});S.gone=S.gone.filter(function(x){return ok.indexOf(x)<0});if(ok.length)c.storage.from('listing-images').remove(ok);}):Promise.resolve()).then(function(){return up(c,S.id,uid)})})
 .then(function(f){S.busy=false;b.disabled=false;fi.disabled=false;if(f.fails||f.of||S.gone.length){var w=[];if(f.fails)w.push('تعذّر رفع '+f.fails+' صورة (معلّمة بالأحمر)');if(f.of)w.push('تعذّر حفظ الترتيب الجديد للصور المحفوظة (قد يحتاج الحساب صلاحية تحديث على جدول الصور)');if(S.gone.length)w.push('تعذّر حذف بعض الصور');say('err','حُفظ الإعلان لكن '+w.join('، ')+'. اضغط حفظ مرة أخرى لإعادة المحاولة دون تكرار الصور الناجحة.');b.textContent='حفظ التعديلات';thumbs();return}
  toast('تم الحفظ. الإعلان بانتظار مراجعة الإدارة.');location.hash='#mylistings'})
 .catch(function(x){S.busy=false;b.disabled=false;var fi=E('b17fi');if(fi)fi.disabled=false;say('err',emsg(x))})}
function loadMine(c){return c.rpc('my_listings').then(function(r){if(r.error)throw r.error;return r.data||[]})}
function form(id){S={list:[],gone:[],busy:false,id:id||null,sp:{}};var c=sbc();R().innerHTML='<p class="b17n">جارٍ التحميل…</p>';
 if(!c){R().innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}
 if(!id){R().innerHTML=formHtml();bind();return}
 loadMine(c).then(function(L){var d=L.filter(function(x){return x.id===id})[0];if(!d)throw{code:'noRow'};if(d.status==='suspended')throw new Error('suspended_locked');
  return c.from('listing_images').select('storage_path,sort_order').eq('listing_id',id).order('sort_order').then(function(i){if(i.error)throw i.error;S.list=(i.data||[]).map(function(o){return{k:'o',p:o.storage_path,so:o.sort_order}});R().innerHTML=formHtml(d);bind()})})
 .catch(function(e){R().innerHTML='<div class="msg err">'+X(emsg(e))+'</div><p><a class="btn" href="#mylistings">إعلاناتي</a></p>'})}
function mine(){var c=sbc();R().innerHTML='<h1>إعلاناتي</h1><div id="b17m" class="msg"></div><p class="b17n">جارٍ التحميل…</p>';if(!c)return;
 loadMine(c).then(function(L){var ids=L.map(function(x){return x.id});return(ids.length?c.from('listing_images').select('listing_id,storage_path,sort_order').in('listing_id',ids).order('sort_order'):Promise.resolve({data:[]})).then(function(i){if(i.error)throw i.error;var im={};(i.data||[]).forEach(function(x){if(!im[x.listing_id])im[x.listing_id]=x.storage_path});
  R().innerHTML='<h1>إعلاناتي</h1><div id="b17m" class="msg"></div><p><a class="btn btn-p" href="#newlisting">+ إضافة إعلان</a></p>'+(L.length?L.map(function(x){var st=x.status,can=st!=='suspended';
   return '<div class="b17c"><div class="b17th">'+(im[x.id]?'<img src="'+X(pub(c,im[x.id]))+'" alt="'+X('صورة الإعلان'+(x.title?': '+x.title:''))+'" loading="lazy" decoding="async">':'')+'</div><div><h3>'+X(x.title)+'</h3><div>'+fm(Number(x.price),x.currency)+' · '+X(CAT[x.category]||x.category)+'</div><span class="bd '+X(st)+'">'+X(SL[st]||st)+'</span><div class="b17a">'
   +(can?'<a class="btn" href="#editlisting-'+X(x.id)+'">تعديل</a>':'')+((st==='published'||st==='pending')?'<button class="btn" data-a17="stop" data-id="'+X(x.id)+'">إيقاف</button>':'')+(st==='archived'?'<button class="btn" data-a17="resub" data-id="'+X(x.id)+'">إعادة للمراجعة</button>':'')+(st==='published'?'<a class="btn" href="#p-'+X(x.id)+'">عرض</a>':'')+(st==='suspended'?'<small>أوقفته الإدارة. تواصل معنا للاستفسار.</small>':'')+'</div></div></div>'}).join(''):'<div class="b17n">لم تضف أي إعلان بعد.</div>')})})
 .catch(function(e){R().innerHTML='<h1>إعلاناتي</h1><div class="msg err">'+X(emsg(e))+'</div>'})}
function setSt(id,s){var c=sbc();c.from('listings').update({status:s}).eq('id',id).select('id').then(function(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw{code:'noRow'};toast(s==='archived'?'تم إيقاف الإعلان.':'أُرسل للمراجعة.');mine()}).catch(function(e){say('err',emsg(e))})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-a17]');if(!b)return;if(b.dataset.a17==='stop'){if(confirm('إيقاف الإعلان؟ لن يظهر للعامة حتى تعيده للمراجعة.'))setSt(b.dataset.id,'archived')}else setSt(b.dataset.id,'pending')});
B17.comp=comp;B17.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b17')});
 if(k==='mylistings')mine();else if(k==='newlisting')form(null);else form(k.slice(12))}
})();

/* ===== B15: طلبات قطع الغيار والخدمات (RLS + دوال في الخادم: b15_requests.sql) ===== */
var B15={};
(function(){
var PV=['البصرة','بغداد','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var EQ={marine_engine:'محرك بحري',jetski:'جت سكي',boat:'قارب',other:'أخرى'};
var SK={maintenance:'صيانة',diagnosis:'تشخيص عطل',repair:'إصلاح',install:'تركيب قطعة',inspection:'فحص المعدة',technician:'طلب فني أو ورشة بحرية',other:'أخرى'};
var ST={'new':'جديد',reviewing:'قيد المراجعة',need_info:'نحتاج معلومات إضافية',searching:'جارٍ البحث عن القطعة أو مقدم الخدمة',found:'تم العثور على خيار مناسب',done:'اكتمل',cancelled:'ملغي'};
var CM={phone:'اتصال هاتفي',whatsapp:'واتساب',email:'بريد إلكتروني'};
var X=function(v){return ex(v)},R=function(){return E('b15c')},S={files:[],busy:false,kind:'part'};
function say(t,x){var m=E('b15m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'نظام الطلبات غير مفعّل على الخادم بعد (يلزم تطبيق b15_requests.sql).';
 if(/rate_limit/.test(m))return 'أرسلت طلبات كثيرة. حاول بعد ساعة.';
 if(/not_cancellable/.test(m))return 'لا يمكن إلغاء الطلب في حالته الحالية.';
 if(/forbidden|row-level|42501|policy/i.test(m))return 'لا تملك صلاحية تنفيذ هذا الإجراء.';
 if(/jwt|expired/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة.';
 return 'حدث خطأ: '+m.slice(0,120)}
var fd=function(x){try{return new Date(x).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}catch(e){return''}};
function fl(id,l,t,v,x){return '<label>'+l+'<input id="'+id+'" type="'+t+'" value="'+X(v==null?'':v)+'" '+(x||'')+'></label>'}
function sl(id,l,o,v,ph){return '<label>'+l+'<select id="'+id+'">'+(ph?'<option value="">'+ph+'</option>':'')+Object.keys(o).map(function(k){return '<option value="'+X(k)+'"'+(k===v?' selected':'')+'>'+X(o[k])+'</option>'}).join('')+'</select></label>'}
function thumbs(){E('b15p').innerHTML=S.files.map(function(f,i){return '<div class="b17t"><img src="'+X(f.u)+'" alt=""><button type="button" data-r15="'+i+'" aria-label="حذف">×</button></div>'}).join('');E('b15pc').textContent=S.files.length+' / 4'}
function form(kind){S={files:[],busy:false,kind:kind};var pf=window.BAHR_RP||{};window.BAHR_RP=null;var part=kind==='part',em=AUX.mail(AU.user);var pvs={};PV.forEach(function(p){pvs[p]=p});
 R().innerHTML='<h1>'+(part?'اطلب قطعة غيار':'اطلب خدمة بحرية')+'</h1><p class="b17n">'+(part?'لا تعرف رقم القطعة؟ لا مشكلة: صِف القطعة ومكانها في المعدة وأرفق صورة.':'صِف المشكلة أو الخدمة المطلوبة، وسيتواصل معك فريق بحر.')+' الحقول الاختيارية يمكن تركها فارغة. توفّر القطعة وتوافقها وتوفّر الخدمة يحتاج كل منها إلى تأكيد، ولا نعرض أي عرض أو سعر إلا بعد الحصول عليه فعلياً من مورّد.</p><div id="b15m" class="msg" role="alert"></div>'+B61.banner(kind)+'<form id="b15f" novalidate>'
 +(part?'':sl('r-k','نوع الخدمة',SK,'','اختر الخدمة')+sl('r-st','هل المعدة متوقفة عن العمل؟',{yes:'نعم',no:'لا'},'','اختر'))+sl('r-e','نوع المعدة',EQ,pf.e||'','اختر النوع')
 +'<div class="b17r">'+fl('r-m','الشركة المصنعة (اختياري)','text',pf.m,'maxlength="80"')+fl('r-mo','الموديل (اختياري)','text',pf.mo,'maxlength="80"')+'</div>'
 +'<div class="b17r">'+fl('r-y','سنة الصنع (اختياري)','number',pf.y,'min="1950" inputmode="numeric"')+fl('r-hp','القدرة بالحصان (اختياري)','number',pf.hp,'min="0" step="any" inputmode="decimal"')+'</div>'
 +(part?fl('r-sn','الرقم التسلسلي أو رقم القطعة (اختياري)','text',pf.sn,'maxlength="80" dir="ltr"')+fl('r-pn','اسم القطعة المطلوبة (اختياري)','text',pf.pn,'maxlength="120"'):fl('r-sn','الرقم التسلسلي (اختياري)','text',pf.sn,'maxlength="80" dir="ltr"'))
 +'<label>'+(part?'وصف القطعة أو المشكلة':'وصف المشكلة أو الطلب')+'<textarea id="r-d" rows="5" maxlength="3000">'+X(pf.d||'')+'</textarea></label>'
 +'<div class="b17r">'+sl('r-pv','المحافظة',pvs,pf.pv||'البصرة','اختر المحافظة')+fl('r-a','المنطقة (اختياري)','text','','maxlength="80"')+'</div>'
 +'<div class="b17r">'+sl('r-c','وسيلة التواصل',CM,'phone')+fl('r-cv','رقم الهاتف أو البريد','text',em,'maxlength="120" dir="ltr"')+'</div>'
 +'<div class="b17i"><b>صور (اختياري)</b> <span id="b15pc"></span><div id="b15p" class="b17g"></div><label class="btn b17u">إضافة صور<input id="b15fi" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label><small>'+(part?'القطعة القديمة أو لوحة بيانات المحرك. ':'')+'حتى 4 صور، تُصغَّر تلقائياً. الصور خاصة ولا تُعرض للعامة.</small></div>'
 +'<button class="btn btn-p" id="b15b" type="submit">إرسال الطلب</button> <a class="btn" href="#myrequests">طلباتي</a></form>';
 thumbs();var ci=E('r-c'),cv=E('r-cv');ci.addEventListener('change',function(){if(ci.value==='email')cv.value=em;else if(cv.value===em)cv.value=''});
 E('b15fi').addEventListener('change',function(){var bad=0;[].forEach.call(this.files,function(f){if(S.files.length>=4){bad=1;return}if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size>15e6){bad=2;return}S.files.push({f:f,u:URL.createObjectURL(f)})});this.value='';thumbs();say(bad?'err':'',bad===1?'الحد الأقصى 4 صور.':bad?'بعض الملفات غير مقبولة (JPG/PNG/WebP حتى 15MB).':'')});
 E('b15p').addEventListener('click',function(e){var b=e.target.closest('[data-r15]');if(b){URL.revokeObjectURL(S.files.splice(+b.dataset.r15,1)[0].u);thumbs()}});
 E('b15f').addEventListener('submit',send)}
function collect(){var g=function(i){var e=E(i);return e?e.value.trim():''},d2=function(s){return s.replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632})},part=S.kind==='part',cm=g('r-c'),cv=g('r-cv');if(cm!=='email')cv=d2(cv).replace(/[\s-]/g,'');
 return{req_type:S.kind,service_kind:part?null:(g('r-k')||null),is_stopped:part?null:(g('r-st')==='yes'?true:g('r-st')==='no'?false:null),equipment_type:g('r-e'),manufacturer:g('r-m')||null,model:g('r-mo')||null,year:g('r-y')?Number(g('r-y')):null,power_hp:g('r-hp')?Number(g('r-hp')):null,serial_or_part_no:g('r-sn')||null,part_name:part?(g('r-pn')||null):null,description:g('r-d'),province:g('r-pv'),area:g('r-a')||null,contact_method:cm,contact_value:cv}}
function check(p){var y=new Date().getFullYear()+1;if(p.req_type==='service'&&!p.service_kind)return 'اختر نوع الخدمة.';if(p.req_type==='service'&&p.is_stopped===null)return 'حدد هل المعدة متوقفة عن العمل.';if(!EQ[p.equipment_type])return 'اختر نوع المعدة.';if(p.description.length<10)return 'اكتب وصفاً من 10 أحرف على الأقل.';if(!p.province)return 'اختر المحافظة.';
 if(p.year!==null&&(p.year<1950||p.year>y))return 'سنة الصنع غير صحيحة.';if(p.power_hp!==null&&(!isFinite(p.power_hp)||p.power_hp<0))return 'القدرة غير صحيحة.';
 if(p.contact_method==='email'?!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.contact_value):!/^\+?[0-9]{7,15}$/.test(p.contact_value))return p.contact_method==='email'?'أدخل بريداً صحيحاً.':'أدخل رقم هاتف صحيحاً (أرقام فقط).';return ''}
function send(e){e.preventDefault();if(S.busy)return;var p=B61.tag(collect()),v=check(p);if(v){say('err',v);return}
 if(!S.cf){B61.review(p,S.files.length,function(){S.cf=1;try{send({preventDefault:function(){}})}finally{S.cf=0}});return}
 var c=sbc();if(!c||!AU.user){say('err','تعذّر الاتصال بالخدمة أو انتهت الجلسة.');return}
 S.busy=true;var b=E('b15b');b.disabled=true;b.textContent='جارٍ الإرسال…';say('in','جارٍ الإرسال…');
 var id=(crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(k){var r=Math.random()*16|0;return(k==='x'?r:r&3|8).toString(16)})),uid=AU.user.id,paths=[],bk=c.storage.from('request-images');
 var undo=function(){if(paths.length)bk.remove(paths)};
 S.files.reduce(function(ch,o,i){return ch.then(function(){return B17.comp(o.f).then(function(bl){var pth=uid+'/'+id+'/'+i+'.jpg';return bk.upload(pth,bl,{contentType:'image/jpeg',upsert:false}).then(function(r){if(r.error)throw r.error;paths.push(pth)})})})},Promise.resolve())
 .then(function(){p.id=id;p.images=paths;return c.from('service_requests').insert(p).select('id,req_no,status,provider_status').maybeSingle()}).then(function(r){if(r.error)throw r.error;B61.sent(r.data,p)})
 .catch(function(x){undo();say('err',emsg(x)+(S.files.length?' لم يُحفظ الطلب.':''));}).then(function(){S.busy=false;b.disabled=false;b.textContent='إرسال الطلب'})}
var AN={};
function card(r,offs,evs,adm,full){var t=r.req_type==='part'?'طلب قطعة غيار':'طلب خدمة: '+(SK[r.service_kind]||'');var rows=[['المعدة',(EQ[r.equipment_type]||'')+[r.manufacturer,r.model,r.year].filter(Boolean).map(function(x){return ' · '+x}).join('')],r.power_hp?['القدرة',r.power_hp+' حصان']:0,r.is_stopped!=null?['المعدة متوقفة عن العمل',r.is_stopped?'نعم':'لا']:0,r.serial_or_part_no?['الرقم',r.serial_or_part_no]:0,r.part_name?['القطعة',r.part_name]:0,['الموقع',r.province+(r.area?'، '+r.area:'')],[adm?'بيانات الزبون (التواصل)':'وسيلة التواصل',(CM[r.contact_method]||'')+': '+r.contact_value]].filter(Boolean);
 return '<div class="b17c b15r"><div style="flex:1;min-width:0"><div class="b15h"><b>'+(adm?'رقم الطلب ':'')+'<bdi>#'+X(r.req_no)+'</bdi></b> '+X(t)+' <span class="bd '+(r.status==='cancelled'?'rejected':r.status==='done'||r.status==='found'?'published':'pending')+'">'+X(ST[r.status]||r.status)+'</span></div><small>'+fd(r.created_at)+'</small>'
 +'<table class="sp">'+rows.map(function(a){return '<tr><td>'+a[0]+'</td><td dir="auto">'+X(a[1])+'</td></tr>'}).join('')+'</table><p style="white-space:pre-wrap;margin:6px 0">'+X(r.description)+'</p><div class="b17g" id="im-'+X(r.id)+'"></div>'
 +'<h4 style="margin:10px 0 4px">'+(adm?'العروض المسجّلة':'الردود والعروض')+'</h4>'+((offs&&offs.length)?offs.map(function(o){return '<div class="sel"><b>'+X(o.provider_name)+'</b>'+(o.price!=null?' · '+fm(Number(o.price),o.currency||'USD'):'')+(o.availability?' · '+X(o.availability):'')+(o.confirmed_at?'<br><small>آخر تأكيد: '+fd(o.confirmed_at)+'</small>':'')+(o.note?'<br>'+X(o.note):'')+'</div>'}).join(''):'<p class="b17n">لا توجد ردود بعد. سيظهر هنا ما يُسجَّل فعلياً من فريق بحر.</p>')
 +((evs&&evs.length)?'<details'+(full||adm?' open':'')+'><summary>سجل الحالة وردود الإدارة</summary>'+evs.map(function(v){return '<div class="b15e"><small>'+fd(v.created_at)+' · '+X(ST[v.to_status]||v.to_status)+(adm?' · بواسطة '+X(AN[v.actor]||'مستخدم/مشرف'):'')+'</small>'+(v.note?'<div>'+X(v.note)+'</div>':'')+'</div>'}).join('')+'</details>':'')+'<div class="b17a" data-rid="'+X(r.id)+'">'+(adm?'':(r.status==='new'?'<button class="btn" data-c15="'+X(r.id)+'">إلغاء الطلب</button>':'<small class="b17n">'+(r.status==='cancelled'?'':'الإلغاء متاح قبل بدء التعامل مع الطلب فقط.')+'</small>'))+'</div>'+(adm||'')+'</div></div>'}
function imgs(c,rows){rows.forEach(function(r){if(!r.images||!r.images.length)return;c.storage.from('request-images').createSignedUrls(r.images,3600).then(function(d){var el=E('im-'+r.id);if(!el||d.error||!d.data)return;el.innerHTML=d.data.filter(function(x){return x.signedUrl}).map(function(x){return '<a href="'+X(x.signedUrl)+'" target="_blank" rel="noopener"><div class="b17t"><img src="'+X(x.signedUrl)+'" alt="صورة الطلب"></div></a>'}).join('')})})}
function group(a,k){var m={};(a||[]).forEach(function(x){(m[x[k]]=m[x[k]]||[]).push(x)});return m}
function load(c,rows){var ids=rows.map(function(r){return r.id});if(!ids.length)return Promise.resolve([{},{}]);return Promise.all([c.from('request_offers').select('*').in('request_id',ids).order('created_at'),c.from('request_events').select('request_id,actor,to_status,note,created_at').in('request_id',ids).order('created_at')]).then(function(a){if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;return[group(a[0].data,'request_id'),group(a[1].data,'request_id')]})}
function sum(r){var up=r.updated_at>r.owner_seen_at;return '<a class="b17c b15r" href="#request-'+X(r.id)+'" style="display:block"><div class="b15h"><b>#'+X(r.req_no)+'</b> '+X(r.req_type==='part'?'طلب قطعة غيار':'طلب خدمة')+' <span class="bd '+(r.status==='cancelled'?'rejected':r.status==='done'||r.status==='found'?'published':'pending')+'">'+X(ST[r.status]||r.status)+'</span>'+(r.biz_id&&r.provider_status?' <span class="bd new">'+X(B61.PS[r.provider_status]||'')+'</span>':'')+(up?' <span class="bd new">تحديث جديد</span>':'')+'</div><small>'+fd(r.created_at)+' · '+X(EQ[r.equipment_type]||'')+(r.manufacturer?' · '+X(r.manufacturer):'')+'</small><div style="margin-top:4px">عرض التفاصيل ›</div></a>'}
function mine(){var c=sbc();R().innerHTML='<h1>طلباتي</h1><div id="b15m" class="msg"></div><p><a class="btn btn-p" href="#requestpart">+ طلب قطعة</a> <a class="btn" href="#requestservice">+ طلب خدمة</a></p><div id="b15l" class="b17n">جارٍ التحميل…</div>';if(!c)return;
 c.from('service_requests').select('*').eq('user_id',AU.user.id).order('created_at',{ascending:false}).limit(100).then(function(r){if(r.error)throw r.error;var rows=r.data||[];E('b15l').className='';E('b15l').innerHTML=rows.length?rows.map(sum).join(''):'<div class="b17n">لا توجد طلبات بعد.</div>'}).catch(function(e){E('b15l').className='';E('b15l').innerHTML='<div class="msg err">'+X(emsg(e))+'</div>'})}
function detail(id){var c=sbc();R().innerHTML='<p><a class="btn" href="#myrequests">‹ طلباتي</a></p><div id="b15m" class="msg"></div><div id="b15l" class="b17n">جارٍ التحميل…</div>';if(!c)return;
 c.from('service_requests').select('*').eq('id',id).maybeSingle().then(function(r){if(r.error)throw r.error;if(!r.data){E('b15l').innerHTML='هذا الطلب غير موجود أو لا تملك صلاحية عرضه.';return}var x=r.data;return load(c,[x]).then(function(o){E('b15l').className='';E('b15l').innerHTML=card(x,o[0][x.id],o[1][x.id],0,1);imgs(c,[x]);B61.afterDetail(c,x);c.rpc('mark_request_seen',{p_id:id}).then(function(){B15.sync()})})}).catch(function(e){E('b15l').className='';E('b15l').innerHTML='<div class="msg err">'+X(emsg(e))+'</div>'})}
var A={st:'',ty:'',q:'',t:0};
function admin(){R().innerHTML='<h1>إدارة الطلبات</h1><div id="b15m" class="msg"></div><div class="b17g" id="b15fs"></div><input id="b15q" type="search" placeholder="بحث: رقم الطلب، شركة، موديل، وصف، محافظة" style="font:inherit;border:1px solid var(--line);border-radius:10px;padding:10px;width:100%;margin:6px 0 10px"><div id="b15l" class="b17n">جارٍ التحميل…</div>';
 E('b15q').addEventListener('input',function(){clearTimeout(A.t);A.t=setTimeout(function(){A.q=E('b15q').value.trim().toLowerCase();lst()},300)});lst()}
function lst(){var c=sbc();E('b15fs').innerHTML=[['st',''].concat(Object.keys(ST)),['ty','','part','service']].map(function(g,gi){return g.slice(1).map(function(k){var lb=gi?(k===''?'كل الأنواع':k==='part'?'قطع غيار':'خدمات'):(k===''?'كل الحالات':ST[k]);return '<button class="btn'+(k===A[g[0]]?' btn-p':'')+'" data-f15="'+g[0]+'" data-v="'+k+'">'+lb+'</button>'}).join('')}).join('<br>');
 c.rpc('is_admin').then(function(a){if(a.error||a.data!==true)throw new Error('forbidden');var q=c.from('service_requests').select('*').order('created_at',{ascending:false}).limit(200);if(A.st)q=q.eq('status',A.st);if(A.ty)q=q.eq('req_type',A.ty);return q}).then(function(r){if(r.error)throw r.error;var rows=(r.data||[]).filter(function(x){return!A.q||[x.req_no,x.description,x.manufacturer,x.model,x.province,x.area,x.contact_value,x.serial_or_part_no,x.part_name].join(' ').toLowerCase().indexOf(A.q)>-1});
  return load(c,rows).then(function(o){var ids=[];Object.keys(o[1]).forEach(function(k){o[1][k].forEach(function(v){if(v.actor&&ids.indexOf(v.actor)<0)ids.push(v.actor)})});
   return(ids.length?c.from('public_profiles').select('id,display_name,business_name').in('id',ids):Promise.resolve({data:[]})).then(function(p){(p.data||[]).forEach(function(u){AN[u.id]=u.display_name||u.business_name||AN[u.id]});
    E('b15l').className='';E('b15l').innerHTML=rows.length?'<p class="b17n">عدد الطلبات المعروضة: '+rows.length+((r.data||[]).length>=200?' (أول 200 طلب فقط)':'')+'</p>'+rows.map(function(x){return card(x,o[0][x.id],o[1][x.id],adm(x),1)}).join(''):'<div class="b17n">لا توجد طلبات مطابقة.</div>';imgs(c,rows)})})}).catch(function(e){E('b15l').className='';E('b15l').innerHTML='<div class="msg err">'+X(emsg(e))+'</div>'})}
function adm(r){return '<div class="b15a" data-aid="'+X(r.id)+'"><label>الحالة<select data-k="s">'+Object.keys(ST).map(function(k){return '<option value="'+k+'"'+(k===r.status?' selected':'')+'>'+ST[k]+'</option>'}).join('')+'</select></label><label>ملاحظة (تظهر في السجل)<input data-k="n" maxlength="200"></label><button class="btn" data-a15="st">تحديث الحالة</button>'
 +'<hr><b>تسجيل رد من مورّد أو ورشة (بيانات حقيقية فقط)</b><div class="b17r"><label>الاسم<input data-k="pn" maxlength="100"></label><label>التوفر<input data-k="av" maxlength="100"></label></div><div class="b17r"><label>السعر<input data-k="pr" type="number" min="0" step="any"></label><label>العملة<select data-k="cu"><option>USD</option><option>IQD</option></select></label></div><label>ملاحظة للمستخدم<input data-k="on" maxlength="300"></label><button class="btn" data-a15="of">إضافة الرد (وقت التأكيد = الآن)</button></div>'}
document.addEventListener('click',function(e){var c=sbc(),b;
 if(b=e.target.closest('[data-c15]')){if(!confirm('إلغاء هذا الطلب؟ لا يمكن التراجع.'))return;c.rpc('cancel_my_request',{p_id:b.dataset.c15}).then(function(r){if(r.error)throw r.error;toast('تم إلغاء الطلب.');mine()}).catch(function(x){say('err',emsg(x))});return}
 if(b=e.target.closest('[data-f15]')){A[b.dataset.f15]=b.dataset.v;lst();return}
 if(b=e.target.closest('[data-a15]')){var w=b.closest('[data-aid]'),id=w.dataset.aid,v=function(k){return w.querySelector('[data-k="'+k+'"]').value.trim()};
  if(b.dataset.a15==='st')c.rpc('admin_set_request_status',{p_id:id,p_status:v('s'),p_note:v('n')}).then(function(r){if(r.error)throw r.error;toast('تم تحديث الحالة.');lst()}).catch(function(x){say('err',emsg(x))});
  else{if(!v('pn')){say('err','اسم المورد أو الورشة مطلوب.');return}var pr=v('pr');c.from('request_offers').insert({request_id:id,provider_name:v('pn'),availability:v('av')||null,price:pr?Number(pr):null,currency:pr?v('cu'):null,note:v('on')||null,confirmed_at:new Date().toISOString()}).then(function(r){if(r.error)throw r.error;toast('تم تسجيل الرد.');lst()}).catch(function(x){say('err',emsg(x))})}}});
B15.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b15')});if(!sbc()){R().innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}
 if(k==='requestpart')form('part');else if(k==='requestservice')form('service');else if(k==='myrequests')mine();else if(k.slice(0,8)==='request-')detail(k.slice(8));else admin()};
B15.sync=function(){var l=E('admReqLink'),c=sbc();if(l)l.style.display='none';if(!c||!AU.user)return;if(l)c.rpc('is_admin').then(function(r){if(!r.error&&r.data===true)l.style.display=''});
 c.rpc('my_requests_unseen').then(function(r){if(r.error)return;var k=Number(r.data)||0;[].forEach.call(document.querySelectorAll('a[href="#myrequests"]:not(.bt-k)'),function(a){a.dataset.t0=a.dataset.t0||a.textContent;a.textContent=a.dataset.t0+(k?' ('+k+')':'')});[].forEach.call(document.querySelectorAll('[data-rqc]'),function(i){i.textContent=k?'('+k+')':''})})};
})();

/* ===== B49: مركز طلبات الشراء والعروض (b49_buyer_requests.sql). إضافي: لا يمس B15/B18. الصلاحيات تفرضها RLS والحراس في الخادم؛ الواجهة لا تُظهر نجاحاً قبل رد الخادم ===== */
var B49={};
(function(){
var PV=['البصرة','بغداد','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var TY={boat:'قارب',jetski:'جت سكي',engine:'محرك بحري',part:'قطعة غيار',accessory:'إكسسوار بحري',service:'خدمة أو صيانة بحرية'};
var X=PF.esc,R=function(){return E('b49c')},busy=false,BQ={q:'',ty:'',pv:''};
function say(t,x){var m=E('b49m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'نظام طلبات الشراء غير مفعّل على الخادم بعد (يلزم تطبيق b49_buyer_requests.sql).';
 if(c==='23505')return 'لديك عرض مسجّل على هذا الطلب بالفعل. عدّله بدل إرسال عرض جديد.';
 if(/rate_limit/.test(m))return 'وصلت للحد اليومي من الطلبات (10). حاول غداً.';
 if(/request_closed/.test(m))return 'الطلب مغلق أو منتهي ولا يقبل تغييراً أو عروضاً.';
 if(/own_request/.test(m))return 'لا يمكنك تقديم عرض على طلبك.';
 if(/bad_transition/.test(m))return 'لا يمكن تغيير الحالة بهذه الطريقة.';
 if(/forbidden|row-level|42501|policy/i.test(m))return 'لا تملك صلاحية تنفيذ هذا الإجراء (قد يكون نشاطك غير معتمد).';
 if(/jwt|expired/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة.';
 return 'حدث خطأ: '+m.slice(0,120)}
function fd(x){try{return new Date(x).toLocaleDateString('ar-IQ',{dateStyle:'medium'})}catch(e){return''}}
function money(n,c){return Number(n).toLocaleString('en-US')+' '+(c||'')}
function bud(r){if(r.budget_min==null&&r.budget_max==null)return '';var a=r.budget_min!=null?money(r.budget_min,r.currency):'',b=r.budget_max!=null?money(r.budget_max,r.currency):'';return 'الميزانية: '+(a&&b?a+' – '+b:a?'من '+a:'حتى '+b)}
function opts(o,v,ph){return (ph?'<option value="">'+ph+'</option>':'')+Object.keys(o).map(function(k){return '<option value="'+X(k)+'"'+(k===v?' selected':'')+'>'+X(o[k])+'</option>'}).join('')}
function pvo(v,ph){var o={};PV.forEach(function(p){o[p]=p});return opts(o,v,ph)}
function retry(fn){return '<button class="btn btn-p" type="button" data-r49="'+fn+'">إعادة المحاولة</button>'}
function fail(e,fn){R().innerHTML='<div class="msg err">'+X(emsg(e))+'</div><p>'+retry(fn)+'</p>'}
function nav(a){return '<p><a class="btn'+(a==='new'?' btn-p':'')+'" href="#buynew">+ طلب شراء</a> <a class="btn'+(a==='mine'?' btn-p':'')+'" href="#buymine">طلبات الشراء الخاصة بي</a> <a class="btn'+(a==='board'?' btn-p':'')+'" href="#buyboard">لوحة الأنشطة</a></p>'}
function fld(id,l,t,x){return '<label>'+l+'<input id="'+id+'" type="'+t+'" '+(x||'')+'></label>'}
/* ---- نموذج طلب جديد (حقول حسب النوع) ---- */
function form(){
 R().innerHTML='<h1>أضف طلب شراء</h1>'+nav('new')+'<p class="b17n">صِف ما تبحث عنه ليصلك عروض من الأنشطة المعتمدة. الحقول الاختيارية يمكن تركها فارغة. لا تُنشر بيانات تواصلك؛ التواصل يتم عبر المنصة.</p><div id="b49m" class="msg" role="alert"></div><form id="b49f" novalidate>'
 +'<label>نوع المطلوب<select id="q-t">'+opts(TY,'','اختر النوع')+'</select></label>'
 +fld('q-ti','عنوان الطلب','text','maxlength="120" placeholder="مثال: أبحث عن جت سكي سي دو 2018"')
 +'<div class="b17r" id="q-mm">'+fld('q-m','الشركة (اختياري)','text','maxlength="80"')+fld('q-mo','الموديل (اختياري)','text','maxlength="80"')+'</div>'
 +'<div class="b17r"><span id="q-yw">'+fld('q-y','السنة (اختياري)','number','min="1950" inputmode="numeric"')+'</span><span id="q-pw">'+fld('q-p','رقم القطعة (اختياري)','text','maxlength="80" dir="ltr"')+'</span></div>'
 +'<div class="b17r">'+fld('q-b1','الميزانية من (اختياري)','number','min="0" step="any" inputmode="decimal"')+fld('q-b2','إلى (اختياري)','number','min="0" step="any" inputmode="decimal"')+'</div>'
 +'<div class="b17r"><label>العملة<select id="q-c"><option>USD</option><option>IQD</option></select></label><label style="display:flex;gap:6px;align-items:center"><input id="q-sb" type="checkbox"> أظهر الميزانية للأنشطة</label></div>'
 +'<div class="b17r"><label>المحافظة<select id="q-pv">'+pvo('البصرة','اختر المحافظة')+'</select></label>'+fld('q-a','المنطقة (اختياري)','text','maxlength="80"')+'</div>'
 +'<label>الوصف التفصيلي<textarea id="q-d" rows="5" maxlength="3000"></textarea></label>'
 +'<label>مدة صلاحية الطلب<select id="q-ex"><option value="7">7 أيام</option><option value="14">14 يوماً</option><option value="30" selected>30 يوماً</option><option value="60">60 يوماً</option></select></label>'
 +'<button class="btn btn-p" id="b49b" type="submit">نشر الطلب</button></form>';
 var t=E('q-t'),sync=function(){var v=t.value;E('q-mm').hidden=!/^(boat|jetski|engine|part)$/.test(v);E('q-yw').hidden=!/^(boat|jetski|engine|part)$/.test(v);E('q-pw').hidden=v!=='part'};sync();t.addEventListener('change',sync);
 E('b49f').addEventListener('submit',send)}
function send(e){e.preventDefault();if(busy)return;var g=function(i){var x=E(i);return x&&!x.closest('[hidden]')?x.value.trim():''},n=function(i){var v=g(i).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632});return v===''?null:Number(v)};
 var p={title:g('q-ti'),equipment_type:g('q-t'),manufacturer:g('q-m')||null,model:g('q-mo')||null,year:n('q-y'),part_no:g('q-p')||null,budget_min:n('q-b1'),budget_max:n('q-b2'),currency:'',show_budget:E('q-sb').checked,province:g('q-pv'),area:g('q-a')||null,description:g('q-d')},y=new Date().getFullYear()+1;
 var v=!TY[p.equipment_type]?'اختر نوع المطلوب.':p.title.length<4?'اكتب عنوان الطلب (4 أحرف على الأقل).':p.description.length<10?'اكتب وصفاً من 10 أحرف على الأقل.':!p.province?'اختر المحافظة.':(p.year!==null&&(!(p.year>=1950&&p.year<=y)))?'السنة غير صحيحة.':((p.budget_min!==null&&!(p.budget_min>=0))||(p.budget_max!==null&&!(p.budget_max>=0)))?'الميزانية غير صحيحة.':(p.budget_min!==null&&p.budget_max!==null&&p.budget_max<p.budget_min)?'الحد الأعلى للميزانية أقل من الأدنى.':'';
 if(v){say('err',v);return}
 if(p.budget_min!==null||p.budget_max!==null)p.currency=g('q-c');else{p.currency=null;p.show_budget=false}
 p.expires_at=new Date(Date.now()+Number(g('q-ex')||30)*864e5).toISOString();
 var c=sbc();if(!c||!AU.user){say('err','تعذّر الاتصال بالخدمة أو انتهت الجلسة.');return}
 busy=true;var b=E('b49b');b.disabled=true;b.textContent='جارٍ النشر…';say('in','جارٍ الحفظ…');
 c.from('buyer_requests').insert(p).then(function(r){if(r.error)throw r.error;toast('تم نشر طلبك.');location.hash='#buymine'})
 .catch(function(x){say('err',emsg(x)+' لم يُحفظ الطلب.')}).then(function(){busy=false;b.disabled=false;b.textContent='نشر الطلب'})}
/* ---- طلباتي مع العروض ---- */
var NM={};
function expired(r){return r.status==='open'&&new Date(r.expires_at)<=new Date()}
function stl(r){return r.status==='closed'?'مغلق':expired(r)?'منتهي الصلاحية':'مفتوح'}
function offCard(o){return '<div class="sel"><b>'+X(NM[o.biz_id]||'نشاط معتمد')+'</b>'+(o.price!=null?' · '+X(money(o.price,o.currency)):'')+(o.availability?' · '+X(o.availability):'')+'<br>'+X(o.description)+'<br><small>'+fd(o.created_at)+(o.status==='withdrawn'?' · سُحب العرض':'')+'</small></div>'}
function mineCard(r,offs){var live=offs.filter(function(o){return o.status==='sent'}),nw=live.filter(function(o){return o.created_at>r.owner_seen_at}).length,open=r.status==='open'&&!expired(r);
 return '<div class="b17c b15r"><div style="flex:1;min-width:0"><div class="b15h"><b>'+X(r.title)+'</b> <span class="bd '+(open?'pending':'rejected')+'">'+stl(r)+'</span>'+(nw?' <span class="bd new">'+nw+' عرض جديد</span>':'')+'</div><small>'+X(TY[r.equipment_type])+' · '+X(r.province)+(r.area?'، '+X(r.area):'')+' · نُشر '+fd(r.created_at)+(open?' · ينتهي '+fd(r.expires_at):'')+'</small>'
 +(bud(r)?'<div>'+X(bud(r))+'</div>':'')+'<p style="white-space:pre-wrap;margin:6px 0">'+X(r.description)+'</p><h4 style="margin:8px 0 4px">العروض ('+live.length+')</h4>'+(live.length?live.map(offCard).join(''):'<p class="b17n">لا توجد عروض بعد. ستظهر هنا العروض الفعلية من الأنشطة المعتمدة فقط.</p>')
 +(open?'<div class="b17a"><button class="btn" data-x49="'+X(r.id)+'">إغلاق الطلب</button></div>':'')+'</div></div>'}
function mine(){var c=sbc();R().innerHTML='<h1>طلبات الشراء الخاصة بي</h1>'+nav('mine')+'<div id="b49l" class="b17n">جارٍ التحميل…</div>';if(!c)return;
 c.from('buyer_requests').select('*').eq('user_id',AU.user.id).order('created_at',{ascending:false}).limit(100).then(function(r){if(r.error)throw r.error;var rows=r.data||[];if(!rows.length){E('b49l').className='';E('b49l').innerHTML='<div class="b17n">لا توجد طلبات بعد. <a href="#buynew">أضف طلبك الأول</a>.</div>';return}
  return c.from('buyer_request_offers').select('*').in('request_id',rows.map(function(x){return x.id})).order('created_at',{ascending:false}).then(function(o){if(o.error)throw o.error;var ids=[];(o.data||[]).forEach(function(x){if(ids.indexOf(x.biz_id)<0)ids.push(x.biz_id)});
   return(ids.length?c.from('biz_public').select('id,name').in('id',ids):Promise.resolve({data:[]})).then(function(p){(p.data||[]).forEach(function(b){NM[b.id]=b.name});/* إن فشل جلب الاسم يُعرض «نشاط معتمد» */
    var by={};(o.data||[]).forEach(function(x){(by[x.request_id]=by[x.request_id]||[]).push(x)});E('b49l').className='';E('b49l').innerHTML=rows.map(function(x){return mineCard(x,by[x.id]||[])}).join('');
    rows.forEach(function(x){if((by[x.id]||[]).some(function(o){return o.created_at>x.owner_seen_at}))c.rpc('b49_mark_seen',{p_id:x.id})})})})}).catch(function(e){fail(e,'mine')})}
/* ---- لوحة النشاط: طلبات مفتوحة + عروضي ---- */
var BZ={biz:null,mine:{}};
function boardCard(r){var o=BZ.mine[r.id],f=o?o.v:null;return '<div class="b17c b15r"><div style="flex:1;min-width:0"><div class="b15h"><b>'+X(r.title)+'</b>'+(o?' <span class="bd '+(o.status==='sent'?'published':'rejected')+'">'+(o.status==='sent'?'عرضك مُرسل':'عرضك مسحوب')+'</span>':'')+'</div><small>'+X(TY[r.equipment_type])+' · '+X(r.province)+(r.area?'، '+X(r.area):'')+' · '+fd(r.created_at)+'</small>'
 +'<div>'+X([r.manufacturer,r.model,r.year,r.part_no].filter(Boolean).join(' · '))+'</div>'+(bud(r)?'<div>'+X(bud(r))+'</div>':'')+'<p style="white-space:pre-wrap;margin:6px 0">'+X(r.description)+'</p>'
 +'<details><summary>'+(o?'تعديل عرضي':'تقديم عرض')+'</summary><div data-rid="'+X(r.id)+'"><label>وصف العرض<textarea data-k="d" rows="3" maxlength="2000">'+X(o?o.description:'')+'</textarea></label><div class="b17r"><label>السعر (اختياري)<input data-k="p" type="number" min="0" step="any" value="'+(o&&o.price!=null?X(o.price):'')+'"></label><label>العملة<select data-k="c"><option'+(o&&o.currency==='IQD'?'':' selected')+'>USD</option><option'+(o&&o.currency==='IQD'?' selected':'')+'>IQD</option></select></label></div><label>التوفر أو المدة (اختياري)<input data-k="a" maxlength="120" value="'+X(o?o.availability||'':'')+'"></label><button class="btn btn-p" data-o49="save">'+(o?'حفظ التعديل':'إرسال العرض')+'</button>'+(o&&o.status==='sent'?' <button class="btn" data-o49="wd">سحب العرض</button>':'')+'</div></details></div></div>'}
function board(){var c=sbc();R().innerHTML='<h1>طلبات الشراء المتاحة للأنشطة</h1>'+nav('board')+'<div id="b49m" class="msg"></div><div id="b49l" class="b17n">جارٍ التحميل…</div>';if(!c)return;
 c.rpc('b49_is_biz').then(function(a){if(a.error)throw a.error;if(a.data!==true){E('b49l').className='';E('b49l').innerHTML='<div class="b17n">هذه اللوحة متاحة للأنشطة التجارية المعتمدة فقط. <a href="#business">سجّل نشاطك أو تابع حالة اعتماده</a>.</div>';return}
  var q=c.from('buyer_requests_board').select('*').order('created_at',{ascending:false}).limit(200);if(BQ.ty)q=q.eq('equipment_type',BQ.ty);if(BQ.pv)q=q.eq('province',BQ.pv);
  return Promise.all([q,c.from('buyer_request_offers').select('*').eq('user_id',AU.user.id).order('created_at',{ascending:false}).limit(300),c.from('biz_profiles').select('id').eq('owner_id',AU.user.id).maybeSingle()]).then(function(a){if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;if(a[2].error)throw a[2].error;BZ.biz=a[2].data&&a[2].data.id;BZ.mine={};a[1].data.forEach(function(o){BZ.mine[o.request_id]={status:o.status,description:o.description,price:o.price,currency:o.currency,availability:o.availability,id:o.id}});
   var s=BQ.q.toLowerCase(),rows=a[0].data.filter(function(r){return!s||[r.title,r.description,r.manufacturer,r.model,r.part_no].join(' ').toLowerCase().indexOf(s)>-1}),byId={};a[0].data.forEach(function(r){byId[r.id]=r});
   var sent=a[1].data.map(function(o){var r=byId[o.request_id];return '<div class="sel"><b>'+X(r?r.title:'طلب مغلق أو منتهٍ')+'</b> · '+(o.status==='sent'?'مُرسل':'مسحوب')+(o.price!=null?' · '+X(money(o.price,o.currency)):'')+'<br><small>'+fd(o.created_at)+(r?'':' · لم يعد الطلب يقبل عروضاً')+'</small></div>'}).join('');
   E('b49l').className='';E('b49l').innerHTML='<div class="b17r"><label>نوع المطلوب<select id="f-t">'+opts(TY,BQ.ty,'الكل')+'</select></label><label>المحافظة<select id="f-p">'+pvo(BQ.pv,'الكل')+'</select></label></div><input id="f-q" type="search" value="'+X(BQ.q)+'" placeholder="بحث في الطلبات" style="font:inherit;border:1px solid var(--line);border-radius:10px;padding:10px;width:100%;margin:6px 0 10px">'
    +(rows.length?rows.map(boardCard).join(''):'<div class="b17n">لا توجد طلبات مفتوحة مطابقة.</div>')+'<h3 style="margin-top:14px">العروض التي أرسلتها ('+a[1].data.length+')</h3>'+(sent||'<div class="b17n">لم ترسل عروضاً بعد.</div>');
   E('f-t').onchange=function(){BQ.ty=this.value;board()};E('f-p').onchange=function(){BQ.pv=this.value;board()};var t;E('f-q').oninput=function(){var v=this.value;clearTimeout(t);t=setTimeout(function(){BQ.q=v.trim();board()},350)}})}).catch(function(e){fail(e,'board')})}
document.addEventListener('click',function(e){var b,c=sbc();
 if(b=e.target.closest('[data-r49]')){B49.page(b.dataset.r49==='board'?'buyboard':'buymine');return}
 if(b=e.target.closest('[data-x49]')){if(!confirm('إغلاق هذا الطلب؟ لن يستقبل عروضاً جديدة ولا يمكن إعادة فتحه.'))return;b.disabled=true;c.from('buyer_requests').update({status:'closed'}).eq('id',b.dataset.x49).eq('user_id',AU.user.id).select('id').then(function(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('forbidden');toast('تم إغلاق الطلب.');mine()}).catch(function(x){b.disabled=false;toast(emsg(x))});return}
 if(b=e.target.closest('[data-o49]')){if(busy)return;var w=b.closest('[data-rid]'),rid=w.dataset.rid,v=function(k){return w.querySelector('[data-k="'+k+'"]').value.trim()},ex=BZ.mine[rid],act=b.dataset.o49,q;
  if(act==='save'){var pr=v('p')===''?null:Number(v('p'));if(v('d').length<5||(pr!==null&&!(pr>=0))){say('err',v('d').length<5?'اكتب وصف العرض (5 أحرف على الأقل).':'السعر غير صحيح.');return}
   var row={description:v('d'),price:pr,currency:pr===null?null:v('c'),availability:v('a')||null,status:'sent'};q=ex?c.from('buyer_request_offers').update(row).eq('id',ex.id):c.from('buyer_request_offers').insert(Object.assign({request_id:rid,biz_id:BZ.biz},row))}
  else q=c.from('buyer_request_offers').update({status:'withdrawn'}).eq('id',ex.id);
  busy=true;b.disabled=true;q.select('id').then(function(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('forbidden');toast(act==='wd'?'تم سحب العرض.':'تم حفظ العرض.');board()}).catch(function(x){say('err',emsg(x));b.disabled=false}).then(function(){busy=false})}});
B49.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b49')});document.title='بحر | طلبات الشراء';if(!sbc()){R().innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}
 if(k==='buynew')form();else if(k==='buyboard')board();else mine()};
})();

/* ===== B62: مركز طلبات الشراء والعروض ومطابقة الاحتياجات (b62_buyer_requests_hub.sql). يوسّع جداول B49 ولا ينشئ نظاماً موازياً.
   الصفحات: #buyhub عامة، #buy-<id> تفاصيل، #buynew نموذج، #buymine لوحة صاحب الطلب، #buyboard لوحة النشاط، #admbuy الإدارة.
   كل الصلاحيات تفرضها RLS والدوال في الخادم؛ الواجهة لا تُظهر نجاحاً قبل رد الخادم. ===== */
var B62={};
(function(){
var PV=['البصرة','بغداد','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var TY={boat:'قارب',jetski:'جت سكي',engine:'محرك بحري',part:'قطعة غيار',accessory:'إكسسوار أو معدة بحرية',service:'خدمة أو صيانة بحرية'};
var CO={new:'جديد',used:'مستعمل',any:'جديد أو مستعمل'},NW={urgent:'عاجل',week:'خلال أسبوع',month:'خلال شهر',flexible:'مرن'},CP={chat:'محادثة داخل بحر',phone:'اتصال هاتفي',whatsapp:'واتساب'};
var OS={new:'جديد',seen:'تمت مشاهدته',discussing:'قيد المناقشة',selected:'مقبول للمتابعة',declined:'مرفوض'};
var RR={spam:'إعلان مزعج أو مكرر',abuse:'محتوى مسيء',fraud:'احتيال أو عرض مشبوه',privacy:'نشر معلومات شخصية',duplicate:'طلب مكرر',other:'سبب آخر'};
var PM={confirmed:['مطابقة مؤكدة لرقم القطعة','published'],possible:['نتائج محتملة تحتاج تأكيداً','pending'],none:['لا يوجد تطابق في الكتالوج','rejected'],unchecked:['لم تُفحص مطابقة القطعة','']};
/* أنواع الأنشطة التي تناسب كل نوع طلب (قيم business_type الموجودة في B21). الاقتراح فقط؛ يمكن للنشاط عرض كل الطلبات */
var BM={boat:['boat_engine_dealer'],jetski:['jetski_dealer'],engine:['boat_engine_dealer','jetski_dealer'],part:['parts_store','wholesale_supplier','boat_engine_dealer','jetski_dealer'],accessory:['parts_store','wholesale_supplier','boat_engine_dealer'],service:['workshop','technician']};
var X=PF.esc,R=function(){return E('b62c')},PS=20,busy=false,MAXP=4,MAXB=5242880;
var H={q:'',ty:'',pv:'',so:'new',rows:[],page:0,more:false,tot:0},ST={ty:'',pv:'',q:'',so:'new',fit:true,tab:'open',page:0,rows:[],more:false,biz:null,bt:null,mine:{}},MN={page:0,rows:[],more:false};
var AD={tab:'req',q:'',ty:'',pv:'',st:'',f:'',t:'',off:0,rows:[],more:false};
var MISSING=/42P01|PGRST205|PGRST202|42883|42703|PGRST204/;
function say(t,x){var m=E('b62m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function emsg(e){var c=String(e&&e.code||''),m=String(e&&e.message||e||'');
 if(MISSING.test(c))return 'نظام B62 غير مفعّل على الخادم بعد (يلزم تشغيل b62_buyer_requests_hub.sql).';
 if(e&&e.pfMsg)return e.pfMsg;
 if(c==='23505'){return /b62_rep_once/.test(m)?'أرسلت بلاغاً عن هذا العنصر من قبل.':'لديك عرض مسجّل على هذا الطلب بالفعل. عدّله بدل إرسال عرض جديد.'}
 if(/rate_limit/.test(m))return 'وصلت للحد اليومي من الطلبات. حاول غداً.';
 if(/request_closed/.test(m))return 'الطلب مغلق أو منتهٍ أو مخفي ولا يقبل هذا الإجراء.';
 if(/request_hidden/.test(m))return 'هذا الطلب مخفي من الإدارة ولا يمكن تعديله.';
 if(/offer_locked/.test(m))return 'هذا العرض اختاره صاحب الطلب للمتابعة ولا يمكن تعديل محتواه. يمكنك سحبه أو مراسلته.';
 if(/own_request/.test(m))return 'لا يمكنك تقديم عرض على طلبك.';
 if(/own_report/.test(m))return 'لا يمكنك الإبلاغ عن طلبك أو عرضك.';
 if(/reason_required/.test(m))return 'اكتب سبباً واضحاً (3 أحرف على الأقل).';
 if(/invalid_input/.test(m))return 'البيانات غير صالحة: العنوان 4 أحرف والوصف 10 أحرف على الأقل.';
 if(/bad_transition/.test(m))return 'لا يمكن تغيير الحالة بهذه الطريقة.';
 if(/forbidden|row-level|42501|policy/i.test(m+c))return 'لا تملك صلاحية تنفيذ هذا الإجراء (قد يكون نشاطك غير معتمد).';
 if(/jwt|expired/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة.';
 return 'حدث خطأ: '+m.slice(0,120)}
function fd(x){try{return new Date(x).toLocaleDateString('ar-IQ',{dateStyle:'medium'})}catch(e){return''}}
function money(n,c){return Number(n).toLocaleString('en-US')+' '+(c||'')}
function bud(r){if(r.budget_min==null&&r.budget_max==null)return'';var a=r.budget_min!=null?money(r.budget_min,r.currency):'',b=r.budget_max!=null?money(r.budget_max,r.currency):'';return 'الميزانية: '+(a&&b?a+' – '+b:a?'من '+a:'حتى '+b)}
function ref(id){return String(id).slice(0,8).toUpperCase()}
function opts(o,v,ph){return(ph?'<option value="">'+ph+'</option>':'')+Object.keys(o).map(function(k){return '<option value="'+X(k)+'"'+(k===v?' selected':'')+'>'+X(o[k])+'</option>'}).join('')}
function pvo(v,ph){var o={};PV.forEach(function(p){o[p]=p});return opts(o,v,ph)}
function fld(id,l,t,x){return '<label>'+l+'<input id="'+id+'" type="'+t+'" '+(x||'')+'></label>'}
function uuid(){return crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(k){var r=Math.random()*16|0;return(k==='x'?r:r&3|8).toString(16)})}
function num(v){v=String(v||'').trim().replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632});return v===''?null:Number(v)}
function lk(s){return String(s||'').replace(/[%,()*\\_]/g,' ').trim().slice(0,60)}
function fail(e,fn){R().innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div><p><button class="btn btn-p" type="button" data-b62="retry" data-fn="'+fn+'">إعادة المحاولة</button></p>'}
function nav(a,biz){return '<p class="b15h"><a class="btn'+(a==='hub'?' btn-p':'')+'" href="#buyhub">الطلبات العامة</a><a class="btn'+(a==='new'?' btn-p':'')+'" href="#buynew">+ أضف طلباً</a><a class="btn'+(a==='mine'?' btn-p':'')+'" href="#buymine">طلباتي</a><a class="btn'+(a==='board'?' btn-p':'')+'" href="#buyboard">لوحة الأنشطة</a></p>'}
function needLogin(msg){NEXT=msg;try{B22.setRet(location.hash)}catch(x){}location.hash='#login'}
/* حالة الطلب لصاحبه (مشتقة من الأعمدة الفعلية، لا من نص ثابت) */
function reqState(r,offs){if(r.hidden_at)return['مخفي من الإدارة','rejected'];if(r.status==='closed')return[r.close_reason==='found'?'تم العثور على المطلوب':r.close_reason==='cancelled'?'ملغي':'مغلق',r.close_reason==='found'?'published':'rejected'];if(new Date(r.expires_at)<=new Date())return['منتهي الصلاحية','rejected'];
 var l=(offs||[]).filter(function(o){return o.status==='sent'});if(l.some(function(o){return o.owner_state==='selected'||o.owner_state==='discussing'}))return['قيد التفاوض','in_progress'];return[l.length?'يستقبل عروضاً':'منشور','pending']}
function isOpen(r){return r.status==='open'&&!r.hidden_at&&new Date(r.expires_at)>new Date()}
function offState(o){if(o.status==='withdrawn')return['مسحوب','rejected'];if(o.valid_until&&new Date(o.valid_until)<=new Date()&&o.owner_state!=='selected')return['منتهي الصلاحية','rejected'];var m={new:'pending',seen:'pending',discussing:'in_progress',selected:'published',declined:'rejected'};return[OS[o.owner_state]||'جديد',m[o.owner_state]||'pending']}
function signed(paths){var c=sbc(),bk=c.storage.from('request-images');return Promise.all((paths||[]).map(function(p){return bk.createSignedUrl(p,3600).then(function(r){return r.error?'':r.data.signedUrl}).catch(function(){return''})}))}
function gal(urls){if(!urls.length)return'';return '<div class="b15h" style="margin:8px 0">'+urls.map(function(u){return u?'<a href="'+X(u)+'" target="_blank" rel="noopener"><img src="'+X(u)+'" alt="صورة مرفقة" style="width:96px;height:96px;object-fit:cover;border-radius:10px;border:1px solid var(--line)"></a>':'<span class="bd">تعذّر عرض الصورة</span>'}).join('')+'</div>'}
function card(r,extra){return '<a class="b17c b15r" href="#buy-'+X(r.id)+'" style="display:block;text-decoration:none;color:inherit"><div class="b15h"><b>'+X(r.title)+'</b>'+(extra||'')+'</div><small>'+X(TY[r.equipment_type]||'')+' · '+X(r.province)+(r.area?'، '+X(r.area):'')+' · '+fd(r.created_at)+(r.condition?' · '+X(CO[r.condition]||''):'')+(r.needed_within?' · '+X(NW[r.needed_within]||''):'')+'</small>'
 +(bud(r)?'<div>'+X(bud(r))+'</div>':'')+'<div style="margin:4px 0;color:var(--mut,#556)">'+X(String(r.description||'').slice(0,160))+(String(r.description||'').length>160?'…':'')+'</div><small>'+(r.offers_count!=null?'عدد العروض: '+r.offers_count+' · ':'')+'عرض التفاصيل ›</small></a>'}
function pager(more,key){return more?'<p style="text-align:center"><button class="btn" type="button" data-b62="more" data-k="'+key+'">تحميل المزيد</button></p>':''}

/* ================= الصفحة العامة ================= */
function hub(reset){var c=sbc();if(reset!==false){H.rows=[];H.page=0}
 R().innerHTML='<h1>اطلب اللي تحتاجه</h1>'+nav('hub')+'<p class="b17n">طلبات شراء منشورة من مستخدمين يبحثون عن قوارب وجت سكي ومحركات وقطع وخدمات بحرية. الأنشطة المعتمدة تقدّم عروضها هنا. لا تُعرض أسماء أصحاب الطلبات ولا بيانات تواصلهم.</p>'
 +'<div class="b17r"><label>نوع المطلوب<select id="h-t">'+opts(TY,H.ty,'الكل')+'</select></label><label>المحافظة<select id="h-p">'+pvo(H.pv,'الكل')+'</select></label><label>الترتيب<select id="h-s"><option value="new"'+(H.so==='new'?' selected':'')+'>الأحدث</option><option value="offers"'+(H.so==='offers'?' selected':'')+'>الأكثر عروضاً</option></select></label></div>'
 +'<input id="h-q" type="search" value="'+X(H.q)+'" placeholder="ابحث في الطلبات" style="font:inherit;border:1px solid var(--line);border-radius:10px;padding:10px;width:100%;margin:6px 0 10px;min-height:44px"><div id="b62m" class="msg" role="alert"></div><div id="b62l" class="b17n">جارٍ التحميل…</div>';
 E('h-t').onchange=function(){H.ty=this.value;hub()};E('h-p').onchange=function(){H.pv=this.value;hub()};E('h-s').onchange=function(){H.so=this.value;hub()};var t;E('h-q').oninput=function(){var v=this.value;clearTimeout(t);t=setTimeout(function(){H.q=v.trim();hub()},400)};
 if(!c){E('b62l').textContent='الاتصال بالخدمة غير جاهز.';return}hubLoad()}
function hubLoad(){var c=sbc(),from=H.page*PS,q=c.from('buyer_requests_public').select('*',{count:'exact'});if(H.ty)q=q.eq('equipment_type',H.ty);if(H.pv)q=q.eq('province',H.pv);var s=lk(H.q);if(s)q=q.or('title.ilike.%'+s+'%,description.ilike.%'+s+'%');
 q=H.so==='offers'?q.order('offers_count',{ascending:false}).order('created_at',{ascending:false}):q.order('created_at',{ascending:false});
 q.range(from,from+PS-1).then(function(r){if(r.error)throw r.error;H.rows=H.rows.concat(r.data||[]);H.tot=r.count||0;H.more=H.rows.length<H.tot;var l=E('b62l');if(!l)return;l.className='';
  l.innerHTML=(H.rows.length?'<p class="b17n">'+H.tot+' طلب</p>'+H.rows.map(function(x){return card(x)}).join(''):'<div class="b17n">لا توجد طلبات مطابقة حالياً. <a href="#buynew">أضف طلبك</a>.</div>')+pager(H.more,'hub')}).catch(function(e){var l=E('b62l');if(l){l.className='';l.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div><p><button class="btn btn-p" data-b62="retry" data-fn="hub">إعادة المحاولة</button></p>'}})}

/* ================= نموذج الطلب + المطابقة + المراجعة ================= */
var F={files:[],data:null,match:null};
function form(pre){var c=sbc();F={files:pre?F.files:[],data:null,match:null};
 R().innerHTML='<h1>أضف طلب شراء</h1>'+nav('new')+'<p class="b17n">صِف ما تبحث عنه ليصلك عروض من الأنشطة المعتمدة. الحقول الاختيارية يمكن تركها فارغة. <b>لا تكتب رقم هاتفك أو بريدك في العنوان أو الوصف</b> لأنهما يظهران للعامة؛ التواصل يتم عبر محادثات بحر.</p><div id="b62m" class="msg" role="alert"></div><form id="b62f" novalidate>'
 +'<label>نوع المطلوب<select id="q-t">'+opts(TY,'','اختر النوع')+'</select></label>'+fld('q-ti','عنوان الطلب','text','maxlength="120" placeholder="مثال: أبحث عن جت سكي سي دو 2018"')
 +'<div class="b17r" id="q-mm">'+fld('q-m','الشركة المصنّعة (اختياري)','text','maxlength="80"')+fld('q-mo','الموديل (اختياري)','text','maxlength="80"')+'</div>'
 +'<div class="b17r"><span id="q-yw">'+fld('q-y','سنة الصنع (اختياري)','number','min="1950" inputmode="numeric"')+'</span><span id="q-pw">'+fld('q-p','رقم القطعة أو الرقم التسلسلي (اختياري)','text','maxlength="80" dir="ltr"')+'</span></div>'
 +'<div id="q-pm" class="b17n" aria-live="polite"></div>'
 +'<label id="q-cw">الحالة المطلوبة<select id="q-c">'+opts(CO,'any')+'</select></label>'
 +'<div class="b17r">'+fld('q-b1','الميزانية من (اختياري)','number','min="0" step="any" inputmode="decimal"')+fld('q-b2','إلى (اختياري)','number','min="0" step="any" inputmode="decimal"')+'</div>'
 +'<div class="b17r"><label>العملة<select id="q-cu"><option>USD</option><option>IQD</option></select></label><label style="display:flex;gap:6px;align-items:center"><input id="q-sb" type="checkbox"> أظهر الميزانية للعامة</label></div>'
 +'<div class="b17r"><label>المحافظة<select id="q-pv">'+pvo('البصرة','اختر المحافظة')+'</select></label>'+fld('q-a','المنطقة (اختياري)','text','maxlength="80"')+'</div>'
 +'<label>الوصف التفصيلي<textarea id="q-d" rows="5" maxlength="3000"></textarea></label>'
 +'<div class="b17r"><label>متى تحتاجه؟<select id="q-nw">'+opts(NW,'flexible')+'</select></label><label>طريقة التواصل المفضلة<select id="q-cp">'+opts(CP,'chat')+'</select></label></div>'
 +'<label>صور مرفقة (حتى '+MAXP+'، JPG أو PNG أو WEBP، 5 ميغابايت لكل صورة)<input id="q-f" type="file" accept="image/jpeg,image/png,image/webp" multiple></label><div id="q-fl" class="b15h"></div><p class="b17n" style="margin-top:-6px">الصور لا تظهر للعامة؛ تظهر لك وللأنشطة المعتمدة وللإدارة فقط.</p>'
 +'<label>مدة صلاحية الطلب<select id="q-ex"><option value="7">7 أيام</option><option value="14">14 يوماً</option><option value="30" selected>30 يوماً</option><option value="60">60 يوماً</option></select></label>'
 +'<button class="btn btn-p" id="b62b" type="submit">مراجعة الطلب قبل النشر</button></form>';
 var t=E('q-t'),sync=function(){var v=t.value,eq=/^(boat|jetski|engine|part|accessory)$/.test(v);E('q-mm').hidden=!eq;E('q-yw').hidden=!/^(boat|jetski|engine|part)$/.test(v);E('q-pw').hidden=!/^(part|engine)$/.test(v);E('q-cw').hidden=v==='service';E('q-pm').textContent='';F.match=null};sync();t.addEventListener('change',sync);
 E('q-p').addEventListener('change',function(){if(E('q-t').value==='part')partCheck()});
 E('q-f').addEventListener('change',function(){var l=[].slice.call(this.files),bad='';var ok=[];
  l.forEach(function(f){var m=PF.files.check(f,{max:MAXB});if(m)bad=m;else if(F.files.length+ok.length<MAXP)ok.push(f);else bad='الحد الأقصى '+MAXP+' صور.'});
  this.value='';Promise.all(ok.map(function(f){return PF.files.sniff(f).then(function(g){return g?f:null})})).then(function(a){a.forEach(function(f){if(f)F.files.push(f);else bad='محتوى أحد الملفات لا يطابق نوعه.'});paintFiles();say(bad?'err':'',bad)})});
 E('b62f').addEventListener('submit',review);paintFiles();if(pre){var M={'q-t':'equipment_type','q-ti':'title','q-m':'manufacturer','q-mo':'model','q-y':'year','q-p':'part_no','q-c':'condition','q-b1':'budget_min','q-b2':'budget_max','q-cu':'currency','q-pv':'province','q-a':'area','q-d':'description','q-nw':'needed_within','q-cp':'contact_pref'};Object.keys(M).forEach(function(i){var v=pre[M[i]];if(v!==null&&v!==undefined&&E(i))E(i).value=v});E('q-sb').checked=!!pre.show_budget;E('q-ex').value=String(pre.days||30);t.dispatchEvent(new Event('change'));if(pre.part_no&&pre.equipment_type==='part')partCheck()}}
function paintFiles(){var l=E('q-fl');if(!l)return;l.innerHTML=F.files.map(function(f,i){return '<span class="bd">'+X(f.name.slice(0,24))+' <button type="button" data-b62="rmf" data-i="'+i+'" aria-label="حذف الصورة" style="border:0;background:none;cursor:pointer;min-width:24px">✕</button></span>'}).join('')}
/* مطابقة رقم القطعة مع كتالوج BAHR PARTS: لا اختراع توافق؛ المطابقة لرقم القطعة فقط */
function partCheck(){var pn=E('q-p').value.trim(),box=E('q-pm'),c=sbc();F.match=null;if(!pn||pn.length<3){box.textContent='';return Promise.resolve()}
 box.textContent='جارٍ البحث في الكتالوج…';var k=lk(pn);
 return c.from('parts_items').select('id,name,part_number,parts_manufacturers(name)').eq('status','published').or('part_number.ilike.%'+k+'%,name.ilike.%'+k+'%').limit(15).then(function(r){if(r.error)throw r.error;var rows=r.data||[],norm=function(s){return String(s||'').replace(/[\s-]/g,'').toUpperCase()},ex=rows.filter(function(x){return norm(x.part_number)===norm(pn)});
  var m=ex.length===1?{k:'confirmed',id:ex[0].id,rows:ex}:(ex.length>1||rows.length)?{k:'possible',id:null,rows:(ex.length?ex:rows).slice(0,5)}:{k:'none',id:null,rows:[]};F.match=m;
  box.innerHTML='<span class="bd '+PM[m.k][1]+'">'+PM[m.k][0]+'</span> '+(m.rows.length?'<ul style="margin:6px 0">'+m.rows.map(function(x){return '<li><a href="#part-'+X(x.id)+'" target="_blank" rel="noopener">'+X(x.name)+'</a> · <span dir="ltr">'+X(x.part_number)+'</span>'+(x.parts_manufacturers&&x.parts_manufacturers.name?' · '+X(x.parts_manufacturers.name):'')+'</li>'}).join('')+'</ul>':'')
   +'<small>'+(m.k==='confirmed'?'تطابق رقم القطعة مع سجل في الكتالوج. هذا لا يعني أنها مناسبة لمعدتك؛ التوافق مع قاربك أو محركك لم يُحسم.':m.k==='possible'?'هذه نتائج تشابه في الرقم أو الاسم وليست دليلاً على التوافق. تأكد قبل الاعتماد عليها.':'لا يوجد سجل مطابق. يمكنك إرسال الطلب وسيُذكر أن التوافق لم يُحسم.')+'</small>'}).catch(function(e){F.match=null;box.innerHTML='<small>تعذّر فحص الكتالوج الآن ('+X(emsg(e))+'). يمكنك إرسال الطلب؛ ستُسجَّل المطابقة «غير مفحوصة».</small>'})}
function collect(){var g=function(i){var x=E(i);return x&&!x.closest('[hidden]')?x.value.trim():''},y=new Date().getFullYear()+1;
 var p={title:g('q-ti'),equipment_type:g('q-t'),manufacturer:g('q-m')||null,model:g('q-mo')||null,year:num(g('q-y')),part_no:g('q-p')||null,condition:g('q-c')||null,budget_min:num(g('q-b1')),budget_max:num(g('q-b2')),currency:null,show_budget:E('q-sb').checked,province:g('q-pv'),area:g('q-a')||null,description:g('q-d'),needed_within:g('q-nw')||null,contact_pref:g('q-cp')||null,days:Number(g('q-ex')||30)};
 var v=!TY[p.equipment_type]?'اختر نوع المطلوب.':p.title.length<4?'اكتب عنوان الطلب (4 أحرف على الأقل).':p.description.length<10?'اكتب وصفاً من 10 أحرف على الأقل.':!p.province?'اختر المحافظة.':(p.year!==null&&!(p.year>=1950&&p.year<=y))?'السنة غير صحيحة.':((p.budget_min!==null&&!(p.budget_min>=0))||(p.budget_max!==null&&!(p.budget_max>=0)))?'الميزانية غير صحيحة.':(p.budget_min!==null&&p.budget_max!==null&&p.budget_max<p.budget_min)?'الحد الأعلى للميزانية أقل من الأدنى.':'';
 if(p.budget_min!==null||p.budget_max!==null)p.currency=g('q-cu');else p.show_budget=false;return{p:p,err:v}}
function review(e){e.preventDefault();var o=collect();if(o.err){say('err',o.err);return}var p=o.p;say('','');
 var run=p.equipment_type==='part'&&p.part_no&&!F.match?partCheck():Promise.resolve();
 run.then(function(){var pm=F.match?F.match.k:'unchecked',phone=/(\+?\d[\d\s-]{7,}\d)/.test(p.title+' '+p.description);F.data=p;
  R().innerHTML='<h1>راجع طلبك قبل النشر</h1>'+nav('new')+'<div id="b62m" class="msg" role="alert"></div><div class="b17c b15r"><div class="b15h"><b>'+X(p.title)+'</b> <span class="bd pending">منشور بعد التأكيد</span></div><small>'+X(TY[p.equipment_type])+' · '+X(p.province)+(p.area?'، '+X(p.area):'')+'</small>'
   +'<ul style="margin:8px 0;padding-inline-start:18px">'+[['الشركة',p.manufacturer],['الموديل',p.model],['السنة',p.year],['رقم القطعة',p.part_no],['الحالة المطلوبة',p.condition?CO[p.condition]:''],['الحاجة',NW[p.needed_within]],['التواصل المفضّل',CP[p.contact_pref]],['الميزانية',bud(p)?bud(p).replace('الميزانية: ','')+(p.show_budget?' (ظاهرة للعامة)':' (مخفية عن العامة)'):''],['الصور',F.files.length?F.files.length+' (لا تظهر للعامة)':''],['صلاحية الطلب',p.days+' يوماً']].filter(function(x){return x[1]!==''&&x[1]!=null&&x[1]!==undefined}).map(function(x){return '<li>'+x[0]+': '+X(x[1])+'</li>'}).join('')+'</ul>'
   +(p.part_no?'<p><span class="bd '+PM[pm][1]+'">'+PM[pm][0]+'</span> <small>'+(pm==='confirmed'?'التوافق مع معداتك لم يُحسم.':pm==='possible'?'ليست دليل توافق.':'سيُذكر أن التوافق لم يُحسم.')+'</small></p>':'')
   +'<p style="white-space:pre-wrap">'+X(p.description)+'</p>'+(phone?'<div class="msg err" style="display:block">يبدو أن النص يحتوي رقماً يشبه رقم هاتف. سيظهر للعامة. عدّل الطلب لإزالته أو تابع إن كنت متأكداً.</div>':'')
   +'<div class="b15h"><button class="btn btn-p" type="button" data-b62="publish">نشر الطلب</button><button class="btn" type="button" data-b62="back">تعديل</button></div></div>'})}
function publish(b){if(busy||!F.data)return;var c=sbc(),p=F.data;if(!c||!AU.user){say('err','تعذّر الاتصال بالخدمة أو انتهت الجلسة.');return}
 busy=true;b.disabled=true;b.textContent='جارٍ النشر…';say('in','جارٍ الحفظ…');var id=uuid(),uid=AU.user.id,bk=c.storage.from('request-images'),paths=[];
 var undo=function(){if(paths.length)bk.remove(paths)};
 F.files.reduce(function(ch,f,i){return ch.then(function(){return B17.comp(f).then(function(bl){var pth=uid+'/b62r/'+id+'/'+i+'.jpg';return bk.upload(pth,bl,{contentType:'image/jpeg',upsert:false}).then(function(r){if(r.error)throw r.error;paths.push(pth)})})})},Promise.resolve())
 .then(function(){var row={id:id,title:p.title,equipment_type:p.equipment_type,manufacturer:p.manufacturer,model:p.model,year:p.year,part_no:p.part_no,condition:p.condition,budget_min:p.budget_min,budget_max:p.budget_max,currency:p.currency,show_budget:p.show_budget,province:p.province,area:p.area,description:p.description,needed_within:p.needed_within,contact_pref:p.contact_pref,photos:paths,part_match:p.part_no&&F.match?F.match.k:(p.part_no?'unchecked':'unchecked'),part_id:F.match&&F.match.k==='confirmed'?F.match.id:null,expires_at:new Date(Date.now()+p.days*864e5).toISOString()};
  return c.from('buyer_requests').insert(row).select('id').then(function(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('forbidden')})})
 .then(function(){toast('تم نشر طلبك.');location.hash='#buy-'+id}).catch(function(x){undo();say('err',emsg(x)+' لم يُحفظ الطلب.');b.disabled=false;b.textContent='نشر الطلب'}).then(function(){busy=false})}

/* ================= تفاصيل الطلب ================= */
var D={r:null,mode:'',offs:[],names:{},mine:null,biz:null};
function detail(id){var c=sbc();R().innerHTML='<p><a class="btn" href="#buyhub">‹ الطلبات</a></p><div id="b62m" class="msg" role="alert"></div><div id="b62d" class="b17n">جارٍ التحميل…</div>';if(!c)return;
 D={r:null,mode:'',offs:[],names:{},mine:null,biz:null};
 (AU.user?c.from('buyer_requests').select('*').eq('id',id).maybeSingle():Promise.resolve({data:null})).then(function(a){if(a.error&&!MISSING.test(String(a.error.code)))throw a.error;
  if(a.data){D.r=a.data;D.mode=AU.user&&a.data.user_id===AU.user.id?'owner':'other';return}
  return c.from('buyer_requests_public').select('*').eq('id',id).maybeSingle().then(function(b){if(b.error)throw b.error;D.r=b.data;D.mode='public'})})
 .then(function(){var r=D.r;if(!r){E('b62d').className='';E('b62d').innerHTML='هذا الطلب غير موجود أو لم يعد متاحاً للعرض.';return}
  if(D.mode==='owner')return ownerLoad(c,r);if(AU.user)return bizLoad(c,r)}).then(function(){if(D.r)paintDetail()}).catch(function(e){var d=E('b62d');if(d){d.className='';d.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div><p><button class="btn btn-p" data-b62="retry" data-fn="detail" data-id="'+X(id)+'">إعادة المحاولة</button></p>'}})}
function ownerLoad(c,r){return c.from('buyer_request_offers').select('*').eq('request_id',r.id).order('created_at',{ascending:false}).then(function(o){if(o.error)throw o.error;D.offs=o.data||[];var ids=[];D.offs.forEach(function(x){if(ids.indexOf(x.biz_id)<0)ids.push(x.biz_id)});
  return(ids.length?c.from('biz_public').select('id,name,owner_id').in('id',ids):Promise.resolve({data:[]})).then(function(p){(p.data||[]).forEach(function(b){D.names[b.id]={n:b.name,o:b.owner_id}});
   if(D.offs.some(function(x){return x.owner_state==='new'&&x.status==='sent'}))c.rpc('b62_mark_offers_seen',{p_req:r.id}).then(function(){});c.rpc('b49_mark_seen',{p_id:r.id}).then(function(){})})})}
function bizLoad(c,r){return Promise.all([c.rpc('b49_is_biz'),c.from('biz_profiles').select('id,business_type').eq('owner_id',AU.user.id).maybeSingle(),c.from('buyer_request_offers').select('*').eq('request_id',r.id).eq('user_id',AU.user.id).maybeSingle()]).then(function(a){D.biz=a[0].data===true?(a[1].data||null):null;D.isBiz=a[0].data===true;D.mine=a[2].data||null})}
function offerHtml(o){var s=offState(o),nm=D.names[o.biz_id]||{},open=isOpen(D.r),live=o.status==='sent',pending=o.owner_state;
 return '<div class="sel" data-oid="'+X(o.id)+'"><div class="b15h"><b>'+X(nm.n||'نشاط معتمد')+'</b> <span class="bd '+s[1]+'">'+X(s[0])+'</span>'+(o.price!=null?'<span>'+X(money(o.price,o.currency))+'</span>':'')+'</div>'
 +'<div style="white-space:pre-wrap;margin:4px 0">'+X(o.description)+'</div><small>'+[o.condition?CO[o.condition]:'',o.availability,o.lead_time?'التجهيز: '+o.lead_time:'',o.warranty?'الضمان: '+o.warranty:'',o.valid_until?'صالح حتى '+fd(o.valid_until):'',fd(o.created_at)].filter(Boolean).map(X).join(' · ')+'</small>'+(o.note?'<div><small>ملاحظات: '+X(o.note)+'</small></div>':'')+'<div class="b62g" data-p="'+X((o.photos||[]).join('|'))+'"></div>'
 +(live&&open?'<div class="b15h" style="margin-top:6px">'+(o.owner_state!=='selected'?'<button class="btn btn-p" data-b62="os" data-s="selected" data-id="'+X(o.id)+'">متابعة هذا العرض</button>':'<span class="bd published">اخترت متابعته (تفاهم مبدئي — لا يعني إتمام البيع)</span>')+(o.owner_state!=='discussing'&&o.owner_state!=='selected'?'<button class="btn" data-b62="os" data-s="discussing" data-id="'+X(o.id)+'">قيد المناقشة</button>':'')+(o.owner_state!=='declined'?'<button class="btn" data-b62="os" data-s="declined" data-id="'+X(o.id)+'">رفض</button>':'')+'</div>':'')
 +'<div class="b15h" style="margin-top:6px">'+(nm.o&&live?'<button class="btn" type="button" data-cn="business|'+X(o.biz_id)+'|'+X(nm.o)+'">مراسلة النشاط</button>':'')+'<button class="btn" data-b62="rep" data-oid="'+X(o.id)+'">الإبلاغ عن العرض</button></div></div>'}
function reportForm(oid){return '<div class="sel" data-rf="'+X(oid||'')+'"><label>سبب البلاغ<select data-k="rs">'+opts(RR,'')+'</select></label><label>تفاصيل (اختياري)<textarea data-k="rd" rows="2" maxlength="1000"></textarea></label><div class="b15h"><button class="btn btn-p" data-b62="sendrep">إرسال البلاغ</button><button class="btn" data-b62="cancelrep">إلغاء</button></div></div>'}
function paintDetail(){var r=D.r,d=E('b62d'),open=D.mode==='public'?true:isOpen(r),own=D.mode==='owner',st=own?reqState(r,D.offs):['منشور','pending'];d.className='';
 var h='<div class="b17c b15r"><div class="b15h"><h1 style="margin:0;font-size:1.3em">'+X(r.title)+'</h1><span class="bd '+st[1]+'">'+X(st[0])+'</span></div><small>رقم الطلب: <span dir="ltr">'+ref(r.id)+'</span> · '+X(TY[r.equipment_type]||'')+' · '+X(r.province)+(r.area?'، '+X(r.area):'')+' · نُشر '+fd(r.created_at)+(r.expires_at?' · ينتهي '+fd(r.expires_at):'')+'</small>'
  +(r.hidden_at&&own?'<div class="msg err" style="display:block">أخفت الإدارة هذا الطلب. السبب: '+X(r.hidden_reason||'غير مذكور')+'</div>':'')
  +'<ul style="margin:8px 0;padding-inline-start:18px">'+[['الشركة',r.manufacturer],['الموديل',r.model],['السنة',r.year],['رقم القطعة',r.part_no],['الحالة المطلوبة',r.condition?CO[r.condition]:''],['الحاجة',r.needed_within?NW[r.needed_within]:''],['التواصل المفضّل',own&&r.contact_pref?CP[r.contact_pref]:''],['الميزانية',bud(r)?bud(r).replace('الميزانية: ',''):'']].filter(function(x){return x[1]}).map(function(x){return '<li>'+x[0]+': '+X(x[1])+'</li>'}).join('')+'</ul>'
  +(r.part_no?'<p><span class="bd '+(PM[r.part_match]||PM.unchecked)[1]+'">'+(PM[r.part_match]||PM.unchecked)[0]+'</span> <small>'+(r.part_match==='confirmed'&&r.part_id?'<a href="#part-'+X(r.part_id)+'">عرض القطعة في الكتالوج</a> · ':'')+'التوافق مع المعدة لم يُحسم.</small></p>':'')
  +'<p style="white-space:pre-wrap">'+X(r.description)+'</p><div class="b62g" data-p="'+X(((D.mode!=='public'&&r.photos)||[]).join('|'))+'"></div>'
  +(D.mode==='public'||D.mode==='other'?'<p><small>عدد العروض: '+(r.offers_count!=null?r.offers_count:'—')+'</small></p>':'')+'</div>';
 if(own){h+='<div class="b15h" style="margin:10px 0">'+(isOpen(r)?'<button class="btn" data-b62="edit">تعديل الطلب</button><button class="btn" data-b62="close" data-w="found">وجدت المطلوب</button><button class="btn" data-b62="close" data-w="cancelled">إلغاء الطلب</button>':'')+'<a class="btn" href="#buymine">طلباتي</a></div><div id="b62e"></div>'
  +'<h2>العروض ('+D.offs.filter(function(o){return o.status==='sent'}).length+')</h2>'+(D.offs.length?D.offs.map(offerHtml).join(''):'<p class="b17n">لا توجد عروض بعد. ستظهر هنا العروض الفعلية من الأنشطة المعتمدة فقط.</p>')+'<p class="b17n">اختيار عرض يعني متابعة التفاهم فقط. لا يتم دفع ولا عمولة داخل بحر، وتتحمل مسؤولية التحقق من المنتج والبائع قبل الشراء.</p>'}
 else{h+='<div id="b62o">'+offerBlock()+'</div><div class="b15h" style="margin:10px 0">'+(AU.user?'<button class="btn" data-b62="rep" data-oid="">الإبلاغ عن هذا الطلب</button>':'')+'</div><div id="b62rp"></div>'}
 d.innerHTML=h;fillPhotos(d)}
function fillPhotos(root){[].forEach.call(root.querySelectorAll('.b62g'),function(g){var p=g.dataset.p?g.dataset.p.split('|'):[];if(!p.length)return;g.textContent='جارٍ تحميل الصور…';signed(p).then(function(u){g.innerHTML=gal(u)})})}
function offerBlock(){var r=D.r;if(!AU.user)return '<div class="sel">لتقديم عرض يلزم تسجيل الدخول بحساب نشاط تجاري معتمد. <a href="#login" data-b62="lg">تسجيل الدخول</a></div>';
 if(D.mode==='other'&&r.user_id===AU.user.id)return'';if(!D.isBiz)return '<div class="sel">تقديم العروض متاح للأنشطة التجارية المعتمدة فقط. <a href="#business">سجّل نشاطك أو تابع حالة اعتماده</a>.</div>';
 var m=D.mine,open=isOpen(r)||D.mode==='public';if(m){var s=offState(m);return '<h2>عرضك</h2>'+offerHtmlMine(m,s,open)}
 if(!open)return '<div class="sel">هذا الطلب لا يستقبل عروضاً جديدة.</div>';return '<h2>تقديم عرض</h2>'+offerForm(null)}
function offerHtmlMine(m,s,open){var h='<div class="sel"><div class="b15h"><span class="bd '+s[1]+'">'+X(s[0])+'</span>'+(m.price!=null?'<span>'+X(money(m.price,m.currency))+'</span>':'')+'</div><div style="white-space:pre-wrap">'+X(m.description)+'</div><div class="b62g" data-p="'+X((m.photos||[]).join('|'))+'"></div>'
 +(m.owner_state==='selected'?'<div class="msg ok" style="display:block">اختار صاحب الطلب متابعة عرضك. تواصل معه عبر الرسائل.</div>':'')+'<div class="b15h">'+(m.status==='sent'?'<button class="btn" data-b62="wd" data-id="'+X(m.id)+'">سحب العرض</button><a class="btn" href="#inbox">الرسائل</a>':'')+'</div></div>';
 if(m.status==='sent'&&open&&m.owner_state!=='selected')h+='<details><summary>تعديل العرض</summary>'+offerForm(m)+'</details>';else if(m.status==='withdrawn'&&open)h+='<h3>إرسال عرض جديد</h3>'+offerForm(m);return h}
function offerForm(m){m=m||{};return '<div data-of="1"><label>وصف ما تستطيع توفيره<textarea data-k="d" rows="3" maxlength="2000">'+X(m.description||'')+'</textarea></label>'
 +'<div class="b17r"><label>السعر (اختياري)<input data-k="p" type="number" min="0" step="any" value="'+(m.price!=null?X(m.price):'')+'"></label><label>العملة<select data-k="c"><option'+(m.currency==='IQD'?'':' selected')+'>USD</option><option'+(m.currency==='IQD'?' selected':'')+'>IQD</option></select></label></div>'
 +'<div class="b17r"><label>حالة المنتج (إن كانت ذات صلة)<select data-k="co">'+opts({new:'جديد',used:'مستعمل'},m.condition||'','غير محدد')+'</select></label><label>التوفر<input data-k="a" maxlength="120" value="'+X(m.availability||'')+'" placeholder="متوفر الآن / عند الطلب"></label></div>'
 +'<div class="b17r"><label>مدة التجهيز التقديرية (اختياري)<input data-k="lt" maxlength="120" value="'+X(m.lead_time||'')+'"></label><label>الضمان (اكتبه فقط إن كان موجوداً فعلاً)<input data-k="w" maxlength="200" value="'+X(m.warranty||'')+'"></label></div>'
 +'<div class="b17r"><label>صلاحية العرض<select data-k="vd"><option value="">بلا مدة محددة</option><option value="7">7 أيام</option><option value="14">14 يوماً</option><option value="30">30 يوماً</option></select></label></div><label>ملاحظات أو شروط (اختياري)<textarea data-k="n" rows="2" maxlength="1000">'+X(m.note||'')+'</textarea></label>'
 +'<label>صور حقيقية للمنتج (اختياري، حتى '+MAXP+')<input data-k="f" type="file" accept="image/jpeg,image/png,image/webp" multiple></label><p class="b17n">لا تُنشر هذه الصور للعامة؛ يراها صاحب الطلب والإدارة فقط. إرسال العرض لا يعني إتمام صفقة.</p>'
 +'<button class="btn btn-p" data-b62="sendoffer">'+(m.id&&m.status==='sent'?'حفظ التعديل':'إرسال العرض')+'</button></div>'}
function sendOffer(b){if(busy)return;var w=b.closest('[data-of]'),c=sbc(),r=D.r,v=function(k){return w.querySelector('[data-k="'+k+'"]').value.trim()},ex=D.mine;
 var pr=num(v('p')),d=v('d');if(d.length<5){say('err','اكتب وصف العرض (5 أحرف على الأقل).');return}if(pr!==null&&!(pr>=0)){say('err','السعر غير صحيح.');return}
 var files=[].slice.call(w.querySelector('[data-k="f"]').files),bad='';files.forEach(function(f){var m=PF.files.check(f,{max:MAXB});if(m)bad=m});if(files.length>MAXP)bad='الحد الأقصى '+MAXP+' صور.';if(bad){say('err',bad);return}
 busy=true;b.disabled=true;say('in','جارٍ الإرسال…');var id=ex&&ex.id?ex.id:uuid(),uid=AU.user.id,bk=c.storage.from('request-images'),paths=[],keep=(ex&&ex.photos)||[];
 Promise.all(files.map(function(f){return PF.files.sniff(f)})).then(function(a){if(a.some(function(x){return!x}))throw{pfMsg:'محتوى أحد الملفات لا يطابق نوعه.'};
  return files.reduce(function(ch,f,i){return ch.then(function(){return B17.comp(f).then(function(bl){var pth=uid+'/b62o/'+id+'/'+Date.now()+'-'+i+'.jpg';return bk.upload(pth,bl,{contentType:'image/jpeg',upsert:false}).then(function(x){if(x.error)throw x.error;paths.push(pth)})})})},Promise.resolve())})
 .then(function(){var days=Number(v('vd')||0),row={description:d,price:pr,currency:pr===null?null:v('c'),availability:v('a')||null,condition:v('co')||null,lead_time:v('lt')||null,warranty:v('w')||null,note:v('n')||null,valid_until:days?new Date(Date.now()+days*864e5).toISOString():null,photos:keep.concat(paths).slice(0,MAXP),status:'sent'},q;
  q=ex&&ex.id?c.from('buyer_request_offers').update(row).eq('id',ex.id):c.from('buyer_request_offers').insert(Object.assign({id:id,request_id:r.id,biz_id:D.biz&&D.biz.id},row));
  if(!ex&&!(D.biz&&D.biz.id))throw new Error('forbidden');return q.select('id').then(function(x){if(x.error)throw x.error;if(!x.data||!x.data.length)throw new Error('forbidden')})})
 .then(function(){toast('تم حفظ العرض.');detail(r.id)}).catch(function(x){if(paths.length)bk.remove(paths);say('err',emsg(x));b.disabled=false}).then(function(){busy=false})}
function editForm(){var r=D.r,e=E('b62e');e.innerHTML='<div class="sel" data-ef="1"><h3>تعديل الطلب</h3>'+fld('e-ti','العنوان','text','maxlength="120" value="'+X(r.title)+'"')+'<label>الوصف<textarea id="e-d" rows="4" maxlength="3000">'+X(r.description)+'</textarea></label><div class="b17r">'+fld('e-m','الشركة','text','maxlength="80" value="'+X(r.manufacturer||'')+'"')+fld('e-mo','الموديل','text','maxlength="80" value="'+X(r.model||'')+'"')+'</div><div class="b17r">'+fld('e-p','رقم القطعة','text','maxlength="80" dir="ltr" value="'+X(r.part_no||'')+'"')+fld('e-a','المنطقة','text','maxlength="80" value="'+X(r.area||'')+'"')+'</div><div class="b17r"><label>الحالة<select id="e-c">'+opts(CO,r.condition||'','غير محدد')+'</select></label><label>الحاجة<select id="e-nw">'+opts(NW,r.needed_within||'','غير محدد')+'</select></label></div><p class="b17n">النوع والمحافظة والميزانية ومدة الصلاحية لا تُعدَّل بعد النشر. لتغييرها أغلق الطلب وأنشئ طلباً جديداً.'+(D.offs.length?' وبعد وجود عروض يفضّل عدم تغيير جوهر الطلب.':'')+'</p><div class="b15h"><button class="btn btn-p" data-b62="saveedit">حفظ</button><button class="btn" data-b62="canceledit">إلغاء</button></div></div>'}

/* ================= لوحة صاحب الطلب ================= */
function mine(reset){var c=sbc();if(reset!==false){MN.rows=[];MN.page=0}
 R().innerHTML='<h1>طلباتي</h1>'+nav('mine')+'<div id="b62m" class="msg" role="alert"></div><div id="b62l" class="b17n">جارٍ التحميل…</div>';if(!c)return;mineLoad()}
function mineLoad(){var c=sbc(),from=MN.page*PS;c.from('buyer_requests').select('*',{count:'exact'}).eq('user_id',AU.user.id).order('created_at',{ascending:false}).range(from,from+PS-1).then(function(r){if(r.error)throw r.error;var rows=r.data||[];MN.rows=MN.rows.concat(rows);MN.more=MN.rows.length<(r.count||0);
  return(rows.length?c.from('buyer_request_offers').select('id,request_id,status,owner_state').in('request_id',rows.map(function(x){return x.id})):Promise.resolve({data:[]})).then(function(o){if(o.error)throw o.error;var by={};(o.data||[]).forEach(function(x){(by[x.request_id]=by[x.request_id]||[]).push(x)});MN.by=Object.assign(MN.by||{},by);
   var l=E('b62l');if(!l)return;l.className='';l.innerHTML=MN.rows.length?MN.rows.map(function(x){var of=MN.by[x.id]||[],st=reqState(x,of),live=of.filter(function(z){return z.status==='sent'}),nw=live.filter(function(z){return z.owner_state==='new'}).length;
    return card(x,'<span class="bd '+st[1]+'">'+X(st[0])+'</span>'+(nw?' <span class="bd new">'+nw+' عرض جديد</span>':'')).replace('<small>','<small>العروض: '+live.length+' · ')}).join('')+pager(MN.more,'mine'):'<div class="b17n">لا توجد طلبات بعد. <a href="#buynew">أضف طلبك الأول</a>.</div>'})}).catch(function(e){var l=E('b62l');if(l){l.className='';l.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div><p><button class="btn btn-p" data-b62="retry" data-fn="mine">إعادة المحاولة</button></p>'}})}

/* ================= لوحة النشاط ================= */
function board(reset){var c=sbc();if(reset!==false){ST.rows=[];ST.page=0}
 R().innerHTML='<h1>لوحة طلبات الأنشطة</h1>'+nav('board')+'<div id="b62m" class="msg" role="alert"></div><div id="b62l" class="b17n">جارٍ التحميل…</div>';if(!c)return;
 c.rpc('b49_is_biz').then(function(a){if(a.error)throw a.error;if(a.data!==true){E('b62l').className='';E('b62l').innerHTML='هذه اللوحة متاحة للأنشطة التجارية المعتمدة فقط. <a href="#business">سجّل نشاطك أو تابع حالة اعتماده</a>.';return}
  return Promise.all([c.from('biz_profiles').select('id,business_type').eq('owner_id',AU.user.id).maybeSingle(),c.from('buyer_request_offers').select('*').eq('user_id',AU.user.id).order('created_at',{ascending:false}).limit(300)]).then(function(a){if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;ST.biz=a[0].data&&a[0].data.id;ST.bt=a[0].data&&a[0].data.business_type;ST.mine={};a[1].data.forEach(function(o){ST.mine[o.request_id]=o});ST.offers=a[1].data;boardShell();if(ST.tab==='open')boardLoad();else myOffers()})}).catch(function(e){fail(e,'board')})}
function boardShell(){var fit=BM,has=ST.bt&&Object.keys(BM).some(function(k){return BM[k].indexOf(ST.bt)>-1});
 E('b62l').className='';E('b62l').innerHTML='<div class="b15h"><button class="btn'+(ST.tab==='open'?' btn-p':'')+'" data-b62="tab" data-t="open">طلبات متاحة</button><button class="btn'+(ST.tab==='mine'?' btn-p':'')+'" data-b62="tab" data-t="mine">عروضي ('+ST.offers.length+')</button></div>'
 +(ST.tab==='open'?'<div class="b17r" style="margin-top:8px"><label>نوع المطلوب<select id="s-t">'+opts(TY,ST.ty,'الكل')+'</select></label><label>المحافظة<select id="s-p">'+pvo(ST.pv,'الكل')+'</select></label><label>الترتيب<select id="s-s"><option value="new"'+(ST.so==='new'?' selected':'')+'>الأحدث</option><option value="offers"'+(ST.so==='offers'?' selected':'')+'>الأقل عروضاً</option></select></label></div>'
  +(has?'<label style="display:flex;gap:6px;align-items:center;font-weight:400"><input id="s-f" type="checkbox"'+(ST.fit?' checked':'')+'> أظهر الطلبات التي تناسب نوع نشاطي فقط</label>':'')+'<input id="s-q" type="search" value="'+X(ST.q)+'" placeholder="بحث في الطلبات" style="font:inherit;border:1px solid var(--line);border-radius:10px;padding:10px;width:100%;margin:6px 0 10px;min-height:44px"><div id="b62r"></div>':'<div id="b62r"></div>');
 if(ST.tab==='open'){E('s-t').onchange=function(){ST.ty=this.value;ST.rows=[];ST.page=0;boardLoad()};E('s-p').onchange=function(){ST.pv=this.value;ST.rows=[];ST.page=0;boardLoad()};E('s-s').onchange=function(){ST.so=this.value;ST.rows=[];ST.page=0;boardLoad()};if(E('s-f'))E('s-f').onchange=function(){ST.fit=this.checked;ST.rows=[];ST.page=0;boardLoad()};var t;E('s-q').oninput=function(){var v=this.value;clearTimeout(t);t=setTimeout(function(){ST.q=v.trim();ST.rows=[];ST.page=0;boardLoad()},400)}}}
function boardLoad(){var c=sbc(),from=ST.page*PS,q=c.from('buyer_requests_public').select('*',{count:'exact'}),types=null;
 if(ST.ty)q=q.eq('equipment_type',ST.ty);else if(ST.fit&&ST.bt){types=Object.keys(BM).filter(function(k){return BM[k].indexOf(ST.bt)>-1});if(types.length)q=q.in('equipment_type',types)}
 if(ST.pv)q=q.eq('province',ST.pv);var s=lk(ST.q);if(s)q=q.or('title.ilike.%'+s+'%,description.ilike.%'+s+'%');
 q=ST.so==='offers'?q.order('offers_count',{ascending:true}).order('created_at',{ascending:false}):q.order('created_at',{ascending:false});
 var box=E('b62r');if(box&&!ST.rows.length)box.innerHTML='<div class="b17n">جارٍ التحميل…</div>';
 q.range(from,from+PS-1).then(function(r){if(r.error)throw r.error;ST.rows=ST.rows.concat(r.data||[]);ST.more=ST.rows.length<(r.count||0);var b=E('b62r');if(!b)return;
  b.innerHTML=(ST.rows.length?ST.rows.map(function(x){var o=ST.mine[x.id];return card(x,o?' <span class="bd '+offState(o)[1]+'">عرضك: '+X(offState(o)[0])+'</span>':'')}).join('')+pager(ST.more,'board'):'<div class="b17n">لا توجد طلبات مفتوحة مطابقة. جرّب إلغاء تصفية «يناسب نشاطي».</div>')}).catch(function(e){var b=E('b62r');if(b)b.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div><p><button class="btn btn-p" data-b62="retry" data-fn="board">إعادة المحاولة</button></p>'})}
function myOffers(){var c=sbc(),ids=ST.offers.map(function(o){return o.request_id}),b=E('b62r');if(!ids.length){b.innerHTML='<div class="b17n">لم ترسل عروضاً بعد.</div>';return}
 b.innerHTML='<div class="b17n">جارٍ التحميل…</div>';c.from('buyer_requests_public').select('id,title,province,equipment_type').in('id',ids).then(function(r){if(r.error)throw r.error;var m={};(r.data||[]).forEach(function(x){m[x.id]=x});
  b.innerHTML=ST.offers.map(function(o){var s=offState(o),q=m[o.request_id];return '<div class="b17c b15r"><div class="b15h"><b>'+X(q?q.title:'طلب لم يعد متاحاً للعرض (مغلق أو منتهٍ أو مخفي)')+'</b><span class="bd '+s[1]+'">'+X(s[0])+'</span></div><small>'+(o.price!=null?X(money(o.price,o.currency))+' · ':'')+fd(o.created_at)+'</small><p style="margin:4px 0">'+X(String(o.description).slice(0,140))+'</p><div class="b15h">'+(q?'<a class="btn" href="#buy-'+X(o.request_id)+'">فتح الطلب</a>':'')+'<a class="btn" href="#inbox">الرسائل</a></div></div>'}).join('')}).catch(function(e){b.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'})}

/* ================= الإدارة ================= */
function admin(){var c=sbc();R().innerHTML='<h1>إدارة طلبات الشراء والعروض</h1><div id="b62m" class="msg" role="alert"></div><div id="b62l" class="b17n">جارٍ التحقق من الصلاحية…</div>';if(!c)return;
 c.rpc('is_admin').then(function(a){if(a.error||a.data!==true){E('b62l').className='';E('b62l').textContent='هذه الصفحة للمشرفين فقط.';return}adminShell()}).catch(function(e){fail(e,'admin')})}
function adminShell(){var T={req:'الطلبات',rep:'البلاغات',dup:'مكرر/مشتبه',log:'سجل الإجراءات'};E('b62l').className='';
 E('b62l').innerHTML='<div class="b15h">'+Object.keys(T).map(function(k){return '<button class="btn'+(AD.tab===k?' btn-p':'')+'" data-b62="atab" data-t="'+k+'">'+T[k]+'</button>'}).join('')+'</div><div id="b62a" style="margin-top:10px"></div>';
 if(AD.tab==='req')adReq(true);else if(AD.tab==='rep')adRep();else if(AD.tab==='dup')adDup();else adLog()}
function adReq(reset){var c=sbc(),a=E('b62a');if(reset){AD.off=0;AD.rows=[]}
 if(!E('a-q')){a.innerHTML='<div class="b17r"><label>بحث برقم الطلب أو العنوان<input id="a-q" value="'+X(AD.q)+'" dir="auto"></label><label>الفئة<select id="a-t">'+opts(TY,AD.ty,'الكل')+'</select></label></div><div class="b17r"><label>المحافظة<select id="a-p">'+pvo(AD.pv,'الكل')+'</select></label><label>الحالة<select id="a-s">'+opts({open:'مفتوح',expired:'منتهٍ',closed_found:'تم العثور',closed_cancelled:'ملغي',closed_x:'مغلق (قديم)',hidden:'مخفي'},AD.st,'الكل')+'</select></label></div><div class="b17r"><label>من تاريخ<input id="a-f" type="date" value="'+X(AD.f)+'"></label><label>إلى تاريخ<input id="a-to" type="date" value="'+X(AD.t)+'"></label></div><button class="btn btn-p" data-b62="asearch">بحث</button><div id="b62r" style="margin-top:10px"></div>'}
 var box=E('b62r');box.innerHTML=AD.rows.length?box.innerHTML:'<div class="b17n">جارٍ التحميل…</div>';
 c.rpc('b62_admin_requests',{p_q:AD.q||null,p_type:AD.ty||null,p_province:AD.pv||null,p_status:AD.st||null,p_from:AD.f||null,p_to:AD.t||null,p_limit:30,p_offset:AD.off}).then(function(r){if(r.error)throw r.error;AD.rows=AD.rows.concat(r.data||[]);AD.more=(r.data||[]).length===30;
  var SL={open:'مفتوح',expired:'منتهٍ',closed_found:'تم العثور',closed_cancelled:'ملغي',closed_x:'مغلق',hidden:'مخفي'};
  box.innerHTML=AD.rows.length?AD.rows.map(function(x){return '<div class="b17c b15r" data-rid="'+X(x.id)+'"><div class="b15h"><b>'+X(x.title)+'</b><span class="bd '+(x.effective_status==='open'?'published':x.effective_status==='hidden'?'rejected':'pending')+'">'+X(SL[x.effective_status]||x.effective_status)+'</span>'+(x.reports_count?'<span class="bd rejected">بلاغات: '+x.reports_count+'</span>':'')+(x.dup_count?'<span class="bd new">مشابه: '+x.dup_count+'</span>':'')+'</div><small><span dir="ltr">'+X(x.ref)+'</span> · '+X(TY[x.equipment_type]||'')+' · '+X(x.province)+' · '+fd(x.created_at)+' · العروض: '+x.offers_count+'</small>'+(x.hidden_reason?'<div><small>سبب الإخفاء: '+X(x.hidden_reason)+'</small></div>':'')
   +'<div class="b15h" style="margin-top:6px"><a class="btn" href="#buy-'+X(x.id)+'" target="_blank" rel="noopener">فتح</a><button class="btn" data-b62="aoffers">العروض</button>'+(x.effective_status==='hidden'?'<button class="btn" data-b62="aunhide">إظهار</button>':'<button class="btn" data-b62="ahide">إخفاء بسبب…</button>')+'</div><div class="b62x"></div></div>'}).join('')+pager(AD.more,'adm'):'<div class="b17n">لا توجد نتائج.</div>'}).catch(function(e){box.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'})}
function adRep(){var c=sbc(),a=E('b62a');a.innerHTML='<div class="b17n">جارٍ التحميل…</div>';c.rpc('b62_admin_reports',{p_status:'open'}).then(function(r){if(r.error)throw r.error;var rows=r.data||[];a.innerHTML=rows.length?rows.map(function(x){return '<div class="b17c b15r" data-pid="'+X(x.id)+'" data-rid="'+X(x.request_id)+'"><div class="b15h"><b>'+X(x.request_title)+'</b><span class="bd rejected">'+X(RR[x.reason]||x.reason)+'</span>'+(x.offer_id?'<span class="bd pending">بلاغ عن عرض</span>':'')+'</div><small>'+fd(x.created_at)+'</small>'+(x.offer_snippet?'<div class="sel">'+X(x.offer_snippet)+'</div>':'')+(x.details?'<p>'+X(x.details)+'</p>':'')
   +'<label>ملاحظة القرار<input data-k="n" maxlength="300"></label><div class="b15h"><button class="btn btn-p" data-b62="rres" data-s="reviewed">تمت المراجعة</button><button class="btn" data-b62="rres" data-s="dismissed">رفض البلاغ</button><a class="btn" href="#buy-'+X(x.request_id)+'" target="_blank" rel="noopener">فتح الطلب</a><button class="btn" data-b62="ahide">إخفاء الطلب بسبب…</button>'+(x.offer_id?'<button class="btn" data-b62="awd" data-oid="'+X(x.offer_id)+'">سحب العرض</button>':'')+'</div><div class="b62x"></div></div>'}).join(''):'<div class="b17n">لا توجد بلاغات مفتوحة.</div>'}).catch(function(e){a.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'})}
function adDup(){var c=sbc(),a=E('b62a');a.innerHTML='<div class="b17n">جارٍ التحميل…</div>';c.rpc('b62_admin_duplicates').then(function(r){if(r.error)throw r.error;var rows=r.data||[];a.innerHTML='<p class="b17n">الاشتباه سبب للمراجعة فقط؛ لا يُحذف أي طلب تلقائياً.</p>'+(rows.length?rows.map(function(x){return '<div class="b17c b15r"><div class="b15h"><b>'+X(x.sample_title)+'</b><span class="bd new">'+(x.kind==='same_user_same_title'?'نفس المستخدم، نفس العنوان ×'+x.cnt:'نص متطابق من '+x.cnt+' مستخدمين')+'</span></div><div class="b15h">'+(x.request_ids||[]).slice(0,6).map(function(i){return '<button class="btn" data-b62="ajump" data-id="'+X(i)+'">'+X(ref(i))+'</button>'}).join('')+'</div></div>'}).join(''):'<div class="b17n">لا حالات مشتبهة خلال 30 يوماً.</div>')}).catch(function(e){a.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'})}
function adLog(){var c=sbc(),a=E('b62a'),L={hide_request:'إخفاء طلب',unhide_request:'إظهار طلب',withdraw_offer:'سحب عرض',report_reviewed:'بلاغ: تمت المراجعة',report_dismissed:'بلاغ: مرفوض'};a.innerHTML='<div class="b17n">جارٍ التحميل…</div>';c.rpc('b62_admin_audit',{p_limit:100}).then(function(r){if(r.error)throw r.error;var rows=r.data||[];a.innerHTML=rows.length?rows.map(function(x){return '<div class="b15e"><small>'+fd(x.created_at)+'</small> '+X(L[x.action]||x.action)+(x.request_id?' · <span dir="ltr">'+X(ref(x.request_id))+'</span>':'')+(x.reason?' — '+X(x.reason):'')+'</div>'}).join(''):'<div class="b17n">لا توجد إجراءات مسجّلة.</div>'}).catch(function(e){a.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'})}

/* ================= الأحداث ================= */
function rpcDo(b,fn,args,okMsg,after){if(busy)return;busy=true;b.disabled=true;sbc().rpc(fn,args).then(function(r){if(r.error)throw r.error;toast(okMsg);after()}).catch(function(x){say('err',emsg(x));toast(emsg(x));b.disabled=false}).then(function(){busy=false})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-b62]');if(!b)return;var k=b.dataset.b62,c=sbc();if(k==='lg'){try{B22.setRet(location.hash)}catch(x){}NEXT='سجّل الدخول لتقديم عرض.';return}if(!c)return;
 if(k==='retry'){var f=b.dataset.fn;({hub:hub,mine:mine,board:board,admin:admin}[f]||function(){})();if(f==='detail')detail(b.dataset.id);return}
 if(k==='more'){var w=b.dataset.k;if(w==='hub'){H.page++;hubLoad()}else if(w==='mine'){MN.page++;mineLoad()}else if(w==='board'){ST.page++;boardLoad()}else{AD.off=AD.rows.length;adReq(false)}b.disabled=true;return}
 if(k==='rmf'){F.files.splice(Number(b.dataset.i),1);paintFiles();return}
 if(k==='back'){var d=F.data;form(d);return}
 if(k==='publish'){publish(b);return}
 if(k==='tab'){ST.tab=b.dataset.t;ST.rows=[];ST.page=0;boardShell();if(ST.tab==='open')boardLoad();else myOffers();return}
 if(k==='close'){var w2=b.dataset.w;if(!confirm(w2==='found'?'إغلاق الطلب لأنك وجدت المطلوب؟ لن يستقبل عروضاً جديدة ولا يمكن إعادة فتحه.':'إلغاء هذا الطلب؟ لن يستقبل عروضاً جديدة ولا يمكن إعادة فتحه.'))return;rpcDo(b,'b62_close_request',{p_id:D.r.id,p_reason:w2},'تم إغلاق الطلب.',function(){detail(D.r.id)});return}
 if(k==='os'){rpcDo(b,'b62_set_offer_state',{p_offer:b.dataset.id,p_state:b.dataset.s},b.dataset.s==='selected'?'تم اختيار العرض للمتابعة.':'تم تحديث حالة العرض.',function(){detail(D.r.id)});return}
 if(k==='edit'){editForm();return}if(k==='canceledit'){E('b62e').innerHTML='';return}
 if(k==='saveedit'){var v=function(i){return E(i).value.trim()},p={title:v('e-ti'),description:v('e-d'),manufacturer:v('e-m'),model:v('e-mo'),part_no:v('e-p'),area:v('e-a'),condition:v('e-c'),needed_within:v('e-nw')};if(p.title.length<4||p.description.length<10){say('err','العنوان 4 أحرف والوصف 10 أحرف على الأقل.');return}rpcDo(b,'b62_edit_request',{p_id:D.r.id,p:p},'تم حفظ التعديل.',function(){detail(D.r.id)});return}
 if(k==='sendoffer'){sendOffer(b);return}
 if(k==='wd'){if(!confirm('سحب هذا العرض؟'))return;if(busy)return;busy=true;b.disabled=true;c.from('buyer_request_offers').update({status:'withdrawn'}).eq('id',b.dataset.id).select('id').then(function(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('forbidden');toast('تم سحب العرض.');detail(D.r.id)}).catch(function(x){say('err',emsg(x));b.disabled=false}).then(function(){busy=false});return}
 if(k==='rep'){if(!AU.user){needLogin('سجّل الدخول للإبلاغ.');return}var host=b.closest('.sel')||E('b62rp');if(b.dataset.oid&&host&&host.querySelector('[data-rf]'))return;if(!b.dataset.oid&&E('b62rp').children.length)return;(b.dataset.oid?host:E('b62rp')).insertAdjacentHTML('beforeend',reportForm(b.dataset.oid));return}
 if(k==='cancelrep'){var rf=b.closest('[data-rf]');rf.parentNode.removeChild(rf);return}
 if(k==='sendrep'){var f2=b.closest('[data-rf]'),oid=f2.dataset.rf||null;rpcDo(b,'b62_report',{p_request:D.r.id,p_offer:oid,p_reason:f2.querySelector('[data-k="rs"]').value,p_details:f2.querySelector('[data-k="rd"]').value},'وصل بلاغك للإدارة.',function(){f2.innerHTML='<b>وصل بلاغك للإدارة. شكراً لك.</b>'});return}
 /* الإدارة */
 if(k==='atab'){AD.tab=b.dataset.t;adminShell();return}
 if(k==='asearch'){AD.q=E('a-q').value.trim();AD.ty=E('a-t').value;AD.pv=E('a-p').value;AD.st=E('a-s').value;AD.f=E('a-f').value;AD.t=E('a-to').value;adReq(true);return}
 if(k==='ajump'){AD.tab='req';AD.q=b.dataset.id;AD.ty=AD.pv=AD.st=AD.f=AD.t='';adminShell();return}
 var row=b.closest('[data-rid]');
 if(k==='ahide'){var x=row.querySelector('.b62x');if(x.querySelector('[data-hr]'))return;x.insertAdjacentHTML('beforeend','<div data-hr="1" class="sel"><label>سبب الإخفاء (يظهر لصاحب الطلب)<input data-k="hr" maxlength="300"></label><button class="btn btn-p" data-b62="ahide2">تأكيد الإخفاء</button></div>');return}
 if(k==='ahide2'){var rs=row.querySelector('[data-k="hr"]').value;rpcDo(b,'b62_admin_hide',{p_id:row.dataset.rid,p_reason:rs},'تم إخفاء الطلب.',function(){adminShell()});return}
 if(k==='aunhide'){if(!confirm('إظهار الطلب من جديد؟'))return;rpcDo(b,'b62_admin_unhide',{p_id:row.dataset.rid},'تم إظهار الطلب.',function(){adminShell()});return}
 if(k==='aoffers'){var x2=row.querySelector('.b62x');x2.innerHTML='جارٍ التحميل…';c.rpc('b62_admin_offers',{p_request:row.dataset.rid}).then(function(r){if(r.error)throw r.error;x2.innerHTML=(r.data||[]).length?(r.data||[]).map(function(o){return '<div class="sel" data-oid="'+X(o.id)+'"><b>'+X(o.biz_name||'نشاط')+'</b> · '+X(o.status)+' · '+X(OS[o.owner_state]||'')+(o.price!=null?' · '+X(money(o.price,o.currency)):'')+'<br>'+X(o.description)+(o.status==='sent'?'<div><button class="btn" data-b62="awd" data-oid="'+X(o.id)+'">سحب العرض بسبب…</button></div>':'')+'</div>'}).join(''):'لا توجد عروض.'}).catch(function(e){x2.innerHTML=X(emsg(e))});return}
 if(k==='awd'){var x3=b.closest('.b17c').querySelector('.b62x'),oid2=b.dataset.oid;if(x3.querySelector('[data-wr]'))return;x3.insertAdjacentHTML('beforeend','<div data-wr="1" class="sel"><label>سبب سحب العرض<input data-k="wr" maxlength="300"></label><button class="btn btn-p" data-b62="awd2" data-oid="'+X(oid2)+'">تأكيد</button></div>');return}
 if(k==='awd2'){rpcDo(b,'b62_admin_offer_withdraw',{p_offer:b.dataset.oid,p_reason:b.closest('[data-wr]').querySelector('[data-k="wr"]').value},'تم سحب العرض.',function(){adminShell()});return}
 if(k==='rres'){var pr=b.closest('[data-pid]');rpcDo(b,'b62_admin_resolve_report',{p_report:pr.dataset.pid,p_status:b.dataset.s,p_note:pr.querySelector('[data-k="n"]').value},'تم حفظ القرار.',function(){adRep()});return}});

/* ================= التهيئة والتوجيه ================= */
B62.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b62')});document.title='بحر | طلبات الشراء';busy=false;
 if(!sbc()){R().innerHTML='<p class="b17n">الاتصال بالخدمة غير جاهز.</p>';return}
 if(k==='buyhub')hub();else if(k.slice(0,4)==='buy-')detail(k.slice(4));else if(k==='buynew')form();else if(k==='buymine')mine();else if(k==='buyboard')board();else if(k==='admbuy')admin()};
/* رابط المشرف في القائمة يظهر للمشرف فقط (التحقق الحقيقي في الخادم) */
B62.sync=function(){var l=E('admBuyLink'),c=sbc();if(l)l.style.display='none';if(!c||!AU.user||!l)return;c.rpc('is_admin').then(function(r){if(!r.error&&r.data===true)l.style.display=''})};
var _s=B15.sync;B15.sync=function(){var o=_s&&_s.apply(this,arguments);try{B62.sync()}catch(x){}return o};
})();

/* ===== B50: التقييمات والسمعة (b50_reviews_trust.sql). المتوسط والتوزيع يأتيان من عرض الخادم b50_biz_stats فقط؛ لا قيم افتراضية ===== */
var B50={};
(function(){
var X=PF.esc,CUR=null,SORT='new',busy=false,SEL=0,AF='pending';
var RR={abuse:'إساءة أو ألفاظ مسيئة',pii:'معلومات شخصية',off:'محتوى مخالف أو لا يخص النشاط',other:'غير ذلك'};
function fd(x){try{return new Date(x).toLocaleDateString('ar-IQ',{dateStyle:'medium'})}catch(e){return''}}
function stars(n){n=Math.round(n);return '<span class="b50s" aria-label="'+n+' من 5" style="color:#d99a00;letter-spacing:1px">'+'★'.repeat(n)+'☆'.repeat(5-n)+'</span>'}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'نظام التقييمات غير مفعّل على الخادم بعد (يلزم تطبيق b50_reviews_trust.sql).';
 if(c==='23505')return 'لديك تقييم لهذا النشاط بالفعل. عدّله بدل إضافة تقييم جديد.';
 if(/own_business/.test(m))return 'لا يمكنك تقييم نشاطك.';
 if(/rate_limit/.test(m))return 'وصلت للحد اليومي من التقييمات.';
 if(/hidden/.test(m))return 'هذا التقييم مخفي من الإدارة ولا يمكن تعديله.';
 if(/bad_text/.test(m))return 'اكتب رداً من حرفين على الأقل.';
 if(/forbidden|row-level|42501|policy/i.test(m))return 'لا تملك صلاحية تنفيذ هذا الإجراء.';
 if(/jwt|expired/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. أعد المحاولة.';
 return 'حدث خطأ: '+m.slice(0,120)}
function say(t,x){var m=E('b50m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function summary(s){if(!s||!s.n)return '<p class="b17n">لا توجد تقييمات منشورة بعد.</p>';
 var bars=[5,4,3,2,1].map(function(k){var v=s['s'+k]||0;return '<div style="display:flex;gap:8px;align-items:center"><span style="width:24px">'+k+' ★</span><div style="flex:1;height:8px;background:var(--line,#ddd);border-radius:6px;overflow:hidden"><div style="width:'+Math.round(v*100/s.n)+'%;height:100%;background:#d99a00"></div></div><span style="width:28px;text-align:left">'+v+'</span></div>'}).join('');
 return '<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center"><div><div style="font-size:2rem;font-weight:700">'+Number(s.avg_rating).toFixed(1)+'</div>'+stars(s.avg_rating)+'<div><small>'+s.n+' تقييم</small></div></div><div style="flex:1;min-width:200px">'+bars+'</div></div>'}
function revCard(r,own){return '<div class="sel"><div>'+stars(r.rating)+' <b dir="auto">'+X(r.reviewer_name)+'</b> <small>· '+fd(r.created_at)+'</small>'+(r.has_interaction?' <span class="bd published" title="استلم المقيِّم عرضاً من النشاط عبر طلب شراء في بحر. لا يعني شراءً مؤكداً.">تعامل عبر بحر</span>':'')+'</div>'+(r.comment?'<p style="white-space:pre-wrap;margin:4px 0" dir="auto">'+X(r.comment)+'</p>':'')
 +(r.reply?'<div style="border-right:3px solid var(--line,#ccc);padding-right:8px;margin:6px 0"><small>رد النشاط · '+fd(r.replied_at)+'</small><div style="white-space:pre-wrap" dir="auto">'+X(r.reply)+'</div></div>':'')
 +(own?'<details><summary>'+(r.reply?'تعديل الرد':'الرد على التقييم')+'</summary><div data-rv="'+X(r.id)+'"><textarea data-k="rp" rows="3" maxlength="1000">'+X(r.reply||'')+'</textarea><button class="btn" data-b50="reply">حفظ الرد</button></div></details>':'')
 +(AU.user&&!own?'<details><summary><small>الإبلاغ عن التقييم</small></summary><div data-rv="'+X(r.id)+'"><select data-k="rs">'+Object.keys(RR).map(function(k){return '<option value="'+k+'">'+RR[k]+'</option>'}).join('')+'</select><textarea data-k="rd" rows="2" maxlength="500" placeholder="تفاصيل (اختياري)"></textarea><button class="btn" data-b50="rep">إرسال البلاغ</button></div></details>':'')+'</div>'}
function formHtml(m){var st=m?(m.status==='published'?'منشور':m.status==='hidden'?'مخفي من الإدارة':'بانتظار مراجعة الإدارة قبل النشر'):'';SEL=m?m.rating:0;
 return '<h4 style="margin:12px 0 4px">'+(m?'تقييمك':'قيّم هذا النشاط')+'</h4>'+(m?'<small>الحالة: '+st+'</small>':'')+'<div id="b50m" class="msg" role="alert"></div><div id="b50st" role="radiogroup" aria-label="التقييم">'+[1,2,3,4,5].map(function(k){return '<button type="button" class="btn" data-b50="star" data-v="'+k+'" aria-label="'+k+' نجوم" style="font-size:1.3rem">'+(k<=SEL?'★':'☆')+'</button>'}).join('')+'</div><label>تعليق (اختياري)<textarea id="b50c1" rows="3" maxlength="1500">'+X(m&&m.comment||'')+'</textarea></label><button class="btn btn-p" data-b50="save" type="button">'+(m?'حفظ التعديل':'إرسال التقييم')+'</button>'+(m?' <button class="btn" data-b50="del" type="button">حذف تقييمي</button>':'')+'<p class="b17n">لا يوجد في بحر إثبات شراء. تظهر شارة «تعامل عبر بحر» فقط لمن استلم عرضاً من النشاط عبر طلب شراء. التقييمات الأخرى تُنشر بعد مراجعة الإدارة.</p>'}
function load(){var c=sbc(),b=CUR;if(!c||!b)return;
 var q=c.from('b50_reviews_public').select('*').eq('biz_id',b.id);q=SORT==='high'?q.order('rating',{ascending:false}).order('created_at',{ascending:false}):SORT==='low'?q.order('rating',{ascending:true}).order('created_at',{ascending:false}):q.order('created_at',{ascending:false});
 var own=AU.user&&b.owner_id===AU.user.id,mine=AU.user&&!own?c.from('biz_reviews').select('*').eq('biz_id',b.id).eq('user_id',AU.user.id).maybeSingle():Promise.resolve({data:null});
 Promise.all([c.from('b50_biz_stats').select('*').eq('biz_id',b.id).maybeSingle(),q.limit(30),mine]).then(function(a){if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;if(a[2].error)throw a[2].error;
  E('b50s').className='';E('b50s').innerHTML=summary(a[0].data);
  E('b50f').innerHTML=!AU.user?'<p><a class="btn" href="#login" data-b50="login">سجّل الدخول لتقييم النشاط</a></p>':own?'<p class="b17n">لا يمكنك تقييم نشاطك، ويمكنك الرد على التقييمات المنشورة.</p>':formHtml(a[2].data);
  E('b50l').innerHTML=(a[1].data.length?'<label>الترتيب <select id="b50so"><option value="new"'+(SORT==='new'?' selected':'')+'>الأحدث</option><option value="high"'+(SORT==='high'?' selected':'')+'>الأعلى تقييماً</option><option value="low"'+(SORT==='low'?' selected':'')+'>الأقل تقييماً</option></select></label>':'')+a[1].data.map(function(r){return revCard(r,own)}).join('');
  var so=E('b50so');if(so)so.onchange=function(){SORT=this.value;load()}}).catch(function(e){E('b50s').className='';E('b50s').innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div><button class="btn" data-b50="reload">إعادة المحاولة</button>'})}
B50.mount=function(b){CUR=b;var el=E('b50r');if(!el)return;el.innerHTML='<h3>التقييمات</h3><div id="b50s" class="b17n">جارٍ التحميل…</div><div id="b50f"></div><div id="b50l"></div>';load()};
function run(b,q,ok,after){if(busy)return;busy=true;b.disabled=true;q.then(function(r){if(r&&r.error)throw r.error;if(r&&r.data!==undefined&&Array.isArray(r.data)&&!r.data.length)throw new Error('forbidden');toast(ok);(after||load)()}).catch(function(x){say('err',emsg(x));toast(emsg(x))}).then(function(){busy=false;b.disabled=false})}
/* ---- لوحة الإدارة ---- */
function admin(){var c=sbc(),R=E('b50c');R.innerHTML='<h1>مراجعة التقييمات</h1><div id="b50m" class="msg"></div><div id="b50a" class="b17n">جارٍ التحميل…</div>';
 c.rpc('is_admin').then(function(a){if(a.error||a.data!==true)throw new Error('forbidden');
  var q=AF==='reported'?c.from('reports').select('review_id,reason,details,status').not('review_id','is',null).eq('status','open').limit(200):null;
  return(q?q.then(function(r){if(r.error)throw r.error;return r.data}):Promise.resolve(null)).then(function(rp){var by={};(rp||[]).forEach(function(x){(by[x.review_id]=by[x.review_id]||[]).push(x)});
   var rq=c.from('biz_reviews').select('*,biz_profiles(name)').order('created_at',{ascending:false}).limit(100);rq=AF==='reported'?rq.in('id',Object.keys(by).length?Object.keys(by):['00000000-0000-0000-0000-000000000000']):rq.eq('status',AF);
   return rq.then(function(r){if(r.error)throw r.error;
    E('b50a').className='';E('b50a').innerHTML='<div>'+[['pending','بانتظار المراجعة'],['reported','عليها بلاغ مفتوح'],['published','منشورة'],['hidden','مخفية']].map(function(k){return '<button class="btn'+(AF===k[0]?' btn-p':'')+'" data-b50="af" data-v="'+k[0]+'">'+k[1]+'</button>'}).join(' ')+'</div>'
    +(r.data.length?r.data.map(function(x){var rs=by[x.id]||[];return '<div class="sel" data-rv="'+X(x.id)+'"><b dir="auto">'+X(x.biz_profiles&&x.biz_profiles.name||'')+'</b> '+stars(x.rating)+' <small>'+fd(x.created_at)+' · '+x.status+(x.has_interaction?' · تعامل عبر بحر':' · بلا دليل تعامل')+(x.is_test?' · تجريبي/إداري':'')+'</small>'+(x.comment?'<p style="white-space:pre-wrap" dir="auto">'+X(x.comment)+'</p>':'')+rs.map(function(p){return '<div><small>بلاغ: '+X(p.details||p.reason)+'</small></div>'}).join('')+'<input data-k="n" maxlength="300" placeholder="ملاحظة (تُسجَّل)">'+['published','hidden','pending'].filter(function(s){return s!==x.status}).map(function(s){return '<button class="btn" data-b50="mod" data-s="'+s+'">'+({published:'نشر',hidden:'إخفاء',pending:'إعادة للمراجعة'})[s]+'</button>'}).join(' ')+'</div>'}).join(''):'<div class="b17n">لا توجد عناصر.</div>')})})}).catch(function(e){E('b50a').className='';E('b50a').innerHTML='<div class="msg err" style="display:block">'+X(/forbidden/.test(String(e&&e.message))?'هذه الصفحة للمشرفين فقط.':emsg(e))+'</div>'})}
B50.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b50')});document.title='بحر | مراجعة التقييمات';if(!sbc()){E('b50c').innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}admin()};
document.addEventListener('click',function(e){var b=e.target.closest('[data-b50]');if(!b)return;var k=b.dataset.b50,c=sbc(),w=b.closest('[data-rv]'),v=function(n){return w.querySelector('[data-k="'+n+'"]').value.trim()};
 if(k==='login'){NEXT='سجّل الدخول لتقييم النشاط.';try{B22.setRet(location.hash)}catch(x){}return}
 if(k==='reload'){load();return}
 if(k==='star'){SEL=+b.dataset.v;[].forEach.call(E('b50st').children,function(s,i){s.textContent=i<SEL?'★':'☆'});return}
 if(k==='save'){if(!(SEL>=1&&SEL<=5)){say('err','اختر عدد النجوم من 1 إلى 5.');return}var cm=E('b50c1').value.trim()||null;say('in','جارٍ الحفظ…');
  c.from('biz_reviews').select('id').eq('biz_id',CUR.id).eq('user_id',AU.user.id).maybeSingle().then(function(x){if(x.error)throw x.error;
   run(b,x.data?c.from('biz_reviews').update({rating:SEL,comment:cm}).eq('id',x.data.id).select('id'):c.from('biz_reviews').insert({biz_id:CUR.id,rating:SEL,comment:cm}).select('id'),'تم حفظ التقييم.')}).catch(function(x){say('err',emsg(x))});return}
 if(k==='del'){if(!confirm('حذف تقييمك؟'))return;run(b,c.from('biz_reviews').delete().eq('biz_id',CUR.id).eq('user_id',AU.user.id).select('id'),'تم حذف التقييم.');return}
 if(k==='reply'){run(b,c.rpc('b50_reply',{p_id:w.dataset.rv,p_text:v('rp')}),'تم حفظ الرد.');return}
 if(k==='rep'){run(b,c.from('reports').insert({business_id:CUR.id,review_id:w.dataset.rv,reason:'other',details:'بلاغ عن تقييم: '+RR[v('rs')]+(v('rd')?' — '+v('rd'):'')}),'وصل بلاغك للإدارة.',function(){w.closest('details').open=false});return}
 if(k==='af'){AF=b.dataset.v;admin();return}
 if(k==='mod'){run(b,c.rpc('b50_admin_moderate',{p_id:w.dataset.rv,p_status:b.dataset.s,p_note:v('n')||null}),'تم تنفيذ الإجراء.',admin)}});
var s50=B15.sync;B15.sync=function(){s50();var l=E('admRevLink'),c=sbc();if(l)l.style.display='none';if(l&&c&&AU.user)c.rpc('is_admin').then(function(r){if(!r.error&&r.data===true)l.style.display=''})};
})();

/* ===== B52: التحليلات (b52_analytics.sql). المشاهدات من b52_listing_views عبر دوال الخادم فقط؛ لا أرقام تقديرية. التوقيت المعروض: العراق (UTC+3) ===== */
var B52={};
(function(){
var X=PF.esc,BG=108e5,DAY=864e5,P={k:'7',from:'',to:''},PG=0,MODE='biz',ST={published:'منشورة',pending:'بانتظار المراجعة',rejected:'مرفوضة',suspended:'موقوفة',archived:'متوقفة'},CAT={boat:'قوارب',jetski:'جت سكي',engine:'محركات بحرية',parts:'قطع غيار',accessory:'إكسسوارات'};
function ds(t){return Math.floor((t+BG)/DAY)*DAY-BG}
function range(){var n=Date.now(),t=ds(n)+DAY;if(P.k==='1')return[ds(n),t];if(P.k==='7')return[t-7*DAY,t];if(P.k==='30')return[t-30*DAY,t];return[Date.parse(P.from+'T00:00:00+03:00'),Date.parse(P.to+'T00:00:00+03:00')+DAY]}
function fdt(t){try{return new Date(t).toLocaleDateString('ar-IQ',{timeZone:'Asia/Baghdad',dateStyle:'medium'})}catch(e){return''}}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42883'||c==='PGRST202'||c==='42P01'||c==='PGRST205')return 'نظام الإحصائيات غير مفعّل على الخادم بعد (يلزم تطبيق b52_analytics.sql).';
 if(/forbidden/.test(m))return 'لا تملك صلاحية عرض هذه الإحصائيات.';
 if(/bad_range/.test(m))return 'نطاق التاريخ غير صحيح (الحد الأقصى 366 يوماً).';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. أعد المحاولة.';
 return 'حدث خطأ: '+m.slice(0,120)}
function k(l,v,d){return '<div class="bz-k">'+l+'<b>'+(v==null?'<span class="bz-na">غير متاح</span>':v)+'</b><small class="b17n">'+d+'</small></div>'}
function bar(){var o=[['1','اليوم'],['7','آخر 7 أيام'],['30','آخر 30 يوماً'],['c','نطاق محدد']],r=range();
 return '<div class="b15h">'+o.map(function(x){return '<button class="btn'+(P.k===x[0]?' btn-p':'')+'" data-b52="per" data-v="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>'
 +(P.k==='c'?'<div class="b17r"><label>من<input type="date" id="b52f" value="'+X(P.from)+'" max="'+new Date(Date.now()+BG).toISOString().slice(0,10)+'"></label><label>إلى<input type="date" id="b52t" value="'+X(P.to)+'" max="'+new Date(Date.now()+BG).toISOString().slice(0,10)+'"></label></div><button class="btn" data-b52="apply">تطبيق</button>':'')
 +'<p class="b17n" id="b52p"></p>'}
function ptxt(){var r=range();return isFinite(r[0])&&isFinite(r[1])?'الفترة: من '+fdt(r[0])+' إلى '+fdt(r[1]-DAY)+' (بتوقيت العراق).':''}
function coverage(first,from){return first?'تسجيل المشاهدات بدأ في '+fdt(Date.parse(first))+'. '+(Date.parse(first)>from?'<b>جزء من الفترة المختارة يسبق بدء التسجيل، فالأرقام أقل من الواقع لتلك الأيام.</b>':''):'لم تُسجَّل أي مشاهدة بعد في المنصة.'}
function chart(daily,from,to){var days=Math.round((to-from)/DAY);if(days>62)return '<p class="b17n">المخطط اليومي يظهر للفترات حتى 62 يوماً.</p>';var m={},mx=0,tot=0;daily.forEach(function(x){m[x.d]=x.n;tot+=x.n});if(!tot)return '<p class="b17n">لا مشاهدات مسجّلة في هذه الفترة.</p>';
 var h='';for(var i=0;i<days;i++){var d=new Date(from+i*DAY+BG).toISOString().slice(0,10),n=m[d]||0;mx=Math.max(mx,n);h+='<i title="'+d+': '+n+'" data-n="'+n+'" style="flex:1;min-width:3px;background:var(--b,#0a3d91);border-radius:3px 3px 0 0"></i>'}
 return '<div role="img" aria-label="المشاهدات اليومية" style="display:flex;gap:2px;align-items:flex-end;height:90px;border-bottom:1px solid var(--line)">'+h.replace(/data-n="(\d+)" style="/g,function(a,n){return 'style="height:'+Math.max(2,Math.round(n*100/mx))+'%;'+(+n?'':'opacity:.25;')})+'</div><small class="b17n">أعلى يوم: '+mx+' مشاهدة</small>'}
function unread(v,me){var r=v.user_a===me?v.a_read_at:v.b_read_at;return !!(v.last_sender&&v.last_sender!==me&&v.last_message_at&&(!r||v.last_message_at>r))}
function refOf(v){var a=['ref_id','ref','listing_id','entity_id','target_id'],i,n;for(i=0;i<a.length;i++)if(v[a[i]]&&PF.UUID.test(v[a[i]]))return v[a[i]];for(n in v)if(/ref/i.test(n)&&v[n]&&PF.UUID.test(v[n]))return v[n];return ''}
function shell(t,mode){MODE=mode;E('b52c').innerHTML='<h1>'+t+'</h1><p><a class="btn" href="#business">لوحة النشاط</a> <a class="btn" href="#bizstats">إحصائيات النشاط</a></p>'+bar()+'<div id="b52m" class="msg" role="alert"></div><div id="b52b" class="b17n">جارٍ التحميل…</div>';E('b52p').textContent=ptxt()}
function err(e){E('b52b').className='';E('b52b').innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div><button class="btn btn-p" data-b52="retry">إعادة المحاولة</button>'}
function load(){var c=sbc(),r=range();E('b52p').textContent=ptxt();
 if(!isFinite(r[0])||!isFinite(r[1])||r[1]<=r[0]){E('b52b').innerHTML='<div class="msg err" style="display:block">اختر تاريخ بداية ونهاية صحيحين.</div>';return}
 if(r[1]-r[0]>366*DAY){E('b52b').innerHTML='<div class="msg err" style="display:block">الحد الأقصى للنطاق 366 يوماً.</div>';return}
 E('b52b').className='b17n';E('b52b').textContent='جارٍ التحميل…';PG=0;
 var a={p_from:new Date(r[0]).toISOString(),p_to:new Date(r[1]).toISOString()};
 if(MODE==='adm')return c.rpc('b52_admin_stats',a).then(function(x){if(x.error)throw x.error;adminView(x.data,r)}).catch(err);
 c.rpc('b52_my_stats',a).then(function(x){if(x.error)throw x.error;var s=x.data,ids=s.listings.map(function(l){return l.id}).slice(0,100),me=AU.user.id;
  var sf=function(p){return p.then(function(q){return q.error?null:q},function(){return null})};
  return Promise.all([sf(c.from('connect_conversations').select('*').order('last_message_at',{ascending:false,nullsFirst:false}).limit(500)),
   sf(c.from('buyer_request_offers').select('id',{count:'exact',head:true}).eq('user_id',me).gte('created_at',a.p_from).lt('created_at',a.p_to)),
   ids.length?sf(c.from('listing_images').select('listing_id,storage_path,sort_order').in('listing_id',ids).order('sort_order')):Promise.resolve({data:[]})]).then(function(z){bizView(s,r,z,c)})}).catch(err)}
var D={};
function bizView(s,r,z,c){var from=r[0],to=r[1],me=AU.user.id,L=s.listings,sc=s.status_counts||{},first=s.first_event_at,prevOK=!!first&&Date.parse(first)<=from-(to-from),full=!!first&&Date.parse(first)<=from;
 var imgs={},ic={};(z[2]&&z[2].data||[]).forEach(function(i){ic[i.listing_id]=(ic[i.listing_id]||0)+1;if(!imgs[i.listing_id])imgs[i.listing_id]=i.storage_path});var imgKnown=!!z[2];
 var cv=z[0]?z[0].data||[]:null,inq=null,hasRef=false,newC=null,act=null,unr=null;
 if(cv){var idset={};L.forEach(function(l){idset[l.id]=1});var cr=cv.length&&('created_at' in cv[0]);act=cv.filter(function(v){var t=v.last_message_at&&Date.parse(v.last_message_at);return t>=from&&t<to}).length;unr=cv.filter(function(v){return unread(v,me)}).length;newC=!cv.length?0:cr?cv.filter(function(v){var t=Date.parse(v.created_at);return t>=from&&t<to}).length:null;
  inq={};cv.forEach(function(v){var rf=v.kind==='listing'?refOf(v):'';if(rf)hasRef=true;if(rf&&idset[rf]){var t=Date.parse(cr?v.created_at:v.last_message_at);if(t>=from&&t<to)inq[rf]=(inq[rf]||0)+1}});if(!hasRef&&cv.some(function(v){return v.kind==='listing'}))inq=null}
 var vNow=0,vPrev=0,sNow=0;L.forEach(function(l){vNow+=l.views_now;vPrev+=l.views_prev;sNow+=l.saves_now});
 var inqTot=inq?Object.keys(inq).reduce(function(a,q){return a+inq[q]},0):null;
 var cmp=prevOK?'الفترة السابقة المماثلة: '+vPrev+(vPrev>0?' ('+(vNow>=vPrev?'+':'')+Math.round((vNow-vPrev)*100/vPrev)+'%)':''):'لا توجد بيانات كافية للفترة السابقة للمقارنة.';
 var kp=k('إعلانات منشورة',sc.published||0,'الإعلانات الظاهرة للعامة الآن.')+k('بانتظار المراجعة',sc.pending||0,'بانتظار قرار الإدارة.')+k('مرفوضة / موقوفة',(sc.rejected||0)+(sc.suspended||0),'لا تظهر للعامة.')+k('متوقفة (مؤرشفة)',sc.archived||0,'أوقفتها أنت.')
  +k('المشاهدات في الفترة',vNow,'عدد مرات فتح تفاصيل إعلاناتك، وليس عدد الأشخاص. إعادة التحميل خلال 30 دقيقة لا تُحسب مرة أخرى، ومشاهداتك أنت لا تُحسب. '+cmp)
  +k('حفظ في المفضلة (في الفترة)',sNow,'عدد مرات إضافة إعلاناتك للمفضلة. لا تظهر هويات المستخدمين.')
  +k('استفسارات على إعلاناتك',inqTot,inq?'محادثات بُدئت على إعلاناتك ضمن الفترة'+(newC==null?' (مقاسة بآخر رسالة)':'')+'.':'غير متاح: لا يمكن ربط المحادثات بالإعلانات من البيانات المتوفرة.')
  +k('محادثات نشطة في الفترة',act,'محادثات لها آخر رسالة ضمن الفترة (كل أنواعها).')+k('محادثات جديدة',newC,newC==null?'عمود تاريخ بدء المحادثة غير متوفر.':'محادثات بدأت ضمن الفترة.')+k('رسائل غير مقروءة الآن',unr,'محادثات ينتظر ردك فيها.')
  +k('عروضك على طلبات الشراء',z[1]?z[1].count:null,'عدد العروض التي أرسلتها خلال الفترة (B49).');
 var top=L.filter(function(l){return l.views_now>0}).sort(function(a,b){return b.views_now-a.views_now}).slice(0,5);
 var cats={},tv=0;L.forEach(function(l){cats[l.category]=(cats[l.category]||0)+l.views_now;tv+=l.views_now});var bc=Object.keys(cats).sort(function(a,b){return cats[b]-cats[a]})[0];
 var notes=[];L.filter(function(l){return l.status==='published'}).forEach(function(l){var n=[];
  if(full&&l.views_now===0)n.push('لا مشاهدات خلال الفترة المختارة.');
  if(inq&&l.views_now>=20&&!(inq[l.id]))n.push('مشاهدات '+l.views_now+' دون أي استفسار: راجع السعر والوصف.');
  if(imgKnown&&ids100(L).indexOf(l.id)>-1&&(ic[l.id]||0)<3)n.push('عدد الصور '+(ic[l.id]||0)+' (أقل من 3): أضف صوراً أوضح.');
  if(n.length)notes.push('<li><a href="#editlisting-'+X(l.id)+'" dir="auto">'+X(l.title)+'</a>: '+n.join(' ')+'</li>')});
 D={L:L,imgs:imgs,ic:ic,inq:inq,c:c,first:first,prevOK:prevOK};
 E('b52b').className='';E('b52b').innerHTML='<p class="b17n">'+coverage(first,from)+' المصدر: سجل المشاهدات في بحر، والمفضلة والمحادثات والعروض الفعلية.</p><div class="bz-g">'+kp+'</div>'
  +'<div class="bz-c"><h3>المشاهدات اليومية</h3>'+chart(s.daily||[],from,to)+'</div>'
  +'<div class="bz-c"><h3>الأكثر مشاهدة</h3>'+(top.length?'<ol>'+top.map(function(l){return '<li dir="auto">'+X(l.title)+' — '+l.views_now+'</li>'}).join('')+'</ol>':'<p class="b17n">لا مشاهدات في الفترة.</p>')+(tv>=10&&bc?'<p><b>أفضل نوع حسب المشاهدات:</b> '+X(CAT[bc]||bc)+' ('+cats[bc]+')</p>':'<p class="b17n">لا توجد مشاهدات كافية (10 على الأقل) لتحديد أفضل نوع.</p>')+'</div>'
  +'<div class="bz-c"><h3>ملاحظات (قواعد ثابتة، ليست ذكاءً اصطناعياً)</h3>'+(notes.length?'<ul>'+notes.slice(0,12).join('')+'</ul>':'<p class="b17n">لا توجد ملاحظات حسب القواعد الحالية.</p>')+'</div>'
  +'<div class="bz-c"><h3>أداء كل إعلان</h3><div id="b52t"></div></div>';
 table()}
function ids100(L){return L.slice(0,100).map(function(l){return l.id})}
function table(){var L=D.L,n=L.length,pg=PG,sl=L.slice(pg*10,pg*10+10),c=D.c;if(!n){E('b52t').innerHTML='<p class="b17n">لا توجد إعلانات.</p>';return}
 E('b52t').innerHTML='<div style="overflow-x:auto"><table class="sp"><tr><th></th><th>الإعلان</th><th>الحالة</th><th>نُشر</th><th>مشاهدات</th><th>الفترة السابقة</th><th>مفضلة (الكل)</th><th>استفسارات</th></tr>'
  +sl.map(function(l){var im=D.imgs[l.id];return '<tr><td>'+(im?'<img src="'+X(c.storage.from('listing-images').getPublicUrl(im).data.publicUrl)+'" alt="" width="48" height="36" loading="lazy" decoding="async" style="object-fit:cover;border-radius:6px">':'')+'</td><td dir="auto">'+X(l.title)+'</td><td>'+X(ST[l.status]||l.status)+'</td><td>'+fdt(Date.parse(l.created_at))+'</td><td>'+l.views_now+'</td><td>'+(D.prevOK?l.views_prev:'—')+'</td><td>'+l.saves_total+'</td><td>'+(D.inq?(D.inq[l.id]||0):'—')+'</td></tr>'}).join('')+'</table></div>'
  +(n>10?'<div class="b15h"><button class="btn" data-b52="pg" data-v="-1"'+(pg?'':' disabled')+'>السابق</button><span>'+(pg+1)+' / '+Math.ceil(n/10)+'</span><button class="btn" data-b52="pg" data-v="1"'+((pg+1)*10>=n?' disabled':'')+'>التالي</button></div>':'')
  +'<small class="b17n">«—» تعني أن البيانات غير متاحة أو غير كافية للمقارنة. المشاهدات ليست أشخاصاً فريدين.</small>'}
function adminView(s,r){var ls=s.listing_status||{},first=s.first_event_at,cats=s.categories||[];
 var kp=k('أنشطة معتمدة',s.biz_approved,'عدد الأنشطة بحالة معتمد.')+k('أنشطة تنتظر المراجعة',s.biz_pending,'جديدة أو تحتاج معلومات.')+k('إعلانات منشورة',ls.published||0,'الآن.')+k('إعلانات معلّقة',ls.pending||0,'بانتظار المراجعة.')+k('إعلانات جديدة في الفترة',s.listings_new,'أُنشئت ضمن الفترة.')
  +k('بلاغات مفتوحة',s.reports_open,'تحتاج مراجعة.')+k('طلبات خدمة/قطع جديدة',s.service_requests_new,'B15 بحالة «جديد».')+k('طلبات شراء مفتوحة',s.buyer_requests_open,'B49 غير منتهية.')+k('تقييمات بانتظار المراجعة',s.reviews_pending,'B50.')
  +k('مشاهدات في الفترة',s.views_period,'مرات فتح تفاصيل الإعلانات (ليست أشخاصاً فريدين).')+k('محادثات نشطة في الفترة',s.convs_active,'لها آخر رسالة ضمن الفترة.');
 E('b52b').className='';E('b52b').innerHTML='<p class="b17n">'+coverage(first,r[0])+' المصدر: جداول المنصة الفعلية.</p><div class="bz-g">'+kp+'</div><div class="bz-c"><h3>النشاط حسب القسم</h3>'+(cats.length?'<table class="sp"><tr><th>القسم</th><th>إعلانات جديدة</th><th>مشاهدات</th></tr>'+cats.map(function(x){return '<tr><td>'+X(CAT[x.category]||x.category||'—')+'</td><td>'+x.new_listings+'</td><td>'+x.views+'</td></tr>'}).join('')+'</table>':'<p class="b17n">لا بيانات.</p>')+'</div>'}
document.addEventListener('click',function(e){var b=e.target.closest('[data-b52]');if(!b)return;var a=b.dataset.b52;
 if(a==='per'){P.k=b.dataset.v;if(P.k==='c'&&!P.from){var t=new Date(Date.now()+BG).toISOString().slice(0,10);P.from=P.to=t}shell(MODE==='adm'?'إحصائيات المنصة':'إحصائيات النشاط',MODE);if(P.k!=='c')load();else E('b52b').textContent='اختر الفترة ثم اضغط تطبيق.';return}
 if(a==='apply'){P.from=E('b52f').value;P.to=E('b52t').value;if(!P.from||!P.to||P.to<P.from){E('b52m').className='msg err';E('b52m').textContent='اختر تاريخاً صحيحاً (النهاية بعد البداية).';return}E('b52m').className='msg';E('b52m').textContent='';load();return}
 if(a==='pg'){PG=Math.max(0,PG+ +b.dataset.v);table();return}
 if(a==='retry')load()});
B52.biz=function(){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b52')});document.title='بحر | إحصائيات النشاط';if(!sbc()){E('b52c').innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}shell('إحصائيات النشاط','biz');load()};
B52.adm=function(){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b52')});document.title='بحر | إحصائيات المنصة';var c=sbc();if(!c){E('b52c').innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}shell('إحصائيات المنصة','adm');E('b52c').querySelector('p').innerHTML='<a class="btn" href="#admreviews">مراجعة التقييمات</a>';load()};
/* تسجيل المشاهدة: مرة لكل إعلان كل 30 دقيقة لكل جلسة؛ مفتاح عشوائي بلا بيانات شخصية؛ لا يؤثر على الصفحة عند الفشل */
var MK='';
function key(){try{var k=sessionStorage.getItem('b52k');if(!k){var a=new Uint8Array(12);crypto.getRandomValues(a);k=[].map.call(a,function(x){return('0'+x.toString(16)).slice(-2)}).join('');sessionStorage.setItem('b52k',k)}return k}catch(e){if(!MK){var a2=new Uint8Array(12);try{crypto.getRandomValues(a2)}catch(x){return''}MK=[].map.call(a2,function(x){return('0'+x.toString(16)).slice(-2)}).join('')}return MK}}
B52.view=function(id){try{if(navigator.webdriver||!PF.UUID.test(id))return;var c=sbc(),k=key();if(!c||!k)return;var m={};try{m=JSON.parse(sessionStorage.getItem('b52v')||'{}')}catch(e){}var n=Date.now();if(m[id]&&n-m[id]<18e5)return;m[id]=n;try{sessionStorage.setItem('b52v',JSON.stringify(m))}catch(e){}c.rpc('b52_log_view',{p_listing:id,p_key:k}).then(function(){},function(){})}catch(e){}};
var s52=B15.sync;B15.sync=function(){s52();var l=E('admStatLink'),c=sbc();if(l)l.style.display='none';if(l&&c&&AU.user)c.rpc('is_admin').then(function(r){if(!r.error&&r.data===true)l.style.display=''})};
})();

/* ===== B19: BAHR PARTS — اكتشاف قطع الغيار (بيانات الكتالوج من الخادم فقط: b19_parts_catalog.sql) ===== */
var B19={};
(function(){
var EQ={marine_engine:'محرك بحري',jetski:'جت سكي',boat:'قارب',other:'أخرى'};
var HPT={marine_engine:1,jetski:1},SNT={marine_engine:1,jetski:1,boat:1};
var FT={confirmed:['توافق مؤكد','published'],needs_verification:['بحاجة إلى تحقق','pending'],unknown:['بيانات التوافق غير متوفرة','new'],incompatible:['غير متوافقة','rejected']};
var AV={in_stock:'متوفرة',on_order:'بالطلب',out_of_stock:'غير متوفرة',unknown:'التوفر غير مؤكد'};
var X=function(v){return ex(v)},R=function(){return E('b19c')},MK=[],RS=[],F={},PD=null,busy=false,NF='لم تجد القطعة؟ أرسل طلب بحث عنها';
function say(t,x){var m=E('b19m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883'||/parts_/.test(m)&&/does not exist|schema cache/i.test(m))return 'كتالوج القطع غير مفعّل على الخادم بعد (يلزم تطبيق b19_parts_catalog.sql).';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة.';
 if(/jwt|expired/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 return 'حدث خطأ: '+m.slice(0,120)}
var fd=function(x){try{return new Date(x).toLocaleDateString('ar-IQ',{dateStyle:'medium'})}catch(e){return''}};
var d2=function(s){return String(s||'').replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632})};
function fl(id,l,t,x,w){return '<label id="w-'+id+'"'+(w?' data-w="'+w+'"':'')+'>'+l+'<input id="'+id+'" type="'+t+'" '+(x||'')+'></label>'}
function shell(){R().innerHTML='<h1>BAHR PARTS — قطع الغيار البحرية</h1><p class="b17n">اختر معدتك ثم ابحث عن القطعة. لا نعتبر القطعة متوافقة إلا إذا وُجد لها مصدر موثّق، وتشابه الأسماء ليس دليلاً على التوافق.</p><div id="b19s"></div><div id="b19m" class="msg" role="alert"></div>'
 +'<form id="b19f" novalidate><label>نوع المعدة<select id="p-t"><option value="">كل الأنواع</option>'+Object.keys(EQ).map(function(k){return '<option value="'+k+'">'+EQ[k]+'</option>'}).join('')+'</select></label>'
 +'<label>الشركة المصنعة<select id="p-mk"><option value="">أي شركة</option></select></label>'
 +'<label id="w-p-mt" hidden>اسم الشركة<input id="p-mt" maxlength="80"></label>'
 +'<div class="b17r">'+fl('p-mo','الموديل','text','maxlength="80" list="p-ml" autocomplete="off"')+'<datalist id="p-ml"></datalist>'+fl('p-y','سنة الصنع','text','inputmode="numeric" maxlength="4"')+'</div>'
 +'<div class="b17r">'+fl('p-hp','قوة المحرك بالحصان (عند توفرها)','text','inputmode="decimal" maxlength="6"','hp')+fl('p-sn','الرقم التسلسلي للمعدة (عند توفره)','text','maxlength="60" dir="ltr"','sn')+'</div>'
 +'<div class="b17r">'+fl('p-pn','رقم القطعة الأصلي (إن عرفته)','text','maxlength="60" dir="ltr"')+fl('p-q','اسم القطعة أو وصفها','text','maxlength="100"')+'</div>'
 +'<button class="btn btn-p" id="b19b" type="submit">بحث</button></form><div id="b19r" style="margin-top:14px"></div>';
 var f=E('b19f');f.addEventListener('submit',run);E('p-t').addEventListener('change',function(){vis();models()});E('p-mk').addEventListener('change',function(){vis();models()});vis()}
function vis(){var t=E('p-t').value,o=E('p-mk').value==='__o';E('w-p-mt').hidden=!o;if(!o)E('p-mt').value='';
 [].forEach.call(document.querySelectorAll('#b19f [data-w]'),function(w){var ok=w.dataset.w==='hp'?(!t||HPT[t]):(!t||SNT[t]);w.hidden=!ok;if(!ok)w.querySelector('input').value=''})}
function models(){var c=sbc(),mk=E('p-mk').value,t=E('p-t').value,dl=E('p-ml');dl.innerHTML='';if(!c||!mk||mk==='__o')return;
 var q=c.from('parts_models').select('model').eq('manufacturer_id',mk).limit(300);if(t)q=q.eq('equipment_type',t);
 q.then(function(r){if(r.error||!r.data)return;var s={};r.data.forEach(function(x){s[x.model]=1});dl.innerHTML=Object.keys(s).map(function(m){return '<option value="'+X(m)+'">'}).join('')})}
function status(c){var s=E('b19s');c.from('parts_manufacturers').select('id,name').eq('is_active',true).order('name').then(function(r){if(r.error)throw r.error;MK=r.data||[];
 E('p-mk').innerHTML='<option value="">أي شركة</option>'+MK.map(function(m){return '<option value="'+X(m.id)+'">'+X(m.name)+'</option>'}).join('')+'<option value="__o">شركة أخرى</option>';
 return c.from('parts_items').select('id',{count:'exact',head:true}).eq('status','published')}).then(function(r){if(!r)return;if(r.error)throw r.error;
 s.innerHTML=r.count?'':'<div class="sel"><b>الكتالوج قيد الإعداد.</b> لم تُضف بعد بيانات قطع وتوافق موثوقة (Yamaha وغيرها). يمكنك البحث، وإن لم تجد القطعة أرسل طلب بحث وسنتولى التحقق منها.</div>'})
 .catch(function(e){s.innerHTML='<div class="msg err">'+X(emsg(e))+'</div>'})}
function ctx(){var v=function(i){var e=E(i);return e&&!e.closest('[hidden]')?e.value.trim():''},mk=E('p-mk').value;
 var mkn=mk==='__o'?v('p-mt'):(MK.filter(function(m){return m.id===mk})[0]||{}).name||'';
 return{t:E('p-t').value,mk:(mk&&mk!=='__o')?mk:'',mkn:mkn,mo:v('p-mo'),y:d2(v('p-y')),hp:d2(v('p-hp')).replace(',','.'),sn:d2(v('p-sn')),pn:d2(v('p-pn')),q:v('p-q')}}
function run(e){e.preventDefault();if(busy)return;var c=sbc();if(!c){say('err','تعذّر الاتصال بالخدمة. حدّث الصفحة.');return}
 var k=ctx(),y=k.y?Number(k.y):null,hp=k.hp?Number(k.hp):null,ny=new Date().getFullYear()+1;
 if(k.y&&(!/^\d{4}$/.test(k.y)||y<1950||y>ny)){say('err','سنة الصنع غير صحيحة.');return}
 if(k.hp&&(!isFinite(hp)||hp<0)){say('err','قوة المحرك غير صحيحة.');return}
 F=k;say('');busy=true;var b=E('b19b');b.disabled=true;b.textContent='جارٍ البحث…';E('b19r').innerHTML='<p class="b17n">جارٍ البحث…</p>';
 c.rpc('parts_search',{p_make:k.mk||null,p_type:k.t||null,p_model:k.mo||null,p_year:y,p_hp:hp,p_part_no:k.pn||null,p_q:k.q||null}).then(function(r){if(r.error)throw r.error;RS=r.data||[];draw();if(!RS.length&&AU.user)c.rpc('parts_log_search',{p_type:k.t||null,p_make:k.mkn||null,p_model:k.mo||null,p_part_no:k.pn||null,p_q:k.q||null,p_count:0}).then(function(){},function(){})})
 .catch(function(x){E('b19r').innerHTML='<div class="msg err">'+X(emsg(x))+'</div>'}).then(function(){busy=false;b.disabled=false;b.textContent='بحث'})}
function nf(){return '<div class="sel"><b>'+(RS.length?'لم تجد ما تبحث عنه؟':'لا توجد نتائج مطابقة في الكتالوج.')+'</b><p style="margin:6px 0">قد لا تكون القطعة مُدخلة بعد. أرسل طلب بحث وستُعبّأ بيانات معدتك تلقائياً.</p><button class="btn btn-p" data-a19="nf" type="button">'+NF+'</button></div>'}
function draw(){var el=E('b19r');if(!RS.length){el.innerHTML=nf();return}
 el.innerHTML='<div class="b17r"><label>تصفية حسب التوافق<select id="p-ff"><option value="">الكل</option><option value="confirmed">توافق مؤكد</option><option value="needs_verification">بحاجة إلى تحقق</option><option value="unknown">بيانات غير متوفرة</option></select></label><label>الترتيب<select id="p-so"><option value="f">حالة التوافق</option><option value="n">اسم القطعة</option><option value="p">رقم القطعة</option><option value="o">عدد العروض</option></select></label></div><div id="b19l"></div>';
 E('p-ff').addEventListener('change',list);E('p-so').addEventListener('change',list);list()}
function list(){var f=E('p-ff').value,s=E('p-so').value,L=RS.filter(function(x){return!f||x.fitment===f}),O={confirmed:0,needs_verification:1,unknown:2,incompatible:3};
 L.sort(function(a,b){return s==='n'?a.name.localeCompare(b.name):s==='p'?a.part_number.localeCompare(b.part_number):s==='o'?b.offers-a.offers:(O[a.fitment]-O[b.fitment])||a.name.localeCompare(b.name)});
 E('b19l').innerHTML=(L.length?L.map(function(x){var t=FT[x.fitment]||FT.unknown;return '<a class="b17c b15r" href="#part-'+X(x.part_id)+'" style="display:block"><div class="b15h"><b>'+X(x.name)+'</b> <span class="bd '+t[1]+'">'+t[0]+'</span></div><small dir="auto">'+X(x.manufacturer)+' · رقم القطعة: <span dir="ltr">'+X(x.part_number)+'</span></small><div style="margin-top:4px">'+(x.offers?'عروض مسجّلة: '+x.offers:'لا توجد عروض مسجّلة')+' · عرض التفاصيل ›</div></a>'}).join(''):'<div class="b17n">لا توجد نتائج بهذه التصفية.</div>')+nf()}
function home(){var c=sbc();shell();status(c)}
function part(id){var c=sbc();PD=null;R().innerHTML='<p><a class="btn" href="#parts">‹ البحث</a></p><div id="b19m" class="msg"></div><div id="b19d" class="b17n">جارٍ التحميل…</div>';
 Promise.all([c.from('parts_items').select('id,part_number,name,description,image_url,image_license,image_credit,manufacturer_id,parts_manufacturers(name)').eq('id',id).maybeSingle(),
  c.from('parts_fitment').select('status,year_from,year_to,verified_at,note,parts_models(equipment_type,model,year_from,year_to,power_hp),parts_sources(kind,title,reference,verified_at)').eq('part_id',id),
  c.from('parts_offers_public').select('*').eq('part_id',id).order('confirmed_at',{ascending:false})]).then(function(a){
  for(var i=0;i<3;i++)if(a[i].error)throw a[i].error;var p=a[0].data;if(!p){E('b19d').className='';E('b19d').innerHTML='هذه القطعة غير موجودة أو غير منشورة.';return}
  PD=p;var mn=(p.parts_manufacturers||{}).name||'',fit=a[1].data||[],of=a[2].data||[];var cu=function(o){return o.currency||'USD'},lw={},cn={};of.sort(function(x,y){var a1=cu(x),b1=cu(y);if(a1!==b1)return a1<b1?-1:1;if(x.price==null)return y.price==null?0:1;if(y.price==null)return -1;return Number(x.price)-Number(y.price)});of.forEach(function(o){if(o.price!=null){var k=cu(o);cn[k]=(cn[k]||0)+1;if(lw[k]==null||Number(o.price)<lw[k])lw[k]=Number(o.price)}});
  var yr=function(m,f){var a1=f.year_from||m.year_from,b1=f.year_to||m.year_to;return a1||b1?' · '+(a1||'')+(b1&&b1!==a1?'–'+b1:''):''};
  var fr=function(f){var m=f.parts_models||{},s=f.parts_sources;return '<div class="sel"><b dir="auto">'+X(mn)+' '+X(m.model||'')+'</b> · '+X(EQ[m.equipment_type]||'')+X(yr(m,f))+(m.power_hp?' · '+X(m.power_hp)+' حصان':'')+((f.status==='confirmed'||f.status==='incompatible')&&s?'<br><small>المصدر: '+X(s.title)+(s.reference?' ('+X(s.reference)+')':'')+' · تاريخ التحقق: '+fd(f.verified_at||s.verified_at)+'</small>':'<br><small>لم يُتحقق منه بعد، لا تعتمد عليه قبل التأكد.</small>')+(f.note?'<br><small>'+X(f.note)+'</small>':'')+'</div>'};
  var cf=fit.filter(function(f){return f.status==='confirmed'}),nv=fit.filter(function(f){return f.status!=='confirmed'&&f.status!=='incompatible'}),ic=fit.filter(function(f){return f.status==='incompatible'});
  E('b19d').className='';E('b19d').innerHTML='<div class="b17c b15r" style="display:block"><h2 style="margin:0 0 4px" dir="auto">'+X(p.name)+'</h2><div dir="auto">'+X(mn)+' · رقم القطعة: <b dir="ltr">'+X(p.part_number)+'</b></div>'
   +(p.image_url&&p.image_license?'<img src="'+X(p.image_url)+'" alt="'+X(p.name)+'" style="max-width:100%;max-height:260px;border-radius:10px;margin:8px 0" loading="lazy" decoding="async"><br><small>'+X(p.image_credit||'')+' · '+X(p.image_license)+'</small>':'')
   +(p.description?'<p style="white-space:pre-wrap">'+X(p.description)+'</p>':'')
   +'<h3>التوافق</h3><p class="b17n">مؤكد: مصدر موثّق يحدد المعدة. بحاجة إلى تحقق: بيانات جزئية. غير معروف: لا بيانات كافية. تطابق الاسم أو الموديل وحده ليس دليلاً.</p>'+(ic.length?'<h4>غير متوافقة</h4>'+ic.map(fr).join(''):'')+(cf.length?'<h4>توافق مؤكد</h4>'+cf.map(fr).join(''):'')+(nv.length?'<h4>بحاجة إلى تحقق</h4>'+nv.map(fr).join(''):'')+(fit.length?'':'<p class="b17n">بيانات التوافق غير متوفرة لهذه القطعة. تأكد من توافقها مع معدتك قبل الشراء.</p>')
   +'<h3>الموردون المسجّلون في بحر</h3>'+(of.length>1?'<p class="b17n">العروض مرتّبة من الأقل سعراً، وتُقارَن الأسعار بالعملة نفسها فقط. راجع التوفر وتاريخ آخر تأكيد قبل الشراء.</p>':'')+(of.length?of.map(function(o){return '<div class="sel"><b>'+X(o.supplier_name)+'</b>'+(o.price!=null?' · '+fm(Number(o.price),cu(o))+(cn[cu(o)]>1&&Number(o.price)===lw[cu(o)]?' <span class="bd published">الأقل سعراً</span>':''):'')+(o.price==null?' · <small>السعر غير محدد</small>':'')+' · '+X(AV[o.availability]||'التوفر غير مؤكد')+(isNaN(Date.parse(o.confirmed_at))||Date.now()-Date.parse(o.confirmed_at)>2592e6?' <span class="bd pending">يحتاج تحديثاً: تواصل مع المورد لتأكيد السعر والتوفر</span>':'')+((o.province||o.area)?'<br><small>'+X([o.province,o.area].filter(Boolean).join('، '))+'</small>':'')+'<br><small>آخر تأكيد: '+fd(o.confirmed_at)+'</small>'+(o.supplier_id?'<br><button class="btn" data-cn="part|'+X(PD.id)+'|'+X(o.supplier_id)+'" type="button">مراسلة داخل بحر</button>':'')+'</div>'}).join(''):'<p class="b17n">لا توجد عروض مسجّلة من الموردين بعد. اطلب القطعة وسنبحث لك.</p>')
   +'<p><button class="btn btn-p" data-a19="req" type="button">اطلب هذه القطعة</button> <button class="btn" data-b60="fav" data-p="'+X(PD.id)+'" type="button">حفظ / إلغاء حفظ القطعة</button></p><p><button class="btn" data-b60="rpt" data-p="'+X(PD.id)+'" type="button">الإبلاغ عن معلومة خاطئة</button></p></div>'
 }).catch(function(e){E('b19d').className='';E('b19d').innerHTML='<div class="msg err">'+X(emsg(e))+'</div>'})}
function go(p){window.BAHR_RP=p;location.hash='#requestpart'}
document.addEventListener('click',function(e){var b=e.target.closest('[data-a19]');if(!b)return;var k=F||{},x=k.sn?'\nالرقم التسلسلي للمعدة: '+k.sn:'';
 if(b.dataset.a19==='req'&&PD)go({e:k.t||'',m:(PD.parts_manufacturers||{}).name||k.mkn||'',mo:k.mo||'',y:k.y||'',hp:k.hp||'',pn:PD.name,sn:PD.part_number,d:'القطعة من كتالوج بحر: '+PD.name+' — رقم القطعة: '+PD.part_number+'\nالتوافق مع معدتي يحتاج إلى تأكيد.'+x});
 else if(b.dataset.a19==='nf')go({e:k.t||'',m:k.mkn||'',mo:k.mo||'',y:k.y||'',hp:k.hp||'',pn:k.q||'',sn:k.pn||k.sn||'',d:'طلب بحث عن قطعة لم أجدها في كتالوج بحر'+(k.q?': '+k.q:'')+(k.pn?'\nرقم القطعة: '+k.pn:'')+(k.pn&&k.sn?'\nالرقم التسلسلي للمعدة: '+k.sn:'')+'\nأحتاج تأكيد التوافق والتوفر.'})});
B19.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b19')});document.title='قطع الغيار | بحر';
 if(!sbc()){R().innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}
 if(k==='parts')home();else part(k.slice(5))};
})();

/* ===== B20: BAHR BUSINESS (حساب المورد) + مراجعة الإدارة لقطع الغيار (b20_parts_completion.sql) ===== */
var B20={};
(function(){
var X=function(v){return ex(v)},R=function(){return E('b20c')},busy=false;
var PV=['البصرة','بغداد','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var RV={draft:'مسودة',pending:'قيد المراجعة',published:'منشور',suspended:'موقوف من الإدارة',rejected:'مرفوض'},AV={in_stock:'متوفرة',on_order:'بالطلب',out_of_stock:'غير متوفرة',unknown:'غير مؤكد'};
var fd=function(x){try{return new Date(x).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}catch(e){return''}};
var d2=function(s){return String(s||'').replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632})};
function say(t,x){var m=E('b20m');if(m){m.className='msg'+(t?' '+t:'');m.textContent=x||''}}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'ميزة الموردين غير مفعّلة على الخادم بعد (يلزم تطبيق b19 ثم b20_parts_completion.sql).';
 if(/forbidden|row-level|42501|policy/i.test(m))return 'لا تملك صلاحية تنفيذ هذا الإجراء.';
 if(/reason_required/.test(m))return 'السبب مطلوب.';
 if(/23505|duplicate/i.test(c+m))return 'يوجد طلب أو سجل مطابق بالفعل.';
 if(/jwt|expired/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت.';
 return 'حدث خطأ: '+m.slice(0,120)}
function fl(k,l,t,x){return '<label>'+l+'<input data-k="'+k+'" type="'+t+'" '+(x||'')+'></label>'}
function sl(k,l,o,ph){return '<label>'+l+'<select data-k="'+k+'">'+(ph?'<option value="">'+ph+'</option>':'')+o.map(function(a){return '<option value="'+X(a[0])+'">'+X(a[1])+'</option>'}).join('')+'</select></label>'}
var CUR=[['USD','دولار'],['IQD','دينار عراقي']],AVO=Object.keys(AV).map(function(k){return[k,AV[k]]}),PVO=PV.map(function(p){return[p,p]});
function val(w,k){var e=w.querySelector('[data-k="'+k+'"]');return e?e.value.trim():''}
function head(t){return '<h1>'+t+'</h1><div id="b20m" class="msg" role="alert"></div>'}
function load(){R().innerHTML='<p class="b17n">جارٍ التحميل…</p>'}
function fail(e){R().innerHTML=head('')+'<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'}
/* ---------- المورد ---------- */
function biz(){var c=sbc(),uid=AU.user.id;load();
 Promise.all([c.from('parts_suppliers').select('*').eq('user_id',uid).maybeSingle(),c.from('parts_supplier_requests').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(1)]).then(function(a){
  if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;var s=a[0].data,q=(a[1].data||[])[0];
  if(s&&s.is_approved)return hub(c,s);
  var h=head('BAHR BUSINESS — حساب المورد');
  if(q&&q.status==='pending'){R().innerHTML=h+'<div class="sel">طلبك لفتح حساب مورد <b>قيد المراجعة</b> منذ '+fd(q.created_at)+'. لا يمكنك نشر عروض قبل اعتماده من الإدارة.</div>';return}
  R().innerHTML=h+(q&&q.status==='rejected'?'<div class="msg err" style="display:block">رُفض طلبك السابق'+(q.reject_reason?': '+X(q.reject_reason):'')+'. يمكنك تعديل البيانات وإعادة الإرسال.</div>':'')
   +'<p class="b17n">حساب المورد لا يُفعَّل تلقائياً: يُراجَع طلبك من إدارة بحر أولاً.</p><div id="b20f" class="b17">'+fl('bn','اسم النشاط التجاري','text','maxlength="100"')+'<label>وصف مختصر<textarea data-k="ds" rows="3" maxlength="500"></textarea></label>'+sl('pv','المحافظة',PVO,'اختر المحافظة')+fl('ar','المنطقة (اختياري)','text','maxlength="80"')+fl('ph','رقم الهاتف','text','maxlength="30" dir="ltr" inputmode="tel"')+fl('wa','واتساب (اختياري)','text','maxlength="30" dir="ltr" inputmode="tel"')+'<button class="btn btn-p" data-b20="apply" type="button">إرسال الطلب</button></div>'
 }).catch(fail)}
function oc(o){var p=o.parts_items||{},st=o.review_status,pub=st==='published';
 return '<div class="b17c b15r" style="display:block" data-oid="'+X(o.id)+'"><div class="b15h"><b dir="auto">'+X(p.name||'')+'</b> <span dir="ltr">'+X(p.part_number||'')+'</span> <span class="bd '+(pub?'published':st==='rejected'||st==='suspended'?'rejected':'pending')+'">'+X(RV[st]||st)+'</span>'+(o.status==='hidden'?' <span class="bd rejected">متوقف</span>':'')+'</div>'
 +(o.reject_reason?'<div class="msg err" style="display:block">سبب الرفض/الإيقاف: '+X(o.reject_reason)+'</div>':'')+'<small>آخر تأكيد: '+fd(o.confirmed_at)+'</small>'
 +'<div class="b17r">'+fl('pr','السعر','number','min="0" step="any" value="'+X(o.price==null?'':o.price)+'"')+'<label>العملة<select data-k="cu"><option'+(o.currency!=='IQD'?' selected':'')+' value="USD">دولار</option><option'+(o.currency==='IQD'?' selected':'')+' value="IQD">دينار عراقي</option></select></label></div>'
 +'<label>التوفر<select data-k="av">'+AVO.map(function(a){return '<option value="'+a[0]+'"'+(a[0]===o.availability?' selected':'')+'>'+a[1]+'</option>'}).join('')+'</select></label>'
 +'<div class="b15h"><button class="btn" data-b20="save" type="button">حفظ السعر والتوفر</button>'+((st==='draft'||st==='rejected')?'<button class="btn btn-p" data-b20="submit" type="button">إرسال للمراجعة</button>':'')+'<button class="btn" data-b20="tog" data-s="'+(o.status==='hidden'?'active':'hidden')+'" type="button">'+(o.status==='hidden'?'إعادة التفعيل':'إيقاف')+'</button><button class="btn" data-b20="hist" type="button">سجل التعديلات</button></div><div data-h></div></div>'}
function hub(c,s){var uid=AU.user.id;
 return c.from('parts_offers').select('id,price,currency,availability,status,review_status,reject_reason,confirmed_at,parts_items(name,part_number)').eq('supplier_id',uid).order('created_at',{ascending:false}).then(function(r){if(r.error)throw r.error;var L=r.data||[];
 R().innerHTML=head('BAHR BUSINESS — '+X(s.name))+'<p class="b17n">كل عرض جديد يُراجَع من الإدارة قبل ظهوره للعامة. لا تغيّر توافق القطع بنفسك: أرسل اقتراحاً للمراجعة.</p>'
  +'<h3>إضافة عرض لقطعة في الكتالوج</h3><div id="b20a" class="b17"><div class="b17r">'+fl('sq','ابحث برقم القطعة أو اسمها','text','maxlength="60"')+'<button class="btn" data-b20="find" type="button">بحث</button></div><label>القطعة<select data-k="pt"><option value="">ابحث أولاً</option></select></label>'
  +'<div class="b17r">'+fl('pr','السعر (اختياري)','number','min="0" step="any"')+sl('cu','العملة',CUR)+'</div>'+sl('av','التوفر',AVO)+'<div class="b17r">'+sl('pv','المحافظة',PVO,'اختر')+fl('ar','المنطقة','text','maxlength="80"')+'</div>'+fl('sn','رقم القطعة عندك (اختياري)','text','maxlength="60" dir="ltr"')
  +'<div class="b15h"><button class="btn" data-b20="add" data-r="draft" type="button">حفظ كمسودة</button><button class="btn btn-p" data-b20="add" data-r="pending" type="button">إرسال للمراجعة</button></div></div>'
  +'<h3>عروضي</h3>'+(L.length?L.map(oc).join(''):'<p class="b17n">لا توجد عروض بعد.</p>')
  +'<h3>اقتراح تعديل أو قطعة جديدة</h3><div id="b20s" class="b17"><div class="b17r">'+fl('pn','رقم القطعة','text','maxlength="60" dir="ltr"')+fl('nm','اسم القطعة','text','maxlength="200"')+'</div>'+fl('mt','الموديل المقصود','text','maxlength="120"')+'<label>التفاصيل (مطلوبة)<textarea data-k="dt" rows="3" maxlength="1000"></textarea></label>'+fl('sr','المصدر (كتالوج، نشرة...)','text','maxlength="500"')+'<button class="btn" data-b20="sug" type="button">إرسال الاقتراح للمراجعة</button></div>'})}
function done(m){toast(m);B20.page(location.hash.slice(1))}
function act(b,fn){if(busy)return;busy=true;b.disabled=true;say('in','جارٍ التنفيذ…');var c=sbc();Promise.resolve().then(function(){return fn(c)}).then(function(r){if(r&&r.error)throw r.error;busy=false}).catch(function(e){busy=false;b.disabled=false;say('err',emsg(e))})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-b20]');if(!b||!AU.user)return;var k=b.dataset.b20,w=b.closest('[data-oid]')||b.closest('#b20a,#b20s,#b20f,[data-q]')||document,id=w.dataset&&(w.dataset.oid||w.dataset.q);
 if(k==='find'){var q=d2(val(w,'sq')).replace(/[%,()]/g,'');if(q.length<2){say('err','اكتب حرفين على الأقل.');return}act(b,function(c){return c.from('parts_items').select('id,name,part_number').eq('status','published').or('part_number.ilike.%'+q+'%,name.ilike.%'+q+'%').limit(15).then(function(r){if(r.error)throw r.error;var s=w.querySelector('[data-k="pt"]');s.innerHTML=r.data.length?r.data.map(function(p){return '<option value="'+X(p.id)+'">'+X(p.name)+' — '+X(p.part_number)+'</option>'}).join(''):'<option value="">لا توجد قطع منشورة مطابقة</option>';busy=false;b.disabled=false;say(r.data.length?'':'err',r.data.length?'':'لا توجد قطعة منشورة بهذا الرقم. اقترح إضافتها من النموذج أدناه.')})});return}
 if(k==='add'){var pt=val(w,'pt'),pr=val(w,'pr'),pv=val(w,'pv');if(!pt){say('err','اختر القطعة من نتائج البحث.');return}if(!pv){say('err','اختر المحافظة.');return}if(pr&&(!isFinite(Number(pr))||Number(pr)<0)){say('err','السعر غير صحيح.');return}
  act(b,function(c){return c.from('parts_offers').insert({part_id:pt,supplier_id:AU.user.id,price:pr?Number(pr):null,currency:pr?val(w,'cu'):null,availability:val(w,'av'),province:pv,area:val(w,'ar')||null,supplier_part_number:val(w,'sn')||null,review_status:b.dataset.r}).select('id').then(function(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('forbidden');done(b.dataset.r==='pending'?'أُرسل العرض للمراجعة.':'حُفظت المسودة.')})});return}
 if(k==='save'||k==='submit'||k==='tog'){var u=k==='tog'?{status:b.dataset.s}:k==='submit'?{review_status:'pending'}:(function(){var p=val(w,'pr');return{price:p?Number(p):null,currency:p?val(w,'cu'):null,availability:val(w,'av')}})();
  if(u.price!=null&&(!isFinite(u.price)||u.price<0)){say('err','السعر غير صحيح.');return}
  act(b,function(c){return c.from('parts_offers').update(u).eq('id',id).select('id').then(function(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('forbidden');done('تم الحفظ.')})});return}
 if(k==='hist'){var h=w.querySelector('[data-h]');h.innerHTML='جارٍ التحميل…';sbc().from('parts_offer_history').select('*').eq('offer_id',id).order('created_at',{ascending:false}).limit(30).then(function(r){h.innerHTML=r.error?X(emsg(r.error)):(r.data.length?r.data.map(function(x){return '<div class="b15e"><small>'+fd(x.created_at)+'</small> السعر: '+(x.old_price!=null?X(x.old_price)+' ← ':'')+(x.new_price!=null?X(x.new_price)+' '+X(x.currency||''):'—')+' · التوفر: '+X(AV[x.new_availability]||'')+'</div>'}).join(''):'لا يوجد سجل.')});return}
 if(k==='apply'){var bn=val(w,'bn'),ph=d2(val(w,'ph')).replace(/[\s-]/g,''),wa=d2(val(w,'wa')).replace(/[\s-]/g,'');if(bn.length<2){say('err','اكتب اسم النشاط.');return}if(!val(w,'pv')){say('err','اختر المحافظة.');return}if(!/^\+?[0-9]{7,15}$/.test(ph)){say('err','أدخل رقم هاتف صحيحاً.');return}if(wa&&!/^\+?[0-9]{7,15}$/.test(wa)){say('err','رقم واتساب غير صحيح.');return}
  act(b,function(c){return c.from('parts_supplier_requests').insert({user_id:AU.user.id,business_name:bn,description:val(w,'ds')||null,province:val(w,'pv'),area:val(w,'ar')||null,phone:ph,whatsapp:wa||null}).then(function(r){if(r.error)throw r.error;done('أُرسل طلبك للمراجعة.')})});return}
 if(k==='sug'){var dt=val(w,'dt');if(dt.length<5){say('err','اكتب التفاصيل (5 أحرف على الأقل).');return}
  act(b,function(c){return c.from('parts_suggestions').insert({supplier_id:AU.user.id,proposed_part_number:val(w,'pn')||null,proposed_name:val(w,'nm')||null,model_text:val(w,'mt')||null,details:dt,source_note:val(w,'sr')||null}).then(function(r){if(r.error)throw r.error;done('أُرسل الاقتراح للمراجعة.')})});return}
 /* ---- الإدارة ---- */
 if(k.slice(0,2)==='a_'){var why=null;if(/rej|sus|no/.test(k)){why=prompt('اكتب السبب (يظهر لصاحب الطلب):');if(!why||!why.trim())return}
  var rpc=k==='a_sa'||k==='a_sr'?['parts_admin_decide_supplier',{p_request:id,p_approve:k==='a_sa',p_reason:why}]:k.slice(0,4)==='a_o_'?['parts_admin_review_offer',{p_id:id,p_decision:({pub:'published',rej:'rejected',sus:'suspended'})[k.slice(4)],p_reason:why}]:['parts_admin_decide_suggestion',{p_id:id,p_accept:k==='a_ga',p_note:why}];
  act(b,function(c){return c.rpc(rpc[0],rpc[1]).then(function(r){if(r.error)throw r.error;done('تم تنفيذ الإجراء.')})})}});
function adm(){var c=sbc();load();c.rpc('is_admin').then(function(a){if(a.error||a.data!==true)throw new Error('forbidden');
 return Promise.all([c.from('parts_supplier_requests').select('*').eq('status','pending').order('created_at').limit(50),c.from('parts_offers').select('id,price,currency,availability,province,confirmed_at,parts_items(name,part_number),parts_suppliers(name)').eq('review_status','pending').order('created_at').limit(50),c.from('parts_suggestions').select('*,parts_suppliers(name)').eq('status','pending').order('created_at').limit(50),c.rpc('parts_admin_demand'),c.from('parts_audit').select('*').order('created_at',{ascending:false}).limit(20)])}).then(function(a){
 for(var i=0;i<a.length;i++)if(a[i].error)throw a[i].error;var B=function(k,t,x){return '<button class="btn'+(x||'')+'" data-b20="'+k+'" type="button">'+t+'</button>'},card=function(id,h){return '<div class="b17c b15r" style="display:block" data-q="'+X(id)+'">'+h+'</div>'},em=function(n,l){return l.length?l.join(''):'<p class="b17n">'+n+'</p>'};
 R().innerHTML=head('إدارة قطع الغيار')+'<p class="b17n">إدخال الشركات والموديلات والقطع والتوافق ما زال من Supabase Table Editor؛ هنا مراجعة الموردين والعروض والاقتراحات.</p>'
  +'<h3>طلبات حسابات الموردين ('+a[0].data.length+')</h3>'+em('لا توجد طلبات.',a[0].data.map(function(r){return card(r.id,'<b>'+X(r.business_name)+'</b> · '+X(r.province)+'<br><small dir="ltr">'+X(r.phone||'')+(r.whatsapp?' · '+X(r.whatsapp):'')+'</small><p>'+X(r.description||'')+'</p><div class="b15h">'+B('a_sa','اعتماد',' btn-p')+B('a_sr','رفض')+'</div>')}))
  +'<h3>عروض بانتظار المراجعة ('+a[1].data.length+')</h3>'+em('لا توجد عروض.',a[1].data.map(function(o){var p=o.parts_items||{};return card(o.id,'<b dir="auto">'+X(p.name||'')+'</b> <span dir="ltr">'+X(p.part_number||'')+'</span><br><small>المورد: '+X((o.parts_suppliers||{}).name||'')+' · '+(o.price!=null?X(o.price)+' '+X(o.currency||''):'بلا سعر')+' · '+X(AV[o.availability]||'')+' · '+X(o.province||'')+'</small><div class="b15h">'+B('a_o_pub','نشر',' btn-p')+B('a_o_rej','رفض')+B('a_o_sus','إيقاف')+'</div>')}))
  +'<h3>اقتراحات الموردين ('+a[2].data.length+')</h3>'+em('لا توجد اقتراحات.',a[2].data.map(function(g){return card(g.id,'<small>'+X((g.parts_suppliers||{}).name||'')+'</small><br><b dir="auto">'+X(g.proposed_name||'')+'</b> <span dir="ltr">'+X(g.proposed_part_number||'')+'</span> '+X(g.model_text||'')+'<p>'+X(g.details)+'</p>'+(g.source_note?'<small>المصدر: '+X(g.source_note)+'</small>':'')+'<div class="b15h">'+B('a_ga','قبول للمراجعة اليدوية',' btn-p')+B('a_gr','رفض')+'</div>')}))
  +'<h3>عمليات بحث بلا نتائج</h3>'+em('لا توجد بيانات بعد.',a[3].data.map(function(d){return '<div class="b15e">'+X(d.label||'(بلا نص)')+' — '+X(d.n)+' مرة</div>'}))
  +'<h3>آخر إجراءات الإدارة</h3>'+em('لا توجد إجراءات.',a[4].data.map(function(l){return '<div class="b15e"><small>'+fd(l.created_at)+'</small> '+X(l.action)+'</div>'}))+'<div id="b63adm"></div>';
 if(window.B63&&B63.adminMount)B63.adminMount(E('b63adm'))
 }).catch(function(e){R().innerHTML=head('إدارة قطع الغيار')+'<div class="msg err" style="display:block">'+X(/forbidden/.test(String(e&&e.message))?'هذه الصفحة للمشرفين فقط.':emsg(e))+'</div>'})}
B20.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b20')});document.title='بحر | قطع الغيار';
 if(!sbc()){R().innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}k==='admparts'?adm():biz()};
var s0=B15.sync;B15.sync=function(){s0();var l=E('admPartsLink'),c=sbc();if(l)l.style.display='none';if(l&&c&&AU.user)c.rpc('is_admin').then(function(r){if(!r.error&&r.data===true)l.style.display=''})};
})();

/* ===== B21: BAHR BUSINESS — تسجيل الأنشطة ولوحة النشاط والصفحة العامة ومراجعة الإدارة (b21_business.sql) ===== */
var B21={};
(function(){
var B63={};
var X=function(v){return ex(v)},R=function(){return E('b21c')},busy=false,AF='pending';
var PV=['البصرة','بغداد','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var TY={parts_store:'متجر قطع غيار بحرية',boat_engine_dealer:'تاجر قوارب ومحركات بحرية',jetski_dealer:'تاجر جت سكي',wholesale_supplier:'مورد قطع غيار بالجملة',workshop:'ورشة صيانة بحرية',technician:'فني أو مقدم خدمة بحرية'};
var ST={draft:'مسودة',pending:'بانتظار المراجعة',need_info:'يحتاج معلومات إضافية',approved:'مقبول',rejected:'مرفوض',suspended:'موقوف مؤقتاً'};
var PARTS={parts_store:1,wholesale_supplier:1},DEAL={boat_engine_dealer:1,jetski_dealer:1,parts_store:1};
var fd=function(x){try{return new Date(x).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}catch(e){return''}};
var d2=function(s){return String(s||'').replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632})};
var PH=/^\+?[0-9]{7,15}$/;
function say(t,x){var m=E('b21m');if(m){m.className='msg'+(t?' '+t:'');m.style.display=x?'block':'';m.textContent=x||''}}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'نظام الأنشطة غير مفعّل على الخادم بعد (يلزم تطبيق b19 وb20 ثم b21_business.sql).';
 if(c==='42703'||/column .*(biz_id|price_mode|is_paused|coverage_areas|provider_status)/i.test(m))return 'يلزم تشغيل b33_services_pro.sql على Supabase أولاً.';
 if(c==='23514')return 'قيمة غير مسموحة: راجع نوع الخدمة والسعر.';
 if(/locked_fields/.test(m))return 'لا يمكن تغيير الاسم أو النوع بعد الإرسال. تواصل مع الإدارة.';
 if(/forbidden|row-level|42501|policy/i.test(m))return 'لا تملك صلاحية تنفيذ هذا الإجراء.';
 if(/invalid_action/.test(m))return 'الإجراء غير متاح في الحالة الحالية (أو السبب مطلوب).';
 if(c==='23505')return 'لديك نشاط مسجّل بالفعل.';
 if(/jwt|expired/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت.';
 return 'حدث خطأ: '+m.slice(0,120)}
function head(t){return '<h1>'+t+'</h1><div id="b21m" class="msg" role="alert"></div>'}
function fail(e){R().innerHTML=head('')+'<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'}
function fl(k,l,t,v,x){return '<label>'+l+'<input data-k="'+k+'" type="'+t+'" value="'+X(v==null?'':v)+'" '+(x||'')+'></label>'}
function val(w,k){var e=w.querySelector('[data-k="'+k+'"]');return e?e.value.trim():''}
function wa(n){n=d2(n).replace(/[\s-]/g,'');if(!PH.test(n))return'';n=n.replace(/^\+/,'');return n[0]==='0'?'964'+n.slice(1):n}
function form(b,p){var lock=b&&(b.status==='pending'||b.status==='approved'),ed=!b||b.status==='draft'||b.status==='need_info'||b.status==='rejected';b=b||{};p=p||{};
 return '<div id="b21f" class="b17"><label>نوع النشاط<select data-k="ty"'+(lock?' disabled':'')+'>'+(b.business_type?'':'<option value="">اختر نوع النشاط</option>')+Object.keys(TY).map(function(k){return '<option value="'+k+'"'+(k===b.business_type?' selected':'')+'>'+TY[k]+'</option>'}).join('')+'</select></label>'
 +fl('nm','اسم النشاط التجاري','text',b.name,'maxlength="100"'+(lock?' disabled':''))+'<label>وصف النشاط<textarea data-k="ds" rows="4" maxlength="1000">'+X(b.description||'')+'</textarea></label>'
 +'<div class="b17r"><label>المحافظة<select data-k="pv"><option value="">اختر</option>'+PV.map(function(x){return '<option'+(x===b.province?' selected':'')+'>'+x+'</option>'}).join('')+'</select></label>'+fl('ar','المنطقة','text',b.area,'maxlength="80"')+'</div>'
 +fl('ad','العنوان الوصفي','text',b.address_text,'maxlength="200"')+'<div class="b17r">'+fl('ph','رقم الهاتف','text',b.phone,'maxlength="30" dir="ltr" inputmode="tel"')+fl('wa','واتساب (اختياري)','text',b.whatsapp,'maxlength="30" dir="ltr" inputmode="tel"')+'</div>'
 +'<label><input data-k="sc" type="checkbox"'+(b.show_contact===false?'':' checked')+'> إظهار أرقام التواصل في صفحة النشاط العامة</label>'
 +fl('wh','ساعات العمل (اختياري)','text',b.work_hours,'maxlength="200"')+fl('ct','فئات المنتجات أو الخدمات','text',b.categories,'maxlength="300"')
 +'<label>معلومات التحقق (خاصة: لا تظهر للعامة، تراها الإدارة فقط)<textarea data-k="vi" rows="3" maxlength="1000" placeholder="مثل: رقم السجل التجاري أو رابط صفحة النشاط">'+X(p.verification_info||'')+'</textarea></label>'
 +'<p class="b17n">الشعار وصور الغلاف غير مفعّلة في هذه المرحلة.</p><div class="b15h"><button class="btn" data-b21="save" type="button">'+(b.id?'حفظ التعديلات':'حفظ كمسودة')+'</button>'+(ed?'<button class="btn btn-p" data-b21="submit" type="button">إرسال للمراجعة</button>':'')+'</div></div>'}
/* ===== B24: لوحة النشاط (BAHR BUSINESS) — هيكل أقسام حسب نوع النشاط. لا SQL جديد: كل القراءات عبر الجداول/الدوال الموجودة وتحت RLS ===== */
var SVC={workshop:1,technician:1},BS={sec:'ov',b:null,pv:null,D:null};
var LS={published:'منشور',pending:'بانتظار المراجعة',rejected:'مرفوض',suspended:'موقوف',draft:'مسودة'};
var SECS=[
 ['ov','نظرة عامة','الأساسي',0],['pf','ملف النشاط','الأساسي',0],['vf','حالة التحقق','الأساسي',0],
 ['pr','المنتجات والإعلانات','المحتوى',1,function(t){return DEAL[t]}],['of','عروض قطع الغيار','المحتوى',1,function(t){return PARTS[t]}],
 ['sv','الخدمات والورش','المحتوى',1,function(t){return SVC[t]}],['iv','منتجاتي ومخزوني','المحتوى',1,function(t){return PARTS[t]||DEAL[t]}],
 ['pc','الأسعار والعروض','المحتوى',1,function(t){return PARTS[t]||DEAL[t]}],
 ['rq','طلبات الخدمات','التواصل',1,function(t){return SVC[t]}],['ch','المحادثات والتواصل','التواصل',1],['nt','الإشعارات','التواصل',1],
 ['st','إحصائيات النشاط','الإدارة',1],['sf','الموظفون والصلاحيات','الإدارة',1],['se','إعدادات النشاط','الإدارة',1]];
function secsFor(b){var ap=b.status==='approved';return SECS.filter(function(s){return !s[4]||s[4](b.business_type)}).map(function(s){return{id:s[0],t:s[1],g:s[2],lock:!!s[3]&&!ap}})}
function tg(t){return '<span class="bz-t">'+t+'</span>'}
function cd(t,h,x){return '<div class="bz-c'+(x?' '+x:'')+'"><h3>'+t+'</h3>'+h+'</div>'}
function kp(l,v,href){var s=v==null?'<b class="bz-na">غير متاح حالياً</b>':'<b>'+v+'</b>';return href?'<a class="bz-k" href="'+href+'">'+l+s+'</a>':'<div class="bz-k">'+l+s+'</div>'}
function cn(L,k,v){return L.filter(function(x){return x[k]===v}).length}
function safe(p){return p.then(function(r){return r&&r.error?{ok:0,e:r.error}:{ok:1,d:r.data}},function(e){return{ok:0,e:e}})}
function unreadConv(v,me){var r=v.user_a===me?v.a_read_at:v.b_read_at;return !!(v.last_sender&&v.last_sender!==me&&v.last_message_at&&(!r||v.last_message_at>r))}
function loadData(c,b){var uid=AU.user.id,t=b.business_type;
 return Promise.all([
  PARTS[t]?safe(c.from('parts_offers').select('id,part_id,review_status,status,availability,price,currency,confirmed_at,province,supplier_part_number,parts_items(name,part_number)').eq('supplier_id',uid).order('created_at',{ascending:false}).limit(500)):Promise.resolve(null),
  DEAL[t]?safe(c.rpc('my_listings')):Promise.resolve(null),
  safe(c.from('connect_conversations').select('*').order('last_message_at',{ascending:false,nullsFirst:false}).limit(100)),
  safe(c.from('notifications').select('id',{count:'exact',head:true}).is('read_at',null).then(function(r){return r.error?r:{data:r.count}})),
  safe(c.from('notifications').select('id,type,title,body,created_at,read_at,listing_id').order('created_at',{ascending:false}).limit(10)),
  SVC[t]?safe(c.from('marine_services').select('*').eq('biz_id',b.id).order('created_at',{ascending:false})):Promise.resolve(null),
  SVC[t]?safe(c.from('service_requests').select('id,service_id,provider_status').eq('biz_id',b.id).limit(1000)):Promise.resolve(null),
  PARTS[t]?safe(c.from('b63_offer_stock').select('offer_id,track_stock,stock_qty,low_stock_threshold,updated_at').limit(1000)):Promise.resolve(null)
 ]).then(function(a){return{offers:a[0],listings:a[1],conv:a[2],notif:a[3],nl:a[4],svc:a[5],srq:a[6],stock:a[7]}})}
function nav(b){var S=secsFor(b),g='',h='';S.forEach(function(s){if(s.g!==g){g=s.g;h+='<small>'+g+'</small>'}h+='<button type="button" data-bz="'+s.id+'" class="'+(s.id===BS.sec?'on':'')+'">'+s.t+(s.lock?' <i aria-hidden="true">🔒</i>':'')+'</button>'});return '<nav class="bzn" aria-label="أقسام لوحة النشاط">'+h+'</nav>'}
var KDL={listing:'إعلان',part:'قطعة غيار',business:'نشاط تجاري'};
function ntList(D){if(!D.nl||!D.nl.ok)return '<p class="bz-na">قائمة الإشعارات غير متاحة حالياً</p>';var l=D.nl.d||[];if(!l.length)return '<p class="b17n">لا توجد إشعارات.</p>';return '<ul class="bz-pl">'+l.map(function(n){return '<li><span>'+fd(n.created_at)+'</span> '+(n.read_at?'':'<b>• </b>')+X(n.title||'')+'</li>'}).join('')+'</ul>'}
function convList(CV,me){if(!CV)return '';if(!CV.length)return '<p class="b17n">لا توجد محادثات بعد.</p>';return CV.slice(0,10).map(function(v){var u=unreadConv(v,me);return '<a class="b17c b15r" href="#chat-'+X(v.id)+'" style="display:block"><b>'+X(KDL[v.kind]||'محادثة')+'</b>'+(u?' <span class="bd published">جديد</span>':'')+'<div>'+(v.last_message_at?fd(v.last_message_at):'')+'</div></a>'}).join('')}
function ovx(b,t,L,D){var ap=b.status==='approved',s='',bd='',rc='';
 if(ap){s='<div class="b15h">'+(DEAL[t]?'<a class="btn btn-p" href="#newlisting">إضافة إعلان</a><a class="btn" href="#mylistings">إدارة الإعلانات</a>':'')+(PARTS[t]?'<a class="btn" href="#bizparts">عروض القطع</a>':'')+'<a class="btn" href="#bizstats">الإحصائيات</a><a class="btn" href="#inbox">الرسائل</a><button class="btn" data-bz="pf" type="button">ملف النشاط</button><a class="btn" href="#biz-'+X(b.id)+'">الصفحة العامة</a></div>';
  rc=(!D.nl||!D.nl.ok)?'<p class="bz-na">غير متاح حالياً</p>':(D.nl.d||[]).length?'<ul class="bz-pl">'+D.nl.d.slice(0,5).map(function(n){return '<li><span>'+fd(n.created_at)+'</span> '+X(n.title||'')+'</li>'}).join('')+'</ul>':'<p class="b17n">لا توجد أنشطة بعد.</p>'}
 if(L)bd='<p class="b17n">الإعلانات حسب الحالة:</p><div class="bz-g">'+Object.keys(LS).map(function(k){var n=cn(L,'status',k);return n?kp(LS[k],n):''}).join('')+'</div>';
 return{s:s,bd:bd,rc:rc}}
function bzBody(id,b,pv,D){var ap=b.status==='approved',t=b.business_type,me=AU.user.id,h='';
 var S=secsFor(b).filter(function(s){return s.id===id})[0];if(!S){id=BS.sec='ov';S=secsFor(b)[0]}
 if(S.lock)return cd(S.t,'<p>هذا القسم يُفتح بعد قبول النشاط من إدارة بحر.</p><button class="btn" data-bz="vf" type="button">حالة التحقق</button>');
 var O=D.offers&&D.offers.ok?D.offers.d||[]:null,L=D.listings&&D.listings.ok?D.listings.d||[]:null,CV=D.conv.ok?D.conv.d||[]:null,UC=CV?CV.filter(function(v){return unreadConv(v,me)}).length:null,NU=D.notif.ok?D.notif.d:null;
 if(id==='ov'){var k='';
  if(O)k+=kp('عروض قطع الغيار',O.length+' (منشور '+cn(O,'review_status','published')+')','#bizparts');
  if(L)k+=kp('الإعلانات',L.length+' (منشور '+cn(L,'status','published')+')','#mylistings');
  k+=kp('محادثات غير مقروءة',UC,'#inbox')+kp('إشعارات غير مقروءة',NU,'#alerts');
  var td=[];if(!b.description)td.push('أضف وصفاً للنشاط');if(!b.work_hours)td.push('أضف ساعات العمل');if(!b.is_verified)td.push('اطلب التوثيق عبر معلومات التحقق الصحيحة');
  var q=ovx(b,t,L,D);h=cd('مرحباً، '+X(b.name),'<p>'+X(TY[t])+' · '+X(ST[b.status])+(b.is_verified?' · موثّق من إدارة بحر':'')+'</p>'+q.s)+cd('ملخص','<div class="bz-g">'+k+'</div>'+q.bd)+(ap?cd('آخر الأنشطة',q.rc):'')+cd('ما الذي ينقص ملفك؟',td.length?'<ul>'+td.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>':'<p>ملف النشاط مكتمل من حيث الحقول الأساسية.</p>')
   +(SVC[t]?cd('الخدمات',D.svc&&D.svc.ok?'<p>لديك '+D.svc.d.length+' خدمة (منشورة: '+cn(D.svc.d,'status','published')+').</p><button class="btn" data-bz="sv" type="button">إدارة الخدمات</button>':'<p class="bz-na">'+(ap?'غير متاح حالياً':'تُفتح بعد قبول النشاط')+'</p>'):'')}
 else if(id==='pf'){var pub=[['الاسم',b.name],['النوع',TY[t]],['الوصف',b.description],['الموقع',[b.province,b.area,b.address_text].filter(Boolean).join('، ')],['الفئات',b.categories],['ساعات العمل',b.work_hours]],
   ct=b.show_contact===false?'<li>أرقام التواصل: <b>مخفية عن العامة</b></li>':'<li>الهاتف: <bdi>'+X(b.phone||'—')+'</bdi></li>'+(b.whatsapp?'<li>واتساب: <bdi>'+X(b.whatsapp)+'</bdi></li>':'');
   h='<div class="bz-two"><div>'+(b.status==='suspended'?'<div class="msg err" style="display:block">النشاط موقوف: التعديل غير متاح.</div>':form(b,pv))+'</div><div>'
    +cd('معاينة الملف العام','<ul class="bz-pl">'+pub.filter(function(x){return x[1]}).map(function(x){return '<li><span>'+x[0]+'</span> '+X(x[1])+'</li>'}).join('')+ct+'</ul>'+(ap?'<a class="btn" href="#biz-'+X(b.id)+'">فتح الصفحة العامة</a>':'<p class="b17n">لا تظهر الصفحة للعامة قبل القبول.</p>'))
    +cd('معلومات خاصة (لا تظهر للعامة)','<p>معلومات التحقق وملاحظات الإدارة تراها أنت والإدارة فقط.</p><p class="b17n">الشعار وصورة الغلاف: '+tg('غير منفّذ')+' يحتاج Storage ومخططاً مخصصاً في مرحلة لاحقة.</p>')+'</div></div>'}
 else if(id==='vf'){var steps=[['draft','مسودة'],['pending','قيد المراجعة'],['approved','مقبول']],ix=({draft:0,need_info:1,rejected:0,pending:1,approved:2,suspended:2})[b.status];
   h=cd('حالة النشاط','<p><span class="bd '+(ap?'published':b.status==='rejected'||b.status==='suspended'?'rejected':'pending')+'">'+X(ST[b.status])+'</span></p><ol class="bz-st">'+steps.map(function(s,i){return '<li class="'+(i<=ix?'on':'')+'">'+s[1]+'</li>'}).join('')+'</ol>'+(b.review_note?'<div class="msg err" style="display:block">ملاحظة الإدارة: '+X(b.review_note)+'</div>':''))
    +cd('التوثيق','<p>'+(b.is_verified?'<span class="bd published">تحقّقت إدارة بحر من بيانات النشاط</span> '+(b.verified_at?fd(b.verified_at):''):'غير موثّق بعد.')+'</p><p class="b17n">التوثيق قرار يدوي من الإدارة بعد مراجعة معلومات التحقق، وليس تلقائياً.</p><button class="btn" data-bz="pf" type="button">تعديل معلومات التحقق</button>')}
 else if(id==='pr'){h=cd('إعلاناتي','<div class="b15h"><a class="btn btn-p" href="#newlisting">إضافة إعلان</a><a class="btn" href="#mylistings">إدارة الإعلانات</a></div>'+(L===null?'<p class="bz-na">غير متاح حالياً</p>':L.length?'<div class="bz-list">'+L.slice(0,15).map(function(x){return '<div><a href="#p-'+X(x.id)+'"><b dir="auto">'+X(x.title)+'</b></a> <span class="bd '+(x.status==='published'?'published':x.status==='pending'?'pending':'rejected')+'">'+X(LS[x.status]||x.status)+'</span> '+(x.status==='suspended'?'':'<a href="#editlisting-'+X(x.id)+'">تعديل</a>')+'</div>'}).join('')+'</div>':'<p class="b17n">لا توجد إعلانات بعد.</p>')+'<p class="b17n">استيراد CSV وإدارة الصور الجماعية: '+tg('لاحقاً')+'</p>')}
 else if(id==='of'){h=cd('عروض BAHR PARTS',(O===null?'<p class="bz-na">غير متاح حالياً</p>':'<div class="bz-g">'+kp('الكل',O.length)+kp('منشور',cn(O,'review_status','published'))+kp('قيد المراجعة',cn(O,'review_status','pending'))+kp('مسودة',cn(O,'review_status','draft'))+'</div>')+'<a class="btn btn-p" href="#bizparts">إدارة عروض القطع</a><p class="b17n">الأسعار تعرض مع تاريخ التأكيد، والعروض الجديدة تُراجَع من الإدارة. لا يوجد جدول منتجات منفصل: العروض ترتبط بكتالوج القطع الحالي.</p>')}
 else if(id==='sv'){h=svBody(b,D)}
 else if(id==='iv'){h=B63.body(b,D)}
 else if(id==='pc'){h=B63.prices(b,D)}
 else if(id==='rq'){h='<div class="bz-c"><h3>طلبات الخدمات</h3><div id="b61rb" class="b17n">جارٍ التحميل…</div></div>'}
 else if(id==='ch'){h=cd('BAHR CONNECT',(CV===null?'<p class="bz-na">غير متاح حالياً</p>':'<div class="bz-g">'+kp('المحادثات',CV.length,'#inbox')+kp('غير مقروءة',UC,'#inbox')+'</div>')+'<a class="btn btn-p" href="#inbox">فتح الرسائل</a>'+convList(CV,me)+(b.show_contact===false?'<p class="b17n">أرقام التواصل مخفية عن العامة، وتبقى المراسلة داخل بحر متاحة.</p>':'<p class="b17n">أزرار الاتصال وواتساب تظهر في الصفحة العامة عند صحة الرقم.</p>'))}
 else if(id==='nt'){h=cd('الإشعارات',kp('غير مقروءة',NU,'#alerts')+ntList(D)+'<a class="btn" href="#alerts">صندوق التنبيهات</a>')}
 else if(id==='st'){h=cd('إحصائيات حقيقية فقط','<div class="bz-g">'+(L?kp('إعلانات منشورة',cn(L,'status','published')):'')+(O?kp('عروض منشورة',cn(O,'review_status','published')):'')+kp('محادثات',CV?CV.length:null)+'</div><p class="b17n">المشاهدات: تُعرض في <a href="#bizstats">صفحة الإحصائيات</a> من سجل حقيقي بعد تطبيق b52_analytics.sql. النقرات غير مسجّلة، ولن نعرض أرقاماً تقديرية.</p>')}
 else if(id==='sf'){h=cd('الموظفون والصلاحيات '+tg('نقطة توسعة'),'<p>حالياً الصلاحية الوحيدة المفعّلة هي <b>مالك النشاط</b>، ويفرضها الخادم عبر ملكية السجل (owner_id وسياسات RLS)، لا عبر الواجهة.</p><ul><li>مدير النشاط</li><li>موظف المنتجات والإعلانات</li><li>موظف الطلبات والاستفسارات</li><li>موظف الخدمات</li></ul><p class="b17n">هذه الأدوار غير مفعّلة في الواجهة. جدول <bdi>biz_staff</bdi> ودالة <bdi>biz_has_role</bdi> موجودان في القاعدة لكنهما غير مربوطين بالواجهة بعد، ولن تُدعى موظفون قبل ربطهما واختبار صلاحياتهما في الخادم.</p>')}
 else if(id==='se'){h=cd('إعدادات النشاط','<ul><li>إظهار التواصل للعامة: <b>'+(b.show_contact===false?'مخفي':'ظاهر')+'</b></li><li>نوع النشاط والاسم: مقفلان بعد الإرسال (تغييرهما عبر الإدارة)</li></ul><button class="btn" data-bz="pf" type="button">تعديل في ملف النشاط</button>')}
 return h}
function home(){var c=sbc(),uid=AU.user.id;R().innerHTML='<p class="b17n">جارٍ التحميل…</p>';R().parentNode.classList.remove('bzw');
 c.from('biz_profiles').select('*').eq('owner_id',uid).maybeSingle().then(function(r){if(r.error)throw r.error;var b=r.data;
  if(!b){R().innerHTML=head('BAHR BUSINESS — تسجيل نشاط تجاري')+'<p class="b17n">سجّل نشاطك ليُراجَع من إدارة بحر. لا تُفعَّل وظائف النشاط ولا تظهر صفحته للعامة قبل القبول.</p>'+form(null,null);return}
  return Promise.all([safe(c.from('biz_private').select('*').eq('business_id',b.id).maybeSingle()),b.status==='approved'?loadData(c,b):Promise.resolve({offers:null,listings:null,conv:{ok:0},notif:{ok:0}})]).then(function(a){
   if(!a[0].ok)throw a[0].e;BS.b=b;BS.pv=a[0].d;BS.D=a[1];
   if(!secsFor(b).some(function(s){return s.id===BS.sec}))BS.sec='ov';
   R().parentNode.classList.add('bzw');R().dataset.b=b.id;draw()})}).catch(fail)}
function draw(){var b=BS.b;if(!b)return;var ap=b.status==='approved';
 R().innerHTML=head('لوحة النشاط — '+X(b.name))+'<div class="bz-hd"><b>'+X(TY[b.business_type])+'</b> <span class="bd '+(ap?'published':b.status==='rejected'||b.status==='suspended'?'rejected':'pending')+'">'+X(ST[b.status])+'</span>'+(b.is_verified?' <span class="bd published">موثّق</span>':'')+'</div>'
  +(b.status==='pending'?'<p>طلبك قيد المراجعة منذ '+fd(b.updated_at)+'.</p>':'')+(b.status==='suspended'?'<p>النشاط موقوف مؤقتاً. تواصل مع الإدارة.</p>':'')
  +'<div class="bzl">'+nav(b)+'<div class="bzm">'+bzBody(BS.sec,b,BS.pv,BS.D)+'</div></div>';R().dataset.b=b.id;if(BS.sec==='rq'&&ap)B61.rq(b);if(ap)B63.afterDraw()}
document.addEventListener('click',function(e){var x=e.target.closest('[data-bz]');if(!x||!BS.b||!E('b21c').contains(x))return;BS.sec=x.dataset.bz;draw();window.scrollTo(0,0)});
function row(w){var wh=wa(val(w,'wa'));var ph=d2(val(w,'ph')).replace(/[\s-]/g,''),w2=d2(val(w,'wa')).replace(/[\s-]/g,'');
 if(!val(w,'nm')||val(w,'nm').length<2)return'اكتب اسم النشاط.';if(!val(w,'ty'))return'اختر نوع النشاط.';if(!val(w,'pv'))return'اختر المحافظة.';if(!PH.test(ph))return'أدخل رقم هاتف صحيحاً (أرقام فقط).';if(w2&&!PH.test(w2))return'رقم واتساب غير صحيح.';
 return{business_type:val(w,'ty'),name:val(w,'nm'),description:val(w,'ds')||null,province:val(w,'pv'),area:val(w,'ar')||null,address_text:val(w,'ad')||null,phone:ph,whatsapp:w2||null,show_contact:w.querySelector('[data-k="sc"]').checked,work_hours:val(w,'wh')||null,categories:val(w,'ct')||null}}
function act(b,fn,ok){if(busy)return;busy=true;b.disabled=true;say('in','جارٍ التنفيذ…');var c=sbc();Promise.resolve().then(function(){return fn(c)}).then(function(){busy=false;toast(ok||'تم.');B21.page(location.hash.slice(1))}).catch(function(e){busy=false;b.disabled=false;say('err',emsg(e))})}
function chk(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('forbidden');return r.data[0]}
function pub(id){var c=sbc();R().innerHTML='<p class="b17n">جارٍ التحميل…</p>';
 c.from('biz_public').select('*').eq('id',id).maybeSingle().then(function(r){if(r.error)throw r.error;var b=r.data;if(!b){R().innerHTML='<p>هذا النشاط غير موجود أو غير منشور.</p>';return}
  var ph=b.phone&&PH.test(b.phone)?b.phone:'',w=b.whatsapp?wa(b.whatsapp):'';
  R().innerHTML='<div class="b17c b15r" style="display:block"><h1 dir="auto">'+X(b.name)+'</h1><div class="b15h"><span>'+X(TY[b.business_type]||'')+'</span>'+(b.is_verified?'<span class="bd published">تحقّقت إدارة بحر من بيانات النشاط · '+fd(b.verified_at)+'</span>':'<small class="b17n">لم يُوثَّق بعد</small>')+'</div>'
   +'<p>'+X(b.province)+(b.area?'، '+X(b.area):'')+(b.address_text?' — '+X(b.address_text):'')+'</p>'+(b.description?'<p style="white-space:pre-wrap">'+X(b.description)+'</p>':'')+(b.categories?'<p><b>الفئات:</b> '+X(b.categories)+'</p>':'')+(b.work_hours?'<p><b>ساعات العمل:</b> '+X(b.work_hours)+'</p>':'')
   +'<div class="b15h">'+(ph?'<a class="btn btn-p" href="tel:'+X(ph)+'">اتصال</a>':'')+(w?'<a class="btn" href="https://wa.me/'+X(w)+'" target="_blank" rel="noopener">واتساب</a>':'')+'<button class="btn" data-cn="business|'+X(b.id)+'|'+X(b.owner_id)+'" type="button">مراسلة داخل بحر</button></div>'+((ph||w)?'':'<p class="b17n">لم يعرض النشاط وسائل اتصال.</p>')+'<details class="bz-rp"><summary>الإبلاغ عن النشاط</summary><label>السبب<select data-k="rr"><option value="scam">احتيال أو نصب</option><option value="fake">نشاط وهمي</option><option value="wrong_info">معلومات مضلِّلة</option><option value="prohibited">محتوى ممنوع</option><option value="other">غير ذلك</option></select></label><label>تفاصيل (اختياري)<textarea data-k="rd" maxlength="1000" rows="3"></textarea></label><button class="btn" data-b21="rep" data-id="'+X(b.id)+'" type="button">إرسال البلاغ</button></details></div><div id="b61bs"></div><div id="b50r"></div><h3>الإعلانات المنشورة</h3><div id="b21l" class="b17n">جارٍ التحميل…</div>';if(window.B50)B50.mount(b);B61.bizServices(b);
  return c.from('listing_owners').select('listing_id').eq('owner_id',b.owner_id).then(function(o){if(o.error)throw o.error;var ids=(o.data||[]).map(function(x){return x.listing_id});
   return(ids.length?c.from('listings').select('id,title,price,currency,province').in('id',ids).eq('status','published').order('created_at',{ascending:false}).limit(50):Promise.resolve({data:[]})).then(function(l){if(l.error)throw l.error;
    E('b21l').className='';E('b21l').innerHTML=l.data.length?l.data.map(function(x){return '<a class="b17c b15r" href="#p-'+X(x.id)+'" style="display:block"><b dir="auto">'+X(x.title)+'</b><div>'+fm(Number(x.price),x.currency)+' · '+X(x.province||'')+'</div></a>'}).join(''):'<p class="b17n">لا توجد إعلانات منشورة.</p>'})})}).catch(fail)}
function adm(){var c=sbc();R().innerHTML='<p class="b17n">جارٍ التحميل…</p>';
 c.rpc('is_admin').then(function(a){if(a.error||a.data!==true)throw new Error('forbidden');return Promise.all([c.from('biz_profiles').select('*,biz_private(verification_info)').eq('status',AF).order('updated_at',{ascending:false}).limit(100),c.from('biz_audit').select('*,biz_profiles(name)').order('created_at',{ascending:false}).limit(20)])}).then(function(a){
  if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;var B=function(k,t,x){return '<button class="btn'+(x||'')+'" data-b21="'+k+'" type="button">'+t+'</button>'};
  R().innerHTML=head('إدارة الأنشطة التجارية')+'<div class="b15h">'+Object.keys(ST).map(function(k){return '<button class="btn'+(k===AF?' btn-p':'')+'" data-b21="flt" data-v="'+k+'" type="button">'+ST[k]+'</button>'}).join('')+'</div>'
  +(a[0].data.length?a[0].data.map(function(b){var pv=Array.isArray(b.biz_private)?b.biz_private[0]:b.biz_private,s=b.status;return '<div class="b17c b15r" style="display:block" data-q="'+X(b.id)+'"><b dir="auto">'+X(b.name)+'</b> · '+X(TY[b.business_type])+' · '+X(b.province)+(b.is_verified?' <span class="bd published">موثّق</span>':'')+'<br><small dir="ltr">'+X(b.phone||'')+(b.whatsapp?' · '+X(b.whatsapp):'')+'</small><p>'+X(b.description||'')+'</p><p><b>معلومات التحقق (خاصة):</b> '+X((pv&&pv.verification_info)||'لم تُدخل')+'</p>'+(b.review_note?'<small>آخر ملاحظة: '+X(b.review_note)+'</small>':'')
   +'<div class="b15h">'+((s==='pending'||s==='need_info')?B('approve','قبول',' btn-p')+(s==='pending'?B('need_info','طلب معلومات'):'')+B('reject','رفض'):'')+(s==='approved'?B('suspend','إيقاف')+(b.is_verified?B('unverify','إلغاء التوثيق'):B('verify','توثيق بعد التحقق')):'')+(s==='suspended'?B('reinstate','إعادة التفعيل',' btn-p'):'')+'</div></div>'}).join(''):'<p class="b17n">لا توجد أنشطة بهذه الحالة.</p>')
  +'<h3>آخر الإجراءات</h3>'+(a[1].data.length?a[1].data.map(function(l){return '<div class="b15e"><small>'+fd(l.created_at)+'</small> '+X((l.biz_profiles||{}).name||'')+' — '+X(l.action)+'</div>'}).join(''):'<p class="b17n">لا توجد إجراءات.</p>')
 }).catch(function(e){R().innerHTML=head('إدارة الأنشطة التجارية')+'<div class="msg err" style="display:block">'+X(/forbidden/.test(String(e&&e.message))?'هذه الصفحة للمشرفين فقط.':emsg(e))+'</div>'})}
document.addEventListener('click',function(e){var rb=e.target.closest('[data-b21="rep"]');if(rb){if(!AU.user){NEXT='سجّل الدخول للإبلاغ عن نشاط.';location.hash='#login';return}
 var w=rb.closest('details'),sel=w.querySelector('[data-k="rr"]'),dt=w.querySelector('[data-k="rd"]').value.trim();rb.disabled=true;
 sbc().from('reports').insert({business_id:rb.dataset.id,reason:sel.value,details:sel.selectedOptions[0].textContent+(dt?' — '+dt:'')}).then(function(r){
  if(r.error){rb.disabled=false;toast(r.error.code==='23505'?'لديك بلاغ مفتوح على هذا النشاط بالفعل.':/row-level|42501/.test(r.error.message)?'لا يمكنك الإبلاغ عن نشاطك أنت.':'تعذّر إرسال البلاغ.');return}
  w.innerHTML='<p>وصل بلاغك وستراجعه الإدارة. شكراً.</p>'}).catch(function(){rb.disabled=false;toast('انقطع الاتصال.')});return}
 var b=e.target.closest('[data-b21]');if(!b||!AU.user)return;var k=b.dataset.b21,w=b.closest('#b21f,[data-q]')||document;
 if(k==='flt'){AF=b.dataset.v;adm();return}
 if(k==='save'||k==='submit'){var d=row(w);if(typeof d==='string'){say('err',d);return}var id=R().dataset.b,vi=val(w,'vi')||null,sub=k==='submit';
  if(id&&w.querySelector('[data-k="ty"]').disabled){delete d.business_type;delete d.name}
  act(b,function(c){var q=id?c.from('biz_profiles').update(sub?Object.assign(d,{status:'pending'}):d).eq('id',id).select('id'):c.from('biz_profiles').insert(Object.assign(d,{owner_id:AU.user.id,status:sub?'pending':'draft'})).select('id');
   return q.then(function(r){var x=chk(r);return c.from('biz_private').upsert({business_id:x.id,verification_info:vi},{onConflict:'business_id'}).then(function(p){if(p.error)throw p.error})})},sub?'أُرسل النشاط للمراجعة.':'تم الحفظ.');return}
 if(/^(approve|need_info|reject|suspend|reinstate|verify|unverify)$/.test(k)){var n=null;if(/need_info|reject|suspend|^verify$/.test(k)){n=prompt(k==='verify'?'ما الذي تحققت منه؟ (مطلوب)':'اكتب السبب/الملاحظة (يراها صاحب النشاط):');if(!n||!n.trim())return}
  act(b,function(c){return c.rpc('biz_admin_decide',{p_id:w.dataset.q,p_action:k,p_note:n}).then(function(r){if(r.error)throw r.error})},'تم تنفيذ الإجراء.')}});
/* ===== B33: إدارة الخدمات داخل لوحة النشاط (b33_services_pro.sql). الملكية يفرضها الخادم: RLS + حارس ms_guard ===== */
var S3T={jet:'صيانة وإصلاح الجت سكي',engine:'صيانة المحركات البحرية',diag:'فحص وتشخيص الأعطال',parts:'توفير وتركيب قطع الغيار',boat:'صيانة القوارب والمعدات',tow:'النقل والسحب البحري',elec:'كهرباء المعدات البحرية',fuelcool:'أنظمة الوقود والتبريد',hull:'إصلاح الهياكل والألياف الزجاجية',install:'تركيب الملحقات والتجهيزات',other:'خدمات بحرية أخرى'};B61.S3T=S3T;
var S3E=['جت سكي','محرك خارجي','محرك داخلي','قارب'],S3S={draft:'مسودة',pending_review:'بانتظار المراجعة',published:'منشورة',rejected:'مرفوضة',suspended:'موقوفة من الإدارة'};
var S3={edit:null};
function s3price(s){var u=s.price!=null?Number(s.price).toLocaleString('en-US')+' '+(s.currency==='USD'?'دولار':'دينار'):'';return s.price_mode==='fixed'&&u?u:s.price_mode==='from'&&u?'يبدأ من '+u:'السعر بعد المعاينة أو التواصل'}
function s3card(s,RQ){var n=RQ?RQ.filter(function(r){return r.service_id===s.id}):null,nw=n?n.filter(function(r){return r.provider_status==='new'}).length:0,st=s.status,cls=st==='published'?'published':st==='rejected'||st==='suspended'?'rejected':'pending';
 return '<div class="s3s"><b dir="auto">'+X(s.name)+'</b> <span class="bd '+cls+'">'+X(S3S[st]||st)+'</span>'+(s.is_paused?' <span class="bd pending">متوقفة مؤقتاً</span>':'')
  +'<p>'+X((s.service_types||[]).map(function(k){return S3T[k]||k}).join('، '))+'</p>'
  +'<p class="b17n">'+X([s.province,s.area].filter(Boolean).join('، '))+' · '+X(s3price(s))+'</p>'
  +((s.coverage_areas||[]).length?'<p class="b17n">التغطية: '+X(s.coverage_areas.join('، '))+'</p>':'')
  +(n?'<p class="b17n">طلبات مرتبطة بهذه الخدمة: <b>'+n.length+'</b>'+(nw?' (جديدة: '+nw+')':'')+'</p>':'')
  +((st==='rejected'||st==='suspended')&&s.review_note?'<div class="msg err" style="display:block">ملاحظة الإدارة: '+X(s.review_note)+'</div>':'')
  +'<div class="b15h">'+(st==='suspended'?'':'<button class="btn" data-sv3="edit" data-id="'+X(s.id)+'" type="button">تعديل</button>')
  +((st==='draft'||st==='rejected')?'<button class="btn btn-p" data-sv3="submit1" data-id="'+X(s.id)+'" type="button">إرسال للمراجعة</button>':'')
  +(st==='published'?'<button class="btn" data-sv3="'+(s.is_paused?'resume':'pause')+'" data-id="'+X(s.id)+'" type="button">'+(s.is_paused?'إعادة التفعيل':'إيقاف مؤقت')+'</button>':'')+'</div></div>'}
function s3cb(a,v,l,on){return '<label><input type="checkbox" '+a+'="'+X(v)+'"'+(on?' checked':'')+'> '+X(l)+'</label>'}
function s3form(b,s){var n=!s;s=s||{};var ty=s.service_types||[],eq=s.equipment||[],cv=s.coverage_areas||[],pm=s.price_mode||'inquiry',pb=s.status==='published';
 return '<div id="b33f" class="b17">'+fl('nm','اسم الخدمة أو القسم','text',s.name,'maxlength="150"')
  +'<fieldset class="s3g"><legend>أنواع الخدمة (اختر واحداً على الأقل)</legend>'+Object.keys(S3T).filter(function(k){return B61.act(k)||ty.indexOf(k)>-1}).map(function(k){return s3cb('data-t',k,S3T[k],ty.indexOf(k)>-1)}).join('')+'</fieldset>'
  +'<label>وصف الخدمة<textarea data-k="ds" rows="4" maxlength="4000">'+X(s.description||'')+'</textarea></label>'
  +'<fieldset class="s3g"><legend>المعدات التي تخدمها</legend>'+S3E.map(function(k){return s3cb('data-e',k,k,eq.indexOf(k)>-1)}).join('')+'</fieldset>'
  +'<div class="b17r"><label>المحافظة<select data-k="pv"><option value="">اختر</option>'+PV.map(function(x){return '<option'+(x===(s.province||b.province)?' selected':'')+'>'+x+'</option>'}).join('')+'</select></label>'+fl('ar','المنطقة','text',n?b.area:s.area,'maxlength="80"')+'</div>'
  +'<fieldset class="s3g"><legend>المحافظات التي تغطيها (اختياري)</legend>'+PV.map(function(x){return s3cb('data-c',x,x,cv.indexOf(x)>-1)}).join('')+'</fieldset>'
  +'<div class="b17"><label>السعر<select data-k="pm"><option value="inquiry"'+(pm==='inquiry'?' selected':'')+'>السعر بعد المعاينة أو التواصل</option><option value="fixed"'+(pm==='fixed'?' selected':'')+'>سعر ثابت</option><option value="from"'+(pm==='from'?' selected':'')+'>يبدأ من مبلغ</option></select></label>'
  +'<div class="b17r">'+fl('pr','المبلغ (للسعر الثابت أو الذي يبدأ منه)','text',s.price,'inputmode="decimal" dir="ltr"')+'<label>العملة<select data-k="cu"><option value="IQD"'+(s.currency!=='USD'?' selected':'')+'>دينار</option><option value="USD"'+(s.currency==='USD'?' selected':'')+'>دولار</option></select></label></div></div>'
  +fl('hr','ساعات العمل (اختياري)','text',n?b.work_hours:s.hours,'maxlength="200"')
  +fl('du','المدة التقديرية للخدمة (اختياري، مثال: يومان)','text',s.est_duration,'maxlength="80"')+B61.imgUI(s)+'<p class="b17n">تظهر بيانات التواصل في الصفحة العامة من ملف النشاط وحسب إعداد الإخفاء.</p>'
  +(pb?'<div class="msg" style="display:block">تعديل خدمة منشورة يعيدها للمراجعة وتختفي من الدليل حتى الموافقة.</div>':'')
  +'<div class="b15h">'+(pb?'':'<button class="btn" data-sv3="save" type="button">حفظ كمسودة</button>')+'<button class="btn btn-p" data-sv3="submit" type="button">'+(pb?'حفظ وإعادة الإرسال للمراجعة':'إرسال للمراجعة')+'</button><button class="btn" data-sv3="cancel" type="button">إلغاء</button></div></div>'}
function svBody(b,D){var SD=D.svc,RQ=D.srq&&D.srq.ok?D.srq.d||[]:null;
 if(!SD)return cd('الخدمات','<p class="bz-na">غير متاح حالياً</p>');
 if(!SD.ok)return cd('الخدمات','<div class="msg err" style="display:block">'+X(emsg(SD.e))+'</div>');
 var L=SD.d||[];
 if(S3.edit){var s=S3.edit==='new'?null:L.filter(function(x){return x.id===S3.edit})[0];return cd(s?'تعديل الخدمة':'إضافة خدمة',s3form(b,s))}
 return cd('خدماتي','<div class="bz-g">'+kp('الكل',L.length)+kp('منشورة',cn(L,'status','published'))+kp('بانتظار المراجعة',cn(L,'status','pending_review'))+kp('طلبات الخدمة',RQ?RQ.length:null)+'</div><div class="b15h"><button class="btn btn-p" data-sv3="new" type="button">إضافة خدمة</button></div>')
  +cd('قائمة الخدمات',L.length?L.map(function(s){return s3card(s,RQ)}).join(''):'<p class="b17n">لم تضف أي خدمة بعد. الخدمة تظهر للعامة بعد مراجعة الإدارة، ولا تُعرض خدمة غير مسجّلة.</p>')}
function s3collect(w){var ck=function(a){return [].map.call(w.querySelectorAll('['+a+']:checked'),function(x){return x.getAttribute(a)})},nm=val(w,'nm'),ty=ck('data-t'),pm=val(w,'pm'),pr=d2(val(w,'pr')).replace(/[\s,]/g,''),cv=ck('data-c'),n;
 if(nm.length<2)return 'اكتب اسم الخدمة (حرفان على الأقل).';if(!ty.length)return 'اختر نوع خدمة واحداً على الأقل.';if(!val(w,'pv'))return 'اختر المحافظة.';
 if(pm==='fixed'||pm==='from'){n=Number(pr);if(!pr||!isFinite(n)||n<0)return 'أدخل مبلغاً صحيحاً للسعر الثابت.'}
 return{name:nm,description:val(w,'ds')||null,service_types:ty,equipment:ck('data-e'),province:val(w,'pv'),area:val(w,'ar')||null,coverage_areas:cv,price_mode:pm==='fixed'||pm==='from'?pm:'inquiry',price:pm==='fixed'||pm==='from'?n:null,currency:pm==='fixed'||pm==='from'?val(w,'cu'):null,hours:val(w,'hr')||null,est_duration:val(w,'du')||null}}
document.addEventListener('click',function(e){var b=e.target.closest('[data-sv3]');if(!b||!AU.user||!BS.b||!E('b21c').contains(b))return;var k=b.dataset.sv3,id=b.dataset.id;
 if(k==='new'||k==='edit'){S3.edit=k==='new'?'new':id;draw();window.scrollTo(0,0);return}
 if(k==='cancel'){S3.edit=null;draw();return}
 if(k==='pause'||k==='resume'){act(b,function(c){return c.rpc('provider_set_service_paused',{p_id:id,p_paused:k==='pause'}).then(function(r){if(r.error)throw r.error})},k==='pause'?'أُوقفت الخدمة مؤقتاً.':'أُعيد تفعيل الخدمة.');return}
 if(k==='submit1'){act(b,function(c){return c.from('marine_services').update({status:'pending_review'}).eq('id',id).select('id').then(function(r){chk(r)})},'أُرسلت الخدمة للمراجعة.');return}
 if(k==='save'||k==='submit'){var w=E('b33f'),d=s3collect(w);if(typeof d==='string'){say('err',d);window.scrollTo(0,0);return}
  var ed=S3.edit!=='new'&&S3.edit,st=k==='submit'?'pending_review':'draft';
  act(b,function(c){return B61.prep(c,d,ed).then(function(){var q=ed?c.from('marine_services').update(Object.assign(d,{status:st})).eq('id',ed).select('id'):c.from('marine_services').insert(Object.assign(d,{owner_id:AU.user.id,biz_id:BS.b.id,status:st})).select('id');
   return q.then(function(r){chk(r);S3.edit=null})})},st==='pending_review'?'أُرسلت الخدمة للمراجعة.':'تم حفظ المسودة.')}});
/* ===== B63: منتجاتي ومخزوني — يعيد استخدام parts_offers وlistings وسجلات الأسعار الموجودة (b63_products_inventory.sql للمخزون الداخلي فقط).
   لا كمية للإعلانات (قارب/جت سكي/محرك مستعمل): تُدار بحالة الإعلان. الكمية الداخلية لا تظهر للعامة. لا نجاح قبل رد الخادم. ===== */
window.B63=B63;
(function(){
var STALE=30*864e5,V={q:'',k:'',a:''},CSV=null,H={};
var AVL={in_stock:'متوفر',on_order:'بالطلب',out_of_stock:'غير متوفر حالياً',unknown:'التوفر غير مؤكد'},AVK=Object.keys(AVL);
var CATL={boat:'قارب',jetski:'جت سكي',engine:'محرك بحري',parts:'قطعة غيار',accessory:'إكسسوار بحري'};
var FLT=[['','كل الحالات'],['available','متوفر'],['limited','كمية محدودة'],['onorder','بالطلب'],['out','غير متوفر حالياً'],['unknown','التوفر غير مؤكد'],['stopped','متوقف عن البيع'],['stale','يحتاج تحديثاً من البائع']];
function e63(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883'||/b63_/.test(m)&&/does not exist|not find/i.test(m))return 'ميزة المخزون غير مفعّلة على الخادم بعد (يلزم تشغيل b63_products_inventory.sql).';
 if(/invalid_qty/.test(m))return 'الكمية يجب أن تكون عدداً صحيحاً من 0 إلى 1000000.';
 if(/invalid_threshold/.test(m))return 'حد التنبيه يجب أن يكون عدداً صحيحاً من 0 إلى 1000000.';
 if(c==='23514')return 'قيمة غير مسموحة (تحقق من السعر أو الكمية).';
 return emsg(e)}
function stockMap(D){var m={};if(D.stock&&D.stock.ok)(D.stock.d||[]).forEach(function(r){m[r.offer_id]=r});return m}
function stale(o){var t=o.confirmed_at?Date.parse(o.confirmed_at):NaN;return isNaN(t)||Date.now()-t>STALE}
/* حالة العرض: لا نعرض "متوفر" إلا إذا سجّلها البائع فعلاً (لا قيمة افتراضية) */
function oState(o,s){var q=s&&s.track_stock?s.stock_qty:null,t=s&&s.track_stock?s.low_stock_threshold:null;
 if(o.status==='hidden')return['stopped','متوقف عن البيع','rejected'];
 if(o.availability==='out_of_stock')return['out','غير متوفر حالياً','rejected'];
 if(o.availability==='unknown'||!o.availability)return['unknown','التوفر غير مؤكد','pending'];
 if(q!=null&&t!=null&&q<=t)return['limited','كمية محدودة','pending'];
 if(o.availability==='on_order')return['onorder','بالطلب','pending'];
 return['available','متوفر','published']}
function lState(l){var st=l.status;return st==='archived'||st==='sold'?['stopped','متوقف عن البيع','rejected']:['listed',LS[st]||st,st==='published'?'published':st==='pending'?'pending':'rejected']}
function items(D){var m=stockMap(D),out=[];
 if(D.offers&&D.offers.ok)(D.offers.d||[]).forEach(function(o){var p=o.parts_items||{};out.push({k:'offer',id:o.id,name:p.name||'—',pn:p.part_number||'',sp:o.supplier_part_number||'',o:o,s:m[o.id]||null})});
 if(D.listings&&D.listings.ok)(D.listings.d||[]).forEach(function(l){out.push({k:'listing',id:l.id,name:l.title||'—',pn:'',sp:'',l:l})});
 return out}
function match(x){var st=x.k==='offer'?oState(x.o,x.s):lState(x.l);
 if(V.k&&V.k!==x.k)return false;
 if(V.q){var q=V.q.toLowerCase();if((x.name+' '+x.pn+' '+x.sp).toLowerCase().indexOf(q)<0)return false}
 if(V.a){if(V.a==='stale')return x.k==='offer'&&stale(x.o);if(x.k==='listing')return V.a==='stopped'&&st[0]==='stopped';return st[0]===V.a}
 return true}
function row(x){var st,h;
 if(x.k==='listing'){var l=x.l;st=lState(l);
  return '<div class="b17c b15r" style="display:block"><div class="b15h"><b dir="auto">'+X(x.name)+'</b> <span class="bd '+st[2]+'">'+X(st[1])+'</span> <small>إعلان · '+X(CATL[l.category]||l.category||'')+'</small></div>'
   +'<div>'+(l.price!=null?fm(Number(l.price),l.currency):'<span class="bz-na">بلا سعر</span>')+'</div><p class="b17n">الإعلانات لا تُدار بكميات: حالة البيع تتبع حالة الإعلان.</p>'
   +'<div class="b15h">'+(l.status==='suspended'?'':'<a class="btn" href="#editlisting-'+X(l.id)+'">تعديل</a>')+(l.status==='published'?'<a class="btn" href="#p-'+X(l.id)+'">عرض</a>':'')+'<button class="btn" data-b63="lh" data-id="'+X(l.id)+'" type="button">سجل السعر</button></div><div data-h></div></div>'}
 var o=x.o,s=x.s,tr=s&&s.track_stock;st=oState(o,s);var stl=stale(o);
 return '<div class="b17c b15r" style="display:block" data-oid="'+X(o.id)+'"><div class="b15h"><b dir="auto">'+X(x.name)+'</b> <span dir="ltr">'+X(x.pn)+'</span> <span class="bd '+st[2]+'">'+X(st[1])+'</span>'+(stl?' <span class="bd pending">يحتاج تحديثاً</span>':'')+' <span class="bd '+(o.review_status==='published'?'published':o.review_status==='rejected'||o.review_status==='suspended'?'rejected':'pending')+'">'+X(LS[o.review_status]||o.review_status)+'</span></div>'
  +'<small>آخر تأكيد: '+(o.confirmed_at?fd(o.confirmed_at):'لم يُؤكَّد بعد')+(tr?' · المخزون: '+(s.stock_qty==null?'<b>غير معروف</b>':'<b>'+X(s.stock_qty)+'</b>')+(s.low_stock_threshold!=null?' (حد التنبيه '+X(s.low_stock_threshold)+')':''):' · تتبع الكمية: غير مفعّل')+'</small>'
  +'<div class="b17r">'+fl('pr','السعر','number',o.price==null?'':o.price,'min="0" step="any" inputmode="decimal"')+'<label>العملة<select data-k="cu"><option value="USD"'+(o.currency!=='IQD'?' selected':'')+'>دولار</option><option value="IQD"'+(o.currency==='IQD'?' selected':'')+'>دينار عراقي</option></select></label></div>'
  +'<label>التوفر<select data-k="av">'+AVK.map(function(k){return '<option value="'+k+'"'+(k===o.availability?' selected':'')+'>'+AVL[k]+'</option>'}).join('')+'</select></label>'
  +'<div class="b15h"><button class="btn btn-p" data-b63="sp" type="button">حفظ السعر والتوفر</button><button class="btn" data-b63="tog" data-s="'+(o.status==='hidden'?'active':'hidden')+'" type="button">'+(o.status==='hidden'?'إعادة البيع':'إيقاف البيع')+'</button><button class="btn" data-b63="oh" type="button">سجل السعر</button><button class="btn" data-b63="sh" type="button">سجل المخزون</button></div>'
  +'<details class="bz-rp"><summary>المخزون</summary>'+(D63.stockOk?'<label><input data-k="tk" type="checkbox"'+(tr?' checked':'')+'> تتبّع الكمية لهذا المنتج</label><div class="b17r">'+fl('qt','الكمية الحالية (اتركها فارغة إن كانت غير معروفة؛ 0 تعني نفدت)','number',tr&&s.stock_qty!=null?s.stock_qty:'','min="0" step="1" inputmode="numeric"')+fl('th','تنبيه عند انخفاضها إلى','number',tr&&s.low_stock_threshold!=null?s.low_stock_threshold:'','min="0" step="1" inputmode="numeric"')+'</div><p class="b17n">عند تسجيل كمية: 0 تجعل العرض «غير متوفر»، وأكبر من 0 تجعله «متوفر» (إلا إن كان «بالطلب»). الكمية الداخلية لا تظهر للعامة.</p><button class="btn" data-b63="stk" type="button">حفظ المخزون</button>':'<p class="bz-na">تتبع الكمية غير مفعّل على الخادم (يلزم b63_products_inventory.sql).</p>')+'</details><div data-h></div></div>'}
var D63={stockOk:false};
function summary(its,D){var of=its.filter(function(x){return x.k==='offer'}),low=of.filter(function(x){return oState(x.o,x.s)[0]==='limited'}),out=of.filter(function(x){return oState(x.o,x.s)[0]==='out'}),sl=of.filter(function(x){return stale(x.o)}),tr=of.filter(function(x){return x.s&&x.s.track_stock&&x.s.stock_qty==null});
 return '<div class="bz-g">'+kp('عروض القطع',of.length)+kp('إعلانات',its.length-of.length)+kp('كمية محدودة',low.length)+kp('غير متوفر',out.length)+kp('تحتاج تحديثاً',sl.length)+'</div>'
  +(low.length?'<div class="msg" style="display:block">تنبيه انخفاض المخزون: '+low.map(function(x){return X(x.name)+' ('+X(x.s.stock_qty)+')'}).join('، ')+'</div>':'')
  +(tr.length?'<p class="b17n">'+tr.length+' منتج بتتبع كمية مفعّل لكن الكمية غير معروفة: لن تُعتبر صفراً.</p>':'')
  +(sl.length?'<p class="b17n">«يحتاج تحديثاً»: لم يُؤكَّد السعر أو التوفر منذ أكثر من 30 يوماً. احفظ السعر والتوفر لتجديد التأكيد (التجديد يتم عبر الخادم وفق نظام B20).</p>':'')}
function list(){var el=E('b63l');if(!el||!BS.D)return;var its=items(BS.D).filter(match);
 el.innerHTML=its.length?its.map(row).join(''):'<p class="b17n">لا نتائج مطابقة.</p>'}
B63.body=function(b,D){var its=items(D),ap=b.status==='approved';D63.stockOk=!!(D.stock&&D.stock.ok);
 var miss=(D.offers&&!D.offers.ok?'<div class="msg err" style="display:block">تعذّر تحميل العروض: '+X(e63(D.offers.e))+'</div>':'')+(D.listings&&!D.listings.ok?'<div class="msg err" style="display:block">تعذّر تحميل الإعلانات: '+X(e63(D.listings.e))+'</div>':'');
 return cd('منتجاتي ومخزوني',miss+summary(its,D)+'<div class="b15h">'+(PARTS[b.business_type]?'<a class="btn btn-p" href="#bizparts">إضافة عرض قطعة</a>':'')+(DEAL[b.business_type]?'<a class="btn" href="#newlisting">إضافة إعلان</a>':'')+'</div><p class="b17n">لا تُكرَّر بيانات القطعة: العرض يرتبط بسجل القطعة المركزي في الكتالوج. قطعة غير موجودة؟ اقترحها من صفحة عروض القطع ولن يُنسب لها توافق قبل اعتماده.</p>')
  +cd('البحث والتصفية','<div class="b17r"><label>بحث<input id="b63q" type="search" maxlength="60" value="'+X(V.q)+'" placeholder="الاسم أو رقم القطعة"></label><label>النوع<select id="b63k"><option value="">الكل</option><option value="offer"'+(V.k==='offer'?' selected':'')+'>عروض قطع الغيار</option><option value="listing"'+(V.k==='listing'?' selected':'')+'>الإعلانات</option></select></label><label>الحالة<select id="b63a">'+FLT.map(function(f){return '<option value="'+f[0]+'"'+(V.a===f[0]?' selected':'')+'>'+f[1]+'</option>'}).join('')+'</select></label></div><div id="b63l"></div>')
  +(PARTS[b.business_type]&&ap?cd('تحديث جماعي (CSV)',csvCard()):'')}
function wh(w){return w.querySelector('[data-h]')}
/* ---- السجلات ---- */
function histHtml(r,kind){if(r.error)return '<div class="msg err" style="display:block">'+X(e63(r.error))+'</div>';var L=r.data||[];if(!L.length)return '<p class="b17n">لا يوجد سجل تغييرات بعد.</p>';
 return L.map(function(h){var cu=h.currency||h.old_currency||'';return '<div class="b15e"><small>'+fd(h.created_at)+'</small> السعر: '+(h.old_price!=null?X(h.old_price)+' ← ':'')+(h.new_price!=null?X(h.new_price)+' '+X(cu):'—')+(kind==='offer'&&h.new_availability?' · التوفر: '+X(AVL[h.new_availability]||''):'')+'</div>'}).join('')}
function stockHist(r){if(r.error)return '<div class="msg err" style="display:block">'+X(e63(r.error))+'</div>';var L=r.data||[];if(!L.length)return '<p class="b17n">لا توجد تغييرات مخزون مسجّلة.</p>';
 var q=function(v){return v==null?'غير معروف':String(v)};return L.map(function(h){return '<div class="b15e"><small>'+fd(h.created_at)+'</small> الكمية: '+X(q(h.old_qty))+' ← '+X(q(h.new_qty))+(h.old_track!==h.new_track?' · التتبع: '+(h.new_track?'مفعّل':'متوقف'):'')+(h.old_availability!==h.new_availability?' · التوفر: '+X(AVL[h.new_availability]||h.new_availability||''):'')+'</div>'}).join('')}
/* ---- الأحداث ---- */
document.addEventListener('input',function(e){if(e.target.id==='b63q'){V.q=e.target.value.trim().slice(0,60);list()}});
document.addEventListener('change',function(e){var i=e.target.id;if(i==='b63k'){V.k=e.target.value;list()}else if(i==='b63a'){V.a=e.target.value;list()}else if(i==='b63f')csvRead(e.target)});
var go=act;
document.addEventListener('click',function(e){var b=e.target.closest('[data-b63]');if(!b||!AU.user||!BS.b||!E('b21c').contains(b))return;var k=b.dataset.b63,w=b.closest('[data-oid]')||b.closest('.b17c')||document,id=w.dataset&&w.dataset.oid||b.dataset.id,c=sbc();
 if(BS.b.status!=='approved'){say('err','هذا القسم يُفتح بعد قبول النشاط.');return}
 if(k==='lh'){var h=wh(w);h.innerHTML='جارٍ التحميل…';c.from('listing_price_history').select('old_price,new_price,old_currency,currency,created_at').eq('listing_id',id).order('created_at',{ascending:false}).limit(30).then(function(r){h.innerHTML=histHtml(r,'listing')});return}
 if(k==='oh'){var h2=wh(w);h2.innerHTML='جارٍ التحميل…';c.from('parts_offer_history').select('old_price,new_price,currency,new_availability,created_at').eq('offer_id',id).order('created_at',{ascending:false}).limit(30).then(function(r){h2.innerHTML=histHtml(r,'offer')});return}
 if(k==='sh'){var h3=wh(w);h3.innerHTML='جارٍ التحميل…';c.from('b63_stock_log').select('old_qty,new_qty,old_track,new_track,old_availability,new_availability,created_at').eq('offer_id',id).order('created_at',{ascending:false}).limit(30).then(function(r){h3.innerHTML=stockHist(r)});return}
 if(k==='tog'){go(b,function(c){return c.from('parts_offers').update({status:b.dataset.s}).eq('id',id).select('id').then(chk)},b.dataset.s==='hidden'?'أُوقف البيع لهذا العرض.':'أُعيد العرض للبيع.');return}
 if(k==='sp'){var p=d2(val(w,'pr')).replace(/[\s,]/g,''),n=p===''?null:Number(p),cu=val(w,'cu'),av=val(w,'av');
  if(n!=null&&(!isFinite(n)||n<0||n>1e12)){say('err','السعر غير صحيح.');return}if(cu!=='USD'&&cu!=='IQD'){say('err','العملة غير صحيحة.');return}if(AVK.indexOf(av)<0){say('err','حالة التوفر غير صحيحة.');return}
  var prev=(BS.D.offers.d||[]).filter(function(o){return o.id===id})[0],chg=prev&&(Number(prev.price)!==n||prev.currency!==(n==null?null:cu));
  go(b,function(c){return c.from('parts_offer_history').select('id',{count:'exact',head:true}).eq('offer_id',id).then(function(h0){return c.from('parts_offers').update({price:n,currency:n==null?null:cu,availability:av}).eq('id',id).select('id').then(chk).then(function(){
    if(!chg||h0.error)return;return c.from('parts_offer_history').select('id',{count:'exact',head:true}).eq('offer_id',id).then(function(h1){if(!h1.error&&h1.count===h0.count)toast('تم الحفظ، لكن لم يُسجَّل تغيير السعر في سجل الأسعار. راجع triggers الجدول parts_offer_history.')})})})},'تم حفظ السعر والتوفر.');return}
 if(k==='stk'){var tk=w.querySelector('[data-k="tk"]').checked,qs=d2(val(w,'qt')),ts=d2(val(w,'th')),re=/^[0-9]{1,7}$/;
  if(tk&&qs!==''&&!re.test(qs)){say('err','الكمية يجب أن تكون عدداً صحيحاً (0 أو أكثر). لا تُقبل الكميات السالبة.');return}if(tk&&ts!==''&&!re.test(ts)){say('err','حد التنبيه يجب أن يكون عدداً صحيحاً (0 أو أكثر).');return}
  go(b,function(c){return c.rpc('b63_set_stock',{p_offer:id,p_track:tk,p_qty:tk&&qs!==''?Number(qs):null,p_threshold:tk&&ts!==''?Number(ts):null}).then(function(r){if(r.error)throw r.error;if(!r.data)throw new Error('forbidden')})},'تم حفظ المخزون.');return}
 if(k==='csvgo'){csvApply(b);return}
 if(k==='csvt'){csvTemplate();return}
 if(k==='csvx'){CSV=null;draw();return}
});
/* ---- CSV: تحديث عروض موجودة فقط (سعر/عملة/توفر/كمية). لا إنشاء ولا حذف. معاينة ثم تأكيد ---- */
function csvCard(){var r='';
 if(CSV){var ok=CSV.rows.filter(function(x){return x.ok}).length,bad=CSV.rows.length-ok;
  r='<p><b>معاينة الملف:</b> '+CSV.rows.length+' سطر · صالح للتطبيق: '+ok+' · مرفوض: '+bad+'</p><div class="bz-list">'+CSV.rows.slice(0,200).map(function(x){return '<div>سطر '+x.n+': <bdi dir="ltr">'+X(x.key)+'</bdi> — '+(x.ok?'<span class="bd published">'+X(x.note)+'</span>':'<span class="bd rejected">'+X(x.err)+'</span>')+'</div>'}).join('')+'</div>'
   +'<div class="b15h">'+(ok?'<button class="btn btn-p" data-b63="csvgo" type="button">تأكيد تطبيق '+ok+' تحديث</button>':'')+'<button class="btn" data-b63="csvx" type="button">إلغاء</button></div>'}
 return '<p class="b17n">يحدّث العروض الموجودة لديك فقط، ويطابقها برقم القطعة (أو رقم القطعة عندك). لا ينشئ عروضاً ولا يحذف ولا يغيّر بيانات الكتالوج. الأعمدة: <bdi dir="ltr">part_number,price,currency,availability,stock_qty</bdi> — availability: <bdi dir="ltr">'+AVK.join(' | ')+'</bdi>. حتى 300 سطر.</p>'
  +'<div class="b15h"><button class="btn" data-b63="csvt" type="button">تنزيل نموذج الملف</button><label class="btn" style="cursor:pointer">اختيار ملف CSV<input id="b63f" type="file" accept=".csv,text/csv" hidden></label></div>'+r}
function csvTemplate(){var t='﻿part_number,price,currency,availability,stock_qty\r\nEXAMPLE-123,45.5,USD,in_stock,\r\n',u=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download='bahr_offers_template.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},3000)}
function parseCsv(t){var rows=[],r=[],f='',q=false,i=0;t=t.replace(/^﻿/,'');
 for(;i<t.length;i++){var ch=t[i];if(q){if(ch==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}else if(ch==='"')q=true;else if(ch===','){r.push(f);f=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;r.push(f);f='';if(r.some(function(x){return x.trim()!==''}))rows.push(r);r=[]}else f+=ch}
 if(f!==''||r.length){r.push(f);if(r.some(function(x){return x.trim()!==''}))rows.push(r)}return rows}
var nk=function(s){return d2(s).toUpperCase().replace(/[^A-Z0-9]/g,'')};
function csvRead(inp){var f=inp.files&&inp.files[0];inp.value='';if(!f)return;if(f.size>262144){say('err','الملف كبير (الحد 256 ك.ب).');return}
 var rd=new FileReader();rd.onerror=function(){say('err','تعذّرت قراءة الملف.')};rd.onload=function(){try{csvBuild(String(rd.result||''))}catch(x){say('err','ملف غير صالح.')}};rd.readAsText(f,'utf-8')}
function csvBuild(t){var R0=parseCsv(t);if(R0.length<2){say('err','الملف فارغ أو بلا بيانات.');return}
 var hd=R0[0].map(function(x){return x.trim().toLowerCase()}),ix=function(n){return hd.indexOf(n)},ip=ix('part_number');if(ip<0){say('err','العمود part_number مطلوب في السطر الأول.');return}
 var ic=ix('price'),iu=ix('currency'),ia=ix('availability'),iq=ix('stock_qty');if(ic<0&&ia<0&&iq<0){say('err','لا يوجد عمود للتحديث (price أو availability أو stock_qty).');return}
 if(R0.length-1>300){say('err','الحد الأقصى 300 سطر.');return}
 var O=(BS.D.offers&&BS.D.offers.ok?BS.D.offers.d:[])||[],S=stockMap(BS.D),by={};
 O.forEach(function(o){[o.parts_items&&o.parts_items.part_number,o.supplier_part_number].forEach(function(p){var k=nk(p);if(k){by[k]=by[k]||[];if(by[k].indexOf(o)<0)by[k].push(o)}})});
 var seen={},seenO={},rows=[];
 R0.slice(1).forEach(function(r,i){var key=(r[ip]||'').trim(),k=nk(key),x={n:i+2,key:key||'—',ok:false},m=by[k]||[],g=function(j){return j<0?'':(r[j]||'').trim()};
  if(!k){x.err='رقم القطعة فارغ';rows.push(x);return}
  if(seen[k]){x.err='مكرر داخل الملف';rows.push(x);return}seen[k]=1;
  if(!m.length){x.err='لا يوجد عرض لديك بهذا الرقم (لن يُنشأ عرض جديد)';rows.push(x);return}
  if(m.length>1){x.err='يطابق أكثر من عرض: عدّله يدوياً';rows.push(x);return}
  if(seenO[m[0].id]){x.err='العرض نفسه مذكور في سطر سابق';rows.push(x);return}seenO[m[0].id]=1;
  var o=m[0],s=S[o.id],u={id:o.id},ps=d2(g(ic)).replace(/[\s,]/g,''),cu=g(iu).toUpperCase(),av=g(ia),qs=d2(g(iq));
  if(ps!==''){var n=Number(ps);if(!isFinite(n)||n<0||n>1e12){x.err='سعر غير صحيح';rows.push(x);return}if(cu!=='USD'&&cu!=='IQD'){x.err='العملة يجب أن تكون USD أو IQD';rows.push(x);return}u.price=n;u.currency=cu}
  else if(cu!==''){x.err='العملة بلا سعر';rows.push(x);return}
  if(av!==''){if(AVK.indexOf(av)<0){x.err='توفر غير معروف: '+av;rows.push(x);return}u.av=av}
  if(qs!==''){if(!/^[0-9]{1,7}$/.test(qs)){x.err='كمية غير صحيحة (عدد صحيح 0 أو أكثر)';rows.push(x);return}if(!s||!s.track_stock){x.err='تتبع الكمية غير مفعّل لهذا العرض';rows.push(x);return}
   var q=Number(qs);if(u.av&&((q===0&&u.av==='in_stock')||(q>0&&u.av==='out_of_stock'))){x.err='الكمية تتعارض مع التوفر';rows.push(x);return}u.q=q;u.s=s;delete u.av}
  if(u.price===undefined&&u.av===undefined&&u.q===undefined){x.err='لا قيمة للتحديث';rows.push(x);return}
  var same=(u.price===undefined||(Number(o.price)===u.price&&o.currency===u.currency))&&(u.av===undefined||o.availability===u.av)&&(u.q===undefined||(s&&s.stock_qty===u.q));
  if(same){x.err='لا تغيير عن القيم الحالية';rows.push(x);return}
  x.ok=true;x.u=u;x.note='جاهز: '+[u.price!==undefined?'السعر':'',u.av!==undefined?'التوفر':'',u.q!==undefined?'الكمية':''].filter(Boolean).join(' + ');rows.push(x)});
 CSV={rows:rows};say('','');draw()}
function csvApply(b){if(!CSV||busy)return;var todo=CSV.rows.filter(function(x){return x.ok});if(!todo.length)return;
 if(!confirm('سيتم تطبيق '+todo.length+' تحديث على عروضك. المتابعة؟'))return;
 var c=sbc(),okN=0,fails=[];b.disabled=true;say('in','جارٍ التطبيق…');
 var ch=Promise.resolve();todo.forEach(function(x){ch=ch.then(function(){var u=x.u,p=Promise.resolve();
  if(u.price!==undefined||u.av!==undefined){var d={};if(u.price!==undefined){d.price=u.price;d.currency=u.currency}if(u.av!==undefined)d.availability=u.av;
   p=c.from('parts_offers').update(d).eq('id',u.id).select('id').then(function(r){if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('forbidden')})}
  if(u.q!==undefined)p=p.then(function(){return c.rpc('b63_set_stock',{p_offer:u.id,p_track:true,p_qty:u.q,p_threshold:u.s.low_stock_threshold}).then(function(r){if(r.error)throw r.error;if(!r.data)throw new Error('forbidden')})});
  return p.then(function(){okN++},function(e){fails.push('سطر '+x.n+': '+e63(e))})})});
 ch.then(function(){CSV=null;b.disabled=false;say(fails.length?'err':'',(okN+' تحديث حُفظ فعلاً على الخادم، '+fails.length+' فشل.')+(fails.length?' '+fails.slice(0,5).join(' | '):''));toast(okN+' تحديث محفوظ.');home()})}
/* ---- قسم الأسعار والعروض: سجل حقيقي لأسعاري ---- */
B63.prices=function(b,D){var its=items(D);
 return cd('الأسعار والعروض','<p>تعديل السعر والعملة والتوفر من قسم «منتجاتي ومخزوني». كل تغيير يُسجَّل في سجل الأسعار على الخادم ولا يمكن تعديله من الواجهة.</p><div class="b15h"><button class="btn btn-p" data-bz="iv" type="button">فتح منتجاتي ومخزوني</button></div><p class="b17n">الحملات والتخفيضات: '+tg('غير منفّذ')+'</p>')
  +'<div id="b63ph" class="bz-c"><h3>آخر تغييرات أسعاري</h3><p class="b17n">جارٍ التحميل…</p></div>'}
B63.afterDraw=function(){var el=E('b63l');if(el)list();var ph=E('b63ph');if(!ph||!BS.D)return;var c=sbc(),O=(BS.D.offers&&BS.D.offers.ok?BS.D.offers.d:[])||[],Ls=(BS.D.listings&&BS.D.listings.ok?BS.D.listings.d:[])||[],nm={};
 O.forEach(function(o){nm['o'+o.id]=(o.parts_items||{}).name||'عرض'});Ls.forEach(function(l){nm['l'+l.id]=l.title||'إعلان'});
 var qs=[];if(O.length)qs.push(c.from('parts_offer_history').select('offer_id,old_price,new_price,currency,created_at').in('offer_id',O.map(function(o){return o.id})).order('created_at',{ascending:false}).limit(30).then(function(r){return r.error?{e:r.error}:{d:(r.data||[]).map(function(h){return{n:nm['o'+h.offer_id],h:h}})}}));
 if(Ls.length)qs.push(c.from('listing_price_history').select('listing_id,old_price,new_price,old_currency,currency,created_at').in('listing_id',Ls.map(function(l){return l.id})).order('created_at',{ascending:false}).limit(30).then(function(r){return r.error?{e:r.error}:{d:(r.data||[]).map(function(h){return{n:nm['l'+h.listing_id],h:h}})}}));
 Promise.all(qs).then(function(a){var all=[],er=null;a.forEach(function(x){if(x.e)er=x.e;else all=all.concat(x.d)});all.sort(function(p,q){return Date.parse(q.h.created_at)-Date.parse(p.h.created_at)});
  ph.innerHTML='<h3>آخر تغييرات أسعاري</h3>'+(er?'<div class="msg err" style="display:block">تعذّر تحميل جزء من السجل: '+X(e63(er))+'</div>':'')+(all.length?all.slice(0,30).map(function(x){var h=x.h;return '<div class="b15e"><small>'+fd(h.created_at)+'</small> <b dir="auto">'+X(x.n||'')+'</b> — '+(h.old_price!=null?X(h.old_price)+' ← ':'')+(h.new_price!=null?X(h.new_price)+' '+X(h.currency||''):'—')+'</div>'}).join(''):(er?'':'<p class="b17n">لا توجد تغييرات أسعار مسجّلة بعد.</p>'))})}
/* ---- أدوات الإدارة (تُركَّب داخل صفحة إدارة قطع الغيار #admparts؛ الصلاحية تفرضها دوال الخادم is_admin) ---- */
var AQ={q:'',a:'',r:''};
B63.adminMount=function(el){if(!el)return;var c=sbc();
 el.innerHTML='<h3>مراجعة عروض الموردين والأسعار (B63)</h3><p class="b17n">للقراءة والمراجعة: إيقاف عرض مخالف يتم بزر «إيقاف» (نفس إجراء المراجعة الحالي). لا حذف ولا دمج تلقائي. مشكلة في بيانات القطعة المركزية تُعالَج من الكتالوج وبلاغات القطع، أما مشكلة السعر أو التوفر فهي في عرض المتجر.</p>'
  +'<div class="b17r"><label>بحث<input id="b63aq" type="search" maxlength="60" placeholder="قطعة أو رقم أو مورد"></label><label>التوفر<select id="b63aa"><option value="">الكل</option>'+AVK.map(function(k){return '<option value="'+k+'">'+AVL[k]+'</option>'}).join('')+'</select></label><label>المراجعة<select id="b63ar"><option value="">الكل</option><option value="published">منشور</option><option value="pending">قيد المراجعة</option><option value="suspended">موقوف</option><option value="rejected">مرفوض</option></select></label></div>'
  +'<div class="b15h"><button class="btn btn-p" data-b63a="go" type="button">بحث</button><button class="btn" data-b63a="dup" type="button">تكرارات محتملة</button><button class="btn" data-b63a="chg" type="button">سجل تعديلات الأسعار</button></div><div id="b63ao"></div>';
 el.onclick=function(e){var b=e.target.closest('[data-b63a]');if(!b)return;var o=E('b63ao'),k=b.dataset.b63a;
  var fail=function(r){o.innerHTML='<div class="msg err" style="display:block">'+X(/forbidden/.test(String(r.message||''))?'هذه الأدوات للمشرفين فقط.':e63(r))+'</div>'};
  if(k==='go'){o.innerHTML='جارٍ التحميل…';c.rpc('b63_admin_offers',{p_q:el.querySelector('#b63aq').value.trim()||null,p_availability:el.querySelector('#b63aa').value||null,p_review:el.querySelector('#b63ar').value||null,p_limit:50,p_offset:0}).then(function(r){if(r.error)return fail(r.error);var L=r.data||[];
   o.innerHTML=L.length?L.map(function(x){return '<div class="b17c b15r" style="display:block" data-q="'+X(x.offer_id)+'"><b dir="auto">'+X(x.part_name||'')+'</b> <span dir="ltr">'+X(x.part_number||'')+'</span><br><small>المورد: '+X(x.supplier_name||'')+' · '+(x.price!=null?X(x.price)+' '+X(x.currency||''):'بلا سعر')+' · '+X(AVL[x.availability]||x.availability||'')+' · '+X(LS[x.review_status]||x.review_status||'')+(x.status==='hidden'?' · متوقف من المورد':'')+' · آخر تأكيد: '+(x.confirmed_at?fd(x.confirmed_at):'—')+'</small><div class="b15h"><button class="btn" data-b63a="sus" type="button">إيقاف العرض</button><a class="btn" href="#admparts">بيانات القطعة المركزية</a></div></div>'}).join(''):'<p class="b17n">لا نتائج.</p>'});return}
  if(k==='sus'){var id=b.closest('[data-q]').dataset.q,why=prompt('سبب الإيقاف (يراه المورد):');if(!why||!why.trim())return;b.disabled=true;c.rpc('parts_admin_review_offer',{p_id:id,p_decision:'suspended',p_reason:why}).then(function(r){if(r.error){b.disabled=false;return fail(r.error)}toast('أُوقف العرض.');el.querySelector('[data-b63a="go"]').click()});return}
  if(k==='dup'){o.innerHTML='جارٍ التحميل…';c.rpc('b63_admin_duplicates').then(function(r){if(r.error)return fail(r.error);var L=r.data||[];o.innerHTML='<p class="b17n">للمراجعة اليدوية فقط؛ لا يُدمج أي سجل تلقائياً.</p>'+(L.length?L.map(function(x){return '<div class="b15e">'+(x.kind==='offer_same_part'?'عروض متعددة من المورد نفسه لنفس القطعة':'سجلات قطع بنفس الرقم بعد التطبيع')+' ('+X(x.n)+'): <bdi dir="ltr">'+X(x.dup_key)+'</bdi></div>'}).join(''):'<p class="b17n">لا تكرارات محتملة.</p>')});return}
  if(k==='chg'){o.innerHTML='جارٍ التحميل…';c.rpc('b63_admin_changes',{p_limit:60}).then(function(r){if(r.error)return fail(r.error);var L=r.data||[];o.innerHTML=L.length?L.map(function(x){return '<div class="b15e"><small>'+fd(x.created_at)+'</small> '+(x.kind==='offer'?'عرض قطعة':'إعلان')+' <bdi dir="ltr">'+X(String(x.ref_id).slice(0,8))+'</bdi> — '+(x.old_price!=null?X(x.old_price)+' ← ':'')+(x.new_price!=null?X(x.new_price)+' '+X(x.currency||''):'—')+(x.availability?' · '+X(AVL[x.availability]||''):'')+'</div>'}).join(''):'<p class="b17n">لا تعديلات مسجّلة.</p>'});return}}};
})();

B21.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b21')});document.title='بحر | BAHR BUSINESS';R().dataset.b='';R().parentNode.classList.remove('bzw');
 if(!sbc()){R().innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}
 if(k==='admbiz')adm();else if(k.slice(0,4)==='biz-')pub(k.slice(4));else home()};
var s1=B15.sync;B15.sync=function(){s1();var l=E('admBizLink'),c=sbc();if(l)l.style.display='none';if(l&&c&&AU.user)c.rpc('is_admin').then(function(r){if(!r.error&&r.data===true)l.style.display=''})};
})();

/* ===== B22 + B46: BAHR CONNECT — «محادثاتي»: صندوق + دردشة + Realtime (b22_connect.sql + b46_chat.sql). عند تعطّل Realtime يعمل جلب دوري احتياطي ===== */
var B22={};
(function(){
var X=function(v){return ex(v)},R=function(){return E('b22c')},busy=false,CID=null,ME={},AV={},AD={},UC={},UID=null,CS=null,CT='',CL=null;
var IB={list:[],bl:{},q:'',ch:null,uid:null,t:null,lost:false};
var KD={listing:'إعلان',part:'قطعة غيار',business:'نشاط تجاري'},PG=30,RK='bahr_b46_ret',RX=/^#(p|part|biz|u|s)-[\w-]+$/,TOUCH=false;
try{TOUCH=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches)}catch(e){}
var fd=function(x){try{return new Date(x).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}catch(e){return''}};
function ft(x){try{var d=new Date(x);return d.toDateString()===new Date().toDateString()?d.toLocaleTimeString('ar-IQ',{hour:'numeric',minute:'2-digit'}):d.toLocaleDateString('ar-IQ',{day:'numeric',month:'short'})}catch(e){return''}}
function say(t,x){var m=E('b22m');if(m){m.className='msg'+(t?' '+t:'');m.style.display=x?'block':'';m.textContent=x||''}}
function net(t){var n=E('b46n');if(n){n.hidden=!t;n.textContent=t||''}}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883')return 'نظام المحادثات غير مفعّل على الخادم بعد (يلزم تطبيق b22_connect.sql).';
 if(/blocked/.test(m))return 'لا يمكن المراسلة: يوجد حظر بين الطرفين.';
 if(/closed/.test(m))return 'هذه المحادثة مغلقة.';
 if(/rate_limit/.test(m))return 'عدد كبير من الرسائل أو المحادثات. حاول لاحقاً.';
 if(/invalid_target/.test(m))return 'تعذّر بدء المحادثة مع هذا الطرف.';
 if(/bad_body/.test(m))return 'الرسالة فارغة أو أطول من 2000 حرف.';
 if(/forbidden|row-level|42501|policy|permission denied/i.test(m))return 'لا تملك صلاحية تنفيذ هذا الإجراء.';
 if(/jwt|expired|auth_required/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة.';
 return 'حدث خطأ: '+m.slice(0,120)}
/* ---------- العودة إلى الإعلان بعد تسجيل الدخول (مسارات داخلية مسموحة فقط + صلاحية 15 دقيقة) ---------- */
B22.setRet=function(h){try{if(RX.test(h||''))sessionStorage.setItem(RK,h+'|'+Date.now())}catch(e){}};
B22.ret=function(){try{var v=(sessionStorage.getItem(RK)||'').split('|');sessionStorage.removeItem(RK);return RX.test(v[0]||'')&&Date.now()-Number(v[1])<9e5?v[0]:''}catch(e){return''}};
/* ---------- أدوات ---------- */
function other(v){return v.user_a===AU.user.id?v.user_b:v.user_a}
function refOf(v){var k=['ref_id','ref','listing_id','entity_id','target_id'],i,n;for(i=0;i<k.length;i++)if(v[k[i]]&&PF.UUID.test(v[k[i]]))return v[k[i]];for(n in v)if(/ref/i.test(n)&&v[n]&&PF.UUID.test(v[n]))return v[n];return ''}
function unread(v){var me=AU.user.id,r=v.user_a===me?v.a_read_at:v.b_read_at;return !!(v.last_sender&&v.last_sender!==me&&v.last_message_at&&(!r||v.last_message_at>r))}
function act(v){return v.last_message_at||v.created_at||''}
function names(c,ids){ids=ids.filter(function(i){return i&&!ME[i]});if(!ids.length)return Promise.resolve();
 function put(r){(r.data||[]).forEach(function(u){ME[u.id]=u.business_name||u.display_name||'مستخدم بحر';if(u.avatar_path)AV[u.id]=u.avatar_path});ids.forEach(function(i){ME[i]=ME[i]||'مستخدم بحر'})}
 return c.from('public_profiles').select('id,display_name,business_name,avatar_path').in('id',ids).then(function(r){if(r.error)return c.from('public_profiles').select('id,display_name,business_name').in('id',ids).then(put);put(r)})}
function av(id){var p=AV[id],u='';try{u=p?sbc().storage.from('avatars').getPublicUrl(p).data.publicUrl:''}catch(e){}return u?'<img class="b46av" src="'+X(u)+'" alt="" loading="lazy" decoding="async">':'<span class="b46av" aria-hidden="true">'+X((ME[id]||'؟').charAt(0))+'</span>'}
function ads(c,L){var ids=[];L.forEach(function(v){var r=refOf(v);if(v.kind==='listing'&&r&&!AD[r]&&ids.indexOf(r)<0)ids.push(r)});if(!ids.length)return Promise.resolve();
 return c.from('listings').select('id,title,listing_images(storage_path,sort_order)').in('id',ids.slice(0,60)).then(function(r){(r.data||[]).forEach(function(l){var im=(l.listing_images||[]).slice().sort(function(a,b){return a.sort_order-b.sort_order})[0];AD[l.id]={t:l.title||'إعلان',img:im?c.storage.from('listing-images').getPublicUrl(im.storage_path).data.publicUrl:''}})})}
function cnt(c,L){var me=AU.user.id;UC={};return Promise.all(L.filter(unread).slice(0,30).map(function(v){var r=v.user_a===me?v.a_read_at:v.b_read_at,q=c.from('connect_messages').select('id',{count:'exact',head:true}).eq('conversation_id',v.id).neq('sender_id',me);if(r)q=q.gt('created_at',r);return q.then(function(x){UC[v.id]=x.error?1:Math.max(1,x.count||1)})}))}
function rm(ch){if(ch){try{sbc().removeChannel(ch)}catch(e){}}}
function stopChat(){var s=CS;CS=null;if(s){rm(s.ch);clearInterval(s.tm);clearTimeout(s.rd)}}
function stopInbox(){rm(IB.ch);IB.ch=null;IB.uid=null;clearTimeout(IB.t)}
function stopAll(){stopChat();stopInbox();CID=null;busy=false}
/* ---------- صندوق «محادثاتي» ---------- */
function row(v){var o=other(v),a=AD[refOf(v)],u=unread(v),n=UC[v.id]||1;
 return '<a class="b46r'+(u?' un':'')+'" href="#chat-'+X(v.id)+'">'+av(o)+'<span class="b46m"><span class="b46t"><b dir="auto">'+X(ME[o])+'</b><span class="bd new">'+X(KD[v.kind]||'')+'</span>'+(IB.bl[o]?'<span class="bd rejected">محظور</span>':v.status==='closed'?'<span class="bd rejected">مغلقة</span>':'')+'</span>'+(a?'<small class="b46a" dir="auto">'+X(a.t)+'</small>':'')+'<span class="b46p" dir="auto">'+X(v.last_message_preview||'لا رسائل بعد')+'</span></span><span class="b46x"><small>'+ft(act(v))+'</small>'+(u?'<span class="b46c" aria-label="'+n+' رسائل غير مقروءة">'+(n>99?'99+':n)+'</span>':'')+(a&&a.img?'<img class="b46i" src="'+X(a.img)+'" alt="" loading="lazy" decoding="async">':'')+'</span></a>'}
function paintInbox(){var el=E('b46l');if(!el||!AU.user)return;var q=(IB.q||'').trim().toLowerCase();
 if(!IB.list.length){el.innerHTML='<div class="sel">لا توجد محادثات بعد. ابدأ من صفحة إعلان أو نشاط أو عرض قطعة عبر زر «راسل صاحب الإعلان».</div>';return}
 var L=IB.list.slice().sort(function(a,b){return act(a)<act(b)?1:act(a)>act(b)?-1:0}).filter(function(v){if(!q)return true;var a=AD[refOf(v)];return((ME[other(v)]||'')+' '+(a&&a.t||'')+' '+(v.last_message_preview||'')).toLowerCase().indexOf(q)>-1});
 el.innerHTML=L.length?L.map(row).join(''):'<p class="b17n">لا نتائج مطابقة لبحثك.</p>'}
function loadInbox(silent){var c=sbc(),me=AU.user.id;
 return Promise.all([c.from('connect_conversations').select('*').order('last_message_at',{ascending:false,nullsFirst:false}).limit(100),c.from('connect_blocks').select('blocked_id')]).then(function(a){
  if(a[0].error)throw a[0].error;if(!AU.user||AU.user.id!==me||!E('b46l'))return;
  var L=a[0].data||[];IB.bl={};(a[1].data||[]).forEach(function(x){IB.bl[x.blocked_id]=1});IB.list=L;
  return Promise.all([names(c,L.map(other)),ads(c,L),cnt(c,L)]).then(function(){paintInbox();B22.sync()})
 }).catch(function(e){var el=E('b46l');if(!el||(silent&&IB.list.length))return;el.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div><p><button class="btn btn-p" type="button" data-b22="iretry">إعادة المحاولة</button></p>'})}
function subInbox(){var c=sbc(),me=AU.user.id;if(IB.ch&&IB.uid===me)return;stopInbox();IB.uid=me;
 var ch=c.channel('b46i:'+me+':'+Date.now()),f=function(){if(!E('b46l'))return;clearTimeout(IB.t);IB.t=setTimeout(function(){loadInbox(true)},350)};
 ch.on('postgres_changes',{event:'*',schema:'public',table:'connect_conversations',filter:'user_a=eq.'+me},f).on('postgres_changes',{event:'*',schema:'public',table:'connect_conversations',filter:'user_b=eq.'+me},f).subscribe(function(s){if(IB.ch!==ch)return;
  if(s==='SUBSCRIBED'){net('');if(IB.lost){IB.lost=false;f()}}else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='CLOSED'){IB.lost=true;net('التحديث الفوري متوقف مؤقتاً. اضغط «تحديث» أو أعد فتح الصفحة.')}});IB.ch=ch}
function inbox(){stopChat();CID=null;
 R().innerHTML='<h1>محادثاتي</h1><div id="b22m" class="msg" role="alert"></div><div class="b46s"><input id="b46q" type="search" placeholder="ابحث في المحادثات (الاسم، الإعلان، الرسالة)" aria-label="بحث في المحادثات" value="'+X(IB.q)+'"></div><div id="b46n" class="b46n" role="status" hidden></div><div id="b46l" aria-live="polite"><p class="b17n">جارٍ التحميل…</p></div><p><button class="btn" type="button" data-b22="iretry">تحديث</button></p>';
 loadInbox(false);subInbox()}
/* ---------- واجهة الدردشة ---------- */
function bub(m){var me=m.sender_id===AU.user.id;return '<div class="b46g '+(me?'me':'ot')+'"><div class="b46b"><small class="b46u" dir="auto">'+(me?'أنت':X(ME[m.sender_id]||'مستخدم بحر'))+'</small><div dir="auto" class="b46z">'+X(m.body)+'</div><small class="b46k" dir="auto">'+fd(m.created_at)+'</small></div></div>'}
function merge(rows){var s=CS,me=AU.user.id,a={n:0,mine:false,other:false};if(!s)return a;
 rows.forEach(function(m){if(!m||!m.id||s.ids[m.id])return;s.ids[m.id]=1;s.msgs.push(m);a.n++;if(m.sender_id===me)a.mine=true;else a.other=true});
 if(a.n)s.msgs.sort(function(x,y){return x.created_at<y.created_at?-1:x.created_at>y.created_at?1:(x.id<y.id?-1:1)});return a}
function paintMsgs(mode,a){var s=CS,el=E('b22l');if(!s||!el)return;var end=el.scrollHeight-el.scrollTop-el.clientHeight<80,h0=el.scrollHeight,t0=el.scrollTop;
 el.innerHTML=(s.more?'<p class="b17n" style="text-align:center"><button class="btn" type="button" data-b22="older"'+(s.busy?' disabled':'')+'>'+(s.busy?'جارٍ التحميل…':'عرض رسائل أقدم')+'</button></p>':'')
  +(s.msgs.length?s.msgs.map(bub).join(''):(s.pend?'':'<p class="b17n">لا رسائل بعد. ابدأ المحادثة.</p>'))
  +(s.pend?'<div class="b46g me pend"><div class="b46b"><div dir="auto" class="b46z">'+X(s.pend.body)+'</div><small class="b46k">جارٍ الإرسال… (لم يتأكد الحفظ بعد)</small></div></div>':'');
 var d=E('b46d');
 if(mode==='end'||(mode==='keep'&&end)){el.scrollTop=el.scrollHeight;if(d)d.hidden=true}
 else if(mode==='older')el.scrollTop=t0+(el.scrollHeight-h0);
 else{el.scrollTop=t0;if(a&&a.other&&d)d.hidden=false}}
function markRead(){var s=CS;if(!s||document.hidden)return;clearTimeout(s.rd);s.rd=setTimeout(function(){if(CS===s)sbc().rpc('connect_mark_read',{p_conv:s.id}).then(function(){B22.sync()})},400)}
function loadMsgs(first){var s=CS,c=sbc();if(!s)return Promise.resolve();
 return c.from('connect_messages').select('*').eq('conversation_id',s.id).order('created_at',{ascending:false}).limit(PG).then(function(r){if(r.error)throw r.error;if(CS!==s)return;
  var rows=(r.data||[]).slice().reverse();if(first)s.more=rows.length>=PG;var a=merge(rows);
  if(first||a.n){paintMsgs(first||a.mine?'end':'keep',a)}if(first||a.other)markRead()})}
function older(){var s=CS,c=sbc();if(!s||s.busy||!s.more||!s.msgs.length)return;s.busy=true;paintMsgs('older');
 c.from('connect_messages').select('*').eq('conversation_id',s.id).lt('created_at',s.msgs[0].created_at).order('created_at',{ascending:false}).limit(PG).then(function(r){if(r.error)throw r.error;if(CS!==s)return;var rows=(r.data||[]).slice().reverse();s.more=rows.length>=PG;merge(rows)}).catch(function(e){say('err',emsg(e))}).then(function(){if(CS===s){s.busy=false;paintMsgs('older')}})}
function setPoll(s,ms){clearInterval(s.tm);s.tm=setInterval(function(){if(CS!==s||location.hash!=='#chat-'+s.id){clearInterval(s.tm);return}loadMsgs(false).catch(function(){})},ms)}
function subChat(){var s=CS,c=sbc(),me=AU.user.id;
 var ch=c.channel('b46c:'+s.id+':'+me+':'+Date.now());s.ch=ch;setPoll(s,30000);
 ch.on('postgres_changes',{event:'INSERT',schema:'public',table:'connect_messages',filter:'conversation_id=eq.'+s.id},function(ev){if(CS!==s)return;var m=ev&&ev.new;if(!m||!m.id||m.conversation_id!==s.id)return;var a=merge([m]);if(!a.n)return;paintMsgs(a.mine?'end':'keep',a);if(a.other)markRead()})
 .subscribe(function(st){if(CS!==s||s.ch!==ch)return;
  if(st==='SUBSCRIBED'){var was=s.lost;s.lost=false;net('');setPoll(s,30000);if(was)loadMsgs(false).catch(function(){})}
  else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'||st==='CLOSED'){s.lost=true;net('الاتصال الفوري متوقف مؤقتاً. تُحدَّث الرسائل كل 10 ثوانٍ وسيعود الاتصال تلقائياً.');setPoll(s,10000)}})}
function setSend(b){var x=E('b22s');if(x)x.disabled=!!b}
function send(){var s=CS,c=sbc(),t=E('b22t');if(!s||!t||busy)return;var body=t.value.trim();if(!body)return;
 if(body.length>2000){say('err','الرسالة أطول من 2000 حرف.');return}
 if(navigator.onLine===false){say('err','لا يوجد اتصال بالإنترنت. لم تُرسل الرسالة.');return}
 if(body!==CT){CT=body;CL=uid()}var cl=CL,ok=false;busy=true;setSend(true);s.pend={body:body};t.value='';say('in','جارٍ الإرسال…');paintMsgs('end');
 c.rpc('connect_send',{p_conv:s.id,p_body:body,p_client:cl}).then(function(r){if(r.error)throw r.error;ok=true;CT='';CL=null;return loadMsgs(false)})
  .catch(function(x){if(!ok){if(CS===s&&!t.value)t.value=body;say('err',emsg(x)+' لم تُرسل الرسالة، ويمكنك الضغط على «إرسال» مجدداً دون تكرارها.')}})
  .then(function(){busy=false;if(CS===s){s.pend=null;paintMsgs(ok?'end':'keep');if(ok)say('');setSend(false)}})}
function chat(id){var c=sbc(),back='<p><a class="btn" href="#inbox">‹ محادثاتي</a></p>';stopChat();stopInbox();CID=id;
 R().innerHTML=back+'<div id="b22m" class="msg" role="alert"></div><p class="b17n">جارٍ التحميل…</p>';
 Promise.all([c.from('connect_conversations').select('*').eq('id',id).maybeSingle(),c.from('connect_blocks').select('blocked_id')]).then(function(a){
  if(a[0].error)throw a[0].error;var v=a[0].data;if(CID!==id)return;
  if(!v){R().innerHTML=back+'<p>هذه المحادثة غير موجودة أو لا تملك صلاحية عرضها.</p>';return}
  var o=other(v),bl=(a[1].data||[]).some(function(x){return x.blocked_id===o});
  return Promise.all([names(c,[o]),ads(c,[v])]).then(function(){if(CID!==id)return;var ad=AD[refOf(v)],ok=v.status==='active'&&!bl;
   R().innerHTML=back+'<div class="b46h">'+av(o)+'<div class="b46m"><b dir="auto">'+X(ME[o])+'</b><span class="b15h"><span class="bd new">'+X(KD[v.kind]||'')+'</span>'+(v.status==='closed'?'<span class="bd rejected">مغلقة</span>':'')+(bl?'<span class="bd rejected">محظور</span>':'')+'</span></div></div>'
    +(ad?'<a class="b46ad" href="#p-'+X(refOf(v))+'">'+(ad.img?'<img src="'+X(ad.img)+'" alt="" loading="lazy" decoding="async">':'')+'<span dir="auto">'+X(ad.t)+'</span></a>':'')
    +'<div id="b22m" class="msg" role="alert"></div><div id="b46n" class="b46n" role="status" hidden></div>'
    +'<div class="b46w"><div id="b22l" class="b46L" role="log" aria-live="polite"></div><button type="button" id="b46d" class="b46d btn btn-p" data-b22="down" hidden>رسائل جديدة ↓</button></div>'
    +(ok?'<div class="b46f"><textarea id="b22t" rows="2" maxlength="2000" placeholder="اكتب رسالتك" aria-label="نص الرسالة" enterkeyhint="send"></textarea><button class="btn btn-p" id="b22s" data-b22="send" type="button">إرسال</button></div>'+(TOUCH?'':'<small class="b17n">Enter للإرسال · Shift+Enter لسطر جديد</small>'):'<p class="b17n">'+(bl?'لقد حظرت هذا الطرف: ألغِ الحظر لمتابعة المراسلة.':'المحادثة مغلقة.')+'</p>')
    +'<div class="b15h" style="margin-top:10px"><button class="btn" data-b22="ref" type="button">تحديث</button><button class="btn" data-b22="blk" data-o="'+X(o)+'" data-u="'+(bl?'1':'')+'" type="button">'+(bl?'إلغاء الحظر':'حظر')+'</button>'+(v.status==='active'?'<button class="btn" data-b22="cls" type="button">إغلاق المحادثة</button>':'')
    +'<select id="b22r" aria-label="سبب البلاغ"><option value="spam">سبام</option><option value="abuse">إساءة</option><option value="fraud">احتيال</option><option value="inappropriate">محتوى غير لائق</option><option value="other">أخرى</option></select><button class="btn" data-b22="rep" data-o="'+X(o)+'" type="button">إبلاغ</button></div>';
   CS={id:id,v:v,o:o,msgs:[],ids:{},more:false,busy:false,pend:null,ch:null,tm:null,lost:false,rd:null};var s=CS;
   E('b22l').addEventListener('scroll',function(){var el=this;if(CS===s&&el.scrollTop<50&&s.more&&!s.busy)older();if(el.scrollHeight-el.scrollTop-el.clientHeight<80){var d=E('b46d');if(d)d.hidden=true}});
   loadMsgs(true).catch(function(e){say('err',emsg(e))});subChat()})}).catch(function(e){R().innerHTML=back+'<div class="msg err" style="display:block">'+X(emsg(e))+'</div><p><button class="btn btn-p" type="button" data-b22="cretry">إعادة المحاولة</button></p>'})}
function uid(){return crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(k){var r=Math.random()*16|0;return(k==='x'?r:r&3|8).toString(16)})}
/* ---------- بدء محادثة من إعلان/قطعة/نشاط: يستأنف الموجودة بدل تكرارها ---------- */
B22.start=function(kind,ref,o,btn){
 if(!AU.user){B22.setRet(location.hash);NEXT='سجّل الدخول لمراسلة الطرف الآخر. سنعيدك إلى الصفحة بعد الدخول.';location.hash='#login';return}
 if(!o||o===AU.user.id){toast('لا يمكنك مراسلة نفسك.');return}
 var c=sbc();if(!c)return;if(btn)btn.disabled=true;
 function go(n){return c.rpc('connect_start',{p_other:o,p_kind:kind,p_ref:ref}).then(function(r){if(r.error){if(r.error.code==='23505'&&n<1)return go(n+1);throw r.error}location.hash='#chat-'+r.data})}
 c.from('connect_conversations').select('*').eq('kind',kind).limit(100).then(function(r){var ex0=!r.error&&(r.data||[]).filter(function(v){return other(v)===o&&v.status==='active'&&(!refOf(v)||refOf(v)===ref)})[0];if(ex0){location.hash='#chat-'+ex0.id;return}return go(0)})
  .catch(function(e){toast(emsg(e))}).then(function(){if(btn)btn.disabled=false})};
document.addEventListener('click',function(e){var n=e.target.closest('[data-cn]');if(n){var p=n.dataset.cn.split('|');B22.start(p[0],p[1],p[2],n);return}
 var b=e.target.closest('[data-b22]');if(!b||!AU.user)return;var k=b.dataset.b22,c=sbc();
 if(k==='iretry'){if(E('b46l')){E('b46l').innerHTML='<p class="b17n">جارٍ التحميل…</p>';loadInbox(false)}return}
 if(k==='cretry'){if(CID)chat(CID);return}
 if(!CID)return;
 if(k==='ref'){if(CS)loadMsgs(true).catch(function(x){say('err',emsg(x))});return}
 if(k==='older'){older();return}
 if(k==='down'){var el=E('b22l');if(el)el.scrollTop=el.scrollHeight;b.hidden=true;return}
 if(k==='send'){send();return}
 if(k==='blk'){var un=!!b.dataset.u;if(!un&&!confirm('حظر هذا الطرف؟ لن يستطيع أي منكما إرسال رسائل جديدة.'))return;
  (un?c.from('connect_blocks').delete().eq('blocker_id',AU.user.id).eq('blocked_id',b.dataset.o):c.from('connect_blocks').insert({blocker_id:AU.user.id,blocked_id:b.dataset.o})).then(function(r){if(r.error){say('err',emsg(r.error));return}toast(un?'أُلغي الحظر.':'تم الحظر.');chat(CID)});return}
 if(k==='cls'){if(!confirm('إغلاق المحادثة؟ لا يمكن إرسال رسائل جديدة بعد الإغلاق.'))return;c.rpc('connect_close',{p_conv:CID}).then(function(r){if(r.error){say('err',emsg(r.error));return}toast('أُغلقت المحادثة.');chat(CID)});return}
 if(k==='rep'){if(!confirm('إرسال بلاغ عن هذه المحادثة إلى الإدارة؟'))return;c.from('connect_reports').insert({reporter_id:AU.user.id,conversation_id:CID,reported_user_id:b.dataset.o,reason:E('b22r').value}).then(function(r){if(r.error){say('err',emsg(r.error));return}toast('أُرسل البلاغ. شكراً لك.')})}});
/* Enter يرسل على الكمبيوتر فقط؛ Shift+Enter ولوحات اللمس تبقى لسطر جديد (لا يتعطل التحرير متعدد الأسطر ولا لوحة الإدخال العربية) */
document.addEventListener('keydown',function(e){if(e.target&&e.target.id==='b22t'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229&&!TOUCH){e.preventDefault();send()}});
document.addEventListener('input',function(e){if(e.target&&e.target.id==='b46q'){IB.q=e.target.value;paintInbox()}});
document.addEventListener('focusin',function(e){if(e.target&&e.target.id==='b22t')setTimeout(function(){var t=E('b22t');if(t&&t.scrollIntoView)t.scrollIntoView({block:'end'})},350)});
if(window.visualViewport)visualViewport.addEventListener('resize',function(){var t=E('b22t');if(t&&document.activeElement===t&&t.scrollIntoView)t.scrollIntoView({block:'end'})});
document.addEventListener('visibilitychange',function(){if(document.hidden||!AU.user)return;if(CS)loadMsgs(false).catch(function(){});else if(E('b46l'))loadInbox(true)});
window.addEventListener('online',function(){if(!AU.user)return;net('');if(CS)loadMsgs(false).catch(function(){});else if(E('b46l'))loadInbox(true)});
window.addEventListener('offline',function(){if(CS||E('b46l'))net('أنت غير متصل بالإنترنت. لن تُرسل الرسائل حتى يعود الاتصال.')});
window.addEventListener('pagehide',stopAll);
window.addEventListener('hashchange',function(){var h=location.hash;if(!/^#chat-/.test(h))stopChat();if(h!=='#inbox'&&!/^#chat-/.test(h))stopInbox()});
B22.page=function(k){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b22')});document.title='بحر | محادثاتي';
 if(!sbc()){R().innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}k==='inbox'?inbox():chat(k.slice(5))};
B22.sync=function(){var c=sbc();if(!c)return;if(!AU.user){UID=null;stopAll();return}if(UID&&UID!==AU.user.id)stopAll();UID=AU.user.id;
 c.rpc('connect_unread').then(function(r){if(r.error)return;var n=Number(r.data)||0;[].forEach.call(document.querySelectorAll('a[href="#inbox"]'),function(a){a.dataset.t0=a.dataset.t0||a.textContent;a.textContent=a.dataset.t0+(n?' ('+n+')':'')})})};
var s2=B15.sync;B15.sync=function(){s2();B22.sync()};
})();





/* B74: كشف عميل Supabase العام (anon) والحالة الحالية للسكربتات الإضافية (B59/B72/B73/B74)؛ كانت window.sbc غير معرّفة فلا تعمل تلك الوصلات */
window.sbc=sbc;window.AU=AU;
window.addEventListener('hashchange',route);route();

document.addEventListener('click',function(e){var b=e.target.closest('[data-soon]');if(b){menu(false);toast(b.getAttribute('data-soon')+' سيتوفر في مرحلة قادمة.')}});
  /* ---------- فحص اتصال Supabase (منطق B1) ---------- */
  function jwtRole(key) {
    try { return JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role || null; }
    catch (e) { return null; }
  }
  async function health() {
    var c = window.BAHR_CONFIG || {};
    var url = String(c.supabaseUrl || '').replace(/\/+$/, ''), key = String(c.supabaseAnonKey || ''), role = jwtRole(key);
    if (!/^https:\/\/[a-z0-9]{10,}\.supabase\.co$/.test(url)) return [0, 'رابط Supabase غير صحيح.'];
    if (role === 'service_role') return [0, 'المفتاح service_role سري ولا يوضع في الواجهة.'];
    if (role !== 'anon') return [0, 'مفتاح anon مفقود أو غير صالح.'];
    if (!window.supabase || !window.supabase.createClient) return [0, 'تعذّر تحميل مكتبة Supabase.'];
    try {
      var cl = sbc() || window.supabase.createClient(url, key);
      var r = await fetch(url + '/auth/v1/settings', { headers: { apikey: key } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      var s = await cl.auth.getSession();
      if (s.error) throw s.error;
      return [1, 'الاتصال بـ Supabase يعمل.'];
    } catch (e) { return [0, 'تعذّر الاتصال بـ Supabase (' + e.message + ').']; }
  }
  window.addEventListener('load', function () {
    health().then(function (r) { var s = $('#st'); s.dataset.s = r[0]; s.lastChild.textContent = r[1]; });
  });
/* ===== B61: الخدمات البحرية وطلبات الصيانة (b61_marine_service_requests.sql) =====
   تصنيفات من قاعدة البيانات • صفحة خدمة عامة • طلب موجّه لنشاط • لوحة «طلبات الخدمات» • إدارة الخدمات.
   كل ما يمنع الوصول يُفرض في قاعدة البيانات (RLS + دوال SECURITY DEFINER)، والواجهة للعرض فقط. */
(function(){
var X=function(v){return ex(v)},fd=function(x){try{return new Date(x).toLocaleString('ar-IQ',{dateStyle:'medium',timeStyle:'short'})}catch(e){return''}};
var PS={new:'جديد',seen:'تمت مشاهدة الطلب',contacting:'يجري التواصل مع العميل',awaiting_info:'بانتظار معلومات إضافية',agreed:'تم الاتفاق على الخدمة',in_progress:'قيد التنفيذ',completed:'مكتمل',declined:'مرفوض أو ملغي'};
var NX={new:['seen','contacting','awaiting_info','declined'],seen:['contacting','awaiting_info','agreed','declined'],contacting:['awaiting_info','agreed','declined'],awaiting_info:['contacting','agreed','declined'],agreed:['in_progress','declined'],in_progress:['completed','declined']};
var BL={seen:'تمت المشاهدة',contacting:'بدء التواصل مع العميل',awaiting_info:'طلب معلومات إضافية',agreed:'تم الاتفاق على الخدمة',in_progress:'بدء التنفيذ',completed:'تم الإنجاز',declined:'رفض / إلغاء (السبب إلزامي)'};
var SKL={maintenance:'صيانة',diagnosis:'تشخيص عطل',repair:'إصلاح',install:'تركيب قطعة',inspection:'فحص المعدة',technician:'طلب فني أو ورشة بحرية',other:'أخرى'};
var EQL={marine_engine:'محرك بحري',jetski:'جت سكي',boat:'قارب',other:'أخرى'};
var CML={phone:'اتصال هاتفي',whatsapp:'واتساب',email:'بريد إلكتروني'};
var SSL={draft:'مسودة',pending_review:'بانتظار المراجعة',published:'منشورة',rejected:'مرفوضة',suspended:'موقوفة'};
var PHR=/^\+?[0-9]{7,15}$/;
B61.PS=PS;
function d2(s){return String(s==null?'':s).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632})}
function tel(n){n=d2(n).replace(/[\s-]/g,'');return PHR.test(n)?n:''}
function wan(n){n=tel(n);if(!n)return'';n=n.replace(/^\+/,'');return n[0]==='0'?'964'+n.slice(1):n}
function uuid(){return crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(k){var r=Math.random()*16|0;return(k==='x'?r:r&3|8).toString(16)})}
function bcls(s){return s==='completed'||s==='agreed'||s==='in_progress'?'published':s==='declined'?'rejected':'pending'}
function emsg(e){var c=e&&e.code||'',m=String(e&&e.message||e||'');
 if(c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42883'||c==='42703')return 'يلزم تشغيل b61_marine_service_requests.sql على Supabase أولاً.';
 if(/bad_transition/.test(m))return 'هذا الانتقال غير مسموح من الحالة الحالية.';
 if(/note_required/.test(m))return 'اكتب سبباً أو ملاحظة (3 أحرف على الأقل).';
 if(/request_cancelled/.test(m))return 'ألغى العميل هذا الطلب.';
 if(/service_unavailable/.test(m))return 'هذه الخدمة غير متاحة حالياً (موقوفة أو غير منشورة).';
 if(/business_unavailable/.test(m))return 'هذا النشاط غير معتمد لاستقبال الطلبات حالياً.';
 if(/own_business/.test(m))return 'لا يمكنك إرسال طلب إلى نشاطك أنت.';
 if(/business_not_approved/.test(m))return 'لا يمكن نشر خدمة نشاطها غير معتمد.';
 if(/bad_service_type/.test(m))return 'تصنيف الخدمة غير مفعّل. اختر تصنيفاً آخر.';
 if(/rate_limit/.test(m))return 'أرسلت طلبات كثيرة. حاول لاحقاً.';
 if(/forbidden|row-level|42501|policy|permission denied/i.test(m))return 'لا تملك صلاحية تنفيذ هذا الإجراء.';
 if(/jwt|expired/i.test(m))return 'انتهت جلستك. سجّل الدخول مرة أخرى.';
 if(/failed to fetch|network|load failed/i.test(m))return 'تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة.';
 return 'حدث خطأ: '+m.slice(0,120)}
function say(id,t,x){var m=E(id);if(m){m.className='msg'+(t?' '+t:'');m.style.display=t?'block':'';m.textContent=x||''}}
function priceTxt(p){var u=p.pr!=null&&p.pr!==''?Number(p.pr).toLocaleString('en-US')+' '+(p.cu==='USD'?'دولار':'دينار'):'';return p.pm==='fixed'&&u?u:p.pm==='from'&&u?'يبدأ من '+u:'السعر بعد المعاينة أو التواصل'}
var st=document.createElement('style');st.textContent='.b61ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center}.b61bx{background:#fff;width:100%;max-width:560px;max-height:88vh;overflow:auto;border-radius:16px 16px 0 0;padding:16px;box-sizing:border-box}@media(min-width:700px){.b61ov{align-items:center}.b61bx{border-radius:16px}}.b61f{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:0 0 10px}.b61f input,.b61f select{font:inherit;border:1px solid var(--line);border-radius:10px;padding:9px;min-width:0;width:100%;box-sizing:border-box;background:#fff}.b61c{display:inline-block;margin:2px 4px 2px 0;font-size:13px}.b61n{border:1px solid var(--line);border-radius:10px;padding:8px;margin:6px 0;background:#fafafa;overflow-wrap:anywhere}.b61t{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}.b61x textarea,.b61x input[type=text]{font:inherit;border:1px solid var(--line);border-radius:10px;padding:9px;width:100%;box-sizing:border-box}';document.head.appendChild(st);
/* ---------- الهدف (نشاط/خدمة) الذي يُوجَّه إليه الطلب ---------- */
function getT(){var t=null;try{t=JSON.parse(sessionStorage.getItem('b61t')||'null')}catch(e){}t=t||B61.t;if(t&&Date.now()-(t.at||0)>18e5)t=null;return t}
function setT(t){t.at=Date.now();B61.t=t;try{sessionStorage.setItem('b61t',JSON.stringify(t))}catch(e){}}
function clrT(){B61.t=null;try{sessionStorage.removeItem('b61t')}catch(e){}}
function go(t){setT(t);if(!AU.user){try{B22.setRet(location.hash)}catch(x){}NEXT='سجّل الدخول لإرسال طلب الخدمة. سنعيدك إلى هذه الصفحة بعد الدخول.';location.hash='#login';return}location.hash='#requestservice'}
/* ---------- التصنيفات والبيانات العامة ---------- */
B61.act=function(k){return !B61.inact[k]};
B61.loadCats=function(c){return c.from('service_categories').select('key,label,icon,sort_order,is_active').order('sort_order').then(function(r){if(r.error||!r.data||!r.data.length)return;B61.cats=r.data;B61.loaded=true;B61.inact={};var A=ST,B=B61.S3T;r.data.forEach(function(x){if(!x.is_active)B61.inact[x.key]=1;if(A){delete A[x.key];A[x.key]=[x.label,x.icon||'wrench']}if(B){delete B[x.key];B[x.key]=x.label}})}).catch(function(){})};
B61.loadPub=function(c,pub){return c.from('b61_public_services').select('*').order('created_at',{ascending:false}).limit(200).then(function(r){if(r.error)throw r.error;
 return(r.data||[]).map(function(x){var im=(x.images||[]).map(function(p){return ex(c.storage.from('service-images').getPublicUrl(p).data.publicUrl)});if(!im.length&&x.image_path)im=[pub(x.image_path)];
  return{id:ex(x.id),n:ex(x.name),s:(x.service_types||[]).filter(function(k){return ST[k]}),pv:ex(x.province),ar:ex(x.area),eq:(x.equipment||[]).map(ex),img:im,d:ex(x.description),h:ex(x.hours),ph:ex(x.contact_phone),biz:x.biz_id||'',own:x.owner_id||'',bn:ex(x.biz_name),pm:x.price_mode,pr:x.price,cu:x.currency,du:ex(x.est_duration),vf:!!x.is_verified}})})};
B61.sdExtra=function(p){var ph=tel(p.ph),w=wan(p.ph),mine=!!(AU.user&&p.own&&AU.user.id===p.own);
 var h='<table class="sp"><tr><td>السعر</td><td>'+X(priceTxt(p))+'</td></tr>'+(p.du?'<tr><td>المدة التقديرية</td><td>'+X(p.du)+'</td></tr>':'')+(p.bn?'<tr><td>مقدّم الخدمة</td><td>'+(p.biz?'<a href="#biz-'+X(p.biz)+'">'+X(p.bn)+'</a>':X(p.bn))+(p.vf?' <span class="bd published">موثّق</span>':'')+'</td></tr>':'')+'</table>';
 if(p.img.length>1)h+='<div class="b17g">'+p.img.slice(1).map(function(u){return '<a href="'+X(u)+'" target="_blank" rel="noopener"><div class="b17t"><img src="'+X(u)+'" alt="صورة من أعمال الخدمة" loading="lazy"></div></a>'}).join('')+'</div>';
 h+='<div class="b15h" style="margin-top:10px">'+(p.biz&&!mine?'<button class="btn btn-p" type="button" data-b61="req" data-id="'+X(p.id)+'">اطلب هذه الخدمة</button>':'')+(ph?'<a class="btn" href="tel:'+X(ph)+'">اتصال</a>':'')+(w?'<a class="btn" href="https://wa.me/'+X(w)+'" target="_blank" rel="noopener">واتساب</a>':'')+(p.own&&!mine?'<button class="btn" type="button" data-cn="business|'+X(p.biz)+'|'+X(p.own)+'">مراسلة داخل بحر</button>':'')+'</div>';
 if(!ph&&!w)h+='<p class="b17n">لم يعرض النشاط رقم اتصال. استخدم زر الطلب أو المراسلة.</p>';
 if(p.biz&&!mine)h+='<details class="bz-rp"><summary>الإبلاغ عن هذه الخدمة</summary><label>السبب<select data-k="rr"><option value="scam">احتيال أو نصب</option><option value="fake">خدمة أو نشاط وهمي</option><option value="wrong_info">معلومات مضلِّلة</option><option value="prohibited">محتوى ممنوع</option><option value="other">غير ذلك</option></select></label><label>تفاصيل (اختياري)<textarea data-k="rd" maxlength="1000" rows="3"></textarea></label><button class="btn" data-b61="rep" data-id="'+X(p.biz)+'" data-n="'+X(p.n)+'" type="button">إرسال البلاغ</button></details>';
 return h};
B61.bizServices=function(b){var el=E('b61bs');if(!el)return;var svc=b.business_type==='workshop'||b.business_type==='technician';if(!svc)return;var c=sbc(),mine=!!(AU.user&&AU.user.id===b.owner_id);
 var gen=mine?'':'<div class="b15h"><button class="btn btn-p" type="button" data-b61="breq" data-id="'+X(b.id)+'" data-o="'+X(b.owner_id)+'" data-n="'+X(b.name)+'">اطلب خدمة من هذا النشاط</button></div>';
 el.innerHTML='<h3>الخدمات</h3><div id="b61bl" class="b17n">جارٍ التحميل…</div>'+gen;
 c.from('b61_public_services').select('id,name,service_types,price,price_mode,currency,est_duration').eq('biz_id',b.id).order('created_at',{ascending:false}).limit(50).then(function(r){if(r.error)throw r.error;var L=r.data||[],x=E('b61bl');if(!x)return;x.className='';
  x.innerHTML=L.length?L.map(function(s){var p={pm:s.price_mode,pr:s.price,cu:s.currency};return '<div class="b17c b15r" style="display:block"><a href="#s-'+X(s.id)+'"><b dir="auto">'+X(s.name)+'</b></a><div>'+(s.service_types||[]).filter(function(k){return ST[k]}).map(function(k){return '<span class="chip">'+X(ST[k][0])+'</span>'}).join(' ')+'</div><div class="b17n">'+X(priceTxt(p))+(s.est_duration?' · المدة: '+X(s.est_duration):'')+'</div>'+(mine?'':'<button class="btn" type="button" data-b61="req" data-id="'+X(s.id)+'">اطلب هذه الخدمة</button>')+'</div>'}).join(''):'<p class="b17n">لا توجد خدمات منشورة لهذا النشاط حالياً.</p>'}).catch(function(e){var x=E('b61bl');if(x){x.className='';x.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'}})};
/* ---------- نموذج الطلب: الجهة، المراجعة قبل الإرسال، شاشة النجاح ---------- */
B61.banner=function(kind){var t=getT();if(kind!=='service'||!t||!t.biz)return'';return '<div class="sel" id="b61bn"><b>الطلب موجّه إلى:</b> '+X(t.bn||'')+(t.sn?' — '+X(t.sn):'')+' <button type="button" class="btn" data-b61="cltg">إلغاء التوجيه (طلب عام لفريق بحر)</button></div>'};
B61.tag=function(p){var t=getT();if(p.req_type==='service'&&t&&t.biz){p.biz_id=t.biz;if(t.svc)p.service_id=t.svc}return p};
B61.review=function(p,n,ok){var t=getT(),r=[['الجهة',p.biz_id&&t?(t.bn||'')+(t.sn?' — '+t.sn:''):'فريق بحر (طلب عام)'],['الخدمة المطلوبة',SKL[p.service_kind]||''],['المعدة',(EQL[p.equipment_type]||'')+[p.manufacturer,p.model,p.year].filter(Boolean).map(function(x){return ' · '+x}).join('')],['المشكلة',p.description],['الموقع',p.province+(p.area?'، '+p.area:'')],['التواصل',(CML[p.contact_method]||'')+': '+p.contact_value],['الصور',n?n+' صورة':'بدون صور']].filter(function(a){return a[1]});
 var o=document.createElement('div');o.className='b61ov';o.id='b61rv';o.innerHTML='<div class="b61bx" role="dialog" aria-modal="true" aria-label="مراجعة الطلب"><h2 style="margin:0 0 8px">راجع طلبك قبل الإرسال</h2><table class="sp">'+r.map(function(a){return '<tr><td>'+a[0]+'</td><td dir="auto" style="white-space:pre-wrap">'+X(a[1])+'</td></tr>'}).join('')+'</table><div class="b15h" style="margin-top:12px"><button class="btn btn-p" type="button" data-b61="rvok">تأكيد وإرسال</button><button class="btn" type="button" data-b61="rvno">رجوع للتعديل</button></div></div>';
 document.body.appendChild(o);B61._ok=ok;var b=o.querySelector('[data-b61="rvok"]');if(b)b.focus()};
B61.sent=function(row,p){var t=getT(),el=E('b15c');clrT();if(!el)return;var tg=p.biz_id&&t;
 el.innerHTML='<div class="b17c" style="display:block"><h1>تم إرسال طلبك</h1>'+(row&&row.req_no!=null?'<p>رقم الطلب: <b>#'+X(row.req_no)+'</b></p>':'<p>تم حفظ الطلب في حسابك.</p>')+'<p>الحالة: <span class="bd pending">جديد</span></p>'+(tg?'<p>وصل الطلب إلى <b>'+X(t.bn||'النشاط')+'</b> ويظهر في لوحته. ستجد كل تحديث على حالته في صفحة الطلب.</p>':'<p>سيراجع فريق بحر طلبك وتظهر التحديثات في صفحة الطلب.</p>')
  +'<div class="b15h">'+(row&&row.id?'<a class="btn btn-p" href="#request-'+X(row.id)+'">متابعة الطلب</a>':'')+'<a class="btn" href="#myrequests">طلباتي</a>'+(tg&&t.own?'<button class="btn" type="button" data-cn="business|'+X(t.biz)+'|'+X(t.own)+'">مراسلة النشاط</button>':'')+'</div></div>'};
B61.afterDetail=function(c,x){var el=E('b15l');if(!el||!x.biz_id)return;var me=AU.user&&AU.user.id,own=x.user_id===me;
 if(!own)[].forEach.call(el.querySelectorAll('.b17a'),function(a){a.style.display='none'});
 var box=document.createElement('div');box.className='b17c';box.style.display='block';box.innerHTML='<h4 style="margin:0 0 6px">حالة الطلب لدى مقدّم الخدمة</h4><p><span class="bd '+bcls(x.provider_status||'new')+'">'+X(PS[x.provider_status||'new']||'')+'</span></p><div id="b61lg" class="b17n">جارٍ تحميل السجل…</div>'+(own?'':'<div class="b15h"><a class="btn btn-p" href="#business">فتح لوحة النشاط ← طلبات الخدمات</a></div>');el.appendChild(box);
 c.from('service_request_log').select('actor_role,from_status,to_status,note,created_at').eq('request_id',x.id).order('created_at').then(function(r){var l=E('b61lg');if(!l)return;l.className='';if(r.error){l.innerHTML=X(emsg(r.error));return}l.innerHTML=(r.data||[]).length?r.data.map(function(v){return '<div class="b15e"><small>'+fd(v.created_at)+' · '+X(PS[v.to_status]||v.to_status)+'</small>'+(v.note?'<div>'+X(v.note)+'</div>':'')+'</div>'}).join(''):'<span class="b17n">لا توجد تغييرات بعد.</span>'})};
/* ---------- صور الخدمة في لوحة النشاط ---------- */
function imgThumbs(){var c=sbc(),h='';B61.keep.forEach(function(p,i){var u=c?c.storage.from('service-images').getPublicUrl(p).data.publicUrl:'';h+='<div class="b17t"><img src="'+X(u)+'" alt=""><button type="button" data-b61="rmk" data-i="'+i+'" aria-label="حذف">×</button></div>'});B61.files.forEach(function(f,i){h+='<div class="b17t"><img src="'+X(f.u)+'" alt=""><button type="button" data-b61="rmf" data-i="'+i+'" aria-label="حذف">×</button></div>'});return h}
function imgPaint(){var g=E('b61ig'),n=E('b61ic');if(g)g.innerHTML=imgThumbs();if(n)n.textContent=(B61.keep.length+B61.files.length)+' / 4'}
B61.imgUI=function(s){B61.files=[];B61.keep=((s&&s.images)||[]).slice();B61.dirty=false;return '<div class="b17i"><b>صور الخدمة (اختياري، حتى 4)</b> <span id="b61ic">'+B61.keep.length+' / 4</span><div id="b61ig" class="b17g">'+imgThumbs()+'</div><label class="btn b17u">إضافة صور<input id="b61if" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label><small>صور حقيقية لأعمالك فقط. تُصغَّر تلقائياً وتظهر في الصفحة العامة بعد قبول الخدمة.</small></div>'};
B61.prep=function(c,d,ed){if(!B61.dirty)return Promise.resolve();var uid=AU.user.id,paths=[];
 return B61.files.reduce(function(ch,o,i){return ch.then(function(){return B17.comp(o.f).then(function(bl){var p=uid+'/'+uuid()+'/'+i+'.jpg';return c.storage.from('service-images').upload(p,bl,{contentType:'image/jpeg',upsert:false}).then(function(r){if(r.error)throw r.error;paths.push(p)})})})},Promise.resolve())
  .then(function(){d.images=B61.keep.concat(paths).slice(0,4);B61.files=[];B61.dirty=false}).catch(function(e){if(paths.length)c.storage.from('service-images').remove(paths);throw e})};
document.addEventListener('change',function(e){var i=e.target;if(!i||i.id!=='b61if')return;var bad=0;[].forEach.call(i.files,function(f){if(B61.keep.length+B61.files.length>=4){bad=1;return}if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size>15e6){bad=2;return}B61.files.push({f:f,u:URL.createObjectURL(f)});B61.dirty=true});i.value='';imgPaint();if(bad)toast(bad===1?'الحد الأقصى 4 صور.':'بعض الملفات غير مقبولة (JPG/PNG/WebP حتى 15MB).')});
/* ---------- نقرات عامة: طلب خدمة، إبلاغ، مراجعة الطلب ---------- */
document.addEventListener('click',function(e){var b=e.target.closest('[data-b61]');if(!b)return;var k=b.dataset.b61;
 if(k==='req'){var p=PRV.filter(function(i){return String(i.id)===b.dataset.id})[0];if(p&&p.biz){go({biz:p.biz,svc:p.id,sn:p.n,bn:p.bn,own:p.own});return}
  var c=sbc();if(!c)return;b.disabled=true;c.from('b61_public_services').select('id,name,biz_id,owner_id,biz_name').eq('id',b.dataset.id).maybeSingle().then(function(r){b.disabled=false;var s=r.data;if(r.error||!s||!s.biz_id){toast('تعذّر فتح هذه الخدمة للطلب.');return}go({biz:s.biz_id,svc:s.id,sn:s.name,bn:s.biz_name,own:s.owner_id})});return}
 if(k==='breq'){go({biz:b.dataset.id,svc:'',sn:'',bn:b.dataset.n,own:b.dataset.o});return}
 if(k==='cltg'){clrT();var bn=E('b61bn');if(bn)bn.remove();return}
 if(k==='rvno'){var o=E('b61rv');if(o)o.remove();return}
 if(k==='rvok'){var o2=E('b61rv'),f=B61._ok;if(o2)o2.remove();B61._ok=null;if(f)f();return}
 if(k==='rmk'){B61.keep.splice(+b.dataset.i,1);B61.dirty=true;imgPaint();return}
 if(k==='rmf'){var r2=B61.files.splice(+b.dataset.i,1)[0];if(r2)URL.revokeObjectURL(r2.u);imgPaint();return}
 if(k==='rep'){if(!AU.user){NEXT='سجّل الدخول للإبلاغ.';try{B22.setRet(location.hash)}catch(x){}location.hash='#login';return}
  var w=b.closest('details'),sel=w.querySelector('[data-k="rr"]'),dt=w.querySelector('[data-k="rd"]').value.trim();b.disabled=true;
  sbc().from('reports').insert({business_id:b.dataset.id,reason:sel.value,details:('بلاغ عن خدمة: '+(b.dataset.n||'')+' — '+sel.selectedOptions[0].textContent+(dt?' — '+dt:'')).slice(0,1000)}).then(function(r){
   if(r.error){b.disabled=false;toast(r.error.code==='23505'?'لديك بلاغ مفتوح على هذا النشاط بالفعل.':/row-level|42501/.test(r.error.message)?'لا يمكنك الإبلاغ عن نشاطك أنت.':'تعذّر إرسال البلاغ.');return}
   w.innerHTML='<p>وصل بلاغك وستراجعه الإدارة. شكراً.</p>'}).catch(function(){b.disabled=false;toast('انقطع الاتصال.')})}});
/* ---------- لوحة النشاط: «طلبات الخدمات» ---------- */
var P={b:null,rows:[],svc:{},q:'',st:'',d1:'',d2:'',open:null,info:{},busy:false};
function eff(x){return x.status==='cancelled'?'cancelled':(x.provider_status||'new')}
function follow(x){var s=eff(x);return(s==='new'||s==='contacting'||s==='awaiting_info')&&Date.now()-Date.parse(x.updated_at||x.created_at)>1728e5}
B61.rq=function(b){var el=E('b61rb');if(!el)return;P.b=b;P.open=null;P.q='';P.st='';P.d1='';P.d2='';var c=sbc();if(!c){el.innerHTML='<p class="b17n">الاتصال بالخادم غير جاهز.</p>';return}
 Promise.all([c.from('service_requests').select('*').eq('biz_id',b.id).order('created_at',{ascending:false}).limit(300),c.from('marine_services').select('id,name').eq('biz_id',b.id)]).then(function(a){if(a[0].error)throw a[0].error;P.rows=a[0].data||[];P.svc={};(a[1].data||[]).forEach(function(s){P.svc[s.id]=s.name});shell()})
 .catch(function(e){var x=E('b61rb');if(x)x.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div><button class="btn" type="button" data-b61p="reload">إعادة المحاولة</button>'})};
function shell(){var el=E('b61rb');if(!el)return;var nw=P.rows.filter(function(x){return eff(x)==='new'}).length,fl=P.rows.filter(follow).length;
 el.className='b61x';el.innerHTML='<div class="bz-g"><div class="bz-k">كل الطلبات<b>'+P.rows.length+'</b></div><div class="bz-k">جديدة<b>'+nw+'</b></div><div class="bz-k">تحتاج متابعة<b>'+fl+'</b></div></div><p class="b17n">«تحتاج متابعة»: طلب في حالة جديد أو يجري التواصل أو بانتظار معلومات ولم يتغير منذ يومين أو أكثر.</p>'
  +'<div id="b61m" class="msg" role="alert"></div><div class="b61f"><input id="b61q" type="search" placeholder="رقم الطلب أو اسم الخدمة" aria-label="بحث"><select id="b61s" aria-label="الحالة"><option value="">كل الحالات</option>'+Object.keys(PS).map(function(k){return '<option value="'+k+'">'+X(PS[k])+'</option>'}).join('')+'<option value="cancelled">ألغاه العميل</option><option value="follow">يحتاج متابعة</option></select><input id="b61d1" type="date" aria-label="من تاريخ"><input id="b61d2" type="date" aria-label="إلى تاريخ"></div><div id="b61l"></div>';
 var up=function(){P.q=E('b61q').value.trim().toLowerCase();P.st=E('b61s').value;P.d1=E('b61d1').value;P.d2=E('b61d2').value;list()};['b61q','b61s','b61d1','b61d2'].forEach(function(i){E(i).addEventListener(i==='b61q'?'input':'change',up)});list()}
function list(){var l=E('b61l');if(!l)return;var R=P.rows.filter(function(x){var s=eff(x);if(P.st==='follow'){if(!follow(x))return false}else if(P.st&&s!==P.st)return false;
  var d=(x.created_at||'').slice(0,10);if(P.d1&&d<P.d1)return false;if(P.d2&&d>P.d2)return false;
  if(P.q&&[x.req_no,P.svc[x.service_id],x.description,x.province,x.area,x.manufacturer,x.model].join(' ').toLowerCase().indexOf(P.q)<0)return false;return true});
 l.innerHTML=R.length?R.map(card).join(''):'<p class="b17n">'+(P.rows.length?'لا توجد طلبات مطابقة للتصفية.':'لا توجد طلبات موجّهة لنشاطك بعد. تظهر هنا الطلبات التي يرسلها العملاء من صفحة خدماتك.')+'</p>';
 if(P.open){var x=P.rows.filter(function(r){return r.id===P.open})[0];if(x)detail(x)}}
function card(x){var s=eff(x),o=P.open===x.id;return '<div class="b17c b15r" style="display:block" data-rid="'+X(x.id)+'"><div class="b15h"><b>#'+X(x.req_no)+'</b><span dir="auto">'+X(P.svc[x.service_id]||'طلب عام للنشاط')+'</span><span class="bd '+(s==='cancelled'?'rejected':bcls(s))+'">'+X(s==='cancelled'?'ألغاه العميل':PS[s])+'</span>'+(s==='new'?'<span class="bd new">جديد</span>':'')+(follow(x)?'<span class="bd pending">يحتاج متابعة</span>':'')+'</div><small>'+fd(x.created_at)+' · '+X(x.province||'')+(x.area?'، '+X(x.area):'')+' · '+X(EQL[x.equipment_type]||'')+'</small><div style="margin-top:6px"><button class="btn" type="button" data-b61p="open" data-id="'+X(x.id)+'">'+(o?'إخفاء التفاصيل':'فتح التفاصيل')+'</button></div><div data-det="'+X(x.id)+'"></div></div>'}
function detail(x){var box=document.querySelector('[data-det="'+x.id+'"]');if(!box)return;var s=eff(x),I=P.info[x.id],cm=x.contact_method,cv=x.contact_value||'';
 var rows=[['الخدمة المطلوبة',SKL[x.service_kind]||''],['المعدة',(EQL[x.equipment_type]||'')+[x.manufacturer,x.model,x.year].filter(Boolean).map(function(v){return ' · '+v}).join('')],x.power_hp?['القدرة',x.power_hp+' حصان']:0,x.is_stopped!=null?['المعدة متوقفة',x.is_stopped?'نعم':'لا']:0,x.serial_or_part_no?['الرقم التسلسلي',x.serial_or_part_no]:0,['الموقع',(x.province||'')+(x.area?'، '+x.area:'')],['طريقة التواصل المفضلة',(CML[cm]||'')+': '+cv]].filter(Boolean);
 var ph=cm==='email'?'':tel(cv),w=cm==='email'?'':wan(cv);
 var h='<hr><table class="sp">'+rows.map(function(a){return '<tr><td>'+a[0]+'</td><td dir="auto">'+X(a[1])+'</td></tr>'}).join('')+'</table><p style="white-space:pre-wrap;margin:6px 0">'+X(x.description)+'</p><div class="b17g" id="b61im-'+X(x.id)+'"></div>'
  +'<div class="b15h">'+(ph?'<a class="btn" href="tel:'+X(ph)+'">اتصال</a>':'')+(w?'<a class="btn" href="https://wa.me/'+X(w)+'" target="_blank" rel="noopener">واتساب</a>':'')+(cm==='email'&&cv?'<a class="btn" href="mailto:'+X(cv)+'">بريد</a>':'')+'<button class="btn" type="button" data-b61p="chat" data-u="'+X(x.user_id)+'">مراسلة العميل داخل بحر</button></div>';
 if(s==='cancelled')h+='<p class="b17n">ألغى العميل هذا الطلب، ولا يمكن تغيير حالته.</p>';
 else if(NX[s])h+='<div class="b61x"><label class="b17n" for="b61nt-'+X(x.id)+'">ملاحظة تصل للعميل (إلزامية عند الرفض)</label><input type="text" id="b61nt-'+X(x.id)+'" maxlength="300" placeholder="مثال: نحتاج صورة لرقم المحرك"><div class="b15h" style="margin-top:6px">'+NX[s].map(function(n){return '<button class="btn'+(n==='declined'?'':' btn-p')+'" type="button" data-b61p="st" data-id="'+X(x.id)+'" data-s="'+n+'">'+X(BL[n])+'</button>'}).join('')+'</div></div>';
 else h+='<p class="b17n">الطلب في حالة نهائية: '+X(PS[s]||s)+'.</p>';
 h+='<h4 style="margin:10px 0 4px">سجل الحالة</h4>'+(I?(I.log.length?I.log.map(function(v){return '<div class="b15e"><small>'+fd(v.created_at)+' · '+X(PS[v.to_status]||v.to_status)+' · '+X(v.actor_role==='customer'?'العميل':v.actor_role==='admin'?'الإدارة':'أنت')+'</small>'+(v.note?'<div>'+X(v.note)+'</div>':'')+'</div>'}).join(''):'<p class="b17n">لا يوجد سجل.</p>'):'<p class="b17n">جارٍ التحميل…</p>')
  +'<h4 style="margin:10px 0 4px">ملاحظات داخلية <span class="bd">لا يراها العميل</span></h4>'+(I?(I.notes.length?I.notes.map(function(v){return '<div class="b61n"><small>'+fd(v.created_at)+'</small><div style="white-space:pre-wrap">'+X(v.body)+'</div></div>'}).join(''):'<p class="b17n">لا توجد ملاحظات.</p>'):'')
  +'<div class="b61x"><textarea id="b61in-'+X(x.id)+'" rows="2" maxlength="2000" placeholder="اكتب ملاحظة داخلية…" aria-label="ملاحظة داخلية"></textarea><button class="btn" type="button" data-b61p="note" data-id="'+X(x.id)+'" style="margin-top:6px">حفظ الملاحظة</button></div>';
 box.innerHTML=h;
 if(x.images&&x.images.length){sbc().storage.from('request-images').createSignedUrls(x.images,3600).then(function(d){var el=E('b61im-'+x.id);if(!el||d.error||!d.data)return;el.innerHTML=d.data.filter(function(i){return i.signedUrl}).map(function(i){return '<a href="'+X(i.signedUrl)+'" target="_blank" rel="noopener"><div class="b17t"><img src="'+X(i.signedUrl)+'" alt="صورة من العميل"></div></a>'}).join('')})}}
function loadInfo(x){var c=sbc();return Promise.all([c.from('service_request_log').select('actor_role,to_status,note,created_at').eq('request_id',x.id).order('created_at'),c.from('service_request_notes').select('body,created_at').eq('request_id',x.id).order('created_at')]).then(function(a){P.info[x.id]={log:a[0].data||[],notes:a[1].data||[]};if(a[0].error||a[1].error)say('b61m','err',emsg(a[0].error||a[1].error))})}
function refresh(id){var c=sbc();return c.from('service_requests').select('*').eq('id',id).maybeSingle().then(function(r){if(r.data){P.rows=P.rows.map(function(x){return x.id===id?r.data:x})}return loadInfo({id:id})}).then(function(){shell2()})}
function shell2(){var q=E('b61q');if(!q)return;var nw=P.rows.filter(function(x){return eff(x)==='new'}).length,fl=P.rows.filter(follow).length,ks=document.querySelectorAll('#b61rb .bz-k b');if(ks.length>2){ks[0].textContent=P.rows.length;ks[1].textContent=nw;ks[2].textContent=fl}list()}
document.addEventListener('click',function(e){var b=e.target.closest('[data-b61p]');if(!b||!AU.user)return;var k=b.dataset.b61p,c=sbc(),id=b.dataset.id;
 if(k==='reload'){B61.rq(P.b);return}
 if(k==='open'){if(P.open===id){P.open=null;list();return}P.open=id;list();var x=P.rows.filter(function(r){return r.id===id})[0];if(!x)return;
  loadInfo(x).then(function(){if(P.open===id)detail(x)}).then(function(){if(eff(x)==='new'&&c)return c.rpc('b61_provider_set_status',{p_id:id,p_status:'seen',p_note:null}).then(function(r){if(!r.error)return refresh(id)})});return}
 if(k==='chat'){B22.start('business',P.b.id,b.dataset.u,b);return}
 if(k==='note'){var t=E('b61in-'+id),v=t?t.value.trim():'';if(!v){say('b61m','err','اكتب نص الملاحظة.');return}b.disabled=true;
  c.rpc('b61_add_note',{p_id:id,p_body:v}).then(function(r){b.disabled=false;if(r.error)throw r.error;say('b61m','','');toast('حُفظت الملاحظة.');return refresh(id)}).catch(function(er){b.disabled=false;say('b61m','err',emsg(er))});return}
 if(k==='st'){var n=b.dataset.s,nt=E('b61nt-'+id),note=nt?nt.value.trim():'';if(n==='declined'&&note.length<3){say('b61m','err','اكتب سبب الرفض أو الإلغاء ليصل للعميل.');if(nt)nt.focus();return}
  if(n==='declined'&&!confirm('رفض/إلغاء هذا الطلب؟ لا يمكن التراجع.'))return;if(n==='completed'&&!confirm('تأكيد أن الخدمة اكتملت؟'))return;
  b.disabled=true;c.rpc('b61_provider_set_status',{p_id:id,p_status:n,p_note:note||null}).then(function(r){if(r.error)throw r.error;say('b61m','','');toast('تم تحديث الحالة.');return refresh(id)}).catch(function(er){b.disabled=false;say('b61m','err',emsg(er))})}});
/* ---------- الإدارة: الخدمات البحرية ---------- */
var A={tab:'svc',ss:'pending_review',spv:'',sq:'',rb:'',rpv:'',rst:'',r1:'',r2:'',rq:'',busy:false};
var PVL=['البصرة','بغداد','نينوى','أربيل','السليمانية','دهوك','كركوك','الأنبار','ديالى','صلاح الدين','بابل','كربلاء','النجف','واسط','ذي قار','ميسان','المثنى','القادسية'];
var ICONS=['jetski','boat','engine','parts','wrench','tech','truck','shield','search'];
function AR(){return E('b21c')}
B61.admin=function(){document.querySelectorAll('.ap').forEach(function(p){p.classList.toggle('on',p.id==='ap-b21')});document.title='بحر | إدارة الخدمات البحرية';var r=AR();if(!r)return;r.dataset.b='';if(r.parentNode)r.parentNode.classList.remove('bzw');var c=sbc();
 if(!c){r.innerHTML='<p class="b17n">الاتصال بـ Supabase غير جاهز.</p>';return}r.innerHTML='<p class="b17n">جارٍ التحقق من الصلاحية…</p>';
 c.rpc('is_admin').then(function(a){if(a.error||a.data!==true){r.innerHTML='<div class="msg err" style="display:block">هذه الصفحة للمشرفين فقط.</div>';return}ashell()}).catch(function(e){r.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'})};
function ashell(){var T=[['cat','التصنيفات'],['svc','الخدمات'],['req','الطلبات'],['log','سجل التغييرات']];AR().innerHTML='<h1>إدارة الخدمات البحرية</h1><div class="b61t">'+T.map(function(t){return '<button class="btn'+(A.tab===t[0]?' btn-p':'')+'" type="button" data-b61a="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div><div id="b61am" class="msg" role="alert"></div><div id="b61ac" class="b61x"><p class="b17n">جارٍ التحميل…</p></div>';({cat:tCat,svc:tSvc,req:tReq,log:tLog})[A.tab]()}
function aerr(e){var x=E('b61ac');if(x)x.innerHTML='<div class="msg err" style="display:block">'+X(emsg(e))+'</div>'}
function iconSel(v){return '<select data-k="ic">'+ICONS.map(function(i){return '<option'+(i===v?' selected':'')+'>'+i+'</option>'}).join('')+'</select>'}
function tCat(){sbc().from('service_categories').select('*').order('sort_order').then(function(r){if(r.error)throw r.error;var L=r.data||[];
 E('b61ac').innerHTML='<p class="b17n">التصنيفات تظهر في دليل الخدمات ولوحة الأنشطة. إيقاف تصنيف يخفيه من الاختيار والتصفية، ولا يحذف خدمات قائمة.</p>'+L.map(function(x){return '<div class="b17c b15r" style="display:block" data-key="'+X(x.key)+'"><b dir="ltr">'+X(x.key)+'</b> '+(x.is_active?'<span class="bd published">مفعّل</span>':'<span class="bd rejected">متوقف</span>')+'<div class="b61f"><input data-k="lb" value="'+X(x.label)+'" maxlength="80" aria-label="الاسم">'+iconSel(x.icon)+'<input data-k="so" type="number" value="'+X(x.sort_order)+'" aria-label="الترتيب"><select data-k="ac"><option value="1"'+(x.is_active?' selected':'')+'>مفعّل</option><option value="0"'+(x.is_active?'':' selected')+'>متوقف</option></select></div><button class="btn" type="button" data-b61a="catsave">حفظ</button></div>'}).join('')
  +'<h3>إضافة تصنيف</h3><div class="b17c" style="display:block" id="b61nc"><div class="b61f"><input data-k="key" placeholder="المعرّف بالإنجليزية (مثال: sail)" dir="ltr" maxlength="30"><input data-k="lb" placeholder="الاسم بالعربية" maxlength="80">'+iconSel('wrench')+'<input data-k="so" type="number" value="500" aria-label="الترتيب"></div><button class="btn btn-p" type="button" data-b61a="catadd">إضافة</button></div>'}).catch(aerr)}
function val(w,k){var e=w.querySelector('[data-k="'+k+'"]');return e?e.value.trim():''}
function tSvc(){var c=sbc();E('b61ac').innerHTML='<div class="b61f"><select id="b61ss" aria-label="الحالة"><option value="">كل الحالات</option>'+Object.keys(SSL).map(function(k){return '<option value="'+k+'"'+(k===A.ss?' selected':'')+'>'+SSL[k]+'</option>'}).join('')+'</select><select id="b61sp" aria-label="المحافظة"><option value="">كل المحافظات</option>'+PVL.map(function(p){return '<option'+(p===A.spv?' selected':'')+'>'+X(p)+'</option>'}).join('')+'</select><input id="b61sq" type="search" placeholder="بحث باسم الخدمة" value="'+X(A.sq)+'"></div><div id="b61sl"><p class="b17n">جارٍ التحميل…</p></div>';
 var go2=function(){A.ss=E('b61ss').value;A.spv=E('b61sp').value;A.sq=E('b61sq').value.trim();svcList()};E('b61ss').addEventListener('change',go2);E('b61sp').addEventListener('change',go2);var tm;E('b61sq').addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(go2,300)});svcList()}
function svcList(){var c=sbc(),q=c.from('marine_services').select('*').order('updated_at',{ascending:false}).limit(150);if(A.ss)q=q.eq('status',A.ss);if(A.spv)q=q.eq('province',A.spv);if(A.sq)q=q.ilike('name','%'+A.sq.replace(/[%,()*\\]/g,' ')+'%');
 q.then(function(r){if(r.error)throw r.error;var L=r.data||[],ids=[];L.forEach(function(s){if(s.biz_id&&ids.indexOf(s.biz_id)<0)ids.push(s.biz_id)});
  return(ids.length?c.from('biz_profiles').select('id,name,status').in('id',ids):Promise.resolve({data:[]})).then(function(bz){var BM={};(bz.data||[]).forEach(function(b){BM[b.id]=b});var el=E('b61sl');if(!el)return;
   el.innerHTML=L.length?L.map(function(s){var b=BM[s.biz_id],st=s.status;return '<div class="b17c b15r" style="display:block" data-sid="'+X(s.id)+'"><b dir="auto">'+X(s.name)+'</b> <span class="bd '+(st==='published'?'published':st==='rejected'||st==='suspended'?'rejected':'pending')+'">'+X(SSL[st]||st)+'</span>'+(s.is_paused?' <span class="bd pending">أوقفها صاحبها مؤقتاً</span>':'')+'<div class="b17n">'+(b?'النشاط: '+X(b.name)+(b.status==='approved'?'':' — <b>غير معتمد (لا تظهر الخدمة للعامة)</b>'):'بدون نشاط مرتبط')+' · '+X(s.province||'')+' · '+X((s.service_types||[]).map(function(k){return ST[k]?ST[k][0]:k}).join('، '))+'</div>'+(s.description?'<p style="white-space:pre-wrap">'+X(s.description)+'</p>':'')+(s.review_note?'<small class="b17n">آخر ملاحظة: '+X(s.review_note)+'</small>':'')
    +'<div class="b61x"><input type="text" data-k="nt" maxlength="300" placeholder="ملاحظة (إلزامية عند الرفض أو الإيقاف)"><div class="b15h" style="margin-top:6px">'+(st!=='published'?'<button class="btn btn-p" type="button" data-b61a="svc" data-s="published">نشر</button>':'')+(st!=='rejected'?'<button class="btn" type="button" data-b61a="svc" data-s="rejected">رفض</button>':'')+(st==='published'?'<button class="btn" type="button" data-b61a="svc" data-s="suspended">إيقاف / إخفاء</button>':'')+(st==='suspended'||st==='rejected'?'<button class="btn" type="button" data-b61a="svc" data-s="pending_review">إعادة للمراجعة</button>':'')+'</div></div></div>'}).join(''):'<p class="b17n">لا توجد خدمات بهذه التصفية.</p>'})}).catch(aerr)}
function tReq(){var c=sbc();c.from('biz_profiles').select('id,name').in('business_type',['workshop','technician']).order('name').limit(300).then(function(r){var BZ=r.data||[];
 E('b61ac').innerHTML='<div class="b61f"><select id="b61rb" aria-label="النشاط"><option value="">كل الأنشطة</option>'+BZ.map(function(b){return '<option value="'+X(b.id)+'"'+(b.id===A.rb?' selected':'')+'>'+X(b.name)+'</option>'}).join('')+'</select><select id="b61rp" aria-label="المحافظة"><option value="">كل المحافظات</option>'+PVL.map(function(p){return '<option'+(p===A.rpv?' selected':'')+'>'+X(p)+'</option>'}).join('')+'</select><select id="b61rs" aria-label="الحالة"><option value="">كل الحالات</option>'+Object.keys(PS).map(function(k){return '<option value="'+k+'"'+(k===A.rst?' selected':'')+'>'+X(PS[k])+'</option>'}).join('')+'</select><input id="b61r1" type="date" value="'+X(A.r1)+'" aria-label="من"><input id="b61r2" type="date" value="'+X(A.r2)+'" aria-label="إلى"><input id="b61rq" type="search" placeholder="رقم الطلب" value="'+X(A.rq)+'"></div><div id="b61rl"><p class="b17n">جارٍ التحميل…</p></div>';
 var g=function(){A.rb=E('b61rb').value;A.rpv=E('b61rp').value;A.rst=E('b61rs').value;A.r1=E('b61r1').value;A.r2=E('b61r2').value;A.rq=E('b61rq').value.trim();reqList(BZ)};['b61rb','b61rp','b61rs','b61r1','b61r2'].forEach(function(i){E(i).addEventListener('change',g)});var tm;E('b61rq').addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(g,300)});reqList(BZ)}).catch(aerr)}
function reqList(BZ){var c=sbc(),q=c.from('service_requests').select('id,req_no,biz_id,service_id,status,provider_status,province,created_at,updated_at,equipment_type').not('biz_id','is',null).order('created_at',{ascending:false}).limit(200);
 if(A.rb)q=q.eq('biz_id',A.rb);if(A.rpv)q=q.eq('province',A.rpv);if(A.rst)q=q.eq('provider_status',A.rst);if(A.r1)q=q.gte('created_at',A.r1);if(A.r2)q=q.lt('created_at',new Date(Date.parse(A.r2)+864e5).toISOString().slice(0,10));if(A.rq&&/^[0-9]{1,12}$/.test(d2(A.rq)))q=q.eq('req_no',Number(d2(A.rq)));
 q.then(function(r){if(r.error)throw r.error;var L=r.data||[],BM={};BZ.forEach(function(b){BM[b.id]=b.name});var ids=[];L.forEach(function(x){if(x.service_id&&ids.indexOf(x.service_id)<0)ids.push(x.service_id)});
  return(ids.length?c.from('marine_services').select('id,name').in('id',ids):Promise.resolve({data:[]})).then(function(s){var SM={};(s.data||[]).forEach(function(x){SM[x.id]=x.name});var el=E('b61rl');if(!el)return;
   el.innerHTML='<p class="b17n">'+L.length+' طلب (آخر 200 كحد أقصى)</p>'+(L.length?L.map(function(x){var s2=eff(x);return '<a class="b17c b15r" href="#request-'+X(x.id)+'" style="display:block"><div class="b15h"><b>#'+X(x.req_no)+'</b><span dir="auto">'+X(BM[x.biz_id]||'نشاط')+'</span><span class="bd '+(s2==='cancelled'?'rejected':bcls(s2))+'">'+X(s2==='cancelled'?'ألغاه العميل':PS[s2]||s2)+'</span></div><small>'+X(SM[x.service_id]||'طلب عام للنشاط')+' · '+X(x.province||'')+' · '+fd(x.created_at)+'</small></a>'}).join(''):'<p class="b17n">لا توجد طلبات مطابقة.</p>')})}).catch(aerr)}
function tLog(){var c=sbc();Promise.all([c.from('b61_audit').select('*').order('created_at',{ascending:false}).limit(50),c.from('service_request_log').select('request_id,actor_role,from_status,to_status,note,created_at').order('created_at',{ascending:false}).limit(50)]).then(function(a){if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;
 E('b61ac').innerHTML='<h3>إجراءات الإدارة على الخدمات</h3>'+(a[0].data.length?a[0].data.map(function(l){return '<div class="b15e"><small>'+fd(l.created_at)+'</small> '+X(l.action)+(l.note?' — '+X(l.note):'')+'</div>'}).join(''):'<p class="b17n">لا توجد إجراءات.</p>')+'<h3>آخر تغييرات حالات الطلبات</h3>'+(a[1].data.length?a[1].data.map(function(l){return '<div class="b15e"><small>'+fd(l.created_at)+'</small> <a href="#request-'+X(l.request_id)+'">طلب</a> — '+X(PS[l.from_status]||'—')+' ← '+X(PS[l.to_status]||l.to_status)+' ('+X(l.actor_role==='customer'?'العميل':l.actor_role==='admin'?'الإدارة':'مقدم الخدمة')+')'+(l.note?' — '+X(l.note):'')+'</div>'}).join(''):'<p class="b17n">لا توجد تغييرات.</p>')}).catch(aerr)}
document.addEventListener('click',function(e){var b=e.target.closest('[data-b61a]');if(!b||!AU.user||!AR()||!AR().contains(b))return;var k=b.dataset.b61a,c=sbc();
 if(k==='tab'){A.tab=b.dataset.t;ashell();return}
 if(k==='catsave'){var w=b.closest('[data-key]');b.disabled=true;c.from('service_categories').update({label:val(w,'lb'),icon:val(w,'ic'),sort_order:Number(val(w,'so'))||100,is_active:val(w,'ac')==='1',updated_at:new Date().toISOString()}).eq('key',w.dataset.key).select('key').then(function(r){b.disabled=false;if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('forbidden');say('b61am','','');toast('حُفظ التصنيف.');tCat()}).catch(function(er){b.disabled=false;say('b61am','err',emsg(er))});return}
 if(k==='catadd'){var n=E('b61nc'),key=val(n,'key').toLowerCase(),lb=val(n,'lb');if(!/^[a-z0-9_]{2,30}$/.test(key)){say('b61am','err','المعرّف: حروف إنجليزية صغيرة وأرقام وشرطة سفلية (2-30).');return}if(lb.length<2){say('b61am','err','اكتب اسم التصنيف.');return}
  b.disabled=true;c.from('service_categories').insert({key:key,label:lb,icon:val(n,'ic'),sort_order:Number(val(n,'so'))||500,is_active:true}).select('key').then(function(r){b.disabled=false;if(r.error)throw r.error;say('b61am','','');toast('أُضيف التصنيف.');B61.loadCats(c).then(tCat)}).catch(function(er){b.disabled=false;say('b61am','err',er&&er.code==='23505'?'هذا المعرّف موجود بالفعل.':emsg(er))});return}
 if(k==='svc'){var cd=b.closest('[data-sid]'),s=b.dataset.s,nt=val(cd,'nt');if((s==='rejected'||s==='suspended')&&nt.length<3){say('b61am','err','اكتب سبب الرفض أو الإيقاف (3 أحرف على الأقل).');return}
  if(!confirm('تأكيد هذا الإجراء على الخدمة؟'))return;b.disabled=true;c.rpc('b61_admin_service_set',{p_id:cd.dataset.sid,p_status:s,p_note:nt||null}).then(function(r){if(r.error)throw r.error;say('b61am','','');toast('تم.');svcList()}).catch(function(er){b.disabled=false;say('b61am','err',emsg(er))})}});
var s2=B15.sync;B15.sync=function(){s2();var l=E('admSvcLink'),c=sbc();if(l)l.style.display='none';if(l&&c&&AU.user)c.rpc('is_admin').then(function(r){if(!r.error&&r.data===true)l.style.display=''})};
})();

})();
}catch(e){try{console.error('[BAHR:line1067]',e)}catch(_){}}

/* ===== [line5157] ===== */
try{
/* B75: شاشة افتتاحية بالفيديو. مرة واحدة لكل جلسة، لا تحجب الموقع (الصفحة تُحمَّل تحتها)، ولا تلمس Supabase أو الجلسة أو صلاحيات الصفحات الخاصة. تُتخطى فقط عند روابط استعادة كلمة المرور/المصادقة. */
(function(){var I=document.getElementById('intro');if(!I)return;
if(/code=|access_token|type=(recovery|signup|magiclink|invite|email)/.test(location.search+location.hash)){I.remove();return}
try{if(sessionStorage.getItem('bahr_intro')){I.remove();return}}catch(e){}
var V=document.getElementById('inV'),B=document.getElementById('inBar'),done=false,
red=matchMedia('(prefers-reduced-motion:reduce)').matches,cn=navigator.connection||{},low=!!cn.saveData||/(^|-)2g$/.test(cn.effectiveType||'');
function close(){if(done)return;done=true;try{sessionStorage.setItem('bahr_intro','1')}catch(e){}document.documentElement.style.overflow='';I.classList.add('out');try{V.pause()}catch(e){}setTimeout(function(){I.remove()},760);document.removeEventListener('keydown',kd)}
function kd(e){if(e.key==='Escape')close()}
document.getElementById('inGo').onclick=close;document.getElementById('inRp').onclick=function(){try{sessionStorage.setItem('b76pre','video')}catch(e){}close();location.hash='#support'};document.addEventListener('keydown',kd);
I.hidden=false;document.documentElement.style.overflow='hidden';
setTimeout(function(){var g=document.getElementById('inGo');g&&g.focus({preventScroll:true})},50);
/* تقليل الحركة أو توفير البيانات أو شبكة ضعيفة: صورة احتياطية + زر الدخول فقط، دون تنزيل الفيديو */
if(red||low)return;
V.addEventListener('timeupdate',function(){if(V.duration)B.style.width=(V.currentTime/V.duration*100)+'%'});
V.addEventListener('ended',close);
V.addEventListener('error',function(){V.classList.remove('on')});
V.addEventListener('playing',function(){V.classList.add('on')});
var s=document.createElement('source');s.src='bahr-intro.mp4';s.type='video/mp4';s.addEventListener('error',function(){V.classList.remove('on')});V.appendChild(s);var s2=document.createElement('source');s2.src='bahr-intro.webm';s2.type='video/webm';V.appendChild(s2);
V.preload='auto';V.muted=true;var p;try{p=V.play()}catch(e){}
if(p&&p.catch)p.catch(function(){V.classList.remove('on')});
})();
}catch(e){try{console.error('[BAHR:line5157]',e)}catch(_){}}

/* ===== [line5180] ===== */
try{
/* B37: سلايدر الواجهة (3 شرائح): أسهم + نقاط + سحب باللمس + لوحة المفاتيح؛ يتوقف عند التمرير فوقه أو التركيز أو إخفاء التبويب أو تقليل الحركة */
(function(){var H=document.getElementById('home');if(!H)return;var P=[].slice.call(H.querySelectorAll('.hsl-i')),n=3,D=document.getElementById('hslDots');if(!D||P.length<n*2)return;
var red=matchMedia('(prefers-reduced-motion:reduce)').matches,cur=0,tm=null,hold=false,sx=null,names=['يخت','جت سكي','محركات وخدمات'];
[].forEach.call(H.querySelectorAll('.hsl-bg img'),function(im){im.addEventListener('error',function(){im.closest('.hsl-bg').classList.add('noimg')})});
for(var i=0;i<n;i++){(function(i){var b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-label','الشريحة '+(i+1)+': '+names[i]);b.onclick=function(){go(i);run()};D.appendChild(b)})(i)}
function go(i){cur=(i+n)%n;P.forEach(function(e,k){var on=(k%n)===cur;e.classList.toggle('on',on);if(e.classList.contains('hsl-c'))e.setAttribute('aria-hidden',on?'false':'true')});[].forEach.call(D.children,function(b,k){b.setAttribute('aria-selected',k===cur?'true':'false')});
 var nx=H.querySelectorAll('.hsl-bg img')[(cur+1)%n];if(nx&&nx.loading==='lazy')nx.loading='eager'}
function run(){clearInterval(tm);if(!red)tm=setInterval(function(){if(!hold&&!document.hidden)go(cur+1)},7000)}
document.getElementById('hslNext').onclick=function(){go(cur+1);run()};document.getElementById('hslPrev').onclick=function(){go(cur-1);run()};
H.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')hold=true});H.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')hold=false});H.addEventListener('focusin',function(e){try{hold=e.target.matches(':focus-visible')}catch(x){hold=true}});H.addEventListener('focusout',function(){hold=false});
H.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'||e.target.closest('input,a,button,form'))return;sx=e.clientX});
H.addEventListener('pointerup',function(e){if(sx==null)return;var d=e.clientX-sx;sx=null;if(Math.abs(d)>45){go(cur+(d<0?1:-1));run()}});H.addEventListener('pointercancel',function(){sx=null});
H.addEventListener('keydown',function(e){if(e.target.closest('input'))return;if(e.key==='ArrowLeft'){go(cur+1);run()}else if(e.key==='ArrowRight'){go(cur-1);run()}});
go(0);run();
})();
}catch(e){try{console.error('[BAHR:line5180]',e)}catch(_){}}

/* ===== [line5197] ===== */
try{
(function(){if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver'in window))return;
var els=[].slice.call(document.querySelectorAll('.home .sec2,.home .ads,.home .pe,.home .tech,.home .how,.home .abt,.home .show3d,.home .sk'));if(!els.length)return;
document.documentElement.classList.add('js-rv');
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.05});
els.forEach(function(e){e.classList.add('rvl');io.observe(e)});
setTimeout(function(){els.forEach(function(e){e.classList.add('in')})},6000);
})();
}catch(e){try{console.error('[BAHR:line5197]',e)}catch(_){}}

/* ===== [line5206] ===== */
try{
/* B73: إشعار انقطاع الإنترنت */
(function(){function on(){var d=document.getElementById('b73off');if(navigator.onLine){if(d)d.remove();return}if(d)return;d=document.createElement('div');d.id='b73off';d.setAttribute('role','status');d.textContent='ماكو اتصال بالإنترنت. تأكد من الشبكة وحاول مرة ثانية.';document.body.insertBefore(d,document.body.firstChild)}addEventListener('offline',on);addEventListener('online',on);if(document.body)on();else addEventListener('DOMContentLoaded',on)})();
}catch(e){try{console.error('[BAHR:line5206]',e)}catch(_){}}

/* ===== [line5209] ===== */
try{
/* ===== B74: حالة الحساب وطلب إغلاق/حذف الحساب (b74_accounts.sql). إن لم يُطبَّق SQL لا يظهر شيء (لا واجهة معطّلة). التحقق بكلمة المرور عبر Supabase Auth فقط ولا تُخزَّن ===== */
(function(){var DS={pending:'بانتظار المراجعة',in_review:'قيد المراجعة',approved:'وافقت الإدارة وسيُعالج الطلب يدوياً',rejected:'رُفض الطلب',cancelled:'أُلغي الطلب'};
function ex(v){return String(v==null?'':v).replace(/[&<>"']/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})}
window.B74A=function(){var c=window.sbc&&sbc(),u=window.AU&&AU.user,host=document.getElementById('acc');if(!c||!u||!host)return;
 c.rpc('b74_my_status').then(function(r){if(r.error||!r.data||!window.AU||!AU.user||AU.user.id!==u.id)return;var s=r.data,d=s.deletion,open=d&&(d.status==='pending'||d.status==='in_review'),old=document.getElementById('b74acc');if(old)old.remove();
  var h='<div id="b74acc" style="margin-top:16px">';
  if(s.suspended)h+='<div class="msg err" style="display:block">حسابك معطّل إدارياً: لا يمكنك إنشاء إعلانات أو طلبات أو رسائل جديدة. السبب: '+ex(s.reason||'')+'. تواصل مع الدعم الفني لمراجعة القرار.</div>';
  h+='<h3>إغلاق الحساب وطلب الحذف</h3>';
  if(d&&d.status!=='cancelled')h+='<p>حالة طلبك: <b>'+ex(DS[d.status]||d.status)+'</b>'+(d.admin_note?'<br>ملاحظة الإدارة: '+ex(d.admin_note):'')+'</p>';
  if(d&&d.status==='pending')h+='<button class="btn" id="b74c" type="button">إلغاء الطلب</button>';
  if(!open)h+='<p class="b17n">لن يُحذف حسابك تلقائياً: تراجع الإدارة الطلب. إعلاناتك وطلباتك ومحادثاتك لا تُحذف قبل المراجعة، وقد تبقى سجلات مالية وسجلات تدقيق واجبة الاحتفاظ. لا يمكن تقديم الطلب لحساب مدير.</p><button class="btn" id="b74o" type="button">تقديم طلب إغلاق/حذف</button><div id="b74f" hidden><textarea id="b74r" maxlength="500" rows="3" placeholder="السبب (اختياري)"></textarea><input id="b74pw" type="password" autocomplete="current-password" placeholder="كلمة المرور للتأكيد"><button class="btn btn-p" id="b74g" type="button">تأكيد الطلب</button></div>';
  h+='<div id="b74m" class="msg" role="alert"></div></div>';host.insertAdjacentHTML('beforeend',h);
  var m=function(t,x){var e=document.getElementById('b74m');e.className='msg '+t;e.style.display='block';e.textContent=x},o=document.getElementById('b74o'),cn=document.getElementById('b74c');
  if(o)o.onclick=function(){document.getElementById('b74f').hidden=false;o.hidden=true};
  var busy=false,run=function(b,fn){if(busy)return;busy=true;b.disabled=true;fn().then(function(ok){busy=false;b.disabled=false;if(ok)B74A()},function(e){busy=false;b.disabled=false;m('err',/bad_text/.test(String(e&&e.message))?'غير مسموح بالرمزين < و > في السبب.':/admin_account/.test(String(e&&e.message))?'لا يمكن تقديم الطلب لحساب مدير.':/duplicate|23505/.test(String(e&&(e.message||e.code)))?'لديك طلب مفتوح فعلاً.':'تعذّر تنفيذ الطلب. حاول مرة ثانية.')})};
  var g=document.getElementById('b74g');
  if(g)g.onclick=function(){var pw=document.getElementById('b74pw').value;if(!pw){m('err','اكتب كلمة المرور للتأكيد.');return}if(!confirm('تأكيد تقديم طلب إغلاق/حذف الحساب؟'))return;
   run(g,function(){var cr=u.email?{email:u.email,password:pw}:{phone:u.phone,password:pw};return c.auth.signInWithPassword(cr).then(function(a){if(a.error){m('err','كلمة المرور غير صحيحة.');return false}return c.rpc('b74_request_deletion',{p_reason:document.getElementById('b74r').value.trim()||null}).then(function(r){if(r.error)throw r.error;return true})})})};
  if(cn)cn.onclick=function(){if(!confirm('إلغاء الطلب؟'))return;run(cn,function(){return c.rpc('b74_cancel_deletion').then(function(r){if(r.error)throw r.error;return true})})}
 },function(){})}})();
}catch(e){try{console.error('[BAHR:line5209]',e)}catch(_){}}

/* ===== [bt1-js] ===== */
try{
/* BT1: واجهة هيكل BAHR TECH. لا تكتب في قاعدة البيانات ولا تقرأ جداول فنية (غير موجودة بعد). الوحيد المُستدعى: admin_my_roles/is_admin الموجودتان للتحقق من إظهار صفحة الإدارة (تجربة استخدام فقط؛ الحماية الفعلية تأتي في BT2 عبر RLS). */
(function(){
var E=function(i){return document.getElementById(i)};
var X=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var RX=/^#bt(-(search|compat|guides|saved|sources|admin|item|c-[a-z]+))?$/;
var CATS=[['companies','الشركات المصنّعة','سجل الشركات وموديلاتها وسنوات الإنتاج.'],['engines','المحركات','المحركات البحرية حسب الشركة والموديل والسنة.'],['devices','أجهزة التشخيص','أجهزة قراءة الأعطال ومعدات الفحص.'],['cables','الكابلات والوصلات','كابلات التشخيص والوصلات وتوافقها.'],['software','البرامج','برامج التشخيص والبرمجة وإصداراتها.'],['guides','الأدلة الفنية','أدلة الصيانة وخطوات التشخيص.']];
var ST=[['draft','مسودة','أُدخل ولم يُراجَع. لا يظهر للعامة.'],['review','قيد المراجعة','بانتظار مراجع آخر غير مُدخِله.'],['verified','موثّق','راجعه مراجع واعتمده مع مصدر. الوحيد الذي يظهر للعامة.'],['rejected','مرفوض','لم يُعتمد؛ يبقى السبب مسجلاً.'],['archived','مؤرشف','لم يعد معتمداً لكنه محفوظ في السجل.']];
var ADM=[['الشركات والموديلات والسنوات','إضافة وتعديل سجلات الشركات وموديلاتها وسنوات إنتاجها.'],['أجهزة التشخيص والبرامج والكابلات','إدارة سجلات المعدات والإصدارات.'],['الأدلة والملفات والمراجع','رفع الأدلة وربطها بمصادرها.'],['علاقات التوافق','ربط جهاز أو برنامج بموديل وسنة مع مستوى التأكيد.'],['المراجعة والاعتماد','قبول السجلات أو رفضها بمراجع مختلف عن المُدخِل.'],['التكرار والتعارض','اكتشاف سجلات مكررة أو توافق متناقض.'],['بلاغات المستخدمين والتصحيحات','استقبال بلاغات الأخطاء ومعالجتها.'],['سجل التدقيق','سجل لا يُعدَّل لكل تغيير مهم.']];
var DEMO=false,Q='';
var DR=[{t:'سجل تجريبي — مسودة',s:'draft'},{t:'سجل تجريبي — قيد المراجعة',s:'review'},{t:'سجل تجريبي — موثّق',s:'verified'},{t:'سجل تجريبي — مرفوض',s:'rejected'},{t:'سجل تجريبي — مؤرشف',s:'archived'}];
var badge=function(s){var a=ST.filter(function(x){return x[0]===s})[0];return'<span class="bt-s '+s+'">'+X(a?a[1]:s)+'</span>'};
var tag=function(t){return'<span class="bt-t">'+(t||'هيكل فقط')+'</span>'};
var empty=function(h,p){return'<div class="bt-e"><b>'+h+'</b>'+p+'</div>'};
var crumbs=function(l){return'<nav class="crm" aria-label="مسار التنقل"><a href="#home">الرئيسية</a><span>›</span><a href="#bt">BAHR TECH</a>'+(l?'<span>›</span><span>'+l+'</span>':'')+'</nav>'};
var hd=function(t,s,l){return crumbs(l)+'<div class="iph"><h1>'+t+'</h1>'+(s?'<p>'+s+'</p>':'')+'</div>'};
var NAV=[['#bt','الرئيسية'],['#bt-compat','التوافق'],['#bt-guides','الأدلة'],['#bt-saved','المحفوظ'],['#bt-sources','المصادر'],['#bt-admin','إدارة المركز']];
var nav=function(h){return'<nav class="bt-n" aria-label="أقسام المركز الفني">'+NAV.map(function(n){return'<a href="'+n[0]+'"'+(n[0]===h?' class="on" aria-current="page"':'')+'>'+n[1]+'</a>'}).join('')+'</nav>'};
var demoBar=function(){return'<div class="bt-demo"><label><input type="checkbox" id="btd"'+(DEMO?' checked':'')+'> عرض سجلات تجريبية لتوضيح الحالات</label>'+(DEMO?'<br><b>بيانات تجريبية:</b> السجلات أدناه للتصميم فقط وليست معلومات فنية حقيقية.':'')+'</div>'};
var list=function(f){var r=DR.filter(f||function(){return true});return r.map(function(x){return'<div class="bt-row"><span>'+X(x.t)+'</span>'+badge(x.s)+'</div>'}).join('')};
var NOTE='لم تُضَف أي سجلات فنية بعد. سيظهر هنا المحتوى الموثّق فقط بعد إنشاء قاعدة البيانات ومراجعة السجلات (المرحلة BT2 وما بعدها).';
var P={};
P.home=function(){return crumbs('')+'<div class="bt-hero"><h1>BAHR TECH — المركز الفني البحري</h1><p>ابحث عن أجهزة التشخيص والبرامج والكابلات وأدلة الصيانة، وتحقّق من توافقها مع الموديل والسنة. المحتوى الموثّق بمصدر فقط يظهر هنا.</p><form class="bt-q" id="btq" role="search"><input type="search" id="btqi" placeholder="جهاز أو برنامج أو موديل" aria-label="بحث في المركز الفني" autocomplete="off"><button type="submit">بحث</button></form></div>'+nav('#bt')+'<div class="bt-g">'+CATS.map(function(c){return'<a class="bt-k" href="#bt-c-'+c[0]+'"><b>'+c[1]+'</b><span>'+c[2]+'</span></a>'}).join('')+'</div><section class="ipc full"><h2>حالات المحتوى</h2><div>'+ST.map(function(s){return'<div class="bt-row"><span>'+badge(s[0])+'</span><span style="flex:1;color:var(--mut);font-size:14px">'+s[2]+'</span></div>'}).join('')+'</div></section>'+empty('المكتبة فارغة حالياً',NOTE)};
P.search=function(){var r=Q?DR.filter(function(x){return DEMO&&x.t.indexOf(Q)>-1}):[];return hd('البحث في المركز الفني',Q?'نتائج «'+X(Q)+'»':'اكتب اسم جهاز أو برنامج أو موديل.','البحث')+nav('#bt')+demoBar()+(r.length?r.map(function(x){return'<div class="bt-row"><span>'+X(x.t)+'</span>'+badge(x.s)+'</div>'}).join(''):empty('لا توجد نتائج','البحث غير موصول بقاعدة بيانات بعد. '+NOTE))};
P.cat=function(k){var c=CATS.filter(function(x){return x[0]===k})[0];if(!c)return hd('القسم غير موجود','','')+empty('لا يوجد هذا القسم','<a href="#bt">العودة للمركز الفني</a>');return hd(c[1],c[2],c[1])+nav('#bt')+demoBar()+(DEMO?list()+'<p><a class="sl" href="#bt-item">عرض نموذج صفحة التفاصيل</a></p>':empty('لا توجد سجلات في «'+c[1]+'»',NOTE))};
P.item=function(){var F=['الاسم','النوع','الشركة','الموديلات والسنوات المتوافقة','مستوى التأكيد','المصادر','آخر مراجعة'];return hd('نموذج صفحة تفاصيل عنصر','هذا قالب فارغ يوضح الحقول المخطط لها، وليس سجلاً حقيقياً.','تفاصيل')+nav('#bt')+'<section class="ipc full"><p>'+badge('draft')+' '+tag('قالب تجريبي')+'</p><dl class="bt-d">'+F.map(function(f){return'<dt>'+f+'</dt><dd>—</dd>'}).join('')+'</dl></section>'+empty('لا توجد بلاغات تصحيح','زر «أبلغ عن خطأ» سيُضاف عند ربط المركز بقاعدة البيانات.')};
P.compat=function(){return hd('توافق الأجهزة والبرامج','اختر الشركة والموديل والسنة لتعرف الأجهزة والبرامج المتوافقة.','التوافق')+nav('#bt-compat')+'<div class="bt-f"><select disabled aria-label="الشركة"><option>الشركة</option></select><select disabled aria-label="الموديل"><option>الموديل</option></select><select disabled aria-label="السنة"><option>السنة</option></select></div>'+empty('الاختيار غير مفعّل بعد','لا توجد شركات أو موديلات مسجّلة. لن تُعرض أي علاقة توافق دون مصدر ومراجعة. '+tag('هيكل فقط'))};
P.guides=function(){return hd('أدلة الصيانة والتشخيص','خطوات مرتبطة بالموديل ومصدرها المرجعي.','الأدلة')+nav('#bt-guides')+empty('لا توجد أدلة بعد','ستُضاف الأدلة بعد مراجعتها واعتمادها. '+tag('هيكل فقط'))};
P.saved=function(){return hd('المحتوى المحفوظ','العناصر والأدلة التي حفظتها للرجوع إليها.','المحفوظ')+nav('#bt-saved')+empty('لا يوجد محتوى محفوظ','الحفظ يحتاج حساباً وجدولاً خاصاً سيُنشأ في BT2. '+tag('هيكل فقط'))};
P.sources=function(){return hd('المصادر والمراجع','كل معلومة موثّقة تُنسب إلى مصدر يمكن التحقق منه.','المصادر')+nav('#bt-sources')+'<section class="ipc full"><h2>أنواع المصادر المخطط لها</h2><ul><li>دليل رسمي من الشركة المصنعة.</li><li>وثيقة أو إصدار برنامج من جهة الإصدار.</li><li>تجربة فني موثّقة (تُصنَّف أقل ثقة من الرسمي).</li></ul><p>لا يُعتمد سجل بلا مصدر، ولا يعتمد المُدخِل سجله بنفسه.</p></section>'+empty('لا توجد مصادر مسجّلة',NOTE)};
P.admin=function(){return hd('إدارة المركز الفني','هيكل صفحات الإدارة المخطط لها.','الإدارة')+nav('#bt-admin')+'<div id="bta"><div class="pf-st" role="status">جارٍ التحقق من الصلاحية…</div></div>'};
function adminBody(){return'<div class="ipw"><b>هيكل فقط:</b> لا يوجد دور «فني» في قاعدة البيانات بعد، ولا تعمل أي عملية هنا على بيانات. هذه الصفحة تظهر لمدير المنصة لتجربة الاستخدام فقط؛ الحماية الفعلية ستكون بسياسات RLS في BT2.</div><div class="bt-g">'+ADM.map(function(a){return'<div class="bt-k"><b>'+a[0]+tag()+'</b><span>'+a[1]+'</span></div>'}).join('')+'</div>'}
function gate(){var c=window.sbc&&window.sbc(),o=E('bta');if(!o)return;var set=function(h){if(location.hash==='#bt-admin'&&E('bta'))E('bta').innerHTML=h};
 if(!c){set(empty('الاتصال غير جاهز','تعذّر تحميل مكتبة Supabase.'));return}
 c.auth.getSession().then(function(r){if(!(r.data&&r.data.session)){set(empty('سجّل الدخول','هذه الصفحة لمدير المنصة. <a href="#login">تسجيل الدخول</a>'));return}
  return c.rpc('admin_my_roles').then(function(a){if(!a.error)return(a.data||[]).indexOf('platform_admin')>-1;return c.rpc('is_admin').then(function(b){return!b.error&&b.data===true})}).then(function(ok){set(ok?adminBody():empty('لا تملك صلاحية','هذه الصفحة لمدير المنصة فقط.'))})}).catch(function(){set(empty('تعذّر التحقق','حاول مرة أخرى لاحقاً.'))})}
function render(){var h=location.hash,m=RX.test(h);if(!m){delete document.body.dataset.bt;return}
 document.body.dataset.bt='1';var k=h.slice(4).replace(/^-/,''),o;
 o=k===''?P.home():k.indexOf('c-')===0?P.cat(k.slice(2)):P[k]();
 E('btc').innerHTML=o;document.title='BAHR TECH | بحر';window.scrollTo(0,0);if(k==='admin')gate();
 var f=E('btq');if(f)f.addEventListener('submit',function(e){e.preventDefault();Q=E('btqi').value.trim();location.hash='#bt-search'});
 var d=E('btd');if(d)d.addEventListener('change',function(){DEMO=d.checked;render()})}
window.addEventListener('hashchange',render);render();
})();
}catch(e){try{console.error('[BAHR:bt1-js]',e)}catch(_){}}
