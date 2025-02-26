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
try{
  async function fetchPokemonList() {

  const response =await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1292');
  const data = await response.json();
  pokemonList= data.results;

}
}catch (err) {
  console.error('erro ao carregar a lista dos pokemons', err)

}
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}



function previousPokemon() {
  alert("Pokemon Anterior");
  //abra o terminal em inspecionar no chrome para visualizar
  console.log("Pokemon Anterior");
}

function nextPokemon() {
  alert("Pokemon Seguinte");
  //abra o terminal em inspecionar no chrome para visualizar
  console.log("Pokemon Seguinte");
}
