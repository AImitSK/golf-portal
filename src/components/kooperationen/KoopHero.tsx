interface KoopHeroProps {
    name: string;
    typ: string;
    logo?: string;
}

export function KoopHero({ name, typ, logo }: KoopHeroProps) {
    return (
        <div className="bg-gray-50 border-b">
            <div className="max-w-[1280px] mx-auto px-4 py-12 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {logo && (
                        <div className="w-full lg:w-1/3 flex justify-center bg-white p-8 rounded-lg shadow-sm">
                            <img
                                src={logo}
                                alt={name}
                                className="max-w-full max-h-48 object-contain"
                            />
                        </div>
                    )}

                    <div className="w-full lg:w-2/3">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {name}
                        </h1>
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {typ}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}