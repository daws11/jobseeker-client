import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '../services/api';
import { useDataFetching } from '../hooks/useDataFetching';
import { useTable } from '../hooks/useTable';
import Table from '../components/Table';
import Modal from '../components/Modal';
import CandidateForm from '../components/CandidateForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Candidates() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    full_name: '',
    dob: '',
    pob: '',
    gender: '',
    year_exp: '',
    last_salary: '',
  });

  const { data: candidates, isLoading, error, setData: setCandidates } = useDataFetching(getCandidates, []);

  const columns = [
    { accessorKey: 'full_name', header: 'Full Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone_number', header: 'Phone Number' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'year_exp', header: 'Years of Experience' },
    { accessorKey: 'last_salary', header: 'Last Salary' },
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
            onClick={() => handleDelete(row.original.candidate_id)}
            className="inline-flex items-center justify-center rounded-md bg-white border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors duration-150"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const table = useTable(candidates, columns);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCandidate) {
        await updateCandidate(editingCandidate.candidate_id, formData);
        setCandidates(
          candidates.map((c) =>
            c.candidate_id === editingCandidate.candidate_id ? { ...c, ...formData } : c
          )
        );
      } else {
        const response = await createCandidate(formData);
        setCandidates([...candidates, response.data]);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData(candidate);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteCandidate(id);
        setCandidates(candidates.filter((candidate) => candidate.candidate_id !== id));
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const resetForm = () => {
              setEditingCandidate(null);
              setFormData({
                email: '',
                phone_number: '',
                full_name: '',
                dob: '',
                pob: '',
                gender: '',
                year_exp: '',
                last_salary: '',
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
          <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all candidates in the system
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
            Add Candidate
          </button>
        </div>
      </div>

      <Table table={table} totalItems={candidates.length} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        primaryAction={{
          label: editingCandidate ? 'Update' : 'Create',
          onClick: handleSubmit,
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setIsModalOpen(false),
        }}
                      >
        <CandidateForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
} 