import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import {
  getVacancies,
  createVacancy,
  updateVacancy,
  deleteVacancy,
} from '../services/api';
import { useDataFetching } from '../hooks/useDataFetching';
import { useTable } from '../hooks/useTable';
import Table from '../components/Table';
import Modal from '../components/Modal';
import VacancyForm from '../components/VacancyForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Vacancies() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [formData, setFormData] = useState({
    vacancy_name: '',
    min_exp: '',
    max_age: '',
    salary: '',
    description: '',
    publish_date: '',
    expired_date: '',
    flag_status: 1,
  });

  const { data: vacancies, isLoading, error, setData: setVacancies } = useDataFetching(getVacancies, []);

  const columns = [
    { accessorKey: 'vacancy_name', header: 'Vacancy Name' },
    { accessorKey: 'min_exp', header: 'Min Experience' },
    { accessorKey: 'max_age', header: 'Max Age' },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ row }) => row.original.salary,
    },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'publish_date',
      header: 'Publish Date',
      cell: ({ row }) => format(new Date(row.original.publish_date), 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'expired_date',
      header: 'Expired Date',
      cell: ({ row }) => format(new Date(row.original.expired_date), 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'flag_status',
      header: 'Status',
      cell: ({ row }) => (
        row.original.flag_status === 1 ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Active</span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Inactive</span>
        )
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="inline-flex items-center justify-center rounded-md bg-white border border-blue-300 px-2 py-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-150"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.vacancy_id)}
            className="inline-flex items-center justify-center rounded-md bg-white border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors duration-150"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const table = useTable(vacancies, columns);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVacancy) {
        await updateVacancy(editingVacancy.vacancy_id, formData);
        setVacancies(
          vacancies.map((v) =>
            v.vacancy_id === editingVacancy.vacancy_id ? { ...v, ...formData } : v
          )
        );
      } else {
        const response = await createVacancy(formData);
        setVacancies([...vacancies, response.data]);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving vacancy:', error);
    }
  };

  const handleEdit = (vacancy) => {
    setEditingVacancy(vacancy);
    setFormData(vacancy);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vacancy?')) {
      try {
        await deleteVacancy(id);
        setVacancies(vacancies.filter((vacancy) => vacancy.vacancy_id !== id));
      } catch (error) {
        console.error('Error deleting vacancy:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingVacancy(null);
    setFormData({
      vacancy_name: '',
      min_exp: '',
      max_age: '',
      salary: '',
      description: '',
      publish_date: '',
      expired_date: '',
      flag_status: 1,
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Vacancies</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all job vacancies in the system
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Vacancy
          </button>
        </div>
      </div>

      <Table table={table} totalItems={vacancies.length} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVacancy ? 'Edit Vacancy' : 'Add New Vacancy'}
        primaryAction={{
          label: editingVacancy ? 'Update' : 'Create',
          onClick: handleSubmit,
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setIsModalOpen(false),
        }}
      >
        <VacancyForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}