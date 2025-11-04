'use client'

import React, { useEffect, useState } from 'react'
import styles from './funcionarios.module.css'
import { Table, Modal, Button, Form, Input, InputNumber, Space, Popconfirm, Select, Empty } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Funcionarios() {

    const [franquias, setFranquias] = useState([])
    const [funcionarios, setFuncionarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [editandoId, setEditandoId] = useState(null)
    const [form] = Form.useForm()
    const [filtroNome, setFiltroNome] = useState('')

    async function carregarFuncionarios() {
        try {
            setLoading(true)
            const response = await fetch('/api/funcionarios')
            const data = await response.json()
            setFuncionarios(data)
        } catch (error) {
            console.error('Erro ao carregar funcionarios', error)
            toast.error('Erro ao carregar funcionários');
        } finally {
            setLoading(false)
        }
    }

    async function carregarFranquias() {
        try {
            const response = await fetch('/api/franquias')
            const data = await response.json()
            setFranquias(data)
        } catch (error) {
            console.error('Erro ao carregar franquias')
            toast.error('Erro ao carregar franquias')
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

    async function salvarFuncionario(values) {
        try {
            const url = editandoId ? `/api/funcionarios/${editandoId}` : '/api/funcionarios'
            const response = await fetch(url, {
                method: editandoId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                setModalVisible(false)
                form.resetFields()
                setEditandoId(null)
                carregarFuncionarios()

                if (editandoId) {
                    toast.success('Funcionário editado')
                } else {
                    toast.success('Funcionário cadastrado')
                }

            } else {
                if (editandoId) {
                    console.error('Erro ao editar funcionario')
                    toast.error('Erro ao editar funcionário')
                } else {
                    console.error('Erro ao cadastrar funcionario')
                    toast.error('Erro ao cadastrar funcionário')
                }
            }
        } catch (error) {
            console.error('Erro na funcao de salvar funcionario', error)
        }

    }

    async function removerFuncionario(id) {
        try {
            const response = await fetch(`/api/funcionarios/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                carregarFuncionarios();
                toast.success('Funcionário removido')
            } else {
                console.error('Erro ao remover funcionario')
                toast.error('Erro ao remover funcionario')
            }
        } catch (error) {
            console.error('Erro ao remover funcionario', error)
        }
    }

    function editar(funcionario) {
        setEditandoId(funcionario.id)
        form.setFieldsValue(funcionario)
        setModalVisible(true)
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
            dataIndex: ['franquia', 'nome'],
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

    useEffect(() => {
        try {
            carregarFuncionarios()
            carregarFranquias()
            toast.success('Funcionários carregados com sucesso!')
        } catch (error) {
            toast.error('Erro ao carregar funcionários e franquias!')
        }
    }, [])

    const funcionariosFiltrados = funcionarios.filter(f => {
        const pesquisa = filtroNome.toLowerCase()
        return (
            f.nome.toLowerCase().includes(pesquisa) ||
            f.cargo.toLowerCase().includes(pesquisa) ||
            f.email.toLowerCase().includes(pesquisa)
        )
    });

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
                    placeholder='Buscar por funcionário'
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
                    pagination={{
                        pageSize: 15,
                        showSizeChanger: true,
                        showTotal: (total) => `Total de ${total} funcionários`
                    }}
                    locale={{
                        emptyText: <Empty description="Nenhum funcionário encontrado" />
                    }}
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
                        rules={[{ required: true, message: 'Campo obrigatório' }, { min: 3, message: 'Nome deve ter no mínimo 3 caracteres' }]}
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
                        rules={[{ required: true, message: 'Campo obrigatório' }, { min: 3, message: 'Cargo deve ter no mínimo 3 caracteres' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='salario'
                        label='Salário'
                        rules={[{ required: true, message: 'Campo obrigatório' }, {
                            type: 'number',
                            min: 100,
                            message: 'Salário deve ser maior que 100'
                        }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            step={100}
                            prefix='R$'
                            min={0}
                            precision={2}
                            decimalSeparator=','
                            placeholder='0,00'
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