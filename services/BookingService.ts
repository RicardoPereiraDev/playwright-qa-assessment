import { APIRequestContext, expect } from '@playwright/test';

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: Booking;
}

export class BookingService {
  constructor(private readonly request: APIRequestContext) {}

  async createBooking(booking: Booking) {
    return this.request.post('/booking', {
      data: booking,
    });
  }

  async getBooking(bookingId: number) {
    return this.request.get(`/booking/${bookingId}`);
  }

  async updateBooking(
    bookingId: number,
    token: string,
    booking: Booking
  ) {
    return this.request.put(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
      data: booking,
    });
  }

  async deleteBooking(
    bookingId: number,
    token: string
  ) {
    return this.request.delete(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  async expectBookingData(
    bookingId: number,
    expectedBooking: Booking
  ): Promise<void> {
    const response = await this.getBooking(bookingId);

    await expect(response).toBeOK();

    const actualBooking = (await response.json()) as Booking;

    expect(actualBooking).toEqual(expectedBooking);
  }
}