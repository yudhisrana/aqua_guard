import { z } from "zod"

const loginSchema = z.object({
  username: z.string().min(1, "username wajib diisi"),
  password: z.string().min(1, "password wajib diisi"),
})

export default loginSchema
