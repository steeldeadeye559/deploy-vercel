import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { useApp } from '../contexts/AppContext';
import { Calendar, User, Phone, Mail, MapPin, AlertTriangle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ 
  patient, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const { addNotification } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    emergencyContact: '',
    bloodType: '',
    allergies: [] as string[],
    symptoms: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    status: 'waiting' as 'waiting' | 'in-consultation' | 'completed' | 'critical',
    assignedDoctor: '',
    appointmentDate: new Date().toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allergyInput, setAllergyInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        bloodType: patient.bloodType,
        allergies: patient.allergies,
        symptoms: patient.symptoms,
        priority: patient.priority,
        status: patient.status,
        assignedDoctor: patient.assignedDoctor || '',
        appointmentDate: patient.appointmentDate.slice(0, 16),
      });
    }
  }, [patient]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
      if (!formData.bloodType.trim()) newErrors.bloodType = 'Blood type is required';
    }

    if (step === 3) {
      if (!formData.symptoms.trim()) newErrors.symptoms = 'Symptoms are required';
      if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddAllergy = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allergyInput.trim()) {
      e.preventDefault();
      if (!formData.allergies.includes(allergyInput.trim())) {
        setFormData(prev => ({
          ...prev,
          allergies: [...prev.allergies, allergyInput.trim()]
        }));
      }
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(1) && validateStep(2) && validateStep(3)) {
      onSubmit({
        ...formData,
        medicalHistory: patient?.medicalHistory || [],
      });
    }
  };

  const stepTitles = [
    'Personal Information',
    'Medical Information', 
    'Appointment Details'
  ];

  const indianDoctors = [
    'Dr. Priya Mehta',
    'Dr. Amit Singh',
    'Dr. Sunita Reddy',
    'Dr. Vikram Joshi',
    'Dr. Kavita Sharma',
    'Dr. Rajesh Kumar',
    'Dr. Neha Gupta',
    'Dr. Arjun Patel'
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}>
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
            ${step <= currentStep 
              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }
            transition-all duration-200
          `}>
            {step}
          </div>
          {step < 3 && (
            <div className={`
              w-16 h-1 mx-3 rounded-full
              ${step < currentStep ? 'bg-gradient-to-r from-primary-600 to-secondary-600' : 'bg-gray-200 dark:bg-gray-700'}
              transition-all duration-200
            `} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.name ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              transition-colors duration-200
            `}
            placeholder="Enter full name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.email ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              transition-colors duration-200
            `}
            placeholder="Enter email address"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.phone ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              transition-colors duration-200
            `}
            placeholder="+91-XXXXX-XXXXX"
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.dateOfBirth ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              transition-colors duration-200
            `}
            aria-invalid={errors.dateOfBirth ? 'true' : 'false'}
            aria-describedby={errors.dateOfBirth ? 'dob-error' : undefined}
          />
          {errors.dateOfBirth && (
            <p id="dob-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Address *
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          className={`
            w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${errors.address ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            transition-colors duration-200
          `}
          placeholder="Enter full address with pincode"
          aria-invalid={errors.address ? 'true' : 'false'}
          aria-describedby={errors.address ? 'address-error' : undefined}
        />
        {errors.address && (
          <p id="address-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            {errors.address}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="emergencyContact" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Emergency Contact *
          </label>
          <input
            type="tel"
            id="emergencyContact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.emergencyContact ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              transition-colors duration-200
            `}
            placeholder="+91-XXXXX-XXXXX"
            aria-invalid={errors.emergencyContact ? 'true' : 'false'}
            aria-describedby={errors.emergencyContact ? 'emergency-error' : undefined}
          />
          {errors.emergencyContact && (
            <p id="emergency-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {errors.emergencyContact}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="bloodType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Blood Type *
          </label>
          <select
            id="bloodType"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleInputChange}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.bloodType ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              transition-colors duration-200
            `}
            aria-invalid={errors.bloodType ? 'true' : 'false'}
            aria-describedby={errors.bloodType ? 'blood-error' : undefined}
          >
            <option value="">Select blood type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          {errors.bloodType && (
            <p id="blood-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {errors.bloodType}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="allergies" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Allergies
        </label>
        <input
          type="text"
          id="allergies"
          value={allergyInput}
          onChange={(e) => setAllergyInput(e.target.value)}
          onKeyDown={handleAddAllergy}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          placeholder="Type allergy and press Enter"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Press Enter to add each allergy</p>
        
        {formData.allergies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.allergies.map((allergy, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-300"
              >
                {allergy}
                <button
                  type="button"
                  onClick={() => handleRemoveAllergy(allergy)}
                  className="ml-2 text-warning-600 dark:text-warning-400 hover:text-warning-800 dark:hover:text-warning-200"
                  aria-label={`Remove ${allergy} allergy`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="symptoms" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Symptoms *
        </label>
        <textarea
          id="symptoms"
          name="symptoms"
          value={formData.symptoms}
          onChange={handleInputChange}
          rows={4}
          className={`
            w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${errors.symptoms ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            transition-colors duration-200
          `}
          placeholder="Describe symptoms in detail..."
          aria-invalid={errors.symptoms ? 'true' : 'false'}
          aria-describedby={errors.symptoms ? 'symptoms-error' : undefined}
        />
        {errors.symptoms && (
          <p id="symptoms-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            {errors.symptoms}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Priority Level
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            <option value="waiting">Waiting</option>
            <option value="in-consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="appointmentDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Appointment Date & Time *
          </label>
          <input
            type="datetime-local"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.appointmentDate ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              transition-colors duration-200
            `}
            aria-invalid={errors.appointmentDate ? 'true' : 'false'}
            aria-describedby={errors.appointmentDate ? 'appointment-error' : undefined}
          />
          {errors.appointmentDate && (
            <p id="appointment-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {errors.appointmentDate}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="assignedDoctor" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Assigned Doctor
          </label>
          <select
            id="assignedDoctor"
            name="assignedDoctor"
            value={formData.assignedDoctor}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            <option value="">Select doctor</option>
            {indianDoctors.map(doctor => (
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {stepTitles[currentStep - 1]}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Step {currentStep} of 3 - Fill in the required information
        </p>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit}>
        <div className="min-h-[400px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Cancel
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading && <LoadingSpinner size="sm" color="white" className="mr-2" />}
                {patient ? 'Update Patient' : 'Add Patient'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;