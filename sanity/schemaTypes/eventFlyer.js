import {defineField, defineType} from 'sanity'

export const eventFlyer = defineType({
  name: 'eventFlyer',
  title: 'Event Flyer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event date & time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'venue', title: 'Venue', type: 'string'}),
    defineField({name: 'city', title: 'City', type: 'string'}),
    defineField({
      name: 'flyerImage',
      title: 'Flyer image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'ticketUrl', title: 'Ticket/RSVP link', type: 'url'}),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'flyerImage',
      date: 'eventDate',
      venue: 'venue',
    },
    prepare({title, media, date, venue}) {
      const subtitleParts = []
      if (date) subtitleParts.push(new Date(date).toLocaleString())
      if (venue) subtitleParts.push(venue)
      return {title, media, subtitle: subtitleParts.join(' • ')}
    },
  },
})
