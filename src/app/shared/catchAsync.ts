import type { NextFunction, RequestHandler, Request, Response } from "express";

const catchAsync=(fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next);
    }catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
      error: error,
    });
  }
  }
};

export default catchAsync;