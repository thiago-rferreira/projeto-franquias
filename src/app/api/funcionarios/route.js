//Importar o nextResponse da lib next/server.
import { NextResponse } from 'next/server'
//Importar o client do prisma, pois ele que permite eu utilizar os comandos/codigos
import { PrismaClient } from '@prisma/client'

//Criar uma instancia/objeto/item do prisma
const prisma = new PrismaClient()

export async function GET() {
    try {
        const funcionarios = await prisma.funcionario.findMany({
            include: {
                franquia: true // Aqui eu incluo a franquia do funcionario na resposta
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(funcionarios);

    } catch (error) {
        console.error('Erro ao buscar funcionários', error);
        return NextResponse.json(
            { error: 'Error interno de servidor!' },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const { nome, email, cargo, salario, franquiaId } = data;

        //Validacao de todos os dados sao obrigatorios

        if (!nome || !email || !cargo || !salario || !franquiaId) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios!' },
                { status: 400 }
            )
        }

        const franquiaExiste = await prisma.franquia.findUnique({
            where: { id: parseInt(franquiaId) }
        })

        if (!franquiaExiste) {
            return NextResponse.json(
                { error: 'Id da franquia não existe, verifique.' },
                { status: 404 }
            )
        }

        const emailExiste = await prisma.funcionario.findUnique({
            where: { email }
        })

        if (emailExiste) {
            return NextResponse.json(
                { error: 'Email já está em uso, tente outro!' },
                { status: 400 }
            )
        }

        const funcionario = await prisma.funcionario.create({
            data: {
                nome,
                email,
                cargo,
                salario: parseFloat(salario),
                franquiaId: parseInt(franquiaId)
            }
        })

        return NextResponse.json(funcionario, { status: 201 })

    } catch (error) {
        console.error('Erro ao criar funcionário', error);
        return NextResponse.json(
            { error: 'Error interno de servidor!' },
            { status: 500 }
        )
    }
}