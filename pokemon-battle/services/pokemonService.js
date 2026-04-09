import axios from "axios"

const API_BASE_URL = 'https://pokeapi.co/api/v2'

async function getById(id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/pokemon/${id}`);

        return (
            response.data
        )
    } catch (error) {
        console.error('Failed to load:', error)
        return null
    }
}

async function getMoveByUrl(url) {
  try {
        const response = await axios.get(url);

        return response.data;
        
    } catch (error) {
        console.error('Failed to load:', error)
        return null
    }
}

async function getTypeByUrl(url) {
  try {
        const response = await axios.get(url);

        return response.data;
        
    } catch (error) {
        console.error('Failed to load:', error)
        return null
    }
}

async function loadPokemon(id) {
		const resultPokemon = await getById(id);

		const resultType = await getTypeByUrl(resultPokemon.types.find((p) => p.slot === 1).type.url);

		const movesWithPower = (
			await Promise.all(
				resultPokemon.moves.slice(0, 6).map(async (m) => {
					const moveData = await getMoveByUrl(m.move.url);

					if (!moveData?.power) return null;

					return {
						...m,
						move: {
							...m.move,
							power: moveData.power,
						},
					};
				}),
			)
		).filter(Boolean);

		const pokemonObject = {
			name: resultPokemon.name,
			hp: resultPokemon.stats.find((p) => p.stat.name === 'hp').base_stat * 10,
			sprites: {
				front_default: resultPokemon.sprites.front_default,
				back_default: resultPokemon.sprites.back_default,
			},
			types: {
				name: resultPokemon.types.find((p) => p.slot === 1).type.name,
				type: resultType,
			},
			moves: movesWithPower,
		};

		return pokemonObject;
	}

export { getById, getMoveByUrl, getTypeByUrl, loadPokemon }