import { useBurnAid } from '../../context/BurnAidContext';
import { LayoutDashboard, ShieldCheck, UserCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import { BLOOD_TYPE_OPTIONS } from '../../constants/auth';
import { ChangePasswordCard } from '../auth/ChangePasswordCard';

/**
 * Profile editing, password card, and logged-in burn assessment history.
 */
export function AccountView() {
  const {
    authToken,
    authUser,
    backendUrl,
    burnHistory,
    clearAssessmentSessionState,
    deleteBurnResult,
    fetchBurnResultById,
    getPredictionText,
    handlePickImage,
    historyError,
    historyLoading,
    isRtl,
    profileBloodType,
    profileEmail,
    profileLoading,
    profileName,
    profilePhone,
    profileStatus,
    saveProfile,
    selectedBurnResult,
    setAuthError,
    setAuthToken,
    setAuthUser,
    setProfileAllergies,
    setProfileBloodType,
    setProfileEmail,
    setProfileMedications,
    setProfileName,
    setProfilePhone,
    setProfileStatus,
    setView,
    t,
    view,
  } = useBurnAid();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase font-headline">{t.accountView.title}</h1>
        <p className="text-2xl text-secondary font-bold uppercase tracking-widest">{t.accountView.subtitle}</p>
      </div>

      {!authUser && (
        <div className="max-w-xl mx-auto mb-12 bg-surface-container-low p-8 rounded-[2.5rem] border border-surface-container-high text-center">
          <h2 className="text-2xl font-black mb-3">{isRtl ? 'تسجيل الدخول مطلوب' : 'Login required'}</h2>
          <p className="text-on-surface-variant font-medium mb-6">
            {isRtl ? 'سجّل الدخول أو أنشئ حسابًا لعرض ملفك.' : 'Please login or create an account to view your profile.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => setView('login')}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              {isRtl ? 'تسجيل الدخول' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setView('register')}
              className="bg-white text-on-surface px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border border-surface-container-high hover:bg-surface-container-low transition-all active:scale-95"
            >
              {isRtl ? 'إنشاء حساب' : 'Register'}
            </button>
          </div>
        </div>
      )}

      {authUser && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-surface-container-high shadow-sm">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                  <UserCircle className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight font-headline uppercase">{t.accountView.profile.title}</h2>
                  <p className="text-on-surface-variant font-medium">{t.accountView.profile.verified}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <label className="space-y-2 text-sm font-medium">
                  <span>{t.accountView.profile.name}</span>
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-2xl border border-surface-container-high px-4 py-3 bg-surface-container-low"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>{t.accountView.profile.email}</span>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full rounded-2xl border border-surface-container-high px-4 py-3 bg-surface-container-low"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>{t.accountView.profile.phone}</span>
                  <input
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    type="tel"
                    inputMode="numeric"
                    placeholder="01xxxxxxxxx"
                    className="w-full rounded-2xl border border-surface-container-high px-4 py-3 bg-surface-container-low"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>{t.accountView.profile.bloodType}</span>
                  <select
                    value={profileBloodType}
                    onChange={(e) => setProfileBloodType(e.target.value)}
                    className="w-full rounded-2xl border border-surface-container-high px-4 py-3 bg-surface-container-low"
                  >
                    <option value="">{isRtl ? 'اختر فصيلة الدم' : 'Select blood type'}</option>
                    {BLOOD_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={profileLoading}
                  className="bg-secondary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-60"
                >
                  {profileLoading ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ الملف الشخصي' : 'Save profile')}
                </button>
                {profileStatus && (
                  <p className="text-sm font-bold text-success text-left">{profileStatus}</p>
                )}
              </div>
            </div>

            <ChangePasswordCard authToken={authToken} backendUrl={backendUrl} isRtl={isRtl} />

            <div className="bg-white p-10 rounded-[3rem] border border-surface-container-high shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight font-headline uppercase">{isRtl ? 'سجل التقييمات' : 'Assessment History'}</h2>
                  <p className="text-on-surface-variant text-sm">{isRtl ? 'النتائج المحفوظة لحالات الحروق لديك.' : 'Saved burn assessment results.'}</p>
                </div>
                <button
                  type="button"
                  onClick={handlePickImage}
                  className="text-xs font-bold uppercase tracking-widest text-secondary"
                >
                  {isRtl ? 'إجراء تقييم جديد' : 'New assessment'}
                </button>
              </div>

              {historyError && (
                <div className="mb-4 rounded-2xl bg-error/10 border border-error/20 p-4 text-error text-sm font-medium">
                  {historyError}
                </div>
              )}

              {historyLoading ? (
                <div className="text-center py-12 text-on-surface-variant">{isRtl ? 'جاري التحميل...' : 'Loading history...'}</div>
              ) : burnHistory.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant">{isRtl ? 'لا توجد نتائج محفوظة بعد.' : 'No saved results yet.'}</div>
              ) : (
                <div className="space-y-4">
                  {burnHistory.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-surface-container-high p-5 bg-surface-container-low">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-widest text-secondary font-black">
                            {isRtl ? getPredictionText(item.burnType, 'ar').localizedLabel : item.burnType}
                          </p>
                          <p className="text-sm text-on-surface-variant">{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-on-surface">
                          <span>{isRtl ? 'الثقة:' : 'Confidence:'}</span>
                          <span className="font-black">{(item.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => fetchBurnResultById(item.id)}
                          className="px-4 py-3 rounded-2xl bg-secondary text-white font-bold text-sm hover:bg-secondary/90 transition-all"
                        >
                          {isRtl ? 'عرض التفاصيل' : 'View details'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBurnResult(item.id)}
                          className="px-4 py-3 rounded-2xl bg-error/10 text-error font-bold text-sm hover:bg-error/20 transition-all"
                        >
                          {isRtl ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedBurnResult && (
                <div className="mt-8 rounded-3xl border border-surface-container-high bg-white p-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-black">{isRtl ? 'تفاصيل التقييم' : 'Result details'}</h3>
                      <p className="text-sm text-on-surface-variant">
                        {isRtl ? getPredictionText(selectedBurnResult.burnType, 'ar').localizedLabel : selectedBurnResult.burnType}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-secondary font-black">{(selectedBurnResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                    {isRtl ? getPredictionText(selectedBurnResult.burnType, 'ar').description : selectedBurnResult.description}
                  </p>
                  {(isRtl || selectedBurnResult.recommendations?.length) ? (
                    <div className="space-y-2">
                      <p className="font-bold">{isRtl ? 'التوصيات' : 'Recommendations'}</p>
                      <ul className="list-disc list-inside text-sm leading-7 text-on-surface-variant">
                        {(isRtl ? getPredictionText(selectedBurnResult.burnType, 'ar').recommendations : selectedBurnResult.recommendations || []).map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-surface-container-low p-10 rounded-[3rem] border border-surface-container-high">
              <h2 className="text-2xl font-black mb-8 tracking-tight font-headline uppercase">{isRtl ? 'الخيارات' : 'Options'}</h2>
              <div className="space-y-4">
                {authUser.role === 'admin' && (
                  <button 
                    onClick={() => setView('admin')}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-wider">{t.adminPortal.title}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    clearAssessmentSessionState();
                    setAuthUser(null);
                    setAuthToken('');
                    setProfileName('');
                    setProfileEmail('');
                    setProfilePhone('');
                    setProfileBloodType('');
                    setProfileAllergies('');
                    setProfileMedications('');
                    setProfileStatus('');
                    localStorage.removeItem('burnaid_token');
                    sessionStorage.removeItem('burnaid_token');
                    setAuthError('');
                    setView('landing');
                  }}
                  className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-error text-white font-black text-sm uppercase tracking-widest hover:bg-error/90 transition-colors active:scale-95"
                >
                  <X className="w-5 h-5" />
                  {isRtl ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-secondary/10">
              <div className="flex items-center gap-4 mb-4">
                <ShieldCheck className="w-6 h-6 text-secondary" />
                <h3 className="font-black uppercase tracking-tight">{t.accountView.hipaa.title}</h3>
              </div>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                {t.accountView.hipaa.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
