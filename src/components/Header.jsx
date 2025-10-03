'use client'

import { Menu } from 'antd'
import { 
  HomeOutlined, 
  UserOutlined, 
  ShopOutlined, 
  DashboardOutlined 
} from '@ant-design/icons'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()

  const menuItems = [
    {
      key: '/',
      label: <Link href="/">Home</Link>,
      icon: <HomeOutlined />
    },
    {
      key: '/funcionarios',
      label: <Link href="/funcionarios">Funcionários</Link>,
      icon: <UserOutlined />
    },
    {
      key: '/franquias',
      label: <Link href="/franquias">Franquias</Link>,
      icon: <ShopOutlined />
    },
    {
      key: '/dashboard',
      label: <Link href="/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />
    }
  ]

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* Logo/Título */}
        <Link href="/" className={styles.logo}>
          <h2 className={styles.logoText}>
            Sistema de Franquias
          </h2>
        </Link>

        {/* Menu de navegação */}
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          className={styles.menu}
        />

      </div>
    </header>
  )
}