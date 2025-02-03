import { HTMLConverterFeature, lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical'
import {CollectionConfig} from "payload";





const Association: CollectionConfig = {
    slug: 'association',

    admin: {
        useAsTitle: 'title',
    },
    hooks: {
        beforeChange: [
            async ({ req, operation }) => {
                if (operation === "create") {
                    const existing = await req.payload.find({
                        collection: "association",
                    });

                    if (existing.totalDocs > 0) {
                        throw new Error("Une seule association est autorisée.");
                    }
                }
            },
        ],
    },
    access: {
        read: () => true,
        create: () => true,
        delete: () => false,
        update: async ({ req }) => {
            // ✅ Autoriser uniquement si un document existe déjà
            const { payload } = req;
            const associations = await payload.find({
                collection: 'association',
            });

            return associations.totalDocs > 0;
        },
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'subtitle',
            type: 'text',
            required: true,
        },
        {
            name: 'description_txt',
            type: 'richText',
            editor: lexicalEditor({
                features: ({defaultFeatures}) => [
                    ...defaultFeatures,
                    HTMLConverterFeature({}),
                ],
            }),
        },
        lexicalHTML('description_txt', { name: 'description' }),

        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'updatedAt',
            type: 'date',
            admin: { readOnly: true },
            defaultValue: () => new Date(),
        },
        {
            name: 'mentions_txt',
            type: 'richText',
            editor: lexicalEditor({
                features: ({defaultFeatures}) => [
                    ...defaultFeatures,
                    HTMLConverterFeature({}),
                ],
            }),
        },
        lexicalHTML('mentions_txt', { name: 'mentions' }),

        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'facebook',
            type: 'text',
        },
        {
            name: 'whatsapp',
            type: 'text',
        },
    ],
};

export default Association;
