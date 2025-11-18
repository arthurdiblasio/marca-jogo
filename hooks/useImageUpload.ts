// src/hooks/useImageUpload.ts
import { useState, useCallback } from "react";
import { showToast } from "@/hooks/useToast";

/**
 * Hook para gerenciar seleção, preview e upload de múltiplos arquivos.
 * @param maxFiles Número máximo de arquivos permitidos.
 * @returns {files, previews, addFiles, removeFile, uploadFiles, resetFiles}
 */
export const useImageUpload = (maxFiles: number) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Adiciona arquivos
  const addFiles = useCallback(
    (newFiles: File[]) => {
      const remainingSlots = maxFiles - files.length;
      if (remainingSlots <= 0) {
        showToast(`Você já atingiu o limite de ${maxFiles} fotos.`, "error");
        return;
      }

      const filesToAdd = newFiles.slice(0, remainingSlots);
      if (newFiles.length > remainingSlots) {
        showToast(
          `Você selecionou ${newFiles.length} fotos, mas só ${remainingSlots} foram adicionadas (limite de ${maxFiles}).`,
          "info"
        );
      }

      const newPreviewUrls = filesToAdd.map((file) =>
        URL.createObjectURL(file)
      );

      setFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
      setPreviews((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    },
    [files.length, maxFiles]
  );

  // Remove arquivo e revoga a URL de preview
  const removeFile = useCallback(
    (indexToRemove: number) => {
      const urlToRemove = previews[indexToRemove];
      if (urlToRemove) {
        URL.revokeObjectURL(urlToRemove);
      }

      setFiles((prevFiles) =>
        prevFiles.filter((_, index) => index !== indexToRemove)
      );
      setPreviews((prevUrls) =>
        prevUrls.filter((_, index) => index !== indexToRemove)
      );
    },
    [previews]
  );

  // Limpa todos os estados e revoga URLs
  const resetFiles = useCallback(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
  }, [previews]);

  const setInitialUrls = (urls: string[]) => {
    // coloca as URLs nas previews e limpa os arquivos
    setPreviews(urls);
    setFiles([]);
  };

  // Função de upload para a API de múltiplos arquivos
  const uploadFiles = useCallback(async (): Promise<string[] | null> => {
    if (files.length === 0) return [];

    const formData = new FormData();
    files.forEach((file) => {
      // Usando 'files' como chave, como na função original 'handleFilesUpload'
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/upload-image", {
        // Mantendo a rota original
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro no upload das imagens.");
      }

      // Limpa previews após upload bem-sucedido
      resetFiles();
      return data.urls;
    } catch (err) {
      showToast("Erro ao fazer upload das imagens.", "error");
      console.error("Erro no upload:", err);
      return null;
    }
  }, [files, resetFiles]);

  return {
    files,
    previews,
    addFiles,
    removeFile,
    uploadFiles,
    resetFiles,
    setInitialUrls,
  };
};
