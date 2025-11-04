'use client'

import React, { useState, useEffect } from 'react'
import styles from './franquias.module.css'
import { Table, Modal, Button, Form, message, Input, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

function Franquias() {
    const [franquias, setFranquias] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [form] = Form.useForm()

    const [messageApi, contextHolder] = message.useMessage();

    const [editandoId, setEditandoId] = useState(null);

    async function carregarFranquias(params) {
        try {
            const response = await fetch('/api/franquias')
            const data = await response.json()
            setFranquias(data);
        } catch (error) {
            console.error('Erro ao carregar franquias', error)
        } finally {
            setLoading(false)
        }
    }

    async function salvarFranquia(values) {
        //Salvando ao adicionar e editar
        try {
            // URL da req
            // const url = editandoId ? `/api/franquias/${editandoId}` : '/api/franquias'
            let url = ''
            let tipo = ''
            let msg = ''

            if (editandoId) {
                // PUT
                url = `/api/franquias/${editandoId}`
                tipo = 'PUT'
                msg = 'Franquia atualizada com sucesso!'
            } else {
                //POST
                url = '/api/franquias'
                tipo = 'POST'
                msg = 'Franquia adicionada com sucesso!'
            }

            // Response
            const response = await fetch(url, {
                method: tipo, // editandoId ? 'PUT' : 'POST'
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                message.success(msg)
                setModalVisible(false)
                form.resetFields()
                setEditandoId(null)
                carregarFranquias()
            } else {
                message.error('Erro ao salvar franquia!')
            }

        } catch (error) {
            message.error('Erro ao salvar franquia.')
            console.error('Erro ao salvar franquia', error)
        }
    }

    function editar(franquia) {
        setEditandoId(franquia.id)
        form.setFieldsValue(franquia)
        setModalVisible(true)
    }

    async function removerFranquia(id) {
        try {
            const response = await fetch(`/api/franquias/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                message.success('Franquia removida')
                carregarFranquias()
            } else {
                message.error('Erro ao apagar franquia')
            }
        } catch (error) {
            message.error('Erro ao apagar franquia')
            console.error('Erro ao apagar franquia', error)
        }
    }

    useEffect(() => {
        carregarFranquias()
    }, [])

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
        },
        {
            title: 'Ações',
            key: 'acoes',
            render: (_, franquia) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size='small'
                        onClick={() => editar(franquia)}
                    />
                    <Popconfirm
                        title='Confirma remover?'
                        onConfirm={() => removerFranquia(franquia.id)}
                        okText="Sim"
                        cancelText="Não"
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

    const showModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false)
        form.resetFields()
        setEditandoId(null)
    }

    const okModal = () => {
        form.submit()
    }

    return (
        <div className={styles.container}>
            {contextHolder}
            <div className={styles.top}>
                <h1 className={styles.title}> Franquias </h1>
                <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    className={styles.addButton}
                >
                    Adicionar
                </Button>
            </div>
            <div className={styles.tableContainer}>
                <Table
                    columns={colunas}
                    dataSource={franquias}
                    loading={{
                        spinning: loading,
                        tip: 'Carregando franquias, aguarde...'
                    }}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </div>

            <Modal
                title={editandoId ? 'Editar Franquia' : 'Adicionar Franquia'}
                open={modalVisible}
                onCancel={closeModal}
                onOk={okModal}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={salvarFranquia}
                    className={styles.modalForm}
                >
                    <Form.Item name="nome" label="Digite o nome" rules={[{ required: true, message: 'Preecha o seu nome' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="cidade" label="Digite a cidade" rules={[{ required: true, message: 'Preecha sua cidade' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="endereco" label="Digite o endereço" rules={[{ required: true, message: 'Preecha seu endereço' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="telefone" label="Digite o telefone" rules={[{ required: true, message: 'Preecha seu telefone' }]}>
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>

        </div>
    )
}

export default Franquias