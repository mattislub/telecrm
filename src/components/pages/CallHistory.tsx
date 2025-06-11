import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Phone, 
  Play,
  Clock,
  ChevronDown,
  Car,
  Building
} from 'lucide-react';
import { Recording } from '../../types';

const CallHistory: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Mock data for recordings
    const mockRecordings: Recording[] = [
      {
        id: 'rec_1',
        callId: 'call_123',
        clientName: 'שרה כהן',
        phoneNumber: '050-123-4567',
        clientCallerId: '0765989921',
        driverPhone: '052-987-1234',
        driverCallerId: '0765989922',
        duration: 180,
        date: new Date('2024-01-15T10:30:00'),
        fileSize: '2.1 MB',
        status: 'available',
        companyId: 'C123456789',
        driverId: 'DIV12345678'
      },
      {
        id: 'rec_2',
        callId: 'call_456',
        clientName: 'מיכאל לוי',
        phoneNumber: '052-987-6543',
        clientCallerId: '0765989923',
        driverPhone: '053-456-7890',
        driverCallerId: '0765989924',
        duration: 95,
        date: new Date('2024-01-15T09:15:00'),
        fileSize: '1.8 MB',
        status: 'available',
        companyId: 'C987654321',
        driverId: 'DIV87654321'
      },
      {
        id: 'rec_3',
        callId: 'call_789',
        clientName: 'ליסה דוד',
        phoneNumber: '054-456-7890',
        clientCallerId: '0765989925',
        driverPhone: '055-123-4567',
        driverCallerId: '0765989926',
        duration: 320,
        date: new Date('2024-01-14T16:45:00'),
        fileSize: '3.2 MB',
        status: 'processing',
        companyId: 'C555666777',
        driverId: 'DIV55566677'
      },
      {
        id: 'rec_4',
        callId: 'call_012',
        clientName: 'רוברט וילסון',
        phoneNumber: '053-321-9876',
        clientCallerId: '0765989927',
        driverPhone: '056-789-0123',
        driverCallerId: '0765989928',
        duration: 45,
        date: new Date('2024-01-14T14:20:00'),
        fileSize: '0.9 MB',
        status: 'available',
        companyId: 'C123456789',
        driverId: 'DIV12345678'
      },
      {
        id: 'rec_5',
        callId: 'call_345',
        clientName: 'ג\'ניפר לי',
        phoneNumber: '055-654-3210',
        clientCallerId: '0765989929',
        driverPhone: '057-456-7890',
        driverCallerId: '0765989930',
        duration: 215,
        date: new Date('2024-01-13T11:30:00'),
        fileSize: '2.8 MB',
        status: 'failed',
        companyId: 'C987654321',
        driverId: 'DIV87654321'
      }
    ];
    setRecordings(mockRecordings);
    setFilteredRecordings(mockRecordings);
  }, []);

  useEffect(() => {
    let filtered = recordings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(recording =>
        recording.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recording.phoneNumber.includes(searchTerm) ||
        recording.driverPhone?.includes(searchTerm) ||
        recording.driverId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recording.companyId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(recording => recording.status === statusFilter);
    }

    // Company filter
    if (companyFilter !== 'all') {
      filtered = filtered.filter(recording => recording.companyId === companyFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(recording => recording.date >= startDate);
      }
    }

    setFilteredRecordings(filtered);
  }, [recordings, searchTerm, statusFilter, companyFilter, dateFilter]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'זמין';
      case 'processing':
        return 'בעיבוד';
      case 'failed':
        return 'נכשל';
      default:
        return status;
    }
  };

  const companies = [...new Set(recordings.map(r => r.companyId).filter(Boolean))];

  const handleDownload = (recording: Recording) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `recording_${recording.id}.mp3`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">סה״כ הקלטות</p>
              <p className="text-2xl font-bold text-gray-900">{recordings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">זמינות</p>
              <p className="text-2xl font-bold text-gray-900">
                {recordings.filter(r => r.status === 'available').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Car className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">נהגים</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(recordings.map(r => r.driverId).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <Building className="w-6 h-6 text-orange-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">חברות</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(recordings.map(r => r.companyId).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="חיפוש לפי שם לקוח, טלפון, נהג או חברה..."
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Filter className="w-5 h-5" />
              <span>מסננים</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">כל הסטטוסים</option>
                    <option value="available">זמין</option>
                    <option value="processing">בעיבוד</option>
                    <option value="failed">נכשל</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">חברה</label>
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">כל החברות</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">טווח תאריכים</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">כל הזמנים</option>
                    <option value="today">היום</option>
                    <option value="week">7 ימים אחרונים</option>
                    <option value="month">30 ימים אחרונים</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recordings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">👤 לקוח</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">🚗 נהג</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">🏢 חברה</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">משך זמן</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">תאריך</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">סטטוס</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">גודל</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecordings.map((recording) => (
                <tr key={recording.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{recording.clientName}</p>
                      <div className="space-y-1 mt-1">
                        <p className="text-xs text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 ml-1 text-green-600" />
                          <span className="font-mono">{recording.phoneNumber}</span>
                        </p>
                        <p className="text-xs text-gray-600 flex items-center">
                          <User className="w-3 h-3 ml-1 text-blue-600" />
                          <span className="font-mono bg-blue-50 px-1 rounded text-xs">
                            {recording.clientCallerId}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{recording.driverId}</p>
                      <div className="space-y-1 mt-1">
                        <p className="text-xs text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 ml-1 text-green-600" />
                          <span className="font-mono">{recording.driverPhone}</span>
                        </p>
                        <p className="text-xs text-gray-600 flex items-center">
                          <User className="w-3 h-3 ml-1 text-blue-600" />
                          <span className="font-mono bg-blue-50 px-1 rounded text-xs">
                            {recording.driverCallerId}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-purple-50 px-2 py-1 rounded text-purple-700">
                      {recording.companyId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{formatDuration(recording.duration)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {recording.date.toLocaleDateString('he-IL')}
                    <br />
                    <span className="text-gray-500 text-xs">{recording.date.toLocaleTimeString('he-IL')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(recording.status)}`}>
                      {getStatusText(recording.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{recording.fileSize}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {recording.status === 'available' && (
                        <>
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                            title="נגן הקלטה"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(recording)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                            title="הורד הקלטה"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {recording.status === 'processing' && (
                        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecordings.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">לא נמצאו הקלטות</p>
            <p className="text-sm">נסה לשנות את קריטריוני החיפוש או הסינון</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistory;
