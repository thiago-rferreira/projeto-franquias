import React from 'react'
import styles from './page.module.css'
import Header from './../components/Header'

function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>Hello World!
        <p>Teste</p>
        <p>Teste 2</p>
        <p>Teste 3</p>
        <p>Teste Via Web</p>
      </div>
    </div>

  )
}

export default Home
