import { expect, test } from '@playwright/test';
import Ajv from 'ajv';

import { AuthService } from '../../services/AuthService';
import {
  Booking,
  BookingService,
} from '../../services/BookingService';

import {
  bookingResponseSchema,
  bookingSchema,
} from './schemas/booking.schema';

test.describe('Scenario 6 - CRUD chaining and contract validation', () => {
  test('should create, retrieve, update and delete a booking', async ({
    request,
  }) => {
    const authService = new AuthService(request);
    const bookingService = new BookingService(request);

    const token = await authService.authenticateSuccessfully(
      'admin',
      'password123'
    );

    const booking: Booking = {
      firstname: 'Jacinto',
      lastname: 'Automation',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-09-15',
        checkout: '2026-09-20',
      },
      additionalneeds: 'Breakfast',
    };

    // CREATE
    const createResponse =
      await bookingService.createBooking(booking);

    expect(createResponse.status()).toBe(200);

    const createdBody = await createResponse.json();

    const ajv = new Ajv();

    const validateCreate = ajv.compile(
      bookingResponseSchema
    );

    expect(validateCreate(createdBody)).toBe(true);

    const bookingId = createdBody.bookingid;

    expect(bookingId).toEqual(expect.any(Number));

    // GET
    const getResponse =
      await bookingService.getBooking(bookingId);

    expect(getResponse.status()).toBe(200);

    const retrievedBooking = await getResponse.json();

    const validateGet = ajv.compile(bookingSchema);

    expect(validateGet(retrievedBooking)).toBe(true);

    expect(retrievedBooking).toEqual(booking);

    // UPDATE
    const updatedBooking: Booking = {
      ...booking,
      firstname: 'Jacinto Updated',
      totalprice: 200,
    };

    const updateResponse =
      await bookingService.updateBooking(
        bookingId,
        token,
        updatedBooking
      );

    expect(updateResponse.status()).toBe(200);

    const updatedBody = await updateResponse.json();

    expect(validateGet(updatedBody)).toBe(true);
    expect(updatedBody).toEqual(updatedBooking);

    // GET after UPDATE
    const getUpdatedResponse =
      await bookingService.getBooking(bookingId);

    expect(getUpdatedResponse.status()).toBe(200);

    const persistedBooking =
      await getUpdatedResponse.json();

    expect(persistedBooking).toEqual(updatedBooking);

    // DELETE
    const deleteResponse =
      await bookingService.deleteBooking(
        bookingId,
        token
      );

    /*
     * Restful-booker returns 201 for a successful DELETE.
     * This is unusual for DELETE and is intentionally documented
     * as a contract smell in the assessment notes.
     */
    expect(deleteResponse.status()).toBe(201);

    // GET after DELETE
    const getDeletedResponse =
      await bookingService.getBooking(bookingId);

    expect(getDeletedResponse.status()).toBe(404);
  });
});