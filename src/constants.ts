import { Role, ThemePlate } from './types';

export const USER_CREDENTIALS: Record<string, { pass: string; role: Role }> = {
  'Admin': { pass: '1234', role: 'admin' },
  'Manager': { pass: '1234', role: 'admin' },
  'Store': { pass: '1234', role: 'store' },
  'Hr': { pass: '1234', role: 'hr' },
  'SQC': { pass: '1234', role: 'production' },
  'Office': { pass: '1234', role: 'office' },
  'Yasoda': { pass: '1234', role: 'pms' },
  'Sales': { pass: '1234', role: 'sales' }
};

export const MODULES = [
  {
    id: 'lifting',
    title: 'Lifting ERP',
    icon: 'Box',
    badge: 'Assets',
    url: 'https://mis-yajur.github.io/yajur-asset-portal/',
    description: 'Enterprise asset and lifting equipment portal.'
  },
  {
    id: 'task',
    title: 'Task Delegation',
    icon: 'Users',
    badge: 'Workflow',
    description: 'Assign and track daily operational tasks.',
    items: [
      { id: 'delegation-master', title: 'Delegation Master', url: 'https://script.google.com/macros/s/AKfycbwrELqyJhu7LTU1gshHa7JUKL9MoP2be0zk26yfs0nJALzrtqskyw-FfzX_lrZGs_ys/exec' },
      { id: 'task-master', title: 'Task Master (Manager)', url: 'https://script.google.com/macros/s/AKfycbxGJ4keymTTG5dBT7A5XNtcEqvbzCUFQchPx6W4QJBROXlGSAI5pGmK3KlvT-iekry3/exec' },
      { id: 'daily-work', title: 'Daily Work', url: 'https://script.google.com/macros/s/AKfycbxnujoBeXrHdvi2ejp8VlHNgPKW_LCExoaPDjA97cE8Yh9UUUE-yLTJWy2OtHLW0ZQv/exec' }
    ]
  },
  {
    id: 'checklist',
    title: 'Check List',
    icon: 'ListChecks',
    badge: 'Quality',
    description: 'Standards and verification checklists.',
    items: [
      { id: 'checklist-master', title: 'Check List Master', url: 'https://checklist-app-lyart.vercel.app/' },
      { id: 'utility-checklist', title: 'Utility Check List', url: 'https://script.google.com/macros/s/AKfycby8SdwQWVCYazXCIl4IVZNadm9hgJWzIqEIl-YuEXRlBo4cFE8paqfJj9fkbKJEnlG1Fg/exec' }
    ]
  },
  {
    id: 'ims',
    title: 'IMS',
    icon: 'Database',
    badge: 'Inventory',
    description: 'Stock management and inventory tracking.',
    items: [
      { id: 'ims-pro', title: 'IMS-PRO', url: 'https://ims-pro-blond.vercel.app/' }
    ]
  },
  {
    id: 'pms',
    title: 'PMS',
    icon: 'ClipboardList',
    badge: 'Projects',
    description: 'Project request and management dashboard.',
    url: 'https://script.google.com/macros/s/AKfycbwA-KQ6BZlfc69YgClBcjaxoxIQQBEDLH7TW_GTw89XKfQq6ugXwtHmvMudL50uekgv/exec',
    items: [
      { id: 'expense-request', title: 'Expense Request (Yasoda)', url: 'https://script.google.com/macros/s/AKfycbyG19e0V5VmLLwN52zHPD5xQ--mKNSKdlB-_-cp1-fCITr4F_nWtlK4vYWcliKplNsE/exec' },
      { id: 'project-management', title: 'Project Management', url: 'https://mis-yajur.github.io/Project-Management/' }
    ]
  },
  {
    id: 'hr',
    title: 'HR',
    icon: 'UserRound',
    badge: 'Resources',
    description: 'Human resources and leave management.',
    url: 'https://script.google.com/macros/s/AKfycbxFxKL-T6YC0g0LIWgPKucEp12bFJqLFat_bIGv_3kasw7FJjXpei2KysMFwxpadZn4dw/exec',
    items: [
      { id: 'leave-app', title: 'Leave Application', url: 'https://script.google.com/a/macros/yajurfibres.com/s/AKfycbyVgq9YqhziZNKbkhOjyWkPIsAx-cDCf1Z5_whYIct2Zg6n7ZJuYYg6ZMimtk8czfj98A/exec' },
      { id: 'statutory-compliance', title: 'Statutory Compliance', url: 'https://script.google.com/macros/s/AKfycbyIT1coTXxrefMS67bS5vnpv0NsHofLkG5c2_Us7TOrhMAEqYiZk_C1TsodGx6IJGFiBA/exec' }
    ]
  },
  {
    id: 'production',
    title: 'Production',
    icon: 'Settings',
    badge: 'Manufacturing',
    description: 'Manufacturing quality and ERP management.',
    url: 'https://script.google.com/macros/s/AKfycbyplQQdMagE72dkkzoxW1N3nmR4cKgnrFdkvOPYllcpuVlaU0HDrppVsurwhpS3XSAt/exec',
    items: [
      { id: 'quality', title: 'Quality', url: 'https://script.google.com/macros/s/AKfycbyplQQdMagE72dkkzoxW1N3nmR4cKgnrFdkvOPYllcpuVlaU0HDrppVsurwhpS3XSAt/exec' },
      { id: 'yajur-erp', title: 'Yajur ERP', url: 'https://script.google.com/macros/s/AKfycby5ES25gBZGIuV41vu5rnf19F2ptL5jHP89OutS4p5m4DScilOnm1yM8FAyOIrvH-KQ/exec' }
    ]
  },
  {
    id: 'sales',
    title: 'Sales',
    icon: 'TrendingUp',
    badge: 'Revenue',
    description: 'Real-time sales performance and targets.',
    url: 'https://script.google.com/macros/s/AKfycbwqDVCjsl0uwTFETU-H9SJ_YpwJjfyRJJmEiBDcLBU6IZLIbOS5w5rFVrmqCQ-lOJ6Ktw/exec',
    items: [
      { id: 'sales-dashboard-sub', title: 'Sales Dashboard', url: 'https://script.google.com/macros/s/AKfycbwqDVCjsl0uwTFETU-H9SJ_YpwJjfyRJJmEiBDcLBU6IZLIbOS5w5rFVrmqCQ-lOJ6Ktw/exec' }
    ]
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    icon: 'Wrench',
    badge: 'Technical',
    description: 'Maintenance scheduling and tracking.',
    items: [
      { id: 'motor-maintenance', title: 'Motor Maintenance', url: 'https://script.google.com/macros/s/AKfycbyTVrSrywo014fXvzEH0_DmtzniEHh5Nm6zoswFla1uxgyJ9UyvAwzwQAhTKsYMc57ooQ/exec' },
      { id: 'compressor-erp', title: 'Compressor ERP', url: 'https://script.google.com/macros/s/AKfycbzCYI_qAmrdMLFdY6Rzv3BLFJ7mm5P4tYRBpFiHynjrXFZPE4BzHC_lgCnHBDpI6Ymk/exec' },
      { id: 'transformer-maintenance', title: 'Transformer Maintenance', url: 'https://script.google.com/macros/s/AKfycbyOsve89lPHm1o4wPrzM-R_VdqVwAzRiRPqjKWT_uJO_DpO3SNOAjU2Gq0-C_HGnlsi/exec' }
    ]
  },
  {
    id: 'vendor-master',
    title: 'Vendor Master',
    icon: 'UserCog',
    badge: 'Procurement',
    url: 'https://mis-yajur.github.io/vendor_master',
    description: 'Centralized vendor database and master management.'
  }
];

