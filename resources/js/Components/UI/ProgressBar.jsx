export default function ProgressBar({ value, showLabel = true, height = 'h-3' }) {
    const pct = Math.min(100, Math.max(0, value));

    const color =
        pct >= 75 ? 'bg-green-500' :
        pct >= 40 ? 'bg-blue-500' :
        'bg-yellow-500';

    return (
        <div className="w-full">
            <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
                <div
                    className={`${height} rounded-full transition-all duration-300 ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showLabel && (
                <p className="text-xs text-gray-500 mt-1">{pct}%</p>
            )}
        </div>
    );
}
