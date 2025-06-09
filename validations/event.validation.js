import z from 'zod'

const eventSchema=z.object({
    name:z.string().min(1,"Event Name is required"),
    location:z.string().min(1,"location of the event is also required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
    }),
    type:z.enum(['sports','wedding','hiking','office','others'],{
        errorMap:()=>({
            message:"Invalid event type"
        })
    })
})

export const updateEventSchema=eventSchema.partial();
export default eventSchema;