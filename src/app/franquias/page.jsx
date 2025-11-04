'use client'

import React, { useState, useEffect } from 'react'
import styles from './franquias.module.css'
import { Table, Modal, Button, Form, message, Input, Space, Popconfirm, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function Franquias() {

    const [franquias, setFranquias] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [editandoId, setEditandoId] = useState(null);
    const [filtroNome, setFiltroNome] = useState('');

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
        try {
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

            const response = await fetch(url, {
                method: tipo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                setModalVisible(false)
                form.resetFields()
                setEditandoId(null)
                carregarFranquias()

                if (editandoId) {
                    toast.success('Franquia editada')
                } else {
                    toast.success('Franquia cadastrada')
                }
            } else {
                message.error('Erro ao salvar franquia!')
                toast.error('Erro ao salvar franquia!')
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

            const data = await response.json()

            if (response.ok) {
                message.success('Franquia removida')
                carregarFranquias()
                toast.success('Franquia deletada!')
            } else {
                message.error('Erro ao apagar franquia')
                toast.error(data.error)
            }
        } catch (error) {
            console.error('Erro ao apagar franquia', error)
            toast.error('Erro ao apagar franquia!')
        }
    }

    useEffect(() => {
        try {
            carregarFranquias()
            toast.success('Franquias carregadas com sucesso!')
        } catch (error) {
            toast.error('Erro ao carregar franquias')
        }
    }, [])

    const formatarTelefone = (telefone) => {
        if (!telefone) return ''

        const somenteNumeros = telefone.split('').filter(c => c >= '0' && c <= '9').join('')

        const ddd = somenteNumeros.slice(0, 2)
        const parte1 = somenteNumeros.length === 11
            ? somenteNumeros.slice(2, 7)  // celular
            : somenteNumeros.slice(2, 6)  // fixo
        const parte2 = somenteNumeros.length === 11
            ? somenteNumeros.slice(7)
            : somenteNumeros.slice(6)

        if (somenteNumeros.length < 10) return somenteNumeros

        return `(${ddd}) ${parte1}-${parte2}`
    }


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
            key: 'id',
            render: (telefone) => formatarTelefone(telefone)
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

    const franquiasFiltradas = franquias.filter(f => {
        const pesquisa = filtroNome.toLowerCase();
        return (
            f.nome.toLowerCase().includes(pesquisa) || f.cidade.toLowerCase().includes(pesquisa) ||
            f.endereco.toLowerCase().includes(pesquisa)
        )
    })

    return (
        <div className={styles.container}>
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
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder='Buscar franquia por nome ou cidade'
                    prefix={<ShopOutlined />}
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    style={{ maxWidth: 400 }}
                    allowClear
                />
            </div>
            <div className={styles.tableContainer}>
                <Table
                    columns={colunas}
                    dataSource={franquiasFiltradas}
                    loading={{
                        spinning: loading,
                        tip: 'Carregando franquias, aguarde...'
                    }}
                    rowKey="id"
                    pagination={{
                        pageSize: 15,
                        showSizeChanger: true,
                        showTotal: (total) => `Total de ${total} franquias`
                    }}
                    locale={{
                        emptyText: <Empty description="Nenhuma franquia encontrada" />
                    }}
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
                    <Form.Item name="nome" label="Digite o nome" rules={[{ required: true, message: 'Preecha o seu nome' }, { min: 3, message: 'Nome deve ter no min 3 caracteres' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="cidade" label="Digite a cidade" rules={[{ required: true, message: 'Preecha sua cidade' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="endereco" label="Digite o endereço" rules={[{ required: true, message: 'Preecha seu endereço' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="telefone" label="Digite o telefone" rules={[{ required: true, message: 'Preecha seu telefone' }, {
                        min: 10,
                        max: 11,
                        message: 'O telefone deve conter entre 10 e 11 dígitos!'
                    }]}>
                        <Input
                            maxLength={11}
                        />
                    </Form.Item>

                </Form>
            </Modal>

        </div>
    )
}

export default Franquias