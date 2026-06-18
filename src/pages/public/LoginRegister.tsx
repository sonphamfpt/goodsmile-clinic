import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { BrandLogo } from '../../components/BrandLogo';

const DEMO_ACCOUNTS = [
  { email: 'letan@goodsmile.vn',    password: 'letan123',    role: 'receptionist' as UserRole, label: 'Lễ Tân',    icon: 'folder_shared',       color: 'hover:border-orange-400 hover:bg-orange-50/50 text-orange-700 bg-orange-50/30 border-orange-100' },
  { email: 'bacsi@goodsmile.vn',    password: 'bacsi123',    role: 'dentist'      as UserRole, label: 'Bác Sĩ',    icon: 'dentistry',           color: 'hover:border-blue-400 hover:bg-blue-50/50 text-blue-700 bg-blue-50/30 border-blue-100' },
  { email: 'thungan@goodsmile.vn',  password: 'thungan123',  role: 'cashier'      as UserRole, label: 'Thu Ngân',  icon: 'payments',            color: 'hover:border-amber-400 hover:bg-amber-50/50 text-amber-700 bg-amber-50/30 border-amber-100' },
  { email: 'admin@goodsmile.vn',    password: 'admin123',    role: 'manager'      as UserRole, label: 'Quản Lý',  icon: 'admin_panel_settings', color: 'hover:border-purple-400 hover:bg-purple-50/50 text-purple-700 bg-purple-50/30 border-purple-100' },
  { email: 'benhnhan@goodsmile.vn', password: 'benhnhan123', role: 'patient'      as UserRole, label: 'Bệnh Nhân', icon: 'person',              color: 'hover:border-green-400 hover:bg-green-50/50 text-green-700 bg-green-50/30 border-green-100' },
];

