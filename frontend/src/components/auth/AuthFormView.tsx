/**
 * Login or registration form posting to the Express API (/api/auth/login | register).
 */
import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { BLOOD_TYPE_OPTIONS, EGYPTIAN_PHONE_PATTERN } from '../../constants/auth';

export type AuthFormViewProps = {
  mode: 'login' | 'register';
  backendUrl: string;
  isRtl: boolean;
  authError: string;
  onAuthStart: () => void;
  onAuthSuccess: (token: string, user: { id: string; name: string; email: string; role?: 'admin' | 'user'; phone?: string; bloodType?: string }) => void;
  onAuthError: (message: string) => void;
  onNavigate: (view: 'login' | 'register') => void;
};

export function AuthFormView({
  mode,
  backendUrl,
  isRtl,
  authError,
  onAuthStart,
  onAuthSuccess,
  onAuthError,
  onNavigate,
}: AuthFormViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAuthStart();
    // Signup requires contact and medical profile basics before the backend stores the account.
    if (isRegister && !EGYPTIAN_PHONE_PATTERN.test(phone)) {
      onAuthError(isRtl ? 'رقم الهاتف يجب أن يكون 11 رقمًا ويبدأ بـ 01' : 'Phone number must be 11 digits and start with 01');
      return;
    }
    if (isRegister && !bloodType) {
      onAuthError(isRtl ? 'اختر فصيلة الدم' : 'Please select a blood type');
      return;
    }
    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const resp = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegister ? { name, email, password, phone, bloodType } : { email, password }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || (isRegister ? 'Register failed' : 'Login failed'));
      onAuthSuccess(data.token, data.user);
    } catch (error) {
      onAuthError((error as Error).message || (isRegister ? 'Register failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-black mb-6 tracking-tighter uppercase font-headline text-center">
        {isRegister ? (isRtl ? 'إنشاء حساب' : 'Register') : (isRtl ? 'تسجيل الدخول' : 'Login')}
      </h1>
      <form onSubmit={onSubmit} className="bg-white p-10 rounded-[3rem] border border-surface-container-high shadow-sm">
        {authError && <div className="mb-6 p-4 rounded-2xl bg-error-container/30 border border-error/20 text-error font-bold">{authError}</div>}
        <div className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">{isRtl ? 'الاسم' : 'Name'}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                autoComplete="name"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-4 font-medium outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-4 font-medium outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="01xxxxxxxxx"
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-4 font-medium outline-none focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">{isRtl ? 'فصيلة الدم' : 'Blood Type'}</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-4 font-medium outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">{isRtl ? 'اختر فصيلة الدم' : 'Select blood type'}</option>
                  {BLOOD_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">{isRtl ? 'كلمة المرور' : 'Password'}</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-4 font-medium outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95 disabled:opacity-60"
          >
            {loading
              ? (isRtl ? 'جاري...' : 'Loading...')
              : isRegister
                ? (isRtl ? 'تسجيل' : 'Create account')
                : (isRtl ? 'دخول' : 'Sign in')}
          </button>
          <button
            type="button"
            onClick={() => onNavigate(isRegister ? 'login' : 'register')}
            className="w-full bg-white text-on-surface px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest border border-surface-container-high hover:bg-surface-container-low transition-all active:scale-95"
          >
            {isRegister ? (isRtl ? 'عندي حساب' : 'I already have an account') : (isRtl ? 'إنشاء حساب' : 'Create account')}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
