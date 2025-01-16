import {
    CalendarIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

const navigation = [
    {
        name: "Dashboard",
        href: "/club-backend/page.tsx",
        icon: HomeIcon,
        current: true,
        children: [],
    },
    {
        name: "Cub-Seite",
        href: "#",
        icon: UsersIcon,
        current: false,
        children: [
            { name: "Inhalt", href: "/club-backend/cubseite/inhalt/page.tsx" },
            { name: "Bilder & Videos", href: "/club-backend/cubseite/bilder-vidoes/page.tsx" },
            { name: "Kooperationen", href: "/club-backend/cubseite/kooperationen/page.tsx" },
        ],
    },
    {
        name: "Administration",
        href: "#",
        icon: FolderIcon,
        current: false,
        children: [
            { name: "Abonnement", href: "/club-backend/administration/abonnement-rechnungen/page.tsx" },
            { name: "Einstellungen", href: "/club-backend/administration/einstellungen/page.tsx" },
        ],
    },
    {
        name: "Inbox",
        href: "/club-backend/inbox/page.tsx",
        icon: CalendarIcon,
        current: false,
        children: [],
    },
    {
        name: "Profil",
        href: "/club-backend/profil/page.tsx",
        icon: DocumentDuplicateIcon,
        current: false,
        children: [],
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function VerticalNavigation() {
    return (
        <nav aria-label="Sidebar" className="flex flex-1 flex-col">
            <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                    <li key={item.name} className="group">
                        {/* Hauptpunkt */}
                        <a
                            href={item.href}
                            className={classNames(
                                item.current
                                    ? "bg-gray-50 text-green-800"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-green-800",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            )}
                        >
                            <item.icon
                                aria-hidden="true"
                                className={classNames(
                                    item.current
                                        ? "text-green-800"
                                        : "text-gray-400 group-hover:text-green-800",
                                    "size-6 shrink-0"
                                )}
                            />
                            {item.name}
                        </a>

                        {/* Unterpunkte */}
                        {item.children?.length > 0 && (
                            <ul className="ml-6 mt-1 space-y-1">
                                {item.children.map((subItem) => (
                                    <li key={subItem.name}>
                                        <a
                                            href={subItem.href}
                                            className="text-gray-600 hover:text-green-800 flex gap-x-2 rounded-md p-2 text-sm font-medium"
                                        >
                                            - {subItem.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}