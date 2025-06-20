import React, { useState, useEffect } from 'react';
import { Medicine } from '../types';
import { useApp } from '../contexts/AppContext';
import { Pill, IndianRupee, Package, Calendar, AlertTriangle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface MedicineFormProps {
  medicine?: Medicine;
  onSubmit: (medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ 
  medicine, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    manufacturer: '',
    dosage: '',
    unit: 'tablets',
    price: 0,
    stock: 0,
    minStock: 10,
    expiryDate: '',
    batchNumber: '',
    description: '',
    sideEffects: [] as string[],
    contraindications: [] as string[],
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sideEffectInput, setSideEffectInput] = useState('');
  const [contraindicationInput, setContraindicationInput] = useState('');

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        category: medicine.category,
        manufacturer: medicine.manufacturer,
        dosage: medicine.dosage,
        unit: medicine.unit,
        price: medicine.price,
        stock: medicine.stock,
        minStock: medicine.minStock,
        expiryDate: medicine.expiryDate,
        batchNumber: medicine.batchNumber,
        description: medicine.description,
        sideEffects: medicine.sideEffects,
        contraindications: medicine.contraindications,
        isActive: medicine.isActive,
      });
    }
  }, [medicine]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Medicine name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (formData.minStock < 0) newErrors.minStock = 'Minimum stock cannot be negative';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Batch number is required';

    // Check if expiry date is in the future
    if (formData.expiryDate && new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const convertedValue = type === 'number' ? parseFloat(value) || 0 : 
                          type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: convertedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSideEffect = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && sideEffectInput.trim()) {
      e.preventDefault();
      if (!formData.sideEffects.includes(sideEffectInput.trim())) {
        setFormData(prev => ({
          ...prev,
          sideEffects: [...prev.sideEffects, sideEffectInput.trim()]
        }));
      }
      setSideEffectInput('');
    }
  };

  const handleRemoveSideEffect = (effect: string) => {
    setFormData(prev => ({
      ...prev,
      sideEffects: prev.sideEffects.filter(e => e !== effect)
    }));
  };

  const handleAddContraindication = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && contraindicationInput.trim()) {
      e.preventDefault();
      if (!formData.contraindications.includes(contraindicationInput.trim())) {
        setFormData(prev => ({
          ...prev,
          contraindications: [...prev.contraindications, contraindicationInput.trim()]
        }));
      }
      setContraindicationInput('');
    }
  };

  const handleRemoveContraindication = (contraindication: string) => {
    setFormData(prev => ({
      ...prev,
      contraindications: prev.contraindications.filter(c => c !== contraindication)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const medicineCategories = [
    'Pain Relief',
    'Antibiotic',
    'Blood Pressure',
    'Diabetes',
    'Heart Disease',
    'Mental Health',
    'Respiratory',
    'Digestive',
    'Skin Care',
    'Vitamins',
    'Ayurvedic',
    'Homeopathic',
    'Other'
  ];

  const indianManufacturers = [
    'Cipla Ltd',
    'Sun Pharma',
    'Dr. Reddy\'s Labs',
    'Lupin Pharmaceuticals',
    'Torrent Pharmaceuticals',
    'Aurobindo Pharma',
    'Cadila Healthcare',
    'Glenmark Pharmaceuticals',
    'Biocon',
    'Divi\'s Laboratories',
    'Alkem Laboratories',
    'Mankind Pharma',
    'Other'
  ];

  const units = [
    'tablets',
    'capsules',
    'ml',
    'mg',
    'syrup',
    'injection',
    'drops',
    'patches',
    'cream',
    'ointment'
  ];

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Pill className="w-4 h-4 inline mr-2" />
              Medicine Name *
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
              placeholder="Enter medicine name"
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
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${errors.category ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                transition-colors duration-200
              `}
              aria-invalid={errors.category ? 'true' : 'false'}
              aria-describedby={errors.category ? 'category-error' : undefined}
            >
              <option value="">Select category</option>
              {medicineCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p id="category-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="manufacturer" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Manufacturer *
            </label>
            <select
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${errors.manufacturer ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                transition-colors duration-200
              `}
              aria-invalid={errors.manufacturer ? 'true' : 'false'}
              aria-describedby={errors.manufacturer ? 'manufacturer-error' : undefined}
            >
              <option value="">Select manufacturer</option>
              {indianManufacturers.map(manufacturer => (
                <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
              ))}
            </select>
            {errors.manufacturer && (
              <p id="manufacturer-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {errors.manufacturer}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="batchNumber" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Batch Number *
            </label>
            <input
              type="text"
              id="batchNumber"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleInputChange}
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${errors.batchNumber ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                transition-colors duration-200
              `}
              placeholder="Enter batch number"
              aria-invalid={errors.batchNumber ? 'true' : 'false'}
              aria-describedby={errors.batchNumber ? 'batch-error' : undefined}
            />
            {errors.batchNumber && (
              <p id="batch-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {errors.batchNumber}
              </p>
            )}
          </div>
        </div>

        {/* Dosage and Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dosage" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Dosage *
            </label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${errors.dosage ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                transition-colors duration-200
              `}
              placeholder="e.g., 500mg, 10ml"
              aria-invalid={errors.dosage ? 'true' : 'false'}
              aria-describedby={errors.dosage ? 'dosage-error' : undefined}
            />
            {errors.dosage && (
              <p id="dosage-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {errors.dosage}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Unit
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <IndianRupee className="w-4 h-4 inline mr-2" />
              Price (INR) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${errors.price ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                transition-colors duration-200
              `}
              placeholder="0.00"
              aria-invalid={errors.price ? 'true' : 'false'}
              aria-describedby={errors.price ? 'price-error' : undefined}
            />
            {errors.price && (
              <p id="price-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Current Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${errors.stock ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                transition-colors duration-200
              `}
              placeholder="0"
              aria-invalid={errors.stock ? 'true' : 'false'}
              aria-describedby={errors.stock ? 'stock-error' : undefined}
            />
            {errors.stock && (
              <p id="stock-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {errors.stock}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="minStock" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Minimum Stock *
            </label>
            <input
              type="number"
              id="minStock"
              name="minStock"
              value={formData.minStock}
              onChange={handleInputChange}
              min="0"
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${errors.minStock ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                transition-colors duration-200
              `}
              placeholder="0"
              aria-invalid={errors.minStock ? 'true' : 'false'}
              aria-describedby={errors.minStock ? 'minStock-error' : undefined}
            />
            {errors.minStock && (
              <p id="minStock-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {errors.minStock}
              </p>
            )}
          </div>
        </div>

        {/* Expiry Date */}
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Expiry Date *
          </label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.expiryDate ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              transition-colors duration-200
            `}
            aria-invalid={errors.expiryDate ? 'true' : 'false'}
            aria-describedby={errors.expiryDate ? 'expiry-error' : undefined}
          />
          {errors.expiryDate && (
            <p id="expiry-error" className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {errors.expiryDate}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            placeholder="Enter medicine description..."
          />
        </div>

        {/* Side Effects */}
        <div>
          <label htmlFor="sideEffects" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Side Effects
          </label>
          <input
            type="text"
            id="sideEffects"
            value={sideEffectInput}
            onChange={(e) => setSideEffectInput(e.target.value)}
            onKeyDown={handleAddSideEffect}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            placeholder="Type side effect and press Enter"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Press Enter to add each side effect</p>
          
          {formData.sideEffects.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.sideEffects.map((effect, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-300"
                >
                  {effect}
                  <button
                    type="button"
                    onClick={() => handleRemoveSideEffect(effect)}
                    className="ml-2 text-warning-600 dark:text-warning-400 hover:text-warning-800 dark:hover:text-warning-200"
                    aria-label={`Remove ${effect} side effect`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contraindications */}
        <div>
          <label htmlFor="contraindications" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Contraindications
          </label>
          <input
            type="text"
            id="contraindications"
            value={contraindicationInput}
            onChange={(e) => setContraindicationInput(e.target.value)}
            onKeyDown={handleAddContraindication}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            placeholder="Type contraindication and press Enter"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Press Enter to add each contraindication</p>
          
          {formData.contraindications.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.contraindications.map((contraindication, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-300"
                >
                  {contraindication}
                  <button
                    type="button"
                    onClick={() => handleRemoveContraindication(contraindication)}
                    className="ml-2 text-error-600 dark:text-error-400 hover:text-error-800 dark:hover:text-error-200"
                    aria-label={`Remove ${contraindication} contraindication`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-600 focus:ring-2"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Medicine is active and available for prescription
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading && <LoadingSpinner size="sm" color="white" className="mr-2" />}
            {medicine ? 'Update Medicine' : 'Add Medicine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicineForm;