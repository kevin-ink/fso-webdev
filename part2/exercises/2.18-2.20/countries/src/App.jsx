import { useState, useEffect } from "react";
import countriesService from "./services/countries";

function App() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countriesService.getAll().then((res) => {
      setCountries(res.data);
    });
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const expandCountry = (country) => {
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p></p>
      </div>
    );
  };

  let queryResult;

  if (filteredCountries.length < 1) {
    queryResult = <p>No matches found</p>;
  } else if (filteredCountries.length > 10) {
    queryResult = <p>Too many matches, specify another filter</p>;
  } else if (filteredCountries.length === 1) {
    queryResult = expandCountry(filteredCountries[0]);
  } else {
    queryResult = filteredCountries.map((country) => {
      return <p>{country.name.common}</p>;
    });
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
