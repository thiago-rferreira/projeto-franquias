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

//Editar
export async function PUT(request, { params }) {
    try {
        const id = parseInt(params.id)
        const data = await request.json()

        const { nome, email, cargo, salario, franquiaId } = data

        // Verificar se todos os campos foram passados
        if (!nome || !email || !cargo || !salario || !franquiaId) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios: nome, email, cargo, salario, franquiaId ' },
                { status: 400 } // Testar sem o status
            )
        }

        // Verificar se franquia existe usando o franquiaId
        const franquia = await prisma.franquia.findUnique({
            where: { id: parseInt(franquiaId) }
        })

        // Verifico
        if (!franquia) {
            return NextResponse.json(
                { error: 'Franquia não encontrada, verifique o id para adicionar o funcionário' },
                { status: 404 }
            )
        }

        // Verificar se o email já existe, pois os emails sao unique
        const emailExiste = await prisma.funcionario.findFirst({
            where: {
                email,
                id: { not: id }
            }
        })

        if (emailExiste) {
            return NextResponse.json(
                { error: 'Email já está em uso!' },
                { status: 400 }
            )
        }


        // fazer o update

        const funcionario = await prisma.funcionario.update({
            where: { id },
            data: {
                nome,
                email,
                cargo,
                salario: parseFloat(salario),
                franquiaId: parseInt(franquiaId)
            }
        })

        // Retorna a resposta
        return NextResponse.json({
            funcionario: funcionario,
            msg: 'Funcionario atualizado com sucesso!'
        })

        // alterar a opcao de poder editar qualquer propriedade

        // tratativa do catch


    } catch (error) {
        console.error('Erro ao atualizar funcionario')
        return NextResponse.json(
            { error: 'Erro interno de servidor', error },
            { status: 500 }
        )
    }
}