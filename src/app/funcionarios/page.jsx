'use client'

import React, { useEffect, useState } from 'react'
import styles from './funcionarios.module.css'
import { Table, Button, Form, Input, InputNumber, Space, Popconfirm, Select, Empty } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Funcionarios() {

    const [franquias, setFranquias] = useState([])
    const [funcionarios, setFuncionarios] = useState([])
    const [loading, setLoading] = useState(true)
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

    async function salvarFuncionario(values) {
        try {
            const url = editandoId ? `/api/funcionarios/${editandoId}` : '/api/funcionarios'
            const response = await fetch(url, {
                method: editandoId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                form.resetFields()
                setEditandoId(null)
                carregarFuncionarios()
                toast.success(editandoId ? 'Funcionário editado' : 'Funcionário cadastrado')
            } else {
                toast.error(editandoId ? 'Erro ao editar funcionário' : 'Erro ao cadastrar funcionário')
            }
        } catch (error) {
            console.error('Erro na funcao de salvar funcionario', error)
        }
    }

    async function removerFuncionario(id) {
        try {
            const response = await fetch(`/api/funcionarios/${id}`, { method: 'DELETE' })
            if (response.ok) {
                carregarFuncionarios();
                toast.success('Funcionário removido')
            } else toast.error('Erro ao remover funcionário')
        } catch (error) {
            console.error('Erro ao remover funcionario', error)
        }
    }

    function editar(funcionario) {
        setEditandoId(funcionario.id)
        form.setFieldsValue(funcionario)
    }

    const colunas = [
        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
        { title: 'E-mail', dataIndex: 'email', key: 'email' },
        { title: 'Cargo', dataIndex: 'cargo', key: 'cargo' },
        {
            title: 'Salário',
            dataIndex: 'salario',
            key: 'salario',
            render: (v) => v ? `R$${v}` : 'R$ 0,00'
        },
        {
            title: 'Franquia',
            dataIndex: ['franquia', 'nome'],
            key: 'franquia',
            render: (n) => n ?? 'Sem franquia'
        },
        {
            title: 'Ações',
            key: 'acoes',
            render: (_, f) => (
                <Space>
                    <Button icon={<EditOutlined />} size='small' onClick={() => editar(f)} />
                    <Popconfirm
                        title='Confirma remover?'
                        okText="Sim"
                        cancelText="Não"
                        onConfirm={() => removerFuncionario(f.id)}
                    >
                        <Button icon={<DeleteOutlined />} size='small' danger />
                    </Popconfirm>
                </Space>
            )
        }
    ]

    useEffect(() => {
        carregarFuncionarios()
        carregarFranquias()
    }, [])

    const funcionariosFiltrados = funcionarios.filter(f => {
        const p = filtroNome.toLowerCase()
        return f.nome.toLowerCase().includes(p) || f.cargo.toLowerCase().includes(p) || f.email.toLowerCase().includes(p)
    })

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Funcionários</h1>

            <Form form={form} layout='inline' onFinish={salvarFuncionario} style={{ marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <Form.Item name='nome' rules={[{ required: true, message: 'Campo obrigatório' }]}>
                    <Input placeholder='Nome' />
                </Form.Item>
                <Form.Item name='email' rules={[{ required: true, message: 'Campo obrigatório' }]}>
                    <Input placeholder='E-mail' />
                </Form.Item>
                <Form.Item name='cargo' rules={[{ required: true, message: 'Campo obrigatório' }]}>
                    <Input placeholder='Cargo' />
                </Form.Item>
                <Form.Item name='salario' rules={[{ required: true, message: 'Campo obrigatório' }]}>
                    <InputNumber placeholder='Salário' min={0} style={{ width: 120 }} />
                </Form.Item>
                <Form.Item name='franquiaId' rules={[{ required: true, message: 'Campo obrigatório' }]}>
                    <Select placeholder='Franquia' style={{ width: 150 }}>
                        {franquias.map(f => (
                            <Select.Option key={f.id} value={f.id}>{f.nome}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' icon={<PlusOutlined />}>
                        {editandoId ? 'Salvar' : 'Adicionar'}
                    </Button>
                </Form.Item>
            </Form>

            <Input
                placeholder='Buscar por funcionário'
                prefix={<UserOutlined />}
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                allowClear
                style={{ maxWidth: 400, marginBottom: 16 }}
            />

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
                locale={{ emptyText: <Empty description="Nenhum funcionário encontrado" /> }}
            />
        </div>
    )
}

export default Funcionarios
