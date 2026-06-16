# AGENT.md – Nha Khoa GoodSmile

Tài liệu này cung cấp ngữ cảnh cho AI agent khi làm việc với codebase này.
Đọc kỹ trước khi thực hiện bất kỳ thay đổi nào.

---

## 🏥 Mô tả dự án

**GoodSmile Clinic** là hệ thống quản lý phòng khám nha khoa dạng Single Page Application (SPA).
Đây là dự án tốt nghiệp FPT Polytechnic – frontend-only (không có backend thật, toàn bộ data là React state in-memory).

---

## ⚡ Lệnh quan trọng

```bash
npm run dev      # Khởi động dev server (Vite) → http://localhost:5173
npm run build    # Build production (TypeScript compile + Vite bundle)
npm run lint     # Kiểm tra linting với ESLint
npm run preview  # Preview bản build production
```

---

## 🏗️ Kiến trúc & Stack

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Framework | React 19 | Dùng functional components + hooks |
| Language | TypeScript ~6 | Strict mode bật |
| Build | Vite 8 | |
| Routing | React Router DOM v7 | `useSearchParams` cho tab routing |
| Styling | TailwindCSS v4 | Custom design tokens (xem `tailwind.config.js`) |
| State | React Context API | **Không dùng Redux/Zustand** |

---

## 📁 Cấu trúc quan trọng

```
src/
├── context/
│   ├── AuthContext.tsx      # Quản lý vai trò (role-based)
│   └── ClinicContext.tsx    # Toàn bộ state & business logic
├── types/clinic.ts          # Tất cả TypeScript interfaces – đọc trước khi code
├── services/mockData.ts     # Dữ liệu khởi tạo – KHÔNG SỬA nếu không cần thiết
├── components/              # Shared components (BookingModal, DentalChart)
├── layouts/                 # MainLayout (public) & DashboardLayout (staff/patient)
└── pages/
    ├── public/              # 6 trang công khai (không cần auth)
    ├── patient/             # Cổng bệnh nhân + 5 tabs
    ├── staff/               # 4 dashboard nhân viên + tabs riêng
    └── queue-tracking/      # Màn hình TV phòng chờ (/queue-board)
```

---

## 🔐 Hệ thống phân quyền (Roles)

Có 5 role, KHÔNG có backend auth – chỉ là React state:

| Role | Dashboard URL | Mô tả |
|---|---|---|
| `patient` | `/patient` | Bệnh nhân |
| `receptionist` | `/dashboard/receptionist` | Lễ tân |
| `dentist` | `/dashboard/dentist` | Bác sĩ nha khoa |
| `cashier` | `/dashboard/cashier` | Thu ngân |
| `manager` | `/dashboard/manager` | Quản lý / Admin |

**Cách test nhanh**: DashboardLayout có Role Quick Switcher (select box ở sidebar).

---

## 🧩 Pattern Tab Routing

Tất cả dashboard dùng cùng pattern – **ĐỌC KỸ** trước khi thêm tab mới:

```tsx
// Trong DashboardXxx.tsx
const [searchParams] = useSearchParams();
const tab = searchParams.get('tab');

switch (tab) {
  case 'ten-tab': return <TenTabComponent />;
  default:        return <DefaultHome />;
}
```

Thêm tab mới cần cập nhật 2 chỗ:
1. `DashboardLayout.tsx` → `getNavItems()` – thêm nav link mới
2. Dashboard file tương ứng → thêm `case` trong switch

---

## ⚠️ CÁC GIÁ TRỊ HARDCODED QUAN TRỌNG

> **Phải biết** những ID này khi debug hoặc thêm tính năng liên quan:

- **Bác sĩ mặc định** trong `DentistDashboard.tsx`: `dentistId = 'D-04'` (Bác sĩ Nguyễn Hương)
- **Bệnh nhân mặc định** trong `PatientDashboard.tsx`: `patientId = 'P-8821'` (Trần Nguyễn Minh)
- **Bệnh nhân logged-in** trong `AuthContext.tsx`: `id: 'P-8821'`

---

## 📊 Luồng nghiệp vụ chính

```
Lễ tân check-in (checkInPatient)
    ↓
Queue status: "Waiting"
    ↓
Bác sĩ chọn bệnh nhân → startTreatment()
    ↓
Queue status: "In Chair" + elapsedTimeMin tăng mỗi 60s
    ↓
Bác sĩ ký bệnh án → completeTreatment()
    ↓
[Queue: Completed] + [MedicalRecord mới] + [Invoice Pending]
    ↓
Thu ngân xử lý → processPayment()
    ↓
[Invoice: Paid] + [Tích điểm loyalty] + [Nâng Tier nếu đủ điểm]
```

---

## 💡 Quy tắc Styling

- **Dùng Tailwind classes từ design system** có trong `tailwind.config.js` và `index.css`
- Các token màu chính: `primary`, `secondary`, `tertiary`, `surface`, `on-surface`, `outline-variant`...
- **Không tự ý thêm màu hex/rgb thuần** – dùng token đã định nghĩa
- Class animation: `animate-in fade-in duration-200`, `animate-pulse`, `hover:scale-[1.01]`
- Custom scrollbar: thêm class `custom-scrollbar`

---

## 🚫 KHÔNG ĐƯỢC LÀM

- ❌ Không cài thêm thư viện state management (Redux, Zustand, Jotai...)
- ❌ Không thay đổi `types/clinic.ts` mà không cập nhật `mockData.ts` và `ClinicContext.tsx`
- ❌ Không xóa `addLog()` khi thực hiện action nghiệp vụ – mọi action cần có log
- ❌ Không hardcode text tiếng Anh vào UI – dự án hoàn toàn tiếng Việt
- ❌ Không dùng `any` type trong TypeScript trừ khi bất khả kháng

---

## ✅ PHẢI LÀM KHI THÊM TÍNH NĂNG MỚI

- ✅ Khai báo interface trong `types/clinic.ts` trước
- ✅ Thêm mock data vào `services/mockData.ts`
- ✅ Thêm state + hàm xử lý vào `ClinicContext.tsx`
- ✅ Gọi `addLog()` sau mỗi action quan trọng
- ✅ Dùng `useClinic()` hook để truy cập data, không truyền props rườm rà

---

## 🦷 DentalChart Component

- Chuẩn **ISO FDI Notation** (32 răng, 4 góc phần tư Q1–Q4)
- Props: `teethState: ToothState[]`, `selectedTooth: number | null`, `onSelectTooth: (num) => void`
- 5 condition: `healthy | decay | missing | crown | bridge`

---

## 🔢 ID Convention

| Entity | Format | Ví dụ |
|---|---|---|
| Patient | `P-XXXX` | `P-8821` |
| Dentist | `D-XX` | `D-04` |
| Service | `S-XX` | `S-01` |
| Appointment | `A-XXXX` | `A-01` |
| Queue | `Q-XXXX` | `Q-03` |
| Invoice | `INV-XXXX` | `INV-9021` |
| Medical Record | `MR-XXXX` | `MR-01` |
| Log | `L-XXXXXXX` | `L-abc1234` |
