'use client' //Pois vamos utilizar hooks

import React, { useState, useEffect } from 'react'
import styles from './franquias.module.css'
import { Table, Modal, Button, Form, message, Input, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

function Franquias() {
    // Estado que gerencia franquias
    const [franquias, setFranquias] = useState([])
    // Estado que controla o loading
    const [loading, setLoading] = useState(true)
    // Estado que contrala a exibicao do modal
    const [modalVisible, setModalVisible] = useState(false)
    // Criar uma instancia para usar o form
    const [form] = Form.useForm()

    const [messageApi, contextHolder] = message.useMessage();

    // Estado que controla se eu estou editando ou nao
    const [editandoId, setEditandoId] = useState(null);

    // Funcao que é responsavel por trazer os dados de franquia
    async function carregarFranquias(params) {
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

    // Funcao que é responsavel por salvar a franquia
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

    // funcao de controle editar
    function editar(franquia) {
        setEditandoId(franquia.id)
        form.setFieldsValue(franquia)
        setModalVisible(true)
    }

    // Remover
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
                    //On click deeepois
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
                        //OnClick depois
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