'use client'

import React, { useEffect, useState } from 'react'
import styles from './funcionarios.module.css'
import { Table, Modal, Button, Form, message, Input, Space, Popconfirm, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'


function Funcionarios() {

    //Estados

    //Fraquias, para usar no SELECT
    const [franquias, setFranquias] = useState([])

    //Funcionarios, para usar na tabela
    const [funcionarios, setFuncionarios] = useState([])

    //Loading para controlar o carregamento da tabela
    const [loading, setLoading] = useState(true)

    //Modal que vai controlar se a tela de cadastro esta aberta ou fechada
    const [modalVisible, setModalVisible] = useState(false)

    //Hook do Antd que controla o form
    const [form] = Form.useForm()


    // Criar uma funcao que carrega as funcionarios para mim da API/Banco
    async function carregarFuncionarios() {
        try {
            setLoading(true) // Ativa o spinner do carregamento

            //Fazer a req
            const response = await fetch('/api/funcionarios')
            const data = await response.json()
            setFuncionarios(data)

            setLoading(false) // Desativa
        } catch (error) {
            console.error('Erro ao carregar funcionarios', error)
        } finally {

        }
    }

    // Criar uma funcao que carrega as franquias para ser utilizada no Select
    async function carregarFranquias() {
        try {
            const response = await fetch('/api/franquias')
            const data = await response.json()
            setFranquias(data)
        } catch (error) {
            console.error('Erro ao carregar franquias')
        }
    }

    // Salvar funcionarios
    const colunas = [
        {
            title: 'Nome',
            dataIndex: 'nome',
            key: 'nome'
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            key: 'cargo'
        },
        {
            title: 'Salário',
            dataIndex: 'salario',
            key: 'salario',
            render: (valor) => valor ? `R$${valor}` : 'R$ 0,00'
        },
        {
            title: 'Franquia',
            dataIndex: ['franquia', 'nome'], // acessar franquia.nome dentro o obj
            key: 'franquia',
            render: (nome) => nome ?? 'Sem franquia'

        }
    ]

    // Carregar os dados usando o useEffect
    useEffect(() => {
        carregarFuncionarios()
        carregarFranquias()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <h1 className={styles.title}> Funcionarios </h1>
            </div>

            <div className={styles.tableContainer}>
                <Table
                    columns={colunas}
                    dataSource={funcionarios}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 15 }}
                />
            </div>
        </div>
    )
}

export default Funcionarios