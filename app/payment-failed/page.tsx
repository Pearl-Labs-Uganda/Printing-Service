import Link from "next/link";

interface Props {
  searchParams: Promise<{
    orderId?: string;
    error?: string;
  }>;
}

export default async function PaymentFailedPage({ searchParams }: Props) {
  const { orderId, error } = await searchParams;

  return (
    <main style={{ minHeight: "100vh", padding: "4rem 1.5rem", background: "#f8fafc", color: "#111827" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: "1rem", padding: "2.5rem", boxShadow: "0 30px 60px rgba(15, 23, 42, 0.08)" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#991b1b" }}>Payment could not be completed</h1>
        <p style={{ fontSize: "1rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
          Unfortunately we could not confirm your payment. Please try again or contact support if the issue persists.
        </p>
        {orderId && (
          <div style={{ marginBottom: "1rem", padding: "1.1rem", borderRadius: "0.85rem", background: "#fef3f2", border: "1px solid #fecaca", color: "#991b1b" }}>
            <strong>Order reference:</strong> {orderId}
          </div>
        )}
        {error && (
          <div style={{ marginBottom: "1.5rem", padding: "1.1rem", borderRadius: "0.85rem", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#1f2937" }}>
            <strong>Error:</strong> {error.replace(/_/g, " ")}
          </div>
        )}
        <p style={{ fontSize: "0.95rem", color: "#475569" }}>
          If you did not receive an OTP, double-check the phone number and try again with a different active mobile money number.
        </p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.95rem 1.3rem", background: "#2563eb", color: "#fff", borderRadius: "0.75rem", textDecoration: "none", fontWeight: 700 }}>
          Return Home
        </Link>
      </div>
    </main>
  );
}