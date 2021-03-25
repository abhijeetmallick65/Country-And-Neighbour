const btn = document.querySelector(".searchbtn");
const neighbourbtn = document.querySelector(".neighbourbtn");
const mainCountry = document.querySelector(".mainCountry");
const countrybox = document.querySelector(".countrybox");
const btnneighbour = document.querySelector(".btnneighbour");

function render(country) {
  countrybox.innerHTML = "";
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
  countrybox.insertAdjacentHTML("beforeend", html);
}

function renderNeighbour(e, i) {
  if (i == 0) {
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

let users;

async function getCountry(country) {
  try {
    const data = await fetch(
      `https://restcountries.eu/rest/v2/name/${country}`
    );
    const [result] = await data.json();
    render(result);

    users = result.borders.map((e) => e);
  } catch (err) {
    console.log(err);
  }
}

async function getNeighbour(country, i) {
  try {
    const data = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${country}`
    );
    const result = await data.json();
    renderNeighbour(result, i);
  } catch (err) {
    console.log(err);
  }
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const country = document.querySelector(".form-control").value;
  if (!country) return;
  getCountry(country);
});

countrybox.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("btnneighbour")) {
    users.forEach((x, i) => {
      getNeighbour(x, i);
    });
  }
  if (e.target.classList.contains("neighbourbtn")) {
    const country = e.target.closest(".card").querySelector(".card-title")
      .textContent;
    getCountry(country);
  }
});
