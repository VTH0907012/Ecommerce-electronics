import axiosInstance from "./axiosConfig";
export const loginUser = async (email: string, password: string) => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }
  return data;
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/register", userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const res = await fetch("/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Lỗi khi lấy thông tin người dùng");
  }

  return data;
};
export const logoutUser = async (): Promise<{ message: string }> => {
  const res = await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });

  const payload = (await res.json()) as { message: string };
  if (!res.ok) {
    throw new Error(payload.message);
  }
  return payload as { message: string };
};

export const changePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
  const res = await fetch("/api/user/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Đổi mật khẩu thất bại");
  }

  return data;
};
export const updateUserProfile = async (userData: { name: string; email: string }) => {
  const res = await fetch("/api/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Cập nhật thông tin thất bại");
  }

  return data;
};
export async function getAllUser() {
  const response = await axiosInstance.get("/users");
  return response.data;
}
export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};
export const toggleBlockUser = async (id: string) => {
  const response = await axiosInstance.patch(`/users/${id}/block`);
  return response.data;
};
export const toggleAdmin = async (id: string) => {
  const response = await axiosInstance.patch(`/users/${id}/admin`);
  return response.data;
};