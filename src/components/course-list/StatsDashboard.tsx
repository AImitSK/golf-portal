'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlayedRound } from '@/types/played-round';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsDashboardProps {
    rounds: PlayedRound[];
}

function calculateStats(rounds: PlayedRound[]) {
    if (!rounds.length) return null;

    const validRounds = rounds.filter(r => r.totals?.gross !== undefined);

    if (!validRounds.length) return null;

    return {
        bestGross: Math.min(...validRounds.map(r => r.totals.gross)),
        bestNet: Math.min(...validRounds.map(r => r.totals.net)),
        bestStableford: Math.max(...validRounds.map(r => r.totals.stableford)),
        avgGross: Math.round(validRounds.reduce((acc, r) => acc + r.totals.gross, 0) / validRounds.length),
        avgNet: Math.round(validRounds.reduce((acc, r) => acc + r.totals.net, 0) / validRounds.length),
        avgStableford: Math.round(validRounds.reduce((acc, r) => acc + r.totals.stableford, 0) / validRounds.length)
    };
}

export default function StatsDashboard({ rounds }: StatsDashboardProps) {
    const stats = calculateStats(rounds);
    if (!stats) return null;

    const chartData = rounds
        .filter(round => round.date && round.totals) // Nur gültige Einträge
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(round => ({
            date: new Date(round.date).toLocaleDateString('de-DE'),
            stableford: round.totals.stableford ?? 0,
            gross: round.totals.gross ?? 0,
            net: round.totals.net ?? 0
        }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Beste Ergebnisse</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="grid grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm text-gray-500">Brutto</dt>
                            <dd className="text-2xl font-semibold">{stats.bestGross}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Netto</dt>
                            <dd className="text-2xl font-semibold">{stats.bestNet}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Stableford</dt>
                            <dd className="text-2xl font-semibold">{stats.bestStableford}</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Durchschnitt</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="grid grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm text-gray-500">Brutto</dt>
                            <dd className="text-2xl font-semibold">{stats.avgGross}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Netto</dt>
                            <dd className="text-2xl font-semibold">{stats.avgNet}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Stableford</dt>
                            <dd className="text-2xl font-semibold">{stats.avgStableford}</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Entwicklung</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="left" orientation="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Line yAxisId="left" type="monotone" dataKey="gross" stroke="#ef4444" name="Brutto" />
                                <Line yAxisId="left" type="monotone" dataKey="net" stroke="#3b82f6" name="Netto" />
                                <Line yAxisId="right" type="monotone" dataKey="stableford" stroke="#22c55e" name="Stableford" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
