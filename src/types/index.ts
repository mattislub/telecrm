export interface User {
  id: string;
  username: string;
  role: string;
}

export interface Call {
  id: string;
  clientName: string;
  phoneNumber: string;
  clientCallerId: string;
  driverPhone: string;
  driverCallerId: string;
  status: 'active' | 'waiting' | 'completed';
  startTime: Date;
  duration?: number;
  companyId: string;
  driverId: string;
}

export interface Recording {
  id: string;
  callId: string;
  clientName: string;
  phoneNumber: string;
  clientCallerId: string;
  driverPhone: string;
  driverCallerId: string;
  duration: number;
  date: Date;
  fileSize: string;
  status: 'available' | 'processing' | 'failed';
  companyId: string;
  driverId: string;
}

export interface APIExample {
  id: string;
  title: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  requestBody?: string;
  responseExample: string;
}
