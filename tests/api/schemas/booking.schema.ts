export const bookingSchema = {
  type: 'object',
  required: [
    'firstname',
    'lastname',
    'totalprice',
    'depositpaid',
    'bookingdates',
  ],
  properties: {
    firstname: {
      type: 'string',
    },
    lastname: {
      type: 'string',
    },
    totalprice: {
      type: 'number',
    },
    depositpaid: {
      type: 'boolean',
    },
    bookingdates: {
      type: 'object',
      required: ['checkin', 'checkout'],
      properties: {
        checkin: {
          type: 'string',
        },
        checkout: {
          type: 'string',
        },
      },
      additionalProperties: false,
    },
    additionalneeds: {
      type: 'string',
    },
  },
  additionalProperties: false,
} as const;

export const bookingResponseSchema = {
  type: 'object',
  required: ['bookingid', 'booking'],
  properties: {
    bookingid: {
      type: 'integer',
    },
    booking: bookingSchema,
  },
  additionalProperties: false,
} as const;