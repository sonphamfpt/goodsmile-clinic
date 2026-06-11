import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'patient' | 'receptionist' | 'dentist' | 'cashier' | 'manager';

interface UserProfile {
  name: string;
  roleName: string;
  avatar: string;
  id?: string;
  details?: string;
}

interface AuthContextType {
  role: UserRole;
  user: UserProfile | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PROFILES: Record<UserRole, UserProfile> = {
  patient: {
    id: 'P-8821',
    name: 'Trần Nguyễn Minh',
    roleName: 'Thành viên Platinum',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCZUBKcI7ayRWkcJ2L3JWbHMT1GakNh8wd4WmcLQqreM2pw1cZ3_mIUmFJC6zvgzSdzjt-aNUr6zkB7b-nSNFSk0U-wXbcRK6Lozi3p2w6OppM-m2XR0KcDLi2E0vWF6OIzgfjPYhZcIIhrBY6auZIbvsvS-TqLaU71qrX19NwjJ_yw0c_QSBEIfJkPTscQvdfd67PDipD_PRqWqDyLDbt2YKvsmLpEy_Dy6g3MNT0L-jLv0TVVDJ0DZP-E8VJxPM9yOrDIeRhPiM',
    details: 'Ví thành viên: ₫4,250,000'
  },
  receptionist: {
    name: 'Nguyễn Lễ Tân',
    roleName: 'Lễ tân điều phối',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB03BPJUCh1Jw0yXsfJkfV1-WnGqgjSonf_lbEIv92I1dfdd_PTbZmr8dCXGOovXgkf7RGKGpjX9bY8k1STAnfh0qpOzbLUv5PPCVKkWZxgYwClMyLOV3F_X_1bwXD8SxBqZDmEISP7p2drYTMjYOripfRlSFRW6m41M9pIf4D9nJ4bJh4MWmMEvlvNsUlYlx412xtjLu_ASaxva4JsYxU3e3wBI32YO4JaGrlwzwHd2s0WM0R718Xr7pJqimsfvC1b8l7g5WCODuw',
    details: 'Quầy tiếp đón 01 - Ca sáng'
  },
  dentist: {
    id: 'D-04',
    name: 'Bác sĩ Nguyễn Hương',
    roleName: 'Bác sĩ Chỉnh nha Cao cấp',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhaw7V_InEw7itBcn2U2FCLbVMfY6ToR72hEQjPoqMMcnnOEzlLAk0vMqxaZ3S8CaOXn9NHrJYN5zAktYjA75RPhrwlXLWM47508ReMq1fm7ZFUvdIoVaDCiVy8RoS9cZs1UkYw7ZHaPPtbghmhluy2nqYXNF8cIKwyf7Yr4hvLSZXWQKMm0ouD5hIuAlFSEFrcoP1pckD5ibmDN6oK2qKoKonjhJWbPs9I2MwXObu0P-vpNncAolr2XOC3bkSZBS9noMehcRJHhY',
    details: 'Phòng khám chuyên khoa 110'
  },
  cashier: {
    name: 'Nguyễn Thu Ngân',
    roleName: 'Thu ngân thanh toán',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcqya7AMafu3GyYvLDjXpa3mKgR9vYvXFqaRPOzLGKgkh9LjTq9c5s4uEMdVlYtB64p7SMYVYbqatHock8N1ZHDhMOUqfUoey7P91ZskBVQ_g1XCr1QcdTu_K6H3iYdL_GT_3obeuSkOd5iIuqvZDg55oWZRmZM4JGAmDwyM4_9HXqVMAzIKBNalZOsjovPS8niYwmu3WNIqE_bUjfcpOitnxV4Z1m-I1oq1TvRb_U58oGPvVsQoefrADAgIIAAjP_e18DklE7-N8',
    details: 'Quầy thanh toán 02 - Ca sáng'
  },
  manager: {
    name: 'Admin Quản lý',
    roleName: 'Quản trị viên hệ thống',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZpGPmOFFhFYWQGQfjUdEjjVD8-2Hl2tJIkROjoOZzv5odFyCVHiFS56HTn-qGjqz1JT11fpojHL7dbq8K1M8kDiuI7AE1Yk_TfK-7B67u9a2BBHNmT0xpzgOHeqPuF9vDsTKvrDpaywN2o81Jg4gyQJ7cLvreJ0G1WHdMUmZit_bX1ICGxqkFUd9go-WrTHKIx8DvKPwCVKyAOEtA_MYchRIf93aPGa1oLY5EbFzboyVwi6-YpuTtJYcRf4G33b1mhKZdJg580xA',
    details: 'Quyền truy cập: Toàn phần'
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('patient');
  const [user, setUser] = useState<UserProfile | null>(ROLE_PROFILES.patient);

  const login = (newRole: UserRole) => {
    setRole(newRole);
    setUser(ROLE_PROFILES[newRole]);
  };

  const logout = () => {
    setRole('patient');
    setUser(ROLE_PROFILES.patient);
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export { ROLE_PROFILES };
