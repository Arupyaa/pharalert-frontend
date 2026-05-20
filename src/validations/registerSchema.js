import * as z from "zod";

//  Company
// Backend: companyName, email, password, phoneNumber(optional), documentImageUrl(required URL)
export const companySchema = z
  .object({
    companyName: z.string().min(2, "Company name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[0-9+\-\s()]+$/, "Invalid phone number")
      .optional()
      .or(z.literal("")),
    // Required by backend as valid URL
    documentImageUrl: z.string().url("Must be a valid URL (e.g. https://...)"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

//  Pharmacy
// Backend: name, email, password, address, latitude, longitude, regionId, documentImageUrl(required URL)
export const pharmacySchema = z
  .object({
    name: z.string().min(2, "Pharmacy name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    address: z.string().min(5, "Address is required"),
    latitude: z.coerce
      .number({ invalid_type_error: "Pick your location on the map" })
      .min(-90)
      .max(90)
      .refine((v) => v !== 0, "Pick your location on the map"),
    longitude: z.coerce
      .number({ invalid_type_error: "Pick your location on the map" })
      .min(-180)
      .max(180)
      .refine((v) => v !== 0, "Pick your location on the map"),
    regionId: z
      .string()
      .min(1, "Region is required")
      .transform((v) => Number(v))
      .refine((v) => !isNaN(v) && v > 0, "Region is required"),
    // Backend expects documentImageUrl (not licenseImageUrl)
    documentImageUrl: z.string().url("Must be a valid URL (e.g. https://...)"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

//  User
// Backend: userName, email, password, phoneNumber(optional)
export const userSchema = z
  .object({
    userName: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[0-9+\-\s()]+$/, "Invalid phone number")
      .optional()
      .or(z.literal("")),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SCHEMA_MAP = {
  companies: companySchema,
  pharmacies: pharmacySchema,
  users: userSchema,
};
