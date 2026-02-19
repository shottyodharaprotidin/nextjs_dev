"use client"
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLanguage } from '@/lib/LanguageContext';

const DatePickerComponents = () => {
    const [value, onChange] = useState(new Date());
    const { locale } = useLanguage();
    const calendarLocale = locale === 'en' ? 'en-US' : 'bn-BD';

    return (
        <div>
            <Calendar onChange={onChange} value={value} locale={calendarLocale} />
        </div>
    );
};

export default DatePickerComponents;