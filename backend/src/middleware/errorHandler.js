import { ZodError } from "zod";

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    const fieldErrors = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "body";
      fieldErrors[key] = issue.message;
    }
    return res.status(400).json({ message: "Validation error", fieldErrors });
  }

  if (err && err.status) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}
