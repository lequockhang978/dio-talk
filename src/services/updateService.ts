import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';

export interface AppUpdateInfo {
  version: string;
  versionCode: number;
  releaseDate: string;
  title: string;
  changelog: string[];
  apkUrl: string;
  isMandatory?: boolean;
}

// Current App Version
export const CURRENT_APP_VERSION = '1.2.0';
export const CURRENT_VERSION_CODE = 120;
export const CURRENT_VERSION_TAG = 'v1.2.0';

// Default GitHub Raw / Public JSON endpoint (fallback)
export const DEFAULT_UPDATE_JSON_URL = 'https://raw.githubusercontent.com/lequockhang978/dio-talk/main/public/version.json';

// Compare version numbers (e.g. "1.0.1" > "1.0.0" or by versionCode)
export const isNewerVersion = (remoteVersion: string, remoteCode?: number): boolean => {
  if (remoteCode && remoteCode <= CURRENT_VERSION_CODE) {
    return false;
  }
  if (remoteCode && remoteCode > CURRENT_VERSION_CODE) {
    return true;
  }
  
  const clean = (v: string) => v.replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  const vRemote = clean(remoteVersion);
  const vCurrent = clean(CURRENT_APP_VERSION);
  
  for (let i = 0; i < Math.max(vRemote.length, vCurrent.length); i++) {
    const r = vRemote[i] || 0;
    const c = vCurrent[i] || 0;
    if (r > c) return true;
    if (r < c) return false;
  }
  return false;
};

export interface CheckUpdateResult {
  hasUpdate: boolean;
  updateInfo: AppUpdateInfo | null;
  source: 'firebase' | 'github' | 'none';
  error?: string;
}

/**
 * Checks for app updates via Firebase Firestore (primary) or custom/GitHub JSON URL (secondary)
 */
export const checkAppUpdate = async (customUrl?: string): Promise<CheckUpdateResult> => {
  // 1. Try Firebase Firestore (studio-xdudz: collection 'app_meta', document 'version')
  try {
    const db = getFirebaseDb();
    if (db) {
      const snap = await getDoc(doc(db, 'app_meta', 'version'));
      if (snap.exists()) {
        const data = snap.data() as Partial<AppUpdateInfo>;
        if (data.version && data.apkUrl) {
          const info: AppUpdateInfo = {
            version: data.version,
            versionCode: data.versionCode || 101,
            releaseDate: data.releaseDate || new Date().toISOString().split('T')[0],
            title: data.title || `Bản cập nhật Dio Talk ${data.version}`,
            changelog: Array.isArray(data.changelog) ? data.changelog : ['Nâng cấp hiệu năng và sửa lỗi'],
            apkUrl: data.apkUrl,
            isMandatory: !!data.isMandatory
          };
          if (isNewerVersion(info.version, info.versionCode)) {
            return { hasUpdate: true, updateInfo: info, source: 'firebase' };
          }
          return { hasUpdate: false, updateInfo: null, source: 'firebase' };
        }
      }
    }
  } catch (err) {
    console.warn('[UpdateService] Firestore check skipped/failed, trying HTTP fallback', err);
  }

  // 2. Try HTTP JSON fallback (GitHub Raw or custom hosting with cache-busting)
  const targetUrl = customUrl || localStorage.getItem('dio_update_url') || DEFAULT_UPDATE_JSON_URL;
  const cacheBustedUrl = targetUrl.includes('?') ? `${targetUrl}&_t=${Date.now()}` : `${targetUrl}?_t=${Date.now()}`;
  try {
    const res = await fetch(cacheBustedUrl, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json() as Partial<AppUpdateInfo>;
      if (data.version && data.apkUrl) {
        const info: AppUpdateInfo = {
          version: data.version,
          versionCode: data.versionCode || 101,
          releaseDate: data.releaseDate || '',
          title: data.title || `Bản cập nhật Dio Talk ${data.version}`,
          changelog: Array.isArray(data.changelog) ? data.changelog : ['Cập nhật dữ liệu hàng hải mới'],
          apkUrl: data.apkUrl,
          isMandatory: !!data.isMandatory
        };
        if (isNewerVersion(info.version, info.versionCode)) {
          return { hasUpdate: true, updateInfo: info, source: 'github' };
        }
      }
    }
  } catch (err: any) {
    console.warn('[UpdateService] JSON check failed, trying GitHub Releases API fallback', err);
  }

  // 3. Try GitHub Releases API directly (zero CDN cache delay)
  try {
    const ghRes = await fetch('https://api.github.com/repos/lequockhang978/dio-talk/releases/latest', {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      cache: 'no-store'
    });
    if (ghRes.ok) {
      const release = await ghRes.json();
      const tagName = (release.tag_name || '').replace(/^v/i, '');
      const apkAsset = release.assets?.find((a: any) => a.name?.endsWith('.apk'));
      if (tagName && apkAsset?.browser_download_url) {
        const tagParts = tagName.split('.').map((n: string) => parseInt(n, 10) || 0);
        const calcCode = (tagParts[0] || 1) * 100 + (tagParts[1] || 0) * 10 + (tagParts[2] || 0);
        const info: AppUpdateInfo = {
          version: tagName,
          versionCode: calcCode,
          releaseDate: release.published_at ? release.published_at.split('T')[0] : '',
          title: release.name || `Bản cập nhật Dio Talk v${tagName}`,
          changelog: release.body ? release.body.split('\n').filter((l: string) => l.trim().length > 0) : ['Nâng cấp hiệu năng'],
          apkUrl: apkAsset.browser_download_url,
          isMandatory: false
        };
        if (isNewerVersion(info.version, info.versionCode)) {
          return { hasUpdate: true, updateInfo: info, source: 'github' };
        }
      }
    }
  } catch (err: any) {
    return { hasUpdate: false, updateInfo: null, source: 'none', error: err?.message || 'Không thể kết nối máy chủ' };
  }

  return { hasUpdate: false, updateInfo: null, source: 'none' };
};

export const openApkDownload = (apkUrl: string) => {
  if (!apkUrl) return;
  try {
    const a = document.createElement('a');
    a.href = apkUrl;
    a.target = '_system';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.error('Error triggering download via anchor:', e);
  }

  // Direct location assign fallback to ensure system browser catches download
  setTimeout(() => {
    try {
      window.location.href = apkUrl;
    } catch (e) {
      console.error('Error with location.href fallback:', e);
    }
  }, 200);
};
