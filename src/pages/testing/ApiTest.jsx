import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ApiTest() {
    const { pid, rid } = useParams();

    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchReceipt() {
            try {
                setLoading(true);

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/pharmacy/${pid}/receipts/${rid}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch receipt");
                }

                const data = await response.json();

                setReceipt(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchReceipt();
    }, [pid, rid]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error: {error}</h2>;
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>Receipt Details</h1>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}
            >
                <p>
                    <strong>Receipt ID:</strong> {receipt.id}
                </p>

                <p>
                    <strong>Customer Name:</strong>{" "}
                    {receipt.customerName}
                </p>

                <p>
                    <strong>Total Price:</strong>{" "}
                    {receipt.totalPrice}
                </p>

                <p>
                    <strong>Payment Status:</strong>{" "}
                    {receipt.paymentStatus}
                </p>

                <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(receipt.createdAt).toLocaleString()}
                </p>
            </div>

            <h2>Items</h2>

            <table
                border="1"
                cellPadding="10"
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                }}
            >
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Medication ID</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Discount</th>
                        <th>Total Price</th>
                    </tr>
                </thead>

                <tbody>
                    {receipt.items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.medicationId}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unitPrice}</td>
                            <td>{item.medicationDiscount}</td>
                            <td>{item.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}