import axios from "axios";

const ENV = import.meta.env;
const API_URL = `http://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}/`;

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
