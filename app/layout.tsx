import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Talha Korkmaz — Her yudumun bir karakteri var",description:"Orange Silk'ten Gece Kahvesi'ne, karakteri olan on kokteyl. İyi içki, güzel sohbet.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="tr"><body>{children}</body></html>}
