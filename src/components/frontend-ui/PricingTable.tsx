import { Fragment } from 'react'
import { CheckIcon, MinusIcon } from '@heroicons/react/20/solid'

// Typen für die Tiers und Features
type TierName = 'Starter' | 'Growth' | 'Scale'

// Typ für die Features in der Sektion
interface Feature {
    name: string;
    tiers: Record<TierName, boolean | string>;
}

// Typ für die Sektionen
interface Section {
    name: string;
    features: Feature[];
}

// Typ für die Tiers
interface Tier {
    name: TierName;
    id: string;
    href: string;
    priceMonthly: string;
    mostPopular: boolean;
}

// Daten
const tiers: Tier[] = [
    { name: 'Starter', id: 'tier-starter', href: '#', priceMonthly: '€0', mostPopular: false },
    { name: 'Growth', id: 'tier-growth', href: '#', priceMonthly: '€24', mostPopular: true },
    { name: 'Scale', id: 'tier-scale', href: '#', priceMonthly: '€34', mostPopular: false },
]

const sections: Section[] = [
    {
        name: 'Features',
        features: [
            { name: 'Basis-Clubprofil', tiers: { Starter: true, Growth: true, Scale: true } },
            { name: 'Platz-Informationen', tiers: { Starter: 'basis', Growth: 'komplett', Scale: 'komplett' } },
            { name: 'Top 5 mit Bild', tiers: { Starter: false, Growth: true, Scale: true } },
            { name: 'Top 1 Position', tiers: { Starter: false, Growth: false, Scale: true } },
            { name: 'Bildergalerie', tiers: { Starter: false, Growth: true, Scale: true } },
            { name: 'Video', tiers: { Starter: false, Growth: true, Scale: true } },
            { name: 'KI Chat Link', tiers: { Starter: false, Growth: true, Scale: true } },
        ],
    },
    {
        name: 'SEO',
        features: [
            { name: 'Advanced analytics', tiers: { Starter: true, Growth: true, Scale: true } },
            { name: 'Basic reports', tiers: { Starter: false, Growth: true, Scale: true } },
            { name: 'Professional reports', tiers: { Starter: false, Growth: false, Scale: true } },
            { name: 'Custom report builder', tiers: { Starter: false, Growth: false, Scale: true } },
        ],
    },
    {
        name: 'Support',
        features: [
            { name: '24/7 online support', tiers: { Starter: true, Growth: true, Scale: true } },
            { name: 'Quarterly workshops', tiers: { Starter: false, Growth: true, Scale: true } },
            { name: 'Priority phone support', tiers: { Starter: false, Growth: false, Scale: true } },
            { name: '1:1 onboarding tour', tiers: { Starter: false, Growth: false, Scale: true } },
        ],
    },
]

