//Importar o nextResponse da lib next/server.
import { NextResponse } from 'next/server'
//Importar o client do prisma, pois ele que permite eu utilizar os comandos/codigos
import { PrismaClient } from '@prisma/client'

//Criar uma instancia/objeto/item do prisma
const prisma = new PrismaClient()

//GetById
export async function GET(request, { params }) {
    try {
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

//Delete
export async function DELETE(request, { params }) {
    try {
        //capturar o id pelo params
        const id = parseInt(params.id);

        // Verificar se existe funcionario
        const existeFuncionario = await prisma.funcionario.findUnique({
            where: { id }
        })

        // Verifico e dou uma mensagem de erro
        if (!existeFuncionario) {
            return NextResponse.json(
                { error: 'Funcionário não encontrado' },
                { status: 404 }
            )
        }

        // Realiza o delete
        await prisma.funcionario.delete({
            where: { id }
        })

        // Resposta com o funcionario que foi apagado.
        return NextResponse.json({
            apagado: existeFuncionario,
            msg: 'Funcionário apagada com sucesso'
        })

    } catch (error) {
        console.error('Erro ao deletar funcionário', error)
        return NextResponse.json(
            { error: 'Erro interno de servidor' },
            { status: 500 }
        )
    }

}