// src/hooks/useCreateTeamForm.ts
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/hooks/useToast";
import { useSportsCategories } from "./useSportsCategories";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useFieldSurfaceTypes } from "@/hooks/useFieldSurfaceTypes";
import { set } from "zod";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";

export const useTeamForm = (teamId?: string) => {
  const router = useRouter();
  const {
    sportId,
    setSportId,
    categoryId,
    setCategoryId,
    availableSports,
    availableCategories,
  } = useSportsCategories();

  const { availableFieldTypes, setAvailableFieldTypes } =
    useFieldSurfaceTypes();

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

  const fieldImagesHook = useImageUpload(5);

  const {
    files: fieldImageFiles,
    uploadFiles: uploadFieldImageFiles,
    resetFiles: resetFieldImageFiles,
  } = fieldImagesHook;

  const teamImagesHook = useImageUpload(5);

  const {
    files: teamImagesFiles,
    uploadFiles: uploadTeamImageFiles,
    resetFiles: resetTeamImageFiles,
  } = teamImagesHook;

  const [loading, setLoading] = useState(false);

  // Informações do Time
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [foundedAt, setFoundedAt] = useState("");
  const [history, setHistory] = useState("");
  const [instagram, setInstagram] = useState("");

  // Tipo de Endereço e Lógica de Endereço
  const [addressType, setAddressType] = useState<"field" | "team">("team");
  const isFieldAddress = addressType === "field";

  const teamLocation = useGooglePlaces();
  const fieldLocation = useGooglePlaces();

  // Informações do Campo/Quadra
  const [fieldName, setFieldName] = useState("");
  const [floorType, setFloorType] = useState("");
  const [hasLockerRoom, setHasLockerRoom] = useState("no");
  const [hasDrinkingFountain, setHasDrinkingFountain] = useState("no");
  const [hasGrandstand, setHasGrandstand] = useState("no");
  const [fieldObs, setFieldObs] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [fieldImages, setFieldImages] = useState<string[]>([]);
  const [teamImages, setTeamImages] = useState<string[]>([]);

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

  useEffect(() => {
    if (!teamId) return;

    async function loadTeam() {
      try {
        const id = teamId;
        const res = await fetch(`/api/team/${id}`);
        const data = await res.json();
        if (!res.ok) {
          showToast(data.error || "Erro ao carregar time.", "error");
          return;
        }

        // Preenchimento
        setName(data.name);
        setAbbreviation(data.abbreviation);
        setInstagram(data.instagram || "");
        setFoundedAt(data.foundedAt);
        setHistory(data.history || "");
        setSportId(data.sportId);
        setCategoryId(data.categoryId);
        teamImagesHook.setInitialUrls(data.photos);
        setTeamImages(data.photos);

        if (data.hasField) {
          setAddressType("field");
          fieldLocation.setInitialLocation({
            address: data.fieldInfo?.address || data.fullAddress,
            latitude: data.latitude,
            longitude: data.longitude,
          });

          if (data.fieldInfo) {
            setFieldName(data.fieldInfo.name);
            setFloorType(data.fieldInfo.floorType);
            setHasLockerRoom(data.fieldInfo.hasLockerRoom);
            setHasDrinkingFountain(data.fieldInfo.hasDrinkingFountain);
            setHasGrandstand(data.fieldInfo.hasGrandstand);
            setFieldObs(data.fieldInfo.observations || "");

            if (data.fieldInfo?.images?.length) {
              fieldImagesHook.setInitialUrls(data.fieldInfo.images);
              setFieldImages(data.fieldInfo.images);
            }
          }
        } else {
          setAddressType("team");
          teamLocation.setInitialLocation({
            address: data.fullAddress,
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }

        // Logo existente
        if (data.logo) {
          setLogoPreview(data.logo);
          logoPreviewUrls[0] = data.logo;
        }
      } catch {
        showToast("Erro ao carregar dados do time.", "error");
      }
    }

    loadTeam();
  }, [teamId]);

  // Handler para trocar o tipo de endereço
  const handleAddressTypeChange = (type: "field" | "team") => {
    setAddressType(type);

    // Reset dos campos de endereço e campo/quadra
    teamLocation.resetLocation();
    fieldLocation.resetLocation();
    setFieldName("");
    setFloorType("");
    setHasLockerRoom("no");
    setHasDrinkingFountain("no");
    setHasGrandstand("no");
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

    if (teamImagesFiles.length > 0) {
      await uploadTeamImageFiles();
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
        fieldImagesHook,
        hasGrandstand,
        observations: fieldObs,
        images: fieldImageUrls || fieldImages || [],
      };
    }

    const payload = {
      name,
      sportId,
      abbreviation,
      logo: logoUrl || logoPreview || "",
      foundedAt,
      history,
      hasField: isFieldAddress,
      fieldInfo,
      teamImagesHook,
      fullAddress,
      categoryId,
      latitude,
      longitude,
      instagram,
    };

    // --- Submissão Final ---
    try {
      const response = await fetch(
        teamId ? `/api/team/${teamId}` : `/api/team/create`,
        {
          method: teamId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Erro ao salvar.", "error");
        return;
      }

      showToast(
        teamId ? "Time atualizado!" : "Time criado com sucesso!",
        "success"
      );
      // router.push("/dashboard");
    } catch (err) {
      showToast("Erro ao salvar time", "error");
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
    instagram,
    setInstagram,
    teamImagesFiles,
    teamImages,

    // Hooks de Esporte/Categoria
    sportId,
    setSportId,
    categoryId,
    setCategoryId,
    availableSports,
    availableCategories,

    // Hook de Tipo de Piso
    availableFieldTypes,
    setAvailableFieldTypes,

    // Hook de Logo
    logoFile,
    logoPreviewUrl,
    addLogoFile,

    // Hook de Campo/Imagens
    fieldImageFiles,
    // fieldImagePreviewUrls,
    // addFieldImageFiles,
    // removeFieldImage,
    isFieldAddress,

    fieldImagesHook,

    teamImagesHook,

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
