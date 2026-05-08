import api from './api'

export interface PaymentDetails {
  orderId: number
  amount: number
  currency: string
  customerInfo: {
    email: string
    name: string
    phone?: string
  }
}

export interface NatcashPayment {
  phoneNumber: string
  operator: 'digicel' | 'natcom'
}

export interface MonCashWisePayment {
  accountNumber: string
  accountHolder: string
}

export interface VisaPayment {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardholderName: string
}

export interface ZellePayment {
  email: string
  name: string
  receiptImage?: string
}

export interface PaymentResponse {
  success: boolean
  paymentId?: string
  transactionId?: string
  status: 'pending' | 'completed' | 'failed'
  message: string
  redirectUrl?: string
}

export const paymentService = {
  // Paiement Natcash
  payWithNatcash: async (
    details: PaymentDetails & { natcash: NatcashPayment },
  ): Promise<PaymentResponse> => {
    const response = await api.post('/payment/natcash', details)
    return response.data
  },

  // Paiement Mon Cash Wise
  payWithMonCashWise: async (
    details: PaymentDetails & { moncashwise: MonCashWisePayment },
  ): Promise<PaymentResponse> => {
    const response = await api.post('/payment/moncashwise', details)
    return response.data
  },

  // Paiement Visa
  payWithVisa: async (
    details: PaymentDetails & { visa: VisaPayment },
  ): Promise<PaymentResponse> => {
    const response = await api.post('/payment/visa', details)
    return response.data
  },

  // Paiement Zelle
  payWithZelle: async (
    details: PaymentDetails & { zelle: ZellePayment },
  ): Promise<PaymentResponse> => {
    const response = await api.post('/payment/zelle', details)
    return response.data
  },

  // Vérifier le statut d'un paiement
  getPaymentStatus: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await api.get(`/payment/status/${paymentId}`)
    return response.data
  },

  // Annuler un paiement
  cancelPayment: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await api.post(`/payment/${paymentId}/cancel`)
    return response.data
  },

  // Obtenir les méthodes de paiement disponibles
  getAvailableMethods: async (): Promise<{
    natcash: boolean
    moncashwise: boolean
    visa: boolean
    zelle: boolean
  }> => {
    const response = await api.get('/payment/methods')
    return response.data
  },
}
