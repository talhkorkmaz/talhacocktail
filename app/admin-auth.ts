import {getChatGPTUser} from './chatgpt-auth';
export async function isEditor(){
 const user=await getChatGPTUser();
 if(!user)return false;
 return user.email.toLowerCase()==='talhkorkmaz@gmail.com'||(import.meta.env.DEV&&user.userId==='local_seedy');
}
export function validOrigin(request:Request){const origin=request.headers.get('origin');return !!origin&&origin===new URL(request.url).origin}
