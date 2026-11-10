export type InvoicePaymentStatus = 'unpaid' | 'paid';

export type Invoice = {
    id: string;
    customer_id: number;
    customer_name: string;
    billing_period: string; // YYYY-MM
    amount: number;
    payment_status: InvoicePaymentStatus;
    paid_at: string | null;
    created_at: string;
};
