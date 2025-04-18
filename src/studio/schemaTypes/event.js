const event = {
    name: 'event',
    type: 'document',
    title: 'Event',
    fields: [
      { name: 'title', type: 'string', title: 'Title' },
      { name: 'date', type: 'datetime', title: 'Event Date' },
      { name: 'location', type: 'string', title: 'Location' },
      {
        name: 'image',
        type: 'image',
        title: 'Event Image',
        options: { hotspot: true },
      },
      { name: 'description', type: 'text', title: 'Description' },
    ],
  }
  
  export default event
  