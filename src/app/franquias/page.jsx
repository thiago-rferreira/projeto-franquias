'use client' //Pois vamos utilizar hooks

import React, { useState, useEffect } from 'react'
import styles from './franquias.module.css'

function Franquias() {
    // Estado que gerencia franquias
    const [franquias, setFranquias] = useState([])
    // Estado que controla o loading
    const [loading, setLoading] = useState(true)

    // Funcao que é responsavel por trazer os dados de franquia
    async function carregarFranquias(params) {
        console.log('Aqui teremos o buscar franquias')
        try {
            //o fetch, em getAll
            const response = await fetch('/api/franquias')
            const data = await response.json()
            setFranquias(data);

        } catch (error) {
            console.error('Erro ao carregar franquias', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        carregarFranquias()
    }, [])

    return (
        <div className={styles.container}>
            <h1> Franquias </h1>
            {loading ? <p>Carregando</p> : <pre>{JSON.stringify(franquias, null, 2)}</pre>}
        </div>
    )
}

export default Franquias