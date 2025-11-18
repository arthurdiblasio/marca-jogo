
// 'use client';

// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useCreateTeamForm } from '@/app/team/create/hooks/useCreateTeamForm';
// import { AddressSelection } from '@/components/forms/AddressSelection';
// import { FieldImagesUpload } from '@/components/forms/FieldImagesUpload';
// import { RadioButtons } from '@/components/forms/RadioButtons';
// import { FormInput } from '@/components/forms/FormInput';
// import { FormTextArea } from '@/components/forms/FormTextArea';
// import { FormSelect } from '@/components/forms/FormSelect';
// import { Camera, Icon } from 'lucide-react';
// import { FaBeer } from 'react-icons/fa';
// import { ImageMultiUpload } from '@/components/forms/ImageMultiUpload';

// export default function CreateTeamPage() {
//   const { status } = useSession();
//   const router = useRouter();

//   const {
//     name, setName, abbreviation, setAbbreviation, foundedAt, setFoundedAt, history, setHistory,
//     sportId, setSportId, categoryId, setCategoryId, availableSports, availableCategories,
//     fieldName, setFieldName, floorType, setFloorType, hasLockerRoom, setHasLockerRoom,
//     availableFieldTypes, instagram, setInstagram,
//     hasDrinkingFountain, setHasDrinkingFountain, hasGrandstand, setHasGrandstand, fieldObs, setFieldObs,
//     addressType, isFieldAddress, teamLocation, fieldLocation, handleAddressTypeChange,
//     logoPreviewUrl, addLogoFile, fieldImagesHook,
//     years, loading, handleSubmit
//   } = useCreateTeamForm();


//   if (status === 'loading') return null;
//   if (status === 'unauthenticated') {
//     router.push('/login');
//     return null;
//   }


//   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       addLogoFile([e.target.files[0]]);
//     } else {
//       return
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 mb-12 justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-8xl m-4">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Criar Novo Time
//         </h2>
//         <p className="text-center text-gray-600 mb-8">Preencha as informações do seu time.</p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Campos básicos do Time */}
//             <FormInput
//               id="name"
//               label="Nome do Time"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//             <FormInput
//               id="abreviation"
//               label="Abreviatura (Máx. 20 caracteres)"
//               type="text"
//               value={abbreviation}
//               onChange={(e) => setAbbreviation(e.target.value)}
//               required
//             />
//             <FormInput
//               id="instagram"
//               label="Instagram do Time (Opcional - ex: @meutime)"
//               type="text"
//               value={instagram}
//               onChange={(e) => setInstagram(e.target.value)}
//             />

//             <FormSelect id='sportId' value={sportId} required options={availableSports} onChange={(e) => setSportId(e.target.value)} label='Esporte' />
//             {sportId && availableCategories?.length > 0 && (
//               <FormSelect id='categoryId' value={categoryId || ''} required options={availableCategories} onChange={(e) => setCategoryId(e.target.value)} label='Categoria' />
//             )}
//             {/* Ano de Fundação */}
//             <FormSelect id='foundedAt' required value={foundedAt} label='Ano de Fundação' options={years.map((year) => {
//               return { id: year.toString(), name: year.toString() }
//             })} onChange={(e) => setFoundedAt(e.target.value)} />

//             {/* Logo do Time */}
//             <div className='col-span-full'>
//               <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo do Time (Opcional)</label>
//               <input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
//             </div>
//             {logoPreviewUrl && (
//               <div className="mt-4 flex justify-center col-span-full">
//                 <img src={logoPreviewUrl} alt="Pré-visualização da Logo" className="h-32 w-32 object-contain rounded-md border border-gray-300" />
//               </div>
//             )}

//             {/* História do Time */}
//             <FormTextArea id='history' label='História (Opcional)' value={history} onChange={(e) => setHistory(e.target.value)} rows={3} />

//             {/* Seleção do Tipo de Endereço */}
//             <div className="col-span-full border-t pt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Escolha uma das opções abaixo:</label>
//               <div className="flex space-x-4">
//                 <button type="button" onClick={() => handleAddressTypeChange('team')} className={`cursor-pointer py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-colors ${addressType === 'team' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'}`}>
//                   Sou visitante <br />(Não tenho mando de campo)
//                 </button>
//                 <button type="button" onClick={() => handleAddressTypeChange('field')} className={`cursor-pointer py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-colors ${addressType === 'field' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'}`}>
//                   Sou mandante <br /> (Tenho mando de campo)
//                 </button>
//               </div>
//             </div>

//             {/* Endereço do Time (Visitante) */}
//             {!isFieldAddress && (
//               <div className='col-span-full'>
//                 <AddressSelection
//                   label="Endereço do Time (de onde time é)"
//                   hook={teamLocation}
//                   id="teamAddress"
//                   required={true}
//                 />
//               </div>
//             )}

//             {/* Campos do Campo (Mandante) */}
//             {isFieldAddress && (
//               <div className='col-span-full grid grid-cols-1 md:grid-cols-2 gap-6'>

//                 <FormInput
//                   id="fieldName"
//                   label="Nome do campo/quadra"
//                   type="text"
//                   value={fieldName}
//                   onChange={(e) => setFieldName(e.target.value)}
//                   required={isFieldAddress}
//                 />
//                 <div>
//                   <AddressSelection
//                     label="Endereço do campo/quadra"
//                     hook={fieldLocation}
//                     id="fieldAddress"
//                     required={isFieldAddress}
//                   />
//                 </div>

//                 <FormSelect label="Tipo de piso do campo/quadra" options={availableFieldTypes} value={floorType} onChange={(e) => setFloorType(e.target.value)} id="floorType" />

//                 {/* Radio Buttons para o Campo */}
//                 <RadioButtons label="O campo/quadra tem vestiário?" name="hasLockerRoom" value={hasLockerRoom} setter={setHasLockerRoom} options={[{ label: "Sim", value: "yes" }, { label: "Não", value: "no" }]} />
//                 <RadioButtons label="O campo/quadra tem bebedouro?" name="hasDrinkingFountain" value={hasDrinkingFountain} setter={setHasDrinkingFountain} options={[{ label: "Sim", value: "yes" }, { label: "Não", value: "no" }]} />
//                 <RadioButtons label="O campo/quadra tem arquibancada?" name="hasGrandstand" value={hasGrandstand} setter={setHasGrandstand} options={[{ label: "Sim", value: "yes" }, { label: "Não", value: "no" }]} />

//                 {/* Upload de Múltiplas Fotos do Campo */}
//                 {/* <FieldImagesUpload hook={{ previews: fieldImagePreviewUrls, addFiles: addFieldImageFiles, removeFile: removeFieldImage }} /> */}

//                 <ImageMultiUpload
//                   hook={fieldImagesHook} // Passa o hook do useCreateTeamForm
//                   id="fieldImages"
//                   label="Fotos do Campo/Quadra"
//                   maxFiles={5}
//                 />

//                 <FormTextArea id="fieldObs" label="Informações adicionais do campo/quadra (Opcional)" value={fieldObs} onChange={(e) => setFieldObs(e.target.value)} rows={4} />
//               </div>
//             )}

//           </div>

//           <div className="pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
//             >
//               {loading ? 'Criando Time...' : 'Criar Time'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }