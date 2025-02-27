//função de mudar imagem pelo id e pela url
function changeImage(id, url) {
  document.getElementById(id).src = url;
}
//função de mudar texto pelo id e pelo texto
function changeText(id, text) {
  document.getElementById(id).innerText = text;
}

// Daqui para baixo voce ira escrever
// o código para resolver o desafio
let pokemonList = [];
let currentIndex = 0;

  async function fetchPokemonList() {
try{
  const response =await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1292');

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
    const data = await response.json();
  pokemonList= data.results;
  await loadPokemon();
}catch (err) {
  console.error('erro ao carregar a lista dos pokemons', err)

}
}
async function loadPokemon() {
  try {
    const response = await fetch(pokemonList[currentIndex].url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pokemon = await response.json();
    const formName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    changeText('name', formName);
    changeImage('img_sprite_front_default', pokemon.sprites.front_default || '../assets/missingno.png');

  } catch (e) {
    console.error('Erro ao carregar Pokémon:', e);
    changeImage('img_sprite_front_default', '../assets/missingno.png');
  }
}

async function searcPokemon(){
    try {
      const searchTerm = document.getElementById('searchinput').value.toLowerCase().trim();
      if (!searchTerm) {
        showFeedback('digite um nome válido');
        return;

      }
      const foundPokemon = pokemonList.find(p=> p.name.toLowerCase() === searchTerm);
      if (!foundPokemon){
        showFeedback('Pokemnon não encontrado!');
      }
      currentIndex = pokemonList.findIndex(p => p.name === foundPokemon.name);

      const response = await fetch(foundPokemon.url);

      if (!response.ok) {
        throw new Error(`Erro ao buscar os dados do Pokémon`);
      }

      const pokemonData = await response.json();
      changeText('name', pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1));
      changeImage('img_sprite_front_default', pokemonData.sprites.front_default || '../assets/missingno.png');

    } catch (err) {
      console.error('Erro na busca', err);
      showFeedback('erro ao realizar busca');

    }
}

function previousPokemon() {
  currentIndex = (currentIndex - 1 + pokemonList.length) % pokemonList.length;
  loadPokemon();
  console.log(`Pokemon Anterior: ${currentIndex}`);
}

function nextPokemon() {
  currentIndex = (currentIndex + 1) % pokemonList.length;
  loadPokemon();
  console.log(`Pokemon Seguinte: ${currentIndex}`);
}

window.addEventListener('load', () => {
  fetchPokemonList();
});