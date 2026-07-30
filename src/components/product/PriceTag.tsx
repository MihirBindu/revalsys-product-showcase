const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function PriceTag({
  price,
  className = "",
}: {
  price: number;
  className?: string;
}) {
  return <span className={className}>{formatter.format(price)}</span>;
}
