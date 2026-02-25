"use client"
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLanguage } from '@/lib/LanguageContext';

const DatePickerComponents = () => {
    const [value, onChange] = useState(new Date());
    const { locale } = useLanguage();
    const isBangla = locale === 'bn';
    const calendarLocale = locale === 'en' ? 'en-US' : 'bn-BD';

    const formatShortWeekday = (_, date) => {
        if (locale === 'bn') {
            const bnWeekdays = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];
            return bnWeekdays[date.getDay()];
        }

        const enWeekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
        return enWeekdays[date.getDay()];
    };

    return (
        <div className={isBangla ? 'calendar-locale-bn' : 'calendar-locale-en'}>
            <Calendar
                onChange={onChange}
                value={value}
                locale={calendarLocale}
                formatShortWeekday={formatShortWeekday}
            />
        </div>
    );
};

export default DatePickerComponents;