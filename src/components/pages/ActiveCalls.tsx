import React, { useState, useEffect } from 'react';
import { Phone, Clock, User, PhoneOff, Pause, Play, Building, Car, ChevronDown, ChevronUp } from 'lucide-react';
import { Call } from '../../types';

const ActiveCalls: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [expandedCalls, setExpandedCalls] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Mock data for active calls
    const mockCalls: Call[] = [
      {
        id: '1',
        clientName: 'שרה כהן',
        phoneNumber: '050-123-4567',
        clientCallerId: '0765989921',
        driverPhone: '052-987-1234',
        driverCallerId: '0765989922',
        status: 'active',
        startTime: new Date(Date.now() - 300000), // 5 minutes ago
        companyId: 'C123456789',
        driverId: 'DIV12345678'
      },
      {
        id: '2',
        clientName: 'מיכאל לוי',
        phoneNumber: '052-987-6543',
        clientCallerId: '0765989923',
        driverPhone: '053-456-7890',
        driverCallerId: '0765989924',
        status: 'waiting',
        startTime: new Date(Date.now() - 120000), // 2 minutes ago
        companyId: 'C987654321',
        driverId: 'DIV87654321'
      },
      {
        id: '3',
        clientName: 'ליסה דוד',
        phoneNumber: '054-456-7890',
        clientCallerId: '0765989925',
        driverPhone: '055-123-4567',
        driverCallerId: '0765989926',
        status: 'active',
        startTime: new Date(Date.now() - 180000), // 3 minutes ago
        companyId: 'C555666777',
        driverId: 'DIV55566677'
      }
    ];
    setCalls(mockCalls);

    // Update call durations every second
    const interval = setInterval(() => {
      setCalls(prevCalls => 
        prevCalls.map(call => ({
          ...call,
          duration: Math.floor((Date.now() - call.startTime.getTime()) / 1000)
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'waiting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEndCall = (callId: string) => {
    setCalls(calls.filter(call => call.id !== callId));
  };

  const toggleExpanded = (callId: string) => {
    const newExpanded = new Set(expandedCalls);
    if (newExpanded.has(callId)) {
      newExpanded.delete(callId);
    } else {
      newExpanded.add(callId);
    }
    setExpandedCalls(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">שיחות פעילות</p>
              <p className="text-2xl font-bold text-gray-900">
                {calls.filter(call => call.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">ממתינות</p>
              <p className="text-2xl font-bold text-gray-900">
                {calls.filter(call => call.status === 'waiting').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">נהגים פעילים</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(calls.map(call => call.driverId)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">חברות פעילות</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(calls.map(call => call.companyId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Calls List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">שיחות חיות - נהג ולקוח</h3>
          <p className="text-sm text-gray-600 mt-1">מעקב וניהול שיחות בין נהגים ללקוחות</p>
        </div>

        <div className="divide-y divide-gray-200">
          {calls.map((call) => (
            <div key={call.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                {/* Basic Info */}
                <div className="flex items-center space-x-8 space-x-reverse flex-1">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(call.status)} animate-pulse`}></div>
                  
                  {/* Client Basic Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 flex items-center">
                          👤 {call.clientName}
                        </h4>
                        <p className="text-sm text-gray-600 font-mono">{call.phoneNumber}</p>
                      </div>
                      
                      <div className="text-gray-300">↔</div>
                      
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 flex items-center">
                          🚗 {call.driverId}
                        </h4>
                        <p className="text-sm text-gray-600 font-mono">{call.driverPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration and Actions */}
                <div className="flex items-center space-x-6 space-x-reverse">
                  {/* Duration */}
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">משך זמן</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatDuration(call.duration || 0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {call.status === 'active' ? 'פעיל' : 'ממתין'}
                    </p>
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => toggleExpanded(call.id)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    title={expandedCalls.has(call.id) ? 'הסתר פרטים' : 'הצג פרטים'}
                  >
                    {expandedCalls.has(call.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {call.status === 'active' && (
                      <>
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                          title="השהה שיחה"
                        >
                          <Pause className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEndCall(call.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                          title="סיים שיחה"
                        >
                          <PhoneOff className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {call.status === 'waiting' && (
                      <button 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                        title="התחל שיחה"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCalls.has(call.id) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Client Details */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900 mb-3 flex items-center">
                        👤 פרטי לקוח
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 ml-2 text-green-600" />
                          <span className="font-medium">טלפון:</span>
                          <span className="mr-2 font-mono">{call.phoneNumber}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <User className="w-4 h-4 ml-2 text-blue-600" />
                          <span className="font-medium">זיהוי:</span>
                          <span className="mr-2 font-mono text-xs bg-blue-100 px-2 py-1 rounded">
                            {call.clientCallerId}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Details */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-900 mb-3 flex items-center">
                        🚗 פרטי נהג
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 ml-2 text-green-600" />
                          <span className="font-medium">טלפון:</span>
                          <span className="mr-2 font-mono">{call.driverPhone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <User className="w-4 h-4 ml-2 text-blue-600" />
                          <span className="font-medium">זיהוי:</span>
                          <span className="mr-2 font-mono text-xs bg-green-100 px-2 py-1 rounded">
                            {call.driverCallerId}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Car className="w-4 h-4 ml-2 text-purple-600" />
                          <span className="font-medium">מזהה נהג:</span>
                          <span className="mr-2 font-mono text-xs bg-purple-100 px-2 py-1 rounded">
                            {call.driverId}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-900 mb-3 flex items-center">
                        🏢 פרטי חברה
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Building className="w-4 h-4 ml-2 text-purple-600" />
                          <span className="font-medium">מזהה חברה:</span>
                          <span className="mr-2 font-mono text-xs bg-purple-100 px-2 py-1 rounded">
                            {call.companyId}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 ml-2 text-gray-600" />
                          <span className="font-medium">התחלה:</span>
                          <span className="mr-2 text-xs">
                            {call.startTime.toLocaleTimeString('he-IL')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {calls.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">אין שיחות פעילות</p>
            <p className="text-sm">כל הנהגים זמינים</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCalls;
