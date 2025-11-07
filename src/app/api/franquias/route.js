//Importar o nextResponse da lib next/server.
import { NextResponse } from 'next/server'
//Importar o client do prisma, pois ele que permite eu utilizar os comandos/codigos
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const franquias = await prisma.franquia.findMany({
            include: {
                funcionarios: true,
                _count: {
                    select: { funcionarios: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (franquias.length === 0) {
            return NextResponse.json(
                { error: 'Nenhuma franquia encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json(franquias);

    } catch (error) {
        console.log('Erro ao buscar franquias: ', error)
        return NextResponse.json(
            { error: 'Erro interno de servidor' },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        const { nome, cidade, endereco, telefone } = data;

        if (!nome) {
            return NextResponse.json(
                { error: 'O campo nome é obrigatório.' },
                { status: 400 }
            )
        }

        if (!cidade) {
            return NextResponse.json(
                { error: 'O campo cidade é obrigatório.' },
                { status: 400 }
            )
        }

        if (!endereco) {
            return NextResponse.json(
                { error: 'O campo endereço é obrigatório.' },
                { status: 400 }
            )
        }

        if (!telefone) {
            return NextResponse.json(
                { error: 'O campo telefone é obrigatório.' },
                { status: 400 }
            )
        }

        const franquia = await prisma.franquia.create({
            data: {
                nome,
                cidade,
                endereco,
                telefone
            }
        })

        return NextResponse.json(franquia, { status: 201 })

    } catch (error) {
        console.error('Erro ao criar franquia:', error)
        return NextResponse.json(
            { error: 'Erro interno de servidor' },
            { status: 500 }
        )
    }
}
