/**
 * Floating assistant button + modal with scripted first-aid guidance by burn degree.
 * Uses rule-based replies (not a live LLM) so it works offline for demos.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, RefreshCw, Send } from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { ChatHistoryMessage, ChatTab } from '../../types/burnAid';

export type ChatbotModalProps = {
  t: TranslationDict;
  isRtl: boolean;
  lang: 'en' | 'ar';
  predictionLabel?: string;
  onNavigateToAssessment: () => void;
  startOpen?: boolean;
  onClose?: () => void;
};

export function ChatbotModal({
  t,
  isRtl,
  lang,
  predictionLabel,
  onNavigateToAssessment,
  startOpen,
  onClose,
}: ChatbotModalProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (startOpen) {
      setIsChatOpen(true);
    }
  }, [startOpen]);
  const [chatMessage, setChatMessage] = useState('');
  const [isChatLoading] = useState(false);
  const [chatTab, setChatTab] = useState<ChatTab>('my-case');
  const [chatHistory, setChatHistory] = useState<ChatHistoryMessage[]>([{ role: 'bot', text: '' }]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatLoading]);

  const getPredictionTextInline = () => {
    if (!predictionLabel) return '';
    const normalized = predictionLabel.toLowerCase();
    const degree =
      normalized.includes('1') || normalized.includes('first')
        ? '1st'
        : normalized.includes('2') || normalized.includes('second')
          ? '2nd'
          : normalized.includes('3') || normalized.includes('third')
            ? '3rd'
            : null;
    if (!degree) return '';
    const arabicDegree = degree === '1st' ? 'حرق درجة أولى' : degree === '2nd' ? 'حرق درجة ثانية' : 'حرق درجة ثالثة';
    return isRtl ? `آخر نتيجة متاحة: ${arabicDegree}` : `Latest available result: ${degree}`;
  };

  const getTabWelcome = (tab: ChatTab) => {
    if (tab === 'my-case') {
      const predicted = getPredictionTextInline();
      return isRtl
        ? `مساعدة في حالتي\n\nأقدر أشرح لك تعليمات الحرق حسب الدرجة.\n${predicted}\nاختاري درجة الحرق من الأزرار أو اكتبيها.`
        : `Help with my case\n\nI can explain burn care instructions by degree.\n${predicted}\nChoose a burn degree from buttons or type it.`;
    }
    if (tab === 'unknown-degree') {
      return isRtl
        ? 'مش عارفة الدرجة\n\nأقدر أساعدك بطريقتين:\n1) ارفعي صورة من صفحة تقييم الحرق\n2) أو نحدد درجة مبدئية من الأعراض بدون صورة.'
        : "I don't know the degree\n\nI can help in two ways:\n1) Upload from Assessment page\n2) Or estimate likely degree from symptoms without image.";
    }
    return isRtl
      ? 'معلومات حول الخدمات\n\nأقدر أوضح لك كل خدمات الموقع وكيف تستخدمي كل صفحة بسرعة.'
      : 'Website services info\n\nI can explain every website service and how to use each page quickly.';
  };

  useEffect(() => {
    setChatHistory([{ role: 'bot', text: getTabWelcome(chatTab) }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatTab, lang]);

  const handleSendMessage = () => {
    if (!chatMessage.trim() || isChatLoading) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userMessage }]);
    const normalized = userMessage.toLowerCase();

    const detectDegree = (): 'first' | 'second' | 'third' | null => {
      if (normalized.includes('1') || normalized.includes('first') || normalized.includes('اول') || normalized.includes('أولى') || normalized.includes('اولى')) return 'first';
      if (normalized.includes('2') || normalized.includes('second') || normalized.includes('ثان') || normalized.includes('درجة ثانية')) return 'second';
      if (normalized.includes('3') || normalized.includes('third') || normalized.includes('ثالث') || normalized.includes('درجة ثالثة')) return 'third';
      return null;
    };

    const degreeGuidance = (deg: 'first' | 'second' | 'third') => {
      if (deg === 'first') {
        return isRtl
          ? 'تعليمات الدرجة الأولى:\n- تبريد بمياه جارية 20 دقيقة.\n- إزالة أي شيء ضاغط مثل الخواتم.\n- ضمادة غير لاصقة ومتابعة الحالة.\nلو الألم يزيد أو المساحة كبيرة، راجعي طبيب.'
          : '1st-degree instructions:\n- Cool under running water for 20 minutes.\n- Remove tight items like rings.\n- Use non-stick dressing and monitor.\nIf pain worsens or area is large, seek medical care.';
      }
      if (deg === 'second') {
        return isRtl
          ? 'تعليمات الدرجة الثانية:\n- تبريد فوري لمدة 20 دقيقة.\n- لا تفقعي الفقاعات.\n- ضمادة معقمة غير لاصقة.\nطوارئ إذا المساحة كبيرة أو المكان حساس.'
          : '2nd-degree instructions:\n- Cool immediately for 20 minutes.\n- Do not pop blisters.\n- Apply sterile non-stick dressing.\nGo emergency if large area or sensitive location.';
      }
      return isRtl
        ? 'تعليمات الدرجة الثالثة (طارئة):\n- اتصلي بالطوارئ فورًا.\n- غطي المكان بقماش نظيف جاف.\n- لا تضعي ماء/ثلج/كريمات.\n- لا تنزعي الملابس الملتصقة.'
        : '3rd-degree instructions (emergency):\n- Call emergency now.\n- Cover with clean dry cloth.\n- Do not apply water/ice/creams.\n- Do not remove stuck clothing.';
    };

    if (chatTab === 'my-case') {
      const fromText = detectDegree();
      const fromPrediction =
        predictionLabel
          ? (() => {
              const pl = predictionLabel.toLowerCase();
              if (pl.includes('1') || pl.includes('first')) return 'first';
              if (pl.includes('2') || pl.includes('second')) return 'second';
              if (pl.includes('3') || pl.includes('third')) return 'third';
              return null;
            })()
          : null;
      const degree = fromText || fromPrediction;
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'bot',
          text: degree
            ? degreeGuidance(degree)
            : isRtl
              ? 'اختاري درجة الحرق (أولى/ثانية/ثالثة) من الأزرار أو اكتبيها.'
              : 'Choose burn degree (1st/2nd/3rd) from buttons or type it.',
        },
      ]);
      return;
    }

    if (chatTab === 'unknown-degree') {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'bot',
          text: isRtl
            ? 'لو مش عارفة الدرجة:\n1) ارفعي صورة من صفحة تقييم الحرق.\n2) بدون صورة: احمرار فقط غالبا أولى.\n3) فقاعات مع ألم واضح غالبا ثانية.\n4) جلد أبيض أو أسود أو تنميل غالبا ثالثة، وهي حالة طوارئ.'
            : "If you don't know the degree:\n1) Upload image from Assessment page.\n2) Redness only is likely 1st degree.\n3) Blisters + clear pain likely 2nd degree.\n4) White/black skin or numbness likely 3rd degree (emergency).",
        },
      ]);
      return;
    }

    setChatHistory((prev) => [
      ...prev,
      {
        role: 'bot',
        text: isRtl
          ? 'الخدمات المتاحة:\n- تقييم الحرق: تقييم الحرق بالذكاء الاصطناعي.\n- تعليمات العناية: تعليمات وبروتوكولات الإسعاف الأولي.\n- الفيديوهات: فيديوهات تعليمية.\n- الطوارئ: اتصال طوارئ سريع.\n- حول الموقع + الحساب + الإشعارات + تغيير اللغة.'
          : 'Available services:\n- Assessment: AI burn assessment.\n- Care Instructions: care protocols and first aid.\n- Video: educational videos.\n- Emergency: quick emergency call.\n- About + account + notifications + language switch.',
      },
    ]);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 left-8 z-50 p-4 bg-primary text-white rounded-full shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center group"
      >
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <MessageSquare className="w-6 h-6" />
        </motion.div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-bold uppercase tracking-widest text-xs">
          {t.chatbot.title}
        </span>
      </motion.button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 left-8 z-50 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-surface-container-high overflow-hidden flex flex-col"
          >
            <div className="bg-primary p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                <span className="font-black uppercase tracking-tight">{t.chatbot.title}</span>
              </div>
              <button
                onClick={() => {
                  setIsChatOpen(false);
                  onClose?.();
                }}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-4 pt-3 pb-2 bg-white border-b border-surface-container-high flex gap-2">
              <button
                onClick={() => setChatTab('my-case')}
                className={`text-xs px-3 py-1.5 rounded-full font-bold ${chatTab === 'my-case' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}
              >
                {isRtl ? 'مساعدة حالتي' : 'My Case'}
              </button>
              <button
                onClick={() => setChatTab('unknown-degree')}
                className={`text-xs px-3 py-1.5 rounded-full font-bold ${chatTab === 'unknown-degree' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}
              >
                {isRtl ? 'مش عارفة الدرجة' : "I don't know degree"}
              </button>
              <button
                onClick={() => setChatTab('services')}
                className={`text-xs px-3 py-1.5 rounded-full font-bold ${chatTab === 'services' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}
              >
                {isRtl ? 'خدمات الموقع' : 'Services'}
              </button>
            </div>
            <div className="flex-1 p-6 max-h-[400px] overflow-y-auto scroll-smooth space-y-4 bg-surface-container-low custom-scrollbar">
              {chatTab === 'my-case' && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setChatHistory((prev) => [
                        ...prev,
                        { role: 'user', text: isRtl ? 'درجة أولى' : '1st degree' },
                        {
                          role: 'bot',
                          text: isRtl
                            ? 'تعليمات الدرجة الأولى:\n- تبريد 20 دقيقة.\n- إزالة الأشياء الضاغطة.\n- ضمادة غير لاصقة ومراقبة التحسن.'
                            : '1st-degree instructions:\n- Cool 20 minutes.\n- Remove tight items.\n- Non-stick dressing and monitor.',
                        },
                      ])
                    }
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-surface-container-high hover:bg-surface-container-low"
                  >
                    {isRtl ? 'درجة أولى' : '1st degree'}
                  </button>
                  <button
                    onClick={() =>
                      setChatHistory((prev) => [
                        ...prev,
                        { role: 'user', text: isRtl ? 'درجة ثانية' : '2nd degree' },
                        {
                          role: 'bot',
                          text: isRtl
                            ? 'تعليمات الدرجة الثانية:\n- تبريد فوري 20 دقيقة.\n- لا تفقعي الفقاعات.\n- ضمادة معقمة غير لاصقة.\n- طوارئ إذا الحالة كبيرة أو شديدة.'
                            : '2nd-degree instructions:\n- Cool immediately for 20 min.\n- Do not pop blisters.\n- Sterile non-stick dressing.\n- Emergency if severe or large area.',
                        },
                      ])
                    }
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-surface-container-high hover:bg-surface-container-low"
                  >
                    {isRtl ? 'درجة ثانية' : '2nd degree'}
                  </button>
                  <button
                    onClick={() =>
                      setChatHistory((prev) => [
                        ...prev,
                        { role: 'user', text: isRtl ? 'درجة ثالثة' : '3rd degree' },
                        {
                          role: 'bot',
                          text: isRtl
                            ? 'تعليمات الدرجة الثالثة (طارئة):\n- اتصلي بالطوارئ فورًا.\n- غطي المكان بقماش جاف نظيف.\n- لا تضعي ماء/ثلج/كريمات.'
                            : '3rd-degree instructions (Emergency):\n- Call emergency now.\n- Cover with clean dry cloth.\n- Do not apply water/ice/creams.',
                        },
                      ])
                    }
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-surface-container-high hover:bg-surface-container-low"
                  >
                    {isRtl ? 'درجة ثالثة' : '3rd degree'}
                  </button>
                </div>
              )}
              {chatTab === 'unknown-degree' && (
                <button
                  onClick={() => {
                    onNavigateToAssessment();
                    setIsChatOpen(false);
                  }}
                  className="text-xs px-3 py-2 rounded-full bg-primary text-white font-bold"
                >
                  {isRtl ? 'اذهب لرفع صورة الآن' : 'Go upload image now'}
                </button>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white text-on-surface border border-surface-container-high rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-on-surface border border-surface-container-high p-4 rounded-2xl rounded-tl-none text-sm font-medium flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                    <span>{isRtl ? 'جاري التفكير...' : 'Thinking...'}</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-surface-container-high flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.chatbot.placeholder}
                className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                disabled={isChatLoading}
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isChatLoading}
                className={`p-2 rounded-xl transition-colors ${
                  isChatLoading ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {isChatLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
