import { db } from "../../../lib/db"
import { event } from "../../../lib/schemas"

import { z } from 'zod'
 
const schema = z.object({
  title: z.string({
    invalid_type_error: 'Invalid title',
  }),
  start: z.date({
    invalid_type_error: 'Invalid start date',
  }),
  end: z.date({
    invalid_type_error: 'Invalid end date',
  }),
  allDay: z.boolean({
    invalid_type_error: "Invalid data allday"
  })
})
 
export async function createCalendarEvent(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        title: formData.get('title'),
        start: formData.get('start'),
        end: formData.get('end'),
        allDay: formData.get('allDay'),
    })
 
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
    await db.insert(event).values({
        allDay: validatedFields.data.allDay,
        start: validatedFields.data.start,
        end: validatedFields.data.end,
        title: validatedFields.data.title,
    })
    
    return {
      message: 'Successfully created event',
    }
  }