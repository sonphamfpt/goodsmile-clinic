import React, { useState } from 'react';

interface StaffMember {
  id: string;
  name: string;
  role: 'dentist' | 'receptionist' | 'cashier' | 'manager';
  roleName: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  permissions: {
    admission: boolean;
    clinical: boolean;
    checkout: boolean;
    settings: boolean;
  };
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'STF-001',
    name: 'Dr. Lê Minh',
    role: 'dentist',
    roleName: 'Bác sĩ nha khoa',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80',
    status: 'Active',
    permissions: { admission: false, clinical: true, checkout: false, settings: false }
  },
  {
    id: 'STF-002',
    name: 'Dr. Nguyễn An',
    role: 'dentist',
    roleName: 'Bác sĩ nha khoa',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
    status: 'Active',
    permissions: { admission: false, clinical: true, checkout: false, settings: false }
  },
  {
    id: 'STF-003',
    name: 'Lê Thuỳ Chi',
    role: 'receptionist',
    roleName: 'Lễ tân trưởng',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=150&h=150&q=80',
    status: 'Active',
    permissions: { admission: true, clinical: false, checkout: false, settings: false }
  },
  {
    id: 'STF-004',
    name: 'Trần Văn Cường',
    role: 'cashier',
    roleName: 'Thu ngân chính',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    status: 'Active',
    permissions: { admission: false, clinical: false, checkout: true, settings: false }
  },
  {
    id: 'STF-005',
    name: 'Hoàng Văn Hải',
    role: 'manager',
    roleName: 'Giám đốc vận hành',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    status: 'Active',
    permissions: { admission: true, clinical: true, checkout: true, settings: true }
  }
];

export const ManagerRbac: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'dentist' | 'receptionist' | 'cashier' | 'manager'>('dentist');

  const togglePermission = (id: string, key: keyof StaffMember['permissions']) => {
    setStaffList((prev) =>
      prev.map((member) => {
        if (member.id === id) {
          return {
            ...member,
            permissions: {
              ...member.permissions,
              [key]: !member.permissions[key]
            }
          };
        }
        return member;
      })
    );
  };

  const handleToggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((member) => {
        if (member.id === id) {
          const nextStatus = member.status === 'Active' ? 'Inactive' : 'Active';
          return { ...member, status: nextStatus };
        }
        return member;
      })
    );
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      alert('Vui lòng nhập họ tên nhân sự!');
      return;
    }

    const newId = `STF-00${staffList.length + 1}`;
    const roleNames = {
      dentist: 'Bác sĩ nha khoa',
      receptionist: 'Lễ tân tiếp nhận',
      cashier: 'Nhân viên thu ngân',
      manager: 'Quản lý phòng khám'
    };

    const addedMember: StaffMember = {
      id: newId,
      name: newName,
      role: newRole,
      roleName: roleNames[newRole],
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&h=150&q=80',
      status: 'Active',
      permissions: {
        admission: newRole === 'receptionist' || newRole === 'manager',
        clinical: newRole === 'dentist' || newRole === 'manager',
        checkout: newRole === 'cashier' || newRole === 'manager',
        settings: newRole === 'manager'
      }
    };

    setStaffList((prev) => [...prev, addedMember]);
    setNewName('');
    setShowAddStaffModal(false);
    alert('Thêm nhân sự mới và phân quyền mặc định thành công!');
  };

  const getRoleBadge = (role: StaffMember['role']) => {
    switch (role) {
      case 'dentist':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'receptionist':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cashier':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'manager':
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 font-bold">groups</span>
          <div>
            <h3 className="font-bold text-on-surface">Nhân Sự & Phân Quyền</h3>
            <p className="text-xs text-on-surface-variant">Quản lý sơ đồ tài khoản nhân viên và thay đổi quyền truy cập phân hệ</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-primary-container transition-all cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Thêm Nhân Sự Mới
          </button>
        </div>
      </div>

      {/* Staff directory table */}
      <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Thành viên</th>
                <th className="px-6 py-3.5">Vai trò</th>
                <th className="px-6 py-3.5 text-center">Trạng thái</th>
                <th className="px-6 py-3.5 text-center">Đón tiếp (Admission)</th>
                <th className="px-6 py-3.5 text-center">Lâm sàng (Clinical)</th>
                <th className="px-6 py-3.5 text-center">Tính tiền (Checkout)</th>
                <th className="px-6 py-3.5 text-center">Cấu hình (System Price)</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-xs">
              {staffList.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover border" />
                      <div>
                        <h4 className="font-bold text-on-surface text-xs">{member.name}</h4>
                        <span className="text-[10px] text-outline font-bold font-data-mono">{member.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${getRoleBadge(member.role)}`}>
                      {member.roleName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(member.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        member.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                      title="Click để khoá/kích hoạt tài khoản"
                    >
                      {member.status === 'Active' ? 'HOẠT ĐỘNG' : 'TẠM KHOÁ'}
                    </button>
                  </td>
                  {/* Permissions checkboxes */}
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={member.permissions.admission}
                      onChange={() => togglePermission(member.id, 'admission')}
                      className="w-4 h-4 text-purple-600 border-outline-variant rounded focus:ring-purple-600 focus:ring-1 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={member.permissions.clinical}
                      onChange={() => togglePermission(member.id, 'clinical')}
                      className="w-4 h-4 text-purple-600 border-outline-variant rounded focus:ring-purple-600 focus:ring-1 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={member.permissions.checkout}
                      onChange={() => togglePermission(member.id, 'checkout')}
                      className="w-4 h-4 text-purple-600 border-outline-variant rounded focus:ring-purple-600 focus:ring-1 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={member.permissions.settings}
                      onChange={() => togglePermission(member.id, 'settings')}
                      className="w-4 h-4 text-purple-600 border-outline-variant rounded focus:ring-purple-600 focus:ring-1 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => alert(`Lịch sử truy cập của ${member.name} đã được lưu tại log file của Manager.`)}
                      className="p-1 border border-outline text-on-surface-variant hover:text-purple-600 rounded transition-all cursor-pointer"
                      title="Lịch sử đăng nhập"
                    >
                      <span className="material-symbols-outlined text-sm block">history_edu</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-outline-variant max-w-sm w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-primary text-on-primary flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm flex items-center gap-2">
                <span className="material-symbols-outlined">person_add</span>
                Khai Báo Nhân Sự Mới
              </h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-on-primary hover:text-white cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                  Họ tên nhân viên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Thị Hằng"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                  Chức danh & Phân hệ mặc định *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-xs font-bold focus:outline-none"
                >
                  <option value="dentist">Bác sĩ nha khoa</option>
                  <option value="receptionist">Lễ tân tiếp nhận</option>
                  <option value="cashier">Nhân viên thu ngân</option>
                  <option value="manager">Quản trị hệ thống / Giám đốc</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 border border-outline text-on-surface rounded-lg text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-all cursor-pointer"
                >
                  Đăng Ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
