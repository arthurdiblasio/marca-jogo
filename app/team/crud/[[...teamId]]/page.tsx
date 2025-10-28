// app/team/create/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { showToast } from "@/hooks/useToast";

export default function TeamFormPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const params = useParams();
  const teamId = params.teamId?.[0] || null;

  const [availableSports, setAvailableSports] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [sportId, setSportId] = useState("");
  const [name, setName] = useState("");
  const [foundedAt, setFoundedAt] = useState("");
  const [history, setHistory] = useState("");
  const [hasField, setHasField] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldAddress, setFieldAddress] = useState("");
  const [logo, setLogo] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [teamAddress, setTeamAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const yearsList = [];
    for (let year = currentYear; year >= startYear; year--) {
      yearsList.push(year);
    }
    return yearsList;
  }, []);

  const fetchSuggestions = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/google-places?input=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      if (response.ok) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      }
    } catch (error) {
      showToast("Erro ao buscar sugestões de endereço", "error");
      console.error("Erro ao buscar sugestões:", error);
    }
  };

  useEffect(() => {
    async function fetchTeamData() {
      if (teamId) {
        setLoading(true);
        try {
          const response = await fetch(`/api/team/${teamId}`);
          if (!response.ok) {
            throw new Error("Time não encontrado.");
          }
          const data = await response.json();
          setName(data.name || "");
          setSportId(data.sportId || "");
          setCategoryId(data.categoryId || "");
          setAbbreviation(data.abbreviation || "");
          setFoundedAt(data.foundedAt || "");
          setHistory(data.history || "");
          setHasField(data.hasField || false);
          setFieldName(data.fieldName || "");
          setFieldAddress(data.fieldAddress || "");
          setTeamAddress(data.teamAddress || "");
          setLogo(data.logo || "");
        } catch (error) {
          showToast("Falha ao carregar os dados do time.", "error");
          console.error("Falha ao carregar os dados do time:", error);
          router.push("/dashboard");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchTeamData();
    }
  }, [teamId, status]);

  useEffect(() => {
    if (sportId) {
      async function fetchCategories() {
        try {
          const response = await fetch(`/api/categories?sportId=${sportId}`);
          const data = await response.json();
          if (response.ok) {
            setAvailableCategories(data.categories);
          }
        } catch (error) {
          showToast("Falha ao carregar categorias", "error");
          console.error("Falha ao carregar categorias:", error);
        }
      }
      fetchCategories();
    } else {
      setAvailableCategories([]); // Limpa as categorias se nenhum esporte for selecionado
      setCategoryId(""); // Reseta a categoria
    }
  }, [sportId]);

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
        console.error("Falha ao carregar esportes:", error);
      }
    }
    fetchSports();
  }, []);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const fetchAddressDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `/api/google-places/details?placeId=${placeId}`
      );
      const data = await response.json();
      if (response.ok) {
        const location = data.result.geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
      } else {
        showToast("Erro ao buscar detalhes do endereço", "error");
        console.error("Erro ao buscar detalhes:", data.error);
      }
    } catch (error) {
      showToast("Erro ao buscar detalhes do endereço", "error");
      console.error("Erro ao buscar detalhes:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!logoFile) {
      return null;
    }
    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      const response = await fetch("/api/upload-logo", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro no upload da logo.");
      }
      return data.url;
    } catch (err: any) {
      showToast("Erro ao fazer upload da logo", "error");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const logoUrl = await handleFileUpload();

    if (logoFile && !logoUrl) {
      showToast("Erro ao fazer upload da logo, tente novamente", "error");
      setLoading(false);
      return;
    }

    if (hasField && (!fieldName || !fieldAddress)) {
      showToast("O nome e o endereço do campo são obrigatórios.", "error");
      setLoading(false);
      return;
    }

    if (!hasField && !teamAddress) {
      showToast("O endereço do time é obrigatório.", "error");
      setLoading(false);
      return;
    }

    try {
      const addressToUse = hasField ? fieldAddress : teamAddress;
      await fetchAddressDetails(addressToUse).catch(() => {
        showToast(
          "Não foi possível obter as coordenadas para o endereço.",
          "error"
        );
        setLoading(false);
        return;
      });

      const payload = {
        name,
        sportId,
        abbreviation,
        logo: logoUrl,
        foundedAt,
        history,
        hasField,
        fieldName,
        fieldAddress: hasField ? fieldAddress : null,
        teamAddress: !hasField ? teamAddress : null,
        latitude,
        longitude,
        categoryId,
      };

      const isEditing = !!teamId;
      console.log("Payload do time Editando:", isEditing);

      const apiUrl = isEditing
        ? `/api/team/update/${teamId}`
        : "/api/team/create";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.error || `Erro ao ${isEditing ? "atualizar" : "criar"} o time.`,
          "error"
        );
        return;
      }

      showToast(
        `Time ${isEditing ? "atualizado" : "criado"} com sucesso!`,
        "success"
      );
      setLogoPreviewUrl(null);
      router.push("/dashboard");
    } catch (err) {
      console.log(`Erro ao ${teamId ? "atualizar" : "criar"} time`, err);
      showToast(`Erro ao ${teamId ? "atualizar" : "criar"} time`, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 mb-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Criar Novo Time
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Preencha as informações do seu time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Time */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome do Time
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="abbreviation"
                className="block text-sm font-medium text-gray-700"
              >
                Abreviatura (Máx. 20 caracteres)
              </label>
              <input
                id="abbreviation"
                type="text"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
                maxLength={20}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              {/* Esporte */}
              <label
                htmlFor="sportId"
                className="block text-sm font-medium text-gray-700"
              >
                Esporte
              </label>
              <select
                id="sportId"
                value={sportId}
                onChange={(e) => setSportId(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um esporte</option>
                {availableSports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            {sportId && availableCategories?.length > 0 && (
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Categoria
                </label>
                <select
                  id="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {availableCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {categoryId}
              </div>
            )}

            {/* Ano de Fundação */}
            <div>
              <label
                htmlFor="foundedAt"
                className="block text-sm font-medium text-gray-700"
              >
                Ano de Fundação
              </label>
              <select
                id="foundedAt"
                value={foundedAt}
                onChange={(e) => setFoundedAt(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um ano</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="logo"
                className="block text-sm font-medium text-gray-700"
              >
                Logo do Time (Opcional)
              </label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setLogoFile(file);
                    const objectUrl = URL.createObjectURL(file);
                    setLogoPreviewUrl(objectUrl);
                  } else {
                    setLogoFile(null);
                    setLogoPreviewUrl(null);
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            {logoPreviewUrl && (
              <div className="mt-4 flex justify-center">
                <img
                  src={logoPreviewUrl}
                  alt="Pré-visualização da Logo"
                  className="h-32 w-32 object-contain rounded-md border border-gray-300"
                />
              </div>
            )}

            {/* História do Time */}
            <div className="col-span-full">
              <label
                htmlFor="history"
                className="block text-sm font-medium text-gray-700"
              >
                História (Opcional)
              </label>
              <textarea
                id="history"
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tem Campo Próprio? */}
            <div className="flex items-center col-span-full">
              <input
                id="hasField"
                type="checkbox"
                checked={hasField}
                onChange={(e) => setHasField(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="hasField"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                O time tem campo próprio?
              </label>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="teamAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Endereço do Campo
              </label>
              <input
                id="teamAddress"
                type="text"
                value={teamAddress}
                onChange={(e) => {
                  setTeamAddress(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                onBlur={() => setShowSuggestions(false)}
                onFocus={() => setShowSuggestions(true)}
                required={hasField}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                  {suggestions.map((s) => (
                    <li
                      key={s.place_id}
                      // onClick={() => {
                      //   setFieldAddress(s.description);
                      //   setSuggestions([]);
                      //   setShowSuggestions(false);
                      // }}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Impede que o onBlur do input seja acionado
                        setTeamAddress(s.description);
                        setSuggestions([]);
                        setShowSuggestions(false);
                        fetchAddressDetails(s.place_id);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {s.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Campos do Campo (Exibidos condicionalmente) */}
            {hasField && (
              <>
                <div>
                  <label
                    htmlFor="fieldName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome do Campo
                  </label>
                  <input
                    id="fieldName"
                    type="text"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    required={hasField}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="fieldAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Endereço do Campo
                  </label>
                  {/* <input
                  id="fieldAddress"
                  type="text"
                  value={fieldAddress}
                  onChange={(e) => setFieldAddress(e.target.value)}
                  required={hasField}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                /> */}
                  <input
                    id="fieldAddress"
                    type="text"
                    value={fieldAddress}
                    onChange={(e) => {
                      setFieldAddress(e.target.value);
                      fetchSuggestions(e.target.value);
                    }}
                    onBlur={() => setShowSuggestions(false)}
                    onFocus={() => setShowSuggestions(true)}
                    required={hasField}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                      {suggestions.map((s) => (
                        <li
                          key={s.place_id}
                          // onClick={() => {
                          //   setFieldAddress(s.description);
                          //   setSuggestions([]);
                          //   setShowSuggestions(false);
                          // }}
                          onMouseDown={(e) => {
                            e.preventDefault(); // Impede que o onBlur do input seja acionado
                            setFieldAddress(s.description);
                            setSuggestions([]);
                            setShowSuggestions(false);
                            fetchAddressDetails(s.place_id);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {s.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
          >
            {loading ? "Criando..." : "Criar Time"}
          </button>
        </form>
      </div>
    </div>
  );
}
