'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { showToast } from '@/hooks/useToast';

export default function CreateTeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [availableSports, setAvailableSports] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [sportId, setSportId] = useState('');
  const [floorType, setFloorType] = useState('');
  const [hasLockerRoom, setHasLockerRoom] = useState('no');
  const [hasDrinkingFountain, setHasDrinkingFountain] = useState('');
  const [hasGrandstand, setHasGrandstand] = useState('');
  const [fieldObs, setFieldObs] = useState('');
  const [name, setName] = useState('');
  const [foundedAt, setFoundedAt] = useState('');
  const [history, setHistory] = useState('');
  const [hasField, setHasField] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldAddress, setFieldAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [addressType, setAddressType] = useState<'field' | 'team'>('team');
  const [abbreviation, setAbbreviation] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [teamAddress, setTeamAddress] = useState('');
  const [fieldImageFiles, setFieldImageFiles] = useState<File[]>([]); // Array para os arquivos
  const [fieldImagePreviewUrls, setFieldImagePreviewUrls] = useState<string[]>([]); // Array para as URLs de preview


  const [loading, setLoading] = useState(false);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const yearsList = [];
    for (let year = currentYear; year >= startYear; year--) {
      yearsList.push(year);
    }
    return yearsList;
  }, [])



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
          showToast('Falha ao carregar categorias', 'error');
          console.error('Falha ao carregar categorias:', error);
        }
      }
      fetchCategories();
    } else {
      setAvailableCategories([]); // Limpa as categorias se nenhum esporte for selecionado
      setCategoryId(''); // Reseta a categoria
    }
  }, [sportId]);

  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch('/api/sports');
        const data = await response.json();
        if (response.ok) {
          setAvailableSports(data.sports);
        }
      } catch (error) {
        showToast('Falha ao carregar esportes', 'error');
        console.error('Falha ao carregar esportes:', error);
      }
    }
    fetchSports();
  }, []);

  // useEffect(() => {
  //   return () => {
  //     logoPreviewUrl && URL.revokeObjectURL(logoPreviewUrl);
  //     fieldImagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
  //   };
  // }, [logoPreviewUrl, fieldImagePreviewUrls]);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const fetchAddressDetails = async (placeId: string) => {
    try {
      const response = await fetch(`/api/google-places/details?placeId=${placeId}`);
      const data = await response.json();
      if (response.ok) {
        const location = data.result.geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
      } else {
        showToast('Erro ao buscar detalhes do endereço', 'error');
        console.error('Erro ao buscar detalhes:', data.error);
      }
    } catch (error) {
      showToast('Erro ao buscar detalhes do endereço', 'error');
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const fetchSuggestions = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`/api/google-places?input=${encodeURIComponent(input)}`);
      const data = await response.json();
      if (response.ok) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      }
    } catch (error) {
      showToast('Erro ao buscar sugestões de endereço', 'error');
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  const handleFieldImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files);

      // Calcula quantos espaços ainda estão disponíveis
      const remainingSlots = 5 - fieldImageFiles.length;

      if (remainingSlots <= 0) {
        showToast('Você já atingiu o limite de 5 fotos.', 'error');
        e.target.value = ''; // Limpa o input para permitir nova seleção
        return;
      }

      // Pega apenas os arquivos que cabem no limite
      const filesToAdd = newFiles.slice(0, remainingSlots);

      if (newFiles.length > remainingSlots) {
        showToast(`Você selecionou ${newFiles.length} fotos, mas só ${remainingSlots} foram adicionadas (limite de 5).`, 'info');
      }

      // Gera URLs de preview apenas para os novos arquivos
      const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));

      // Adiciona os novos arquivos e URLs aos arrays existentes
      setFieldImageFiles(prevFiles => [...prevFiles, ...filesToAdd]);
      setFieldImagePreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);

      // Limpa o valor do input para permitir selecionar os mesmos arquivos novamente se removidos
      e.target.value = '';
    }
  };

  const removeFieldImage = (indexToRemove: number) => {
    // Revoga a URL de preview da imagem que será removida
    const urlToRemove = fieldImagePreviewUrls[indexToRemove];
    if (urlToRemove) {
      URL.revokeObjectURL(urlToRemove);
    }

    // Filtra os arrays para remover o item no índice especificado
    setFieldImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setFieldImagePreviewUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
  };

  // const handleFieldImageUploads = async (): Promise<string[] | null> => {
  //   if (fieldImageFiles.length === 0) {
  //     return []; // Retorna array vazio se não houver imagens, não é um erro
  //   }

  //   const formData = new FormData();
  //   // Adiciona cada arquivo ao FormData. O backend precisa saber lidar com múltiplos arquivos
  //   // sob a mesma chave (ex: 'images[]' ou apenas 'images')
  //   fieldImageFiles.forEach((file, index) => {
  //     formData.append('images', file, file.name);
  //   });

  //   try {
  //     // ASSUMINDO que você criará esta rota para lidar com múltiplos uploads
  //     const response = await fetch('/api/upload-images', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || 'Erro no upload das imagens do campo.');
  //     }

  //     // ASSUMINDO que a API retorna um objeto com um array de URLs: { urls: ["url1", "url2"] }
  //     if (data && Array.isArray(data.urls)) {
  //       // Limpa as URLs de preview após o upload bem-sucedido
  //       fieldImagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
  //       return data.urls;
  //     } else {
  //       throw new Error('Resposta inválida da API de upload de imagens.');
  //     }

  //   } catch (err: any) {
  //     showToast('Erro ao fazer upload das imagens do campo.', 'error');
  //     console.error('Erro no upload das imagens do campo:', err);
  //     return null; // Retorna null em caso de erro
  //   }
  // };
  // const handleFileUpload = async () => {
  // if (!logoFile) {
  //   return null;
  // }
  // const formData = new FormData();
  // formData.append('logo', logoFile);

  const handleFilesUpload = async (files: File[]) => {

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });


    try {
      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro no upload da logo.');
      }
      return data.urls;
    } catch (err: any) {
      showToast('Erro ao fazer upload da logo', 'error');
      return null;
    }
  };

  const handleAddressTypeChange = (type: 'field' | 'team') => {
    setAddressType(type);
    const isField = type === 'field';
    setHasField(isField);

    setLatitude(null);
    setLongitude(null);
    setSuggestions([]);
    setShowSuggestions(false);

    setTeamAddress('');
    setFieldName('');
    setFieldAddress('');
    setHasDrinkingFountain('');
    setHasGrandstand('');
    setHasLockerRoom('');
    setFloorType('');
    fieldImagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setFieldImageFiles([]);
    setFieldImagePreviewUrls([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    if (hasField && (!fieldName || !fieldAddress || !hasGrandstand || !hasDrinkingFountain || !hasLockerRoom || !floorType)) {
      showToast('É preciso informar todas as informações do campo/quadra.', 'error');
      setLoading(false);
      return;
    }

    if (!hasField && !teamAddress) {
      showToast('O endereço do time é obrigatório.', 'error');
      setLoading(false);
      return;
    }

    let logoUrl = '';
    if (logoFile) {
      console.log('logoFile', logoFile);

      [logoUrl] = await handleFilesUpload([logoFile]);
      console.log('logoUrl', logoUrl);

      if (!logoUrl) {
        showToast('Erro ao fazer upload da logo, tente novamente', 'error');
        setLoading(false);
        return;
      }
    }

    let fieldInfo;
    if (hasField) {
      let fieldImageUrls: string[] | null = [];
      fieldImageUrls = await handleFilesUpload(fieldImageFiles);

      if (fieldImageFiles.length > 0 && !fieldImageUrls) {
        setLoading(false);
        return;
      }
      fieldInfo = {
        name: fieldName,
        address: fieldAddress,
        floorType,
        hasLockerRoom,
        hasDrinkingFountain,
        hasGrandstand,
        observations: fieldObs,
        images: fieldImageUrls || []
      }
    }

    try {
      const response = await fetch('/api/team/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          sportId,
          abbreviation,
          logo: logoUrl,
          foundedAt,
          history,
          hasField,
          fieldInfo,
          fullAddress: teamAddress || fieldAddress,
          categoryId,
          latitude,
          longitude
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Erro ao criar o time.', 'error');
        return;
      }

      showToast('Time criado com sucesso', 'success');
      setLogoPreviewUrl(null);


      router.push('/dashboard');

    } catch (err) {
      console.log('Erro ao criar time', err);

      showToast('Erro ao criar time', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 mb-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Criar Novo Time</h2>
        <p className="text-center text-gray-600 mb-8">
          Preencha as informações do seu time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Time */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="sportId" className="block text-sm font-medium text-gray-700">
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
            {sportId && availableCategories.length > 0 && (
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="foundedAt" className="block text-sm font-medium text-gray-700">
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
            <div className='col-span-full'>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
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
                <img src={logoPreviewUrl} alt="Pré-visualização da Logo" className="h-32 w-32 object-contain rounded-md border border-gray-300" />
              </div>
            )}

            {/* História do Time */}
            <div className='col-span-full'>
              <label htmlFor="history" className="block text-sm font-medium text-gray-700">
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
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escolha uma das opções abaixo:
              </label>
              <div className="flex space-x-4">

                <button
                  type="button"
                  onClick={() => handleAddressTypeChange('team')}
                  className={`cursor-pointer py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-colors ${addressType === 'team'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'
                    }`}
                >
                  Sou visitante <br></br>(Não tenho mando de campo)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddressTypeChange('field')}
                  className={`cursor-pointer py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-colors ${addressType === 'field'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'
                    }`}
                >
                  Sou mandante <br></br> (Tenho mando de campo)
                </button>
              </div>
            </div>


            {/* Campos do Campo (Exibidos condicionalmente) */}
            {addressType === 'field' && (
              <>
                <div>
                  <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700">
                    Nome do campo/quadra
                  </label>
                  <input
                    id="fieldName"
                    type="text"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="fieldAddress" className="block text-sm font-medium text-gray-700">
                    Endereço do campo/quadra
                  </label>

                  <input
                    id="fieldAddress"
                    type="text"
                    value={fieldAddress}
                    onChange={(e) => {
                      setFieldAddress(e.target.value);
                      setTeamAddress(e.target.value);
                      fetchSuggestions(e.target.value);
                    }}
                    onBlur={() => setShowSuggestions(false)}
                    onFocus={() => setShowSuggestions(true)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                      {suggestions.map((s) => (
                        <li
                          key={s.place_id}

                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFieldAddress(s.description);
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
                <div>
                  {/* Tipo de piso */}
                  <label htmlFor="floorType" className="block text-sm font-medium text-gray-700">
                    Tipo de piso do campo/quadra
                  </label>
                  <select
                    id="floorType"
                    value={floorType}
                    required
                    onChange={(e) => setFloorType(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione uma opção de piso</option>
                    <option key='grama-natural' value='grama-natural'>
                      Grama Natural
                    </option>
                    <option key='piso-sintetico' value='piso-sintetico'>
                      Campo/Quadra Sintético
                    </option>
                    <option key='terra' value='terra'>
                      Terra
                    </option>
                    <option key='cimento' value='cimento'>
                      Cimento
                    </option>
                    <option key='taco' value='taco'>
                      Taco de Madeira
                    </option>
                  </select>
                </div>
                <div>
                  {/* Vestiário */}
                  <label htmlFor="hasLockerRoom" className="block text-sm font-medium text-gray-700">
                    O campo/quadra tem vestiário?
                  </label>
                  <div className="flex gap-3  pt-2">
                    {[
                      { label: "Sim", value: "yes" },
                      { label: "Não", value: "no" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`cursor-pointer flex items-center justify-center w-24 py-2 rounded-lg border-2 text-sm font-medium transition-all
          ${hasLockerRoom === option.value
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name="hasLockerRoom"
                          value={option.value}
                          checked={hasLockerRoom === option.value}
                          onChange={(e) => setHasLockerRoom(e.target.value)}
                          className="hidden"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>

                </div>
                <div>
                  {/* Bebedouro */}
                  <label htmlFor="hasDrinkingFountain" className="block text-sm font-medium text-gray-700">
                    O campo/quadra tem bebedouro?
                  </label>
                  <div className="flex gap-3  pt-2">
                    {[
                      { label: "Sim", value: "yes" },
                      { label: "Não", value: "no" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`cursor-pointer flex items-center justify-center w-24 py-2 rounded-lg border-2 text-sm font-medium transition-all
          ${hasDrinkingFountain === option.value
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name="hasDrinkingFountain"
                          value={option.value}
                          checked={hasDrinkingFountain === option.value}
                          onChange={(e) => setHasDrinkingFountain(e.target.value)}
                          className="hidden"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  {/* Arquibancada */}
                  <label htmlFor="hasGrandstand" className="block text-sm font-medium text-gray-700">
                    O campo/quadra tem arquibancada?
                  </label>
                  <div className="flex gap-3 pt-2">
                    {[
                      { label: "Sim", value: "yes" },
                      { label: "Não", value: "no" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`cursor-pointer flex items-center justify-center w-24 py-2 rounded-lg border-2 text-sm font-medium transition-all
          ${hasGrandstand === option.value
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name="hasGrandstand"
                          value={option.value}
                          checked={hasGrandstand === option.value}
                          onChange={(e) => setHasGrandstand(e.target.value)}
                          className="hidden"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Input para Múltiplas Fotos do Campo */}
                <div className='col-span-full border-t pt-6'>
                  <label htmlFor="fieldImages" className="block text-sm font-medium text-gray-700">
                    Fotos do Campo/Quadra (Máx. 5 fotos)
                  </label>
                  <input
                    id="fieldImages"
                    type="file"
                    accept="image/*"
                    max={5}
                    multiple // Habilita seleção múltipla
                    onChange={handleFieldImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100 cursor-pointer"
                  />
                  {/* Pré-visualização das Imagens Selecionadas */}
                  {fieldImagePreviewUrls.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {fieldImagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-lg border border-gray-300 shadow-md"
                          />
                          <button type="button" onClick={() => removeFieldImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 pl-2 pr-2 text-xs">X</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className='col-span-full'>
                  <label htmlFor="fieldObs" className="block text-sm font-medium text-gray-700">
                    Informações adicionais do campo/quadra (Opcional)
                  </label>
                  <textarea
                    id="fieldObs"
                    required
                    value={fieldObs}
                    onChange={(e) => setFieldObs(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {addressType === 'team' && (
              <>
                <div>
                  <label htmlFor="teamAddress" className="block text-sm font-medium text-gray-700">
                    Endereço do Time (de onde time é)
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
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                      {suggestions.map((s) => (
                        <li
                          key={s.place_id}

                          onMouseDown={(e) => {
                            e.preventDefault();
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
              </>
            )}

          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {loading ? 'Criando...' : 'Criar Time'}
          </button>
        </form>
      </div >
    </div >
  );
}