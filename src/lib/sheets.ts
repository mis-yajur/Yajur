export interface SheetUser {
  FullName: string;
  UserId: string;
  Password: string;
  Modules: string;
  Role: string;
  Designation: string;
}

export const getWebAppUrl = () => {
  return localStorage.getItem('sheet_web_app_url') || 'https://script.google.com/macros/s/AKfycbws51cV9iRG26mtjwUcmUrgU8BBhdz8Br-gMrEmMfutqpN0zq_bXnxoxS80wglk4HPA/exec';
};
export const setWebAppUrl = (url: string) => localStorage.setItem('sheet_web_app_url', url);

export async function fetchUsersFromSheet(): Promise<SheetUser[]> {
  const url = getWebAppUrl();
  if (!url) throw new Error('Database not configured. Please set the Web App URL.');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch users from Google Sheets');
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data;
}

export async function updateAllUsersInSheet(users: SheetUser[]): Promise<void> {
  const url = getWebAppUrl();
  if (!url) throw new Error('Database not configured. Please set the Web App URL.');

  // Use text/plain to avoid CORS preflight issues with Apps Script Web Apps
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      action: 'updateAll',
      users
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update users in Google Sheets');
  }
  
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
}

