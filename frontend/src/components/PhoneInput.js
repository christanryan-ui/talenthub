'use client';

import { useState } from 'react';

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
];

export default function PhoneInput({ value, onChange, required = false, className = '' }) {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCountryChange = (e) => {
    const code = e.target.value;
    setCountryCode(code);
    onChange(code + phoneNumber);
  };

  const handlePhoneChange = (e) => {
    const number = e.target.value.replace(/\D/g, '');
    setPhoneNumber(number);
    onChange(countryCode + number);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        value={countryCode}
        onChange={handleCountryChange}
        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {countryCodes.map((item) => (
          <option key={item.code} value={item.code}>
            {item.flag} {item.code}
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder="Phone number"
        required={required}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
