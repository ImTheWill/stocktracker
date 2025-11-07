
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts/prompts";
import { sendWelcomeEmail } from "../nodemailer";

export const sendSignUpEmail = inngest.createFunction(
    {id: 'sign-up-email',},
    {event: 'app/user.created'},
    async ({event, step}) =>{
        const userprofile = 
        ` 
        - Country: ${event.data.country}
        - Investment goals: ${event.data.InvestmentGoals}
        - Risk Tolerance: ${event.data.RiskTolerance}
        - Preferred Industry: ${event.data.PreferredIndustry}
        `
        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(`{{userProfile}}`, userprofile)
        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({model: 'gemini-2.5-flash-lite-preview-06-17'}),
            body: {
                contents:[
                    {
                        role: 'user',
                        parts: [
                            {text: prompt}
                        ]
                    }
            ]

            }
        });
        await step.run('send-welcome-email', async ()=>{
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part? part.text : null) || 'Thanks for joining Signalist. '
            //emailsendinglogic
            const {data: { email, name, }} = event;

            return await sendWelcomeEmail({email, name, intro: introText});
        })
        return {
            success:true,
            message: 'welcome email sent sucessfully'
        }
    }
)