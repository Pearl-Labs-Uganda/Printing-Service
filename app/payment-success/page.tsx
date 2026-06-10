import Link from "next/link";

interface Props {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  return (
    <main style={{ minHeight: "100vh", padding: "4rem 1.5rem", background: "#f8fafc", color: "#0f172a" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: "1rem", padding: "2.5rem", boxShadow: "0 30px 60px rgba(15, 23, 42, 0.08)" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#0f172a" }}>Payment received</h1>
        <p style={{ fontSize: "1rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
          Thank you! Your 50% deposit has been confirmed and your order is now being prepared for printing.
        </p>
        {orderId && (
          <div style={{ marginBottom: "1.25rem", padding: "1.25rem", borderRadius: "0.85rem", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46" }}>
            <strong>Order reference:</strong> {orderId}
          </div>
        )}
        <p style={{ fontSize: "1rem", lineHeight: 1.75, marginBottom: "2rem" }}>
          We will update you when your print is ready for pickup or delivery. If you need help, contact us through the support details in the app.
        </p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.95rem 1.3rem", background: "#2563eb", color: "#fff", borderRadius: "0.75rem", textDecoration: "none", fontWeight: 700 }}>
          Return Home
        </Link>
      </div>
    </main>
  );
}