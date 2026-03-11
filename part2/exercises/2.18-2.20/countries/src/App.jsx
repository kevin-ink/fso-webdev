import { useState, useEffect } from "react";
import countriesService from "./services/countries";
import weatherService from "./services/weather";
const iconUrl = "https://openweathermap.org/payload/api/media/file/";

const getWeatherIcon = (icon, desc) => {
  if (!icon) {
    return null;
  }
  return <img src={`${iconUrl}${icon}.png`} alt={desc} />;
};

function App() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(false);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countriesService.getAll().then((res) => {
      setCountries(res.data);
    });
  }, []);

  useEffect(() => {
    if (country) {
      const [lat, lon] = country.latlng;

      weatherService.getWeather(lat, lon).then((res) => {
        const data = res.data;
        setWeather({
          temperature: data.main.temp,
          windspeed: data.wind.speed,
          icon: data.weather[0].icon,
          description: data.weather[0].description,
        });
      });
    }
  }, [country]);

  const restartSearch = () => {
    setCountry(false);
    setQuery("");
    setWeather(null);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const renderCountry = (country) => {
    const countryCapital = country.capital[0];

    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {countryCapital}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.entries(country.languages).map(([key, value]) => {
            return <li key={key}>{value}</li>;
          })}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        <div>
          <h1>Weather in {countryCapital}</h1>
          {weather && (
            <>
              <p>Temperature {weather.temperature} Celsius</p>
              <p>Wind {weather.windspeed} m/s</p>
              {getWeatherIcon(weather.icon, weather.description)}
            </>
          )}
        </div>
        <div>
          <button onClick={restartSearch}>Restart</button>
        </div>
      </div>
    );
  };

  let queryResult;

  if (country) {
    queryResult = renderCountry(country);
  } else {
    if (query === "") {
      queryResult = <p>Type something to search for countries</p>;
    } else if (filteredCountries.length < 1) {
      queryResult = <p>No matches found</p>;
    } else if (filteredCountries.length > 10) {
      queryResult = <p>Too many matches, specify another filter</p>;
    } else if (filteredCountries.length === 1) {
      setCountry(filteredCountries[0]);
      queryResult = renderCountry(filteredCountries[0]);
    } else {
      queryResult = filteredCountries.map((country) => {
        return (
          <div key={country.cca3}>
            {country.name.common}{" "}
            <button onClick={() => setCountry(country)}>Show</button>
          </div>
        );
      });
    }
  }

  return (
    <>
      <div>
        find countries{" "}
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div>{queryResult}</div>
    </>
  );
}

export default App;
