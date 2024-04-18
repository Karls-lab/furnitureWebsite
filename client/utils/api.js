import { createContext } from "react";
import { jwtDecode } from "jwt-decode";

export class Api {
  constructor() {
    this.token = window.localStorage.getItem("jwt")
    this.serverUrl = import.meta.env.SERVER_URL || "http://localhost:3000";
  }

  handleRefreshToken = async () => {
    this.token = window.localStorage.getItem("jwt");
    if (!this.token) {
      window.location.href = '/login';
    }
  }

  handleInvalidToken() {
    localStorage.removeItem('jwt'); 
    window.location.href = '/login';
  }

  getUserId = () => {
    return jwtDecode(this.token).userId;
  }

  async makeRequest(uri, method, body) {
    const options = {
      method,
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
    }

    if (body) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${this.serverUrl}${uri}`, options); 
    const data = await res.json();
    if (data.error && data.error === 'Invalid token') {
      this.handleInvalidToken();
    } 
    return data;
  }

  post(uri, body) {
    return this.makeRequest(uri, "POST", body)
  }

  put(uri, body) {
    return this.makeRequest(uri, "PUT", body)
  }

  del(uri) {
    return this.makeRequest(uri, "DELETE")
  }

  get(uri) {
    return this.makeRequest(uri, "GET")
  }
  
  // Create a user without a token
  async createUser(data) {
    try {
      return this.post("/users", { data });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

}

export const ApiContext = createContext(new Api());
