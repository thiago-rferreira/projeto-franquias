// Imports, sempre vai ser assim dentro de route.
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { message } from "antd";

const prisma = new PrismaClient();

// GetById, e precisa ter request, { params } 
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
                //count é o total
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

export async function DELETE(request, { params }) {
    try {
        const id = parseInt(params.id);

        //Verificar se existe
        const franquia = await prisma.franquia.findUnique({
            where: { id },
            include: {
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

        //Verificar se há dependencias com funcionarios

        if (franquia._count.funcionarios > 0) {
            return NextResponse.json(
                { error: 'Não é possivel deletar franquia com funcionários ativos!' },
                { status: 400 }
            )
        }

        await prisma.franquia.delete({
            where: { id }
        })

        return NextResponse.json({
            apagado: franquia,
            msg: 'Franquia apagada com sucesso'
        })

    } catch (error) {
        console.error('Erro ao deletar franquia', error)
        return NextResponse.json(
            { error: 'Erro interno de servidor' },
            { status: 500 }
        )
    }
}