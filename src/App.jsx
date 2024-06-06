import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

function App() {
  const [countries, setCountries] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [allCountries, setAllCountries] = useState([]);
  const [isOptionsShown, setIsOptionsShown] = useState(true);
  const select = useRef(null);

  useEffect(() => {
    const fetchData = async function () {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const responseData = await response.json();

      let loadedCountries = [];
      for (const key in responseData) {
        loadedCountries.push({
          name: responseData[key].name.common,
          flag: responseData[key].flags.png,
          population: responseData[key].population,
          region: responseData[key].region,
          capital: responseData[key].capital,
          area: responseData[key].area,
          nativeName: responseData[key].name.nativeName,
          subRegion: responseData[key].subregion,
          topLevelDomain: responseData[key].tld,
          currency: responseData[key].currencies,
          lang: responseData[key].languages,
          borders: responseData[key].borders,
          independent: responseData[key].independent,
          id: key,
        });
      }
      // loadedCountries.sort(function (a, b) {
      //   return a.name.localeCompare(b.name);
      // });
      setCountries(loadedCountries);
      setAllCountries(loadedCountries);
    };
    fetchData();

  }, []);

  function handleDarkMode() {
    setDarkMode(!darkMode);
  }

  function handleSort(num) {
    let NewCountries = countries;
    if (num == "0") {
      NewCountries.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
    if (num == "1") {
      NewCountries.sort(function (a, b) {
        return b.area - a.area;
      });
      console.log(NewCountries);
    }
    if (num == "2") {
      NewCountries.sort(function (a, b) {
        return b.population - a.population;
      });
    }
    setCountries(Array.from(NewCountries));
  }

  function handleFilter(value) {
    let newCountries = allCountries;

    if (value == "0") {
      setCountries(allCountries);
    }
    if (value == "1") {
      newCountries = newCountries.filter((country) => item.region == "Africa");
    }
    if (value == "2") {
      newCountries = newCountries.filter((item) => item.region == "Americas");
    }
    if (value == "3") {
      newCountries = newCountries.filter((item) => item.region == "Asia");
    }
    if (value == "4") {
      newCountries = newCountries.filter((item) => item.region == "Europe");
    }
    if (value == "5") {
      newCountries = newCountries.filter((item) => item.region == "Oceania");
    }

    setCountries(Array.from(newCountries));
    select.current.value = 0;
  }

  function handleSearch(value) {
    let found = allCountries;
    found = found.filter(function (item) {
      return item.name.includes(value) || item.capital?.includes(value);
    });
    setCountries(Array.from(found));
  }

  return (
    <>
      <NavBar darkMode={darkMode} onClick={handleDarkMode} />
      {isOptionsShown && (
        <Options
          darkMode={darkMode}
          handleSort={handleSort}
          handleFilter={handleFilter}
          select={select}
          handleSearch={handleSearch}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <List
              countries={countries}
              darkMode={darkMode}
              isOptionsShown={setIsOptionsShown}
            />
          }
        />

        <Route
          path="/country/:id"
          element={
            <CountryDetails
              countries={allCountries}
              darkMode={darkMode}
              isOptionsShown={setIsOptionsShown}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;

function NavBar({ onClick, darkMode }) {
  return (
    <>
      <div className={darkMode ? "nav dark2" : "nav"}>
        <div className="navbrand">Where in the world?</div>
        <button onClick={onClick} className={darkMode ? "dark" : ""}>
          <i className="fa-regular fa-moon"></i>{" "}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </>
  );
}

function Options({ darkMode, handleSort, handleFilter, select, handleSearch }) {
  return (
    <>
      <div className={darkMode ? "options dark" : "options"}>
        <input
          type="text"
          placeholder="Search for a country"
          className={darkMode ? " dark2" : ""}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select
          id="select"
          className={darkMode ? " dark2" : ""}
          onChange={(e) => handleFilter(e.target.value)}
        >
          select
          <option value="0">filter by region</option>
          <option value="1">Africa</option>
          <option value="2">America</option>
          <option value="3">Asia</option>
          <option value="4">Europe</option>
          <option value="5">Oceania</option>
        </select>
        <select
          id="select2"
          className={darkMode ? " dark2" : ""}
          onChange={(e) => handleSort(e.target.value)}
          ref={select}
        >
          select
          <option value="0">Sort by ...</option>
          <option value="1">Area</option>
          <option value="2">population</option>
        </select>
      </div>
    </>
  );
}

function List({ countries, darkMode, isOptionsShown }) {
  return (
    <div className={darkMode ? "parent dark" : "parent"}>
      <div className="container">
        {countries.map((country) => {
          return (
            <Box
              key={country.id}
              id={country.id}
              name={country.name}
              area={country.area}
              flag={country.flag}
              population={country.population}
              region={country.region}
              capital={country.capital}
              darkMode={darkMode}
              isOptionsShown={isOptionsShown}
            />
          );
        })}
      </div>
    </div>
  );
}

function Box({
  name,
  area,
  flag,
  capital,
  region,
  population,
  darkMode,
  id,
  isOptionsShown,
}) {
  return (
    <>
      <div className={darkMode ? "box dark2" : "box"}>
        <p>
          <span>
            Area: {area} Km<sup>2</sup>
          </span>
        </p>
        <p>
          <span>Capital: {capital}</span>
        </p>
        <p>
          <span>Region: {region}</span>
        </p>
        <p>
          <span>Population: {population} </span>
        </p>
        <Link to={`/country/${id}`}>
          <p
            onClick={() => {
              isOptionsShown(false);
            }}
          >
            {name}
          </p>
        </Link>
        <img src={flag} alt={name} />
      </div>
    </>
  );
}

function CountryDetails({ countries, darkMode, isOptionsShown }) {
  const navigate = useNavigate();
  let index = parseInt(window.location.pathname.split("/").pop());
  let country = countries[index];

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className={darkMode ? "box box2 dark2" : "box box2"}>
        <button
          className={darkMode ? "dark" : ""}
          onClick={() => {
            navigate(-1);
            isOptionsShown(true);
          }}
        >
          Go Back
        </button>

        <p>
          <span>nativeName:</span>
          {
            country?.nativeName[Object.keys(country?.nativeName)[0]][
              Object.keys(
                country?.nativeName[Object.keys(country?.nativeName)[0]]
              )[0]
            ]
          }
        </p>
        <p>
          <span>languages:</span> {country?.lang[Object.keys(country?.lang)[0]]}{" "}
          {country?.lang[Object.keys(country?.lang)[1]]}
        </p>
        <p>
          <span>borders:</span> {country?.borders ? country.borders[0] : "none"}{" "}
          {country?.borders ? country.borders[0] : ""}{" "}
          {country?.borders ? country.borders[1] : ""}{" "}
          {country?.borders ? country.borders[2] : ""}{" "}
          {country?.borders ? country.borders[3] : ""}{" "}
        </p>
        <p>
          <span>Capital:</span> {country.capital}
        </p>
        <p>
          <span>Region:</span> {country.region}
        </p>
        <p>
          <span>Population:</span> {country.population}
        </p>
        <p>
          <span>Area:</span> {country.area} Km<sup>2</sup>
        </p>
        <p>
          <span>topLevelDomain:</span> {country.topLevelDomain}
        </p>
        <p>
          <span>subRegion:</span> {country.subRegion}
        </p>
        {country.independent && <p>Independent</p>}
        <h2>{country.name}</h2>
        <img src={country.flag} alt={country.name} />
      </div>
    </div>
  );
}
