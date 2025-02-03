import {CollectionConfig} from "payload";

const Action: CollectionConfig = {
    slug: 'actions',
    admin: {
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'date',
            type: 'date',
        },
        {
            name: 'status',
            type: 'select',
            options: ['en cours', 'terminée', 'à venir'],
            defaultValue: 'en cours',
        },
    ],
};

export default Action;