export const LoginRegister: React.FC = () => {
  const { login, loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectAfterLogin = (role: UserRole) => {
    if (role === 'patient') navigate('/patient');
    else navigate(`/dashboard/${role}`);
  };

  const handleQuickLogin = (role: UserRole) => {
    login(role);
    redirectAfterLogin(role);
  };

  const handleFillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMsg('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    // Giả lập delay network 600ms
    await new Promise((r) => setTimeout(r, 600));

    const result = loginWithCredentials(email, password);
    setIsLoading(false);

    if (result.success && result.role) {
      redirectAfterLogin(result.role);
    } else {
      setErrorMsg(result.error || 'Đăng nhập thất bại.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch overflow-hidden font-body-md">
      {/* Custom styles for glowing backgrounds and animations */}
      <style>{`
        @keyframes mesh-move-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -60px) scale(1.2); }
        }
        @keyframes mesh-move-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 40px) scale(1.1); }
        }
        .mesh-glow-1 {
          animation: mesh-move-1 12s ease-in-out infinite;
        }
        .mesh-glow-2 {
          animation: mesh-move-2 15s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full flex flex-col lg:flex-row">
        
        {/* ── Left: Branding / Showcase Column (Hidden on mobile) ── */}
        <div className="hidden lg:flex lg:w-[48%] relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
          
          {/* Background Animated Gradients */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950"></div>
          
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none mesh-glow-1"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none mesh-glow-2"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent z-0"></div>

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
              <BrandLogo size="md" variant="white" showText={true} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
              PRO v4.0
            </span>
          </div>

          {/* Center Content */}
          <div className="relative z-10 space-y-8 my-auto max-w-lg">
            <div className="space-y-4">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Nền tảng nha khoa kỹ thuật số hiện đại
              </p>
              <h1 className="text-4xl font-black tracking-tight leading-[1.15] bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Quản lý toàn diện phòng khám thông minh
              </h1>
              <p className="text-slate-300 text-base leading-relaxed">
                Tối ưu hóa quy trình khám chữa bệnh, đồng bộ hồ sơ bệnh án thời gian thực, quản lý thu chi và nâng cao trải nghiệm khách hàng chỉ trên một giao diện duy nhất.
              </p>
            </div>

            {/* Quick Metrics Grid (Glassmorphism Cards) */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                <p className="text-2xl font-black text-white">10K+</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mt-1">Bệnh nhân</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                <p className="text-2xl font-black text-emerald-400">99.8%</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mt-1">Hài lòng</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                <p className="text-2xl font-black text-blue-400">24/7</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mt-1">AI Tư vấn</p>
              </div>
            </div>

            {/* Feature details */}
            <div className="space-y-3 pt-2">
              {[
                { icon: 'event_available', text: 'Đặt lịch trực tuyến & Sắp xếp hàng chờ thông minh' },
                { icon: 'medical_services', text: 'Bệnh án điện tử EMR đồng bộ hồ sơ bệnh lý' },
                { icon: 'analytics', text: 'Phân tích doanh thu & Quản lý sổ quỹ tự động' }
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 border border-white/5 px-4 py-3 rounded-xl">
                  <span className="material-symbols-outlined text-[18px] text-blue-300">{f.icon}</span>
                  <span className="font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 flex justify-between items-center text-xs text-slate-500 border-t border-white/5 pt-4">
            <p>© 2026 GoodSmile Clinic. Bảo mật tiêu chuẩn HIPAA.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300 transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Liên hệ</a>
            </div>
          </div>
        </div>

        {/* ── Right: Authentication Panels (Centered on Mobile & Desktop) ── */}
        <div className="flex-1 bg-white flex flex-col justify-between p-8 lg:p-16 relative">
          
          {/* Mini logo show only on Mobile */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl shadow-sm inline-block">
              <BrandLogo size="md" variant="dark" />
            </div>
          </div>

          <div className="max-w-md w-full mx-auto my-auto space-y-8">
            
            {/* Header section */}
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {isLoginTab ? 'Chào mừng trở lại!' : 'Đăng ký tài khoản'}
              </h2>
              <p className="text-sm text-slate-500">
                {isLoginTab 
                  ? 'Vui lòng nhập tài khoản để truy cập hệ thống quản lý.' 
                  : 'Trở thành một thành viên trong hệ sinh thái GoodSmile.'}
              </p>
            </div>

            {/* Styled Switcher Tabs */}
            <div className="flex bg-slate-100/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { setIsLoginTab(true); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isLoginTab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => { setIsLoginTab(false); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                  !isLoginTab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Đăng Ký
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Username/Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Địa chỉ Email *
                </label>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="tennhanvien@goodsmile.vn"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mật khẩu *
                  </label>
                  {isLoginTab && (
                    <a href="#" className="text-xs text-primary font-bold hover:underline">
                      Quên mật khẩu?
                    </a>
                  )}
                </div>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 hover:text-slate-700 transition-colors text-[20px] cursor-pointer"
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </button>
                </div>
              </div>

              {/* Remember account option */}
              {isLoginTab && (
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-primary focus:ring-primary/30 w-4 h-4" 
                  />
                  Ghi nhớ đăng nhập
                </label>
              )}

              {/* Error Message Box */}
              {errorMsg && (
                <div className="flex items-start gap-2.5 text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl p-3 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                  <span className="font-semibold leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-primary/25 hover:bg-primary/95 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Đang kết nối hệ thống...
                  </>
                ) : (
                  isLoginTab ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN MỚI'
                )}
              </button>
            </form>

            {/* Quick Demo System Access Section */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Tài khoản dùng thử
                </span>
                <span className="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                  Bản Demo Chấm Điểm
                </span>
              </div>

              {/* Demo Account Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleFillDemo(acc)}
                    className={`border text-[11px] font-bold p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-sm text-center ${acc.color}`}
                    title={`Email: ${acc.email}\nMật khẩu: ${acc.password}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{acc.icon}</span>
                    <span>{acc.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[9.5px] text-slate-400 text-center italic">
                * Click chọn thẻ nhân sự ở trên để điền tự động dữ liệu thử nghiệm.
              </p>

              {/* Direct Speed Login Links */}
              <div className="flex justify-center flex-wrap items-center gap-x-3 gap-y-1.5 text-[10.5px] text-slate-400 font-bold border-t border-slate-100/70 pt-4">
                <span className="text-slate-300">Đăng nhập nhanh:</span>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('manager')}
                  className="text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">flash_on</span>
                  Quản lý
                </button>
                <span className="text-slate-200">|</span>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dentist')}
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">flash_on</span>
                  Bác sĩ
                </button>
                <span className="text-slate-200">|</span>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('receptionist')}
                  className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">flash_on</span>
                  Lễ tân
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Copyright on mobile */}
          <div className="lg:hidden text-center text-[10px] text-slate-400 mt-8 pt-4 border-t border-slate-100">
            © 2026 GoodSmile Clinic. Bảo mật chuẩn HIPAA.
          </div>
        </div>
        
      </div>
    </div>
  );
};
