export default function PageHeader({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="page-head">
      <p className="page-kicker">{kicker}</p>
      <h1>{title}</h1>
      <p className="page-lede">{lede}</p>
    </header>
  );
}
