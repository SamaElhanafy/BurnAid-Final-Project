import { useBurnAid } from '../../context/BurnAidContext';
import { AlertTriangle, Brain, Camera, CheckCircle2, ChevronRight, PhoneCall, PlayCircle, ShieldCheck, Upload } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Marketing landing: hero, trust signals, CTAs to assessment and explainer video.
 */
export function LandingView() {
  const {
    isRtl,
    lang,
    setIsEmergencyModalOpen,
    setView,
    t,
  } = useBurnAid();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-24 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            key={lang}
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold tracking-widest uppercase mb-6">
              {t.medicalIntelligence}
            </span>
            <h1 className="font-headline font-black text-5xl md:text-7xl text-on-surface leading-[1.1] tracking-tight mb-8">
              {t.heroTitle} <br /><span className="text-primary">{t.heroTitleHighlight}</span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl mb-10">
              {t.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => setView('assessment')}
                className="bg-emergency-gradient text-white px-8 py-5 rounded-full flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all active:scale-95 group"
              >
                <Upload className="w-6 h-6" />
                <span className="font-bold text-lg">{t.uploadBtn}</span>
              </button>
              <button 
                onClick={() => setView('how-it-works')}
                className="bg-surface-container-high text-on-surface px-8 py-5 rounded-full flex items-center justify-center gap-3 hover:bg-surface-container-highest transition-all active:scale-95"
              >
                <PlayCircle className="w-6 h-6" />
                <span className="font-bold">{t.howItWorks}</span>
              </button>
            </div>
            {/* Medical Disclaimer */}
            <div className="bg-error-container/30 border-l-4 rtl:border-l-0 rtl:border-r-4 border-error p-4 rounded-r-xl rtl:rounded-r-none rtl:rounded-l-xl max-w-lg">
              <p className="text-sm text-on-error-container leading-snug flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{t.disclaimerLabel}</strong> {t.disclaimerText}
                </span>
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className={`absolute -top-12 ${isRtl ? '-left-12' : '-right-12'} w-64 h-64 bg-secondary-fixed opacity-20 blur-3xl rounded-full`}></div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYHmyJnvyk29yy8YKlREHveO-nJTgZGbFPzMGoDVWDpRaKUxEVKUwpjA8qK0SlC0PGnbuZUc18yjWH3ZJRl8wGPFk3SQtCDxWGP5tL0nvWYRci0Pu5h2HE3l8MdPWeJW2_f78toeu-vFZQ7qidRx0HrlvVqgf3As4dAyNYIBBxOuTQ6TOq0_fTAHi4jDlX3eH16_PpgZhMEjH1mjMR3yHmdOCY_Z6R5RrypupDK9cnLC1O5mm31wMgMxKZIh8DNI3NhQz3i96310w" 
                alt={t.heroImageAlt}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 to-transparent"></div>
              <div className={`absolute bottom-8 ${isRtl ? 'right-8' : 'left-8'} ${isRtl ? 'left-8' : 'right-8'} bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-tertiary" />
                  </div>
                  <div>
                    <div className="font-bold text-on-surface">{t.evidenceTitle}</div>
                    <div className="text-xs text-on-surface-variant">{t.evidenceDesc}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="font-headline font-black text-4xl text-center mb-16">
          {t.precisionTitle} <span className="text-secondary">{t.precisionHighlight}</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {t.steps.map((step, i) => {
            const icons = [Camera, Brain, CheckCircle2];
            const colors = ['bg-blue-50 text-secondary', 'bg-red-50 text-primary', 'bg-green-50 text-tertiary'];
            const Icon = icons[i];
            return (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-surface-container-lowest p-8 rounded-[2rem] border border-surface-container-high shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-16 h-16 ${colors[i]} rounded-2xl flex items-center justify-center mb-8`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-headline font-bold text-2xl mb-4">{step.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Education Section */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-headline font-black text-4xl md:text-5xl mb-6 leading-tight">
                {t.educationTitle} <span className="text-tertiary">{t.educationHighlight}</span>
              </h2>
              <p className="text-lg text-on-surface-variant">
                {t.educationDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setView('documentation')}
              className="bg-white text-secondary px-8 py-3 rounded-full font-bold border border-secondary/20 hover:bg-secondary/5 transition-colors"
            >
              {t.exploreBtn}
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Featured Card */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-8 group relative rounded-[2.5rem] overflow-hidden h-[400px] shadow-lg"
            >
              <img 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyN8taxNbrQfwuXlKGkdCcvFAdVuGoor203BizOBnKhL4tSJBdoWxxJm1JlHHeqfBGFM2XWkDeEgJ1y9ZebCaVmxZY6L-YjyFbjDJlXRz-bY6BSX-gBAJSnvw8834qVm0lU88aOFcx8Y9ZaRFsdxQjjOK18RSs3KbNMng8PyTR1Zamc6eS-_a8-e67keSOvXic_DbV0j_BaELJh0kAOfZdm80pWpUa68y9wLmUzEf1S7v1fGCkNn_-K76SHL4DbBZ-eAMOJqComu4" 
                alt="Medical supplies"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>
              <div className={`absolute bottom-10 ${isRtl ? 'right-10' : 'left-10'} ${isRtl ? 'left-10' : 'right-10'}`}>
                <span className="bg-tertiary text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 inline-block">{t.essentialGuide}</span>
                <h3 className="text-3xl font-headline font-bold text-white mb-2">{t.featuredTitle}</h3>
                <p className="text-white/80 max-w-lg">{t.featuredDesc}</p>
              </div>
            </motion.div>

            {/* Side Stack */}
            <div className="lg:col-span-4 flex flex-col h-full">
              {t.sideStack.map((item, i) => {
                if (i === 0) return null;
                const Icons = [ChevronRight, AlertTriangle];
                const Icon = Icons[i];
                const isError = i === 1;
                return (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    onClick={() => setView('documentation')}
                    className={`flex-1 ${isError ? 'bg-error-container/30 border-2 border-error/20' : 'bg-surface-container-lowest shadow-sm'} p-10 rounded-[2.5rem] hover:shadow-2xl transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden`}
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-error/5 rounded-full blur-2xl group-hover:bg-error/10 transition-colors"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className={`w-8 h-8 ${isError ? 'text-error' : 'text-secondary'}`} />
                      </div>
                      <h3 className={`text-2xl font-headline font-black mb-4 leading-tight ${isError ? 'text-on-error-container' : 'text-on-surface'}`}>{item.title}</h3>
                      <p className="text-base text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 text-error font-bold mt-8 group-hover:gap-3 transition-all relative z-10">
                      <span>{t.exploreBtn}</span>
                      <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Banner */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-emergency-gradient p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-white text-center md:text-left"
        >
          <div className="flex items-center gap-6">
            <PhoneCall className="w-12 h-12 opacity-80" />
            <div>
              <h4 className="font-headline font-bold text-xl uppercase tracking-tight">{t.urgencyTitle}</h4>
              <p className="text-white/80 text-sm">{t.urgencyDesc}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="bg-white text-primary px-10 py-4 rounded-full font-black text-lg active:scale-95 transition-all shadow-xl"
          >
            {t.dialBtn}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
