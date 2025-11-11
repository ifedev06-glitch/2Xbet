// src/app/lib/api.ts
import axios from "axios";
import { BACKEND_BASE_URL, LOGIN_API, REGISTER_API } from "@/app/lib/constatnt";
import { getToken } from "./auth";

// ---------- Axios instance ----------
const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 30000,
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log("[Axios Request] token:", token);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("[Axios Request] header about to be set:", config.headers?.["Authorization"]);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---------- Auth Interfaces ----------
export interface LoginRequest { phoneNumber: string; password: string; }
export interface LoginResponse {  message: string;token: string; }
export interface SignupRequest { name: string; phoneNumber: string; password: string; }
export interface SignupResponse { message: string; token: string; }
export interface UserInfo { id: number; name: string; email: string; balance: number; }
export interface UserProfileResponse {
  name: string;
  balance: number;
  id: number; 
}

// ---------- Auth Functions ----------
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(LOGIN_API, credentials);
  return response.data;
}

export async function signupUser(credentials: SignupRequest): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>(REGISTER_API, credentials);
  return response.data;
}

export async function getProfile(): Promise<UserProfileResponse> {
  const response = await apiClient.get<UserProfileResponse>("/user/profile");
  return response.data;
}

export interface PlaceBetRequest {
  betCode: string;
  sportBook: string;
  amount: number;
}

export interface BetResponse {
  message: string;
  status: string;
  newBalance: number;
}

export async function placeBet(req: PlaceBetRequest): Promise<BetResponse> {
  const response = await apiClient.post<BetResponse>("/bet/place", req);
  return response.data;
}

export interface PendingBet {
  id: number;
  sportBook: string;
  betCode: string;
  amount: number;
  potentialWin: number;
  potentialLoss: number;
  status: string;
  createdAt: string;
}

export async function getPendingBets(): Promise<PendingBet[]> {
  const response = await apiClient.get<PendingBet[]>("/bet/pending");
  return response.data;
}

export async function getBetHistory(): Promise<PendingBet[]> {
  const response = await apiClient.get<PendingBet[]>("/bet/history");
  return response.data;
}

// ---------- Deposit Interfaces ----------
export interface DepositRequest {
  amount: number;
}

export interface DepositPaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyDepositRequest {
  reference: string;
  userId: number;
  amount: number;
}


export async function initiateDeposit(amount: number): Promise<DepositPaystackResponse> {
  const response = await apiClient.post<DepositPaystackResponse>("/api/deposits/initiate", {
    amount
  });
  return response.data;
}

export async function verifyDeposit(req: VerifyDepositRequest): Promise<string> {
  const response = await apiClient.get<string>("/deposits/verify", {
    params: {
      reference: req.reference,
      userId: req.userId,
      amount: req.amount
    }
  });
  return response.data;
}

// export async function getBetHistory(): Promise<PendingBet[]> {
//   const response = await apiClient.get<PendingBet[]>("/bet/history");
//   return response.data;
// }


// ---------- Bank Account & Withdrawal Interfaces ----------
export interface BankAccountRequest {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface BankAccountResponse {
  id: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface WithdrawRequest {
  amount: number;
  bankAccountId: number;
}

export interface WithdrawalResponse {
  id: number;
  userId: number;
  userName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "REJECTED" | "CANCELLED";
}

// ---------- Bank Account & Withdrawal Functions ----------
export async function addBankAccount(request: BankAccountRequest): Promise<BankAccountResponse> {
  const response = await apiClient.post<BankAccountResponse>(
    "/api/v1/payments/bank-accounts",
    request
  );
  return response.data;
}

export async function getUserBankAccounts(): Promise<BankAccountResponse[]> {
  const response = await apiClient.get<BankAccountResponse[]>(
    "/api/v1/payments/bank-accounts"
  );
  return response.data;
}

export async function requestWithdrawal(request: WithdrawRequest): Promise<WithdrawalResponse> {
  const response = await apiClient.post<WithdrawalResponse>(
    "/api/v1/payments/withdraw",
    request
  );
  return response.data;
}

// ---------- Withdrawal History ----------
export async function getUserWithdrawals(): Promise<WithdrawalResponse[]> {
  const response = await apiClient.get<WithdrawalResponse[]>("/api/v1/payments/history");
  return response.data;
}


export default apiClient;
