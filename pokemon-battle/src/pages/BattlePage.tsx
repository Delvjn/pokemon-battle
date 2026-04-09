import React, { useEffect, useState } from 'react';
import { getById, getMoveByUrl, getTypeByUrl } from '../../services/battleService';

export default function BattlePage() {
	const [playerPokemon, setPlayerPokemon] = useState({});
	const [aiPokemon, setAiPokemon] = useState({});

	const [selectedMove, setSelectedMove] = useState('');
	const [selectedMovePower, setSelectedMovePower] = useState<number | null>(null);

	const moves = playerPokemon?.moves ?? [];

	useEffect(() => {
		if (!selectedMove) return;

		const moveObj = moves.find((m) => m.move.name === selectedMove);
		if (!moveObj) return;

		setSelectedMovePower(moveObj.move.power); // can be null
	}, [selectedMove, moves]);

	useEffect(() => {
		loadPlayerPokemon();
		loadAIPokemon();
	}, []);

	useEffect(() => {
		console.log('playerPokemon changed:', playerPokemon);
	}, [playerPokemon]);

	useEffect(() => {
		console.log('aiPokemon changed:', aiPokemon);
	}, [aiPokemon]);

	async function loadPlayerPokemon() {
		const resultPokemon = await getById(1);

		const resultType = await getTypeByUrl(resultPokemon.types.find((p) => p.slot === 1).type.url);

		const movesWithPower = (
			await Promise.all(
				resultPokemon.moves.slice(0, 6).map(async (m) => {
					const moveData = await getMoveByUrl(m.move.url);

					if (!moveData?.power) return null; // excludes 0, null, undefined

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

		const playerPokemonObj = {
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

		setPlayerPokemon(playerPokemonObj);
	}

	async function loadAIPokemon() {}

	return (
		<>
			<div>
				{!playerPokemon ? <div>Loading...</div> : <img src={playerPokemon?.sprites?.back_default} alt={playerPokemon.name} width="200" />}

				{!aiPokemon ? <div>Loading...</div> : <img src={aiPokemon?.sprites?.front_default} alt={aiPokemon.name} width="200" />}
			</div>

			<fieldset>
				<legend>Choose attack</legend>

				{moves.map((m) => (
					<label key={m.move.name} style={{ display: 'block' }}>
						<input type="radio" name="move" value={m.move.name} checked={selectedMove === m.move.name} onChange={(e) => setSelectedMove(e.target.value)} />
						{m.move.name}
					</label>
				))}

				<button disabled={!selectedMove} onClick={() => console.log('Attack:', selectedMove)}>
					Attack
				</button>
				<p>Power: {selectedMovePower}</p>
			</fieldset>
		</>
	);
}
