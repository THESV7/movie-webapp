const adultRegex = /\b(porn|porno|pornography|xxx|erotica|erotic|softcore|bdsm|nympho|incest|kamasutra)\b/i;

export const filterAdult = (results) => {
  if (!results || !Array.isArray(results)) return [];
  
  return results.filter(item => {
    // TMDB official flag
    if (item.adult === true) return false;
    
    // Fallback regex matching
    const textToCheck = `${item.title || ''} ${item.name || ''} ${item.original_title || ''} ${item.overview || ''}`;
    if (adultRegex.test(textToCheck)) return false;
    
    return true;
  });
};
