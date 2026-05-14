import { useBurnAid } from '../../context/BurnAidContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { normalizeBloodType } from '../../constants/auth';

/**
 * Admin-only: manage curated videos & view users/datasets (requires admin JWT).
 */
export function AdminPortalView() {
  const {
    adminDatasets,
    adminError,
    adminLoading,
    adminTab,
    adminUsers,
    authUser,
    deleteAdminUser,
    draftVideoSettings,
    fetchAdminDatasets,
    fetchAdminUsers,
    handleDraftHowItWorksChange,
    handleDraftVideoChange,
    howItWorksSaveMsg,
    isRtl,
    saveHowItWorksVideoSettings,
    saveVideoSettings,
    setAdminTab,
    setView,
    t,
    videoSaveMsg,
  } = useBurnAid();

    // Check if user is authenticated and is an admin
    if (!authUser) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-7xl mx-auto px-6 py-12"
        >
          <div className="bg-white p-10 rounded-[2.5rem] border border-surface-container-high shadow-sm text-center">
            <p className="text-lg font-bold text-error mb-6">{isRtl ? 'يجب تسجيل الدخول أولاً' : 'Please log in first'}</p>
            <button
              onClick={() => setView('login')}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
            >
              {isRtl ? 'تسجيل الدخول' : 'Go to Login'}
            </button>
          </div>
        </motion.div>
      );
    }

    if (authUser.role !== 'admin') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-7xl mx-auto px-6 py-12"
        >
          <div className="bg-white p-10 rounded-[2.5rem] border border-surface-container-high shadow-sm text-center">
            <p className="text-2xl font-black text-error mb-6">{isRtl ? 'صلاحيات مسؤول مطلوبة' : 'Admin Access Required'}</p>
            <p className="text-on-surface-variant mb-8">{isRtl ? 'أنت لا تملك الصلاحيات الكافية للوصول إلى لوحة المسؤول.' : 'You do not have sufficient permissions to access the admin panel.'}</p>
            <button
              onClick={() => setView('account')}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
            >
              {isRtl ? 'العودة إلى الحساب' : 'Back to Account'}
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase font-headline">{t.adminPortal.title}</h1>
            <p className="text-xl text-on-surface-variant font-medium">{t.adminPortal.subtitle}</p>
          </div>
          <button 
            onClick={() => setView('account')}
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-surface-container-high transition-all"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            {t.adminPortal.backToAccount}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-surface-container-high pb-4">
          {['videos', 'users', 'datasets'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setAdminTab(tab as any);
                if (tab === 'users') fetchAdminUsers();
                if (tab === 'datasets') fetchAdminDatasets();
              }}
              className={`px-6 py-3 rounded-t-2xl font-black text-sm uppercase tracking-widest transition-all ${
                adminTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab === 'videos' && (isRtl ? 'الفيديوهات' : 'Videos')}
              {tab === 'users' && (isRtl ? 'المستخدمون' : 'Users')}
              {tab === 'datasets' && (isRtl ? 'مجموعات البيانات' : 'Datasets')}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {adminError && (
          <div className="mb-6 p-4 rounded-2xl bg-error-container/30 border border-error/20 text-error font-bold text-sm">
            {adminError}
          </div>
        )}

        {/* Videos Tab */}
        {adminTab === 'videos' && (
          <>
            <div className="bg-white p-8 rounded-[2.5rem] border border-surface-container-high shadow-sm mb-10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black tracking-tight">{isRtl ? 'إدارة محتوى الفيديو' : 'Video Content Management'}</h2>
                <button
                  onClick={saveVideoSettings}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  {isRtl ? 'حفظ' : 'Save'}
                </button>
              </div>
              {videoSaveMsg && <p className="text-sm font-bold text-tertiary mb-4">{videoSaveMsg}</p>}
              <div className="space-y-8">
                {(['en', 'ar'] as const).map((language) => {
                  const videos = language === 'ar' ? draftVideoSettings.arVideos : draftVideoSettings.enVideos;
                  return (
                    <div key={language} className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black uppercase tracking-widest text-secondary">{language === 'ar' ? 'Arabic Videos' : 'English Videos'}</h3>
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-secondary/10 text-secondary">{videos.length} videos</span>
                      </div>
                      {videos.map((video, i) => (
                        <div key={`${language}-${i}`} className="border border-surface-container-high rounded-2xl p-5 bg-surface-container-low">
                          <p className="font-black mb-3">{language.toUpperCase()} Video {i + 1}</p>
                          <div className="grid md:grid-cols-2 gap-3">
                            <input
                              value={video.title}
                              onChange={(e) => handleDraftVideoChange(language, i, 'title', e.target.value)}
                              placeholder="Video title"
                              className="px-4 py-3 rounded-xl border border-surface-container-high bg-white"
                            />
                            <input
                              value={video.duration || video.sub || ''}
                              onChange={(e) => handleDraftVideoChange(language, i, 'duration', e.target.value)}
                              placeholder="Duration"
                              className="px-4 py-3 rounded-xl border border-surface-container-high bg-white"
                            />
                            <input
                              value={video.thumbnail}
                              onChange={(e) => handleDraftVideoChange(language, i, 'thumbnail', e.target.value)}
                              placeholder="Thumbnail URL"
                              className="px-4 py-3 rounded-xl border border-surface-container-high bg-white"
                            />
                            <input
                              value={video.youtubeUrl || video.videoUrl || ''}
                              onChange={(e) => handleDraftVideoChange(language, i, 'youtubeUrl', e.target.value)}
                              placeholder="YouTube URL"
                              className="px-4 py-3 rounded-xl border border-surface-container-high bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-surface-container-high shadow-sm mb-10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black tracking-tight">{isRtl ? 'فيديو كيف يعمل' : 'How It Works Video'}</h2>
                <button
                  onClick={saveHowItWorksVideoSettings}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  {isRtl ? 'حفظ' : 'Save'}
                </button>
              </div>
              {howItWorksSaveMsg && <p className="text-sm font-bold text-tertiary mb-4">{howItWorksSaveMsg}</p>}
              <div className="grid md:grid-cols-2 gap-6">
                {(['en', 'ar'] as const).map((language) => (
                  <div key={language} className="space-y-3 border border-surface-container-high rounded-2xl p-5 bg-surface-container-low">
                    <h3 className="font-black uppercase tracking-widest text-secondary">{language === 'ar' ? 'Arabic' : 'English'}</h3>
                    <input
                      value={draftVideoSettings.howItWorks[language].thumbnail}
                      onChange={(e) => handleDraftHowItWorksChange(language, 'thumbnail', e.target.value)}
                      placeholder="How It Works thumbnail URL"
                      className="w-full px-4 py-3 rounded-xl border border-surface-container-high bg-white"
                    />
                    <input
                      value={draftVideoSettings.howItWorks[language].youtubeUrl || draftVideoSettings.howItWorks[language].videoUrl || ''}
                      onChange={(e) => handleDraftHowItWorksChange(language, 'youtubeUrl', e.target.value)}
                      placeholder="How It Works YouTube URL"
                      className="w-full px-4 py-3 rounded-xl border border-surface-container-high bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {/* Users Tab */}
        {adminTab === 'users' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black tracking-tight">{isRtl ? 'إدارة المستخدمين' : 'Manage Users'}</h2>
              <button
                onClick={fetchAdminUsers}
                disabled={adminLoading}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {adminLoading ? (isRtl ? 'جاري...' : 'Loading...') : (isRtl ? 'تحديث' : 'Refresh')}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-container-high">
                    <th className="text-left py-3 px-4 font-black">{isRtl ? 'الاسم' : 'Name'}</th>
                    <th className="text-left py-3 px-4 font-black">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                    <th className="text-left py-3 px-4 font-black">{isRtl ? 'تاريخ الإنشاء' : 'Created'}</th>
                    <th className="text-left py-3 px-4 font-black">{isRtl ? 'نوع' : 'Type'}</th>
                    <th className="text-left py-3 px-4 font-black">{isRtl ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => (
                    <tr key={user.id} className="border-b border-surface-container-high hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-medium">
                        <div>{user.name}</div>
                        <div className="mt-1 text-[11px] font-bold text-on-surface-variant">
                          {user.phone || '-'} | {normalizeBloodType(user.bloodType) || '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant text-xs">{user.email}</td>
                      <td className="py-3 px-4 text-on-surface-variant text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                          user.role === 'admin'
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {user.role === 'admin' ? (isRtl ? 'مسؤول' : 'Admin') : (isRtl ? 'مستخدم' : 'User')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteAdminUser(user.id)}
                          className="px-3 py-1.5 rounded-lg bg-error/10 text-error font-bold text-xs hover:bg-error/20 transition-colors"
                        >
                          {isRtl ? 'حذف' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {adminUsers.length === 0 && !adminLoading && (
                <div className="text-center py-8 text-on-surface-variant">
                  {isRtl ? 'لا توجد مستخدمين' : 'No users found'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Datasets Tab */}
        {adminTab === 'datasets' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black tracking-tight">{isRtl ? 'إدارة مجموعات البيانات' : 'Manage Datasets'}</h2>
              <button
                onClick={fetchAdminDatasets}
                disabled={adminLoading}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {adminLoading ? (isRtl ? 'جاري...' : 'Loading...') : (isRtl ? 'تحديث' : 'Refresh')}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminDatasets.map((dataset) => (
                <div key={dataset.id} className="border border-surface-container-high rounded-2xl p-5 bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <h3 className="font-black text-lg mb-2">{dataset.name}</h3>
                  <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{dataset.description}</p>
                  <div className="space-y-2 text-xs font-medium mb-4">
                    <p>{isRtl ? 'الصور' : 'Images'}: <span className="font-black">{dataset.imageCount}</span></p>
                    <p>{isRtl ? 'التاريخ' : 'Uploaded'}: <span className="text-on-surface-variant">{new Date(dataset.uploadedAt).toLocaleDateString()}</span></p>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                        dataset.status === 'active' ? 'bg-green-100 text-green-700' :
                        dataset.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {dataset.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {adminDatasets.length === 0 && !adminLoading && (
              <div className="text-center py-8 text-on-surface-variant">
                {isRtl ? 'لا توجد مجموعات بيانات' : 'No datasets found'}
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
}
