$(function() {
	defineDefaultDays();
});

function defineDefaultDays() {
    document.getElementById('days').value = 1;
}

function startProcess() {
    if (getLocationValue() == null || getLocationValue() == '') {
        alert('Favor informar uma localidade.');
    } else {
        buildCard();
    }
}

async function buildCard() {
    validateDaysField();
    const weatherData = await getWeatherData();

    $(".cards").html(getCardArea());
    $("#localidade").text(weatherData.location.name);

    for (let i = 0; i < getDays(); i++) {

        if (i < 5) {
            $(".cards-panel").append(getCardStructure(i));
        } else if (i < 10) {
            $(".cards-panel-1").append(getCardStructure(i));
        } else if (i < 14) {
            $(".cards-panel-2").append(getCardStructure(i));
        }

        $(`.card-title-${i}`).text(weatherData.forecast.forecastday[i].date);
        $(`.card-img-${i}`).attr("src", `http://${weatherData.forecast.forecastday[i].day.condition.icon}`);
        $(`.card-text-${i}`).text(weatherData.forecast.forecastday[i].day.condition.text);
        $(`.temp-${i}`).text('Temperatura: ' + weatherData.forecast.forecastday[i].day.avgtemp_c + ' °C');
        $(`.max-temp-${i}`).text('Máxima: ' + weatherData.forecast.forecastday[i].day.maxtemp_c + ' °C');
        $(`.min-temp-${i}`).text('Mínima: ' + weatherData.forecast.forecastday[i].day.mintemp_c + ' °C');
    }
}

function validateDaysField() {
    const days = document.getElementById('days').value

    if (days > 14) {
        document.getElementById('days').value = 14;
    } else if (days < 1) {
        document.getElementById('days').value = 1;
    }
}

function getCardArea() {
    return '<div class="cards-panel"></div>'
    + '<div class="cards-panel-1"></div>'
    + '<div class="cards-panel-2"></div>'
}

function getCardStructure(classCode) {
    return '<section class="card" style="width: 15rem;">'
        + `<img class="card-img-top card-img-${classCode}" alt="Weather Icon">`
        + '<div class="card-body">'
        + `<h5 class="card-title card-title-${classCode}"></h5>`
        + `<p class="card-text card-text-${classCode}"></p>`
        + '</div>'
        + '<ul class="list-group list-group-flush">'
        + `<li class="list-group-item temp-${classCode}"></li>`
        + `<li class="list-group-item max-temp-${classCode}"></li>`
        + `<li class="list-group-item min-temp-${classCode}"></li>`
        + '</ul>'
        + '</section>'
}

function addCardInfo() {
    $(".card-img-top").attr("src", getWeatherIcon());
}

async function getWeatherData() {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=46e4b01ffab8436588822553221509&q=${await getLocation()}&days=${await getDays()}`;

    const result = await fetch(url);
    if (result.status == 400) {
        alert('CEP ou localidade inválida.');
    }
    const weatherData = await result.json();
    return weatherData;
}

async function getLocation() {
    if (isNaN(await getLocationValue())) {
        return await getLocationValue();
    }
    const local = await getCepData();
    return local.localidade;
}

async function getCepData() {
    const url = `https://viacep.com.br/ws/${getLocationValue()}/json/`;

    const result = await fetch(url);
    if (result.status == 400) {
        alert('CEP ou localidade inválida.');
    }
    const cepData = await result.json();
    return cepData;
}

function getDays() {
    return document.getElementById('days').value;
}

function getLocationValue() {
    return document.getElementById('local').value;
}

document.getElementById('enviar').addEventListener('click', startProcess);
