import { Service, Dentist, Patient, Appointment, QueueItem, Invoice, ClinicLog, MedicalRecord } from '../types/clinic';

export const INITIAL_SERVICES: Service[] = [
  { id: 'S-01', name: 'Lấy cao răng & Vệ sinh', price: 300000, durationMin: 30, isActive: true },
  { id: 'S-02', name: 'Tẩy trắng răng thẩm mỹ', price: 2500000, durationMin: 60, isActive: true },
  { id: 'S-03', name: 'Trám răng thẩm mỹ (x1)', price: 450000, durationMin: 45, isActive: true },
  { id: 'S-04', name: 'Nhổ răng khôn thường', price: 1750000, durationMin: 60, isActive: true },
  { id: 'S-05', name: 'Điều trị tủy răng', price: 1200000, durationMin: 90, isActive: true },
  { id: 'S-06', name: 'Trồng răng Implant xương', price: 15000000, durationMin: 120, isActive: true },
  { id: 'S-07', name: 'Niềng răng/Chỉnh nha', price: 30000000, durationMin: 90, isActive: true },
  { id: 'S-08', name: 'Khám tổng quát & Tư vấn', price: 100000, durationMin: 20, isActive: true },
  { id: 'S-09', name: 'Bọc răng sứ toàn sứ', price: 5000000, durationMin: 120, isActive: true },
  { id: 'S-10', name: 'Gắn đá nha khoa', price: 500000, durationMin: 30, isActive: true },
  { id: 'S-11', name: 'Tiểu phẫu cắt chóp', price: 3000000, durationMin: 90, isActive: true },
  { id: 'S-12', name: 'Chụp X-quang răng', price: 150000, durationMin: 15, isActive: true }
];

