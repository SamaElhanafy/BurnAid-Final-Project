/**
 * Authenticated form that calls PUT /api/auth/password on the Express backend.
 */
import { useState, type FormEvent } from 'react';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

export type ChangePasswordCardProps = {
  authToken: string;
  backendUrl: string;
  isRtl: boolean;
};

export function ChangePasswordCard({ authToken, backendUrl, isRtl }: ChangePasswordCardProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [passwordStatusTone, setPasswordStatusTone] = useState<'success' | 'error'>('success');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authToken) return;
    setPasswordStatus('');
    setPasswordStatusTone('error');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordStatus(isRtl ? 'املأ كل حقول كلمة المرور.' : 'Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus(isRtl ? 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.' : 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordStatus(isRtl ? 'تأكيد كلمة المرور غير مطابق.' : 'New password and confirmation do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordStatus(isRtl ? 'اختر كلمة مرور جديدة مختلفة.' : 'Choose a new password that is different from the current one.');
      return;
    }

    setPasswordLoading(true);
    try {
      const resp = await fetch(`${backendUrl}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        console.error('[password-change] request failed', {
          status: resp.status,
          statusText: resp.statusText,
          error: data?.error,
        });
        throw new Error(data?.error || `Unable to change password (${resp.status})`);
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordStatusTone('success');
      setPasswordStatus(isRtl ? 'تم تغيير كلمة المرور بنجاح.' : 'Password changed successfully.');
    } catch (error) {
      setPasswordStatusTone('error');
      setPasswordStatus((error as Error).message || (isRtl ? 'تعذر تغيير كلمة المرور.' : 'Unable to change password.'));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <form onSubmit={changePassword} className="bg-white p-10 rounded-[3rem] border border-surface-container-high shadow-sm">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight font-headline uppercase">{isRtl ? 'تغيير كلمة المرور' : 'Change Password'}</h2>
          <p className="text-on-surface-variant font-medium">
            {isRtl ? 'حدّث كلمة مرور حسابك بأمان.' : 'Update your account password securely.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <label className="space-y-2 text-sm font-medium">
          <span>{isRtl ? 'كلمة المرور الحالية' : 'Current password'}</span>
          <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-2xl border border-surface-container-high px-4 py-3 pr-12 bg-surface-container-low"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((value) => !value)}
            aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition-colors"
          >
            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          </div>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>{isRtl ? 'كلمة المرور الجديدة' : 'New password'}</span>
          <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-2xl border border-surface-container-high px-4 py-3 pr-12 bg-surface-container-low"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((value) => !value)}
            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition-colors"
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          </div>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>{isRtl ? 'تأكيد كلمة المرور' : 'Confirm password'}</span>
          <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-2xl border border-surface-container-high px-4 py-3 pr-12 bg-surface-container-low"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          </div>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          type="submit"
          disabled={passwordLoading}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-60"
        >
          {passwordLoading ? (isRtl ? 'جارٍ التحديث...' : 'Updating...') : (isRtl ? 'تغيير كلمة المرور' : 'Change password')}
        </button>
        {passwordStatus && (
          <p className={`text-sm font-bold text-left ${passwordStatusTone === 'success' ? 'text-success' : 'text-error'}`}>
            {passwordStatus}
          </p>
        )}
      </div>
    </form>
  );
}
