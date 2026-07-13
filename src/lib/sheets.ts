import { getAccessToken } from './auth';

const SHEET_ID = '1o-7ov9CoQSpw2yDz9HTVhjF7Wxx3ZSlEUb1o5sdGeQs';
const SHEET_RANGE = 'User!A:F';

export interface SheetUser {
  FullName: string;
  UserId: string;
  Password: string;
  Modules: string;
  Role: string;
  Designation: string;
}

export async function fetchUsersFromSheet(): Promise<SheetUser[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users from Google Sheets');
  }

  const data = await response.json();
  const rows = data.values || [];
  
  if (rows.length === 0) return [];

  // Remove header row and map
  return rows.slice(1).map((row: string[]) => ({
    FullName: row[0] || '',
    UserId: row[1] || '',
    Password: row[2] || '',
    Modules: row[3] || '',
    Role: row[4] || '',
    Designation: row[5] || ''
  }));
}

export async function updateAllUsersInSheet(users: SheetUser[]): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  // First clear the sheet
  const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/User!A2:F:clear`;
  await fetch(clearUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  // Then update with new values
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/User!A2:F?valueInputOption=USER_ENTERED`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: users.map(user => [
        user.FullName,
        user.UserId,
        user.Password,
        user.Modules,
        user.Role,
        user.Designation
      ])
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update users in Google Sheets');
  }
}
