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
        setLoading(false)
    }

    useEffect(() => {
        carregarFranquias()
    }, [])

    return (
        <div className={styles.main}>
            <h1> Franquias </h1>
            <p>{JSON.stringify(franquias)}</p>
        </div>
    )
}

export default Franquias