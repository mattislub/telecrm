import React, { useState } from 'react';
import { Book, Copy, Check, Code, Globe, Key, Phone } from 'lucide-react';
import { APIExample } from '../../types';

const APIGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<string>('telephone-callback');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  const apiExamples: APIExample[] = [
    {
      id: 'telephone-callback',
      title: 'יצירת שיחה טלפונית',
      description: 'יצירת שיחה בין שני מספרי טלפון עם פרמטרים מתקדמים',
      method: 'POST',
      endpoint: '/callback.php',
      requestBody: `{
  "Fphonenumber": "0533177906",
  "Fcallerid": "0765989921",
  "Sphonenumber": "0527186026",
  "Scallerid": "0765989922",
  "Companyid": "C123456789",
  "Driverid": "DIV12345678",
  "ringtimeout": "60"
}`,
      responseExample: `{
  "message": "Success",
  "status": "Call Initiated."
}`
    },
    {
      id: 'verification-call',
      title: 'שיחת אימות וקוד',
      description: 'שליחת קוד אימות באמצעות שיחה קולית או שיחה חסרה',
      method: 'POST',
      endpoint: '/call.php',
      requestBody: `{
  "phonenumber": "1234567890",
  "callerid": "1234456789",
  "calltype": "missedcall",
  "verificationcode": "123456",
  "ringtimeout": "60"
}`,
      responseExample: `{
  "message": "Success",
  "status": "Call Initiated."
}`
    },
    {
      id: 'get-call-status',
      title: 'בדיקת סטטוס שיחה',
      description: 'אחזור מצב שיחה קיימת לפי מזהה',
      method: 'GET',
      endpoint: '/call-status.php?call_id=call_789123456',
      responseExample: `{
  "message": "Success",
  "status": "Call Active",
  "data": {
    "call_id": "call_789123456",
    "duration": 120,
    "first_phone_status": "connected",
    "second_phone_status": "connected"
  }
}`
    },
    {
      id: 'end-call',
      title: 'סיום שיחה',
      description: 'סיום שיחה פעילה',
      method: 'POST',
      endpoint: '/end-call.php',
      requestBody: `{
  "call_id": "call_789123456",
  "reason": "user_request"
}`,
      responseExample: `{
  "message": "Success",
  "status": "Call Ended."
}`
    },
    {
      id: 'get-call-history',
      title: 'היסטוריית שיחות',
      description: 'אחזור היסטוריית שיחות עם סינונים',
      method: 'GET',
      endpoint: '/call-history.php?company_id=C123456789&date_from=2024-01-01',
      responseExample: `{
  "message": "Success",
  "status": "Data Retrieved.",
  "data": [
    {
      "call_id": "call_789123456",
      "first_phone": "0533177906",
      "second_phone": "0527186026",
      "company_id": "C123456789",
      "driver_id": "DIV12345678",
      "duration": 180,
      "start_time": "2024-01-15T10:30:00Z",
      "end_time": "2024-01-15T10:33:00Z"
    }
  ]
}`
    }
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const selectedExampleData = apiExamples.find(ex => ex.id === selectedExample);

  const curlExamples = {
    'telephone-callback': `curl --location '${BASE_URL}/callback.php' \\
  --header 'Content-Type: application/json' \\
--data '{
  "Fphonenumber": "0533177906",
  "Fcallerid": "0765989921", 
  "Sphonenumber": "0527186026",
  "Scallerid": "0765989922",
  "Companyid": "C123456789",
  "Driverid": "DIV12345678",
  "ringtimeout": "60"
}'`,
    'verification-call': `curl --location '${BASE_URL}/call.php' \\
--header 'Content-Type: application/json' \\
--data '{
  "phonenumber": "1234567890",
  "callerid": "1234456789",
  "calltype": "missedcall",
  "verificationcode": "123456",
  "ringtimeout": "60"
}'`
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="bg-white/20 p-3 rounded-full">
            <Phone className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">תיעוד API מערכת טלפון</h1>
            <p className="text-blue-100 mt-2">מדריך מלא לשילוב עם מערכת ניהול השיחות הטלפוניות</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">נקודות קצה API</h3>
            </div>
            <nav className="p-2">
              {apiExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => setSelectedExample(example.id)}
                  className={`w-full text-right p-3 rounded-lg transition-colors duration-200 ${
                    selectedExample === example.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      example.method === 'GET' ? 'bg-green-100 text-green-800' :
                      example.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {example.method}
                    </span>
                  </div>
                  <p className="font-medium mt-1">{example.title}</p>
                </button>
              ))}
            </nav>
          </div>

          {/* Authentication Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Key className="w-5 h-5 ml-2" />
                מידע חיבור
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">כתובת בסיס</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                  {BASE_URL}
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Content-Type</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  application/json
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">שיטת אימות</p>
                <p className="text-xs text-gray-600">לפי מזהה חברה</p>
              </div>
            </div>
          </div>

          {/* Parameters Guide */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">הסבר פרמטרים</h3>
            </div>
            <div className="p-4 space-y-3 text-sm">
              {selectedExample === 'telephone-callback' && (
                <>
                  <div>
                    <p className="font-medium text-gray-700">Fphonenumber</p>
                    <p className="text-gray-600">מספר הטלפון הראשון</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Fcallerid</p>
                    <p className="text-gray-600">מזהה מתקשר ראשון</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Sphonenumber</p>
                    <p className="text-gray-600">מספר הטלפון השני</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Scallerid</p>
                    <p className="text-gray-600">מזהה מתקשר שני</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Companyid</p>
                    <p className="text-gray-600">מזהה החברה</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Driverid</p>
                    <p className="text-gray-600">מזהה הנהג</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">ringtimeout</p>
                    <p className="text-gray-600">זמן המתנה בשניות</p>
                  </div>
                </>
              )}
              {selectedExample === 'verification-call' && (
                <>
                  <div>
                    <p className="font-medium text-gray-700">phonenumber</p>
                    <p className="text-gray-600">מספר הטלפון ליצירת קשר</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">callerid</p>
                    <p className="text-gray-600">מזהה המתקשר שיוצג</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">calltype</p>
                    <p className="text-gray-600">סוג השיחה (missedcall/verification)</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">verificationcode</p>
                    <p className="text-gray-600">קוד האימות לשליחה</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">ringtimeout</p>
                    <p className="text-gray-600">זמן המתנה בשניות</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedExampleData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedExampleData.title}
                    </h2>
                    <p className="text-gray-600 mt-1">{selectedExampleData.description}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedExampleData.method === 'GET' ? 'bg-green-100 text-green-800' :
                    selectedExampleData.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedExampleData.method}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Endpoint */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Globe className="w-5 h-5 ml-2" />
                    נקודת קצה
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <code className="text-sm font-mono text-gray-800">
                      {selectedExampleData.method} {BASE_URL}{selectedExampleData.endpoint}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${BASE_URL}${selectedExampleData.endpoint}`, 'endpoint')}
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {copiedCode === 'endpoint' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* cURL Example for main APIs */}
                {curlExamples[selectedExample as keyof typeof curlExamples] && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Code className="w-5 h-5 ml-2" />
                      דוגמת cURL
                    </h3>
                    <div className="bg-gray-900 rounded-lg p-4 relative">
                      <button
                        onClick={() => copyToClipboard(curlExamples[selectedExample as keyof typeof curlExamples], 'curl')}
                        className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {copiedCode === 'curl' ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{curlExamples[selectedExample as keyof typeof curlExamples]}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {selectedExampleData.requestBody && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Code className="w-5 h-5 ml-2" />
                      גוף הבקשה
                    </h3>
                    <div className="bg-gray-900 rounded-lg p-4 relative">
                      <button
                        onClick={() => copyToClipboard(selectedExampleData.requestBody!, 'request')}
                        className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {copiedCode === 'request' ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{selectedExampleData.requestBody}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Response */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">דוגמת תגובה</h3>
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <button
                      onClick={() => copyToClipboard(selectedExampleData.responseExample, 'response')}
                      className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {copiedCode === 'response' ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{selectedExampleData.responseExample}</code>
                    </pre>
                  </div>
                </div>

                {/* Status Codes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">קודי סטטוס</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="font-medium">200</span>
                        <span className="text-gray-600">בקשה הצליחה</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="font-medium">400</span>
                        <span className="text-gray-600">בקשה שגויה</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span className="font-medium">401</span>
                        <span className="text-gray-600">לא מורשה</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                        <span className="font-medium">500</span>
                        <span className="text-gray-600">שגיאת שרת</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIGuide;
