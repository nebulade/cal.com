import { describe, it, expect } from "vitest";

import { determineReadOnlyForNameField } from "./determineReadOnlyForNameField";

describe("determineReadOnlyForNameField", () => {
  const createField = ({
    variant,
    lastNameRequired,
  }: { variant?: string; lastNameRequired?: boolean } = {}) => ({
    variant,
    variantsConfig: {
      variants: {
        fullName: {
          fields: [{ name: "fullName" as const, required: true }],
        },
        firstAndLastName: {
          fields: [{ name: "lastName" as const, required: lastNameRequired }],
        },
      },
    },
  });

  it("returns false for non-reschedule bookings", () => {
    const result = determineReadOnlyForNameField({
      field: createField(),
      nameResponse: "",
      isReschedule: false,
      isNameFieldDirty: false,
    });

    expect(result).toBe(false);
  });

  it("returns false if name field is dirty even when last name is required and present", () => {
    const result = determineReadOnlyForNameField({
      field: createField({
        variant: "firstAndLastName",
        lastNameRequired: true,
      }),
      nameResponse: {
        firstName: "John",
        lastName: "Doe",
      },
      isReschedule: true,
      isNameFieldDirty: true,
    });

    expect(result).toBe(false);
  });

  describe("Reschedule Case", () => {
    const rescheduleProps = { isReschedule: true, isNameFieldDirty: false };

    it("returns true when variant is firstAndLastName and lastName is required and also present", () => {
      const result = determineReadOnlyForNameField({
        field: createField({ variant: "firstAndLastName", lastNameRequired: true }),
        nameResponse: {
          firstName: "John",
          lastName: "Doe",
        },
        ...rescheduleProps,
      });

      expect(result).toBe(true);
    });

    it("returns false when variant is firstAndLastName and lastName is required but not present", () => {
      const result = determineReadOnlyForNameField({
        field: createField({ variant: "firstAndLastName", lastNameRequired: true }),
        nameResponse: {
          firstName: "John",
          lastName: "",
        },
        ...rescheduleProps,
      });

      expect(result).toBe(false);
    });

    it("returns false when variant is firstAndLastName(with lastName required) and name is provided as a string ", () => {
      const result = determineReadOnlyForNameField({
        field: createField({ variant: "firstAndLastName", lastNameRequired: true }),
        nameResponse: "John",
        ...rescheduleProps,
      });

      expect(result).toBe(false);
    });

    it("returns true when variant is fullName", () => {
      const result = determineReadOnlyForNameField({
        field: createField({ variant: "fullName" }),
        nameResponse: "John Doe",
        ...rescheduleProps,
      });

      expect(result).toBe(true);
    });

    it("returns true when variants are not defined", () => {
      const result = determineReadOnlyForNameField({
        field: createField(),
        nameResponse: "John",
        ...rescheduleProps,
      });

      expect(result).toBe(true);
    });

    it("returns true when firstAndLastName variant is not defined", () => {
      const result = determineReadOnlyForNameField({
        field: {
          variantsConfig: {
            variants: {},
          },
        },
        nameResponse: "John",
        ...rescheduleProps,
      });

      expect(result).toBe(true);
    });

    it("returns true when lastName field is not found", () => {
      const result = determineReadOnlyForNameField({
        field: {
          variant: "firstAndLastName",
          variantsConfig: {
            variants: {
              firstAndLastName: {
                fields: [{ name: "firstName", required: true }],
              },
            },
          },
        },
        nameResponse: "John",
        ...rescheduleProps,
      });

      expect(result).toBe(true);
    });
  });
});
