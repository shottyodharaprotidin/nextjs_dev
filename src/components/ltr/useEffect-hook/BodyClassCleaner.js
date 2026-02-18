"use client";

import useRemoveBodyClass from "./useEffect-hook";

/**
 * Client component that removes specific body classes on mount.
 * Use this in server components to clean up body classes added by other pages.
 */
export default function BodyClassCleaner({ remove = [], add = [] }) {
    useRemoveBodyClass(add, remove);
    return null;
}
