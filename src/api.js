import axios from "axios";
import pLimit from "p-limit";
const limit = pLimit(5);

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

export const getMetObjects = (query, objectType = "", dateBegin, dateEnd) => {
  let effectiveQuery = "";
  if (!query && objectType) {
    effectiveQuery = objectType;
  } else if (query && objectType && typeToMetMedium[objectType] === "") {
    effectiveQuery = `${query} ${objectType}`;
  } else {
    effectiveQuery = query;
  }

  const baseQuery = effectiveQuery.replace(/\s+/g, "+");
  const encodedQuery = encodeURIComponent(baseQuery);
  const medium = objectType ? typeToMetMedium[objectType] : "";

  const params = { q: encodedQuery };
  if (medium) {
    params.medium = medium;
  }
  if (dateBegin !== "" && dateBegin) {
    params.dateBegin = dateBegin;
  }
  if (dateEnd !== "" && dateEnd) {
    params.dateEnd = dateEnd;
  }

  let metUrl = `${metApi.defaults.baseURL}/search?q=${encodedQuery}`;
  if (medium) {
    metUrl += `&medium=${encodeURIComponent(medium)}`;
  }
  if (dateBegin !== "" && dateBegin) {
    metUrl += `&dateBegin=${dateBegin}`;
  }
  if (dateEnd !== "" && dateEnd) {
    metUrl += `&dateEnd=${dateEnd}`;
  }
  // console.log("Final Met API URL:", metUrl);

  return metApi
    .get("/search", { params })
    .then((searchResponse) => {
      if (!searchResponse.data.objectIDs) return [];
      const objectRequests = searchResponse.data.objectIDs
        .slice(0, 50)
        .map((id) => getMetObjectById(id));
      return Promise.all(objectRequests);
    })
    .then((responses) => {
      const validObjects = responses.filter((obj) => {
        if (!obj) return false;
        const hasImages =
          obj.primaryImage ||
          obj.primaryImageSmall ||
          (obj.additionalImages && obj.additionalImages.length > 0);
        const hasOGFallback = obj.objectURL;
        return hasImages || hasOGFallback;
      });
      const filteredObjects = validObjects.filter((obj) => {
        const queryWords = effectiveQuery.toLowerCase().split(/\s+/);
        const objectText = [
          obj.title,
          obj.medium,
          obj.department,
          obj.period,
          obj.country,
          obj.region,
          obj.artistDisplayName,
          obj.artistAlphaSort,
          obj.objectName,
          obj.classification,
          obj.constituents?.map((c) => c.role).join(" "),
          obj.tags?.map((tag) => tag.term).join(" "),
        ]
          .filter(Boolean)
          .map((text) => String(text).toLowerCase())
          .join(" ");
        return queryWords.some((word) => objectText.includes(word));
      });
      return filteredObjects;
    })
    .catch((error) => {
      console.error("Error fetching from The Met:", error);
      return [];
    });
};

// --- V&A API Code ---
export const getVAObjects = (
  query,
  objectType = "",
  yearMadeFrom,
  yearMadeTo
) => {
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
      &kw_object_type=ceramic
      &kw_object_type=bronze
      &kw_object_type=marble
      &kw_object_type=textile`.replace(/\s+/g, "");
  }

  let dateParams = "";
  if (yearMadeFrom !== "" && yearMadeFrom) {
    dateParams += `&year_made_from=${yearMadeFrom}`;
  }
  if (yearMadeTo !== "" && yearMadeTo) {
    dateParams += `&year_made_to=${yearMadeTo}`;
  }

  const vaUrl = `${vaApi.defaults.baseURL}/objects/search?q=${formattedQuery}&images_exist=true&page_size=75&response_format=json${typeParams}${dateParams}`;

  return vaApi
    .get(vaUrl)
    .then((response) => {
      const summaryRecords = response.data.records || [];
      const fullObjectRequests = summaryRecords.map((record) =>
        limit(() => getVAObjectById(record.systemNumber).catch(() => null))
      );
      return Promise.all(fullObjectRequests);
    })
    .then((fullObjects) => {
      const validObjects = fullObjects.filter((obj) => obj !== null);
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
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(`Error fetching Met object ${id}:`, error);
      return null;
    });
};
