import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert('Vui lòng nhập đầy đủ các trường thông tin bắt buộc!');
      return;
    }
    
    // Simulate API request
    setIsSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-background min-h-screen py-stack-lg px-container-padding-desktop">
      <div className="max-w-5xl mx-auto space-y-stack-lg animate-in fade-in duration-200">
        
        {/* Title */}
        <div className="text-center space-y-stack-sm">
          <h1 className="font-headline-lg text-headline-lg text-primary">Liên Hệ Với GoodSmile</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Hệ thống phòng khám mở cửa đón tiếp tất cả các ngày trong tuần. Hãy để lại tin nhắn hoặc gọi điện trực tiếp để nhận tư vấn kịp thời.
          </p>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Contact Details & Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm space-y-6">
              <h3 className="font-headline-sm text-headline-sm text-primary">Thông Tin Liên Hệ</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Địa chỉ hệ thống</h4>
                    <p className="text-body-md text-on-surface-variant">Tòa nhà FPT Polytechnic, Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Hotline khẩn cấp</h4>
                    <p className="text-body-md text-on-surface-variant font-bold text-primary">1900 6789 (Hỗ trợ 24/7)</p>
                    <p className="text-xs text-on-surface-variant">Điện thoại đặt lịch: (024) 7300 1900</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Thư điện tử</h4>
                    <p className="text-body-md text-on-surface-variant">contact@goodsmile.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Giờ làm việc</h4>
                    <p className="text-body-md text-on-surface-variant">Thứ 2 - Chủ nhật: 08:00 AM - 08:00 PM</p>
                    <p className="text-xs text-error font-semibold">* Làm việc cả ngày Lễ & Tết</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-surface-container rounded-xl border border-outline-variant h-64 relative overflow-hidden flex flex-col justify-end p-4 shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/40 flex-col gap-2">
                <span className="material-symbols-outlined text-[64px]">map</span>
                <span className="text-xs font-bold uppercase tracking-wider">Bản đồ vị trí phòng khám</span>
              </div>
              <div className="bg-white/90 p-3 rounded-lg border border-outline-variant relative z-10 text-xs shadow">
                <p className="font-bold text-primary">Nha Khoa GoodSmile</p>
                <p className="text-on-surface-variant">Kiều Mai, Phúc Diễn, Bắc Từ Liêm, Hà Nội</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-primary">Gửi Yêu Cầu Tư Vấn</h3>
              <p className="text-body-md text-on-surface-variant">
                Hãy gửi câu hỏi hoặc thắc mắc của bạn về tình trạng răng miệng, chúng tôi sẽ liên hệ lại qua điện thoại để giải đáp nhanh nhất.
              </p>

              {isSubmitted ? (
                <div className="bg-secondary-container/20 border border-secondary/30 p-6 rounded-lg text-center space-y-3">
                  <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <h4 className="font-bold text-on-secondary-container">Gửi thông tin thành công!</h4>
                  <p className="text-xs text-on-secondary-container">
                    Cảm ơn bạn đã liên hệ với GoodSmile. Đội ngũ tư vấn viên y khoa sẽ gọi điện hỗ trợ bạn trong vòng 15-30 phút.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-primary font-bold underline cursor-pointer"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
                      Họ và tên của bạn *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Thị Lan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
                        Số điện thoại liên lạc *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
                        Địa chỉ Email (Nếu có)
                      </label>
                      <input
                        type="email"
                        placeholder="lan.nguyen@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
                      Mô tả triệu chứng hoặc nhu cầu tư vấn *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Ví dụ: Răng tôi bị ê buốt khi dùng đồ ăn lạnh, muốn đặt khám tư vấn niềng răng..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg active:scale-95 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined">send</span>
                    GỬI YÊU CẦU TƯ VẤN MIỄN PHÍ
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
