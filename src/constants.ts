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
      { id: 'project-management', title: 'Project Management', url: 'https://script.google.com/macros/s/AKfycbx8LMHDMa6ziSH5Vzv5C1E_C45LhXyfiaTqNXShesT8BAxZTsduoOBEdtB5nPU6Q5lqAg/exec' }
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
    id: 'lifting',
    title: 'Lifting ERP',
    icon: 'Box',
    badge: 'Assets',
    url: 'https://mis-yajur.github.io/yajur-asset-portal/',
    description: 'Enterprise asset and lifting equipment portal.'
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    icon: 'Wrench',
    badge: 'Technical',
    description: 'Maintenance scheduling and tracking.',
    items: [
      { id: 'motor-maintenance', title: 'Motor Maintenance', url: 'https://script.google.com/macros/s/AKfycbyTVrSrywo014fXvzEH0_DmtzniEHh5Nm6zoswFla1uxgyJ9UyvAwzwQAhTKsYMc57ooQ/exec' }
    ]
  }
];

export const THEME_PLATES: Record<ThemePlate, { name: string; primary: string; bg: string; text: string; accent: string }> = {
  slate: {
    name: 'Yajur Standard',
    primary: 'blue-600',
    bg: 'white',
    text: 'slate-900',
    accent: 'blue-500'
  },
  midnight: {
    name: 'Deep Enterprise',
    primary: 'slate-900',
    bg: 'slate-50',
    text: 'slate-900',
    accent: 'blue-600'
  },
  emerald: {
    name: 'Eco Industrial',
    primary: 'teal-700',
    bg: 'white',
    text: 'slate-900',
    accent: 'teal-600'
  },
  amethyst: {
    name: 'Royal Node',
    primary: 'indigo-700',
    bg: 'white',
    text: 'slate-900',
    accent: 'indigo-600'
  },
  rose: {
    name: 'Critical Alert',
    primary: 'rose-700',
    bg: 'white',
    text: 'slate-900',
    accent: 'rose-600'
  },
  ocean: {
    name: 'Berylline',
    primary: 'cyan-700',
    bg: 'white',
    text: 'slate-900',
    accent: 'cyan-600'
  }
};
