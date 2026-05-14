import { useBurnAid } from '../../context/BurnAidContext';
import { AlertTriangle, BookOpen, History as HistoryIcon, Info, Shield, ShieldCheck, Target, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Project mission / values — presentation-friendly marketing content.
 */
export function AboutView() {
  const {
    authUser,
    isRtl,
    setView,
    t,
  } = useBurnAid();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-20">
        <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase font-headline">{t.aboutView.title}</h1>
        <p className="text-2xl text-secondary font-bold uppercase tracking-widest">{t.aboutView.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
        <div className="bg-surface-container-low p-12 rounded-[3rem] border border-surface-container-high">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black mb-6 tracking-tight font-headline uppercase">{t.aboutView.mission.title}</h2>
          <p className="text-xl text-on-surface-variant leading-relaxed font-medium">
            {t.aboutView.mission.desc}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {t.aboutView.stats.map((stat: any, i: number) => (
            <div key={i} className="p-8 rounded-[2.5rem] border border-surface-container-high flex flex-col justify-center items-center text-center bg-white">
              <span className="text-4xl font-black mb-2">{stat.value}</span>
              <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-24">
        <h2 className="text-4xl font-black mb-12 tracking-tight font-headline uppercase text-center">{t.aboutView.valuesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.aboutView.values.map((value: any, i: number) => {
            const icons = [ShieldCheck, HistoryIcon, Shield];
            const Icon = icons[i];
            return (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-surface-container-high shadow-sm hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-secondary mb-8">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{value.title}</h3>
                <p className="text-on-surface-variant leading-relaxed font-medium">{value.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface-container-low p-12 rounded-[3rem] border border-surface-container-high">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
            <Info className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight font-headline uppercase">
              {isRtl ? 'الدعم والموارد' : 'Support & Resources'}
            </h2>
            <p className="text-on-surface-variant font-medium mt-2">
              {isRtl
                ? 'اختصري الوقت: ادخلي مباشرة للصفحات الأهم حسب حالتك.'
                : 'Jump straight to the most important pages for your situation.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-surface-container-high shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center text-error mb-6">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="text-2xl font-black mb-3">{isRtl ? 'طوارئ' : 'Emergency'}</div>
            <div className="text-on-surface-variant font-medium leading-relaxed mb-6">
              {isRtl
                ? 'لو في أعراض خطيرة أو حرق شديد، افتحي صفحة الطوارئ للحصول على خطوات فورية وأقرب رعاية.'
                : 'For severe burns or red flags, open Emergency for immediate steps and nearest care.'}
            </div>
            <button
              type="button"
              onClick={() => setView('emergency')}
              className="w-full bg-emergency-gradient text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              {isRtl ? 'افتحي الطوارئ' : 'Open Emergency'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-surface-container-high shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="text-2xl font-black mb-3">{isRtl ? 'التعليمات' : 'Documentation'}</div>
            <div className="text-on-surface-variant font-medium leading-relaxed mb-6">
              {isRtl
                ? 'بروتوكولات إسعاف أولي قائمة على الأدلة: تبريد، تغطية، منع عدوى، وإدارة الألم.'
                : 'Evidence-based first aid protocols: cooling, dressing, infection prevention, and pain management.'}
            </div>
            <button
              type="button"
              onClick={() => setView('documentation')}
              className="w-full bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              {isRtl ? 'افتحي التعليمات' : 'Open Documentation'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-surface-container-high shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <UserCircle className="w-7 h-7" />
            </div>
            <div className="text-2xl font-black mb-3">{isRtl ? 'حسابي' : 'My Account'}</div>
            <div className="text-on-surface-variant font-medium leading-relaxed mb-6">
              {isRtl
                ? 'سجّلي دخولك أو أنشئي حسابًا لحفظ الجلسة ومتابعة إعداداتك.'
                : 'Login or create an account to keep your session and manage settings.'}
            </div>
            <button
              type="button"
              onClick={() => setView(authUser ? 'account' : 'login')}
              className="w-full bg-white text-on-surface px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border border-surface-container-high hover:bg-surface-container-low transition-all active:scale-95"
            >
              {authUser ? (isRtl ? 'افتحي الحساب' : 'Open Account') : (isRtl ? 'تسجيل الدخول' : 'Login')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
