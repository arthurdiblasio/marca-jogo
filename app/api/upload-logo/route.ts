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
    // const files = formData.get("files");

    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    // const urls = [];

    // for (const file of files) {
    // const buffer = Buffer.from(await files.arrayBuffer());
    // const passthrough = new PassThrough();
    // passthrough.end(buffer);

    // const uploadResult = await new Promise((resolve, reject) => {
    //   cloudinary.uploader
    //     .upload_stream({ folder: "team-logos" }, (error, result) => {
    //       if (error) return reject(error);
    //       resolve(result);
    //     })
    //     .end(buffer);
    // });

    // urls.push(uploadResult.secure_url);
    // }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const passthrough = new PassThrough();
        passthrough.end(buffer);

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "team-logos" }, (error, result) => {
              if (error) return reject(error);
              resolve(result);
            })
            .end(buffer);
        });

        return result;
      })
    );

    console.log("urls =>>>", uploadResults);

    return NextResponse.json(
      { urls: uploadResults.map((res) => res.secure_url) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro no upload do arquivo." },
      { status: 500 }
    );
  }
}
