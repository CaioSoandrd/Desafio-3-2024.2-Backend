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






function previousPokemon() {
  alert("Pokemon Anterior");
  //abra o terminal em inspecionar no chrome para visualizar
  console.log("Pokemon Anterior");
  currentIndex = (currentIndex - 1) %pokemonList.length;
}

function nextPokemon() {
  alert("Pokemon Seguinte");
  //abra o terminal em inspecionar no chrome para visualizar
  console.log("Pokemon Seguinte");
  currentIndex = (currentIndex +1 ) %pokemonList.length;
}

try{
  async function loadPokemon(){
const response = await fetch(pokemonList[currentIndex].url)
    const pokemon = await response.json();

const formName = pokemon.name[0].toUpperCase() +pokemon.name.slice(1);

changeText('name', formName);
changeImage('img_sprite_front_default', pokemon.sprites.front_default);

  }

}catch (e) {

}
