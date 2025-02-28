
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
const typesContainer = document.getElementById('types');
const weaknessesContainer = document.getElementById('weaknesses');
const resistancesContainer = document.getElementById('resistances');


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

    await updateTypeInfo(pokemon);

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


const typeCache = new Map();

async function getTypeData(typeName) {
  if (typeCache.has(typeName)) {
    return typeCache.get(typeName);
  }

  const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
  const data = await response.json();

  const typeData = {
    doubleDamageFrom: data.damage_relations.double_damage_from.map(t => t.name),
    halfDamageFrom: data.damage_relations.half_damage_from.map(t => t.name),
    noDamageFrom: data.damage_relations.no_damage_from.map(t => t.name)
  };

  typeCache.set(typeName, typeData);
  return typeData;
}

function calculateMultipliers(typesData) {
  const multipliers = new Map();

  typesData.forEach(type => {
    type.doubleDamageFrom.forEach(t => {
      multipliers.set(t, (multipliers.get(t) || 1) * 2);
    });
    type.halfDamageFrom.forEach(t => {
      multipliers.set(t, (multipliers.get(t) || 1) * 0.5);
    });
    type.noDamageFrom.forEach(t => {
      multipliers.set(t, 0);
    });
  });

  return multipliers;
}
  function createTypeTag(typeName) {
  const tag = document.createElement('span');
  tag.className = `type-tag type-${typeName}`;
  tag.textContent = typeName.toUpperCase();
  return tag;

}

async function updateTypeInfo(pokemonData) { // Adicione o parâmetro
  try {
    typesContainer.innerHTML = '';
    weaknessesContainer.innerHTML = '';
    resistancesContainer.innerHTML = '';

    const typesData = await Promise.all(
        pokemonData.types.map(t => getTypeData(t.type.name))
    );

    // Exibir tipos
    pokemonData.types.forEach(t => {
      typesContainer.appendChild(createTypeTag(t.type.name));
    });

    const multipliers = calculateMultipliers(typesData);
    const weaknesses = [];
    const resistances = [];

    multipliers.forEach((value, type) => {
      if (value > 1) weaknesses.push({ type, multiplier: value });
      if (value < 1 && value > 0) resistances.push({ type, multiplier: value });
    });
    weaknesses.forEach(({ type, multiplier }) => {
      const tag = createTypeTag(type);
      tag.title = `${multiplier}x de dano`;
      weaknessesContainer.appendChild(tag);
    });

    resistances.forEach(({ type, multiplier }) => {
      const tag = createTypeTag(type);
      tag.title = `${multiplier}x de dano`;
      resistancesContainer.appendChild(tag);
    });

  } catch (e) {
    console.error('Erro ao atualizar tipos:', e);
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