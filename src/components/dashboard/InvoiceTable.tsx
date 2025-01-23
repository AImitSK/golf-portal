// src/components/dashboard/InvoiceTable.tsx
"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface Invoice {
    id: string;
    number: string;
    amount: number;
    status: string;
    date: string;
    url: string;
}

export default function InvoiceTable() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInvoices() {
            const res = await fetch('/api/invoices');
            if (res.ok) {
                const data = await res.json();
                setInvoices(data);
            }
            setLoading(false);
        }
        fetchInvoices();
    }, []);

    if (loading) return <div>Lädt...</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="border-b">
                    <th className="py-3 text-left">Datum</th>
                    <th className="py-3 text-left">Rechnungsnummer</th>
                    <th className="py-3 text-left">Betrag</th>
                    <th className="py-3 text-left">Status</th>
                    <th className="py-3 text-left">Download</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                        <td className="py-3">
                            {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="py-3">{invoice.number}</td>
                        <td className="py-3">
                            {(invoice.amount / 100).toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR'
                            })}
                        </td>
                        <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    invoice.status === 'paid'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {invoice.status === 'paid' ? 'Bezahlt' : 'Ausstehend'}
                                </span>
                        </td>
                        <td className="py-3">
                            <a
                                href={invoice.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {invoices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Keine Rechnungen vorhanden
                </div>
            )}
        </div>
    );
}