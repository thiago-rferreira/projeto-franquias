'use client'

import React, { useState, useEffect } from 'react'
import styles from './dashboard.module.css'

import { Spin } from 'antd'

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
                    <Spin size='large' tip='Carregando...' />
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

    // Continuar o JSX e o CSS

    return (
        <div className={styles.container}>
            <h1 className={styles.title}> Dashboard - BI</h1>
        </div>
    )
}

export default Dashboard