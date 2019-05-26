'use strict';

const URL = "http://localhost:3000/";

const newContactForm = document.getElementById("newContactForm");
const contactFormRow = document.getElementById('contactFormRow');
const contactsList = document.getElementById("contactsList");

const contactNameInput = document.getElementById("nameInput");
const contactEmailInput = document.getElementById("emailInput");
const locationSelect = document.getElementById('locationSelect');
const contactCountrySelect = document.getElementById("countrySelect");
const contactStateSelect = document.getElementById("stateSelect");
const contactCitySelect = document.getElementById("citySelect");
const contactPhoneInput = document.getElementById("phoneInput");
const contactAddressInput = document.getElementById("addressInput");
const contactAboutInput = document.getElementById("aboutContactInput");

const contactTemplate = document.getElementById("contactTemplate").innerHTML;


let users = [];
let countries = [];
let states = [];
let cities = [];


init();


function init() {
  fetchCountries();
  fetchStates();
  fetchCities();
  fetchUsers();
  addListeners();
}


function addListeners() {
  newContactForm.addEventListener('submit', onSubmitClick);
  contactCountrySelect.addEventListener('change', selectCountry);
  contactStateSelect.addEventListener('change', selectState);
}


function fetchCountries() {
  return fetch(URL + "countries")
    .then((response) => response.json())
    .then((resp) => (countries = resp))
    .then((resp) => renderOption(resp, contactCountrySelect));
}

function fetchStates() {
  return fetch(URL + "states")
    .then((response) => response.json())
    .then((resp) => (states = resp))
    .then((resp) => renderOption(resp, contactStateSelect))
}

function fetchCities() {
  return fetch(URL + "cities")
    .then((response) => response.json())
    .then((resp) => (cities = resp))
    .then((resp) => renderOption(resp, contactCitySelect));
}

function renderOption(data, element) {
  data.forEach((el) => addOption(el, element));
}

function addOption(data, el) {
  const template = document.createElement('option');
  template.innerHTML = data.name;
  template.id = data.id;
  el.appendChild(template);
  return template;
}


function fetchUsers() {
  return fetch(URL + 'users')
    .then((response) => response.json())
    .then((resp) => (users = resp))
    .then(renderUsers);
}

function renderUsers(data) {
  contactsList.innerHTML = data.map((contact) => {
    let stateName = states.filter((el) => el.id == contact.state_id)[0] ?
      states.filter((el) => el.id == contact.state_id)[0].name : "";
    let countryName = countries.filter((el) => el.id == contact.country_id)[0] ?
      countries.filter((el) => el.id == contact.country_id)[0].name : "";
    let cityName = cities.filter((el) => el.id == contact.city_id)[0] ?
      cities.filter((el) => el.id == contact.city_id)[0].name : "";

    return contactTemplate

      .replace("{{ id }}", contact.id)
      .replace("{{ name }}", contact.name)
      .replace("{{ email }}", contact.email)
      .replace("{{ country }}", countryName)
      .replace("{{ state }}", stateName)
      .replace("{{ city }}", cityName)
      .replace("{{ phone }}", contact.phone_number)
      .replace("{{ address }}", contact.address === null ? 'no data' : contact.address)
      .replace("{{ about }}", contact.about_me == null ? 'no data' : contact.about_me)
      .replace("{{ date }}", contact.createdAt);
  }).join('\n');
}

function addNewUser() {
  let countryId = countries.filter((el) => el.name == contactCountrySelect.value)[0] ?
    countries.filter((el) => el.name == contactCountrySelect.value)[0].id : null;

  let stateId = states.filter((el) => el.name == contactStateSelect.value)[0] ?
    states.filter((el) => el.name == contactStateSelect.value)[0].id : null;

  let cityId = cities.filter((el) => el.name == contactCitySelect.value)[0] ?
    cities.filter((el) => el.name == contactCitySelect.value)[0].id : null;

  user = {
    id: users.length,
    name: contactNameInput.value,
    email: contactEmailInput.value,
    phone_number: contactPhoneInput.value,
    address: contactAddressInput.value ? contactAddressInput.value : null,
    about_me: contactAboutInput.value ? contactAboutInput.value : null,
    country_id: countryId,
    state_id: stateId,
    city_id: cityId
  };
  sendNewUser(user);
  fetchUsers();
}


function sendNewUser(user) {
  return fetch(URL + 'users', {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });
}

function onSubmitClick(e) {
  e.preventDefault();

  addNewUser();
}


function selectCountry() {
  let selectedCountryIndex = contactCountrySelect.selectedIndex;
  console.log(selectedCountryIndex);
  if (selectedCountryIndex > 0) {
    contactStateSelect.classList.remove('location__select--hidden')
  };
}

function selectState() {
  let selectedStateIndex = contactStateSelect.selectedIndex;
  console.log(selectedStateIndex);
  if (selectedStateIndex > 0) {
    fetchCities();
    contactCitySelect.classList.remove('location__select--hidden');
  }
}