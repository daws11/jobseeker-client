import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from '@tanstack/react-table';
import { vacancyService } from '../services/vacancyService';

const VacancyList = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // DataTables server-side parameters
  const [tableParams, setTableParams] = useState({
    draw: 1,
    start: 0,
    length: pageSize,
    search: { value: '', regex: false },
    order: [{ column: 0, dir: 'asc' }],
  });

  useEffect(() => {
    fetchVacancies();
  }, [tableParams]);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const response = await vacancyService.getAllVacancies({
        ...tableParams,
        search: { ...tableParams.search, value: searchQuery }
      });
      
      setVacancies(response.data || []);
      setTotalRows(response.recordsTotal || 0);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vacancies. Please try again later.');
      console.error('Error fetching vacancies:', err);
      setVacancies([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Vacancy Name',
        accessor: 'vacancy_name',
      },
      {
        Header: 'Min Experience',
        accessor: 'min_experience',
        Cell: ({ value }) => `${value} years`,
      },
      {
        Header: 'Max Age',
        accessor: 'max_age',
        Cell: ({ value }) => `${value} years`,
      },
      {
        Header: 'Salary',
        accessor: 'salary',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <span className={`font-semibold ${
            value === 'Active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {value}
          </span>
        ),
      },
      {
        Header: 'Published Date',
        accessor: 'publish_date',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'Expiry Date',
        accessor: 'expired_date',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, sortBy },
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setPageSize: setTablePageSize,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: vacancies,
      initialState: { pageSize },
      manualPagination: true,
      manualSortBy: true,
      manualGlobalFilter: true,
      pageCount: Math.ceil(totalRows / pageSize),
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setTableParams(prev => ({
      ...prev,
      start: 0, // Reset to first page
      search: { value, regex: false },
      draw: prev.draw + 1,
    }));
  };

  // Handle sort change
  useEffect(() => {
    if (sortBy.length) {
      setTableParams(prev => ({
        ...prev,
        order: [{
          column: sortBy[0].id,
          dir: sortBy[0].desc ? 'desc' : 'asc'
        }],
        draw: prev.draw + 1,
      }));
    }
  }, [sortBy]);

  // Handle page change
  const handlePageChange = (newPageIndex) => {
    setTableParams(prev => ({
      ...prev,
      start: newPageIndex * pageSize,
      draw: prev.draw + 1,
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
    setTablePageSize(newPageSize);
    setTableParams(prev => ({
      ...prev,
      start: 0,
      length: newPageSize,
      draw: prev.draw + 1,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading vacancies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchVacancies}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Vacancies</h2>
          <div className="text-sm text-gray-500">
            Total: {totalRows} {totalRows === 1 ? 'vacancy' : 'vacancies'}
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          {/* Search input */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search vacancies..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-600">Show</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-50">
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={!canPreviousPage}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                !canPreviousPage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={!canNextPage}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                !canNextPage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{tableParams.start + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(tableParams.start + pageSize, totalRows)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalRows}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pageIndex - 1)}
                  disabled={!canPreviousPage}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    !canPreviousPage
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pageIndex + 1)}
                  disabled={!canNextPage}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    !canNextPage
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyList; 