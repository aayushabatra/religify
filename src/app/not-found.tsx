import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <h1 className="font-display text-4xl text-charcoal">Page not found</h1>
      <p className="mt-3 text-sm text-charcoal/65">
        That page is not part of the storefront yet.
      </p>
      <div className="mt-8 flex justify-center">
        <Button href="/">Back home</Button>
      </div>
    </Container>
  );
}
