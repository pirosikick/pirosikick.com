import Container from "./container";

export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-4">
          <a href="/" className="underline">
            ← Back to top
          </a>
        </div>
      </Container>
    </footer>
  );
}
