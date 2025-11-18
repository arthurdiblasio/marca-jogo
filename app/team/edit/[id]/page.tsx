import TeamForm from "../../components/TeamForm";

export default async function EditTeamPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <TeamForm mode="edit" teamId={id} />;
}