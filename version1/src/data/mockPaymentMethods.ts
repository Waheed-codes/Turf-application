export type PaymentMethod =
  | { id: string; type: "card"; network: string; last4: string; expiry: string }
  | { id: string; type: "upi"; upiId: string };

// Fictional display-only methods. No payment credentials or provider tokens.
export const mockPaymentMethods: PaymentMethod[] = [
  { id: "payment-1", type: "card", network: "Visa", last4: "4821", expiry: "08/29" },
  { id: "payment-2", type: "upi", upiId: "irfan@upi" },
];
