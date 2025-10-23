import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { message } from 'antd'

const prisma = new PrismaClient()

export async function GET() {
    try {

        //---------- Trazer todos os dados do banco, para usar --------------

        const franquias = await prisma.franquia.findMany({
            include: {
                funcionarios: true // Traz os funcionarios
            },
            orderBy: {
                createdAt: 'desc' // Os mais recentes primeiros
            }
        })

        const funcionarios = await prisma.funcionario.findMany({
            include: {
                franquia: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        //------------ Total -------------

        // O .length retorna o tamanho do array/objeto sempre
        const totalFranquias = franquias.length
        const totalFuncionarios = funcionarios.length








        // Retorno de tudo

        const dashboard = {
            totalFranquias,
            totalFuncionarios
        }

        return NextResponse.json(
            dashboard
        )

    } catch (error) {
        console.error('Erro ao buscar dados para a dashboard', error)
        return NextResponse.json(
            { error: 'Erro interno de servidor' },
            { status: 500 }
        )
    }
}