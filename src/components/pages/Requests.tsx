import React, { useState } from 'react';
import { Send, Code, Zap, FileText, Phone, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

interface RequestLog {
  id: string;
  method: string;
  endpoint: string;
  status: number;
  time: string;
  response: string;
  error?: string;
}

const Requests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'telephone' | 'verification' | 'api'>('telephone');
  const [method, setMethod] = useState('POST');
  const [endpoint, setEndpoint] = useState('/callback.php');
  const [requestBody, setRequestBody] = useState(`{
  "Fphonenumber": "0533177906",
  "Fcallerid": "0765989921",
  "Sphonenumber": "0527186026",
  "Scallerid": "0765989922",
  "Companyid": "C123456789",
  "Driverid": "DIV12345678",
  "ringtimeout": "60"
}`);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  
  // For telephone call
  const [firstPhone, setFirstPhone] = useState('0533177906');
  const [firstCallerId, setFirstCallerId] = useState('0765989921');
  const [secondPhone, setSecondPhone] = useState('0527186026');
  const [secondCallerId, setSecondCallerId] = useState('0765989922');
  const [companyId, setCompanyId] = useState('C123456789');
  const [driverId, setDriverId] = useState('DIV12345678');
  const [ringTimeout, setRingTimeout] = useState('60');

  // For verification call
  const [phoneNumber, setPhoneNumber] = useState('1234567890');
  const [callerId, setCallerId] = useState('1234456789');
  const [callType, setCallType] = useState('missedcall');
  const [verificationCode, setVerificationCode] = useState('123456');
  const [verificationTimeout, setVerificationTimeout] = useState('60');

  // Allow overriding the API base via env and strip :3001 if present
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const BASE_URL = rawBaseUrl.replace(':3001', '');

  const makeAPIRequest = async (url: string, options: RequestInit) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      return {
        status: response.status,
        data: responseData,
        ok: response.ok
      };
    } catch (error) {
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAPIRequest = async () => {
    setIsLoading(true);
    
    try {
      const url = `${BASE_URL}${endpoint}`;
      const options: RequestInit = {
        method,
      };

      if (method === 'POST' || method === 'PUT') {
        options.body = requestBody;
      }

      const result = await makeAPIRequest(url, options);

      const newLog: RequestLog = {
        id: Date.now().toString(),
        method,
        endpoint: url,
        status: result.status,
        time: new Date().toLocaleTimeString('he-IL'),
        response: typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      };

      setLogs(prev => [newLog, ...prev]);
    } catch (error) {
      const newLog: RequestLog = {
        id: Date.now().toString(),
        method,
        endpoint: `${BASE_URL}${endpoint}`,
        status: 0,
        time: new Date().toLocaleTimeString('he-IL'),
        response: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setLogs(prev => [newLog, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelephoneCall = async () => {
    setIsLoading(true);
    
    try {
      const url = `${BASE_URL}/callback.php`;
      const body = {
        Fphonenumber: firstPhone,
        Fcallerid: firstCallerId,
        Sphonenumber: secondPhone,
        Scallerid: secondCallerId,
        Companyid: companyId,
        Driverid: driverId,
        ringtimeout: ringTimeout
      };

      const result = await makeAPIRequest(url, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      const newLog: RequestLog = {
        id: Date.now().toString(),
        method: 'POST',
        endpoint: url,
        status: result.status,
        time: new Date().toLocaleTimeString('he-IL'),
        response: typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      };

      setLogs(prev => [newLog, ...prev]);
    } catch (error) {
      const newLog: RequestLog = {
        id: Date.now().toString(),
        method: 'POST',
        endpoint: `${BASE_URL}/callback.php`,
        status: 0,
        time: new Date().toLocaleTimeString('he-IL'),
        response: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setLogs(prev => [newLog, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationCall = async () => {
    setIsLoading(true);
    
    try {
      const url = `${BASE_URL}/call.php`;
      const body = {
        phonenumber: phoneNumber,
        callerid: callerId,
        calltype: callType,
        verificationcode: verificationCode,
        ringtimeout: verificationTimeout
      };

      const result = await makeAPIRequest(url, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      const newLog: RequestLog = {
        id: Date.now().toString(),
        method: 'POST',
        endpoint: url,
        status: result.status,
        time: new Date().toLocaleTimeString('he-IL'),
        response: typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      };

      setLogs(prev => [newLog, ...prev]);
    } catch (error) {
      const newLog: RequestLog = {
        id: Date.now().toString(),
        method: 'POST',
        endpoint: `${BASE_URL}/call.php`,
        status: 0,
        time: new Date().toLocaleTimeString('he-IL'),
        response: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setLogs(prev => [newLog, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const endpoints = [
    '/callback.php',
    '/call.php',
    '/call-status.php',
    '/end-call.php',
    '/call-history.php'
  ];

  const getStatusColor = (status: number, error?: string) => {
    if (error || status === 0) return 'bg-red-100 text-red-800';
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">בקשות API ושיחות טלפון</h1>
            <p className="text-gray-600 mt-1">שליחת בקשות אמיתיות ל-API ויצירת שיחות טלפון</p>
            <div className="mt-2 flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">מחובר ל-{BASE_URL}</span>
            </div>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => setActiveTab('telephone')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === 'telephone'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Phone className="w-4 h-4 inline-block ml-2" />
              שיחה טלפונית
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === 'verification'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline-block ml-2" />
              שיחת אימות
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === 'api'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-4 h-4 inline-block ml-2" />
              בקשות API
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              {activeTab === 'telephone' ? (
                <>
                  <Phone className="w-5 h-5 ml-2" />
                  יצירת שיחה טלפונית
                </>
              ) : activeTab === 'verification' ? (
                <>
                  <MessageSquare className="w-5 h-5 ml-2" />
                  שיחת אימות וקוד
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 ml-2" />
                  בונה בקשות API
                </>
              )}
            </h3>
          </div>

          <div className="p-6 space-y-4">
            {activeTab === 'telephone' ? (
              <>
                {/* First Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      טלפון ראשון
                    </label>
                    <input
                      type="tel"
                      value={firstPhone}
                      onChange={(e) => setFirstPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0533177906"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מזהה מתקשר ראשון
                    </label>
                    <input
                      type="tel"
                      value={firstCallerId}
                      onChange={(e) => setFirstCallerId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0765989921"
                    />
                  </div>
                </div>

                {/* Second Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      טלפון שני
                    </label>
                    <input
                      type="tel"
                      value={secondPhone}
                      onChange={(e) => setSecondPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0527186026"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מזהה מתקשר שני
                    </label>
                    <input
                      type="tel"
                      value={secondCallerId}
                      onChange={(e) => setSecondCallerId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0765989922"
                    />
                  </div>
                </div>

                {/* Company and Driver */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מזהה חברה
                    </label>
                    <input
                      type="text"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="C123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מזהה נהג
                    </label>
                    <input
                      type="text"
                      value={driverId}
                      onChange={(e) => setDriverId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="DIV12345678"
                    />
                  </div>
                </div>

                {/* Ring Timeout */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    זמן המתנה (שניות)
                  </label>
                  <input
                    type="number"
                    value={ringTimeout}
                    onChange={(e) => setRingTimeout(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="60"
                    min="10"
                    max="300"
                  />
                </div>

                <button
                  onClick={handleTelephoneCall}
                  disabled={isLoading || !firstPhone || !secondPhone}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      <span>יצור שיחה</span>
                    </>
                  )}
                </button>
              </>
            ) : activeTab === 'verification' ? (
              <>
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    מספר טלפון
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1234567890"
                  />
                </div>

                {/* Caller ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    מזהה מתקשר
                  </label>
                  <input
                    type="tel"
                    value={callerId}
                    onChange={(e) => setCallerId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1234456789"
                  />
                </div>

                {/* Call Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סוג השיחה
                  </label>
                  <select
                    value={callType}
                    onChange={(e) => setCallType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="missedcall">שיחה חסרה</option>
                    <option value="verification">אימות</option>
                  </select>
                </div>

                {/* Verification Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    קוד אימות
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>

                {/* Ring Timeout */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    זמן המתנה (שניות)
                  </label>
                  <input
                    type="number"
                    value={verificationTimeout}
                    onChange={(e) => setVerificationTimeout(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="60"
                    min="10"
                    max="300"
                  />
                </div>

                <button
                  onClick={handleVerificationCall}
                  disabled={isLoading || !phoneNumber || !verificationCode}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      <span>שלח קוד אימות</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שיטת HTTP
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {methods.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Endpoint Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    נקודת קצה
                  </label>
                  <select
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {endpoints.map(ep => (
                      <option key={ep} value={ep}>{ep}</option>
                    ))}
                  </select>
                </div>

                {/* Request Body */}
                {(method === 'POST' || method === 'PUT') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      גוף הבקשה (JSON)
                    </label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                      rows={12}
                      placeholder='{\n  "key": "value"\n}'
                    />
                  </div>
                )}

                <button
                  onClick={handleAPIRequest}
                  disabled={isLoading}
                  className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>שלח בקשה</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Response Log */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 ml-2" />
              יומן תגובות אמיתיות
            </h3>
          </div>

          <div className="p-6">
            {logs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>עדיין לא נשלחו בקשות</p>
                <p className="text-sm">שלח בקשה כדי לראות את התגובה האמיתית כאן</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          log.method === 'GET' ? 'bg-green-100 text-green-800' :
                          log.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {log.method}
                        </span>
                        <code className="text-sm text-gray-600 truncate max-w-xs">{log.endpoint}</code>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {log.error ? (
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                              שגיאה
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(log.status)}`}>
                              {log.status}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-gray-500">{log.time}</span>
                      </div>
                    </div>
                    
                    {log.error ? (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-800">שגיאה בבקשה:</span>
                        </div>
                        <pre className="text-xs text-red-700 overflow-x-auto">
                          {log.error}
                        </pre>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded p-3">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-800">תגובת השרת:</span>
                        </div>
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                          {log.response}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
