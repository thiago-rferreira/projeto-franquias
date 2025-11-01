'use client'

import React, { useEffect, useState } from 'react'
import styles from './funcionarios.module.css'
import { Table, Modal, Button, Form, message, Input, InputNumber, Space, Popconfirm, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'


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

    //Editando para controlar se é edit ou criar
    const [editandoId, setEditandoId] = useState(null)

    //Hook do Antd que controla o form
    const [form] = Form.useForm()

    // Estado para o filtro de buscar
    const [filtroNome, setFiltroNome] = useState('')


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

    const showModal = () => {
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false)
        form.resetFields()
        setEditandoId(null)
    }

    const okModal = () => {
        form.submit()
    }

    // Salvar funcionarios

    async function salvarFuncionario(values) {

        try {
            const url = editandoId ? `/api/funcionarios/${editandoId}` : '/api/funcionarios'

            const response = await fetch(url, {
                method: editandoId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            console.log(response)

            if (response.ok) {
                setModalVisible(false)
                form.resetFields()
                setEditandoId(null)
                carregarFuncionarios()
            } else {
                console.error('Erro ao cadastrar funcionario')
            }

        } catch (error) {
            console.error('Erro ao salvar funcionario', error)
        }

    }

    async function removerFuncionario(id) {
        try {
            const response = await fetch(`/api/funcionarios/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                //Deu certo!
                carregarFuncionarios();
            } else {
                console.error('Erro ao remover funcionario')
            }
        } catch (error) {
            console.error('Erro ao remover funcionario', error)
        }
    }

    function editar(funcionario) {
        setEditandoId(funcionario.id)
        form.setFieldsValue(funcionario)
        setModalVisible(true)

        console.log(funcionario)
    }

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

        },
        {
            title: 'Ações',
            key: 'acoes',
            render: (_, funcionario) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size='small'
                        onClick={() => editar(funcionario)}
                    />
                    <Popconfirm
                        title='Confirma remover?'
                        okText="Sim"
                        cancelText="Não"
                        onConfirm={() => removerFuncionario(funcionario.id)}
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            size='small'
                            danger
                        />
                    </Popconfirm>

                </Space>

            )
        }
    ]

    // Carregar os dados usando o useEffect
    useEffect(() => {
        carregarFuncionarios()
        carregarFranquias()
    }, [])

    //Lista nova para mim, com os itens filtrados
    const funcionariosFiltrados = funcionarios.filter(funcionario => funcionario.nome.toLowerCase().includes(filtroNome.toLowerCase()));


    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <h1 className={styles.title}> Funcionarios </h1>
                <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    className={styles.addButton}
                    onClick={showModal}
                >
                    Adicionar
                </Button>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder='Buscar por nome'
                    prefix={<UserOutlined />}
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    allowClear
                    style={{ maxWidth: 400 }}
                />
            </div>

            <div className={styles.tableContainer}>
                <Table
                    columns={colunas}
                    dataSource={funcionariosFiltrados}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 15 }}
                />
            </div>

            <Modal
                title={editandoId ? 'Editar funcionário' : 'Adicionar funcionário'}
                open={modalVisible}
                onCancel={closeModal}
                onOk={okModal}
                maskClosable={false}
                keyboard={false}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={salvarFuncionario}
                >

                    <Form.Item
                        name='nome'
                        label='Nome'
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='email'
                        label='E-mail'
                        rules={[
                            { required: true, message: 'Campo obrigatório' },
                            { type: 'email', message: 'Email inválido' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='cargo'
                        label='Cargo'
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='salario'
                        label='Salário'
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            step={100}
                            prefix='R$'
                            min={0}
                            precision={2}
                            decimalSeparator=','
                        />
                    </Form.Item>

                    <Form.Item
                        name='franquiaId'
                        label='Franquia'
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                        <Select
                            placeholder='Selecione uma franquia'
                            showSearch
                            optionFilterProp='children'
                        >
                            {franquias.map(franquia => (
                                <Select.Option key={franquia.id} value={franquia.id}>
                                    {franquia.nome}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Funcionarios