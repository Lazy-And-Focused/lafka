import type { Metadata } from "next";

import { APP_NAME } from "@/shared/lib/constants";
import { APP_META_TITLE, APP_META_DESCRIPTION, APP_META_CATEGORY } from "../_lib/constants";

export const metadata: Metadata = {
    title: APP_META_TITLE,
    description: APP_META_DESCRIPTION,
    applicationName: APP_NAME,
    authors: [
        { name: "Lazy And Focused (LAF Team)", url: "http://laf-team.ru/" },
        { name: 'Valentin Bird (lanvalird)', url: 'https://lanvalird.ru/' },
        { name: 'FOCKUSTY', url: 'https://fockusty.netlify.app/' },
    ],
    category: APP_META_CATEGORY,
};