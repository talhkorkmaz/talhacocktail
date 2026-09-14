import Showcase from './showcase';
import {initialMenu,type Cocktail} from './menu-data';
import {database} from '../db/storage';
export const dynamic='force-dynamic';
export default async function Home(){
 try{const row=await database().prepare('SELECT body FROM menu_document WHERE id=?').bind('cocktails').first<{body:string}>();const items:Cocktail[]=row?JSON.parse(row.body):initialMenu;return <Showcase initialItems={items}/>}
 catch(e){console.error('Showcase temporarily unavailable',e);return <main className="empty-menu"><h1>Seçkimiz kısa bir mola verdi.</h1><p>Birazdan yeniden deneyebilirsin.</p><a className="text-link" href="/">Yeniden yükle</a></main>}
}
