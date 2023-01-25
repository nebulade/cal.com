export type BookingCreateBody = {
  email: string;
  end: string;
  web3Details?: {
    userWallet: string;
    userSignature: unknown;
  };
  eventTypeId: number;
  eventTypeSlug: string;
  guests?: string[];
  location: string;
  name: string;
  notes?: string;
  rescheduleUid?: string;
  recurringEventId?: string;
  start: string;
  timeZone: string;
  user?: string | string[];
  language: string;
  bookingUid?: string;
  customInputs: { label: string; value: string | boolean }[];
  metadata: {
    [key: string]: string;
  };
  hasHashedBookingLink: boolean;
  hashedLink?: string | null;
  smsReminderNumber?: string;
  ethSignature?: string;
};

export type BookingResponse = Awaited<
  ReturnType<Awaited<typeof import("@calcom/features/bookings/lib/handleNewBooking")>["default"]>
>;
