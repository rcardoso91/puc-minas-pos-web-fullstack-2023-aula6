const traducoes = {
    "clear sky": "céu limpo",
    "few clouds": "poucas nuvens",
    "scattered clouds": "nuvens dispersas",
    "broken clouds": "nuvens quebradas",
    "shower rain": "chuva de banho",
    "rain": "chuva",
    "thunderstorm": "tempestade",
    "snow": "neve",
    "mist": "névoa",
    "thunderstorm with light rain": "trovoada com chuva fraca",
    "heavy intensity rain": "chuva de intensidade forte"
};



// Função para traduzir o termo em inglês para português
function traduzirClima(climaEmIngles) {
    if (traducoes[climaEmIngles]) {
        return traducoes[climaEmIngles];
    }
    // Se não houver tradução disponível, retorne o termo em inglês original
    return climaEmIngles;
}

// Função para buscar a previsão do tempo a partir da API da Climatempo
function getWeather(latitude, longitude) {
    const token = '6d9edc604294648531c852cadb201ed5';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${token}&units=metric`;

    $.ajax({
        url: apiUrl,
        dataType: 'json',
        success: function (data) {
            const city = data.name;
            const tempKelvin = data.main.temp;



            const weatherDescription = data.weather[0].description;
            const climaTraduzido = traduzirClima(weatherDescription); // Traduz o clima

            const tempCelsius = data.main.temp;
            const tempMinCelsius = data.main.temp_min;
            const tempMaxCelsius = data.main.temp_max;
            const pressure = data.main.pressure;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            // Dados de fuso horário, nascer do sol e pôr do sol
            const timezoneOffset = data.timezone / 3600; // Converte o offset em horas
            const timezone = data.timezone;
            const sunriseTimestamp = data.sys.sunrise;
            const sunsetTimestamp = data.sys.sunset;

            // Mostrar os dados na página
            document.getElementById("latValue").textContent = ` ${lat}`;
            document.getElementById("longValue").textContent = ` ${lon}`;
            document.getElementById("cityName").textContent = ` ${city}`;
            document.getElementById("temperature").textContent = ` ${tempCelsius}`;
            document.getElementById("weatherDescription").textContent = ` ${climaTraduzido}`;
            document.getElementById("tempMin").textContent = ` ${tempMinCelsius}`;
            document.getElementById("tempMax").textContent = `${tempMaxCelsius}`;
            document.getElementById("pressure").textContent = ` ${pressure}`;
            document.getElementById("humidity").textContent = ` ${humidity}`;
            document.getElementById("windSpeed").textContent = ` ${windSpeed} `;
            document.getElementById("timezone").textContent = `GMT${timezoneOffset > 0 ? '+' : ''}${timezoneOffset}`;
            document.getElementById("sunrise").textContent = `Nascer do Sol: ${formatTime(sunriseTimestamp, timezoneOffset)}h`;
            document.getElementById("sunset").textContent = `Pôr do Sol: ${formatTime(sunsetTimestamp, timezoneOffset)}h`;




            // Mostrar o resultado
            document.getElementById("weatherResult").style.display = "block";
        },
        error: function (xhr, status, error) {
            console.error("Erro ao buscar a previsão do tempo: ", error);
        }
    });
}

// Função para obter a localização do usuário
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeather(latitude, longitude);
        }, function (error) {
            console.error("Erro ao obter a localização: " + error.message);
        });
    } else {
        console.error("Geolocalização não é suportada no seu navegador.");
    }
}

// Esperar que o documento esteja pronto antes de vincular os manipuladores de evento
$(document).ready(function () {
    $("#getWeatherButton").click(function () {
        getLocation();
    });
});

// Função para formatar o tempo a partir de um Unix Timestamp
function formatTime(timestamp, timezoneOffset) {
    const date = new Date(timestamp * 1000); // Converte o timestamp em milissegundos
    date.setUTCSeconds(date.getUTCSeconds() + timezoneOffset); // Aplica o deslocamento de fuso horário

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    // Adicione zeros à esquerda, se necessário
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
}

