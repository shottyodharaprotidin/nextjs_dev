import React from 'react';
import Skycons, { SkyconsType } from 'react-skycons';

const SKYCON_MAP = {
  sunny: SkyconsType.CLEAR_DAY,
  'partly-cloudy': SkyconsType.PARTLY_CLOUDY_DAY,
  cloudy: SkyconsType.CLOUDY,
  foggy: SkyconsType.FOG,
  rainy: SkyconsType.RAIN,
  snowy: SkyconsType.SNOW,
  thunderstorm: SkyconsType.SLEET,
};

const SunnyWeather = ({ icon = 'partly-cloudy' }) => {
  const iconType = SKYCON_MAP[icon] || SkyconsType.PARTLY_CLOUDY_DAY;

    return (
        <Skycons
        color="white"
    type={iconType}
        animate={true}
        size={70}
        resizeClear={true}
      />
    );
};

export default SunnyWeather;