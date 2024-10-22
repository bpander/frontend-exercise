import { useEffect, useMemo, useRef, useState } from "react"
import { fetchAllPokemon, fetchEvolutionChainById, fetchPokemonDetailsByName, fetchPokemonSpeciesByName } from "./api"

// NOTE: If this were a production project, I would've split this up into multiple files,
// but the README said "update and add code in `App.js` and `index.css`" so I limited my edits to those files only.

const PokemonEvolution = ({ evolutions }) => {
    if (!evolutions?.length) return null
    return (
        <ul className={'tree-list'}>
            {evolutions.map((evolution) => (
                <li key={evolution.species.name}>
                    <span className={'tree-list__node'}>
                        {evolution.species.name}
                    </span>
                    <PokemonEvolution evolutions={evolution.evolves_to} />
                </li>
            ))}
        </ul>
    )
}

const removeTrailingSlash = (str) => str.replace(/\/$/, '')

const loadEvolutionChain = (evolutionChainUrl) => {
    // REVIEW: This implementation could be brittle since the evolution chain url could change which would cause this to break.
    // It might be better just to hit `evolution_chain.url` directly (though that has its own downsides).
    // I used the `fetchEvolutionChainById` since that was how I interpreted the README ("Use the api functions defined in `api.js` to retrieve this data").
    // If this were my own personal project, I'd probably be more inclined to use `evolution_chain.url` directly.
    // If it were a production project, I'd start a thread in the PR or group chat or similar to discuss it as a group.
    try {
        const re = new RegExp('/evolution-chain/(.+)$')
        const match = removeTrailingSlash(evolutionChainUrl).match(re)
        const evolutionId = match?.[1] || null
        return fetchEvolutionChainById(evolutionId)
    } catch {
        return null
    }
}

const useLatest = (value) => {
    const ref = useRef(value)
    ref.current = value
    return ref
}

const PokemonDetails = ({ name }) => {
    const [details, setDetails] = useState(null)
    const [evolutionChain, setEvolutionChain] = useState(null)
    const latestNameRef = useLatest(name)
    useEffect(() => {
        const loadPokemonDetails = async () => {
            const [detailsData, speciesData] = await Promise.all([
                fetchPokemonDetailsByName(name),
                fetchPokemonSpeciesByName(name),
            ])
            // NOTE: The evolution chain ID is not the same as the species ID.
            // For example, wartortle's id is `8`, but `fetchEvolutionChainById(8)` returns spearow's chain.
            const evolutionData = await loadEvolutionChain(speciesData.evolution_chain.url)
            if (latestNameRef.current !== name) return
            setDetails(detailsData)
            setEvolutionChain(evolutionData)
        }
        loadPokemonDetails()
    }, [name, latestNameRef])

    if (!details) return '...'

    return (
        <div className={'detail'}>
            <h2 className={'detail__heading'}>
                {details?.name}
            </h2>
            <div className={'flex-grid flex-grid--gutters flex-grid--center'}>
                <div>
                    <h3 className={'detail__heading'}>Types</h3>
                    <ul className={'list'}>
                        {details.types.map((typeData) => (
                            <li key={typeData.type.name}>
                                {typeData.type.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className={'detail__heading'}>Moves</h3>
                    <ul className={'list'}>
                        {details.moves.slice(0, 4).map((moveData) => (
                            <li key={moveData.move.name}>
                                {moveData.move.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={'detail__footer'}>
                <div className={'flex-grid flex-grid--center'}>
                    <div>
                        <h3 className={'detail__heading detail__heading--tight'}>
                            Evolutions
                        </h3>
                        {evolutionChain && <PokemonEvolution evolutions={[evolutionChain.chain]} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function App() {
    const [allPokemon, setAllPokemon] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchValue, setSearchValue] = useState('')
    const [activePokemon, setActivePokemon] = useState()

    useEffect(() => {
        const fetchPokemon = async () => {
            setError(null)
            setLoading(true)
            try {
                const { results: pokemonList } = await fetchAllPokemon()
                setAllPokemon(pokemonList)
            } catch (e) {
                setError(e)
            }
            setLoading(false)
        }

        fetchPokemon()
    }, [])

    const onSearchValueChange = (event) => {
        const value = event.target.value
        setSearchValue(value)
    }

    const filteredPokemon = useMemo(() => {
        if (!searchValue.trim()) return allPokemon
        const re = new RegExp(searchValue, 'i')
        return allPokemon.filter(monster => re.test(monster.name))
    }, [allPokemon, searchValue])

    const onGetDetails = (name) => () => setActivePokemon(name)

    return (
        <div className={'pokedex__container'}>
            <div className={'pokedex__search-input'}>
                <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'} />
            </div>
            <div className={'pokedex__content'}>
                {loading ? (
                    <div className={'pokedex__status'}>Loading...</div>
                ) : error ? (
                    <div className={'pokedex__status'}>An error has occurred.</div>
                ) : filteredPokemon.length > 0 ? (
                    <div className={'pokedex__search-results'}>
                        {
                            filteredPokemon.map(monster => {
                                return (
                                    <div className={'pokedex__list-item'} key={monster.name}>
                                        <div>
                                            {monster.name}
                                        </div>
                                        <button
                                            onClick={onGetDetails(monster.name)}
                                            className={'pokedex__list-item__cta'}
                                        >
                                            Get Details
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (
                    <div className={'pokedex__status'}>
                        No Results Found
                    </div>
                )}
                {
                    activePokemon && (
                        <div className={'pokedex__details'}>
                            <PokemonDetails name={activePokemon} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default App
