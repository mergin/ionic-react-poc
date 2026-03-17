import { useEffect, useState } from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { LanguageSelector } from '../../components/language-selector';
import { useI18n } from '../../i18n';
import './Tab2Page.css';

interface GalleryImage {
  id: string;
  author: string;
  download_url: string;
}

const GALLERY_URL = '/picsum/v2/list?page=1&limit=12';

const Tab2: React.FC = () => {
  const { t } = useI18n();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    void fetch(GALLERY_URL, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Unable to load images');
        }

        const payload = (await response.json()) as GalleryImage[];
        setImages(payload);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('tabs.tab2')}</IonTitle>
          <IonButtons slot="end">
            <LanguageSelector />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t('tabs.tab2')}</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading ? (
          <IonItem role="status">
            <IonLabel>{t('gallery.loading')}</IonLabel>
          </IonItem>
        ) : null}

        {hasError ? (
          <IonItem role="alert">
            <IonLabel>{t('gallery.loadError')}</IonLabel>
          </IonItem>
        ) : null}

        {!isLoading && !hasError ? (
          <section className="gallery-grid" aria-label={t('gallery.feedAriaLabel')}>
            {images.map(image => (
              <article className="gallery-card" key={image.id}>
                <IonImg
                  src={image.download_url}
                  alt={t('gallery.imageAlt', { author: image.author })}
                />
              </article>
            ))}
          </section>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
