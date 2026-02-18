"use client"
import React, { useState, useEffect } from 'react';
import { getStrapiMedia } from "@/lib/strapi";

const getVideoId = (url) => {
  if (!url) return '';
  // Handle if only ID is passed
  if (url.length === 11 && !url.includes('/')) return url;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const dummyVideos = [
  {
    id: 'rqJDO3TWnac',
    thumbnailUrl: 'https://i.ytimg.com/vi/rqJDO3TWnac/default.jpg',
    title: 'লোড হচ্ছে: ভিডিও সংবাদ...',
    author: 'ভিজুয়ালডন',
  },
  {
    id: '3WWlhPmqXQI',
    thumbnailUrl: 'https://i.ytimg.com/vi/3WWlhPmqXQI/default.jpg',
    title: 'অপেক্ষা করুন...',
    author: 'চ্যানেল',
  },
  {
    id: 'kssD4L2NBw0',
    thumbnailUrl: 'https://i.ytimg.com/vi/kssD4L2NBw0/default.jpg',
    title: 'লোড হচ্ছে...',
    author: 'নিউজ ডেস্ক',
  },
  {
    id: 'YcwrRA2BIlw',
    thumbnailUrl: 'https://i.ytimg.com/vi/YcwrRA2BIlw/default.jpg',
    title: 'লোড হচ্ছে...',
    author: 'আপডেট',
  },
  {
    id: 'HMpmI2F2cMs',
    thumbnailUrl: 'https://i.ytimg.com/vi/HMpmI2F2cMs/default.jpg',
    title: 'লোড হচ্ছে...',
    author: 'লাইভ',
  },
];

const YoutubeVideo = ({ data = [], isLoading = false }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setVideos(dummyVideos);
    } else if (data && data.length > 0) {
      const formattedVideos = data.map(item => {
        const v = item.attributes || item;
        const videoId = getVideoId(v.youtubeUrl);
        return {
          id: videoId || 'rqJDO3TWnac', // fallback
          thumbnailUrl: v.thumbnail?.data ? getStrapiMedia(v.thumbnail?.data?.attributes?.url || v.thumbnail) : `https://i.ytimg.com/vi/${videoId}/default.jpg`,
          title: v.title,
          author: 'Youtube',
        };
      });
      setVideos(formattedVideos);
    } else {
      setVideos(dummyVideos); // Fallback to dummy if empty or show empty state? Let's show dummy for now or logic to hide
    }
  }, [data, isLoading]);

  const handleThumbnailClick = (index) => {
    setSelectedVideo(index);
  };
  
  if (!isLoading && data.length === 0) return null; // Hide if no real data

  const displayVideos = videos.slice(0, 5);

  return (
    <div className="youtube-wrapper">
      <div className="playlist-title">
        <h4>সর্বশেষ ভিডিও সংবাদ</h4>
      </div>
      <div id="rypp-demo-1" className="RYPP r16-9" data-rypp="da4e5dd6">
        <div>
          <div className="RYPP-playlist">
            <header>
              <h2 className="_h1 RYPP-title">প্লেলিস্ট</h2>
              <p className="RYPP-desc">
                ভিডিও সংবাদ <a href="#" target="_blank">#ভিডিও</a>
              </p>
            </header>
            <div className="RYPP-items">
              <ol>
                {displayVideos.map((video, index) => (
                  <li
                    key={`thumbnail-${index}`}
                    data-video-id={video.id}
                    className={selectedVideo === index ? 'selected' : ''}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <p className="title">
                      {video.title}
                      <small className="author">
                        <br />
                        {video.author}
                      </small>
                    </p>
                    <img
                      src={video.thumbnailUrl}
                      className="thumb"
                      alt={`Thumbnail ${index + 1}`}
                      onError={(e) => e.target.src = '/default.jpg'}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div className="RYPP-video">
          {displayVideos.map((video, index) => (
            <iframe
              key={`RYPP-vp-da4e5dd6-${index}`}
              className="RYPP-video-player"
              style={{ display: index === selectedVideo ? 'block' : 'none' }}
              id={`RYPP-vp-da4e5dd6-${index}`}
              name={`RYPP-vp-da4e5dd6-${index}`}
              frameBorder="0"
              allowFullScreen
              title="YouTube Video Player"
              width="640"
              height="360"
              src={`https://www.youtube.com/embed/${video.id}`}
            ></iframe>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YoutubeVideo;