import { useBurnAid } from '../../context/BurnAidContext';
import { Activity, AlertTriangle, CheckCircle, Droplets, HeartPulse, Info, Map, Stethoscope, Thermometer, Timer } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Static clinical-protocol style documentation sections from translations.
 */
export function DocumentationView() {
  const {
    isRtl,
    setView,
    skipNextScrollToTopRef,
    t,
  } = useBurnAid();

    const { documentationView } = t;
    const [section1, section2, section3, section4] = documentationView.sections;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-7xl mx-auto px-6 py-12"
      >
      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase font-headline">{t.documentationView.title}</h1>
        <p className="text-xl text-on-surface-variant max-w-3xl leading-relaxed mb-10">
          {t.documentationView.desc}
        </p>
      </div>

      {/* Urgency Banner */}
      <div className="bg-error-container p-8 rounded-[2.5rem] mb-16 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden border border-error/10">
        <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} p-4 opacity-5`}>
          <AlertTriangle className="w-48 h-48" />
        </div>
        <div className="flex-1 relative z-10">
          <h2 className="text-2xl font-black text-on-error-container mb-2 uppercase font-headline">{t.documentationView.urgency.title}</h2>
          <p className="text-on-error-container font-medium max-w-3xl">{t.documentationView.urgency.desc}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            document.getElementById('doc-immediate-response')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="bg-error text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 relative z-10 hover:bg-error/90 focus:outline-none focus:ring-4 focus:ring-error/20"
        >
          {t.documentationView.urgency.btn}
        </button>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Section 1: Immediate Response */}
        <section
          id="doc-immediate-response"
          className="md:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-sm border-l-8 border-primary"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black text-primary uppercase font-headline tracking-tight">
              {section1?.id}. {section1?.title}
            </h3>
          </div>
          <div className="space-y-10">
            {section1?.steps?.map((step: any, i: number) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center shrink-0 font-black text-primary transition-all group-hover:bg-primary group-hover:text-white border border-surface-container-high">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-xl font-black mb-2 tracking-tight">{step.title}</h4>
                  <p className="text-on-surface-variant leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Image Support 1 */}
        <div className="md:col-span-4 h-full min-h-[400px]">
          <div className="relative h-full rounded-[2.5rem] overflow-hidden shadow-sm">
            <img 
              alt="Clinical Precision" 
              className="absolute inset-0 w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className={`absolute bottom-8 ${isRtl ? 'right-8' : 'left-8'} text-white`}>
              <p className="font-black text-xl mb-1 tracking-tight">{t.documentationView.precision.title}</p>
              <p className="text-sm font-medium opacity-80">{t.documentationView.precision.desc}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Wound Dressing */}
        <section className="md:col-span-12 grid md:grid-cols-2 gap-8 items-center bg-secondary/5 p-10 rounded-[2.5rem] border border-secondary/10">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black text-secondary uppercase font-headline tracking-tight">
                {section2?.id}. {section2?.title}
              </h3>
            </div>
            <div className="space-y-6">
              {section2?.items?.map((item: any, i: number) => (
                <div key={i} className="p-8 bg-white rounded-[2rem] shadow-sm border border-secondary/5">
                  <h4 className="font-black text-secondary mb-3 flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5" />
                    {item.title}
                  </h4>
                  <p className="text-on-surface-variant leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-secondary/10">
            <img 
              alt="Medical supplies" 
              className="rounded-[2rem] w-full shadow-inner" 
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&q=80&w=800" 
            />
          </div>
        </section>

        {/* Section 3: Infection Prevention */}
        <section className="md:col-span-6 bg-surface-container-low p-10 rounded-[2.5rem] border-t-8 border-tertiary shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-tertiary uppercase font-headline tracking-tight">
              {section3?.id}. {section3?.title}
            </h3>
          </div>
          <p className="mb-8 text-on-surface-variant font-medium leading-relaxed">
            {section3?.desc}
          </p>
          <ul className="space-y-4">
            {section3?.indicators?.map((indicator: any, i: number) => (
              <li key={i} className={`flex items-start gap-4 p-6 ${i === 0 ? 'bg-tertiary/10' : 'bg-white'} rounded-2xl border border-tertiary/5 transition-all hover:scale-[1.02]`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 ? 'text-tertiary' : 'text-tertiary/60'}`}>
                  {i === 0 ? <Thermometer className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                </div>
                <div>
                  <span className="font-black block text-tertiary mb-1">{indicator.title}</span>
                  <span className="text-sm text-on-surface-variant font-medium leading-relaxed">{indicator.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4: Pain Management */}
        <section className="md:col-span-6 bg-white p-10 rounded-[2.5rem] shadow-sm border-t-8 border-secondary">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-secondary uppercase font-headline tracking-tight">
              {section4?.id}. {section4?.title}
            </h3>
          </div>
          <div className="mb-8">
            <p className="text-on-surface-variant leading-relaxed font-medium mb-8">
              {section4?.desc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section4?.methods?.map((method: any, i: number) => (
                <div key={i} className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                  <span className="font-black block mb-2 text-secondary">{method.title}</span>
                  <span className="text-sm text-on-surface-variant font-medium leading-relaxed">{method.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-surface-container-high italic text-on-surface-variant flex items-center gap-3 font-medium text-sm">
            <Info className="w-5 h-5 text-secondary" />
            {section4?.footer}
          </div>
        </section>
      </div>

      {/* Call to Action (keep position, delete PDF part only) */}
      <div className="mt-24 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-black mb-10 tracking-tight font-headline uppercase">{t.documentationView.cta.title}</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <button
            type="button"
            onClick={() => {
              skipNextScrollToTopRef.current = true;
              setView('emergency');
              window.setTimeout(() => {
                document.getElementById('emergency-facility')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 80);
            }}
            className="bg-primary text-white px-12 py-6 rounded-2xl font-black text-base uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-3"
          >
            <Map className="w-5 h-5" />
            {t.documentationView.cta.btns[0]}
          </button>
        </div>
      </div>

    </motion.div>
  );
}
