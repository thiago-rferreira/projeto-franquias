'use client'

import React, { useState, useEffect } from 'react'
import styles from './dashboard.module.css'

import { Card, Row, Col, Table, Statistic, Spin, message, Alert } from 'antd'

import {
    DashboardOutlined,
    ShopOutlined,
    UserOutlined,
    DollarOutlined,
    WalletOutlined,
    WarningOutlined
} from '@ant-design/icons'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts'
import { Key } from 'lucide-react'


function Dashboard() {
    const [loading, setLoading] = useState(true)

    const [dashboardData, setDashboardData] = useState(null)

    async function carregarDashboard() {
        try {
            setLoading(true) // Quando eu começo a requisicao eu preciso deixar o loading exibindo carregando

            const response = await fetch('/api/dashboard')

            if (!response.ok) {
                console.error('Erro ao carregar dados, not ok.')
                throw new Error('Erro ao carregar dashboard')
            }

            const data = await response.json()

            setDashboardData(data)

        } catch (error) {
            console.error('Erro ao carregar dados da dashboard', error)
        } finally {
            setLoading(false) // Quando termina vira falso - a req
        }
    }

    useEffect(() => {
        carregarDashboard()
    }, [])


    const colunasTopFranquias = [
        {
            title: 'Franquia',
            dataIndex: 'nome',
            key: 'nome'
        },
        {
            title: 'Cidade',
            dataIndex: 'cidade',
            key: 'cidade'
        },
        {
            title: 'Funcionários',
            dataIndex: 'totalFuncionarios',
            key: 'totalFuncionarios'
        },
        {
            title: 'Folha salarial',
            dataIndex: 'totalSalario',
            key: 'totalSalario'
        }
    ]

    const colunasUltimasFranquias = [
        {
            title: 'Franquia',
            dataIndex: 'nome',
            key: 'nome'
        },
        {
            title: 'Cidade',
            dataIndex: 'cidade',
            key: 'cidade'
        },
        {
            title: 'Cadastrada em',
            dataIndex: 'createdAt',
            key: 'createdAt'
        }
    ]

    const colunasUltimosFuncionarios = [
        {
            title: 'Funcionario',
            dataIndex: 'nome',
            key: 'nome'
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            key: 'cargo'
        },
        {
            title: 'Franquia',
            dataIndex: 'franquia',
            key: 'franquia'
        }
    ]

    const colunasFranquiasSemFuncionario = [
        {
            title: 'Franquia',
            dataIndex: 'nome',
            key: 'nome'
        },
        {
            title: 'Cidade',
            dataIndex: 'cidade',
            key: 'cidade'
        },
        {
            title: 'Criado em...',
            dataIndex: 'createdAt',
            key: 'createdAt'
        }

    ]

    const colunasFuncionariosSemFranquia = [
        {
            title: 'Funcionario',
            dataIndex: 'nome',
            key: 'nome'
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            key: 'cargo'
        }
    ]

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Spin size='large' />
                    <p>Carregando...</p>
                </div>
            </div>
        )
    }

    if (!dashboardData) {
        return (
            <div className={styles.container}>
                <Alert
                    message='Erro ao carregar dados!'
                    description='Não foi possível carregar as informações da dashboard'
                    type='error'
                    showIcon
                />
            </div>
        )
    }




    return (
        <div className={styles.container}>
            <h1 className={styles.title}> Dashboard - B.I.
                <DashboardOutlined className={styles.titleIcon} />
            </h1>

            <Row gutter={[16, 16]} className={styles.statsRow}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className={styles.statCard}>
                        <Statistic
                            title='Total de franquias'
                            value={dashboardData.totalFranquias}
                            valueStyle={{ color: '#667eea' }}
                            prefix={<ShopOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className={styles.statCard}>
                        <Statistic
                            title='Total de Funcionários'
                            value={dashboardData.totalFuncionarios}
                            valueStyle={{ color: '#764ba2' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className={styles.statCard}>
                        <Statistic
                            title='Folha Salarial Total'
                            value={dashboardData.somaSalarios}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<DollarOutlined />}
                            formatter={(valor) => `R$ ${valor.toLocaleString('pt-BR')}`}
                        />
                    </Card>
                </Col>


                <Col xs={24} sm={12} lg={6}>
                    <Card className={styles.statCard}>
                        <Statistic
                            title='Salário Médio'
                            value={dashboardData.salarioMedio.toFixed(2)}
                            formatter={(valor) => `R$ ${valor.toLocaleString('pt-BR')}`}
                            prefix={<WalletOutlined />}
                            valueStyle={{ color: '#f5576c' }}
                        />
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default Dashboard