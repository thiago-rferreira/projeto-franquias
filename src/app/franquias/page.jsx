'use client' //Pois vamos utilizar hooks

import React, { useState, useEffect } from 'react'
import styles from './franquias.module.css'
import { Table } from 'antd';

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

    // Colunas para o Table do Antd
    const colunas = [
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
        <div className={styles.container}>
            <h1 className={styles.title}> Franquias </h1>
            <div className={styles.tableContainer}>
                <Table
                    columns={colunas} // montada anteriormente
                    dataSource={franquias} // que vem da API
                    loading={{
                        spinning: loading,
                        tip: 'Carregando franquias, aguarde...'
                    }} // Controla o preenchimento da tabela
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </div>
    )
}

export default Franquias