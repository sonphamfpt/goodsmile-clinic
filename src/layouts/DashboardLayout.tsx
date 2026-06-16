import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { role, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleAccentClass = () => {
    switch (role) {
      case 'patient': return 'border-secondary';
      case 'receptionist': return 'border-orange-500';
      case 'dentist': return 'border-primary';
      case 'cashier': return 'border-amber-600';
      case 'manager': return 'border-purple-600';
      default: return 'border-outline-variant';
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'patient': return 'Cổng bệnh nhân';
      case 'receptionist': return 'Quản lý tiếp đón';
      case 'dentist': return 'Hồ sơ lâm sàng';
      case 'cashier': return 'Thu ngân & Tài chính';
      case 'manager': return 'Quản trị hệ thống';
      default: return 'GoodSmile Pro';
    }
  };

  // Define nav links for each role
  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'patient':
        return [
          { label: 'Bảng điều khiển', icon: 'dashboard', path: '/patient' },
          { label: 'Đặt lịch khám', icon: 'calendar_add_on', path: '/patient?tab=booking' },
          { label: 'Lịch hẹn của tôi', icon: 'calendar_month', path: '/patient?tab=appointments' },
          { label: 'Hàng chờ thực tế', icon: 'groups', path: '/patient?tab=queue' },
          { label: 'Hồ sơ bệnh án', icon: 'folder_shared', path: '/patient?tab=records' },
          { label: 'Lịch sử giao dịch', icon: 'history', path: '/patient?tab=billing' },
        ];
      case 'receptionist':
        return [
          { label: 'Bàn tiếp nhận', icon: 'folder_shared', path: '/dashboard/receptionist' },
          { label: 'Hàng chờ trực tiếp', icon: 'pending_actions', path: '/dashboard/receptionist?tab=queue' },
          { label: 'Lịch hẹn phòng khám', icon: 'receipt_long', path: '/dashboard/receptionist?tab=appointments' },
          { label: 'Gửi Zalo/SMS nhắc lịch', icon: 'chat_bubble', path: '/dashboard/receptionist?tab=reminders' },
        ];
      case 'dentist':
        return [
          { label: 'Hàng chờ bác sĩ', icon: 'pending_actions', path: '/dashboard/dentist' },
          { label: 'Bàn khám lâm sàng', icon: 'dashboard', path: '/dashboard/dentist?tab=workspace' },
          { label: 'Hồ sơ bệnh án EMR', icon: 'folder_shared', path: '/dashboard/dentist?tab=records' },
          // { label: 'Lịch làm việc bác sĩ', icon: 'calendar_month', path: '/dashboard/dentist?tab=schedule' },
        ];
      case 'cashier':
        return [
          { label: 'Thu phí hóa đơn', icon: 'payments', path: '/dashboard/cashier' },
          { label: 'Sổ quỹ & Báo cáo ca', icon: 'analytics', path: '/dashboard/cashier?tab=report' },
          { label: 'Lịch sử thanh toán', icon: 'history', path: '/dashboard/cashier?tab=history' },
        ];
      case 'manager':
        return [
          { label: 'Tổng quan phòng khám', icon: 'monitoring', path: '/dashboard/manager' },
          { label: 'Bảng theo dõi hàng chờ', icon: 'pending_actions', path: '/dashboard/manager?tab=queue' },
          { label: 'Doanh thu phòng khám', icon: 'receipt_long', path: '/dashboard/manager?tab=revenue' },
          { label: 'Nhân sự & Phân quyền', icon: 'groups', path: '/dashboard/manager?tab=rbac' },
          { label: 'Cấu hình giá dịch vụ', icon: 'settings', path: '/dashboard/manager?tab=settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (item: NavItem) => {
    navigate(item.path);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetRole = e.target.value as UserRole;
    login(targetRole);
    if (targetRole === 'patient') {
      navigate('/patient');
    } else {
      navigate(`/dashboard/${targetRole}`);
    }
  };

  const getGreetingMessage = () => {
    if (role === 'patient') {
      return `Chào buổi sáng, ${user?.name || 'bệnh nhân'}!`;
    }
    return `Xin chào, ${user?.name || 'nhân viên'}`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      {/* SideNavBar */}
      <aside className="w-[240px] h-full bg-surface-container-low border-r border-outline-variant flex flex-col py-stack-lg shrink-0 shadow-sm">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
            GS
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface leading-tight">GoodSmile</h1>
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              {getRoleTitle()}
            </p>
          </div>
        </div>

        {/* Role Quick Switcher for Demo testing */}
        <div className="px-4 mb-4">
          <div className="bg-surface p-2 rounded-lg border border-outline-variant">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
              Đổi vai trò nhanh
            </label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full bg-surface-container border-none rounded text-xs font-bold py-1 px-2 focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="patient">Khách hàng / Bệnh nhân</option>
              <option value="receptionist">Lễ tân tiếp tiếp nhận</option>
              <option value="dentist">Bác sĩ nha khoa</option>
              <option value="cashier">Thu ngân phòng khám</option>
              <option value="manager">Người quản lý / Admin</option>
            </select>
          </div>
        </div>

        {/* Dynamic Navigation Items */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item, index) => {
            const isSelected = location.pathname + location.search === item.path || 
                               (location.pathname === item.path && location.search === '');
            return (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className={`w-full text-left rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-150 ${
                  isSelected
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom */}
        <div className="px-2 mt-auto border-t border-outline-variant pt-4 space-y-1">
          {role === 'patient' && (
            <button
              onClick={() => navigate('/patient?tab=ai')}
              className="w-full text-left text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-2 flex items-center gap-3 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              <span className="font-label-md text-label-md">AI tư vấn sức khỏe</span>
            </button>
          )}
          <button
            onClick={() => navigate('/queue-board')}
            className="w-full text-left text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-2 flex items-center gap-3 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">monitor</span>
            <span className="font-label-md text-label-md">Bảng hàng chờ TV</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left text-error hover:bg-error-container/20 rounded-lg px-4 py-2 flex items-center gap-3 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-label-md text-label-md">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopNavBar */}
        <header className="h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-container-padding-desktop py-stack-md shrink-0">
          <div className="flex items-center gap-stack-md">
            <h2 className="font-headline-md text-headline-md text-primary truncate max-w-md">
              {getGreetingMessage()}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="px-3 py-1 bg-secondary-container/20 text-secondary rounded-full border border-secondary/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-label-md font-bold hidden sm:inline">Phòng khám: Hoạt động</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Báo động khẩn cấp y tế đã được phát đi!')}
                className="p-2 text-error hover:bg-error-container rounded-full transition-colors active:scale-95"
                title="Y tế khẩn cấp"
              >
                <span className="material-symbols-outlined text-[24px]">emergency</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95 relative">
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
              </button>
            </div>
            
            {/* User Profile Widget */}
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
              <div className="text-right hidden sm:block">
                <p className="font-label-md text-label-md text-on-surface font-semibold">{user?.name}</p>
                <p className="text-[10px] text-on-surface-variant font-medium">{user?.roleName}</p>
              </div>
              <img
                alt="User profile"
                src={user?.avatar}
                className={`w-10 h-10 rounded-full object-cover border-2 ${getRoleAccentClass()}`}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic View Canvas */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfdfe]">
          {children}
        </main>
      </div>
    </div>
  );
};
