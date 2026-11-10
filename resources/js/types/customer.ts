export type CustomerStatus = 'active' | 'suspend' | 'disconnected';

export type Customer = {
    id: number;
    name: string;
    phone: string;
    address: string;
    package: string;
    price: number;
    status: CustomerStatus;
};
