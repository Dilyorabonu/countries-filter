const darkEL = document.getElementById("dark");
const body = document.body;
const header = document.getElementById("header");
const price = document.getElementById("price");
let isDarkMode = false;
const cars = document.getElementById("cars");
let countriesData = [];

disableDarkMode();

fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((countries) => {
    countriesData = countries;
    displayCountries(countries);
  });

function displayCountries(countries) {
  const countryList = document.getElementById("cards");
  countryList.innerHTML = "";
  countries.forEach((country) => {
    const listItem = document.createElement("div");
    listItem.classList.add("card");
    const currency = country.currencies
      ? country.currencies[Object.keys(country.currencies)[0]].name
      : "N/A";
    listItem.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Area:</strong> ${country.area} square kilometers</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Currency:</strong> ${currency}</p>
        `;
    listItem.addEventListener("click", () => showCountryDetails(country));
    countryList.appendChild(listItem);

    applyThemeStyles(listItem);
  });
}

function showCountryDetails(country) {
  const modal = document.getElementById("countryModal");
  const modalDetails = document.getElementById("modal-details");
  const currency = country.currencies
    ? country.currencies[Object.keys(country.currencies)[0]].name
    : "N/A";

  modalDetails.innerHTML = `
    <h2>${country.name.common}</h2>
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Area:</strong> ${country.area} square kilometers</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Currency:</strong> ${currency}</p>
    <p><strong>Borders:</strong> ${
      country.borders
        ? country.borders
            .map(
              (code) => countriesData.find((c) => c.cca3 === code).name.common
            )
            .join(", ")
        : "N/A"
    }</p>
  `;

  modal.style.display = "block";

  const closeButton = document.querySelector(".close");
  closeButton.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function applyThemeStyles(element) {
  if (isDarkMode) {
    element.classList.add("dark-mode");
  } else {
    element.classList.remove("dark-mode");
  }
}

document.getElementById("cars").addEventListener("change", function () {
  const selectedRegion = this.value.toLowerCase();
  const filteredCountries = countriesData.filter(
    (country) =>
      selectedRegion === "filter by region" ||
      country.region.toLowerCase() === selectedRegion
  );
  displayCountries(filteredCountries);
});

function searchByCountryName() {
  const filter = price.value.toUpperCase();
  const filteredCountries = countriesData.filter((country) =>
    country.name.common.toUpperCase().includes(filter)
  );
  displayCountries(filteredCountries);
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  localStorage.setItem("isDarkMode", isDarkMode);
  applyThemeStylesToAll();
}

function enableDarkMode() {
  body.classList.add("dark-mode");
  header.classList.add("dark-mode");
  price.classList.add("dark-mode");
  cars.classList.add("dark-mode");
  darkEL.innerHTML = '<i class="fa-solid fa-sun"></i>Light Mode';
}

function disableDarkMode() {
  body.classList.remove("dark-mode");
  header.classList.remove("dark-mode");
  price.classList.remove("dark-mode");
  cars.classList.remove("dark-mode");
  darkEL.innerHTML = '<i class="fa-regular fa-moon"></i>Dark Mode';
}

function applyThemeStylesToAll() {
  const listItems = document.querySelectorAll(".card");
  listItems.forEach(applyThemeStyles);
}

darkEL.addEventListener("click", toggleDarkMode);
