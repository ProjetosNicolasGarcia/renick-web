import { useParams } from 'react-router-dom';
import { staticPagesData } from '../data/staticPagesData';

export default function StaticPage() {
  const { slug } = useParams();
  const pageData = staticPagesData[slug];

  // clausula guarda para pagina nao encontrada sem centralizacao excessiva
  if (!pageData) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] w-full px-[16px] md:px-16 py-8 flex flex-col items-start">
        <h1 className="text-[#1E45FB] font-suez font-bold text-[32px] md:text-[48px] uppercase mb-4 text-left">
          Página não encontrada
        </h1>
        <p className="text-[#0A0A0A] font-poppins text-[16px] text-left">
          O conteúdo que você está procurando não existe.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] w-full px-[16px] md:px-16 py-8 md:py-12">
      <article className="w-full max-w-6xl mx-auto text-left">
        <h1 className="text-[#1E45FB] font-suez font-bold text-[32px] md:text-[48px] uppercase mb-8">
          {pageData.title}
        </h1>
        
        {/* injecao de classes seguindo os design tokens e tipografia globais sem estilos de hover */}
        <div 
          className="
            w-full font-poppins text-[#0A0A0A] text-[16px] leading-relaxed
            [&>h2]:font-bold [&>h2]:text-[20px] [&>h2]:md:text-[24px] [&>h2]:uppercase [&>h2]:text-[#0A0A0A] [&>h2]:mb-4 [&>h2]:mt-8
            [&>h3]:font-bold [&>h3]:text-[20px] [&>h3]:uppercase [&>h3]:text-[#0A0A0A] [&>h3]:mb-3 [&>h3]:mt-6
            [&>p]:mb-4 [&>p]:text-[#0A0A0A]
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4
            [&>strong]:font-bold
            [&>a]:text-[#0A0A0A]/25 [&>a]:underline
          "
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </article>
    </main>
  );
}