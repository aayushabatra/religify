import { Container } from "@/components/ui/Container";

const items = [
  {
    title: "Secure checkout",
    body: "Payment integration arrives in a later phase — never claim live payments until configured.",
  },
  {
    title: "Careful packing",
    body: "Packing standards to be confirmed by the business before launch claims.",
  },
  {
    title: "Hisar roots",
    body: "A local family shop building its first online presence — no invented nationwide promises.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-t border-gold/25 py-12" aria-labelledby="trust-strip">
      <Container>
        <h2 id="trust-strip" className="sr-only">
          Trust and service
        </h2>
        <ul className="grid gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.title}>
              <h3 className="font-display text-xl text-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
