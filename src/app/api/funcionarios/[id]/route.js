//Importar o nextResponse da lib next/server.
import { NextResponse } from 'next/server'
//Importar o client do prisma, pois ele que permite eu utilizar os comandos/codigos
import { PrismaClient } from '@prisma/client'

//Criar uma instancia/objeto/item do prisma
const prisma = new PrismaClient()

//GetById
export async function GET(request, { params }) {
    try {
        // Ta errado eu sei!
        const id = parseInt(params.id);

        const funcionario = await prisma.funcionario.findUnique({
            where: { id },
            include: {
                // Selecionar dados/colunas especificos. Caso queira todos, olhar em franquias e fazer igual
                franquia: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        })

        if (!funcionario) {
            return NextResponse.json(
                { error: 'Funcionário não encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(funcionario);

    } catch (error) {
        console.error('Erro interno de servidor', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}