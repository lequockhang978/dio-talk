import React from 'react';
import { Download, Sparkles, X, AlertCircle } from 'lucide-react';
import type { AppUpdateInfo } from '../services/updateService';
import { CURRENT_VERSION_TAG, openApkDownload } from '../services/updateService';

interface UpdateModalProps {
  updateInfo: AppUpdateInfo;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ updateInfo, onClose }) => {
  const handleDownload = () => {
    openApkDownload(updateInfo.apkUrl);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={() => {
        if (!updateInfo.isMandatory) onClose();
      }}
    >
      <div 
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: 24,
          padding: '24px 20px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          position: 'relative',
          animation: 'dioPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!updateInfo.isMandatory && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              border: 'none',
              background: '#F1F5F9',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Header with App Logo */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
            <img 
              src="/assets/dio_talk_logo.png" 
              alt="Dio Talk Logo"
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
              }}
            />
            <span 
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                background: '#10B981',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '2px 6px',
                fontSize: '0.65rem',
                fontWeight: 800,
                border: '2px solid #FFFFFF'
              }}
            >
              MỚI
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
            {updateInfo.title || 'Cập Nhật Phiên Bản Mới'}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.8rem' }}>
            <span style={{ color: '#64748B', background: '#F1F5F9', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
              Hiện tại: {CURRENT_VERSION_TAG}
            </span>
            <span style={{ color: '#2563EB', fontWeight: 800 }}>➔</span>
            <span style={{ color: '#1D4ED8', background: '#DBEAFE', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
              Mới: v{updateInfo.version}
            </span>
          </div>
        </div>

        {/* Mandatory Warning */}
        {updateInfo.isMandatory && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            padding: '8px 12px',
            borderRadius: 10,
            marginBottom: 14,
            fontSize: '0.78rem',
            color: '#B91C1C',
            fontWeight: 700
          }}>
            <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
            <span>Bản cập nhật quan trọng. Vui lòng cập nhật để tiếp tục sử dụng.</span>
          </div>
        )}

        {/* Changelog Card */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 14,
          padding: 14,
          marginBottom: 18,
          maxHeight: 180,
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={15} color="#2563EB" /> Những điểm mới nổi bật:
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
            {updateInfo.changelog.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleDownload}
            style={{
              width: '100%',
              padding: '13px 18px',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Download size={18} />
            Tải & Cài Đặt Bản Mới (APK)
          </button>

          {!updateInfo.isMandatory && (
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#64748B',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Để sau (Nhắc tôi lần sau)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
