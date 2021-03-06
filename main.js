const btn = document.querySelector(".searchbtn");
const neighbourbtn = document.querySelector(".neighbourbtn");
const mainCountry = document.querySelector(".mainCountry");
const countrybox = document.querySelector(".countrybox");
const btnneighbour = document.querySelector(".btnneighbour");
const spinrender = document.querySelector(".spinrender");

// const Neighbours = document.querySelector(".Neighbours ");
const renderSpinner = function (parentEl) {
  const html = `
   <div class="sk-chase">
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
      </div>
  `;
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("beforeend", html);
};
console;
function render(country) {
  const html = `
  <div class="card m-2 countryCard" style="width: 22rem; height: max-content">
          <img
            class="card-img-top"
            src="${country.flag}"
            alt="Card image cap"
          />
          <div class="card-body">
            <h5 class="card-title">${country.name}</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Capital 👑 : ${country.capital}</li>
            <li class="list-group-item">Population 👨‍👩‍👦 : ${country.population}</li>
            <li class="list-group-item">Currency 💸 : ${country.currencies[0].code}</li>
            <li class="list-group-item">Area 🌄 : ${country.area}sq km</li>
          </ul>
          <div class="card-body">
            <a href="#" class="btn btn-outline-primary btnneighbour">Find Neighbour's</a>
          </div>
    </div> 
`;
  countrybox.innerHTML = "";
  countrybox.insertAdjacentHTML("beforeend", html);
}

function renderNeighbour(e) {
  if (!document.querySelector(".row")) {
    let htmlmain = `
       <div class="Neighbours mt-1 ml-2">
          <h2 class="text-secondary text-center">Neighbour Countries</h2>
          <div class="container">
            <div class="row">
              <div class="card m-2 NeighbourCard" style="width: 14rem; height: max-content">
                <img
                  class="card-img-top"
                  src="${e.flag}"
                  alt="Card image cap"
                />
                <div class="card-body">
                  <h5 class="card-title">${e.name}</h5>
                </div>
                <ul class="list-group list-group-flush">
                <li class="list-group-item">Capital 👑 : ${e.capital}</li>
            <li class="list-group-item">Population 👨‍👩‍👦 : ${e.population}</li>
            <li class="list-group-item">Currency 💸 : ${e.currencies[0].code}</li>
            <li class="list-group-item">Area 🌄 : ${e.area}sq km</li>
                </ul>
                 <div class="card-body">
                  <a href="#" class="btn btn-outline-primary neighbourbtn">Search Country</a>
                </div>
              </div>
            </div> 
          </div>
        </div>
    `;
    countrybox.insertAdjacentHTML("beforeend", htmlmain);
  } else {
    let htmlmain = `
               <div class="card m-2 NeighbourCard" style="width: 14rem; height: max-content">
                <img
                  class="card-img-top"
                  src="${e.flag}"
                  alt="Card image cap"
                />
                <div class="card-body">
                  <h5 class="card-title">${e.name}</h5>
                </div>
                <ul class="list-group list-group-flush">
                <li class="list-group-item">Capital 👑 : ${e.capital}</li>
            <li class="list-group-item">Population 👨‍👩‍👦 : ${e.population}</li>
            <li class="list-group-item">Currency 💸 : ${e.currencies[0].code}</li>
            <li class="list-group-item">Area 🌄 : ${e.area}sq km</li>
                </ul>
                  <div class="card-body">
                  <a href="#" class="btn btn-outline-primary neighbourbtn">Seach Country</a>
                </div>
              </div>
    `;
    document.querySelector(".row").insertAdjacentHTML("beforeend", htmlmain);
  }
}
const renderError = (err) => {
  countrybox.innerHTML = "";
  console.log(err);
  const html = `
    <h4 class="bg-danger text-light p-2"> ${err} </h4>
    `;
  countrybox.insertAdjacentHTML("afterbegin", html);
};

let users;

async function getCountry(country) {
  renderSpinner(spinrender);
  try {
    const data = await fetch(
      `https://restcountries.eu/rest/v2/name/${country}`
    );
    let result = await data.json();
    result = country.toLowerCase() === "india" ? result[1] : result[0];
    render(result);
    users = result.borders.map((e) => e);
  } catch (err) {
    renderError("Check the country again & retry.");
  }
}

async function getNeighbour(country, i) {
  try {
    const data = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${country}`
    );
    const result = await data.json();
    renderNeighbour(result);
  } catch (err) {
    renderError("No response received. Check your internet connection.");
  }
}

btn.addEventListener("click", async function (e) {
  e.preventDefault();
  const country = document.querySelector(".form-control").value.toLowerCase();
  if (!country) return;
  await getCountry(country);
});

countrybox.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("btnneighbour")) {
    if (document.querySelector(".Neighbours")) {
      document.querySelector(".Neighbours").remove();
    }
    users.forEach(async function (x) {
      await getNeighbour(x);
    });
  }
  if (e.target.classList.contains("neighbourbtn")) {
    const country = e.target.closest(".card").querySelector(".card-title")
      .textContent;
    (async () => {
      await getCountry(country);
    })();
  }
});

// find me
const getCoords = async function () {
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const { latitude, longitude } = pos.coords;
    return { latitude, longitude };
  } catch (err) {
    renderError("No response received. Check your internet connection.");
  }
};
// reverse geocode
const getLocation = async function (lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const data = await fetch(url);
    const locate = await data.json();
    const location = locate.display_name
      .trim()
      .split(",")
      .map((e) => e.trim())
      .pop();
    await getCountry(location);
  } catch (err) {
    renderError("No response received. Check your internet connection.");
  }
};
document.getElementById("findme").addEventListener("click", async () => {
  const { latitude, longitude } = await getCoords();
  await getLocation(latitude, longitude);
});
