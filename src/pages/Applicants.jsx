import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import {
  getApplicants,
  createApplicant,
  updateApplicantStatus,
  deleteApplicant,
  getCandidates,
  getVacancies,
} from '../services/api';
import { useDataFetching } from '../hooks/useDataFetching';
import { useTable } from '../hooks/useTable';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ApplicantForm from '../components/ApplicantForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Applicants() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [formData, setFormData] = useState({
    vacancy_id: '',
    candidate_id: '',
    apply_date: '',
    apply_status: 0,
  });

  const { data: applicants, isLoading: isLoadingApplicants, error: applicantsError, setData: setApplicants } = useDataFetching(getApplicants, []);
  const { data: candidates, isLoading: isLoadingCandidates, error: candidatesError } = useDataFetching(getCandidates, []);
  const { data: vacancies, isLoading: isLoadingVacancies, error: vacanciesError } = useDataFetching(getVacancies, []);

  const isLoading = isLoadingApplicants || isLoadingCandidates || isLoadingVacancies;
  const error = applicantsError || candidatesError || vacanciesError;

  const getStatusBadge = (status) => {
    const statusConfig = {
      0: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      1: { label: 'Accepted', className: 'bg-green-100 text-green-800' },
      2: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status] || statusConfig[0];
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      accessorKey: 'candidate_id',
      header: 'Candidate',
      cell: ({ row }) => {
        const candidate = candidates.find(c => c.candidate_id === row.original.candidate_id);
        return candidate ? candidate.full_name : 'N/A';
      },
    },
    {
      accessorKey: 'vacancy_id',
      header: 'Vacancy',
      cell: ({ row }) => {
        const vacancy = vacancies.find(v => v.vacancy_id === row.original.vacancy_id);
        return vacancy ? vacancy.vacancy_name : 'N/A';
      },
    },
    {
      accessorKey: 'apply_date',
      header: 'Apply Date',
      cell: ({ row }) => format(new Date(row.original.apply_date), 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'apply_status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.apply_status),
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
            onClick={() => handleDelete(row.original.applicant_id)}
            className="inline-flex items-center justify-center rounded-md bg-white border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors duration-150"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const table = useTable(applicants, columns);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingApplicant) {
        await updateApplicantStatus(editingApplicant.applicant_id, formData);
        setApplicants(
          applicants.map((a) =>
            a.applicant_id === editingApplicant.applicant_id ? { ...a, ...formData } : a
          )
        );
      } else {
        const response = await createApplicant(formData);
        setApplicants([...applicants, response.data]);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving applicant:', error);
    }
  };

  const handleEdit = (applicant) => {
    setEditingApplicant(applicant);
    setFormData(applicant);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplicant(id);
        setApplicants(applicants.filter((applicant) => applicant.applicant_id !== id));
      } catch (error) {
        console.error('Error deleting applicant:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingApplicant(null);
    setFormData({
      vacancy_id: '',
      candidate_id: '',
      apply_date: '',
      apply_status: 0,
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
          <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all job applications in the system
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
            Add Application
          </button>
        </div>
      </div>

      <Table table={table} totalItems={applicants.length} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApplicant ? 'Edit Application' : 'Add New Application'}
        primaryAction={{
          label: editingApplicant ? 'Update' : 'Create',
          onClick: handleSubmit,
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setIsModalOpen(false),
        }}
      >
        <ApplicantForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          candidates={candidates}
          vacancies={vacancies}
        />
      </Modal>
    </div>
  );
} 