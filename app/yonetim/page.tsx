import {requireChatGPTUser} from '../chatgpt-auth';
import {isEditor} from '../admin-auth';
import Editor from './editor';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/yonetim');if(!await isEditor())return <main className="admin-denied"><h1>Bu alan seçkinin sahibine ait.</h1><a href="/">Kokteyllere dön</a></main>;return <Editor/>}
