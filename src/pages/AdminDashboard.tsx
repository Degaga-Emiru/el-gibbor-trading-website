import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  LayoutDashboard, Package, FolderTree, Users, FileText, Mail, 
  LogOut, Edit2, CheckCircle, Clock, Megaphone, X, Eye, 
  BarChart3, Activity, UserPlus, Menu, Bell, ClipboardList,
  Send, Trash2, Image as ImageIcon, Upload, Film
} from 'lucide-react';

type TabType = 'overview' | 'products' | 'categories' | 'employees' | 'reports' | 'tasks' | 'announcements' | 'messages';

interface StatCounts {
  employees: number;
  products: number;
  reports: number;
  pendingReports: number;
  completedReports: number;
}

const EL_GIBBOR_DEPARTMENTS = [
  'Sales Manager',
  'Accountant',
  'Reception',
  'Logistics Coordinator',
  'Imports Coordinator',
  'Exports Officer',
  'General Staff'
];

export default function AdminDashboard() {
  const { signOut, profile } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Dashboard statistics
  const [stats, setStats] = useState<StatCounts>({
    employees: 0,
    products: 0,
    reports: 0,
    pendingReports: 0,
    completedReports: 0
  });

  // DB States
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  
  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // Responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  // Send message to employee state
  const [employeeMessage, setEmployeeMessage] = useState('');

  // Forms
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    status: 'published',
    is_featured: false,
    is_new_arrival: false,
    image_url: '',
    video_url: ''
  });
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', image_url: '' });
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [employeeForm, setEmployeeForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    position: 'General Staff',
    departmentId: '',
    salary: '0'
  });

  const [editingEmployeeForm, setEditingEmployeeForm] = useState({
    fullName: '',
    phone: '',
    position: '',
    departmentId: '',
    salary: '0',
    role: 'employee'
  });

  const [announcementForm, setAnnouncementForm] = useState({ 
    title: '', 
    content: '',
    type: 'news' as 'news' | 'event' | 'meeting' | 'alert',
    status: 'active' as 'active' | 'canceled' | 'completed'
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });

  // UI States
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchCategories();
    fetchProducts();
    fetchEmployees();
    fetchReports();
    fetchMessages();
    fetchAnnouncements();
    fetchTasks();
  }, []);

  useEffect(() => {
    if (profile) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Poll notifications
      return () => clearInterval(interval);
    }
  }, [profile]);

  const fetchStats = async () => {
    try {
      const { count: empCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'employee');
      const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: repCount } = await supabase.from('reports').select('*', { count: 'exact', head: true });
      const { count: pendRepCount } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const { count: compRepCount } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'completed');

      setStats({
        employees: empCount || 0,
        products: prodCount || 0,
        reports: repCount || 0,
        pendingReports: pendRepCount || 0,
        completedReports: compRepCount || 0
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
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
      setActiveTab(tabName as TabType);
      setShowNotificationDropdown(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name), product_images(url, is_primary)')
      .order('created_at', { ascending: false });
    if (data) {
      // Attach first primary image url to each product for table display
      const enriched = data.map((p: any) => ({
        ...p,
        image_url: p.product_images?.find((i: any) => i.is_primary)?.url || p.product_images?.[0]?.url || null
      }));
      setProducts(enriched);
    }
  };

  const fetchEmployees = async () => {
    const { data } = await supabase.from('profiles').select('*, departments(name)').eq('role', 'employee').order('full_name');
    if (data) setEmployees(data);
  };

  const fetchReports = async () => {
    const { data } = await supabase.from('reports').select('*, profiles(*), departments(name)').order('created_at', { ascending: false });
    if (data) setReports(data);
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('publish_date', { ascending: false });
    if (data) setAnnouncements(data);
  };

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*, profiles(full_name)').order('created_at', { ascending: false });
    if (data) setTasks(data);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'video_url', isCategory = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from('products-media')
        .upload(filePath, file);

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('products-media')
        .getPublicUrl(filePath);

      if (isCategory) {
        setCategoryForm(prev => ({ ...prev, [field]: publicUrl }));
      } else {
        setProductForm(prev => ({ ...prev, [field]: publicUrl }));
      }
      showToast('success', 'Media uploaded and linked successfully!');
    } catch (err: any) {
      showToast('error', 'Upload failed: ' + err.message + '. Please ensure you have created a public bucket named "products-media" in Supabase Storage.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: productForm.name,
        category_id: productForm.category_id || null,
        description: productForm.description,
        price: productForm.price ? parseFloat(productForm.price) : null,
        status: productForm.status,
        is_featured: productForm.is_featured,
        is_new_arrival: productForm.is_new_arrival,
      };

      let prodId = editingProduct?.id;

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('products').insert(payload).select().single();
        if (error) throw error;
        prodId = data.id;
      }

      if (productForm.image_url) {
        if (editingProduct) {
          await supabase.from('product_images').delete().eq('product_id', editingProduct.id);
        }
        await supabase.from('product_images').insert({
          product_id: prodId,
          url: productForm.image_url,
          is_primary: true
        });
      }

      setProductForm({
        name: '',
        category_id: '',
        description: '',
        price: '',
        status: 'published',
        is_featured: false,
        is_new_arrival: false,
        image_url: '',
        video_url: ''
      });
      setEditingProduct(null);
      setIsProductModalOpen(false);
      fetchProducts();
      fetchStats();
      showToast('success', 'Product inventory updated successfully!');
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: categoryForm.name,
        slug: categoryForm.slug,
        description: categoryForm.description,
        image_url: categoryForm.image_url || null
      };

      if (editingCategory) {
        await supabase.from('categories').update(payload).eq('id', editingCategory.id);
      } else {
        await supabase.from('categories').insert(payload);
      }
      setCategoryForm({ name: '', slug: '', description: '', image_url: '' });
      setEditingCategory(null);
      setIsCategoryModalOpen(false);
      fetchCategories();
      showToast('success', 'Category database updated successfully!');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: signUpErr } = await supabase.auth.signUp({
        email: employeeForm.email,
        password: employeeForm.password,
        options: {
          data: {
            full_name: employeeForm.fullName,
            phone: employeeForm.phone,
            role: 'employee',
            position: employeeForm.position || 'Staff',
            department_id: employeeForm.departmentId || null,
            salary: parseFloat(employeeForm.salary) || 0
          }
        }
      });

      if (signUpErr) throw signUpErr;

      setEmployeeForm({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        position: 'General Staff',
        departmentId: '',
        salary: '0'
      });
      setIsEmployeeModalOpen(false);
      fetchEmployees();
      fetchStats();
      showToast('success', 'Employee account generated. Invitation sent.');
    } catch (err: any) {
      showToast('error', 'Invitation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('tasks').insert({
        title: taskForm.title,
        description: taskForm.description,
        assigned_to: taskForm.assigned_to,
        priority: taskForm.priority,
        due_date: taskForm.due_date || null,
        status: 'pending'
      });

      if (error) throw error;

      showToast('success', 'New task assigned successfully!');
      setTaskForm({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
      setIsTaskModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      showToast('error', 'Failed to assign task: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeStatus = async (empId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await supabase.from('profiles').update({ status: nextStatus }).eq('id', empId);
    fetchEmployees();
    if (selectedEmployee) {
      setSelectedEmployee((prev: any) => ({ ...prev, status: nextStatus }));
    }
    showToast('success', `Employee status toggled to ${nextStatus}.`);
  };

  const deleteEmployee = async (empId: string) => {
    if (!confirm('Are you sure you want to delete this employee? (This deletes profile statistics permanently)')) return;
    await supabase.from('profiles').delete().eq('id', empId);
    setSelectedEmployee(null);
    fetchEmployees();
    fetchStats();
    showToast('success', 'Employee profile removed permanently.');
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
    fetchStats();
    showToast('success', 'Product deleted successfully.');
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
    showToast('success', 'Category deleted successfully.');
  };

  const handleUpdateEmployeeDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      const { error } = await supabase.from('profiles').update({
        full_name: editingEmployeeForm.fullName,
        phone: editingEmployeeForm.phone,
        position: editingEmployeeForm.position,
        department_id: editingEmployeeForm.departmentId || null,
        salary: parseFloat(editingEmployeeForm.salary) || 0,
        role: editingEmployeeForm.role
      }).eq('id', selectedEmployee.id);

      if (error) throw error;

      showToast('success', 'Profile updated successfully!');
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const sendEmployeeDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !employeeMessage.trim()) return;

    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: selectedEmployee.id,
        title: 'Manager Direct Message',
        message: employeeMessage,
        type: 'message'
      });

      if (error) throw error;

      showToast('success', 'In-app notification sent to the employee workspace!');
      setEmployeeMessage('');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const updateReportStatus = async (reportId: string, status: 'approved' | 'completed') => {
    await supabase.from('reports').update({ status }).eq('id', reportId);
    fetchReports();
    fetchStats();
    if (selectedReport) {
      setSelectedReport((prev: any) => ({ ...prev, status }));
    }
    showToast('success', 'Employee work report approved and closed!');
  };

  const updateAnnouncementStatus = async (id: string, status: 'canceled' | 'completed' | 'active') => {
    await supabase.from('announcements').update({ status }).eq('id', id);
    fetchAnnouncements();
    showToast('success', `Announcement marked as ${status}.`);
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('announcements').insert({
        title: announcementForm.title,
        content: announcementForm.content,
        type: announcementForm.type,
        status: announcementForm.status,
        created_by: profile?.id
      });
      if (error) throw error;
      setAnnouncementForm({ title: '', content: '', type: 'news', status: 'active' });
      fetchAnnouncements();
      showToast('success', 'Announcement published successfully!');
    } catch (err: any) {
      showToast('error', err.message);
    }
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
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden py-2 text-sm text-slate-800">
                <div className="px-4 py-2 border-b border-[#E2E8F0] font-bold text-[#1E293B] flex justify-between items-center">
                  <span>Notifications</span>
                  <button onClick={() => setShowNotificationDropdown(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E8F0]">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-slate-400 text-xs">No notifications yet.</p>
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
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'categories', label: 'Categories', icon: FolderTree },
              { id: 'employees', label: 'Employees (HR)', icon: Users },
              { id: 'reports', label: 'Work Reports', icon: FileText },
              { id: 'tasks', label: 'Assign Tasks', icon: ClipboardList },
              { id: 'announcements', label: 'Announcements', icon: Megaphone },
              { id: 'messages', label: 'Visitor Messages', icon: Mail },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-[#D4A017] text-white shadow-md' 
                      : 'text-blue-100 hover:bg-blue-900/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
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
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] capitalize">{activeTab.replace('-', ' ')} Panel</h1>
            <p className="text-[#64748B] text-xs mt-1">Logged in as {profile?.full_name} (<span className="text-[#D4A017] font-semibold">{profile?.position}</span>)</p>
          </div>
          <div className="flex items-center space-x-6">
            
            {/* Notification Bell Dropdown Desktop */}
            <div className="relative">
              <button onClick={() => setShowNotificationDropdown(!showNotificationDropdown)} className="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">{unreadCount}</span>}
              </button>

              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden py-2 text-sm">
                  <div className="px-4 py-2 border-b border-[#E2E8F0] font-bold text-[#1E293B] flex justify-between items-center">
                    <span>Notifications</span>
                    <button onClick={() => setShowNotificationDropdown(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E8F0]">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-slate-400 text-xs">No notifications yet.</p>
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

            {activeTab === 'employees' && (
              <button
                onClick={() => setIsEmployeeModalOpen(true)}
                className="flex items-center gap-2 bg-[#0B2E6B] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add New Employee</span>
              </button>
            )}

            {activeTab === 'products' && (
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="flex items-center gap-2 bg-[#0B2E6B] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Add New Product</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-2 bg-[#0B2E6B] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md cursor-pointer"
              >
                <FolderTree className="h-4 w-4" />
                <span>Add Category</span>
              </button>
            )}

            {activeTab === 'tasks' && (
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 bg-[#0B2E6B] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md cursor-pointer"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Assign New Task</span>
              </button>
            )}
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Welcome Banner */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-[#0B2E6B]">
              <div>
                <h2 className="text-xl font-extrabold text-[#1E293B]">Welcome back, {profile?.full_name?.split(' ')[0] || 'Manager'}! 👋</h2>
                <p className="text-sm text-[#64748B] mt-1">Here is your business overview and latest operations metrics.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: 'Total Employees', val: stats.employees, color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Users, tab: 'employees' },
                { title: 'Total Products', val: stats.products, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: Package, tab: 'products' },
                { title: 'Total Reports', val: stats.reports, color: 'text-violet-600 bg-violet-50 border-violet-100', icon: FileText, tab: 'reports' },
                { title: 'Pending Review', val: stats.pendingReports, color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock, tab: 'reports' },
                { title: 'Approved Reports', val: stats.completedReports, color: 'text-rose-600 bg-rose-50 border-rose-100', icon: CheckCircle, tab: 'reports' }
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <button 
                    key={i} 
                    onClick={() => setActiveTab(card.tab as TabType)}
                    className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#0B2E6B]"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider">{card.title}</p>
                        <h3 className="text-3xl font-extrabold text-[#1E293B] mt-2">{card.val}</h3>
                      </div>
                      <div className={`p-3 rounded-xl shadow-inner ${card.color.split(' ')[1]} ${card.color.split(' ')[0]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Report Activity Chart */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <BarChart3 className="h-5 w-5 text-[#0B2E6B]" />
                  <h3 className="text-base font-bold text-[#1E293B]">Employee Performance Metrics</h3>
                </div>
                <div className="h-64 w-full flex items-end justify-between px-4 pt-6 border-b border-l border-[#E2E8F0]">
                  {reports.slice(0, 7).map((rep, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 group relative cursor-pointer">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none z-10">
                        {rep.profiles?.full_name || 'Staff'} ({rep.date})<br/>
                        Priority: {rep.priority}
                      </div>
                      <div className="w-8 bg-[#0B2E6B] rounded-t-md hover:bg-[#D4A017] transition-all" style={{ height: `${Math.min(rep.description.length / 4, 180)}px` }} />
                      <span className="text-[10px] text-[#64748B] mt-2 truncate w-14 text-center font-medium">{rep.profiles?.full_name || 'Staff'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Interactive Line Graph Simulation */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <Activity className="h-5 w-5 text-[#D4A017]" />
                  <h3 className="text-base font-bold text-[#1E293B]">Products & Enhancements Graph</h3>
                </div>
                <div className="h-64 w-full relative border-b border-l border-[#E2E8F0] pt-6 pr-4">
                  {/* SVG Line Graph */}
                  <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polyline
                      fill="none"
                      stroke="#D4A017"
                      strokeWidth="2"
                      points={products.slice(0, 7).map((prod, i, arr) => {
                        const x = (i / (arr.length - 1 || 1)) * 100;
                        const y = 100 - (Math.min(prod.price || 50, 500) / 500 * 80);
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    {products.slice(0, 7).map((prod, i, arr) => {
                      const x = (i / (arr.length - 1 || 1)) * 100;
                      const y = 100 - (Math.min(prod.price || 50, 500) / 500 * 80);
                      return (
                        <circle key={i} cx={x} cy={y} r="3" fill="#0B2E6B" className="hover:r-[5px] transition-all cursor-pointer">
                          <title>{prod.name} - ${prod.price}</title>
                        </circle>
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-end justify-between px-1 pointer-events-none">
                     {products.slice(0, 7).map((prod, idx) => (
                      <span key={idx} className="text-[9px] text-[#64748B] translate-y-6 truncate w-12 text-center pointer-events-auto cursor-help group relative">
                        {prod.name.slice(0, 8)}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                          Count/Price: ${prod.price || 0}<br/>
                          Category: {prod.categories?.name || 'N/A'}
                        </div>
                      </span>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center md:hidden pb-2">
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="flex items-center gap-2 bg-[#0B2E6B] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Add Product</span>
              </button>
            </div>
            
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#0B2E6B]/5 text-slate-700 text-xs font-bold uppercase border-b border-[#E2E8F0]">
                      <th className="p-4">Image</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Attributes</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#1E293B]">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          {prod.image_url ? (
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="h-16 w-16 object-cover rounded-xl border border-[#E2E8F0] shadow-sm"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-slate-100 rounded-xl border border-[#E2E8F0] flex items-center justify-center text-slate-400">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-semibold">{prod.name}</td>
                        <td className="p-4 text-[#64748B]">{prod.categories?.name || 'Uncategorized'}</td>
                        <td className="p-4">${prod.price || 'N/A'}</td>
                        <td className="p-4 text-xs space-y-1">
                          {prod.is_featured && <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-1">Featured</span>}
                          {prod.is_new_arrival && <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">New Arrival</span>}
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setProductForm({
                                name: prod.name,
                                category_id: prod.category_id || '',
                                description: prod.description || '',
                                price: prod.price || '',
                                status: prod.status,
                                is_featured: prod.is_featured,
                                is_new_arrival: prod.is_new_arrival,
                                image_url: prod.image_url || '',
                                video_url: ''
                              });
                              setIsProductModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4 inline" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center md:hidden pb-2">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-2 bg-[#0B2E6B] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                <FolderTree className="h-3.5 w-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-[#0B2E6B]/5 text-slate-700 text-xs font-bold uppercase border-b border-[#E2E8F0]">
                      <th className="p-4">Image</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#1E293B]">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="h-20 w-28 object-cover rounded-xl border border-[#E2E8F0] shadow-sm" />
                          ) : (
                            <div className="h-20 w-28 bg-slate-100 rounded-xl border border-[#E2E8F0] flex items-center justify-center text-slate-400 flex-col gap-1">
                              <ImageIcon size={20} />
                              <span className="text-[9px] font-semibold">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-semibold">{cat.name}</td>
                        <td className="p-4 text-[#64748B]">{cat.slug}</td>
                        <td className="p-4 text-[#64748B]">{cat.description || 'N/A'}</td>
                        <td className="p-4 text-right space-x-3">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryForm({
                                name: cat.name,
                                slug: cat.slug,
                                description: cat.description || '',
                                image_url: cat.image_url || ''
                              });
                              setIsCategoryModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4 inline" />
                          </button>
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center md:hidden pb-2">
              <button
                onClick={() => setIsEmployeeModalOpen(true)}
                className="flex items-center gap-2 bg-[#0B2E6B] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Add Employee</span>
              </button>
            </div>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#0B2E6B]/5 text-slate-700 text-xs font-bold uppercase border-b border-[#E2E8F0]">
                    <th className="p-4">Name</th>
                    <th className="p-4">Position / Role</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Monthly Salary</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#1E293B]">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="p-4 font-semibold">{emp.full_name}</td>
                      <td className="p-4 text-[#64748B]">{emp.position}</td>
                      <td className="p-4 text-[#64748B]">{emp.departments?.name || emp.position}</td>
                      <td className="p-4 font-bold text-slate-700">${emp.salary || 0}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          emp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setEditingEmployeeForm({
                              fullName: emp.full_name,
                              phone: emp.phone || '',
                              position: emp.position || '',
                              departmentId: emp.department_id || '',
                              salary: String(emp.salary || 0),
                              role: emp.role
                            });
                          }}
                          className="text-[#0B2E6B] hover:text-blue-800 font-bold text-xs bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-[#E2E8F0] transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* WORK REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#0B2E6B]/5 text-slate-700 text-xs font-bold uppercase border-b border-[#E2E8F0]">
                    <th className="p-4">Employee</th>
                    <th className="p-4">Report Details</th>
                    <th className="p-4">Submitted Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">View Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#1E293B]">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50">
                      <td className="p-4 font-semibold">{rep.profiles?.full_name || 'Staff'}</td>
                      <td className="p-4">
                        <p className="font-semibold text-[#1E293B]">{rep.title}</p>
                        <p className="text-xs text-[#64748B] mt-1 line-clamp-1">{rep.description}</p>
                      </td>
                      <td className="p-4 text-xs text-[#64748B]">{rep.date}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          rep.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rep.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedReport(rep)}
                          className="bg-slate-50 border border-[#E2E8F0] text-[#0B2E6B] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          Open Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ASSIGN TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center md:hidden pb-2">
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 bg-[#0B2E6B] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                <ClipboardList className="h-3.5 w-3.5" />
                <span>Assign Task</span>
              </button>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#0B2E6B]/5 text-slate-700 text-xs font-bold uppercase border-b border-[#E2E8F0]">
                      <th className="p-4">Task Title</th>
                      <th className="p-4">Assigned To</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Due Date</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#1E293B]">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">{task.description}</p>
                        </td>
                        <td className="p-4 text-[#64748B]">{task.profiles?.full_name || 'Unassigned'}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                          }`}>{task.priority}</span>
                        </td>
                        <td className="p-4 text-xs text-[#64748B]">{task.due_date || 'No Limit'}</td>
                        <td className="p-4 text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>{task.status.replace('_', ' ')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm h-fit">
              <h3 className="text-lg font-bold text-[#1E293B] mb-4">Publish Announcement</h3>
              <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">Type</label>
                    <select
                      value={announcementForm.type}
                      onChange={(e) => setAnnouncementForm({...announcementForm, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs text-[#64748B]"
                    >
                      <option value="news">News</option>
                      <option value="event">Event</option>
                      <option value="meeting">Meeting</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">Status</label>
                    <select
                      value={announcementForm.status}
                      onChange={(e) => setAnnouncementForm({...announcementForm, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs text-[#64748B]"
                    >
                      <option value="active">Active</option>
                      <option value="canceled">Canceled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Content</label>
                  <textarea
                    rows={4}
                    required
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                  />
                </div>
                <button type="submit" className="w-full bg-[#0B2E6B] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm font-bold shadow-md">
                  Publish News
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#1E293B] mb-2">Announcements Timeline</h3>
              {announcements.map((item) => (
                <div key={item.id} className="border-b border-[#E2E8F0] pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#1E293B] flex items-center gap-2">
                        {item.title}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold ${
                          item.status === 'canceled' ? 'bg-red-100 text-red-800' : item.status === 'completed' ? 'bg-slate-100 text-slate-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>{item.status}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 capitalize">{item.type} | {item.publish_date}</span>
                    </div>
                    {item.status === 'active' && (
                      <button 
                        onClick={() => updateAnnouncementStatus(item.id, 'canceled')}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Cancel Event
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-[#64748B] mt-2 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISITOR MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-[#0B2E6B]/5 text-slate-700 text-xs font-bold uppercase border-b border-[#E2E8F0]">
                      <th className="p-4">Visitor</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Submitted Date</th>
                      <th className="p-4 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#1E293B]">
                    {messages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold">{msg.name}</p>
                          <p className="text-xs text-[#64748B]">{msg.email}</p>
                        </td>
                        <td className="p-4 font-medium">{msg.subject || 'Inquiry'}</td>
                        <td className="p-4 text-xs text-[#64748B]">{new Date(msg.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="text-[#0B2E6B] hover:text-blue-800 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Read Message Box */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-[#1E293B] mb-4">Message Reader</h3>
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="border-b border-[#E2E8F0] pb-3">
                    <p className="text-xs text-[#64748B]">From:</p>
                    <p className="font-bold text-[#1E293B]">{selectedMessage.name}</p>
                    <p className="text-xs text-[#64748B]">{selectedMessage.email}</p>
                    {selectedMessage.phone && <p className="text-xs text-[#64748B]">{selectedMessage.phone}</p>}
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Subject:</p>
                    <p className="font-bold text-[#1E293B]">{selectedMessage.subject || 'Inquiry'}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-4 rounded-xl text-sm text-[#1E293B] leading-relaxed border border-[#E2E8F0]">
                    {selectedMessage.message}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">Select a message from the list to read details.</p>
              )}
            </div>
          </div>
        )}

      </main>

      {/* POPUP MODAL: Add New Employee */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E2E8F0] max-w-md w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <button 
              onClick={() => setIsEmployeeModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 text-[#0B2E6B] mb-4">
              <UserPlus className="h-6 w-6" />
              <h3 className="text-lg font-bold text-[#1E293B]">Invite New Employee</h3>
            </div>
            <form onSubmit={handleEmployeeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={employeeForm.fullName}
                  onChange={(e) => setEmployeeForm({...employeeForm, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                  placeholder="name@elgibbor.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                  placeholder="+251 ..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Role / Department</label>
                  <select
                    value={employeeForm.position}
                    onChange={(e) => setEmployeeForm({...employeeForm, position: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#64748B]"
                  >
                    {EL_GIBBOR_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Monthly Salary ($)</label>
                  <input
                    type="number"
                    value={employeeForm.salary}
                    onChange={(e) => setEmployeeForm({...employeeForm, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm({...employeeForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B]"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B2E6B] hover:bg-blue-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg mt-2 cursor-pointer transition-colors"
              >
                {loading ? 'Sending Invite...' : 'Send Invitation Email'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add New Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E2E8F0] max-w-lg w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => {
                setIsProductModalOpen(false);
                setEditingProduct(null);
                setProductForm({ name: '', category_id: '', description: '', price: '', status: 'published', is_featured: false, is_new_arrival: false, image_url: '', video_url: '' });
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 text-[#0B2E6B] mb-4">
              <Package className="h-6 w-6" />
              <h3 className="text-lg font-bold text-[#1E293B]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            </div>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Category *</label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#64748B]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm"
                />
              </div>

              {/* Upload Dropzones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Product Image *</label>
                  {productForm.image_url ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#E2E8F0] group shadow-inner">
                      <img src={productForm.image_url} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProductForm(prev => ({ ...prev, image_url: '' }))}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-xl p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                      <Upload className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-600 font-bold">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingProduct}
                        onChange={(e) => handleMediaUpload(e, 'image_url')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Product Video (Optional)</label>
                  {productForm.video_url ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#E2E8F0] group shadow-inner">
                      <video src={productForm.video_url} className="w-full h-full object-cover" controls />
                      <button
                        type="button"
                        onClick={() => setProductForm(prev => ({ ...prev, video_url: '' }))}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-xl p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                      <Film className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-600 font-bold">Upload Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleMediaUpload(e, 'video_url')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 text-xs text-[#1E293B] font-semibold">
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({...productForm, is_featured: e.target.checked})}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-[#1E293B] font-semibold">
                  <input
                    type="checkbox"
                    checked={productForm.is_new_arrival}
                    onChange={(e) => setProductForm({...productForm, is_new_arrival: e.target.checked})}
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || uploadingFile}
                className="w-full bg-[#0B2E6B] hover:bg-blue-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add New Category */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E2E8F0] max-w-md w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <button 
              onClick={() => {
                setIsCategoryModalOpen(false);
                setEditingCategory(null);
                setCategoryForm({ name: '', slug: '', description: '', image_url: '' });
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 text-[#0B2E6B] mb-4">
              <FolderTree className="h-6 w-6" />
              <h3 className="text-lg font-bold text-[#1E293B]">Add New Category</h3>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B]"
                  placeholder="e.g. Passenger Vehicles"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Category Image *</label>
                {categoryForm.image_url ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#E2E8F0] group shadow-inner">
                    <img src={categoryForm.image_url} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCategoryForm(prev => ({ ...prev, image_url: '' }))}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-xl p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload className="h-6 w-6 text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-600 font-bold">Upload Category Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMediaUpload(e, 'image_url', true)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <button type="submit" className="w-full bg-[#0B2E6B] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm font-bold shadow-md">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Assign Task */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E2E8F0] max-w-md w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <button 
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 text-[#0B2E6B] mb-4">
              <ClipboardList className="h-6 w-6" />
              <h3 className="text-lg font-bold text-[#1E293B]">Assign New Task</h3>
            </div>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Task Title *</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B]"
                  placeholder="e.g. Inspect incoming tyre cargo shipment"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Task Description</label>
                <textarea
                  rows={3}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm"
                  placeholder="Describe standard protocols, tools, or check logs..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Assign To *</label>
                  <select
                    required
                    value={taskForm.assigned_to}
                    onChange={(e) => setTaskForm({...taskForm, assigned_to: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#64748B]"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#64748B]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B2E6B] hover:bg-blue-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg mt-2 cursor-pointer transition-colors"
              >
                {loading ? 'Assigning...' : 'Assign Task'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Employee Detailed Profile View & Management */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E2E8F0] max-w-2xl w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedEmployee(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Left Column: Details & Edit */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-[#E2E8F0]">
                <div className="h-12 w-12 bg-[#0B2E6B] text-white rounded-full flex items-center justify-center font-bold text-lg capitalize">
                  {selectedEmployee.full_name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E293B]">{selectedEmployee.full_name}</h3>
                  <p className="text-xs text-[#64748B]">{selectedEmployee.position}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateEmployeeDetails} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingEmployeeForm.fullName}
                    onChange={(e) => setEditingEmployeeForm({...editingEmployeeForm, fullName: e.target.value})}
                    className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={editingEmployeeForm.phone}
                    onChange={(e) => setEditingEmployeeForm({...editingEmployeeForm, phone: e.target.value})}
                    className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Position</label>
                    <select
                      value={editingEmployeeForm.position}
                      onChange={(e) => setEditingEmployeeForm({...editingEmployeeForm, position: e.target.value})}
                      className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs text-[#64748B]"
                    >
                      {EL_GIBBOR_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Salary ($)</label>
                    <input
                      type="number"
                      value={editingEmployeeForm.salary}
                      onChange={(e) => setEditingEmployeeForm({...editingEmployeeForm, salary: e.target.value})}
                      className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B]"
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-3 pt-3">
                  <button type="submit" className="flex-grow bg-[#0B2E6B] hover:bg-blue-900 text-white py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer">
                    Save Updates
                  </button>
                  <button 
                    type="button" 
                    onClick={() => toggleEmployeeStatus(selectedEmployee.id, selectedEmployee.status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      selectedEmployee.status === 'active' 
                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {selectedEmployee.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => deleteEmployee(selectedEmployee.id)}
                    className="p-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Direct Messaging */}
            <div className="flex-1 border-t md:border-t-0 md:border-l border-[#E2E8F0] pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#1E293B] mb-2 flex items-center gap-1.5"><Send size={14} /> Send Direct Message</h4>
                <p className="text-xs text-slate-400 mb-4">Send a notice that will show directly on their dashboard notification bell.</p>
                <textarea
                  rows={4}
                  value={employeeMessage}
                  onChange={(e) => setEmployeeMessage(e.target.value)}
                  placeholder="Type instructions, assignments, or custom messages here..."
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:ring-2 focus:ring-[#0B2E6B] focus:outline-none"
                />
              </div>
              <button 
                onClick={sendEmployeeDirectMessage}
                disabled={!employeeMessage.trim()}
                className="mt-4 w-full bg-[#D4A017] hover:bg-yellow-600 text-white py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 transition-colors"
              >
                Send Message Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Work Report Detailed View */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E2E8F0] max-w-lg w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 text-[#0B2E6B] mb-4 pb-3 border-b border-[#E2E8F0]">
              <FileText className="h-6 w-6" />
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">Detailed Work Report</h3>
                <p className="text-xs text-[#64748B]">Submitted by {selectedReport.profiles?.full_name || 'Staff'}</p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-[#1E293B]">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Report Title</p>
                <p className="font-semibold text-[#1E293B] text-base">{selectedReport.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                <div>
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Logistics & Date</p>
                  <p className="font-semibold">{selectedReport.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Report Status</p>
                  <span className={`inline-block px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold ${
                    selectedReport.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>{selectedReport.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Time Started</p>
                  <p className="font-semibold">{selectedReport.time_started}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Time Finished</p>
                  <p className="font-semibold">{selectedReport.time_finished}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Priority</p>
                  <span className="capitalize font-semibold">{selectedReport.priority}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Actions & Task Description</p>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed border border-[#E2E8F0] max-h-48 overflow-y-auto">
                  {selectedReport.description}
                </div>
              </div>
              {selectedReport.status !== 'completed' && (
                <div className="pt-2">
                  <button 
                    onClick={() => updateReportStatus(selectedReport.id, 'completed')}
                    className="w-full bg-[#0B2E6B] hover:bg-blue-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition-colors cursor-pointer"
                  >
                    Approve and Close Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
