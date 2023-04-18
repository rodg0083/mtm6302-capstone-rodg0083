const loadMore = document.getElementById('loadMore');
const plist = document.getElementById('plist');
const catchList = new Set(JSON.parse(localStorage.getItem('caughtPokemons')) || []);
const imgs = document.getElementById('images')

async function fetchData(url) {
  const response = await fetch(url);
  const json = await response.json();
  displayPokemons(json.results);
  addMore(json.next);
}

function addMore(url) {
  loadMore.addEventListener('click', async function() {
    await fetchData(url);
    loadMore.style.display = 'none';
  });
}

function displayPokemons(pokemons) {
  const htmlTemplate = pokemons.map((pokemon) => `
    <div class="col-sm-6 col-md-4 col-lg-2">
      <figure>
        <h3>
          <span id="alert-${parseUrl(pokemon.url)}" class="badge rounded-pill bg-success" style="display: none;">Caught</span>
        </h3>
          <img id="images" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseUrl(pokemon.url)}.png" class="img-thumbnail grayscale" data-bs-toggle="modal" data-bs-target="#myModal">
        <figcaption>${pokemon.name}</figcaption>
        <button class="catch btn btn-danger btn-md" data-id="${parseUrl(pokemon.url)}">Catch</button>
        <button class="release btn btn-success btn-md" data-id="${parseUrl(pokemon.url)}">Release</button>
      </figure>
    </div>
  `);
  plist.innerHTML += htmlTemplate.join('')
  initializeCaughtPokemons()
}

function parseUrl (url) {
  return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1)
}

function initializeCaughtPokemons() {
  for (const caughtPokemon of catchList) {
    const alertSpan = document.getElementById(`alert-${caughtPokemon}`);
    if (alertSpan) {
      alertSpan.style.display = 'inline-block';
    }
  }
}

function updateCaughtPokemons(id, caught) {
  if (caught) {
    catchList.add(id);
  } else {
    catchList.delete(id);
  }
  localStorage.setItem('caughtPokemons', JSON.stringify(Array.from(catchList)));
}

plist.addEventListener('click', function(event) {
  const {target} = event;
  if (target.classList.contains('catch')) {
    const id = target.dataset.id;
    const alertSpan = document.getElementById(`alert-${id}`);
    alertSpan.style.display = 'inline-block';
    updateCaughtPokemons(id, true);
  } else if (target.classList.contains('release')) {
    const id = target.dataset.id;
    const alertSpan = document.getElementById(`alert-${id}`);
    alertSpan.style.display = 'none';
    updateCaughtPokemons(id, false);
  }
});

fetchData('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20')


function savePokeID(imgs) {
  const pokeID = imgs.pokemon.url.split('-')[1];
  localStorage.setItem('pokeID', pokeID);
}

/* -------------- Pokemon Info Card -------------- */
const $intro = document.getElementById('info-card')
const $pid = localStorage.getItem('pokeID')

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
async function fetchData2 (){
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${$pid}`)
  const json1 = await resp.json()

  displayPokemonInfo(json1)

}

fetchData2()

})

function displayPokemonInfo(pokeinfos) {
  const htmlTemplate2 = (`
    <h2 id="title">${pokeinfos.name}</h2>
    <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeinfos.pokedex_numbers[0].entry_number}.png" class="img-fluid rounded-start">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">Description</h5>
            <p class="card-text">${pokeinfos.flavor_text_entries[0].flavor_text}</p>
            <p class="card-text">Height: ${pokeinfos.height / 10} m</p>
            <p class="card-text">Weight: ${pokeinfos.weight / 10} kg</p>
          </div>
          <div class="card-body">
            <h5 class="card-title">Abilities</h5>
            <ul class="list-group">
              ${pokeinfos.abilities.map(ability => `<li class="list-group-item">${ability.ability.name}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `)
  $intro.innerHTML += htmlTemplate2
}
