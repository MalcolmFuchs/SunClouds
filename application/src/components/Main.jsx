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
    changeCity(data.name)
  }

  const saveForecastData = (data) => {
    setForecastData(data)
  }

  const changeCity = (city) => {
    setCity(city);
    getDaily(city);
  }

  const getDaily = (city) => {
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
        <img alt='WetterBild' src={`https://openweathermap.org/img/wn/${ forecast.weather[0].icon}@2x.png`}></img>
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
    }

  const iconCode = () =>
  `https://openweathermap.org/img/wn/${ weatherData.weather[0].icon}@2x.png`;

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
    main,
    wind,
    sys,
    dt,
    weather

  } = weatherData

  

  return (
    <div className='main'>
      <div className='input'>
        <input 
        className   ='searchInput'
        placeholder ='Stadt eingeben...'
        onChange    ={e => changeCity(e.target.value)}
        value       ={city}
        onKeyDown   ={getWeatherByCity}
        />
        <img 
        src='search.svg'
        onClick={getCity}
        alt='suche'
        />
        <img 
        src='location.svg'
        onClick={getLocation}
        alt='Standort'
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
              <p>{new Date(dt * 1000).toDateString()} | Uhrzeit: {new Date(dt * 1000).toLocaleTimeString([], {timeStyle: 'short'})}</p>
              <h1>{weatherData.name}, {sys.country}</h1>
              <p>{weather[0].main}</p>
            </div>

            <div className='currentWeather'>
              <img alt='WetterBild' src={iconCode()}></img>
              <h1>{Math.round(main?.temp - 273)}°C</h1>

              <div className='currentInfo'>
                <p>Gefühlt:</p> <p>{Math.round(main?.feels_like - 273)}°C</p>
                <p>Windstärke:</p> <p>{wind.speed} Km/h</p>
                <p>Luftfeuchtigkeit:</p> <p>{main.humidity}%</p>
              </div>

            </div>

            <div className='extraInfo'>
              <div><img alt='Sonnenaufgang' src='/sunrise.svg'></img><h4>: {new Date(sys.sunrise * 1000).toLocaleTimeString([], {timeStyle: 'short'})}</h4></div>
              <div><img alt='Sonnenuntergang' src='/sunset.svg'></img><h4>: {new Date(sys.sunset * 1000).toLocaleTimeString([], {timeStyle: 'short'})}</h4></div>
              
              <h4>H: {Math.round(main?.temp_min - 273)}°C</h4>
              <h4>L: {Math.round(main?.temp_max - 273)}°C</h4>
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