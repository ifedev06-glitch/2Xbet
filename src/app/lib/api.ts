// src/app/lib/api.ts
import axios from "axios";
import { BACKEND_BASE_URL, LOGIN_API, REGISTER_API } from "@/app/lib/constatnt";
import { getToken } from "./auth";

// ---------- Axios instance ----------
const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 5000,
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

// export async function getBetHistory(): Promise<PendingBet[]> {
//   const response = await apiClient.get<PendingBet[]>("/bet/history");
//   return response.data;
// }


export default apiClient;
