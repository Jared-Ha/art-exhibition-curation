import axios from "axios";
// import pluralize from "pluralize";

const vaApi = axios.create({
  baseURL: "https://api.vam.ac.uk/v2",
});

const metApi = axios.create({
  baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
});

const typeToMetMedium = {
  painting: "Paintings",
  sculpture: "Sculpture",
  ceramic: "Ceramics",
  antiquities: "",
  drawing: "Drawings",
  print: "Prints",
  engraving: "Engravings",
  relief: "",
  manuscript: "",
  mosaic: "",
  artifact: "",
  bronze: "",
  marble: "",
  textile: "", // fallback to query keyword
};

export const getMetObjects = (query, objectType = "") => {
  const baseQuery = query.replace(/\s+/g, "+");
  const encodedQuery = encodeURIComponent(baseQuery);
  // Determine the Met medium if available.
  const medium = objectType ? typeToMetMedium[objectType] : "";

  const params = { q: encodedQuery };
  if (medium) {
    params.medium = medium;
  }

  let metUrl = `${metApi.defaults.baseURL}/search?q=${encodedQuery}`;
  if (medium) {
    metUrl += `&medium=${encodeURIComponent(medium)}`;
  }
  console.log("Final Met API URL:", metUrl);

  return metApi
    .get("/search", { params })
    .then((searchResponse) => {
      if (!searchResponse.data.objectIDs) return [];
      console.log("MET searchResponse:", searchResponse.data);
      const objectRequests = searchResponse.data.objectIDs
        .slice(0, 8)
        .map((id) =>
          metApi
            .get(`/objects/${id}`)
            .then((res) => {
              console.log(`Fetched MET object ${id}:`, res.data);
              return res.data;
            })
            .catch(() => null)
        );
      return Promise.all(objectRequests);
    })
    .then((responses) => {
      console.log("MET call pre filter", responses);
      // Filter out objects that don't have an image (or objectURL fallback).
      const validObjects = responses.filter((obj) => {
        if (!obj) return false;
        const hasImages =
          obj.primaryImage ||
          obj.primaryImageSmall ||
          (obj.additionalImages && obj.additionalImages.length > 0);
        const hasOGFallback = obj.objectURL;
        return hasImages || hasOGFallback;
      });

      // const objectText = [
      //   obj.title,
      //   obj.medium,
      //   obj.department,
      //   obj.period,
      //   obj.country,
      //   obj.region,
      //   obj.artistDisplayName,
      //   obj.artistAlphaSort,
      //   obj.objectName,
      //   obj.classification,
      //   obj.constituents?.map((c) => c.role).join(" "),
      //   obj.tags?.map((tag) => tag.term).join(" "),
      // ]
      //   .filter(Boolean)
      //   .map((text) => String(text).toLowerCase())
      //   .join(" ");

      // console.log("objectText", objectText);

      // const queryWords = combinedQuery.toLowerCase().split(/\+/);
      // console.log("queryWords", queryWords);

      //   return queryWords.every((word) => {
      //     const singular = pluralize.singular(word);
      //     const plural = pluralize.plural(word);
      //     return objectText.includes(singular) || objectText.includes(plural);
      //   });
      // });
      console.log("MET call post filter", validObjects);
      return validObjects.filter((obj) => obj !== null).slice(0, 8);
    })
    .catch((error) => {
      console.error("Error fetching from The Met:", error);
      return [];
    });
};

//////////////////

// --- V&A API Code ---
export const getVAObjects = (query, objectType = "") => {
  const formattedQuery = query.replace(/\s+/g, "+");
  let typeParams = "";
  if (objectType) {
    typeParams = `&kw_object_type=${objectType}`;
  } else {
    typeParams = `&kw_object_type=painting
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
      &kw_object_type=textile
      &kw_object_type=metalwork
      &kw_object_type=jewellery`.replace(/\s+/g, "");
  }

  const vaUrl = `${vaApi.defaults.baseURL}/objects/search?q=${formattedQuery}&images_exist=true&page_size=4&response_format=json${typeParams}`;
  console.log("Final V&A API URL:", vaUrl);

  return vaApi
    .get(vaUrl)
    .then((response) => {
      const summaryRecords = response.data.records || [];
      console.log("V&A summary records:", summaryRecords);
      const fullObjectRequests = summaryRecords.map((record) =>
        getVAObjectById(record.systemNumber).catch(() => null)
      );
      return Promise.all(fullObjectRequests);
    })
    .then((fullObjects) => {
      const validObjects = fullObjects.filter((obj) => obj !== null);
      console.log("Full V&A objects:", validObjects);
      return validObjects;
    })
    .catch((error) => {
      console.error("Error fetching from V&A:", error);
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
