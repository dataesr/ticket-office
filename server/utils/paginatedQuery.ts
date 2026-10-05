import db from "../libs/mongo";

type PaginationOptions = {
  sort?: string;
  page?: number | string;
  max_results?: number | string;
};

export async function findPaginated(
  collection: string,
  filters: Record<string, any>,
  { sort = "created_at", page = 1, max_results }: PaginationOptions = {}
): Promise<{ rows: any[]; total: number }> {
  const limit = parseInt(String(max_results ?? ""), 10) || 2000;
  const skip = (parseInt(String(page), 10) - 1) * limit;
  const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
  const sortOrder = sort.startsWith("-") ? -1 : 1;

  const col = db.collection(collection);
  const [total, rows] = await Promise.all([
    col.countDocuments(filters),
    col
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray(),
  ]);

  return { rows, total };
}
