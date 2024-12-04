export function TypographyP(string: string) {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        {string}
    </p>
  )
}
