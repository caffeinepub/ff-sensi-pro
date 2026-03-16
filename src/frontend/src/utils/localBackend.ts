// Local backend service for user management (stored in localStorage)
// since the on-chain backend doesn't support these methods yet

export interface LocalUser {
  username: string;
  password: string;
  pack: number;
}

export interface LocalPaymentRequest {
  id: string;
  name: string;
  pack: number;
  upiTxnId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}

const USERS_KEY = "ff_admin_users";
const REQUESTS_KEY = "ff_payment_requests";

// ---- Users ----
export function getUsers(): LocalUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as LocalUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function createUser(
  username: string,
  password: string,
  pack: number,
): boolean {
  const users = getUsers();
  if (users.find((u) => u.username === username)) return false;
  users.push({ username, password, pack });
  saveUsers(users);
  return true;
}

export function deleteUser(username: string) {
  const users = getUsers().filter((u) => u.username !== username);
  saveUsers(users);
}

export function loginUser(username: string, password: string): number | null {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  return user ? user.pack : null;
}

// ---- Payment Requests ----
export function getPaymentRequests(): LocalPaymentRequest[] {
  try {
    return JSON.parse(
      localStorage.getItem(REQUESTS_KEY) || "[]",
    ) as LocalPaymentRequest[];
  } catch {
    return [];
  }
}

function saveRequests(reqs: LocalPaymentRequest[]) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(reqs));
}

export function submitPaymentRequest(
  name: string,
  pack: number,
  upiTxnId: string,
): string {
  const reqs = getPaymentRequests();
  const id = `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  reqs.push({
    id,
    name,
    pack,
    upiTxnId,
    status: "pending",
    createdAt: Date.now(),
  });
  saveRequests(reqs);
  return id;
}

export function updateRequestStatus(
  id: string,
  status: "approved" | "rejected",
) {
  const reqs = getPaymentRequests().map((r) =>
    r.id === id ? { ...r, status } : r,
  );
  saveRequests(reqs);
}
