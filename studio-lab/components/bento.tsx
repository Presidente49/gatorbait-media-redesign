import {ArrowRight} from "lucide-react";
export function Bento({children}:{children:React.ReactNode}){return <div className="bento">{children}</div>}
export function BentoCard({eyebrow,title,children,wide=false}:{eyebrow:string;title:string;children?:React.ReactNode;wide?:boolean}){return <article className={"bentoCard "+(wide?"bentoWide":"")}><div className="bentoShade"/><div className="bentoCopy"><div className="k">{eyebrow}</div><h3>{title}</h3>{children}<span className="bentoCta">Read more <ArrowRight size={15}/></span></div></article>}
