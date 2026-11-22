/* Math Genius V3.2 PWA install UX. Browser-native address-bar controls remain browser-managed. */
let installPrompt = null;
const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const installButtons = () => [document.getElementById('mg-install'), document.getElementById('mg-install-settings')].filter(Boolean);
const helpText = () => {
  const help = document.getElementById('mg-install-help');
  if (!help) return;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  help.textContent = ios
    ? 'Để cài trên iPhone/iPad: mở trang này bằng Safari → Chia sẻ → Add to Home Screen → Add.'
    : 'Nếu Chrome/Edge chưa hiện lời nhắc cài đặt: mở menu ⋮ → Cast, save and share (hoặc More tools) → Install page as app / Install this site as an app. Khi đủ điều kiện, trình duyệt cũng có thể hiện biểu tượng cài đặt ở thanh địa chỉ.';
};
function syncInstallUI() {
  const installed = isInstalled();
  installButtons().forEach(button => {
    button.hidden = installed;
    button.disabled = installed;
  });
  const help = document.getElementById('mg-install-help');
  if (help && installed) help.textContent = 'Math Genius đang chạy ở chế độ ứng dụng đã cài đặt trên thiết bị này.';
}
async function requestInstall(fromToolbar = false) {
  if (isInstalled()) { syncInstallUI(); return; }
  if (installPrompt) {
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice?.outcome === 'accepted') {
      installPrompt = null;
      const help = document.getElementById('mg-install-help');
      if (help) help.textContent = 'Đã chấp nhận cài đặt. Hoàn tất theo hướng dẫn của trình duyệt.';
    }
    return;
  }
  helpText();
  if (fromToolbar) document.getElementById('mg-open-settings')?.click();
}
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  syncInstallUI();
});
window.addEventListener('appinstalled', () => {
  installPrompt = null;
  syncInstallUI();
});
window.matchMedia('(display-mode: standalone)').addEventListener?.('change', syncInstallUI);
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('mg-install')?.addEventListener('click', () => requestInstall(true));
  document.getElementById('mg-install-settings')?.addEventListener('click', () => requestInstall(false));
  syncInstallUI();
});
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js', {scope:'./'}).catch(err => console.warn('PWA offline registration failed:', err)));
}
