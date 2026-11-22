let installPrompt=null;
const installButton=()=>document.getElementById('mg-install');
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;const b=installButton();if(b)b.hidden=false;});
window.addEventListener('appinstalled',()=>{installPrompt=null;const b=installButton();if(b)b.hidden=true;});
document.addEventListener('DOMContentLoaded',()=>{const b=installButton();if(!b)return;b.addEventListener('click',async()=>{if(!installPrompt){const help=document.getElementById('mg-install-help');if(help)help.textContent='Nếu nút cài đặt của trình duyệt không xuất hiện: Chrome/Edge → menu ⋮ → Install app / Install this site as an app. Trên iPhone/iPad: Safari → Chia sẻ → Add to Home Screen.';return;}installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;b.hidden=true;});});
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(err=>console.warn('PWA offline registration failed:',err)));}
