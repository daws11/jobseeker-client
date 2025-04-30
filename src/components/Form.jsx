export const FormInput = ({ label, type = 'text', required = false, value, onChange, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-200 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
        {...props}
      />
    </div>
  );
};

export const FormSelect = ({ label, required = false, value, onChange, options, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <select
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-200 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const FormTextarea = ({ label, required = false, value, onChange, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <textarea
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-200 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
        {...props}
      />
    </div>
  );
}; 