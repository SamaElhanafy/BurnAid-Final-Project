import { Camera, Brain, Stethoscope, MapPin } from 'lucide-react';

/**
 * Bilingual UI copy for BURN-AID (English and Arabic).
 * The "how it works" step list stores Lucide icon components for the timeline UI.
 */
export const translations = {
  en: {
    assessment: "Assessment",
    guide: "Home",
    emergency: "Emergency",
    documentation: "Instructions",
    video: "Video",
    about: "About",
    account: "Account",
    notifications: "Notifications",
    emergencyCall: "EMERGENCY CALL",
    medicalIntelligence: "Medical-First-Aid Intelligence",
    heroTitle: "Instant Burn",
    heroTitleHighlight: "Assessment.",
    heroDesc: "Harnessing clinical-grade AI to provide immediate triage guidance and recovery steps. Accurate, empathetic, and available 24/7 when seconds matter.",
    uploadBtn: "Upload Burn Image",
    howItWorks: "See How it Works",
    heroImageAlt: "Clinical smartphone interface",
    disclaimerLabel: "Medical Disclaimer:",
    disclaimerText: "This system is a first-aid support prototype. It does not replace professional medical diagnosis or emergency care.",
    evidenceTitle: "Evidence-Based Algorithm",
    evidenceDesc: "Validated by clinical experts",
    stats: [
      { label: 'AI-Assisted Triage', value: 'Prototype' },
      { label: 'Analysis Time', value: '< 15s' },
      { label: 'Lives Impacted', value: '50k+' },
      { label: 'Global Support', value: '24/7' }
    ],
    precisionTitle: "Surgical Precision in",
    precisionHighlight: "AI Analysis",
    steps: [
      {
        title: '1. Secure Upload',
        desc: 'Simply take a clear photo of the affected area. Your data is encrypted and HIPAA-compliant from the moment you hit capture.',
      },
      {
        title: '2. Deep Analysis',
        desc: 'Our neural networks scan for depth, surface area, and risk factors including infection markers and metabolic response.',
      },
      {
        title: '3. Expert Guidance',
        desc: 'Receive a clinical classification (1st, 2nd, or 3rd degree) and immediate, actionable first-aid steps customized for you.',
      }
    ],
    educationTitle: "Expert Education for",
    educationHighlight: "Healing.",
    educationDesc: "Access our library of medical-grade guidance designed to prevent complications and accelerate recovery.",
    exploreBtn: "Explore All",
    essentialGuide: "Essential Guide",
    featuredTitle: "First-Aid Basics for Every Burn",
    featuredDesc: "The first 15 minutes are critical. Learn the proven techniques to minimize tissue damage.",
    sideStack: [
      {
        title: "Understanding Burn Degrees",
        desc: "Visual guides to help you identify the severity of common injuries."
      },
      {
        title: "Emergency Red Flags",
        desc: "Immediate signs that require professional hospital intervention."
      }
    ],
    urgencyTitle: "Active Emergency?",
    urgencyDesc: "Our 24/7 hotline connects you instantly with specialized burn trauma nurses.",
    dialBtn: "DIAL 123-BURN-HELP",
    accountView: {
      title: "Your Account",
      subtitle: "Manage your profile and medical history",
      profile: {
        title: "Profile Information",
        verified: "Verified Medical Profile",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        bloodType: "Blood Type",
        allergies: "Allergies",
        medications: "Current Medications",
        none: "None",
        noneReported: "None Reported"
      },
      history: {
        title: "Assessment History",
        empty: "No previous assessments found.",
        viewDetails: "View Details"
      },
      settings: {
        title: "Account Settings",
        notifications: "Push Notifications",
        darkMode: "Dark Mode",
        language: "Language",
        logout: "Logout"
      },
      hipaa: {
        title: "Privacy-Aware Design",
        desc: "Your medical data is encrypted and stored according to international healthcare standards."
      }
    },
    notificationsView: {
      title: "Notifications",
      items: [
        { title: "Welcome to Burnaid", time: "2 hours ago", desc: "Your medical profile is now verified. Explore our clinical protocols." },
        { title: "New Video Available", time: "5 hours ago", desc: "Dr. Elena Vance uploaded a new module on 'Advanced Infection Prevention'." },
        { title: "Emergency Update", time: "1 day ago", desc: "Local emergency response times have been updated for your region." },
      ]
    },
    footerLinks: ["Terms of Service", "Privacy Policy", "Medical Disclaimer", "Contact Support"],
    footerCopyright: "© 2026 Burnaid. This application is for informational purposes only and is not intended to replace clinical judgment or professional medical advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.",
    mobileNav: ["Assess", "Library", "SOS", "Docs", "About", "Account"],
    chatbot: {
      title: "Burnaid Assistant",
      placeholder: "Ask about burn care...",
      welcome: `👋 Welcome to BURN AID | أهلاً بك في BURN AID

I can help assess burns, explain first aid, and guide you through the website.
يمكنني مساعدتك في تقييم الحروق، شرح الإسعافات الأولية، ومساعدتك في استخدام الموقع بسهولة.

📌 You can:
• Describe the burn
• Ask for first-aid steps
• Get help navigating the Burnaid website (Emergency, Guide, or Documentation)

📌 يمكنك:
• وصف الحرق
• معرفة خطوات الإسعاف الأولي
• المساعدة في التنقل داخل موقع Burnaid (الطوارئ، الدليل، التوثيق)`,
    },
    documentationView: {
      title: "DOCUMENTATION",
      desc: "Evidence-based clinical protocols for burn management. Prepared by medical professionals for immediate and long-term recovery care.",
      searchPlaceholder: "Search clinical protocols...",
      urgency: {
        title: "Immediate Response Protocol",
        desc: "If the burn is larger than the person's palm, involves the face, hands, feet, or genitals, or appears charred/white, seek emergency care immediately.",
        btn: "View Critical Criteria"
      },
      sections: [
        {
          id: "01",
          title: "Immediate Response",
          steps: [
            {
              num: "1",
              title: "Stop the Burning Process",
              desc: "Remove the heat source. For flame burns, use \"Stop, Drop, and Roll.\" Ensure the rescuer is safe from electrical or chemical hazards."
            },
            {
              num: "2",
              title: "Cool the Burn",
              desc: "Run cool (not cold) tap water over the burn for at least 20 minutes. Do NOT use ice, butter, or ointments as they can damage tissue and trap heat."
            },
            {
              num: "3",
              title: "Remove Constrictive Items",
              desc: "Carefully remove jewelry, watches, or restrictive clothing before swelling begins. Do not remove clothing that is stuck to the burn."
            }
          ]
        },
        {
          id: "02",
          title: "Wound Dressing",
          items: [
            {
              title: "Protection Layer",
              desc: "Cover the burn with a clean, non-stick sterile bandage or plastic wrap (cling film) applied loosely. This prevents air contact and reduces pain."
            },
            {
              title: "Avoid Friction",
              desc: "Do not break blisters. Blisters act as a natural sterile barrier against infection. If a blister breaks, gently clean and re-dress."
            }
          ]
        },
        {
          id: "03",
          title: "Infection Prevention",
          desc: "Infection is the leading complication in burn recovery. Monitor these indicators daily:",
          indicators: [
            {
              title: "Systemic Fever",
              desc: "Temperature above 100.4°F (38°C) may indicate sepsis risk."
            },
            {
              title: "Localized Changes",
              desc: "Increased redness, swelling, or foul-smelling discharge from the site."
            }
          ]
        },
        {
          id: "04",
          title: "Pain Management",
          desc: "Managing pain is critical for psychological well-being and mobility. Utilize a tiered approach based on severity.",
          methods: [
            {
              title: "Over-the-Counter",
              desc: "Acetaminophen or Ibuprofen as directed by local dosage guidelines."
            },
            {
              title: "Elevation",
              desc: "Keep burned limbs elevated above heart level to reduce painful swelling."
            }
          ],
          footer: "Always consult a clinical pharmacist for pediatric dosage."
        }
      ],
      cta: {
        title: "Require Professional Assessment?",
        btns: ["Find Burn Center"]
      },
      precision: {
        title: "Clinical Precision",
        desc: "Sterile environments save lives."
      }
    },
    assessmentView: {
      title: "Burn Assessment",
      subtitle: "AI-Powered Triage",
      uploadTitle: "Upload Burn Image",
      uploadDesc: "Drag and drop or click to select a photo",
      selectBtn: "Select Image",
      analyzing: "Analyzing Image...",
      analysisSteps: [
        "Scanning surface area...",
        "Detecting depth markers...",
        "Evaluating tissue response...",
        "Generating clinical guidance..."
      ],
      resultTitle: "Assessment Result",
      burnType: "Second-Degree Burn",
      burnDesc: "Partial thickness burn affecting the epidermis and dermis. Characterized by redness, blistering, and significant pain.",
      emergencyLevel: {
        homeCare: "Home Care",
        seeDoctor: "See Doctor",
        emergencyNow: "Emergency Now",
      },
      careBtn: "Care Instructions",
      reuploadBtn: "Analyze Another",
      emergencyBtn: "Emergency Help",
      tipsTitle: "Photography Tips",
      tips: [
        { title: "Natural Light", desc: "Avoid harsh shadows or flash for better color accuracy." },
        { title: "Clear Focus", desc: "Keep the camera 10-15cm away and ensure sharp focus." }
      ],
      confidenceTitle: "Clinical Confidence",
      confidenceStats: [
        { label: "AI-Assisted", value: "Prototype" },
        { label: "First-Aid Guidance", value: "Available" },
        { label: "Not Medical Diagnosis", value: "Educational" }
      ],
      progressValue: "64%"
    },
    emergencyView: {
      title: "URGENT: CRITICAL CARE NEEDED",
      subtitle: "A severe burn requires immediate professional medical intervention. Follow these steps while waiting for help.",
      callBtn: "CALL EMERGENCY SERVICES",
      callSub: "Tap to dial local emergency numbers (e.g., 123)",
      dosTitle: "WHAT TO DO",
      dos: [
        { title: "Stop the burning process", desc: "Remove the person from the source of heat immediately." },
        { title: "Cool with water", desc: "Run cool (not cold) tap water over the burn for 10-20 minutes." },
        { title: "Remove jewelry/clothing", desc: "Gently remove items before the area begins to swell." },
        { title: "Cover loosely", desc: "Use a clean, dry, non-stick bandage or plastic wrap." }
      ],
      dontsTitle: "DO NOT",
      donts: [
        { title: "Do not use ice", desc: "This can cause further damage to the tissue." },
        { title: "Do not apply ointments", desc: "No butter, toothpaste, or creams on a fresh critical burn." },
        { title: "Do not pop blisters", desc: "This increases the risk of serious infection." },
        { title: "Do not remove stuck clothing", desc: "If fabric is melted to the skin, leave it for professionals." }
      ],
      facilityTitle: "Nearest Specialized Care",
      facilityDesc: "Specialized burn centers provide 50% better outcomes for critical injuries.",
      facilityName: "Regional Burn Center",
      facilityDist: "1.2 miles away • Level 1 Trauma",
      directionsBtn: "Directions",
      notesTitle: "Responder Notes",
      notesDesc: "Fill this while waiting. Hand your phone to the paramedic upon arrival.",
      timeLabel: "Time of Injury",
      causeLabel: "Cause of Burn",
      causeOptions: ["Thermal (Fire/Heat)", "Chemical", "Electrical", "Scald (Steam/Liquid)"],
      notesLabel: "Notes (Allergies/Medications)",
      notesPlaceholder: "e.g. Penicillin allergy, heart medication..."
    },
    videoView: {
      title: "Video Resources",
      desc: "Expert-led clinical demonstrations for immediate burn care and long-term recovery. Follow our step-by-step visual guides designed for healthcare professionals and first responders.",
      featured: {
        badge: "Currently Playing",
        title: "Burn Triage: Immediate Assessment Protocols",
        commentaryTitle: "Clinical Commentary",
        commentaryAuthor: "Narrated by Dr. Elena Vance, Senior Burn Specialist",
        description: "This module covers the critical first 5 minutes of burn assessment. Learn how to distinguish between superficial, partial-thickness, and full-thickness burns while maintaining patient stability and managing pain levels effectively.",
        meta: ["12:45", "Intermediate", "Clinical Authority"]
      },
      playlist: {
        title: "Training Playlist",
        count: "4 Videos",
        items: [
          { title: "1. Burn Triage Protocols", sub: "12:45 • Playing Now" },
          { title: "2. Cooling Techniques & First Steps", sub: "08:20 • Up Next" },
          { title: "3. Stages of Recovery Visualization", sub: "15:10 • Recovery Guide" },
          { title: "4. Infection Prevention Standards", sub: "10:55 • Advanced Care" }
        ],
        progress: "Learning Progress",
        progressSub: "1 of 4 modules completed (25%)"
      },
    },
    aboutView: {
      title: "About Burnaid",
      subtitle: "The Future of Burn Care Triage",
      mission: {
        title: "Our Mission",
        desc: "To democratize clinical-grade burn assessment through AI, ensuring that every second counts when it matters most. We bridge the gap between injury and expert care."
      },
      valuesTitle: "Our Core Values",
      values: [
        { title: "Clinical Accuracy", desc: "Our models are trained on thousands of verified clinical cases to provide reliable triage guidance." },
        { title: "Immediate Access", desc: "Available 24/7 globally, providing instant support when professional help may be minutes or hours away." },
        { title: "Data Privacy", desc: "Your medical data is encrypted and handled with the highest standards of HIPAA compliance." }
      ],
      team: {
        title: "The Team",
        desc: "A multidisciplinary group of burn specialists, AI researchers, and emergency responders dedicated to saving lives through technology.",
        expert: "Clinical Expert",
        memberAlt: "Team Member"
      },
      stats: [
        { label: "Founded", value: "2026" }
      ]
    },
    howItWorksView: {
      title: "How Burnaid Works",
      subtitle: "Advanced AI Triage & Care",
      steps: [
        {
          title: "1. Capture & Upload",
          desc: "Take a clear photo of the burn injury. Our secure, HIPAA-compliant system ensures your data is protected from the start.",
          icon: Camera
        },
        {
          title: "2. AI Analysis",
          desc: "Our clinical-grade neural networks analyze the burn depth, surface area, and severity in under 15 seconds.",
          icon: Brain
        },
        {
          title: "3. Triage Result",
          desc: "Receive an immediate classification (1st, 2nd, or 3rd degree) and critical first-aid instructions.",
          icon: Stethoscope
        },
        {
          title: "4. Professional Care",
          desc: "If needed, we connect you with emergency services or the nearest specialized burn center.",
          icon: MapPin
        }
      ],
      videoTitle: "Watch the Process",
      videoDesc: "See a live demonstration of our AI triage system in action.",
      backBtn: "Back to Home"
    },

    adminPortal: {
      title: "Admin Portal",
      subtitle: "System Overview & Management",
      stats: {
        totalUsers: "Total Users",
        totalAssessments: "Total Assessments",
        avgResponseTime: "Avg. Response Time",
        systemHealth: "System Health"
      },
      recentAssessments: "Recent Assessments",
      userManagement: "User Management",
      systemLogs: "System Logs",
      backToAccount: "Back to Account",
      viewAll: "View All",
      quickActions: "Quick Actions",
      actions: {
        export: "Export Data",
        broadcast: "Broadcast",
        settings: "Settings",
        database: "Database"
      }
    }
  },
  ar: {
    assessment: "تقييم",
    guide: "الرئيسية",
    emergency: "طوارئ",
    documentation: "تعليمات العناية",
    video: "فيديو",
    about: "حول",
    account: "الحساب",
    notifications: "الإشعارات",
    emergencyCall: "اتصال طوارئ",
    medicalIntelligence: "ذكاء الإسعافات الأولية الطبي",
    heroTitle: "تقييم فوري",
    heroTitleHighlight: "للحروق.",
    heroDesc: "استخدام الذكاء الاصطناعي السريري لتوفير إرشادات الفرز الفوري وخطوات التعافي. دقيق، متعاطف، ومتاح على مدار الساعة طوال أيام الأسبوع عندما تكون الثواني مهمة.",
    uploadBtn: "رفع صورة الحرق",
    howItWorks: "كيف يعمل",
    heroImageAlt: "واجهة هاتف ذكي سريرية",
    disclaimerLabel: "إخلاء مسؤولية طبي:",
    disclaimerText: "هذا النظام نموذج أولي لدعم الإسعافات الأولية. ولا يحل محل التشخيص الطبي المهني أو الرعاية الطارئة.",
    evidenceTitle: "خوارزمية قائمة على الأدلة",
    evidenceDesc: "تم التحقق منها من قبل خبراء سريريين",
    stats: [
      { label: 'فرز مدعوم بالذكاء الاصطناعي', value: 'نموذج أولي' },
      { label: 'وقت التحليل', value: '< 15 ثانية' },
      { label: 'الأرواح المتأثرة', value: '50 ألف+' },
      { label: 'دعم عالمي', value: '24/7' }
    ],
    precisionTitle: "دقة جراحية في",
    precisionHighlight: "تحليل الذكاء الاصطناعي",
    steps: [
      {
        title: '1. رفع آمن',
        desc: 'ما عليك سوى التقاط صورة واضحة للمنطقة المصابة. بياناتك مشفرة ومتوافقة مع HIPAA من اللحظة التي تضغط فيها على التقاط.',
      },
      {
        title: '2. تحليل عميق',
        desc: 'تقوم شبكاتنا العصبية بفحص العمق ومساحة السطح وعوامل الخطر بما في ذلك علامات العدوى والاستجابة الأيضية.',
      },
      {
        title: '3. توجيه الخبراء',
        desc: 'احصل على تصنيف سريري (درجة أولى أو ثانية أو ثالثة) وخطوات إسعافات أولية فورية وقابلة للتنفيذ مخصصة لك.',
      }
    ],
    educationTitle: "تعليم الخبراء",
    educationHighlight: "للشفاء.",
    educationDesc: "قم بالوصول إلى مكتبتنا من الإرشادات الطبية المصممة لمنع المضاعفات وتسريع التعافي.",
    exploreBtn: "استكشاف الكل",
    essentialGuide: "دليل أساسي",
    featuredTitle: "أساسيات الإسعافات الأولية لكل حرق",
    featuredDesc: "الدقائق الـ 15 الأولى حاسمة. تعلم التقنيات المثبتة لتقليل تلف الأنسجة.",
    sideStack: [
      {
        title: "فهم درجات الحروق",
        desc: "أدلة بصرية لمساعدتك في تحديد شدة الإصابات الشائعة."
      },
      {
        title: "علامات الطوارئ الحمراء",
        desc: "علامات فورية تتطلب تدخلاً طبياً مهنياً في المستشفى."
      }
    ],
    urgencyTitle: "حالة طوارئ نشطة؟",
    urgencyDesc: "يوصلك خطنا الساخن الذي يعمل على مدار الساعة طوال أيام الأسبوع فوراً بممرضات متخصصات في إصابات الحروق.",
    dialBtn: "اتصل 123-BURN-HELP",
    footerLinks: ["شروط الخدمة", "سياسة الخصوصية", "إخلاء مسؤولية طبي", "الاتصال بالدعم"],
    footerCopyright: "© 2026 Burnaid. هذا التطبيق للأغراض المعلوماتية فقط وليس المقصود منه أن يحل محل الحكم السريري أو المشورة الطبية المهنية. اطلب دائماً مشورة طبيبك أو غيره من مقدمي الخدمات الصحية المؤهلين بشأن أي أسئلة قد تكون لديك بخصوص حالة طبية.",
    mobileNav: ["تقييم", "فيديو", "طوارئ", "توثيق", "حول", "الحساب"],
    accountView: {
      title: "حسابك",
      subtitle: "إدارة ملفك الشخصي وتاريخك الطبي",
      profile: {
        title: "معلومات الملف الشخصي",
        verified: "ملف طبي موثق",
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        bloodType: "فصيلة الدم",
        allergies: "الحساسية",
        medications: "الأدوية الحالية",
        none: "لا يوجد",
        noneReported: "لم يتم الإبلاغ عن أي منها"
      },
      history: {
        title: "سجل التقييمات",
        empty: "لم يتم العثور على تقييمات سابقة.",
        viewDetails: "عرض التفاصيل"
      },
      settings: {
        title: "إعدادات الحساب",
        notifications: "إشعارات الدفع",
        darkMode: "الوضع الداكن",
        language: "اللغة",
        logout: "تسجيل الخروج"
      },
      hipaa: {
        title: "متوافق مع HIPAA",
        desc: "بياناتك الطبية مشفرة ومخزنة وفقاً لمعايير الرعاية الصحية الدولية."
      }
    },
    notificationsView: {
      title: "الإشعارات",
      items: [
        { title: "مرحباً بك في Burnaid", time: "منذ ساعتين", desc: "تم التحقق من ملفك الطبي الآن. استكشف بروتوكولاتنا السريرية." },
        { title: "فيديو جديد متاح", time: "منذ ٥ ساعات", desc: "قامت الدكتورة إيلينا فانس بتحميل وحدة جديدة حول 'الوقاية المتقدمة من العدوى'." },
        { title: "تحديث الطوارئ", time: "منذ يوم واحد", desc: "تم تحديث أوقات استجابة الطوارئ المحلية لمنطقتك." },
      ]
    },
    documentationView: {
      title: "التوثيق",
      desc: "بروتوكولات سريرية قائمة على الأدلة لإدارة الحروق. أعدها متخصصون طبيون للرعاية الفورية والتعافي على المدى الطويل.",
      searchPlaceholder: "البحث في البروتوكولات السريرية...",
      urgency: {
        title: "بروتوكول الاستجابة الفورية",
        desc: "إذا كان الحرق أكبر من راحة يد الشخص، أو يشمل الوجه أو اليدين أو القدمين أو الأعضاء التناسلية، أو ظهر متفحماً/أبيض، فاطلب الرعاية الطارئة فوراً.",
        btn: "عرض المعايير الحرجة"
      },
      sections: [
        {
          id: "٠١",
          title: "الاستجابة الفورية",
          steps: [
            {
              num: "١",
              title: "إيقاف عملية الاحتراق",
              desc: "قم بإزالة مصدر الحرارة. لحروق اللهب، استخدم \"توقف، انبطح، وتدحرج\". تأكد من أن المنقذ في مأمن من المخاطر الكهربائية أو الكيميائية."
            },
            {
              num: "٢",
              title: "تبريد الحرق",
              desc: "قم بتشغيل ماء الصنبور البارد (وليس المثلج) فوق الحرق لمدة ٢٠ دقيقة على الأقل. لا تستخدم الثلج أو الزبدة أو المراهم لأنها يمكن أن تتلف الأنسجة وتحبس الحرارة."
            },
            {
              num: "٣",
              title: "إزالة الأشياء المقيدة",
              desc: "قم بإزالة المجوهرات أو الساعات أو الملابس الضيقة بعناية قبل بدء التورم. لا تقم بإزالة الملابس الملتصقة بالحرق."
            }
          ]
        },
        {
          id: "٠٢",
          title: "تضميد الجرح",
          items: [
            {
              title: "طبقة الحماية",
              desc: "قم بتغطية الحرق بضمادة معقمة نظيفة وغير لاصقة أو غلاف بلاستيكي (فيلم تغليف) يوضع بشكل فضفاض. هذا يمنع ملامسة الهواء ويقلل الألم."
            },
            {
              title: "تجنب الاحتكاك",
              desc: "لا تكسر البثور. تعمل البثور كحاجز معقم طبيعي ضد العدوى. إذا انكسرت البثرة، قم بتنظيفها وتضميدها بلطف."
            }
          ]
        },
        {
          id: "٠٣",
          title: "منع العدوى",
          desc: "العدوى هي المضاعفات الرئيسية في التعافي من الحروق. راقب هذه المؤشرات يومياً:",
          indicators: [
            {
              title: "الحمى الجهازية",
              desc: "درجة حرارة أعلى من ١٠٠.٤ درجة فهرنهايت (٣٨ درجة مئوية) قد تشير إلى خطر الإنتان."
            },
            {
              title: "التغيرات الموضعية",
              desc: "زيادة الاحمرار أو التورم أو الإفرازات ذات الرائحة الكريهة من الموقع."
            }
          ]
        },
        {
          id: "٠٤",
          title: "إدارة الألم",
          desc: "إدارة الألم أمر بالغ الأهمية للرفاهية النفسية والحركة. استخدم نهجاً متدرجاً بناءً على الشدة.",
          methods: [
            {
              title: "بدون وصفة طبية",
              desc: "الباراسيتامول أو الإيبوبروفين حسب توجيهات إرشادات الجرعة المحلية."
            },
            {
              title: "الرفع",
              desc: "أبقِ الأطراف المحترقة مرفوعة فوق مستوى القلب لتقليل التورم المؤلم."
            }
          ],
          footer: "استشر دائماً صيدلانياً سريرياً لجرعات الأطفال."
        }
      ],
      cta: {
        title: "هل تحتاج إلى تقييم مهني؟",
        btns: ["البحث عن مركز حروق", "بروتوكول PDF"]
      },
      precision: {
        title: "دقة سريرية",
        desc: "البيئات المعقمة تنقذ الأرواح."
      }
    },
    assessmentView: {
      title: "تقييم الحروق",
      subtitle: "فرز مدعوم بالذكاء الاصطناعي",
      uploadTitle: "رفع صورة الحرق",
      uploadDesc: "اسحب وأفلت أو انقر لاختيار صورة",
      selectBtn: "اختر صورة",
      analyzing: "جاري تحليل الصورة...",
      analysisSteps: [
        "مسح مساحة السطح...",
        "الكشف عن علامات العمق...",
        "تقييم استجابة الأنسجة...",
        "توليد التوجيه السريري..."
      ],
      resultTitle: "نتيجة التقييم",
      burnType: "حرق من الدرجة الثانية",
      burnDesc: "حرق جزئي السماكة يؤثر على البشرة والأدمة. يتميز بالاحمرار والبثور والألم الشديد.",
      emergencyLevel: {
        homeCare: "رعاية منزلية",
        seeDoctor: "راجع الطبيب",
        emergencyNow: "طوارئ الآن",
      },
      careBtn: "تعليمات العناية",
      reuploadBtn: "تحليل صورة أخرى",
      emergencyBtn: "مساعدة طوارئ",
      tipsTitle: "نصائح التصوير",
      tips: [
        { title: "ضوء طبيعي", desc: "تجنب الظلال القوية أو الفلاش لدقة ألوان أفضل." },
        { title: "تركيز واضح", desc: "أبقِ الكاميرا على بعد 10-15 سم وتأكد من التركيز الحاد." }
      ],
      confidenceTitle: "الثقة السريرية",
      confidenceStats: [
        { label: "مدعوم بالذكاء الاصطناعي", value: "نموذج أولي" },
        { label: "إرشادات الإسعافات الأولية", value: "متاحة" },
        { label: "ليس تشخيصاً طبياً", value: "تعليمي" }
      ],
      progressValue: "٦٤٪"
    },
    emergencyView: {
      title: "عاجل: رعاية حرجة مطلوبة",
      subtitle: "الحرق الشديد يتطلب تدخلاً طبياً مهنياً فورياً. اتبع هذه الخطوات أثناء انتظار المساعدة.",
      callBtn: "اتصل بخدمات الطوارئ",
      callSub: "انقر للاتصال بأرقام الطوارئ المحلية (مثلاً 123)",
      dosTitle: "ماذا تفعل",
      dos: [
        { title: "أوقف عملية الحرق", desc: "أبعد الشخص عن مصدر الحرارة فوراً." },
        { title: "برد بالماء", desc: "مرر ماء الصنبور البارد (ليس المثلج) فوق الحرق لمدة 10-20 دقيقة." },
        { title: "أزل المجوهرات/الملابس", desc: "أزل العناصر بلطف قبل أن تبدأ المنطقة في الانتفاخ." },
        { title: "غطِ بشكل فضفاض", desc: "استخدم ضمادة نظيفة وجافة وغير لاصقة أو غلافاً بلاستيكياً." }
      ],
      dontsTitle: "لا تفعل",
      donts: [
        { title: "لا تستخدم الثلج", desc: "يمكن أن يسبب ذلك مزيداً من الضرر للأنسجة." },
        { title: "لا تضع المراهم", desc: "لا زبدة أو معجون أسنان أو كريمات على حرق حرج حديث." },
        { title: "لا تفتح البثور", desc: "هذا يزيد من خطر الإصابة بعدوى خطيرة." },
        { title: "لا تزل الملابس الملتصقة", desc: "إذا كان القماش ملتصقاً بالجلد، اتركه للمحترفين." }
      ],
      facilityTitle: "أقرب رعاية متخصصة",
      facilityDesc: "توفر مراكز الحروق المتخصصة نتائج أفضل بنسبة 50% للإصابات الحرجة.",
      facilityName: "مركز الحروق الإقليمي",
      facilityDist: "على بعد 1.2 ميل • صدمة من المستوى 1",
      directionsBtn: "الاتجاهات",
      notesTitle: "ملاحظات المسعفين",
      notesDesc: "املأ هذا أثناء الانتظار. سلم هاتفك للمسعف عند وصوله.",
      timeLabel: "وقت الإصابة",
      causeLabel: "سبب الحرق",
      causeOptions: ["حراري (نار/حرارة)", "كيميائي", "كهربائي", "سمط (بخار/سائل)"],
      notesLabel: "ملاحظات (حساسية/أدوية)",
      notesPlaceholder: "مثلاً حساسية البنسلين، أدوية القلب..."
    },
    videoView: {
      title: "موارد الفيديو",
      desc: "عروض سريرية بقيادة خبراء للعناية الفورية بالحروق والتعافي على المدى الطويل. اتبع أدلتنا المرئية خطوة بخطوة المصممة لمتخصصي الرعاية الصحية والمسعفين.",
      featured: {
        badge: "يعرض حالياً",
        title: "فرز الحروق: بروتوكولات التقييم الفوري",
        commentaryTitle: "تعليق سريري",
        commentaryAuthor: "بصوت الدكتورة إيلينا فانس، أخصائية حروق أولى",
        description: "يغطي هذا النموذج الدقائق الخمس الأولى الحرجة من تقييم الحروق. تعلم كيفية التمييز بين الحروق السطحية، والجزئية، والكاملة مع الحفاظ على استقرار المريض وإدارة مستويات الألم بفعالية.",
        meta: ["12:45", "متوسط", "سلطة سريرية"]
      },
      playlist: {
        title: "قائمة تشغيل التدريب",
        count: "4 فيديوهات",
        items: [
          { title: "1. بروتوكولات فرز الحروق", sub: "12:45 • يعرض الآن" },
          { title: "2. تقنيات التبريد والخطوات الأولى", sub: "08:20 • التالي" },
          { title: "3. تصور مراحل التعافي", sub: "15:10 • دليل التعافي" },
          { title: "4. معايير الوقاية من العدوى", sub: "10:55 • رعاية متقدمة" }
        ],
        progress: "تقدم التعلم",
        progressSub: "تم إكمال 1 من 4 نماذج (25%)"
      },
      urgencyTitle: "وعي حرج: الحروق الكيميائية",
      urgencyDesc: "إذا كنت تشك في تعرض كيميائي، فلا تنتظر. بروتوكولات الري الفورية تختلف عن الحروق الحرارية.",
      urgencyBtn: "شاهد البروتوكول الآن"
    },
    aboutView: {
      title: "حول Burnaid",
      subtitle: "مستقبل فرز حالات الحروق",
      mission: {
        title: "مهمتنا",
        desc: "إضفاء الطابع الديمقراطي على تقييم الحروق على المستوى السريري من خلال الذكاء الاصطناعي، مما يضمن أهمية كل ثانية عندما يكون الأمر أكثر أهمية. نحن نسد الفجوة بين الإصابة ورعاية الخبراء."
      },
      valuesTitle: "قيمنا الأساسية",
      values: [
        { title: "الدقة السريرية", desc: "يتم تدريب نماذجنا على آلاف الحالات السريرية الموثقة لتقديم إرشادات فرز موثوقة." },
        { title: "الوصول الفوري", desc: "متاح على مدار الساعة طوال أيام الأسبوع عالمياً، مما يوفر دعماً فورياً عندما يكون المساعدة المهنية على بعد دقائق أو ساعات." },
        { title: "خصوصية البيانات", desc: "بياناتك الطبية مشفرة ويتم التعامل معها بأعلى معايير الامتثال لـ HIPAA." }
      ],
      team: {
        title: "الفريق",
        desc: "مجموعة متعددة التخصصات من أخصائيي الحروق وباحثي الذكاء الاصطناعي والمستجيبين لحالات الطوارئ المكرسين لإنقاذ الأرواح من خلال التكنولوجيا.",
        expert: "خبير سريري",
        memberAlt: "عضو الفريق"
      },
      stats: [
        { label: "تأسست", value: "2026" }
      ]
    },
    howItWorksView: {
      title: "كيف يعمل Burnaid",
      subtitle: "فرز ورعاية متقدمة بالذكاء الاصطناعي",
      steps: [
        {
          title: "١. الالتقاط والرفع",
          desc: "التقط صورة واضحة لإصابة الحرق. يضمن نظامنا الآمن والمتوافق مع HIPAA حماية بياناتك منذ البداية.",
          icon: Camera
        },
        {
          title: "٢. تحليل الذكاء الاصطناعي",
          desc: "تقوم شبكاتنا العصبية ذات المستوى السريري بتحليل عمق الحرق ومساحة السطح وشدته في أقل من ١٥ ثانية.",
          icon: Brain
        },
        {
          title: "٣. نتيجة الفرز",
          desc: "احصل على تصنيف فوري (درجة أولى أو ثانية أو ثالثة) وتعليمات الإسعافات الأولية الضرورية.",
          icon: Stethoscope
        },
        {
          title: "٤. الرعاية المهنية",
          desc: "إذا لزم الأمر، نوصلك بخدمات الطوارئ أو أقرب مركز حروق متخصص.",
          icon: MapPin
        }
      ],
      videoTitle: "شاهد العملية",
      videoDesc: "شاهد عرضاً حياً لنظام فرز الذكاء الاصطناعي الخاص بنا أثناء العمل.",
      backBtn: "العودة للرئيسية"
    },

    adminPortal: {
      title: "بوابة المسؤول",
      subtitle: "نظرة عامة على النظام والإدارة",
      stats: {
        totalUsers: "إجمالي المستخدمين",
        totalAssessments: "إجمالي التقييمات",
        avgResponseTime: "متوسط وقت الاستجابة",
        systemHealth: "صحة النظام"
      },
      recentAssessments: "التقييمات الأخيرة",
      userManagement: "إدارة المستخدمين",
      systemLogs: "سجلات النظام",
      backToAccount: "العودة إلى الحساب",
      viewAll: "عرض الكل",
      quickActions: "إجراءات سريعة",
      actions: {
        export: "تصدير البيانات",
        broadcast: "بث",
        settings: "الإعدادات",
        database: "قاعدة البيانات"
      }
    },
    chatbot: {
      title: "مساعد Burnaid",
      placeholder: "اسأل عن العناية بالحروق...",
      welcome: `👋 Welcome to BURN AID | أهلاً بك في BURN AID

I can help assess burns, explain first aid, and guide you through the website.
يمكنني مساعدتك في تقييم الحروق، شرح الإسعافات الأولية، ومساعدتك في استخدام الموقع بسهولة.

📌 You can:
• Describe the burn
• Ask for first-aid steps
• Get help navigating the Burnaid website (Emergency, Guide, or Documentation)

📌 يمكنك:
• وصف الحرق
• معرفة خطوات الإسعاف الأولي
• المساعدة في التنقل داخل موقع Burnaid (الطوارئ، الدليل، التوثيق)`,
    }
  }
};

export type TranslationDict = typeof translations.en;
export type AppLanguage = keyof typeof translations;
