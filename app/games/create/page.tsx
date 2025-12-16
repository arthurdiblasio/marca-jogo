"use client";

import { useCreateGameOffer } from "@/hooks/useCreateGameOffer";
import { PageTitle } from "@/components/PageTitle";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextArea } from "@/components/forms/FormTextArea";
import { ImageMultiUpload } from "@/components/forms/ImageMultiUpload";
import { PrimaryButton } from "@/components/forms/FormButton";
import { TeamSelectCard } from "@/components/teams/TeamSelectCard";

export default function CreateGamePage() {
  const {
    loadingTeams,
    teams,
    availableSportIds,
    selectedSportId,
    setSelectedSportId,
    teamsBySport,
    selectedTeam,
    setSelectedTeam,

    modalityId,
    setModalityId,
    categoryId,
    categoryName,
    setCategoryId,
    gameDate,
    setGameDate,
    durationMin,
    setDurationMin,
    fee,
    setFee,

    includesRef,
    setIncludesRef,
    refereeType,
    setRefereeType,

    fieldLocation,
    fieldImagesHook,

    submit,
  } = useCreateGameOffer();

  // -----------------------------
  // Loading inicial
  // -----------------------------
  if (loadingTeams) {
    return <p className="p-4 text-center">Carregando...</p>;
  }

  // -----------------------------
  // Nenhum time cadastrado
  // -----------------------------
  if (!teams.length) {
    return (
      <>
        <PageTitle> Criar jogo</PageTitle>
        <div className="p-4 text-center text-gray-600">
          Você ainda não possui times cadastrados.
        </div>
      </>
    );
  }

  return (
    <>

      <div className="flex min-h-screen bg-gray-100 mb-12 justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-8xl m-2">
          <PageTitle>Novo jogo</PageTitle>

          {/* ============================
            Seleção de esporte (se houver mais de um)
        ============================ */}
          {availableSportIds.length > 1 && (
            <FormSelect
              id="sport"
              label="Esporte"
              value={selectedSportId ?? ""}
              required
              options={availableSportIds.map((sport) => ({
                id: sport.id,
                name: sport.name, // você pode trocar por nome real se quiser
              }))}
              onChange={(e) => setSelectedSportId(e.target.value)}
            />
          )}

          {/* ============================
            Seleção de time
        ============================ */}
          {selectedSportId && (
            <FormSelect
              id="team"
              label="Time"
              value={selectedTeam?.id ?? ""}
              required
              options={teamsBySport.map((t) => ({
                id: t.id,
                name: t.name,
              }))}
              onChange={(e) =>
                setSelectedTeam(
                  teamsBySport.find((t) => t.id === e.target.value) ?? null
                )
              }
            />
            // <div className="space-y-3">
            //   {teamsBySport.map((team) => (
            //     <TeamSelectCard
            //       key={team.id}
            //       team={team}
            //       selected={selectedTeam?.id === team.id}
            //       onSelect={() => setSelectedTeam(team)}
            //     />
            //   ))}
            // </div>
          )}


          {/* ============================
            Dados do jogo
        ============================ */}
          {selectedTeam && (
            <>
              <FormInput
                id="gameDate"
                type="datetime-local"
                label="Data e horário"
                value={gameDate}
                required
                onChange={(e) => setGameDate(e.target.value)}
              />

              <FormInput
                id="duration"
                type="number"
                label="Duração (minutos)"
                value={durationMin ?? ""}
                placeholder="Ex: 90"
                onChange={(e) => setDurationMin(Number(e.target.value))}
              />

              <FormInput
                id="fee"
                type="number"
                label="Taxa do jogo (R$)"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
              />

              {/* <FormSelect
                id="category"
                label="Categoria"
                value={categoryId ?? ""}
                options={[
                  { id: "SUB_15", name: "Sub-15" },
                  { id: "JOVEM", name: "Jovem" },
                  { id: "VETERANO", name: "Veterano" },
                ]}
                onChange={(e) => setCategoryId(e.target.value)}
              /> */}

              <label htmlFor="category" className="mt-4 mb-4 block text-sm font-medium text-gray-700">
                {categoryName ? `Categoria: ${categoryName}` : 'Categoria: Livre'}
              </label>

              {/* ============================
                Arbitragem
            ============================ */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Arbitragem inclusa?
                </label>

                <select
                  value={includesRef ? "yes" : "no"}
                  onChange={(e) => setIncludesRef(e.target.value === "yes")}
                  className="w-full border rounded-md p-2"
                >
                  <option value="yes">Sim</option>
                  <option value="no">Não</option>
                </select>
              </div>

              {includesRef && (
                <FormSelect
                  id="refereeType"
                  label="Tipo de arbitragem"
                  value={refereeType}
                  options={[
                    { id: "SOLO", name: "Árbitro único" },
                    { id: "TRIO", name: "Trio de arbitragem" },
                  ]}
                  onChange={(e) =>
                    setRefereeType(e.target.value as "SOLO" | "TRIO")
                  }
                />
              )}

              {/* ============================
                Local do jogo
            ============================ */}
              <div className="space-y-4">
                <FormInput
                  id="fieldAddress"
                  label="Endereço do jogo"
                  value={fieldLocation.address}
                  onChange={(e) =>
                    fieldLocation.handleAddressChange(e.target.value)
                  }
                />

                <ImageMultiUpload
                  hook={fieldImagesHook}
                  id="fieldImages"
                  label="Fotos do campo"
                  maxFiles={5}
                />

                <FormTextArea
                  id="fieldObs"
                  label="Observações do campo"
                  value=""
                  onChange={() => { }}
                />
              </div>

              <PrimaryButton
                type="button"
                onClick={submit}
              >
                Criar jogo
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    </>
  );
}
