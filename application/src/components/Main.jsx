import { useState } from 'react';
import './Main.scss';

export default function Main() {

  const [weatherData, setWeatherData]   = useState([{}]),
        [city, setCity]                 = useState(''),
        [forecastData, setForecastData] = useState([{}]),
        [loading, setLoading]           = useState(false),
        APIkey                          = 'b5efad1fee8b8bfb8449207e76485a12'

  const saveWeatherData = (data) => {
    setWeatherData(data)
    setCity(data.name)
  }

  const saveForecastData = (data) => {
    setForecastData(data)
    setCity(data.city.name)
  }

  const getDaily = () => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`).then(
      r => r.json()
    ).then(
      data => saveForecastData(data)
    )
  } 

  const ForecastList = () => {
    return forecastData?.list?.slice(1,4).map((forecast) => {
     return (
      <div className='forecast' key={forecast.dt}>
        <h3>{new Date(forecast.dt * 1000).toLocaleTimeString([], {timeStyle: 'short'})}</h3>
        <img src={`http://openweathermap.org/img/wn/${ forecast.weather[0].icon}@2x.png`}></img>
        <p>{Math.round(forecast.main?.temp - 273)}°C</p>
      </div>
     )
    }) 
  }

  const getWeatherByCity = (e) => {

    if (e.key === 'Enter') {
      getCity();
    }
  }

  const getCity = () => {
  
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`).then(
        r => r.json()
      ).then(
        data => saveWeatherData(data)
      )
      getDaily()
    }

  const iconCode = () =>
  `http://openweathermap.org/img/wn/${ weatherData.weather[0].icon}@2x.png`;

 const getLocation = () => {
  setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`).then(
          r => r.json()
        ).then( 
          data => { 
            saveWeatherData(data)
            setLoading(false);
          }
        )
      })
      getDaily()
    }
  }

  if(!weatherData && !weatherData.main) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  const {
    dt: date,
    main

  } = weatherData

  

  return (
    <div className='main'>
      <div className='input'>
        <input 
        className   ='searchInput'
        placeholder ='Stadt eingeben...'
        onChange    ={e => setCity(e.target.value)}
        value       ={city}
        onKeyDown   ={getWeatherByCity}
        />
        <img 
        src='search.svg'
        onClick={getCity}
        />
        <img 
        src='location.svg'
        onClick={getLocation}
        />
      </div>

      {weatherData.cod === '404' ? (
        <p>Stadt wurde nicht gefunden</p>
      ) : null}

      {loading ?
        (
        <div>
          <h1>Lädt...</h1>
        </div>) : null
      }

      {!weatherData.main ? (
        <div>
          <p>Bitte eine Stadt eingeben!</p>
        </div>
      ) : (
        <div className='middle'>
          <div className='current'>

            <div className='currentDate'>
              <p>{new Date(weatherData.dt * 1000).toDateString()} | Aktuelle Uhrzeit: {new Date(weatherData.dt * 1000).toLocaleTimeString([], {timeStyle: 'short'})}</p>
              <h1>{weatherData.name}, {weatherData.sys.country}</h1>
              <p>{weatherData.weather[0].main}</p>
            </div>

            <div className='currentWeather'>
              <img src={iconCode()}></img>
              <h1>{Math.round(main?.temp - 273)}°C</h1>

              <div className='currentInfo'>
                <p>Gefühlt:</p> <p>{weatherData.main.feels_like}°C</p>
                <p>Windstärke:</p> <p>{weatherData.wind.speed} Km/h</p>
                <p>Luftfeuchtigkeit:</p> <p>{weatherData.main.humidity}%</p>
              </div>

            </div>

            <div className='extraInfo'>
              <h4>Aufgang: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {timeStyle: 'short'})}</h4>
              <h4>Untergang: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {timeStyle: 'short'})}</h4>
              <h4>Min: {Math.round(main?.temp_min - 273)}°C</h4>
              <h4>Max: {Math.round(main?.temp_max - 273)}°C</h4>
            </div>

          </div>

          <div className='forecastBox'>
            <ForecastList />
          </div>

        </div>
      )
      
      }
    </div>
  )
}