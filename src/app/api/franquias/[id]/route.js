// Imports, sempre vai ser assim dentro de route.
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET, e precisa ter request, { params } 
export async function GET(request, { params }) {
    try {
        //Capturei o id pelo params.id, e só tive certeza que é INT
        const id = parseInt(params.id);

        //Capturei franquia, no singular.
        //Onde o id é o id que esta vindo de params
        const franquia = await prisma.franquia.findUnique({
            // Where/Onde especifica quem
            where: { id },
            //Include pega o relacionamento e os funcionarios dele.
            include: {
                funcionarios: true,
                _count: {
                    select: { funcionarios: true }
                }
            }
        })

        if (!franquia) {
            return NextResponse.json(
                { error: 'Franquia não encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json(franquia)

    } catch (error) {
        console.error('Erro ao buscar franquia: ', error)
        return NextResponse.json(
            { error: 'Erro interno de servidor' },
            { status: 500 }
        )
    }
}