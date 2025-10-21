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


    // Carregar os dados usando o useEffect
    useEffect(() => {
        carregarFuncionarios()
        carregarFranquias()
    }, [])

    return (
        <div>Funcionarios</div>
    )
}

export default Funcionarios