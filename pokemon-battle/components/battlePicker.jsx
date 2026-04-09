import { useEffect, useState } from "react"
import { getById } from "../services/pokemonService"
import Grid from "@mui/material/Grid"
import { Box, Button, Typography } from "@mui/material"

function BattlePicker() {

    const [ pokemons, setPokemons ] = useState([])
    const [ yourPokemon, setYourPokemon ] = useState(null)
    const [ opponentPokemon, setOpponentPokemon ] = useState(null)
    const [ yourPokemonLocked, setYourPokemonLocked ] = useState(false)
    const [ opponentPokemonLocked, setOpponentPokemonLocked ] = useState(false)

    async function GetPokemons() {
        const pokemon1 = await getById(3)
        const pokemon2 = await getById(6)
        const pokemon3 = await getById(9)
        const pokemon4 = await getById(12)
        setPokemons([pokemon1, pokemon2, pokemon3, pokemon4])
    }

    useEffect(() => {
        GetPokemons()
    }, [])

    useEffect(() => {
        console.log("Your Pokemon:", yourPokemon)
        console.log("Opponent Pokemon:", opponentPokemon)
    }, [yourPokemon, opponentPokemon])

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: "linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.8)), url('/6e702b25555595.563472c896667.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Typography variant="h1" align="center">
                Pick Your Pokemon
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    rowGap: 3,
                    columnGap: 6,
                    alignItems: "center",
                    justifyItems: "center",
                }}
            >
                    <Typography variant="h2">
                        Your Pokemon
                    </Typography>
                    <Box />
                    <Typography variant="h2">
                        Opponent's Pokemon
                    </Typography>

                {/* Row 2: Your grid | VS | Opponent grid */}

                {yourPokemonLocked ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        {pokemons.filter((p) => p.id === yourPokemon)
                            .map((p) => (
                                <Box key={`you-locked-${p.id}`}>
                                    <img
                                        src={p.sprites.other["official-artwork"].front_default}
                                        alt={p.name}
                                        style={{
                                            display: "block",
                                            height: 380,
                                            width: 380
                                        }}
                                    />
                                </Box>
                            ))}
                    </Box>
                ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 180px)",
                        justifyContent: "center",
                        gap: 4,
                        width: "fit-content",
                        mx: "auto",
                        border: "2px solid black",
                        p: 4
                    }}
                >
                    {pokemons.map((p) => {
                        const isSelected = yourPokemon === p.id

                        return (
                            <Box
                            key={`you${p.id}`}
                            onClick={() => setYourPokemon(yourPokemon === p.id ? null : p.id)}
                            sx={{
                                cursor: "pointer",
                                border: isSelected ? "3px solid #2e7d32" : "2px solid black",
                                backgroundColor: isSelected ? "rgba(46, 125, 50, 0.25)" : "transparent",
                                borderRadius: 2,
                                boxShadow: isSelected ? "0 0 12px 4px rgba(46, 125, 50, 0.5)" : "none",
                                opacity: 1,
                                transform: isSelected ? "scale(1.08)" : "scale(1)",
                                transition: "all 0.2s ease",
                                transformOrigin: "center",
                                "&:hover": { transform: "scale(1.2)", opacity: 1 }
                                }}
                            >
                                <img
                                    src={p.sprites.front_default}
                                    alt={p.name}
                                    style={{
                                        display: "block",
                                        height: 180,
                                        width: 180,
                                    }}
                                />
                            </Box>
                        )
                    })}
                </Box>
                )}

                <Typography variant="h1">
                    VS
                </Typography>

                {opponentPokemonLocked ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        {pokemons.filter((p) => p.id === opponentPokemon)
                            .map((p) => (
                                <Box key={`opp-locked-${p.id}`}>
                                    <img
                                        src={p.sprites.other["official-artwork"].front_default}
                                        alt={p.name}
                                        style={{
                                            display: "block",
                                            height: 380,
                                            width: 380
                                        }}
                                    />
                                </Box>
                            ))}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 180px)",
                            justifyContent: "center",
                            gap: 4,
                            width: "fit-content",
                            mx: "auto",
                            border: "2px solid black",
                            p: 4
                        }}
                    >
                        {pokemons.map((p) => {
                            const isSelected = opponentPokemon === p.id

                            return (
                                <Box
                                key={`opp${p.id}`}
                                onClick={() => setOpponentPokemon(opponentPokemon === p.id ? null : p.id)}
                                sx={{
                                    cursor: "pointer",
                                    border: isSelected ? "3px solid #2e7d32" : "2px solid black",
                                    backgroundColor: isSelected ? "rgba(46, 125, 50, 0.25)" : "transparent",
                                    borderRadius: 2,
                                    boxShadow: isSelected ? "0 0 12px 4px rgba(46, 125, 50, 0.5)" : "none",
                                    opacity: 1,
                                    transform: isSelected ? "scale(1.08)" : "scale(1)",
                                    transition: "all 0.2s ease",
                                    transformOrigin: "center",
                                    "&:hover": { transform: "scale(1.2)", opacity: 1 }
                                    }}
                                >
                                    <img
                                        src={p.sprites.front_default}
                                        alt={p.name}
                                        style={{
                                            display: "block",
                                            height: 180,
                                            width: 180,
                                        }}
                                    />
                                </Box>
                            )
                        })}
                    </Box>
                )}

                {/* Row 3: Buttons */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <Button
                        variant="contained"
                        size="large"
                        disabled={!yourPokemon || yourPokemonLocked}
                        onClick={() => setYourPokemonLocked(true)}
                        sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
                    >
                        {yourPokemonLocked ? "Locked In" : "Lock in"}
                    </Button>
                    {yourPokemonLocked && (
                        <Button
                            variant="outlined"
                            size="large"
                            color="error"
                            onClick={() => {
                                setYourPokemonLocked(false)
                                setYourPokemon(null)
                            }}
                            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
                        >
                            Cancel
                        </Button>
                    )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        size="large"
                        color="success"
                        disabled={!(yourPokemonLocked && opponentPokemonLocked)}
                        sx={{ px: 5, py: 2, fontSize: "1.3rem" }}
                    >
                        Start Battle
                    </Button>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <Button
                        variant="contained"
                        size="large"
                        disabled={!opponentPokemon || opponentPokemonLocked}
                        onClick={() => setOpponentPokemonLocked(true)}
                        sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
                    >
                        {opponentPokemonLocked ? "Locked In" : "Lock in"}
                    </Button>
                    {opponentPokemonLocked && (
                        <Button
                            variant="outlined"
                            size="large"
                            color="error"
                            onClick={() => {
                                setOpponentPokemonLocked(false)
                                setOpponentPokemon(null)
                            }}
                            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
                        >
                            Cancel
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default BattlePicker;