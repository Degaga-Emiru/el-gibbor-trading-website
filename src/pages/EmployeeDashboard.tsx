import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  LayoutDashboard, FileText, ClipboardList, UserCircle2, 
  LogOut, Send, RefreshCw,
  Megaphone, BarChart3, Menu, X, Bell
} from 'lucide-react';

type TabType = 'overview' | 'tasks' | 'submit-report' | 'my-reports' | 'profile';
type DatePeriod = 'today' | '2-days' | '3-days' | '1-week' | 'custom';

export default function EmployeeDashboard() {
  const { signOut, profile } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // DB States
  const [tasks, setTasks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  
  // Notification states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // Responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form states
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    time_started: '',
    time_finished: '',
    priority: 'medium',
    department_id: '',
  });

  // Date selection states
  const [datePeriod, setDatePeriod] = useState<DatePeriod>('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [customRangeStart, setCustomRangeStart] = useState('');
  const [customRangeEnd, setCustomRangeEnd] = useState('');

  const [profileForm, setProfileForm] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    position: profile?.position || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // UI States
  const [loading, setLoading] = useState(false);

  // Derived States
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;

  useEffect(() => {
    if (profile) {
      setProfileForm({
        fullName: profile.full_name,
        phone: profile.phone || '',
        position: profile.position || ''
      });
      setReportForm(prev => ({ ...prev, department_id: profile.department_id || '' }));
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Poll notifications
      return () => clearInterval(interval);
    }
  }, [profile]);

  useEffect(() => {
    fetchTasks();
    fetchReports();
    fetchAnnouncements();
    fetchDepartments();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').eq('assigned_to', profile?.id).order('created_at', { ascending: false });
    if (data) setTasks(data);
  };

  const fetchReports = async () => {
    const { data } = await supabase.from('reports').select('*, departments(name)').eq('employee_id', profile?.id).order('created_at', { ascending: false });
    if (data) setReports(data);
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('publish_date', { ascending: false });
    if (data) setAnnouncements(data);
  };

  const fetchDepartments = async () => {
    const { data } = await supabase.from('departments').select('*').order('name');
    if (data) setDepartments(data);
  };

  const fetchNotifications = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const markNotificationRead = async (id: string, tabName?: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    fetchNotifications();
    if (tabName) {
      // Direct redirection logic to tabs
      let targetTab: TabType = 'overview';
      if (tabName === 'tasks') targetTab = 'tasks';
      else if (tabName === 'submit-report') targetTab = 'submit-report';
      else if (tabName === 'my-reports') targetTab = 'my-reports';
      else if (tabName === 'profile') targetTab = 'profile';

      setActiveTab(targetTab);
      setShowNotificationDropdown(false);
    }
  };

  // Adjust dates when period dropdown changes
  useEffect(() => {
    if (datePeriod === 'today') {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } else {
      const today = new Date();
      let diffDays = 0;
      if (datePeriod === '2-days') diffDays = 1;
      else if (datePeriod === '3-days') diffDays = 2;
      else if (datePeriod === '1-week') diffDays = 6;

      if (diffDays > 0) {
        const start = new Date(today);
        start.setDate(today.getDate() - diffDays);
        setCustomRangeStart(start.toISOString().split('T')[0]);
        setCustomRangeEnd(today.toISOString().split('T')[0]);
      }
    }
  }, [datePeriod]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalDateString = selectedDate;
    if (datePeriod !== 'today') {
      finalDateString = `${customRangeStart} to ${customRangeEnd}`;
    }

    try {
      const { error } = await supabase.from('reports').insert({
        employee_id: profile?.id,
        title: reportForm.title,
        description: reportForm.description,
        time_started: reportForm.time_started,
        time_finished: reportForm.time_finished,
        priority: reportForm.priority,
        department_id: reportForm.department_id || null,
        date: datePeriod === 'today' ? selectedDate : customRangeStart,
        status: 'pending'
      });

      if (error) throw error;

      showToast('success', `Report for ${finalDateString} submitted successfully!`);
      setReportForm({
        title: '',
        description: '',
        time_started: '',
        time_finished: '',
        priority: 'medium',
        department_id: profile?.department_id || ''
      });
      setDatePeriod('today');
      fetchReports();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('profiles').update({
        full_name: profileForm.fullName,
        phone: profileForm.phone,
        position: profileForm.position
      }).eq('id', profile?.id);

      if (error) throw error;

      showToast('success', 'Profile updated successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('warning', 'Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      showToast('success', 'Password updated successfully!');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'in_progress' | 'completed') => {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId);
    if (error) {
      showToast('error', error.message);
      return;
    }

    showToast('success', `Task marked as ${status.replace('_', ' ')}.`);

    // On completion — notify the admin
    if (status === 'completed') {
      try {
        // Get task title for the notification message
        const task = tasks.find(t => t.id === taskId);
        // Find admin profile IDs to notify
        const { data: admins } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'manager');

        if (admins && admins.length > 0) {
          const notifPayload = admins.map((admin: any) => ({
            user_id: admin.id,
            title: 'Task Completed ✅',
            message: `${profile?.full_name || 'An employee'} has completed the task: "${task?.title || 'Unknown task'}".`,
            type: 'task',
            is_read: false
          }));
          await supabase.from('notifications').insert(notifPayload);
        }
      } catch (err) {
        console.error('Failed to send completion notification:', err);
      }
    }

    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-[#64748B] relative">
      
      {/* Mobile Top Bar */}
      <header className="md:hidden bg-[#0B2E6B] text-white flex items-center justify-between p-4 shadow-md z-40 shrink-0">
        <div className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-auto bg-white p-0.5 rounded" />
          <span className="font-bold text-sm tracking-wide">EL GIBBOR</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={() => setShowNotificationDropdown(!showNotificationDropdown)} className="relative p-1 text-slate-100 hover:text-white">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0B2E6B] text-white flex flex-col justify-between shrink-0 shadow-xl z-50 transform md:transform-none md:relative w-64 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="Logo" className="h-10 w-auto bg-white p-1 rounded" />
              <div>
                <h2 className="font-bold text-white text-sm tracking-wide leading-tight">El Gibbor</h2>
                <span className="text-xs text-[#D4A017] font-semibold tracking-wider uppercase">Trading PLC</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'My Dashboard', icon: LayoutDashboard },
              { id: 'tasks', label: 'Assigned Tasks', icon: ClipboardList },
              { id: 'submit-report', label: 'Submit Report', icon: Send },
              { id: 'my-reports', label: 'Report History', icon: FileText },
              { id: 'profile', label: 'My Profile', icon: UserCircle2 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-[#D4A017] text-white shadow-md' 
                      : 'text-blue-100 hover:bg-blue-900/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'tasks' && pendingTasksCount > 0 && (
                    <span className="bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                      {pendingTasksCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-blue-900">
          <button
            onClick={signOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-200 hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <header className="hidden md:flex justify-between items-center mb-8 border-b border-[#E2E8F0] pb-5 relative">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] capitalize">
              {activeTab === 'submit-report' ? 'New Work Report' : activeTab === 'my-reports' ? 'My Submitted Reports' : activeTab.replace('-', ' ')}
            </h1>
            <p className="text-[#64748B] text-xs mt-1">Logged in as {profile?.full_name} (<span className="text-[#D4A017] font-semibold">{profile?.position}</span>)</p>
          </div>
          <div className="flex items-center space-x-4">
            
            {/* Notification Bell Dropdown Employee Desktop */}
            <div className="relative">
              <button onClick={() => setShowNotificationDropdown(!showNotificationDropdown)} className="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">{unreadCount}</span>}
              </button>

              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden py-2 text-sm">
                  <div className="px-4 py-2 border-b border-[#E2E8F0] font-bold text-[#1E293B] flex justify-between items-center">
                    <span>In-App Messages & Alerts</span>
                    <button onClick={() => setShowNotificationDropdown(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E8F0]">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-slate-400 text-xs">No alerts yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationRead(n.id, n.link)}
                          className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}
                        >
                          <p className="font-semibold text-xs text-[#1E293B]">{n.title}</p>
                          <p className="text-[11px] text-[#64748B] mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">{new Date(n.created_at).toLocaleTimeString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Assigned Tasks</p>
                <h3 className="text-3xl font-extrabold text-[#1E293B] mt-2">{tasks.filter(t => t.status !== 'completed').length}</h3>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Submitted Reports</p>
                <h3 className="text-3xl font-extrabold text-[#1E293B] mt-2">{reports.length}</h3>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Approved Reports</p>
                <h3 className="text-3xl font-extrabold text-[#1E293B] mt-2">{reports.filter(r => r.status === 'completed').length}</h3>
              </div>
            </div>

            {/* Performance visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-[#0B2E6B]" />
                  <h3 className="text-base font-bold text-[#1E293B]">My Submitted Reports Analytics</h3>
                </div>
                <div className="h-48 w-full flex items-end justify-between px-2 pt-6 border-b border-l border-[#E2E8F0]">
                  {reports.slice(0, 10).map((rep, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 group">
                      <div className="w-6 bg-[#0B2E6B] rounded-t-sm hover:bg-[#D4A017] transition-all" style={{ height: `${Math.min(rep.description.length / 5, 120)}px` }} />
                      <span className="text-[8px] text-[#64748B] mt-2 truncate w-8 text-center">{rep.date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 text-[#0B2E6B] mb-4">
                  <Megaphone className="h-5 w-5 text-[#D4A017]" />
                  <h3 className="text-base font-bold text-[#1E293B]">Company Announcements</h3>
                </div>
                <div className="space-y-4">
                  {announcements.length === 0 ? (
                    <p className="text-[#64748B] text-sm">No announcements from management yet.</p>
                  ) : (
                    announcements.map((item) => (
                      <div key={item.id} className="border-b border-[#E2E8F0] pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-[#1E293B] text-sm flex items-center gap-2">
                            {item.title}
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold capitalize ${
                              item.status === 'canceled' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>{item.status}</span>
                          </h4>
                          <span className="text-[10px] text-slate-400">{item.publish_date}</span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{item.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGNED TASKS */}
        {activeTab === 'tasks' && (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#0B2E6B]/5 text-slate-700 text-xs font-bold uppercase border-b border-[#E2E8F0]">
                    <th className="p-4">Task Details</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#1E293B]">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-semibold">{task.title}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{task.description}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {task.status === 'pending' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'in_progress')}
                            className="bg-[#0B2E6B] hover:bg-blue-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Start Task
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBMIT REPORT */}
        {activeTab === 'submit-report' && (
          <div className="max-w-2xl bg-white border border-[#E2E8F0] p-8 rounded-2xl shadow-sm">
            <form onSubmit={handleReportSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cleared shipment files"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({...reportForm, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                />
              </div>

              {/* Predefined date period dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Date Period *</label>
                  <select
                    value={datePeriod}
                    onChange={(e) => setDatePeriod(e.target.value as DatePeriod)}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#64748B] focus:ring-2 focus:ring-[#0B2E6B]"
                  >
                    <option value="today">Today</option>
                    <option value="2-days">Last 2 Days</option>
                    <option value="3-days">Last 3 Days</option>
                    <option value="1-week">Last 1 Week</option>
                    <option value="custom">Custom Date Selection</option>
                  </select>
                </div>

                {/* Conditional date inputs */}
                {datePeriod === 'today' ? (
                  <div>
                    <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Selected Date</label>
                    <input
                      type="date"
                      disabled
                      value={selectedDate}
                      className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm bg-slate-50 text-slate-400"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E293B] mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={customRangeStart}
                        onChange={(e) => setCustomRangeStart(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1E293B] mb-1">End Date</label>
                      <input
                        type="date"
                        required
                        value={customRangeEnd}
                        onChange={(e) => setCustomRangeEnd(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Time Started</label>
                  <input
                    type="time"
                    required
                    value={reportForm.time_started}
                    onChange={(e) => setReportForm({...reportForm, time_started: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Time Finished</label>
                  <input
                    type="time"
                    required
                    value={reportForm.time_finished}
                    onChange={(e) => setReportForm({...reportForm, time_finished: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Priority</label>
                  <select
                    value={reportForm.priority}
                    onChange={(e) => setReportForm({...reportForm, priority: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#64748B]"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Department</label>
                  <select
                    value={reportForm.department_id}
                    onChange={(e) => setReportForm({...reportForm, department_id: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#64748B]"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>{dep.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Detailed Description</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your actions, tools utilized, offices configurations..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B2E6B] hover:bg-blue-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin mx-auto" /> : 'Submit Report for Approval'}
              </button>
            </form>
          </div>
        )}

        {/* MY REPORTS */}
        {activeTab === 'my-reports' && (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#0B2E6B]/5 text-slate-700 text-xs font-bold uppercase border-b border-[#E2E8F0]">
                    <th className="p-4">Report Details</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Time Logs</th>
                    <th className="p-4 text-right">Approval Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#1E293B]">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-semibold">{rep.title}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{rep.description}</p>
                      </td>
                      <td className="p-4 text-[#64748B]">{rep.departments?.name || 'Logistics'}</td>
                      <td className="p-4 text-xs text-[#64748B]">
                        <p>{rep.time_started} - {rep.time_finished}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{rep.date}</p>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          rep.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rep.status === 'completed' ? 'Approved' : 'Pending Review'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MY PROFILE & PASSWORD SETTINGS */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Update Info */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-[#1E293B] mb-2">Profile Information</h3>
              <p className="text-xs text-slate-400 mb-4">Salary: <span className="font-bold text-slate-700">${profile?.salary || 0} / month</span></p>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[#1E293B] text-sm focus:ring-2 focus:ring-[#0B2E6B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[#1E293B] text-sm focus:ring-2 focus:ring-[#0B2E6B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Position / Title</label>
                  <input
                    type="text"
                    disabled
                    value={profileForm.position}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-slate-50 text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B2E6B] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm font-bold shadow-md cursor-pointer"
                >
                  Update Profile Details
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-[#1E293B] mb-4">Change Account Password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[#1E293B] text-sm focus:ring-2 focus:ring-[#0B2E6B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[#1E293B] text-sm focus:ring-2 focus:ring-[#0B2E6B]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B2E6B] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm font-bold shadow-md cursor-pointer"
                >
                  Update Account Password
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