// Hilfsfunktion für Klassen
function classNames(...classes: (string | false | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}




export default function Example() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base/7 font-semibold text-dark-green">Pricing</h2>
                    <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-dark sm:text-6xl">
                        Pricing that grows with you
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-dark sm:text-xl/8">
                    Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
                </p>

                {/* xs to lg */}
                <div className="mx-auto mt-12 max-w-md space-y-8 sm:mt-16 lg:hidden">
                    {tiers.map((tier) => (
                        <section
                            key={tier.id}
                            className={classNames(
                                tier.mostPopular
                                    ? 'rounded-xl bg-dark-green-10 ring-1 ring-inset ring-dark-6'
                                    : '',
                                'p-8',
                            )}
                        >
                            <h3 id={tier.id} className="text-sm/6 font-semibold text-dark">
                                {tier.name}
                            </h3>
                            <p className="mt-2 flex items-baseline gap-x-1 text-dark">
                                <span className="text-4xl font-semibold">{tier.priceMonthly}</span>
                                <span className="text-sm font-semibold">/month</span>
                            </p>
                            <a
                                href={tier.href}
                                aria-describedby={tier.id}
                                className={classNames(
                                    'bg-cta-green text-white hover:bg-dark-green',
                                    'mt-8 block rounded-md px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-green',
                                )}
                            >
                                Buy plan
                            </a>
                            <ul role="list" className="mt-10 space-y-4 text-sm/6 text-dark">
                                {sections.map((section) => (
                                    <li key={section.name}>
                                        <ul role="list" className="space-y-4">
                                            {section.features.map((feature) =>
                                                    feature.tiers[tier.name] ? (
                                                        <li key={feature.name} className="flex gap-x-3">
                                                            <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-dark-green" />
                                                            <span>
                              {feature.name}{' '}
                                                                {typeof feature.tiers[tier.name] === 'string' ? (
                                                                    <span className="text-sm/6 text-dark">({feature.tiers[tier.name]})</span>
                                                                ) : null}
                            </span>
                                                        </li>
                                                    ) : null,
                                            )}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>

                {/* lg+ */}
                <div className="isolate mt-20 hidden lg:block">
                    <div className="relative -mx-8">
                        {tiers.some((tier) => tier.mostPopular) ? (
                            <div className="absolute inset-x-4 inset-y-0 -z-10 flex">
                                <div
                                    style={{ marginLeft: `${(tiers.findIndex((tier) => tier.mostPopular) + 1) * 25}%` }}
                                    aria-hidden="true"
                                    className="flex w-1/4 px-4"
                                >
                                    <div className="w-full rounded-t-xl border-x border-t border-dark/10 bg-dark-green-10" />
                                </div>
                            </div>
                        ) : null}
                        <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
                            <caption className="sr-only">Pricing plan comparison</caption>
                            <colgroup>
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                            </colgroup>
                            <thead>
                            <tr>
                                <td />
                                {tiers.map((tier) => (
                                    <th key={tier.id} scope="col" className="px-6 pt-6 xl:px-8">
                                        <div className="text-sm/7 font-semibold text-dark">{tier.name}</div>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">
                                    <span className="sr-only">Price</span>
                                </th>
                                {tiers.map((tier) => (
                                    <td key={tier.id} className="px-6 pt-2 xl:px-8">
                                        <div className="flex items-baseline gap-x-1 text-dark">
                                            <span className="text-4xl font-semibold">{tier.priceMonthly}</span>
                                            <span className="text-sm/6 font-semibold">/month</span>
                                        </div>
                                        <a
                                            href={tier.href}
                                            className={classNames(
                                                'bg-cta-green text-white hover:bg-dark-green',
                                                'mt-8 block rounded-md px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-green',
                                            )}
                                        >
                                            Buy plan
                                        </a>
                                    </td>
                                ))}
                            </tr>
                            {sections.map((section, sectionIdx) => (
                                <Fragment key={section.name}>
                                    <tr>
                                        <th
                                            scope="colgroup"
                                            colSpan={4}
                                            className={classNames(
                                                sectionIdx === 0 ? 'pt-8' : 'pt-16',
                                                'pb-4 text-sm/6 font-semibold text-dark',
                                            )}
                                        >
                                            {section.name}
                                            <div className="absolute inset-x-8 mt-4 h-px bg-dark/10" />
                                        </th>
                                    </tr>
                                    {section.features.map((feature) => (
                                        <tr key={feature.name}>
                                            <th scope="row" className="py-4 text-sm/6 font-normal text-dark"> {/* dunkler Text */}
                                                {feature.name}
                                                <div className="absolute inset-x-8 mt-4 h-px bg-dark-6" />
                                            </th>
                                            {tiers.map((tier) => (
                                                <td key={tier.id} className="px-6 py-4 xl:px-8">
                                                    {typeof feature.tiers[tier.name] === 'string' ? (
                                                        <div className="text-center text-sm/6 text-dark">{feature.tiers[tier.name]}</div>
                                                    ) : (
                                                        <>
                                                            {feature.tiers[tier.name] === true ? (
                                                                <CheckIcon aria-hidden="true" className="mx-auto size-5 text-dark-green" />
                                                            ) : (
                                                                <MinusIcon aria-hidden="true" className="mx-auto size-5 text-dark" />
                                                            )}
                                                            <span className="sr-only">
                                  {feature.tiers[tier.name] === true ? 'Included' : 'Not included'} in {tier.name}
                                </span>
                                                        </>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
