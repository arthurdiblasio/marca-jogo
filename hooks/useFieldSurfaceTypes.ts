import { useState, useEffect } from "react";
import { showToast } from "@/hooks/useToast";
import { FieldSurfaceTypes } from "@prisma/client";

export const useFieldSurfaceTypes = () => {
  const [fieldSurfaceTypeId, setSportId] = useState("");
  const [availableFieldTypes, setAvailableFieldTypes] = useState<
    FieldSurfaceTypes[]
  >([]);

  // Efeito para buscar todos os esportes na montagem
  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch("/api/field-types");
        const data = await response.json();
        if (response.ok) {
          setAvailableFieldTypes(data.sports);
        }
      } catch (error) {
        showToast("Falha ao carregar esportes", "error");
      }
    }
    fetchSports();
  }, []);

  // Efeito para buscar categorias quando sportId muda
  useEffect(() => {
    if (sportId) {
      async function fetchCategories() {
        try {
          const response = await fetch(`/api/categories?sportId=${sportId}`);
          const data = await response.json();
          if (response.ok) {
            console.log("Categorias carregadas:", data.categories);

            setAvailableCategories(
              data.categories.length ? data.categories : null
            );
          }
        } catch (error) {
          showToast("Falha ao carregar categorias", "error");
        }
      }
      fetchCategories();
    } else {
      setAvailableCategories([]);
      setCategoryId(null);
    }
  }, [sportId]);

  return {
    sportId,
    setSportId,
    categoryId,
    setCategoryId,
    availableSports,
    availableCategories,
  };
};
