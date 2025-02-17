import axios from "axios";

const vaApi = axios.create({
  baseURL: "https://api.vam.ac.uk/v2",
});

const metApi = axios.create({
  baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
});

export const getVAObjects = (query) => {
  const formattedQuery = query.replace(/\s+/g, "+");

  const vaUrl =
    `${vaApi.defaults.baseURL}/objects/search?q=${formattedQuery}&images_exist=true&page_size=10&response_format=json
      &kw_object_type=painting
      &kw_object_type=sculpture
      &kw_object_type=drawing
      &kw_object_type=print
      &kw_object_type=relief
      &kw_object_type=manuscript
      &kw_object_type=engraving
      &kw_object_type=mosaic
      &kw_object_type=artifact
      &kw_object_type=antiquities
      &kw_object_type=ceramic
      &kw_object_type=bronze
      &kw_object_type=marble
      &kw_object_type=textile`.replace(/\s+/g, "");

  console.log("Final V&A API URL:", vaUrl);

  return vaApi
    .get(vaUrl)
    .then((response) => response.data.records || [])
    .catch((error) => {
      console.error("Error fetching from V&A:", error);
      return [];
    });
};

export const getMetObjects = (query) => {
  const encodedQuery = encodeURIComponent(query);

  console.log("Fetching Met search results for:", query);

  return metApi
    .get("/search", {
      params: {
        q: encodedQuery,
        hasImages: true,
      },
    })
    .then((searchResponse) => {
      if (!searchResponse.data.objectIDs) return [];

      const objectRequests = searchResponse.data.objectIDs
        .slice(0, 40)
        .map((id) =>
          metApi
            .get(`/objects/${id}`)
            .then((res) => res.data)
            .catch(() => null)
        );

      return Promise.all(objectRequests);
    })
    .then((responses) =>
      responses.filter((obj) => {
        if (!obj) return false;

        const queryWords = query.toLowerCase().split(/\s+/);
        const objectText = [
          obj.title,
          obj.medium,
          obj.department,
          obj.period, // Middle Kingdom, Second Intermediate Period
          obj.country, // Egypt, France, USA
          obj.region,
          obj.artistDisplayName,
          obj.artistAlphaSort,
          obj.objectName, // "Painting", "Bust"
          obj.classification, // "Sculpture", "Ceramics"
          obj.constituents?.map((c) => c.role).join(" "),
          obj.tags?.map((tag) => tag.term).join(" "),
        ]
          .filter(Boolean)
          .map((text) => text.toLowerCase())
          .join(" ");

        return queryWords.every((word) => objectText.includes(word));
      })
    )
    .catch((error) => {
      console.error("Error fetching from The Met:", error);
      return [];
    });
};

export const getVAObjectById = (systemNumber) => {
  return vaApi
    .get(`/object/${systemNumber}`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Error fetching V&A object ${systemNumber}:`, error);
      return null;
    });
};

export const getMetObjectById = (id) => {
  return metApi
    .get(`/objects/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Error fetching Met object ${id}:`, error);
      return null;
    });
};
