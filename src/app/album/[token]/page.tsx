import Image from "next/image";
import { notFound } from "next/navigation";
import { getGuestByToken } from "@/lib/guests";
import { listAlbumPhotos } from "@/app/actions/album";
import { firstName } from "@/lib/utils";
import { Monogram } from "@/components/invitation/monogram";
import { AlbumUploader } from "@/components/invitation/album-uploader";

export const dynamic = "force-dynamic";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  if (!guest) notFound();

  const photos = await listAlbumPhotos(token);

  return (
    <main className="min-h-screen bg-twilight-deep px-6 py-16 text-white">
      <div className="container flex flex-col items-center text-center">
        <Monogram tone="light" />
        <p className="eyebrow mt-8 text-gold-light">Álbum colaborativo</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
          Hola {firstName(guest.name)}, comparte tus fotos
        </h1>
        <p className="mt-3 max-w-lg text-white/70">
          Sube las fotos que tomaste en la celebración para que todos tengamos el
          mismo álbum de recuerdos. 💫
        </p>

        <div className="mt-10 w-full">
          <AlbumUploader token={token} />
        </div>

        {photos.length > 0 && (
          <div className="mt-16 w-full">
            <div className="horizon mb-8" />
            <div className="columns-2 gap-4 sm:columns-3 md:columns-4 [&>*]:mb-4">
              {photos.map((src) => (
                <div key={src} className="overflow-hidden rounded-xl">
                  <Image
                    src={src}
                    alt="Foto del álbum"
                    width={400}
                    height={500}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
