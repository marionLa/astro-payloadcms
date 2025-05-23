import { CollectionConfig, PayloadRequest } from 'payload'
import { HTMLConverterFeature, lexicalEditor, lexicalHTML, UploadFeature, convertLexicalToHTML } from '@payloadcms/richtext-lexical'





const Article: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HTMLConverterFeature({}),
          UploadFeature({
            collections: {
              uploads: {
                // Example showing how to customize the built-in fields
                // of the Upload feature
                fields: [
                  {
                    name: 'media',
                    type: 'Media',
                    relationTo: 'media',
                  },
                ],
              },
            },
          }),
        ],

      }),

    },

    lexicalHTML('content', { name: 'content_html' }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    }
  ],

}

export default Article