export const THEME_PLATES: Record<ThemePlate, { 
  name: string; 
  primary: string; 
  bg: string; 
  text: string; 
  accent: string;
  sidebar: string;
  sidebarGradient: string;
  sidebarText: string;
  sidebarActive: string;
}> = {
  rose: {
    name: 'Architect Pink',
    primary: 'pink-600',
    bg: 'white',
    text: 'slate-900',
    accent: 'pink-500',
    sidebar: 'pink-50',
    sidebarGradient: 'from-slate-50 via-pink-50/40 to-rose-50/30',
    sidebarText: 'slate-600',
    sidebarActive: 'bg-pink-500/10 text-pink-700'
  },
  amethyst: {
    name: 'Royal Purple',
    primary: 'purple-600',
    bg: 'white',
    text: 'slate-900',
    accent: 'purple-500',
    sidebar: 'purple-50',
    sidebarGradient: 'from-slate-50 via-purple-50/40 to-violet-50/30',
    sidebarText: 'slate-600',
    sidebarActive: 'bg-purple-500/10 text-purple-700'
  },
  ocean: {
    name: 'Berylline',
    primary: 'cyan-600',
    bg: 'white',
    text: 'slate-900',
    accent: 'cyan-500',
    sidebar: 'cyan-50',
    sidebarGradient: 'from-slate-50 via-cyan-50/40 to-blue-50/30',
    sidebarText: 'slate-600',
    sidebarActive: 'bg-cyan-500/10 text-cyan-700'
  },
  slate: {
    name: 'Enterprise Orange',
    primary: 'orange-600',
    bg: 'white',
    text: 'slate-900',
    accent: 'orange-500',
    sidebar: 'orange-50',
    sidebarGradient: 'from-slate-50 via-orange-50/40 to-rose-50/30',
    sidebarText: 'slate-600',
    sidebarActive: 'bg-orange-500/10 text-orange-700'
  },
  midnight: {
    name: 'Midnight Teal',
    primary: 'teal-600',
    bg: 'slate-50',
    text: 'slate-900',
    accent: 'teal-500',
    sidebar: 'teal-50',
    sidebarGradient: 'from-slate-50 via-teal-50/40 to-slate-100/30',
    sidebarText: 'slate-600',
    sidebarActive: 'bg-teal-500/10 text-teal-700'
  },
  emerald: {
    name: 'Industrial Emerald',
    primary: 'emerald-600',
    bg: 'white',
    text: 'slate-900',
    accent: 'emerald-500',
    sidebar: 'emerald-50',
    sidebarGradient: 'from-slate-50 via-emerald-50/40 to-green-50/30',
    sidebarText: 'slate-600',
    sidebarActive: 'bg-emerald-500/10 text-emerald-700'
  }
};

export const INDUSTRIAL_ASSETS = [
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80&w=2000'
];
