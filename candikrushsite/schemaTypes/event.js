export default {
    name: "event",
    title: "Events",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Event Title",
        type: "string",
      },
      {
        name: "date",
        title: "Event Date",
        type: "string",
      },
      {
        name: "image",
        title: "Event Image",
        type: "image",
        options: {
          hotspot: true,
        },
      },
    ],
  };
  