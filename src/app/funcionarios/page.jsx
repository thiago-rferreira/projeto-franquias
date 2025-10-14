'use client'

import React, { useState, useEffect } from 'react'
import { Table } from 'antd'

function Funcionarios() {

    //criar uma variavel que armazena funcionarios, usando estado/state
    const [funcionarios, setFuncionarios] = useState([])

    //criar uma funcao que carrega dos dados da API
    async function carregarFuncionarios() {
        try {
            const response = await fetch('/api/funcionarios') // faz a requisicao
            const data = await response.json() // convertidos em JSON
            setFuncionarios(data)
        } catch (error) {
            console.error('Erro ao carregar funcionarios', error)
        }
    }

    // Useeffect, é realizado quando a pagina é montada.
    useEffect(() => {
        carregarFuncionarios();
    }, [])

    //Table, a configuracao das colunas

    const colunas = [
        {
            title: 'Nome', // Nome da coluna
            dataIndex: 'nome', // campo que vai vir do resultado da API,
            key: 'id' // identificador
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'id'
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            key: 'id'
        },
        {
            title: 'Salário',
            dataIndex: 'salario',
            key: 'id'
        },
        {
            title: 'Franquia',
            dataIndex: ['franquia', 'nome'],
            key: 'id'
        }
    ]

    return (
        <div>
            <h1>Funcionários</h1>
            <Table
                columns={colunas}
                dataSource={funcionarios}
                rowKey="id"
            />
        </div>
    )
}

export default Funcionarios