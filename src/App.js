import { Oval } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import Switch from '@mui/material/Switch';



function GfGWeatherApp() { 
  const [isFahrenheit, setIsFahrenheit] = useState(false); // State for temperature unit

	const [input, setInput] = useState(''); 
	const [weather, setWeather] = useState({ 
		loading: false, 
		data: {}, 
		error: false, 
	}); 
	const [forecast, setForecast] = useState({ 
		loading: false, 
		data: {}, 
		error: false, 
	}); 

	const toDateFunction = () => { 
		const months = [ 
			'January', 
			'February', 
			'March', 
			'April', 
			'May', 
			'June', 
			'July', 
			'August', 
			'September', 
			'October', 
			'November', 
			'December', 
		]; 
		const WeekDays = [ 
			'Sunday', 
			'Monday', 
			'Tuesday', 
			'Wednesday', 
			'Thursday', 
			'Friday', 
			'Saturday', 
		]; 
		const currentDate = new Date(); 
		const date = `${WeekDays[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]}`; 
		return date; 
	}; 

	const search = async (event) => { 
		if (event.key === 'Enter') { 
			event.preventDefault(); 
			setInput(''); 
			setWeather({ ...weather, loading: true }); 
			const url = 'https://api.openweathermap.org/data/2.5/weather'; 
			const api_key = 'f00c38e0279b7bc85480c3fe775d518c'; 
			await axios 
				.get(url, { 
					params: { 
						q: input, 
						units: 'metric', 
						appid: api_key, 
					}, 
				}) 
				.then((res) => { 
					console.log('res', res); 
					setWeather({ data: res.data, loading: false, error: false }); 
				}) 
				.catch((error) => { 
					setWeather({ ...weather, data: {}, error: true }); 
					setInput(''); 
					console.log('error', error); 
				}); 
		} 
	}; 

	const searchForecast = async () => { 
		const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast'; 
		const api_key = 'f00c38e0279b7bc85480c3fe775d518c'; 
		await axios 
			.get(forecastUrl, { 
				params: { 
					q: input, 
					units: 'metric', 
					appid: api_key, 
				}, 
			}) 
			.then((res) => { 
				setForecast({ data: res.data, loading: false, error: false }); 
			}) 
			.catch((error) => { 
				setForecast({ ...forecast, data: {}, error: true }); 
				console.log('forecast error', error); 
			}); 
	}; 

	useEffect(() => {
		const handleKeyPress = (event) => {
		  if (event.key === 'Enter' && input !== '') {
			searchForecast();
		  }
		};
	  
		window.addEventListener('keydown', handleKeyPress);
	  
		return () => {
		  window.removeEventListener('keydown', handleKeyPress);
		};
	  }, [input]);
	  
 
 
  const getFiveDayForecast = () => {
    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay();
    const nextFiveDays = [];

    for (let i = 1; i <= 5; i++) {
      const dayIndex = (currentDayIndex + i) % 7;
      const forecastItem = forecast.data.list.find((item) => {
        const itemDayIndex = new Date(item.dt * 1000).getDay();
        return itemDayIndex === dayIndex;
      });

      if (forecastItem) {
        nextFiveDays.push(forecastItem);
      }
    }

    return nextFiveDays;
  };
  const toggleTemperatureUnit = () => {
    setIsFahrenheit((prevValue) => !prevValue);
  };

  const convertTemperature = (temp) => {
    return isFahrenheit ? (temp * 9) / 5 + 32 : temp;
  };
	return ( 
		<div className="App"> 
			<h1 className="app-name"> 
				 Weather App 
			</h1>
      <div className='togglebutton'>
        <h>click to view in Fahrenheit</h>
      <Switch
        // checked={checked}
        onChange={toggleTemperatureUnit}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      </div>
			<div className="search-bar"> 
				<input 
					type="text"
					className="city-search"
					placeholder="Enter City Name.."
					name="query"
					value={input} 
					onChange={(event) => setInput(event.target.value)} 
					onKeyPress={search} 
				/> 
			</div> 
			{weather.loading && ( 
				<> 
					<br /> 
					<br /> 
					<Oval type="Oval" color="black" height={100} width={100} /> 
				</> 
			)} 
			{weather.error && ( 
				<> 
					<br /> 
					<br /> 
					<span className="error-message"> 
						<FontAwesomeIcon icon={faFrown} /> 
						<span style={{ fontSize: '20px' }}>City not found</span> 
					</span> 
				</> 
			)} 
			{weather && weather.data && weather.data.main && ( 
				<div> 
					<div className="city-name"> 
						<h2> 
							{weather.data.name}, <span>{weather.data.sys.country}</span> 
						</h2> 
					</div> 
					<div className="date"> 
						<span>{toDateFunction()}</span> 
					</div> 
					<div className="icon-temp"> 
						<img 
							className=""
							src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`} 
							alt={weather.data.weather[0].description} 
						/> 
						{Math.round(convertTemperature(weather.data.main.temp))}
            <sup className="deg">{isFahrenheit ? '°F' : '°C'}</sup>
					</div> 
					<div className="des-wind"> 
						<p>{weather.data.weather[0].description.toUpperCase()}</p> 
						<p>Wind Speed: {weather.data.wind.speed} m/s</p> 
						<p>Wind Direction: {weather.data.wind.deg}°</p> 
						<p>Max Temperature: {Math.round(weather.data.main.temp_max)}°C</p> 
						<p>Min Temperature: {Math.round(weather.data.main.temp_min)}°C</p> 
						<p>Humidity: {weather.data.main.humidity}%</p> 
					</div> 
          <h2>5-Day Forecast</h2> 
				</div> 
        
			)} 
			{forecast.loading && ( 
				<> 
					<br /> 
					<br /> 
					<Oval type="Oval" color="black" height={100} width={100} /> 
				</> 
			)} 
			{forecast.error && ( 
				<> 
					<br /> 
					<br /> 
					<span className="error-message"> 
						<FontAwesomeIcon icon={faFrown} /> 
						<span style={{ fontSize: '20px' }}>Forecast not available</span> 
					</span> 
				</> 
			)} 
			 {forecast && forecast.data && forecast.data.list && (
        <div className="forecast-container">
       
          {getFiveDayForecast().map((item) => (
            <div key={item.dt} className="forecast-item">
              <div className="forecast-date">
                {new Date(item.dt * 1000).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="forecast-icon">
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].description}
                />
              </div>
              <div className="forecast-temp">
                {Math.round(convertTemperature(item.main.temp))}
                <sup className="deg">{isFahrenheit ? '°F' : '°C'}</sup>
              </div>
              <div className="forecast-description">
                {item.weather[0].description}
              </div>
            </div>
          ))}
        </div>
      )}
		</div> 
	); 
} 

export default GfGWeatherApp;
