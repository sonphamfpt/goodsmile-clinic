import React, { useState } from 'react';
import { Icon } from '../../../components/Icon';
import { useClinic } from '../../../context/ClinicContext';

const MSG_TEMPLATES = [
  {
    id: 'remind_24h',
    label: 'Nhắc hẹn 24 giờ trước',
    icon: 'schedule',
    color: 'text-primary bg-primary-container border-primary/20',
    channels: ['SMS', 'Zalo'],
    content: 'Kính gửi {{TÊN}}, phòng khám GoodSmile trân trọng nhắc nhở lịch hẹn của Quý khách vào {{GIỜ}} ngày {{NGÀY}} tại {{PHÒNG}}. Bác sĩ phụ trách: {{BÁC SĨ}}. Vui lòng đến sớm 10 phút. Nếu cần thay đổi, gọi: 1900-XXXX.',
  },
  {
    id: 'confirm_booking',
    label: 'Xác nhận đặt lịch',
    icon: 'check_circle',
    color: 'text-secondary bg-secondary-container border-secondary/20',
    channels: ['SMS', 'Zalo', 'Email'],
    content: 'Xin chào {{TÊN}}! GoodSmile đã xác nhận lịch hẹn của bạn vào lúc {{GIỜ}} ngày {{NGÀY}}. Dịch vụ: {{DỊCH VỤ}}. Bác sĩ: {{BÁC SĨ}}. Mang theo: CMND/CCCD và bảo hiểm y tế (nếu có).',
  },
  {
    id: 'post_treatment',
    label: 'Chăm sóc sau điều trị',
    icon: 'healing',
    color: 'text-purple-700 bg-purple-100 border-purple-200',
    channels: ['Zalo', 'Email'],
    content: 'Kính gửi {{TÊN}}, cảm ơn Quý khách đã tin tưởng GoodSmile! Sau điều trị hôm nay, hãy lưu ý: Không ăn uống trong 2 giờ, tránh thức ăn cứng, uống thuốc theo đơn. Nếu có bất thường, liên hệ ngay: 1900-XXXX.',
  },
  {
    id: 'birthday',
    label: 'Chúc mừng sinh nhật',
    icon: 'celebration',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    channels: ['Zalo'],
    content: '🎂 Chúc mừng sinh nhật {{TÊN}}! GoodSmile xin gửi đến bạn lời chúc tốt đẹp nhất. Nhân dịp đặc biệt này, chúng tôi tặng bạn voucher ưu đãi 15% cho lần khám tới. Hạn dùng: 30 ngày. Code: BDAY2026.',
  },
  {
    id: 'periodic_recall',
    label: 'Nhắc tái khám định kỳ',
    icon: 'event_repeat',
    color: 'text-on-surface bg-surface-container border-outline-variant',
    channels: ['SMS', 'Zalo'],
    content: 'Kính gửi {{TÊN}}, đã 6 tháng kể từ lần khám gần nhất. GoodSmile nhắc nhở Quý khách đặt lịch kiểm tra sức khỏe răng miệng định kỳ. Đặt lịch nhanh: goodsmile.vn/booking hoặc gọi 1900-XXXX.',
  },
];

type Channel = 'SMS' | 'Zalo' | 'Email';

interface SendLog {
  id: string;
  time: string;
  template: string;
  channel: Channel;
  count: number;
  status: 'success' | 'partial' | 'failed';
}

const MOCK_LOGS: SendLog[] = [
  { id: 'LOG-01', time: '09:15 AM', template: 'Nhắc hẹn 24 giờ trước', channel: 'Zalo', count: 4, status: 'success' },
  { id: 'LOG-02', time: '08:50 AM', template: 'Xác nhận đặt lịch', channel: 'SMS', count: 2, status: 'success' },
  { id: 'LOG-03', time: '08:30 AM', template: 'Chăm sóc sau điều trị', channel: 'Zalo', count: 3, status: 'partial' },
  { id: 'LOG-04', time: 'Hôm qua', template: 'Nhắc tái khám định kỳ', channel: 'SMS', count: 12, status: 'success' },
  { id: 'LOG-05', time: 'Hôm qua', template: 'Chúc mừng sinh nhật', channel: 'Zalo', count: 1, status: 'failed' },
];

const STATUS_LOG_CONFIG = {
  success: { label: 'Thành công', badge: 'bg-secondary-container text-on-secondary-container', icon: 'check_circle' },
  partial: { label: 'Một phần', badge: 'bg-amber-100 text-amber-800', icon: 'warning' },
  failed: { label: 'Thất bại', badge: 'bg-error-container text-error', icon: 'error' },
};

