import "./CurrencyIcon.css";

export interface CurrencyIconProps {
  currencyCode: string;
}

export function CurrencyIcon({ currencyCode }: CurrencyIconProps) {
  const code = currencyCode.toUpperCase();
  const publicUrl = process.env.PUBLIC_URL || "";
  const basePath = `${publicUrl}/assets/${code}`;

  return (
    <img
      src={`${basePath}.png`}
      srcSet={`
        ${basePath}.png 1x,
        ${basePath}@2x.png 2x,
        ${basePath}@3x.png 3x
      `}
      alt={`${code} currency icon`}
      className="currency-icon"
      width={32}
      height={32}
      loading="lazy"
    />
  );
}
