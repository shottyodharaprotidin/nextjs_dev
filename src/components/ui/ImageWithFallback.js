"use client";

import { useState } from 'react';

const ImageWithFallback = ({ src, alt, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            {...props}
            src={imgSrc}
            alt={alt}
            onError={() => {
                setImgSrc('/default.jpg');
            }}
        />
    );
};

export default ImageWithFallback;
