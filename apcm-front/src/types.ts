export interface LexicalTextNode {
    detail?: number;
    format?: number;
    mode?: string;
    style?: string;
    text: string;
    type: "text";
    version: number;
}

export interface LexicalElementNode {
    children: (LexicalElementNode | LexicalTextNode)[];
    direction?: string;
    format?: string;
    indent?: number;
    type: string;
    version: number;
    tag?: string; // Pour les balises comme h1, h2
    textFormat?: number;
    textStyle?: string;
}

export interface LexicalRoot {
    root: LexicalElementNode;
}



export type Article = {
    id: string;
    title: string;
    date?: string;
    content: LexicalRoot;
    content_html: string;
    image: Media;
}

export type Association = {
    id: string;
    title: string;
    subtitle:string;
    description: string;
    mentions:string;
    image?: Media;
    logo?: Media;
    date?: string;
    status?: string;
    updatedAt: string;
    createdAt: string;
    whatsapp?: string;
}

export type Media = {
    id: string;
    alt?: string;
    updatedAt: string;
    createdAt: string;
    filename?: string;
    }
