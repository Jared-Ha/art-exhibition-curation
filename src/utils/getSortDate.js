export function getSortDate(object) {
  // For Met objects:
  if (object.objectBeginDate) {
    return parseInt(object.objectBeginDate, 10);
  }

  // For V&A objects
  if (object.record) {
    if (
      object.record.productionDates &&
      object.record.productionDates.length > 0
    ) {
      const earliest = object.record.productionDates[0].date?.earliest;
      if (earliest) {
        return new Date(earliest).getFullYear();
      }
    }
  }

  return 9999;
}
