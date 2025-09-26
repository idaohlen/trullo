import type { PipelineStage } from "mongoose";

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

export async function paginateAggregate<T>(
  model: any,
  basePipeline: PipelineStage[],
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 25 } = options;
  const skip = (page - 1) * limit;

  // Get total count first
  const countPipeline = [
    ...basePipeline,
    { $count: "total" }
  ];
  
  const countResult = await model.aggregate(countPipeline);
  const totalCount = countResult[0]?.total || 0;

  // Get paginated items
  let items: T[];
  if (limit > 0) {
    const paginatedPipeline = [
      ...basePipeline,
      { $skip: skip },
      { $limit: limit }
    ];
    items = await model.aggregate(paginatedPipeline);
  } else {
    // If limit is 0 or negative, return all items
    items = await model.aggregate(basePipeline);
  }

  const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;

  return {
    items,
    totalCount,
    hasNextPage: skip + items.length < totalCount,
    hasPreviousPage: page > 1,
    currentPage: page,
    totalPages
  };
}

export async function paginateFind<T>(
  query: any,
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 25 } = options;
  const skip = (page - 1) * limit;

  // Get total count
  const totalCount = await query.model.countDocuments(query.getFilter());

  // Get paginated items
  let items: T[];
  if (limit > 0) {
    items = await query.skip(skip).limit(limit);
  } else {
    items = await query;
  }

  const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;

  return {
    items,
    totalCount,
    hasNextPage: skip + items.length < totalCount,
    hasPreviousPage: page > 1,
    currentPage: page,
    totalPages
  };
}
