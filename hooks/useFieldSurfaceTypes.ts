import { useState, useEffect } from "react";
import { showToast } from "@/hooks/useToast";
import { FieldSurfaceTypes } from "@prisma/client";

export const useFieldSurfaceTypes = () => {
  const [availableFieldTypes, setAvailableFieldTypes] = useState<
    FieldSurfaceTypes[]
  >([]);

  // Efeito para buscar todos os esportes na montagem
  useEffect(() => {
    async function fetchFieldTypes() {
      try {
        const response = await fetch("/api/field-types");
        const data = await response.json();
        if (response.ok) {
          setAvailableFieldTypes(data.fieldSurfaceTypes);
        }
      } catch (error) {
        showToast("Falha ao carregar tipos de pisos", "error");
      }
    }
    fetchFieldTypes();
  }, []);

  return {
    availableFieldTypes,
    setAvailableFieldTypes,
  };
};
