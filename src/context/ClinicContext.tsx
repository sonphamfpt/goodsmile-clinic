import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Service, Dentist, Patient, Appointment, QueueItem, Invoice, ClinicLog, MedicalRecord, ToothState, InvoiceItem } from '../types/clinic';
import {
  INITIAL_SERVICES,
  INITIAL_DENTISTS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_QUEUE,
  INITIAL_INVOICES,
  INITIAL_LOGS,
  INITIAL_MEDICAL_RECORDS
} from '../services/mockData';

interface ClinicContextType {
  services: Service[];
  dentists: Dentist[];
  patients: Patient[];
  appointments: Appointment[];
  queue: QueueItem[];
  invoices: Invoice[];
  logs: ClinicLog[];
  medicalRecords: MedicalRecord[];
  addLog: (module: ClinicLog['module'], type: ClinicLog['type'], message: string) => void;
  checkInPatient: (patientId: string, dentistId: string, customRoom?: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Appointment;
  startTreatment: (queueId: string) => void;
  completeTreatment: (
    queueId: string,
    treatments: ToothState[],
    notes: string,
    performedServices: string[] // service ids
  ) => void;
  processPayment: (invoiceId: string, paymentMethod: Invoice['paymentMethod']) => void;
  addService: (service: Omit<Service, 'id' | 'isActive'>) => void;
  updateServicePrice: (serviceId: string, newPrice: number) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'points' | 'tier' | 'balance'>) => Patient;
  rechargeWallet: (patientId: string, amount: number) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [dentists, setDentists] = useState<Dentist[]>(INITIAL_DENTISTS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [logs, setLogs] = useState<ClinicLog[]>(INITIAL_LOGS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);

  // Auto-increment elapsed time for active treatments in queue to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue((prevQueue) =>
        prevQueue.map((item) => {
          if (item.status === 'In Chair' && item.elapsedTimeMin !== undefined) {
            return { ...item, elapsedTimeMin: item.elapsedTimeMin + 1 };
          }
          if (item.status === 'Waiting') {
            return { ...item, waitTimeMin: item.waitTimeMin + 1 };
          }
          return item;
        })
      );
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const addLog = (module: ClinicLog['module'], type: ClinicLog['type'], message: string) => {
    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    const newLog: ClinicLog = {
      id: `L-${Math.random().toString(36).substr(2, 9)}`,
      time,
      module,
      type,
      message
    };
    setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 100)); // cap at 100 logs
  };

  const addPatient = (newPatientData: Omit<Patient, 'id' | 'points' | 'tier' | 'balance'>) => {
    const id = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      ...newPatientData,
      id,
      balance: 0,
      tier: 'Standard',
      points: 100
    };
    setPatients((prev) => [...prev, newPatient]);
    addLog('RECEPTION', 'SUCCESS', `Bệnh nhân mới đăng ký: ${newPatient.name} (ID: ${id})`);
    return newPatient;
  };

  const rechargeWallet = (patientId: string, amount: number) => {
    setPatients((prevPatients) =>
      prevPatients.map((p) => {
        if (p.id === patientId) {
          const newBalance = p.balance + amount;
          let tier = p.tier;
          // Upgrade tiers based on total balance/points mock
          const newPoints = p.points + Math.floor(amount / 10000);
          if (newPoints >= 8000) tier = 'Diamond';
          else if (newPoints >= 3000) tier = 'Platinum';
          else if (newPoints >= 1500) tier = 'Gold';
          
          addLog('SYSTEM', 'SUCCESS', `Bệnh nhân ${p.name} nạp ₫${amount.toLocaleString()} vào ví. Số dư mới: ₫${newBalance.toLocaleString()}`);
          return { ...p, balance: newBalance, points: newPoints, tier };
        }
        return p;
      })
    );
  };

  const checkInPatient = (patientId: string, dentistId: string, customRoom?: string) => {
    const patient = patients.find((p) => p.id === patientId);
    const dentist = dentists.find((d) => d.id === dentistId);
    if (!patient || !dentist) return;

    // Check if already in queue
    if (queue.some((q) => q.patientId === patientId && q.status !== 'Completed')) {
      addLog('RECEPTION', 'WARN', `Bệnh nhân ${patient.name} đã ở trong hàng chờ.`);
      return;
    }

    const room = customRoom || dentist.room;
    const checkInTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const newQueueItem: QueueItem = {
      id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId,
      patientName: patient.name,
      dentistId,
      dentistName: dentist.name,
      room,
      status: 'Waiting',
      checkInTime,
      waitTimeMin: 0
    };

    setQueue((prev) => [...prev, newQueueItem]);
    addLog('RECEPTION', 'INFO', `Bệnh nhân ${patient.name} check-in thành công. Phòng khám: ${room} - ${dentist.name}.`);
  };

  const addAppointment = (apptData: Omit<Appointment, 'id' | 'status'>) => {
    const id = `A-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppt: Appointment = {
      ...apptData,
      id,
      status: 'Confirmed'
    };
    setAppointments((prev) => [...prev, newAppt]);
    addLog('RECEPTION', 'SUCCESS', `Lịch hẹn mới được đăng ký: Bệnh nhân ${apptData.patientName} lúc ${apptData.time}.`);
    return newAppt;
  };

  const startTreatment = (queueId: string) => {
    setQueue((prevQueue) =>
      prevQueue.map((item) => {
        if (item.id === queueId) {
          addLog('DENTIST', 'INFO', `Bác sĩ ${item.dentistName} bắt đầu điều trị cho bệnh nhân ${item.patientName} tại ${item.room}.`);
          return { ...item, status: 'In Chair', elapsedTimeMin: 0 };
        }
        return item;
      })
    );
  };

  const completeTreatment = (
    queueId: string,
    treatments: ToothState[],
    notes: string,
    performedServices: string[]
  ) => {
    const queueItem = queue.find((q) => q.id === queueId);
    if (!queueItem) return;

    // 1. Update queue status
    setQueue((prevQueue) =>
      prevQueue.map((item) => {
        if (item.id === queueId) {
          return { ...item, status: 'Completed' };
        }
        return item;
      })
    );

    // 2. Add Medical Record
    const patient = patients.find((p) => p.id === queueItem.patientId);
    const dateStr = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const recordId = `MR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: MedicalRecord = {
      id: recordId,
      patientId: queueItem.patientId,
      title: performedServices.length > 0
        ? `Điều trị: ${services.find(s => s.id === performedServices[0])?.name || 'Khám tổng quát'}`
        : 'Khám lâm sàng',
      date: dateStr,
      size: '150 KB',
      type: treatments.length > 0 ? 'pdf' : 'prescription',
      notes,
      teethMap: treatments
    };

    setMedicalRecords((prev) => [newRecord, ...prev]);

    // 3. Compile invoice items
    const invoiceItems: InvoiceItem[] = performedServices.map((id) => {
      const service = services.find((s) => s.id === id);
      return {
        serviceId: id,
        serviceName: service?.name || 'Dịch vụ nha khoa',
        price: service?.price || 0
      };
    });

    const totalPrice = invoiceItems.reduce((sum, item) => sum + item.price, 0);

    // Apply discount logic
    // 15% insurance if patient has conditions or mock insurance
    const insuranceDiscount = patient?.condition ? Math.round(totalPrice * 0.15) : 0;
    
    // Tier discounts: Platinum (5%), Gold (2%), Diamond (10%)
    let tierDiscountPercent = 0;
    if (patient?.tier === 'Diamond') tierDiscountPercent = 0.10;
    else if (patient?.tier === 'Platinum') tierDiscountPercent = 0.05;
    else if (patient?.tier === 'Gold') tierDiscountPercent = 0.02;

    const memberDiscount = Math.round(totalPrice * tierDiscountPercent);
    const netPrice = totalPrice - insuranceDiscount - memberDiscount;

    const invoiceId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: Invoice = {
      id: invoiceId,
      patientId: queueItem.patientId,
      patientName: queueItem.patientName,
      patientPhone: patient?.phone || 'Chưa cập nhật',
      services: invoiceItems,
      totalPrice,
      insuranceDiscount,
      memberDiscount,
      netPrice,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    addLog(
      'DENTIST',
      'SUCCESS',
      `Bác sĩ ${queueItem.dentistName} hoàn tất ca khám của ${queueItem.patientName}. Chuyển hóa đơn ${invoiceId} (₫${netPrice.toLocaleString()}) sang thu ngân.`
    );
  };

  const processPayment = (invoiceId: string, paymentMethod: Invoice['paymentMethod']) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    // Deduct from wallet if patient is using wallet
    if (paymentMethod === 'Card' && invoice.patientId) {
      // In our mock, if they use "Membership Wallet" (which falls under card/POS or we can trigger wallet logic):
      // Let's implement actual wallet check: if patient has wallet balance, let's allow wallet pay.
      // We will check if patient has enough balance:
    }

    setInvoices((prevInvoices) =>
      prevInvoices.map((inv) => {
        if (inv.id === invoiceId) {
          return { ...inv, status: 'Paid', paymentMethod };
        }
        return inv;
      })
    );

    // Reward points to patient: 1 point for every 10,000đ spent
    setPatients((prevPatients) =>
      prevPatients.map((p) => {
        if (p.id === invoice.patientId) {
          let updatedBalance = p.balance;
          if (paymentMethod === 'Card') {
            // Deduct from wallet if they pay from membership wallet
            // Let's check if we want to deduct from wallet balance
            if (p.balance >= invoice.netPrice) {
              updatedBalance = p.balance - invoice.netPrice;
            }
          }
          const addedPoints = Math.floor(invoice.netPrice / 10000);
          const newPoints = p.points + addedPoints;
          let tier = p.tier;
          if (newPoints >= 8000) tier = 'Diamond';
          else if (newPoints >= 3000) tier = 'Platinum';
          else if (newPoints >= 1500) tier = 'Gold';

          return {
            ...p,
            balance: updatedBalance,
            points: newPoints,
            tier
          };
        }
        return p;
      })
    );

    addLog(
      'CASHIER',
      'SUCCESS',
      `Hóa đơn ${invoiceId} đã được thanh toán thành công bằng [${paymentMethod}] cho bệnh nhân ${invoice.patientName}.`
    );
  };

  const addService = (newServiceData: Omit<Service, 'id' | 'isActive'>) => {
    const id = `S-${Math.floor(10 + Math.random() * 90)}`;
    const newService: Service = {
      ...newServiceData,
      id,
      isActive: true
    };
    setServices((prev) => [...prev, newService]);
    addLog('SYSTEM', 'SUCCESS', `Cấu hình thêm dịch vụ mới: ${newServiceData.name} - Giá: ₫${newServiceData.price.toLocaleString()}`);
  };

  const updateServicePrice = (serviceId: string, newPrice: number) => {
    setServices((prevServices) =>
      prevServices.map((s) => {
        if (s.id === serviceId) {
          addLog('SYSTEM', 'SUCCESS', `Cấu hình cập nhật giá dịch vụ ${s.name}: ₫${s.price.toLocaleString()} -> ₫${newPrice.toLocaleString()}`);
          return { ...s, price: newPrice };
        }
        return s;
      })
    );
  };

  return (
    <ClinicContext.Provider
      value={{
        services,
        dentists,
        patients,
        appointments,
        queue,
        invoices,
        logs,
        medicalRecords,
        addLog,
        checkInPatient,
        addAppointment,
        startTreatment,
        completeTreatment,
        processPayment,
        addService,
        updateServicePrice,
        addPatient,
        rechargeWallet
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
