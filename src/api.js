import axios from "axios";

const vaApi = axios.create({
  baseURL: "https://api.vam.ac.uk/v2/objects/search",
});

const metApi = axios.create({
  baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
});

export const getVAObjects = (query) => {
  const vaUrl = `https://api.vam.ac.uk/v2/objects/search?q=${query}&images_exist=true&page_size=10&response_format=json`;
  console.log("V&A API URL:", vaUrl); // Log the final V&A API URL

  return vaApi
    .get("/", {
      params: {
        q: query,
        images_exist: true,
        page_size: 10,
        response_format: "json",
      },
    })
    .then((response) => response.data.records || [])
    .catch((error) => {
      console.error("Error fetching from V&A:", error);
      return [];
    });
};

export const getMetObjects = (query) => {
  const metUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}&hasImages=true`;
  console.log("The Met API URL:", metUrl); // Log the final Met API URL

  return metApi
    .get("/search", { params: { q: query, hasImages: true } })
    .then((searchResponse) => {
      if (!searchResponse.data.objectIDs) return [];
      const objectRequests = searchResponse.data.objectIDs
        .slice(0, 10)
        .map((id) => metApi.get(`/objects/${id}`));

      return Promise.all(objectRequests);
    })
    .then((responses) => responses.map((res) => res.data))
    .catch((error) => {
      console.error("Error fetching from The Met:", error);
      return [];
    });
};
