import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Medicine, MedicalRecord, Appointment, Notification, DashboardStats } from '../types';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
  
  // Medical Records
  medicalRecords: MedicalRecord[];
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  getPatientRecords: (patientId: string) => MedicalRecord[];
  
  // Medicines
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  getMedicine: (id: string) => Medicine | undefined;
  
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  getTodayAppointments: () => Appointment[];
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Dashboard Stats
  getDashboardStats: () => DashboardStats;
  
  // Search and Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initialize with mock data
    initializeMockData();
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const initializeMockData = () => {
    // Mock Patients with Indian names
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'Rajesh Kumar Sharma',
        email: 'rajesh.sharma@email.com',
        phone: '+91-98765-43210',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        address: '123, MG Road, Connaught Place, New Delhi - 110001',
        emergencyContact: '+91-98765-43211',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        medicalHistory: [],
        status: 'waiting',
        priority: 'medium',
        appointmentDate: new Date().toISOString(),
        symptoms: 'Chest pain, shortness of breath',
        assignedDoctor: 'Dr. Priya Mehta',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Priya Agarwal',
        email: 'priya.agarwal@email.com',
        phone: '+91-87654-32109',
        dateOfBirth: '1990-07-22',
        gender: 'female',
        address: '456, Brigade Road, Bangalore, Karnataka - 560025',
        emergencyContact: '+91-87654-32108',
        bloodType: 'A-',
        allergies: ['Latex'],
        medicalHistory: [],
        status: 'in-consultation',
        priority: 'high',
        appointmentDate: new Date().toISOString(),
        symptoms: 'Severe headache, nausea, fever',
        assignedDoctor: 'Dr. Amit Singh',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Mohammed Arif Khan',
        email: 'arif.khan@email.com',
        phone: '+91-76543-21098',
        dateOfBirth: '1978-11-08',
        gender: 'male',
        address: '789, Marine Drive, Mumbai, Maharashtra - 400020',
        emergencyContact: '+91-76543-21097',
        bloodType: 'B+',
        allergies: [],
        medicalHistory: [],
        status: 'critical',
        priority: 'critical',
        appointmentDate: new Date().toISOString(),
        symptoms: 'Severe abdominal pain, high fever, vomiting',
        assignedDoctor: 'Dr. Sunita Reddy',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Anita Devi Gupta',
        email: 'anita.gupta@email.com',
        phone: '+91-65432-10987',
        dateOfBirth: '1992-05-14',
        gender: 'female',
        address: '321, Park Street, Kolkata, West Bengal - 700016',
        emergencyContact: '+91-65432-10986',
        bloodType: 'AB+',
        allergies: ['Sulfa drugs'],
        medicalHistory: [],
        status: 'completed',
        priority: 'low',
        appointmentDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        symptoms: 'Regular checkup, diabetes monitoring',
        assignedDoctor: 'Dr. Vikram Joshi',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    // Mock Medicines with Indian pharmaceutical companies
    const mockMedicines: Medicine[] = [
      {
        id: '1',
        name: 'Paracetamol',
        category: 'Pain Relief',
        manufacturer: 'Cipla Ltd',
        dosage: '500mg',
        unit: 'tablets',
        price: 45.50,
        stock: 150,
        minStock: 50,
        expiryDate: '2025-12-31',
        batchNumber: 'PCM2024001',
        description: 'Pain relief and fever reducer',
        sideEffects: ['Nausea', 'Dizziness'],
        contraindications: ['Liver disease'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Amoxicillin',
        category: 'Antibiotic',
        manufacturer: 'Sun Pharma',
        dosage: '250mg',
        unit: 'capsules',
        price: 125.75,
        stock: 25,
        minStock: 30,
        expiryDate: '2025-06-30',
        batchNumber: 'AMX2024002',
        description: 'Broad-spectrum antibiotic',
        sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
        contraindications: ['Penicillin allergy'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Amlodipine',
        category: 'Blood Pressure',
        manufacturer: 'Dr. Reddy\'s Labs',
        dosage: '5mg',
        unit: 'tablets',
        price: 89.25,
        stock: 80,
        minStock: 40,
        expiryDate: '2025-09-15',
        batchNumber: 'AML2024003',
        description: 'Calcium channel blocker for hypertension',
        sideEffects: ['Swelling of ankles', 'Dizziness'],
        contraindications: ['Pregnancy', 'Severe heart failure'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Metformin',
        category: 'Diabetes',
        manufacturer: 'Lupin Pharmaceuticals',
        dosage: '500mg',
        unit: 'tablets',
        price: 67.80,
        stock: 120,
        minStock: 60,
        expiryDate: '2025-11-20',
        batchNumber: 'MET2024004',
        description: 'Type 2 diabetes medication',
        sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
        contraindications: ['Kidney disease', 'Liver disease'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Azithromycin',
        category: 'Antibiotic',
        manufacturer: 'Torrent Pharmaceuticals',
        dosage: '250mg',
        unit: 'tablets',
        price: 156.90,
        stock: 8,
        minStock: 25,
        expiryDate: '2025-08-10',
        batchNumber: 'AZI2024005',
        description: 'Macrolide antibiotic for respiratory infections',
        sideEffects: ['Stomach upset', 'Diarrhea'],
        contraindications: ['Liver problems', 'Heart rhythm disorders'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    setPatients(mockPatients);
    setMedicines(mockMedicines);

    // Add some mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Azithromycin stock is below minimum threshold (8 remaining)',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'info',
        title: 'New Patient Registered',
        message: 'Rajesh Kumar Sharma has been added to the patient list',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'error',
        title: 'Critical Patient Alert',
        message: 'Mohammed Arif Khan requires immediate attention',
        read: false,
        createdAt: new Date().toISOString(),
      }
    ];

    setNotifications(mockNotifications);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  // Patient management
  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      medicalHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPatients(prev => [...prev, newPatient]);
    addNotification({
      type: 'success',
      title: 'Patient Added',
      message: `${newPatient.name} has been successfully registered`,
      read: false,
    });
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(patient =>
        patient.id === id
          ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
          : patient
      )
    );
  };

  const deletePatient = (id: string) => {
    const patient = patients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    if (patient) {
      addNotification({
        type: 'info',
        title: 'Patient Removed',
        message: `${patient.name} has been removed from the system`,
        read: false,
      });
    }
  };

  const getPatient = (id: string) => {
    return patients.find(p => p.id === id);
  };

  // Medical Records
  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setMedicalRecords(prev => [...prev, newRecord]);
  };

  const getPatientRecords = (patientId: string) => {
    return medicalRecords.filter(record => record.patientId === patientId);
  };

  // Medicine management
  const addMedicine = (medicineData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMedicine: Medicine = {
      ...medicineData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMedicines(prev => [...prev, newMedicine]);
    addNotification({
      type: 'success',
      title: 'Medicine Added',
      message: `${newMedicine.name} has been added to inventory`,
      read: false,
    });
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setMedicines(prev =>
      prev.map(medicine =>
        medicine.id === id
          ? { ...medicine, ...updates, updatedAt: new Date().toISOString() }
          : medicine
      )
    );
  };

  const deleteMedicine = (id: string) => {
    const medicine = medicines.find(m => m.id === id);
    setMedicines(prev => prev.filter(m => m.id !== id));
    if (medicine) {
      addNotification({
        type: 'info',
        title: 'Medicine Removed',
        message: `${medicine.name} has been removed from inventory`,
        read: false,
      });
    }
  };

  const getMedicine = (id: string) => {
    return medicines.find(m => m.id === id);
  };

  // Appointments
  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    );
  };

  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(apt => new Date(apt.date).toDateString() === today);
  };

  // Notifications
  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Dashboard Stats
  const getDashboardStats = (): DashboardStats => {
    const today = new Date().toDateString();
    const todayPatients = patients.filter(p => 
      new Date(p.appointmentDate).toDateString() === today
    );
    const criticalPatients = patients.filter(p => p.status === 'critical');
    const lowStockMedicines = medicines.filter(m => m.stock <= m.minStock);
    const todayAppointments = getTodayAppointments();
    const completedConsultations = patients.filter(p => p.status === 'completed');

    return {
      totalPatients: patients.length,
      patientsToday: todayPatients.length,
      criticalPatients: criticalPatients.length,
      lowStockMedicines: lowStockMedicines.length,
      appointmentsToday: todayAppointments.length,
      completedConsultations: completedConsultations.length,
    };
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient,
        medicalRecords,
        addMedicalRecord,
        getPatientRecords,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        getMedicine,
        appointments,
        addAppointment,
        updateAppointment,
        getTodayAppointments,
        notifications,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
        getDashboardStats,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};