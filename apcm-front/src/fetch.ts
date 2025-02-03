import type { Article, Association } from './types.ts'

const API_URL = import.meta.env.PUBLIC_API_URL;

export async function fetchAssociation(): Promise<Association | null> {
    try {
        const res = await fetch(`${API_URL}/association?limit=1`);

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.statusText}`);
        }

        const data = await res.json();
        return data?.docs[0] as Association;
    } catch (error) {
        console.error("Erreur lors du fetch de l'association :", error);
        return null;
    }
}

export async function fetchArticles(): Promise<Article[]> {
    try {
        const res = await fetch(`${API_URL}/articles`);

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.statusText}`);
        }

        const data = await res.json();
        return data?.docs as Article[];
    } catch (error) {
        console.error("Erreur lors du fetch de des articles :", error);
        return [];
    }
}

