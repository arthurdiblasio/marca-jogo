export default function FindGamesPage() {
  const { filters, setFilters, results, pagination, loading } = useGameOffersSearch();

  return (
    <>
      <HeaderWithBack title="Encontrar Jogos" />
      <FindGameFilters filters={filters} onChange={setFilters} />
      <GameOfferList data={results} loading={loading} />
      <Pagination pagination={pagination} onChange={setFilters} />
    </>
  );
}
