import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function BattlePage({ yourPokemon, opponentPokemon }) {
	const [selectedMove, setSelectedMove] = useState('');
	const [selectedMovePower, setSelectedMovePower] = useState<number | null>(null);
	const [yourCurrentHp, setYourCurrentHp] = useState<number | null>(null);
	const [opponentCurrentHp, setOpponentCurrentHp] = useState<number | null>(null);
	const [opponentHit, setOpponentHit] = useState(false);
	const [yourHit, setYourHit] = useState(false);
	const [winner, setWinner] = useState<string | null>(null);
	const navigate = useNavigate();

	const moves = yourPokemon?.moves ?? [];

	useEffect(() => {
		if (yourPokemon) setYourCurrentHp(yourPokemon.hp);
		if (opponentPokemon) setOpponentCurrentHp(opponentPokemon.hp);
	}, [yourPokemon, opponentPokemon]);

	function getTypeMultiplier(attackerType: any, defenderTypeName: string): number {
		const relations = attackerType.damage_relations;
		if (relations.double_damage_to.some((t: any) => t.name === defenderTypeName)) return 2;
		if (relations.half_damage_to.some((t: any) => t.name === defenderTypeName)) return 0.5;
		if (relations.no_damage_to.some((t: any) => t.name === defenderTypeName)) return 0;
		return 1;
	}

	function calculateDamage(movePower: number, attackerType: any, defenderTypeName: string): number {
		const typeMultiplier = getTypeMultiplier(attackerType, defenderTypeName);
		const randomFactor = Math.random() * (1 - 0.85) + 0.85;
		return Math.round(movePower * typeMultiplier * randomFactor);
	}

	function handleAttack() {
		if (!selectedMove || opponentCurrentHp === null || winner) return;

		const damage = calculateDamage(selectedMovePower!, yourPokemon.types.type, opponentPokemon.types.name);
		const newHp = Math.max(0, opponentCurrentHp - damage);

		setOpponentHit(true);
		setTimeout(() => {
			setOpponentCurrentHp(newHp);
			setOpponentHit(false);
		}, 500);

		console.log(`${yourPokemon.name} used ${selectedMove}! Dealt ${damage} damage.`);

		if (newHp <= 0) {
			setTimeout(() => setWinner(yourPokemon.name), 500);
			setSelectedMove('');
			setSelectedMovePower(null);
			return;
		}

		setTimeout(() => {
			const opponentMoves = opponentPokemon.moves;
			if (opponentMoves.length === 0 || yourCurrentHp === null) return;

			const randomMove = opponentMoves[Math.floor(Math.random() * opponentMoves.length)];
			const oppDamage = calculateDamage(randomMove.move.power, opponentPokemon.types.type, yourPokemon.types.name);
			const newYourHp = Math.max(0, yourCurrentHp - oppDamage);

			setYourHit(true);
			setTimeout(() => {
				setYourCurrentHp(newYourHp);
				setYourHit(false);

				if (newYourHp <= 0) {
					setWinner(opponentPokemon.name);
				}
			}, 500);
		}, 2000);

		setSelectedMove('');
		setSelectedMovePower(null);
	}

	useEffect(() => {
		if (!selectedMove) return;

		const moveObj = moves.find((m) => m.move.name === selectedMove);
		if (!moveObj) return;

		setSelectedMovePower(moveObj.move.power);
	}, [selectedMove, moves]);

	if (!yourPokemon || !opponentPokemon) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
				<Typography variant="h4">No pokemon selected. Go back and pick your pokemon!</Typography>
			</Box>
		);
	}

	const hpBarStyles = {
		height: 20,
		borderRadius: 10,
		'& .MuiLinearProgress-bar': {
			borderRadius: 10,
		},
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				backgroundColor: '#f0f0f0',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				p: 4,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-end',
					justifyContent: 'center',
					gap: 12,
					width: '100%',
					maxWidth: 1200,
					mb: 4,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 10 }}>
					<Box
						sx={{
							textAlign: 'center',
							animation: yourHit ? 'hit 0.5s ease' : 'none',
							'@keyframes hit': {
								'0%': { transform: 'translateX(0)', opacity: 1 },
								'20%': { transform: 'translateX(-10px)', opacity: 0.4 },
								'40%': { transform: 'translateX(10px)', opacity: 1 },
								'60%': { transform: 'translateX(-6px)', opacity: 0.4 },
								'80%': { transform: 'translateX(6px)', opacity: 1 },
								'100%': { transform: 'translateX(0)', opacity: 1 },
							},
						}}
					>
						<img
							src={yourPokemon.sprites.back_default}
							alt={yourPokemon.name}
							style={{ width: 300, height: 300, imageRendering: 'pixelated' }}
						/>
					</Box>
					<Box sx={{ width: 220, border: '2px solid #333', borderRadius: 1, p: 2, backgroundColor: 'white' }}>
						<Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
							{yourPokemon.name}
						</Typography>
						<LinearProgress
							variant="determinate"
							value={(yourCurrentHp ?? yourPokemon.hp) / yourPokemon.hp * 100}
							color="success"
							sx={hpBarStyles}
						/>
						<Typography variant="body2" sx={{ mt: 0.5, textAlign: 'right' }}>
							{yourCurrentHp ?? yourPokemon.hp} / {yourPokemon.hp}
						</Typography>
					</Box>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 10 }}>
					<Box sx={{ width: 220, border: '2px solid #333', borderRadius: 1, p: 2, backgroundColor: 'white' }}>
						<Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
							{opponentPokemon.name}
						</Typography>
						<LinearProgress
							variant="determinate"
							value={(opponentCurrentHp ?? opponentPokemon.hp) / opponentPokemon.hp * 100}
							color="error"
							sx={hpBarStyles}
						/>
						<Typography variant="body2" sx={{ mt: 0.5, textAlign: 'right' }}>
							{opponentCurrentHp ?? opponentPokemon.hp} / {opponentPokemon.hp}
						</Typography>
					</Box>
					<Box
						sx={{
							textAlign: 'center',
							animation: opponentHit ? 'hit 0.5s ease' : 'none',
							'@keyframes hit': {
								'0%': { transform: 'translateX(0)', opacity: 1 },
								'20%': { transform: 'translateX(-10px)', opacity: 0.4 },
								'40%': { transform: 'translateX(10px)', opacity: 1 },
								'60%': { transform: 'translateX(-6px)', opacity: 0.4 },
								'80%': { transform: 'translateX(6px)', opacity: 1 },
								'100%': { transform: 'translateX(0)', opacity: 1 },
							},
						}}
					>
						<img
							src={opponentPokemon.sprites.front_default}
							alt={opponentPokemon.name}
							style={{ width: 300, height: 300, imageRendering: 'pixelated' }}
						/>
					</Box>
				</Box>
			</Box>

			<Box sx={{ display: 'flex', gap: 3, alignSelf: 'flex-start', ml: { xs: 2, md: 'calc(50% - 600px + 40px)' } }}>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						border: '2px solid #333',
						borderRadius: 1,
					}}
				>
					{moves.slice(0, 4).map((m: any) => (
						<Box
							key={m.move.name}
							onClick={() => {
								setSelectedMove(m.move.name);
								setSelectedMovePower(m.move.power);
							}}
							sx={{
								px: 4,
								py: 2,
								cursor: 'pointer',
								textTransform: 'capitalize',
								fontSize: '1.2rem',
								backgroundColor: selectedMove === m.move.name ? 'rgba(0,0,0,0.06)' : 'transparent',
							}}
						>
							{m.move.name}
						</Box>
					))}
				</Box>

				<Box
					component="button"
					disabled={!selectedMove}
					onClick={handleAttack}
					sx={{
						px: 5,
						py: 2,
						cursor: selectedMove ? 'pointer' : 'default',
						fontSize: '1.2rem',
						border: '2px solid #333',
						borderRadius: 1,
						backgroundColor: 'transparent',
						'&:hover:not(:disabled)': { backgroundColor: 'rgba(0,0,0,0.06)' },
						'&:active:not(:disabled)': { backgroundColor: 'rgba(0,0,0,0.12)' },
						textTransform: 'capitalize',
					}}
				>
					Attack
				</Box>
			</Box>

			{winner && (
				<Box
					sx={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(0,0,0,0.6)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 10,
					}}
				>
					<Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 6, textAlign: 'center' }}>
						<Typography variant="h3" sx={{ fontWeight: 'bold', textTransform: 'capitalize', mb: 2 }}>
							{winner} wins!
						</Typography>
						<Typography variant="h5" sx={{ textTransform: 'capitalize', mb: 3 }}>
							{opponentPokemon.name} fainted!
						</Typography>
						<Button variant="outlined" size="large" color="inherit" onClick={() => navigate('/')}>
							Go Home
						</Button>
					</Box>
				</Box>
			)}
		</Box>
	);
}
