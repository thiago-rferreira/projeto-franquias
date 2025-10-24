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
            //somaSalarios = somaSalarios + funcionario.salario
            somaSalarios += funcionario.salario
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

        //------------------- Agrupamento: Funcionarios por Cargo -------------------------

        const cargos = []

        funcionarios.forEach(funcionario => {
            const existe = cargos.find(c => c.cargo === funcionario.cargo)

            if (existe) {
                existe.total++
            } else {
                cargos.push({
                    cargo: funcionario.cargo,
                    total: 1
                })
            }
        })

        cargos.sort((a, b) => b.total - a.total)


        // ---------------- Agrupamento: faixa salario ------------------------
        // Até 2000; De 2001 até 4000; De 4001 até 6000; De 6001 até 8000; Acima de 8000

        //Contadores
        let ate2mil = 0
        let de2a4mil = 0
        let de4a6mil = 0
        let de6a8mil = 0
        let acima8mil = 0

        funcionarios.forEach(f => {
            if (f.salario <= 2000) {
                // ate2mil = ate2mil + 1
                ate2mil++
            } else if (f.salario <= 4000) {
                de2a4mil++
            } else if (f.salario <= 6000) {
                de4a6mil++
            } else if (f.salario <= 8000) {
                de6a8mil++
            } else {
                acima8mil++
            }
        })

        //Compor um array, para ficar bonito a info, e o front trabalhar mais facil

        const faixasSalariais = [
            { faixa: 'Até R$ 2000', quantidade: ate2mil },
            { faixa: 'R$ 2001 até 4000', quantidade: de2a4mil },
            { faixa: 'R$ 4001 até 6000', quantidade: de4a6mil },
            { faixa: 'R$ 6001 até 8000', quantidade: de6a8mil },
            { faixa: 'Acima de R$ 8000', quantidade: acima8mil }
        ]


        // ---------------- Top 5 Franquias, pela quantidade de funcionarios, exibindo tbm o salario total dessa franquia ---------------

        const todasFranquias = []

        franquias.forEach(franquia => {
            //Calcular os salarios de todos os funcionarios dessa franquia

            let salarios = 0
            let quantidade = franquia.funcionarios.length

            franquia.funcionarios.forEach(f => {
                salarios += f.salario
            })

            todasFranquias.push({
                id: franquia.id,
                nome: franquia.nome,
                cidade: franquia.cidade,
                totalFuncionarios: quantidade,
                totalSalario: salarios
            })
        })

        //Ordenar todasFranquias
        todasFranquias.sort((a, b) => b.totalFuncionarios - a.totalFuncionarios)

        const top5 = todasFranquias.slice(0, 5)

        // --------------------- 5 ultimas franquias cadastradas e 5 ultimos funcionarios cadastrados --------------------

        // Ja vem ordenado do back, só cortar os 5 primeiros
        // 5 ultimas franquias cadastradas
        const ultimas5Franquias = franquias.slice(0, 5).map(franquia => ({
            id: franquia.id,
            nome: franquia.nome,
            cidade: franquia.cidade,
            totalFuncionarios: franquia.funcionarios.length,
            createdAt: franquia.createdAt
        }))

        // Continuar na proxima aula, paramos em 5 funcionários cadastrados
        // 5 ultimos funcionarios cadastrados

        let ultimos5Funcionarios = funcionarios.slice(0, 5)

        ultimos5Funcionarios = ultimos5Funcionarios.map(funcionario => ({
            id: funcionario.id,
            nome: funcionario.nome,
            cargo: funcionario.cargo,
            franquia: funcionario.franquia?.nome || 'Sem franquia',
            createdAt: funcionario.createdAt
        }))

        // -------------------  Franquias sem funcionários -------------------
        const franquiasSemFuncionarios = []

        franquias.forEach(franquia => {
            if (franquia.funcionarios.length === 0) {
                franquiasSemFuncionarios.push({
                    id: franquia.id,
                    nome: franquia.nome,
                    cidade: franquia.cidade,
                    createdAt: franquia.createdAt
                })
            }
        })

        // ------------------- Funcionarios sem franquia -----------------

        const funcionariosSemFranquia = []

        funcionarios.forEach(funcionario => {
            if (funcionario.franquia.length === 0) {
                funcionariosSemFranquia.push({
                    id: funcionario.id,
                    nome: funcionario.nome,
                    cargo: funcionario.cargo,
                    salario: funcionario.salario,
                    createdAt: funcionario.createdAt
                })
            }
        })


        // Retorno de tudo

        const dashboard = {
            totalFranquias,
            totalFuncionarios,
            somaSalarios,
            salarioMedio,
            cidades,
            cargos,
            faixasSalariais,
            top5,
            ultimas5Franquias,
            ultimos5Funcionarios,
            franquiasSemFuncionarios,
            funcionariosSemFranquia
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