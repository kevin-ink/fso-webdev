import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";

const getWeather = (lat, lon) => {
  return axios.get(
    `${baseUrl}lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_API_KEY}`,
  );
};

export default { getWeather };
