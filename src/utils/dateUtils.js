export const formatFirestoreDate = (timestamp) => {
  if (!timestamp) return "No date";

  if (typeof timestamp === "string") {
    if (timestamp.includes("T") || timestamp.includes("-")) {
      try {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (e) {
        return timestamp;
      }
    }
    return timestamp;
  }

  if (timestamp && typeof timestamp === "object" && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return "Date unavailable";
};
