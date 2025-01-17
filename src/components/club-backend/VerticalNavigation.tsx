import {
    HomeIcon,
    UsersIcon,
    ChevronRightIcon,
    Cog6ToothIcon,
    InboxArrowDownIcon,
    UserCircleIcon,
    ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { NavigationItems } from "@/types/backend-types"; // Aktualisierter Import
import NaviAvatar from "@/components/club-backend/NaviAvatar";

const navigation: NavigationItems = [
    {
        name: "Dashboard",
        href: "/club-backend",
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
            { name: "Inhalt", href: "/club-backend/cubseite/inhalt" },
            { name: "Bilder & Videos", href: "/club-backend/cubseite/bilder-vidoes" },
            { name: "Kooperationen", href: "/club-backend/cubseite/kooperationen" },
        ],
    },
    {
        name: "Administration",
        href: "#",
        icon: Cog6ToothIcon,
        current: false,
        children: [
            { name: "Abonnement", href: "/club-backend/administration/abonnement-rechnungen" },
            { name: "Einstellungen", href: "/club-backend/administration/einstellungen" },
        ],
    },
    {
        name: "Inbox",
        href: "/club-backend/inbox",
        icon: InboxArrowDownIcon,
        current: false,
        children: [],
    },
    {
        name: "Profil",
        href: "/club-backend/profil",
        icon: UserCircleIcon,
        current: false,
        children: [],
    },
];

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function VerticalNavigation() {
    return (
        <nav
            aria-label="Sidebar"
            className="flex flex-1 flex-col py-6" // Erhöhtes Padding oben und unten
        >
            <div className={"mb-12"}>
                <NaviAvatar/>
            </div>
            <ul role="list" className="-mx-2 space-y-1 flex-1">
                {navigation.map((item) => (
                    <li key={item.name} className="group">
                        {/* Hauptpunkt */}
                        <a
                            href={item.href}
                            className={classNames(
                                item.current
                                    ? "bg-gray-50 text-green-800"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-green-800",
                                "group flex gap-x-3 rounded-md p-3 text-sm/6 font-extrabold"
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
                        {item.children?.length ? (
                            <ul className="mt-1 space-y-1">
                                {item.children.map((subItem) => (
                                    <li key={subItem.name}>
                                        <a
                                            href={subItem.href}
                                            className="text-gray-700 hover:text-green-800 flex items-center gap-x-2 rounded-md p-2 text-sm font-medium"
                                        >
                                            <ChevronRightIcon
                                                className="h-4 w-4 text-gray-500 group-hover:text-green-800"
                                                aria-hidden="true"
                                            />
                                            {subItem.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </li>
                ))}
            </ul>

            {/* Logout Button */}
            <div className="mt-4 border-t border-gray-200 pt-4">
                <button
                    type="button"
                    className="group flex w-full items-center gap-x-3 rounded-md p-3 text-sm/6 font-extrabold text-gray-700 hover:bg-gray-50 hover:text-red-600"
                    // onClick={() => console.log('Logout')} // Logout-Handler
                >
                    <ArrowLeftOnRectangleIcon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-400 group-hover:text-red-600"
                    />
                    Logout
                </button>
            </div>
        </nav>
    );
}