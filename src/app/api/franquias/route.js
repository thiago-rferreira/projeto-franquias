//Importar o nextResponse da lib next/server.
import { NextResponse } from 'next/server'
//Importar o client do prisma, pois ele que permite eu utilizar os comandos/codigos
import { PrismaClient } from '@prisma/client'

//Criar uma instancia/objeto/item do prisma
const prisma = new PrismaClient()

//GET ALL -> Pegar todas as franquias
export async function GET() {
    try {
        // Usar o findMany() para trazer todas as franquias, e podemos fazer alteracoes, relaciomentos, ordenacoes dentro da func()
        const franquias = await prisma.franquia.findMany({
            // Include faz o relacionamento com funcionarios, pelo true.
            include: {
                funcionarios: true,
                _count: {
                    select: { funcionarios: true }
                }
            },
            // Ordena os elementos
            orderBy: {
                createdAt: 'desc'
            }
        });
        // Verificao se o array/objeto/resultado do banco esta vindo vazio, e se tiver eu passo uma mensagem apropriada
        if (franquias.length === 0) {
            return NextResponse.json(
                { error: 'Nenhuma franquia encontrada' },
                { status: 404 }
            )
        }

        //No melhor cenario, onde tudo ocorreu corretamente, eu retorno franquias para o client.
        return NextResponse.json(franquias);

    } catch (error) {
        console.log('Erro ao buscar franquias: ', error)
        return NextResponse.json(
            { error: 'Erro interno de servidor' },
            { status: 500 }
        )
    }
}

//POST -> Responsavel por criar uma franquia
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
        
    } catch (error) {
        console.error('Erro ao criar franquia:', error)
        return NextResponse.json(
            { error: 'Erro interno de servidor' },
            { status: 500 }
        )
    }
}
