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

        //------------ Total de franquias e funcionarios -------------

        // O .length retorna o tamanho do array/objeto sempre
        const totalFranquias = franquias.length
        const totalFuncionarios = funcionarios.length

        // --------------- Somas dos Salarios ---------------

        //Variavel auxiliar
        let somaSalarios = 0; // Sempre começar soma com 0

        //Vamos fazer um loop que percorre funcionarios, e soma o salario de cada um
        //nessa variavel somaSalarios.

        funcionarios.forEach(funcionario => {
            console.log(somaSalarios)
            somaSalarios = somaSalarios + funcionario.salario
        })

        // ------------------- Média dos salarios ---------------

        // CUIDADO: Pegadinha em entrevistas.
        const salarioMedio = totalFuncionarios > 0 ? somaSalarios / totalFuncionarios : 0


        // Retorno de tudo

        const dashboard = {
            totalFranquias,
            totalFuncionarios,
            somaSalarios: somaSalarios,
            salarioMedio: salarioMedio
        }

        return NextResponse.json(dashboard)

    } catch (error) {
        console.error('Erro ao buscar dados para a dashboard', error)
        return NextResponse.json(
            { error: 'Erro interno de servidor' },
            { status: 500 }
        )
    }
}