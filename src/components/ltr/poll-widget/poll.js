import React, { useState, useEffect } from 'react';

const dummyPoll = {
    question: 'আপনি কি মনে করেন এই সিদ্ধান্ত সঠিক?',
    options: [
        { id: 1, text: 'হ্যাঁ, আমি একমত' },
        { id: 2, text: 'না, আমি একমত নই' },
        { id: 3, text: 'মন্তব্য নেই' }
    ]
};

const PollWidget = ({ data = null, isLoading = false }) => {
    const [pollData, setPollData] = useState(dummyPoll);

    useEffect(() => {
        if (isLoading) {
            setPollData(dummyPoll);
        } else if (data) {
            const p = data.attributes || data;
            setPollData({
                question: p.question,
                options: p.options || []
            });
        }
    }, [data, isLoading]);

    if (!isLoading && !data) return null; // Hide if no poll

    return (
        <div className="panel_inner poll-widget">
            <div className="panel_header">
                <h4>
                    <strong>জনমত</strong> জরিপ
                </h4>
            </div>
            <div className="panel_body poll-content">
                <form method="get" id="home_poll">
                    <h6>{pollData.question}</h6>
                    <ul>
                        {pollData.options.map((option, index) => (
                            <li key={option.id || index}>
                                <input
                                    id={`poll_${index}`}
                                    defaultValue={option.text}
                                    name="poll"
                                    type="radio"
                                />
                                <label htmlFor={`poll_${index}`}>
                                    {option.text || option.optionText} 
                                </label>
                            </li>
                        ))}
                    </ul>
                    <a href="#" className="btn btn-news">
                        ভোট দিন
                    </a>
                </form>
            </div>
        </div>
    );
};

export default PollWidget;