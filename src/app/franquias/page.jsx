'use client'

import React from 'react'

import { useState, useEffect } from 'react';
import { Table } from 'antd';

function Franquias() {

    //Criar uma variavel para armazenar a lista de franquias
    const [franquias, setFranquias] = useState([]);

    async function carregarFranquias() {
        try {
            const response = await fetch('/api/franquias')
            const data = await response.json()
            setFranquias(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        carregarFranquias();
    }, [])



    return (
        <div>Franquias</div>
    )
}

export default Franquias