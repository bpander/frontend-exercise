import { useEffect, useMemo, useState } from "react";
import { fetchAllPokemon } from "./api";

function App() {
    const [allPokemon, setAllPokemon] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchValue, setSearchValue] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState()

    useEffect(() => {
        const fetchPokemon = async () => {
            setError(null)
            setLoading(true)
            try {
                const {results: pokemonList} = await fetchAllPokemon()
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

    const onGetDetails = (name) => async () => {
        /** code here **/
    }

    return (
        <div className={'pokedex__container'}>
            <div className={'pokedex__search-input'}>
                <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'}/>
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
                    pokemonDetails && (
                        <div className={'pokedex__details'}>
                            {/*  code here  */}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default App;
