import { useState } from 'react';
import { Plus, Edit, Trash2, X, Star, TrendingUp, Calendar } from 'lucide-react';
import { STAFF_DATABASE, BRANCHES, formatPKR, type StaffMember } from '../../data/constants';

interface StaffManagementProps {
  onStaffUpdate?: (staff: StaffMember[]) => void;
}

const RECENT_BOOKINGS = [
  { date: '02 Jun 2026', customer: 'Fatima Zaidi', service: 'Bridal Makeup', time: '2:00 PM' },
  { date: '01 Jun 2026', customer: 'Sana Riaz', service: 'Party Makeup', time: '5:30 PM' },
  { date: '31 May 2026', customer: 'Hina Khan', service: 'Haircut with Blow Dry', time: '11:00 AM' },
  { date: '30 May 2026', customer: 'Zara Butt', service: 'Hair Color', time: '1:30 PM' },
  { date: '29 May 2026', customer: 'Noor Fatima', service: 'Acrylic Nails', time: '4:00 PM' },
];

export default function StaffManagement({ onStaffUpdate }: StaffManagementProps) {
  const [staff, setStaff] = useState<StaffMember[]>(STAFF_DATABASE);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const handleSave = (data: Omit<StaffMember, 'id' | 'bookingsThisMonth' | 'revenueThisMonth' | 'avgRating'>) => {
    if (editingStaff) {
      setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...data } : s));
    } else {
      setStaff(prev => [...prev, {
        id: `st${Date.now()}`,
        ...data,
        bookingsThisMonth: 0,
        revenueThisMonth: 0,
        avgRating: 4.5,
      }]);
    }
    setShowModal(false);
    setEditingStaff(null);
    onStaffUpdate?.(staff);
  };

  const handleDelete = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
    setSelectedStaff(null);
    onStaffUpdate?.(staff);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Staff Management</h2>
        <button
          onClick={() => { setEditingStaff(null); setShowModal(true); }}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <Plus size={16} />
          Add Stylist
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <StaffModal
          staff={editingStaff}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="card p-6 max-w-sm mx-4 space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Stylist?</h3>
            <p className="text-gray-400 text-sm">This action cannot be undone.</p>
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

      {/* Staff Profile Slide-over */}
      {selectedStaff && (
        <div className="fixed inset-0 z-40 flex items-center justify-end">
          <div onClick={() => setSelectedStaff(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="card w-full max-w-md h-screen overflow-y-auto relative">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-primary-border bg-surface-2">
              <h3 className="text-lg font-bold text-white">Profile</h3>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary-dim border border-primary-border flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-white">{selectedStaff.name}</p>
                  <p className="text-sm text-gray-500">{selectedStaff.specialty}</p>
                  <p className="text-xs text-gray-600 mt-1">{selectedStaff.branch}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Phone</span>
                  <span className="text-sm font-semibold text-white">{selectedStaff.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${selectedStaff.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {selectedStaff.status}
                  </span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="card-2 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-bold text-white">This Month</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bookings</p>
                    <p className="text-2xl font-bold text-primary">{selectedStaff.bookingsThisMonth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Revenue</p>
                    <p className="text-xl font-bold text-green-400">{formatPKR(selectedStaff.revenueThisMonth)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Average Rating</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-yellow-400">{selectedStaff.avgRating}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < Math.round(selectedStaff.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  Recent Bookings
                </h4>
                <div className="space-y-2">
                  {RECENT_BOOKINGS.map((booking, i) => (
                    <div key={i} className="card-2 p-3 rounded-lg text-sm">
                      <p className="text-white font-medium">{booking.customer}</p>
                      <p className="text-xs text-gray-500">{booking.service}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-gray-600">{booking.date}</span>
                        <span className="text-xs text-gray-600">{booking.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-primary-border">
                <button
                  onClick={() => { setSelectedStaff(null); setEditingStaff(selectedStaff); setShowModal(true); }}
                  className="btn-ghost w-full py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => { setDeleteConfirm(selectedStaff.id); setSelectedStaff(null); }}
                  className="btn-ghost w-full py-2.5 text-sm flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary-border">
              <th className="text-left py-3 px-3 text-gray-400 font-medium">Name</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium">Branch</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium">Specialty</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Status</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Bookings</th>
              <th className="text-right py-3 px-3 text-gray-400 font-medium">Revenue</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Rating</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member, i) => (
              <tr
                key={member.id}
                onClick={() => setSelectedStaff(member)}
                className={`border-b ${i < staff.length - 1 ? 'border-white/5' : 'border-transparent'} hover:bg-primary/5 transition-colors cursor-pointer ${member.status === 'Inactive' ? 'opacity-50' : ''}`}
              >
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-dim border border-primary-border flex items-center justify-center text-xs font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-white">{member.name}</span>
                  </div>
                </td>
                <td className="py-4 px-3 text-gray-400">{member.branch}</td>
                <td className="py-4 px-3 text-gray-400 text-xs">{member.specialty}</td>
                <td className="py-4 px-3 text-center">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${member.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {member.status}
                  </span>
                </td>
                <td className="py-4 px-3 text-center font-bold text-white">{member.bookingsThisMonth}</td>
                <td className="py-4 px-3 text-right font-bold text-green-400">{formatPKR(member.revenueThisMonth)}</td>
                <td className="py-4 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm font-bold text-yellow-400">{member.avgRating}</span>
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  </div>
                </td>
                <td className="py-4 px-3 text-center" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setEditingStaff(member); setShowModal(true); }}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(member.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
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

function StaffModal({ staff, onSave, onClose }: { staff: StaffMember | null; onSave: (s: Omit<StaffMember, 'id' | 'bookingsThisMonth' | 'revenueThisMonth' | 'avgRating'>) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<StaffMember, 'id' | 'bookingsThisMonth' | 'revenueThisMonth' | 'avgRating'>>({
    name: staff?.name ?? '',
    branch: staff?.branch ?? BRANCHES[0].name,
    specialty: staff?.specialty ?? '',
    phone: staff?.phone ?? '',
    status: staff?.status ?? 'Active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.branch && form.specialty && form.phone) {
      onSave(form);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-4">
      <div className="card w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{staff ? 'Edit Stylist' : 'Add Stylist'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
            <input
              type="text"
              className="input-dark w-full px-4 py-2.5"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Branch</label>
            <select
              className="input-dark w-full px-4 py-2.5"
              value={form.branch}
              onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
              required
            >
              {BRANCHES.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Specialty</label>
            <input
              type="text"
              className="input-dark w-full px-4 py-2.5"
              value={form.specialty}
              onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
              placeholder="e.g., Bridal & Makeup"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
            <input
              type="tel"
              className="input-dark w-full px-4 py-2.5"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="0300-0000000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
            <select
              className="input-dark w-full px-4 py-2.5"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
              Save Stylist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
