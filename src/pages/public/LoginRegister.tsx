import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';

export const LoginRegister: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleQuickLogin = (role: UserRole) => {
    login(role);
    if (role === 'patient') {
      navigate('/patient');
    } else {
      navigate(`/dashboard/${role}`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default form submission logs in as patient for testing
    handleRoleQuickLogin('patient');
  };

  return (
    <div className="bg-background min-h-[600px] flex items-center justify-center py-stack-lg px-container-padding-desktop">
      <div className="bg-white rounded-xl border border-outline-variant shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Column: Promotion Info */}
        <div className="flex-1 premium-glow p-8 text-on-primary flex flex-col justify-between space-y-8">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-white">Nha Khoa GoodSmile</h2>
            <p className="text-body-lg opacity-85 mt-2">Hệ thống nha khoa kỹ thuật số 4.0 hàng đầu</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <p className="text-body-md font-semibold">Tự động đặt lịch và quản lý hàng chờ thời gian thực</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <p className="text-body-md font-semibold">Tra cứu hồ sơ bệnh án điện tử và hình ảnh X-quang bảo mật</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <p className="text-body-md font-semibold">Chatbot AI tư vấn chăm sóc răng miệng thông minh 24/7</p>
            </div>
          </div>

          <p className="text-xs opacity-75">
            © 2026 GoodSmile Pro Management. Hệ thống bảo mật chuẩn HIPAA quốc tế.
          </p>
        </div>

        {/* Right Column: Auth Panel & Role Switcher */}
        <div className="flex-1 p-8 space-y-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-outline-variant">
          
          {/* Main Auth Form */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-outline-variant">
              <button
                onClick={() => setIsLoginTab(true)}
                className={`flex-1 pb-2 font-bold text-center border-b-2 text-label-md cursor-pointer ${
                  isLoginTab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => setIsLoginTab(false)}
                className={`flex-1 pb-2 font-bold text-center border-b-2 text-label-md cursor-pointer ${
                  !isLoginTab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                }`}
              >
                Đăng Ký
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                  Địa chỉ Email / Số điện thoại
                </label>
                <input
                  type="text"
                  required
                  placeholder="name@example.com hoặc 0901234..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                  Mật khẩu tài khoản
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {isLoginTab && (
                <div className="flex justify-between items-center text-xs">
                  <label className="flex items-center gap-1.5 text-on-surface-variant cursor-pointer">
                    <input type="checkbox" className="rounded text-primary focus:ring-0" />
                    Duy trì đăng nhập
                  </label>
                  <a href="#" className="text-primary hover:underline">Quên mật khẩu?</a>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:shadow-lg active:scale-95 transition-all cursor-pointer mt-2"
              >
                {isLoginTab ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN MỚI'}
              </button>
            </form>
          </div>

          {/* Quick Role Access for Examiners/Graduation Project Reviewers */}
          <div className="pt-6 border-t border-outline-variant space-y-3">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-center">
              Dành cho hội đồng chấm / Demo các vai trò
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleRoleQuickLogin('receptionist')}
                className="bg-orange-50 border border-orange-200 text-orange-800 text-xs py-2 px-1.5 rounded-lg hover:bg-orange-100 transition-colors font-bold text-center active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">folder_shared</span> Lễ Tân
              </button>
              <button
                onClick={() => handleRoleQuickLogin('dentist')}
                className="bg-blue-50 border border-blue-200 text-blue-800 text-xs py-2 px-1.5 rounded-lg hover:bg-blue-100 transition-colors font-bold text-center active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">dentistry</span> Bác Sĩ
              </button>
              <button
                onClick={() => handleRoleQuickLogin('cashier')}
                className="bg-amber-50 border border-amber-200 text-amber-800 text-xs py-2 px-1.5 rounded-lg hover:bg-amber-100 transition-colors font-bold text-center active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">payments</span> Thu Ngân
              </button>
              <button
                onClick={() => handleRoleQuickLogin('manager')}
                className="bg-purple-50 border border-purple-200 text-purple-800 text-xs py-2 px-1.5 rounded-lg hover:bg-purple-100 transition-colors font-bold text-center active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span> Quản Lý
              </button>
              <button
                onClick={() => handleRoleQuickLogin('patient')}
                className="col-span-2 bg-green-50 border border-green-200 text-green-800 text-xs py-2 px-1.5 rounded-lg hover:bg-green-100 transition-colors font-bold text-center active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">person</span> Khách Hàng (Bệnh Nhân)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
