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

        // ------------------- Agrupamento: Franquias por cidade -------------------
        // { cidade: "Salvador", total: 2 }[...]

        const cidades = [] // Array para guardar o resultado
        // { cidade: "Salvador", total: 1 }, { cidade: "Campinas", total: 1}

        franquias.forEach(franquia => {
            // O .find procura dentro de cidades(array que criamos) e retorna para gente o objeto que ele acha ou undefined se nao achar
            const existe = cidades.find(c => c.cidade === franquia.cidade)

            // Decidir o que fazer 
            if (existe) {
                // O existe carrega para gente um objeto
                // { cidade: "Campinas", total: 5 }
                existe.total++ // Adicionar +1 em total, no ex ficaria { cidade: "Campinas", total: 6 }
            } else {
                // Se nao existe, cria um novo objeto dentro de cidades
                cidades.push({
                    cidade: franquia.cidade,
                    total: 1
                })
            }
        })

        // Ordenar do maior para o maior para o menor
        cidades.sort((a, b) => b.total - a.total)

        /*
         Como fazer pela query

        const cidades = await prisma.franquia.groupBy({
        by: ['cidade'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
    })

       Resposta -> [{ cidade: 'São Paulo', _count: { id: 15 } }, ...]

        const resultado = cidades.map(c => ({
        cidade: c.cidade,
        total: c._count.id
    }))
        */


        // Retorno de tudo

        const dashboard = {
            totalFranquias,
            totalFuncionarios,
            somaSalarios,
            salarioMedio,
            cidades
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