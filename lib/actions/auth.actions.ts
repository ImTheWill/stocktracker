'use server';
import {auth} from '@/lib/auth'
import { inngest } from '../inngest/client';

export const signUpWithEmail = async ({email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry}: SignUpFormData) =>{
    try{
        console.log("pre auth.api.signUp"); //////////////////////////////////////
        const response = await auth.api.signUpEmail({
            body: {email: email, password: password, name: fullName}
        })
        if(response){
            await inngest.send(
                {
                    name: 'app/user.created',
                    data: {
                        email,
                        name: fullName,
                        country,
                        investmentGoals,
                        riskTolerance,
                        preferredIndustry
                    }
                }
            )
        }
        return {
            success: true,
            data: response
        }
    }catch(e){
        console.log('SignUp Failed' , e)
        return {
            success: false,
            error: 'Sign up Failed'
        }
    }
}