'use client'

import { Card, Row, Col } from 'antd'
import { UserOutlined, ShopOutlined, DashboardOutlined } from '@ant-design/icons'
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1 className={styles.title}>Sistema de Franquias</h1>
        <p className={styles.subtitle}>Gerencie suas franquias e funcionários</p>
      </div>

      <div className={styles.cardsContainer}>
        <Row gutter={[24, 24]} justify="center">

          <Col xs={24} sm={12} lg={8}>
            <Link href="/funcionarios">
              <Card
                className={styles.menuCard}
                hoverable
              >
                <div className={styles.cardContent}>
                  <UserOutlined className={`${styles.cardIcon} ${styles.funcionariosIcon}`} />
                  <h3 className={styles.cardTitle}>Funcionários</h3>
                  <p className={styles.cardDescription}>Gerenciar funcionários das franquias</p>
                </div>
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Link href="/franquias">
              <Card
                className={styles.menuCard}
                hoverable
              >
                <div className={styles.cardContent}>
                  <ShopOutlined className={`${styles.cardIcon} ${styles.franquiasIcon}`} />
                  <h3 className={styles.cardTitle}>Franquias</h3>
                  <p className={styles.cardDescription}>Gerenciar franquias da empresa</p>
                </div>
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Link href="/dashboard">
              <Card
                className={styles.menuCard}
                hoverable
              >
                <div className={styles.cardContent}>
                  <DashboardOutlined className={`${styles.cardIcon} ${styles.dashboardIcon}`} />
                  <h3 className={styles.cardTitle}>Dashboard</h3>
                  <p className={styles.cardDescription}>Relatórios e indicadores (B.I)</p>
                </div>
              </Card>
            </Link>
          </Col>

        </Row>
      </div>

    </div>
  )
}