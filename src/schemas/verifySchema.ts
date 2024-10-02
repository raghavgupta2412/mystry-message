import { z } from "zod";

export const verigySchema = z.object({
  code: z.string().min(6, "verification code must be 6 digits"),
});
