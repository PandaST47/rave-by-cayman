// lib/api-client.ts

interface FetchOptions extends RequestInit {
  body?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API Error');
    }

    return data;
  }

  // Auth
  async register(login: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { login, email, password },
    });
  }

  async login(login: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { login, password },
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async requestPasswordReset(email: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { email },
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword },
    });
  }

  async getProfile() {
    return this.request('/user/profile');
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/user/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    });
  }

  // Zones
  async getZones() {
    return this.request('/zones');
  }

  async getZone(id: string) {
    return this.request(`/zones/${id}`);
  }

  // Bookings
  async createBooking(zoneId: string, hours: number, startTime: string) {
    return this.request('/bookings', {
      method: 'POST',
      body: { zoneId, hours, startTime },
    });
  }

  async getBookings() {
    return this.request('/bookings');
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async cancelBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Tickets
  async createTicket(subject: string, category: string, message: string) {
    return this.request('/tickets', {
      method: 'POST',
      body: { subject, category, message },
    });
  }

  async getTickets() {
    return this.request('/tickets');
  }

  async getTicket(id: string) {
    return this.request(`/tickets/${id}`);
  }

  async addTicketMessage(ticketId: string, message: string) {
    return this.request(`/tickets/${ticketId}`, {
      method: 'POST',
      body: { message },
    });
  }

  // Balance & Payments
  async createPayment(amount: number) {
    return this.request('/payment/create', {
      method: 'POST',
      body: { amount },
    });
  }

  async getTransactions() {
    return this.request('/user/balance');
  }

  async getUserHistory() {
    return this.request('/user/history');
  }
}

export const apiClient = new ApiClient();