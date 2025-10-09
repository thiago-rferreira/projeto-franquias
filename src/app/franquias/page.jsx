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

    //Table do antd


    const columns = [
        {
            title: 'Nome',
            dataIndex: 'nome',
            key: 'id'
        },
        {
            title: 'Cidade',
            dataIndex: 'cidade',
            key: 'id'
        },
        {
            title: 'Endereço',
            dataIndex: 'endereco',
            key: 'id'
        },
        {
            title: 'Telefone',
            dataIndex: 'telefone',
            key: 'id'
        }
    ]

    return (
        <div>
            <h1>Tabela de Franquias</h1>
            <Table
                columns={columns}
                dataSource={franquias}
                rowKey='id'
            />
        </div>
    )
}

export default Franquias