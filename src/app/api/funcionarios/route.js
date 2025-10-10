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