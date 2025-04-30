import { useState, useEffect } from 'react';
import { getCandidates, getVacancies, getApplicants } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalVacancies: 0,
    totalApplicants: 0,
    activeVacancies: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching dashboard stats...');
      
      const [candidatesRes, vacanciesRes, applicantsRes] = await Promise.all([
        getCandidates(),
        getVacancies(),
        getApplicants(),
      ]);

      console.log('Candidates Response:', candidatesRes);
      console.log('Vacancies Response:', vacanciesRes);
      console.log('Applicants Response:', applicantsRes);

      // Extract data with flexible structure handling
      const candidatesData = candidatesRes.data?.data?.data || candidatesRes.data?.data || candidatesRes.data || [];
      const vacanciesData = vacanciesRes.data?.data?.data || vacanciesRes.data?.data || vacanciesRes.data || [];
      const applicantsData = applicantsRes.data?.data?.data || applicantsRes.data?.data || applicantsRes.data || [];

      console.log('Processed data:', {
        candidates: candidatesData,
        vacancies: vacanciesData,
        applicants: applicantsData
      });

      setStats({
        totalCandidates: Array.isArray(candidatesData) ? candidatesData.length : 0,
        totalVacancies: Array.isArray(vacanciesData) ? vacanciesData.length : 0,
        totalApplicants: Array.isArray(applicantsData) ? applicantsData.length : 0,
        activeVacancies: Array.isArray(vacanciesData) ? vacanciesData.filter((v) => v.flag_status === 1).length : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      name: 'Total Candidates',
      value: stats.totalCandidates,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: '👥',
    },
    {
      name: 'Total Vacancies',
      value: stats.totalVacancies,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: '💼',
    },
    {
      name: 'Active Vacancies',
      value: stats.activeVacancies,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      icon: '✨',
    },
    {
      name: 'Total Applicants',
      value: stats.totalApplicants,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      icon: '📝',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <div
            key={stat.name}
            className={`${stat.color} rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}