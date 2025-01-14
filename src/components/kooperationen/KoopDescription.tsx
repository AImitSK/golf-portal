interface KoopDescriptionProps {
    beschreibung: string;
}

export function KoopDescription({ beschreibung }: KoopDescriptionProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Über die Kooperation
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
                {beschreibung}
            </p>
        </div>
    );
}