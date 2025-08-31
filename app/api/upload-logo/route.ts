// app/api/upload-logo/route.ts

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PassThrough } from "stream";

// Configurar o Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("logo") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    // Criar um stream de leitura do arquivo
    const buffer = Buffer.from(await file.arrayBuffer());
    const passthrough = new PassThrough();
    passthrough.end(buffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader
        .upload_stream(
          { folder: "team-logos" }, // Opcional: nome da pasta no Cloudinary
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    const url = uploadResult.secure_url;

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro no upload do arquivo." },
      { status: 500 }
    );
  }
}
