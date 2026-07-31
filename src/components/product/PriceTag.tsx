const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return formatter.format(price);
}

export default function PriceTag({
  price,
  className = "",
}: {
  price: number;
  className?: string;
}) {
  return <span className={className}>{formatPrice(price)}</span>;
}
