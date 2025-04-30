import { FormInput, FormSelect } from './Form';

export default function ApplicantForm({ formData, setFormData, onSubmit, candidates, vacancies }) {
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormSelect
        label="Candidate"
        required
        value={formData.candidate_id}
        onChange={handleChange('candidate_id')}
        options={candidates.map(candidate => ({
          value: candidate.candidate_id,
          label: candidate.full_name
        }))}
      />
      
      <FormSelect
        label="Vacancy"
        required
        value={formData.vacancy_id}
        onChange={handleChange('vacancy_id')}
        options={vacancies.map(vacancy => ({
          value: vacancy.vacancy_id,
          label: vacancy.vacancy_name
        }))}
      />
      
      <FormInput
        label="Apply Date"
        type="date"
        required
        value={formData.apply_date}
        onChange={handleChange('apply_date')}
      />
      
      <FormSelect
        label="Status"
        required
        value={formData.apply_status}
        onChange={handleChange('apply_status')}
        options={[
          { value: 0, label: 'Pending' },
          { value: 1, label: 'Accepted' },
          { value: 2, label: 'Rejected' },
        ]}
      />
    </form>
  );
} 