import React from 'react';
import { Link } from 'react-router-dom';

export const AboutUs: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-body-md pb-20">
      
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00478d] via-[#005fa8] to-[#006d33] py-20 px-6 md:px-16 text-center text-white">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-4">
          <span className="text-white/80 font-bold tracking-widest uppercase text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Hành Trình Kiến Tạo Nụ Cười
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Về Nha Khoa GoodSmile
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-2xl leading-relaxed">
            Hơn một thập kỷ nỗ lực vì sức khỏe răng miệng của hàng vạn gia đình Việt, mang lại giải pháp nha khoa chuẩn mực, an toàn và chuyên sâu nhất.
          </p>
        </div>
      </section>

      {/* ── Intro Section (Story & Stats) ── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Stats */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white border border-[#e2e8f0] p-6 shadow-sm text-center">
              <span className="material-symbols-outlined text-[#005eb8] text-4xl">calendar_today</span>
              <p className="text-3xl font-extrabold text-[#0f172a] mt-2">10+</p>
              <p className="text-xs text-[#64748b] uppercase tracking-wider font-bold mt-1">Năm Thành Lập</p>
            </div>
            <div className="bg-white border border-[#e2e8f0] p-6 shadow-sm text-center">
              <span className="material-symbols-outlined text-[#15803d] text-4xl">group</span>
              <p className="text-3xl font-extrabold text-[#0f172a] mt-2">20k+</p>
              <p className="text-xs text-[#64748b] uppercase tracking-wider font-bold mt-1">Khách Hàng</p>
            </div>
            <div className="bg-white border border-[#e2e8f0] p-6 shadow-sm text-center">
              <span className="material-symbols-outlined text-amber-500 text-4xl">workspace_premium</span>
              <p className="text-3xl font-extrabold text-[#0f172a] mt-2">100%</p>
              <p className="text-xs text-[#64748b] uppercase tracking-wider font-bold mt-1">Bác Sĩ Chính Quy</p>
            </div>
            <div className="bg-white border border-[#e2e8f0] p-6 shadow-sm text-center">
              <span className="material-symbols-outlined text-[#be185d] text-4xl">hotel_class</span>
              <p className="text-3xl font-extrabold text-[#0f172a] mt-2">4.9★</p>
              <p className="text-xs text-[#64748b] uppercase tracking-wider font-bold mt-1">Đánh Giá Google</p>
            </div>
          </div>

          {/* Right: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#005eb8] font-bold text-xs uppercase tracking-widest bg-[#eff6ff] px-3 py-1 border border-[#bfdbfe]">
              Câu Chuyện Của Chúng Tôi
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] leading-tight">
              Kiến Tạo Nụ Cười Hạnh Phúc Bền Vững Bằng Sự Tận Tâm
            </h2>
            <p className="text-[#475569] text-base leading-relaxed">
              Thành lập từ năm 2016, Hệ thống Nha khoa GoodSmile ra đời với khát vọng nâng tầm chất lượng dịch vụ nha khoa tại Việt Nam. Chúng tôi tin rằng, một nụ cười đẹp không chỉ giúp nâng cao tính thẩm mỹ mà còn là chiếc chìa khóa mang lại sự tự tin, cải thiện trực tiếp chất lượng sống của mỗi cá nhân.
            </p>
            <p className="text-[#475569] text-base leading-relaxed">
              Bằng việc đi đầu trong cấy ghép Implant kỹ thuật số, chỉnh nha chuyên sâu và phục hình răng sứ thẩm mỹ bảo tồn răng thật tối đa, GoodSmile đã trở thành địa chỉ tin cậy được hàng vạn khách hàng lựa chọn để đồng hành chăm sóc sức khỏe nụ cười trọn đời.
            </p>
          </div>
        </div>
      </section>

      {/* ── Vision, Mission, Values Section ── */}
      <section className="py-16 bg-white border-t border-b border-[#e2e8f0] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Vision */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] p-8 space-y-4">
              <div className="bg-[#eff6ff] text-[#1d4ed8] w-12 h-12 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">visibility</span>
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">Tầm Nhìn Chiến Lược</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Trở thành thương hiệu nha khoa chuyên sâu kỹ thuật số chuẩn mực hàng đầu Việt Nam, mang đến chất lượng điều trị tương đương các bệnh viện quốc tế lớn ngay tại thị trường nội địa.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] p-8 space-y-4">
              <div className="bg-[#f0fdf4] text-[#15803d] w-12 h-12 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">track_changes</span>
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">Sứ Mệnh Y Khoa</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Đem lại giải pháp điều trị nha khoa dựa trên bằng chứng khoa học, hướng tới bảo tồn răng tự nhiên tối đa, bảo vệ sức khỏe lâu dài và kiến tạo nụ cười hạnh phúc bền vững cho mọi thế hệ.
              </p>
            </div>

            {/* Core Values */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] p-8 space-y-4">
              <div className="bg-[#fffbeb] text-[#d97706] w-12 h-12 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">award_star</span>
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">Giá Trị Cốt Lõi</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                <strong>Y Đức Hàng Đầu</strong> (Ethics) - Đặt y đức lên trên hết. <strong>Chất Lượng Vượt Trội</strong> (Quality) - Cam kết hiệu quả lâu dài. <strong>Công Nghệ Đi Đầu</strong> (Technology) - Tối ưu hóa điều trị.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Clinical Strengths & Sterile System ── */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#005eb8] font-bold text-xs uppercase tracking-widest bg-[#eff6ff] px-3 py-1 border border-[#bfdbfe]">
            Cam Kết Vượt Trội
          </span>
          <h2 className="text-3xl font-extrabold text-[#0f172a] mt-3">
            Hệ Thống Lâm Sàng Chuẩn Hóa Quốc Tế
          </h2>
          <p className="text-[#64748b] text-sm mt-2">
            Mỗi chi tiết tại GoodSmile đều được thiết kế để mang lại trải nghiệm khám chữa bệnh an toàn, thư giãn và hiệu quả cao nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-[#e2e8f0] p-6 md:p-8 flex gap-4 items-start shadow-sm">
            <div className="bg-[#eff6ff] text-[#1d4ed8] p-3 rounded shrink-0">
              <span className="material-symbols-outlined text-[28px] block">clean_hands</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0f172a] mb-2">Phòng Khám Vô Trùng Khép Kín</h4>
              <p className="text-sm text-[#475569] leading-relaxed">
                Được trang bị lò hấp sấy dụng cụ công nghệ chân không Class B hiện đại, phòng vô trùng trung tâm đạt tiêu chuẩn Bộ Y Tế đảm bảo loại bỏ 100% mọi tác nhân gây nhiễm chéo.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-6 md:p-8 flex gap-4 items-start shadow-sm">
            <div className="bg-[#eff6ff] text-[#1d4ed8] p-3 rounded shrink-0">
              <span className="material-symbols-outlined text-[28px] block">biotech</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0f172a] mb-2">Trang Thiết Bị Kỹ Thuật Số</h4>
              <p className="text-sm text-[#475569] leading-relaxed">
                Quy trình chẩn đoán hình ảnh kỹ thuật số toàn diện: Hệ thống chụp phim Cone Beam CT, máy scan dấu răng trong miệng 3D giúp nâng cao độ chính xác, rút ngắn 50% thời gian điều trị.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-6 md:p-8 flex gap-4 items-start shadow-sm">
            <div className="bg-[#eff6ff] text-[#1d4ed8] p-3 rounded shrink-0">
              <span className="material-symbols-outlined text-[28px] block">patient_list</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0f172a] mb-2">Phác Đồ Cá Nhân Hóa</h4>
              <p className="text-sm text-[#475569] leading-relaxed">
                Mỗi bệnh nhân tại GoodSmile đều được lập bệnh án điện tử và phác đồ điều trị trực quan riêng biệt. Mọi chi phí, thời gian và cam kết kết quả điều trị đều công khai rõ ràng từ đầu.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-6 md:p-8 flex gap-4 items-start shadow-sm">
            <div className="bg-[#eff6ff] text-[#1d4ed8] p-3 rounded shrink-0">
              <span className="material-symbols-outlined text-[28px] block">volunteer_activism</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0f172a] mb-2">Chăm Sóc Chu Đáo Hậu Phẫu</h4>
              <p className="text-sm text-[#475569] leading-relaxed">
                Chúng tôi đồng hành cùng khách hàng trước, trong và cả sau khi kết thúc điều trị. Chế độ bảo hành bằng thẻ điện tử toàn diện giúp khách hàng luôn an tâm về nụ cười của mình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Call to Action Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#00478d] to-[#006d33] py-16 px-6 md:px-16 text-center text-white">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Khám Phá Giải Pháp Răng Hàm Chuyên Sâu Cùng Chúng Tôi
          </h2>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Hội đồng y khoa GoodSmile luôn sẵn sàng lắng nghe và đưa ra phác đồ tối ưu nhất cho tình trạng răng miệng của bạn.
          </p>
          <div className="pt-2 flex gap-4 justify-center">
            <Link
              to="/book"
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-3.5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              Đặt Lịch Hẹn Ngay
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
