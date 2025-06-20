import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Users, 
  Pill, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Activity,
  CheckCircle,
  UserPlus,
  Package,
  DollarSign
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    patients, 
    medicines, 
    appointments, 
    getDashboardStats,
    addNotification 
  } = useApp();

  const stats = getDashboardStats();
  
  // Get recent patients (last 5)
  const recentPatients = patients
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get low stock medicines
  const lowStockMedicines = medicines.filter(med => med.stock <= med.minStock);

  // Get critical patients
  const criticalPatients = patients.filter(patient => patient.status === 'critical');

  // Get today's appointments
  const today = new Date().toDateString();
  const todayAppointments = patients.filter(patient => 
    new Date(patient.appointmentDate).toDateString() === today
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-error-700 bg-error-100 dark:bg-error-900/20 dark:text-error-400';
      case 'in-consultation':
        return 'text-secondary-700 bg-secondary-100 dark:bg-secondary-900/20 dark:text-secondary-400';
      case 'completed':
        return 'text-success-700 bg-success-100 dark:bg-success-900/20 dark:text-success-400';
      default:
        return 'text-warning-700 bg-warning-100 dark:bg-warning-900/20 dark:text-warning-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-error-700 bg-error-100 dark:bg-error-900/20 dark:text-error-400';
      case 'high':
        return 'text-warning-700 bg-warning-100 dark:bg-warning-900/20 dark:text-warning-400';
      case 'medium':
        return 'text-secondary-700 bg-secondary-100 dark:bg-secondary-900/20 dark:text-secondary-400';
      case 'low':
        return 'text-success-700 bg-success-100 dark:bg-success-900/20 dark:text-success-400';
      default:
        return 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
            </h1>
            <p className="text-primary-100 text-lg">
              Welcome back to your Hospital Management Dashboard
            </p>
            <p className="text-primary-200 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="hidden md:block">
            <Activity className="w-24 h-24 text-primary-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-xl">
              <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPatients}</p>
              <p className="text-sm text-primary-600 dark:text-primary-400 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stats.patientsToday} today
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 dark:bg-warning-900/20 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Patients</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.criticalPatients}</p>
              <p className="text-sm text-warning-600 dark:text-warning-400">
                Require immediate attention
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900/20 rounded-xl">
              <Calendar className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Appointments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.appointmentsToday}</p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {stats.completedConsultations} completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-error-100 dark:bg-error-900/20 rounded-xl">
              <Pill className="w-8 h-8 text-error-600 dark:text-error-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock Medicines</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.lowStockMedicines}</p>
              <p className="text-sm text-error-600 dark:text-error-400">
                Need restocking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Today's Appointments
            </h2>
          </div>
          <div className="p-6">
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.slice(0, 5).map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                          {patient.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(patient.appointmentDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(patient.priority)}`}>
                        {patient.priority}
                      </span>
                    </div>
                  </div>
                ))}
                {todayAppointments.length > 5 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      +{todayAppointments.length - 5} more appointments
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Critical Patients */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-error-600 dark:text-error-400" />
              Critical Patients
            </h2>
          </div>
          <div className="p-6">
            {criticalPatients.length > 0 ? (
              <div className="space-y-4">
                {criticalPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-error-100 dark:bg-error-800 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {patient.symptoms}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-error-600 dark:text-error-400 font-medium">
                        CRITICAL
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(patient.appointmentDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-success-300 dark:text-success-600 mx-auto mb-4" />
                <p className="text-success-600 dark:text-success-400 font-medium">No critical patients</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">All patients are stable</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-success-600 dark:text-success-400" />
              Recent Patients
            </h2>
          </div>
          <div className="p-6">
            {recentPatients.length > 0 ? (
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-success-100 dark:bg-success-800 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-success-700 dark:text-success-300">
                          {patient.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Registered {formatDate(patient.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No patients registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Medicines */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Package className="w-5 h-5 mr-2 text-warning-600 dark:text-warning-400" />
              Low Stock Medicines
            </h2>
          </div>
          <div className="p-6">
            {lowStockMedicines.length > 0 ? (
              <div className="space-y-4">
                {lowStockMedicines.slice(0, 5).map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-center justify-between p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-warning-100 dark:bg-warning-800 rounded-full flex items-center justify-center">
                        <Pill className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {medicine.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {medicine.category} • {medicine.manufacturer}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-warning-600 dark:text-warning-400">
                        {medicine.stock} {medicine.unit}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Min: {medicine.minStock}
                      </p>
                    </div>
                  </div>
                ))}
                {lowStockMedicines.length > 5 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      +{lowStockMedicines.length - 5} more medicines need restocking
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-success-300 dark:text-success-600 mx-auto mb-4" />
                <p className="text-success-600 dark:text-success-400 font-medium">All medicines well stocked</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">No medicines need restocking</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => addNotification({
              type: 'info',
              title: 'Quick Action',
              message: 'Add Patient feature would open here',
              read: false,
            })}
            className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200"
          >
            <UserPlus className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium text-primary-900 dark:text-primary-100">Add New Patient</p>
              <p className="text-xs text-primary-600 dark:text-primary-400">Register a new patient</p>
            </div>
          </button>

          <button
            onClick={() => addNotification({
              type: 'info',
              title: 'Quick Action',
              message: 'Add Medicine feature would open here',
              read: false,
            })}
            className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors duration-200"
          >
            <Pill className="w-6 h-6 text-secondary-600 dark:text-secondary-400 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Add Medicine</p>
              <p className="text-xs text-secondary-600 dark:text-secondary-400">Add to inventory</p>
            </div>
          </button>

          <button
            onClick={() => addNotification({
              type: 'info',
              title: 'Quick Action',
              message: 'Schedule Appointment feature would open here',
              read: false,
            })}
            className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors duration-200"
          >
            <Calendar className="w-6 h-6 text-accent-600 dark:text-accent-400 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium text-accent-900 dark:text-accent-100">Schedule Appointment</p>
              <p className="text-xs text-accent-600 dark:text-accent-400">Book new appointment</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;