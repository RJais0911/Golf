function paginate(query, page = 1, limit = 20) {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.max(Number(limit) || 20, 1);
  const skip = (parsedPage - 1) * parsedLimit;
  return query.skip(skip).limit(parsedLimit);
}

module.exports = paginate;
