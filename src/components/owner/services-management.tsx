'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { SERVICES_DATABASE, BRANCHES, formatPKR, type ServiceItem } from '@/lib/constants';

interface ServicesManagementProps {
  onServiceUpdate?: (services: ServiceItem[]) => void;
}

export default function ServicesManagement({ onServiceUpdate }: ServicesManagementProps) {
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATABASE);
  const [tab, setTab] = useState<'Female' | 'Male'>('Female');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const tabServices = services.filter(s =>
    tab === 'Female' ? s.gender !== 'Male' : s.gender !== 'Female'
  );

  const handleSave = (data: Omit<ServiceItem, 'id'>) => {
    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...data } : s));
    } else {
      setServices(prev => [...prev, { id: `s${Date.now()}`, ...data }]);
    }
    setShowModal(false);
    setEditingService(null);
    onServiceUpdate?.(services);
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
    onServiceUpdate?.(services);
  };

  const handlePriceSave = (id: string) => {
    const newPrice = parseInt(editingPrice);
    if (newPrice > 0) {
      setServices(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
      setEditingPriceId(null);
      setEditingPrice('');
      onServiceUpdate?.(services);
    }
  };

  const toggleStatus = (id: string) => {
    setServices(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
    ));
    onServiceUpdate?.(services);
  };

  const categoryColors: Record<string, string> = {
    Hair: 'text-blue-600',
    Nails: 'text-pink-600',
    Makeup: 'text-purple-600',
    Skin: 'text-green-600',
    Massage: 'text-amber-600',
    Other: 'text-gray-500',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
        <button
          onClick={() => { setEditingService(null); setShowModal(true); }}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <Plus size={16} />
          Add New Service
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-[#FAFAFA] rounded-lg border border-[rgba(197,160,68,0.3)] w-fit">
        {(['Female', 'Male'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all
              ${tab === t ? 'bg-[#C5A044] text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {t} Services ({services.filter(s => t === 'Female' ? s.gender !== 'Male' : s.gender !== 'Female').length})
          </button>
        ))}
      </div>

      {showModal && (
        <ServiceModal
          service={editingService}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="card p-6 max-w-sm mx-4 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Delete Service?</h3>
            <p className="text-gray-500 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 py-2.5 text-sm">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-primary flex-1 py-2.5 text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(197,160,68,0.2)]">
              <th className="text-left py-3 px-3 text-gray-500 font-medium">Name</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium">Category</th>
              <th className="text-center py-3 px-3 text-gray-500 font-medium">Duration</th>
              <th className="text-right py-3 px-3 text-gray-500 font-medium">Price</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium">Branches</th>
              <th className="text-center py-3 px-3 text-gray-500 font-medium">Status</th>
              <th className="text-center py-3 px-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tabServices.map((service, i) => (
              <tr key={service.id} className={`border-b ${i < tabServices.length - 1 ? 'border-gray-100' : 'border-transparent'} hover:bg-[rgba(197,160,68,0.05)] transition-colors ${service.status === 'Inactive' ? 'opacity-50' : ''}`}>
                <td className="py-4 px-3 font-medium text-gray-900">{service.name}</td>
                <td className="py-4 px-3">
                  <span className={`text-xs font-semibold ${categoryColors[service.category]}`}>{service.category}</span>
                </td>
                <td className="py-4 px-3 text-center text-gray-500">{service.duration} min</td>
                <td className="py-4 px-3 text-right">
                  {editingPriceId === service.id ? (
                    <div className="flex gap-1">
                      <input
                        type="number"
                        className="input-dark px-2 py-1 w-24 text-sm"
                        value={editingPrice}
                        onChange={e => setEditingPrice(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handlePriceSave(service.id)}
                        autoFocus
                      />
                      <button
                        onClick={() => handlePriceSave(service.id)}
                        className="text-green-600 hover:text-green-500 text-xs font-bold"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => { setEditingPriceId(service.id); setEditingPrice(service.price.toString()); }}
                      className="text-[#C5A044] font-bold cursor-pointer hover:text-[#D4AF37] transition-colors"
                    >
                      {formatPKR(service.price)}
                    </span>
                  )}
                </td>
                <td className="py-4 px-3 text-xs text-gray-400">
                  {service.branches.map(b => BRANCHES.find(br => br.id === b)?.name.split(',')[0]).join(', ')}
                </td>
                <td className="py-4 px-3 text-center">
                  <button
                    onClick={() => toggleStatus(service.id)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-colors cursor-pointer
                      ${service.status === 'Active'
                        ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200'
                      }`}
                  >
                    {service.status}
                  </button>
                </td>
                <td className="py-4 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setEditingService(service); setShowModal(true); }}
                      className="text-blue-600 hover:text-blue-500 transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(service.id)}
                      className="text-red-600 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServiceModal({ service, onSave, onClose }: { service: ServiceItem | null; onSave: (s: Omit<ServiceItem, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<ServiceItem, 'id'>>({
    name: service?.name ?? '',
    category: service?.category ?? 'Hair',
    duration: service?.duration ?? 30,
    price: service?.price ?? 1000,
    gender: service?.gender ?? 'Female',
    branches: service?.branches ?? ['f7'],
    status: service?.status ?? 'Active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.duration > 0 && form.price > 0 && form.branches.length > 0) {
      onSave(form);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-4">
      <div className="card w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{service ? 'Edit Service' : 'Add New Service'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Name</label>
            <input
              type="text"
              className="input-dark w-full px-4 py-2.5"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Bridal Makeup"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select
                className="input-dark w-full px-4 py-2.5"
                value={form.gender}
                onChange={e => setForm(f => ({ ...f, gender: e.target.value as 'Female' | 'Male' | 'Both' }))}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                className="input-dark w-full px-4 py-2.5"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as 'Hair' | 'Nails' | 'Makeup' | 'Skin' | 'Massage' | 'Other' }))}
              >
                <option value="Hair">Hair</option>
                <option value="Nails">Nails</option>
                <option value="Makeup">Makeup</option>
                <option value="Skin">Skin</option>
                <option value="Massage">Massage</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (min)</label>
              <input
                type="number"
                className="input-dark w-full px-4 py-2.5"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 0 }))}
                min="5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (PKR)</label>
              <input
                type="number"
                className="input-dark w-full px-4 py-2.5"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                min="100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available at Branches</label>
            <div className="space-y-2">
              {BRANCHES.map(branch => (
                <label key={branch.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.branches.includes(branch.id)}
                    onChange={e => setForm(f => ({
                      ...f,
                      branches: e.target.checked
                        ? [...f.branches, branch.id]
                        : f.branches.filter(b => b !== branch.id),
                    }))}
                    className="w-4 h-4 rounded accent-[#C5A044] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{branch.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
