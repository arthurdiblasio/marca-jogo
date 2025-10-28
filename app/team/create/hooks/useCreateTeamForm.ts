// src/hooks/useCreateTeamForm.ts
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/hooks/useToast";
import { useSportsCategories } from "./useSportsCategories";
import { useGooglePlaces } from "../../../../hooks/useGooglePlaces";
import { useImageUpload } from "../../../../hooks/useImageUpload";

export const useCreateTeamForm = () => {
  const router = useRouter();
  const {
    sportId,
    setSportId,
    categoryId,
    setCategoryId,
    availableSports,
    availableCategories,
  } = useSportsCategories();

  // Hook para a Logo (apenas 1 arquivo)
  const {
    files: logoFiles,
    previews: logoPreviewUrls,
    addFiles: addLogoFile,
    uploadFiles: uploadLogoFile,
    resetFiles: resetLogoFile,
  } = useImageUpload(1);
  const logoFile = logoFiles[0] || null;
  const logoPreviewUrl = logoPreviewUrls[0] || null;

  // Hook para Imagens do Campo (máximo 5 arquivos)
  const {
    files: fieldImageFiles,
    previews: fieldImagePreviewUrls,
    addFiles: addFieldImageFiles,
    removeFile: removeFieldImage,
    uploadFiles: uploadFieldImageFiles,
    resetFiles: resetFieldImageFiles,
  } = useImageUpload(5);

  const [loading, setLoading] = useState(false);

  // Informações do Time
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [foundedAt, setFoundedAt] = useState("");
  const [history, setHistory] = useState("");

  // Tipo de Endereço e Lógica de Endereço
  const [addressType, setAddressType] = useState<"field" | "team">("team");
  const isFieldAddress = addressType === "field";

  const teamLocation = useGooglePlaces(); // Para endereço do Time
  const fieldLocation = useGooglePlaces(); // Para endereço do Campo

  // Informações do Campo/Quadra
  const [fieldName, setFieldName] = useState("");
  const [floorType, setFloorType] = useState("");
  const [hasLockerRoom, setHasLockerRoom] = useState("no");
  const [hasDrinkingFountain, setHasDrinkingFountain] = useState("no");
  const [hasGrandstand, setHasGrandstand] = useState("no");
  const [fieldObs, setFieldObs] = useState("");

  // Lista de anos para o select
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const yearsList = [];
    for (let year = currentYear; year >= startYear; year--) {
      yearsList.push(year);
    }
    return yearsList;
  }, []);

  // Handler para trocar o tipo de endereço
  const handleAddressTypeChange = (type: "field" | "team") => {
    setAddressType(type);

    // Reset dos campos de endereço e campo/quadra
    teamLocation.resetLocation();
    fieldLocation.resetLocation();
    setFieldName("");
    setFloorType("");
    setHasLockerRoom("no");
    setHasDrinkingFountain("");
    setHasGrandstand("");
    setFieldObs("");
    resetFieldImageFiles();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullAddress = isFieldAddress
      ? fieldLocation.address
      : teamLocation.address;
    const latitude = isFieldAddress
      ? fieldLocation.latitude
      : teamLocation.latitude;
    const longitude = isFieldAddress
      ? fieldLocation.longitude
      : teamLocation.longitude;

    // --- Validação ---
    if (
      isFieldAddress &&
      (!fieldName ||
        !fullAddress ||
        !hasGrandstand ||
        !hasDrinkingFountain ||
        !hasLockerRoom ||
        !floorType)
    ) {
      showToast(
        "É preciso informar todas as informações do campo/quadra.",
        "error"
      );
      setLoading(false);
      return;
    }

    if (!isFieldAddress && !fullAddress) {
      showToast("O endereço do time é obrigatório.", "error");
      setLoading(false);
      return;
    }
    // --- Fim Validação ---

    // --- Upload de Logo ---
    let logoUrl = "";
    if (logoFile) {
      const urls = await uploadLogoFile();
      if (!urls || urls.length === 0) {
        setLoading(false);
        return; // O erro é mostrado dentro do useImageUpload
      }
      logoUrl = urls[0];
    }

    // --- Upload de Imagens do Campo e Estruturação de FieldInfo ---
    let fieldInfo = undefined;
    if (isFieldAddress) {
      const fieldImageUrls: string[] | null =
        fieldImageFiles.length > 0 ? await uploadFieldImageFiles() : [];

      if (fieldImageFiles.length > 0 && !fieldImageUrls) {
        setLoading(false);
        return;
      }

      fieldInfo = {
        name: fieldName,
        address: fullAddress,
        floorType,
        hasLockerRoom,
        hasDrinkingFountain,
        hasGrandstand,
        observations: fieldObs,
        images: fieldImageUrls || [],
      };
    }

    // --- Submissão Final ---
    try {
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sportId,
          abbreviation,
          logo: logoUrl,
          foundedAt,
          history,
          hasField: isFieldAddress,
          fieldInfo,
          fullAddress,
          categoryId,
          latitude,
          longitude,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Erro ao criar o time.", "error");
        return;
      }

      showToast("Time criado com sucesso", "success");
      router.push("/dashboard");
    } catch (err) {
      showToast("Erro ao criar time", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    // Dados de entrada
    name,
    setName,
    abbreviation,
    setAbbreviation,
    foundedAt,
    setFoundedAt,
    history,
    setHistory,
    fieldName,
    setFieldName,
    floorType,
    setFloorType,
    hasLockerRoom,
    setHasLockerRoom,
    hasDrinkingFountain,
    setHasDrinkingFountain,
    hasGrandstand,
    setHasGrandstand,
    fieldObs,
    setFieldObs,
    addressType,

    // Hooks de Esporte/Categoria
    sportId,
    setSportId,
    categoryId,
    setCategoryId,
    availableSports,
    availableCategories,

    // Hook de Logo
    logoFile,
    logoPreviewUrl,
    addLogoFile,

    // Hook de Campo/Imagens
    fieldImageFiles,
    fieldImagePreviewUrls,
    addFieldImageFiles,
    removeFieldImage,
    isFieldAddress,

    // Hooks de Endereço
    teamLocation,
    fieldLocation,

    // Funções e Utilitários
    years,
    loading,
    handleAddressTypeChange,
    handleSubmit,
  };
};
