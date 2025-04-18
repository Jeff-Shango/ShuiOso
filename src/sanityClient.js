import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "30dddoth", // Your actual project ID
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-01-01",
});

export default sanityClient;
