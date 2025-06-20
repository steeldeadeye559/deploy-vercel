export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'nurse' | 'admin';
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: MedicalRecord[];
  status: 'waiting' | 'in-consultation' | 'completed' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'critical';
  appointmentDate: string;
  symptoms: string;
  assignedDoctor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  prescription: Prescription[];
  notes: string;
  doctorId: string;
  doctorName: string;
  followUpDate?: string;
  attachments?: string[];
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  dosage: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  expiryDate: string;
  batchNumber: string;
  description: string;
  sideEffects: string[];
  contraindications: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface DashboardStats {
  totalPatients: number;
  patientsToday: number;
  criticalPatients: number;
  lowStockMedicines: number;
  appointmentsToday: number;
  completedConsultations: number;
}