import React, { useState, useEffect } from "react";

const WeatherApp = () => {
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const [isCelsius, setIsCelsius] = useState(true);
    const [backgroundClass, setBackgroundClass] = useState("default");

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    fetchWeather(latitude, longitude);
                },
                (error) => console.error("Error getting location:", error)
            );
        } else {
            console.error("Geolocation not supported.");
        }
    }, []);

    const fetchWeather = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            setWeather(data);
            setTemperature(data.main.temp);
            setBackgroundClass(getBackgroundClass(data.weather[0].main));
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    const toggleTemperature = () => {
        setIsCelsius(!isCelsius);
    };

    const getTemperature = () => {
        return isCelsius
            ? `${temperature.toFixed(1)}°C`
            : `${((temperature * 9) / 5 + 32).toFixed(1)}°F`;
    };

    const getBackgroundClass = (weatherCondition) => {
        const backgrounds = {
            Clear: "clear-sky",
            Clouds: "cloudy",
            Rain: "rainy",
            Thunderstorm: "stormy",
            Snow: "snowy",
            Mist: "misty",
            Haze: "hazy",
            Default: "default"
        };
        return backgrounds[weatherCondition] || backgrounds.Default;
    };

    return (
        <div className={`weather-app ${backgroundClass}`}>
            <h1>Local Weather</h1>
            {weather ? (
                <div className="weather-info">
                    <h2>
                        {weather.name}, {weather.sys.country}
                    </h2>
                    <h3>{weather.weather[0].description}</h3>
                    <img src={weather.weather[0].icon} alt="Weather Icon" />
                    <h2>{getTemperature()}</h2>
                    <button onClick={toggleTemperature} className="toggle-btn">
                        Toggle °C / °F
                    </button>
                </div>
            ) : (
                <p>Loading weather...</p>
            )}
        </div>
    );
};

export default WeatherApp;
