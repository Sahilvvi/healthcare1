const orders = [
  { id: "ORD-2841", patient: "Sarah Thompson", items: "Atorvastatin, Metformin", status: "Out for delivery", total: "₹1,240" },
  { id: "ORD-2840", patient: "Ahmed Al-Rashid", items: "Vitamin D3, Calcium", status: "Packed", total: "₹680" },
  { id: "ORD-2839", patient: "Mei Lin", items: "Prescription refill", status: "Delivered", total: "₹2,100" },
  { id: "ORD-2838", patient: "John Carter", items: "Post-op meds", status: "Prescription received", total: "₹3,450" },
];

export default function AdminOrdersPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-navy">Medicine orders</h1>
        <p className="text-sm text-muted">Track prescriptions, packing and delivery status</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium text-dark">{order.id}</td>
                <td className="px-4 py-3 text-muted">{order.patient}</td>
                <td className="px-4 py-3 text-muted">{order.items}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-sage px-2.5 py-1 text-xs text-dark">{order.status}</span>
                </td>
                <td className="px-4 py-3 text-muted">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
