import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [city, setCity] = useState(""); // Set the default city to Nairobi
  const [weather, setWeather] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDateInfo, setCurrentDateInfo] = useState({});

  const [weatherIcon, setWeatherIcon] = useState();


  useEffect(() => {
    window.onload = function () {
      const storedCity = localStorage.getItem("city");
      if (storedCity !== null) {
        setCity(storedCity);
      } else {
        // If no city is stored, set the default city to Nairobi
        setCity(" ");
        // Save the default city in local storage
        localStorage.setItem("city");
        getWeatherData();
      }
    };
  }, []); // Empty dependency array to run this effect only once, similar to componentDidMount

  async function getWeatherData() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=d9041933093d70168e966e20a8e9a14c`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        setErrorMessage("");
      } else {
        setErrorMessage(`Oops!! ${data.message}`);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

    setCity("");
  }

  function fahrenheitToCelsius(fahrenheit) {
    const celsiusTemperature = fahrenheit - 273.15;
    return Math.round((celsiusTemperature * 10) / 10).toFixed(1);
  }
  const getDate = () => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString();
    const currentDateString = currentDate.toLocaleDateString();

    setCurrentDateInfo({ currentDateString, currentTime });
  };
  const handleClick = () => {
    getWeatherData();
    getDate();
    icon();
  };
  useEffect(() => {
    const interval = setInterval(() => {
      getDate();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const icon = () => {
    const allIcons = [
      "weather/public/assets/cloudy-1.png",
      "weather/public/assets/cloudy.png",
      "weather/public/assets/007-clear-sky.png",
      "weather/public/assets/cloudy-2.png",
      "public/assets/sunny.png",
      "weather/public/assets/rain.png",
      "weather/public/assets/light-rain.png",
    ];

    // Check if weather data is available
  
    switch (true || weather.weather[0].description) {
      case "clear sky":
        setWeatherIcon(allIcons[2]);
        break;
      case "sunny":
        setWeatherIcon(allIcons[4]);
        break;
      case "scattered clouds":
        setWeatherIcon(allIcons[1]);
        break;
      case "broken clouds":
        setWeatherIcon(allIcons[3]);
        break;
      case "overcast clouds":
        setWeatherIcon(allIcons[3]);
        break;
      case "light rain":
        setWeatherIcon(allIcons[6]);
        break;
      case "few clouds":
        setWeatherIcon(allIcons[3]);
        break;
      default:
        setWeatherIcon(allIcons[4]);
        console.log("ann kahoro");
        break;
    }
  
  };

  return (
    <div className="container">
      <h3>Weather App</h3>

      <div className="row">
        <div className="d-flex ">
          <input
            className="form-control"
            placeholder="e.g., Nairobi"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button className="btn btn-primary" onClick={handleClick}>
            Search
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {errorMessage && (
        <p className="error" style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}
      {weather && (
        <div>
          <h2
            style={{ textTransform: "uppercase", fontSize: 34 }}
            className="p-4"
          >
            {weather.name}
          </h2>
          <hr />
          <div className="d-flex justify-content-around">
            <div>{currentDateInfo.currentDateString}</div>
            <div>{currentDateInfo.currentTime}</div>
          </div>
          <hr />
          <div className="d-flex justify-content-around mt-5">
            <div className="icon">
              <img
                id="test"
                src={weatherIcon}
                alt="weather icon"
                className="img-fluid image"
              />
            </div>
            <div>
              <h1>{fahrenheitToCelsius(weather.main.temp)}°</h1>
            </div>
          </div>

          <div className="d-flex justify-content-around">
            <div className="foot ">{weather.weather[0].description}</div>
            <div className="foot humidity">
              humidity
              <br />
              {weather.main.humidity}
            </div>
            <div className="foot">
              pressure
              <br />
              {weather.main.pressure}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
