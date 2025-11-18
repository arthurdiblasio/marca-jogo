// src/hooks/useSportsCategories.ts
import { useState, useEffect } from "react";
import { showToast } from "@/hooks/useToast";
import { Category, Sport } from "@prisma/client";

export const useSportsCategories = () => {
  const [sportId, setSportId] = useState("");
  const [categoryId, setCategoryId] = useState(null as string | null);
  const [availableSports, setAvailableSports] = useState<Sport[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );

  // Efeito para buscar todos os esportes na montagem
  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch("/api/sports");
        const data = await response.json();
        if (response.ok) {
          setAvailableSports(data.sports);
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
