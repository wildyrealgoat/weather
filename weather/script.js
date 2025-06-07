const form = document.getElementById('searchForm');
const forecastDiv = document.getElementById('forecast');
const selectedCity = document.getElementById('selectedCity');

// Вставь сюда свой ключ API
const API_KEY = 'c005619008994ba2b1f134411250706'; // ← замени на свой ключ

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = form.city.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        detectLocationAndFetchWeather();
    }
});

window.addEventListener('load', () => {
    detectLocationAndFetchWeather(); // Загружаем погоду при загрузке страницы
});

function fetchWeatherByCity(city) {
    selectedCity.textContent = city;
    forecastDiv.innerHTML = 'Завантаження...';

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&lang=uk`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                forecastDiv.innerHTML = `Помилка: ${data.error.message}`;
                return;
            }

            renderForecast(data);
        })
        .catch(() => {
            forecastDiv.innerHTML = 'Помилка при отриманні даних.';
        });
}

function fetchWeatherByCoords(lat, lon) {
    forecastDiv.innerHTML = 'Завантаження...';

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&lang=uk`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                forecastDiv.innerHTML = `Помилка: ${data.error.message}`;
                return;
            }

            selectedCity.textContent = data.location.name;
            renderForecast(data);
        })
        .catch(() => {
            forecastDiv.innerHTML = 'Не вдалося отримати погоду за геолокацією.';
        });
}

function detectLocationAndFetchWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            () => {
                forecastDiv.innerHTML = 'Дозвіл на геолокацію не наданий. Введіть місто вручну.';
            }
        );
    } else {
        forecastDiv.innerHTML = 'Геолокація не підтримується вашим браузером.';
    }
}

function renderForecast(data) {
    let html = '<table><thead><tr><th>День</th><th>Температура (°C)</th><th>Стан</th></tr></thead><tbody>';

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const options = { weekday: 'long' };
        const dayName = date.toLocaleDateString('uk-UA', options);

        html += `<tr>
            <td>${dayName}</td>
            <td>${day.day.avgtemp_c}</td>
            <td>${day.day.condition.text}</td>
        </tr>`;
    });

    html += '</tbody></table>';
    forecastDiv.innerHTML = html;
}

function renderForecast(data) {
    let html = '<table><thead><tr><th>День</th><th>Температура (°C)</th><th>Стан</th></tr></thead><tbody>';

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const options = { weekday: 'long' };
        const dayName = date.toLocaleDateString('uk-UA', options);

        const iconUrl = "https:" + day.day.condition.icon; // иконка от WeatherAPI
        const conditionText = day.day.condition.text;

        html += `<tr>
            <td>${dayName}</td>
            <td>${day.day.avgtemp_c}°C</td>
            <td>
                <img src="${iconUrl}" alt="${conditionText}" style="vertical-align: middle; width: 32px; height: 32px; margin-right: 5px;">
                ${conditionText}
            </td>
        </tr>`;
    });

    html += '</tbody></table>';
    forecastDiv.innerHTML = html;
}


function setBackgroundVideo(conditionText) {
    const video = document.getElementById('bgVideo');
    let videoFile = 'sun.mp4'; // по умолчанию

    const text = conditionText.toLowerCase();

    if (text.includes('дощ') || text.includes('rain')) {
        videoFile = 'rain.mp4';
    } else if (text.includes('хмарно') || text.includes('cloud') || text.includes('пасмурно')) {
        videoFile = 'cloud.mp4';
    } else if (text.includes('ясно') || text.includes('сонячно') || text.includes('sun')) {
        videoFile = 'sun.mp4';
    } else {
        // Можно добавить другие условия или оставить sun.mp4
        videoFile = 'sun.mp4';
    }

    if (video.src.indexOf(videoFile) === -1) { // меняем источник только если другой файл
        video.src = videoFile;
        video.load();
        video.play();
    }
}

function renderForecast(data) {
    let html = '<table><thead><tr><th>День</th><th>Температура (°C)</th><th>Стан</th></tr></thead><tbody>';

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const options = { weekday: 'long' };
        const dayName = date.toLocaleDateString('uk-UA', options);

        const iconUrl = "https:" + day.day.condition.icon;
        const conditionText = day.day.condition.text;

        html += `<tr>
            <td>${dayName}</td>
            <td>${day.day.avgtemp_c}°C</td>
            <td>
                <img src="${iconUrl}" alt="${conditionText}" style="vertical-align: middle; width: 32px; height: 32px; margin-right: 5px;">
                ${conditionText}
            </td>
        </tr>`;
    });

    html += '</tbody></table>';
    forecastDiv.innerHTML = html;

    // Устанавливаем видео на фон по погоде первого дня
    setBackgroundVideo(data.forecast.forecastday[0].day.condition.text);
}

function fetchWeatherByCity(city) {
    selectedCity.textContent = city;
    forecastDiv.innerHTML = 'Завантаження...';

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&lang=uk`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                if (data.error.code === 1006) {  // Код ошибки для "No matching location found."
                    forecastDiv.innerHTML = 'Місто не знайдено';
                } else {
                    forecastDiv.innerHTML = `Помилка: ${data.error.message}`;
                }
                selectedCity.textContent = '---';
                return;
            }

            renderForecast(data);
        })
        .catch(() => {
            forecastDiv.innerHTML = 'Помилка при отриманні даних.';
            selectedCity.textContent = '---';
        });
}

function fetchWeatherByCoords(lat, lon) {
    forecastDiv.innerHTML = 'Завантаження...';

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&lang=uk`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                if (data.error.code === 1006) {
                    forecastDiv.innerHTML = 'Місто не знайдено';
                } else {
                    forecastDiv.innerHTML = `Помилка: ${data.error.message}`;
                }
                selectedCity.textContent = '---';
                return;
            }

            selectedCity.textContent = data.location.name;
            renderForecast(data);
        })
        .catch(() => {
            forecastDiv.innerHTML = 'Не вдалося отримати погоду за геолокацією.';
            selectedCity.textContent = '---';
        });
}

