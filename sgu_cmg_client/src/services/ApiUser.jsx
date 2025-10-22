import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_LOCAL;

export async function getAllUsers() {
  try {
    const response = await axios.get(`${API_URL}api/v1/users`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function registerUser(request) {
  try {
    const response = await axios.post(`${API_URL}api/v1/users`, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(uuid, request) {
  try {
    const response = await axios.put(
      `${API_URL}api/v1/users/${uuid}`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(uuid) {
  try {
    const response = await axios.delete(`${API_URL}api/v1/users/${uuid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
