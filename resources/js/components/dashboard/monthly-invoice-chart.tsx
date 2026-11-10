import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export type MonthlyInvoiceDataPoint = {
    month: string;
    count: number;
};

type MonthlyInvoiceChartProps = {
    data: MonthlyInvoiceDataPoint[];
};

/**
 * Grafik Batang: Jumlah Tagihan Per Bulan dengan gradient dan bar terfokus.
 */
export default function MonthlyInvoiceChart({
    data,
}: MonthlyInvoiceChartProps) {
    return (
        <ResponsiveContainer width="100%" height={290}>
            <BarChart
                data={data}
                margin={{ top: 12, right: 16, left: -10, bottom: 0 }}
            >
                <defs>
                    <linearGradient
                        id="invoiceBarGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                        <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={0.75}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#f1f5f9"
                />
                <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    dy={6}
                />
                <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    formatter={(value) => [`${String(value)} tagihan`, 'Total']}
                    cursor={{ fill: 'rgba(37, 99, 235, 0.04)' }}
                    contentStyle={{
                        borderRadius: 12,
                        borderColor: '#e2e8f0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                        fontSize: 12,
                        padding: '8px 12px',
                    }}
                />
                <Bar
                    dataKey="count"
                    fill="url(#invoiceBarGradient)"
                    radius={[8, 8, 2, 2]}
                    maxBarSize={44}
                >
                    {data.map((_, index) => (
                        <Cell
                            key={`cell-${index}`}
                            className="transition-opacity duration-200 hover:opacity-85"
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