export const INITIAL_DENTISTS: Dentist[] = [
  { id: 'D-01', name: 'Bác sĩ Lê Minh', role: 'Chuyên gia Nội nha & Điều trị Tủy', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRh1BEbDItxmTS5t_FtQcOx4-Ji9qxa8SBaoqimlDJVAGi4uX_G2jBX7EFW3IMwtToObvTs2mcuKKoDjqJUdwXqiuFb4qWxe6bLf-rT3H75pDiivhMleiFb679WEYEgzCBc3sI_P015xZ627wSQZBCNog0wXvQRc_zaQyQ54mPp6EXIPRm4NhBAokHg7kAQHsACDQnEghzcJjJ3r04Jhy0k9_EeCaGCCndhtcmftP4_Jm4oPe1sLZ3ZEffU_8L5pP9zF2VXn9LLGw', room: 'Phòng 102' },
  { id: 'D-02', name: 'Bác sĩ Hoàng Nam', role: 'Chuyên gia Phẫu thuật & Nhổ răng khôn', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANTEVtuLUOOjAmogqJN7Hi0xUg1x9U_4OgE3smE7dVTgg65UKKvpKlhV9fLKifMZ1f6DVysRbc9fLDjvKqmcZTmt1-svdnhJ3jt4RIpZvUNUmF75Bclcxn5GRUo85zTmLEkQznpMOuAXqGfDYefQZ4xE0ys7eUr0vvcvOQbfFMGnE1REf3_q9YPU1Bwv5OSrGTJ-oXeSbkMRlISSGI9zSDa6pk0Xq0OiZSAkyRkROKGJlJ-iDt8fDvPFhHPF0BRXOeOQiLuXvDet8', room: 'Phòng 105' },
  { id: 'D-03', name: 'Bác sĩ Mai Lan', role: 'Chuyên gia Thẩm mỹ & Tẩy trắng răng', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhaw7V_InEw7itBcn2U2FCLbVMfY6ToR72hEQjPoqMMcnnOEzlLAk0vMqxaZ3S8CaOXn9NHrJYN5zAktYjA75RPhrwlXLWM47508ReMq1fm7ZFUvdIoVaDCiVy8RoS9cZs1UkYw7ZHaPPtbghmhluy2nqYXNF8cIKwyf7Yr4hvLSZXWQKMm0ouD5hIuAlFSEFrcoP1pckD5ibmDN6oK2qKoKonjhJWbPs9I2MwXObu0P-vpNncAolr2XOC3bkSZBS9noMehcRJHhY', room: 'Phòng 108' },
  { id: 'D-04', name: 'Bác sĩ Nguyễn Hương', role: 'Chuyên khoa Chỉnh nha & Niềng răng', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmHutcEoE3mwWFVbj6-D885N2zpuS8LPlvU948W1H-5jeUPhYBnMBB_CRq9-VbH_Lx2DEtBvh4ku53cmX0vzgOAf_phuCv9lM_ZJ0ieExhjUn8f_EApgUXYCQamjHIIfWq6GrNSKfwvIfDZcdwphKG4FzsNk6dxltIaCbUwLe8uaJHakXN06OuYT8CGQVXg3htUAiDYISAWsTkf65jZqZUcMO2oCjZmJKRreWSVBl31EzaZ9VLfzbjmmJrqQcf3t8A8FNsHkGI2Ck', room: 'Phòng 110' }
];

export const INITIAL_PATIENTS: Patient[] = [
  { id: 'P-9902', name: 'Nguyễn Thị Lan', phone: '0901 222 333', age: 42, gender: 'Nữ', criticalAllergy: 'Penicillin', condition: 'Đái tháo đường Tuýp 2', balance: 0, tier: 'Standard', points: 300 },
  { id: 'P-8821', name: 'Trần Nguyễn Minh', phone: '0901 234 567', age: 28, gender: 'Nam', criticalAllergy: 'Không', condition: 'Nhạy cảm ngà', balance: 4250000, tier: 'Platinum', points: 8750 },
  { id: 'P-0012', name: 'Nguyễn Văn A', phone: '0912 345 678', age: 34, gender: 'Nam', criticalAllergy: 'Không', condition: 'Bình thường', balance: 1000000, tier: 'Gold', points: 3200 },
  { id: 'P-4490', name: 'Trần Thị B', phone: '0987 654 321', age: 25, gender: 'Nữ', criticalAllergy: 'Aspirin', condition: 'Huyết áp thấp', balance: 500000, tier: 'Standard', points: 1200 },
  { id: 'P-3129', name: 'Lê Quang C', phone: '0976 543 210', age: 29, gender: 'Nam', criticalAllergy: 'Không', condition: 'Bình thường', balance: 150000, tier: 'Standard', points: 500 },
  { id: 'P-7721', name: 'Phạm Thu D', phone: '0909 999 888', age: 31, gender: 'Nữ', criticalAllergy: 'Không', condition: 'Bình thường', balance: 750000, tier: 'Gold', points: 2800 },
  { id: 'P-5021', name: 'Đặng Minh Khoa', phone: '0911 222 555', age: 38, gender: 'Nam', criticalAllergy: 'Không', condition: 'Bình thường', balance: 3000000, tier: 'Gold', points: 4100 },
  { id: 'P-5022', name: 'Nguyễn Thùy Linh', phone: '0911 333 666', age: 22, gender: 'Nữ', criticalAllergy: 'Không', condition: 'Bình thường', balance: 0, tier: 'Standard', points: 150 },
  { id: 'P-5023', name: 'Lý Kiều Trinh', phone: '0911 444 777', age: 26, gender: 'Nữ', criticalAllergy: 'Không', condition: 'Bình thường', balance: 0, tier: 'Standard', points: 200 }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 'A-01', patientId: 'P-0012', patientName: 'Nguyễn Văn A', patientPhone: '0912 345 678', serviceName: 'Điều trị tủy răng', dentistId: 'D-01', dentistName: 'Bác sĩ Lê Minh', time: '09:00 AM', status: 'Confirmed' },
  { id: 'A-02', patientId: 'P-4490', patientName: 'Trần Thị B', patientPhone: '0987 654 321', serviceName: 'Tẩy trắng răng thẩm mỹ', dentistId: 'D-02', dentistName: 'Bác sĩ Hoàng Nam', time: '09:30 AM', status: 'In-Progress' },
  { id: 'A-03', patientId: 'P-3129', patientName: 'Lê Quang C', patientPhone: '0976 543 210', serviceName: 'Nhổ răng khôn thường', dentistId: 'D-01', dentistName: 'Bác sĩ Lê Minh', time: '10:15 AM', status: 'Pending' },
  { id: 'A-04', patientId: 'P-7721', patientName: 'Phạm Thu D', patientPhone: '0909 999 888', serviceName: 'Khám tổng quát & Tư vấn', dentistId: 'D-03', dentistName: 'Bác sĩ Mai Lan', time: '11:00 AM', status: 'Confirmed' }
];

export const INITIAL_QUEUE: QueueItem[] = [
  { id: 'Q-01', patientId: 'P-5021', patientName: 'Đặng Minh Khoa', dentistId: 'D-02', dentistName: 'Bác sĩ Hoàng Nam', room: 'Phòng 105', status: 'Completed', checkInTime: '08:15 AM', waitTimeMin: 12, elapsedTimeMin: 45 },
  { id: 'P-8821', patientId: 'P-8821', patientName: 'Trần Nguyễn Minh', dentistId: 'D-04', dentistName: 'Bác sĩ Nguyễn Hương', room: 'Phòng 110', status: 'In Chair', checkInTime: '08:30 AM', waitTimeMin: 15, elapsedTimeMin: 24 },
  { id: 'Q-03', patientId: 'P-4490', patientName: 'Trần Thị B', dentistId: 'D-02', dentistName: 'Bác sĩ Hoàng Nam', room: 'Phòng 105', status: 'In Chair', checkInTime: '08:45 AM', waitTimeMin: 5, elapsedTimeMin: 12 },
  { id: 'Q-04', patientId: 'P-5022', patientName: 'Nguyễn Thùy Linh', dentistId: 'D-01', dentistName: 'Bác sĩ Lê Minh', room: 'X-Quang', status: 'Waiting', checkInTime: '09:10 AM', waitTimeMin: 10 },
  { id: 'Q-05', patientId: 'P-5023', patientName: 'Lý Kiều Trinh', dentistId: 'D-01', dentistName: 'Bác sĩ Lê Minh', room: 'Phòng 102', status: 'Waiting', checkInTime: '09:15 AM', waitTimeMin: 5 }
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-9021', patientId: 'P-0012', patientName: 'Trần Hoàng Nam', patientPhone: '0901 234 567', services: [{ serviceId: 'S-04', serviceName: 'Nhổ răng khôn thường (x2)', price: 3500000 }], totalPrice: 3500000, insuranceDiscount: 630000, memberDiscount: 70000, netPrice: 2800000, status: 'Pending', createdAt: '2026-06-05T09:00:00Z' },
  { id: 'INV-8994', patientId: 'P-4490', patientName: 'Lê Thị Mai', patientPhone: '0912 888 999', services: [{ serviceId: 'S-03', serviceName: 'Trám răng thẩm mỹ (x1)', price: 850000 }], totalPrice: 850000, insuranceDiscount: 0, memberDiscount: 0, netPrice: 850000, status: 'Pending', createdAt: '2026-06-04T15:30:00Z' },
  { id: 'INV-9023', patientId: 'P-3129', patientName: 'Phạm Văn Đức', patientPhone: '0987 654 321', services: [{ serviceId: 'S-01', serviceName: 'Lấy cao răng & Vệ sinh', price: 300000 }], totalPrice: 300000, insuranceDiscount: 0, memberDiscount: 0, netPrice: 300000, status: 'Pending', createdAt: '2026-06-05T09:45:00Z' }
];

export const INITIAL_LOGS: ClinicLog[] = [
  { id: 'L-01', time: '12:30:14', module: 'AUTH', type: 'INFO', message: 'Bác sĩ Nguyễn Hương đăng nhập vào hệ thống thành công qua cổng OAuth2.' },
  { id: 'L-02', time: '12:34:02', module: 'CASHIER', type: 'SUCCESS', message: 'Giao dịch thành công: Hóa đơn #INV-9213 đã được thanh toán qua ZaloPay.' },
  { id: 'L-03', time: '12:35:10', module: 'SYSTEM', type: 'WARN', message: 'Cảnh báo: Hàng chờ tại Quầy lễ tân phát sinh tải lượng cao (> 5 bệnh nhân đang chờ).' },
  { id: 'L-04', time: '12:38:45', module: 'SYSTEM', type: 'INFO', message: 'Sao lưu dữ liệu hồ sơ bệnh án tự động hoàn tất. Tình trạng DB: Khỏe mạnh.' },
  { id: 'L-05', time: '12:40:01', module: 'RECEPTION', type: 'INFO', message: 'Đăng ký bệnh nhân mới thành công: ID-29402 - Đặng Minh Khoa.' },
  { id: 'L-06', time: '12:41:22', module: 'SYSTEM', type: 'ERR', message: 'Lỗi Timeout kết nối dịch vụ SMS Gateway (không gửi được tin nhắc hẹn).' },
  { id: 'L-07', time: '12:42:00', module: 'SYSTEM', type: 'SUCCESS', message: 'Tự động phục hồi kết nối dịch vụ SMS Gateway thành công. Đã gửi bù 3 tin nhắn.' }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  { id: 'MR-01', patientId: 'P-8821', title: 'Chụp X-quang Chỉnh nha Toàn cảnh (Panorama)', date: '24 Tháng 10, 2025', size: '4.2 MB', type: 'pdf' },
  { id: 'MR-02', patientId: 'P-8821', title: 'Ảnh tiến trình niềng răng mặt ngoài', date: '10 Tháng 10, 2025', size: '1.8 MB', type: 'image' },
  { id: 'MR-03', patientId: 'P-8821', title: 'Đơn thuốc giảm đau hậu phẫu răng khôn', date: '28 Tháng 09, 2025', size: '120 KB', type: 'prescription', notes: 'Uống Paracetamol 500mg, 1 viên mỗi 6 giờ khi đau.' },
  {
    id: 'MR-04',
    patientId: 'P-9902',
    title: 'Hồ sơ bệnh án phục hình răng hàm dưới',
    date: '12 Tháng 10, 2025',
    size: '1.2 MB',
    type: 'pdf',
    notes: 'Lấy cao răng toàn hàm. Hàn răng sâu số 46 bằng Composite.',
    teethMap: [
      { toothNumber: 46, condition: 'decay', treatment: 'Hàn răng Composite' },
      { toothNumber: 38, condition: 'missing', treatment: 'Đã nhổ' }
    ]
  }
];
