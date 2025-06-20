import React from 'react';
import { Patient, MedicalRecord } from '../types';
import { useApp } from '../contexts/AppContext';
import { Calendar, User, FileText, Pill, Clock, AlertCircle } from 'lucide-react';

interface PatientHistoryProps {
  patient: Patient;
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ patient }) => {
  const { getPatientRecords } = useApp();
  
  const medicalRecords = getPatientRecords(patient.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-error-600 bg-error-100 dark:bg-error-900/20 dark:text-error-400';
      case 'high': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/20 dark:text-warning-400';
      case 'in-consultation': return 'text-secondary-600 bg-secondary-100 dark:bg-secondary-900/20 dark:text-secondary-400';
      case 'completed': return 'text-success-600 bg-success-100 dark:bg-success-900/20 dark:text-success-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-error-600 bg-error-100 dark:bg-error-900/20 dark:text-error-400';
      case 'high': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/20 dark:text-warning-400';
      case 'medium': return 'text-secondary-600 bg-secondary-100 dark:bg-secondary-900/20 dark:text-secondary-400';
      case 'low': return 'text-success-600 bg-success-100 dark:bg-success-900/20 dark:text-success-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      {/* Patient Basic Info */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{patient.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{patient.email}</p>
              <p className="text-gray-600 dark:text-gray-400">{patient.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                {patient.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(patient.priority)}`}>
                {patient.priority} Priority
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date of Birth</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(patient.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Blood Type</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{patient.bloodType}</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Assigned Doctor</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{patient.assignedDoctor || 'Not assigned'}</p>
          </div>
        </div>
      </div>

      {/* Current Visit Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          Current Visit
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Appointment Date</h4>
            <p className="text-gray-900 dark:text-white">{formatDate(patient.appointmentDate)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Emergency Contact</h4>
            <p className="text-gray-900 dark:text-white">{patient.emergencyContact}</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current Symptoms</h4>
            <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {patient.symptoms}
            </p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Address</h4>
            <p className="text-gray-900 dark:text-white">{patient.address}</p>
          </div>
        </div>
      </div>

      {/* Allergies */}
      {patient.allergies && patient.allergies.length > 0 && (
        <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-warning-800 dark:text-warning-300 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Allergies
          </h3>
          <div className="flex flex-wrap gap-2">
            {patient.allergies.map((allergy, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 rounded-full text-sm font-medium"
              >
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Medical History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          Medical History
        </h3>

        {medicalRecords.length > 0 ? (
          <div className="space-y-6">
            {medicalRecords.map((record, index) => (
              <div
                key={record.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{record.diagnosis}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(record.date)} - {record.doctorName}
                    </p>
                  </div>
                </div>

                {record.notes && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</h5>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      {record.notes}
                    </p>
                  </div>
                )}

                {record.prescription && record.prescription.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Pill className="w-4 h-4 mr-1" />
                      Prescription
                    </h5>
                    <div className="space-y-2">
                      {record.prescription.map((med, medIndex) => (
                        <div
                          key={medIndex}
                          className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-primary-900 dark:text-primary-100">
                                {med.medicineName}
                              </p>
                              <p className="text-sm text-primary-700 dark:text-primary-300">
                                {med.dosage} - {med.frequency} for {med.duration}
                              </p>
                              {med.instructions && (
                                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                                  Instructions: {med.instructions}
                                </p>
                              )}
                            </div>
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                              Qty: {med.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {record.followUpDate && (
                  <div className="mt-4 p-3 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded">
                    <p className="text-sm text-secondary-700 dark:text-secondary-300">
                      <strong>Follow-up scheduled:</strong> {formatDate(record.followUpDate)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No medical history available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Medical records will appear here after consultations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;