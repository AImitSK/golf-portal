import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = DropdownMenuPrimitive.Content;
export const DropdownMenuItem = DropdownMenuPrimitive.Item;

// Beispiel für ein Dropdown-Menü
export const MyDropdownMenu = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Open Menu
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border rounded shadow-md p-2">
            <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100">Item 1</DropdownMenuItem>
            <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100">Item 2</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);
