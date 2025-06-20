import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Medicine } from '../types';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Package,
  IndianRupee,
  Calendar,
  Building,
  Tag
} from 'lucide-react';
import Modal from '../components/Modal';
import MedicineForm from '../components/MedicineForm';
import LoadingSpinner from '../components/LoadingSpinner';

const MedicinesPage: React.FC = () => {
  const { 
    medicines, 
    addMedicine, 
    updateMedicine, 
    deleteMedicine, 
    searchTerm, 
    setSearchTerm,
    addNotification 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'expiry' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(medicines.map(med => med.category))];
    return uniqueCategories.sort();
  }, [medicines]);

  // Filter and search medicines
  const filteredMedicines = useMemo(() => {
    let filtered = [...medicines];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(medicine => medicine.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'low':
          filtered = filtered.filter(medicine => medicine.stock <= medicine.minStock);
          break;
        case 'out':
          filtered = filtered.filter(medicine => medicine.stock === 0);
          break;
        case 'available':
          filtered = filtered.filter(medicine => medicine.stock > medicine.minStock);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'expiry':
          aValue = new Date(a.expiryDate);
          bValue = new Date(b.expiryDate);
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
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
  }, [medicines, searchTerm, categoryFilter, stockFilter, sortBy, sortOrder]);

  const handleAddMedicine = async (medicineData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addMedicine(medicineData);
      setIsAddModalOpen(false);
      addNotification({
        type: 'success',
        title: 'Medicine Added',
        message: `${medicineData.name} has been added to inventory`,
        read: false,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add medicine. Please try again.',
        read: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMedicine = async (medicineData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedMedicine) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateMedicine(selectedMedicine.id, medicineData);
      setIsEditModalOpen(false);
      setSelectedMedicine(null);
      addNotification({
        type: 'success',
        title: 'Medicine Updated',
        message: `${medicineData.name} has been updated`,
        read: false,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update medicine. Please try again.',
        read: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedicine = (medicine: Medicine) => {
    if (window.confirm(`Are you sure you want to delete ${medicine.name}?`)) {
      deleteMedicine(medicine.id);
      addNotification({
        type: 'info',
        title: 'Medicine Deleted',
        message: `${medicine.name} has been removed from inventory`,
        read: false,
      });
    }
  };

  const handleEditClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsEditModalOpen(true);
  };

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.stock === 0) {
      return { text: 'Out of Stock', color: 'text-error-700 bg-error-100 dark:bg-error-900/20 dark:text-error-400' };
    } else if (medicine.stock <= medicine.minStock) {
      return { text: 'Low Stock', color: 'text-warning-700 bg-warning-100 dark:bg-warning-900/20 dark:text-warning-400' };
    } else {
      return { text: 'In Stock', color: 'text-success-700 bg-success-100 dark:bg-success-900/20 dark:text-success-400' };
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl mr-4">
              <Pill className="w-8 h-8 text-white" />
            </div>
            Medicine Inventory
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage medicine inventory, stock levels, and expiry dates
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
          aria-label="Add new medicine"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl">
              <Package className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Medicines</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{medicines.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-900/20 dark:to-warning-800/20 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {medicines.filter(m => m.stock <= m.minStock).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-error-100 to-error-200 dark:from-error-900/20 dark:to-error-800/20 rounded-xl">
              <Calendar className="w-8 h-8 text-error-600 dark:text-error-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiring Soon</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {medicines.filter(m => isExpiringSoon(m.expiryDate)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900/20 dark:to-success-800/20 rounded-xl">
              <IndianRupee className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(medicines.reduce((total, med) => total + (med.price * med.stock), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              aria-label="Search medicines"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              aria-label="Filter by stock status"
            >
              <option value="all">All Stock Levels</option>
              <option value="available">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort as 'name' | 'stock' | 'expiry' | 'price');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              aria-label="Sort medicines"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="stock-asc">Stock Low to High</option>
              <option value="stock-desc">Stock High to Low</option>
              <option value="expiry-asc">Expiry Earliest</option>
              <option value="expiry-desc">Expiry Latest</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {filteredMedicines.length} of {medicines.length} medicines
          </span>
          {(searchTerm || categoryFilter !== 'all' || stockFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStockFilter('all');
              }}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Medicines List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredMedicines.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMedicines.map((medicine) => {
                  const stockStatus = getStockStatus(medicine);
                  const expiringSoon = isExpiringSoon(medicine.expiryDate);
                  
                  return (
                    <tr
                      key={medicine.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700 flex items-center justify-center">
                              <Pill className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {medicine.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              {medicine.manufacturer}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-300">
                          <Tag className="w-3 h-3 mr-1" />
                          {medicine.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {medicine.stock} {medicine.unit} (min: {medicine.minStock})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-semibold flex items-center">
                          <IndianRupee className="w-4 h-4 mr-1" />
                          {medicine.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          per {medicine.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${expiringSoon ? 'text-error-600 dark:text-error-400 font-semibold' : 'text-gray-900 dark:text-white'}`}>
                          {formatDate(medicine.expiryDate)}
                        </div>
                        {expiringSoon && (
                          <div className="text-xs text-error-500 dark:text-error-400 flex items-center mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Expiring Soon
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {medicine.batchNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {medicine.dosage}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(medicine)}
                            className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300 p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors duration-200"
                            aria-label={`Edit ${medicine.name}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedicine(medicine)}
                            className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300 p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors duration-200"
                            aria-label={`Delete ${medicine.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Pill className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">
              {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                ? 'No medicines match your search criteria'
                : 'No medicines in inventory yet'
              }
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first medicine to get started'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && stockFilter === 'all' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Medicine
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Medicine"
        size="xl"
      >
        <MedicineForm
          onSubmit={handleAddMedicine}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMedicine(null);
        }}
        title="Edit Medicine Information"
        size="xl"
      >
        {selectedMedicine && (
          <MedicineForm
            medicine={selectedMedicine}
            onSubmit={handleEditMedicine}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedMedicine(null);
            }}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </div>
  );
};

export default MedicinesPage;