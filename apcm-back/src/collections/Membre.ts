import {CollectionConfig} from "payload";

const Membre: CollectionConfig = {
    slug: 'membres',
    admin: {
        useAsTitle: 'firstName',
    },
    fields: [
        {
            name: 'firstName',
            type: 'text',
            required: true,
        },
        {
            name: 'lastName',
            type: 'text',
            required: true,
        },
        {
            name: 'photo',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'role',
            type: 'text',
        },
    ],
};

export default Membre;
