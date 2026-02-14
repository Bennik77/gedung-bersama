const DEFAULT_API_URL = "http://localhost/pinjamgedungku-api/api";
export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const fetchApi = async <T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  const url = `${API_URL}/${endpoint}`;
  try {
    const fetchOptions: RequestInit = {
      ...options,
      credentials: 'include', // Important for sending PHP Session Cookies
    };
    const response = await fetch(url, fetchOptions);
    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return {
      success: false,
      message: 'Terjadi kesalahan koneksi',
      data: null as any
    };
  }
};
