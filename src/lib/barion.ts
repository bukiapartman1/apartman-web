/**
 * Barion API Segédkönyvtár
 * Támogatja a teszt (api.test.barion.com) és éles (api.barion.com) környezetet.
 */

export interface StartBarionPaymentParams {
  bookingId: string;
  amount: number;
  guestName: string;
  guestEmail: string;
  startDate: string;
  endDate: string;
  nights: number;
  redirectUrl: string;
  callbackUrl: string;
}

export interface BarionStartResponse {
  PaymentId: string;
  PaymentRequestId: string;
  Status: string;
  GatewayUrl: string;
  QRUrl?: string;
  Errors?: Array<{ Title: string; Description: string }>;
}

export interface BarionPaymentStateResponse {
  PaymentId: string;
  PaymentRequestId: string;
  Status: 'Prepared' | 'Started' | 'InProgress' | 'Waiting' | 'Reserved' | 'Authorized' | 'Canceled' | 'Succeeded' | 'Failed' | 'PartiallySucceeded' | 'Expired';
  Total: number;
  SuggestedLocale?: string;
  Errors?: Array<{ Title: string; Description: string }>;
}

export function getBarionBaseUrl(): string {
  const env = (process.env.BARION_ENVIRONMENT || 'test').toLowerCase();
  return env === 'prod' || env === 'production'
    ? 'https://api.barion.com'
    : 'https://api.test.barion.com';
}

export async function startBarionPayment(params: StartBarionPaymentParams): Promise<BarionStartResponse> {
  const posKey = process.env.BARION_POS_KEY;
  const payeeEmail = process.env.BARION_PAYEE_EMAIL || process.env.GMAIL_USER || 'rekalaca@gmail.com';
  const baseUrl = getBarionBaseUrl();

  if (!posKey) {
    console.warn('BARION_POS_KEY is not configured. Simulating Barion payment flow.');
    const mockPaymentId = `mock-barion-${Date.now()}`;
    return {
      PaymentId: mockPaymentId,
      PaymentRequestId: params.bookingId,
      Status: 'Prepared',
      GatewayUrl: `${params.redirectUrl}?paymentId=${mockPaymentId}&bookingId=${params.bookingId}&mock=true`,
    };
  }

  const payload = {
    POSKey: posKey,
    PaymentType: 'Immediate',
    GuestCheckOut: true,
    FundingSources: ['All'],
    PaymentRequestId: params.bookingId,
    PayerHint: params.guestEmail,
    Locale: 'hu-HU',
    Currency: 'HUF',
    RedirectUrl: params.redirectUrl,
    ...(params.callbackUrl && !params.callbackUrl.includes('localhost') && !params.callbackUrl.includes('127.0.0.1') ? { CallbackUrl: params.callbackUrl } : {}),
    Transactions: [
      {
        POSTransactionId: `${params.bookingId}-1`,
        Payee: payeeEmail,
        Total: params.amount,
        Items: [
          {
            Name: `Szállásfoglalás: ${params.startDate} - ${params.endDate}`,
            Description: `${params.nights} éjszaka (${params.guestName})`,
            Quantity: 1,
            Unit: 'db',
            UnitPrice: params.amount,
            ItemTotal: params.amount,
          },
        ],
      },
    ],
  };

  const response = await fetch(`${baseUrl}/v2/Payment/Start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Barion API hiba (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (data.Errors && data.Errors.length > 0) {
    const errorMessages = data.Errors.map((e: { Title: string; Description: string }) => `${e.Title}: ${e.Description}`).join(', ');
    throw new Error(`Barion hiba: ${errorMessages}`);
  }

  return data;
}

export async function getBarionPaymentState(paymentId: string): Promise<BarionPaymentStateResponse> {
  const posKey = process.env.BARION_POS_KEY;
  const baseUrl = getBarionBaseUrl();

  if (!posKey || paymentId.startsWith('mock-barion-')) {
    return {
      PaymentId: paymentId,
      PaymentRequestId: 'mock-request',
      Status: 'Succeeded',
      Total: 0,
    };
  }

  const url = `${baseUrl}/v2/Payment/GetPaymentState?POSKey=${encodeURIComponent(posKey)}&PaymentId=${encodeURIComponent(paymentId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Barion PaymentState lekérési hiba (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data;
}