export const ReceptionistReminders: React.FC = () => {
  const { appointments, patients } = useClinic();

  const [selectedTemplate, setSelectedTemplate] = useState(MSG_TEMPLATES[0].id);
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(['Zalo']);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<null | { count: number; channel: string }>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [logs, setLogs] = useState<SendLog[]>(MOCK_LOGS);

  const template = MSG_TEMPLATES.find(t => t.id === selectedTemplate)!;

  const allRecipients = [
    ...patients.map(p => ({ id: p.id, name: p.name, phone: p.phone, type: 'Bệnh nhân', tier: p.tier })),
    ...appointments.map(a => ({ id: `A-${a.id}`, name: a.patientName, phone: a.patientPhone, type: 'Có lịch hẹn hôm nay', tier: '' })),
  ].reduce<Array<{ id: string; name: string; phone: string; type: string; tier: string }>>((acc, curr) => {
    if (!acc.some(r => r.phone === curr.phone)) acc.push(curr);
    return acc;
  }, []);

  const toggleChannel = (ch: Channel) => {
    setSelectedChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const toggleRecipient = (id: string) => {
    setSelectedRecipients(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelectedRecipients(allRecipients.map(r => r.id));
  };

  const handleSend = () => {
    if (selectedChannels.length === 0) { alert('Chọn ít nhất 1 kênh gửi!'); return; }
    const count = selectedRecipients.length || allRecipients.length;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSendResult({ count, channel: selectedChannels.join(' + ') });
      const newLog: SendLog = {
        id: `LOG-${Date.now()}`,
        time: 'Vừa xong',
        template: template.label,
        channel: selectedChannels[0] as Channel,
        count,
        status: 'success',
      };
      setLogs(prev => [newLog, ...prev]);
    }, 2000);
  };

  const previewContent = template.content
    .replace('{{TÊN}}', 'Nguyễn Văn A')
    .replace('{{GIỜ}}', '09:00 AM')
    .replace('{{NGÀY}}', '06/06/2026')
    .replace('{{PHÒNG}}', 'Phòng 102')
    .replace('{{BÁC SĨ}}', 'Bác sĩ Lê Minh')
    .replace('{{DỊCH VỤ}}', 'Khám tổng quát');

  return (
    <div className="p-stack-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Gửi Zalo/SMS nhắc lịch</h2>
        <p className="text-body-md text-on-surface-variant mt-1">Gửi thông báo tự động và nhắc nhở lịch hẹn đến bệnh nhân</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Compose panel */}
        <div className="col-span-12 lg:col-span-7 space-y-5">

          {/* Template selection */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-5">
            <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2 text-sm uppercase text-on-surface-variant tracking-wider">
              <Icon name="article" className="text-[18px]" />
              Chọn mẫu tin nhắn
            </h4>
            <div className="space-y-2">
              {MSG_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t.id); setSendResult(null); }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedTemplate === t.id ? 'border-primary bg-primary-container/10 shadow-sm' : 'border-outline-variant hover:border-primary/30'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>
                        <Icon name={t.icon} className="text-[20px]" />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${selectedTemplate === t.id ? 'text-primary' : 'text-on-surface'}`}>{t.label}</p>
                        <p className="text-xs text-on-surface-variant">{t.channels.join(' • ')}</p>
                      </div>
                    </div>
                    {selectedTemplate === t.id && (
                      <Icon name="check_circle" className="text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Channel selection */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-5">
            <h4 className="font-bold text-sm uppercase text-on-surface-variant tracking-wider mb-3 flex items-center gap-2">
              <Icon name="send" className="text-[18px]" />
              Kênh gửi
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { ch: 'Zalo' as Channel, icon: '💬', color: 'border-teal-400 bg-teal-50 text-teal-700', available: template.channels.includes('Zalo') },
                { ch: 'SMS' as Channel, icon: '📱', color: 'border-blue-400 bg-blue-50 text-blue-700', available: template.channels.includes('SMS') },
                { ch: 'Email' as Channel, icon: '📧', color: 'border-purple-400 bg-purple-50 text-purple-700', available: template.channels.includes('Email') },
              ].map(opt => (
                <button
                  key={opt.ch}
                  type="button"
                  disabled={!opt.available}
                  onClick={() => toggleChannel(opt.ch)}
                  className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    !opt.available ? 'opacity-40 cursor-not-allowed border-outline-variant bg-surface-container-low' :
                    selectedChannels.includes(opt.ch) ? `${opt.color} border-2 shadow-sm font-bold` : 'border-outline-variant hover:border-primary/30 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">{opt.icon}</div>
                  <p className={`text-sm font-bold ${selectedChannels.includes(opt.ch) ? '' : 'text-on-surface-variant'}`}>{opt.ch}</p>
                  {!opt.available && <p className="text-[10px] text-on-surface-variant">Không hỗ trợ</p>}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <Icon name="preview" className="text-[18px]" />
                Xem trước nội dung
              </h4>
              <button onClick={() => setPreviewMode(!previewMode)} className="text-xs text-primary font-bold cursor-pointer">{previewMode ? 'Ẩn' : 'Xem trước'}</button>
            </div>
            <div className="p-5">
              {previewMode ? (
                <div className="bg-slate-50 rounded-xl p-4 border border-outline-variant">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">GS</div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">GoodSmile Clinic</p>
                      <p className="text-[10px] text-on-surface-variant">OA Zalo</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-outline-variant/50 max-w-xs">
                    <p className="text-xs text-on-surface leading-relaxed">{previewContent}</p>
                    <p className="text-[10px] text-on-surface-variant mt-2 text-right">09:15 AM ✓✓</p>
                  </div>
                </div>
              ) : (
                <textarea
                  value={template.content}
                  readOnly
                  rows={4}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-xs text-on-surface-variant resize-none focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Send button */}
          <div className="flex gap-3">
            <button
              onClick={handleSend}
              disabled={sending || selectedChannels.length === 0}
              className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                sending ? 'bg-outline text-on-surface-variant cursor-wait' : 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
              }`}
            >
              {sending ? (
                <>
                  <Icon name="refresh" className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Icon name="send" />
                  Gửi ngay cho {selectedRecipients.length > 0 ? `${selectedRecipients.length} người` : 'tất cả'}
                </>
              )}
            </button>
            <button
              onClick={() => alert('Đã lên lịch gửi tự động vào 8:00 AM mỗi ngày!')}
              className="px-5 py-3.5 border border-outline text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all cursor-pointer flex items-center gap-2"
            >
              <Icon name="schedule_send" />
              Hẹn giờ
            </button>
          </div>

          {/* Send success */}
          {sendResult && (
            <div className="p-4 bg-secondary-container border border-secondary/20 rounded-xl flex items-center gap-3">
              <Icon name="check_circle" className="text-secondary text-3xl" />
              <div>
                <p className="font-bold text-on-secondary-container">Gửi thành công!</p>
                <p className="text-xs text-on-secondary-container/80">
                  Đã gửi <strong>{sendResult.count}</strong> tin nhắn qua <strong>{sendResult.channel}</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Recipients + Logs */}
        <div className="col-span-12 lg:col-span-5 space-y-5">

          {/* Recipient list */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <Icon name="group" className="text-[18px]" />
                Danh sách gửi ({allRecipients.length} người)
              </h4>
              <button onClick={selectAll} className="text-xs text-primary font-bold cursor-pointer hover:underline">Chọn tất cả</button>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar divide-y divide-outline-variant">
              {allRecipients.map(r => (
                <label key={r.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedRecipients.includes(r.id)}
                    onChange={() => toggleRecipient(r.id)}
                    className="rounded text-primary"
                  />
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold shrink-0">
                    {r.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{r.name}</p>
                    <p className="text-xs text-on-surface-variant">{r.phone} • {r.type}</p>
                  </div>
                  {r.tier && r.tier !== 'Standard' && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${r.tier === 'Platinum' ? 'bg-primary-container text-on-primary-container' : 'bg-amber-100 text-amber-800'}`}>
                      {r.tier}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Send history log */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
              <Icon name="history" className="text-[18px] text-on-surface-variant" />
              <h4 className="font-bold text-sm text-on-surface">Lịch sử gửi tin</h4>
            </div>
            <div className="divide-y divide-outline-variant">
              {logs.map(log => {
                const conf = STATUS_LOG_CONFIG[log.status];
                return (
                  <div key={log.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container-low transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${conf.badge}`}>
                      <Icon name={conf.icon} className="text-[18px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{log.template}</p>
                      <p className="text-xs text-on-surface-variant">{log.time} • {log.channel} • {log.count} người</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${conf.badge}`}>{conf.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Tin hôm nay', value: 9, icon: 'today', color: 'text-primary' },
              { label: 'Tỉ lệ đọc', value: '87%', icon: 'mark_email_read', color: 'text-secondary' },
              { label: 'Opt-out', value: 2, icon: 'unsubscribe', color: 'text-error' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-outline-variant p-3 text-center shadow-sm">
                <Icon name={s.icon} className={`text-[24px] ${s.color} block mb-1`} />
                <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-on-surface-variant font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
