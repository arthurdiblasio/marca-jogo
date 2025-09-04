// app/api/google-places/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json(
      { error: "Parâmetro de busca ausente." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chave de API do Google não configurada." },
      { status: 500 }
    );
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}&types=address`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      return NextResponse.json(
        { predictions: data.predictions },
        { status: 200 }
      );
    } else {
      console.error("Erro na API do Google:", data.error_message);
      return NextResponse.json(
        { error: "Erro na API do Google." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    return NextResponse.json(
      { error: "Erro de rede ou interno." },
      { status: 500 }
    );
  }
}
