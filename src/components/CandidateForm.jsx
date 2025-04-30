import { FormInput, FormSelect } from './Form';

export default function CandidateForm({ formData, setFormData, onSubmit }) {
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormInput
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange('email')}
      />
      
      <FormInput
        label="Phone Number"
        type="tel"
        value={formData.phone_number}
        onChange={handleChange('phone_number')}
      />
      
      <FormInput
        label="Full Name"
        required
        value={formData.full_name}
        onChange={handleChange('full_name')}
      />
      
      <FormInput
        label="Date of Birth"
        type="date"
        required
        value={formData.dob}
        onChange={handleChange('dob')}
      />
      
      <FormInput
        label="Place of Birth"
        required
        value={formData.pob}
        onChange={handleChange('pob')}
      />
      
      <FormSelect
        label="Gender"
        required
        value={formData.gender}
        onChange={handleChange('gender')}
        options={[
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' },
        ]}
      />
      
      <FormInput
        label="Years of Experience"
        type="number"
        required
        value={formData.year_exp}
        onChange={handleChange('year_exp')}
      />
      
      <FormInput
        label="Last Salary"
        type="number"
        value={formData.last_salary}
        onChange={handleChange('last_salary')}
      />
    </form>
  );
} 