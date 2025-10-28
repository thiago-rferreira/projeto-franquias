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
                <div className={styles.loading}>
                    <p>Erro ao carregar dados da dashboard!</p>
                    <p>Tente novamente mais tarde!</p>
                </div>
            </div>
        )
    }

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


    return (
        <div className={styles.container}>
            <h1 className={styles.title}> Dashboard - B.I.
                <DashboardOutlined className={styles.titleIcon} />
            </h1>



        </div>
    )
}

export default Dashboard