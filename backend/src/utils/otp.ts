import otpGenerator from "otp-generator";

const otpStore=new Map<string,string>();

export const generateOTP=(email:string)=>{
    const otp=otpGenerator.generate(6,{digits:true,upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false});
    otpStore.set(email,otp);
    return otp;
}

export const verifyOTP = (email: string, userOTP: string) => {
    const otp = otpStore.get(email);
    if (otp === userOTP) {
       otpStore.delete(email);
        return true;
        
    } else {
        return false;
    }
}