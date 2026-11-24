import {firebaseConfig, CHILD_DOCUMENT_ID, CLOUD_ENABLED} from '../shared/firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js';
import {getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence} from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import {getFirestore, doc, getDoc} from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js';
const $=id=>document.getElementById(id);const div=(name,cl)=>{let x=document.createElement(name);if(cl)x.className=cl;return x};
const text=(node,s)=>{node.textContent=String(s);return node};
function fmtDate(d){if(!d)return'无记录';try{return new Date(d).toLocaleString('zh-CN')}catch{return String(d)}}
function setStatus(s){text($('status'),s)}
function strDate(dayOffset){const x=new Date();x.setHours(12,0,0,0);x.setDate(x.getDate()+dayOffset);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')}
const valid=n=>Number.isFinite(n)&&n>=0?n:0;
function render(lang,data){const target=$(lang+'-content');target.replaceChildren();if(!data){target.append(text(div('p'),'暂无云端记录。请先在孩子设备登录同步。'));return}
 const p=data.progress||{}, detail=data.detail||{}, historic=detail.days||{}, mistakes=detail.mistakes||{};
 let correct,total,days,stamps,errors;
 if(lang==='de'){
  const stat=p.unregelmaessige_verben_320_328_v2||{},daily=p.unregelmaessige_verben_stempelkarte_v4_richtig50||{};
  correct=valid(stat.right);total=valid(stat.total);days=daily.counts||{};stamps=new Set(daily.stamps||[]);errors=(stat.errors||[]).map(x=>[x, mistakes[x]||null]);
 }else{
  const s=p.french_cy_progress_v1||{};correct=valid(s.groupRight);total=valid(s.groupTotal);days=s.groupDays||{};stamps=new Set(Object.keys(s.completedDays||{}).filter(k=>s.completedDays[k]));errors=Object.keys(s.groupErrors||{}).filter(k=>s.groupErrors[k]).map(x=>[x,mistakes[x]||null]);
 }
 let weekCorrect=0,stampedWeek=0;for(let i=-6;i<=0;i++){const k=strDate(i);weekCorrect+=valid(days[k]||0);if(stamps.has(k))stampedWeek++}
 const items=[['今天正确组数',valid(days[strDate(0)]||0)],['最近7天打卡',stampedWeek+' / 7'],['最近7天正确组数',weekCorrect],['累计已批改',total],['累计正确',correct],['累计正确率',total?Math.round(correct/total*100)+'%':'—'],['待复习错题',errors.length]];
 const cards=div('div','summary');items.forEach(([label,value])=>{const c=div('div','metric');c.append(text(div('small'),label),text(div('strong'),value));cards.append(c)});target.append(cards);
 target.append(text(div('h3'),'最近7天正确组数'));
 const chart=div('div','chart');const max=Math.max(50,...Array.from({length:7},(_,i)=>valid(days[strDate(i-6)]||0)));
 for(let i=-6;i<=0;i++){const k=strDate(i),num=valid(days[k]||0);const col=div('div','barSlot');const v=div('div','bar');v.style.height=`${Math.max(num/max*130,2)}px`;v.title=k+'：'+num+' 组';col.append(text(div('span'),num),v,text(div('span'),k.slice(5)));chart.append(col)}target.append(chart);
 if(Object.keys(historic).length){target.append(text(div('h3'),'详细练习（启用同步版后）'));const tbl=div('table');const head=div('tr');['日期','已批改','全部正确','错误'].forEach(v=>head.append(text(div('th'),v)));tbl.append(head);for(const [date,d] of Object.entries(historic).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,14)){const row=div('tr');[date,valid(d.attempted),valid(d.correct),Math.max(0,valid(d.attempted)-valid(d.correct))].forEach(v=>row.append(text(div('td'),v)));tbl.append(row)}target.append(tbl)}
 target.append(text(div('h3'),'待复习错题'));if(!errors.length)target.append(text(div('p'),'目前没有待复习错题'));else{const table=div('table');const row=div('tr');['动词／题目ID','累计错误次数（同步后）'].forEach(v=>row.append(text(div('th'),v)));table.append(row);errors.sort((a,b)=>(b[1]||0)-(a[1]||0)).slice(0,35).forEach(([q,n])=>{const r=div('tr');r.append(text(div('td'),q),text(div('td'),n??'尚无统计'));table.append(r)});target.append(table)}
 target.append(text(div('p','muted'),'云端更新时间：'+fmtDate(data.updatedAt?.toDate?.()||data.clientTime)));
}
if(!CLOUD_ENABLED||firebaseConfig.apiKey.includes('PASTE')){setStatus('尚未配置 Firebase。请按照 README 操作。');$('login').disabled=true}
else{
 const app=initializeApp(firebaseConfig), auth=getAuth(app), db=getFirestore(app);await setPersistence(auth,browserLocalPersistence);
 async function refresh(){setStatus('读取中…');try{for(const lang of ['de','fr']){const d=await getDoc(doc(db,'children',CHILD_DOCUMENT_ID,'languages',lang));render(lang,d.exists()?d.data():null)}$('refreshed').textContent='最近刷新：'+new Date().toLocaleTimeString('zh-CN');setStatus('读取成功（家长只读账号）')}catch(e){setStatus('读取失败：'+e.code+'。请检查家长 UID 与 Firestore 规则。')}}
 onAuthStateChanged(auth,u=>{const signed=!!u;$('logout').hidden=!signed;$('dashboard').hidden=!signed;$('login').disabled=signed;if(signed){setStatus('已登录。正在加载数据…');refresh()}else setStatus('请使用家长账号登录。')});
 $('login').onclick=async()=>{try{await signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value)}catch(e){setStatus('登录失败：'+e.code)}};
 $('logout').onclick=()=>signOut(auth);$('refresh').onclick=refresh;
}
