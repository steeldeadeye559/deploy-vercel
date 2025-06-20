import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Patient } from '../types';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus,
  Calendar,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import Modal from '../components/Modal';
import PatientForm from '../components/PatientForm';
import PatientHistory from '../components/PatientHistory';
import LoadingSpinner from '../components/LoadingSpinner';

const PatientsPage: React.FC = () => {
  const { 
    patients, 
    addPatient, 
    updatePatient, 
    deletePatient, 
    searchTerm, 
    setSearchTerm,
    addNotification 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and search patients
  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(patient => patient.priority === priorityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.appointmentDate);
          bValue = new Date(b.appointmentDate);
          break;
        case 'priority':
          const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [patients, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const handleAddPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addPatient(patientData);
      setIsAddModalOpen(false);
      addNotification({
        type: 'success',
        title: 'Patient Added',
        message: `${patientData.name} has been successfully registered`,
        read: false,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add patient. Please try again.',
        read: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedPatient) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      updatePatient(selectedPatient.id, patientData);
      setIsEditModalOpen(false);
      setSelectedPatient(null);
      addNotification({
        type: 'success',
        title: 'Patient Updated',
        message: `${patientData.name}'s information has been updated`,
        read: false,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update patient. Please try again.',
        read: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      deletePatient(patient.id);
      addNotification({
        type: 'info',
        title: 'Patient Deleted',
        message: `${patient.name} has been removed from the system`,
        read: false,
      });
    }
  };

  const handleViewHistory = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsHistoryModalOpen(true);
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-error-500" />;
      case 'in-consultation':
        return <Activity className="w-4 h-4 text-secondary-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      default:
        return <Clock className="w-4 h-4 text-warning-500" />;
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-8 h-8 mr-3 text-primary-600 dark:text-primary-400" />
            Patient Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage patient information, appointments, and medical records
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
          aria-label="Add new patient"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Patient
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              aria-label="Search patients"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="waiting">Waiting</option>
                <option value="in-consultation">In Consultation</option>
                <option value="completed">Completed</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort as 'name' | 'date' | 'priority');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              aria-label="Sort patients"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="priority-desc">High Priority First</option>
              <option value="priority-asc">Low Priority First</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {filteredPatients.length} of {patients.length} patients
          </span>
          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Appointment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Symptoms
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                              {patient.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {patient.bloodType} • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {patient.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(patient.appointmentDate)}
                      </div>
                      {patient.assignedDoctor && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {patient.assignedDoctor}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {getStatusIcon(patient.status)}
                        <span className="ml-1">
                          {patient.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(patient.priority)}`}>
                        {patient.priority.charAt(0).toUpperCase() + patient.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {patient.symptoms}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewHistory(patient)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                          aria-label={`View ${patient.name}'s history`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(patient)}
                          className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300 p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors duration-200"
                          aria-label={`Edit ${patient.name}'s information`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient)}
                          className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300 p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors duration-200"
                          aria-label={`Delete ${patient.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No patients match your search criteria'
                : 'No patients registered yet'
              }
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first patient to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Patient
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Patient"
        size="xl"
      >
        <PatientForm
          onSubmit={handleAddPatient}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPatient(null);
        }}
        title="Edit Patient Information"
        size="xl"
      >
        {selectedPatient && (
          <PatientForm
            patient={selectedPatient}
            onSubmit={handleEditPatient}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedPatient(null);
            }}
            isLoading={isLoading}
          />
        )}
      </Modal>

      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedPatient(null);
        }}
        title="Patient History & Details"
        size="xl"
      >
        {selectedPatient && (
          <PatientHistory patient={selectedPatient} />
        )}
      </Modal>
    </div>
  );
};

export default PatientsPage;