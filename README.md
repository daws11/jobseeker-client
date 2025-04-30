# Jobseeker Frontend Documentation

## Overview
This is the frontend application for the Jobseeker system, built with React, Tailwind CSS, and various modern libraries. The application provides a user-friendly interface for managing candidates, vacancies, and job applications.

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/daws11/jobseeker-client.git
cd jobseeker-client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout.jsx     # Main layout component
│   ├── Table.jsx      # Reusable table component
│   ├── Modal.jsx      # Modal dialog component
│   ├── Form.jsx       # Form components
│   └── ...
├── pages/             # Page components
│   ├── Candidates.jsx # Candidates management page
│   ├── Vacancies.jsx  # Vacancies management page
│   └── Applicants.jsx # Applications management page
├── hooks/             # Custom React hooks
│   ├── useDataFetching.js # Data fetching hook
│   └── useTable.js    # Table functionality hook
├── services/          # API services
│   └── api.js         # API integration
├── utils/             # Utility functions
└── App.jsx           # Main application component
```

## Components

### Layout Component
The main layout component that provides the application structure including navigation and header.

```jsx
import Layout from './components/Layout';

// Usage
<Layout>
  <YourPageContent />
</Layout>
```

### Table Component
A reusable table component with sorting, filtering, and pagination capabilities.

```jsx
import Table from './components/Table';

// Usage
<Table 
  table={tableInstance} 
  totalItems={data.length} 
/>
```

### Modal Component
A reusable modal dialog component for forms and confirmations.

```jsx
import Modal from './components/Modal';

// Usage
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  primaryAction={{
    label: "Save",
    onClick: handleSave
  }}
  secondaryAction={{
    label: "Cancel",
    onClick: handleClose
  }}
>
  <YourModalContent />
</Modal>
```

### Form Components
Reusable form components for consistent form handling across the application.

```jsx
import { FormInput, FormSelect, FormTextarea } from './components/Form';

// Usage
<FormInput
  label="Name"
  name="name"
  value={formData.name}
  onChange={handleChange}
  required
/>

<FormSelect
  label="Status"
  name="status"
  value={formData.status}
  onChange={handleChange}
  options={[
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' }
  ]}
  required
/>

<FormTextarea
  label="Description"
  name="description"
  value={formData.description}
  onChange={handleChange}
  required
/>
```

## Custom Hooks

### useDataFetching
A custom hook for handling data fetching with loading and error states.

```jsx
import { useDataFetching } from '../hooks/useDataFetching';

// Usage
const { data, isLoading, error, setData } = useDataFetching(fetchFunction, []);
```

### useTable
A custom hook for table functionality using TanStack Table.

```jsx
import { useTable } from '../hooks/useTable';

// Usage
const table = useTable(data, columns);
```

## Pages

### Candidates Page
Manages candidate information including:
- Viewing candidate list
- Adding new candidates
- Editing candidate details
- Deleting candidates

### Vacancies Page
Manages job vacancies including:
- Viewing vacancy list
- Adding new vacancies
- Editing vacancy details
- Deleting vacancies
- Managing vacancy status

### Applications Page
Manages job applications including:
- Viewing application list
- Adding new applications
- Updating application status
- Deleting applications

## State Management
The application uses React's built-in state management with hooks:
- `useState` for local component state
- `useEffect` for side effects
- Custom hooks for shared logic

## API Integration
API calls are centralized in the `services/api.js` file:

```javascript
// Example API service
export const getCandidates = async () => {
  const response = await fetch(`${API_URL}/candidates`);
  return response.json();
};
```

## Error Handling
The application includes comprehensive error handling:
- API error handling
- Form validation
- User feedback through error messages
- Loading states

## Styling
The application uses Tailwind CSS for styling with:
- Responsive design
- Dark mode support
- Custom components
- Consistent spacing and typography

## Development

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Code Style
- Follow ESLint configuration
- Use functional components
- Implement proper prop types

