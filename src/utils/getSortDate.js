export function getSortDate(object) {
  // For Met objects:
  if (object.objectBeginDate) {
    return parseInt(object.objectBeginDate, 10);
  }

  // For V&A objects:
  if (object.record?.productionDates?.length) {
    const prodDate = object.record.productionDates[0].date;
    let earliestYear, latestYear;
    if (prodDate.earliest) {
      earliestYear = new Date(prodDate.earliest).getFullYear();
    }
    if (prodDate.latest) {
      latestYear = new Date(prodDate.latest).getFullYear();
    }
    if (earliestYear && latestYear) {
      return Math.floor((earliestYear + latestYear) / 2);
    }
    if (earliestYear) {
      return earliestYear;
    }
    if (latestYear) {
      return latestYear;
    }
  }

  // Fallback if no valid date is found.
  return 9999;
}
