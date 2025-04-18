const bio = {
    name: 'bio',
    type: 'document',
    title: 'Bio',
    fields: [
      {
        name: 'heading',
        type: 'string',
        title: 'Heading (optional)',
      },
      {
        name: 'short',
        type: 'text',
        title: 'Short Bio (Preview)',
      },
      {
        name: 'full',
        type: 'text',
        title: 'Full Bio',
      },
      {
        name: 'image',
        type: 'image',
        title: 'Profile Image',
        options: {
          hotspot: true,
        },
      },
    ],
  }
  
  export default bio
  