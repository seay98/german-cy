import {firebaseConfig, CHILD_DOCUMENT_ID, CHILD_AUTH_UID, CLOUD_ENABLED} from './firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js';
import {getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence} from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import {getFirestore, doc, getDoc, setDoc, serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js';

const $=id=>document.getElementById(id);
const language=location.pathname.includes('/francais/')?'fr':'de';
const keys=language==='fr'?['french_cy_progress_v1']:['unregelmaessige_verben_320_328_v2','unregelmaessige_verben_stempelkarte_v4_richtig50'];
const detailKey=`german_cy_cloud_detail_${language}_v1`;
let auth,db,user=null,ready=false,lock=false,pending=false,timer=0;
const adoptedKey=`german_cy_cloud_adopted_${language}_v1`;
const dirtyKey=`german_cy_cloud_unsent_${language}_v1`;
const status=(t)=>{$('cloud-status').textContent=t};
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
const own=o=>o&&typeof o==='object'&&!Array.isArray(o);
const stored=()=>Object.fromEntries(keys.map(k=>[k,read(k)]));
function hasHistory(s){return Object.values(s).some(v=>own(v)&&((v.total||v.groupTotal||v.right||v.groupRight||0)>0||Object.keys(v.counts||v.groupDays||{}).length>0||Object.keys(v.errors||{}).length>0||Object.keys(v.groupErrors||{}).length>0))}
function detail(){const x=read(detailKey);return own(x)?x:{days:{},mistakes:{}}}
function record(e){if(e.detail?.lang!==language)return;const d=e.detail;const data=detail();const date=String(d.day||'');if(!/^\d{4}-\d\d-\d\d$/.test(date))return;const item=data.days[date]||{attempted:0,correct:0};item.attempted++;if(d.correct)item.correct++;else data.mistakes[String(d.question||'other').slice(0,100)]=(data.mistakes[String(d.question||'other').slice(0,100)]||0)+1;data.days[date]=item;localStorage.setItem(detailKey,JSON.stringify(data)); schedule()}
window.addEventListener('learning-progress-changed',record);
window.addEventListener('learning-progress-saved',e=>{if(e.detail?.lang===language)schedule()});
window.addEventListener('storage',e=>{if(keys.includes(e.key)||e.key===detailKey)schedule()});
const ref=()=>doc(db,'children',CHILD_DOCUMENT_ID,'languages',language);
function schedule(){if(!ready||lock)return;pending=true;localStorage.setItem(dirtyKey,'yes');status(language==='fr'?'Synchronisation en attente…':'Synchronisierung vorgemerkt…');clearTimeout(timer);timer=setTimeout(upload,2000)}
async function upload(){if(!ready||!user||user.uid!==CHILD_AUTH_UID)return;pending=false;try{await setDoc(ref(),{schema:1,lang:language,progress:stored(),detail:detail(),updatedAt:serverTimestamp(),clientTime:new Date().toISOString()});localStorage.removeItem(dirtyKey);status(language==='fr'?'☁ Progrès sauvegardés':'☁ Lernstand gespeichert')}catch(e){pending=true;status('Synchronisation échouée / Speichern fehlgeschlagen: '+e.code);$('cloud-retry').hidden=false}}
function installCloud(data){localStorage.setItem(adoptedKey,'yes');lock=true;try{for(const k of keys){if(data.progress&&Object.prototype.hasOwnProperty.call(data.progress,k)&&data.progress[k]!==null)localStorage.setItem(k,JSON.stringify(data.progress[k]))}if(own(data.detail))localStorage.setItem(detailKey,JSON.stringify(data.detail))}finally{lock=false}status(language==='fr'?'Progrès chargés. Rechargement de la page…':'Lernstand geladen. Seite wird neu geladen…');location.reload()}
function chooseUI(show){$('cloud-choose').hidden=!show;$('cloud-login').hidden=true}
async function connect(){ready=false;clearTimeout(timer);$('cloud-retry').hidden=true;try{
 const snapshot=await getDoc(ref());const local=stored();
 if(!snapshot.exists()){localStorage.setItem(adoptedKey,'yes');ready=true;status(language==='fr'?'Première sauvegarde dans le cloud…':'Erste Cloud-Sicherung…');await upload();return}
 const remote=snapshot.data();if(localStorage.getItem(adoptedKey)==='yes'){ready=true;status('☁ Cloud-Verbindung aktiv / Connecté au cloud');if(localStorage.getItem(dirtyKey)==='yes')await upload();return}if(!hasHistory(local)){installCloud(remote);return}
 // No silent overwrite: remote and local may contain different historical counters.
 status(language==='fr'?'Des progrès existent ici ET dans le cloud. Choisis quelle version conserver.':'Lokale UND Cloud-Daten vorhanden. Wähle bewusst die Version, die bleiben soll.');chooseUI(true);
 $('cloud-upload').onclick=async()=>{if(!confirm('Replace the cloud copy with THIS device’s progress? Save a backup first if uncertain.'))return;chooseUI(false);localStorage.setItem(adoptedKey,'yes');ready=true;await upload()};
 $('cloud-download').onclick=()=>{if(confirm('Replace THIS device’s local progress with the cloud copy?'))installCloud(remote)};
 $('cloud-later').onclick=()=>{chooseUI(false);status('Cloud sync paused; local progress is safe.');$('cloud-retry').hidden=false};
 }catch(e){status('Cloud error / Fehler: '+e.message);$('cloud-retry').hidden=false}}
if(!CLOUD_ENABLED){$('cloud-login').hidden=true;status(language==='fr'?'Synchronisation non configurée : les progrès restent sur cet appareil.':'Cloud noch nicht eingerichtet: lokale Daten bleiben erhalten.');$('cloud-explain').textContent='Configuration Firebase requise / Firebase-Einrichtung erforderlich.'}
else if(!firebaseConfig.apiKey||firebaseConfig.apiKey.includes('PASTE')||CHILD_AUTH_UID.includes('PASTE')){$('cloud-login').hidden=true;status('Firebase config incomplete. See README.')}else{
 try{const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);await setPersistence(auth,browserLocalPersistence);
 onAuthStateChanged(auth,async u=>{user=u;ready=false;clearTimeout(timer);$('cloud-login').hidden=!!u;$('cloud-signout').hidden=!u;if(!u){status(language==='fr'?'Connecte-toi une fois avec le compte enfant.':'Einmal mit dem Kinderkonto anmelden.');return}if(u.uid!==CHILD_AUTH_UID){status('This is not the configured child account. Sign out and use the child login.');return}await connect()});
 $('cloud-signin').onclick=async()=>{try{status('Connexion…');await signInWithEmailAndPassword(auth,$('cloud-email').value.trim(),$('cloud-password').value)}catch(e){status('Login failed: '+e.code)}};
 $('cloud-signout').onclick=()=>signOut(auth);
 $('cloud-retry').onclick=()=>{if(user?.uid!==CHILD_AUTH_UID)return;if(ready)upload();else connect()};
 }catch(e){$('cloud-login').hidden=true;status('Firebase failed to load: '+e.message)}
}
// A non-privileged browser has only the public Firebase configuration. Firestore rules enforce access.
