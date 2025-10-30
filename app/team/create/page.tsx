// src/app/create-team/page.tsx (ou src/pages/create-team.tsx)
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCreateTeamForm } from '@/app/team/create/hooks/useCreateTeamForm'; // Importa o hook principal
import { AddressSelection } from '@/components/forms/AddressSelection'; // Novo componente
import { FieldImagesUpload } from '@/components/forms/FieldImagesUpload'; // Novo componente
import { RadioButtons } from '@/components/forms/RadioButtons';
import { FormInput } from '@/components/forms/FormInput'; // <-- NOVA IMPORTAÇÃO
import { FormTextArea } from '@/components/forms/FormTextArea';
import { FormSelect, SelectOption } from '@/components/forms/FormSelect'; // <-- NOVA IMPORTAÇÃO
export default function CreateTeamPage() {
  const { status } = useSession();
  const router = useRouter();
  const {
    // Estados do Time
    name, setName, abbreviation, setAbbreviation, foundedAt, setFoundedAt, history, setHistory,
    // Estados de Esporte/Categoria
    sportId, setSportId, categoryId, setCategoryId, availableSports, availableCategories,
    // Estados do Campo
    fieldName, setFieldName, floorType, setFloorType, hasLockerRoom, setHasLockerRoom,
    hasDrinkingFountain, setHasDrinkingFountain, hasGrandstand, setHasGrandstand, fieldObs, setFieldObs,
    // Endereço e Tipo
    addressType, isFieldAddress, teamLocation, fieldLocation, handleAddressTypeChange,
    // Uploads
    logoPreviewUrl, addLogoFile, fieldImagePreviewUrls, addFieldImageFiles, removeFieldImage,
    // Utilitários e Funções
    years, loading, handleSubmit
  } = useCreateTeamForm();

  // Redirecionamento de autenticação
  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Handlers simplificados para upload (apenas chamam o hook)
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addLogoFile([e.target.files[0]]);
    } else {
      return
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 mb-12 justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-8xl m-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Criar Novo Time ⚽</h2>
        <p className="text-center text-gray-600 mb-8">Preencha as informações do seu time.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campos básicos do Time */}
            <FormInput
              id="name"
              label="Nome do Time"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FormInput
              id="abreviation"
              label="Abreviatura (Máx. 20 caracteres)"
              type="text"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              required
            />
            {/* Seleção de Esporte e Categoria */}
            <div>
              <label htmlFor="sportId" className="block text-sm font-medium text-gray-700">Esporte</label>
              <select id="sportId" value={sportId} onChange={(e) => setSportId(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Selecione um esporte</option>
                {availableSports.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            {sportId && availableCategories?.length > 0 && (
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Categoria</label>
                <select id="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Selecione uma categoria</option>
                  {availableCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
            )}
            {/* Ano de Fundação */}
            <div>
              <label htmlFor="foundedAt" className="block text-sm font-medium text-gray-700">Ano de Fundação</label>
              <select id="foundedAt" value={foundedAt} onChange={(e) => setFoundedAt(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Selecione um ano</option>
                {years.map((year) => (<option key={year} value={year}>{year}</option>))}
              </select>
            </div>

            {/* Logo do Time */}
            <div className='col-span-full'>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo do Time (Opcional)</label>
              <input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            {logoPreviewUrl && (
              <div className="mt-4 flex justify-center col-span-full">
                <img src={logoPreviewUrl} alt="Pré-visualização da Logo" className="h-32 w-32 object-contain rounded-md border border-gray-300" />
              </div>
            )}

            {/* História do Time */}
            <FormTextArea id='history' label='História (Opcional)' value={history} onChange={(e) => setHistory(e.target.value)} rows={3} />

            {/* Seleção do Tipo de Endereço */}
            <div className="col-span-full border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Escolha uma das opções abaixo:</label>
              <div className="flex space-x-4">
                <button type="button" onClick={() => handleAddressTypeChange('team')} className={`cursor-pointer py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-colors ${addressType === 'team' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'}`}>
                  Sou visitante <br />(Não tenho mando de campo)
                </button>
                <button type="button" onClick={() => handleAddressTypeChange('field')} className={`cursor-pointer py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-colors ${addressType === 'field' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'}`}>
                  Sou mandante <br /> (Tenho mando de campo)
                </button>
              </div>
            </div>

            {/* Endereço do Time (Visitante) */}
            {!isFieldAddress && (
              <div className='col-span-full'>
                <AddressSelection
                  label="Endereço do Time (de onde time é)"
                  hook={teamLocation}
                  id="teamAddress"
                  required={true}
                />
              </div>
            )}

            {/* Campos do Campo (Mandante) */}
            {isFieldAddress && (
              <div className='col-span-full grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700">Nome do campo/quadra</label>
                  <input id="fieldName" type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} required={isFieldAddress} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <AddressSelection
                    label="Endereço do campo/quadra"
                    hook={fieldLocation}
                    id="fieldAddress"
                    required={isFieldAddress}
                  />
                </div>

                {/* Tipo de piso */}
                <div>
                  <label htmlFor="floorType" className="block text-sm font-medium text-gray-700">Tipo de piso do campo/quadra</label>
                  <select id="floorType" value={floorType} required={isFieldAddress} onChange={(e) => setFloorType(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione uma opção de piso</option>
                    <option value='grama-natural'>Grama Natural</option>
                    <option value='piso-sintetico'>Campo/Quadra Sintético</option>
                    <option value='terra'>Terra</option>
                    <option value='cimento'>Cimento</option>
                    <option value='taco'>Taco de Madeira</option>
                  </select>
                </div>

                {/* Radio Buttons para o Campo */}
                <RadioButtons label="O campo/quadra tem vestiário?" name="hasLockerRoom" value={hasLockerRoom} setter={setHasLockerRoom} options={[{ label: "Sim", value: "yes" }, { label: "Não", value: "no" }]} />
                <RadioButtons label="O campo/quadra tem bebedouro?" name="hasDrinkingFountain" value={hasDrinkingFountain} setter={setHasDrinkingFountain} options={[{ label: "Sim", value: "yes" }, { label: "Não", value: "no" }]} />
                <RadioButtons label="O campo/quadra tem arquibancada?" name="hasGrandstand" value={hasGrandstand} setter={setHasGrandstand} options={[{ label: "Sim", value: "yes" }, { label: "Não", value: "no" }]} />

                {/* Upload de Múltiplas Fotos do Campo */}
                <FieldImagesUpload hook={{ previews: fieldImagePreviewUrls, addFiles: addFieldImageFiles, removeFile: removeFieldImage }} />

                <div className='col-span-full'>
                  <label htmlFor="fieldObs" className="block text-sm font-medium text-gray-700">Informações adicionais do campo/quadra (Opcional)</label>
                  <textarea id="fieldObs" value={fieldObs} onChange={(e) => setFieldObs(e.target.value)} rows={4} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            )}

          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {loading ? 'Criando Time...' : 'Criar Time'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}