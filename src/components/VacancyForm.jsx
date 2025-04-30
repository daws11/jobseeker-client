import { FormInput, FormSelect, FormTextarea } from './Form';

export default function VacancyForm({ formData, setFormData, onSubmit }) {
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormInput
        label="Vacancy Name"
        required
        value={formData.vacancy_name}
        onChange={handleChange('vacancy_name')}
      />
      
      <FormInput
        label="Minimum Experience"
        type="number"
        required
        value={formData.min_exp}
        onChange={handleChange('min_exp')}
      />
      
      <FormInput
        label="Maximum Age"
        type="number"
        required
        value={formData.max_age}
        onChange={handleChange('max_age')}
      />
      
      <FormInput
        label="Salary"
        type="number"
        required
        value={formData.salary}
        onChange={handleChange('salary')}
      />
      
      <FormTextarea
        label="Description"
        required
        value={formData.description}
        onChange={handleChange('description')}
        rows={4}
      />
      
      <FormInput
        label="Publish Date"
        type="date"
        required
        value={formData.publish_date}
        onChange={handleChange('publish_date')}
      />
      
      <FormInput
        label="Expiry Date"
        type="date"
        required
        value={formData.expired_date}
        onChange={handleChange('expired_date')}
      />
      
      <FormSelect
        label="Status"
        required
        value={formData.flag_status}
        onChange={handleChange('flag_status')}
        options={[
          { value: 1, label: 'Active' },
          { value: 0, label: 'Inactive' },
        ]}
      />
    </form>
  );
} 