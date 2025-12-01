interface YooKassaPayment {
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: string;
    return_url: string;
  };
  capture: boolean;
  description: string;
  metadata?: {
    userId: string;
    transactionId: string;
  };
}

interface YooKassaResponse {
  id: string;
  status: string;
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: string;
    confirmation_url: string;
  };
  created_at: string;
  paid: boolean;
  metadata?: {
    userId: string;
    transactionId: string;
  };
}

class YooKassaClient {
  private shopId: string;
  private secretKey: string;
  private apiUrl: string;

  constructor() {
    this.shopId = process.env.YOOKASSA_SHOP_ID || '';
    this.secretKey = process.env.YOOKASSA_SECRET_KEY || '';
    this.apiUrl = 'https://api.yookassa.ru/v3';

    if (!this.shopId || !this.secretKey) {
      console.error('YOOKASSA_SHOP_ID or YOOKASSA_SECRET_KEY not set');
    }
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async createPayment(
    amount: number,
    userId: string,
    transactionId: string,
    returnUrl: string
  ): Promise<YooKassaResponse> {
    const idempotenceKey = `${transactionId}-${Date.now()}`;

    const payment: YooKassaPayment = {
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        // ИСПРАВЛЕНО: убираем параметр paymentId из return_url
        // Мы будем получать его из callback URL после редиректа
        return_url: returnUrl,
      },
      capture: true,
      description: `Пополнение баланса RAVE BY CAYMAN`,
      metadata: {
        userId,
        transactionId,
      },
    };

    console.log('Creating payment:', {
      amount: payment.amount.value,
      returnUrl: payment.confirmation.return_url,
      idempotenceKey
    });

    const response = await fetch(`${this.apiUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        'Authorization': this.getAuthHeader(),
      },
      body: JSON.stringify(payment),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('YooKassa error:', error);
      throw new Error(error.description || 'Ошибка создания платежа');
    }

    const result = await response.json();
    console.log('Payment created:', result.id);
    
    return result;
  }

  async getPaymentInfo(paymentId: string): Promise<YooKassaResponse> {
    console.log('Getting payment info for:', paymentId);

    const response = await fetch(`${this.apiUrl}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('YooKassa getPaymentInfo error:', error);
      throw new Error('Ошибка получения информации о платеже');
    }

    const result = await response.json();
    console.log('Payment info:', {
      id: result.id,
      status: result.status,
      paid: result.paid
    });

    return result;
  }

  async cancelPayment(paymentId: string): Promise<YooKassaResponse> {
    const idempotenceKey = `cancel-${paymentId}-${Date.now()}`;

    console.log('Cancelling payment:', paymentId);

    const response = await fetch(`${this.apiUrl}/payments/${paymentId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        'Authorization': this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('YooKassa cancelPayment error:', error);
      throw new Error('Ошибка отмены платежа');
    }

    return response.json();
  }
}

export const yookassa = new YooKassaClient();