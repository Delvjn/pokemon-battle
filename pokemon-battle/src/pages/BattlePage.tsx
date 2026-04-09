import React, { useEffect, useState } from 'react';

export default function BattlePage({ yourPokemon, opponentPokemon }) {
	const [selectedMove, setSelectedMove] = useState('');
	const [selectedMovePower, setSelectedMovePower] = useState<number | null>(null);

	const moves = yourPokemon?.moves ?? [];

	useEffect(() => {
		if (!selectedMove) return;

		const moveObj = moves.find((m) => m.move.name === selectedMove);
		if (!moveObj) return;

		setSelectedMovePower(moveObj.move.power);
	}, [selectedMove, moves]);

	if (!yourPokemon || !opponentPokemon) {
		return <div>No pokemon selected. Go back and pick your pokemon!</div>;
	}

	return (
		<>
			<div>
				<img src={yourPokemon.sprites.back_default} alt={yourPokemon.name} width="200" />
				<img src={opponentPokemon.sprites.front_default} alt={opponentPokemon.name} width="200" />
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
