'use client' //Pois vamos utilizar hooks

import React, { useState, useEffect } from 'react'
import styles from './franquias.module.css'
import { Table, Modal, Button, Form, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

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

    // Funcao que é responsavel por salvar a franquia
    async function salvarFranquia(values) {
        try {
            const response = await fetch('/api/franquias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                messageApi.success('Franquia criada com sucesso!')
                setModalVisible(false)
                form.resetFields()
                carregarFranquias()
            } else {
                messageApi.error('Erro ao salvar franquia')
            }
        } catch (error) {
            messageApi.error('Erro ao salvar franquia')
            console.error('Erro ao salvar franquia', error)
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

    const showModal = () => {
        setModalVisible(true);

    };

    const closeModal = () => {
        setModalVisible(false)
        form.resetFields()
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
                title="Nova Franquia"
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