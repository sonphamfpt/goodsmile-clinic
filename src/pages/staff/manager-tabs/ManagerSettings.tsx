import React, { useState } from 'react';
import { Icon } from '../../../components/Icon';
import { useClinic } from '../../../context/ClinicContext';

export const ManagerSettings: React.FC = () => {
  const { services, updateServicePrice, addService, toggleServiceActive } = useClinic();

  // Price Edit states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState('0');

  // New Service states
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('30');

  const handleEditPriceClick = (id: string, currentPrice: number) => {
    setEditingServiceId(id);
    setEditingPrice(currentPrice.toString());
  };

  const handleSavePrice = (id: string) => {
    const priceNum = parseInt(editingPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Vui lòng nhập giá tiền hợp lệ!');
      return;
    }
    updateServicePrice(id, priceNum);
    setEditingServiceId(null);
    alert('Cập nhật đơn giá dịch vụ thành công!');
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(newServicePrice);
    const durationNum = parseInt(newServiceDuration);

    if (!newServiceName || isNaN(priceNum) || isNaN(durationNum)) {
      alert('Vui lòng nhập đầy đủ thông tin dịch vụ mới!');
      return;
    }

    addService({
      name: newServiceName,
      price: priceNum,
      durationMin: durationNum
    });

    setNewServiceName('');
    setNewServicePrice('');
    setNewServiceDuration('30');
    setShowAddService(false);
    alert('Thêm dịch vụ mới thành công!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="settings" className="text-purple-600 font-bold" />
          <div>
            <h3 className="font-bold text-on-surface">Cấu Hình Bảng Giá Dịch Vụ</h3>
            <p className="text-xs text-on-surface-variant">Thiết lập đơn giá điều trị nha khoa, thời gian làm việc ước tính</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setShowAddService(true)}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-primary-container transition-all cursor-pointer shadow-md"
          >
            <Icon name="add" className="text-sm" /> Thêm dịch vụ mới
          </button>
        </div>
      </div>

      {/* Grid of services */}
      <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-slate-50 p-4 rounded-xl border relative overflow-hidden flex flex-col justify-between transition-all ${
                service.isActive
                  ? 'border-outline-variant/50 hover:border-purple-600'
                  : 'border-outline-variant/30 opacity-50'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${service.isActive ? 'bg-purple-600' : 'bg-slate-300'}`}></div>
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-outline-variant font-data-mono uppercase">ID: {service.id}</span>
                <h4 className="font-bold text-xs text-on-surface leading-snug min-h-8">{service.name}</h4>

                {editingServiceId === service.id ? (
                  <div className="flex items-center gap-1.5 pt-1.5">
                    <input
                      type="number"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                      className="w-24 bg-white border border-outline-variant rounded px-2 py-1 text-xs font-bold font-data-mono focus:outline-none"
                    />
                    <button
                      onClick={() => handleSavePrice(service.id)}
                      className="p-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700 cursor-pointer"
                    >
                      Lưu
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-baseline pt-1">
                    <p className="text-xs font-extrabold text-purple-700">₫{service.price.toLocaleString()}</p>
                    {service.isActive && (
                      <button
                        onClick={() => handleEditPriceClick(service.id, service.price)}
                        className="text-[9px] text-primary hover:underline font-bold cursor-pointer"
                      >
                        Sửa giá
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-outline-variant/30 mt-3 text-[9px] text-on-surface-variant flex justify-between items-center">
                <span>Thời gian: {service.durationMin} phút</span>
                <button
                  onClick={() => toggleServiceActive(service.id)}
                  className={`font-bold cursor-pointer px-1.5 py-0.5 rounded text-[9px] transition-all ${
                    service.isActive
                      ? 'text-secondary bg-secondary/10 hover:bg-error/10 hover:text-error'
                      : 'text-slate-500 bg-slate-200 hover:bg-secondary/10 hover:text-secondary'
                  }`}
                  title={service.isActive ? 'Click để tắt dịch vụ' : 'Click để bật dịch vụ'}
                >
                  {service.isActive ? 'Đang bật' : 'Đã tắt'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-outline-variant max-w-sm w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-primary text-on-primary flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm flex items-center gap-2">
                <Icon name="add_box" />
                Cấu Hình Dịch Vụ Mới
              </h3>
              <button onClick={() => setShowAddService(false)} className="text-on-primary hover:text-white cursor-pointer">
                <Icon name="close" />
              </button>
            </div>

            <form onSubmit={handleAddServiceSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                  Tên dịch vụ nha khoa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lấy cao răng siêu âm"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                    Giá niêm yết (VND) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ví dụ: 800000"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                    Thời lượng (Phút) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-4 py-2 border border-outline text-on-surface rounded-lg text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-all cursor-pointer"
                >
                  Xác Nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
